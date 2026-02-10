import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Target, Trophy, CheckCircle, Lock, BookOpen, Zap, Award, GraduationCap, Info, ChevronDown, ChevronUp, Play, Clock, FileText, Mic } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_bottle_green_glass_tech_shapes.png";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NudgeBanner } from "@/components/nudge-banner";

export default function Home() {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [unlockedRoleplays, setUnlockedRoleplays] = useState<string[]>([]);
  const [showCertGuide, setShowCertGuide] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
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
    const permanentlyFailed = !hasPassed && attempts.length >= 3;
    return { hasPassed, permanentlyFailed, attemptCount: attempts.length };
  };
  
  const quizScores = userProgress.filter((p) => p.quizScore !== null && p.quizScore !== undefined).map((p) => p.quizScore!);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
  
  // Certification requires 16+ unique roleplays passed (fair to reps who trained before/after roleplay changes)
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

  const getNextAction = () => {
    for (let i = 0; i < chapters.length; i++) {
      if (!isChapterCompleted(chapters[i].id)) {
        return {
          type: "chapter",
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
          type: "roleplay",
          roleplay: unpassedRoleplay,
          message: "Practice voice roleplays to pass all scenarios",
        };
      }
    }
    
    if (!quizScoreMet && avgQuizScore > 0) {
      return {
        type: "quiz",
        message: "Retake quizzes to improve your average score above 75%",
      };
    }
    
    return null;
  };

  const nextAction = getNextAction();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Nav />
      
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-20">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <img src={heroBg} alt="Abstract Background" className="w-full h-full object-cover mask-image-gradient" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-8">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                TRAINEE DASHBOARD
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-4 text-foreground">
                Welcome, <span className="text-primary transparent-text-stroke">{user?.name || "Sales Rep"}</span>.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
                Complete your training to get certified and unlock full commission eligibility.
              </p>
            </motion.div>

            {user && <NudgeBanner userId={user.id} />}

            {/* Almost Certified Banner - Roleplays done but quizzes pending */}
            {allRoleplaysPassed && !quizScoreMet && !isCertified && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5"
                data-testid="banner-almost-certified"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl shrink-0">
                      <GraduationCap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">You're almost certified!</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        You've passed your roleplays — now complete your quizzes with a 75%+ average to earn your certification.
                        {avgQuizScore > 0 && (
                          <span className="font-medium text-amber-600 dark:text-amber-400"> Current average: {avgQuizScore}%</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Link href="/quizzes">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white shrink-0" data-testid="button-complete-quizzes">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Complete Quizzes
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* How to Get Certified Guide */}
            <Collapsible open={showCertGuide} onOpenChange={setShowCertGuide}>
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20 rounded-2xl overflow-hidden">
                <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-primary/5 transition-colors" data-testid="button-toggle-cert-guide">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">How to Get Certified</h3>
                      <p className="text-sm text-muted-foreground">Complete these 3 requirements to earn your certification</p>
                    </div>
                  </div>
                  {showCertGuide ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-card/80 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">1</div>
                          <h4 className="font-bold">Complete All Chapters</h4>
                          {allChaptersComplete && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Watch each presentation, learn the material, and finish all slides in order.
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <FileText className="w-3 h-3" />
                          <span className="font-medium">{chaptersCompleted}/{totalChapters} chapters complete</span>
                        </div>
                      </div>
                      
                      <div className="bg-card/80 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-600">2</div>
                          <h4 className="font-bold">Pass All Roleplays</h4>
                          {allRoleplaysPassed && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Practice voice conversations with AI homeowners and pass each scenario.
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Mic className="w-3 h-3" />
                          <span className="font-medium">{uniqueRoleplaysPassed}/{totalRoleplays} roleplays passed</span>
                        </div>
                      </div>
                      
                      <div className="bg-card/80 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-600">3</div>
                          <h4 className="font-bold">Score 75%+ on Quizzes</h4>
                          {quizScoreMet && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Take the quiz at the end of each chapter and maintain a 75%+ average.
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <GraduationCap className="w-3 h-3" />
                          <span className="font-medium">Current average: {avgQuizScore > 0 ? `${avgQuizScore}%` : "Not started"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* Next Action Card */}
            {nextAction && !isCertified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Play className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium mb-1">YOUR NEXT STEP</p>
                      <h3 className="text-xl font-bold font-display">
                        {nextAction.type === "chapter" 
                          ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                          : nextAction.message}
                      </h3>
                    </div>
                  </div>
                  {nextAction.type === "chapter" && nextAction.chapter && (
                    <Link href={`/chapter/${nextAction.chapter.id}`}>
                      <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold shadow-md" data-testid="button-next-action">
                        Start Now <ArrowRight className="ml-2 w-4 h-4" />
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

            {/* Certification Complete Banner */}
            {isCertified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display mb-1">Certification Complete!</h3>
                    <p className="text-white/90">
                      Congratulations! You've completed all requirements and are now certified for full commission eligibility.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Training Path - Sequential Chapters */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Training Path
                  </h2>
                  <p className="text-muted-foreground mt-1">Complete each chapter in order to progress</p>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
                  <Progress value={totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0} className="w-24 h-2" />
                  <span className="text-sm font-bold">{chaptersCompleted}/{totalChapters}</span>
                </div>
              </div>
               
              <div className="space-y-6">
                {chapters.map((chapter, index) => {
                  const isCompleted = isChapterCompleted(chapter.id);
                  const isUnlocked = isChapterUnlocked(index);
                  const isNext = !isCompleted && isUnlocked && (index === 0 || isChapterCompleted(chapters[index - 1]?.id));
                  const chapterProgress = getChapterProgress(chapter.id);
                  const slidesViewed = chapterProgress?.slideProgress || 0;
                  const totalSlides = chapterProgress?.totalSlides || chapter.slideCount || 10;
                  
                  return (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`relative flex gap-6 ${!isUnlocked ? 'opacity-60' : ''}`}>
                        {/* Step Number & Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                            isCompleted 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : isNext 
                                ? 'bg-primary border-primary text-white animate-pulse' 
                                : isUnlocked 
                                  ? 'bg-card border-primary/50 text-primary' 
                                  : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : !isUnlocked ? <Lock className="w-5 h-5" /> : index + 1}
                          </div>
                          {index < chapters.length - 1 && (
                            <div className={`w-0.5 flex-1 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-border'}`} style={{ minHeight: '2rem' }} />
                          )}
                        </div>
                        
                        {/* Chapter Card */}
                        <div className="flex-1 pb-6">
                          {isUnlocked ? (
                            <Link href={`/chapter/${chapter.id}`} className="block">
                              <div className={`group rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                isCompleted 
                                  ? 'border-green-200 bg-green-50/30 dark:bg-green-950/20' 
                                  : isNext 
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 hover:shadow-xl' 
                                    : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
                              }`}>
                                <div className="flex flex-col md:flex-row">
                                  {/* Chapter Image */}
                                  <div className="relative w-full md:w-64 h-40 md:h-auto overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 shrink-0">
                                    {chapter.coverImage && (
                                      <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-t" />
                                    
                                    {isNext && (
                                      <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 animate-pulse">
                                        <Play className="w-3 h-3" /> Start Here
                                      </div>
                                    )}
                                    {isCompleted && (
                                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Completed
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Chapter Content */}
                                  <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Chapter {index + 1}</p>
                                        <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{chapter.title}</h3>
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        <Clock className="w-3 h-3" />
                                        {chapter.duration}
                                      </div>
                                    </div>
                                    
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{chapter.description}</p>
                                    
                                    {/* What You'll Learn */}
                                    {chapter.agenda && chapter.agenda.length > 0 && (
                                      <div className="mb-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">What you'll learn:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {chapter.agenda.slice(0, 3).map((item, i) => (
                                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{item}</span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Progress Bar for in-progress chapters */}
                                    {!isCompleted && slidesViewed > 0 && (
                                      <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                          <span className="text-muted-foreground">Progress</span>
                                          <span className="font-medium">{slidesViewed}/{totalSlides} slides</span>
                                        </div>
                                        <Progress value={(slidesViewed / totalSlides) * 100} className="h-1.5" />
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {totalSlides} slides</span>
                                        <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Quiz included</span>
                                      </div>
                                      <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                                        {isCompleted ? "Review" : slidesViewed > 0 ? "Continue" : "Start"} <ArrowRight className="ml-1 w-4 h-4" />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ) : (
                            <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-5">
                              <div className="flex items-center gap-3 mb-2">
                                <Lock className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Chapter {index + 1}</p>
                                  <h3 className="font-display font-bold text-lg text-muted-foreground">{chapter.title}</h3>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Complete Chapter {index} first to unlock this module
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Roleplays Section */}
      <section className="py-12 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Mic className="w-6 h-6 text-blue-500" />
                Voice Roleplays
              </h2>
              <p className="text-muted-foreground mt-1">Practice real conversations with AI homeowners</p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Progress value={totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0} className="w-24 h-2" />
              <span className="text-sm font-bold">{uniqueRoleplaysPassed}/{totalRoleplays} passed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...roleplays]
              .sort((a, b) => {
                const extractOrder = (id: string) => {
                  const match = id.match(/rp-(\d+)/);
                  if (match) {
                    return parseInt(match[1]);
                  }
                  return 9999;
                };
                return extractOrder(a.id) - extractOrder(b.id);
              })
              .map((scenario, i) => {
                const status = getRoleplayStatus(scenario.id);
                return (
                  <div key={scenario.id} className="relative group">
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
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="font-display font-bold text-2xl text-primary mb-1">arena ai</div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-4">by gigarev</div>
          <p className="text-muted-foreground text-sm mb-8">© 2025 GigaRev Arena AI. All rights reserved. Licensed to GeckoGreen.</p>
        </div>
      </footer>
    </div>
  );
}
