import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, BookOpen, Mic, Shield, Award } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import arenaHelmetDark from "@/assets/arena-helmet-dark.png";
import iconChapter from "@/assets/icon-chapter.png";
import iconRoleplay from "@/assets/icon-roleplay.png";
import iconBattlecard from "@/assets/icon-battlecard.png";
import iconCert from "@/assets/icon-cert.png";

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
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

  const features = [
    { icon: iconChapter, label: "3 Training Chapters", desc: "Comprehensive LMS sales curriculum" },
    { icon: iconRoleplay, label: "18 AI Roleplays", desc: "Practice with realistic buyer personas" },
    { icon: iconBattlecard, label: "10 Battlecards", desc: "Handle any objection with confidence" },
    { icon: iconCert, label: "Sales Certification", desc: "Earn your LMS sales credential" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans overflow-hidden">
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-10 flex items-center gap-2.5">
            <img src={arenaHelmetDark} alt="Arena AI" className="h-10 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-wide text-foreground">Arena AI</span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">by GigaRev</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isReturningUser ? "Welcome back" : "Welcome"}
            </h1>
            <p className="text-muted-foreground">
              Sign in to your LinkedIn Marketing Solutions training platform.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@linkedin.com" 
                className="h-11 bg-white border-border focus:border-foreground focus:ring-foreground/10 text-foreground placeholder:text-muted-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                className="h-11 bg-white border-border focus:border-foreground focus:ring-foreground/10 text-foreground placeholder:text-muted-foreground"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-border data-[state=checked]:bg-foreground data-[state=checked]:text-background" />
              <Label htmlFor="remember" className="font-normal text-sm text-muted-foreground cursor-pointer">
                Remember this device for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Signing in...
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

      <div className="hidden lg:flex flex-col justify-center bg-[#faf8f5] border-l border-border p-16 xl:p-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Authorized Workspace</p>
          <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-3 leading-tight">
            LinkedIn Marketing Solutions<br />
            Sales Enablement
          </h2>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed mb-10">
            Master your pitch with AI-powered training. Built exclusively for LMS sales professionals.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
              >
                <img src={f.icon} alt="" className="w-9 h-9 object-contain shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{f.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
