import { Keyboard, Mic, Moon } from "lucide-react";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { StressGauge } from "@/components/dashboard/StressGauge";
import { RecentActions } from "@/components/dashboard/RecentActions";
import { SleepEntryForm } from "@/components/dashboard/SleepEntryForm";
import { useTypingStress } from "@/hooks/useTypingStress";
import { useLatestStress, useInterventions, useSleepEntries } from "@/hooks/useStressData";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { metrics } = useTypingStress();
  const { data: latestStress } = useLatestStress();
  const { data: interventions } = useInterventions();
  const { data: sleepEntries } = useSleepEntries();

  const latestSleep = sleepEntries?.[0];
  const voiceStress = latestStress?.voice_stress ?? 0;
  const sleepStress = latestStress?.sleep_stress ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Live Monitoring Center</h1>
          <p className="text-sm text-muted-foreground">Real-time stress signal dashboard</p>
        </div>
      </div>

      <StatusBanner />

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
          delay={0.1}
        />
        <SignalCard
          title="Voice Stress"
          icon={Mic}
          value={voiceStress > 0 ? `${Math.round(voiceStress * 100)}%` : "—"}
          subtitle={voiceStress > 0 ? "Last voice analysis" : "No voice data yet"}
          stressLevel={voiceStress}
          details={[
            { label: "Emotion", value: voiceStress < 0.3 ? "Calm" : voiceStress < 0.6 ? "Tense" : "Fatigued" },
            { label: "Last Analysis", value: latestStress ? "Recent" : "None" },
            { label: "Signal", value: voiceStress > 0 ? "Active" : "Inactive" },
          ]}
          colorClass="bg-sky"
          delay={0.2}
        />
        <SignalCard
          title="Sleep Quality"
          icon={Moon}
          value={latestSleep ? `${latestSleep.hours_slept}h` : "—"}
          subtitle={latestSleep ? `Quality: ${latestSleep.sleep_quality}` : "No sleep data logged"}
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

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <StressGauge
            overallStress={latestStress?.overall_stress ?? 0}
            typingStress={metrics.stressScore}
            voiceStress={voiceStress}
            sleepStress={sleepStress}
          />
          <RecentActions interventions={interventions ?? []} />
        </div>
        <SleepEntryForm />
      </div>
    </div>
  );
}
