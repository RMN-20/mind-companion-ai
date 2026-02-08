import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, Footprints, Coffee, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface Intervention {
  id: string;
  type: string;
  title: string;
  content: string;
  created_at: string;
}

const typeIcons: Record<string, any> = {
  breathing: Wind,
  grounding: Footprints,
  break: Coffee,
  motivation: Heart,
};

const typeColors: Record<string, string> = {
  breathing: "bg-sky-light text-sky",
  grounding: "bg-calm-light text-calm",
  break: "bg-sand text-accent-foreground",
  motivation: "bg-lavender-light text-lavender",
};

export function RecentActions({ interventions }: { interventions: Intervention[] }) {
  if (!interventions.length) {
    return (
      <Card className="gradient-card border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-base">Recent Autonomous Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No actions yet. The AI will act when stress signals are detected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-base">Recent Autonomous Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interventions.slice(0, 5).map((action, i) => {
            const Icon = typeIcons[action.type] || Heart;
            const colorClass = typeColors[action.type] || "bg-muted text-muted-foreground";
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className={`h-8 w-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.content}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(action.created_at), { addSuffix: true })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
