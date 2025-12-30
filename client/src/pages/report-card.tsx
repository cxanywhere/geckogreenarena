import { motion } from "framer-motion";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trophy, Download, Printer, Share2, Award, Star, TrendingUp, Lock } from "lucide-react";
import geckoLogo from "@assets/image_1766975682051.png";
import arenaLogo from "@assets/generated_images/superhero_style_logo_for_arena_ai.png";
import { CHAPTERS, ROLEPLAYS } from "@/lib/mock-data";
import { Link } from "wouter";
import { useRef } from "react";

export default function ReportCardPage() {
  // Mock results data - in a real app this would come from backend/localStorage
  const results = {
    overallScore: 92,
    passed: true,
    certifiedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    chapters: [
      { id: "chap-1", title: "Sales Foundations", score: 95, status: "passed" },
      { id: "chap-2", title: "Field Execution", score: 88, status: "passed" }
    ],
    roleplays: [
      { id: "rp-1", title: "The Busy Homeowner", score: 90, feedback: "Excellent handling of time constraint." },
      { id: "rp-6", title: "The Confused Homeowner", score: 85, feedback: "Good clarity, could be more direct." },
      { id: "rp-11", title: "The Budget Watcher", score: 92, feedback: "Great value reframing." }
    ]
  };

  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

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
          
          {results.passed && (
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
                  <h3 className="text-4xl font-display font-bold text-primary">{results.overallScore}%</h3>
                  <p className="font-medium text-muted-foreground uppercase tracking-wider text-xs">Overall Score</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={results.passed ? "default" : "destructive"} className={results.passed ? "bg-green-500 hover:bg-green-600" : ""}>
                    {results.passed ? "CERTIFIED" : "INCOMPLETE"}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Knowledge Retention</span>
                      <span className="font-bold">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Roleplay Performance</span>
                      <span className="font-bold">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
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
                {results.chapters.map((chapter) => (
                  <div key={chapter.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      {chapter.status === 'passed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{chapter.title}</p>
                        <p className="text-xs text-muted-foreground">Score: {chapter.score}%</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background">{chapter.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
             
             {/* Roleplay Feedback */}
             <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roleplay Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.roleplays.map((rp) => (
                  <div key={rp.id} className="space-y-2 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                       <p className="font-medium text-sm">{rp.title}</p>
                       <span className="text-xs font-bold text-primary">{rp.score}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{rp.feedback}"</p>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right Column - Certificate */}
          <div className="lg:col-span-2">
            {results.passed ? (
               <div className="relative w-full aspect-[1.414/1] bg-white text-black p-8 md:p-12 shadow-2xl rounded-sm border-[16px] border-double border-[#1e3a8a] print:shadow-none print:border-0 print:w-full print:h-full print:absolute print:inset-0 print:z-[9999]" ref={certificateRef}>
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#1e3a8a]" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#1e3a8a]" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#1e3a8a]" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#1e3a8a]" />
                  
                  {/* Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                     <img src={geckoLogo} className="w-2/3 h-2/3 object-contain grayscale" />
                  </div>

                  <div className="relative h-full flex flex-col items-center text-center justify-between border-2 border-dashed border-gray-200 p-8">
                    
                    {/* Header */}
                    <div className="space-y-6 w-full">
                       <div className="flex justify-between items-start w-full px-4">
                          <img src={geckoLogo} alt="Gecko Green" className="h-16 w-auto object-contain" />
                          <div className="flex flex-col items-end">
                             <div className="flex items-center gap-2 opacity-50">
                                <img src={arenaLogo} alt="Arena AI" className="h-6 w-6 grayscale" />
                                <span className="font-display font-bold uppercase tracking-widest text-xs">Arena AI Certified</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="pt-8">
                         <h1 className="font-serif text-5xl md:text-6xl text-[#1e3a8a] mb-4 tracking-tight">Certificate of Completion</h1>
                         <p className="text-gray-500 font-serif italic text-xl">This certifies that</p>
                       </div>
                    </div>

                    {/* Name */}
                    <div className="py-8 w-full border-b border-gray-300 max-w-2xl">
                       <h2 className="font-display text-4xl md:text-5xl font-bold text-black tracking-tight">Paul Wilkerson</h2>
                    </div>

                    {/* Description */}
                    <div className="max-w-2xl mx-auto space-y-4">
                       <p className="text-gray-600 font-serif text-lg leading-relaxed">
                         Has successfully demonstrated mastery of the <strong className="text-[#1e3a8a]">Gecko Green Sales Methodology</strong>, achieving excellence in Opening, Pitching, Objection Handling, and Closing strategies through rigorous AI-driven simulation training.
                       </p>
                       <div className="flex justify-center gap-4 text-sm text-gray-500 uppercase tracking-widest font-bold">
                          <span>• Sales Foundations •</span>
                          <span>• Advanced Negotiation •</span>
                          <span>• Field Execution •</span>
                       </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="w-full grid grid-cols-2 gap-20 pt-12 px-12">
                       <div className="text-center space-y-2">
                          <div className="h-16 flex items-end justify-center pb-2">
                             <span className="font-script text-3xl text-[#1e3a8a] transform -rotate-6 block">Sarah Jenkins</span>
                          </div>
                          <div className="border-t border-gray-400 pt-2">
                             <p className="font-bold text-sm uppercase text-gray-800">Sarah Jenkins</p>
                             <p className="text-xs text-gray-500 uppercase tracking-wide">VP of Sales Training</p>
                          </div>
                       </div>
                       
                       <div className="text-center space-y-2">
                          <div className="h-16 flex items-end justify-center pb-2">
                             <p className="font-serif text-lg text-gray-800">{results.certifiedDate}</p>
                          </div>
                          <div className="border-t border-gray-400 pt-2">
                             <p className="font-bold text-sm uppercase text-gray-800">Date Issued</p>
                             <p className="text-xs text-gray-500 uppercase tracking-wide">Authorization ID: 8X-2991</p>
                          </div>
                       </div>
                    </div>

                    {/* Gold Seal */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                       <div className="relative">
                          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-600">
                             <div className="w-20 h-20 border-2 border-yellow-600/50 rounded-full flex items-center justify-center">
                                <Award className="w-10 h-10 text-yellow-700" />
                             </div>
                          </div>
                          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-900 rotate-45 -z-10 shadow-lg" />
                       </div>
                    </div>

                  </div>
               </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground">
                 <Lock className="w-16 h-16 mb-4 opacity-20" />
                 <h3 className="text-xl font-bold mb-2">Certificate Locked</h3>
                 <p className="max-w-md">Complete all training modules and achieve an overall score of 85% or higher to unlock your official certification.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}