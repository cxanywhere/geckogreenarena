import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Bell, Search, UserPlus, Users, TrendingUp, AlertCircle, Trash2, Copy, Mail, Phone, Check, Loader2, Activity, BarChart3, DollarSign, LogOut } from "lucide-react";
import arenaLogoDark from "@/assets/arena-logo-dark.png";
import arenaLogoLight from "@/assets/arena-logo-light.png";
import geckoLogo from "@assets/image_1766975682051.png";
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
  managerId?: string | null;
}

interface CreatedCredentials {
  email: string;
  password: string;
  name: string;
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
  const { resolvedTheme } = useTheme();
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };
  const queryClient = useQueryClient();
  
  const arenaLogo = resolvedTheme === "dark" ? arenaLogoDark : arenaLogoLight;

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

  const handleRemoveRep = (id: string) => {
    deleteUserMutation.mutate(id);
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

  const ManagerHeader = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/manager-dashboard">
            <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>arena ai</span>
                <span className="text-[10px] text-foreground/80 font-normal uppercase tracking-wide">Manager Portal</span>
              </div>
            </a>
          </Link>
          <div className="hidden md:flex items-center gap-2 pl-6 border-l border-primary/10">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Client:</span>
            <img src={geckoLogo} alt="GeckoGreen" className="h-8 w-auto object-contain" />
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
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out" data-testid="button-logout">
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
                        placeholder="john.doe@geckogreen.ai" 
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

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="usage">Team Usage</TabsTrigger>
          </TabsList>

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
                    <TableRow key={rep.id} data-testid={`row-rep-${rep.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {rep.avatarInitials}
                          </div>
                          <div className="flex flex-col">
                            <Link href={`/manager/rep/${rep.id}`}>
                              <a className="font-medium hover:text-primary hover:underline transition-colors">{rep.name}</a>
                            </Link>
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
                        <div className="flex justify-end gap-2">
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
                            onClick={() => handleRemoveRep(rep.id)} 
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
    </div>
  );
}
