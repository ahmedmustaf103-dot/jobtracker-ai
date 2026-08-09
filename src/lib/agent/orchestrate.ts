import {
  GoogleGenerativeAIFetchError,
  type Content,
  type Part,
} from "@google/generative-ai";

import { buildAgentSystemInstruction } from "@/lib/agent/prompts";
import {
  AGENT_TOOL_DECLARATIONS,
  executeAgentTool,
} from "@/lib/agent/tools";
import type {
  AgentContext,
  AgentMessage,
  AgentRunResult,
  AgentToolCallTrace,
} from "@/lib/agent/types";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini";

const MAX_STEPS = 5;
const FALLBACK_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
] as const;

function modelChain(): string[] {
  const primary = GEMINI_MODEL.trim();
  return [...new Set([primary, ...FALLBACK_MODELS.filter((m) => m !== primary)])];
}

function toGeminiContents(messages: AgentMessage[]): Content[] {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

function extractText(parts: Part[]): string {
  return parts
    .map((part) => ("text" in part && part.text ? part.text : ""))
    .join("")
    .trim();
}

function isRetryable(error: unknown): boolean {
  if (error instanceof GoogleGenerativeAIFetchError) {
    return error.status === 429 || error.status === 503 || error.status === 500;
  }
  return false;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run a tool-using Gemini agent loop over the conversation.
 * Executes up to MAX_STEPS tool rounds, then returns the final assistant text.
 */
export async function runJobSearchAgent(
  messages: AgentMessage[],
  ctx: AgentContext,
): Promise<AgentRunResult> {
  const toolCalls: AgentToolCallTrace[] = [];
  const contents = toGeminiContents(messages);
  let lastError: unknown;

  for (const modelName of modelChain()) {
    const model = getGeminiClient().getGenerativeModel({
      model: modelName,
      systemInstruction: buildAgentSystemInstruction(ctx.candidateName),
      tools: [{ functionDeclarations: AGENT_TOOL_DECLARATIONS }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    });

    try {
      for (let step = 0; step < MAX_STEPS; step++) {
        const result = await model.generateContent({ contents });
        const response = result.response;
        const candidate = response.candidates?.[0];
        const parts = candidate?.content?.parts ?? [];

        if (parts.length === 0) {
          throw new Error("The AI returned an empty response.");
        }

        const functionCalls = response.functionCalls?.() ?? [];

        if (functionCalls.length === 0) {
          const text = extractText(parts) || response.text().trim();
          if (!text) {
            throw new Error("The AI returned an empty response.");
          }
          return {
            message: { role: "assistant", content: text },
            toolCalls,
          };
        }

        contents.push({ role: "model", parts });

        const responseParts: Part[] = [];

        for (const call of functionCalls) {
          const args = (call.args ?? {}) as Record<string, unknown>;
          const trace = await executeAgentTool(call.name, args, ctx);
          toolCalls.push(trace);
          responseParts.push({
            functionResponse: {
              name: call.name,
              response: {
                result: trace.result,
              },
            },
          });
        }

        contents.push({ role: "user", parts: responseParts });
      }

      return {
        message: {
          role: "assistant",
          content:
            "I hit the tool-call limit while working on that. Try a more specific request, or ask me to continue.",
        },
        toolCalls,
      };
    } catch (error) {
      lastError = error;
      if (isRetryable(error)) {
        await sleep(1200);
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("AI request failed.");
}
