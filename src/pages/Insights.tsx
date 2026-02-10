import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useStressReadings,
  useStrategyScores,
  useFeedbackHistory,
} from "../hooks/useStressData";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Brain, Clock } from "lucide-react";

export default function Insights() {
  const { data: readings } = useStressReadings();
  const { data: strategyScores } = useStrategyScores();
  const { data: feedbackHistory } = useFeedbackHistory();

  /* -------------------- STRESS TREND DATA -------------------- */
  const chartData = (readings ?? [])
    .slice(0, 30)
    .reverse()
    .map((r) => ({
      date: new Date(r.created_at).toLocaleDateString(),
      overall: Math.round((r.overall_stress ?? 0) * 100),
      typing: Math.round((r.typing_stress ?? 0) * 100),
      voice: Math.round((r.voice_stress ?? 0) * 100),
      sleep: Math.round((r.sleep_stress ?? 0) * 100),
    }));

  /* -------------------- BEST STRATEGY -------------------- */
  const bestStrategy =
    strategyScores && strategyScores.length > 0
      ? [...strategyScores].sort(
          (a, b) => b.effectiveness_score - a.effectiveness_score
        )[0]
      : null;

  /* -------------------- LEARNING TIMELINE -------------------- */
  const learningEntries = (feedbackHistory ?? []).slice(0, 10).map((f) => ({
    date: new Date(f.created_at).toLocaleDateString(),
    action:
      f.feedback_type === "helpful"
        ? "✅ Positive feedback"
        : f.feedback_type === "not_helpful"
        ? "❌ Negative feedback"
        : "😐 Neutral feedback",
    title: f.interventions?.title ?? "Intervention",
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Insights & Learning
          </h1>
          <p className="text-sm text-muted-foreground">
            How the AI adapts to support you better
          </p>
        </div>
      </div>

      {/* -------------------- STRESS TRENDS -------------------- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="font-display">Stress Trends</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke="hsl(258,45%,65%)"
                    fill="hsl(258,45%,65%)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No stress data yet. Use the dashboard to generate readings.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* -------------------- AI LEARNING SUMMARY -------------------- */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-base">
                AI Learning Summary
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground">📊 Data Observed</p>
              <p className="text-muted-foreground">
                {(readings?.length ?? 0) > 0
                  ? `${readings!.length} stress readings analyzed`
                  : "No data collected yet"}
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">🎯 Preferred Strategy</p>
              <p className="text-muted-foreground">
                {bestStrategy
                  ? `${bestStrategy.strategy_type} (${Math.round(
                      bestStrategy.effectiveness_score * 100
                    )}% effective)`
                  : "Still learning your preferences"}
              </p>
            </div>

            <div>
              <p className="font-medium text-foreground">💬 Feedback Count</p>
              <p className="text-muted-foreground">
                {feedbackHistory?.length ?? 0} feedback signals received
              </p>
            </div>
          </CardContent>
        </Card>

        {/* -------------------- LEARNING TIMELINE -------------------- */}
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-base">
                Learning Timeline
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {learningEntries.length > 0 ? (
              <div className="space-y-3">
                {learningEntries.map((e, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-xs text-muted-foreground">
                      {e.date}
                    </span>
                    <p className="text-foreground">
                      {e.action} — {e.title}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                Feedback activity will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
