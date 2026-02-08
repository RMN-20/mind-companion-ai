import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { motion } from "framer-motion";

const breathPhases = [
  { label: "Breathe In", duration: 4000, scale: 1.3, color: "hsl(var(--sky))" },
  { label: "Hold", duration: 4000, scale: 1.3, color: "hsl(var(--lavender))" },
  { label: "Breathe Out", duration: 6000, scale: 1, color: "hsl(var(--calm-green))" },
  { label: "Hold", duration: 2000, scale: 1, color: "hsl(var(--sand-warm))" },
];

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const startExercise = () => {
    setIsActive(true);
    setPhase(0);
    setCycleCount(0);
    runPhase(0, 0);
  };

  const runPhase = (phaseIndex: number, cycles: number) => {
    if (cycles >= 3) {
      setIsActive(false);
      return;
    }
    setPhase(phaseIndex);
    const nextPhase = (phaseIndex + 1) % breathPhases.length;
    const nextCycles = nextPhase === 0 ? cycles + 1 : cycles;
    setCycleCount(nextCycles);
    setTimeout(() => runPhase(nextPhase, nextCycles), breathPhases[phaseIndex].duration);
  };

  const currentPhase = breathPhases[phase];

  return (
    <Card className="gradient-card border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sky-light flex items-center justify-center">
            <Wind className="h-4 w-4 text-sky" />
          </div>
          <CardTitle className="font-display text-base">Breathing Exercise</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        {isActive ? (
          <>
            <motion.div
              className="h-32 w-32 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: currentPhase.color, opacity: 0.3 }}
              animate={{ scale: currentPhase.scale }}
              transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
            >
              <motion.div
                className="h-20 w-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentPhase.color, opacity: 0.6 }}
                animate={{ scale: currentPhase.scale }}
                transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
              >
                <motion.div
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: currentPhase.color }}
                  animate={{ scale: currentPhase.scale }}
                  transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
            <p className="font-display text-lg font-semibold text-foreground">{currentPhase.label}</p>
            <p className="text-sm text-muted-foreground mt-1">Cycle {cycleCount + 1} of 3</p>
          </>
        ) : (
          <>
            <div className="h-32 w-32 rounded-full bg-sky-light/50 flex items-center justify-center mb-6 breathe">
              <Wind className="h-10 w-10 text-sky/60" />
            </div>
            <button
              onClick={startExercise}
              className="text-sm font-medium text-primary hover:underline"
            >
              Start 4-4-6-2 Breathing
            </button>
            <p className="text-xs text-muted-foreground mt-2">3 cycles • ~48 seconds</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
