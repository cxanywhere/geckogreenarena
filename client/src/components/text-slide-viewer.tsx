import { useState, useEffect, useRef, TouchEvent as ReactTouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  type: string;
  title: string;
  content?: string;
  bullets?: string[];
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages, navigationDisabled]);

  if (!slide) return null;

  const isFirstSlide = currentPage === 1;
  const isLastSlide = currentPage === numPages;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="h-full"
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

              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 leading-tight">
                {slide.title}
              </h2>

              {slide.content && (
                <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
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
                      <span className="text-sm md:text-base text-foreground/90 leading-relaxed">
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

      <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            disabled={isFirstSlide || navigationDisabled}
            className="gap-1"
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
                      : "w-1.5 bg-muted-foreground/20"
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
            className="gap-1"
            data-testid="button-next-slide"
          >
            <span className="hidden sm:inline">
              {isLastSlide ? "Complete" : "Next"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
