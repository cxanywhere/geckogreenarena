import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText, CheckCircle, BookOpen, Presentation, Brain } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { api, type Chapter, type QuizQuestion } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { QuizOverlay } from "@/components/quiz-overlay";
import { AnimatePresence } from "framer-motion";

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
  const [completedQuizSlides, setCompletedQuizSlides] = useState<Set<number>>(() => {
    if (!params?.id) return new Set();
    const saved = localStorage.getItem(`chapter_quiz_completed_${params.id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_pdf_progress_${params.id}`, currentPage.toString());
    }
  }, [currentPage, params?.id]);

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_quiz_completed_${params.id}`, JSON.stringify(Array.from(completedQuizSlides)));
    }
  }, [completedQuizSlides, params?.id]);

  const checkForQuiz = useCallback(async (page: number) => {
    if (!chapter || !user || isLoadingQuiz) return;
    
    if (page > 1 && page % QUIZ_INTERVAL === 0 && !completedQuizSlides.has(page)) {
      setIsLoadingQuiz(true);
      try {
        const slideContent = chapter.slides?.[page - 1]?.content || 
          `Slide ${page} of ${chapter.title} - ${chapter.subtitle}. Key topics: ${chapter.agenda.join(", ")}`;
        
        const result = await api.getQuizForSlide(chapter.id, page, slideContent);
        
        if (result.questions && result.questions.length > 0) {
          setQuizQuestions(result.questions);
          setShowQuiz(true);
        }
      } catch (error) {
        console.error("Failed to load quiz:", error);
      } finally {
        setIsLoadingQuiz(false);
      }
    }
  }, [chapter, user, completedQuizSlides, isLoadingQuiz]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page > currentPage) {
      checkForQuiz(page);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setCompletedQuizSlides(prev => new Set([...Array.from(prev), currentPage]));
    toast.success("Quiz completed! Keep going.");
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    setCompletedQuizSlides(prev => new Set([...Array.from(prev), currentPage]));
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
                    {completedQuizSlides.size > 0 && (
                      <span className="flex items-center gap-1 text-primary">
                        <Brain className="h-3 w-3" />
                        {completedQuizSlides.size} quizzes
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

      {/* Quiz Overlay */}
      <AnimatePresence>
        {showQuiz && quizQuestions.length > 0 && user && chapter && (
          <QuizOverlay
            questions={quizQuestions}
            chapterId={chapter.id}
            userId={user.id}
            onComplete={handleQuizComplete}
            onSkip={handleQuizSkip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
