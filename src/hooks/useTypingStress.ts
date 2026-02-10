import { useState, useCallback, useRef, useEffect } from "react";

interface TypingMetrics {
  speed: number;            // chars per minute
  errorRate: number;        // 0–1
  pausePattern: number;     // avg pause (ms)
  stressScore: number;      // 0–1
}

export function useTypingStress() {
  const [metrics, setMetrics] = useState<TypingMetrics>({
    speed: 0,
    errorRate: 0,
    pausePattern: 0,
    stressScore: 0,
  });

  const keyTimes = useRef<number[]>([]);
  const pauses = useRef<number[]>([]);
  const backspaces = useRef<number[]>([]);
  const totalKeys = useRef(0);
  const lastKeyTime = useRef<number | null>(null);

  /* -------------------- KEY LISTENER -------------------- */
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const now = Date.now();
    totalKeys.current += 1;

    keyTimes.current.push(now);
    if (keyTimes.current.length > 300) keyTimes.current.shift();

    if (e.key === "Backspace" || e.key === "Delete") {
      backspaces.current.push(now);
      if (backspaces.current.length > 50) backspaces.current.shift();
    }

    if (lastKeyTime.current) {
      pauses.current.push(now - lastKeyTime.current);
      if (pauses.current.length > 50) pauses.current.shift();
    }

    lastKeyTime.current = now;
  }, []);

  /* -------------------- STRESS CALCULATION -------------------- */
  const calculateStress = useCallback(() => {
    const now = Date.now();

    // Speed (last 30s)
    const recentKeys = keyTimes.current.filter(t => now - t < 30000);
    const speed = recentKeys.length * 2;

    // Error rate
    const errorRate =
      totalKeys.current > 0
        ? Math.min(backspaces.current.length / totalKeys.current, 1)
        : 0;

    // Pause pattern
    const avgPause =
      pauses.current.length > 0
        ? pauses.current.reduce((a, b) => a + b, 0) / pauses.current.length
        : 0;

    // Backspace burst (stress signal)
    const recentBackspaces = backspaces.current.filter(t => now - t < 10000);
    const backspaceBurst = Math.min(recentBackspaces.length / 10, 1);

    /* ---------- NORMALIZATION ---------- */
    const speedFactor =
      speed > 180 ? Math.min((speed - 180) / 220, 1) : 0;

    const pauseFactor =
      avgPause > 1500 ? Math.min((avgPause - 1500) / 4000, 1) : 0;

    /* ---------- FINAL STRESS SCORE ---------- */
    const stressScore = Math.min(
      speedFactor * 0.25 +
      errorRate * 0.25 +
      pauseFactor * 0.25 +
      backspaceBurst * 0.25,
      1
    );

    setMetrics({
      speed: Math.round(speed),
      errorRate: Number(errorRate.toFixed(2)),
      pausePattern: Math.round(avgPause),
      stressScore: Number(stressScore.toFixed(2)),
    });
  }, []);

  /* -------------------- EFFECT -------------------- */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    const timer = setInterval(calculateStress, 3000);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(timer);
    };
  }, [handleKeyPress, calculateStress]);

  return { metrics };
}
