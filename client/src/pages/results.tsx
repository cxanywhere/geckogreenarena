import { useRoute, Link, useSearch } from "wouter";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, RefreshCw, Activity, CheckCircle, Target, Lightbulb, Loader2, Award, XCircle, Play, Pause, Volume2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SkillsAnalysis } from "@/components/skills-analysis";
import type { DimensionScores, DimensionRationales, DeliveryMetrics, AcousticScores, TimestampedMoment, BetterPhrasing, MissedPoint } from "@shared/schema";

interface AIFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  tips: string[];
  passed?: boolean;
  passFailReason?: string;
  recordingUrl?: string;
  dimensionScores?: DimensionScores;
  dimensionRationales?: DimensionRationales;
  deliveryMetrics?: DeliveryMetrics;
  acousticScores?: AcousticScores;
  timestampedMoments?: TimestampedMoment[];
  betterResponses?: BetterPhrasing[];
  missedPoints?: MissedPoint[];
}

interface TranscriptMessage {
  role: string;
  content: string;
}

interface RoleplayResult {
  scenario: {
    id: string;
    name: string;
    role: string;
    difficulty: string;
    orderIndex?: number;
    chapterId?: string;
  };
  feedback: AIFeedback;
  transcript: TranscriptMessage[];
}

function markRoleplayCompleted(orderIndex: number, chapterId?: string) {
  if (!orderIndex || !chapterId) return;
  
  const storageKey = `chapter_roleplay_completed_orderindex_${chapterId}`;
  const saved = localStorage.getItem(storageKey);
  const currentSet: number[] = saved ? JSON.parse(saved) : [];
  
  if (!currentSet.includes(orderIndex)) {
    currentSet.push(orderIndex);
    localStorage.setItem(storageKey, JSON.stringify(currentSet));
  }
}

