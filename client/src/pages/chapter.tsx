import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { ImageSlideViewer } from "@/components/image-slide-viewer";
import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, BookOpen, Presentation, Brain, Loader2, Mic, CheckCircle, Clock, Target, FileText, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { api, type QuizQuestion } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useOrientation } from "@/hooks/useOrientation";
import { getQuizForSlide, isQuizSlide } from "@/lib/chapter1-quizzes";
import { getRoleplaysForSlide, isRoleplaySlide, getAllChapter1Roleplays, type PredefinedRoleplay } from "@/lib/chapter1-roleplays";
import { RoleplayPrompt } from "@/components/roleplay-prompt";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const [showRoleplay, setShowRoleplay] = useState(false);
  const [currentRoleplays, setCurrentRoleplays] = useState<PredefinedRoleplay[]>([]);
  const [currentRoleplayIndex, setCurrentRoleplayIndex] = useState(0);
  const [completedRoleplays, setCompletedRoleplays] = useState<Set<string>>(() => {
    if (!params?.id) return new Set();
    const saved = localStorage.getItem(`chapter_roleplay_completed_${params.id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [skippedRoleplays, setSkippedRoleplays] = useState<PredefinedRoleplay[]>([]);
  const [showEndOfChapter, setShowEndOfChapter] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [showObjectives, setShowObjectives] = useState(false);

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_pdf_progress_${params.id}`, currentPage.toString());
    }
  }, [currentPage, params?.id]);

  // Track slide progress in database
  useEffect(() => {
    if (params?.id && user?.id && totalSlides > 0) {
      api.updateSlideProgress(user.id, params.id, currentPage, totalSlides).catch(err => {
        console.error("Failed to track slide progress:", err);
      });
    }
  }, [currentPage, params?.id, user?.id, totalSlides]);

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_quiz_completed_${params.id}`, JSON.stringify(Array.from(completedQuizPages)));
    }
  }, [completedQuizPages, params?.id]);

  useEffect(() => {
    if (params?.id) {
      localStorage.setItem(`chapter_roleplay_completed_${params.id}`, JSON.stringify(Array.from(completedRoleplays)));
    }
  }, [completedRoleplays, params?.id]);

  const isChapter1 = chapter?.title === "Sales Foundations";
  const isChapter2 = chapter?.title === "Field Execution" || chapter?.title === "Field Sales Process";

  const pendingContentForSlide = useRef<{ quizzes: boolean; roleplays: PredefinedRoleplay[] } | null>(null);

  const triggerQuiz = useCallback(async (pageNumber: number) => {
    if (!chapter || !user || isLoadingQuiz) return;
    
    if (completedQuizPages.has(pageNumber)) return;
    if (lastCheckedPage.current === pageNumber) return;
    
    lastCheckedPage.current = pageNumber;
    
    if (isChapter1) {
      const predefinedQuiz = getQuizForSlide(pageNumber);
      if (predefinedQuiz) {
        const quizQuestion: QuizQuestion = {
          id: `ch1-quiz-${pageNumber}`,
          question: predefinedQuiz.question,
          options: predefinedQuiz.options,
          correctAnswer: predefinedQuiz.correctAnswer,
          explanation: "",
        };
        setQuizQuestions([quizQuestion]);
        setShowQuiz(true);
        console.log(`Loaded predefined quiz for slide ${pageNumber}`);
      }
      return;
    }
    
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
  }, [chapter, user, completedQuizPages, isLoadingQuiz, isChapter1]);

  const triggerRoleplays = useCallback((pageNumber: number) => {
    if (!isChapter1) return;
    
    const roleplays = getRoleplaysForSlide(pageNumber);
    const uncompletedRoleplays = roleplays.filter(rp => !completedRoleplays.has(rp.id));
    
    if (uncompletedRoleplays.length > 0) {
      setCurrentRoleplays(uncompletedRoleplays);
      setCurrentRoleplayIndex(0);
      setShowRoleplay(true);
    }
  }, [isChapter1, completedRoleplays]);

  const handlePageChange = (page: number, numPages?: number) => {
    setCurrentPage(page);
    if (numPages) setTotalSlides(numPages);
    
    if (isChapter1) {
      if (isQuizSlide(page) && !completedQuizPages.has(page)) {
        triggerQuiz(page);
        
        if (isRoleplaySlide(page)) {
          pendingContentForSlide.current = { quizzes: true, roleplays: getRoleplaysForSlide(page) };
        }
      } else if (isRoleplaySlide(page)) {
        triggerRoleplays(page);
      }
    } else {
      if (page > 1 && page % QUIZ_INTERVAL === 0 && !completedQuizPages.has(page)) {
        triggerQuiz(page);
      }
    }
  };

  const handleRoleplayStart = () => {
    const roleplay = currentRoleplays[currentRoleplayIndex];
    if (roleplay) {
      setShowRoleplay(false);
      setLocation(`/chat/${roleplay.id}`);
    }
  };

  const handleRoleplaySkip = () => {
    const roleplay = currentRoleplays[currentRoleplayIndex];
    if (roleplay) {
      setSkippedRoleplays(prev => {
        if (prev.find(rp => rp.id === roleplay.id)) return prev;
        return [...prev, roleplay];
      });
    }
    
    if (currentRoleplayIndex < currentRoleplays.length - 1) {
      setCurrentRoleplayIndex(prev => prev + 1);
    } else {
      setShowRoleplay(false);
      setCurrentRoleplays([]);
      setCurrentRoleplayIndex(0);
    }
  };

  const handleRoleplayComplete = (roleplayId: string) => {
    setCompletedRoleplays(prev => new Set([...Array.from(prev), roleplayId]));
    setSkippedRoleplays(prev => prev.filter(rp => rp.id !== roleplayId));
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
    
    if (pendingContentForSlide.current?.roleplays) {
      const uncompletedRoleplays = pendingContentForSlide.current.roleplays.filter(
        rp => !completedRoleplays.has(rp.id)
      );
      if (uncompletedRoleplays.length > 0) {
        setCurrentRoleplays(uncompletedRoleplays);
        setCurrentRoleplayIndex(0);
        setShowRoleplay(true);
      }
      pendingContentForSlide.current = null;
    }
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    setCompletedQuizPages(prev => new Set([...Array.from(prev), currentPage]));
    
    if (pendingContentForSlide.current?.roleplays) {
      const uncompletedRoleplays = pendingContentForSlide.current.roleplays.filter(
        rp => !completedRoleplays.has(rp.id)
      );
      if (uncompletedRoleplays.length > 0) {
        setCurrentRoleplays(uncompletedRoleplays);
        setCurrentRoleplayIndex(0);
        setShowRoleplay(true);
      }
      pendingContentForSlide.current = null;
    }
  };

  const handleComplete = () => {
    if (!chapter) return;
    
    if (isChapter1 && skippedRoleplays.length > 0) {
      setShowEndOfChapter(true);
      return;
    }
    
    completeChapter();
  };

  const completeChapter = () => {
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

  const handleStartSkippedRoleplay = (roleplay: PredefinedRoleplay) => {
    setShowEndOfChapter(false);
    setLocation(`/chat/${roleplay.id}`);
  };

  const handleSkipAllRoleplays = () => {
    setShowEndOfChapter(false);
    completeChapter();
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

  const slideProgress = totalSlides > 0 ? Math.round((currentPage / totalSlides) * 100) : 0;
  const allQuizzesDone = completedQuizPages.size >= (isChapter1 ? 5 : Math.floor(totalSlides / QUIZ_INTERVAL));
  const allRoleplaysDone = isChapter1 ? completedRoleplays.size >= getAllChapter1Roleplays().length : true;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav />
      
      <div className="flex-1 flex flex-col max-h-[calc(100vh-64px)]">
        {/* Header with Learning Objectives */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Link href="/dashboard">
                  <Button variant="ghost" size="icon" className="rounded-full shrink-0" data-testid="button-back">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Presentation className="h-4 w-4" />
                      Chapter {chapters.findIndex(c => c.id === chapter.id) + 1}
                    </span>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {chapter.duration}
                    </span>
                  </div>
                  <h1 className="text-lg md:text-xl font-display font-bold text-foreground truncate" data-testid="text-chapter-title">
                    {chapter.title}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {/* Progress Checklist Pills */}
                <div className="hidden md:flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${slideProgress >= 100 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    <FileText className="w-3 h-3" />
                    {currentPage}/{totalSlides || '?'} slides
                    {slideProgress >= 100 && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${completedQuizPages.size > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                    <GraduationCap className="w-3 h-3" />
                    {completedQuizPages.size} quiz{completedQuizPages.size !== 1 ? 'zes' : ''}
                    {allQuizzesDone && <CheckCircle className="w-3 h-3" />}
                  </div>
                  {isChapter1 && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${completedRoleplays.size > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                      <Mic className="w-3 h-3" />
                      {completedRoleplays.size} roleplay{completedRoleplays.size !== 1 ? 's' : ''}
                      {allRoleplaysDone && <CheckCircle className="w-3 h-3" />}
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowObjectives(!showObjectives)}
                  className="text-xs"
                  data-testid="button-toggle-objectives"
                >
                  {showObjectives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span className="hidden sm:inline ml-1">Details</span>
                </Button>
              </div>
            </div>
            
            {/* Expandable Objectives & Checklist */}
            {showObjectives && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* What You'll Learn */}
                  <div>
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      What You'll Learn
                    </h3>
                    <ul className="space-y-1.5">
                      {(chapter.agenda || []).slice(0, 4).map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {(!chapter.agenda || chapter.agenda.length === 0) && (
                        <li className="text-sm text-muted-foreground">Complete this training module</li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Requirements to Complete */}
                  <div>
                    <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Requirements to Complete
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${slideProgress >= 100 ? 'bg-green-500 text-white' : 'bg-muted border border-border'}`}>
                          {slideProgress >= 100 ? <CheckCircle className="w-3 h-3" /> : <span className="text-xs font-bold">{slideProgress}%</span>}
                        </div>
                        <span className={slideProgress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                          View all slides
                        </span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${completedQuizPages.size > 0 ? 'bg-amber-500 text-white' : 'bg-muted border border-border'}`}>
                          {completedQuizPages.size > 0 ? <CheckCircle className="w-3 h-3" /> : <span className="text-xs font-bold">0</span>}
                        </div>
                        <span className={completedQuizPages.size > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}>
                          Complete quizzes (score 90%+)
                        </span>
                      </li>
                      {isChapter1 && (
                        <li className="flex items-center gap-2 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${completedRoleplays.size > 0 ? 'bg-blue-500 text-white' : 'bg-muted border border-border'}`}>
                            {completedRoleplays.size > 0 ? <CheckCircle className="w-3 h-3" /> : <span className="text-xs font-bold">0</span>}
                          </div>
                          <span className={completedRoleplays.size > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}>
                            Practice voice roleplays
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Chapter Progress</span>
                    <span className="font-medium">{slideProgress}% complete</span>
                  </div>
                  <Progress value={slideProgress} className="h-2" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Slide Viewer */}
        <div className="flex-1 overflow-hidden">
          {isChapter1 ? (
            <ImageSlideViewer
              slides={Array.from({ length: 31 }, (_, i) => `/training-slides/slide_${String(i + 1).padStart(2, '0')}.png`)}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onComplete={handleComplete}
              onClose={() => setLocation("/dashboard")}
            />
          ) : isChapter2 ? (
            <ImageSlideViewer
              slides={Array.from({ length: 38 }, (_, i) => `/training-slides-ch2/slide_${String(i + 1).padStart(2, '0')}.png`)}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onComplete={handleComplete}
              onClose={() => setLocation("/dashboard")}
            />
          ) : chapter.pdfUrl ? (
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

      {/* Roleplay Prompt Overlay */}
      <AnimatePresence>
        {showRoleplay && currentRoleplays[currentRoleplayIndex] && (
          <RoleplayPrompt
            roleplay={currentRoleplays[currentRoleplayIndex]}
            onStart={handleRoleplayStart}
            onSkip={handleRoleplaySkip}
            queuePosition={currentRoleplayIndex + 1}
            queueTotal={currentRoleplays.length}
          />
        )}
      </AnimatePresence>

      {/* End of Chapter Summary */}
      <AnimatePresence>
        {showEndOfChapter && (
          <EndOfChapterSummary
            skippedRoleplays={skippedRoleplays}
            completedRoleplays={completedRoleplays}
            allRoleplays={getAllChapter1Roleplays()}
            onStartRoleplay={handleStartSkippedRoleplay}
            onComplete={handleSkipAllRoleplays}
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

function EndOfChapterSummary({
  skippedRoleplays,
  completedRoleplays,
  allRoleplays,
  onStartRoleplay,
  onComplete
}: {
  skippedRoleplays: PredefinedRoleplay[];
  completedRoleplays: Set<string>;
  allRoleplays: PredefinedRoleplay[];
  onStartRoleplay: (roleplay: PredefinedRoleplay) => void;
  onComplete: () => void;
}) {
  const completedCount = completedRoleplays.size;
  const totalCount = allRoleplays.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold" data-testid="text-chapter-complete">
                Chapter Complete!
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} roleplays completed
              </p>
            </div>
          </div>

          {skippedRoleplays.length > 0 && (
            <>
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  You have {skippedRoleplays.length} skipped roleplay{skippedRoleplays.length > 1 ? 's' : ''} to complete
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {skippedRoleplays.map((rp) => (
                  <button
                    key={rp.id}
                    onClick={() => onStartRoleplay(rp)}
                    className="w-full p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left"
                    data-testid={`button-start-roleplay-${rp.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">"{rp.objection}"</p>
                        <p className="text-xs text-muted-foreground">{rp.context}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3">
            {skippedRoleplays.length > 0 ? (
              <Button
                onClick={onComplete}
                variant="outline"
                className="flex-1"
                data-testid="button-skip-all-roleplays"
              >
                Skip All & Finish
              </Button>
            ) : (
              <Button
                onClick={onComplete}
                className="flex-1"
                data-testid="button-finish-chapter"
              >
                Finish Chapter
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
