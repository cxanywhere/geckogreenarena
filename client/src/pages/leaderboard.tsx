import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LEADERBOARD_DATA, PAST_RESULTS, ROLEPLAYS } from "@/lib/mock-data";
import { ArrowUp, ArrowDown, Minus, Trophy, Calendar, Medal } from "lucide-react";
import { Link } from "wouter";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Performance Center</h1>
            <p className="text-muted-foreground">Track your progress and compete with top performers.</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Your Rank:</span>
              <span className="text-xl font-bold text-primary">#4</span>
            </div>
            <div className="h-8 w-[1px] bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Avg Score:</span>
              <span className="text-xl font-bold text-foreground">85</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="bg-white border border-border p-1 rounded-xl mb-8 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="leaderboard" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold">My Roleplay History</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="p-6 font-bold text-muted-foreground text-sm uppercase tracking-wider w-24">Rank</th>
                      <th className="p-6 font-bold text-muted-foreground text-sm uppercase tracking-wider">Rep Name</th>
                      <th className="p-6 font-bold text-muted-foreground text-sm uppercase tracking-wider text-center">Trend</th>
                      <th className="p-6 font-bold text-muted-foreground text-sm uppercase tracking-wider text-center">Roleplays</th>
                      <th className="p-6 font-bold text-muted-foreground text-sm uppercase tracking-wider text-right">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {LEADERBOARD_DATA.map((entry) => (
                      <tr key={entry.rank} className={`hover:bg-muted/10 transition-colors ${entry.name === "Paul Wilkerson" ? "bg-primary/5" : ""}`}>
                        <td className="p-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                            entry.rank === 2 ? "bg-gray-100 text-gray-700" :
                            entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                            "text-muted-foreground"
                          }`}>
                            {entry.rank <= 3 ? <Trophy className="w-4 h-4" /> : entry.rank}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-full border border-border" />
                            <span className={`font-medium ${entry.name === "Paul Wilkerson" ? "text-primary font-bold" : "text-foreground"}`}>
                              {entry.name} {entry.name === "Paul Wilkerson" && "(You)"}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                          {entry.trend === 'up' && <ArrowUp className="w-4 h-4 text-green-500 mx-auto" />}
                          {entry.trend === 'down' && <ArrowDown className="w-4 h-4 text-red-500 mx-auto" />}
                          {entry.trend === 'same' && <Minus className="w-4 h-4 text-muted-foreground mx-auto" />}
                        </td>
                        <td className="p-6 text-center font-mono text-muted-foreground">
                          {entry.roleplaysCompleted}
                        </td>
                        <td className="p-6 text-right">
                          <span className="font-bold font-display text-xl">{entry.score}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAST_RESULTS.map((result) => {
                const scenario = ROLEPLAYS.find(r => r.id === result.scenarioId);
                if (!scenario) return null;
                return (
                  <div key={result.id} className="bg-white p-6 rounded-2xl border border-border hover:border-primary/30 transition-all shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={scenario.avatar} className="w-12 h-12 rounded-full object-cover border border-border" />
                        <div>
                          <h3 className="font-bold text-foreground">{scenario.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(result.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                        result.score >= 90 ? "bg-green-100 text-green-700" :
                        result.score >= 70 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {result.score}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {result.feedback}
                    </p>

                    <div className="flex gap-2">
                      <Link href={`/results/${result.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Analysis</Button>
                      </Link>
                      <Link href={`/chat/${scenario.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary/20 border-transparent shadow-none">Retry</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}