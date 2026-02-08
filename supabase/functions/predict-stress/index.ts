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
    const { typingStress, voiceStress, sleepStress } = await req.json();

    // Fusion algorithm: weighted average with dynamic weights
    const typingWeight = 0.35;
    const voiceWeight = 0.30;
    const sleepWeight = 0.35;

    const t = typeof typingStress === "number" ? Math.max(0, Math.min(1, typingStress)) : 0;
    const v = typeof voiceStress === "number" ? Math.max(0, Math.min(1, voiceStress)) : 0;
    const s = typeof sleepStress === "number" ? Math.max(0, Math.min(1, sleepStress)) : 0;

    // If any signal is missing (0), redistribute its weight
    let totalWeight = 0;
    let weightedSum = 0;

    if (t > 0) { weightedSum += t * typingWeight; totalWeight += typingWeight; }
    if (v > 0) { weightedSum += v * voiceWeight; totalWeight += voiceWeight; }
    if (s > 0) { weightedSum += s * sleepWeight; totalWeight += sleepWeight; }

    const overallStress = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return new Response(
      JSON.stringify({
        overall_stress: Math.round(overallStress * 100) / 100,
        typing_stress: t,
        voice_stress: v,
        sleep_stress: s,
        weights: { typing: typingWeight, voice: voiceWeight, sleep: sleepWeight },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("predict-stress error:", e);
    return new Response(
      JSON.stringify({ overall_stress: 0, error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
