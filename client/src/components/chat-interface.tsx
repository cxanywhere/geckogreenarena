import { useState, useRef, useEffect } from "react";
import { Message, Character } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatInterfaceProps {
  character: Character;
}

export function ChatInterface({ character }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Systems online. I am ${character.name}. Seeking input parameters.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Processing input: "${userMsg.text}". My algorithms suggest a 98% probability of interesting conversation. Proceed.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={character.avatar} />
              <AvatarFallback>{character.name[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground leading-none">{character.name}</h3>
            <span className="text-xs text-primary font-mono">{character.role} // ONLINE</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-muted/5">
        <div className="flex flex-col gap-4 pb-4">
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
                    <AvatarImage src={character.avatar} />
                    <AvatarFallback>{character.name[0]}</AvatarFallback>
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
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-white border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted/30 border-primary/20 focus-visible:ring-primary/30 font-sans"
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
