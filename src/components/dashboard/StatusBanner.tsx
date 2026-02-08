import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function StatusBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-calm-light border border-calm/20 p-4 flex items-center gap-4"
    >
      <div className="relative">
        <div className="h-3 w-3 rounded-full bg-calm" />
        <div className="absolute inset-0 h-3 w-3 rounded-full bg-calm pulse-calm" />
      </div>
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-calm" />
        <span className="font-display font-semibold text-calm">Monitoring Active</span>
      </div>
      <span className="text-sm text-muted-foreground">Sensing typing patterns, voice signals & sleep data</span>
    </motion.div>
  );
}
