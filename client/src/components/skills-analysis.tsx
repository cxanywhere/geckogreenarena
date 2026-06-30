import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Gauge,
  MessageSquareWarning,
  Mic,
  Ear,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Target,
} from "lucide-react";
import {
  DIMENSION_LABELS,
  type DimensionScores,
  type DeliveryMetrics,
  type AcousticScores,
  type TimestampedMoment,
} from "@shared/schema";

const LINKEDIN_BLUE = "#0A66C2";
const NAVY = "#1A2B8C";

function formatTime(sec: number | null | undefined): string {
  if (sec === null || sec === undefined || isNaN(sec)) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SkillsRadar({ scores }: { scores?: DimensionScores | null }) {
  if (!scores) return null;
  const data = (Object.keys(DIMENSION_LABELS) as (keyof DimensionScores)[]).map(
    (key) => ({
      dimension: DIMENSION_LABELS[key],
      score: Math.max(0, Math.min(100, Math.round(scores[key] ?? 0))),
    }),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      data-testid="card-skills-radar"
    >
      <div className="mb-2 flex items-center gap-2">
        <Target className="h-5 w-5" style={{ color: LINKEDIN_BLUE }} />
        <h3 className="text-lg font-bold" style={{ color: NAVY }}>
          Skills Map
        </h3>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Your performance across six core selling dimensions.
      </p>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#374151", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke={LINKEDIN_BLUE}
              fill={LINKEDIN_BLUE}
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {data.map((d) => (
          <div
            key={d.dimension}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
            data-testid={`stat-dimension-${d.dimension.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <span className="text-xs text-gray-600">{d.dimension}</span>
            <span
              className="text-sm font-bold"
              style={{ color: d.score >= 70 ? LINKEDIN_BLUE : d.score >= 50 ? "#b45309" : "#dc2626" }}
            >
              {d.score}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  hint,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}) {
  const toneColor =
    tone === "good"
      ? "#16a34a"
      : tone === "warn"
        ? "#b45309"
        : tone === "bad"
          ? "#dc2626"
          : NAVY;
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
      <div className="mt-0.5" style={{ color: LINKEDIN_BLUE }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-bold" style={{ color: toneColor }}>
            {value}
          </span>
        </div>
        {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}

export function DeliveryMetricsCard({
  metrics,
}: {
  metrics?: DeliveryMetrics | null;
}) {
  if (!metrics || !metrics.available) return null;

  const paceTone =
    metrics.paceBand === "ideal" ? "good" : "warn";
  const fillerTone =
    metrics.fillerWordsPerMin <= 3
      ? "good"
      : metrics.fillerWordsPerMin <= 6
        ? "warn"
        : "bad";
  const talkTone =
    metrics.talkListenRatio >= 40 && metrics.talkListenRatio <= 60
      ? "good"
      : "warn";
  const monologueTone =
    metrics.longestMonologueSec <= 45 ? "good" : "warn";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      data-testid="card-delivery-metrics"
    >
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5" style={{ color: LINKEDIN_BLUE }} />
        <h3 className="text-lg font-bold" style={{ color: NAVY }}>
          Delivery Metrics
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <MetricRow
          icon={<Gauge className="h-4 w-4" />}
          label="Speaking pace"
          value={`${metrics.paceWpm} wpm`}
          hint={`${metrics.paceBand} (ideal 120–175)`}
          tone={paceTone}
        />
        <MetricRow
          icon={<MessageSquareWarning className="h-4 w-4" />}
          label="Filler words"
          value={`${metrics.fillerWordCount} (${metrics.fillerWordsPerMin}/min)`}
          hint="um, uh, like, you know…"
          tone={fillerTone}
        />
        <MetricRow
          icon={<Ear className="h-4 w-4" />}
          label="Talk vs listen"
          value={`${metrics.talkListenRatio}% talking`}
          hint="40–60% is healthy for discovery"
          tone={talkTone}
        />
        <MetricRow
          icon={<Mic className="h-4 w-4" />}
          label="Interruptions"
          value={`${metrics.interruptions}`}
          hint="times you cut off the buyer"
          tone={metrics.interruptions <= 1 ? "good" : "warn"}
        />
        <MetricRow
          icon={<Clock className="h-4 w-4" />}
          label="Longest monologue"
          value={formatTime(metrics.longestMonologueSec)}
          hint="keep under ~45s without a check-in"
          tone={monologueTone}
        />
        <MetricRow
          icon={<Clock className="h-4 w-4" />}
          label="Avg response pause"
          value={`${metrics.avgResponseDelaySec}s`}
          hint="before you replied"
          tone="neutral"
        />
      </div>
    </motion.div>
  );
}

export function AcousticCard({
  acoustic,
}: {
  acoustic?: AcousticScores | null;
}) {
  if (!acoustic || !acoustic.available) return null;

  const bars: { label: string; value: number }[] = [
    { label: "Vocal Confidence", value: acoustic.vocalConfidence },
    { label: "Energy", value: acoustic.energy },
    { label: "Composure Under Pressure", value: acoustic.composureUnderPressure },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      data-testid="card-acoustic"
    >
      <div className="mb-4 flex items-center gap-2">
        <Mic className="h-5 w-5" style={{ color: LINKEDIN_BLUE }} />
        <h3 className="text-lg font-bold" style={{ color: NAVY }}>
          Voice & Sentiment
        </h3>
      </div>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label} data-testid={`bar-acoustic-${b.label.replace(/\s+/g, "-").toLowerCase()}`}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-gray-600">{b.label}</span>
              <span className="text-sm font-bold" style={{ color: NAVY }}>
                {Math.round(b.value)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, b.value))}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full"
                style={{ backgroundColor: LINKEDIN_BLUE }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {acoustic.repSentimentArc && (
          <div className="flex items-start gap-2">
            <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" style={{ color: LINKEDIN_BLUE }} />
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: NAVY }}>Your tone: </span>
              {acoustic.repSentimentArc}
            </p>
          </div>
        )}
        {acoustic.buyerSentimentShift && (
          <div className="flex items-start gap-2">
            <Ear className="mt-0.5 h-4 w-4 shrink-0" style={{ color: LINKEDIN_BLUE }} />
            <p className="text-gray-600">
              <span className="font-semibold" style={{ color: NAVY }}>Buyer's reaction: </span>
              {acoustic.buyerSentimentShift}
            </p>
          </div>
        )}
        {acoustic.summary && (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">{acoustic.summary}</p>
        )}
      </div>
    </motion.div>
  );
}

export function TimestampedMoments({
  moments,
}: {
  moments?: TimestampedMoment[] | null;
}) {
  if (!moments || moments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      data-testid="card-timestamped-moments"
    >
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" style={{ color: LINKEDIN_BLUE }} />
        <h3 className="text-lg font-bold" style={{ color: NAVY }}>
          Key Moments
        </h3>
      </div>
      <div className="space-y-3">
        {moments.map((m, i) => {
          const isStrength = m.type === "strength";
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border-l-4 bg-gray-50 px-3 py-2.5"
              style={{ borderLeftColor: isStrength ? "#16a34a" : "#dc2626" }}
              data-testid={`moment-${i}`}
            >
              <div className="mt-0.5">
                {isStrength ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold" style={{ color: NAVY }}>
                    {m.label}
                  </span>
                  {m.timestampSec !== null && m.timestampSec !== undefined && (
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
                      {formatTime(m.timestampSec)}
                    </span>
                  )}
                </div>
                {m.quote && (
                  <p className="mt-1 text-xs italic text-gray-500">"{m.quote}"</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function SkillsAnalysis({
  dimensionScores,
  deliveryMetrics,
  acousticScores,
  timestampedMoments,
}: {
  dimensionScores?: DimensionScores | null;
  deliveryMetrics?: DeliveryMetrics | null;
  acousticScores?: AcousticScores | null;
  timestampedMoments?: TimestampedMoment[] | null;
}) {
  const hasAny =
    dimensionScores ||
    (deliveryMetrics && deliveryMetrics.available) ||
    (acousticScores && acousticScores.available) ||
    (timestampedMoments && timestampedMoments.length > 0);
  if (!hasAny) return null;

  return (
    <div className="space-y-6">
      <SkillsRadar scores={dimensionScores} />
      <DeliveryMetricsCard metrics={deliveryMetrics} />
      <AcousticCard acoustic={acousticScores} />
      <TimestampedMoments moments={timestampedMoments} />
    </div>
  );
}
