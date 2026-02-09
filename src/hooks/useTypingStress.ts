import { useState, useCallback, useRef, useEffect } from "react";

interface TypingMetrics {
  speed: number; // chars per minute
  errorRate: number; // 0-1
  pausePattern: number; // avg pause duration in ms
  stressScore: number; // 0-1
}

export function useTypingStress() {
  const [metrics, setMetrics] = useState<TypingMetrics>({
    speed: 0,
    errorRate: 0,
    pausePattern: 0,
    stressScore: 0,
  });

  const keyTimestamps = useRef<number[]>([]);
  const deletePresses = useRef(0);
  const totalPresses = useRef(0);
  const pauses = useRef<number[]>([]);
  const lastKeyTime = useRef<number>(0);
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  const calculateStress = useCallback(() => {
    const now = Date.now();
    const recentKeys = keyTimestamps.current.filter(t => now - t < 30000);
    const speed = recentKeys.length * 2; // chars in 30s → chars/min

    const errorRate = totalPresses.current > 0
      ? Math.min(deletePresses.current / totalPresses.current, 1)
      : 0;

    const recentPauses = pauses.current.filter((_, i) => i >= pauses.current.length - 10);
    const avgPause = recentPauses.length > 0
      ? recentPauses.reduce((a, b) => a + b, 0) / recentPauses.length
      : 0;

    // Normalize: high speed + high errors + long pauses = stress
    const speedFactor = speed > 200 ? Math.min((speed - 200) / 200, 1) * 0.3 : 0;
    const errorFactor = errorRate * 0.4;
    const pauseFactor = avgPause > 2000 ? Math.min((avgPause - 2000) / 5000, 1) * 0.3 : 0;

    const stressScore = Math.min(speedFactor + errorFactor + pauseFactor, 1);

    setMetrics({
      speed: Math.round(speed),
      errorRate: Math.round(errorRate * 100) / 100,
      pausePattern: Math.round(avgPause),
      stressScore: Math.round(stressScore * 100) / 100,
    });

    return { speed, errorRate, pausePattern: avgPause, stressScore };
  }, []);
const lastKeyWasChar = useRef(false);
const handleKeyPress = useCallback((e: KeyboardEvent) => {
  const now = Date.now();
  totalPresses.current += 1;

  if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
    lastKeyWasChar.current = true;
  }

  if ((e.key === "Backspace" || e.key === "Delete") && lastKeyWasChar.current) {
    deletePresses.current += 1;
    lastKeyWasChar.current = false;
  }

  if (lastKeyTime.current > 0) {
    const gap = now - lastKeyTime.current;
    pauses.current.push(gap);
    if (pauses.current.length > 50) pauses.current.shift();
  }

  lastKeyTime.current = now;
  keyTimestamps.current.push(now);
  if (keyTimestamps.current.length > 200) keyTimestamps.current.shift();
}, []);


  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    updateTimer.current = setInterval(calculateStress, 3000);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (updateTimer.current) clearInterval(updateTimer.current);
    };
  }, [handleKeyPress, calculateStress]);

  const reset = useCallback(() => {
    keyTimestamps.current = [];
    deletePresses.current = 0;
    totalPresses.current = 0;
    pauses.current = [];
    lastKeyTime.current = 0;
    setMetrics({ speed: 0, errorRate: 0, pausePattern: 0, stressScore: 0 });
  }, []);

  return { metrics, calculateStress, reset };
}
