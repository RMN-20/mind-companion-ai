import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StressGaugeProps {
  overallStress: number; // 0-1
  typingStress: number;
  voiceStress: number;
  sleepStress: number;
}

function getLabel(level: number) {
  if (level < 0.2) return { text: "Relaxed", color: "text-calm" };
  if (level < 0.4) return { text: "Mild", color: "text-calm" };
  if (level < 0.6) return { text: "Moderate", color: "text-warning-amber" };
  if (level < 0.8) return { text: "Elevated", color: "text-stress-red" };
  return { text: "High", color: "text-stress-red" };
}

export function StressGauge({ overallStress, typingStress, voiceStress, sleepStress }: StressGaugeProps) {
  const label = getLabel(overallStress);
  const percentage = Math.round(overallStress * 100);

  return (
    <Card className="gradient-card border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base">Overall Stress Level</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular gauge */}
          <div className="relative h-28 w-28 flex-shrink-0">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke={overallStress < 0.4 ? "hsl(var(--calm-green))" : overallStress < 0.7 ? "hsl(var(--warning-amber))" : "hsl(var(--stress-red))"}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - overallStress) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-display">{percentage}%</span>
              <span className={`text-xs font-medium ${label.color}`}>{label.text}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            {[
              { label: "Typing", value: typingStress },
              { label: "Voice", value: voiceStress },
              { label: "Sleep", value: sleepStress },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{Math.round(s.value * 100)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${s.value < 0.4 ? "bg-calm" : s.value < 0.7 ? "bg-warning-amber" : "bg-stress-red"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(s.value * 100, 2)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
