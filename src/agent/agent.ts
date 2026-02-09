import { selectAction, updatePolicy } from "./rlPolicy";
import { generateMessage } from "./llmMessages";

export type AgentStatus = "clear" | "intervening";
export type AgentAction = "breathing" | "grounding" | "break" | "motivation" | null;

export interface AgentResult {
  status: AgentStatus;
  action: AgentAction;
  message: string | null;
}

export function runAgent(overallStress: number): AgentResult {
  if (overallStress < 0.35) {
    return {
      status: "clear",
      action: null,
      message: null,
    };
  }

  const action = selectAction(overallStress);
  const message = generateMessage(action, overallStress);

  return {
    status: "intervening",
    action,
    message,
  };
}

export function applyFeedback(
  action: AgentAction,
  feedback: "helpful" | "neutral" | "unhelpful"
) {
  if (!action) return;

  const reward =
    feedback === "helpful" ? 1 : feedback === "neutral" ? 0 : -1;

  updatePolicy(action, reward);
}
