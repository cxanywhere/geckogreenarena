import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lock, BookOpen, Award, GraduationCap, ChevronDown, ChevronUp, Play, Clock, FileText, Mic, RotateCcw, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NudgeBanner } from "@/components/nudge-banner";

import iconChapter from "@/assets/icon-chapter.png";
import iconRoleplay from "@/assets/icon-roleplay.png";
import iconTrophy from "@/assets/icon-trophy.png";
import iconCert from "@/assets/icon-cert.png";
import iconProgress from "@/assets/icon-progress.png";

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

  const progressPercentage = Math.round(
    ((chaptersCompleted + uniqueRoleplaysPassed) / 
    Math.max(totalChapters + totalRoleplays, 1)) * 100
  );

  const getChapterProgress = (chapterId: string) => {
    return userProgress.find(p => p.chapterId === chapterId);
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
        return { type: "chapter" as const, chapter: chapters[i], index: i, message: `Continue with Chapter ${i + 1}` };
      }
    }
    if (!allRoleplaysPassed) {
      const unpassedRoleplay = roleplays.find(r => !passedRoleplayIds.includes(r.id));
      if (unpassedRoleplay) {
        return { type: "roleplay" as const, roleplay: unpassedRoleplay, message: "Practice voice roleplays to pass all scenarios" };
      }
    }
    if (!quizScoreMet && avgQuizScore > 0) {
      return { type: "quiz" as const, message: "Retake quizzes to improve your average score above 75%" };
    }
    return null;
  };

  const nextAction = getNextAction();

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

  const statCards = [
    { label: "Overall Progress", value: `${progressPercentage}%`, icon: iconProgress, progress: progressPercentage, bgColor: "bg-violet-50", borderColor: "border-violet-200" },
    { label: "Chapters", value: `${chaptersCompleted}/${totalChapters}`, icon: iconChapter, progress: totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0, done: allChaptersComplete, bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { label: "Roleplays", value: `${uniqueRoleplaysPassed}/${totalRoleplays}`, icon: iconRoleplay, progress: totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0, done: allRoleplaysPassed, bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { label: "Quiz Average", value: avgQuizScore > 0 ? `${avgQuizScore}%` : "--", icon: iconCert, progress: avgQuizScore, done: quizScoreMet, bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans">
      <Nav />
      
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1" data-testid="text-welcome">
            Welcome back, {user?.name || "Sales Rep"}
          </h1>
          <p className="text-muted-foreground">
            Complete your training to earn your LMS certification.
          </p>
        </motion.div>

        {user && <NudgeBanner userId={user.id} />}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {statCards.map((stat, i) => (
            <div key={stat.label} className={`relative overflow-hidden rounded-xl border ${stat.borderColor} ${stat.bgColor} p-4 sm:p-5`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <img src={stat.icon} alt="" className="w-8 h-8 object-contain opacity-80" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
              {stat.done && (
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase">Complete</span>
                </div>
              )}
              {!stat.done && stat.progress !== undefined && (
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-foreground/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {isCertified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5"
            data-testid="banner-certified"
          >
            <div className="flex items-center gap-4">
              <img src={iconCert} alt="Certified" className="w-12 h-12 object-contain" />
              <div className="flex-1">
                <h3 className="text-base font-bold text-foreground">Certification Complete!</h3>
                <p className="text-sm text-muted-foreground mt-0.5">You've mastered LMS sales. Full commission eligibility unlocked.</p>
              </div>
              <Link href="/report-card">
                <Button className="bg-foreground text-background hover:bg-foreground/90 shrink-0" data-testid="button-view-certificate">
                  View Certificate <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {allRoleplaysPassed && !quizScoreMet && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-5"
            data-testid="banner-almost-certified"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={iconCert} alt="" className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-bold text-foreground">Almost certified!</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Complete your quizzes with a 75%+ average to earn certification.
                    {avgQuizScore > 0 && <span className="font-semibold text-foreground"> Current: {avgQuizScore}%</span>}
                  </p>
                </div>
              </div>
              <Link href="/quizzes">
                <Button className="bg-foreground text-background hover:bg-foreground/90 shrink-0" data-testid="button-complete-quizzes">
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
            transition={{ delay: 0.12 }}
            className="mb-8 rounded-xl border border-border bg-white p-5 sm:p-6"
            data-testid="card-next-action"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Your Next Step</p>
                  <h3 className="text-base font-bold text-foreground">
                    {nextAction.type === "chapter" 
                      ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                      : nextAction.message}
                  </h3>
                </div>
              </div>
              {nextAction.type === "chapter" && nextAction.chapter && (
                <Link href={`/chapter/${nextAction.chapter.id}`}>
                  <Button className="bg-foreground text-background hover:bg-foreground/90" data-testid="button-next-action">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              {nextAction.type === "quiz" && (
                <Link href="/quizzes">
                  <Button className="bg-foreground text-background hover:bg-foreground/90" data-testid="button-next-action-quiz">
                    Review Quizzes <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <img src={iconChapter} alt="" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="text-lg font-bold text-foreground" data-testid="heading-training-path">Training Path</h2>
              <p className="text-sm text-muted-foreground">Complete each chapter in order to progress</p>
            </div>
          </div>
           
          <div className="space-y-3">
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
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                    isCompleted 
                      ? 'border-emerald-200 bg-white' 
                      : isNext 
                        ? 'border-amber-300 bg-white shadow-sm' 
                        : isUnlocked
                          ? 'border-border bg-white hover:border-gray-300 hover:shadow-sm'
                          : 'border-dashed border-gray-200 bg-gray-50/50 opacity-60'
                  }`}>
                    {isUnlocked ? (
                      <>
                        <Link href={`/chapter/${chapter.id}`} className="block">
                          <div className="flex flex-col sm:flex-row group">
                            <div className="relative w-full sm:w-44 md:w-52 h-32 sm:h-auto overflow-hidden shrink-0">
                              {chapter.coverImage ? (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                              )}
                              {isNext && (
                                <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1">
                                  <Play className="w-3 h-3" /> Up Next
                                </div>
                              )}
                              {isCompleted && (
                                <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Done
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 sm:p-5 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                                  <h3 className="font-bold text-base leading-tight group-hover:text-amber-700 transition-colors" data-testid={`text-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded-md shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {chapter.duration}
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-1 mb-3">{chapter.description}</p>
                              
                              {chapter.agenda && chapter.agenda.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[11px] bg-gray-100 text-muted-foreground px-2 py-0.5 rounded-md font-medium">{item}</span>
                                  ))}
                                </div>
                              )}
                              
                              {!isCompleted && slidesViewed > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Slide Progress</span>
                                    <span className="font-medium text-foreground">{slidesViewed}/{totalSlides}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground/60 rounded-full" style={{ width: `${(slidesViewed / totalSlides) * 100}%` }} />
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                                      className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                                      data-testid={`button-review-chapter-${chapter.id}`}
                                    >
                                      <RotateCcw className={`w-3 h-3 ${resettingChapter === chapter.id ? 'animate-spin' : ''}`} />
                                      Restart
                                    </button>
                                  )}
                                  <span className="text-sm font-medium text-foreground flex items-center group-hover:translate-x-0.5 transition-transform">
                                    {isCompleted ? "Review" : isNext ? "Start" : "Continue"} <ArrowRight className="ml-1 w-4 h-4" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        {chapterRps.length > 0 && (
                          <div className="border-t border-gray-100">
                            <button
                              onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-colors"
                              data-testid={`button-toggle-roleplays-${chapter.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <img src={iconRoleplay} alt="" className="w-5 h-5 object-contain" />
                                <span>{chapterRps.length} Roleplays</span>
                                <span className="text-xs text-emerald-600 font-semibold">
                                  {chapterRps.filter(r => getRoleplayStatus(r.id).hasPassed).length} passed
                                </span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-4"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {chapterRps.map((rp, rpIndex) => {
                                    const status = getRoleplayStatus(rp.id);
                                    return (
                                      <RoleplayCard 
                                        key={rp.id} 
                                        scenario={rp} 
                                        index={rpIndex}
                                        isLocked={false}
                                        hasPassed={status.hasPassed}
                                        permanentlyFailed={status.permanentlyFailed}
                                      />
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                          <h3 className="font-bold text-base text-muted-foreground">{chapter.title}</h3>
                          <p className="text-xs text-muted-foreground/60 mt-1">Complete previous chapter to unlock</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="text-center py-8 border-t border-border">
          <p className="text-xs text-muted-foreground">Arena AI by GigaRev &middot; Built for LinkedIn Marketing Solutions</p>
        </div>
      </div>
    </div>
  );
}
