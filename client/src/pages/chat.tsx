import { useRoute, Link } from "wouter";
import { Nav } from "@/components/nav";
import { ChatInterface } from "@/components/chat-interface";
import { ROLEPLAYS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, MessageSquare, TrendingUp } from "lucide-react";

export default function ChatPage() {
  const [, params] = useRoute("/chat/:id");
  const scenario = ROLEPLAYS.find(c => c.id === params?.id);

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Scenario Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Arena
          </Button>
        </Link>
        
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Character Stats Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm sticky top-24">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted">
                <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-1">{scenario.name}</h2>
              <p className="text-primary font-mono text-sm mb-4">{scenario.role}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">RESISTANCE</span>
                    <span className="font-bold">{scenario.stats.resistance}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${scenario.stats.resistance}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">OBJECTIONS</span>
                    <span className="font-bold">{scenario.stats.objections}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${scenario.stats.objections}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">BUY SIGNAL</span>
                    <span className="font-bold">{scenario.stats.buy_signal}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${scenario.stats.buy_signal}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-bold text-sm mb-3">KEY SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {scenario.traits.map(t => (
                    <span key={t} className="text-xs bg-muted px-2 py-1 rounded border border-border/50 text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-9">
            <ChatInterface scenario={scenario} />
          </div>
        </div>
      </div>
    </div>
  );
}
