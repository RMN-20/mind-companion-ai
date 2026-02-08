import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackWidget } from "@/components/companion/FeedbackWidget";
import { BreathingExercise } from "@/components/companion/BreathingExercise";
import { GroundingTechnique } from "@/components/companion/GroundingTechnique";
import { MotivationalMessage } from "@/components/companion/MotivationalMessage";
import { ReflectionInput } from "@/components/companion/ReflectionInput";
import { useInterventions, useAddIntervention, useAddFeedback, useLatestStress, useStrategyScores } from "@/hooks/useStressData";
import { useAuth } from "@/hooks/useAuth";
import { useTypingStress } from "@/hooks/useTypingStress";
import { supabase } from "@/integrations/supabase/client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const interventionTypes = [
  { type: "breathing", title: "Breathing Exercise", content: "4-4-6-2 breathing pattern to calm your nervous system" },
  { type: "grounding", title: "Grounding Technique", content: "5-4-3-2-1 sensory grounding to anchor you in the present" },
  { type: "break", title: "Take a Break", content: "Step away for 5 minutes — your mind needs rest to perform" },
  { type: "motivation", title: "Encouragement", content: "A personalized message of support" },
];

export default function Companion() {
  const { user } = useAuth();
  const { metrics } = useTypingStress();
  const { data: latestStress } = useLatestStress();
  const { data: interventions } = useInterventions();
  const { data: strategyScores } = useStrategyScores();
  const addIntervention = useAddIntervention();
  const addFeedback = useAddFeedback();
  const [currentIntervention, setCurrentIntervention] = useState<any>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, string>>({});

  // Autonomous intervention logic: triggers when stress is detected
  const triggerIntervention = useCallback(async () => {
    if (!user) return;

    const overallStress = latestStress?.overall_stress ?? metrics.stressScore;
    if (overallStress < 0.3) return; // Low stress, no intervention needed

    // Pick best strategy based on scores
    let bestType = "breathing";
    if (strategyScores && strategyScores.length > 0) {
      const sorted = [...strategyScores].sort((a, b) => b.effectiveness_score - a.effectiveness_score);
      bestType = sorted[0].strategy_type;
    }

    const intervention = interventionTypes.find(i => i.type === bestType) || interventionTypes[0];

    // Check if we already have a recent intervention of this type
    if (interventions && interventions.length > 0) {
      const latest = interventions[0];
      const timeSince = Date.now() - new Date(latest.created_at).getTime();
      if (timeSince < 300000) return; // Don't intervene more than once per 5 min
    }

    try {
      const data = await addIntervention.mutateAsync({
        type: intervention.type,
        title: intervention.title,
        content: intervention.content,
        trigger_stress_level: overallStress,
      });
      setCurrentIntervention(data);
    } catch {
      // Silently fail
    }
  }, [user, latestStress, metrics.stressScore, strategyScores, interventions]);

  useEffect(() => {
    const timer = setInterval(triggerIntervention, 30000);
    triggerIntervention(); // Check immediately
    return () => clearInterval(timer);
  }, [triggerIntervention]);

  const handleFeedback = async (interventionId: string, feedbackType: string) => {
    try {
      await addFeedback.mutateAsync({ intervention_id: interventionId, feedback_type: feedbackType });
      setFeedbackGiven(prev => ({ ...prev, [interventionId]: feedbackType }));

      // Update strategy scores
      const intervention = interventions?.find(i => i.id === interventionId) || currentIntervention;
      if (intervention) {
        const isPositive = ["helpful", "tried"].includes(feedbackType);
        const isNegative = feedbackType === "not_helpful";
        
        await supabase
          .from("strategy_scores")
          .update({
            total_uses: (strategyScores?.find(s => s.strategy_type === intervention.type)?.total_uses ?? 0) + 1,
            positive_feedback: (strategyScores?.find(s => s.strategy_type === intervention.type)?.positive_feedback ?? 0) + (isPositive ? 1 : 0),
            negative_feedback: (strategyScores?.find(s => s.strategy_type === intervention.type)?.negative_feedback ?? 0) + (isNegative ? 1 : 0),
            effectiveness_score: isPositive ? Math.min(1, (strategyScores?.find(s => s.strategy_type === intervention.type)?.effectiveness_score ?? 0.5) + 0.05)
              : isNegative ? Math.max(0, (strategyScores?.find(s => s.strategy_type === intervention.type)?.effectiveness_score ?? 0.5) - 0.1)
              : (strategyScores?.find(s => s.strategy_type === intervention.type)?.effectiveness_score ?? 0.5),
          })
          .eq("user_id", user!.id)
          .eq("strategy_type", intervention.type);
      }

      toast.success("Feedback recorded — the AI will learn from this");
    } catch {
      toast.error("Failed to save feedback");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">AI Companion</h1>
          <p className="text-sm text-muted-foreground">Autonomous support — no request needed</p>
        </div>
      </div>

      {/* Active Intervention Banner */}
      {currentIntervention && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-lavender-light/60 border border-lavender/20 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-lavender" />
            <span className="font-display font-semibold text-sm text-foreground">Active Intervention</span>
          </div>
          <p className="text-sm text-foreground mb-1 font-medium">{currentIntervention.title}</p>
          <p className="text-xs text-muted-foreground mb-4">{currentIntervention.content}</p>
          <FeedbackWidget
            onFeedback={(type) => handleFeedback(currentIntervention.id, type)}
            selectedType={feedbackGiven[currentIntervention.id]}
          />
        </motion.div>
      )}

      {!currentIntervention && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl bg-calm-light/60 border border-calm/20 p-5 text-center"
        >
          <Brain className="h-8 w-8 text-calm mx-auto mb-2" />
          <p className="font-display font-semibold text-foreground mb-1">All Clear</p>
          <p className="text-sm text-muted-foreground">
            No intervention needed right now. The AI is monitoring your signals.
          </p>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <BreathingExercise />
        <GroundingTechnique />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <MotivationalMessage />
        <ReflectionInput />
      </div>

      {/* Past Interventions with Feedback */}
      {interventions && interventions.length > 0 && (
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display text-base">Past Interventions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interventions.slice(0, 5).map((intervention) => (
              <div key={intervention.id} className="p-3 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{intervention.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(intervention.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{intervention.content}</p>
                <FeedbackWidget
                  onFeedback={(type) => handleFeedback(intervention.id, type)}
                  selectedType={feedbackGiven[intervention.id]}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
