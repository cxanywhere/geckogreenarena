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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Users, TrendingUp, AlertCircle, Search, Trash2, Shield, DollarSign, Activity, BarChart3, Settings, Copy, Mail, Phone, Check, CheckCircle, Loader2, LogOut, Trophy, Award, Target, GraduationCap, Mic, ChevronDown, ChevronUp, Upload, Download, FileText, Archive, AlertTriangle, RefreshCw } from "lucide-react";
import arenaLogoDark from "@/assets/arena-logo-dark.png";
import arenaLogoLight from "@/assets/arena-logo-light.png";
import geckoLogo from "@assets/image_1766975682051.png";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress";
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

interface OrgPerformance {
  managers: TeamPerformance[];
  allReps: RepPerformance[];
  orgStats: {
    totalManagers: number;
    totalReps: number;
    certifiedReps: number;
    avgChapterProgress: number;
    avgQuizScore: number;
    avgRoleplayPassRate: number;
  };
}

function AdminQuizReminderCard() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [results, setResults] = useState<{ totalSent: number; totalFailed: number } | null>(null);

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["admin-quiz-reminders-pending"],
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
      <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/5" data-testid="card-admin-quiz-reminders">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-amber-600" />
            Quiz Completion Reminders
          </CardTitle>
          <CardDescription>
            {count} rep{count !== 1 ? "s have" : " has"} passed roleplays but {count !== 1 ? "haven't" : "hasn't"} completed quizzes yet across all teams.
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
                  data-testid="button-admin-bulk-quiz-reminder"
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
            <AlertDialogCancel data-testid="button-cancel-admin-bulk-reminder">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkSend}
              className="bg-amber-600 hover:bg-amber-700"
              data-testid="button-confirm-admin-bulk-reminder"
            >
              Send to {count} Rep{count !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "", phone: "" });
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", phone: "", role: "director" as "director" | "admin" });
  const [adminCredentials, setAdminCredentials] = useState<CreatedCredentials | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [createdPhone, setCreatedPhone] = useState<string | null>(null);
  const [expandedManagers, setExpandedManagers] = useState<Set<string>>(new Set());
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
  const [bulkAddInput, setBulkAddInput] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState<string>("");
  const [sendWelcomeEmails, setSendWelcomeEmails] = useState(true);
  const [bulkAddResults, setBulkAddResults] = useState<{
    success: Array<{ name: string; email: string; password: string; emailSent: boolean }>;
    failed: Array<{ name: string; email: string; reason: string }>;
  } | null>(null);
  const [showBillingResetDialog, setShowBillingResetDialog] = useState(false);
  const [billingResetStep, setBillingResetStep] = useState<'request' | 'verify'>('request');
  const [billingResetCode, setBillingResetCode] = useState("");
  const [requestingReset, setRequestingReset] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [repToDelete, setRepToDelete] = useState<User | null>(null);
  const [deletingRep, setDeletingRep] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'choose' | 'reassign' | 'hard-verify'>('choose');
  const [deleteType, setDeleteType] = useState<'soft' | 'hard' | null>(null);
  const [hardDeleteCode, setHardDeleteCode] = useState("");
  const [reassignToManagerId, setReassignToManagerId] = useState<string>("");
  const [requestingHardDelete, setRequestingHardDelete] = useState(false);
  const [hardDeleteRepCount, setHardDeleteRepCount] = useState(0);
  const [repToResetCredentials, setRepToResetCredentials] = useState<User | null>(null);
  const [resettingCredentials, setResettingCredentials] = useState(false);
  const [resetCredentialsResult, setResetCredentialsResult] = useState<{ password: string; emailSent: boolean; emailError?: string } | null>(null);
  const [auditResults, setAuditResults] = useState<{
    summary: {
      sessionsAudited: number;
      discrepanciesFound: number;
      errorsEncountered: number;
      totalOverchargedMinutes: number;
      totalOverchargedCents: number;
    };
    discrepancies: Array<{
      sessionId: string;
      userId: string;
      userName?: string;
      vapiCallId: string;
      sessionDate: string;
      storedDurationSeconds: number;
      storedBilledMinutes: number;
      storedCostCents: number;
      actualDurationSeconds: number;
      actualBilledMinutes: number;
      actualCostCents: number;
      differenceMinutes: number;
      differenceCostCents: number;
      vapiStatus: string;
    }>;
    errors: Array<{ sessionId: string; vapiCallId: string; error: string }>;
  } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [isCleaningOrphans, setIsCleaningOrphans] = useState(false);
  const [isLoadingCleanupPreview, setIsLoadingCleanupPreview] = useState(false);
  const [cleanupPreview, setCleanupPreview] = useState<{
    sessionsCount: number;
    summary: {
      toFix: number;
      toCancel: number;
      errored: number;
      currentTotalMinutes: number;
      actualTotalMinutes: number;
      minutesDifference: number;
      currentTotalCost: number;
      actualTotalCost: number;
      costDifference: number;
    };
    sessions: Array<{
      sessionId: string;
      vapiCallId: string;
      userId: string;
      userName?: string;
      sessionDate: string;
      currentStatus: string;
      currentDuration: number;
      currentBilledMinutes: number;
      currentCostCents: number;
      actualDuration: number | null;
      actualBilledMinutes: number | null;
      actualCostCents: number | null;
      vapiStatus: string | null;
      issue: 'orphaned' | 'corrupted' | 'unknown';
      action: 'fix' | 'cancel' | 'error';
      error?: string;
    }>;
  } | null>(null);
  const [cleanupResults, setCleanupResults] = useState<{
    summary: {
      sessionsProcessed: number;
      sessionsFixed: number;
      sessionsCancelled: number;
      sessionsErrored: number;
      totalMinutesBilled: number;
      totalCostCents: number;
    };
    results: Array<{
      sessionId: string;
      vapiCallId: string;
      action: 'fixed' | 'cancelled' | 'error';
      durationSeconds?: number;
      billedMinutes?: number;
      costCents?: number;
      error?: string;
    }>;
  } | null>(null);
  const [selectedDiscrepancies, setSelectedDiscrepancies] = useState<Set<string>>(new Set());
  const [singleAuditResult, setSingleAuditResult] = useState<{
    sessionId: string;
    loading: boolean;
    fixing?: boolean;
    error?: string;
    fixError?: string;
    data?: {
      hasDiscrepancy: boolean;
      session: { id: string; userId: string; userName?: string; vapiCallId: string; sessionDate: string; status: string };
      stored: { durationSeconds: number; billedMinutes: number; costCents: number };
      actual: { durationSeconds: number; billedMinutes: number; costCents: number; vapiStatus: string };
      difference: { minutes: number; costCents: number };
    };
  } | null>(null);
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

  const handleRequestBillingReset = async () => {
    setRequestingReset(true);
    try {
      const response = await fetch("/api/usage/reset-request", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to request reset");
      }
      toast({ title: "Verification code sent", description: "Check tabish@gigarev.com for the 4-digit code." });
      setBillingResetStep('verify');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setRequestingReset(false);
    }
  };

  const handleConfirmBillingReset = async () => {
    if (billingResetCode.length !== 4) {
      toast({ title: "Invalid code", description: "Please enter the 4-digit code.", variant: "destructive" });
      return;
    }
    setConfirmingReset(true);
    try {
      const response = await fetch("/api/usage/reset-confirm", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: billingResetCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset billing data");
      }
      toast({ title: "Success", description: data.message });
      setShowBillingResetDialog(false);
      setBillingResetStep('request');
      setBillingResetCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/usage/all"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setConfirmingReset(false);
    }
  };

  const closeBillingResetDialog = () => {
    setShowBillingResetDialog(false);
    setBillingResetStep('request');
    setBillingResetCode("");
  };

  const handleAuditUsage = async () => {
    setIsAuditing(true);
    setAuditResults(null);
    setSelectedDiscrepancies(new Set());
    try {
      const response = await fetch("/api/usage/audit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to audit usage");
      }
      setAuditResults(data);
      if (data.summary.discrepanciesFound > 0) {
        toast({ 
          title: "Audit Complete", 
          description: `Found ${data.summary.discrepanciesFound} discrepancies totaling ${data.summary.totalOverchargedMinutes} minutes overcharged.`,
          variant: "destructive"
        });
      } else {
        toast({ 
          title: "Audit Complete", 
          description: "No significant discrepancies found. Usage data is accurate.",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsAuditing(false);
    }
  };

  const handlePreviewCleanup = async () => {
    setIsLoadingCleanupPreview(true);
    setCleanupPreview(null);
    setCleanupResults(null);
    try {
      const response = await fetch("/api/usage/cleanup-preview", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to preview cleanup");
      }
      setCleanupPreview(data);
      if (data.sessionsCount === 0) {
        toast({
          title: "No Issues Found",
          description: "All sessions are properly completed or cancelled.",
        });
      } else {
        toast({ 
          title: "Preview Ready", 
          description: `Found ${data.sessionsCount} sessions with issues. Review below before applying.`,
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingCleanupPreview(false);
    }
  };

  const handleCleanupOrphans = async () => {
    setIsCleaningOrphans(true);
    setCleanupResults(null);
    try {
      const response = await fetch("/api/usage/cleanup-orphaned", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to cleanup orphaned sessions");
      }
      setCleanupResults(data);
      setCleanupPreview(null); // Clear preview after applying
      if (data.summary.sessionsFixed > 0 || data.summary.sessionsCancelled > 0) {
        toast({ 
          title: "Cleanup Complete", 
          description: `Fixed ${data.summary.sessionsFixed} sessions, cancelled ${data.summary.sessionsCancelled}. Total billed: ${data.summary.totalMinutesBilled} minutes ($${(data.summary.totalCostCents / 100).toFixed(2)})`,
        });
        // Refresh usage data
        queryClient.invalidateQueries({ queryKey: ['usage-all'] });
      } else if (data.summary.sessionsProcessed === 0) {
        toast({
          title: "No Orphaned Sessions",
          description: "All sessions are properly completed or cancelled.",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCleaningOrphans(false);
    }
  };

  const handleReconcileSelected = async () => {
    if (selectedDiscrepancies.size === 0) {
      toast({ title: "No items selected", description: "Please select discrepancies to reconcile.", variant: "destructive" });
      return;
    }
    setIsReconciling(true);
    try {
      const fixes = auditResults?.discrepancies
        .filter(d => selectedDiscrepancies.has(d.sessionId))
        .map(d => ({
          sessionId: d.sessionId,
          actualDurationSeconds: d.actualDurationSeconds,
          actualBilledMinutes: d.actualBilledMinutes,
          actualCostCents: d.actualCostCents,
          differenceMinutes: d.differenceMinutes,
          differenceCostCents: d.differenceCostCents,
        })) || [];

      const response = await fetch("/api/usage/reconcile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fixes }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reconcile");
      }
      toast({ 
        title: "Reconciliation Complete", 
        description: data.message,
      });
      setAuditResults(null);
      setSelectedDiscrepancies(new Set());
      queryClient.invalidateQueries({ queryKey: ["/api/usage/all"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsReconciling(false);
    }
  };

  const toggleDiscrepancy = (sessionId: string) => {
    setSelectedDiscrepancies(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  };

  const selectAllDiscrepancies = () => {
    if (!auditResults) return;
    const all = new Set(auditResults.discrepancies.map(d => d.sessionId));
    setSelectedDiscrepancies(all);
  };

  const handleAuditSingleSession = async (sessionId: string) => {
    setSingleAuditResult({ sessionId, loading: true });
    try {
      const response = await fetch(`/api/usage/audit/${sessionId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setSingleAuditResult({ sessionId, loading: false, error: data.error || "Failed to audit session" });
        return;
      }
      setSingleAuditResult({ sessionId, loading: false, data });
    } catch (error: any) {
      setSingleAuditResult({ sessionId, loading: false, error: error.message || "Failed to audit session" });
    }
  };

  const handleFixSingleSession = async () => {
    if (!singleAuditResult?.data?.hasDiscrepancy) return;
    const { sessionId, data } = singleAuditResult;
    
    setSingleAuditResult(prev => prev ? { ...prev, fixing: true, fixError: undefined } : null);
    
    try {
      const response = await fetch("/api/usage/reconcile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fixes: [{
            sessionId,
            actualDurationSeconds: data.actual.durationSeconds,
            actualBilledMinutes: data.actual.billedMinutes,
            actualCostCents: data.actual.costCents,
            differenceMinutes: data.difference.minutes,
            differenceCostCents: data.difference.costCents,
          }]
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to reconcile");
      }
      toast({ title: "Fixed!", description: "Session has been corrected with actual VAPI data." });
      setSingleAuditResult(null);
      queryClient.invalidateQueries({ queryKey: ["/api/usage/all"] });
    } catch (error: any) {
      setSingleAuditResult(prev => prev ? { ...prev, fixing: false, fixError: error.message } : null);
    }
  };

  const handleSoftDelete = async () => {
    if (!repToDelete) return;
    setDeletingRep(true);
    try {
      const response = await fetch(`/api/users/${repToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }
      toast({ title: "User archived", description: `${repToDelete.name} has been archived. Their data is preserved.` });
      closeDeleteDialog();
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeletingRep(false);
    }
  };

  const handleRequestHardDelete = async () => {
    if (!repToDelete) return;
    setRequestingHardDelete(true);
    try {
      const response = await fetch(`/api/users/${repToDelete.id}/hard-delete-request`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to request hard delete");
      }
      toast({ title: "Verification code sent", description: "Check tabish@gigarev.com for the 4-digit code." });
      setHardDeleteRepCount(data.repCount || 0);
      setDeleteStep('hard-verify');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setRequestingHardDelete(false);
    }
  };

  const handleConfirmHardDelete = async () => {
    if (!repToDelete || !hardDeleteCode) return;
    setDeletingRep(true);
    try {
      const response = await fetch(`/api/users/${repToDelete.id}/hard-delete-confirm`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: hardDeleteCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm hard delete");
      }
      toast({ 
        title: "Permanently deleted", 
        description: `Deleted ${data.deletedUsers} user(s) and ${data.deletedSessions} usage session(s).`,
        variant: "destructive"
      });
      closeDeleteDialog();
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/usage/all"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeletingRep(false);
    }
  };

  const handleReassignReps = async () => {
    if (!repToDelete || !reassignToManagerId) return;
    setDeletingRep(true);
    try {
      const response = await fetch(`/api/users/reassign`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fromManagerId: repToDelete.id, 
          toManagerId: reassignToManagerId 
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reassign reps");
      }
      toast({ title: "Reps reassigned", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      // Now prompt for what to do with the manager
      setDeleteStep('choose');
      setReassignToManagerId("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeletingRep(false);
    }
  };

  const closeDeleteDialog = () => {
    setRepToDelete(null);
    setDeleteStep('choose');
    setDeleteType(null);
    setHardDeleteCode("");
    setReassignToManagerId("");
    setHardDeleteRepCount(0);
  };

  const handleResetCredentials = async () => {
    if (!repToResetCredentials) return;
    setResettingCredentials(true);
    try {
      const response = await fetch(`/api/users/${repToResetCredentials.id}/reset-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sendEmail: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset credentials");
      }
      setResetCredentialsResult({
        password: data.password,
        emailSent: data.emailSent,
        emailError: data.emailError,
      });
      toast({ 
        title: "Password Reset", 
        description: data.emailSent 
          ? `New credentials sent to ${repToResetCredentials.email}` 
          : "Password reset successfully. Email delivery pending."
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setResettingCredentials(false);
    }
  };

  const closeResetDialog = () => {
    setRepToResetCredentials(null);
    setResetCredentialsResult(null);
  };
  
  const arenaLogo = resolvedTheme === "dark" ? arenaLogoDark : arenaLogoLight;

  const { data: managers = [], isLoading: managersLoading } = useQuery<User[]>({
    queryKey: ["/api/managers"],
  });

  const { data: allReps = [], isLoading: repsLoading } = useQuery<User[]>({
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
    queryKey: ["/api/usage/all"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return { sessions: [], byUser: {}, summary: { totalSessions: 0, totalMinutes: 0, totalCostDollars: "0.00", ratePerMinute: "$0.15" } };
      
      const response = await fetch("/api/usage/all", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error("Failed to fetch usage");
      return response.json();
    },
  });

  const { data: orgPerformance, isLoading: performanceLoading } = useQuery<OrgPerformance>({
    queryKey: ["/api/performance/admin"],
    queryFn: async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return null;
      
      const response = await fetch("/api/performance/admin", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error("Failed to fetch performance");
      return response.json();
    },
  });

  const toggleManagerExpanded = (managerId: string) => {
    setExpandedManagers(prev => {
      const next = new Set(prev);
      if (next.has(managerId)) {
        next.delete(managerId);
      } else {
        next.add(managerId);
      }
      return next;
    });
  };

  const filteredManagers = managers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; phone?: string; role: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      const json = await response.json();
      return { ...json, submittedPhone: userData.phone, submittedRole: userData.role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        name: data.user.name,
      });
      setCreatedPhone(data.submittedPhone || null);
      
      const roleLabel = data.submittedRole === "director" ? "Director" 
        : data.submittedRole === "admin" ? "Admin" 
        : data.submittedRole === "manager" ? "Manager" 
        : "User";
      
      if (data.submittedRole === "manager") {
        setNewManager({ name: "", email: "", phone: "" });
      } else if (data.submittedRole === "director" || data.submittedRole === "admin") {
        setAdminCredentials({
          email: data.credentials.email,
          password: data.credentials.password,
          name: data.user.name,
        });
        setNewAdmin({ name: "", email: "", phone: "", role: "director" });
      }
      
      toast({
        title: `${roleLabel} Created`,
        description: "Login credentials have been generated. Copy or send them below.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const bulkAddMutation = useMutation({
    mutationFn: async (data: { managerId: string; users: Array<{ name: string; email: string }>; sendEmails: boolean }) => {
      const response = await apiRequest("POST", "/api/users/bulk", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      setBulkAddResults(data.results);
      toast({
        title: "Bulk Add Complete",
        description: `Successfully created ${data.results.success.length} reps${data.results.failed.length > 0 ? `, ${data.results.failed.length} failed` : ""}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add reps",
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
      queryClient.invalidateQueries({ queryKey: ["/api/managers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
      toast({
        title: "Access Revoked",
        description: "User has been removed from the system.",
        variant: "destructive",
      });
    },
  });

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email) return;
    createUserMutation.mutate({
      name: newManager.name,
      email: newManager.email,
      phone: newManager.phone || undefined,
      role: "manager",
    });
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;
    createUserMutation.mutate({
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone || undefined,
      role: newAdmin.role,
    });
  };

  const handleRemoveManager = (id: string) => {
    deleteUserMutation.mutate(id);
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
    setIsAddManagerOpen(false);
  };

  // Parse bulk input: each line should be "Name, email" or "Name email"
  const parseBulkInput = (input: string): Array<{ name: string; email: string }> => {
    const lines = input.split("\n").filter(line => line.trim());
    return lines.map(line => {
      // Try comma-separated first
      let parts = line.split(",").map(p => p.trim());
      if (parts.length >= 2) {
        return { name: parts[0], email: parts[1] };
      }
      // Try space/tab separated (find the email by pattern)
      const words = line.trim().split(/[\s\t]+/);
      const emailIndex = words.findIndex(w => w.includes("@"));
      if (emailIndex > 0) {
        const name = words.slice(0, emailIndex).join(" ");
        const email = words[emailIndex];
        return { name, email };
      }
      // Fallback: first word is name, last is email
      if (words.length >= 2) {
        return { name: words.slice(0, -1).join(" "), email: words[words.length - 1] };
      }
      return { name: "", email: line.trim() };
    }).filter(u => u.name && u.email);
  };

  const handleBulkAdd = () => {
    if (!selectedManagerId || !bulkAddInput.trim()) return;
    const users = parseBulkInput(bulkAddInput);
    if (users.length === 0) {
      toast({
        title: "No valid entries",
        description: "Please enter at least one name and email pair.",
        variant: "destructive",
      });
      return;
    }
    bulkAddMutation.mutate({
      managerId: selectedManagerId,
      users,
      sendEmails: sendWelcomeEmails,
    });
  };

  const closeBulkAddDialog = () => {
    setIsBulkAddOpen(false);
    setBulkAddInput("");
    setSelectedManagerId("");
    setBulkAddResults(null);
  };

  const downloadResultsCSV = () => {
    if (!bulkAddResults) return;
    const csvLines = ["Name,Email,Password,Email Sent,Status"];
    for (const s of bulkAddResults.success) {
      csvLines.push(`"${s.name}","${s.email}","${s.password}",${s.emailSent ? "Yes" : "No"},Success`);
    }
    for (const f of bulkAddResults.failed) {
      csvLines.push(`"${f.name}","${f.email}","","","Failed: ${f.reason}"`);
    }
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulk-add-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const AdminHeader = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin-dashboard" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>arena ai</span>
                <span className="text-[10px] text-destructive font-bold uppercase tracking-wide">Admin / Director Portal</span>
              </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Org:</span>
            <img src={geckoLogo} alt="GeckoGreen" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-4">
           <ModeToggle />
           <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold leading-none">Robert Fox</span>
              <span className="text-xs text-muted-foreground">VP of Sales</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20 ring-2 ring-primary/20">
              RF
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowLogoutDialog(true)} title="Sign out" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/20 font-sans pb-12">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-1">Organization Overview</h1>
            <p className="text-muted-foreground">Monitor usage, billing, and team performance across the organization.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" /> Settings
            </Button>
            <Button variant="secondary" className="gap-2">
              <BarChart3 className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(usageData?.summary.totalMinutes || 0).toLocaleString()} min</div>
              <p className="text-xs text-muted-foreground mt-2">
                Voice roleplay minutes used
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${usageData?.summary.totalCostDollars || "0.00"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                At {usageData?.summary.ratePerMinute || "$0.15"}/min rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Reps</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allReps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {managers.length} teams
              </p>
            </CardContent>
          </Card>

           <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData?.summary.totalSessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Voice roleplays completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="performance">Org Performance</TabsTrigger>
            <TabsTrigger value="managers">Managers & Teams</TabsTrigger>
            <TabsTrigger value="reps">All Reps Directory</TabsTrigger>
            <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            {/* Org Performance Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-card to-green-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certified Reps</CardTitle>
                  <Award className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{orgPerformance?.orgStats.certifiedReps || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {orgPerformance?.orgStats.totalReps || 0} reps certified
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Quiz Score</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orgPerformance?.orgStats.avgQuizScore || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Org average</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Roleplay Pass Rate</CardTitle>
                  <Mic className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orgPerformance?.orgStats.avgRoleplayPassRate || 0}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Org average</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
                  <Users className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orgPerformance?.orgStats.totalManagers || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">With teams</p>
                </CardContent>
              </Card>
            </div>

            {/* Manager Leaderboard with Expandable Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Manager Leaderboard
                </CardTitle>
                <CardDescription>
                  Managers ranked by team performance. Click to expand and see team details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Loading performance data...</p>
                  </div>
                ) : (orgPerformance?.managers || []).length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No managers with teams found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(orgPerformance?.managers || []).map((manager, index) => (
                      <div key={manager.managerId} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleManagerExpanded(manager.managerId)}
                          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          data-testid={`button-expand-manager-${manager.managerId}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              index === 1 ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                              index === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                                {manager.managerName.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{manager.managerName}</p>
                                <p className="text-xs text-muted-foreground">{manager.teamStats.totalReps} reps</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                              <p className="text-sm text-muted-foreground">Certified</p>
                              <p className="font-medium text-green-600">{manager.teamStats.certifiedReps}/{manager.teamStats.totalReps}</p>
                            </div>
                            <div className="text-right hidden md:block">
                              <p className="text-sm text-muted-foreground">Quiz Avg</p>
                              <p className="font-medium">{manager.teamStats.avgQuizScore}%</p>
                            </div>
                            <div className="text-right hidden md:block">
                              <p className="text-sm text-muted-foreground">Roleplay</p>
                              <p className="font-medium">{manager.teamStats.avgRoleplayPassRate}%</p>
                            </div>
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${
                              manager.teamStats.teamScore >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                              manager.teamStats.teamScore >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {manager.teamStats.teamScore}
                            </div>
                            {expandedManagers.has(manager.managerId) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                        
                        {expandedManagers.has(manager.managerId) && (
                          <div className="border-t bg-muted/30 p-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">Rank</TableHead>
                                  <TableHead>Rep</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-center">Chapters</TableHead>
                                  <TableHead className="text-center">Quiz</TableHead>
                                  <TableHead className="text-center">Roleplays</TableHead>
                                  <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {manager.reps.map((rep, repIndex) => (
                                  <TableRow key={rep.userId} className={rep.isCertified ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
                                    <TableCell>
                                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                        repIndex === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                        "bg-muted text-muted-foreground"
                                      }`}>
                                        {repIndex + 1}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Link href={`/admin/rep/${rep.userId}`} className="flex items-center gap-2 hover:text-primary cursor-pointer">
                                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                          {rep.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                                        </div>
                                        <span className="font-medium hover:underline">{rep.userName}</span>
                                      </Link>
                                    </TableCell>
                                    <TableCell>
                                      {rep.isCertified ? (
                                        <Badge className="bg-green-500 hover:bg-green-600 gap-1 text-xs">
                                          <Award className="w-3 h-3" />
                                          Certified
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-muted-foreground text-xs">
                                          Training
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <span className="text-sm">{rep.chaptersCompleted}/{rep.totalChapters}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <span className={`text-sm font-medium ${rep.quizAverage >= 90 ? "text-green-600" : rep.quizAverage >= 70 ? "text-amber-600" : ""}`}>
                                        {rep.quizAverage}%
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <span className={`text-sm font-medium ${rep.roleplaysPassed >= (rep.totalRoleplays || 16) ? "text-green-600" : ""}`}>{rep.roleplaysPassed}/{rep.totalRoleplays || 16}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                                        rep.overallScore >= 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                        rep.overallScore >= 60 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                      }`}>
                                        {rep.overallScore}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Global Rep Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Performers (All Reps)
                </CardTitle>
                <CardDescription>
                  All reps ranked across the organization. Certified reps appear first.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Loading...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>Rep</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Quiz Score</TableHead>
                        <TableHead className="text-center">Roleplays</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(orgPerformance?.allReps || []).slice(0, 10).map((rep, index) => (
                        <TableRow key={rep.userId} data-testid={`row-org-performance-${rep.userId}`} className={rep.isCertified ? "bg-green-50/50 dark:bg-green-900/10" : ""}>
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
                            <Link href={`/admin/rep/${rep.userId}`} className="flex items-center gap-2 hover:text-primary cursor-pointer">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {rep.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium hover:underline">{rep.userName}</p>
                                <p className="text-xs text-muted-foreground">{rep.email}</p>
                              </div>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{rep.managerName || "—"}</span>
                          </TableCell>
                          <TableCell>
                            {rep.isCertified ? (
                              <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                                <Award className="w-3 h-3" />
                                Certified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Training
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-medium ${rep.quizAverage >= 90 ? "text-green-600" : rep.quizAverage >= 70 ? "text-amber-600" : ""}`}>
                              {rep.quizAverage}%
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`font-medium ${rep.roleplaysPassed >= (rep.totalRoleplays || 16) ? "text-green-600" : ""}`}>{rep.roleplaysPassed}/{rep.totalRoleplays || 16}</span>
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
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <AdminQuizReminderCard />
          </TabsContent>

          <TabsContent value="managers" className="space-y-4">
             <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search managers..." 
                  className="pl-9 bg-card" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-managers"
                />
              </div>
              <Dialog open={isAddManagerOpen} onOpenChange={(open) => {
                setIsAddManagerOpen(open);
                if (!open) {
                  setCreatedCredentials(null);
                  setNewManager({ name: "", email: "", phone: "" });
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2" data-testid="button-add-manager">
                    <UserPlus className="w-4 h-4" /> Add Manager
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  {!createdCredentials ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>Add New Manager</DialogTitle>
                        <DialogDescription>
                          Create a manager account. A secure password will be generated automatically.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input 
                            placeholder="e.g. David Miller" 
                            value={newManager.name} 
                            onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                            data-testid="input-manager-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <Input 
                            placeholder="david.miller@geckogreen.ai" 
                            type="email"
                            value={newManager.email}
                            onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                            data-testid="input-manager-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number (optional)</Label>
                          <Input 
                            placeholder="+1 555-123-4567" 
                            type="tel"
                            value={newManager.phone}
                            onChange={(e) => setNewManager({...newManager, phone: e.target.value})}
                            data-testid="input-manager-phone"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddManagerOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={handleAddManager} 
                          disabled={createUserMutation.isPending}
                          data-testid="button-create-manager"
                        >
                          {createUserMutation.isPending ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
                          ) : (
                            "Create Manager"
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          Manager Created Successfully
                        </DialogTitle>
                        <DialogDescription>
                          Copy the credentials below or send them directly to the new manager.
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

              {/* Bulk Add Reps Dialog */}
              <Dialog open={isBulkAddOpen} onOpenChange={(open) => {
                if (!open) closeBulkAddDialog();
                else setIsBulkAddOpen(true);
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2" data-testid="button-bulk-add-reps">
                    <Upload className="w-4 h-4" /> Bulk Add Reps
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                  {!bulkAddResults ? (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Bulk Add Sales Reps
                        </DialogTitle>
                        <DialogDescription>
                          Add multiple sales reps at once. Enter one person per line with their name and email.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 flex-1 overflow-auto">
                        <div className="space-y-2">
                          <Label>Select Manager</Label>
                          <Select value={selectedManagerId} onValueChange={setSelectedManagerId}>
                            <SelectTrigger data-testid="select-manager">
                              <SelectValue placeholder="Choose a manager to assign reps to..." />
                            </SelectTrigger>
                            <SelectContent>
                              {managers.map((mgr) => (
                                <SelectItem key={mgr.id} value={mgr.id}>
                                  {mgr.name} ({mgr.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Rep List</Label>
                          <p className="text-xs text-muted-foreground mb-2">
                            Enter one rep per line. Format: <code className="bg-muted px-1 rounded">Name, email</code> or <code className="bg-muted px-1 rounded">Name email@domain.com</code>
                          </p>
                          <Textarea
                            placeholder={`John Smith, jsmith@geckogreen.com
Jane Doe, jdoe@geckogreen.com
Mike Johnson mjohnson@geckogreen.com`}
                            className="min-h-[200px] font-mono text-sm"
                            value={bulkAddInput}
                            onChange={(e) => setBulkAddInput(e.target.value)}
                            data-testid="textarea-bulk-reps"
                          />
                          <p className="text-xs text-muted-foreground">
                            {parseBulkInput(bulkAddInput).length} valid entries detected
                          </p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="space-y-0.5">
                            <Label htmlFor="send-emails" className="cursor-pointer">Send Welcome Emails</Label>
                            <p className="text-xs text-muted-foreground">
                              Automatically email login credentials to each new rep
                            </p>
                          </div>
                          <Switch
                            id="send-emails"
                            checked={sendWelcomeEmails}
                            onCheckedChange={setSendWelcomeEmails}
                            data-testid="switch-send-emails"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={closeBulkAddDialog}>Cancel</Button>
                        <Button 
                          onClick={handleBulkAdd} 
                          disabled={bulkAddMutation.isPending || !selectedManagerId || parseBulkInput(bulkAddInput).length === 0}
                          className="gap-2"
                          data-testid="button-submit-bulk-add"
                        >
                          {bulkAddMutation.isPending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Adding {parseBulkInput(bulkAddInput).length} reps...</>
                          ) : (
                            <>Add {parseBulkInput(bulkAddInput).length} Reps</>
                          )}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          Bulk Add Complete
                        </DialogTitle>
                        <DialogDescription>
                          {bulkAddResults.success.length} reps created successfully
                          {bulkAddResults.failed.length > 0 && `, ${bulkAddResults.failed.length} failed`}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="flex-1 max-h-[400px] -mx-6 px-6">
                        {bulkAddResults.success.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                              <Check className="w-4 h-4" /> Successfully Created ({bulkAddResults.success.length})
                            </h4>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 space-y-2">
                              {bulkAddResults.success.map((user, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <div>
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-muted-foreground ml-2">{user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <code className="bg-background/50 px-2 py-0.5 rounded text-xs">{user.password}</code>
                                    {user.emailSent && (
                                      <Badge variant="secondary" className="text-xs gap-1">
                                        <Mail className="w-3 h-3" /> Sent
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {bulkAddResults.failed.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> Failed ({bulkAddResults.failed.length})
                            </h4>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 space-y-2">
                              {bulkAddResults.failed.map((user, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <div>
                                    <span className="font-medium">{user.name || "(no name)"}</span>
                                    <span className="text-muted-foreground ml-2">{user.email || "(no email)"}</span>
                                  </div>
                                  <span className="text-red-600 text-xs">{user.reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </ScrollArea>
                      <DialogFooter className="flex-row gap-2">
                        <Button variant="outline" onClick={downloadResultsCSV} className="gap-2" data-testid="button-download-results">
                          <Download className="w-4 h-4" /> Download CSV
                        </Button>
                        <Button onClick={closeBulkAddDialog} data-testid="button-done-bulk">
                          Done
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <Card className="overflow-hidden border-border/60">
              {managersLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Loading managers...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredManagers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No managers found. Add your first manager above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredManagers.map((mgr) => (
                        <TableRow key={mgr.id} data-testid={`row-manager-${mgr.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {mgr.warriorAvatar || mgr.profilePhoto ? (
                                <img 
                                  src={mgr.warriorAvatar || mgr.profilePhoto || ""} 
                                  alt={mgr.name}
                                  className="h-9 w-9 rounded-full object-cover border-2 border-purple-200"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                                  {mgr.avatarInitials}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-medium">{mgr.name}</span>
                                <span className="text-xs text-muted-foreground">{mgr.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={mgr.status === "active" ? "default" : "secondary"}>
                              {mgr.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {mgr.phone || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setRepToDelete(mgr)}
                              data-testid={`button-delete-manager-${mgr.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="reps">
            <Card>
              <CardHeader>
                <CardTitle>All Sales Representatives</CardTitle>
                <CardDescription>Directory of all reps across all teams.</CardDescription>
              </CardHeader>
              <CardContent>
                {repsLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Loading reps...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Rep Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allReps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No sales reps found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        allReps.map((rep) => (
                          <TableRow key={rep.id} data-testid={`row-rep-${rep.id}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {rep.warriorAvatar || rep.profilePhoto ? (
                                  <img 
                                    src={rep.warriorAvatar || rep.profilePhoto || ""} 
                                    alt={rep.name}
                                    className="h-8 w-8 rounded-full object-cover border-2 border-primary/20"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    {rep.avatarInitials}
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <Link href={`/admin/rep/${rep.id}`} className="font-medium hover:text-primary hover:underline cursor-pointer">
                                    {rep.name}
                                  </Link>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={rep.status === "active" ? "default" : "secondary"}>
                                {rep.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{rep.email}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Link href={`/admin/rep/${rep.id}`}>
                                  <Button variant="ghost" size="sm">View Details</Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setRepToResetCredentials(rep)}
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                  data-testid={`button-reset-credentials-${rep.id}`}
                                  title="Reset & Resend Credentials"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setRepToDelete(rep)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                  data-testid={`button-delete-rep-${rep.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Usage & Billing</h3>
                <p className="text-sm text-muted-foreground">Track voice roleplay usage and costs</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowBillingResetDialog(true)}
                data-testid="button-reset-billing"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset Billing Data
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
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
                  <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${usageData?.summary.totalCostDollars || "0.00"}</div>
                  <p className="text-xs text-muted-foreground mt-1">At {usageData?.summary.ratePerMinute || "$0.15"}/min</p>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
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
                <CardTitle>Usage by User</CardTitle>
                <CardDescription>Breakdown of usage and costs per user</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
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
                        const user = [...managers, ...allReps].find(u => u.id === userId);
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
                <CardDescription>Last 20 voice roleplay sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(usageData?.sessions || []).slice(0, 20).map((session) => {
                      const user = [...managers, ...allReps].find(u => u.id === session.userId);
                      const isAuditingThis = singleAuditResult?.sessionId === session.id && singleAuditResult?.loading;
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
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAuditSingleSession(session.id)}
                              disabled={isAuditingThis}
                              data-testid={`button-audit-session-${session.id}`}
                            >
                              {isAuditingThis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Search className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Audit & Reconcile
                </CardTitle>
                <CardDescription>
                  Compare stored usage data against VAPI's actual call records to find and fix discrepancies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleAuditUsage} 
                    disabled={isAuditing}
                    data-testid="button-audit-usage"
                  >
                    {isAuditing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Run Audit
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handlePreviewCleanup} 
                    disabled={isLoadingCleanupPreview}
                    variant="outline"
                    data-testid="button-preview-cleanup"
                  >
                    {isLoadingCleanupPreview ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading Preview...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Preview Cleanup
                      </>
                    )}
                  </Button>
                  {cleanupPreview && cleanupPreview.sessionsCount > 0 && (
                    <Button 
                      onClick={handleCleanupOrphans} 
                      disabled={isCleaningOrphans}
                      variant="destructive"
                      data-testid="button-apply-cleanup"
                    >
                      {isCleaningOrphans ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Apply Cleanup ({cleanupPreview.summary.toFix + cleanupPreview.summary.toCancel} sessions)
                        </>
                      )}
                    </Button>
                  )}
                  {auditResults && auditResults.discrepancies.length > 0 && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={selectAllDiscrepancies}
                        data-testid="button-select-all-discrepancies"
                      >
                        Select All ({auditResults.discrepancies.length})
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleReconcileSelected}
                        disabled={isReconciling || selectedDiscrepancies.size === 0}
                        data-testid="button-reconcile-selected"
                      >
                        {isReconciling ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Reconciling...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Reconcile Selected ({selectedDiscrepancies.size})
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>

                {auditResults && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Sessions Audited</p>
                        <p className="text-2xl font-bold">{auditResults.summary.sessionsAudited}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Discrepancies Found</p>
                        <p className="text-2xl font-bold text-orange-500">{auditResults.summary.discrepanciesFound}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Overcharged Minutes</p>
                        <p className="text-2xl font-bold text-red-500">{auditResults.summary.totalOverchargedMinutes}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Overcharged Amount</p>
                        <p className="text-2xl font-bold text-red-500">${(auditResults.summary.totalOverchargedCents / 100).toFixed(2)}</p>
                      </div>
                    </div>

                    {auditResults.discrepancies.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Fix</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Stored</TableHead>
                            <TableHead>Actual</TableHead>
                            <TableHead>Difference</TableHead>
                            <TableHead>VAPI Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditResults.discrepancies.map((d) => (
                            <TableRow key={d.sessionId} className={selectedDiscrepancies.has(d.sessionId) ? "bg-orange-500/10" : ""}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedDiscrepancies.has(d.sessionId)}
                                  onChange={() => toggleDiscrepancy(d.sessionId)}
                                  className="h-4 w-4"
                                  data-testid={`checkbox-discrepancy-${d.sessionId}`}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{d.userName || d.userId}</div>
                              </TableCell>
                              <TableCell>
                                {new Date(d.sessionDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div>{d.storedBilledMinutes} min</div>
                                <div className="text-xs text-muted-foreground">${(d.storedCostCents / 100).toFixed(2)}</div>
                              </TableCell>
                              <TableCell>
                                <div>{d.actualBilledMinutes} min</div>
                                <div className="text-xs text-muted-foreground">${(d.actualCostCents / 100).toFixed(2)}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={d.differenceMinutes > 0 ? "destructive" : "default"}>
                                  {d.differenceMinutes > 0 ? "+" : ""}{d.differenceMinutes} min
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{d.vapiStatus}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Check className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>No significant discrepancies found. Usage data is accurate.</p>
                      </div>
                    )}

                    {auditResults.errors.length > 0 && (
                      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                        <p className="font-medium mb-2">Errors encountered during audit:</p>
                        <ul className="list-disc list-inside text-sm">
                          {auditResults.errors.slice(0, 5).map((e, i) => (
                            <li key={i}>{e.error} (Call: {e.vapiCallId.slice(0, 8)}...)</li>
                          ))}
                          {auditResults.errors.length > 5 && (
                            <li>...and {auditResults.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {cleanupPreview && cleanupPreview.sessionsCount > 0 && (
                  <div className="space-y-4 mt-6 pt-6 border-t border-orange-500/30">
                    <h4 className="font-semibold flex items-center gap-2 text-orange-500">
                      <AlertTriangle className="h-4 w-4" />
                      Cleanup Preview - {cleanupPreview.sessionsCount} Sessions with Issues
                    </h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-sm text-muted-foreground">Will Fix</p>
                        <p className="text-2xl font-bold text-green-500">{cleanupPreview.summary.toFix}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-500/10 border border-gray-500/20">
                        <p className="text-sm text-muted-foreground">Will Cancel</p>
                        <p className="text-2xl font-bold text-gray-400">{cleanupPreview.summary.toCancel}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-muted-foreground">Current Overcharge</p>
                        <p className="text-2xl font-bold text-red-500">
                          ${(cleanupPreview.summary.costDifference / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cleanupPreview.summary.minutesDifference} minutes
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-sm text-muted-foreground">Actual Cost After Fix</p>
                        <p className="text-2xl font-bold text-blue-500">
                          ${(cleanupPreview.summary.actualTotalCost / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cleanupPreview.summary.actualTotalMinutes} minutes
                        </p>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Issue</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>Actual</TableHead>
                          <TableHead>Difference</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cleanupPreview.sessions.slice(0, 30).map((s) => (
                          <TableRow key={s.sessionId} className={s.action === 'fix' ? 'bg-green-500/5' : s.action === 'cancel' ? 'bg-gray-500/5' : 'bg-red-500/5'}>
                            <TableCell className="font-medium">{s.userName || s.userId.slice(0, 8)}</TableCell>
                            <TableCell className="text-xs">{s.sessionDate ? new Date(s.sessionDate).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                              <Badge variant={s.issue === 'orphaned' ? 'secondary' : 'destructive'}>
                                {s.issue}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-red-500">
                              {s.currentBilledMinutes}min (${(s.currentCostCents / 100).toFixed(2)})
                            </TableCell>
                            <TableCell className="text-green-500">
                              {s.actualBilledMinutes !== null ? `${s.actualBilledMinutes}min ($${((s.actualCostCents || 0) / 100).toFixed(2)})` : '-'}
                            </TableCell>
                            <TableCell className="font-bold">
                              {s.actualBilledMinutes !== null ? (
                                <span className={s.currentBilledMinutes - s.actualBilledMinutes > 0 ? 'text-red-500' : 'text-gray-500'}>
                                  -{s.currentBilledMinutes - s.actualBilledMinutes}min
                                </span>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={s.action === 'fix' ? 'default' : s.action === 'cancel' ? 'secondary' : 'destructive'}>
                                {s.action}
                              </Badge>
                              {s.error && <span className="text-xs text-muted-foreground ml-1">{s.error}</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {cleanupPreview.sessions.length > 30 && (
                      <p className="text-sm text-muted-foreground text-center">
                        Showing 30 of {cleanupPreview.sessions.length} sessions
                      </p>
                    )}
                  </div>
                )}

                {cleanupResults && (
                  <div className="space-y-4 mt-6 pt-6 border-t">
                    <h4 className="font-semibold flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Cleanup Results
                    </h4>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Sessions Processed</p>
                        <p className="text-2xl font-bold">{cleanupResults.summary.sessionsProcessed}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Fixed</p>
                        <p className="text-2xl font-bold text-green-500">{cleanupResults.summary.sessionsFixed}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Cancelled</p>
                        <p className="text-2xl font-bold text-gray-500">{cleanupResults.summary.sessionsCancelled}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Newly Billed</p>
                        <p className="text-2xl font-bold text-blue-500">
                          {cleanupResults.summary.totalMinutesBilled} min (${(cleanupResults.summary.totalCostCents / 100).toFixed(2)})
                        </p>
                      </div>
                    </div>
                    {cleanupResults.results.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Session</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Cost</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cleanupResults.results.slice(0, 20).map((r) => (
                            <TableRow key={r.sessionId}>
                              <TableCell className="font-mono text-xs">{r.sessionId.slice(0, 8)}...</TableCell>
                              <TableCell>
                                <Badge variant={r.action === 'fixed' ? 'default' : r.action === 'cancelled' ? 'secondary' : 'destructive'}>
                                  {r.action}
                                </Badge>
                              </TableCell>
                              <TableCell>{r.durationSeconds ? `${Math.round(r.durationSeconds)}s` : '-'}</TableCell>
                              <TableCell>{r.costCents ? `$${(r.costCents / 100).toFixed(2)}` : '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Administrators
                  </CardTitle>
                  <CardDescription>
                    Manage admin and director accounts with full system access.
                  </CardDescription>
                </div>
                <Dialog open={isAddAdminOpen} onOpenChange={(open) => {
                  setIsAddAdminOpen(open);
                  if (!open) {
                    setNewAdmin({ name: "", email: "", phone: "", role: "director" });
                    setAdminCredentials(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-admin">
                      <UserPlus className="w-4 h-4 mr-2" /> Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{adminCredentials ? "Admin Created Successfully" : "Add New Admin/Director"}</DialogTitle>
                      <DialogDescription>
                        {adminCredentials 
                          ? `${adminCredentials.name} has been created. Copy or send the credentials below.`
                          : "Create a new administrator or director account with full system access. A secure password will be auto-generated."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    {!adminCredentials ? (
                      <>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="admin-name">Full Name</Label>
                            <Input 
                              id="admin-name" 
                              placeholder="John Smith" 
                              value={newAdmin.name} 
                              onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                              data-testid="input-admin-name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="admin-email">Email</Label>
                            <Input 
                              id="admin-email" 
                              type="email" 
                              placeholder="john@company.com" 
                              value={newAdmin.email}
                              onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                              data-testid="input-admin-email"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="admin-phone">Phone (optional)</Label>
                            <Input 
                              id="admin-phone" 
                              type="tel" 
                              placeholder="+1 (555) 123-4567" 
                              value={newAdmin.phone}
                              onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                              data-testid="input-admin-phone"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="admin-role">Role</Label>
                            <Select value={newAdmin.role} onValueChange={(value: "director" | "admin") => setNewAdmin({...newAdmin, role: value})}>
                              <SelectTrigger data-testid="select-admin-role">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="director">Director</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            onClick={handleAddAdmin} 
                            disabled={createUserMutation.isPending || !newAdmin.name || !newAdmin.email}
                            data-testid="button-submit-admin"
                          >
                            {createUserMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                              </>
                            ) : (
                              "Create Admin"
                            )}
                          </Button>
                        </DialogFooter>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4 py-4">
                          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                              <Check className="h-4 w-4" />
                              Account Created
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Share these credentials with the new admin. They can change their password after logging in.
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase font-medium">Email</p>
                                <p className="font-mono text-sm">{adminCredentials.email}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard(adminCredentials.email, "Email")}
                                data-testid="button-copy-admin-email"
                              >
                                {copiedField === "Email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground uppercase font-medium">Password</p>
                                <p className="font-mono text-sm font-bold">{adminCredentials.password}</p>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard(adminCredentials.password, "Password")}
                                data-testid="button-copy-admin-password"
                              >
                                {copiedField === "Password" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setAdminCredentials(null);
                            }}
                            data-testid="button-add-another-admin"
                          >
                            Add Another
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsAddAdminOpen(false);
                              setAdminCredentials(null);
                            }}
                            data-testid="button-done-admin"
                          >
                            Done
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Admins and directors have full access to all features including user management, billing, and system settings.
                </p>
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  To view existing admins, check the Managers & Teams tab where directors are also displayed.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  System configuration and status information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Training content and roleplay configurations are automatically synchronized on server startup. No manual intervention is required.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Auto-sync enabled
                  </div>
                </div>
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

      <Dialog open={showBillingResetDialog} onOpenChange={closeBillingResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Reset Billing Data
            </DialogTitle>
            <DialogDescription>
              {billingResetStep === 'request' 
                ? "This will permanently delete all usage sessions and reset billing to zero. A verification code will be sent to tabish@gigarev.com."
                : "Enter the 4-digit verification code sent to tabish@gigarev.com to confirm the reset."}
            </DialogDescription>
          </DialogHeader>
          
          {billingResetStep === 'request' ? (
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-sm">
                <p className="font-semibold text-red-700 dark:text-red-400">Warning: This action cannot be undone.</p>
                <p className="text-red-600 dark:text-red-500 mt-1">All usage sessions and billing history will be permanently deleted.</p>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="reset-code" className="text-center">Verification Code</Label>
                <Input
                  id="reset-code"
                  type="text"
                  maxLength={4}
                  value={billingResetCode}
                  onChange={(e) => setBillingResetCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-32 text-center text-2xl tracking-[0.5em] font-mono"
                  placeholder="0000"
                  data-testid="input-reset-code"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={closeBillingResetDialog} data-testid="button-reset-cancel">
              Cancel
            </Button>
            {billingResetStep === 'request' ? (
              <Button 
                variant="destructive" 
                onClick={handleRequestBillingReset}
                disabled={requestingReset}
                data-testid="button-send-code"
              >
                {requestingReset ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={handleConfirmBillingReset}
                disabled={confirmingReset || billingResetCode.length !== 4}
                data-testid="button-confirm-reset"
              >
                {confirmingReset ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Confirm Reset
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!repToDelete} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete {repToDelete?.role === 'manager' ? 'Manager' : 'Sales Rep'}
            </DialogTitle>
            <DialogDescription>
              {repToDelete?.name} ({repToDelete?.email})
            </DialogDescription>
          </DialogHeader>

          {deleteStep === 'choose' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose how you want to delete this {repToDelete?.role === 'manager' ? 'manager' : 'sales rep'}:
              </p>
              
              {repToDelete?.role === 'manager' && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => setDeleteStep('reassign')}
                  disabled={deletingRep}
                  data-testid="button-reassign-reps"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Reassign Reps First</p>
                    <p className="text-xs text-muted-foreground">Move their team to another manager before deleting</p>
                  </div>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={handleSoftDelete}
                disabled={deletingRep}
                data-testid="button-soft-delete"
              >
                {deletingRep ? <Loader2 className="h-5 w-5 animate-spin" /> : <Archive className="h-5 w-5 text-amber-500" />}
                <div className="text-left">
                  <p className="font-medium">Soft Delete (Archive)</p>
                  <p className="text-xs text-muted-foreground">Remove from active users but keep all their data</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 border-destructive/50 hover:border-destructive"
                onClick={handleRequestHardDelete}
                disabled={deletingRep || requestingHardDelete}
                data-testid="button-hard-delete"
              >
                {requestingHardDelete ? <Loader2 className="h-5 w-5 animate-spin" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                <div className="text-left">
                  <p className="font-medium text-destructive">Hard Delete (Permanent)</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete user{repToDelete?.role === 'manager' ? ', their team,' : ''} and all usage data
                  </p>
                </div>
              </Button>
            </div>
          )}

          {deleteStep === 'reassign' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a manager to reassign all reps from {repToDelete?.name} to:
              </p>
              <Select value={reassignToManagerId} onValueChange={setReassignToManagerId}>
                <SelectTrigger data-testid="select-reassign-manager">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.filter(m => m.id !== repToDelete?.id).map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeleteStep('choose')} disabled={deletingRep}>
                  Back
                </Button>
                <Button 
                  onClick={handleReassignReps} 
                  disabled={!reassignToManagerId || deletingRep}
                  data-testid="button-confirm-reassign"
                >
                  {deletingRep ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Reassign Reps
                </Button>
              </div>
            </div>
          )}

          {deleteStep === 'hard-verify' && (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <p className="text-sm font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Permanent Deletion Warning
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This will permanently delete {repToDelete?.name}
                  {repToDelete?.role === 'manager' && hardDeleteRepCount > 0 && (
                    <>, their {hardDeleteRepCount} team member{hardDeleteRepCount > 1 ? 's' : ''}</>
                  )}
                  , and all associated usage data. This cannot be undone.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hard-delete-code">Enter 4-digit verification code</Label>
                <Input
                  id="hard-delete-code"
                  placeholder="Enter code from email"
                  value={hardDeleteCode}
                  onChange={(e) => setHardDeleteCode(e.target.value)}
                  maxLength={4}
                  data-testid="input-hard-delete-code"
                />
                <p className="text-xs text-muted-foreground">Code sent to tabish@gigarev.com (expires in 10 minutes)</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeleteStep('choose')} disabled={deletingRep}>
                  Back
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleConfirmHardDelete} 
                  disabled={hardDeleteCode.length !== 4 || deletingRep}
                  data-testid="button-confirm-hard-delete"
                >
                  {deletingRep ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Permanently Delete
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-start">
            <Button variant="ghost" onClick={closeDeleteDialog} disabled={deletingRep} data-testid="button-delete-cancel">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!singleAuditResult && !singleAuditResult.loading} onOpenChange={(open) => !open && setSingleAuditResult(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Session Audit Result
            </DialogTitle>
            {singleAuditResult?.data && (
              <DialogDescription>
                {singleAuditResult.data.session.userName || singleAuditResult.data.session.userId} - {new Date(singleAuditResult.data.session.sessionDate).toLocaleString()}
              </DialogDescription>
            )}
          </DialogHeader>

          {singleAuditResult?.error ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 font-medium">Error fetching VAPI data</p>
              <p className="text-sm text-red-600 dark:text-red-500 mt-1">{singleAuditResult.error}</p>
            </div>
          ) : singleAuditResult?.data ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {singleAuditResult.data.hasDiscrepancy ? (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Discrepancy Found
                  </Badge>
                ) : (
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    No Issues
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">VAPI Status: {singleAuditResult.data.actual.vapiStatus}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">Stored (Our DB)</h4>
                  <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 space-y-1">
                    <p><span className="text-muted-foreground">Duration:</span> {singleAuditResult.data.stored.durationSeconds}s</p>
                    <p><span className="text-muted-foreground">Billed:</span> {singleAuditResult.data.stored.billedMinutes} min</p>
                    <p><span className="text-muted-foreground">Cost:</span> ${(singleAuditResult.data.stored.costCents / 100).toFixed(2)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">Actual (VAPI)</h4>
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 space-y-1">
                    <p><span className="text-muted-foreground">Duration:</span> {singleAuditResult.data.actual.durationSeconds}s</p>
                    <p><span className="text-muted-foreground">Billed:</span> {singleAuditResult.data.actual.billedMinutes} min</p>
                    <p><span className="text-muted-foreground">Cost:</span> ${(singleAuditResult.data.actual.costCents / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {singleAuditResult.data.hasDiscrepancy && (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-3">
                  <p className="font-medium text-yellow-700 dark:text-yellow-400">
                    Overcharged by {singleAuditResult.data.difference.minutes} min (${(singleAuditResult.data.difference.costCents / 100).toFixed(2)})
                  </p>
                </div>
              )}

              {singleAuditResult?.fixError && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  <p className="font-medium text-red-700 dark:text-red-400">Fix failed: {singleAuditResult.fixError}</p>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSingleAuditResult(null)} disabled={singleAuditResult?.fixing} data-testid="button-audit-close">
              Close
            </Button>
            {singleAuditResult?.data?.hasDiscrepancy && (
              <Button 
                onClick={handleFixSingleSession} 
                className="bg-green-600 hover:bg-green-700" 
                disabled={singleAuditResult?.fixing}
                data-testid="button-audit-fix"
              >
                {singleAuditResult?.fixing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {singleAuditResult?.fixing ? "Fixing..." : "Fix This Session"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!repToResetCredentials} onOpenChange={(open) => !open && closeResetDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              Reset & Resend Credentials
            </DialogTitle>
            <DialogDescription>
              {repToResetCredentials?.name} ({repToResetCredentials?.email})
            </DialogDescription>
          </DialogHeader>

          {!resetCredentialsResult ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will generate a new password for this user and send them an email with their login credentials.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  The current password will be immediately replaced. Make sure the user knows to check their email.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Password Reset Successfully</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={resetCredentialsResult.password} 
                    readOnly 
                    className="font-mono"
                    data-testid="input-reset-password"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(resetCredentialsResult.password);
                      toast({ title: "Copied", description: "Password copied to clipboard" });
                    }}
                    data-testid="button-copy-reset-password"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {resetCredentialsResult.emailSent ? (
                  <>
                    <Mail className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">Email sent to {repToResetCredentials?.email}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-600 dark:text-amber-400">
                      {resetCredentialsResult.emailError || "Email delivery pending"}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {!resetCredentialsResult ? (
              <>
                <Button variant="ghost" onClick={closeResetDialog} disabled={resettingCredentials}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleResetCredentials} 
                  disabled={resettingCredentials}
                  data-testid="button-confirm-reset-credentials"
                >
                  {resettingCredentials ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset & Send Email
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={closeResetDialog} data-testid="button-close-reset-dialog">
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
