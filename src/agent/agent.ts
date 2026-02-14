import { selectAction, updatePolicy } from "./rlPolicy";
import { generateMessage } from "./llmMessages";

export type AgentStatus = "clear" | "intervening";
export type AgentAction =
  | "breathing"
  | "grounding"
  | "break"
  | "motivation"
  | null;

export interface AgentResult {
  status: AgentStatus;
  action: AgentAction;
  message: string | null;
}

/**
 * Agent decision logic
 * OPTION A: Relaxed thresholds + graduated responses
 */
export function runAgent(overallStress: number): AgentResult {
  // 🟢 Very low stress → do nothing
  if (overallStress < 0.2) {
    return {
      status: "clear",
      action: null,
      message: null,
    };
  }

  // 🟡 Mild stress → gentle motivation
  if (overallStress >= 0.2 && overallStress < 0.4) {
    const action: AgentAction = "motivation";
    return {
      status: "intervening",
      action,
      message: generateMessage(action, overallStress),
    };
  }

  // 🟠 Moderate stress → breathing or break
  if (overallStress >= 0.4 && overallStress < 0.65) {
    const action: AgentAction = selectAction(overallStress) ?? "breathing";
    return {
      status: "intervening",
      action,
      message: generateMessage(action, overallStress),
    };
  }

  // 🔴 High stress → grounding (strong intervention)
  const action: AgentAction = "grounding";
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
