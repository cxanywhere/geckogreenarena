import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { ImageSlideViewer } from "@/components/image-slide-viewer";
import { TextSlideViewer } from "@/components/text-slide-viewer";
import { PDFViewer } from "@/components/pdf-viewer";
import { PresentMode } from "@/components/present-mode";
import { VoiceQA } from "@/components/voice-qa";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, BookOpen, Presentation, Brain, Loader2, Mic, CheckCircle, Clock, Target, FileText, GraduationCap, ChevronDown, ChevronUp, PlayCircle, MessageCircleQuestion } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { api, type QuizQuestion } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useOrientation } from "@/hooks/useOrientation";
import { type PredefinedRoleplay } from "@/lib/chapter1-roleplays";
import { RoleplayPrompt } from "@/components/roleplay-prompt";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";


export default function ChapterPage() {
  const [, params] = useRoute("/chapter/:id");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const { data: allRoleplays = [] } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => api.getRoleplays(),
  });

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch user's roleplay status (attempts, passed, permanently failed)
  // refetchOnMount ensures fresh data when returning from roleplay
  const { data: roleplayStatus = {}, refetch: refetchRoleplayStatus } = useQuery({
    queryKey: ["roleplay-status", user?.id],
    queryFn: () => api.getUserRoleplayStatus(user.id),
    enabled: !!user?.id,
    staleTime: 0, // Always consider data stale
    refetchOnMount: 'always', // Force refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  const chapter = chapters.find(c => c.id === params?.id);
  
  const findRoleplayIdByOrderIndex = useCallback((orderIndex: number): string | null => {
    const chapterId = params?.id;
    const roleplay = allRoleplays.find((rp: any) => 
      rp.orderIndex === orderIndex && rp.chapterId === chapterId
    );
    return roleplay?.id || null;
  }, [allRoleplays, params?.id]);

  const findRoleplayBySlug = useCallback((slug: string): any | null => {
    return allRoleplays.find((rp: any) => rp.slug === slug) || null;
  }, [allRoleplays]);

  const getChapterRoleplaySlugs = useCallback((): string[] => {
    if (!chapter?.slides || !Array.isArray(chapter.slides)) return [];
    return (chapter.slides as any[])
      .filter((s: any) => s.type === 'roleplay' && s.roleplaySlug)
      .map((s: any) => s.roleplaySlug);
  }, [chapter?.slides]);

  const getRoleplayForSlide = useCallback((slideIndex: number): PredefinedRoleplay | null => {
    if (!chapter?.slides || !Array.isArray(chapter.slides)) return null;
    const slide = (chapter.slides as any[])[slideIndex - 1];
    if (!slide || slide.type !== 'roleplay' || !slide.roleplaySlug) return null;
    const dbRoleplay = findRoleplayBySlug(slide.roleplaySlug);
    if (!dbRoleplay) return null;
    return {
      id: dbRoleplay.id,
      afterSlide: slideIndex,
      orderIndex: dbRoleplay.orderIndex ?? 0,
      objection: dbRoleplay.name || '',
      context: dbRoleplay.description || slide.content || '',
      passCriteria: dbRoleplay.passCriteria || '',
      failConditions: dbRoleplay.failConditions || '',
      winningResponse: dbRoleplay.winningResponse || '',
    };
  }, [chapter?.slides, findRoleplayBySlug]);
  
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
  const [completedRoleplayOrderIndexes, setCompletedRoleplayOrderIndexes] = useState<Set<number>>(() => {
    if (!params?.id) return new Set();
    const saved = localStorage.getItem(`chapter_roleplay_completed_orderindex_${params.id}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [skippedRoleplays, setSkippedRoleplays] = useState<PredefinedRoleplay[]>([]);
  const [showEndOfChapter, setShowEndOfChapter] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [showObjectives, setShowObjectives] = useState(false);
  const [pendingNextPage, setPendingNextPage] = useState<number | null>(null);
  const [quizSourcePage, setQuizSourcePage] = useState<number | null>(null);
  const [showPresentMode, setShowPresentMode] = useState(false);
  const [showVoiceQA, setShowVoiceQA] = useState(false);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);
  const [narrationData, setNarrationData] = useState<any[] | null>(null);

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
      localStorage.setItem(`chapter_roleplay_completed_orderindex_${params.id}`, JSON.stringify(Array.from(completedRoleplayOrderIndexes)));
    }
  }, [completedRoleplayOrderIndexes, params?.id]);

  // Refetch roleplay status when returning from a roleplay (component mounts or URL changes)
  useEffect(() => {
    if (user?.id) {
      refetchRoleplayStatus();
    }
  }, [params?.id, user?.id]);

  const chapterHasRoleplays = getChapterRoleplaySlugs().length > 0;

  const hasTextSlides = chapter?.slides && Array.isArray(chapter.slides) && chapter.slides.length > 0;

  const { data: dbQuizSlides } = useQuery({
    queryKey: ["quiz-slides", chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return { slides: [] };
      return api.getQuizSlides(chapter.id);
    },
    enabled: !!chapter?.id,
    staleTime: Infinity,
  });
  const quizSlideSet = new Set(dbQuizSlides?.slides || []);

  const pendingContentForSlide = useRef<{ quizzes: boolean; roleplays: PredefinedRoleplay[] } | null>(null);

  const triggerQuiz = useCallback(async (pageNumber: number) => {
    if (!chapter || !user || isLoadingQuiz) return;
    
    if (completedQuizPages.has(pageNumber)) return;
    if (lastCheckedPage.current === pageNumber) return;
    
    lastCheckedPage.current = pageNumber;
    
    const shouldHaveQuiz = quizSlideSet.has(pageNumber);
    
    if (!shouldHaveQuiz) return;
    
    setIsLoadingQuiz(true);
    
    try {
      console.log(`Fetching quiz for page ${pageNumber}...`);
      // Use unified API for all chapters - fetches from database with real IDs
      const result = await api.getQuizForSlide(chapter.id, pageNumber);
      
      if (result?.questions && result.questions.length > 0) {
        setQuizQuestions(result.questions);
        setShowQuiz(true);
        console.log(`Got ${result.questions.length} quiz questions from database`);
      } else {
        console.log("No quiz questions found for this slide");
        lastCheckedPage.current = 0;
      }
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      lastCheckedPage.current = 0;
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [chapter, user, completedQuizPages, isLoadingQuiz, quizSlideSet.size]);

  // Helper to check if a roleplay should be shown based on DB status
  const shouldShowRoleplay = useCallback((orderIndex: number): boolean => {
    const roleplayId = findRoleplayIdByOrderIndex(orderIndex);
    if (!roleplayId) return true; // If we can't find it, default to showing
    
    const status = roleplayStatus[roleplayId];
    if (!status) return true; // No attempts yet, show it
    
    // Don't show if passed or permanently failed (500+ attempts without passing)
    if (status.passed || status.permanentlyFailed) return false;
    
    return true; // Not passed, attempts < 500, show it
  }, [roleplayStatus, findRoleplayIdByOrderIndex]);

  const triggerRoleplays = useCallback((pageNumber: number) => {
    const roleplay = getRoleplayForSlide(pageNumber);
    if (!roleplay) return;
    
    if (!shouldShowRoleplay(roleplay.orderIndex)) return;
    
    setCurrentRoleplays([roleplay]);
    setCurrentRoleplayIndex(0);
    setShowRoleplay(true);
  }, [getRoleplayForSlide, shouldShowRoleplay]);

  const handlePageChange = (page: number, numPages?: number) => {
    if (numPages) setTotalSlides(numPages);
    
    const isMovingForward = page > currentPage;
    const previousPage = currentPage;
    
    if (isMovingForward) {
      const roleplay = getRoleplayForSlide(previousPage);
      if (roleplay && shouldShowRoleplay(roleplay.orderIndex)) {
        setPendingNextPage(page);
        setCurrentRoleplays([roleplay]);
        setCurrentRoleplayIndex(0);
        setShowRoleplay(true);
        return;
      }
    }
    
    // Handle quizzes - trigger when LEAVING the slide (after viewing content)
    // This ensures users see the content before being quizzed on it
    if (isMovingForward && quizSlideSet.has(previousPage) && !completedQuizPages.has(previousPage)) {
      setPendingNextPage(page);
      setQuizSourcePage(previousPage);
      triggerQuiz(previousPage);
      return;
    }
    
    // Update the current page
    setCurrentPage(page);
  };

  const handleRoleplayStart = () => {
    const roleplay = currentRoleplays[currentRoleplayIndex];
    if (roleplay) {
      setShowRoleplay(false);
      const actualId = findRoleplayIdByOrderIndex(roleplay.orderIndex);
      if (actualId) {
        // Navigate to chat with chapter context for return navigation
        setLocation(`/chat/${actualId}?returnTo=/chapter/${chapter?.id}&returnPage=${currentPage}`);
      } else {
        toast.error("Roleplay not found. Please try again.");
      }
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
      
      // Advance to the pending page if there is one
      if (pendingNextPage !== null) {
        setCurrentPage(pendingNextPage);
        setPendingNextPage(null);
      }
    }
  };

  const handleRoleplayComplete = (orderIndex: number) => {
    setCompletedRoleplayOrderIndexes(prev => new Set([...Array.from(prev), orderIndex]));
    setSkippedRoleplays(prev => prev.filter(rp => rp.orderIndex !== orderIndex));
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
    // Mark the source page (where the quiz was triggered from) as completed
    const pageToMark = quizSourcePage ?? currentPage;
    setCompletedQuizPages(prev => new Set([...Array.from(prev), pageToMark]));
    setQuizSourcePage(null);
    lastCheckedPage.current = 0; // Reset to allow future checks
    toast.success("Quiz completed! Keep learning.");
    
    // Invalidate user progress to update dashboard quiz scores
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ["user-progress", user.id] });
    }
    
    // Advance to the pending page if there is one (after quiz completion)
    if (pendingNextPage !== null) {
      setCurrentPage(pendingNextPage);
      setPendingNextPage(null);
    }
    
    if (pendingContentForSlide.current?.roleplays) {
      const eligibleRoleplays = pendingContentForSlide.current.roleplays.filter(
        rp => shouldShowRoleplay(rp.orderIndex)
      );
      if (eligibleRoleplays.length > 0) {
        setCurrentRoleplays(eligibleRoleplays);
        setCurrentRoleplayIndex(0);
        setShowRoleplay(true);
      }
      pendingContentForSlide.current = null;
    }
  };

  const handleQuizSkip = () => {
    setShowQuiz(false);
    // Mark the source page (where the quiz was triggered from) as completed (skipped counts as completed)
    const pageToMark = quizSourcePage ?? currentPage;
    setCompletedQuizPages(prev => new Set([...Array.from(prev), pageToMark]));
    setQuizSourcePage(null);
    lastCheckedPage.current = 0; // Reset to allow future checks
    
    // Advance to the pending page if there is one (after quiz skip)
    if (pendingNextPage !== null) {
      setCurrentPage(pendingNextPage);
      setPendingNextPage(null);
    }
    
    if (pendingContentForSlide.current?.roleplays) {
      const eligibleRoleplays = pendingContentForSlide.current.roleplays.filter(
        rp => shouldShowRoleplay(rp.orderIndex)
      );
      if (eligibleRoleplays.length > 0) {
        setCurrentRoleplays(eligibleRoleplays);
        setCurrentRoleplayIndex(0);
        setShowRoleplay(true);
      }
      pendingContentForSlide.current = null;
    }
  };

  const handleComplete = () => {
    if (!chapter) return;
    
    if (chapterHasRoleplays && skippedRoleplays.length > 0) {
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
    const actualId = findRoleplayIdByOrderIndex(roleplay.orderIndex);
    if (actualId) {
      setLocation(`/chat/${actualId}?returnTo=/chapter/${chapter?.id}&returnPage=${currentPage}`);
    } else {
      toast.error("Roleplay not found. Please try again.");
    }
  };

  const handleSkipAllRoleplays = () => {
    setShowEndOfChapter(false);
    completeChapter();
  };

  const handleLaunchPresentMode = async () => {
    if (!chapter) return;

    if (narrationData && narrationData.length > 0) {
      setShowPresentMode(true);
      return;
    }

    setIsGeneratingNarration(true);

    try {
      const checkRes = await fetch(`/api/chapters/${chapter.id}/narration`);
      const checkData = await checkRes.json();

      if (checkData.success && checkData.allReady) {
        setNarrationData(checkData.narration);
        setShowPresentMode(true);
      } else {
        toast.error("Narration is not available for this chapter yet.");
      }
    } catch (error) {
      console.error("Present mode error:", error);
      toast.error("Failed to load presentation. Please try again.");
    } finally {
      setIsGeneratingNarration(false);
    }
  };

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-magenta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  const slideProgress = totalSlides > 0 ? Math.round((currentPage / totalSlides) * 100) : 0;
  const totalQuizzesForChapter = quizSlideSet.size;
  const allQuizzesDone = totalQuizzesForChapter > 0 && completedQuizPages.size >= totalQuizzesForChapter;
  const chapterRoleplaySlugs = getChapterRoleplaySlugs();
  const totalChapterRoleplays = chapterRoleplaySlugs.length;
  const allRoleplaysDone = totalChapterRoleplays > 0 ? completedRoleplayOrderIndexes.size >= totalChapterRoleplays : true;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Nav />

      {showPresentMode && narrationData && (
        <PresentMode
          slides={chapter.slides as any[]}
          narration={narrationData}
          chapterTitle={chapter.title}
          chapterId={params?.id || ""}
          onClose={() => setShowPresentMode(false)}
        />
      )}

      <AnimatePresence>
        {showVoiceQA && (
          <VoiceQA
            chapterId={params?.id || ""}
            chapterTitle={chapter.title}
            currentSlideIndex={currentPage - 1}
            currentSlideTitle={(chapter.slides as any[])?.[currentPage - 1]?.title || `Slide ${currentPage}`}
            onClose={() => setShowVoiceQA(false)}
          />
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header with Learning Objectives */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full shrink-0 h-8 w-8 sm:h-10 sm:w-10" data-testid="button-back">
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                      <span className="flex items-center gap-1 shrink-0">
                        <Presentation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Chapter {chapters.findIndex(c => c.id === chapter.id) + 1}
                      </span>
                      <span className="text-border shrink-0">|</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {chapter.duration}
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg md:text-xl font-display font-bold text-foreground truncate" data-testid="text-chapter-title">
                      {chapter.title}
                    </h1>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="bg-magenta hover:bg-magenta/90 text-white text-xs gap-1 sm:gap-1.5 px-2 sm:px-3 h-8"
                    onClick={handleLaunchPresentMode}
                    disabled={isGeneratingNarration}
                    data-testid="button-present-mode"
                  >
                    {isGeneratingNarration ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">Loading...</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Auto Present</span>
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1 sm:gap-1.5 border-magenta/30 text-magenta hover:bg-magenta/10 px-2 sm:px-3 h-8"
                    onClick={() => setShowVoiceQA(!showVoiceQA)}
                    data-testid="button-ask-question"
                  >
                    <MessageCircleQuestion className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ask</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowObjectives(!showObjectives)}
                    className="text-xs px-2 sm:px-3 h-8"
                    data-testid="button-toggle-objectives"
                  >
                    {showObjectives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span className="hidden sm:inline ml-1">Details</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
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
                {chapterHasRoleplays && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${completedRoleplayOrderIndexes.size > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                    <Mic className="w-3 h-3" />
                    {completedRoleplayOrderIndexes.size}/{totalChapterRoleplays} roleplay{totalChapterRoleplays !== 1 ? 's' : ''}
                    {allRoleplaysDone && <CheckCircle className="w-3 h-3" />}
                  </div>
                )}
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
                      <Target className="w-4 h-4 text-magenta" />
                      What You'll Learn
                    </h3>
                    <ul className="space-y-1.5">
                      {(chapter.agenda || []).slice(0, 4).map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-magenta mt-1.5 shrink-0" />
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
                          Complete quizzes (score 75%+)
                        </span>
                      </li>
                      {chapterHasRoleplays && (
                        <li className="flex items-center gap-2 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${completedRoleplayOrderIndexes.size > 0 ? 'bg-blue-500 text-white' : 'bg-muted border border-border'}`}>
                            {completedRoleplayOrderIndexes.size > 0 ? <CheckCircle className="w-3 h-3" /> : <span className="text-xs font-bold">0</span>}
                          </div>
                          <span className={completedRoleplayOrderIndexes.size > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}>
                            Practice voice roleplays ({completedRoleplayOrderIndexes.size}/{totalChapterRoleplays})
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
        <div className="flex-1 min-h-0 overflow-hidden">
          {hasTextSlides ? (
            <TextSlideViewer
              slides={chapter.slides as any[]}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onComplete={handleComplete}
              onClose={() => setLocation("/dashboard")}
              navigationDisabled={showQuiz}
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
        {showRoleplay && currentRoleplays[currentRoleplayIndex] && (() => {
          const currentRp = currentRoleplays[currentRoleplayIndex];
          const roleplayId = findRoleplayIdByOrderIndex(currentRp.orderIndex);
          const status = roleplayId ? roleplayStatus[roleplayId] : null;
          return (
            <RoleplayPrompt
              roleplay={currentRp}
              onStart={handleRoleplayStart}
              onSkip={handleRoleplaySkip}
              queuePosition={currentRoleplayIndex + 1}
              queueTotal={currentRoleplays.length}
              attemptsUsed={status?.attempts || 0}
              maxAttempts={500}
              hasPassed={status?.passed || false}
              permanentlyFailed={status?.permanentlyFailed || false}
            />
          );
        })()}
      </AnimatePresence>

      {/* End of Chapter Summary */}
      <AnimatePresence>
        {showEndOfChapter && (
          <EndOfChapterSummary
            skippedRoleplays={skippedRoleplays}
            completedRoleplayOrderIndexes={completedRoleplayOrderIndexes}
            allRoleplays={chapterRoleplaySlugs.map((slug, i) => {
              const dbRp = findRoleplayBySlug(slug);
              return {
                id: dbRp?.id || slug,
                afterSlide: i + 1,
                orderIndex: dbRp?.orderIndex ?? i,
                objection: dbRp?.name || '',
                context: dbRp?.description || '',
                passCriteria: dbRp?.passCriteria || '',
                failConditions: dbRp?.failConditions || '',
                winningResponse: dbRp?.winningResponse || '',
              };
            })}
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
        <div className={`bg-magenta/5 border-border shrink-0 ${
          isLandscape 
            ? 'w-48 border-r p-3 flex flex-col justify-between' 
            : 'border-b p-3'
        }`}>
          <div className={`flex items-center ${isLandscape ? 'flex-col text-center gap-2' : 'justify-between'}`}>
            <div className={`flex items-center ${isLandscape ? 'flex-col' : 'gap-2'}`}>
              <div className="w-8 h-8 rounded-full bg-magenta/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-magenta" />
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
                    idx === currentIndex ? "bg-magenta" : idx < currentIndex ? "bg-magenta/40" : "bg-muted"
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
                      ? "border-magenta bg-magenta/5"
                      : "border-border hover:border-magenta/50"
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
                        ? "bg-magenta text-primary-foreground"
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
                    idx === currentIndex ? "bg-magenta" : idx < currentIndex ? "bg-magenta/40" : "bg-muted"
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
  completedRoleplayOrderIndexes,
  allRoleplays,
  onStartRoleplay,
  onComplete
}: {
  skippedRoleplays: PredefinedRoleplay[];
  completedRoleplayOrderIndexes: Set<number>;
  allRoleplays: PredefinedRoleplay[];
  onStartRoleplay: (roleplay: PredefinedRoleplay) => void;
  onComplete: () => void;
}) {
  const completedCount = completedRoleplayOrderIndexes.size;
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
            <div className="w-12 h-12 rounded-full bg-magenta/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-magenta" />
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
