import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Nav } from "@/components/nav"; // We'll reuse Nav but might mock a manager state if needed, or just accept it displays Paul for now as we don't have auth context.
// Ideally we'd have a ManagerNav or a prop on Nav, but for this task I'll just use Nav and maybe overlay/replace content if I could, 
// but since I can't easily change Nav props without editing Nav, I'll stick to a custom header for the manager dashboard or just accept the limitation.
// Actually, I'll create a simple Manager Header to replace Nav for this page to look authentic.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SALES_REPS, SalesRep } from "@/lib/mock-data";
import { Plus, Trash2, Bell, Search, MoreHorizontal, UserPlus, Users, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import arenaLogo from "@assets/generated_images/superhero_style_logo_for_arena_ai.png";
import geckoLogo from "@assets/image_1766975682051.png";
import { ModeToggle } from "@/components/mode-toggle";

export default function ManagerDashboard() {
  const [reps, setReps] = useState<SalesRep[]>(SALES_REPS);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRep, setNewRep] = useState({ name: "", email: "" });

  // Filter reps
  const filteredReps = reps.filter(rep => 
    rep.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    rep.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRep = () => {
    if (!newRep.name || !newRep.email) return;
    
    const rep: SalesRep = {
      id: `rep-${Date.now()}`,
      name: newRep.name,
      email: newRep.email,
      status: 'onboarding',
      progress: 0,
      roleplaysCompleted: 0,
      lastActive: "Never",
      avatarInitials: newRep.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase(),
      score: 0
    };

    setReps([...reps, rep]);
    setNewRep({ name: "", email: "" });
    setIsAddOpen(false);
    
    toast({
      title: "Rep Added",
      description: `${rep.name} has been invited to the platform.`,
    });
  };

  const handleRemoveRep = (id: string) => {
    setReps(reps.filter(r => r.id !== id));
    toast({
      title: "Rep Removed",
      description: "User access has been revoked.",
      variant: "destructive"
    });
  };

  const handleRemind = (id: string) => {
    toast({
      title: "Reminder Sent",
      description: "Training reminder email sent to user.",
    });
  };

  // Manager Header Component (inline for simplicity in this file)
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
              <span className="text-sm font-bold leading-none">Sarah Jenkins</span>
              <span className="text-xs text-muted-foreground">Sales Director</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary/20">
              SJ
            </div>
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
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <UserPlus className="w-4 h-4" /> Add New Rep
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Sales Rep</DialogTitle>
                <DialogDescription>
                  Enter the details of the new sales rep to onboard them to the Gecko Green Arena.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="e.g. John Doe" 
                    value={newRep.name} 
                    onChange={(e) => setNewRep({...newRep, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    placeholder="john.doe@geckogreen.ai" 
                    type="email"
                    value={newRep.email}
                    onChange={(e) => setNewRep({...newRep, email: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddRep}>Send Invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Reps</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last week
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Certification Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">81.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5.4% improvement
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Certifications</CardTitle>
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

        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reps..." 
              className="pl-9 bg-card" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Reps Table */}
        <Card className="overflow-hidden border-border/60">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Rep Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReps.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {rep.avatarInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{rep.name}</span>
                        <span className="text-xs text-muted-foreground">{rep.email}</span>
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
                  <TableCell>
                    <div className="w-[60%] space-y-1">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${rep.progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{rep.progress}% Complete</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${
                      rep.score >= 90 ? 'text-green-600' :
                      rep.score >= 80 ? 'text-primary' :
                      rep.score >= 70 ? 'text-yellow-600' : 'text-red-500'
                    }`}>
                      {rep.score > 0 ? `${rep.score}%` : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {rep.lastActive}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleRemind(rep.id)} title="Send Reminder">
                        <Bell className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleRemoveRep(rep.id)} title="Remove User">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}