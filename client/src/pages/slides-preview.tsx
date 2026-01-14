import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const TOTAL_SLIDES = 31;

function getSlideUrl(slideNumber: number): string {
  const num = String(slideNumber).padStart(2, "0");
  return `/training-slides/slide_${num}.png`;
}

export default function SlidesPreviewPage() {
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);

  const openSlide = (num: number) => setSelectedSlide(num);
  const closeSlide = () => setSelectedSlide(null);

  const goToPrev = () => {
    if (selectedSlide && selectedSlide > 1) {
      setSelectedSlide(selectedSlide - 1);
    }
  };

  const goToNext = () => {
    if (selectedSlide && selectedSlide < TOTAL_SLIDES) {
      setSelectedSlide(selectedSlide + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Chapter 1 Training Slides</h1>
          <p className="text-muted-foreground">31 Portrait-Mode Slides for Mobile Viewing</p>
          <p className="text-sm text-muted-foreground mt-2">Click any slide to view full size</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: TOTAL_SLIDES }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              onClick={() => openSlide(num)}
              className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
              data-testid={`slide-preview-${num}`}
            >
              <img
                src={getSlideUrl(num)}
                alt={`Slide ${num}`}
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <span className="text-white text-sm font-medium">Slide {num}</span>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedSlide !== null} onOpenChange={() => closeSlide()}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none overflow-hidden">
            <VisuallyHidden>
              <DialogTitle>Slide {selectedSlide} of {TOTAL_SLIDES}</DialogTitle>
              <DialogDescription>View training slide in full size</DialogDescription>
            </VisuallyHidden>
            <div className="relative flex items-center justify-center h-[90vh]">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeSlide}
                className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
                data-testid="button-close-slide"
              >
                <X className="w-6 h-6" />
              </Button>

              {selectedSlide && selectedSlide > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrev}
                  className="absolute left-2 z-10 text-white hover:bg-white/20 h-16 w-16"
                  data-testid="button-prev-slide"
                >
                  <ChevronLeft className="w-10 h-10" />
                </Button>
              )}

              {selectedSlide && (
                <img
                  src={getSlideUrl(selectedSlide)}
                  alt={`Slide ${selectedSlide}`}
                  className="max-h-[85vh] max-w-full object-contain"
                />
              )}

              {selectedSlide && selectedSlide < TOTAL_SLIDES && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  className="absolute right-2 z-10 text-white hover:bg-white/20 h-16 w-16"
                  data-testid="button-next-slide"
                >
                  <ChevronRight className="w-10 h-10" />
                </Button>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full">
                <span className="text-white text-sm font-medium">
                  Slide {selectedSlide} of {TOTAL_SLIDES}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
