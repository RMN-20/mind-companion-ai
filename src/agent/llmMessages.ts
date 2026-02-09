export function generateMessage(action: string, stress: number): string {
  if (action === "breathing") {
    return "Let’s slow things down together. Take a deep breath in through your nose, hold for a moment, and gently breathe out.";
  }

  if (action === "grounding") {
    return "Pause for a second. Name five things you can see, four you can touch, and three you can hear.";
  }

  if (action === "break") {
    return "You’ve been working hard. A short break can help reset your focus and reduce tension.";
  }

  // motivation
  if (stress < 0.3) {
    return "You’re doing well right now. Maintaining calm moments like this is a great habit.";
  }

  if (stress < 0.6) {
    return "You’re managing a lot, and it’s okay to take things one step at a time.";
  }

  return "This feels intense right now, but you’re not alone. Small pauses can make a big difference.";
}
