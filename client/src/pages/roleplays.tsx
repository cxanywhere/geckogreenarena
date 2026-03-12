import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import {
  Search, Filter, Shield, MessageSquare, TrendingUp,
  User, CheckCircle, XCircle, ChevronRight, Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RoleplayData {
  id: string;
  slug?: string;
  name: string;
  role: string;
  description: string;
  avatar?: string;
  traits: string[];
  difficulty: string;
  stats: { resistance: number; objections: number; buy_signal: number };
  chapterId?: string;
  phase?: string;
  placement?: string;
  orderIndex?: number;
}

interface AttemptData {
  id: string;
  userId: string;
  roleplayId: string;
  score: number;
  passed: number;
  createdAt: string;
}

interface ChapterData {
  id: string;
  title: string;
  slug?: string;
}

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
const PHASE_OPTIONS = ["Discovery", "Demo", "Objection Handling", "Close"];

export default function RoleplaysPage() {
  const [, setLocation] = useLocation();
  const { user, authToken } = useAuth();
  const getToken = () => authToken || localStorage.getItem("authToken");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const { data: roleplays = [], isLoading: roleplaysLoading } = useQuery<RoleplayData[]>({
    queryKey: ["/api/roleplays"],
    queryFn: async () => {
      const res = await fetch("/api/roleplays");
      if (!res.ok) throw new Error("Failed to fetch roleplays");
      return res.json();
    },
  });

  const { data: chapters = [] } = useQuery<ChapterData[]>({
    queryKey: ["/api/chapters"],
    queryFn: async () => {
      const res = await fetch("/api/chapters");
      if (!res.ok) throw new Error("Failed to fetch chapters");
      return res.json();
    },
  });

  const { data: attempts = [] } = useQuery<AttemptData[]>({
    queryKey: ["/api/users", user?.id, "attempts"],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/users/${user.id}/attempts`);
      if (!res.ok) throw new Error("Failed to fetch attempts");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const attemptsByRoleplay = useMemo(() => {
    const map: Record<string, { attempts: number; bestScore: number; passed: boolean }> = {};
    for (const a of attempts) {
      if (!map[a.roleplayId]) {
        map[a.roleplayId] = { attempts: 0, bestScore: 0, passed: false };
      }
      map[a.roleplayId].attempts++;
      if (a.score > map[a.roleplayId].bestScore) {
        map[a.roleplayId].bestScore = a.score;
      }
      if (a.passed === 1) {
        map[a.roleplayId].passed = true;
      }
    }
    return map;
  }, [attempts]);

  const chapterMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of chapters) {
      map[c.id] = c.title;
    }
    return map;
  }, [chapters]);

  const availablePhases = useMemo(() => {
    const phases = new Set<string>();
    roleplays.forEach(r => { if (r.phase) phases.add(r.phase); });
    return PHASE_OPTIONS.filter(p => phases.has(p));
  }, [roleplays]);

  const availableChapters = useMemo(() => {
    const chapterIds = new Set<string>();
    roleplays.forEach(r => { if (r.chapterId) chapterIds.add(r.chapterId); });
    return chapters.filter(c => chapterIds.has(c.id));
  }, [roleplays, chapters]);

  const filteredRoleplays = useMemo(() => {
    return roleplays
      .filter(r => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matches =
            r.name.toLowerCase().includes(q) ||
            r.role.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            (r.phase && r.phase.toLowerCase().includes(q)) ||
            r.traits.some(t => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        if (selectedDifficulty && r.difficulty !== selectedDifficulty) return false;
        if (selectedPhase && r.phase !== selectedPhase) return false;
        if (selectedChapter && r.chapterId !== selectedChapter) return false;
        return true;
      })
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }, [roleplays, searchQuery, selectedDifficulty, selectedPhase, selectedChapter]);

  const activeFilters = [selectedDifficulty, selectedPhase, selectedChapter].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulty(null);
    setSelectedPhase(null);
    setSelectedChapter(null);
  };

  const difficultyColor = (d: string) =>
    d === "Beginner" ? "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]" :
    d === "Intermediate" ? "bg-[#fffbeb] text-[#d97706] border-[#fde68a]" :
    "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]";

  const phaseColor = (p: string) =>
    p === "Discovery" ? "bg-blue-50 text-blue-700 border-blue-200" :
    p === "Demo" ? "bg-purple-50 text-purple-700 border-purple-200" :
    p === "Objection Handling" ? "bg-amber-50 text-amber-700 border-amber-200" :
    "bg-green-50 text-green-700 border-green-200";

  if (roleplaysLoading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5]">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin h-6 w-6 border-2 border-[#37352f] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <Nav />
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1" data-testid="text-roleplays-title">
            Voice Roleplays
          </h1>
          <p className="text-sm text-[#787774]">
            Practice real sales conversations with AI buyers. Search, filter, and jump into any scenario.
          </p>
        </div>

        <div className="bg-white border border-[#e8e8e5] rounded-xl p-4 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#787774]" />
            <input
              type="text"
              placeholder="Search roleplays by name, persona, skill, or phase..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e8e8e5] bg-[#f7f7f5] text-sm text-[#37352f] placeholder-[#c4c4c0] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2]"
              data-testid="input-search-roleplays"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 text-xs text-[#787774] mr-1">
              <Filter className="h-3.5 w-3.5" />
              Filters:
            </div>

            {DIFFICULTY_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedDifficulty === d
                    ? difficultyColor(d)
                    : "bg-white text-[#787774] border-[#e8e8e5] hover:border-[#c4c4c0]"
                }`}
                data-testid={`filter-difficulty-${d.toLowerCase()}`}
              >
                {d}
              </button>
            ))}

            <div className="w-px h-4 bg-[#e8e8e5]" />

            {availablePhases.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPhase(selectedPhase === p ? null : p)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedPhase === p
                    ? phaseColor(p)
                    : "bg-white text-[#787774] border-[#e8e8e5] hover:border-[#c4c4c0]"
                }`}
                data-testid={`filter-phase-${p.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {p}
              </button>
            ))}

            {availableChapters.length > 1 && (
              <>
                <div className="w-px h-4 bg-[#e8e8e5]" />
                {availableChapters.map(c => {
                  const shortName = c.title.length > 30 ? c.title.slice(0, 28) + "..." : c.title;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChapter(selectedChapter === c.id ? null : c.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        selectedChapter === c.id
                          ? "bg-[#37352f] text-white border-[#37352f]"
                          : "bg-white text-[#787774] border-[#e8e8e5] hover:border-[#c4c4c0]"
                      }`}
                      data-testid={`filter-chapter-${c.id}`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </>
            )}

            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                data-testid="button-clear-filters"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#787774]" data-testid="text-result-count">
            {filteredRoleplays.length} roleplay{filteredRoleplays.length !== 1 ? "s" : ""}
            {activeFilters > 0 || searchQuery ? " found" : " available"}
          </p>
        </div>

        {filteredRoleplays.length === 0 ? (
          <div className="bg-white border border-[#e8e8e5] rounded-xl p-12 text-center">
            <Search className="h-8 w-8 text-[#c4c4c0] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1a1a1a] mb-1">No roleplays match your search</p>
            <p className="text-xs text-[#787774] mb-3">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-[#0A66C2] hover:underline"
              data-testid="button-clear-empty-state"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRoleplays.map((roleplay, i) => {
                const stats = attemptsByRoleplay[roleplay.id];
                const hasPassed = stats?.passed || false;
                const attemptCount = stats?.attempts || 0;
                const bestScore = stats?.bestScore || 0;
                const isLocked = attemptCount >= 3 && !hasPassed;

                return (
                  <motion.div
                    key={roleplay.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <button
                      onClick={() => !isLocked && setLocation(`/chat/${roleplay.id}`)}
                      disabled={isLocked}
                      className={`w-full text-left bg-white border border-[#e8e8e5] rounded-xl overflow-hidden transition-all h-full flex flex-col ${
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:border-[#c4c4c0] hover:shadow-sm cursor-pointer"
                      }`}
                      data-testid={`card-roleplay-${roleplay.id}`}
                    >
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#f7f7f5] overflow-hidden shrink-0">
                            {roleplay.avatar ? (
                              <img src={roleplay.avatar} alt={roleplay.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-5 h-5 text-[#c4c4c0]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-[#1a1a1a] mb-0.5 line-clamp-2" data-testid={`text-roleplay-name-${roleplay.id}`}>
                              {roleplay.name}
                            </h3>
                            <p className="text-xs text-[#787774]">{roleplay.role}</p>
                          </div>
                          {hasPassed && (
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          )}
                          {isLocked && (
                            <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-[#787774] line-clamp-2 mb-3 flex-1">
                          {roleplay.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${difficultyColor(roleplay.difficulty)}`}>
                            {roleplay.difficulty}
                          </span>
                          {roleplay.phase && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${phaseColor(roleplay.phase)}`}>
                              {roleplay.phase}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-[#787774]">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            <span>Resistance {roleplay.stats.resistance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>Objections {roleplay.stats.objections}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Buy {roleplay.stats.buy_signal}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-[#e8e8e5] px-4 py-2.5 flex items-center justify-between bg-[#fafaf9]">
                        {attemptCount > 0 ? (
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-[#787774]">
                              {attemptCount} attempt{attemptCount !== 1 ? "s" : ""}
                            </span>
                            <span className={`font-medium ${hasPassed ? "text-green-600" : "text-[#37352f]"}`}>
                              Best: {bestScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#787774]">Not attempted</span>
                        )}
                        <div className="flex items-center gap-1 text-xs font-medium text-[#0A66C2]">
                          <Mic className="h-3 w-3" />
                          {isLocked ? "Locked" : hasPassed ? "Retry" : "Practice"}
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
