import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Shield, Eye, Trash2, PauseCircle, AlertTriangle, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Privacy() {
  const { user } = useAuth();
  const [monitoring, setMonitoring] = useState(true);
  const [clearing, setClearing] = useState(false);

  const handleToggleMonitoring = async () => {
    if (!user) return;
    const newValue = !monitoring;
    setMonitoring(newValue);

    try {
      await supabase
        .from("profiles")
        .update({ monitoring_enabled: newValue })
        .eq("user_id", user.id);
      toast.success(newValue ? "Monitoring resumed" : "Monitoring paused");
    } catch {
      setMonitoring(!newValue);
      toast.error("Failed to update preference");
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    setClearing(true);

    try {
      await supabase.from("stress_readings").delete().eq("user_id", user.id);
      await supabase.from("reflections").delete().eq("user_id", user.id);
      await supabase.from("feedback").delete().eq("user_id", user.id);
      await supabase.from("interventions").delete().eq("user_id", user.id);
      toast.success("All history cleared");
    } catch {
      toast.error("Failed to clear history");
    } finally {
      setClearing(false);
    }
  };

  const dataCollected = [
    { what: "Typing patterns", why: "To detect stress from speed, errors, and pauses", stored: "Stress scores only (no raw text)" },
    { what: "Voice recordings", why: "To analyze emotional tone (simulated analysis)", stored: "Emotion labels only (no audio stored)" },
    { what: "Sleep data", why: "To assess rest quality and its effect on stress", stored: "Hours, quality, and consistency" },
    { what: "Reflections", why: "To understand emotional context (optional)", stored: "Text and sentiment score" },
    { what: "Feedback", why: "To improve intervention recommendations", stored: "Feedback type per intervention" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <SidebarTrigger />
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Privacy & Ethics</h1>
          <p className="text-sm text-muted-foreground">Full transparency on how MindGuard works</p>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-warning-amber/30 bg-warning-amber-light/30">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning-amber flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-semibold text-foreground mb-1">Non-Diagnostic Disclaimer</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  MindGuard AI is a <strong>supportive tool</strong>, not a diagnostic or clinical system. 
                  It does not replace professional mental health care, therapy, or medical advice. 
                  If you are in crisis, please contact a mental health professional or emergency services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Transparency */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <CardTitle className="font-display">What Data We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataCollected.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-foreground">{item.what}</p>
                  <p className="text-xs text-muted-foreground mt-1"><strong>Why:</strong> {item.why}</p>
                  <p className="text-xs text-muted-foreground"><strong>Stored:</strong> {item.stored}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Controls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="font-display">Your Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <PauseCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Monitoring</p>
                  <p className="text-xs text-muted-foreground">
                    {monitoring ? "Active — sensing stress signals" : "Paused — no data collection"}
                  </p>
                </div>
              </div>
              <Switch checked={monitoring} onCheckedChange={handleToggleMonitoring} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Clear All History</p>
                  <p className="text-xs text-muted-foreground">Remove all stress readings, reflections, and feedback</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={clearing}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {clearing ? "Clearing..." : "Clear Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Values */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="gradient-card border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="font-display">Our Commitment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">•</span> Your data is never sold or shared with third parties</li>
              <li className="flex gap-2"><span className="text-primary">•</span> All stress analysis stays within your private account</li>
              <li className="flex gap-2"><span className="text-primary">•</span> You can delete your data at any time</li>
              <li className="flex gap-2"><span className="text-primary">•</span> The AI provides support, never judgment</li>
              <li className="flex gap-2"><span className="text-primary">•</span> No raw text or audio is stored — only computed metrics</li>
              <li className="flex gap-2"><span className="text-primary">•</span> This system supplements, never replaces, professional care</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
