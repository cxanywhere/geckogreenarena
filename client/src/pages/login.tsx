import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, ArrowRight, Lock, GraduationCap } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import arenaHelmet from "@/assets/arena-helmet.png";
import arenaHelmetDark from "@/assets/arena-helmet-dark.png";
import heroBg from "@/assets/hero-arena-bg.png";
import trophyIcon from "@/assets/trophy-icon.png";
import certBadge from "@/assets/cert-badge.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, isLoading: authLoading } = useAuth();
  
  const isReturningUser = localStorage.getItem("hasLoggedInBefore") === "true";

  useEffect(() => {
    if (!authLoading && user) {
      if (user.status === "onboarding") {
        setLocation("/onboarding");
        return;
      }
      
      if (user.role === "director") {
        setLocation("/admin-dashboard");
      } else if (user.role === "manager") {
        setLocation("/manager-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-magenta/30 border-t-magenta rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { user, authToken } = await api.login(email, password);
      
      login(user, authToken);
      
      if (user.status === "onboarding") {
        setLocation("/onboarding");
        return;
      }
      
      localStorage.setItem("hasLoggedInBefore", "true");
      
      if (user.role === "director") {
        setLocation("/admin-dashboard");
      } else if (user.role === "manager") {
        setLocation("/manager-dashboard");
      } else {
        setLocation("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans overflow-hidden">
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-magenta/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="mb-10 flex items-center gap-3">
            <img src={arenaHelmetDark} alt="Arena AI" className="h-14 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold tracking-wide text-foreground">arena ai</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">by gigarev</span>
            </div>
          </div>

          <div className="mb-8 p-5 rounded-2xl border border-magenta/20 bg-magenta/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-30 transition-opacity">
              <Zap className="w-20 h-20 text-magenta rotate-12" />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Authorized Workspace For</p>
            <span className="text-xl font-bold text-foreground tracking-tight">LinkedIn Marketing Solutions</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              {isReturningUser ? "Welcome Back" : "Welcome"}
            </h1>
            <p className="text-muted-foreground">
              Sign in to your Arena training platform.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@linkedin.com" 
                className="h-12 bg-secondary border-border focus:border-magenta focus:ring-magenta/20 transition-all text-foreground placeholder:text-muted-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <a href="#" className="text-sm font-medium text-magenta hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 bg-secondary border-border focus:border-magenta focus:ring-magenta/20 transition-all text-foreground placeholder:text-muted-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-border data-[state=checked]:bg-magenta data-[state=checked]:text-white" />
              <Label htmlFor="remember" className="font-normal text-muted-foreground cursor-pointer">
                Remember this device for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

        </motion.div>
      </div>

      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/30 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        
        <div className="relative z-10 h-full flex flex-col justify-between p-16 xl:p-24 text-white">
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-mono">
              <Lock className="w-3 h-3" />
              ARENA BY GIGAREV
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-display text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              LinkedIn Marketing Solutions <br />
              <span className="text-glow bg-gradient-to-r from-magenta via-purple-400 to-gold bg-clip-text text-transparent">Sales Enablement</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              Master your pitch with AI-powered training. Arena by GigaRev — built exclusively for LinkedIn Marketing Solutions sales professionals.
            </p>
            
            <div className="flex gap-3 mt-8">
              <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-sm flex items-center gap-2">
                <img src={trophyIcon} alt="" className="w-5 h-5 object-contain" />
                <span className="text-gold font-bold">18</span> <span className="text-white/60">AI Roleplays</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-sm flex items-center gap-2">
                <img src={certBadge} alt="" className="w-5 h-5 object-contain" />
                <span className="text-gold font-bold">4</span> <span className="text-white/60">Buyer Personas</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-sm flex items-center gap-2">
                <span className="text-gold font-bold">10</span> <span className="text-white/60">Battlecards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
