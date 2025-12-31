import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { ChatInterface } from "@/components/chat-interface";
import { VoiceRoleplay } from "@/components/VoiceRoleplay";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Volume2, Info, Loader2, User, Mic, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, Roleplay } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const roleplayId = params?.id;
  const [mode, setMode] = useState<"voice" | "text">("voice");
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { data: scenario, isLoading, error } = useQuery<Roleplay>({
    queryKey: ["roleplay", roleplayId],
    queryFn: () => api.getRoleplay(roleplayId!),
    enabled: !!roleplayId,
  });

  const { data: vapiConfig } = useQuery<VapiConfig>({
    queryKey: ["vapi-config", roleplayId],
    queryFn: async () => {
      const res = await fetch(`/api/vapi/config/${roleplayId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!roleplayId,
  });

  const handleVoiceComplete = (callId: string) => {
    setLocation(`/results/${roleplayId}?callId=${callId}&mode=voice`);
  };

  const handleVoiceCancel = () => {
    setLocation("/dashboard");
  };

  if (isLoading) {
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <Link href="/">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const ScenarioStats = () => (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full">
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted flex items-center justify-center">
        {scenario.avatar ? (
          <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <h2 className="text-xl font-display font-bold mb-1 text-foreground">"{scenario.name}"</h2>
      <p className="text-primary font-mono text-sm mb-4">{scenario.role}</p>
      
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
    </div>
  );

  const hasVoiceMode = !!vapiConfig;

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
            {hasVoiceMode && (
              <Tabs value={mode} onValueChange={(v) => setMode(v as "voice" | "text")} className="hidden sm:block">
                <TabsList className="h-9">
                  <TabsTrigger value="voice" className="gap-1.5 px-3" data-testid="tab-voice">
                    <Mic className="h-3.5 w-3.5" />
                    <span className="text-xs">Voice</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="gap-1.5 px-3" data-testid="tab-text">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-xs">Text</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

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
            {hasVoiceMode && mode === "voice" && vapiConfig ? (
              <VoiceRoleplay
                roleplayId={roleplayId!}
                config={vapiConfig}
                onComplete={handleVoiceComplete}
                onCancel={handleVoiceCancel}
              />
            ) : (
              <ChatInterface scenario={scenario} userId={user.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
