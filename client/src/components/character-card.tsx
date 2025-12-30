import { motion } from "framer-motion";
import { Shield, MessageSquare, TrendingUp, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface RoleplayScenario {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar?: string;
  traits: string[];
  difficulty: string;
  stats: {
    resistance: number;
    objections: number;
    buy_signal: number;
  };
  chapterId?: string;
}

interface RoleplayCardProps {
  scenario: RoleplayScenario;
  index: number;
  isLocked?: boolean;
}

export function RoleplayCard({ scenario, index, isLocked = false }: RoleplayCardProps) {
  if (isLocked) {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white/50 border border-border h-full flex flex-col grayscale opacity-80 cursor-not-allowed">
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background border border-border shadow-lg">
            <Lock className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chapter Locked</span>
          </div>
        </div>
        {/* Simplified Locked Content */}
        <div className="relative h-48 overflow-hidden bg-muted">
          {scenario.avatar ? (
            <img
              src={scenario.avatar}
              alt={scenario.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
              <User className="w-16 h-16 text-primary/30" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-display font-bold text-foreground/50 tracking-wide mb-2">
            {scenario.name}
          </h3>
          <p className="text-sm text-muted-foreground/50 line-clamp-2">
            {scenario.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/chat/${scenario.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col"
      >
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          {scenario.avatar ? (
            <motion.img
              src={scenario.avatar}
              alt={scenario.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
              <User className="w-20 h-20 text-primary/40" />
            </div>
          )}
          <div className="absolute bottom-3 left-4 z-20">
            <span className={cn(
              "inline-block px-2 py-1 mb-1 text-xs font-mono font-medium rounded-md backdrop-blur-sm",
              scenario.difficulty === 'Beginner' ? "bg-green-500/90 text-white" :
              scenario.difficulty === 'Intermediate' ? "bg-yellow-500/90 text-white" :
              "bg-red-500/90 text-white"
            )}>
              {scenario.difficulty}
            </span>
            <h3 className="text-xl font-display font-bold text-white tracking-wide">
              {scenario.name}
            </h3>
            <p className="text-white/80 text-xs font-medium">{scenario.role}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow bg-card">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {scenario.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/50">
            <div className="flex flex-col items-center gap-1">
              <Shield className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">RES</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${scenario.stats.resistance}%` }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageSquare className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">OBJ</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${scenario.stats.objections}%` }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">BUY</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${scenario.stats.buy_signal}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-2 flex-wrap">
            {scenario.traits.map((trait) => (
              <span 
                key={trait} 
                className="text-[10px] uppercase tracking-wider font-bold text-primary/80 bg-secondary/50 px-2 py-1 rounded-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Effect Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </motion.div>
    </Link>
  );
}
