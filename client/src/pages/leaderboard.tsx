import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Loader2, Trophy } from "lucide-react";
import notionLeaderboard from "@/assets/notion-icon-leaderboard.png";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarInitials: string;
  warriorAvatar: string | null;
  profilePhoto: string | null;
  roleplaysCompleted: number;
  passedCount: number;
  avgScore: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  const { data: userAttempts = [] } = useQuery({
    queryKey: ["user-attempts", user?.id],
    queryFn: () => api.getUserAttempts(user!.id),
    enabled: !!user?.id,
  });

  const { data: roleplays = [] } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => api.getRoleplays(),
  });

  const currentUserEntry = leaderboard.find(e => e.userId === user?.id);
  const currentUserRank = currentUserEntry?.rank || "-";
  const currentUserAvgScore = currentUserEntry?.avgScore || 0;

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <img src={notionLeaderboard} alt="" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Performance Center</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Track your progress and compete with top performers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 bg-card px-3 sm:px-4 py-2 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Rank:</span>
              <span className="text-lg sm:text-xl font-bold text-magenta">#{currentUserRank}</span>
            </div>
            <div className="h-6 sm:h-8 w-px bg-border" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Avg:</span>
              <span className="text-lg sm:text-xl font-bold text-foreground">{currentUserAvgScore}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="bg-card border border-border p-1 rounded-xl mb-8 w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="leaderboard" className="rounded-lg data-[state=active]:bg-magenta/10 data-[state=active]:text-magenta font-bold">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-magenta/10 data-[state=active]:text-magenta font-bold">My Roleplay History</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {leaderboardLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No roleplay attempts yet. Complete some roleplays to appear on the leaderboard!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="p-3 sm:p-6 font-bold text-muted-foreground text-xs sm:text-sm uppercase tracking-wider w-16 sm:w-24">Rank</th>
                        <th className="p-3 sm:p-6 font-bold text-muted-foreground text-xs sm:text-sm uppercase tracking-wider">Rep Name</th>
                        <th className="p-3 sm:p-6 font-bold text-muted-foreground text-xs sm:text-sm uppercase tracking-wider text-center hidden sm:table-cell">Roleplays</th>
                        <th className="p-3 sm:p-6 font-bold text-muted-foreground text-xs sm:text-sm uppercase tracking-wider text-center hidden sm:table-cell">Passed</th>
                        <th className="p-3 sm:p-6 font-bold text-muted-foreground text-xs sm:text-sm uppercase tracking-wider text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {leaderboard.map((entry) => (
                        <tr key={entry.userId} className={`hover:bg-muted/10 transition-colors ${entry.userId === user?.id ? "bg-primary/5" : ""}`} data-testid={`row-leaderboard-${entry.rank}`}>
                          <td className="p-3 sm:p-6">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                              entry.rank === 2 ? "bg-gray-100 text-gray-700" :
                              entry.rank === 3 ? "bg-orange-100 text-orange-700" :
                              "text-muted-foreground"
                            }`}>
                              {entry.rank <= 3 ? <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : entry.rank}
                            </div>
                          </td>
                          <td className="p-3 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {entry.warriorAvatar || entry.profilePhoto ? (
                                <img 
                                  src={entry.warriorAvatar || entry.profilePhoto || ""} 
                                  alt={entry.name}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-magenta/20 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-xs sm:text-sm border border-border shrink-0">
                                  {entry.avatarInitials}
                                </div>
                              )}
                              <span className={`font-medium text-sm sm:text-base truncate ${entry.userId === user?.id ? "text-magenta font-bold" : "text-foreground"}`}>
                                {entry.name} {entry.userId === user?.id && "(You)"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-6 text-center font-mono text-muted-foreground hidden sm:table-cell">
                            {entry.roleplaysCompleted}
                          </td>
                          <td className="p-3 sm:p-6 text-center font-mono text-green-600 hidden sm:table-cell">
                            {entry.passedCount}
                          </td>
                          <td className="p-3 sm:p-6 text-right">
                            <span className="font-bold font-display text-lg sm:text-xl">{entry.avgScore}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {userAttempts.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't completed any roleplays yet.</p>
                <Link href="/dashboard">
                  <Button>Start Training</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAttempts.map((attempt) => {
                  const scenario = roleplays.find(r => r.id === attempt.roleplayId);
                  return (
                    <div key={attempt.id} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all shadow-sm" data-testid={`card-attempt-${attempt.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {scenario?.avatar ? (
                            <img src={scenario.avatar} className="w-12 h-12 rounded-full object-cover border border-border" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-bold">
                              RP
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-foreground">{scenario?.name || attempt.roleplayId}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(attempt.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                          attempt.score >= 70 ? "bg-green-100 text-green-700" :
                          attempt.score >= 50 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {attempt.score}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {attempt.passed ? "Passed" : "Failed"}
                        </span>
                        {scenario?.difficulty && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {scenario.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/results/${attempt.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">View Analysis</Button>
                        </Link>
                        <Link href={`/chat/${attempt.roleplayId}`} className="flex-1">
                          <Button size="sm" className="w-full bg-magenta/10 text-magenta hover:bg-magenta/20 border-transparent shadow-none">Retry</Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}