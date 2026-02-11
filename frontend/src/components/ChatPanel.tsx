"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: Date;
}

const agentColors: Record<string, string> = {
  triage: "text-primary",
  concepts: "text-accent-blue",
  code_review: "text-accent-green",
  debug: "text-accent-red",
  exercise: "text-accent-yellow",
  progress: "text-primary-light",
};

const agentLabels: Record<string, string> = {
  triage: "Triage",
  concepts: "Concepts",
  code_review: "Code Review",
  debug: "Debug",
  exercise: "Exercise",
  progress: "Progress",
};

export default function ChatPanel({ sessionId }: { sessionId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Python tutor. I can explain concepts, review your code, help debug errors, create exercises, and track your progress. What would you like to learn today?",
      agent: "triage",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, session_id: sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, agent: data.agent, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again.", agent: "triage", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-surface-lighter flex items-center px-6">
        <Sparkles className="w-5 h-5 text-primary mr-2" />
        <h1 className="font-semibold">LearnFlow Chat</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={clsx("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === "user" ? "bg-primary" : "bg-surface-lighter"
            )}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={clsx(
              "max-w-[70%] rounded-2xl px-4 py-3",
              msg.role === "user" ? "bg-primary text-white" : "bg-surface-light"
            )}>
              {msg.agent && msg.role === "assistant" && (
                <span className={clsx("text-xs font-medium mb-1 block", agentColors[msg.agent] || "text-gray-400")}>
                  {agentLabels[msg.agent] || msg.agent} Agent
                </span>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-lighter flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-surface-light rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-surface-lighter">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything about Python..."
            className="flex-1 bg-surface-light border border-surface-lighter rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 rounded-xl px-4 py-3 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
