import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Loader2, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceQA } from "@/components/voice-qa";

interface SlideNarration {
  slideIndex: number;
  title: string;
  script: string;
  audioUrl: string;
}

interface PresentModeProps {
  slides: Array<{
    title: string;
    imageUrl?: string | null;
    content?: string;
    bullets?: string[];
    type: string;
  }>;
  narration: SlideNarration[];
  chapterTitle: string;
  chapterId: string;
  onClose: () => void;
}

export function PresentMode({ slides, narration, chapterTitle, chapterId, onClose }: PresentModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [audioReady, setAudioReady] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const wasPlayingBeforeQARef = useRef(false);
  const prevShowQARef = useRef(false);

  const currentNarration = narration.find(n => n.slideIndex === currentSlide);
  const slide = slides[currentSlide];
  const totalSlides = slides.length;

  const shouldAutoPlayRef = useRef(false);
  const autoAdvanceRef = useRef(autoAdvance);
  autoAdvanceRef.current = autoAdvance;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioReady(false);
    setProgress(0);
    setDuration(0);

    const willAutoPlay = shouldAutoPlayRef.current;

    if (currentNarration?.audioUrl) {
      const audio = new Audio(currentNarration.audioUrl);
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
          }, 1500);
        }
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setAudioReady(true);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSlide, currentNarration?.audioUrl]);

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
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (showQA && !prevShowQARef.current) {
      wasPlayingBeforeQARef.current = isPlaying;
      if (isPlaying) {
        setIsPlaying(false);
      }
    } else if (!showQA && prevShowQARef.current) {
      if (wasPlayingBeforeQARef.current) {
        setIsPlaying(true);
      }
    }
    prevShowQARef.current = showQA;
  }, [showQA]);

  const toggleQA = useCallback(() => {
    setShowQA(prev => !prev);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      shouldAutoPlayRef.current = true;
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  const skipForward = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, totalSlides, goToSlide]);

  const skipBack = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          skipForward();
          break;
        case "ArrowLeft":
          skipBack();
          break;
        case "Escape":
          onClose();
          break;
        case "m":
          setIsMuted(prev => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skipForward, skipBack, onClose]);

  const startPresentation = useCallback(() => {
    shouldAutoPlayRef.current = true;
    setCurrentSlide(0);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = audioRef.current?.currentTime || 0;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0f2e] flex flex-col" data-testid="present-mode-overlay">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          onClick={() => setShowScript(prev => !prev)}
          data-testid="button-toggle-script"
        >
          <span className="text-xs font-medium">CC</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
          onClick={onClose}
          data-testid="button-close-present"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-50">
        <div className="text-white/50 text-sm">{chapterTitle}</div>
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
                data-testid={`present-slide-image-${currentSlide}`}
              />
            ) : (
              <div className="max-w-3xl w-full bg-[#1B2D5E] rounded-2xl p-5 sm:p-8 md:p-12 shadow-2xl mx-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-6">{slide?.title}</h2>
                {slide?.content && (
                  <p className="text-white/80 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">{slide.content}</p>
                )}
                {slide?.bullets && (
                  <ul className="space-y-2 sm:space-y-3">
                    {slide.bullets.map((bullet, i) => (
                      <li key={i} className="text-white/70 text-sm sm:text-base flex items-start gap-2 sm:gap-3">
                        <span className="text-magenta mt-1 sm:mt-1.5 text-xs">●</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {showScript && currentNarration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl w-[calc(100%-2rem)] sm:w-full"
          >
            <div className="bg-black/80 backdrop-blur-md rounded-xl p-3 sm:p-4 text-white/90 text-xs sm:text-sm leading-relaxed max-h-24 sm:max-h-32 overflow-y-auto">
              {currentNarration.script}
            </div>
          </motion.div>
        )}

        {!isPlaying && currentSlide === 0 && progress === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <Button
              onClick={startPresentation}
              className="bg-magenta hover:bg-magenta/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-xl gap-3"
              data-testid="button-start-presentation"
            >
              <Play className="h-6 w-6" />
              Start Presentation
            </Button>
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
              className="h-full bg-magenta rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-1 text-white/50 text-sm min-w-[80px]">
            {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "--:--"}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 sm:h-9 sm:w-9"
              onClick={skipBack}
              disabled={currentSlide === 0}
              data-testid="button-skip-back"
            >
              <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-magenta/20 rounded-full h-10 w-10 sm:h-12 sm:w-12 border border-white/20"
              onClick={togglePlay}
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 sm:h-9 sm:w-9"
              onClick={skipForward}
              disabled={currentSlide === totalSlides - 1}
              data-testid="button-skip-forward"
            >
              <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 h-7 sm:h-8 ${showQA ? "bg-magenta/20 text-magenta border border-magenta/40" : "text-white/70 hover:text-white hover:bg-white/10"}`}
              onClick={toggleQA}
              data-testid="button-present-ask-question"
            >
              <MessageCircleQuestion className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Ask</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-7 w-7 sm:h-8 sm:w-8"
              onClick={() => setIsMuted(prev => !prev)}
              data-testid="button-mute"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-white/50 text-xs sm:text-sm whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-black/40 px-3 sm:px-6 py-1.5 sm:py-2 flex gap-1 overflow-x-auto">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`flex-shrink-0 h-1.5 rounded-full transition-all ${
              i === currentSlide
                ? "w-8 bg-magenta"
                : i < currentSlide
                ? "w-4 bg-magenta/40"
                : "w-4 bg-white/20"
            }`}
            data-testid={`present-slide-dot-${i}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {showQA && (
          <VoiceQA
            chapterId={chapterId}
            chapterTitle={chapterTitle}
            currentSlideIndex={currentSlide}
            currentSlideTitle={slide?.title || `Slide ${currentSlide + 1}`}
            onClose={() => setShowQA(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
