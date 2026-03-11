import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { 
  ArrowLeft, Trophy, XCircle, ChevronDown, ChevronUp,
  CheckCircle2, AlertCircle, RotateCcw, Presentation, Target
} from "lucide-react";
import { useState } from "react";

interface PitchSession {
  id: string;
  userId: string;
  deckId: string;
  status: string;
  overallScore: number | null;
  overallFeedback: string | null;
  pilotSignedOff: number;
  durationSeconds: number;
  startedAt: string;
  endedAt: string | null;
}

interface SlideFeedback {
  id: string;
  sessionId: string;
  slideOrder: number;
  slideTitle: string;
  score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
}

export default function PitchResultsPage() {
  const [, params] = useRoute("/pitch-results/:id");
  const [, setLocation] = useLocation();
  const { authToken } = useAuth();
  const sessionId = params?.id;
  const [expandedSlides, setExpandedSlides] = useState<Set<number>>(new Set());

  const { data: session, isLoading: sessionLoading } = useQuery<PitchSession>({
    queryKey: ["/api/pitch-sessions", sessionId],
    queryFn: async () => {
      const token = authToken || localStorage.getItem("authToken");
      const res = await fetch(`/api/pitch-sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch session");
      return res.json();
    },
    enabled: !!sessionId,
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery<SlideFeedback[]>({
    queryKey: ["/api/pitch-sessions", sessionId, "feedback"],
    queryFn: async () => {
      const token = authToken || localStorage.getItem("authToken");
      const res = await fetch(`/api/pitch-sessions/${sessionId}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
    enabled: !!sessionId,
  });

  const toggleSlide = (order: number) => {
    setExpandedSlides(prev => {
      const next = new Set(prev);
      if (next.has(order)) next.delete(order);
      else next.add(order);
      return next;
    });
  };

  const scoreColor = (score: number | null) => {
    if (score === null) return "text-[#787774]";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const scoreBg = (score: number | null) => {
    if (score === null) return "bg-[#f7f7f5]";
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const isLoading = sessionLoading || feedbackLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin h-6 w-6 border-2 border-[#37352f] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const hasEvaluation = session?.overallScore != null || feedback.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Nav />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <button
          onClick={() => setLocation("/pitch-practice")}
          className="flex items-center gap-1.5 text-sm text-[#787774] hover:text-[#37352f] transition-colors mb-6"
          data-testid="button-back-to-decks"
        >
          <ArrowLeft className="h-4 w-4" />
          All Decks
        </button>

        {!hasEvaluation ? (
          <div className="bg-white border border-[#e8e8e5] rounded-xl p-12 text-center">
            <XCircle className="h-12 w-12 mx-auto text-[#c4c4c0] mb-4" />
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">No Evaluation Available</h2>
            <p className="text-sm text-[#787774] mb-6">The evaluation for this session isn't available. Try practicing again.</p>
            <button
              onClick={() => setLocation("/pitch-practice")}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#37352f] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
              data-testid="button-try-again"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white border border-[#e8e8e5] rounded-xl p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className={`h-24 w-24 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreBg(session?.overallScore ?? null)}`}>
                  <span className={`text-3xl font-bold ${scoreColor(session?.overallScore ?? null)}`} data-testid="text-overall-score">
                    {session?.overallScore ?? "—"}
                  </span>
                  <span className="text-xs text-[#787774]">/ 100</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Pitch Evaluation</h1>
                    {session?.pilotSignedOff ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full" data-testid="badge-pilot-signed">
                        <Trophy className="h-3.5 w-3.5" />
                        Pilot Signed Off
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full" data-testid="badge-pilot-rejected">
                        <XCircle className="h-3.5 w-3.5" />
                        Not Signed Off
                      </span>
                    )}
                  </div>
                  {session?.durationSeconds ? (
                    <p className="text-xs text-[#787774] mb-3">
                      Session duration: {Math.floor(session.durationSeconds / 60)}:{(session.durationSeconds % 60).toString().padStart(2, "0")}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {session?.overallFeedback && (
              <div className="bg-white border border-[#e8e8e5] rounded-xl p-6 mb-6">
                <h2 className="text-base font-semibold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#787774]" />
                  Overall Feedback
                </h2>
                <div className="text-sm text-[#787774] leading-relaxed whitespace-pre-line" data-testid="text-overall-feedback">
                  {session.overallFeedback}
                </div>
              </div>
            )}

            {feedback.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#1a1a1a] flex items-center gap-2">
                  <Presentation className="h-4 w-4 text-[#787774]" />
                  Per-Slide Breakdown
                </h2>
                {feedback.map((sf) => (
                  <div key={sf.id} className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSlide(sf.slideOrder)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#f7f7f5] transition-colors"
                      data-testid={`button-expand-slide-${sf.slideOrder}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#787774] bg-[#f7f7f5] px-2 py-1 rounded">
                          {sf.slideOrder + 1}
                        </span>
                        <span className="text-sm font-medium text-[#1a1a1a]">{sf.slideTitle}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${scoreColor(sf.score)}`}>
                          {sf.score ?? "—"}
                        </span>
                        {expandedSlides.has(sf.slideOrder) ? (
                          <ChevronUp className="h-4 w-4 text-[#787774]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#787774]" />
                        )}
                      </div>
                    </button>
                    {expandedSlides.has(sf.slideOrder) && (
                      <div className="border-t border-[#e8e8e5] p-4 space-y-4">
                        {sf.feedback && (
                          <p className="text-sm text-[#787774]">{sf.feedback}</p>
                        )}
                        {sf.strengths && sf.strengths.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-green-600 mb-1.5">Strengths</h4>
                            <ul className="space-y-1">
                              {sf.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[#787774]">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {sf.improvements && sf.improvements.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-amber-600 mb-1.5">Areas for Improvement</h4>
                            <ul className="space-y-1">
                              {sf.improvements.map((imp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[#787774]">
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setLocation("/pitch-practice")}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#37352f] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a] transition-colors"
                data-testid="button-try-again"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => setLocation("/pitch-practice")}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#e8e8e5] rounded-lg text-sm font-medium text-[#787774] hover:bg-[#f7f7f5] transition-colors"
                data-testid="button-all-decks"
              >
                <Presentation className="h-4 w-4" />
                All Decks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
