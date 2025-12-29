import { motion } from "framer-motion";
import { Link } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { ROLEPLAYS, CHAPTERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, Target, Trophy, CheckCircle, Lock, BookOpen } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_bottle_green_glass_tech_shapes.png";
import { useState, useEffect } from "react";

export default function Home() {
  // Simple state to track completions from localStorage
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  useEffect(() => {
    // Load completion state
    const saved = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    setCompletedChapters(saved);
  }, []);

  const progress = {
    chapters: { completed: completedChapters.length, total: CHAPTERS.length },
    roleplays: { completed: 3, total: ROLEPLAYS.length }
  };

  const progressPercentage = Math.round(
    ((progress.chapters.completed + progress.roleplays.completed) / 
    (progress.chapters.total + progress.roleplays.total)) * 100
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
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Left: Motivational Message */}
            <div className="flex-1 max-w-2xl">
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
                
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight tracking-tight mb-4 text-foreground">
                  Welcome, <span className="text-primary transparent-text-stroke">Paul Wilkerson</span>.
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  Your journey to the sales floor starts here. Master the pitch, handle the heat, and earn your place among the elite.
                </p>

                <div className="bg-white/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-display mb-1">Eye on the Prize</h3>
                      <p className="text-muted-foreground text-sm">
                        Complete your certification to unlock full commission eligibility. The floor is waiting for you.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Progress Tracker */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-96 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-primary/10 p-6"
            >
              <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Certification Progress
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted-foreground">Overall Completion</span>
                    <span className="font-bold text-primary">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Required Training</h4>
                    {CHAPTERS.map((chapter) => {
                      const isCompleted = completedChapters.includes(chapter.id);
                      return (
                        <Link key={chapter.id} href={`/chapter/${chapter.id}`}>
                          <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'}`}>
                            {/* Card Content */}
                            <div className="flex h-32">
                              {/* Image Section */}
                              <div className="w-1/3 relative">
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover" />
                                <div className={`absolute inset-0 ${isCompleted ? 'bg-green-900/20' : 'bg-black/20'} group-hover:bg-transparent transition-colors`} />
                              </div>
                              
                              {/* Text Section */}
                              <div className="w-2/3 p-4 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                     {isCompleted ? (
                                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                                          <CheckCircle className="w-3 h-3" /> Completed
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase">
                                          <BookOpen className="w-3 h-3" /> {chapter.duration} Module
                                        </div>
                                      )}
                                  </div>
                                  <h3 className="font-display font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{chapter.title}</h3>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{chapter.subtitle}</p>
                                </div>
                                
                                <div className="flex items-center justify-end">
                                  <span className="text-xs font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                                    {isCompleted ? "Review" : "Start Module"} <ArrowRight className="ml-1 w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Onboarding Basics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground font-medium mb-3">
                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span>Advanced Objection Handling</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground/50">
                    <Lock className="w-4 h-4" />
                    <span>Final Certification Exam</span>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6">
                  Continue Training <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapters & Tasks Section */}
      <section className="py-12 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold">Certification Modules</h2>
            <span className="text-sm text-muted-foreground">Showing {ROLEPLAYS.length} Active Roleplays</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROLEPLAYS.map((scenario, i) => {
              const isLocked = !completedChapters.includes(scenario.chapterId);
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
          <div className="font-display font-bold text-2xl text-primary mb-4">arena ai by gigarev</div>
          <p className="text-muted-foreground text-sm mb-8">© 2025 GigaRev Industries. All rights reserved. Licensed to GeckoGreen.</p>
        </div>
      </footer>
    </div>
  );
}
