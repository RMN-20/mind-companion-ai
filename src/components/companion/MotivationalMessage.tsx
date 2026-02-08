import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLatestStress } from "@/hooks/useStressData";

export function MotivationalMessage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { data: latestStress } = useLatestStress();

  const fetchMessage = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-companion", {
        body: {
          type: "motivation",
          stressLevel: latestStress?.overall_stress ?? 0,
          userId: user.id,
        },
      });
      if (error) throw error;
      setMessage(data?.message || "You're doing your best, and that's more than enough. Take a moment to breathe.");
    } catch {
      setMessage("Remember: every moment of awareness is a step toward wellness. You're not alone in this.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
    const interval = setInterval(fetchMessage, 120000); // refresh every 2 min
    return () => clearInterval(interval);
  }, [user, latestStress?.overall_stress]);

  return (
    <Card className="gradient-card border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-lavender-light flex items-center justify-center">
            <Heart className="h-4 w-4 text-lavender" />
          </div>
          <CardTitle className="font-display text-base">AI Motivation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 py-4"
            >
              <div className="h-2 w-2 rounded-full bg-primary/40 pulse-calm" />
              <span className="text-sm text-muted-foreground">Generating supportive message...</span>
            </motion.div>
          ) : (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-foreground leading-relaxed py-2 italic"
            >
              "{message}"
            </motion.p>
          )}
        </AnimatePresence>
        <button
          onClick={fetchMessage}
          disabled={loading}
          className="text-xs text-primary hover:underline mt-2"
        >
          Get new message
        </button>
      </CardContent>
    </Card>
  );
}
