export function computeSleepStress(
  hours: number,
  quality: "poor" | "fair" | "good",
  consistency: "irregular" | "regular" | "very_regular"
): number {
  let stress = 0;

  // Hours slept factor
  if (hours < 5) stress += 0.5;
  else if (hours < 6) stress += 0.4;
  else if (hours < 7) stress += 0.25;
  else stress += 0.1;

  // Sleep quality factor
  if (quality === "poor") stress += 0.3;
  else if (quality === "fair") stress += 0.15;
  else stress += 0.05;

  // Bedtime consistency factor
  if (consistency === "irregular") stress += 0.25;
  else if (consistency === "regular") stress += 0.15;
  else stress += 0.05;

  return Math.min(stress, 1);
}
