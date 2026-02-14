import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bell, Search, UserPlus, Users, TrendingUp, AlertCircle, Trash2, Copy, Mail, Phone, Check, Loader2, Activity, BarChart3, DollarSign, LogOut, Trophy, Award, Target, GraduationCap, Mic, Clock, KeyRound } from "lucide-react";
import monetateLogoDark from "@/assets/monetate-logo-dark.png";
import monetateLogoLight from "@/assets/monetate-logo-light.png";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  avatarInitials: string;
  warriorAvatar?: string | null;
  profilePhoto?: string | null;
  managerId?: string | null;
}

interface CreatedCredentials {
  email: string;
  password: string;
  name: string;
}

interface RepPerformance {
  userId: string;
  userName: string;
  email: string;
  managerId: string | null;
  managerName?: string;
  status: string;
  chaptersCompleted: number;
  totalChapters: number;
  chapterProgress: number;
  quizAverage: number;
  quizAttempts: number;
  roleplaysPassed: number;
  totalRoleplays: number;
  roleplaysAttempted: number;
  roleplayPassRate: number;
  lastActivity: string | null;
  isCertified: boolean;
  overallScore: number;
}

interface TeamPerformance {
  managerId: string;
  managerName: string;
  reps: RepPerformance[];
  teamStats: {
    totalReps: number;
    certifiedReps: number;
    avgChapterProgress: number;
    avgQuizScore: number;
    avgRoleplayPassRate: number;
    teamScore: number;
  };
}

