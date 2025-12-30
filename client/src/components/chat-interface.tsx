import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Mic, Volume2, StopCircle, Flag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { api, Roleplay } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  scenario: Roleplay;
  userId: string;
}

export function ChatInterface({ scenario, userId }: ChatInterfaceProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    startSession();
  }, [scenario.id, userId]);

  const startSession = async () => {
    setIsStarting(true);
    try {
      const response = await api.startRoleplaySession(scenario.id, userId);
      setSessionId(response.sessionId);
      setMessages([{
        id: "1",
        sender: "ai",
        text: response.message,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Failed to start session:", error);
      setMessages([{
        id: "1",
        sender: "ai",
        text: `*The homeowner answers the door* "${scenario.name}"`,
        timestamp: new Date()
      }]);
    } finally {
      setIsStarting(false);
    }
  };

  const handleFinish = async () => {
    if (!sessionId || isEnding) return;
    
    setIsEnding(true);
    try {
      const result = await api.endRoleplaySession(sessionId, userId, scenario.id);
      localStorage.setItem('lastRoleplayResult', JSON.stringify({
        scenario,
        feedback: result.feedback,
        transcript: result.transcript
      }));
      setLocation(`/results/${scenario.id}`);
    } catch (error) {
      console.error("Failed to end session:", error);
      setLocation(`/results/${scenario.id}`);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !sessionId || isLoading) return;

    const userMessage = inputValue.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await api.sendRoleplayMessage(sessionId, userMessage);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "...*pauses*... Could you repeat that?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-10rem)] lg:h-[80vh] landscape:h-[calc(100dvh-6rem)] bg-card rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={scenario.avatar} />
              <AvatarFallback>{scenario.name[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground leading-none">{scenario.role}</h3>
            <span className="text-xs text-primary font-mono">{scenario.difficulty} // ONLINE</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Volume2 className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleFinish} 
              size="sm" 
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              disabled={isEnding || messages.length < 2}
              data-testid="button-end-roleplay"
            >
              {isEnding ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Flag className="mr-2 h-4 w-4" /> End & Analyze</>
              )}
            </Button>
        </div>
      </div>

      {/* Messages / Transcript */}
      <div className="bg-muted/10 border-b border-border px-4 py-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest">Live Transcript</span>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-background">
        <div className="flex flex-col gap-4 pb-4">
          {isStarting && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Connecting to scenario...</span>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8 mt-1 border border-primary/20">
                    <AvatarImage src={scenario.avatar} />
                    <AvatarFallback>{scenario.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                {msg.sender === "user" && (
                  <div className="h-8 w-8 mt-1 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8 mt-1 border border-primary/20">
                  <AvatarImage src={scenario.avatar} />
                  <AvatarFallback>{scenario.name[0]}</AvatarFallback>
                </Avatar>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-3 flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response..."
            className="flex-1"
            disabled={isLoading || isStarting || isEnding}
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading || isStarting || isEnding}
            className="bg-primary"
            data-testid="button-send-message"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Type your response as if you're talking to the homeowner at their door
        </p>
      </div>
    </div>
  );
}
