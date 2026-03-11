import { motion } from "framer-motion";
import { Shield, MessageSquare, TrendingUp, Lock, User, CheckCircle, XCircle } from "lucide-react";
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
  hasPassed?: boolean;
  permanentlyFailed?: boolean;
}

export function RoleplayCard({ scenario, index, isLocked = false, hasPassed = false, permanentlyFailed = false }: RoleplayCardProps) {
  const difficultyColor = scenario.difficulty === 'Beginner' ? "bg-green-500/15 text-green-600 dark:text-green-400" :
    scenario.difficulty === 'Intermediate' ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
    "bg-red-500/15 text-red-600 dark:text-red-400";

  if (permanentlyFailed) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-card border border-red-500/20 h-full flex flex-col opacity-75 cursor-not-allowed">
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-red-500">No Attempts Left</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0 grayscale">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><User className="w-5 h-5 text-muted-foreground" /></div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-foreground/50 truncate">{scenario.name}</h3>
            <p className="text-xs text-muted-foreground/50 truncate">{scenario.role}</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasPassed) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-card border border-green-500/30 h-full flex flex-col cursor-default" data-testid={`card-roleplay-passed-${scenario.id}`}>
        <div className="flex items-center gap-3 p-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-500/20"><User className="w-5 h-5 text-green-500" /></div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm truncate">{scenario.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{scenario.role}</p>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded-md shrink-0">Passed</span>
        </div>
        <p className="text-xs text-muted-foreground px-4 pb-3 line-clamp-2">{scenario.description}</p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-card border border-dashed border-muted-foreground/20 h-full flex flex-col opacity-60 cursor-not-allowed">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-foreground/50 truncate">{scenario.name}</h3>
            <p className="text-xs text-muted-foreground/50">Locked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/chat/${scenario.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-border hover:border-magenta/40 transition-all duration-200 shadow-sm hover:shadow-md h-full flex flex-col"
        data-testid={`card-roleplay-${scenario.id}`}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-border group-hover:ring-magenta/30 transition-all">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-magenta/10"><User className="w-5 h-5 text-magenta/60" /></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm group-hover:text-magenta transition-colors truncate">{scenario.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{scenario.role}</p>
          </div>
          <span className={cn("text-[10px] font-semibold px-2 py-1 rounded-md shrink-0", difficultyColor)}>
            {scenario.difficulty}
          </span>
        </div>
        
        <p className="text-xs text-muted-foreground px-4 pb-3 line-clamp-2 flex-1">{scenario.description}</p>

        <div className="px-4 pb-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-muted-foreground" />
              <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-magenta/60 rounded-full" style={{ width: `${scenario.stats.resistance}%` }} />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${scenario.stats.objections}%` }} />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${scenario.stats.buy_signal}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-magenta transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </motion.div>
    </Link>
  );
}