function QuizReminderCard() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState<{ totalSent: number; totalFailed: number } | null>(null);

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["quiz-reminders-pending"],
    queryFn: async () => {
      const res = await fetch("/api/quiz-reminders/pending", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<{ reps: any[]; count: number }>;
    },
  });

  const handleBulkSend = async () => {
    setSending(true);
    setShowConfirm(false);
    try {
      const res = await fetch("/api/quiz-reminders/bulk-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setResults({ totalSent: data.totalSent, totalFailed: data.totalFailed });
        toast({
          title: "Reminders sent!",
          description: `Sent quiz reminders to ${data.totalSent} rep${data.totalSent !== 1 ? "s" : ""}.`,
        });
      } else {
        toast({ title: "Error", description: data.error || "Failed to send reminders", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send reminders", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const count = pendingData?.count || 0;

  if (isLoading || count === 0) return null;

  return (
    <>
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5" data-testid="card-quiz-reminders">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-amber-600" />
            Quiz Completion Reminders
          </CardTitle>
          <CardDescription>
            {count} rep{count !== 1 ? "s have" : " has"} passed roleplays but {count !== 1 ? "haven't" : "hasn't"} completed quizzes yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(pendingData?.reps || []).map((rep: any) => (
                <Badge key={rep.id} variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300">
                  {rep.name} ({rep.quizScore > 0 ? `${rep.quizScore}%` : "no quizzes"})
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-2">
              {results ? (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Sent to {results.totalSent} rep{results.totalSent !== 1 ? "s" : ""}
                    {results.totalFailed > 0 && ` (${results.totalFailed} failed)`}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={sending}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  data-testid="button-bulk-quiz-reminder"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Quiz Reminders to {count} Rep{count !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send quiz reminders?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>The following reps have passed their roleplays but still need to complete quizzes to get certified. Each will receive an email{pendingData?.reps?.some((r: any) => r.phone) ? " and SMS" : ""} with instructions and a link to the quizzes page.</p>
                <div className="rounded-md border max-h-48 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Rep</TableHead>
                        <TableHead className="text-xs text-center">Roleplays Passed</TableHead>
                        <TableHead className="text-xs text-center">Quiz Score</TableHead>
                        <TableHead className="text-xs text-center">Notify Via</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(pendingData?.reps || []).map((rep: any) => (
                        <TableRow key={rep.id}>
                          <TableCell className="text-xs font-medium py-2">{rep.name}</TableCell>
                          <TableCell className="text-xs text-center py-2">{rep.roleplaysPassed}/16</TableCell>
                          <TableCell className="text-xs text-center py-2">
                            <span className={rep.quizScore > 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                              {rep.quizScore > 0 ? `${rep.quizScore}%` : "No attempts"}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-center py-2">
                            <div className="flex items-center justify-center gap-1">
                              <Mail className="h-3 w-3" />
                              {rep.phone && <Phone className="h-3 w-3" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-bulk-reminder">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkSend}
              className="bg-amber-600 hover:bg-amber-700"
              data-testid="button-confirm-bulk-reminder"
            >
              Send to {count} Rep{count !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRep, setNewRep] = useState({ name: "", email: "", phone: "" });
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [createdPhone, setCreatedPhone] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [repToDelete, setRepToDelete] = useState<User | null>(null);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetRep, setResetRep] = useState<User | null>(null);
  const [resetCredentials, setResetCredentials] = useState<{ email: string; password: string; name: string; phone?: string | null } | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [sendingResetEmail, setSendingResetEmail] = useState(false);
  const [sendingResetSMS, setSendingResetSMS] = useState(false);
  const { resolvedTheme } = useTheme();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    handleLogout();
  };
  const queryClient = useQueryClient();
  
  const monetateLogo = resolvedTheme === "dark" ? monetateLogoDark : monetateLogoLight;

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = currentUser?.id;

  const { data: teamReps = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/managers", managerId, "team"],
    queryFn: async () => {
      if (!managerId) return [];
      const response = await fetch(`/api/managers/${managerId}/team`);
      if (!response.ok) throw new Error("Failed to fetch team");
      return response.json();
    },
    enabled: !!managerId,
  });

  const { data: allReps = [] } = useQuery<User[]>({
    queryKey: ["/api/reps"],
  });

  interface UsageData {
    sessions: Array<{
      id: string;
      userId: string;
      roleplayId: string;
      durationSeconds: number;
      billedMinutes: number;
      costCents: number;
      status: string;
      createdAt: string;
    }>;
    byUser: Record<string, { sessions: number; minutes: number; costCents: number }>;
    summary: {
      totalSessions: number;
      totalMinutes: number;
      totalCostDollars: string;
      ratePerMinute: string;
    };
  }

  const { data: usageData } = useQuery<UsageData>({
    queryKey: ["/api/usage/team", managerId],
    queryFn: async () => {
      if (!managerId) return { sessions: [], byUser: {}, summary: { totalSessions: 0, totalMinutes: 0, totalCostDollars: "0.00", ratePerMinute: "$0.15" } };
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`/api/usage/team/${managerId}`, {
        headers: authToken ? { "Authorization": `Bearer ${authToken}` } : {}
      });
      if (!response.ok) throw new Error("Failed to fetch usage");
      return response.json();
    },
    enabled: !!managerId,
  });

  const { data: stalledReps = [] } = useQuery<User[]>({
    queryKey: ["stalled-reps", managerId],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("/api/stalled-reps?days=3", {
        headers: authToken ? { "Authorization": `Bearer ${authToken}` } : {}
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!managerId,
  });

  const { data: performanceData, isLoading: performanceLoading } = useQuery<TeamPerformance>({
    queryKey: ["/api/managers", managerId, "performance"],
    queryFn: async () => {
      if (!managerId) return null;
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`/api/managers/${managerId}/performance`, {
        headers: authToken ? { "Authorization": `Bearer ${authToken}` } : {}
      });
      if (!response.ok) throw new Error("Failed to fetch performance");
      return response.json();
    },
    enabled: !!managerId,
  });

  const reps = managerId ? teamReps : allReps;

  const filteredReps = reps.filter(rep => 
    rep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rep.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; phone?: string; role: string; managerId?: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers", managerId, "team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        name: data.user.name,
      });
      setCreatedPhone(newRep.phone || null);
      setNewRep({ name: "", email: "", phone: "" });
      toast({
        title: "Rep Created",
        description: "Login credentials have been generated. Copy or send them below.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create rep",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("DELETE", `/api/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers", managerId, "team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      toast({
        title: "Rep Removed",
        description: "User access has been revoked.",
        variant: "destructive",
      });
    },
  });

  const handleAddRep = () => {
    if (!newRep.name || !newRep.email) return;
    createUserMutation.mutate({
      name: newRep.name,
      email: newRep.email,
      phone: newRep.phone || undefined,
      role: "rep",
      managerId: managerId || undefined,
    });
  };

  const handleRemoveRep = (rep: User) => {
    setRepToDelete(rep);
  };

  const confirmDeleteRep = () => {
    if (repToDelete) {
      deleteUserMutation.mutate(repToDelete.id);
      setRepToDelete(null);
    }
  };

  const handleRemind = (id: string) => {
    toast({
      title: "Reminder Sent",
      description: "Training reminder email sent to user.",
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard.`,
    });
  };

  const handleSendEmail = async () => {
    if (!createdCredentials) return;
    setSendingEmail(true);
    try {
      const response = await apiRequest("POST", "/api/send-credentials/email", {
        email: createdCredentials.email,
        name: createdCredentials.name,
        password: createdCredentials.password,
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Email Sent",
          description: `Credentials sent to ${createdCredentials.email}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Could not send email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSendSMS = async () => {
    if (!createdCredentials || !createdPhone) return;
    setSendingSMS(true);
    try {
      const response = await apiRequest("POST", "/api/send-credentials/sms", {
        phone: createdPhone,
        email: createdCredentials.email,
        name: createdCredentials.name,
        password: createdCredentials.password,
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "SMS Sent",
          description: `Credentials sent to ${createdPhone}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "SMS Failed",
        description: error.message || "Could not send SMS",
        variant: "destructive",
      });
    } finally {
      setSendingSMS(false);
    }
  };

  const closeCredentialsDialog = () => {
    setCreatedCredentials(null);
    setCreatedPhone(null);
    setIsAddOpen(false);
  };

  const handleResetPassword = async (rep: User) => {
    setResetRep(rep);
    setResetCredentials(null);
    setResetPasswordOpen(true);
  };

  const confirmResetPassword = async () => {
    if (!resetRep) return;
    setResettingPassword(true);
    try {
      const response = await apiRequest("POST", `/api/users/${resetRep.id}/reset-credentials`, {
        sendEmail: false,
      });
      const data = await response.json();
      if (data.success) {
        setResetCredentials({
          email: resetRep.email,
          password: data.password,
          name: resetRep.name,
          phone: resetRep.phone,
        });
        toast({
          title: "Password Reset",
          description: `New password generated for ${resetRep.name}.`,
        });
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
      setResetPasswordOpen(false);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!resetCredentials) return;
    setSendingResetEmail(true);
    try {
      const response = await apiRequest("POST", "/api/send-credentials/email", {
        email: resetCredentials.email,
        name: resetCredentials.name,
        password: resetCredentials.password,
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Email Sent",
          description: `New credentials sent to ${resetCredentials.email}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Could not send email",
        variant: "destructive",
      });
    } finally {
      setSendingResetEmail(false);
    }
  };

  const handleSendResetSMS = async () => {
    if (!resetCredentials || !resetCredentials.phone) return;
    setSendingResetSMS(true);
    try {
      const response = await apiRequest("POST", "/api/send-credentials/sms", {
        phone: resetCredentials.phone,
        email: resetCredentials.email,
        name: resetCredentials.name,
        password: resetCredentials.password,
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "SMS Sent",
          description: `New credentials sent to ${resetCredentials.phone}`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "SMS Failed",
        description: error.message || "Could not send SMS",
        variant: "destructive",
      });
    } finally {
      setSendingResetSMS(false);
    }
  };

  const closeResetDialog = () => {
    setResetPasswordOpen(false);
    setResetCredentials(null);
    setResetRep(null);
  };

  const ManagerHeader = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/manager-dashboard" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={monetateLogo} alt="Monetate" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>Monetate</span>
                <span className="text-[10px] text-foreground/80 font-normal uppercase tracking-wide">Manager Portal</span>
              </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Client:</span>
            <img src={monetateLogo} alt="Monetate" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <ModeToggle />
           <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold leading-none">{currentUser?.name || "Sarah Jenkins"}</span>
              <span className="text-xs text-muted-foreground">Sales Manager</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20">
              {currentUser?.avatarInitials || "SJ"}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowLogoutDialog(true)} title="Sign out" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/20 font-sans">
      <ManagerHeader />
      
      <main className="container mx-auto px-4 py-8">
        {stalledReps.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">Attention Needed</h3>
                <p className="text-sm text-muted-foreground">
                  {stalledReps.length} rep{stalledReps.length > 1 ? 's' : ''} haven't trained in 3+ days: {stalledReps.map(r => r.name).join(", ")}
                </p>
              </div>
              <Link href={`/manager/rep/${stalledReps[0]?.id}`}>
                <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-500/50 hover:bg-yellow-500/10" data-testid="button-view-stalled-rep">
                  View Rep
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-1">Team Overview</h1>
            <p className="text-muted-foreground">Manage your sales cohort and track certification progress.</p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) {
              setCreatedCredentials(null);
              setNewRep({ name: "", email: "", phone: "" });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20" data-testid="button-add-rep">
                <UserPlus className="w-4 h-4" /> Add New Rep
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              {!createdCredentials ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Add Sales Rep</DialogTitle>
                    <DialogDescription>
                      Create a new sales rep account. A secure password will be generated automatically.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        placeholder="e.g. John Doe" 
                        value={newRep.name} 
                        onChange={(e) => setNewRep({...newRep, name: e.target.value})}
                        data-testid="input-rep-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        placeholder="john.doe@monetate.com" 
                        type="email"
                        value={newRep.email}
                        onChange={(e) => setNewRep({...newRep, email: e.target.value})}
                        data-testid="input-rep-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number (optional)</Label>
                      <Input 
                        placeholder="+1 555-123-4567" 
                        type="tel"
                        value={newRep.phone}
                        onChange={(e) => setNewRep({...newRep, phone: e.target.value})}
                        data-testid="input-rep-phone"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={handleAddRep}
                      disabled={createUserMutation.isPending}
                      data-testid="button-create-rep"
                    >
                      {createUserMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                      ) : (
                        "Create Rep"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Rep Created Successfully
                    </DialogTitle>
                    <DialogDescription>
                      Copy the credentials below or send them directly to the new rep.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                          <p className="font-mono text-sm">{createdCredentials.email}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(createdCredentials.email, "Email")}
                          data-testid="button-copy-email"
                        >
                          {copiedField === "Email" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Password</p>
                          <p className="font-mono text-sm font-bold">{createdCredentials.password}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(createdCredentials.password, "Password")}
                          data-testid="button-copy-password"
                        >
                          {copiedField === "Password" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={handleSendEmail}
                        disabled={sendingEmail}
                        data-testid="button-send-email"
                      >
                        {sendingEmail ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Mail className="w-4 h-4" /> Send via Email</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={handleSendSMS}
                        disabled={sendingSMS || !createdPhone}
                        title={!createdPhone ? "Phone number required" : "Send via SMS"}
                        data-testid="button-send-sms"
                      >
                        {sendingSMS ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          <><Phone className="w-4 h-4" /> Send via SMS</>
                        )}
                      </Button>
                    </div>
                    {!createdPhone && (
                      <p className="text-xs text-muted-foreground text-center">
                        Add a phone number to enable SMS
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={closeCredentialsDialog} data-testid="button-done">
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Reps</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-reps">{reps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                On your team
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reps.filter(r => r.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently training
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reps.filter(r => r.status === 'onboarding').length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="usage">Team Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            {/* Team Performance Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certified Reps</CardTitle>
                  <Award className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{performanceData?.teamStats.certifiedReps || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {performanceData?.teamStats.totalReps || 0} reps certified
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData?.teamStats.avgQuizScore || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Team average</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Roleplay Pass Rate</CardTitle>
                  <Mic className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData?.teamStats.avgRoleplayPassRate || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Team average</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Score</CardTitle>
                  <Trophy className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceData?.teamStats.teamScore || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Reminder Nudge Card */}
            <QuizReminderCard />

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Team Leaderboard
                </CardTitle>
                <CardDescription>
                  Reps ranked by certification status and overall score. Certified reps appear first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Loading performance data...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>Rep</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Chapters</TableHead>
                        <TableHead className="text-center">Quiz Score</TableHead>
                        <TableHead className="text-center">Roleplays</TableHead>
                        <TableHead className="text-right">Overall Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(performanceData?.reps || []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No performance data available yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        (performanceData?.reps || []).map((rep, index) => (
                          <TableRow 
                            key={rep.userId} 
                            data-testid={`row-performance-${rep.userId}`} 
                            className={`cursor-pointer hover:bg-muted/50 transition-colors ${rep.isCertified ? "bg-green-50/50 dark:bg-green-900/10" : ""}`}
                            onClick={() => setLocation(`/manager/rep/${rep.userId}`)}
                          >
                            <TableCell>
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                index === 1 ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                                index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                {index + 1}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {rep.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-primary hover:underline">{rep.userName}</span>
                                  <span className="text-xs text-muted-foreground">{rep.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {rep.isCertified ? (
                                <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                                  <Award className="w-3 h-3" />
                                  Certified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  In Training
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center">
                                <span className="font-medium">{rep.chaptersCompleted}/{rep.totalChapters}</span>
                                <span className="text-xs text-muted-foreground">{rep.chapterProgress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center">
                                <span className={`font-medium ${rep.quizAverage >= 90 ? "text-green-600" : rep.quizAverage >= 70 ? "text-amber-600" : "text-muted-foreground"}`}>
                                  {rep.quizAverage}%
                                </span>
                                <span className="text-xs text-muted-foreground">{rep.quizAttempts} attempts</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col items-center">
                                <span className={`font-medium ${rep.roleplaysPassed >= (rep.totalRoleplays || 16) ? "text-green-600" : ""}`}>{rep.roleplaysPassed}/{rep.totalRoleplays || 16}</span>
                                <span className="text-xs text-muted-foreground">{rep.roleplaysAttempted} attempts</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold ${
                                rep.overallScore >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                rep.overallScore >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {rep.overallScore}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Certification Requirements Info */}
            <Card className="border-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Certification Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Complete all chapters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Score 75%+ on quizzes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>Pass at least 1 roleplay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reps..." 
                  className="pl-9 bg-card" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-reps"
                />
              </div>
            </div>

            <Card className="overflow-hidden border-border/60">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Loading team...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Rep Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No reps found. Add your first rep above.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReps.map((rep) => (
                    <TableRow 
                      key={rep.id} 
                      data-testid={`row-rep-${rep.id}`}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setLocation(`/manager/rep/${rep.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {rep.warriorAvatar || rep.profilePhoto ? (
                            <img 
                              src={rep.warriorAvatar || rep.profilePhoto || ""} 
                              alt={rep.name}
                              className="h-9 w-9 rounded-full object-cover border-2 border-primary/20"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {rep.avatarInitials}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-primary">
                              {rep.name}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          rep.status === 'active' ? 'default' : 
                          rep.status === 'inactive' ? 'secondary' : 'outline'
                        } className={
                          rep.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
                          rep.status === 'onboarding' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20' : ''
                        }>
                          {rep.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rep.email}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rep.phone || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleResetPassword(rep)} 
                            title="Reset Password"
                            data-testid={`button-reset-password-${rep.id}`}
                          >
                            <KeyRound className="h-4 w-4 text-muted-foreground hover:text-amber-500" />
                          </Button>
                           <Button 
                             size="sm" 
                             variant="ghost" 
                             className="h-8 w-8 p-0" 
                             onClick={() => handleRemind(rep.id)} 
                             title="Send Reminder"
                           >
                            <Bell className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleRemoveRep(rep)} 
                            title="Remove User"
                            data-testid={`button-delete-rep-${rep.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageData?.summary.totalSessions || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Voice roleplay sessions</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
                  <BarChart3 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageData?.summary.totalMinutes || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Billed minutes</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${usageData?.summary.totalCostDollars || "0.00"}</div>
                  <p className="text-xs text-muted-foreground mt-1">At {usageData?.summary.ratePerMinute || "$0.15"}/min</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Reps</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(usageData?.byUser || {}).length}</div>
                  <p className="text-xs text-muted-foreground mt-1">With usage this period</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Rep</CardTitle>
                <CardDescription>Breakdown of usage and costs per team member</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rep</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Minutes</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(usageData?.byUser || {}).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No usage data available yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.entries(usageData?.byUser || {}).map(([userId, data]) => {
                        const user = reps.find(u => u.id === userId);
                        return (
                          <TableRow key={userId} data-testid={`row-usage-${userId}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {user?.avatarInitials || "?"}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">{user?.name || userId}</span>
                                  <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{data.sessions}</TableCell>
                            <TableCell>{data.minutes} min</TableCell>
                            <TableCell className="font-medium">${(data.costCents / 100).toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Last 20 voice roleplay sessions from your team</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Rep</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(usageData?.sessions || []).slice(0, 20).map((session) => {
                      const user = reps.find(u => u.id === session.userId);
                      return (
                        <TableRow key={session.id} data-testid={`row-session-${session.id}`}>
                          <TableCell>
                            {new Date(session.createdAt).toLocaleDateString()} {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell>{user?.name || session.userId}</TableCell>
                          <TableCell>{session.billedMinutes || 0} min</TableCell>
                          <TableCell>${((session.costCents || 0) / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                              {session.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-signout-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-red-600 hover:bg-red-700" data-testid="button-signout-confirm">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={repToDelete !== null} onOpenChange={(open) => !open && setRepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {repToDelete?.name} from your team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-delete-rep-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRep} className="bg-red-600 hover:bg-red-700" data-testid="button-delete-rep-confirm">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={resetPasswordOpen} onOpenChange={(open) => {
        if (!open) closeResetDialog();
      }}>
        <DialogContent className="max-w-md">
          {!resetCredentials ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  Reset Password
                </DialogTitle>
                <DialogDescription>
                  Generate a new password for <strong>{resetRep?.name}</strong>. Their current password will stop working immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={closeResetDialog} data-testid="button-reset-cancel">Cancel</Button>
                <Button 
                  onClick={confirmResetPassword}
                  disabled={resettingPassword}
                  className="bg-amber-600 hover:bg-amber-700"
                  data-testid="button-reset-confirm"
                >
                  {resettingPassword ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Password Reset Successfully
                </DialogTitle>
                <DialogDescription>
                  Copy the new credentials below or send them directly to {resetCredentials.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-mono text-sm" data-testid="text-reset-email">{resetCredentials.email}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => copyToClipboard(resetCredentials.email, "Email")}
                      data-testid="button-copy-reset-email"
                    >
                      {copiedField === "Email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">New Password</p>
                      <p className="font-mono text-sm font-bold" data-testid="text-reset-password">{resetCredentials.password}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => copyToClipboard(resetCredentials.password, "Password")}
                      data-testid="button-copy-reset-password"
                    >
                      {copiedField === "Password" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={handleSendResetEmail}
                    disabled={sendingResetEmail}
                    data-testid="button-send-reset-email"
                  >
                    {sendingResetEmail ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Mail className="w-4 h-4" /> Send via Email</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={handleSendResetSMS}
                    disabled={sendingResetSMS || !resetCredentials.phone}
                    title={!resetCredentials.phone ? "No phone number on file" : "Send via SMS"}
                    data-testid="button-send-reset-sms"
                  >
                    {sendingResetSMS ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Phone className="w-4 h-4" /> Send via SMS</>
                    )}
                  </Button>
                </div>
                {!resetCredentials.phone && (
                  <p className="text-xs text-muted-foreground text-center">
                    SMS unavailable — no phone number on file for this rep.
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={closeResetDialog} data-testid="button-reset-done">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
