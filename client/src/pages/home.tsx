import { motion } from "framer-motion";
import { Link } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Target, Trophy, CheckCircle, Lock, BookOpen, Zap, Award, GraduationCap } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_bottle_green_glass_tech_shapes.png";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [unlockedRoleplays, setUnlockedRoleplays] = useState<string[]>([]);
  const { user } = useAuth();

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

  // Calculate certification progress stats
  const chaptersCompleted = userProgress.filter((p) => p.completed === 1).length;
  const totalChapters = chapters.length;
  
  // Handle passed as either boolean or number (1/0)
  const isAttemptPassed = (attempt: typeof roleplayAttempts[number]) => {
    return attempt.passed === 1 || (attempt.passed as unknown) === true;
  };
  const roleplaysPassed = roleplayAttempts.filter(isAttemptPassed).length;
  const totalRoleplaysAttempted = roleplayAttempts.length;
  const passedRoleplayIds = roleplayAttempts.filter(isAttemptPassed).map((a) => a.roleplayId);
  const uniqueRoleplaysPassed = Array.from(new Set(passedRoleplayIds)).length;
  const totalRoleplays = roleplays.length;
  
  const quizScores = userProgress.filter((p) => p.quizScore !== null && p.quizScore !== undefined).map((p) => p.quizScore!);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
  const quizzesPassing = quizScores.filter((s) => s >= 90).length;
  
  // Certification requirements
  const allChaptersComplete = chaptersCompleted >= totalChapters && totalChapters > 0;
  const allRoleplaysPassed = uniqueRoleplaysPassed >= totalRoleplays && totalRoleplays > 0;
  const quizScoreMet = avgQuizScore >= 90;
  const isCertified = allChaptersComplete && allRoleplaysPassed && quizScoreMet;

  const progress = {
    chapters: { completed: chaptersCompleted || completedChapters.length, total: totalChapters },
    roleplays: { completed: uniqueRoleplaysPassed, total: totalRoleplays }
  };

  const progressPercentage = Math.round(
    ((progress.chapters.completed + progress.roleplays.completed) / 
    Math.max(progress.chapters.total + progress.roleplays.total, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Nav />
      
      {/* Personalized Welcome Section */}
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-20">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <img src={heroBg} alt="Abstract Background" className="w-full h-full object-cover mask-image-gradient" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col gap-12">
            
            {/* Top Section: Welcome & Stats */}
            <div className="w-full">
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
                  TRAINEE DASHBOARD // PHASE 1
                </div>
                
                <div className="flex flex-col lg:flex-row gap-12 items-end justify-between mb-8">
                   <div className="max-w-2xl">
                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 text-foreground">
                       Welcome, <span className="text-primary transparent-text-stroke">{user?.name || "Sales Rep"}</span>.
                     </h1>
                     <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                       Your journey to the sales floor starts here. Master the pitch, handle the heat, and earn your place among the elite.
                     </p>
                   </div>
                   
                   {/* Compact Progress Card */}
                   <div className="w-full lg:w-80 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-muted-foreground">Certification Progress</h3>
                          <span className="font-bold text-primary">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs font-medium text-muted-foreground">
                           <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {progress.chapters.completed}/{progress.chapters.total} Modules</span>
                           <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {progress.roleplays.completed}/{progress.roleplays.total} Scenarios</span>
                        </div>
                        <Link href="/report-card">
                           <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8 border-primary/20 hover:border-primary/50 hover:bg-primary/5">
                             View Full Report
                           </Button>
                        </Link>
                     </div>
                   </div>
                </div>

                {/* Certification Requirements Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                   {/* Chapter Completion */}
                   <div className={`bg-card/50 backdrop-blur-sm border rounded-2xl p-5 shadow-sm ${allChaptersComplete ? 'border-green-500/50 bg-green-50/20' : 'border-primary/10'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${allChaptersComplete ? 'bg-green-500/20' : 'bg-primary/10'}`}>
                          <BookOpen className={`w-5 h-5 ${allChaptersComplete ? 'text-green-600' : 'text-primary'}`} />
                        </div>
                        {allChaptersComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <h3 className="text-base font-bold font-display mb-1">Training Modules</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Complete all {totalChapters} training chapters
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0} className="h-1.5 flex-1" />
                        <span className={`text-xs font-bold ${allChaptersComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {chaptersCompleted}/{totalChapters}
                        </span>
                      </div>
                  </div>
                   
                   {/* Roleplay Mastery */}
                   <div className={`bg-card/50 backdrop-blur-sm border rounded-2xl p-5 shadow-sm ${allRoleplaysPassed ? 'border-green-500/50 bg-green-50/20' : 'border-primary/10'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${allRoleplaysPassed ? 'bg-green-500/20' : 'bg-blue-500/10'}`}>
                          <Target className={`w-5 h-5 ${allRoleplaysPassed ? 'text-green-600' : 'text-blue-600'}`} />
                        </div>
                        {allRoleplaysPassed && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <h3 className="text-base font-bold font-display mb-1">Roleplay Mastery</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Pass all {totalRoleplays} voice roleplays
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0} className="h-1.5 flex-1" />
                        <span className={`text-xs font-bold ${allRoleplaysPassed ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {uniqueRoleplaysPassed}/{totalRoleplays}
                        </span>
                      </div>
                  </div>
                   
                   {/* Quiz Excellence */}
                   <div className={`bg-card/50 backdrop-blur-sm border rounded-2xl p-5 shadow-sm ${quizScoreMet ? 'border-green-500/50 bg-green-50/20' : 'border-primary/10'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${quizScoreMet ? 'bg-green-500/20' : 'bg-amber-500/10'}`}>
                          <GraduationCap className={`w-5 h-5 ${quizScoreMet ? 'text-green-600' : 'text-amber-600'}`} />
                        </div>
                        {quizScoreMet && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <h3 className="text-base font-bold font-display mb-1">Quiz Excellence</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Score 90%+ average on all quizzes
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={avgQuizScore} className="h-1.5 flex-1" />
                        <span className={`text-xs font-bold ${quizScoreMet ? 'text-green-600' : avgQuizScore > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          {avgQuizScore > 0 ? `${avgQuizScore}%` : 'N/A'}
                        </span>
                      </div>
                  </div>
                </div>
                
                {/* Certification Status Banner */}
                {isCertified && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-16 text-white shadow-lg">
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
                  </div>
                )}
              </motion.div>
            </div>

            {/* Training Modules Grid - Full Width */}
            <div>
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                   <BookOpen className="w-6 h-6 text-primary" />
                   Training Path
                 </h2>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {chapters.map((chapter) => {
                    const isCompleted = completedChapters.includes(chapter.id);
                    return (
                      <Link key={chapter.id} href={`/chapter/${chapter.id}`}>
                        <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer h-full ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-border bg-card hover:border-primary/50 hover:shadow-xl hover:-translate-y-1'}`}>
                          <div className="flex flex-col h-full">
                            {/* Image Section */}
                            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40">
                              {chapter.coverImage && (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              )}
                              <div className={`absolute inset-0 ${isCompleted ? 'bg-green-900/20' : 'bg-black/40'} group-hover:bg-transparent transition-colors`} />
                              
                              <div className="absolute top-4 left-4">
                                 {isCompleted ? (
                                    <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                      <CheckCircle className="w-3 h-3" /> Completed
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur text-primary px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                                      <BookOpen className="w-3 h-3" /> {chapter.duration} Module
                                    </div>
                                  )}
                              </div>

                              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                                 <h3 className="font-display font-bold text-2xl leading-tight text-white mb-1 group-hover:text-green-300 transition-colors">{chapter.title}</h3>
                                 <p className="text-white/80 text-sm">{chapter.subtitle}</p>
                              </div>
                            </div>
                            
                            {/* Text Section */}
                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-muted-foreground mb-6 line-clamp-2">{chapter.description}</p>
                                
                                <div className="space-y-3 mb-8 flex-1">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground/90">
                                      <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary/40'}`} />
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              
                              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                  <div className="bg-primary/10 p-1.5 rounded-md">
                                     <Bot className="w-3 h-3 text-primary" />
                                  </div>
                                  {chapter.slides.length} Interactive Steps
                                </div>
                                <span className="text-sm font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                                  {isCompleted ? "Review Module" : "Start Module"} <ArrowRight className="ml-1 w-4 h-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters & Tasks Section */}
      <section className="py-12 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">Certification Modules</h2>
            <span className="text-sm text-muted-foreground">Showing {roleplays.length} Active Roleplays</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleplays.map((scenario, i) => {
              // All roleplays unlocked for testing
              const isLocked = false;
              return (
                <div key={scenario.id} className="relative group">
                  <RoleplayCard scenario={scenario} index={i} isLocked={isLocked} />
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
          <p className="text-muted-foreground text-sm mb-8">© 2025 GigaRev Industries. All rights reserved. Licensed to GeckoGreen.</p>
        </div>
      </footer>
    </div>
  );
}
