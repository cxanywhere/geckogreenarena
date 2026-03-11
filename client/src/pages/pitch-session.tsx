import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { 
  ChevronLeft, ChevronRight, Play, Square, Clock, Presentation,
  ArrowLeft, Lightbulb, CheckCircle2, Info, GraduationCap,
  Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  narrationScript: string | null;
  narrationAudioUrl: string | null;
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

function ProPitchMode({ deck, onClose }: { deck: PitchDeckWithSlides; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const shouldAutoPlayRef = useRef(false);
  const autoAdvanceRef = useRef(true);

  const slide = deck.slides[currentSlide];
  const totalSlides = deck.slides.length;
  const hasNarration = deck.slides.some(s => s.narrationAudioUrl);

  useEffect(() => {
    if (!hasNarration) {
      setIsGenerating(true);
      fetch(`/api/pitch-decks/${deck.slug}/generate-narration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skipExisting: true }),
      }).then(() => {
        const pollInterval = setInterval(async () => {
          try {
            const res = await fetch(`/api/pitch-decks/${deck.slug}`);
            const data = await res.json();
            const readyCount = data.slides?.filter((s: any) => s.narrationAudioUrl)?.length || 0;
            if (readyCount >= data.slides?.length) {
              clearInterval(pollInterval);
              setIsGenerating(false);
              window.location.reload();
            }
          } catch {}
        }, 5000);
        return () => clearInterval(pollInterval);
      });
    }
  }, [hasNarration, deck.slug]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioReady(false);
    setProgress(0);
    setDuration(0);

    const willAutoPlay = shouldAutoPlayRef.current;

    if (slide?.narrationAudioUrl) {
      const audio = new Audio(slide.narrationAudioUrl);
      audioRef.current = audio;
      audio.muted = isMuted;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setAudioReady(true);
      });

      audio.addEventListener("canplaythrough", () => {
        setAudioReady(true);
        if (willAutoPlay) {
          audio.play().catch(console.error);
          setIsPlaying(true);
        }
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(100);
        if (autoAdvanceRef.current && currentSlide < totalSlides - 1) {
          setTimeout(() => {
            shouldAutoPlayRef.current = true;
            setCurrentSlide(prev => prev + 1);
          }, 1200);
        }
      });

      audio.addEventListener("error", () => {
        setAudioReady(true);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSlide, slide?.narrationAudioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(isNaN(pct) ? 0 : pct);
        }
      }, 100);
    } else {
      if (audioRef.current) audioRef.current.pause();
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      shouldAutoPlayRef.current = true;
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const startPresentation = useCallback(() => {
    shouldAutoPlayRef.current = true;
    setCurrentSlide(0);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": e.preventDefault(); togglePlay(); break;
        case "ArrowRight": if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1); break;
        case "ArrowLeft": if (currentSlide > 0) goToSlide(currentSlide - 1); break;
        case "Escape": onClose(); break;
        case "m": setIsMuted(prev => !prev); break;
        case "c": setShowScript(prev => !prev); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, currentSlide, totalSlides, goToSlide, onClose]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = audioRef.current?.currentTime || 0;

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0f2e] flex flex-col items-center justify-center gap-6" data-testid="pro-pitch-generating">
        <Loader2 className="h-12 w-12 text-[#0A66C2] animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Preparing Your Pro Pitch</h2>
          <p className="text-white/60 text-sm max-w-md">
            Our AI is generating a compelling sales narration for each slide. This takes a few minutes the first time...
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 rounded-lg transition-colors"
          data-testid="button-cancel-generation"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0f2e] flex flex-col" data-testid="pro-pitch-overlay">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${showScript ? "bg-[#0A66C2] text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
          onClick={() => setShowScript(prev => !prev)}
          data-testid="button-toggle-cc"
        >
          CC
        </button>
        <button
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          onClick={onClose}
          data-testid="button-close-pro-pitch"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute top-4 left-4 z-50">
        <div className="text-white/50 text-sm">{deck.clientName} Proposal — Pro Pitch</div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex items-center justify-center p-4"
          >
            {slide?.imageUrl ? (
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                data-testid={`pro-pitch-slide-image-${currentSlide}`}
              />
            ) : (
              <div className="max-w-3xl w-full bg-gradient-to-br from-[#0A66C2] to-[#004182] rounded-2xl p-8 sm:p-12 shadow-2xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{slide?.title}</h2>
                {slide?.subtitle && <p className="text-lg text-blue-200 mb-4">{slide.subtitle}</p>}
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{slide?.content}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {showScript && slide?.narrationScript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl w-[calc(100%-2rem)] sm:w-full"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 sm:p-4 text-white/90 text-xs sm:text-sm leading-relaxed max-h-32 overflow-y-auto">
              {slide.narrationScript}
            </div>
          </motion.div>
        )}

        {!isPlaying && currentSlide === 0 && progress === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <button
              onClick={startPresentation}
              className="flex items-center gap-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 py-5 text-lg font-semibold shadow-xl transition-colors"
              data-testid="button-start-pro-pitch"
            >
              <Play className="h-6 w-6" />
              Watch Pro Pitch
            </button>
          </motion.div>
        )}
      </div>

      <div className="bg-black/60 backdrop-blur-md border-t border-white/10 px-3 sm:px-6 py-2 sm:py-3">
        <div className="w-full mb-2 sm:mb-3 cursor-pointer group" onClick={(e) => {
          if (audioRef.current && duration > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = pct * duration;
            setProgress(pct * 100);
          }
        }}>
          <div className="h-1 bg-white/20 rounded-full group-hover:h-1.5 transition-all">
            <div
              className="h-full bg-[#0A66C2] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-1 text-white/50 text-sm min-w-[80px]">
            {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:--"}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-colors disabled:opacity-30"
              onClick={() => goToSlide(currentSlide - 1)}
              disabled={currentSlide === 0}
              data-testid="button-pro-skip-back"
            >
              <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button
              className="text-white hover:bg-[#0A66C2]/30 rounded-full h-10 w-10 sm:h-12 sm:w-12 border border-white/20 flex items-center justify-center transition-colors"
              onClick={togglePlay}
              data-testid="button-pro-play-pause"
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
            </button>

            <button
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-colors disabled:opacity-30"
              onClick={() => goToSlide(currentSlide + 1)}
              disabled={currentSlide === totalSlides - 1}
              data-testid="button-pro-skip-forward"
            >
              <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 justify-end">
            <button
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-colors"
              onClick={() => setIsMuted(prev => !prev)}
              data-testid="button-pro-mute"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
            <span className="text-white/50 text-xs sm:text-sm whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-black/40 px-3 sm:px-6 py-1.5 sm:py-2 flex gap-1 overflow-x-auto">
        {deck.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`flex-shrink-0 h-1.5 rounded-full transition-all ${
              i === currentSlide
                ? "w-8 bg-[#0A66C2]"
                : i < currentSlide
                ? "w-4 bg-[#0A66C2]/40"
                : "w-4 bg-white/20"
            }`}
            data-testid={`pro-pitch-dot-${i}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PitchSessionPage() {
  const [, params] = useRoute("/pitch-session/:slug");
  const [, setLocation] = useLocation();
  const { user, authToken } = useAuth();
  const { toast } = useToast();
  const slug = params?.slug;

  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTalkingPoints, setShowTalkingPoints] = useState(false);
  const [showProPitch, setShowProPitch] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getToken = () => authToken || localStorage.getItem("authToken");

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ deckId: deck?.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create session");
      }
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
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to start session. Please log in first.", variant: "destructive" });
    },
  });

  const endSession = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No session");
      if (timerRef.current) clearInterval(timerRef.current);
      
      await fetch(`/api/pitch-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: "completed", durationSeconds: elapsedSeconds }),
      });

      setSessionState("evaluating");

      const evalRes = await fetch(`/api/pitch-sessions/${sessionId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
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

  if (showProPitch) {
    return <ProPitchMode deck={deck} onClose={() => setShowProPitch(false)} />;
  }

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

              <button
                onClick={() => setShowProPitch(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white py-3 rounded-xl font-medium hover:from-[#004182] hover:to-[#002d5c] transition-all shadow-sm"
                data-testid="button-watch-pro-pitch"
              >
                <GraduationCap className="h-5 w-5" />
                Watch a Pro Deliver This Pitch
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-[#e8e8e5] rounded-xl overflow-hidden">
                {slide?.imageUrl ? (
                <div className="relative">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className="w-full aspect-[16/9] object-contain bg-white"
                    data-testid="img-slide"
                  />
                </div>
              ) : (
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
              )}
                <div className="p-4 sm:p-6 border-t border-[#e8e8e5]">
                  <p className="text-sm font-medium text-[#1a1a1a] mb-1">{slide?.title}</p>
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
