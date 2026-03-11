import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { 
  ChevronLeft, ChevronRight, Play, Square, Clock, Presentation,
  ArrowLeft, Mic, MicOff, Lightbulb, CheckCircle2, Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PitchDeckSlide {
  id: string;
  deckId: string;
  slideOrder: number;
  title: string;
  subtitle: string;
  content: string;
  talkingPoints: string[];
  evaluationCriteria: string[];
  imageUrl: string;
  slideType: string;
}

interface PitchDeckWithSlides {
  id: string;
  slug: string;
  clientName: string;
  buyerName: string;
  buyerRole: string;
  buyerContext: string;
  description: string;
  difficulty: string;
  slideCount: number;
  slides: PitchDeckSlide[];
}

type SessionState = "idle" | "active" | "evaluating";

export default function PitchSessionPage() {
  const [, params] = useRoute("/pitch-session/:slug");
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const slug = params?.slug;

  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTalkingPoints, setShowTalkingPoints] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: deck, isLoading } = useQuery<PitchDeckWithSlides>({
    queryKey: ["/api/pitch-decks", slug],
    queryFn: async () => {
      const res = await fetch(`/api/pitch-decks/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch deck");
      return res.json();
    },
    enabled: !!slug,
  });

  const createSession = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/pitch-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deckId: deck?.id }),
      });
      if (!res.ok) throw new Error("Failed to create session");
      return res.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      setSessionState("active");
      setCurrentSlide(0);
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      toast({ title: "Practice Started", description: "Present each slide as if you're in a real client meeting." });
    },
  });

  const endSession = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No session");
      if (timerRef.current) clearInterval(timerRef.current);
      
      await fetch(`/api/pitch-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed", durationSeconds: elapsedSeconds }),
      });

      setSessionState("evaluating");

      const evalRes = await fetch(`/api/pitch-sessions/${sessionId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ transcript: "(Practice session - slide-by-slide review mode)" }),
      });
      if (!evalRes.ok) throw new Error("Evaluation failed");
      return evalRes.json();
    },
    onSuccess: () => {
      setLocation(`/pitch-results/${sessionId}`);
    },
    onError: () => {
      setLocation(`/pitch-results/${sessionId}`);
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const goToSlide = (index: number) => {
    if (!deck) return;
    const clamped = Math.max(0, Math.min(index, deck.slides.length - 1));
    setCurrentSlide(clamped);
    setShowTalkingPoints(false);
  };

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

  if (!deck) {
    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <Nav />
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="text-[#787774]">Deck not found</p>
        </div>
      </div>
    );
  }

  const slide = deck.slides[currentSlide];

  if (sessionState === "evaluating") {
    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <Nav />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="animate-spin h-8 w-8 border-2 border-[#37352f] border-t-transparent rounded-full" />
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Evaluating Your Pitch...</h2>
          <p className="text-sm text-[#787774]">AI is analyzing your presentation performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Nav />
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setLocation("/pitch-practice")}
            className="flex items-center gap-1.5 text-sm text-[#787774] hover:text-[#37352f] transition-colors"
            data-testid="button-back-to-decks"
          >
            <ArrowLeft className="h-4 w-4" />
            All Decks
          </button>
          {sessionState === "active" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-[#787774]">
                <Clock className="h-4 w-4" />
                <span className="font-mono" data-testid="text-timer">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="text-sm font-medium text-[#37352f]" data-testid="text-slide-counter">
                Slide {currentSlide + 1} of {deck.slides.length}
              </div>
            </div>
          )}
        </div>

        {sessionState === "idle" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] p-8 text-white">
                <h2 className="text-xl font-bold mb-1">{deck.clientName}</h2>
                <p className="text-sm text-blue-200">LinkedIn Ads Pilot Proposal</p>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#787774] mb-4">{deck.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-[#787774]">
                    <Presentation className="h-4 w-4" />
                    <span>{deck.slides.length} slides</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#787774]">
                    <Clock className="h-4 w-4" />
                    <span>~{Math.ceil(deck.slides.length * 0.8)} minutes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[#e8e8e5] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#1a1a1a] mb-3">Your Buyer</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#37352f] text-white flex items-center justify-center text-sm font-medium">
                    {deck.buyerName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{deck.buyerName}</p>
                    <p className="text-xs text-[#787774]">{deck.buyerRole}</p>
                  </div>
                </div>
                <p className="text-xs text-[#787774] line-clamp-4">{deck.buyerContext}</p>
              </div>

              <div className="bg-white border border-[#e8e8e5] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#1a1a1a] mb-3">How It Works</h3>
                <div className="space-y-2 text-sm text-[#787774]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Navigate through each slide using the controls</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use talking points as a guide for what to cover</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>End the session to get your AI evaluation</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => createSession.mutate()}
                disabled={createSession.isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#37352f] text-white py-3 rounded-xl font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                data-testid="button-start-practice"
              >
                <Play className="h-5 w-5" />
                {createSession.isPending ? "Starting..." : "Start Practice"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] p-8 sm:p-12 min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
                  <div className="text-blue-300 text-xs uppercase tracking-wider mb-2">
                    {slide?.slideType === "title" ? "Title Slide" :
                     slide?.slideType === "agenda" ? "Agenda" :
                     slide?.slideType === "case-study" ? "Case Study" :
                     slide?.slideType === "proposal" ? "Proposal" :
                     slide?.slideType === "closing" ? "Closing" : "Content"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="text-slide-title">
                    {slide?.title}
                  </h2>
                  {slide?.subtitle && (
                    <p className="text-lg text-blue-200">{slide.subtitle}</p>
                  )}
                </div>
                <div className="p-4 sm:p-6 border-t border-[#e8e8e5]">
                  <p className="text-sm text-[#787774]">{slide?.content}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white border border-[#e8e8e5] rounded-xl p-3">
                <button
                  onClick={() => goToSlide(currentSlide - 1)}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[#787774] hover:bg-[#f7f7f5] disabled:opacity-30 transition-colors"
                  data-testid="button-prev-slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {deck.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentSlide
                          ? "w-6 bg-[#37352f]"
                          : i < currentSlide
                          ? "w-2 bg-[#37352f]/40"
                          : "w-2 bg-[#e8e8e5]"
                      }`}
                      data-testid={`button-slide-dot-${i}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => goToSlide(currentSlide + 1)}
                  disabled={currentSlide === deck.slides.length - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[#787774] hover:bg-[#f7f7f5] disabled:opacity-30 transition-colors"
                  data-testid="button-next-slide"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[#e8e8e5] rounded-xl p-4">
                <button
                  onClick={() => setShowTalkingPoints(!showTalkingPoints)}
                  className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] w-full mb-2"
                  data-testid="button-toggle-talking-points"
                >
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Talking Points
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showTalkingPoints ? "rotate-90" : ""}`} />
                </button>
                {showTalkingPoints && (
                  <ul className="space-y-2 text-sm text-[#787774]">
                    {slide?.talkingPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#37352f] mt-1 shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-white border border-[#e8e8e5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  Evaluation Criteria
                </div>
                <ul className="space-y-1.5 text-xs text-[#787774]">
                  {slide?.evaluationCriteria.map((criteria, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#c4c4c0] mt-0.5 shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#e8e8e5] rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] mb-2">
                  <Presentation className="h-4 w-4 text-[#787774]" />
                  Slide Deck Overview
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {deck.slides.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                        i === currentSlide
                          ? "bg-[#37352f] text-white"
                          : "text-[#787774] hover:bg-[#f7f7f5]"
                      }`}
                    >
                      <span className="font-medium">{i + 1}.</span> {s.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => endSession.mutate()}
                disabled={endSession.isPending}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                data-testid="button-end-session"
              >
                <Square className="h-4 w-4" />
                {endSession.isPending ? "Ending..." : "End Session & Evaluate"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
