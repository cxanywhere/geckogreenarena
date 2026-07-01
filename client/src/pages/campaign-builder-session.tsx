import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Nav } from "@/components/nav";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Megaphone, Target, Users, LayoutTemplate, MessageSquare, DollarSign,
  BarChart3, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle,
  Building2, ArrowLeft, RefreshCw, AlertTriangle, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CAMPAIGN_OBJECTIVES,
  CAMPAIGN_AD_FORMATS,
  CAMPAIGN_KPI_OPTIONS,
  CAMPAIGN_BID_STRATEGIES,
  CAMPAIGN_TARGETING_FACETS,
  CAMPAIGN_SECTION_LABELS,
  type CampaignEvaluation,
  type CampaignSectionScores,
} from "@shared/schema";

interface CampaignBrief {
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
  brief: string;
  constraints: string[];
}

interface TargetingState {
  jobFunctions: string[];
  seniorities: string[];
  industries: string[];
  companySizes: string[];
  skills: string[];
  geographies: string[];
  audienceSizeNote: string;
}

const STEPS = [
  { key: "objective", label: "Objective", icon: Target },
  { key: "targeting", label: "Audience", icon: Users },
  { key: "format", label: "Ad Format", icon: LayoutTemplate },
  { key: "messaging", label: "Messaging", icon: MessageSquare },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "measurement", label: "Measurement", icon: BarChart3 },
] as const;

const BUDGET_TYPES = ["Daily", "Lifetime"];

function scoreColor(score: number) {
  if (score >= 80) return "#27ae60";
  if (score >= 60) return "#f39c12";
  return "#e74c3c";
}

