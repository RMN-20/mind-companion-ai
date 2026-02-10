import { Keyboard, Mic, Moon } from "lucide-react";
import { useState, useEffect } from "react";

import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { StressGauge } from "@/components/dashboard/StressGauge";
import { RecentActions } from "@/components/dashboard/RecentActions";
import { SleepEntryForm } from "@/components/dashboard/SleepEntryForm";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useTypingStress } from "@/hooks/useTypingStress";
import {
  useInterventions,
  useSleepEntries,
  useAddStressReading,
} from "@/hooks/useStressData";

import { computeSleepStress } from "@/utils/sleepStress";
import { computeChatStress } from "@/utils/chatStress";
import type { SleepQuality, BedtimeConsistency } from "@/types/sleep";

import { useVoiceStress } from "@/hooks/useVoiceStress";
import { runAgent, applyFeedback } from "@/agent/agent";
import { useAgent } from "@/agent/AgentContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { updateAgent } = useAgent();

  const { metrics } = useTypingStress();
  const { data: interventions } = useInterventions();
  const { data: sleepEntries } = useSleepEntries();
  const addStressReading = useAddStressReading();

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

  useEffect(() => {
    updateAgent(
      agentResult.status,
      overallStress,
      agentResult.action,
      agentResult.message
    );
  }, [agentResult, overallStress, updateAgent]);

  /* -------------------- SUBMIT STRESS -------------------- */
  const handleSubmitStress = () => {
    addStressReading.mutate(
      {
        typing_stress: metrics.stressScore,
        voice_stress: voiceStress,
        sleep_stress: sleepStress,
        overall_stress: overallStress,
        typing_speed: metrics.speed,
        typing_error_rate: metrics.errorRate,
        typing_pause_pattern: metrics.pausePattern,
      },
      {
        onSuccess: () => {
          toast.success("Stress snapshot saved successfully");
        },
        onError: () => {
          toast.error("Failed to save stress data");
        },
      }
    );
  };

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

      {/* Agent Status */}
      <StatusBanner
        status={agentResult.status}
        message={agentResult.message}
      />

      {/* Signal Cards */}
      <div className="grid md:grid-cols-3 gap-4">
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
        />

        <Card className="border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-medium">Typing Activity</h2>
            <textarea className="w-full min-h-[120px] border p-3" />
          </CardContent>
        </Card>

        <Card className="border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-medium">Emotional Reflection</h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full min-h-[100px] border p-3"
            />
          </CardContent>
        </Card>

        <Card className="border bg-background/80">
          <CardContent className="p-4 space-y-3">
            <h2 className="flex items-center gap-2 font-medium">
              <Mic className={isRecording ? "text-red-500 animate-pulse" : ""} />
              Voice Check-in
            </h2>
            <div className="flex gap-2">
              <button onClick={startRecording} disabled={isRecording}>
                Start
              </button>
              <button onClick={stopRecording} disabled={!isRecording}>
                Stop
              </button>
              {isRecording && <span>Recording… {duration}s</span>}
            </div>
            {!isRecording && duration > 0 && (
              <p>Voice Stress: {Math.round(voiceStress * 100)}%</p>
            )}
          </CardContent>
        </Card>

        <SignalCard
          title="Sleep Quality"
          icon={Moon}
          value={latestSleep ? `${latestSleep.hours_slept}h` : "—"}
          subtitle="Sleep data"
          stressLevel={sleepStress}
          details={[]}
          colorClass="bg-primary/60"
        />
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StressGauge
            overallStress={overallStress}
            typingStress={metrics.stressScore}
            voiceStress={voiceStress}
            sleepStress={sleepStress}
          />

          {/* ✅ SUBMIT BUTTON */}
          <Button
            onClick={handleSubmitStress}
            disabled={addStressReading.isPending}
            className="w-full"
          >
            {addStressReading.isPending ? "Saving…" : "Submit Stress Snapshot"}
          </Button>

          {/* RL Feedback */}
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