export default function ResultsPage() {
  const [, params] = useRoute("/results/:id");
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const callId = searchParams.get("callId");
  const mode = searchParams.get("mode");
  const returnTo = searchParams.get("returnTo");
  const returnPage = searchParams.get("returnPage");
  const queryClient = useQueryClient();
  
  const [result, setResult] = useState<RoleplayResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadingMessages = useMemo(() => [
    { title: "Reviewing your conversation...", subtitle: "Our AI coach is listening to every word" },
    { title: "Analyzing your technique...", subtitle: "Checking how you handled that objection" },
    { title: "Scoring your performance...", subtitle: "Top reps nail this in under 60 seconds" },
    { title: "Finding your strengths...", subtitle: "Everyone's got something they do great" },
    { title: "Preparing your feedback...", subtitle: "Personalized tips coming your way" },
    { title: "Almost there...", subtitle: "Great things take a moment to process" },
    { title: "Polishing your results...", subtitle: "Your scorecard is nearly ready" },
  ], []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchVoiceResult = async () => {
      if (mode === "voice" && callId && params?.id) {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch("/api/vapi/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roleplayId: params.id,
              callId,
              userId: user?.id,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to evaluate call");
          }

          const data = await response.json();
          setResult(data);
          localStorage.setItem("lastRoleplayResult", JSON.stringify(data));
          
          // Invalidate roleplay status and history caches so chapter and stats pages show updated data
          if (user?.id) {
            queryClient.invalidateQueries({ queryKey: ["roleplay-status", user.id] });
            queryClient.invalidateQueries({ queryKey: ["roleplay-history", user.id] });
          }
          
          if (data.feedback?.passed && data.scenario?.orderIndex) {
            markRoleplayCompleted(data.scenario.orderIndex, data.scenario.chapterId);
          }
        } catch (err: any) {
          console.error("Evaluation error:", err);
          setError(err.message || "Failed to get results");
        } finally {
          setIsLoading(false);
        }
      } else {
        const storedResult = localStorage.getItem("lastRoleplayResult");
        if (storedResult) {
          try {
            const data = JSON.parse(storedResult);
            setResult(data);
            
            if (data.feedback?.passed && data.scenario?.orderIndex) {
              markRoleplayCompleted(data.scenario.orderIndex, data.scenario.chapterId);
            }
          } catch (e) {
            console.error("Failed to parse result:", e);
          }
        }
      }
    };

    fetchVoiceResult();
  }, [callId, mode, params?.id, user?.id]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    const currentMessage = loadingMessages[loadingMessageIndex];
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <motion.div 
              className="w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#e5a100]/30 to-[#f5f3f0]/20 flex items-center justify-center relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-[#e5a100]/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Loader2 className="w-14 h-14 text-[#e5a100] animate-spin" />
            </motion.div>
            
            <motion.div
              key={loadingMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-3 text-foreground">{currentMessage.title}</h2>
              <p className="text-muted-foreground text-lg">{currentMessage.subtitle}</p>
            </motion.div>

            <div className="mt-10 flex justify-center gap-2">
              {loadingMessages.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === loadingMessageIndex ? 'bg-[#e5a100]' : 'bg-gray-300'}`}
                  animate={idx === loadingMessageIndex ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            <p className="mt-8 text-sm text-muted-foreground/70">
              This usually takes 10-20 seconds
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Evaluation Failed</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href={returnTo || "/dashboard"}>
              <Button>{returnTo ? "Continue to Chapter" : "Back to Dashboard"}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
            <p className="text-muted-foreground mb-6">Complete a roleplay to see your results here.</p>
            <Link href={returnTo || "/dashboard"}>
              <Button>{returnTo ? "Continue to Chapter" : "Back to Dashboard"}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { scenario, feedback, transcript } = result;
  const passed = feedback.passed ?? feedback.overallScore >= 70;
  const scoreColor = passed ? "text-green-500" : feedback.overallScore >= 50 ? "text-yellow-500" : "text-red-500";
  const scoreLabel = passed ? "PASSED" : "KEEP PRACTICING";

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-magenta">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          {returnTo && (
            <Link href={returnTo}>
              <Button className="bg-primary hover:bg-primary/90">
                Continue to Chapter <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            
            {/* Compact Pass/Fail Banner */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`relative overflow-hidden rounded-xl shadow-lg ${
                passed 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                  : "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
            >
              <div className="relative px-6 py-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  {passed ? (
                    <Trophy className="w-8 h-8 text-white/90" />
                  ) : (
                    <Target className="w-8 h-8 text-white/90" />
                  )}
                  <motion.h1
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-black tracking-tight"
                    data-testid="pass-fail-banner"
                  >
                    {passed ? "YOU PASSED!" : "KEEP PRACTICING"}
                  </motion.h1>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">Score:</span>
                  <span className="text-2xl font-black">{feedback.overallScore}</span>
                </div>
              </div>
            </motion.div>
             
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Performance Analysis</h1>
                  <p className="text-muted-foreground">Scenario: <span className="font-semibold text-magenta">"{scenario.name}"</span></p>
                  <p className="text-sm text-muted-foreground">{scenario.role} - {scenario.difficulty}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Score</div>
                  <div className={`text-5xl font-display font-bold ${scoreColor}`} data-testid="score-value">{feedback.overallScore}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" className="stroke-muted fill-none stroke-[12]" />
                      <motion.circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        className={`fill-none stroke-[12] ${passed ? "stroke-green-500" : "stroke-yellow-500"}`}
                        strokeDasharray={2 * Math.PI * 88}
                        initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - feedback.overallScore / 100) }}
                        transition={{ duration: 1, delay: 0.5 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      {passed ? (
                        <Trophy className="w-10 h-10 text-green-500 mb-1" />
                      ) : (
                        <Target className="w-10 h-10 text-yellow-500 mb-1" />
                      )}
                      <span className="text-sm font-bold text-muted-foreground">{passed ? "Certified!" : "Practice More"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" /> What You Did Well
                    </h4>
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-yellow-600">
                      <Target className="w-4 h-4" /> Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {feedback.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {feedback.recordingUrl && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-magenta" /> Call Recording
                </h3>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-14 h-14"
                    onClick={togglePlayback}
                    data-testid="button-play-recording"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <audio
                      ref={audioRef}
                      src={feedback.recordingUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full"
                      controls
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-magenta" /> Key Moments
              </h3>
              <div className="space-y-3">
                {feedback.keyMoments.map((moment, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-magenta/10 flex items-center justify-center text-xs font-bold text-magenta">
                        {i + 1}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{moment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> Tips for Next Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <SkillsAnalysis
              dimensionScores={feedback.dimensionScores}
              dimensionRationales={feedback.dimensionRationales}
              deliveryMetrics={feedback.deliveryMetrics}
              acousticScores={feedback.acousticScores}
              timestampedMoments={feedback.timestampedMoments}
              betterResponses={feedback.betterResponses}
              missedPoints={feedback.missedPoints}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-[500px]">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-lg">Conversation Transcript</h3>
                <p className="text-xs text-muted-foreground">
                  {transcript.filter((msg, idx) => {
                    if (idx === 0 && (
                      msg.content.includes("CHARACTER PROFILE") ||
                      msg.content.includes("BEHAVIOR GUIDELINES") ||
                      msg.content.includes("playing the role of") ||
                      msg.content.includes("WHAT THE REP SHOULD DO")
                    )) return false;
                    return true;
                  }).length} messages
                </p>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {transcript
                    .filter((msg, idx) => {
                      // Skip first message if it's the system prompt (contains training instructions)
                      if (idx === 0 && (
                        msg.content.includes("CHARACTER PROFILE") ||
                        msg.content.includes("BEHAVIOR GUIDELINES") ||
                        msg.content.includes("playing the role of") ||
                        msg.content.includes("WHAT THE REP SHOULD DO")
                      )) {
                        return false;
                      }
                      return true;
                    })
                    .map((msg, idx) => {
                      // Determine if this is a user (sales rep) message
                      // VAPI uses "user" for human, "assistant"/"model"/"bot" for AI
                      const isUserMessage = msg.role === "user";
                      
                      return (
                        <div key={idx} className={`flex gap-3 ${isUserMessage ? "flex-row-reverse" : ""}`}>
                          <Avatar className="h-7 w-7 border border-border flex-shrink-0">
                            <AvatarFallback className={`text-[10px] ${isUserMessage ? "bg-primary/20" : "bg-muted"}`}>
                              {isUserMessage ? "YOU" : "HO"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1 max-w-[85%]">
                            <span className={`text-[10px] font-medium ${isUserMessage ? "text-right" : "text-left"} text-muted-foreground`}>
                              {isUserMessage ? "You (Sales Rep)" : "Buyer"}
                            </span>
                            <div className={`text-sm p-3 rounded-xl ${
                              isUserMessage 
                                ? "bg-primary text-primary-foreground rounded-tr-none" 
                                : "bg-muted text-foreground rounded-tl-none"
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/chat/${scenario.id}`}>
                <Button variant="outline" className="w-full" data-testid="button-retry-roleplay">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button className="w-full">
                  <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