function Chip({
  label,
  active,
  onClick,
  testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
        active
          ? "text-white border-transparent"
          : "bg-background border-border hover:border-[#0A66C2] text-foreground"
      }`}
      style={active ? { background: "#0A66C2" } : undefined}
      data-testid={testId}
    >
      {label}
    </button>
  );
}

export default function CampaignBuilderSessionPage() {
  const [, params] = useRoute("/campaign-builder/:slug");
  const slug = params?.slug ?? "";
  const [, setLocation] = useLocation();
  const { authToken } = useAuth();
  const token = authToken || localStorage.getItem("authToken");
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [evaluation, setEvaluation] = useState<CampaignEvaluation | null>(null);

  // --- Builder state ---
  const [objective, setObjective] = useState<string>("");
  const [targeting, setTargeting] = useState<TargetingState>({
    jobFunctions: [],
    seniorities: [],
    industries: [],
    companySizes: [],
    skills: [],
    geographies: [],
    audienceSizeNote: "",
  });
  const [formats, setFormats] = useState<string[]>([]);
  const [messagingHeadline, setMessagingHeadline] = useState("");
  const [messagingBody, setMessagingBody] = useState("");
  const [messagingCta, setMessagingCta] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [budgetType, setBudgetType] = useState("Daily");
  const [bidStrategy, setBidStrategy] = useState("");
  const [allocationNote, setAllocationNote] = useState("");
  const [primaryKpi, setPrimaryKpi] = useState("");
  const [supportingMetrics, setSupportingMetrics] = useState<string[]>([]);

  const { data: brief, isLoading } = useQuery<CampaignBrief>({
    queryKey: [`/api/campaign-builder/briefs/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/campaign-builder/briefs/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load brief");
      return res.json();
    },
    enabled: !!slug,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/campaign-builder/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          briefSlug: slug,
          objective,
          targeting,
          formats,
          messagingHeadline,
          messagingBody,
          messagingCta,
          budget: { totalBudget, budgetType, bidStrategy, allocationNote },
          primaryKpi,
          supportingMetrics,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Campaign evaluation failed. Please try again.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setEvaluation(data.evaluation);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err: Error) => {
      toast({ title: "Grading failed", description: err.message, variant: "destructive" });
    },
  });

  function toggleInArray(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function toggleTargeting(facet: keyof TargetingState, value: string) {
    setTargeting((prev) => ({
      ...prev,
      [facet]: toggleInArray(prev[facet] as string[], value),
    }));
  }

  // Per-step completion gating
  const stepComplete = [
    !!objective,
    targeting.jobFunctions.length > 0 &&
      targeting.seniorities.length > 0 &&
      targeting.industries.length > 0,
    formats.length > 0,
    messagingHeadline.trim().length > 0 &&
      messagingBody.trim().length > 0 &&
      messagingCta.trim().length > 0,
    totalBudget.trim().length > 0 && !!bidStrategy,
    !!primaryKpi,
  ];

  const allComplete = stepComplete.every(Boolean);

  function resetForRetry() {
    setEvaluation(null);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isLoading || !brief) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // ============ RESULTS VIEW ============
  if (evaluation) {
    const sectionKeys = Object.keys(CAMPAIGN_SECTION_LABELS) as (keyof CampaignSectionScores)[];
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setLocation("/campaign-builder")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            data-testid="button-back-hub"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Campaign Builder
          </button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 mb-6 text-center"
          >
            <div className="flex items-center justify-center mb-3">
              {evaluation.passed ? (
                <CheckCircle2 className="h-10 w-10" style={{ color: "#27ae60" }} />
              ) : (
                <XCircle className="h-10 w-10" style={{ color: "#e74c3c" }} />
              )}
            </div>
            <div
              className="text-5xl font-bold mb-1"
              style={{ color: scoreColor(evaluation.overallScore) }}
              data-testid="text-overall-score"
            >
              {evaluation.overallScore}
            </div>
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Overall Score · {evaluation.passed ? "PASSED" : "NOT PASSED"}
            </div>
            <p className="text-sm max-w-xl mx-auto" data-testid="text-pass-reason">
              {evaluation.passFailReason}
            </p>
          </motion.div>

          <div className="rounded-xl border border-border bg-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" style={{ color: "#0A66C2" }} />
              <h3 className="font-semibold">Coach Summary</h3>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-coach-summary">
              {evaluation.coachSummary}
            </p>
          </div>

          <div className="space-y-4">
            {sectionKeys.map((key, i) => {
              const section = evaluation.sections[key];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card p-5"
                  data-testid={`card-section-${key}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{CAMPAIGN_SECTION_LABELS[key]}</h4>
                    <span
                      className="text-lg font-bold"
                      style={{ color: scoreColor(section.score) }}
                      data-testid={`text-section-score-${key}`}
                    >
                      {section.score}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted mb-4 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${section.score}%`, background: scoreColor(section.score) }}
                    />
                  </div>
                  {section.strengths.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                        Strengths
                      </div>
                      <ul className="space-y-1">
                        {section.strengths.map((s, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#27ae60" }} />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {section.fixes.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                        How to improve
                      </div>
                      <ul className="space-y-1">
                        {section.fixes.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#f39c12" }} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={resetForRetry}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-white"
              style={{ background: "#0A66C2" }}
              data-testid="button-retry"
            >
              <RefreshCw className="h-4 w-4" /> Build Again
            </button>
            <button
              onClick={() => setLocation("/campaign-builder")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border border-border hover:bg-muted"
              data-testid="button-done"
            >
              Back to Briefs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ BUILDER VIEW ============
  const StepIcon = STEPS[step].icon;

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setLocation("/campaign-builder")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
          data-testid="button-back-hub"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Campaign Builder
        </button>

        {/* Brief header */}
        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold" data-testid="text-brief-company">{brief.company}</span>
              <span className="text-xs text-muted-foreground">· {brief.industry}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted">
              {brief.difficulty}
            </span>
          </div>
          <h1 className="text-xl font-bold mb-2">{brief.title}</h1>
          <p className="text-sm text-muted-foreground mb-3">{brief.brief}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Goal:</span> {brief.businessGoal}</div>
            <div><span className="font-medium">Budget:</span> {brief.budgetRange}</div>
            <div className="sm:col-span-2"><span className="font-medium">Persona:</span> {brief.targetPersona}</div>
          </div>
          {brief.constraints?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Constraints</div>
              <ul className="flex flex-wrap gap-2">
                {brief.constraints.map((c, i) => (
                  <li key={i} className="text-xs px-2 py-1 rounded bg-muted" data-testid={`text-constraint-${i}`}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = i === step;
            const isDone = stepComplete[i];
            return (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1 min-w-[64px]"
                data-testid={`step-${s.key}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCurrent ? "text-white" : isDone ? "text-white" : "text-muted-foreground bg-background"
                  }`}
                  style={{
                    borderColor: isCurrent || isDone ? "#0A66C2" : undefined,
                    background: isCurrent ? "#0A66C2" : isDone ? "#27ae60" : undefined,
                  }}
                >
                  {isDone && !isCurrent ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-xs ${isCurrent ? "font-semibold" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="rounded-xl border border-border bg-card p-6 min-h-[320px]">
          <div className="flex items-center gap-2 mb-5">
            <StepIcon className="h-5 w-5" style={{ color: "#0A66C2" }} />
            <h2 className="text-lg font-bold">
              Step {step + 1}: {STEPS[step].label}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* STEP 0: OBJECTIVE */}
              {step === 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pick the campaign objective that best matches the client's business goal.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CAMPAIGN_OBJECTIVES.map((o) => (
                      <button
                        key={o}
                        onClick={() => setObjective(o)}
                        className={`text-sm px-3 py-3 rounded-lg border text-left transition-all ${
                          objective === o
                            ? "border-[#0A66C2] bg-[#0A66C2]/10 font-semibold"
                            : "border-border hover:border-[#0A66C2]"
                        }`}
                        data-testid={`option-objective-${o}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: TARGETING */}
              {step === 1 && (
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    Build your audience using LinkedIn's professional-graph facets. Match the persona precisely.
                  </p>
                  {(
                    [
                      ["jobFunctions", "Job Functions"],
                      ["seniorities", "Seniority"],
                      ["industries", "Industries"],
                      ["companySizes", "Company Size"],
                      ["skills", "Skills"],
                      ["geographies", "Geography"],
                    ] as [keyof typeof CAMPAIGN_TARGETING_FACETS, string][]
                  ).map(([facet, label]) => (
                    <div key={facet}>
                      <div className="text-sm font-medium mb-2">{label}</div>
                      <div className="flex flex-wrap gap-2">
                        {CAMPAIGN_TARGETING_FACETS[facet].map((opt) => (
                          <Chip
                            key={opt}
                            label={opt}
                            active={(targeting[facet] as string[]).includes(opt)}
                            onClick={() => toggleTargeting(facet, opt)}
                            testId={`chip-${facet}-${opt}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="text-sm font-medium mb-2">Audience-size sanity note (optional)</div>
                    <input
                      value={targeting.audienceSizeNote}
                      onChange={(e) => setTargeting((p) => ({ ...p, audienceSizeNote: e.target.value }))}
                      placeholder="e.g. ~250K reach — tight enough for efficient CPL"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      data-testid="input-audience-note"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: FORMAT */}
              {step === 2 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the ad format(s) that best serve your objective. You can pick more than one.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CAMPAIGN_AD_FORMATS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormats((prev) => toggleInArray(prev, f))}
                        className={`text-sm px-3 py-3 rounded-lg border text-left transition-all ${
                          formats.includes(f)
                            ? "border-[#0A66C2] bg-[#0A66C2]/10 font-semibold"
                            : "border-border hover:border-[#0A66C2]"
                        }`}
                        data-testid={`option-format-${f}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: MESSAGING */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Write ad copy tailored to the persona and objective.
                  </p>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Headline</label>
                    <input
                      value={messagingHeadline}
                      onChange={(e) => setMessagingHeadline(e.target.value)}
                      placeholder="A punchy, persona-relevant headline"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      data-testid="input-headline"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Body copy</label>
                    <textarea
                      value={messagingBody}
                      onChange={(e) => setMessagingBody(e.target.value)}
                      placeholder="Speak to the buyer's pain and your value; keep it concise"
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                      data-testid="input-body"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Call to action</label>
                    <input
                      value={messagingCta}
                      onChange={(e) => setMessagingCta(e.target.value)}
                      placeholder="e.g. Request Demo, Download Report, Watch Now"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      data-testid="input-cta"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET */}
              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set your budget and bidding approach, respecting the brief's constraints.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Total budget</label>
                      <input
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        placeholder="e.g. $275/day or $25,000 total"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                        data-testid="input-total-budget"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Budget type</label>
                      <div className="flex gap-2">
                        {BUDGET_TYPES.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            active={budgetType === t}
                            onClick={() => setBudgetType(t)}
                            testId={`chip-budget-type-${t}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bid strategy</label>
                    <div className="flex flex-wrap gap-2">
                      {CAMPAIGN_BID_STRATEGIES.map((b) => (
                        <Chip
                          key={b}
                          label={b}
                          active={bidStrategy === b}
                          onClick={() => setBidStrategy(b)}
                          testId={`chip-bid-${b}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Allocation note (optional)</label>
                    <input
                      value={allocationNote}
                      onChange={(e) => setAllocationNote(e.target.value)}
                      placeholder="e.g. concentrate 70% on best-performing audience"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                      data-testid="input-allocation"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: MEASUREMENT */}
              {step === 5 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Pick the primary KPI that matches your objective, plus any supporting metrics.
                  </p>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary KPI</label>
                    <div className="flex flex-wrap gap-2">
                      {CAMPAIGN_KPI_OPTIONS.map((k) => (
                        <Chip
                          key={k}
                          label={k}
                          active={primaryKpi === k}
                          onClick={() => setPrimaryKpi(k)}
                          testId={`chip-primary-kpi-${k}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Supporting metrics (optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {CAMPAIGN_KPI_OPTIONS.filter((k) => k !== primaryKpi).map((k) => (
                        <Chip
                          key={k}
                          label={k}
                          active={supportingMetrics.includes(k)}
                          onClick={() => setSupportingMetrics((prev) => toggleInArray(prev, k))}
                          testId={`chip-supporting-${k}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted"
            data-testid="button-prev"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1 px-5 py-2 rounded-lg font-medium text-white"
              style={{ background: "#0A66C2" }}
              data-testid="button-next"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => submitMutation.mutate()}
              disabled={!allComplete || submitMutation.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-white disabled:opacity-50"
              style={{ background: "#0A66C2" }}
              data-testid="button-submit"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Grading...
                </>
              ) : (
                <>
                  <Megaphone className="h-4 w-4" /> Submit for Grading
                </>
              )}
            </button>
          )}
        </div>

        {step === STEPS.length - 1 && !allComplete && (
          <p className="text-xs text-muted-foreground text-right mt-2">
            Complete objective, audience, format, messaging, budget, and a primary KPI to submit.
          </p>
        )}
      </div>
    </div>
  );
}
