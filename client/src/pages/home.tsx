import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lock, BookOpen, Award, GraduationCap, ChevronDown, ChevronUp, Play, Clock, FileText, Mic, RotateCcw, BarChart3, Target, Zap } from "lucide-react";
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
    { label: "Overall Progress", value: `${progressPercentage}%`, icon: <Zap className="w-4 h-4" />, progress: progressPercentage },
    { label: "Chapters", value: `${chaptersCompleted}/${totalChapters}`, icon: <BookOpen className="w-4 h-4" />, progress: totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0, done: allChaptersComplete },
    { label: "Roleplays", value: `${uniqueRoleplaysPassed}/${totalRoleplays}`, icon: <Mic className="w-4 h-4" />, progress: totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0, done: allRoleplaysPassed },
    { label: "Quiz Average", value: avgQuizScore > 0 ? `${avgQuizScore}%` : "--", icon: <GraduationCap className="w-4 h-4" />, progress: avgQuizScore, done: quizScoreMet },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans">
      <Nav />
      
      <div className="container mx-auto px-4 py-8 md:py-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1" data-testid="text-welcome">
            Welcome back, {user?.name || "Sales Rep"}
          </h1>
          <p className="text-[#787774]">
            Complete your training to earn your LMS certification.
          </p>
        </motion.div>

        {user && <NudgeBanner userId={user.id} />}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {statCards.map((stat, i) => (
            <div key={stat.label} className="rounded-lg border border-[#e8e8e5] bg-white p-4 sm:p-5" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-[#787774] uppercase tracking-wider">{stat.label}</span>
                <div className="w-7 h-7 rounded-md bg-[#f7f7f5] flex items-center justify-center text-[#787774]">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{stat.value}</div>
              {stat.done && (
                <div className="flex items-center gap-1 mt-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2ecc71]" />
                  <span className="text-[11px] font-medium text-[#2ecc71] uppercase">Complete</span>
                </div>
              )}
              {!stat.done && stat.progress !== undefined && (
                <div className="mt-3">
                  <div className="h-1 w-full bg-[#f0f0ed] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#37352f] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
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
            className="mb-8 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="banner-certified"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#2ecc71]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Certification Complete!</h3>
                <p className="text-sm text-[#787774] mt-0.5">You've mastered LMS sales. Full commission eligibility unlocked.</p>
              </div>
              <Link href="/report-card">
                <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm shrink-0" data-testid="button-view-certificate">
                  View Certificate <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {allRoleplaysPassed && !quizScoreMet && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="banner-almost-certified"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#fffbeb] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#d97706]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">Almost certified!</h3>
                  <p className="text-sm text-[#787774]">
                    Complete quizzes with 75%+ average.
                    {avgQuizScore > 0 && <span className="font-medium text-[#1a1a1a]"> Current: {avgQuizScore}%</span>}
                  </p>
                </div>
              </div>
              <Link href="/quizzes">
                <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm shrink-0" data-testid="button-complete-quizzes">
                  Complete Quizzes <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {nextAction && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="card-next-action"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f7f7f5] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-[#37352f]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#787774] uppercase tracking-wider">Next step</p>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">
                    {nextAction.type === "chapter" 
                      ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                      : nextAction.message}
                  </h3>
                </div>
              </div>
              {nextAction.type === "chapter" && nextAction.chapter && (
                <Link href={`/chapter/${nextAction.chapter.id}`}>
                  <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm" data-testid="button-next-action">
                    Continue <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
              {nextAction.type === "quiz" && (
                <Link href="/quizzes">
                  <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm" data-testid="button-next-action-quiz">
                    Review Quizzes <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="mb-10">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[#1a1a1a]" data-testid="heading-training-path">Training Path</h2>
            <p className="text-sm text-[#787774]">Complete each chapter in order to progress</p>
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
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`rounded-lg border overflow-hidden transition-all duration-200 ${
                    isCompleted 
                      ? 'border-[#e8e8e5] bg-white' 
                      : isNext 
                        ? 'border-[#d4d4d0] bg-white shadow-sm' 
                        : isUnlocked
                          ? 'border-[#e8e8e5] bg-white hover:shadow-sm'
                          : 'border-dashed border-[#e8e8e5] bg-[#fafaf8] opacity-50'
                  }`}>
                    {isUnlocked ? (
                      <>
                        <Link href={`/chapter/${chapter.id}`} className="block">
                          <div className="flex flex-col sm:flex-row group">
                            <div className="relative w-full sm:w-44 md:w-52 h-32 sm:h-auto overflow-hidden shrink-0 bg-[#f0f0ed]">
                              {chapter.coverImage ? (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-[#f0f0ed] flex items-center justify-center">
                                  <BookOpen className="w-8 h-8 text-[#c4c4c0]" />
                                </div>
                              )}
                              {isNext && (
                                <div className="absolute top-3 left-3 bg-[#37352f] text-white px-2.5 py-1 rounded text-[11px] font-semibold uppercase flex items-center gap-1">
                                  <Play className="w-3 h-3" /> Up Next
                                </div>
                              )}
                              {isCompleted && (
                                <div className="absolute top-3 left-3 bg-[#2ecc71] text-white px-2.5 py-1 rounded text-[11px] font-semibold uppercase flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Done
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 sm:p-5 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium text-[#787774] uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                                  <h3 className="font-semibold text-[15px] leading-tight text-[#1a1a1a] group-hover:text-[#37352f]" data-testid={`text-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#787774] bg-[#f7f7f5] px-2 py-1 rounded shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {chapter.duration}
                                </div>
                              </div>
                              
                              <p className="text-[#787774] text-sm line-clamp-1 mb-3">{chapter.description}</p>
                              
                              {chapter.agenda && chapter.agenda.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[11px] bg-[#f7f7f5] text-[#787774] px-2 py-0.5 rounded font-medium">{item}</span>
                                  ))}
                                </div>
                              )}
                              
                              {!isCompleted && slidesViewed > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-[#787774]">Slide Progress</span>
                                    <span className="font-medium text-[#1a1a1a]">{slidesViewed}/{totalSlides}</span>
                                  </div>
                                  <div className="h-1 w-full bg-[#f0f0ed] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#37352f] rounded-full" style={{ width: `${(slidesViewed / totalSlides) * 100}%` }} />
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-3 border-t border-[#f0f0ed]">
                                <div className="flex items-center gap-3 text-xs text-[#787774]">
                                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {totalSlides} slides</span>
                                  <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> {chapterRps.length} roleplays</span>
                                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Quiz</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isCompleted && (
                                    <button
                                      onClick={(e) => handleReviewChapter(e, chapter.id)}
                                      disabled={resettingChapter === chapter.id}
                                      className="text-xs font-medium text-[#787774] hover:text-[#1a1a1a] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#f7f7f5] transition-colors"
                                      data-testid={`button-review-chapter-${chapter.id}`}
                                    >
                                      <RotateCcw className={`w-3 h-3 ${resettingChapter === chapter.id ? 'animate-spin' : ''}`} />
                                      Restart
                                    </button>
                                  )}
                                  <span className="text-sm font-medium text-[#37352f] flex items-center group-hover:translate-x-0.5 transition-transform">
                                    {isCompleted ? "Review" : isNext ? "Start" : "Continue"} <ArrowRight className="ml-1 w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        {chapterRps.length > 0 && (
                          <div className="border-t border-[#f0f0ed]">
                            <button
                              onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-[#787774] hover:text-[#1a1a1a] hover:bg-[#fafaf8] transition-colors"
                              data-testid={`button-toggle-roleplays-${chapter.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <Mic className="w-4 h-4" />
                                <span>{chapterRps.length} Roleplays</span>
                                <span className="text-xs text-[#2ecc71] font-medium">
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
                        <div className="w-9 h-9 rounded-lg bg-[#f7f7f5] flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4 text-[#c4c4c0]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#c4c4c0] uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                          <h3 className="font-semibold text-sm text-[#c4c4c0]">{chapter.title}</h3>
                          <p className="text-xs text-[#d4d4d0] mt-0.5">Complete previous chapter to unlock</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="text-center py-6 border-t border-[#e8e8e5]">
          <p className="text-xs text-[#c4c4c0]">Arena AI by GigaRev &middot; Built for LinkedIn Marketing Solutions</p>
        </div>
      </div>
    </div>
  );
}
