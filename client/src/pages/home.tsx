import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Nav } from "@/components/nav";
import { RoleplayCard } from "@/components/character-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lock, BookOpen, Award, GraduationCap, ChevronDown, ChevronUp, Play, Clock, FileText, Mic, RotateCcw, BarChart3, Target, Zap, Flame, Lightbulb, Trophy, TrendingUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Chapter, type Roleplay } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NudgeBanner } from "@/components/nudge-banner";

import notionProgress from "@/assets/notion-icon-progress.png";
import notionChapter from "@/assets/notion-icon-chapter.png";
import notionRoleplay from "@/assets/notion-icon-roleplay.png";
import notionQuiz from "@/assets/notion-icon-quiz.png";
import notionCoach from "@/assets/notion-icon-coach.png";
import notionBattlecard from "@/assets/notion-icon-battlecard.png";
import notionPersonas from "@/assets/notion-icon-personas.png";
import notionLeaderboard from "@/assets/notion-icon-leaderboard.png";
import notionCert from "@/assets/notion-icon-cert.png";

const SALES_TIPS = [
  { tip: "Always ask at least 2 discovery questions before recommending a campaign objective.", category: "Discovery" },
  { tip: "Lead Gen Forms reduce friction by pre-filling professional data — connect this to the buyer's conversion problem.", category: "Product" },
  { tip: "When a CMO asks 'why LinkedIn?', lead with business outcomes, not ad formats.", category: "Executive Selling" },
  { tip: "The 7-part discovery framework: Business goals → Audience → Funnel gap → Current channels → Offer/content → Measurement → Stakeholders.", category: "Discovery" },
  { tip: "Niche audience? Reframe it as LinkedIn's strength — professional targeting makes small audiences more reachable, not less.", category: "Objection Handling" },
  { tip: "Never dismiss a buyer's past failure with LinkedIn. Ask diagnostic questions about what was tested before proposing a retry.", category: "Objection Handling" },
  { tip: "When discussing price, shift from cost comparison to results comparison. What's the cost of reaching the wrong people?", category: "Negotiation" },
  { tip: "For pilot campaigns, recommend one objective, one audience, one offer, and clear success metrics. Simplicity wins trust.", category: "Strategy" },
  { tip: "Document Ads work best for whitepapers; Lead Gen Forms work best for webinar signups. Match format to offer.", category: "Product" },
  { tip: "In a buying committee, sequence your messaging — different stakeholders need different value propositions.", category: "ABM" },
];

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarInitials: string;
  avgScore: number;
  passedCount: number;
}

