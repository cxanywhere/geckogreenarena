import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, Lock, BookOpen, Award, GraduationCap, ChevronDown, ChevronUp, Play, Clock, FileText, Mic, RotateCcw, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NudgeBanner } from "@/components/nudge-banner";

import heroBg from "@/assets/hero-arena-bg.png";
import trophyIcon from "@/assets/trophy-icon.png";
import chapterIcon from "@/assets/chapter-icon.png";
import roleplayIcon from "@/assets/roleplay-icon.png";
import certBadge from "@/assets/cert-badge.png";
import darkGridBg from "@/assets/dark-grid-bg.png";

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
    { label: "Overall Progress", value: `${progressPercentage}%`, icon: heroBg, progress: progressPercentage, color: "from-magenta/20 to-purple-600/20", borderColor: "border-magenta/30" },
    { label: "Chapters", value: `${chaptersCompleted}/${totalChapters}`, icon: chapterIcon, progress: totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0, done: allChaptersComplete, color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
    { label: "Roleplays", value: `${uniqueRoleplaysPassed}/${totalRoleplays}`, icon: roleplayIcon, progress: totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0, done: allRoleplaysPassed, color: "from-violet-500/20 to-fuchsia-500/20", borderColor: "border-violet-500/30" },
    { label: "Quiz Average", value: avgQuizScore > 0 ? `${avgQuizScore}%` : "—", icon: certBadge, progress: avgQuizScore, done: quizScoreMet, color: "from-gold/20 to-amber-600/20", borderColor: "border-gold/30" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Nav />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background pointer-events-none" />
        
        <div className="container mx-auto px-4 pt-8 pb-6 md:pt-14 md:pb-10 relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta/10 border border-magenta/20 text-magenta text-xs font-mono font-bold mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-magenta opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-magenta"></span>
              </span>
              TRAINING DASHBOARD
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight mb-3" data-testid="text-welcome">
              Welcome back, <span className="bg-gradient-to-r from-magenta via-purple-400 to-gold bg-clip-text text-transparent">{user?.name || "Sales Rep"}</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Complete your training to earn your LMS certification and unlock full commission eligibility.
            </p>
          </motion.div>

          {user && <NudgeBanner userId={user.id} />}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {statCards.map((stat, i) => (
              <div key={stat.label} className={`relative overflow-hidden rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} p-4 sm:p-5 backdrop-blur-sm`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="absolute top-2 right-2 w-10 h-10 sm:w-12 sm:h-12 opacity-40">
                  <img src={stat.icon} alt="" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <div className="text-2xl sm:text-3xl font-bold mt-1 text-foreground">{stat.value}</div>
                {stat.done && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-[10px] font-semibold text-green-400 uppercase">Complete</span>
                  </div>
                )}
                {!stat.done && stat.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-magenta to-purple-400 rounded-full"
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
        </div>
      </section>

      <div className="container mx-auto px-4 pb-10 max-w-6xl">
        
        {isCertified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-5 glow-gold"
            data-testid="banner-certified"
          >
            <div className="flex items-center gap-4">
              <img src={certBadge} alt="Certified" className="w-14 h-14 object-contain" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Certification Complete!</h3>
                <p className="text-sm text-muted-foreground mt-0.5">You've mastered LMS sales — full commission eligibility unlocked.</p>
              </div>
              <Link href="/report-card">
                <Button className="btn-gradient shrink-0" data-testid="button-view-certificate">
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
            className="mb-8 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/10 to-amber-600/10 p-5"
            data-testid="banner-almost-certified"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={certBadge} alt="" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="font-bold text-foreground">Almost certified!</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Complete your quizzes with a 75%+ average to earn certification.
                    {avgQuizScore > 0 && <span className="font-medium text-gold"> Current: {avgQuizScore}%</span>}
                  </p>
                </div>
              </div>
              <Link href="/quizzes">
                <Button className="btn-gradient shrink-0" data-testid="button-complete-quizzes">
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
            transition={{ delay: 0.15 }}
            className="mb-10 rounded-xl overflow-hidden relative"
            data-testid="card-next-action"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-magenta/20 via-purple-600/20 to-gold/20" />
            <div className="absolute inset-0 border border-magenta/30 rounded-xl" />
            <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-magenta/20 flex items-center justify-center glow-purple">
                  <Play className="w-6 h-6 text-magenta" />
                </div>
                <div>
                  <p className="text-magenta text-xs font-bold uppercase tracking-wider mb-0.5">Your Next Step</p>
                  <h3 className="text-lg font-bold font-display text-foreground">
                    {nextAction.type === "chapter" 
                      ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                      : nextAction.message}
                  </h3>
                </div>
              </div>
              {nextAction.type === "chapter" && nextAction.chapter && (
                <Link href={`/chapter/${nextAction.chapter.id}`}>
                  <Button className="btn-gradient font-bold" data-testid="button-next-action">
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
              {nextAction.type === "quiz" && (
                <Link href="/quizzes">
                  <Button className="btn-gradient font-bold" data-testid="button-next-action-quiz">
                    Review Quizzes <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <img src={chapterIcon} alt="" className="w-10 h-10 object-contain" />
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
                      ? 'border-green-500/30 bg-green-500/5' 
                      : isNext 
                        ? 'border-magenta/40 bg-magenta/5 glow-purple' 
                        : isUnlocked
                          ? 'border-border bg-card hover:border-magenta/30'
                          : 'border-dashed border-white/10 bg-white/[0.02] opacity-50'
                  }`}>
                    {isUnlocked ? (
                      <>
                        <Link href={`/chapter/${chapter.id}`} className="block">
                          <div className="flex flex-col sm:flex-row group">
                            <div className="relative w-full sm:w-48 md:w-56 h-36 sm:h-auto overflow-hidden shrink-0">
                              {chapter.coverImage ? (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-magenta/30 to-purple-600/30" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-card/80" />
                              {isNext && (
                                <div className="absolute top-3 left-3 bg-magenta text-white px-2.5 py-1 rounded-full text-[11px] font-bold uppercase flex items-center gap-1 shadow-lg shadow-magenta/30">
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
                                  <p className="text-[11px] font-bold text-magenta uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                                  <h3 className="font-display font-bold text-lg leading-tight group-hover:text-magenta transition-colors" data-testid={`text-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md shrink-0 border border-white/5">
                                  <Clock className="w-3 h-3" />
                                  {chapter.duration}
                                </div>
                              </div>
                              
                              <p className="text-muted-foreground text-sm line-clamp-1 mb-3">{chapter.description}</p>
                              
                              {chapter.agenda && chapter.agenda.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[11px] bg-magenta/10 text-magenta/80 px-2 py-0.5 rounded-md font-medium border border-magenta/10">{item}</span>
                                  ))}
                                </div>
                              )}
                              
                              {!isCompleted && slidesViewed > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Slide Progress</span>
                                    <span className="font-medium text-foreground">{slidesViewed}/{totalSlides}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-magenta to-purple-400 rounded-full" style={{ width: `${(slidesViewed / totalSlides) * 100}%` }} />
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-3 border-t border-white/5">
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
                                      className="text-xs font-medium text-muted-foreground hover:text-magenta flex items-center gap-1 px-2 py-1 rounded-md hover:bg-magenta/10 transition-colors"
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
                          <div className="border-t border-white/5">
                            <button
                              onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm hover:bg-white/[0.03] transition-colors"
                              data-testid={`button-toggle-roleplays-${chapter.id}`}
                            >
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <img src={roleplayIcon} alt="" className="w-5 h-5 object-contain opacity-60" />
                                <span className="font-medium">{chapterRps.length} Voice Roleplays</span>
                                <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
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
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Chapter {index + 1}</p>
                          <h3 className="font-display font-bold text-foreground/50">{chapter.title}</h3>
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

        <div className="mb-10 rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img src={darkGridBg} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-amber-600/5 border border-gold/20 rounded-xl" />
          <div className="relative p-5">
            <div className="flex items-center gap-3 mb-4">
              <img src={trophyIcon} alt="" className="w-10 h-10 object-contain" />
              <div>
                <h2 className="text-lg font-display font-bold" data-testid="heading-certification">Certification Requirements</h2>
                <p className="text-sm text-muted-foreground">Complete all 3 to earn your LMS certification</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Complete All Chapters", current: chaptersCompleted, total: totalChapters, done: allChaptersComplete, icon: chapterIcon },
                { label: "Pass All Roleplays", current: uniqueRoleplaysPassed, total: totalRoleplays, done: allRoleplaysPassed, icon: roleplayIcon },
                { label: "Quiz Average 75%+", current: avgQuizScore, total: 75, done: quizScoreMet, icon: certBadge, suffix: "%" },
              ].map((req, i) => (
                <div key={req.label} className={`flex items-center gap-3 p-3 rounded-lg border ${req.done ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/[0.03]'}`} data-testid={`cert-req-${i}`}>
                  <img src={req.icon} alt="" className="w-8 h-8 object-contain opacity-70" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{req.label}</p>
                    <p className="text-xs text-muted-foreground">{req.current}{req.suffix || ""} / {req.total}{req.suffix || ""}</p>
                  </div>
                  {req.done && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="border-t border-white/5 bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="font-display font-bold text-lg bg-gradient-to-r from-magenta to-gold bg-clip-text text-transparent mb-0.5">Arena</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">by GigaRev</div>
          <p className="text-muted-foreground/40 text-xs">© 2025 Arena by GigaRev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
