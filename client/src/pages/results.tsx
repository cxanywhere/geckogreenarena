import { useRoute, Link } from "wouter";
import { Nav } from "@/components/nav";
import { ROLEPLAYS, PAST_RESULTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, BarChart, TrendingUp, Share2, RefreshCw, Mic, Activity, Clock, Ear, PlayCircle, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:id");
  // In a real app, we'd fetch the specific result by ID. 
  // For this mock, if the ID exists in PAST_RESULTS use it, otherwise use the first one as a fallback demo.
  const result = PAST_RESULTS.find(r => r.id === params?.id) || PAST_RESULTS[0]; 
  const scenario = ROLEPLAYS.find(s => s.id === result.scenarioId);

  if (!scenario) return <div>Scenario not found</div>;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* Score Card */}
             <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden p-8">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-2xl font-display font-bold text-foreground">Performance Analysis</h1>
                    <p className="text-muted-foreground">Scenario: <span className="font-semibold text-primary">{scenario.name}</span></p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Score</div>
                    <div className="text-4xl font-display font-bold text-primary">{result.score}/100</div>
                  </div>
               </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" className="stroke-muted fill-none stroke-[12]" />
                        <circle 
                          cx="96" 
                          cy="96" 
                          r="88" 
                          className="stroke-primary fill-none stroke-[12]" 
                          strokeDasharray={2 * Math.PI * 88}
                          strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <Trophy className="w-10 h-10 text-primary mb-1" />
                         <span className="text-sm font-bold text-muted-foreground">Great Job!</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Mic className="w-4 h-4" /> Tonality</span>
                        <span className="font-bold text-foreground">{result.metrics.tonality}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.metrics.tonality}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Pacing</span>
                        <span className="font-bold text-foreground">{result.metrics.pacing}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.metrics.pacing}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-muted-foreground flex items-center gap-2"><Ear className="w-4 h-4" /> Active Listening</span>
                        <span className="font-bold text-foreground">{result.metrics.listening}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.metrics.listening}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Key Moments */}
             <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" /> Key Moments Analysis
                </h3>
                <div className="space-y-4">
                  {result.keyMoments.map((moment, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/10 border border-border">
                       <div className="flex-shrink-0 mt-1">
                          {moment.impact === 'positive' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : moment.impact === 'negative' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                          )}
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">{moment.timestamp}</span>
                            <span className={`text-xs font-bold uppercase ${
                              moment.impact === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>{moment.impact} Impact</span>
                         </div>
                         <p className="text-sm text-foreground">{moment.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            
            {/* Sales Metrics */}
             <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <BarChart className="w-5 h-5 text-primary" /> Sales Skills
               </h3>
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-muted-foreground">Resistance Handled</span>
                      <span className="font-bold text-foreground">{result.metrics.resistanceHandled}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${result.metrics.resistanceHandled}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-muted-foreground">Objections Overcome</span>
                      <span className="font-bold text-foreground">{result.metrics.objectionsOvercome}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${result.metrics.objectionsOvercome}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-muted-foreground">Closing Technique</span>
                      <span className="font-bold text-foreground">{result.metrics.closingTechnique}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.metrics.closingTechnique}%` }} />
                    </div>
                  </div>
               </div>
             </div>

             {/* Transcript */}
             <div className="bg-white rounded-2xl shadow-sm border border-border flex flex-col h-[400px]">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-lg">Transcript Review</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                   <div className="space-y-4">
                      {result.transcript && result.transcript.length > 0 ? (
                        result.transcript.map((msg, idx) => (
                           <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                              <Avatar className="h-6 w-6 border border-border">
                                <AvatarFallback className="text-[10px]">{msg.sender === 'user' ? 'ME' : 'AI'}</AvatarFallback>
                              </Avatar>
                              <div className={`text-xs p-2 rounded-lg max-w-[80%] ${
                                msg.sender === 'user' ? 'bg-primary/10 text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                                {msg.text}
                              </div>
                           </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          No transcript available for this session.
                        </div>
                      )}
                   </div>
                </ScrollArea>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <Link href={`/chat/${scenario.id}`}>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" /> Retry
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button className="w-full">
                    <Trophy className="mr-2 h-4 w-4" /> Rank
                  </Button>
                </Link>
             </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}