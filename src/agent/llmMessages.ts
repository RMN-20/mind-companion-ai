type ActionType =
  | "breathing"
  | "grounding"
  | "break"
  | "motivation"
  | "focus"
  | "reflection";

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMessage(
  action: ActionType,
  stress: number
): string {
  const messages: Record<ActionType, string[]> = {
    breathing: [
      "Let’s slow things down together. Take a deep breath in… hold… and gently breathe out.",
      "Pause for a moment. Inhale through your nose, exhale slowly through your mouth.",
      "Your body responds to breath. Try 4 seconds in, 6 seconds out."
    ],

    grounding: [
      "Pause for a second. Name five things you can see, four you can touch, and three you can hear.",
      "Put both feet on the floor and notice the pressure beneath you.",
      "Look around and describe one object in detail."
    ],

    break: [
      "You’ve been working hard. A short break can help reset your focus.",
      "Step away for five minutes. Rest is part of productivity.",
      "A brief pause now can improve your performance later."
    ],

    motivation: stress < 0.3
      ? [
          "You’re doing well right now. Keep this steady rhythm going.",
          "This calm state is valuable — try to maintain it.",
        ]
      : stress < 0.6
      ? [
          "You’re managing a lot, and that takes effort. One step at a time.",
          "Progress matters more than perfection. You’ve got this.",
        ]
      : [
          "This feels intense, but you’re not alone. Small pauses help.",
          "Even difficult moments pass. Focus on the next small step.",
        ],

    focus: [
      "Close unnecessary tabs and focus on just one task.",
      "Pick one small goal and finish it completely.",
      "Remove distractions for the next 10 minutes."
    ],

    reflection: [
      "What emotion are you feeling right now?",
      "Write one sentence about what’s stressing you.",
      "Noticing your thoughts is the first step to clarity."
    ],
  };

  return pickRandom(messages[action]);
}