export default function Home() {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [unlockedRoleplays, setUnlockedRoleplays] = useState<string[]>([]);
  const [resettingChapter, setResettingChapter] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters"],
    queryFn: () => api.getChapters(),
  });

  const { data: roleplays = [] } = useQuery({
    queryKey: ["roleplays"],
    queryFn: () => api.getRoleplays(),
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: () => api.getUserProgress(user!.id),
    enabled: !!user?.id,
  });

  const { data: roleplayAttempts = [] } = useQuery({
    queryKey: ["roleplay-attempts", user?.id],
    queryFn: () => api.getUserAttempts(user!.id),
    enabled: !!user?.id,
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  useEffect(() => {
    const savedChapters = JSON.parse(localStorage.getItem("completed_chapters") || "[]");
    const savedRoleplays = JSON.parse(localStorage.getItem("unlocked_roleplays") || "[]");
    setCompletedChapters(savedChapters);
    setUnlockedRoleplays(savedRoleplays);
  }, []);

  const dailyTip = useMemo(() => {
    const today = new Date();
    const dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % SALES_TIPS.length;
    return SALES_TIPS[dayIndex];
  }, []);

  const streak = useMemo(() => {
    if (!roleplayAttempts.length) return 0;
    const dates = roleplayAttempts
      .map(a => new Date(a.completedAt || a.createdAt || Date.now()).toDateString())
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let count = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toDateString()) {
        count++;
      } else if (i === 0 && dates[0] === new Date(today.getTime() - 86400000).toDateString()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [roleplayAttempts]);

  const recentAttempts = useMemo(() => {
    return [...roleplayAttempts]
      .sort((a, b) => new Date(b.completedAt || b.createdAt || 0).getTime() - new Date(a.completedAt || a.createdAt || 0).getTime())
      .slice(0, 4);
  }, [roleplayAttempts]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const currentUserRank = leaderboard.find(e => e.userId === user?.id)?.rank || "--";
  const top3 = leaderboard.slice(0, 3);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const currentChapterIds = new Set(chapters.map(c => c.id));
  const currentRoleplayIds = new Set(roleplays.map(r => r.id));

  const relevantProgress = userProgress.filter(p => currentChapterIds.has(p.chapterId));
  const relevantAttempts = roleplayAttempts.filter(a => currentRoleplayIds.has(a.roleplayId));

  const chaptersCompleted = relevantProgress.filter((p) => p.completed === 1).length;
  const totalChapters = chapters.length;
  
  const isAttemptPassed = (attempt: typeof roleplayAttempts[number]) => {
    return attempt.passed === 1 || (attempt.passed as unknown) === true;
  };
  const passedRoleplayIds = relevantAttempts.filter(isAttemptPassed).map((a) => a.roleplayId);
  const uniqueRoleplaysPassed = Array.from(new Set(passedRoleplayIds)).length;
  const totalRoleplays = roleplays.length;
  
  const getRoleplayStatus = (roleplayId: string) => {
    const attempts = relevantAttempts.filter(a => a.roleplayId === roleplayId);
    const hasPassed = attempts.some(a => isAttemptPassed(a));
    const permanentlyFailed = !hasPassed && attempts.length >= 500;
    return { hasPassed, permanentlyFailed, attemptCount: attempts.length };
  };
  
  const quizScores = relevantProgress.filter((p) => p.quizScore !== null && p.quizScore !== undefined).map((p) => p.quizScore!);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
  
  const REQUIRED_ROLEPLAYS_FOR_CERTIFICATION = 16;
  const allChaptersComplete = chaptersCompleted >= totalChapters && totalChapters > 0;
  const allRoleplaysPassed = uniqueRoleplaysPassed >= REQUIRED_ROLEPLAYS_FOR_CERTIFICATION;
  const quizScoreMet = avgQuizScore >= 75;
  const isCertified = allChaptersComplete && allRoleplaysPassed && quizScoreMet;

  const progressPercentage = Math.round(
    ((chaptersCompleted + uniqueRoleplaysPassed) / 
    Math.max(totalChapters + totalRoleplays, 1)) * 100
  );

  const getChapterProgress = (chapterId: string) => {
    return userProgress.find(p => p.chapterId === chapterId);
  };

  const isChapterCompleted = (chapterId: string) => {
    const prog = getChapterProgress(chapterId);
    return prog?.completed === 1 || completedChapters.includes(chapterId);
  };

  const isChapterUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevChapter = chapters[index - 1];
    return prevChapter ? isChapterCompleted(prevChapter.id) : true;
  };

  const handleReviewChapter = async (e: React.MouseEvent, chapterId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResettingChapter(chapterId);
    try {
      const res = await fetch("/api/progress/reset-slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ chapterId }),
      });
      if (res.ok) {
        localStorage.removeItem(`chapter_pdf_progress_${chapterId}`);
        await queryClient.invalidateQueries({ queryKey: ["user-progress", user?.id] });
        setLocation(`/chapter/${chapterId}`);
      }
    } catch (err) {
      console.error("Failed to reset slides:", err);
    } finally {
      setResettingChapter(null);
    }
  };

  const getNextAction = () => {
    for (let i = 0; i < chapters.length; i++) {
      if (!isChapterCompleted(chapters[i].id)) {
        return { type: "chapter" as const, chapter: chapters[i], index: i, message: `Continue with Chapter ${i + 1}` };
      }
    }
    if (!allRoleplaysPassed) {
      const unpassedRoleplay = roleplays.find(r => !passedRoleplayIds.includes(r.id));
      if (unpassedRoleplay) {
        return { type: "roleplay" as const, roleplay: unpassedRoleplay, message: "Practice voice roleplays to pass all scenarios" };
      }
    }
    if (!quizScoreMet && avgQuizScore > 0) {
      return { type: "quiz" as const, message: "Retake quizzes to improve your average score above 75%" };
    }
    return null;
  };

  const nextAction = getNextAction();

  const chapterRoleplays = (chapterId: string) => {
    return [...roleplays]
      .filter(r => r.chapterId === chapterId)
      .sort((a, b) => {
        const extractOrder = (id: string) => {
          const match = id.match(/rp-(?:lms-)?(\d+)/);
          return match ? parseInt(match[1]) : 9999;
        };
        return extractOrder(a.id) - extractOrder(b.id);
      });
  };

  const statCards = [
    { label: "Overall Progress", value: `${progressPercentage}%`, iconSrc: notionProgress, progress: progressPercentage },
    { label: "Chapters", value: `${chaptersCompleted}/${totalChapters}`, iconSrc: notionChapter, progress: totalChapters > 0 ? (chaptersCompleted / totalChapters) * 100 : 0, done: allChaptersComplete },
    { label: "Roleplays", value: `${uniqueRoleplaysPassed}/${totalRoleplays}`, iconSrc: notionRoleplay, progress: totalRoleplays > 0 ? (uniqueRoleplaysPassed / totalRoleplays) * 100 : 0, done: allRoleplaysPassed },
    { label: "Quiz Average", value: avgQuizScore > 0 ? `${avgQuizScore}%` : "--", iconSrc: notionQuiz, progress: avgQuizScore, done: quizScoreMet },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5] font-sans">
      <Nav />
      
      <div className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">
        <div className="flex gap-6">

          <motion.aside
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="hidden lg:flex flex-col gap-4 w-[280px] shrink-0 sticky top-20 self-start"
          >
            <div className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid="sidebar-profile">
              <div className="flex items-center gap-3 mb-3">
                {user?.warriorAvatar ? (
                  <img src={user.warriorAvatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#e8e8e5]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#37352f] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">{user?.name || "Sales Rep"}</p>
                  <p className="text-[11px] text-[#787774] capitalize">{user?.role || "Rep"}</p>
                </div>
                {streak > 0 && (
                  <div className="ml-auto flex items-center gap-1 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 px-2 py-1 rounded" data-testid="streak-counter">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-bold text-orange-600">{streak}</span>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#787774]">Overall Progress</span>
                  <span className="font-bold text-[#1a1a1a]">{progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#f0f0ed] rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#37352f] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#f0f0ed]">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#1a1a1a]">{chaptersCompleted}/{totalChapters}</p>
                  <p className="text-[10px] text-[#787774] uppercase">Chapters</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#1a1a1a]">{uniqueRoleplaysPassed}/{totalRoleplays}</p>
                  <p className="text-[10px] text-[#787774] uppercase">Roleplays</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#1a1a1a]">{avgQuizScore > 0 ? `${avgQuizScore}%` : "--"}</p>
                  <p className="text-[10px] text-[#787774] uppercase">Quiz Avg</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid="sidebar-quick-links">
              <p className="text-[10px] font-medium text-[#787774] uppercase tracking-wider mb-3">Quick Access</p>
              <div className="space-y-1">
                {[
                  { label: "Sales Coach", icon: notionCoach, href: "/coach" },
                  { label: "Battlecards", icon: notionBattlecard, href: "/battlecards" },
                  { label: "Personas", icon: notionPersonas, href: "/personas" },
                  { label: "Leaderboard", icon: notionLeaderboard, href: "/leaderboard" },
                  { label: "Playbook", icon: notionProgress, href: "/playbook" },
                  { label: "My Stats", icon: notionQuiz, href: "/my-stats" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-[#f7f7f5] transition-colors cursor-pointer group" data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <img src={item.icon} alt="" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-[#787774] group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {!isCertified && (
              <div className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid="sidebar-certification">
                <div className="flex items-center gap-2 mb-3">
                  <img src={notionCert} alt="" className="w-5 h-5 object-contain" />
                  <p className="text-xs font-semibold text-[#1a1a1a]">Certification</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "All chapters", done: allChaptersComplete, detail: `${chaptersCompleted}/${totalChapters}` },
                    { label: "16+ roleplays", done: allRoleplaysPassed, detail: `${uniqueRoleplaysPassed}/${REQUIRED_ROLEPLAYS_FOR_CERTIFICATION}` },
                    { label: "Quiz avg ≥ 75%", done: quizScoreMet, detail: avgQuizScore > 0 ? `${avgQuizScore}%` : "--" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-[#2ecc71]' : 'border-2 border-[#e8e8e5]'}`}>
                        {item.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-xs flex-1 ${item.done ? 'text-[#787774] line-through' : 'text-[#1a1a1a]'}`}>{item.label}</span>
                      <span className={`text-[11px] font-medium ${item.done ? 'text-[#2ecc71]' : 'text-[#787774]'}`}>{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid="sidebar-daily-tip">
              <div className="flex items-center gap-2 mb-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <p className="text-xs font-semibold text-[#1a1a1a]">Daily Tip</p>
                <span className="ml-auto text-[9px] font-medium text-[#787774] uppercase tracking-wider bg-[#f7f7f5] px-1.5 py-0.5 rounded">{dailyTip.category}</span>
              </div>
              <p className="text-xs text-[#37352f] leading-relaxed">{dailyTip.tip}</p>
            </div>

            <div className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid="sidebar-leaderboard">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={notionLeaderboard} alt="" className="w-5 h-5 object-contain" />
                  <p className="text-xs font-semibold text-[#1a1a1a]">Leaderboard</p>
                </div>
                <span className="text-[10px] font-bold text-[#787774] bg-[#f7f7f5] px-1.5 py-0.5 rounded">#{currentUserRank}</span>
              </div>
              {top3.length > 0 ? (
                <div className="space-y-2">
                  {top3.map((entry, i) => (
                    <div key={entry.userId} className={`flex items-center gap-2 py-1 ${entry.userId === user?.id ? 'font-medium' : ''}`}>
                      <span className="text-xs w-4 text-center">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                      <span className="flex-1 text-xs text-[#1a1a1a] truncate">{entry.name}</span>
                      <span className="text-[11px] text-[#787774]">{entry.avgScore}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#787774] text-center py-2">No data yet</p>
              )}
              <Link href="/leaderboard">
                <p className="text-[11px] font-medium text-[#37352f] hover:underline cursor-pointer mt-2 text-center">View all →</p>
              </Link>
            </div>
          </motion.aside>

          <div className="flex-1 min-w-0">

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-1" data-testid="text-welcome">
                {getGreeting()}, {user?.name || "Sales Rep"}
              </h1>
              <p className="text-[#787774]">
                Complete your training to earn your LMS certification.
              </p>
            </div>
            {streak > 0 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 px-3 py-2 rounded-lg shrink-0 lg:hidden"
                data-testid="streak-counter-mobile"
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 leading-none">{streak}</div>
                  <div className="text-[10px] font-medium text-orange-400 uppercase">day streak</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {user && <NudgeBanner userId={user.id} />}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          className="grid grid-cols-4 gap-2 mb-6 lg:hidden"
          data-testid="quick-access-toolbar"
        >
          {[
            { label: "Sales Coach", icon: notionCoach, href: "/coach" },
            { label: "Battlecards", icon: notionBattlecard, href: "/battlecards" },
            { label: "Personas", icon: notionPersonas, href: "/personas" },
            { label: "Leaderboard", icon: notionLeaderboard, href: "/leaderboard" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-[#e8e8e5] bg-white hover:border-[#d4d4d0] hover:shadow-sm transition-all cursor-pointer group" data-testid={`quick-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <img src={item.icon} alt="" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-[#787774] group-hover:text-[#1a1a1a] transition-colors">{item.label}</span>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          {statCards.map((stat, i) => (
            <div key={stat.label} className="rounded-lg border border-[#e8e8e5] bg-white p-4" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-[#787774] uppercase tracking-wider">{stat.label}</span>
                <img src={stat.iconSrc} alt="" className="w-6 h-6 object-contain" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">{stat.value}</div>
              {stat.done && (
                <div className="flex items-center gap-1 mt-1.5">
                  <CheckCircle className="w-3 h-3 text-[#2ecc71]" />
                  <span className="text-[10px] font-medium text-[#2ecc71] uppercase">Complete</span>
                </div>
              )}
              {!stat.done && stat.progress !== undefined && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-[#f0f0ed] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#37352f] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {isCertified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="banner-certified"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#2ecc71]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Certification Complete!</h3>
                <p className="text-sm text-[#787774] mt-0.5">You've mastered LMS sales. Full commission eligibility unlocked.</p>
              </div>
              <Link href="/report-card">
                <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm shrink-0" data-testid="button-view-certificate">
                  View Certificate <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {allRoleplaysPassed && !quizScoreMet && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="banner-almost-certified"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#fffbeb] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#d97706]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">Almost certified!</h3>
                  <p className="text-sm text-[#787774]">
                    Complete quizzes with 75%+ average.
                    {avgQuizScore > 0 && <span className="font-medium text-[#1a1a1a]"> Current: {avgQuizScore}%</span>}
                  </p>
                </div>
              </div>
              <Link href="/quizzes">
                <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm shrink-0" data-testid="button-complete-quizzes">
                  Complete Quizzes <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {nextAction && !isCertified && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="card-next-action"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f7f7f5] flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-[#37352f]" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#787774] uppercase tracking-wider">Next step</p>
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">
                    {nextAction.type === "chapter" 
                      ? `Chapter ${(nextAction.index ?? 0) + 1}: ${nextAction.chapter?.title}`
                      : nextAction.message}
                  </h3>
                </div>
              </div>
              {nextAction.type === "chapter" && nextAction.chapter && (
                <Link href={`/chapter/${nextAction.chapter.id}`}>
                  <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm" data-testid="button-next-action">
                    Continue <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
              {nextAction.type === "quiz" && (
                <Link href="/quizzes">
                  <Button className="bg-[#37352f] text-white hover:bg-[#2f2f2a] text-sm" data-testid="button-next-action-quiz">
                    Review Quizzes <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="lg:hidden mb-6">
          {!isCertified && (
            <div className="rounded-lg border border-[#e8e8e5] bg-white p-5" data-testid="certification-checklist-mobile">
              <div className="flex items-center gap-2.5 mb-4">
                <img src={notionCert} alt="" className="w-7 h-7 object-contain" />
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Certification Checklist</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Complete all chapters", done: allChaptersComplete, detail: `${chaptersCompleted}/${totalChapters} chapters` },
                  { label: "Pass 16+ roleplays", done: allRoleplaysPassed, detail: `${uniqueRoleplaysPassed}/${REQUIRED_ROLEPLAYS_FOR_CERTIFICATION} passed` },
                  { label: "Quiz average ≥ 75%", done: quizScoreMet, detail: avgQuizScore > 0 ? `Currently ${avgQuizScore}%` : "No quizzes taken" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-[#2ecc71]' : 'border-2 border-[#e8e8e5]'}`}>
                      {item.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm ${item.done ? 'text-[#787774] line-through' : 'text-[#1a1a1a] font-medium'}`}>{item.label}</span>
                    </div>
                    <span className={`text-xs ${item.done ? 'text-[#2ecc71]' : 'text-[#787774]'} shrink-0`}>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 lg:hidden">
          <div className="rounded-lg border border-[#e8e8e5] bg-white p-5" data-testid="daily-tip-card-mobile">
            <div className="flex items-center gap-2.5 mb-3">
              <img src={notionCoach} alt="" className="w-7 h-7 object-contain" />
              <div>
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Daily Sales Tip</h3>
                <span className="text-[10px] font-medium text-[#787774] uppercase tracking-wider">{dailyTip.category}</span>
              </div>
            </div>
            <div className="bg-[#f7f7f5] rounded-lg p-3.5">
              <div className="flex gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[#37352f] leading-relaxed">{dailyTip.tip}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#e8e8e5] bg-white p-5" data-testid="leaderboard-preview-mobile">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <img src={notionLeaderboard} alt="" className="w-7 h-7 object-contain" />
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Leaderboard</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-[#f7f7f5] px-2 py-1 rounded text-xs">
                <span className="text-[#787774]">Your rank:</span>
                <span className="font-bold text-[#1a1a1a]">#{currentUserRank}</span>
              </div>
            </div>
            {top3.length > 0 ? (
              <div className="space-y-2.5">
                {top3.map((entry, i) => (
                  <div key={entry.userId} className={`flex items-center gap-3 p-2 rounded-lg ${entry.userId === user?.id ? 'bg-[#f7f7f5]' : ''}`}>
                    <span className={`text-sm font-bold w-5 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#f0f0ed] flex items-center justify-center text-xs font-bold text-[#787774]">
                      {entry.avatarInitials}
                    </div>
                    <span className="flex-1 text-sm font-medium text-[#1a1a1a] truncate">{entry.name}</span>
                    <span className="text-xs text-[#787774]">{entry.avgScore}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#787774] text-center py-4">Complete roleplays to appear on the leaderboard</p>
            )}
            <Link href="/leaderboard">
              <div className="mt-3 text-center">
                <span className="text-xs font-medium text-[#37352f] hover:underline cursor-pointer">View full leaderboard →</span>
              </div>
            </Link>
          </div>
        </div>

        {recentAttempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-6 rounded-lg border border-[#e8e8e5] bg-white p-5"
            data-testid="recent-activity"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <img src={notionRoleplay} alt="" className="w-7 h-7 object-contain" />
                <h3 className="text-sm font-semibold text-[#1a1a1a]">Recent Activity</h3>
              </div>
              <Link href="/my-stats">
                <span className="text-xs font-medium text-[#37352f] hover:underline cursor-pointer">View all →</span>
              </Link>
            </div>
            <div className="space-y-2">
              {recentAttempts.map((attempt, i) => {
                const rp = roleplays.find(r => r.id === attempt.roleplayId);
                const passed = attempt.passed === 1 || (attempt.passed as unknown) === true;
                const date = new Date(attempt.completedAt || attempt.createdAt || Date.now());
                const timeAgo = getTimeAgo(date);
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-[#f0f0ed] last:border-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${passed ? 'bg-[#2ecc71]' : 'bg-[#e74c3c]'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1a1a1a] truncate">{rp?.name || "Roleplay"}</p>
                      <p className="text-[11px] text-[#787774]">{timeAgo}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-[#1a1a1a]">{attempt.score || 0}%</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${passed ? 'bg-green-50 text-[#2ecc71]' : 'bg-red-50 text-[#e74c3c]'}`}>
                        {passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <img src={notionChapter} alt="" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="text-lg font-semibold text-[#1a1a1a]" data-testid="heading-training-path">Training Path</h2>
              <p className="text-sm text-[#787774]">Complete each chapter in order to progress</p>
            </div>
          </div>
           
          <div className="space-y-3">
            {chapters.map((chapter, index) => {
              const isCompleted = isChapterCompleted(chapter.id);
              const isUnlocked = isChapterUnlocked(index);
              const isNext = !isCompleted && isUnlocked && (index === 0 || isChapterCompleted(chapters[index - 1]?.id));
              const chapterProgress = getChapterProgress(chapter.id);
              const slidesViewed = chapterProgress?.slidesViewed?.length || 0;
              const totalSlides = chapterProgress?.totalSlides || chapter.slideCount || 10;
              const chapterRps = chapterRoleplays(chapter.id);
              const isExpanded = expandedChapter === chapter.id;
              
              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`rounded-lg border overflow-hidden transition-all duration-200 ${
                    isCompleted 
                      ? 'border-[#e8e8e5] bg-white' 
                      : isNext 
                        ? 'border-[#d4d4d0] bg-white shadow-sm' 
                        : isUnlocked
                          ? 'border-[#e8e8e5] bg-white hover:shadow-sm'
                          : 'border-dashed border-[#e8e8e5] bg-[#fafaf8] opacity-50'
                  }`}>
                    {isUnlocked ? (
                      <>
                        <Link href={`/chapter/${chapter.id}`} className="block">
                          <div className="flex flex-col sm:flex-row group">
                            <div className="relative w-full sm:w-44 md:w-52 h-32 sm:h-auto overflow-hidden shrink-0 bg-[#f0f0ed]">
                              {chapter.coverImage ? (
                                <img src={chapter.coverImage} alt={chapter.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <div className="absolute inset-0 bg-[#f0f0ed] flex items-center justify-center">
                                  <BookOpen className="w-8 h-8 text-[#c4c4c0]" />
                                </div>
                              )}
                              {isNext && (
                                <div className="absolute top-3 left-3 bg-[#37352f] text-white px-2.5 py-1 rounded text-[11px] font-semibold uppercase flex items-center gap-1">
                                  <Play className="w-3 h-3" /> Up Next
                                </div>
                              )}
                              {isCompleted && (
                                <div className="absolute top-3 left-3 bg-[#2ecc71] text-white px-2.5 py-1 rounded text-[11px] font-semibold uppercase flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Done
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4 sm:p-5 flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium text-[#787774] uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                                  <h3 className="font-semibold text-[15px] leading-tight text-[#1a1a1a] group-hover:text-[#37352f]" data-testid={`text-chapter-title-${chapter.id}`}>{chapter.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#787774] bg-[#f7f7f5] px-2 py-1 rounded shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {chapter.duration}
                                </div>
                              </div>
                              
                              <p className="text-[#787774] text-sm line-clamp-1 mb-3">{chapter.description}</p>
                              
                              {chapter.agenda && chapter.agenda.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {chapter.agenda.slice(0, 3).map((item, i) => (
                                    <span key={i} className="text-[11px] bg-[#f7f7f5] text-[#787774] px-2 py-0.5 rounded font-medium">{item}</span>
                                  ))}
                                </div>
                              )}
                              
                              {!isCompleted && slidesViewed > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-[#787774]">Slide Progress</span>
                                    <span className="font-medium text-[#1a1a1a]">{slidesViewed}/{totalSlides}</span>
                                  </div>
                                  <div className="h-1 w-full bg-[#f0f0ed] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#37352f] rounded-full" style={{ width: `${(slidesViewed / totalSlides) * 100}%` }} />
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between pt-3 border-t border-[#f0f0ed]">
                                <div className="flex items-center gap-3 text-xs text-[#787774]">
                                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {totalSlides} slides</span>
                                  <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> {chapterRps.length} roleplays</span>
                                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Quiz</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isCompleted && (
                                    <button
                                      onClick={(e) => handleReviewChapter(e, chapter.id)}
                                      disabled={resettingChapter === chapter.id}
                                      className="text-xs font-medium text-[#787774] hover:text-[#1a1a1a] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#f7f7f5] transition-colors"
                                      data-testid={`button-review-chapter-${chapter.id}`}
                                    >
                                      <RotateCcw className={`w-3 h-3 ${resettingChapter === chapter.id ? 'animate-spin' : ''}`} />
                                      Restart
                                    </button>
                                  )}
                                  <span className="text-sm font-medium text-[#37352f] flex items-center group-hover:translate-x-0.5 transition-transform">
                                    {isCompleted ? "Review" : isNext ? "Start" : "Continue"} <ArrowRight className="ml-1 w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        
                        {chapterRps.length > 0 && (
                          <div className="border-t border-[#f0f0ed]">
                            <button
                              onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-[#787774] hover:text-[#1a1a1a] hover:bg-[#fafaf8] transition-colors"
                              data-testid={`button-toggle-roleplays-${chapter.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <img src={notionRoleplay} alt="" className="w-5 h-5 object-contain" />
                                <span>{chapterRps.length} Roleplays</span>
                                <span className="text-xs text-[#2ecc71] font-medium">
                                  {chapterRps.filter(r => getRoleplayStatus(r.id).hasPassed).length} passed
                                </span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-5 pb-4"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {chapterRps.map((rp, rpIndex) => {
                                    const status = getRoleplayStatus(rp.id);
                                    return (
                                      <RoleplayCard 
                                        key={rp.id} 
                                        scenario={rp} 
                                        index={rpIndex}
                                        isLocked={false}
                                        hasPassed={status.hasPassed}
                                        permanentlyFailed={status.permanentlyFailed}
                                      />
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-4 p-5">
                        <div className="w-9 h-9 rounded-lg bg-[#f7f7f5] flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4 text-[#c4c4c0]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#c4c4c0] uppercase tracking-wider mb-0.5">Chapter {index + 1}</p>
                          <h3 className="font-semibold text-sm text-[#c4c4c0]">{chapter.title}</h3>
                          <p className="text-xs text-[#d4d4d0] mt-0.5">Complete previous chapter to unlock</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

          </div>
        </div>

        <div className="text-center py-6 border-t border-[#e8e8e5]">
          <p className="text-xs text-[#c4c4c0]">Arena AI by GigaRev &middot; Built for LinkedIn Marketing Solutions</p>
        </div>
      </div>
    </div>
  );
}
