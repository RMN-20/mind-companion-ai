import { selectAction, updatePolicy } from "./rlPolicy";
import { generateMessage } from "./llmMessages";

export type AgentStatus = "clear" | "intervening";
export type AgentAction =
  | "breathing"
  | "grounding"
  | "break"
  | "motivation"
  | "focus"
  | "reflection"
  | null;

export interface AgentResult {
  status: AgentStatus;
  action: AgentAction;
  message: string | null;
}

/**
 * Agent decision logic
 * Graduated + emotion-aware responses
 */
export function runAgent(overallStress: number): AgentResult {
  // 🟢 Very low stress
  if (overallStress < 0.2) {
    return {
      status: "clear",
      action: null,
      message: null,
    };
  }

  // 🟡 Mild stress → motivation / focus
  if (overallStress < 0.4) {
    const action: AgentAction =
      Math.random() > 0.5 ? "motivation" : "focus";

    return {
      status: "intervening",
      action,
      message: generateMessage(action, overallStress),
    };
  }

  // 🟠 Moderate stress → breathing / break
  if (overallStress < 0.65) {
    const action =
      selectAction(overallStress) ?? "breathing";

    return {
      status: "intervening",
      action,
      message: generateMessage(action, overallStress),
    };
  }

  // 🔴 High stress → grounding or reflection
  const action: AgentAction =
    Math.random() > 0.6 ? "grounding" : "reflection";

  return {
    status: "intervening",
    action,
    message: generateMessage(action, overallStress),
  };
}

/**
 * Reinforcement Learning feedback
 */
export function applyFeedback(
  action: AgentAction,
  feedback: "helpful" | "neutral" | "unhelpful"
) {
  if (!action) return;

  const reward =
    feedback === "helpful" ? 1 :
    feedback === "neutral" ? 0 :
    -1;

  updatePolicy(action, reward);
}
