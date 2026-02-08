import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SignalCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  subtitle: string;
  stressLevel: number; // 0-1
  details: { label: string; value: string | number }[];
  colorClass: string;
  delay?: number;
}

function getStressColor(level: number) {
  if (level < 0.3) return "bg-calm";
  if (level < 0.6) return "bg-warning-amber";
  return "bg-stress-red";
}

function getStressLabel(level: number) {
  if (level < 0.3) return "Low";
  if (level < 0.6) return "Moderate";
  return "Elevated";
}

export function SignalCard({ title, icon: Icon, value, subtitle, stressLevel, details, colorClass, delay = 0 }: SignalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="gradient-card border-border/40 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                <Icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <CardTitle className="font-display text-base">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${getStressColor(stressLevel)}`} />
              <span className="text-xs font-medium text-muted-foreground">{getStressLabel(stressLevel)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <p className="text-2xl font-bold font-display text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          {/* Stress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted mb-4">
            <motion.div
              className={`h-full rounded-full ${getStressColor(stressLevel)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(stressLevel * 100, 3)}%` }}
              transition={{ delay: delay + 0.3, duration: 0.6 }}
            />
          </div>
          <div className="space-y-1.5">
            {details.map((d) => (
              <div key={d.label} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
