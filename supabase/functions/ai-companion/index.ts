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
    const { type, stressLevel, userId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    if (type === "motivation") {
      const stressDescription =
        stressLevel < 0.3
          ? "low"
          : stressLevel < 0.6
          ? "moderate"
          : "elevated";

      systemPrompt = `You are MindGuard AI, a calm, warm, and supportive mental health companion. You are NOT a therapist or doctor. You provide supportive, non-diagnostic messages.

Current user stress level: ${stressDescription} (${Math.round(stressLevel * 100)}%)

Generate a single short motivational message (2-3 sentences max) that is:
- Warm and human, not robotic
- Encouraging without being dismissive of stress
- Adapted to the current stress level
- Uses normalization, reassurance, or encouragement
- Never diagnostic or clinical
- Never references specific medical conditions

For low stress: Affirm their calm state and encourage positive habits.
For moderate stress: Gently acknowledge stress and suggest mindfulness.
For elevated stress: Be especially warm, validate their feelings, and remind them it's okay to take a break.

Respond ONLY with the motivational message, nothing else.`;
    } else if (type === "intervention") {
      systemPrompt = `You are MindGuard AI. Recommend the single best intervention for the user based on their stress level of ${Math.round(stressLevel * 100)}%.

Options: breathing, grounding, break, motivation

Respond with ONLY one word: the intervention type.`;
    }

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
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                type === "motivation"
                  ? "Generate a supportive message for me right now."
                  : `My stress level is ${Math.round(stressLevel * 100)}%. What should I do?`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly.", message: "Take a deep breath. You're doing great." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached.", message: "Every moment of awareness is a step forward." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ message: "You're doing your best — that's always enough." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content?.trim() || "You're doing your best — that's always enough.";

    return new Response(
      JSON.stringify({ message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-companion error:", e);
    return new Response(
      JSON.stringify({ message: "Remember: every step forward matters, no matter how small." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
