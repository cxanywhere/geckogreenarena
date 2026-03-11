import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2, Clock, Lightbulb, ChevronDown, ChevronUp, Settings } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { motion, AnimatePresence } from "framer-motion";

interface VapiRoleplayConfig {
  id: string;
  name: string;
  role: string;
  phase: string;
  context: string;
  objection: string;
  passCriteria: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resistanceLevel: number;
  buySignal: number;
  traits: string[];
  durationSeconds?: number;
  isCertification?: boolean;
}

interface TranscriptEntry {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface VoiceRoleplayProps {
  roleplayId: string;
  config: VapiRoleplayConfig;
  onComplete: (callId: string) => void;
  onCancel: () => void;
  userId?: string;
  attemptNumber?: number;
  scriptHint?: string;
}

export function VoiceRoleplay({ roleplayId, config, onComplete, onCancel, userId, attemptNumber = 1, scriptHint }: VoiceRoleplayProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "ending">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(config.durationSeconds || 60);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem("preferredMicrophoneId") || "";
  });
  
  const vapiRef = useRef<Vapi | null>(null);
  const callIdRef = useRef<string | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const selectedDeviceIdRef = useRef(selectedDeviceId);
  useEffect(() => {
    selectedDeviceIdRef.current = selectedDeviceId;
  }, [selectedDeviceId]);

  // Save to localStorage when user changes microphone selection
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    localStorage.setItem("preferredMicrophoneId", deviceId);
  };

  // Enumerate available audio input devices
  useEffect(() => {
    const enumerateDevices = async () => {
      try {
        // Request mic permission first to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === "audioinput");
        setAudioDevices(audioInputs);
        
        const savedDeviceId = selectedDeviceIdRef.current;
        
        // Check if saved device still exists
        if (savedDeviceId) {
          const savedDeviceExists = audioInputs.some(d => d.deviceId === savedDeviceId);
          if (!savedDeviceExists) {
            // Saved device no longer available - fall back to default
            const defaultDevice = audioInputs.find(d => d.deviceId === "default") || audioInputs[0];
            if (defaultDevice) {
              setSelectedDeviceId(defaultDevice.deviceId);
              localStorage.setItem("preferredMicrophoneId", defaultDevice.deviceId);
            }
          }
        } else if (audioInputs.length > 0) {
          // No saved preference - use default
          const defaultDevice = audioInputs.find(d => d.deviceId === "default") || audioInputs[0];
          setSelectedDeviceId(defaultDevice.deviceId);
          localStorage.setItem("preferredMicrophoneId", defaultDevice.deviceId);
        }
      } catch (err) {
        console.error("Failed to enumerate audio devices:", err);
      }
    };
    
    enumerateDevices();
    
    // Re-enumerate when devices change (validates saved device still exists)
    navigator.mediaDevices.addEventListener("devicechange", enumerateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", enumerateDevices);
    };
  }, []);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  // Track if timer has already triggered auto-end
  const hasAutoEndedRef = useRef(false);
  
  // Countdown timer effect
  useEffect(() => {
    if (status === "active") {
      // Reset timer when call becomes active
      setTimeRemaining(config.durationSeconds || 60);
      setShowTimeWarning(false);
      hasAutoEndedRef.current = false;
      
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Show warning at 10 seconds
          if (newTime === 10) {
            setShowTimeWarning(true);
          }
          
          // Auto-end call at 0 (only once)
          if (newTime <= 0 && !hasAutoEndedRef.current) {
            hasAutoEndedRef.current = true;
            // Clear interval first
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            // End the call via VAPI
            if (vapiRef.current) {
              vapiRef.current.stop();
            }
            return 0;
          }
          
          return Math.max(0, newTime);
        });
      }, 1000);
    } else {
      // Clear timer when not active
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [status, config.durationSeconds]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buildAssistantPrompt = () => {
    const resistanceDescription = config.resistanceLevel > 70 ? "very resistant and skeptical" : 
                                   config.resistanceLevel > 40 ? "moderately resistant" : "somewhat open but cautious";
    const buySignalDescription = config.buySignal > 50 ? "showing some underlying interest" :
                                 config.buySignal > 25 ? "cautiously curious" : "not showing buying interest";

    return `You are playing the role of a B2B marketing buyer in a sales training simulation for LinkedIn Marketing Solutions (LMS).

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)

SCENARIO CONTEXT:
${config.context}

BEHAVIOR GUIDELINES:
1. START the conversation with EXACTLY this objection: "${config.objection}"
2. Stay in character as a B2B marketing buyer (Demand Gen Director, VP Marketing, CMO, or Performance Marketer) throughout
3. React realistically to the sales rep's responses based on how well they handle your objection
4. If the rep handles your objection well (acknowledges you, asks good discovery questions, connects LinkedIn to business value), gradually become slightly more open
5. If the rep pushes too hard, uses jargon, or pitches products without understanding your needs, become MORE resistant
6. Use natural, conversational language - you're a real person in a sales conversation, NOT an AI
7. Keep responses SHORT (1-3 sentences max) - this is a sales conversation, not a lecture
8. You may eventually agree to hear more or explore a pilot if they do well
9. If they do poorly, you may end the conversation or firmly decline

WHAT THE REP SHOULD DO TO PASS:
${config.passCriteria}

CRITICAL RULES:
- NEVER break character
- NEVER reveal you are an AI or part of a training simulation
- NEVER give the rep direct coaching or hints
- Respond ONLY as the buyer would in a real sales interaction
- Your FIRST message MUST be: "${config.objection}"`;
  };

  const startCall = useCallback(async () => {
    try {
      setStatus("connecting");
      setError(null);
      setTranscript([]);

      // Fetch JWT token from server
      const tokenResponse = await fetch("/api/vapi/token");
      if (!tokenResponse.ok) {
        const err = await tokenResponse.json();
        throw new Error(err.error || "Failed to get VAPI token");
      }
      const { token } = await tokenResponse.json();

      console.log("Starting VAPI call with JWT token");
      
      const vapi = new Vapi(token);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setStatus("active");
      });

      vapi.on("call-end", () => {
        setStatus("ending");
        if (callIdRef.current) {
          onComplete(callIdRef.current);
        }
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
        console.error("VAPI error:", err);
        setError(err.message || "An error occurred during the call");
        setStatus("idle");
      });

      const assistantConfig = {
        name: config.role.slice(0, 40),
        firstMessage: config.objection,
        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          temperature: 0.7,
          messages: [
            {
              role: "system" as const,
              content: buildAssistantPrompt()
            }
          ]
        },
        voice: {
          provider: "11labs" as const,
          voiceId: "21m00Tcm4TlvDq8ikWAM"
        },
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "en-US" as const
        }
      };

      // Set input device if a specific microphone is selected
      if (selectedDeviceId && selectedDeviceId !== "default") {
        try {
          await vapi.setInputDevicesAsync({ audioDeviceId: selectedDeviceId });
        } catch (deviceErr) {
          console.warn("Could not set input device, using default:", deviceErr);
        }
      }
      
      const call = await vapi.start(assistantConfig);
      if (call?.id) {
        callIdRef.current = call.id;
        
        // Register usage session for billing tracking
        if (userId) {
          try {
            const authToken = localStorage.getItem("authToken");
            await fetch("/api/usage/register-session", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
              },
              body: JSON.stringify({ roleplayId, vapiCallId: call.id })
            });
          } catch (err) {
            console.error("Failed to register usage session:", err);
          }
        }
      }
    } catch (err: any) {
      console.error("Start call error:", err);
      setError(err.message || "Failed to start voice call");
      setStatus("idle");
    }
  }, [roleplayId, config, onComplete, userId, selectedDeviceId]);

  const endCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setStatus("ending");
    if (callIdRef.current) {
      onComplete(callIdRef.current);
    }
  }, [onComplete]);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="voice-roleplay-container">
      <Card className="mb-4 border-[#e5a100]/30 bg-gradient-to-r from-[#f5f3f0]/5 to-[#e5a100]/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(config.difficulty)}`}>
                  {config.difficulty}
                </span>
                <span className="text-xs text-gray-500">{config.phase}</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900" data-testid="roleplay-title">
                {config.role}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{config.context}</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white/80 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700">Their Opening:</p>
            <p className="text-gray-800 italic">"{config.objection}"</p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {config.traits.map((trait, index) => (
              <span key={index} className="px-2 py-1 bg-[#e5a100]/10 text-[#f5f3f0] text-xs rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hint Section - Shows on 2nd attempt or later */}
      {attemptNumber >= 2 && scriptHint && status === "idle" && (
        <Card className="mb-4 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardContent className="p-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between text-left"
              data-testid="button-toggle-hint"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="font-medium text-amber-800">Need Help?</span>
                  <span className="text-sm text-amber-600 ml-2">This is attempt #{attemptNumber}</span>
                </div>
              </div>
              {showHint ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </button>
            
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-white/80 rounded-lg border border-amber-200" data-testid="hint-content">
                    <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Script Suggestion
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{scriptHint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      )}

      <Card className="flex-1 flex flex-col min-h-0 mb-4">
        <CardContent className="flex-1 flex flex-col p-4 min-h-0">
          <div 
            ref={transcriptContainerRef}
            className="flex-1 overflow-y-auto space-y-3 min-h-0"
            data-testid="transcript-container"
          >
            {status === "idle" && transcript.length === 0 && (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#e5a100]/20 flex items-center justify-center">
                    <Phone className="w-10 h-10 text-[#f5f3f0]" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Ready to Practice?</h4>
                  <p className="text-gray-600 text-sm max-w-md mb-3">
                    Click "Start Call" to begin your voice roleplay. You'll speak directly with the AI buyer who will respond to your pitch in real-time.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>You have <strong>{formatTime(config.durationSeconds || 60)}</strong> to handle this objection</span>
                  </div>
                </div>
              </div>
            )}

            {status === "connecting" && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#e5a100] animate-spin" />
                  <p className="text-gray-600">Connecting to buyer...</p>
                </div>
              </div>
            )}

            <AnimatePresence>
              {transcript.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      entry.role === "user" 
                        ? "bg-[#e5a100] text-white rounded-br-md" 
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                    data-testid={`transcript-${entry.role}-${index}`}
                  >
                    <p className="text-sm">{entry.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {status === "active" && isSpeaking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-[#e5a100] rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" data-testid="error-message">
          {error}
        </div>
      )}

      {/* Microphone selector - only show when idle and devices available */}
      {status === "idle" && audioDevices.length > 1 && (
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Settings className="w-4 h-4" />
            <span>Microphone:</span>
          </div>
          <Select value={selectedDeviceId} onValueChange={handleDeviceChange}>
            <SelectTrigger className="w-[250px]" data-testid="select-microphone">
              <SelectValue placeholder="Select microphone" />
            </SelectTrigger>
            <SelectContent>
              {audioDevices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        {status === "idle" && (
          <>
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={startCall}
              className="px-8 bg-[#e5a100] hover:bg-[#C06825] text-white"
              data-testid="button-start-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              Start Call
            </Button>
          </>
        )}

        {status === "connecting" && (
          <Button disabled className="px-8">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </Button>
        )}

        {status === "active" && (
          <div className="flex flex-col items-center gap-4">
            {/* Countdown Timer */}
            <motion.div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold ${
                showTimeWarning 
                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                  : "bg-gray-100 text-gray-700"
              }`}
              data-testid="countdown-timer"
            >
              <Clock className={`w-5 h-5 ${showTimeWarning ? "text-amber-600" : ""}`} />
              <span>{formatTime(timeRemaining)}</span>
            </motion.div>

            {showTimeWarning && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 font-medium"
              >
                Call will disconnect shortly.
              </motion.p>
            )}

            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                animate={{ 
                  boxShadow: volume > 0.3 ? `0 0 ${volume * 30}px ${volume * 10}px rgba(132, 204, 22, 0.3)` : "none"
                }}
                style={{ borderRadius: "50%" }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className={`rounded-full w-14 h-14 ${isMuted ? "bg-red-100 border-red-300" : ""}`}
                  onClick={toggleMute}
                  data-testid="button-mute"
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 text-red-600" />
                  ) : (
                    <Mic className="w-6 h-6 text-[#f5f3f0]" />
                  )}
                </Button>
              </motion.div>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="px-6"
                data-testid="button-end-call"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Call
              </Button>
            </div>
          </div>
        )}

        {status === "ending" && (
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-2 text-[#e5a100] animate-spin" />
            <p className="text-gray-600">Processing your session...</p>
          </div>
        )}
      </div>
    </div>
  );
}
