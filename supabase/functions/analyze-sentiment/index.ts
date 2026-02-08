import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ sentiment: "neutral", score: 0.5 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a sentiment analysis tool. Analyze the emotional sentiment of the user's text. Respond with ONLY valid JSON in this exact format: {"sentiment": "positive|negative|neutral|mixed", "score": 0.0-1.0}

Score guide: 0.0 = very negative, 0.5 = neutral, 1.0 = very positive.
Do not include any other text.`,
            },
            { role: "user", content: text },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Sentiment analysis error:", response.status, errText);
      return new Response(
        JSON.stringify({ sentiment: "neutral", score: 0.5 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '{"sentiment":"neutral","score":0.5}';

    try {
      const parsed = JSON.parse(content);
      return new Response(
        JSON.stringify({
          sentiment: parsed.sentiment || "neutral",
          score: typeof parsed.score === "number" ? parsed.score : 0.5,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      return new Response(
        JSON.stringify({ sentiment: "neutral", score: 0.5 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    console.error("analyze-sentiment error:", e);
    return new Response(
      JSON.stringify({ sentiment: "neutral", score: 0.5, error: String(e) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
