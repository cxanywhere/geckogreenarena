import { Character } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Brain, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface CharacterCardProps {
  character: Character;
  index: number;
}

export function CharacterCard({ character, index }: CharacterCardProps) {
  return (
    <Link href={`/chat/${character.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/10 h-full flex flex-col"
      >
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <motion.img
            src={character.avatar}
            alt={character.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-3 left-4 z-20">
            <span className="inline-block px-2 py-1 mb-1 text-xs font-mono font-medium text-primary bg-white/90 rounded-md backdrop-blur-sm">
              {character.role}
            </span>
            <h3 className="text-xl font-display font-bold text-white tracking-wide">
              {character.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow bg-card">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {character.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-border/50">
            <div className="flex flex-col items-center gap-1">
              <Brain className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">INT</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${character.stats.intelligence}%` }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Zap className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">PWR</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${character.stats.power}%` }} 
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Activity className="w-4 h-4 text-primary/70" />
              <span className="text-xs font-mono text-muted-foreground">SPD</span>
              <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${character.stats.speed}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-2 flex-wrap">
            {character.traits.map((trait) => (
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
