import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ArrowRight, Lock, GraduationCap, Briefcase, ShieldCheck } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_gecko_green_cybernetics.png";
import geckoLogo from "@assets/image_1766975682051.png";
import arenaLogo from "@assets/generated_images/superhero_style_logo_for_arena_ai.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("rep");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      if (role === "manager") {
        setLocation("/manager-dashboard");
      } else if (role === "admin") {
        setLocation("/admin-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 z-10 bg-card/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src={arenaLogo} alt="Arena AI" className="h-10 w-10 object-contain drop-shadow-md" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                  arena ai
                </span>
                <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">by gigarev</span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-card rounded-2xl border border-border shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-primary rotate-12" />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Authorized Workspace For</p>
            <div className="bg-white/90 p-2 rounded-lg inline-block">
               <img src={geckoLogo} alt="GeckoGreen" className="h-12 w-auto object-contain" />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue.
            </p>
          </div>

          <Tabs defaultValue="rep" value={role} onValueChange={setRole} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="rep" className="text-xs sm:text-sm">Sales Rep</TabsTrigger>
              <TabsTrigger value="manager" className="text-xs sm:text-sm">Manager</TabsTrigger>
              <TabsTrigger value="admin" className="text-xs sm:text-sm">Director</TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={
                      role === "rep" ? "paul.wilkerson@geckogreen.ai" : 
                      role === "manager" ? "sarah.jenkins@geckogreen.ai" : 
                      "robert.fox@geckogreen.ai"
                    }
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 bg-background border-input focus:border-primary focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="remember" className="font-normal text-muted-foreground cursor-pointer">
                  Remember this device for 30 days
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
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
          </Tabs>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an access key?{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Request access
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:block relative bg-primary/5">
        <div className="absolute inset-0 z-0">
           <img 
             src={heroBg} 
             alt="GeckoGreen Abstract" 
             className="w-full h-full object-cover mix-blend-overlay opacity-80" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/20 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-24 text-white">
          <div className="flex justify-end">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm font-mono">
              <Lock className="w-3 h-3" />
              GECKO GREEN TRAINING PORTAL
            </div>
          </div>
          
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-5xl font-bold mb-6 leading-tight">
              {role === "rep" && (
                <>
                  Premier Lawn Care <br />
                  <span className="text-green-300">Sales Enablement</span>
                </>
              )}
              {role === "manager" && (
                <>
                  Team Performance <br />
                  <span className="text-green-300">Management</span>
                </>
              )}
              {role === "admin" && (
                <>
                  Organization <br />
                  <span className="text-green-300">Administration</span>
                </>
              )}
            </h2>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              {role === "rep" && "Master your pitch with Arena AI. The advanced roleplay platform built exclusively for Gecko Green sales professionals."}
              {role === "manager" && "Oversee your team's progress, assign training modules, and track certification status in real-time."}
              {role === "admin" && "Manage organization-wide settings, billing, and high-level performance metrics for the entire sales force."}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
