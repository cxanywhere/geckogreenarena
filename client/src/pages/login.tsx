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
        <div className="h-8 w-8 border-4 border-[#e8e8e5] border-t-[#37352f] rounded-full animate-spin" />
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
    { icon: <BookOpen className="w-5 h-5" />, label: "3 Training Chapters", desc: "Comprehensive LMS sales curriculum" },
    { icon: <Mic className="w-5 h-5" />, label: "18 AI Roleplays", desc: "Practice with realistic buyer personas" },
    { icon: <Shield className="w-5 h-5" />, label: "10 Battlecards", desc: "Handle any objection with confidence" },
    { icon: <Award className="w-5 h-5" />, label: "Sales Certification", desc: "Earn your LMS sales credential" },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-sans overflow-hidden">
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-10 flex items-center gap-2.5">
            <img src={arenaHelmetDark} alt="Arena AI" className="h-9 w-auto object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-wide text-[#37352f]">Arena AI</span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-[#787774]">by GigaRev</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1.5">
              {isReturningUser ? "Welcome back" : "Welcome"}
            </h1>
            <p className="text-[#787774] text-[15px]">
              Sign in to your LinkedIn Marketing Solutions training platform.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#37352f] text-sm font-medium">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@linkedin.com" 
                className="h-10 bg-white border-[#e8e8e5] focus:border-[#37352f] focus:ring-[#37352f]/10 text-[#1a1a1a] placeholder:text-[#c4c4c0]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#37352f] text-sm font-medium">Password</Label>
                <a href="#" className="text-sm text-[#787774] hover:text-[#37352f] transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                className="h-10 bg-white border-[#e8e8e5] focus:border-[#37352f] focus:ring-[#37352f]/10 text-[#1a1a1a] placeholder:text-[#c4c4c0]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#d4d4d0] data-[state=checked]:bg-[#37352f] data-[state=checked]:text-white" />
              <Label htmlFor="remember" className="font-normal text-sm text-[#787774] cursor-pointer">
                Remember this device for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 text-sm font-medium bg-[#37352f] text-white hover:bg-[#2f2f2a]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

      <div className="hidden lg:flex flex-col justify-center bg-[#f7f7f5] border-l border-[#e8e8e5] p-16 xl:p-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
        >
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#787774] mb-3">Authorized Workspace</p>
          <h2 className="text-2xl xl:text-3xl font-bold text-[#1a1a1a] mb-2 leading-tight">
            LinkedIn Marketing Solutions<br />
            Sales Enablement
          </h2>
          <p className="text-[#787774] text-[15px] max-w-md leading-relaxed mb-10">
            Master your pitch with AI-powered training. Built exclusively for LMS sales professionals.
          </p>
          
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#e8e8e5] bg-white"
              >
                <div className="w-9 h-9 rounded-md bg-[#f7f7f5] flex items-center justify-center text-[#787774] shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">{f.label}</h3>
                  <p className="text-xs text-[#787774]">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
