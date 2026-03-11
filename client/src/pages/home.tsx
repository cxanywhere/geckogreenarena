import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Target, Trophy, CheckCircle, Lock, BookOpen, Zap, Award, GraduationCap, Info, ChevronDown, ChevronUp, Play, Clock, FileText, Mic, RotateCcw, BarChart3, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NudgeBanner } from "@/components/nudge-banner";

export default function Home() {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [unlockedRoleplays, setUnlockedRoleplays] = useState<string[]>([]);
  const [resettingChapter, setResettingChapter] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const { data: roleplays = [] } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => api.getRoleplays(),
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: () => api.getUserProgress(user!.id),
    enabled: !!user?.id,
  });

  const { data: roleplayAttempts = [] } = useQuery({
    queryKey: ["roleplay-attempts", user?.id],
    queryFn: () => api.getUserAttempts(user!.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    const savedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    const savedRoleplays = JSON.parse(localStorage.getItem("unlocked_roleplays") || "[]");
    setCompletedChapters(savedChapters);
    setUnlockedRoleplays(savedRoleplays);
  }, []);

  const chaptersCompleted = userProgress.filter((p) => p.completed === 1).length;
  const totalChapters = chapters.length;
  
  const isAttemptPassed = (attempt: typeof roleplayAttempts[number]) => {
    return attempt.passed === 1 || (attempt.passed as unknown) === true;
  };
  const roleplaysPassed = roleplayAttempts.filter(isAttemptPassed).length;
  const passedRoleplayIds = roleplayAttempts.filter(isAttemptPassed).map((a) => a.roleplayId);
  const uniqueRoleplaysPassed = Array.from(new Set(passedRoleplayIds)).length;
  const totalRoleplays = roleplays.length;
  
  const getRoleplayStatus = (roleplayId: string) => {
    const attempts = roleplayAttempts.filter(a => a.roleplayId === roleplayId);
    const hasPassed = attempts.some(a => isAttemptPassed(a));
    const permanentlyFailed = !hasPassed && attempts.length >= 500;
    return { hasPassed, permanentlyFailed, attemptCount: attempts.length };
  };
  
  const quizScores = userProgress.filter((p) => p.quizScore !== null && p.quizScore !== undefined).map((p) => p.quizScore!);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
  
  const REQUIRED_ROLEPLAYS_FOR_CERTIFICATION = 16;
  const allChaptersComplete = chaptersCompleted >= totalChapters && totalChapters > 0;
  const allRoleplaysPassed = uniqueRoleplaysPassed >= REQUIRED_ROLEPLAYS_FOR_CERTIFICATION;
  const quizScoreMet = avgQuizScore >= 75;
  const isCertified = allChaptersComplete && allRoleplaysPassed && quizScoreMet;

  const progress = {
    chapters: { completed: chaptersCompleted || completedChapters.length, total: totalChapters },
    roleplays: { completed: uniqueRoleplaysPassed, total: totalRoleplays }
  };

  const progressPercentage = Math.round(
    ((progress.chapters.completed + progress.roleplays.completed) / 
    Math.max(progress.chapters.total + progress.roleplays.total, 1)) * 100
  );

  const getChapterProgress = (chapterId: string) => {
    const prog = userProgress.find(p => p.chapterId === chapterId);
    return prog;
  };

  const isChapterCompleted = (chapterId: string) => {
    const prog = getChapterProgress(chapterId);
    return prog?.completed === 1 || completedChapters.includes(chapterId);
  };

  const isChapterUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevChapter = chapters[index - 1];
    return prevChapter ? isChapterCompleted(prevChapter.id) : true;
  };

  const handleReviewChapter = async (e: React.MouseEvent, chapterId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResettingChapter(chapterId);
    try {
      const res = await fetch("/api/progress/reset-slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ chapterId }),
      });
      if (res.ok) {
        localStorage.removeItem(`chapter_pdf_progress_${chapterId}`);
        await queryClient.invalidateQueries({ queryKey: ["user-progress", user?.id] });
        setLocation(`/chapter/${chapterId}`);
      }
    } catch (err) {
      console.error("Failed to reset slides:", err);
    } finally {
      setResettingChapter(null);
    }
  };

  const getNextAction = () => {
    for (let i = 0; i < chapters.length; i++) {
      if (!isChapterCompleted(chapters[i].id)) {
        return {
          type: "chapter" as const,
          chapter: chapters[i],
          index: i,
          message: `Continue with Chapter ${i + 1}`,
        };
      }
    }
    
    if (!allRoleplaysPassed) {
      const unpassedRoleplay = roleplays.find(r => !passedRoleplayIds.includes(r.id));
      if (unpassedRoleplay) {
        return {
          type: "roleplay" as const,
          roleplay: unpassedRoleplay,
          message: "Practice voice roleplays to pass all scenarios",
        };
      }
    }
    
    if (!quizScoreMet && avgQuizScore > 0) {
      return {
        type: "quiz" as const,
        message: "Retake quizzes to improve your average score above 75%",
      };
    }
    
    return null;
  };

  const nextAction = getNextAction();

  const certRequirements = [
    { label: "Chapters", done: allChaptersComplete, current: chaptersCompleted, total: totalChapters, icon: BookOpen, color: "text-blue-500" },
    { label: "Roleplays", done: allRoleplaysPassed, current: uniqueRoleplaysPassed, total: totalRoleplays, icon: Mic, color: "text-violet-500" },
    { label: "Quiz Avg", done: quizScoreMet, current: avgQuizScore, total: 75, icon: GraduationCap, color: "text-amber-500", suffix: "%" },
  ];

  const chapterRoleplays = (chapterId: string) => {
    return [...roleplays]
      .filter(r => r.chapterId === chapterId)
      .sort((a, b) => {
        const extractOrder = (id: string) => {
          const match = id.match(/rp-(?:lms-)?(\d+)/);
          return match ? parseInt(match[1]) : 9999;
        };
        return extractOrder(a.id) - extractOrder(b.id);
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Nav />
      
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
        
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground" data-testid="text-welcome">
            Welcome back, <span className="text-magenta">{user?.name || "Sales Rep"}</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track your progress and continue your LMS sales certification.
          </p>
        </motion.div>

        {user && <NudgeBanner userId={user.id} />}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <div className="bg-card rounded-xl border border-border p-4 sm:p-5" data-testid="stat-overall-progress">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall</span>
              <div className="w-8 h-8 rounded-lg bg-magenta/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-magenta" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="h-1.5 mt-2" />
          </div>

          {certRequirements.map((req) => (
            <div key={req.label} className="bg-card rounded-xl border border-border p-4 sm:p-5" data-testid={`stat-${req.label.toLowerCase()}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{req.label}</span>
                <div className={`w-8 h-8 rounded-lg ${req.done ? 'bg-green-500/10' : 'bg-muted'} flex items-center justify-center`}>
                  {req.done ? <CheckCircle className="w-4 h-4 text-green-500" /> : <req.icon className={`w-4 h-4 ${req.color}`} />}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {req.current}{req.suffix || ""}<span className="text-base font-normal text-muted-foreground">/{req.total}{req.suffix || ""}</span>
              </div>
              {!req.suffix && (
                <Progress value={req.total > 0 ? (req.current / req.total) * 100 : 0} className="h-1.5 mt-2" />
              )}
            </div>
          ))}
        </motion.div>

        {isCertified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5 p-5"
            data-testid="banner-certified"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/15 rounded-xl shrink-0">
                <Award className="w-7 h-7 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Certification Complete!</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  You've completed all requirements and are now certified for full commission eligibility.
                </p>
              </div>
              <Link href="/report-card">
                <Button variant="outline" className="border-green-500/30 text-green-600 hover:bg-green-500/10 shrink-0" data-testid="button-view-certificate">
                  View Certificate
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {allRoleplaysPassed && !quizScoreMet && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-5"
            data-testid="banner-almost-certified"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/15 rounded-xl shrink-0">
                  <GraduationCap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Almost certified!</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Complete your quizzes with a 75%+ average to earn certification.
                    {avgQuizScore > 0 && (
                      <span className="font-medium text-amber-600 dark:text-amber-400"> Current: {avgQuizScore}%</span>
                    )}
                  </p>
                </div>
              </div>
              <Link href="/quizzes">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white shrink-0" data-testid="button-complete-quizzes">
                  Complete Quizzes <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {nextAction && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 rounded-xl bg-gradient-to-r from-navy to-magenta/80 p-5 text-white shadow-lg shadow-magenta/10"
            data-testid="card-next-action"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/15 rounded-lg">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">Next Step</p>
                  <h3 className="text-lg font-bold font-display">
                    {nextAction.type === "chapter" 
                      ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                      : nextAction.message}
                  </h3>
                </div>
              </div>
              {nextAction.type === "chapter" && nextAction.chapter && (
                <Link href={`/chapter/${nextAction.chapter.id}`}>
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold shadow-md" data-testid="button-next-action">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              {nextAction.type === "quiz" && (
                <Link href="/quizzes">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold shadow-md" data-testid="button-next-action-quiz">
                    Review Quizzes <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-magenta/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-magenta" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold" data-testid="heading-training-path">Training Path</h2>
              <p className="text-sm text-muted-foreground">Complete each chapter in order to progress</p>
            </div>
          </div>
           
          <div className="space-y-4">
            {chapters.map((chapter, index) => {
              const isCompleted = isChapterCompleted(chapter.id);
              const isUnlocked = isChapterUnlocked(index);
              const isNext = !isCompleted && isUnlocked && (index === 0 || isChapterCompleted(chapters[index - 1]?.id));
              const chapterProgress = getChapterProgress(chapter.id);
              const slidesViewed = chapterProgress?.slidesViewed?.length || 0;
              const totalSlides = chapterProgress?.totalSlides || chapter.slideCount || 10;
              const chapterRps = chapterRoleplays(chapter.id);
              const isExpanded = expandedChapter === chapter.id;
              
              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                    isCompleted 
                      ? 'border-green-500/30 bg-card' 
                      : isNext 
                        ? 'border-magenta/40 bg-card shadow-md shadow-magenta/5' 
                        : isUnlocked
                          ? 'border-border bg-card hover:border-magenta/30 hover:shadow-sm'
                          : 'border-dashed border-muted-foreground/20 bg-muted/20 opacity-60'
                  }`}>
                    {isUnlocked ? (
                      <>
                        <Link href={`/chapter/${chapter.id}`} className="block">
                          <div className="flex flex-col sm:flex-row group">
                            <div className="relative w-full sm:w-48 md:w-56 h-32 sm:h-auto overflow-hidden bg-gradient-to-br from-navy/20 to-magenta/20 shrink-0">
                              {chapter.coverImage && (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r" />
                              {isNext && (
                                <div className="absolute top-3 left-3 bg-magenta text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1">
                                  <Play className="w-3 h-3" /> Up Next
                                </div>
                              )}
                              {isCompleted && (
                                <div className="absolute top-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Done
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 sm:p-5 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                                  <h3 className="font-display font-bold text-lg leading-tight group-hover:text-magenta transition-colors truncate" data-testid={`text-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/80 px-2 py-1 rounded-md shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {chapter.duration}
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-1 mb-3">{chapter.description}</p>
                              
                              {chapter.agenda && chapter.agenda.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[11px] bg-magenta/8 text-magenta/90 px-2 py-0.5 rounded-md font-medium">{item}</span>
                                  ))}
                                </div>
                              )}
                              
                              {!isCompleted && slidesViewed > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{slidesViewed}/{totalSlides} slides</span>
                                  </div>
                                  <Progress value={(slidesViewed / totalSlides) * 100} className="h-1.5" />
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {totalSlides} slides</span>
                                  <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> {chapterRps.length} roleplays</span>
                                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Quiz</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isCompleted && (
                                    <button
                                      onClick={(e) => handleReviewChapter(e, chapter.id)}
                                      disabled={resettingChapter === chapter.id}
                                      className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                                      data-testid={`button-review-chapter-${chapter.id}`}
                                    >
                                      <RotateCcw className={`w-3 h-3 ${resettingChapter === chapter.id ? 'animate-spin' : ''}`} />
                                      Restart
                                    </button>
                                  )}
                                  <span className="text-sm font-semibold text-magenta flex items-center group-hover:translate-x-0.5 transition-transform">
                                    {isCompleted ? "Review" : slidesViewed > 0 ? "Continue" : "Start"} <ArrowRight className="ml-1 w-4 h-4" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {chapterRps.length > 0 && (
                          <div className="border-t border-border/50">
                            <button
                              onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm hover:bg-muted/50 transition-colors"
                              data-testid={`button-toggle-roleplays-${chapter.id}`}
                            >
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mic className="w-4 h-4" />
                                <span className="font-medium">{chapterRps.length} Voice Roleplays</span>
                                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                  {chapterRps.filter(rp => getRoleplayStatus(rp.id).hasPassed).length}/{chapterRps.length} passed
                                </span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </button>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-4 pb-4"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {chapterRps.map((scenario, i) => {
                                    const status = getRoleplayStatus(scenario.id);
                                    return (
                                      <div key={scenario.id}>
                                        <RoleplayCard 
                                          scenario={scenario} 
                                          index={i} 
                                          isLocked={false}
                                          hasPassed={status.hasPassed}
                                          permanentlyFailed={status.permanentlyFailed}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Chapter {index + 1}</p>
                          <h3 className="font-display font-bold text-foreground/60">{chapter.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Complete Chapter {index} to unlock</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mb-10 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold" data-testid="heading-certification">Certification Requirements</h2>
              <p className="text-sm text-muted-foreground">Complete all 3 to earn your LMS certification</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {certRequirements.map((req, i) => (
              <div key={req.label} className={`flex items-center gap-3 p-3 rounded-lg border ${req.done ? 'border-green-500/30 bg-green-500/5' : 'border-border bg-muted/30'}`} data-testid={`cert-req-${req.label.toLowerCase()}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${req.done ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {req.done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{req.label === "Chapters" ? "Complete All Chapters" : req.label === "Roleplays" ? "Pass All Roleplays" : "Quiz Average 75%+"}</p>
                  <p className="text-xs text-muted-foreground">{req.current}{req.suffix || ""} / {req.total}{req.suffix || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="font-display font-bold text-lg text-foreground mb-0.5">Arena</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">by GigaRev</div>
          <p className="text-muted-foreground/60 text-xs">© 2025 Arena by GigaRev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
