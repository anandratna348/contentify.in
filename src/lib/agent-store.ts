// Agent state persistence using localStorage

import { GeneratedPost } from "./gemini";

export interface AgentConfig {
  prompt: string;
  scheduleTimes: string[]; // HH:mm format, up to 6
  isActive: boolean;
  lastGeneratedDate: string; // YYYY-MM-DD
}

export interface AgentState {
  config: AgentConfig;
  posts: GeneratedPost[];
}

const AGENT_KEY = "xpost_agent_state";

const DEFAULT_CONFIG: AgentConfig = {
  prompt: "",
  scheduleTimes: ["09:00"],
  isActive: false,
  lastGeneratedDate: "",
};

export function loadAgentState(): AgentState {
  try {
    const saved = localStorage.getItem(AGENT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { config: { ...DEFAULT_CONFIG }, posts: [] };
}

export function saveAgentState(state: AgentState): void {
  localStorage.setItem(AGENT_KEY, JSON.stringify(state));
}

export function validateScheduleTimes(times: string[]): string | null {
  if (times.length > 6) return "Maximum 6 posts per day";
  if (times.length === 0) return "At least 1 time slot required";

  const sorted = [...times].sort();
  for (let i = 1; i < sorted.length; i++) {
    const prev = toMinutes(sorted[i - 1]);
    const curr = toMinutes(sorted[i]);
    if (curr - prev < 3) {
      return `Minimum 3 minutes between posts (${sorted[i - 1]} and ${sorted[i]} are too close)`;
    }
  }
  return null;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
