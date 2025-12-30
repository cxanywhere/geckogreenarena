import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, ArrowRight, Lock, GraduationCap } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_gecko_green_cybernetics.png";
import geckoLogo from "@assets/image_1766975682051.png";
import arenaLogo from "@assets/generated_images/superhero_style_logo_for_arena_ai.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 z-10 bg-white/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <img src={arenaLogo} alt="Arena AI" className="h-10 w-10 object-contain drop-shadow-md" />
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                arena ai<span className="font-normal opacity-80"> by gigarev</span>
              </span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white rounded-2xl border border-primary/10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-24 h-24 text-primary rotate-12" />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Authorized Workspace For</p>
            <img src={geckoLogo} alt="GeckoGreen" className="h-16 w-auto object-contain mb-2" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Sales Rep Access
            </h1>
            <p className="text-muted-foreground">
              Enter your GeckoGreen credentials to enter the Arena.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="paul.wilkerson@geckogreen.ai" 
                className="h-12 bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="h-12 bg-white/50 border-primary/20 focus:border-primary focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-primary/50 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" />
              <Label htmlFor="remember" className="font-normal text-muted-foreground">
                Remember this device for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-display text-5xl font-bold mb-6 leading-tight">
              Premier Lawn Care <br />
              <span className="text-green-300">Sales Enablement</span>
            </h2>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              Master your pitch with Arena AI by GigaRev. The advanced roleplay platform built exclusively for Gecko Green sales professionals to practice, refine, and close more deals.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
