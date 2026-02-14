export type ActionType = "breathing" | "grounding" | "break" | "motivation";

interface PolicyStats {
  uses: number;
  reward: number; // cumulative
}

const policy: Record<ActionType, PolicyStats> = {
  breathing: { uses: 0, reward: 0 },
  grounding: { uses: 0, reward: 0 },
  break: { uses: 0, reward: 0 },
  motivation: { uses: 0, reward: 0 },
};

export function selectAction(stress: number): ActionType {
  if (stress < 0.4) return "motivation";

  // ε-greedy selection
  const epsilon = 0.2;
  if (Math.random() < epsilon) {
    return randomAction();
  }

  return bestAction();
}

function bestAction(): ActionType {
  return Object.entries(policy).reduce((best, [key, stats]) => {
    const score = stats.uses === 0 ? 0 : stats.reward / stats.uses;
    const bestScore =
      policy[best].uses === 0 ? 0 : policy[best].reward / policy[best].uses;
    return score > bestScore ? (key as ActionType) : best;
  }, "breathing");
}

function randomAction(): ActionType {
  const actions: ActionType[] = ["breathing", "grounding", "break", "motivation"];
  return actions[Math.floor(Math.random() * actions.length)];
}

export function updatePolicy(action: ActionType, reward: number) {
  policy[action].uses += 1;
  policy[action].reward += reward;
}

export function getPolicyStats() {
  return policy;
}
