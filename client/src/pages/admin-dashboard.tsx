import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MANAGERS, Manager, BILLING_STATS, SALES_REPS } from "@/lib/mock-data";
import { UserPlus, Users, TrendingUp, AlertCircle, Search, Trash2, Shield, DollarSign, Activity, BarChart3, Settings } from "lucide-react";
import arenaLogo from "@assets/arena-ai-logo-minimalist.png";
import geckoLogo from "@assets/image_1766975682051.png";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard() {
  const [managers, setManagers] = useState<Manager[]>(MANAGERS);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [newManager, setNewManager] = useState({ name: "", email: "" });

  const filteredManagers = managers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddManager = () => {
    if (!newManager.name || !newManager.email) return;
    
    const mgr: Manager = {
      id: `mgr-${Date.now()}`,
      name: newManager.name,
      email: newManager.email,
      teamSize: 0,
      avgTeamScore: 0,
      topPerformer: "-",
      avatarInitials: newManager.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    };

    setManagers([...managers, mgr]);
    setNewManager({ name: "", email: "" });
    setIsAddManagerOpen(false);
    
    toast({
      title: "Manager Added",
      description: `${mgr.name} has been granted manager access.`,
    });
  };

  const handleRemoveManager = (id: string) => {
    setManagers(managers.filter(m => m.id !== id));
    toast({
      title: "Access Revoked",
      description: "Manager access has been removed.",
      variant: "destructive"
    });
  };

  const AdminHeader = () => (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin-dashboard">
            <a className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
              <img src={arenaLogo} alt="Arena AI" className="h-8 w-8 object-contain" />
              <div className="flex flex-col leading-none">
                <span>arena ai</span>
                <span className="text-[10px] text-destructive font-bold uppercase tracking-wide">Admin / Director Portal</span>
              </div>
            </a>
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

        {/* Billing & Usage Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{BILLING_STATS.totalMinutesUsed.toLocaleString()} min</div>
              <Progress value={(BILLING_STATS.totalMinutesUsed / BILLING_STATS.planLimit) * 100} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((BILLING_STATS.totalMinutesUsed / BILLING_STATS.planLimit) * 100)}% of plan limit
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${BILLING_STATS.projectedCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on ${BILLING_STATS.costPerMinute}/min rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Reps</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{BILLING_STATS.activeUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {managers.length} teams
              </p>
            </CardContent>
          </Card>

           <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Simulations</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{BILLING_STATS.totalRoleplays}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed this month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="managers" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="managers">Managers & Teams</TabsTrigger>
            <TabsTrigger value="reps">All Reps Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="managers" className="space-y-4">
             <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search managers..." 
                  className="pl-9 bg-card" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={isAddManagerOpen} onOpenChange={setIsAddManagerOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="w-4 h-4" /> Add Manager
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Manager</DialogTitle>
                    <DialogDescription>
                      Grant manager access to oversee a sales team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        placeholder="e.g. David Miller" 
                        value={newManager.name} 
                        onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input 
                        placeholder="david.miller@geckogreen.ai" 
                        type="email"
                        value={newManager.email}
                        onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddManagerOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddManager}>Create Manager</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="overflow-hidden border-border/60">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Avg Team Score</TableHead>
                    <TableHead>Top Performer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManagers.map((mgr) => (
                    <TableRow key={mgr.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                            {mgr.avatarInitials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{mgr.name}</span>
                            <span className="text-xs text-muted-foreground">{mgr.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{mgr.teamSize} reps</span>
                        </div>
                      </TableCell>
                      <TableCell>
                         <span className={`font-bold ${
                          mgr.avgTeamScore >= 90 ? 'text-green-600' :
                          mgr.avgTeamScore >= 80 ? 'text-primary' :
                          'text-yellow-600'
                        }`}>
                          {mgr.avgTeamScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{mgr.topPerformer}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => handleRemoveManager(mgr.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="reps">
            <Card>
              <CardHeader>
                <CardTitle>All Sales Representatives</CardTitle>
                <CardDescription>Directory of all reps across all teams.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Reusing the same table structure from Manager Dashboard essentially, simplified here */}
                 <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Rep Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SALES_REPS.map((rep) => (
                      <TableRow key={rep.id}>
                         <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {rep.avatarInitials}
                            </div>
                            <div className="flex flex-col">
                              <Link href={`/manager/rep/${rep.id}`}>
                                <a className="font-medium hover:text-primary hover:underline">{rep.name}</a>
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline">{rep.status}</Badge>
                        </TableCell>
                        <TableCell>{rep.progress}%</TableCell>
                        <TableCell className="font-bold">{rep.score}%</TableCell>
                        <TableCell>
                          <Link href={`/manager/rep/${rep.id}`}>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
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