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
  const difficultyColor = scenario.difficulty === 'Beginner' ? "bg-[#f0fdf4] text-[#16a34a]" :
    scenario.difficulty === 'Intermediate' ? "bg-[#fffbeb] text-[#d97706]" :
    "bg-[#fef2f2] text-[#dc2626]";

  if (permanentlyFailed) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-white border border-[#e8e8e5] h-full flex flex-col opacity-60 cursor-not-allowed">
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#fef2f2] border border-[#fecaca]">
            <XCircle className="w-3.5 h-3.5 text-[#dc2626]" />
            <span className="text-xs font-medium text-[#dc2626]">No Attempts Left</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3.5">
          <div className="w-9 h-9 rounded-full bg-[#f7f7f5] overflow-hidden shrink-0 grayscale">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><User className="w-4 h-4 text-[#c4c4c0]" /></div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-[#c4c4c0] truncate">{scenario.name}</h3>
            <p className="text-xs text-[#d4d4d0] truncate">{scenario.role}</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasPassed) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-white border border-[#e8e8e5] h-full flex flex-col" data-testid={`card-roleplay-passed-${scenario.id}`}>
        <div className="flex items-center gap-3 p-3.5">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f0fdf4]"><User className="w-4 h-4 text-[#2ecc71]" /></div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 bg-[#2ecc71] rounded-full p-0.5">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm truncate text-[#37352f]">{scenario.name}</h3>
            <p className="text-xs text-[#787774] truncate">{scenario.role}</p>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#2ecc71] bg-[#f0fdf4] px-2 py-0.5 rounded shrink-0">Passed</span>
        </div>
        <p className="text-xs text-[#787774] px-3.5 pb-3 line-clamp-2">{scenario.description}</p>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-[#fafaf8] border border-dashed border-[#e8e8e5] h-full flex flex-col opacity-50 cursor-not-allowed">
        <div className="flex items-center gap-3 p-3.5">
          <div className="w-9 h-9 rounded-full bg-[#f0f0ed] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-[#c4c4c0]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-[#c4c4c0] truncate">{scenario.name}</h3>
            <p className="text-xs text-[#d4d4d0]">Locked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/chat/${scenario.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.25 }}
        className="group relative cursor-pointer overflow-hidden rounded-lg bg-white border border-[#e8e8e5] hover:border-[#d4d4d0] transition-all duration-200 hover:shadow-sm h-full flex flex-col"
        data-testid={`card-roleplay-${scenario.id}`}
      >
        <div className="flex items-center gap-3 p-3.5">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-[#e8e8e5] group-hover:ring-[#d4d4d0] transition-all">
            {scenario.avatar ? (
              <img src={scenario.avatar} alt={scenario.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f7f7f5]"><User className="w-4 h-4 text-[#787774]" /></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm text-[#37352f] truncate">{scenario.name}</h3>
            <p className="text-xs text-[#787774] truncate">{scenario.role}</p>
          </div>
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded shrink-0", difficultyColor)}>
            {scenario.difficulty}
          </span>
        </div>
        
        <p className="text-xs text-[#787774] px-3.5 pb-3 line-clamp-2 flex-1">{scenario.description}</p>

        <div className="px-3.5 pb-3 pt-2 border-t border-[#f0f0ed]">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#c4c4c0]" />
              <div className="h-1 flex-1 bg-[#f0f0ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#787774] rounded-full" style={{ width: `${scenario.stats.resistance}%` }} />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#c4c4c0]" />
              <div className="h-1 flex-1 bg-[#f0f0ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#d97706] rounded-full" style={{ width: `${scenario.stats.objections}%` }} />
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#c4c4c0]" />
              <div className="h-1 flex-1 bg-[#f0f0ed] rounded-full overflow-hidden">
                <div className="h-full bg-[#2ecc71] rounded-full" style={{ width: `${scenario.stats.buy_signal}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
