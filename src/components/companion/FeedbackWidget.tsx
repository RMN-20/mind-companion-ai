import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const feedbackOptions = [
  { type: "helpful", icon: ThumbsUp, label: "Helpful", emoji: "👍" },
  { type: "not_helpful", icon: ThumbsDown, label: "Not helpful", emoji: "👎" },
  { type: "acknowledge", icon: CheckCircle, label: "I acknowledge", emoji: "✅" },
  { type: "remind_later", icon: Clock, label: "Remind later", emoji: "⏳" },
  { type: "tried", icon: RefreshCw, label: "I tried this", emoji: "🔁" },
];

interface FeedbackWidgetProps {
  onFeedback: (type: string) => void;
  selectedType?: string;
  disabled?: boolean;
}

export function FeedbackWidget({ onFeedback, selectedType, disabled }: FeedbackWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {feedbackOptions.map((opt) => (
        <Button
          key={opt.type}
          variant={selectedType === opt.type ? "default" : "outline"}
          size="sm"
          disabled={disabled || (!!selectedType && selectedType !== opt.type)}
          onClick={() => onFeedback(opt.type)}
          className="gap-1.5 text-xs rounded-full"
        >
          <span>{opt.emoji}</span>
          {opt.label}
        </Button>
      ))}
    </motion.div>
  );
}
