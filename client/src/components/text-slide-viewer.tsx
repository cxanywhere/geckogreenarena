import { useState, useEffect, useRef, TouchEvent as ReactTouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  type: string;
  title: string;
  content?: string;
  bullets?: string[];
  imagePrompt?: string;
  imageUrl?: string | null;
}

interface TextSlideViewerProps {
  slides: SlideData[];
  currentPage: number;
  onPageChange: (page: number, numPages?: number) => void;
  onComplete?: () => void;
  onClose?: () => void;
  navigationDisabled?: boolean;
}

export function TextSlideViewer({
  slides,
  currentPage,
  onPageChange,
  onComplete,
  onClose,
  navigationDisabled = false,
}: TextSlideViewerProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const numPages = slides.length;
  const minSwipeDistance = 50;
  const slide = slides[currentPage - 1];

  useEffect(() => {
    onPageChange(currentPage, numPages);
  }, [numPages]);

  const goToPrevious = () => {
    if (navigationDisabled) return;
    if (currentPage > 1) {
      onPageChange(currentPage - 1, numPages);
    }
  };

  const goToNext = () => {
    if (navigationDisabled) return;
    if (currentPage < numPages) {
      onPageChange(currentPage + 1, numPages);
    } else if (onComplete) {
      onComplete();
    }
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (navigationDisabled) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, navigationDisabled, isFullscreen]);

  if (!slide) return null;

  const isFirstSlide = currentPage === 1;
  const isLastSlide = currentPage === numPages;
  const hasImage = !!slide.imageUrl;

  if (isFullscreen && hasImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className="text-white/60 text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="text-white hover:bg-white/20 rounded-full"
            data-testid="button-exit-fullscreen"
          >
            <Minimize2 className="w-5 h-5" />
          </Button>
        </div>

        <div
          className="flex-1 flex items-center justify-center p-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={isFirstSlide || navigationDisabled}
            className="absolute left-4 text-white hover:bg-white/20 rounded-full z-10 h-12 w-12"
            data-testid="button-prev-slide-fs"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <img
            src={slide.imageUrl!}
            alt={slide.title}
            className="max-w-full max-h-full object-contain"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={navigationDisabled}
            className="absolute right-4 text-white hover:bg-white/20 rounded-full z-10 h-12 w-12"
            data-testid="button-next-slide-fs"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-[#1A2B8C] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {hasImage ? (
        <>
          <div className="flex-1 min-h-0 flex items-center justify-center relative px-8 sm:px-12 py-3 overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-magenta" />
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              disabled={isFirstSlide || navigationDisabled}
              className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full z-10 h-10 w-10"
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={slide.imageUrl!}
                  alt={slide.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/30 cursor-pointer"
                  style={{ maxHeight: 'calc(100% - 8px)' }}
                  onClick={() => setIsFullscreen(true)}
                  onLoad={() => setImageLoading(false)}
                  onLoadStart={() => setImageLoading(true)}
                  onError={(e) => {
                    setImageLoading(false);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              disabled={navigationDisabled}
              className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full z-10 h-10 w-10"
              data-testid="button-next-slide"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="border-t border-white/10 bg-[#0f1b5c] px-2 sm:px-4 py-2 sm:py-2.5 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-white/50 text-xs font-medium whitespace-nowrap">
                  {currentPage}/{numPages}
                </span>
                <h3 className="text-white text-xs sm:text-sm font-medium truncate">
                  {slide.title}
                </h3>
                {slide.type === "roleplay" && (
                  <span className="px-2 py-0.5 bg-magenta/20 text-magenta text-xs rounded-full font-medium shrink-0">
                    Roleplay
                  </span>
                )}
                {slide.type === "quiz" && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium shrink-0">
                    Quiz
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-0.5">
                  {Array.from({ length: Math.min(numPages, 20) }, (_, i) => {
                    const pageNum = numPages <= 20 ? i + 1 : Math.round((i / 19) * (numPages - 1)) + 1;
                    return (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all ${
                          pageNum <= currentPage
                            ? "w-2.5 bg-magenta"
                            : "w-1 bg-white/15"
                        }`}
                      />
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                  data-testid="button-fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                {isLastSlide ? (
                  <Button
                    size="sm"
                    onClick={goToNext}
                    disabled={navigationDisabled}
                    className="bg-magenta hover:bg-magenta/90 text-white text-xs px-4"
                    data-testid="button-complete-chapter"
                  >
                    Complete
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="h-full w-full"
              >
                <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-magenta/60 uppercase tracking-wider">
                      Slide {currentPage} of {numPages}
                    </span>
                    {slide.type === "quiz" && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full font-medium">
                        Quiz
                      </span>
                    )}
                    {slide.type === "roleplay" && (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                        Roleplay
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 leading-tight">
                    {slide.title}
                  </h2>

                  {slide.content && (
                    <p className="text-base md:text-lg text-white/70 mb-6 leading-relaxed">
                      {slide.content}
                    </p>
                  )}

                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {slide.bullets.map((bullet, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <div className="mt-2 w-2 h-2 rounded-full bg-magenta shrink-0" />
                          <span className="text-sm md:text-base text-white/90 leading-relaxed">
                            {bullet}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-white/10 bg-[#1A2B8C]/90 backdrop-blur-sm px-4 py-3 shrink-0">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                disabled={isFirstSlide || navigationDisabled}
                className="gap-1 text-white hover:text-magenta hover:bg-white/10"
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(numPages, 20) }, (_, i) => {
                  const pageNum = numPages <= 20 ? i + 1 : Math.round((i / 19) * (numPages - 1)) + 1;
                  return (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        pageNum <= currentPage
                          ? "w-3 bg-magenta"
                          : "w-1.5 bg-white/20"
                      }`}
                    />
                  );
                })}
              </div>

              <Button
                variant={isLastSlide ? "default" : "ghost"}
                size="sm"
                onClick={goToNext}
                disabled={navigationDisabled}
                className={`gap-1 ${isLastSlide ? "bg-magenta hover:bg-magenta/90 text-white" : "text-white hover:text-magenta hover:bg-white/10"}`}
                data-testid="button-next-slide"
              >
                <span className="hidden sm:inline">
                  {isLastSlide ? "Complete" : "Next"}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
