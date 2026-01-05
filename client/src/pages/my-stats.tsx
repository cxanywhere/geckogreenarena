import { useAuth } from "@/lib/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, UserStats, CoachingTask } from "@/lib/api";
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
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function MyStatsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["user-stats", user?.id],
    queryFn: () => api.getUserStats(user!.id),
    enabled: !!user?.id,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (taskId: string) => api.completeCoachingTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stats", user?.id] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading your stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Unable to load stats</div>
      </div>
    );
  }

  const { performance, certification, pendingTasks, weeklyStats, recentRoleplays } = stats;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" data-testid="back-to-dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">My Training Stats</h1>
            <p className="text-gray-400 mt-1">Track your progress and performance</p>
          </div>
        </div>

        {certification && (
          <Card className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Award className="h-10 w-10 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-400" data-testid="text-certification-status">Certified Sales Warrior</h3>
                  <p className="text-sm text-gray-300">
                    Certificate #{certification.certificateNumber} - Awarded {format(new Date(certification.awardedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Overall Score</p>
                  <p className="text-3xl font-bold text-white" data-testid="text-overall-score">{performance.overallScore}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Chapter Progress</p>
                  <p className="text-3xl font-bold text-white" data-testid="text-chapter-progress">
                    {performance.chaptersCompleted}/{performance.totalChapters}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <Progress value={performance.chapterProgress} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Quiz Average</p>
                  <p className="text-3xl font-bold text-white" data-testid="text-quiz-average">{performance.quizAverage}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Roleplay Pass Rate</p>
                  <p className="text-3xl font-bold text-white" data-testid="text-roleplay-rate">{performance.roleplayPassRate}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Mic className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {performance.roleplaysPassed} passed / {performance.roleplaysAttempted} attempted
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-white" data-testid="text-weekly-completed">{weeklyStats.roleplaysCompleted}</p>
                  <p className="text-xs text-gray-400">Roleplays</p>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-400" data-testid="text-weekly-passed">{weeklyStats.roleplaysPassed}</p>
                  <p className="text-xs text-gray-400">Passed</p>
                </div>
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400" data-testid="text-weekly-avg">{weeklyStats.averageScore}%</p>
                  <p className="text-xs text-gray-400">Avg Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {pendingTasks.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  Tasks from Your Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pendingTasks.slice(0, 4).map((task: CoachingTask) => (
                    <li key={task.id} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => completeTaskMutation.mutate(task.id)}
                        className="mt-0.5"
                        data-testid={`checkbox-task-${task.id}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white" data-testid={`text-task-title-${task.id}`}>{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
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
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  All Tasks Complete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">No pending tasks from your manager. Keep up the great work!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {recentRoleplays.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-orange-400" />
                Recent Roleplay Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRoleplays.map((rp: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${rp.passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {rp.passed ? (
                          <Trophy className="h-5 w-5 text-green-400" />
                        ) : (
                          <Target className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white" data-testid={`text-roleplay-name-${i}`}>
                          {rp.roleplayName || "Roleplay Session"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(rp.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={rp.passed ? "default" : "destructive"} className="mb-1">
                        {rp.passed ? "Passed" : "Failed"}
                      </Badge>
                      <p className="text-sm text-gray-400">{rp.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!performance.isCertified && (
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 mt-6">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Star className="h-10 w-10 text-blue-400" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Path to Certification</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Complete all chapters, pass all roleplays, and score 90%+ on quizzes to get certified!
                  </p>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-continue-training">
                    Continue Training
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
