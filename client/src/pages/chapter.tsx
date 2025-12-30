import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, BookOpen, Presentation, Brain } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { api, type QuizQuestion } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { QuizOverlay } from "@/components/quiz-overlay";
import { AnimatePresence } from "framer-motion";

interface EmbeddedQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  slideIndex: number;
}

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
  const [currentQuiz, setCurrentQuiz] = useState<EmbeddedQuiz | null>(null);
  const [completedQuizPages, setCompletedQuizPages] = useState<Set<number>>(() => {
    if (!params?.id) return new Set();
    const saved = localStorage.getItem(`chapter_quiz_completed_${params.id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const embeddedQuizzes = useMemo(() => {
    if (!chapter?.slides) return [];
    return chapter.slides
      .map((slide: any, index: number) => {
        if (slide.type === 'quiz' && slide.quiz) {
          return {
            question: slide.quiz.question,
            options: slide.quiz.options,
            correctAnswer: slide.quiz.correctAnswer,
            slideIndex: index + 1,
          };
        }
        return null;
      })
      .filter(Boolean) as EmbeddedQuiz[];
  }, [chapter]);

  const quizPageNumbers = useMemo(() => {
    return new Set(embeddedQuizzes.map(q => q.slideIndex));
  }, [embeddedQuizzes]);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (quizPageNumbers.has(page) && !completedQuizPages.has(page)) {
      const quiz = embeddedQuizzes.find(q => q.slideIndex === page);
      if (quiz) {
        setCurrentQuiz(quiz);
        setShowQuiz(true);
      }
    }
  };

  const handleQuizComplete = async (selectedAnswer: number) => {
    if (!currentQuiz || !user || !chapter) return;
    
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    
    try {
      await api.submitQuizAnswer(user.id, chapter.id, String(currentQuiz.slideIndex), selectedAnswer);
    } catch (error) {
      console.error("Failed to save quiz answer:", error);
    }
    
    setShowQuiz(false);
    setCompletedQuizPages(prev => new Set([...Array.from(prev), currentPage]));
    
    if (isCorrect) {
      toast.success("Correct! Great job.");
    } else {
      toast.info("Not quite right, but keep learning!");
    }
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
                        {completedQuizPages.size}/{embeddedQuizzes.length} quizzes
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

      {/* Quiz Overlay for embedded quizzes */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <EmbeddedQuizOverlay
            quiz={currentQuiz}
            onAnswer={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EmbeddedQuizOverlay({ 
  quiz, 
  onAnswer, 
  onSkip 
}: { 
  quiz: EmbeddedQuiz; 
  onAnswer: (answer: number) => void; 
  onSkip: () => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
  };

  const handleContinue = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Knowledge Check</h3>
                <p className="text-sm text-muted-foreground">Test your understanding</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip} data-testid="button-skip-quiz">
              Skip
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-lg font-medium" data-testid="text-quiz-question">
            {quiz.question}
          </p>

          <div className="space-y-3">
            {quiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = showResult && index === quiz.correctAnswer;
              const isWrongAnswer = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    isCorrectAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isWrongAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  data-testid={`button-option-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
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
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`p-4 rounded-xl ${
              isCorrect 
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            }`}>
              <p className="font-medium">
                {isCorrect ? "Correct! Well done." : "Not quite right."}
              </p>
              {!isCorrect && (
                <p className="text-sm text-muted-foreground mt-1">
                  The correct answer is: {quiz.options[quiz.correctAnswer]}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1"
                data-testid="button-submit-answer"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleContinue} className="flex-1" data-testid="button-continue">
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
