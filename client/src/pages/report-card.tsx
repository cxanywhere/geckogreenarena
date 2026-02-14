import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, Download, Printer, Share2, Award, Star, TrendingUp, Lock, Brain, Target, Loader2 } from "lucide-react";
import monetateLogoDark from "@/assets/monetate-logo-dark.png";
import monetateLogoLight from "@/assets/monetate-logo-light.png";
import { useTheme } from "next-themes";
import { Link } from "wouter";
import { useRef, useEffect, useState } from "react";
import { api, type UserProgress, type RoleplayAttempt, type Chapter } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface ChapterScore {
  id: string;
  title: string;
  quizScore: number | null;
  roleplayScore: number | null;
  completed: boolean;
  slideProgress: number;
  slidesViewed: number;
  totalSlides: number;
  roleplayAttempts: number;
  roleplaysPassed: number;
  roleplaysFailed: number;
}

export default function ReportCardPage() {
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { resolvedTheme } = useTheme();
  
  const monetateLogo = resolvedTheme === "dark" ? monetateLogoDark : monetateLogoLight;

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: () => api.getUserProgress(user?.id),
    enabled: !!user?.id,
  });

  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ["userAttempts", user?.id],
    queryFn: () => api.getUserAttempts(user?.id),
    enabled: !!user?.id,
  });

  const { data: roleplays = [] } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => api.getRoleplays(),
  });

  const isLoading = chaptersLoading || progressLoading || attemptsLoading;

  const chapterScores: ChapterScore[] = chapters.map(chapter => {
    const chapterProgress = progress.find(p => p.chapterId === chapter.id);
    const chapterAttempts = attempts.filter(a => {
      const roleplay = roleplays.find(r => r.id === a.roleplayId);
      return roleplay?.chapterId === chapter.id;
    });
    
    const bestRoleplayScore = chapterAttempts.length > 0
      ? Math.max(...chapterAttempts.map(a => a.score))
      : null;

    // Calculate slide progress
    const slidesViewed = chapterProgress?.slidesViewed?.length || 0;
    const totalSlides = chapterProgress?.totalSlides || 0;
    const slideProgress = totalSlides > 0 ? Math.round((slidesViewed / totalSlides) * 100) : 0;

    // Calculate roleplay pass/fail counts
    const roleplaysPassed = chapterAttempts.filter(a => {
      if (a.passed !== undefined) {
        return a.passed === 1;
      }
      // Fallback to checking feedback JSON
      try {
        const feedback = a.feedback ? JSON.parse(a.feedback) : null;
        return feedback?.passed === true || a.score >= 70;
      } catch {
        return a.score >= 70;
      }
    }).length;

    return {
      id: chapter.id,
      title: chapter.title,
      quizScore: chapterProgress?.quizScore ?? null,
      roleplayScore: bestRoleplayScore,
      completed: chapterProgress?.completed === 1,
      slideProgress,
      slidesViewed,
      totalSlides,
      roleplayAttempts: chapterAttempts.length,
      roleplaysPassed,
      roleplaysFailed: chapterAttempts.length - roleplaysPassed,
    };
  });

  const topRoleplays = attempts
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(attempt => {
      const roleplay = roleplays.find(r => r.id === attempt.roleplayId);
      let feedback = "";
      let passed = false;
      try {
        const parsed = attempt.feedback ? JSON.parse(attempt.feedback) : null;
        feedback = parsed?.strengths?.[0] || "Good performance";
        passed = attempt.passed === 1 || parsed?.passed === true || attempt.score >= 70;
      } catch {
        feedback = "Good performance";
        passed = attempt.passed === 1 || attempt.score >= 70;
      }
      return {
        id: attempt.id,
        title: roleplay?.name || "Unknown Scenario",
        score: attempt.score,
        feedback,
        passed,
      };
    });

  const totalQuizScores = chapterScores.filter(c => c.quizScore !== null);
  const avgQuizScore = totalQuizScores.length > 0
    ? Math.round(totalQuizScores.reduce((sum, c) => sum + (c.quizScore || 0), 0) / totalQuizScores.length)
    : 0;

  const totalRoleplayScores = chapterScores.filter(c => c.roleplayScore !== null);
  const avgRoleplayScore = totalRoleplayScores.length > 0
    ? Math.round(totalRoleplayScores.reduce((sum, c) => sum + (c.roleplayScore || 0), 0) / totalRoleplayScores.length)
    : 0;

  const overallScore = Math.round((avgQuizScore + avgRoleplayScore) / 2) || 0;
  const passed = overallScore >= 85 && chapterScores.every(c => c.completed);
  const certifiedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 pb-20">
      <Nav />

      <main className="container mx-auto px-4 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <Link href="/dashboard">
              <Button variant="ghost" className="pl-0 mb-2 text-muted-foreground hover:text-primary">
                ← Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Performance Report</h1>
            <p className="text-muted-foreground">Detailed breakdown of your certification progress.</p>
          </div>
          
          {passed && (
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button className="gap-2">
                <Download className="w-4 h-4" /> Download Certificate
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Overall Score Card */}
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader className="bg-primary/5 pb-8 text-center">
                <CardTitle className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <Award className="w-6 h-6" />
                </CardTitle>
                <div className="space-y-1">
                  <h3 className="text-4xl font-display font-bold text-primary">{overallScore}%</h3>
                  <p className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Overall Score</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={passed ? "default" : "destructive"} className={passed ? "bg-green-500 hover:bg-green-600" : ""}>
                    {passed ? "CERTIFIED" : "IN PROGRESS"}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Brain className="w-4 h-4" /> Knowledge Retention
                      </span>
                      <span className="font-bold">{avgQuizScore}%</span>
                    </div>
                    <Progress value={avgQuizScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Target className="w-4 h-4" /> Roleplay Performance
                      </span>
                      <span className="font-bold">{avgRoleplayScore}%</span>
                    </div>
                    <Progress value={avgRoleplayScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Module Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapterScores.map((chapter) => (
                  <div key={chapter.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {chapter.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        )}
                        <p className="font-medium text-sm">{chapter.title}</p>
                      </div>
                      <Badge variant="outline" className="bg-background">
                        {chapter.completed ? "completed" : "in progress"}
                      </Badge>
                    </div>
                    
                    {/* Presentation Progress */}
                    <div className="pl-8 mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Presentation Progress</span>
                        <span className="font-medium">{chapter.slidesViewed}/{chapter.totalSlides || "?"} slides ({chapter.slideProgress}%)</span>
                      </div>
                      <Progress value={chapter.slideProgress} className="h-1.5" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pl-8">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Quiz: </span>
                        <span className="font-bold">{chapter.quizScore ?? "—"}%</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-muted-foreground">Best Roleplay: </span>
                        <span className="font-bold">{chapter.roleplayScore ?? "—"}%</span>
                      </div>
                    </div>
                    
                    {/* Roleplay Stats */}
                    {chapter.roleplayAttempts > 0 && (
                      <div className="pl-8 mt-2 flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">Roleplays:</span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" /> {chapter.roleplaysPassed} passed
                        </span>
                        {chapter.roleplaysFailed > 0 && (
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="w-3 h-3" /> {chapter.roleplaysFailed} failed
                          </span>
                        )}
                        <span className="text-muted-foreground">({chapter.roleplayAttempts} total)</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
             
             {/* Roleplay Feedback */}
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Roleplay Performances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topRoleplays.length > 0 ? (
                  topRoleplays.map((rp) => (
                    <div key={rp.id} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-2">
                         <p className="font-medium text-sm flex-1">"{rp.title}"</p>
                         <div className="flex items-center gap-2">
                           <Badge 
                             variant={rp.passed ? "default" : "destructive"} 
                             className={`text-[10px] px-1.5 py-0 ${rp.passed ? "bg-green-500 hover:bg-green-600" : ""}`}
                           >
                             {rp.passed ? "PASSED" : "FAILED"}
                           </Badge>
                           <span className="text-xs font-bold text-primary">{rp.score}%</span>
                         </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic">"{rp.feedback}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Complete some roleplays to see your performance here.
                  </p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Certificate */}
          <div className="lg:col-span-2">
            {passed ? (
               <div className="w-full overflow-x-auto pb-6">
                 <div className="relative min-w-[700px] md:min-w-full min-h-[500px] md:min-h-[600px] bg-white text-black p-6 md:p-10 shadow-2xl rounded-sm border-[12px] md:border-[16px] border-double border-[#1e3a8a] print:shadow-none print:border-0 print:w-full print:h-full print:absolute print:inset-0 print:z-[9999]" ref={certificateRef}>
                    
                    <div className="absolute top-3 left-3 w-10 h-10 md:w-16 md:h-16 border-t-4 border-l-4 border-[#1e3a8a] pointer-events-none" />
                    <div className="absolute top-3 right-3 w-10 h-10 md:w-16 md:h-16 border-t-4 border-r-4 border-[#1e3a8a] pointer-events-none" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 md:w-16 md:h-16 border-b-4 border-l-4 border-[#1e3a8a] pointer-events-none" />
                    <div className="absolute bottom-3 right-3 w-10 h-10 md:w-16 md:h-16 border-b-4 border-r-4 border-[#1e3a8a] pointer-events-none" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                       <img src={monetateLogo} className="w-2/3 h-2/3 object-contain grayscale" />
                    </div>

                    <div className="relative flex flex-col items-center text-center border-2 border-dashed border-gray-200 p-6 md:p-8 h-full">
                      
                      <div className="w-full space-y-4 md:space-y-6">
                         <div className="flex justify-between items-start w-full px-2 md:px-4">
                            <img src={monetateLogo} alt="Monetate" className="h-10 md:h-14 w-auto object-contain" />
                            <div className="flex flex-col items-end">
                               <div className="flex items-center gap-2 opacity-50">
                                  <img src={monetateLogo} alt="Monetate" className="h-5 w-5 md:h-6 md:w-6 grayscale" />
                                  <span className="font-display font-bold uppercase tracking-widest text-[10px] md:text-xs">Monetate Certified</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="pt-4 md:pt-6">
                           <h1 className="font-serif text-3xl md:text-5xl text-[#1e3a8a] mb-2 tracking-tight">Certificate of Completion</h1>
                           <p className="text-gray-500 font-serif italic text-base md:text-lg">This certifies that</p>
                         </div>
                      </div>

                      <div className="py-6 md:py-8 w-full border-b border-gray-300 max-w-xl mx-auto">
                         <h2 className="font-display text-3xl md:text-5xl font-bold text-black tracking-tight leading-tight">
                           {user?.name || "Sales Representative"}
                         </h2>
                      </div>

                      <div className="max-w-2xl mx-auto space-y-4 pt-6 md:pt-8">
                         <p className="text-gray-600 font-serif text-sm md:text-lg leading-relaxed px-4">
                           Has successfully demonstrated mastery of the <strong className="text-[#1e3a8a]">Monetate Sales Methodology</strong>, achieving excellence in Opening, Pitching, Objection Handling, and Closing strategies through rigorous AI-driven simulation training.
                         </p>
                         
                         <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold pt-2">
                            <span>• Knowledge Score: {avgQuizScore}% •</span>
                            <span>• Roleplay Score: {avgRoleplayScore}% •</span>
                         </div>
                      </div>

                      <div className="flex-grow min-h-[40px]" />

                      <div className="w-full grid grid-cols-2 gap-8 md:gap-20 pt-8 px-4 md:px-8 mt-4">
                         <div className="text-center space-y-1">
                            <div className="h-12 md:h-14 flex items-end justify-center pb-1">
                               <span className="font-script text-xl md:text-2xl text-[#1e3a8a] transform -rotate-6 block">Sarah Jenkins</span>
                            </div>
                            <div className="border-t border-gray-400 pt-2">
                               <p className="font-bold text-xs md:text-sm uppercase text-gray-800">Sarah Jenkins</p>
                               <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">VP of Sales Training</p>
                            </div>
                         </div>
                         
                         <div className="text-center space-y-1">
                            <div className="h-12 md:h-14 flex items-end justify-center pb-1">
                               <p className="font-serif text-sm md:text-lg text-gray-800">{certifiedDate}</p>
                            </div>
                            <div className="border-t border-gray-400 pt-2">
                               <p className="font-bold text-xs md:text-sm uppercase text-gray-800">Date Issued</p>
                               <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide">Overall: {overallScore}%</p>
                            </div>
                         </div>
                      </div>

                      <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 z-20 hidden sm:block">
                         <div className="relative transform scale-75 md:scale-90">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600">
                               <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-yellow-600/50 rounded-full flex items-center justify-center">
                                  <Award className="w-8 h-8 md:w-10 md:h-10 text-yellow-700" />
                               </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 bg-blue-900 rotate-45 -z-10 shadow-lg" />
                         </div>
                      </div>

                    </div>
                 </div>
               </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
                 <Lock className="w-16 h-16 mb-4 opacity-20" />
                 <h3 className="text-xl font-bold mb-2">Certificate Locked</h3>
                 <p className="max-w-md mb-6">Complete all training modules and achieve an overall score of 85% or higher to unlock your official certification.</p>
                 
                 <div className="bg-muted/30 rounded-xl p-6 w-full max-w-md">
                   <h4 className="font-bold mb-4">Your Progress</h4>
                   <div className="space-y-3 text-left">
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span>Current Score</span>
                         <span className="font-bold">{overallScore}% / 85% needed</span>
                       </div>
                       <Progress value={overallScore} className="h-2" />
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span>Chapters Completed</span>
                         <span className="font-bold">{chapterScores.filter(c => c.completed).length} / {chapterScores.length}</span>
                       </div>
                       <Progress value={(chapterScores.filter(c => c.completed).length / Math.max(chapterScores.length, 1)) * 100} className="h-2" />
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
