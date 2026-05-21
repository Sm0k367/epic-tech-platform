"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function GroqChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterCount = input.length;
  const maxCharacters = 2000;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "Unable to process response.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to get response. Please try again.");
        console.error("Chat error:", errorData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Connection error: ${errorMessage}`);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <div className="mb-4">
              <div className="text-4xl mb-4">✨</div>
              <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Share your creative vision with Epic. We'll help you refine it and explore possibilities.
              </p>
            </div>
            <div className="mt-8 bg-gray-900/50 rounded-lg p-4 max-w-sm mx-auto text-left border border-purple-500/20">
              <p className="text-xs font-semibold text-purple-400 mb-2">💡 Tip</p>
              <p className="text-xs text-gray-400">
                Try starting with: "I want to create a character that is..." or "Show me a scene where..."
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-lg px-4 py-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                  : "bg-gray-900 text-gray-100 border border-cyan-500/30 rounded-bl-none"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 text-gray-100 border border-cyan-500/30 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
                <p className="text-sm text-gray-400">Epic is thinking...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-900/30 text-red-200 border border-red-600/50 px-4 py-2 rounded-lg text-sm max-w-md">
              <p className="font-semibold mb-1">⚠️ Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Share your creative vision..."
              className="flex-1 bg-gray-900 text-white placeholder-gray-500 rounded-lg px-4 py-3 border border-cyan-500/20 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50"
              maxLength={maxCharacters}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all px-6 py-3 font-medium"
            >
              {loading ? "..." : "Send"}
            </Button>
          </div>

          {/* Character count */}
          <div className="flex justify-between items-center px-1">
            <p className="text-xs text-gray-500">
              <span className={characterCount > maxCharacters * 0.8 ? "text-yellow-500" : ""}>
                {characterCount}
              </span>
              /{maxCharacters}
            </p>
            {characterCount > 0 && (
              <p className="text-xs text-gray-500">
                💡 More detail = better results
              </p>
            )}
          </div>
        </form>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
