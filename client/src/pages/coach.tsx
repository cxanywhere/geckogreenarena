import { useState, useRef, useEffect } from "react";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Sparkles, BookOpen, MessageSquare, Target, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

interface Source {
  title: string;
  chapter: number;
  type: string;
  category?: string;
  winningResponse?: string;
  losingResponse?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
}

interface CoachResponse {
  answer: string;
  sources: Source[];
}

const SUGGESTED_QUESTIONS = [
  { icon: MessageSquare, text: "How do I handle 'I'm not interested'?", category: "objections" },
  { icon: Target, text: "What's the B-P-D-C framework?", category: "process" },
  { icon: Lightbulb, text: "How do I pitch prepay effectively?", category: "prepay" },
  { icon: BookOpen, text: "What's the LinkedIn Marketing Solutions elevator pitch?", category: "script" },
];

export default function CoachPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: CoachResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Coach error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your question. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col h-[calc(100vh-120px)]">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-magenta/10">
                <Bot className="h-6 w-6 text-magenta" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sales Coach</h1>
                <p className="text-sm text-muted-foreground">
                  Your AI-powered guide to LinkedIn Marketing Solutions sales mastery
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-8">
                  <div className="p-4 rounded-full bg-magenta/10 mb-4">
                    <Sparkles className="h-8 w-8 text-magenta" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    How can I help you today?
                  </h2>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                    Ask me anything about discovery calls, objection handling, the LinkedIn Marketing Solutions platform, or sales techniques.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {SUGGESTED_QUESTIONS.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-magenta/50 hover:bg-magenta/5 transition-all text-left group"
                        data-testid={`suggestion-${i}`}
                      >
                        <suggestion.icon className="h-5 w-5 text-muted-foreground group-hover:text-magenta transition-colors flex-shrink-0" />
                        <span className="text-sm text-foreground">{suggestion.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-magenta" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? "bg-magenta text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Sources:
                              </p>
                              <div className="space-y-2">
                                {message.sources.map((source, i) => (
                                  <div key={i} className="text-xs">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
                                      <BookOpen className="h-3 w-3" />
                                      Ch{source.chapter}: {source.title.slice(0, 40)}
                                      {source.title.length > 40 ? "..." : ""}
                                    </span>
                                    {source.winningResponse && (
                                      <div className="mt-1 ml-2 p-2 rounded bg-green-500/10 border border-green-500/20">
                                        <span className="text-green-600 dark:text-green-400 font-medium">Winning: </span>
                                        <span className="text-foreground/80">"{source.winningResponse}"</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-magenta" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-border bg-background/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about objections, discovery, LinkedIn Marketing Solutions..."
                  className="flex-1"
                  disabled={isLoading}
                  data-testid="input-coach-message"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4"
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
