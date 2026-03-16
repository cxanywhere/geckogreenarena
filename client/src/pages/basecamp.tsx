import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { useLocation } from "wouter";
import {
  Mountain, Flame, Star, Lock, CheckCircle2, ChevronRight,
  BookOpen, Zap, Trophy, Target, Shield, BarChart3, Swords
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BasecampLesson {
  id: string;
  unitId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  orderIndex: number;
  xpReward: number;
}

interface BasecampUnit {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string | null;
  color: string;
  orderIndex: number;
  lessons: BasecampLesson[];
}

interface BasecampProgress {
  lessonId: string;
  completed: number;
  score: number;
  xpEarned: number;
}

interface BasecampStreak {
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  lastActivityDate: string | null;
}

const UNIT_ICONS: Record<string, React.ReactNode> = {
  foundation: <BookOpen className="h-5 w-5" />,
  target: <Target className="h-5 w-5" />,
  platform: <Zap className="h-5 w-5" />,
  audience: <Shield className="h-5 w-5" />,
  strategy: <Star className="h-5 w-5" />,
  measurement: <BarChart3 className="h-5 w-5" />,
  compete: <Swords className="h-5 w-5" />,
};

export default function BasecampPage() {
  const [, setLocation] = useLocation();
  const { authToken } = useAuth();
  const token = authToken || localStorage.getItem("authToken");
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  const { data: units = [], isLoading: unitsLoading } = useQuery<BasecampUnit[]>({
    queryKey: ["/api/basecamp/units"],
    queryFn: async () => {
      const res = await fetch("/api/basecamp/units");
      if (!res.ok) throw new Error("Failed to fetch units");
      return res.json();
    },
  });

  const { data: progress = [] } = useQuery<BasecampProgress[]>({
    queryKey: ["/api/basecamp/progress"],
    queryFn: async () => {
      const res = await fetch("/api/basecamp/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!token,
  });

  const { data: streak } = useQuery<BasecampStreak>({
    queryKey: ["/api/basecamp/streak"],
    queryFn: async () => {
      const res = await fetch("/api/basecamp/streak", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { currentStreak: 0, longestStreak: 0, totalXp: 0, lastActivityDate: null };
      return res.json();
    },
    enabled: !!token,
  });

  const completedLessonIds = new Set(
    progress.filter((p) => p.completed === 1).map((p) => p.lessonId)
  );

  const getUnitProgress = (unit: BasecampUnit) => {
    const completed = unit.lessons.filter((l) => completedLessonIds.has(l.id)).length;
    return { completed, total: unit.lessons.length, pct: unit.lessons.length > 0 ? Math.round((completed / unit.lessons.length) * 100) : 0 };
  };

  const isUnitUnlocked = (unitIndex: number) => {
    if (unitIndex === 0) return true;
    const prevUnit = units[unitIndex - 1];
    if (!prevUnit) return false;
    const prevProgress = getUnitProgress(prevUnit);
    return prevProgress.completed >= 1;
  };

  const isLessonUnlocked = (unit: BasecampUnit, lessonIndex: number, unitIndex: number) => {
    if (!isUnitUnlocked(unitIndex)) return false;
    if (lessonIndex === 0) return true;
    const prevLesson = unit.lessons[lessonIndex - 1];
    return prevLesson ? completedLessonIds.has(prevLesson.id) : false;
  };

  const totalXp = streak?.totalXp || 0;
  const currentStreak = streak?.currentStreak || 0;
  const totalLessons = units.reduce((s, u) => s + u.lessons.length, 0);
  const totalCompleted = completedLessonIds.size;

  if (unitsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <Mountain className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Loading Base Camp...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="h-8 w-8 text-[#0A66C2]" />
            <h1 className="text-3xl font-display font-bold text-foreground" data-testid="text-basecamp-title">
              Base Camp
            </h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Master B2B marketing fundamentals before you hit the field.
            Learn the concepts, prove your knowledge.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-10">
          <motion.div
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-5 py-3"
            whileHover={{ scale: 1.03 }}
            data-testid="stat-total-xp"
          >
            <Zap className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-lg font-bold text-foreground">{totalXp}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total XP</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-5 py-3"
            whileHover={{ scale: 1.03 }}
            data-testid="stat-streak"
          >
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-foreground">{currentStreak}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Day Streak</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-5 py-3"
            whileHover={{ scale: 1.03 }}
            data-testid="stat-lessons"
          >
            <Trophy className="h-5 w-5 text-[#0A66C2]" />
            <div>
              <p className="text-lg font-bold text-foreground">{totalCompleted}/{totalLessons}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Lessons</p>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {units.map((unit, unitIdx) => {
              const unlocked = isUnitUnlocked(unitIdx);
              const unitProgress = getUnitProgress(unit);
              const isExpanded = expandedUnit === unit.id;
              const isComplete = unitProgress.pct === 100;

              return (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: unitIdx * 0.08 }}
                >
                  <button
                    onClick={() => unlocked && setExpandedUnit(isExpanded ? null : unit.id)}
                    className={`w-full text-left relative pl-16 pr-4 py-4 rounded-xl border transition-all ${
                      !unlocked
                        ? "opacity-50 cursor-not-allowed border-border bg-card/50"
                        : isExpanded
                        ? "border-[var(--unit-color)] bg-card shadow-lg"
                        : "border-border bg-card hover:border-[var(--unit-color)] hover:shadow-md"
                    }`}
                    style={{ "--unit-color": unit.color } as React.CSSProperties}
                    disabled={!unlocked}
                    data-testid={`unit-card-${unit.slug}`}
                  >
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10"
                      style={{
                        backgroundColor: unlocked ? unit.color : undefined,
                        borderColor: unlocked ? unit.color : undefined,
                      }}
                    >
                      {!unlocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      ) : (
                        <span className="text-white">{UNIT_ICONS[unit.icon || ""] || <BookOpen className="h-5 w-5" />}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-0.5">
                          Unit {unitIdx + 1}
                        </p>
                        <h3 className="font-display font-semibold text-foreground text-base truncate">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {unit.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {unlocked && (
                          <div className="text-right">
                            <p className="text-xs font-medium" style={{ color: unit.color }}>
                              {unitProgress.completed}/{unitProgress.total}
                            </p>
                            <div className="w-16 h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${unitProgress.pct}%`, backgroundColor: unit.color }}
                              />
                            </div>
                          </div>
                        )}
                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && unlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-16 pr-4 py-2 space-y-2">
                          {unit.lessons.map((lesson, lessonIdx) => {
                            const lessonUnlocked = isLessonUnlocked(unit, lessonIdx, unitIdx);
                            const lessonDone = completedLessonIds.has(lesson.id);
                            const lessonProgress = progress.find((p) => p.lessonId === lesson.id);

                            return (
                              <motion.button
                                key={lesson.id}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: lessonIdx * 0.06 }}
                                onClick={() => lessonUnlocked && setLocation(`/basecamp/lesson/${lesson.slug}`)}
                                disabled={!lessonUnlocked}
                                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                                  !lessonUnlocked
                                    ? "opacity-40 cursor-not-allowed border-border bg-background"
                                    : lessonDone
                                    ? "border-[#0A66C2]/30 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10"
                                    : "border-border bg-background hover:border-[var(--unit-color)] hover:bg-card"
                                }`}
                                style={{ "--unit-color": unit.color } as React.CSSProperties}
                                data-testid={`lesson-card-${lesson.slug}`}
                              >
                                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{
                                  backgroundColor: lessonDone ? "#0A66C2" : lessonUnlocked ? unit.color + "20" : undefined,
                                }}>
                                  {!lessonUnlocked ? (
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                  ) : lessonDone ? (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                  ) : (
                                    <span className="text-xs font-bold" style={{ color: unit.color }}>
                                      {lessonIdx + 1}
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{lesson.title}</p>
                                  {lesson.subtitle && (
                                    <p className="text-xs text-muted-foreground truncate">{lesson.subtitle}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {lessonDone && lessonProgress && (
                                    <span className="text-xs font-medium text-[#0A66C2]">
                                      {lessonProgress.score}%
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    {lesson.xpReward}
                                  </span>
                                  {lessonUnlocked && !lessonDone && (
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
