import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { useLocation } from "wouter";
import {
  Megaphone, Target, Building2, DollarSign, Users, ChevronRight,
  CheckCircle2, Trophy, Loader2, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

interface CampaignBriefSummary {
  id: string;
  slug: string;
  title: string;
  company: string;
  industry: string;
  difficulty: string;
  objective: string;
  budgetRange: string;
  targetPersona: string;
  businessGoal: string;
  bestScore: number | null;
  attemptCount: number;
  passed: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#27ae60",
  Medium: "#f39c12",
  Hard: "#e74c3c",
};

function scoreColor(score: number) {
  if (score >= 80) return "#27ae60";
  if (score >= 60) return "#f39c12";
  return "#e74c3c";
}

export default function CampaignBuilderPage() {
  const [, setLocation] = useLocation();
  const { authToken } = useAuth();
  const token = authToken || localStorage.getItem("authToken");

  const { data: briefs, isLoading } = useQuery<CampaignBriefSummary[]>({
    queryKey: ["/api/campaign-builder/briefs"],
    queryFn: async () => {
      const res = await fetch("/api/campaign-builder/briefs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load campaign briefs");
      return res.json();
    },
  });

  const completedCount = briefs?.filter((b) => b.passed).length ?? 0;
  const totalCount = briefs?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: "#0A66C2" }}
            >
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
                Campaign Builder
              </h1>
              <p className="text-muted-foreground">
                Build a complete LinkedIn ad campaign from a client brief, then get AI coaching on every decision.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60" data-testid="stat-completed">
              <Trophy className="h-4 w-4" style={{ color: "#0A66C2" }} />
              <span className="text-sm font-medium">
                {completedCount} / {totalCount} passed
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60">
              <Sparkles className="h-4 w-4" style={{ color: "#0A66C2" }} />
              <span className="text-sm font-medium">6-step guided builder + section-by-section grading</span>
            </div>
          </div>
        </motion.div>

        {/* Brief grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {briefs?.map((brief, i) => (
              <motion.button
                key={brief.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLocation(`/campaign-builder/${brief.slug}`)}
                className="text-left rounded-xl border border-border bg-card hover:border-[#0A66C2] hover:shadow-lg transition-all p-5 group"
                data-testid={`card-brief-${brief.slug}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-semibold truncate" data-testid={`text-company-${brief.slug}`}>
                      {brief.company}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ background: DIFFICULTY_COLORS[brief.difficulty] || "#787774" }}
                    data-testid={`badge-difficulty-${brief.slug}`}
                  >
                    {brief.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-1 group-hover:text-[#0A66C2] transition-colors">
                  {brief.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{brief.businessGoal}</p>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {brief.objective}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {brief.budgetRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {brief.industry}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {brief.bestScore !== null ? (
                      <>
                        {brief.passed && (
                          <CheckCircle2 className="h-4 w-4" style={{ color: "#27ae60" }} />
                        )}
                        <span
                          className="text-sm font-bold"
                          style={{ color: scoreColor(brief.bestScore) }}
                          data-testid={`text-best-score-${brief.slug}`}
                        >
                          Best: {brief.bestScore}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({brief.attemptCount} {brief.attemptCount === 1 ? "attempt" : "attempts"})
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not attempted yet</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-[#0A66C2]">
                    {brief.bestScore !== null ? "Retry" : "Start"}
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
