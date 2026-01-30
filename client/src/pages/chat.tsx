import { useRoute, Link, useLocation, useSearch } from "wouter";
import { Nav } from "@/components/nav";
import { VoiceRoleplay } from "@/components/VoiceRoleplay";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Info, Loader2, User, Mic, History, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, Roleplay } from "@/lib/api";
import { RoleplayAttemptHistory } from "@/components/roleplay-attempt-history";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VapiConfig {
  id: string;
  name: string;
  role: string;
  phase: string;
  context: string;
  objection: string;
  passCriteria: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resistanceLevel: number;
  buySignal: number;
  traits: string[];
}

export default function ChatPage() {
  const [, params] = useRoute("/chat/:id");
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const returnTo = searchParams.get("returnTo");
  const returnPage = searchParams.get("returnPage");
  const roleplayId = params?.id;
  const [showHistory, setShowHistory] = useState(false);
  
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : { id: "guest", name: "Guest User", email: "guest@test.com" };

  const { data: scenario, isLoading, error } = useQuery<Roleplay>({
    queryKey: ["roleplay", roleplayId],
    queryFn: () => api.getRoleplay(roleplayId!),
    enabled: !!roleplayId,
  });

  const { data: vapiConfig, isLoading: isLoadingConfig } = useQuery<VapiConfig>({
    queryKey: ["vapi-config", roleplayId],
    queryFn: async () => {
      const res = await fetch(`/api/vapi/config/${roleplayId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!roleplayId,
  });

  const { data: roleplayHistory = {} } = useQuery({
    queryKey: ["roleplay-history", user?.id],
    queryFn: () => api.getUserRoleplayHistory(user!.id),
    enabled: !!user?.id && user.id !== "guest",
    staleTime: 0,
    refetchOnMount: 'always' as const,
  });

  const thisRoleplayHistory = roleplayId && roleplayHistory[roleplayId] 
    ? { [roleplayId]: roleplayHistory[roleplayId] } 
    : {};
  
  const attemptInfo = roleplayId ? roleplayHistory[roleplayId] : null;
  const attemptNumber = attemptInfo && typeof attemptInfo === 'object' ? attemptInfo.totalAttempts + 1 : 1;
  const remainingAttempts = attemptInfo && typeof attemptInfo === 'object' ? attemptInfo.remainingAttempts : 3;

  const handleVoiceComplete = (callId: string) => {
    let resultsUrl = `/results/${roleplayId}?callId=${callId}&mode=voice`;
    if (returnTo) {
      resultsUrl += `&returnTo=${encodeURIComponent(returnTo)}`;
      if (returnPage) {
        resultsUrl += `&returnPage=${returnPage}`;
      }
    }
    setLocation(resultsUrl);
  };

  const handleVoiceCancel = () => {
    if (returnTo) {
      setLocation(returnTo);
    } else {
      setLocation("/dashboard");
    }
  };

  if (isLoading || isLoadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (error || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Scenario Not Found</h1>
          <Link href="/dashboard">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!vapiConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <Mic className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Voice Roleplay Not Available</h1>
          <p className="text-muted-foreground mb-6">This scenario doesn't have voice configuration yet.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if roleplay is locked or already passed
  const isLocked = attemptInfo && typeof attemptInfo === 'object' && attemptInfo.permanentlyFailed;
  const isPassed = attemptInfo && typeof attemptInfo === 'object' && attemptInfo.hasPassed;

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Roleplay Locked</h1>
          <p className="text-muted-foreground mb-2">You have used all 3 attempts for "{scenario.name}" and did not pass.</p>
          <p className="text-muted-foreground mb-6">This roleplay is now locked. Focus on other roleplays in your training path.</p>
          <Link href={returnTo || "/dashboard"}>
            <Button>Return to Training</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isPassed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-foreground">Roleplay Completed!</h1>
          <p className="text-muted-foreground mb-2">You've already passed "{scenario.name}".</p>
          <p className="text-muted-foreground mb-6">Move on to the next roleplay in your certification path.</p>
          <Link href={returnTo || "/dashboard"}>
            <Button>Continue Training</Button>
          </Link>
        </div>
      </div>
    );
  }

  const ScenarioStats = () => (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted flex items-center justify-center">
        {scenario.avatar ? (
          <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <h2 className="text-xl font-display font-bold mb-1 text-foreground">"{scenario.name}"</h2>
      <p className="text-primary font-mono text-sm mb-2">{scenario.role}</p>
      
      {attemptInfo && typeof attemptInfo === 'object' && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${
          attemptInfo.hasPassed 
            ? 'bg-green-500/10 text-green-500' 
            : attemptInfo.permanentlyFailed
              ? 'bg-red-500/10 text-red-500'
              : remainingAttempts === 1
                ? 'bg-amber-500/10 text-amber-500'
                : 'bg-muted text-muted-foreground'
        }`}>
          <span className="text-xs font-medium">
            {attemptInfo.hasPassed 
              ? 'Passed' 
              : attemptInfo.permanentlyFailed
                ? 'No attempts left'
                : `Attempt ${attemptNumber} of 3`
            }
          </span>
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mb-4">{scenario.description}</p>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">RESISTANCE</span>
            <span className="font-bold text-foreground">{scenario.stats.resistance}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${scenario.stats.resistance}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">OBJECTIONS</span>
            <span className="font-bold text-foreground">{scenario.stats.objections}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${scenario.stats.objections}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">BUY SIGNAL</span>
            <span className="font-bold text-foreground">{scenario.stats.buy_signal}</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${scenario.stats.buy_signal}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-bold text-sm mb-3 text-foreground">KEY SKILLS</h3>
        <div className="flex flex-wrap gap-2">
          {scenario.traits.map(t => (
            <span key={t} className="text-xs bg-muted px-2 py-1 rounded border border-border/50 text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>

      {Object.keys(thisRoleplayHistory).length > 0 && (
        <Collapsible open={showHistory} onOpenChange={setShowHistory}>
          <CollapsibleTrigger asChild>
            <button className="w-full mt-6 pt-6 border-t border-border flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors">
              <span className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Past Attempts ({attemptInfo && typeof attemptInfo === 'object' ? attemptInfo.totalAttempts : 0})
              </span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <RoleplayAttemptHistory 
              history={thisRoleplayHistory}
              showRoleplayHeader={false}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-muted/20 flex flex-col">
      <Nav />
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 md:py-8 flex-1 flex flex-col landscape:py-2">
        <div className="flex items-center justify-between mb-2 sm:mb-4 md:mb-6 landscape:mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Back to Arena</span><span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#84CC16]/10 rounded-full">
              <Mic className="h-4 w-4 text-[#2D5016]" />
              <span className="text-xs font-medium text-[#2D5016]">Voice Roleplay</span>
            </div>

            <div className="lg:hidden landscape:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="h-4 w-4" /> <span className="hidden sm:inline">Scenario Info</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
                  <div className="mt-6">
                    <ScenarioStats />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 flex-1 landscape:gap-3">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <ScenarioStats />
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col h-full">
            <VoiceRoleplay
              roleplayId={roleplayId!}
              config={vapiConfig}
              onComplete={handleVoiceComplete}
              onCancel={handleVoiceCancel}
              userId={user?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
