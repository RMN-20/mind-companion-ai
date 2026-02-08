import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const groundingSteps = [
  { label: "5 things you can SEE", instruction: "Look around and name 5 things you can see right now.", emoji: "👁️" },
  { label: "4 things you can TOUCH", instruction: "Notice 4 things you can physically feel — your chair, your clothes, a surface.", emoji: "✋" },
  { label: "3 things you can HEAR", instruction: "Listen carefully for 3 distinct sounds around you.", emoji: "👂" },
  { label: "2 things you can SMELL", instruction: "Identify 2 scents — your coffee, the air, anything nearby.", emoji: "👃" },
  { label: "1 thing you can TASTE", instruction: "Notice 1 taste — a lingering flavor, or simply the inside of your mouth.", emoji: "👅" },
];

export function GroundingTechnique() {
  const [step, setStep] = useState(-1);
  const isActive = step >= 0;
  const isDone = step >= groundingSteps.length;

  return (
    <Card className="gradient-card border-border/40 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-calm-light flex items-center justify-center">
            <Footprints className="h-4 w-4 text-calm" />
          </div>
          <CardTitle className="font-display text-base">5-4-3-2-1 Grounding</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="py-6">
        {!isActive && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ground yourself in the present moment using your five senses.
            </p>
            <Button variant="outline" onClick={() => setStep(0)} className="gap-2">
              Begin Grounding <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isActive && !isDone && (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <span className="text-4xl mb-4 block">{groundingSteps[step].emoji}</span>
              <p className="font-display font-semibold text-foreground mb-2">{groundingSteps[step].label}</p>
              <p className="text-sm text-muted-foreground mb-6">{groundingSteps[step].instruction}</p>
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-4">
                {groundingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${i <= step ? "bg-calm" : "bg-muted"}`}
                  />
                ))}
              </div>
              <Button onClick={() => setStep(step + 1)} variant="outline" size="sm" className="gap-2">
                {step < groundingSteps.length - 1 ? "Next" : "Finish"} <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </AnimatePresence>
        )}

        {isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <span className="text-4xl mb-3 block">🌿</span>
            <p className="font-display font-semibold text-foreground mb-1">Well done!</p>
            <p className="text-sm text-muted-foreground mb-4">You've completed the grounding exercise.</p>
            <Button variant="ghost" size="sm" onClick={() => setStep(-1)}>
              Reset
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
