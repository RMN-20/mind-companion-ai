const NEGATIVE_KEYWORDS = [
  "tired",
  "exhausted",
  "stressed",
  "overwhelmed",
  "anxious",
  "worried",
  "burned",
  "frustrated",
  "angry",
  "sad",
  "pressure",
  "panic",
];

const POSITIVE_KEYWORDS = [
  "calm",
  "relaxed",
  "okay",
  "fine",
  "good",
  "confident",
  "happy",
  "focused",
  "motivated",
];

export function computeChatStress(text: string): number {
  if (!text.trim()) return 0;

  const words = text.toLowerCase().split(/\W+/);

  let negativeScore = 0;
  let positiveScore = 0;

  words.forEach((w) => {
    if (NEGATIVE_KEYWORDS.includes(w)) negativeScore += 1;
    if (POSITIVE_KEYWORDS.includes(w)) positiveScore += 1;
  });

  const rawScore = negativeScore - positiveScore;

  // Normalize into 0–1 range
  if (rawScore <= 0) return 0.2;
  if (rawScore === 1) return 0.4;
  if (rawScore === 2) return 0.6;
  if (rawScore >= 3) return 0.8;

  return 0;
}
