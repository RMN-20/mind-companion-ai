export function computeVoiceStress(
  energy: number,
  speakingRate: number
): number {
  let stress = 0;

  // Energy (loudness) — shouting or strained voice
  if (energy > 0.7) stress += 0.4;
  else if (energy > 0.4) stress += 0.25;
  else stress += 0.1;

  // Speaking rate (words per minute approx)
  if (speakingRate > 160) stress += 0.4;
  else if (speakingRate > 120) stress += 0.25;
  else stress += 0.1;

  return Math.min(stress, 1);
}
