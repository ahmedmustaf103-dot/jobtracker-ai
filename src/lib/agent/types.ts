export type AgentMessageRole = "user" | "assistant";

export type AgentMessage = {
  role: AgentMessageRole;
  content: string;
};

export type AgentToolCallTrace = {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
};

export type AgentRunResult = {
  message: AgentMessage;
  toolCalls: AgentToolCallTrace[];
};

export type AgentContext = {
  userId: string;
  candidateName: string;
};
