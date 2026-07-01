import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import {
  Building2, Users, Target, Shield, AlertTriangle, CheckCircle2,
  ChevronRight, Mic, MicOff, Phone, PhoneOff, Loader2, ArrowLeft,
  Star, Clock, TrendingUp, DollarSign, Eye, X, Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Vapi from "@vapi-ai/web";
import { SkillsAnalysis } from "@/components/skills-analysis";
import type { DimensionScores, DimensionRationales, DeliveryMetrics, TimestampedMoment, BetterPhrasing, MissedPoint } from "@shared/schema";

interface CommitteeMember {
  id: string;
  accountId: string;
  name: string;
  title: string;
  role: string;
  influence: string;
  avatar: string;
  whatTheyCareAbout: string[];
  resistanceTriggers: string[];
  personalContext: string;
  openingLine: string;
  orderIndex: number;
}

interface AbmAccount {
  id: string;
  slug: string;
  companyName: string;
  industry: string;
  companySize: string;
  description: string;
  currentStack: string[];
  strategicInitiative: string;
  budgetSignal: string;
  decisionTimeline: string;
  members: CommitteeMember[];
}

interface MemberProgress {
  attempts: number;
  bestScore: number | null;
  passed: boolean;
  lastAttempt: string | null;
  relationshipStatus: string;
  lastFeedbackSummary: string | null;
}

interface TranscriptEntry {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface EvaluationResult {
  score: number;
  passed: boolean;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  stakeholderAlignment: string;
  objectionHandling: string;
  nextStepClarity: string;
  dimensionScores?: DimensionScores | null;
  dimensionRationales?: DimensionRationales | null;
  deliveryMetrics?: DeliveryMetrics | null;
  timestampedMoments?: TimestampedMoment[] | null;
  betterResponses?: BetterPhrasing[] | null;
  missedPoints?: MissedPoint[] | null;
}

const ROLE_ICONS: Record<string, typeof Target> = {
  "Final decision-maker": DollarSign,
  "Champion / Internal advocate": Star,
  "Technical evaluator": Eye,
  "ABM strategist": Target,
  "Budget gatekeeper": Shield,
};

const ROLE_COLORS: Record<string, string> = {
  "Final decision-maker": "#e74c3c",
  "Champion / Internal advocate": "#27ae60",
  "Technical evaluator": "#3498db",
  "ABM strategist": "#9b59b6",
  "Budget gatekeeper": "#f39c12",
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function MemberAvatar({ member, size = "md" }: { member: CommitteeMember; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-12 h-12 text-sm", lg: "w-14 h-14 text-lg" };
  const roleColor = ROLE_COLORS[member.role] || "#787774";
  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0`}
        style={{ border: `2px solid ${roleColor}` }}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ background: roleColor }}
    >
      {getInitials(member.name)}
    </div>
  );
}

export default function AbmPracticePage() {
  const { authToken } = useAuth();
  const token = authToken || localStorage.getItem("authToken");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeMember, setActiveMember] = useState<CommitteeMember | null>(null);
  const [showIntel, setShowIntel] = useState(false);
  const [vapiStatus, setVapiStatus] = useState<"idle" | "connecting" | "active" | "ending">("idle");
  const [vapiError, setVapiError] = useState<string | null>(null);
  const [vapiTranscript, setVapiTranscript] = useState<TranscriptEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuyerSpeaking, setIsBuyerSpeaking] = useState(false);
  const [buyerVolume, setBuyerVolume] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const vapiRef = useRef<any>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoEvaluateRef = useRef<(() => void) | null>(null);

  const slug = "meridian-health-systems";

  const { data: account, isLoading } = useQuery<AbmAccount>({
    queryKey: ["abm-account", slug],
    queryFn: async () => {
      const res = await fetch(`/api/abm/accounts/${slug}`);
      if (!res.ok) throw new Error("Failed to load account");
      return res.json();
    },
  });

  const { data: progress, refetch: refetchProgress } = useQuery<{ memberProgress: Record<string, MemberProgress>; committeeReadiness: number }>({
    queryKey: ["abm-progress", slug],
    queryFn: async () => {
      const res = await fetch(`/api/abm/accounts/${slug}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load progress");
      return res.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [vapiTranscript]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const buildMemberPrompt = useCallback((member: CommitteeMember, accountData: AbmAccount, priorContext?: string) => {
    let prompt = `You are ${member.name}, ${member.title} at ${accountData.companyName}. You are in a meeting with a LinkedIn Marketing Solutions sales rep who wants to sell you LinkedIn Ads.

ABOUT YOU:
- Role: ${member.role}
- Influence: ${member.influence}
- Personal context: ${member.personalContext}

ABOUT YOUR COMPANY:
- ${accountData.companyName}: ${accountData.industry}, ${accountData.companySize}
- Current marketing stack: ${accountData.currentStack.join(", ")}
- Strategic initiative: ${accountData.strategicInitiative}
- Budget signal: ${accountData.budgetSignal}
- Decision timeline: ${accountData.decisionTimeline}

WHAT YOU CARE ABOUT:
${(member.whatTheyCareAbout).map((c: string) => `- ${c}`).join("\n")}

WHAT TRIGGERS YOUR RESISTANCE:
${(member.resistanceTriggers).map((t: string) => `- ${t}`).join("\n")}`;

    if (priorContext) {
      prompt += `\n\nCOMMITTEE CONTEXT — What you've heard from colleagues:
${priorContext}
Use this context naturally. If the rep mentions something a colleague already discussed, you can reference it. If colleagues had concerns, you might echo them.`;
    }

    prompt += `\n\nBEHAVIOR INSTRUCTIONS:
1. Start the conversation with your opening line: "${member.openingLine}"
2. Stay in character throughout. You are skeptical but open-minded.
3. Ask tough questions related to your priorities.
4. Push back when the rep uses generic pitches not tailored to your role.
5. Respond positively when the rep shows genuine understanding of your needs.
6. Keep responses conversational and natural — 2-4 sentences.
7. If the rep does well, gradually show more interest and engagement.
8. Never break character or mention you are an AI.`;
    return prompt;
  }, []);

  const handleAutoEvaluate = useCallback(async () => {
    if (!sessionId || !activeMember || !token || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const transcriptText = transcriptRef.current
        .map(t => `${t.role === "user" ? "Rep" : activeMember.name || "Buyer"}: ${t.content}`)
        .join("\n");
      const res = await fetch(`/api/abm/practice-sessions/${sessionId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          transcript: transcriptText,
          durationSeconds: callDuration,
          structuredTranscript: transcriptRef.current.map(t => ({
            role: t.role === "user" ? "user" : "model",
            content: t.content,
            timestamp: t.timestamp,
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to evaluate");
      const { evaluation: evalResult } = await res.json();
      setEvaluation(evalResult);
      refetchProgress();
    } catch (err: any) {
      toast({ title: "Evaluation failed", description: err.message, variant: "destructive" });
    } finally {
      setIsEvaluating(false);
      setCallDuration(0);
      setCallStartTime(null);
    }
  }, [sessionId, activeMember, token, callDuration, isEvaluating, refetchProgress, toast]);

  useEffect(() => {
    autoEvaluateRef.current = handleAutoEvaluate;
  }, [handleAutoEvaluate]);

  const startPractice = useCallback(async (member: CommitteeMember) => {
    if (!account || !token) return;

    if (vapiRef.current) {
      try { vapiRef.current.stop(); } catch (e) {}
      vapiRef.current = null;
      await new Promise(r => setTimeout(r, 500));
    }

    setActiveMember(member);
    setEvaluation(null);
    setVapiTranscript([]);
    transcriptRef.current = [];
    setVapiError(null);

    try {
      setVapiStatus("connecting");

      const sessionRes = await fetch("/api/abm/practice-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accountId: account.id, memberId: member.id }),
      });
      if (!sessionRes.ok) throw new Error("Failed to create session");
      const session = await sessionRes.json();
      setSessionId(session.id);

      let priorContext = "";
      if (progress?.memberProgress) {
        const otherMembers = account.members.filter(m => m.id !== member.id);
        const contextLines: string[] = [];
        for (const other of otherMembers) {
          const otherProgress = progress.memberProgress[other.id];
          if (otherProgress && otherProgress.attempts > 0) {
            const status = otherProgress.relationshipStatus || "Initial contact";
            const scoreInfo = otherProgress.bestScore !== null ? ` (best score: ${otherProgress.bestScore}/100)` : "";
            let summary = `${other.name} (${other.title}) — status: ${status}${scoreInfo}`;
            if (otherProgress.lastFeedbackSummary) {
              summary += `. Last conversation summary: ${otherProgress.lastFeedbackSummary}`;
            }
            contextLines.push(`- ${summary}`);
          }
        }
        if (contextLines.length > 0) {
          priorContext = contextLines.join("\n");
        }
      }

      const tokenResponse = await fetch("/api/vapi/token");
      if (!tokenResponse.ok) throw new Error("Failed to get voice token");
      const { token: vapiToken } = await tokenResponse.json();

      const vapi = new Vapi(vapiToken);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        setVapiStatus("active");
        setCallStartTime(Date.now());
        timerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      });

      vapi.on("call-end", () => {
        setVapiStatus("idle");
        if (timerRef.current) clearInterval(timerRef.current);
        vapiRef.current = null;
        if (transcriptRef.current.length > 0) {
          autoEvaluateRef.current?.();
        }
      });

      vapi.on("speech-start", () => setIsBuyerSpeaking(true));
      vapi.on("speech-end", () => setIsBuyerSpeaking(false));
      vapi.on("volume-level", (level: number) => setBuyerVolume(level));

      vapi.on("message", (message: any) => {
        if (message.type === "transcript" && message.transcriptType === "final") {
          const entry: TranscriptEntry = {
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.transcript,
            timestamp: Date.now(),
          };
          transcriptRef.current = [...transcriptRef.current, entry];
          setVapiTranscript(prev => [...prev, entry]);
        }
      });

      vapi.on("error", (err: any) => {
        console.error("VAPI error:", err);
        setVapiError(err.message || "Voice connection error");
        setVapiStatus("idle");
      });

      const memberVoices: Record<string, string> = {
        "abm-member-cmo": "21m00Tcm4TlvDq8ikWAM",
        "abm-member-vp-demand": "pNInz6obpgDQGcFmaJgB",
        "abm-member-perf-mktg": "EXAVITQu4vr4xnSDxMaL",
        "abm-member-abm-lead": "TxGEqnHWrfWFTfGW9XjX",
        "abm-member-cfo": "VR6AewLTigWG4xSOukaG",
      };

      const assistantConfig = {
        name: `${member.name} - ${member.title}`.slice(0, 40),
        firstMessage: member.openingLine,
        model: {
          provider: "openai",
          model: "gpt-4o",
          temperature: 0.7,
          messages: [{ role: "system", content: buildMemberPrompt(member, account, priorContext || undefined) }],
        },
        voice: {
          provider: "11labs",
          voiceId: memberVoices[member.id] || "21m00Tcm4TlvDq8ikWAM",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        silenceTimeoutSeconds: 45,
        maxDurationSeconds: 600,
      };

      await vapi.start(assistantConfig);
    } catch (err: any) {
      console.error("Failed to start practice:", err);
      setVapiError(err.message || "Failed to start voice session");
      setVapiStatus("idle");
    }
  }, [account, token, buildMemberPrompt, progress]);

  const endPractice = useCallback(async () => {
    setIsBuyerSpeaking(false);
    setBuyerVolume(0);
    if (vapiRef.current) {
      vapiRef.current.stop();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVapiStatus("idle");
      handleAutoEvaluate();
    }
  }, [handleAutoEvaluate]);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      vapiRef.current.setMuted(newMuted);
    }
  }, [isMuted]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const memberProgress = progress?.memberProgress || {};
  const totalMembers = account?.members?.length || 0;
  const passedCount = Object.values(memberProgress).filter(p => p.passed).length;
  const committeeReadiness = progress?.committeeReadiness || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
        <Nav />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#787774" }} />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
        <Nav />
        <div className="flex items-center justify-center h-[80vh]">
          <p style={{ color: "#787774" }}>Account not found</p>
        </div>
      </div>
    );
  }

  if (activeMember && (vapiStatus !== "idle" || isEvaluating || evaluation)) {
    return (
      <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
        <Nav />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            data-testid="button-back-to-account"
            onClick={() => {
              if (vapiStatus === "active" || vapiStatus === "connecting") {
                endPractice();
              }
              setActiveMember(null);
              setEvaluation(null);
              setSessionId(null);
              setVapiTranscript([]);
              setCallDuration(0);
            }}
            className="flex items-center gap-2 mb-6 text-sm hover:opacity-70 transition"
            style={{ color: "#787774" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Buying Committee
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="rounded-xl border p-6" style={{ background: "white", borderColor: "#e8e8e5" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <MemberAvatar member={activeMember} size="lg" />
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: "#1a1a1a" }} data-testid="text-active-member-name">
                        {activeMember.name}
                      </h2>
                      <p className="text-sm" style={{ color: "#787774" }}>{activeMember.title}</p>
                      <span
                        className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${ROLE_COLORS[activeMember.role] || "#787774"}15`,
                          color: ROLE_COLORS[activeMember.role] || "#787774",
                        }}
                      >
                        {activeMember.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {vapiStatus === "active" && (
                      <span className="text-sm font-mono" style={{ color: "#787774" }} data-testid="text-call-duration">
                        {formatDuration(callDuration)}
                      </span>
                    )}

                    {vapiStatus === "connecting" && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: "#f7f7f5" }}>
                        <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#787774" }} />
                        <span className="text-sm" style={{ color: "#787774" }}>Connecting...</span>
                      </div>
                    )}

                    {vapiStatus === "active" && (
                      <>
                        <button
                          data-testid="button-toggle-mute"
                          onClick={toggleMute}
                          className="p-2 rounded-lg border transition hover:opacity-80"
                          style={{ borderColor: "#e8e8e5", background: isMuted ? "#fee2e2" : "white" }}
                        >
                          {isMuted ? <MicOff className="h-5 w-5" style={{ color: "#e74c3c" }} /> : <Mic className="h-5 w-5" style={{ color: "#27ae60" }} />}
                        </button>
                        <button
                          data-testid="button-end-call"
                          onClick={endPractice}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                          style={{ background: "#e74c3c" }}
                        >
                          <PhoneOff className="h-4 w-4" />
                          End Call
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {vapiStatus === "active" && (
                  <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg" style={{ background: "#f7f7f5" }}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full transition-all"
                        style={{
                          background: isBuyerSpeaking ? ROLE_COLORS[activeMember.role] || "#27ae60" : "#e8e8e5",
                          boxShadow: isBuyerSpeaking ? `0 0 8px ${ROLE_COLORS[activeMember.role] || "#27ae60"}` : "none",
                        }}
                      />
                      <span className="text-sm" style={{ color: "#787774" }}>
                        {isBuyerSpeaking ? `${activeMember.name} is speaking...` : "Waiting for response..."}
                      </span>
                    </div>
                    {isBuyerSpeaking && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 rounded-full transition-all duration-150"
                            style={{
                              height: `${Math.max(4, Math.min(20, buyerVolume * 30 * (1 + Math.sin(i * 1.5))))}px`,
                              background: ROLE_COLORS[activeMember.role] || "#27ae60",
                              opacity: buyerVolume > i * 0.15 ? 1 : 0.3,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {vapiError && (
                  <div className="mb-4 px-4 py-3 rounded-lg border" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}>
                    <p className="text-sm">{vapiError}</p>
                  </div>
                )}

                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#e8e8e5" }}>
                  <div className="px-4 py-2 border-b flex items-center justify-between" style={{ background: "#f7f7f5", borderColor: "#e8e8e5" }}>
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#787774" }}>Live Transcript</span>
                    <span className="text-xs" style={{ color: "#787774" }}>{vapiTranscript.length} messages</span>
                  </div>
                  <div className="h-[360px] overflow-y-auto p-4 space-y-3" data-testid="transcript-panel">
                    {vapiTranscript.length === 0 && vapiStatus !== "active" && !isEvaluating && (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm" style={{ color: "#787774" }}>
                          {vapiStatus === "connecting" ? "Connecting to call..." : "Transcript will appear here during the call"}
                        </p>
                      </div>
                    )}
                    <AnimatePresence>
                      {vapiTranscript.map((entry, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {entry.role === "assistant" && (
                            <MemberAvatar member={activeMember} size="sm" />
                          )}
                          <div
                            className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                            style={{
                              background: entry.role === "user" ? "#1a1a1a" : "#f7f7f5",
                              color: entry.role === "user" ? "white" : "#37352f",
                            }}
                          >
                            {entry.content}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={transcriptEndRef} />
                  </div>
                </div>
              </div>

              {isEvaluating && (
                <div className="mt-6 rounded-xl border p-8 flex flex-col items-center justify-center" style={{ background: "white", borderColor: "#e8e8e5" }}>
                  <Loader2 className="h-8 w-8 animate-spin mb-4" style={{ color: "#787774" }} />
                  <p className="font-medium" style={{ color: "#1a1a1a" }}>Evaluating your conversation...</p>
                  <p className="text-sm mt-1" style={{ color: "#787774" }}>Analyzing your approach, objection handling, and stakeholder alignment</p>
                </div>
              )}

              {evaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl border p-6"
                  style={{ background: "white", borderColor: "#e8e8e5" }}
                  data-testid="evaluation-results"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>Evaluation Results</h3>
                    <div className="flex items-center gap-3">
                      <div
                        className="text-3xl font-bold"
                        style={{ color: evaluation.score >= 70 ? "#27ae60" : evaluation.score >= 50 ? "#f39c12" : "#e74c3c" }}
                        data-testid="text-evaluation-score"
                      >
                        {evaluation.score}
                      </div>
                      <span className="text-sm" style={{ color: "#787774" }}>/100</span>
                      {evaluation.passed && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ background: "#d4edda", color: "#27ae60" }}>
                          <CheckCircle2 className="h-3 w-3" /> Passed
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "#37352f" }}>{evaluation.overallFeedback}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-lg p-4 border" style={{ borderColor: "#e8e8e5" }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#787774" }}>Stakeholder Alignment</p>
                      <p className="text-sm" style={{ color: "#37352f" }}>{evaluation.stakeholderAlignment}</p>
                    </div>
                    <div className="rounded-lg p-4 border" style={{ borderColor: "#e8e8e5" }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#787774" }}>Objection Handling</p>
                      <p className="text-sm" style={{ color: "#37352f" }}>{evaluation.objectionHandling}</p>
                    </div>
                    <div className="rounded-lg p-4 border" style={{ borderColor: "#e8e8e5" }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#787774" }}>Next Step Clarity</p>
                      <p className="text-sm" style={{ color: "#37352f" }}>{evaluation.nextStepClarity}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg p-4" style={{ background: "#f0fdf4" }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#27ae60" }}>Strengths</p>
                      <ul className="space-y-1">
                        {evaluation.strengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#37352f" }}>
                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#27ae60" }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg p-4" style={{ background: "#fff7ed" }}>
                      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "#f39c12" }}>Areas to Improve</p>
                      <ul className="space-y-1">
                        {evaluation.improvements.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#37352f" }}>
                            <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#f39c12" }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <SkillsAnalysis
                      dimensionScores={evaluation.dimensionScores}
                      dimensionRationales={evaluation.dimensionRationales}
                      deliveryMetrics={evaluation.deliveryMetrics}
                      timestampedMoments={evaluation.timestampedMoments}
                      betterResponses={evaluation.betterResponses}
                      missedPoints={evaluation.missedPoints}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      data-testid="button-retry-member"
                      onClick={() => {
                        setEvaluation(null);
                        setVapiTranscript([]);
                        transcriptRef.current = [];
                        startPractice(activeMember);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90"
                      style={{ background: "#1a1a1a" }}
                    >
                      Practice Again
                    </button>
                    <button
                      data-testid="button-back-to-committee"
                      onClick={() => {
                        setActiveMember(null);
                        setEvaluation(null);
                        setSessionId(null);
                        setVapiTranscript([]);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition hover:opacity-80"
                      style={{ borderColor: "#e8e8e5", color: "#37352f" }}
                    >
                      Back to Committee
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div>
              <div className="rounded-xl border p-5 sticky top-24" style={{ background: "white", borderColor: "#e8e8e5" }}>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#787774" }}>Stakeholder Intel</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>What They Care About</p>
                    <ul className="space-y-1">
                      {(activeMember.whatTheyCareAbout).map((c: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#37352f" }}>
                          <Target className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "#27ae60" }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>Resistance Triggers</p>
                    <ul className="space-y-1">
                      {(activeMember.resistanceTriggers).map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#37352f" }}>
                          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "#e74c3c" }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>Context</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#37352f" }}>{activeMember.personalContext}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>Their Opening Line</p>
                    <p className="text-xs italic leading-relaxed" style={{ color: "#37352f" }}>"{activeMember.openingLine}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5" style={{ color: "#787774" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#787774" }}>ABM Practice</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1a1a1a" }} data-testid="text-account-name">{account.companyName}</h1>
          <p className="text-sm" style={{ color: "#787774" }}>{account.industry} &middot; {account.companySize}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 rounded-xl border p-6" style={{ background: "white", borderColor: "#e8e8e5" }}>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "#787774" }}>Account Overview</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#37352f" }}>{account.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#787774" }}>Strategic Initiative</p>
                <p className="text-sm" style={{ color: "#37352f" }}>{account.strategicInitiative}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#787774" }}>Budget Signal</p>
                <p className="text-sm" style={{ color: "#37352f" }}>{account.budgetSignal}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#787774" }}>Decision Timeline</p>
                <p className="text-sm" style={{ color: "#37352f" }}>{account.decisionTimeline}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#787774" }}>Current Stack</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {account.currentStack.map((tool, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "#e8e8e5", color: "#37352f" }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6" style={{ background: "white", borderColor: "#e8e8e5" }}>
            <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#787774" }}>Committee Readiness</h2>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="text-4xl font-bold"
                style={{ color: committeeReadiness >= 70 ? "#27ae60" : committeeReadiness >= 40 ? "#f39c12" : "#e74c3c" }}
                data-testid="text-readiness-score"
              >
                {committeeReadiness}%
              </div>
            </div>
            <p className="text-xs mb-4" style={{ color: "#787774" }}>
              {committeeReadiness >= 70 ? "Ready to engage the full committee" :
               committeeReadiness >= 40 ? "Making progress — keep practicing" :
               "Build more relationships to improve readiness"}
            </p>
            <div className="w-full h-2 rounded-full mb-4" style={{ background: "#e8e8e5" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${committeeReadiness}%`,
                  background: committeeReadiness >= 70 ? "#27ae60" : committeeReadiness >= 40 ? "#f39c12" : "#e74c3c",
                }}
              />
            </div>
            <div className="flex items-center gap-3 mb-4 text-sm">
              <div data-testid="text-progress-count" style={{ color: "#1a1a1a" }}>
                <span className="font-bold">{passedCount}/{totalMembers}</span>
                <span className="ml-1" style={{ color: "#787774" }}>passed</span>
              </div>
            </div>
            <div className="space-y-2">
              {account.members.map(m => {
                const mp = memberProgress[m.id];
                const status = mp?.relationshipStatus || "Not yet engaged";
                return (
                  <div key={m.id} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#37352f" }}>{m.name.split(" ")[0]}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: status === "Champion" ? "#d4edda" :
                                   status === "Building rapport" ? "#fff3cd" :
                                   status === "Initial contact" ? "#e8f4fd" : "#f7f7f5",
                        color: status === "Champion" ? "#27ae60" :
                               status === "Building rapport" ? "#f39c12" :
                               status === "Initial contact" ? "#3498db" : "#787774",
                      }}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6 mb-8" style={{ background: "white", borderColor: "#e8e8e5" }} data-testid="committee-intel-panel">
          <h2 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: "#787774" }}>Committee Intel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "#787774" }}>Influence Map</p>
              <div className="space-y-2">
                {account.members.map(m => {
                  const influenceColor = m.influence.toLowerCase().includes("final") || m.influence.toLowerCase().includes("decision") ? "#e74c3c" :
                                         m.influence.toLowerCase().includes("champion") || m.influence.toLowerCase().includes("advocate") ? "#27ae60" :
                                         m.influence.toLowerCase().includes("gate") ? "#f39c12" : "#3498db";
                  return (
                    <div key={m.id} className="flex items-center justify-between text-xs">
                      <span style={{ color: "#37352f" }}>{m.name.split(" ")[0]}</span>
                      <span className="px-2 py-0.5 rounded-full" style={{ background: `${influenceColor}15`, color: influenceColor }}>
                        {m.influence.length > 25 ? m.influence.substring(0, 25) + "..." : m.influence}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "#787774" }}>Decision Process</p>
              <ul className="space-y-2 text-xs" style={{ color: "#37352f" }}>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: "#3498db" }}>1</span>
                  Performance Marketing Manager evaluates platform capabilities
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: "#3498db" }}>2</span>
                  VP Demand Gen champions the solution internally
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: "#3498db" }}>3</span>
                  ABM Lead validates targeting and account-level fit
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: "#3498db" }}>4</span>
                  CFO approves budget based on ROI case
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold mt-0.5" style={{ color: "#3498db" }}>5</span>
                  CMO makes final strategic decision
                </li>
              </ul>
            </div>
            <div className="rounded-lg p-4" style={{ background: "#f7f7f5" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "#787774" }}>Key Dates & Signals</p>
              <div className="space-y-3 text-xs" style={{ color: "#37352f" }}>
                <div>
                  <p className="font-medium" style={{ color: "#787774" }}>Timeline</p>
                  <p>{account.decisionTimeline}</p>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "#787774" }}>Budget Signal</p>
                  <p>{account.budgetSignal}</p>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "#787774" }}>Strategic Priority</p>
                  <p>{account.strategicInitiative}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "#787774" }} />
            <h2 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>Buying Committee</h2>
          </div>
          <span className="text-sm" style={{ color: "#787774" }}>{totalMembers} stakeholders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="committee-grid">
          {account.members.map((member) => {
            const mp = memberProgress[member.id];
            const RoleIcon = ROLE_ICONS[member.role] || Target;
            const roleColor = ROLE_COLORS[member.role] || "#787774";

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: member.orderIndex * 0.05 }}
                className="rounded-xl border p-5 hover:shadow-md transition-shadow cursor-pointer group"
                style={{ background: "white", borderColor: "#e8e8e5" }}
                data-testid={`card-member-${member.id}`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <MemberAvatar member={member} size="md" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate" style={{ color: "#1a1a1a" }}>{member.name}</h3>
                    <p className="text-xs truncate" style={{ color: "#787774" }}>{member.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <RoleIcon className="h-3 w-3" style={{ color: roleColor }} />
                      <span className="text-xs font-medium" style={{ color: roleColor }}>{member.role}</span>
                    </div>
                  </div>
                  {mp?.passed && (
                    <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#27ae60" }} />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>Top Priorities</p>
                  <ul className="space-y-1">
                    {(member.whatTheyCareAbout).slice(0, 3).map((c: string, i: number) => (
                      <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#37352f" }}>
                        <span style={{ color: "#27ae60" }}>&bull;</span>
                        <span className="line-clamp-1">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium mb-1.5" style={{ color: "#787774" }}>Watch Out For</p>
                  <ul className="space-y-1">
                    {(member.resistanceTriggers).slice(0, 2).map((t: string, i: number) => (
                      <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#37352f" }}>
                        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "#e74c3c" }} />
                        <span className="line-clamp-1">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {mp ? (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: mp.relationshipStatus === "Champion" ? "#d4edda" :
                                     mp.relationshipStatus === "Building rapport" ? "#fff3cd" :
                                     mp.relationshipStatus === "Initial contact" ? "#e8f4fd" : "#f7f7f5",
                          color: mp.relationshipStatus === "Champion" ? "#27ae60" :
                                 mp.relationshipStatus === "Building rapport" ? "#f39c12" :
                                 mp.relationshipStatus === "Initial contact" ? "#3498db" : "#787774",
                        }}
                        data-testid={`text-status-${member.id}`}
                      >
                        {mp.relationshipStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-1" style={{ color: "#787774" }}>
                      <span>{mp.attempts} attempt{mp.attempts !== 1 ? "s" : ""}</span>
                      {mp.bestScore !== null && <span>Best: {mp.bestScore}/100</span>}
                    </div>
                    {mp.lastFeedbackSummary && (
                      <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "#787774" }} data-testid={`text-feedback-${member.id}`}>
                        {mp.lastFeedbackSummary}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: "#f7f7f5", color: "#787774" }}
                      data-testid={`text-status-${member.id}`}
                    >
                      Not yet engaged
                    </span>
                  </div>
                )}

                <button
                  data-testid={`button-practice-${member.id}`}
                  onClick={() => startPractice(member)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 group-hover:shadow-sm"
                  style={{ background: "#1a1a1a" }}
                >
                  <Mic className="h-4 w-4" />
                  Practice with {member.name.split(" ")[0]}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
