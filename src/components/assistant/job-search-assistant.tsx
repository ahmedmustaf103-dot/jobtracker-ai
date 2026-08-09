"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { Panel } from "@/components/ui/panel";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AgentMessage, AgentToolCallTrace } from "@/lib/agent/types";

type ChatItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: AgentToolCallTrace[];
};

const SUGGESTIONS = [
  "Find remote React developer jobs",
  "How is my application pipeline looking?",
  "Show applications in Interview status",
  "Save Stripe Senior Frontend as wishlist",
] as const;

function toolLabel(name: string) {
  switch (name) {
    case "search_remote_jobs":
      return "Searched jobs";
    case "get_pipeline_stats":
      return "Checked pipeline";
    case "search_applications":
      return "Searched applications";
    case "save_application":
      return "Saved application";
    case "update_application_status":
      return "Updated status";
    default:
      return name;
  }
}

export function JobSearchAssistant() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  async function sendMessage(raw: string) {
    const content = raw.trim();
    if (!content || pending) return;

    setError(null);
    setInput("");

    const userItem: ChatItem = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };

    const nextMessages = [...messages, userItem];
    setMessages(nextMessages);
    setPending(true);

    const payload: AgentMessage[] = nextMessages.map(({ role, content: text }) => ({
      role,
      content: text,
    }));

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: AgentMessage;
        toolCalls?: AgentToolCallTrace[];
      };

      if (!response.ok) {
        throw new Error(data.error || "Assistant request failed.");
      }

      if (!data.message?.content) {
        throw new Error("The assistant returned an empty reply.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.message!.content,
          toolCalls: data.toolCalls,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Panel padding="none" className="flex min-h-[560px] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 ring-1 ring-inset ring-violet-500/30">
            <Bot className="h-4 w-4 text-violet-300" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">
              AI Job Search Assistant
            </p>
            <p className="text-xs text-zinc-500">
              5 tools · Gemini orchestration · live remote jobs
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-inset ring-violet-500/25">
                <Sparkles className="h-5 w-5 text-violet-300" aria-hidden="true" />
              </div>
              <h2 className="text-base font-semibold text-zinc-100">
                Ask about jobs or your pipeline
              </h2>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                I can search remote openings, inspect your tracker, save roles,
                and update application status.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={pending}
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] space-y-2 rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-violet-600/80 text-white"
                      : "border border-white/10 bg-white/[0.04] text-zinc-200",
                  )}
                >
                  {message.toolCalls && message.toolCalls.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {message.toolCalls.map((call, index) => (
                        <span
                          key={`${call.name}-${index}`}
                          className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-0.5 text-[11px] text-violet-200"
                        >
                          <Wrench className="h-3 w-3" aria-hidden="true" />
                          {toolLabel(call.name)}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {pending ? (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Thinking and calling tools…
              </div>
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-white/10 p-4"
        >
          {error ? (
            <div className="mb-3">
              <FormAlert variant="error">{error}</FormAlert>
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to find jobs, review your pipeline, or update an application…"
              rows={2}
              disabled={pending}
              className="min-h-[72px] resize-none"
            />
            <Button
              type="submit"
              disabled={pending || !input.trim()}
              className="h-11 shrink-0 px-4"
              aria-label="Send message"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-zinc-600">
            Enter to send · Shift+Enter for a new line
          </p>
        </form>
      </Panel>

      <aside className="space-y-4">
        <Panel className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-100">Agent tools</h2>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <span className="font-medium text-zinc-300">search_remote_jobs</span>
              {" — "}relevant remote openings
            </li>
            <li>
              <span className="font-medium text-zinc-300">get_pipeline_stats</span>
              {" — "}status breakdown
            </li>
            <li>
              <span className="font-medium text-zinc-300">search_applications</span>
              {" — "}find tracked roles
            </li>
            <li>
              <span className="font-medium text-zinc-300">save_application</span>
              {" — "}add to tracker
            </li>
            <li>
              <span className="font-medium text-zinc-300">update_application_status</span>
              {" — "}move pipeline stage
            </li>
          </ul>
        </Panel>
        <Panel className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-100">Tips</h2>
          <p className="text-xs leading-relaxed text-zinc-500">
            Be specific: “Find remote TypeScript jobs and save the best one as
            wishlist.” Tool chips show when the agent used a capability.
          </p>
        </Panel>
      </aside>
    </div>
  );
}
