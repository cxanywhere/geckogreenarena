import { useRoute, Link } from "wouter";
import { useState } from "react";
import { Nav } from "@/components/nav"; // Or ManagerHeader
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Target, Zap, Clock, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from "lucide-react";
import { SALES_REPS, ROLEPLAYS, CHAPTERS } from "@/lib/mock-data";
import arenaLogo from "@assets/arena-ai-logo-minimalist.png";
import geckoLogo from "@assets/image_1766975682051.png";
import { ModeToggle } from "@/components/mode-toggle";

export default function RepDetailsPage() {
  const [, params] = useRoute("/manager/rep/:id");
  const repId = params?.id;
  const rep = SALES_REPS.find(r => r.id === repId);

  // Mock detailed data - in a real app this would be fetched
  const performanceData = {
    strengths: ["Building Rapport", "Objection Handling", "Closing Speed"],
    weaknesses: ["Product Knowledge Depth", "Up-selling", "Transition Speed"],
    quizScores: [
      { id: "q1", title: "Sales Foundations", score: 95, date: "2024-12-20" },
      { id: "q2", title: "Product Knowledge", score: 88, date: "2024-12-22" },
      { id: "q3", title: "Objection Mastery", score: 72, date: "2024-12-28" },
    ],
    roleplayHistory: [
      { 
        id: "rp-1", 
        name: "The Busy Homeowner", 
        date: "Today", 
        score: 92, 
        duration: "2:45",
        feedback: "Excellent handling of the time objection. Pivot was smooth.",
        metrics: { resistance: "High", clarity: "Good", tone: "Confident" }
      },
      { 
        id: "rp-4", 
        name: "The DIY Enthusiast", 
        date: "Yesterday", 
        score: 78, 
        duration: "4:12",
        feedback: "Struggled slightly with the technical differentiation on fertilizer types.",
        metrics: { resistance: "Medium", clarity: "Average", tone: "Hesitant" }
      },
      { 
        id: "rp-10", 
        name: "The Price Shopper", 
        date: "3 days ago", 
        score: 85, 
        duration: "3:30",
        feedback: "Good value anchoring, but missed the first closing signal.",
        metrics: { resistance: "High", clarity: "Good", tone: "Confident" }
      }
    ]
  };

  if (!rep) {
    return <div>Rep not found</div>;
  }

  // Reuse Manager Header for consistency
  const ManagerHeader = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/manager-dashboard">
            <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>arena ai</span>
                <span className="text-[10px] text-foreground/80 font-normal uppercase tracking-wide">Manager Portal</span>
              </div>
            </a>
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Client:</span>
            <img src={geckoLogo} alt="GeckoGreen" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <ModeToggle />
           <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold leading-none">Sarah Jenkins</span>
              <span className="text-xs text-muted-foreground">Sales Director</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20">
              SJ
            </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-12">
      <ManagerHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/manager-dashboard">
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold text-2xl shadow-xl shadow-primary/20">
                {rep.avatarInitials}
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">{rep.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{rep.email}</span>
                  <span>•</span>
                  <Badge variant={rep.status === 'active' ? 'default' : 'secondary'}>{rep.status}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">Download Report</Button>
              <Button>Assign Training</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{rep.score}%</div>
              <Progress value={rep.score} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roleplays Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rep.roleplaysCompleted}</div>
              <div className="text-xs text-muted-foreground mt-1">Last active {rep.lastActive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Knowledge Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">88%</div>
              <div className="text-xs text-muted-foreground mt-1">Based on quiz average</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Strengths & Weaknesses */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Skill Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Top Strengths
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performanceData.strengths.map(s => (
                      <Badge key={s} variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4" /> Areas for Improvement
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performanceData.weaknesses.map(w => (
                      <Badge key={w} variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
                        {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Knowledge Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.quizScores.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div>
                        <p className="font-medium text-sm">{quiz.title}</p>
                        <p className="text-xs text-muted-foreground">{quiz.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${
                          quiz.score >= 90 ? 'text-green-600' :
                          quiz.score >= 80 ? 'text-primary' :
                          'text-yellow-600'
                        }`}>
                          {quiz.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Roleplay History */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Roleplay Performance History
                </CardTitle>
                <CardDescription>Detailed breakdown of recent simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.roleplayHistory.map((rp) => (
                    <div key={rp.id} className="border border-border rounded-xl p-4 md:p-6 bg-card hover:bg-muted/20 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Target className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-lg">{rp.name}</h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rp.duration}</span>
                              <span>•</span>
                              <span>{rp.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-bold">Score</span>
                            <span className={`text-2xl font-bold font-display ${
                              rp.score >= 90 ? 'text-green-600' : 'text-primary'
                            }`}>{rp.score}</span>
                          </div>
                          <div className="h-10 w-1 bg-muted rounded-full overflow-hidden relative">
                             <div 
                               className="absolute bottom-0 w-full bg-primary rounded-full transition-all duration-500" 
                               style={{ height: `${rp.score}%` }} 
                             />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg border border-border/50 mb-4">
                        <p className="text-sm italic text-muted-foreground">"{rp.feedback}"</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-background border border-border p-2 rounded">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Resistance</p>
                          <p className="font-bold text-sm">{rp.metrics.resistance}</p>
                        </div>
                        <div className="bg-background border border-border p-2 rounded">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clarity</p>
                          <p className="font-bold text-sm">{rp.metrics.clarity}</p>
                        </div>
                        <div className="bg-background border border-border p-2 rounded">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tone</p>
                          <p className="font-bold text-sm">{rp.metrics.tone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}