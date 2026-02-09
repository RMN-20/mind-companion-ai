import { createContext, useContext, useState, ReactNode } from "react";
import type { AgentAction, AgentStatus } from "./agent";

interface AgentMemoryItem {
  timestamp: number;
  stress: number;
  action: AgentAction;
  message: string | null;
}

interface AgentContextType {
  status: AgentStatus;
  stress: number;
  action: AgentAction;
  message: string | null;
  history: AgentMemoryItem[];
  updateAgent: (
    status: AgentStatus,
    stress: number,
    action: AgentAction,
    message: string | null
  ) => void;
}

const AgentContext = createContext<AgentContextType | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AgentStatus>("clear");
  const [stress, setStress] = useState(0);
  const [action, setAction] = useState<AgentAction>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<AgentMemoryItem[]>([]);

  const updateAgent = (
    newStatus: AgentStatus,
    newStress: number,
    newAction: AgentAction,
    newMessage: string | null
  ) => {
    setStatus(newStatus);
    setStress(newStress);
    setAction(newAction);
    setMessage(newMessage);

    if (newAction) {
      setHistory((prev) => [
        {
          timestamp: Date.now(),
          stress: newStress,
          action: newAction,
          message: newMessage,
        },
        ...prev,
      ]);
    }
  };

  return (
    <AgentContext.Provider
      value={{
        status,
        stress,
        action,
        message,
        history,
        updateAgent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside AgentProvider");
  return ctx;
}
