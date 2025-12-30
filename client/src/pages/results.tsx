import { useRoute, Link } from "wouter";
import { Nav } from "@/components/nav";
import { ROLEPLAYS, PAST_RESULTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, BarChart, TrendingUp, Share2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-4xl">
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
          className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary/5 p-8 border-b border-primary/10 text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Roleplay Analysis</h1>
            <p className="text-muted-foreground">Scenario: <span className="font-semibold text-primary">{scenario.name}</span></p>
          </div>

          <div className="p-8">
            {/* Score Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" className="stroke-muted fill-none stroke-[16]" />
                  <circle 
                    cx="96" 
                    cy="96" 
                    r="88" 
                    className="stroke-primary fill-none stroke-[16]" 
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - result.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold font-display text-foreground">{result.score}</span>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Score</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted-foreground">Resistance Handled</span>
                    <span className="font-bold text-foreground">{result.metrics.resistanceHandled}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.metrics.resistanceHandled}%` }} />
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

            {/* AI Feedback */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">AI Coach Feedback</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {result.feedback}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/chat/${scenario.id}`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                  <Trophy className="mr-2 h-4 w-4" /> View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}