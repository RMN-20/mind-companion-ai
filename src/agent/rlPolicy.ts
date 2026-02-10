// rlPolicy.ts

export type ActionType =
  | "breathing"
  | "grounding"
  | "break"
  | "motivation"
  | "focus"
  | "reflection";

export interface PolicyStats {
  uses: number;
  reward: number;
}

// ✅ INITIAL POLICY — now COMPLETE
const policy: Record<ActionType, PolicyStats> = {
  breathing: { uses: 0, reward: 0 },
  grounding: { uses: 0, reward: 0 },
  break: { uses: 0, reward: 0 },
  motivation: { uses: 0, reward: 0 },
  focus: { uses: 0, reward: 0 },
  reflection: { uses: 0, reward: 0 },
};

/**
 * Select an action based on stress level
 */
export function selectAction(stress: number): ActionType {
  if (stress > 0.75) return "grounding";
  if (stress > 0.6) return "breathing";
  if (stress > 0.45) return "break";
  if (stress > 0.3) return "focus";
  return "motivation";
}

/**
 * Update policy using simple reward-based learning
 */
export function updatePolicy(action: ActionType, reward: number) {
  policy[action].uses += 1;
  policy[action].reward += reward;
}

/**
 * (Optional) Inspect policy for Insights page / debugging
 */
export function getPolicy() {
  return policy;
}
