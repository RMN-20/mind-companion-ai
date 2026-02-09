import { Keyboard, Mic, Moon } from "lucide-react";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { StressGauge } from "@/components/dashboard/StressGauge";
import { RecentActions } from "@/components/dashboard/RecentActions";
import { SleepEntryForm } from "@/components/dashboard/SleepEntryForm";
import { useTypingStress } from "@/hooks/useTypingStress";
import { useInterventions, useSleepEntries } from "@/hooks/useStressData";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { computeSleepStress } from "@/utils/sleepStress";
import type { SleepQuality, BedtimeConsistency } from "@/types/sleep";
import { computeChatStress } from "@/utils/chatStress";
import { useState } from "react";
import { useVoiceStress } from "@/hooks/useVoiceStress";
import { runAgent, applyFeedback } from "@/agent/agent";
import { useAgent } from "@/agent/AgentContext";

export default function Dashboard() {
  const { updateAgent } = useAgent();

  const { metrics } = useTypingStress();
  const { data: interventions } = useInterventions();
  const { data: sleepEntries } = useSleepEntries();

  /* -------------------- CHAT -------------------- */
  const [reflection, setReflection] = useState("");
  const chatStress = computeChatStress(reflection);

  /* -------------------- VOICE -------------------- */
  const {
    voiceStress,
    isRecording,
    duration,
    startRecording,
    stopRecording,
  } = useVoiceStress();

  /* -------------------- SLEEP -------------------- */
  const latestSleep = sleepEntries?.[0];
  const sleepStress = latestSleep
    ? computeSleepStress(
        latestSleep.hours_slept,
        latestSleep.sleep_quality as SleepQuality,
        latestSleep.bedtime_consistency as BedtimeConsistency
      )
    : 0;

  /* -------------------- FUSION -------------------- */
  const overallStress = Math.min(
    metrics.stressScore * 0.35 +
      sleepStress * 0.25 +
      voiceStress * 0.25 +
      chatStress * 0.15,
    1
  );

  /* -------------------- AGENT -------------------- */
  const agentResult = runAgent(overallStress);
  import { useEffect } from "react";

useEffect(() => {
  updateAgent(
    agentResult.status,
    overallStress,
    agentResult.action,
    agentResult.message
  );
}, [agentResult, overallStress, updateAgent]);


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Live Monitoring Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time stress signal dashboard
          </p>
        </div>
      </div>

      {/* Status */}
      <StatusBanner
        status={agentResult.status}
        message={agentResult.message}
      />

      {/* Signal Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Typing Stress */}
        <SignalCard
          title="Typing Stress"
          icon={Keyboard}
          value={`${metrics.speed} CPM`}
          subtitle="Characters per minute"
          stressLevel={metrics.stressScore}
          details={[
            { label: "Error Rate", value: `${Math.round(metrics.errorRate * 100)}%` },
            { label: "Avg Pause", value: `${metrics.pausePattern}ms` },
            { label: "Stress Score", value: `${Math.round(metrics.stressScore * 100)}%` },
          ]}
          colorClass="bg-primary/80"
          delay={0.1}
        />

        {/* Typing Activity */}
        <Card className="border border-border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-medium text-foreground">Typing Activity</h2>
            <p className="text-sm text-muted-foreground">
              Type naturally below. Your typing patterns are analyzed automatically.
            </p>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Start typing here…"
            />
          </CardContent>
        </Card>

        {/* Emotional Reflection */}
        <Card className="border border-border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-medium text-foreground">Emotional Reflection</h2>
            <p className="text-sm text-muted-foreground">
              Optional reflection to help assess emotional stress.
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="I feel overwhelmed with deadlines…"
            />
          </CardContent>
        </Card>

        {/* Voice Check-in */}
        <Card className="border border-border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-medium text-foreground flex items-center gap-2">
              <Mic className={isRecording ? "text-red-500 animate-pulse" : ""} />
              Voice Check-in
            </h2>

            <p className="text-sm text-muted-foreground">
              Speak naturally for a few seconds.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
              >
                Start Recording
              </button>

              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
              >
                Stop
              </button>

              {isRecording && (
                <span className="text-sm text-red-500">
                  ● Recording… {duration}s
                </span>
              )}
            </div>

            {!isRecording && duration > 0 && (
              <p className="text-xs text-muted-foreground">
                Voice Stress Detected: {Math.round(voiceStress * 100)}%
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sleep */}
        <SignalCard
          title="Sleep Quality"
          icon={Moon}
          value={latestSleep ? `${latestSleep.hours_slept}h` : "—"}
          subtitle={
            latestSleep
              ? `Quality: ${latestSleep.sleep_quality}`
              : "No sleep data logged"
          }
          stressLevel={sleepStress}
          details={[
            { label: "Quality", value: latestSleep?.sleep_quality ?? "—" },
            { label: "Consistency", value: latestSleep?.bedtime_consistency ?? "—" },
            { label: "Hours", value: latestSleep ? `${latestSleep.hours_slept}h` : "—" },
          ]}
          colorClass="bg-primary/60"
          delay={0.3}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StressGauge
            overallStress={overallStress}
            typingStress={metrics.stressScore}
            voiceStress={voiceStress}
            sleepStress={sleepStress}
          />

          {/* RL Feedback Buttons */}
          {agentResult.status === "intervening" && agentResult.action && (
            <div className="flex gap-2">
              <button onClick={() => applyFeedback(agentResult.action, "helpful")}>
                👍 Helpful
              </button>
              <button onClick={() => applyFeedback(agentResult.action, "neutral")}>
                😐 Neutral
              </button>
              <button onClick={() => applyFeedback(agentResult.action, "unhelpful")}>
                👎 Not helpful
              </button>
            </div>
          )}

          <RecentActions interventions={interventions ?? []} />
        </div>

        <SleepEntryForm />
      </div>
    </div>
  );
}
