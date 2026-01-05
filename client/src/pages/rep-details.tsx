import { useRoute, Link } from "wouter";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, Brain, Target, Zap, Clock, CheckCircle2, XCircle, Play, Pause, Volume2, ChevronDown, ChevronUp, Award, BookOpen, Loader2, MessageSquare, ListTodo, Plus, Send, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, CoachingNote, CoachingTask } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import arenaLogoDark from "@/assets/arena-logo-dark.png";
import arenaLogoLight from "@/assets/arena-logo-light.png";
import geckoLogo from "@assets/image_1766975682051.png";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { format } from "date-fns";

interface RoleplayAttemptDetail {
  id: string;
  roleplayId: string;
  roleplayName: string;
  roleplayRole: string;
  chapterTitle: string;
  score: number;
  passed: boolean;
  duration: string | null;
  feedback: {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    recordingUrl?: string;
    [key: string]: any;
  } | null;
  metrics: { resistance: string; clarity: string; tone: string } | null;
  createdAt: string;
}

interface QuizAttemptDetail {
  id: string;
  chapterId: string;
  chapterTitle: string;
  questionId: string;
  questionText: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  createdAt: string;
}

interface ChapterProgress {
  chapterId: string;
  chapterTitle: string;
  completed: boolean;
  currentSlide: number;
  totalSlides: number;
  quizScore: { correct: number; total: number };
}

interface UserDetails {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    managerId: string | null;
  };
  performance: {
    chaptersCompleted: number;
    totalChapters: number;
    chapterProgress: number;
    quizAverage: number;
    quizAttempts: number;
    roleplaysPassed: number;
    roleplaysAttempted: number;
    roleplayPassRate: number;
    isCertified: boolean;
    overallScore: number;
  };
  roleplayAttempts: RoleplayAttemptDetail[];
  quizAttempts: QuizAttemptDetail[];
  chapterProgress: ChapterProgress[];
}

function AudioPlayer({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 border border-border">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full"
        onClick={togglePlay}
        data-testid="button-audio-play"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-[60px]">
        <Volume2 className="h-3 w-3" />
        <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
      </div>
    </div>
  );
}

