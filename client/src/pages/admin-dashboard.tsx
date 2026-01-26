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
import { UserPlus, Users, TrendingUp, AlertCircle, Search, Trash2, Shield, DollarSign, Activity, BarChart3, Settings, Copy, Mail, Phone, Check, Loader2, LogOut, Trophy, Award, Target, GraduationCap, Mic, ChevronDown, ChevronUp, Upload, Download, FileText } from "lucide-react";
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

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "", phone: "" });
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", phone: "", role: "director" as "director" | "admin" });
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

  const handleDeleteRep = async () => {
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
        throw new Error(data.error || "Failed to delete rep");
      }
      toast({ title: "Rep deleted", description: `${repToDelete.name} has been removed.` });
      setRepToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["/api/reps"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setDeletingRep(false);
    }
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
        setNewAdmin({ name: "", email: "", phone: "", role: "director" });
        setIsAddAdminOpen(false);
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
                                      <span className="text-sm">{rep.roleplaysPassed}/{rep.roleplaysAttempted}</span>
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
                            <span>{rep.roleplaysPassed}/{rep.roleplaysAttempted}</span>
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
                              onClick={() => handleRemoveManager(mgr.id)}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(usageData?.sessions || []).slice(0, 20).map((session) => {
                      const user = [...managers, ...allReps].find(u => u.id === session.userId);
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
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-admin">
                      <UserPlus className="w-4 h-4 mr-2" /> Add Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Admin/Director</DialogTitle>
                      <DialogDescription>
                        Create a new administrator or director account with full system access. A secure password will be auto-generated.
                      </DialogDescription>
                    </DialogHeader>
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

      <AlertDialog open={!!repToDelete} onOpenChange={(open) => !open && setRepToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sales Rep?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{repToDelete?.name}</span>? 
              This will permanently remove them from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingRep} data-testid="button-delete-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRep} 
              className="bg-red-600 hover:bg-red-700"
              disabled={deletingRep}
              data-testid="button-delete-confirm"
            >
              {deletingRep ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Rep"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
