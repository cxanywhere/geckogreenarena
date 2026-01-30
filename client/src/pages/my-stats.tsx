import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, UserStats, CoachingTask } from "@/lib/api";
import { Nav } from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Trophy, 
  Target, 
  BookOpen, 
  Mic, 
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Star,
  ArrowLeft,
  History
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { RoleplayAttemptHistory } from "@/components/roleplay-attempt-history";

export default function MyStatsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: () => api.getUserStats(user!.id),
    enabled: !!user?.id,
  });

  const { data: roleplayHistory = {} } = useQuery({
    queryKey: ["roleplay-history", user?.id],
    queryFn: () => api.getUserRoleplayHistory(user!.id),
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.completeCoachingTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats", user?.id] });
    },
  });

  const handleTryAgain = (roleplayId: string, chapterId: string | null) => {
    if (chapterId) {
      setLocation(`/chat/${roleplayId}?returnTo=/my-stats`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex items-center justify-center pt-20">
          <div className="animate-pulse text-muted-foreground">Loading your stats...</div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex items-center justify-center pt-20">
          <div className="text-muted-foreground">Unable to load stats</div>
        </div>
      </div>
    );
  }

  const { performance, certification, pendingTasks, weeklyStats, recentRoleplays } = stats;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Nav />
      
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" data-testid="back-to-dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  MY STATS
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight tracking-tight text-foreground" data-testid="text-page-title">
                  Training Progress
                </h1>
                <p className="text-muted-foreground mt-1">Track your performance and certification status</p>
              </div>
            </div>
          </motion.div>

          {certification && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/30 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary" data-testid="text-certification-status">Certified Sales Warrior</h3>
                    <p className="text-sm text-muted-foreground">
                      Certificate #{certification.certificateNumber} - Awarded {format(new Date(certification.awardedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground" data-testid="text-overall-score">{performance.overallScore}%</p>
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Chapter Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground" data-testid="text-chapter-progress">
                      {performance.chaptersCompleted}/{performance.totalChapters}
                    </p>
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <Progress value={performance.chapterProgress} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground" data-testid="text-quiz-average">{performance.quizAverage}%</p>
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Roleplay Pass Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-foreground" data-testid="text-roleplay-rate">{performance.roleplayPassRate}%</p>
                    <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Mic className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {performance.roleplaysPassed} passed / {performance.roleplaysAttempted} attempted
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-card/80 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-xl border border-border/30">
                      <p className="text-2xl font-bold text-foreground" data-testid="text-weekly-completed">{weeklyStats.roleplaysCompleted}</p>
                      <p className="text-xs text-muted-foreground">Roleplays</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-xl border border-border/30">
                      <p className="text-2xl font-bold text-primary" data-testid="text-weekly-passed">{weeklyStats.roleplaysPassed}</p>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-xl border border-border/30">
                      <p className="text-2xl font-bold text-blue-500" data-testid="text-weekly-avg">{weeklyStats.averageScore}%</p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {pendingTasks.length > 0 && (
                <Card className="bg-card/80 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-amber-500" />
                      Tasks from Your Manager
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pendingTasks.slice(0, 4).map((task: CoachingTask) => (
                        <li key={task.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-border/30">
                          <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={() => completeTaskMutation.mutate(task.id)}
                            className="mt-0.5"
                            data-testid={`checkbox-task-${task.id}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground" data-testid={`text-task-title-${task.id}`}>{task.title}</p>
                            {task.dueDate && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                Due {format(new Date(task.dueDate), "MMM d")}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {pendingTasks.length === 0 && (
                <Card className="bg-card/80 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      All Tasks Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No pending tasks from your manager. Keep up the great work!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/80 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <History className="h-5 w-5 text-orange-500" />
                  Roleplay History
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your past attempts, listen to recordings, and see manager feedback
                </p>
              </CardHeader>
              <CardContent>
                <RoleplayAttemptHistory 
                  history={roleplayHistory}
                  onTryAgain={handleTryAgain}
                  showRoleplayHeader={true}
                />
              </CardContent>
            </Card>
          </motion.div>

          {!performance.isCertified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20 rounded-2xl p-6 mt-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">Path to Certification</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete all chapters, pass all roleplays, and score 75%+ on quizzes to get certified!
                    </p>
                  </div>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90" data-testid="button-continue-training">
                      Continue Training
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
