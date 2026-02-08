import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useStressReadings, useStrategyScores, useFeedbackHistory } from "@/hooks/useStressData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Target, Brain, Clock } from "lucide-react";

export default function Insights() {
  const { data: readings } = useStressReadings();
  const { data: strategyScores } = useStrategyScores();
  const { data: feedbackHistory } = useFeedbackHistory();

  // Prepare chart data — reverse for chronological order
  const chartData = (readings ?? []).slice(0, 30).reverse().map((r, i) => ({
    index: i + 1,
    typing: Math.round((r.typing_stress ?? 0) * 100),
    voice: Math.round((r.voice_stress ?? 0) * 100),
    sleep: Math.round((r.sleep_stress ?? 0) * 100),
    overall: Math.round((r.overall_stress ?? 0) * 100),
    date: new Date(r.created_at).toLocaleDateString(),
  }));

  const strategyData = (strategyScores ?? []).map((s) => ({
    name: s.strategy_type.charAt(0).toUpperCase() + s.strategy_type.slice(1),
    effectiveness: Math.round(s.effectiveness_score * 100),
    uses: s.total_uses,
    positive: s.positive_feedback,
    negative: s.negative_feedback,
  }));

  const barColors = ["hsl(258, 45%, 65%)", "hsl(210, 50%, 70%)", "hsl(160, 35%, 60%)", "hsl(38, 40%, 70%)"];

  // Build learning timeline from feedback
  const learningEntries = (feedbackHistory ?? []).slice(0, 10).map((f: any) => ({
    date: new Date(f.created_at).toLocaleDateString(),
    action: `${f.feedback_type === "helpful" ? "✅ Positive" : f.feedback_type === "not_helpful" ? "❌ Negative" : "📝 " + f.feedback_type} feedback on "${f.interventions?.title || "intervention"}"`,
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Insights & Learning</h1>
          <p className="text-sm text-muted-foreground">How the AI adapts to support you better</p>
        </div>
      </div>

      {/* Stress Trends */}
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
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="overall" stroke="hsl(258, 45%, 65%)" fill="hsl(258, 45%, 65%)" fillOpacity={0.15} strokeWidth={2} name="Overall" />
                  <Area type="monotone" dataKey="typing" stroke="hsl(210, 50%, 70%)" fill="hsl(210, 50%, 70%)" fillOpacity={0.1} strokeWidth={1.5} name="Typing" />
                  <Area type="monotone" dataKey="voice" stroke="hsl(160, 35%, 60%)" fill="hsl(160, 35%, 60%)" fillOpacity={0.1} strokeWidth={1.5} name="Voice" />
                  <Area type="monotone" dataKey="sleep" stroke="hsl(38, 40%, 70%)" fill="hsl(38, 40%, 70%)" fillOpacity={0.1} strokeWidth={1.5} name="Sleep" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No stress data yet. Use the app to generate readings.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Strategy Effectiveness */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="gradient-card border-border/40 shadow-sm h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-base">Strategy Effectiveness</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {strategyData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={strategyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="effectiveness" name="Effectiveness %" radius={[4, 4, 0, 0]}>
                        {strategyData.map((_, i) => (
                          <Cell key={i} fill={barColors[i % barColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {strategyData.map((s) => (
                      <div key={s.name} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{s.name}</span>
                        <span className="font-medium">
                          {s.uses} uses · 👍 {s.positive} · 👎 {s.negative}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">Strategy data will appear after you provide feedback.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Memory Visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="gradient-card border-border/40 shadow-sm h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-base">Agent Memory</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-lavender-light/50 p-3">
                  <p className="text-xs font-medium text-foreground mb-1">📊 Patterns Observed</p>
                  <p className="text-xs text-muted-foreground">
                    {(readings?.length ?? 0) > 0
                      ? `${readings!.length} stress readings analyzed`
                      : "No patterns observed yet"}
                  </p>
                </div>
                <div className="rounded-lg bg-sky-light/50 p-3">
                  <p className="text-xs font-medium text-foreground mb-1">🎯 Preferred Strategy</p>
                  <p className="text-xs text-muted-foreground">
                    {strategyScores && strategyScores.length > 0
                      ? `${[...strategyScores].sort((a, b) => b.effectiveness_score - a.effectiveness_score)[0].strategy_type} (${Math.round([...strategyScores].sort((a, b) => b.effectiveness_score - a.effectiveness_score)[0].effectiveness_score * 100)}% effective)`
                      : "Learning your preferences..."}
                  </p>
                </div>
                <div className="rounded-lg bg-calm-light/50 p-3">
                  <p className="text-xs font-medium text-foreground mb-1">💬 Feedback Received</p>
                  <p className="text-xs text-muted-foreground">
                    {(feedbackHistory?.length ?? 0) > 0
                      ? `${feedbackHistory!.length} feedback signals collected`
                      : "No feedback yet — rate interventions to help the AI learn"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="font-display text-base">Learning Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {learningEntries.length > 0 ? (
              <div className="space-y-3">
                {learningEntries.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                      <p className="text-sm text-foreground">{entry.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                The learning timeline will show how the AI adapts as you provide feedback.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
