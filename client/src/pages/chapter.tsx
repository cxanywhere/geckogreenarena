import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, BookOpen, Presentation, Brain, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { api, type QuizQuestion } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useOrientation } from "@/hooks/useOrientation";

const QUIZ_INTERVAL = 5;

export default function ChapterPage() {
  const [, params] = useRoute("/chapter/:id");
  const [, setLocation] = useLocation();
  
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const chapter = chapters.find(c => c.id === params?.id);
  
  const [currentPage, setCurrentPage] = useState(() => {
    if (!params?.id) return 1;
    const saved = localStorage.getItem(`chapter_pdf_progress_${params.id}`);
    return saved ? parseInt(saved) : 1;
  });
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [completedQuizPages, setCompletedQuizPages] = useState<Set<number>>(() => {
    if (!params?.id) return new Set();
    const saved = localStorage.getItem(`chapter_quiz_completed_${params.id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const lastCheckedPage = useRef(0);

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_pdf_progress_${params.id}`, currentPage.toString());
    }
  }, [currentPage, params?.id]);

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_quiz_completed_${params.id}`, JSON.stringify(Array.from(completedQuizPages)));
    }
  }, [completedQuizPages, params?.id]);

  const triggerQuiz = useCallback(async (pageNumber: number) => {
    if (!chapter || !user || isLoadingQuiz) return;
    
    if (completedQuizPages.has(pageNumber)) return;
    if (lastCheckedPage.current === pageNumber) return;
    
    lastCheckedPage.current = pageNumber;
    setIsLoadingQuiz(true);
    
    try {
      console.log(`Generating quiz for page ${pageNumber}...`);
      const result = await api.getQuizFromContent(chapter.id, pageNumber);
      
      if (result.questions && result.questions.length > 0) {
        setQuizQuestions(result.questions);
        setShowQuiz(true);
        console.log(`Got ${result.questions.length} quiz questions`);
      } else {
        console.log("No quiz questions generated:", result.message);
        lastCheckedPage.current = 0;
      }
    } catch (error) {
      console.error("Failed to generate quiz from PDF:", error);
      lastCheckedPage.current = 0;
      toast.error("Couldn't load quiz. Try again on the next page.");
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [chapter, user, completedQuizPages, isLoadingQuiz]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (page > 1 && page % QUIZ_INTERVAL === 0 && !completedQuizPages.has(page)) {
      triggerQuiz(page);
    }
  };

  const handleQuizAnswer = async (questionIndex: number, selectedAnswer: number, isCorrect: boolean) => {
    if (!user || !chapter || !quizQuestions[questionIndex]) return;
    
    try {
      await api.submitQuizAnswer(user.id, chapter.id, quizQuestions[questionIndex].id, selectedAnswer);
    } catch (error) {
      console.error("Failed to save quiz answer:", error);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setCompletedQuizPages(prev => new Set([...Array.from(prev), currentPage]));
    toast.success("Quiz completed! Keep learning.");
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    setCompletedQuizPages(prev => new Set([...Array.from(prev), currentPage]));
  };

  const handleComplete = () => {
    if (!chapter) return;
    
    const completedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    if (!completedChapters.includes(chapter.id)) {
      completedChapters.push(chapter.id);
      localStorage.setItem("completed_chapters", JSON.stringify(completedChapters));
    }
    
    if (user) {
      api.createProgress({
        userId: user.id,
        chapterId: chapter.id,
        completed: 1,
      }).catch(console.error);
    }
    
    toast.success("Chapter completed! Great work.");
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1500);
  };

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      
      <div className="flex-1 flex flex-col max-h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-back">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Presentation className="h-4 w-4" />
                    <span>Training Presentation</span>
                    {completedQuizPages.size > 0 && (
                      <span className="flex items-center gap-1 text-primary">
                        <Brain className="h-3 w-3" />
                        {completedQuizPages.size} quizzes done
                      </span>
                    )}
                    {isLoadingQuiz && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading quiz...
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-display font-bold text-foreground" data-testid="text-chapter-title">
                    {chapter.title}: {chapter.subtitle}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="hidden md:flex">
                  <a href={chapter.pdfUrl || ""} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          {chapter.pdfUrl ? (
            <PDFViewer
              pdfUrl={chapter.pdfUrl}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onComplete={handleComplete}
              onClose={() => setLocation("/dashboard")}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No Presentation Available</h2>
                <p className="text-muted-foreground mb-4">
                  This chapter's presentation is not yet available.
                </p>
                <Link href="/dashboard">
                  <Button>Return to Dashboard</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && quizQuestions.length > 0 && (
          <PDFQuizOverlay
            questions={quizQuestions}
            onAnswer={handleQuizAnswer}
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PDFQuizOverlay({ 
  questions, 
  onAnswer,
  onComplete, 
  onSkip 
}: { 
  questions: QuizQuestion[];
  onAnswer: (questionIndex: number, answer: number, isCorrect: boolean) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape';

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (!currentQuestion) return null;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    
    onAnswer(currentIndex, selectedAnswer, isCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 overflow-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex ${
          isLandscape 
            ? 'flex-row w-full max-w-4xl max-h-[95dvh]' 
            : 'flex-col w-full max-w-lg max-h-[90dvh]'
        }`}
      >
        {/* Header - compact in landscape */}
        <div className={`bg-primary/5 border-border shrink-0 ${
          isLandscape 
            ? 'w-48 border-r p-3 flex flex-col justify-between' 
            : 'border-b p-3'
        }`}>
          <div className={`flex items-center ${isLandscape ? 'flex-col text-center gap-2' : 'justify-between'}`}>
            <div className={`flex items-center ${isLandscape ? 'flex-col' : 'gap-2'}`}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className={isLandscape ? 'mt-2' : ''}>
                <h3 className="font-bold text-sm">Knowledge Check</h3>
                <p className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {questions.length}
                </p>
              </div>
            </div>
            {!isLandscape && (
              <Button variant="ghost" size="sm" onClick={onSkip} data-testid="button-skip-quiz">
                Skip
              </Button>
            )}
          </div>
          
          {/* Progress dots in landscape sidebar */}
          {isLandscape && questions.length > 1 && (
            <div className="flex justify-center gap-1.5 my-3">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-primary" : idx < currentIndex ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
          
          {isLandscape && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="w-full" data-testid="button-skip-quiz">
              Skip
            </Button>
          )}
        </div>
        
        {/* Content area */}
        <div className={`flex-1 overflow-y-auto p-3 ${isLandscape ? 'flex flex-col' : ''}`}>
          {/* Question */}
          <p className="text-sm font-medium mb-3" data-testid="text-quiz-question">
            {currentQuestion.question}
          </p>

          {/* Options - 2 columns in landscape */}
          <div className={`gap-2 ${isLandscape ? 'grid grid-cols-2' : 'space-y-2'}`}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = showResult && index === currentQuestion.correctAnswer;
              const isWrongAnswer = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-2.5 rounded-lg text-left transition-all border-2 ${
                    isCorrectAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isWrongAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid={`button-option-${index}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCorrectAnswer
                        ? "bg-green-500 text-white"
                        : isWrongAnswer
                        ? "bg-red-500 text-white"
                        : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 text-xs leading-tight">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result feedback */}
          {showResult && (
            <div className={`mt-3 p-2.5 rounded-lg text-sm ${
              isCorrect 
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            }`}>
              <p className="font-medium text-xs">
                {isCorrect ? "Correct!" : "Not quite."}
              </p>
              {!isCorrect && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                </p>
              )}
            </div>
          )}

          {/* Submit/Continue button */}
          <div className="mt-3">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full"
                size="sm"
                data-testid="button-submit-answer"
              >
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full" size="sm" data-testid="button-continue">
                {isLastQuestion ? "Done" : "Next"}
              </Button>
            )}
          </div>

          {/* Progress dots - portrait only */}
          {!isLandscape && questions.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-primary" : idx < currentIndex ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
