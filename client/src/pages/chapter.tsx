import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { CHAPTERS, Slide } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Download, FileText, ChevronRight, ChevronLeft, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function ChapterPage() {
  const [, params] = useRoute("/chapter/:id");
  const [, setLocation] = useLocation();
  const chapter = CHAPTERS.find(c => c.id === params?.id);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentSlide = chapter.slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === chapter.slides.length - 1;
  const isQuiz = currentSlide.type === 'quiz';

  const handleNext = () => {
    if (isQuiz) {
      if (selectedAnswer === null) {
        toast.error("Please select an answer to continue.");
        return;
      }
      if (selectedAnswer !== currentSlide.quiz?.correctAnswer) {
        toast.error("Incorrect answer. Try again to proceed.");
        setIsAnswerCorrect(false);
        return;
      }
      setIsAnswerCorrect(true);
      toast.success("Correct! Moving to next slide...");
      
      // Delay to show success state
      setTimeout(() => {
        if (currentSlideIndex < chapter.slides.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setIsAnswerCorrect(null);
        } else {
          handleComplete();
        }
      }, 1000);
    } else {
      if (currentSlideIndex < chapter.slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    }
  };

  const handleComplete = () => {
    const completedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    if (!completedChapters.includes(chapter.id)) {
      completedChapters.push(chapter.id);
      localStorage.setItem("completed_chapters", JSON.stringify(completedChapters));
    }
    toast.success("Chapter completed! Roleplays unlocked.");
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col h-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span>{chapter.title}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Slide {currentSlideIndex + 1} of {chapter.slides.length}: {currentSlide.title}
              </h1>
            </div>
          </div>
           <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <a href={chapter.pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              PDF Resource
            </a>
          </Button>
        </div>

        {/* Slide Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-lg overflow-hidden relative flex flex-col md:flex-row min-h-[400px]">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary z-10">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / chapter.slides.length) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col md:flex-row h-full"
            >
              {/* Left Side: Visual/Context */}
              <div className="w-full md:w-1/2 bg-muted/10 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border">
                {isQuiz ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <HelpCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-primary mb-2">Knowledge Check</h2>
                    <p className="text-muted-foreground">Verify your understanding before moving forward.</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-center">
                     <h2 className="text-3xl font-display font-bold text-foreground mb-6 leading-tight">{currentSlide.title}</h2>
                     <div className="w-20 h-1 bg-primary mb-6" />
                     {currentSlide.bullets && (
                       <ul className="space-y-4">
                         {currentSlide.bullets.map((bullet, idx) => (
                           <li key={idx} className="flex items-start gap-3 text-lg text-muted-foreground">
                             <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                             {bullet}
                           </li>
                         ))}
                       </ul>
                     )}
                  </div>
                )}
              </div>

              {/* Right Side: Content/Interaction */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                {isQuiz ? (
                   <div className="space-y-6">
                     <h3 className="text-xl font-bold text-foreground">{currentSlide.quiz?.question}</h3>
                     <RadioGroup onValueChange={(val) => {
                       setSelectedAnswer(parseInt(val));
                       setIsAnswerCorrect(null);
                     }} value={selectedAnswer?.toString()}>
                       {currentSlide.quiz?.options.map((option, idx) => (
                         <div key={idx} className={`flex items-center space-x-2 border p-4 rounded-xl transition-all ${selectedAnswer === idx ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                           <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                           <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                         </div>
                       ))}
                     </RadioGroup>
                   </div>
                ) : (
                  <div className="prose prose-lg text-muted-foreground">
                    <p className="text-lg leading-relaxed">{currentSlide.content}</p>
                    
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-sm flex items-start gap-3">
                       <div className="mt-0.5">💡</div>
                       <p className="m-0 text-sm font-medium">Pro Tip: Top performers memorize these key phrases verbatim. Practice them aloud.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentSlideIndex === 0}
            className="text-muted-foreground"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex gap-2">
            {!isQuiz && isLastSlide ? (
              <Button onClick={handleComplete} size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200">
                Complete Chapter <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 min-w-[140px]"
              >
                {isQuiz ? (isAnswerCorrect ? "Continue" : "Submit Answer") : "Next Slide"} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
