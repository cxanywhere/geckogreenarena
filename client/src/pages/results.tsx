import { useRoute, Link, useSearch } from "wouter";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, RefreshCw, Activity, CheckCircle, Target, Lightbulb, Loader2, Award, XCircle, Play, Pause, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState, useRef } from "react";

interface AIFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  tips: string[];
  passed?: boolean;
  recordingUrl?: string;
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
  };
  feedback: AIFeedback;
  transcript: TranscriptMessage[];
}

export default function ResultsPage() {
  const [, params] = useRoute("/results/:id");
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const callId = searchParams.get("callId");
  const mode = searchParams.get("mode");
  
  const [result, setResult] = useState<RoleplayResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchVoiceResult = async () => {
      if (mode === "voice" && callId && params?.id) {
        setIsLoading(true);
        setError(null);
        
        try {
          await new Promise(resolve => setTimeout(resolve, 3000));
          
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
            setResult(JSON.parse(storedResult));
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
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#84CC16]/20 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#84CC16] animate-spin" />
            </div>
            <h2 className="text-xl font-bold mb-2">Analyzing Your Performance...</h2>
            <p className="text-muted-foreground">Our AI is reviewing your conversation and preparing detailed feedback.</p>
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
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
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
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
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
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
             
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-4 ${
                  passed 
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  passed ? "bg-green-100 dark:bg-green-800" : "bg-yellow-100 dark:bg-yellow-800"
                }`}>
                  {passed ? (
                    <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <Target className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${passed ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"}`}>
                    {scoreLabel}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {passed 
                      ? "Great job handling this objection!" 
                      : "Review the feedback below to improve your technique."}
                  </p>
                </div>
              </motion.div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-display font-bold text-foreground">Performance Analysis</h1>
                  <p className="text-muted-foreground">Scenario: <span className="font-semibold text-primary">"{scenario.name}"</span></p>
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
                  <Volume2 className="w-5 h-5 text-primary" /> Call Recording
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
                <Activity className="w-5 h-5 text-primary" /> Key Moments
              </h3>
              <div className="space-y-3">
                {feedback.keyMoments.map((moment, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
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
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-[500px]">
              <div className="p-4 border-b border-border">
                <h3 className="font-bold text-lg">Conversation Transcript</h3>
                <p className="text-xs text-muted-foreground">{transcript.length} messages</p>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {transcript.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="h-7 w-7 border border-border flex-shrink-0">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {msg.role === "user" ? "YOU" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`text-sm p-3 rounded-xl max-w-[85%] ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-muted text-foreground rounded-tl-none"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
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
