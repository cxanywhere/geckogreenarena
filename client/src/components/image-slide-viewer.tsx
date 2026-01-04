import { useState, useEffect, useRef, TouchEvent as ReactTouchEvent } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSlideViewerProps {
  slides: string[];
  currentPage: number;
  onPageChange: (page: number, numPages?: number) => void;
  onComplete?: () => void;
  onClose?: () => void;
}

export function ImageSlideViewer({ 
  slides, 
  currentPage, 
  onPageChange, 
  onComplete, 
  onClose 
}: ImageSlideViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const numPages = slides.length;
  const minSwipeDistance = 50;

  useEffect(() => {
    onPageChange(currentPage, numPages);
  }, [numPages]);

  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1, numPages);
    }
  };

  const goToNext = () => {
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
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, numPages]);

  const currentSlideUrl = slides[currentPage - 1];

  useEffect(() => {
    setIsLoading(true);
  }, [currentPage]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          onClick={onClose}
          data-testid="button-close-slides"
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-full max-w-full flex items-center justify-center"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={currentSlideUrl}
              alt={`Slide ${currentPage} of ${numPages}`}
              className="max-h-[calc(100vh-180px)] max-w-full object-contain rounded-lg shadow-xl"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              data-testid={`img-slide-${currentPage}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={currentPage <= 1}
          className="flex items-center gap-1"
          data-testid="button-prev-slide"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.min(numPages, 7) }, (_, i) => {
              let pageNum: number;
              if (numPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= numPages - 3) {
                pageNum = numPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(pageNum, numPages)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    pageNum === currentPage 
                      ? 'bg-green-500 w-4' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                  }`}
                  data-testid={`button-dot-${pageNum}`}
                />
              );
            })}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {currentPage} / {numPages}
          </span>
        </div>

        <Button
          variant={currentPage === numPages ? "default" : "outline"}
          size="sm"
          onClick={goToNext}
          className={`flex items-center gap-1 ${currentPage === numPages ? 'bg-green-600 hover:bg-green-700' : ''}`}
          data-testid="button-next-slide"
        >
          <span className="hidden sm:inline">{currentPage === numPages ? 'Complete' : 'Next'}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
