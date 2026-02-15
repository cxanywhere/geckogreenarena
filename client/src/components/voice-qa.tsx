import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2, X, MessageCircleQuestion } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { motion, AnimatePresence } from "framer-motion";

interface TranscriptEntry {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface VoiceQAProps {
  chapterId: string;
  chapterTitle: string;
  currentSlideIndex: number;
  currentSlideTitle: string;
  onClose: () => void;
}

export function VoiceQA({ chapterId, chapterTitle, currentSlideIndex, currentSlideTitle, onClose }: VoiceQAProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "connecting" | "active">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const vapiRef = useRef<Vapi | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  const startCall = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      setTranscript([]);

      const [tokenResponse, contextResponse] = await Promise.all([
        fetch("/api/vapi/token"),
        fetch(`/api/chapters/${chapterId}/qa-context`),
      ]);

      if (!tokenResponse.ok) {
        throw new Error("Failed to get voice token");
      }
      if (!contextResponse.ok) {
        throw new Error("Failed to get chapter context");
      }

      const { token } = await tokenResponse.json();
      const { systemPrompt } = await contextResponse.json();

      const slideContext = `\n\nThe user is currently on Slide ${currentSlideIndex + 1}: "${currentSlideTitle}". Prioritize answering about this slide's content first, then the broader chapter.`;

      setStatus("connecting");

      const vapi = new Vapi(token);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setStatus("active");
      });

      vapi.on("call-end", () => {
        setStatus("idle");
      });

      vapi.on("speech-start", () => {
        setIsSpeaking(true);
      });

      vapi.on("speech-end", () => {
        setIsSpeaking(false);
      });

      vapi.on("volume-level", (level: number) => {
        setVolume(level);
      });

      vapi.on("message", (message: any) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          setTranscript(prev => [
            ...prev,
            {
              role: message.role === "assistant" ? "assistant" : "user",
              content: message.transcript,
              timestamp: Date.now(),
            }
          ]);
        }
      });

      vapi.on("error", (err: any) => {
        console.error("VAPI QA error:", err);
        setError(err.message || "An error occurred");
        setStatus("idle");
      });

      const assistantConfig = {
        name: "Arena Training Coach",
        firstMessage: `Hey! I'm your Arena training coach. You're on "${currentSlideTitle}" in the ${chapterTitle} chapter. What would you like to know?`,
        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          temperature: 0.7,
          messages: [
            {
              role: "system" as const,
              content: systemPrompt + slideContext,
            }
          ]
        },
        voice: {
          provider: "11labs" as const,
          voiceId: "pNInz6obpgDQGcFmaJgB",
        },
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "en-US" as const,
        },
      };

      await vapi.start(assistantConfig);
    } catch (err: any) {
      console.error("Start QA call error:", err);
      setError(err.message || "Failed to start voice Q&A");
      setStatus("idle");
    }
  }, [chapterId, chapterTitle, currentSlideIndex, currentSlideTitle]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setStatus("idle");
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      vapiRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const handleClose = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    onClose();
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      data-testid="voice-qa-panel"
    >
      <div className="bg-navy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <MessageCircleQuestion className="w-4 h-4 text-magenta shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">Ask a Question</h3>
            <p className="text-[10px] text-white/60 truncate">{chapterTitle} — Slide {currentSlideIndex + 1}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleClose}
          data-testid="button-close-qa"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div
        ref={transcriptContainerRef}
        className="h-[240px] overflow-y-auto px-4 py-3 space-y-3 bg-background"
      >
        {status === "idle" && transcript.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-magenta/10 flex items-center justify-center">
              <Mic className="w-6 h-6 text-magenta" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Voice Q&A</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap the button below to start a conversation with your training coach
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => setError(null)}
                data-testid="button-dismiss-error"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {(status === "loading" || status === "connecting") && transcript.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-8 h-8 text-magenta animate-spin" />
            <p className="text-xs text-muted-foreground">
              {status === "loading" ? "Preparing..." : "Connecting to coach..."}
            </p>
          </div>
        )}

        {transcript.map((entry, i) => (
          <div
            key={i}
            className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                entry.role === "user"
                  ? "bg-magenta text-white rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
              data-testid={`transcript-${entry.role}-${i}`}
            >
              {entry.content}
            </div>
          </div>
        ))}

        <AnimatePresence>
          {isSpeaking && status === "active" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-magenta rounded-full"
                      animate={{
                        height: [4, 12, 4],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">Coach speaking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-3 border-t border-border bg-card flex items-center justify-center gap-3">
        {status === "idle" ? (
          <Button
            onClick={startCall}
            className="bg-magenta hover:bg-magenta/90 text-white gap-2 rounded-full px-6"
            data-testid="button-start-qa"
          >
            <Phone className="w-4 h-4" />
            Start Conversation
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-10 w-10 ${isMuted ? "bg-destructive/10 border-destructive text-destructive" : ""}`}
              onClick={toggleMute}
              disabled={status !== "active"}
              data-testid="button-mute-qa"
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            {status === "active" && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-magenta/30 transition-all duration-100"
                    style={{
                      height: `${Math.max(4, Math.min(20, volume * 30 * (1 + Math.random() * 0.5)))}px`,
                      backgroundColor: volume > 0.1 ? "hsl(var(--magenta))" : undefined,
                    }}
                  />
                ))}
              </div>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={endCall}
              disabled={status === "loading" || status === "connecting"}
              data-testid="button-end-qa"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
