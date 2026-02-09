import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AgentProvider } from "@/agent/AgentContext";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <AgentProvider>
    <App />
  </AgentProvider>
);
