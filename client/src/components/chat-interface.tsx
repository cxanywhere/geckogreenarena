import { useState, useRef, useEffect } from "react";
import { Message, RoleplayScenario } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles, Mic, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatInterfaceProps {
  scenario: RoleplayScenario;
}

export function ChatInterface({ scenario }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: `Roleplay initiated: ${scenario.name}. I am playing the role of ${scenario.role}. Let's begin.`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
        text: `(Simulating ${scenario.role} response based on ${scenario.traits.join(", ")}...) Interesting point. Tell me more.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording and send simulated voice message
      setIsRecording(false);
      
      // Simulate processing voice input
      const userMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: "I understand that objection, but let me show you...", // Simulated speech-to-text
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMsg]);
      
      // Simulate AI response after delay
      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `(Simulating ${scenario.role} response based on ${scenario.traits.join(", ")}...) I see what you mean. Go on.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1500);
      
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-10rem)] lg:h-[80vh] bg-white rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
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
            <h3 className="font-display font-bold text-foreground leading-none">{scenario.name}</h3>
            <span className="text-xs text-primary font-mono">{scenario.role} // ONLINE</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Volume2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Sparkles className="h-5 w-5" />
            </Button>
        </div>
      </div>

      {/* Messages / Transcript */}
      <div className="bg-muted/10 border-b border-border px-4 py-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest">Live Transcript</span>
      </div>
      
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
                      ? "bg-white border border-border text-foreground rounded-tr-none"
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

      {/* Voice Controls */}
      <div className="p-6 bg-white border-t border-border flex flex-col items-center justify-center gap-4">
        {isRecording ? (
           <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="flex flex-col items-center gap-2 w-full"
          >
             <div className="flex items-center justify-center gap-1 h-12 w-full max-w-[200px]">
               {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                 <motion.div 
                   key={i}
                   animate={{ height: [10, 32, 10] }}
                   transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                   className="w-1.5 bg-primary rounded-full"
                 />
               ))}
             </div>
             <span className="text-sm font-bold text-primary animate-pulse">Listening...</span>
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground font-medium">Tap microphone to start speaking</p>
        )}
        
        <Button 
          type="button" 
          size="lg"
          onClick={toggleRecording}
          className={`h-16 w-16 rounded-full transition-all duration-300 shadow-xl border-4 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 border-red-100 animate-pulse' 
              : 'bg-primary hover:bg-primary/90 border-primary/20 hover:scale-105'
          }`}
        >
          <Mic className={`h-8 w-8 ${isRecording ? 'text-white' : 'text-white'}`} />
        </Button>
      </div>
    </div>
  );
}