function RoleplayAttemptCard({ attempt, isExpanded, onToggle }: { 
  attempt: RoleplayAttemptDetail; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const attemptDate = new Date(attempt.createdAt);
  const formattedDate = format(attemptDate, "MMM d, yyyy 'at' h:mm a");

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="border border-border rounded-xl bg-card hover:bg-muted/20 transition-colors">
        <CollapsibleTrigger className="w-full p-4 md:p-6 text-left" data-testid={`collapsible-roleplay-${attempt.id}`}>
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${attempt.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Target className={`w-6 h-6 ${attempt.passed ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg">{attempt.roleplayName}</h3>
                  <Badge variant={attempt.passed ? "default" : "destructive"} className="text-xs">
                    {attempt.passed ? "PASSED" : "FAILED"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {attempt.duration && (
                    <>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {attempt.duration}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formattedDate}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{attempt.chapterTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-xs text-muted-foreground uppercase tracking-wider font-bold">Score</span>
                <span className={`text-2xl font-bold font-display ${
                  attempt.score >= 80 ? 'text-green-600' : attempt.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>{attempt.score}</span>
              </div>
              <div className="h-10 w-1 bg-muted rounded-full overflow-hidden relative">
                <div 
                  className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                    attempt.score >= 80 ? 'bg-green-600' : attempt.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ height: `${attempt.score}%` }} 
                />
              </div>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 md:px-6 md:pb-6 space-y-4 border-t border-border pt-4">
            {attempt.feedback?.recordingUrl && typeof attempt.feedback.recordingUrl === 'string' && attempt.feedback.recordingUrl.startsWith('http') && (
              <div>
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" /> Call Recording
                </h4>
                <AudioPlayer url={attempt.feedback.recordingUrl} />
              </div>
            )}

            {attempt.feedback?.summary && (
              <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                <h4 className="text-sm font-bold mb-1">AI Feedback</h4>
                <p className="text-sm text-muted-foreground">{attempt.feedback.summary}</p>
              </div>
            )}

            {attempt.feedback?.strengths && attempt.feedback.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {attempt.feedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {attempt.feedback?.improvements && attempt.feedback.improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-yellow-600 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Areas for Improvement
                </h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {attempt.feedback.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {attempt.metrics && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-background border border-border p-2 rounded">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Resistance</p>
                  <p className="font-bold text-sm">{attempt.metrics.resistance}</p>
                </div>
                <div className="bg-background border border-border p-2 rounded">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clarity</p>
                  <p className="font-bold text-sm">{attempt.metrics.clarity}</p>
                </div>
                <div className="bg-background border border-border p-2 rounded">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tone</p>
                  <p className="font-bold text-sm">{attempt.metrics.tone}</p>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function QuizAttemptCard({ attempt }: { attempt: QuizAttemptDetail }) {
  const attemptDate = new Date(attempt.createdAt);
  const formattedDate = format(attemptDate, "MMM d, yyyy 'at' h:mm a");

  return (
    <div className={`border rounded-lg p-4 ${attempt.isCorrect ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-red-200 bg-red-50/50 dark:bg-red-950/20'}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          {attempt.isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <Badge variant="outline" className="text-xs">{attempt.chapterTitle}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
      </div>
      
      <p className="font-medium text-sm mb-3">{attempt.questionText}</p>
      
      <div className="space-y-2">
        {(attempt.options || []).map((option, idx) => {
          const isSelected = idx === attempt.selectedAnswer;
          const isCorrectAnswer = attempt.correctAnswer >= 0 && idx === attempt.correctAnswer;
          
          let className = "text-sm p-2 rounded border ";
          if (isCorrectAnswer) {
            className += "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700";
          } else if (isSelected && !isCorrectAnswer) {
            className += "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700";
          } else {
            className += "bg-muted/30 border-border/50";
          }
          
          return (
            <div key={idx} className={className}>
              <span className="flex items-center gap-2">
                {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {isSelected && !isCorrectAnswer && <XCircle className="h-4 w-4 text-red-600" />}
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RepDetailsPage() {
  const [matchManager, managerParams] = useRoute("/manager/rep/:id");
  const [matchAdmin, adminParams] = useRoute("/admin/rep/:id");
  const repId = managerParams?.id || adminParams?.id;
  const isAdmin = matchAdmin;
  const { resolvedTheme } = useTheme();
  const [expandedRoleplay, setExpandedRoleplay] = useState<string | null>(null);
  
  const arenaLogo = resolvedTheme === "dark" ? arenaLogoDark : arenaLogoLight;
  const backUrl = isAdmin ? "/admin-dashboard" : "/manager-dashboard";
  const portalName = isAdmin ? "Admin / Director Portal" : "Manager Portal";

  const { data: userDetails, isLoading, error } = useQuery<UserDetails>({
    queryKey: ["/api/users", repId, "details"],
    queryFn: async () => {
      const res = await fetch(`/api/users/${repId}/details`);
      if (!res.ok) throw new Error("Failed to fetch user details");
      return res.json();
    },
    enabled: !!repId,
  });

  const queryClient = useQueryClient();

  const { data: coachingNotes = [] } = useQuery<CoachingNote[]>({
    queryKey: ["coaching-notes", repId],
    queryFn: () => api.getCoachingNotes(repId!),
    enabled: !!repId,
  });

  const { data: coachingTasks = [] } = useQuery<CoachingTask[]>({
    queryKey: ["coaching-tasks", repId],
    queryFn: () => api.getCoachingTasks(repId!),
    enabled: !!repId,
  });

  const [newNote, setNewNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const createNoteMutation = useMutation({
    mutationFn: (content: string) => api.createCoachingNote({ repId: repId!, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-notes", repId] });
      setNewNote("");
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: () => api.createCoachingTask({
      repId: repId!,
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-tasks", repId] });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setNewTaskDueDate("");
    },
  });

  const Header = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href={backUrl} className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>arena ai</span>
                <span className={`text-[10px] font-normal uppercase tracking-wide ${isAdmin ? 'text-destructive font-bold' : 'text-foreground/80'}`}>{portalName}</span>
              </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Client:</span>
            <img src={geckoLogo} alt="GeckoGreen" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <ModeToggle />
        </div>
      </div>
    </nav>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 font-sans">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="min-h-screen bg-muted/20 font-sans">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link href={backUrl}>
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
            </Button>
          </Link>
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">User Not Found</h2>
            <p className="text-muted-foreground">The requested user could not be found.</p>
          </Card>
        </div>
      </div>
    );
  }

  const { user, performance, roleplayAttempts, quizAttempts, chapterProgress } = userDetails;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const groupedQuizAttempts = quizAttempts.reduce((acc, attempt) => {
    if (!acc[attempt.chapterId]) {
      acc[attempt.chapterId] = { title: attempt.chapterTitle, attempts: [] };
    }
    acc[attempt.chapterId].attempts.push(attempt);
    return acc;
  }, {} as Record<string, { title: string; attempts: QuizAttemptDetail[] }>);

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-12">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={backUrl}>
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-primary mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold text-2xl shadow-xl shadow-primary/20">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-user-name">{user.name}</h1>
                  {performance.isCertified && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                      <Award className="h-3 w-3 mr-1" /> Certified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{user.email}</span>
                  <span>•</span>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary" data-testid="text-overall-score">{performance.overallScore}%</div>
              <Progress value={performance.overallScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chapters Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{performance.chaptersCompleted}/{performance.totalChapters}</div>
              <Progress value={performance.chapterProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roleplay Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{performance.roleplayPassRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">{performance.roleplaysPassed}/{performance.roleplaysAttempted} passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quiz Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{performance.quizAverage}%</div>
              <div className="text-xs text-muted-foreground mt-1">{performance.quizAttempts} questions answered</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="roleplays" className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="roleplays" className="flex items-center gap-2" data-testid="tab-roleplays">
              <Zap className="h-4 w-4" /> Roleplays
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2" data-testid="tab-quizzes">
              <Brain className="h-4 w-4" /> Quizzes
            </TabsTrigger>
            <TabsTrigger value="chapters" className="flex items-center gap-2" data-testid="tab-chapters">
              <BookOpen className="h-4 w-4" /> Chapters
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2" data-testid="tab-coaching">
              <MessageSquare className="h-4 w-4" /> Coaching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roleplays" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Roleplay Performance History
                </CardTitle>
                <CardDescription>All roleplay attempts with recordings and detailed feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {roleplayAttempts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No roleplay attempts yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roleplayAttempts.map((attempt) => (
                      <RoleplayAttemptCard
                        key={attempt.id}
                        attempt={attempt}
                        isExpanded={expandedRoleplay === attempt.id}
                        onToggle={() => setExpandedRoleplay(expandedRoleplay === attempt.id ? null : attempt.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Quiz Results
                </CardTitle>
                <CardDescription>All quiz attempts showing right and wrong answers</CardDescription>
              </CardHeader>
              <CardContent>
                {quizAttempts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No quiz attempts yet
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedQuizAttempts).map(([chapterId, { title, attempts }]) => (
                      <div key={chapterId}>
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          {title}
                          <Badge variant="outline" className="ml-2">
                            {attempts.filter(a => a.isCorrect).length}/{attempts.length} correct
                          </Badge>
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {attempts.map((attempt) => (
                            <QuizAttemptCard key={attempt.id} attempt={attempt} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Chapter Progress
                </CardTitle>
                <CardDescription>Training progress across all chapters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chapterProgress.map((chapter) => {
                    const slideProgress = chapter.totalSlides > 0 
                      ? Math.round((chapter.currentSlide / chapter.totalSlides) * 100) 
                      : 0;
                    const quizPercent = chapter.quizScore.total > 0 
                      ? Math.round((chapter.quizScore.correct / chapter.quizScore.total) * 100) 
                      : 0;
                    
                    return (
                      <div key={chapter.chapterId} className="border border-border rounded-lg p-4 bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {chapter.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            <div>
                              <h3 className="font-bold">{chapter.chapterTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                {chapter.currentSlide}/{chapter.totalSlides} slides viewed
                              </p>
                            </div>
                          </div>
                          <Badge variant={chapter.completed ? "default" : "secondary"}>
                            {chapter.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Slide Progress</p>
                            <Progress value={slideProgress} className="h-2" />
                            <p className="text-xs text-right mt-1">{slideProgress}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Quiz Score</p>
                            <Progress value={quizPercent} className="h-2" />
                            <p className="text-xs text-right mt-1">
                              {chapter.quizScore.correct}/{chapter.quizScore.total} ({quizPercent}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coaching" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Coaching Notes
                  </CardTitle>
                  <CardDescription>Private notes about this rep's progress and areas to focus on</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a coaching note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px]"
                      data-testid="input-coaching-note"
                    />
                  </div>
                  <Button
                    onClick={() => createNoteMutation.mutate(newNote)}
                    disabled={!newNote.trim() || createNoteMutation.isPending}
                    className="w-full"
                    data-testid="button-add-note"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createNoteMutation.isPending ? "Adding..." : "Add Note"}
                  </Button>
                  
                  <div className="space-y-3 mt-4">
                    {coachingNotes.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No coaching notes yet</p>
                    ) : (
                      coachingNotes.map((note) => (
                        <div key={note.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                          <p className="text-sm whitespace-pre-wrap" data-testid={`text-note-${note.id}`}>{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-primary" />
                    Assigned Tasks
                  </CardTitle>
                  <CardDescription>Tasks for this rep to complete</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 border border-border rounded-lg p-4 bg-muted/10">
                    <Input
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      data-testid="input-task-title"
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="min-h-[60px]"
                      data-testid="input-task-description"
                    />
                    <div className="flex gap-2">
                      <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                        <SelectTrigger className="w-[120px]" data-testid="select-task-priority">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="flex-1"
                        data-testid="input-task-due-date"
                      />
                    </div>
                    <Button
                      onClick={() => createTaskMutation.mutate()}
                      disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                      className="w-full"
                      data-testid="button-add-task"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {createTaskMutation.isPending ? "Adding..." : "Add Task"}
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {coachingTasks.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No tasks assigned</p>
                    ) : (
                      coachingTasks.map((task) => (
                        <div key={task.id} className={`p-3 rounded-lg border ${task.status === "completed" ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-muted/30 border-border"}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              {task.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 mt-0.5" />
                              )}
                              <div>
                                <p className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`} data-testid={`text-task-title-${task.id}`}>
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"} className="text-xs">
                                    {task.priority}
                                  </Badge>
                                  {task.dueDate && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Due {format(new Date(task.dueDate), "MMM d")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
