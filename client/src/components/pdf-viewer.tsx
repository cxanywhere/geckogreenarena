import { useState, useCallback, useEffect, useRef, TouchEvent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCw, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onComplete?: () => void;
}

export function PDFViewer({ pdfUrl, currentPage, onPageChange, onComplete }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [fitMode, setFitMode] = useState<'width' | 'height' | 'manual'>('width');
  const [manualScale, setManualScale] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width - 32);
        setContainerHeight(rect.height - 32);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
    };
  }, [isFullscreen]);

  const onDocumentLoadSuccess = useCallback(({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (numPages > 0) {
      if (currentPage > numPages) {
        onPageChange(numPages);
      } else if (currentPage < 1) {
        onPageChange(1);
      }
    }
  }, [numPages, currentPage, onPageChange]);

  const isReady = numPages > 0 && !isLoading;
  const safeCurrentPage = numPages > 0 ? Math.min(Math.max(1, currentPage), numPages) : 1;
  const canRenderPage = isReady && safeCurrentPage >= 1 && safeCurrentPage <= numPages;

  const goToPrevPage = () => {
    if (isReady && safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isReady) return;
    
    if (safeCurrentPage < numPages) {
      onPageChange(safeCurrentPage + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const zoomIn = () => {
    setFitMode('manual');
    setManualScale(prev => Math.min(prev + 0.25, 3));
  };
  
  const zoomOut = () => {
    setFitMode('manual');
    setManualScale(prev => Math.max(prev - 0.25, 0.25));
  };
  
  const fitToScreen = () => {
    setFitMode('width');
    setManualScale(1);
  };
  
  const rotate = () => setRotation(prev => (prev + 90) % 360);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && isReady && safeCurrentPage < numPages) {
      onPageChange(safeCurrentPage + 1);
    } else if (isRightSwipe && isReady && safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const progressPercentage = numPages > 0 ? (safeCurrentPage / numPages) * 100 : 0;

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-black/95 flex flex-col" 
    : "flex flex-col h-full";

  const isRotated = rotation === 90 || rotation === 270;
  const effectiveWidth = fitMode === 'width' && containerWidth > 0 
    ? (isRotated ? Math.min(containerWidth, containerHeight * 0.8) : containerWidth)
    : undefined;

  return (
    <div className={containerClass}>
      {/* Controls Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPrevPage} 
            disabled={!isReady || safeCurrentPage <= 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center" data-testid="text-page-indicator">
            {isReady ? `${safeCurrentPage} / ${numPages}` : "Loading..."}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextPage} 
            disabled={!isReady || (safeCurrentPage >= numPages && !onComplete)}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={zoomOut} data-testid="button-zoom-out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant={fitMode === 'width' ? 'secondary' : 'ghost'} 
            size="icon" 
            onClick={fitToScreen} 
            data-testid="button-fit-screen"
            title="Fit to screen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomIn} data-testid="button-zoom-in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={rotate} data-testid="button-rotate">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} data-testid="button-fullscreen">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-4 bg-muted/30 relative touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading presentation...</p>
            </div>
          </div>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
          className="max-w-full"
        >
          {canRenderPage && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${safeCurrentPage}-${rotation}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Page
                  pageNumber={safeCurrentPage}
                  width={fitMode === 'width' ? effectiveWidth : undefined}
                  scale={fitMode === 'manual' ? manualScale : undefined}
                  rotate={rotation}
                  className="shadow-2xl rounded-lg overflow-hidden"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </Document>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-secondary">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Mobile Navigation Footer */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-t border-border">
        <Button 
          variant="outline" 
          onClick={goToPrevPage} 
          disabled={!isReady || safeCurrentPage <= 1}
          className="flex-1 mr-2"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={goToNextPage}
          disabled={!isReady}
          className="flex-1 ml-2 bg-primary"
        >
          {isReady && safeCurrentPage >= numPages ? "Complete" : "Next"} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
