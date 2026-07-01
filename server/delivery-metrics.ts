import type { DeliveryMetrics } from "@shared/schema";

export interface TimedUtterance {
  role: string; // "user" (rep) | anything else (buyer/model/assistant/bot)
  content: string;
  secondsFromStart: number;
  // Real spoken duration of this turn in seconds, when the transcription source
  // provides it (e.g. VAPI per-turn duration/endTime). When present, this is used
  // instead of the words-per-second estimate below.
  durationSec?: number;
}

const FILLER_PATTERNS = [
  /\bum+\b/gi,
  /\buh+\b/gi,
  /\ber+\b/gi,
  /\bhmm+\b/gi,
  /\blike\b/gi,
  /\byou know\b/gi,
  /\bi mean\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bliterally\b/gi,
  /\bsort of\b/gi,
  /\bkind of\b/gi,
  /\bso yeah\b/gi,
];

const WORDS_PER_SECOND = 2.5; // ~150 wpm average speaking estimate for duration approximation

function isRep(role: string): boolean {
  return role === "user";
}

function countWords(text: string): number {
  const t = (text || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function countFillers(text: string): number {
  let total = 0;
  for (const pattern of FILLER_PATTERNS) {
    const matches = (text || "").match(pattern);
    if (matches) total += matches.length;
  }
  return total;
}

function emptyMetrics(): DeliveryMetrics {
  return {
    available: false,
    paceWpm: 0,
    paceBand: "ideal",
    fillerWordCount: 0,
    fillerWordsPerMin: 0,
    talkListenRatio: 0,
    interruptions: 0,
    longestMonologueSec: 0,
    avgResponseDelaySec: 0,
    repSpeakingSec: 0,
    buyerSpeakingSec: 0,
    timingSource: "estimated",
  };
}

interface ResolvedTurn {
  role: string;
  content: string;
  words: number;
  startSec: number;
  endSec: number;
  speakSec: number;
  measured: boolean;
}

/**
 * Resolve each turn's spoken duration, preferring real per-turn timing when the
 * transcription source supplies it (`durationSec`) and only falling back to a
 * words-per-second heuristic when it does not.
 *
 * For the heuristic fallback we estimate each turn's spoken duration as the
 * smaller of (a) the gap until the next turn and (b) an estimate from word
 * count, which keeps long pauses from being counted as speaking time.
 */
function resolveTurns(timed: TimedUtterance[], endBound: number): ResolvedTurn[] {
  return timed.map((cur, i) => {
    const words = countWords(cur.content);
    const hasRealDuration =
      typeof cur.durationSec === "number" && !isNaN(cur.durationSec) && cur.durationSec > 0;

    let speakSec: number;
    if (hasRealDuration) {
      // Real measured speaking time from the audio — use as-is.
      speakSec = Math.max(0.5, cur.durationSec as number);
    } else {
      const nextStart = i < timed.length - 1 ? timed[i + 1].secondsFromStart : endBound;
      const gap = Math.max(0, nextStart - cur.secondsFromStart);
      const estSpeak = words / WORDS_PER_SECOND;
      speakSec = Math.max(0.5, Math.min(estSpeak, gap > 0 ? gap : estSpeak));
    }

    return {
      role: cur.role,
      content: cur.content,
      words,
      startSec: cur.secondsFromStart,
      endSec: cur.secondsFromStart + speakSec,
      speakSec,
      measured: hasRealDuration,
    };
  });
}

/**
 * Compute delivery metrics from timestamped utterances. Uses real per-turn audio
 * timing (`durationSec`) when available and flags the result via `timingSource`;
 * otherwise falls back to a words-per-second estimate.
 */
export function computeDeliveryMetrics(
  utterances: TimedUtterance[],
  totalDurationSec?: number,
): DeliveryMetrics {
  const timed = (utterances || [])
    .filter(u => typeof u.secondsFromStart === "number" && !isNaN(u.secondsFromStart) && (u.content || "").trim().length > 0)
    .sort((a, b) => a.secondsFromStart - b.secondsFromStart);

  if (timed.length < 2) {
    return emptyMetrics();
  }

  const last = timed[timed.length - 1];
  const lastEst = typeof last.durationSec === "number" && last.durationSec > 0
    ? last.durationSec
    : countWords(last.content) / WORDS_PER_SECOND;
  const endBound = Math.max(totalDurationSec || 0, last.secondsFromStart + lastEst);

  const turns = resolveTurns(timed, endBound);
  const measuredTurns = turns.filter(t => t.measured).length;

  let repWords = 0;
  let repFillers = 0;
  let repSpeakingSec = 0;
  let buyerSpeakingSec = 0;
  let longestMonologueSec = 0;
  let interruptions = 0;
  const responseDelays: number[] = [];

  for (let i = 0; i < turns.length; i++) {
    const cur = turns[i];

    if (isRep(cur.role)) {
      repWords += cur.words;
      repFillers += countFillers(cur.content);
      repSpeakingSec += cur.speakSec;
      if (cur.speakSec > longestMonologueSec) longestMonologueSec = cur.speakSec;
    } else {
      buyerSpeakingSec += cur.speakSec;
    }

    // interruption + response delay analysis (turn vs previous turn of opposite role)
    if (i > 0) {
      const prev = turns[i - 1];
      if (isRep(prev.role) !== isRep(cur.role)) {
        const prevEnd = prev.endSec;
        const overlapped = cur.startSec < prevEnd - 1.0;
        if (overlapped && isRep(cur.role)) {
          // rep started talking notably before the buyer likely finished —
          // i.e. the rep cut off the buyer. Buyer-on-rep overlap is not counted.
          interruptions++;
        } else if (!overlapped && isRep(cur.role)) {
          // rep responding after buyer finished — measure thinking delay
          responseDelays.push(Math.max(0, cur.startSec - prevEnd));
        }
      }
    }
  }

  // Consider the result "measured" only when real timing covers at least half the
  // turns; otherwise the numbers are dominated by the heuristic and we flag them.
  const timingSource: DeliveryMetrics["timingSource"] =
    measuredTurns >= Math.ceil(turns.length / 2) ? "measured" : "estimated";

  const repMinutes = repSpeakingSec / 60;
  const paceWpm = repMinutes > 0 ? Math.round(repWords / repMinutes) : 0;
  let paceBand: DeliveryMetrics["paceBand"] = "ideal";
  if (paceWpm > 0 && paceWpm < 120) paceBand = "too slow";
  else if (paceWpm > 175) paceBand = "too fast";

  const totalSpeaking = repSpeakingSec + buyerSpeakingSec;
  const talkListenRatio = totalSpeaking > 0 ? Math.round((repSpeakingSec / totalSpeaking) * 100) : 0;
  const fillerWordsPerMin = repMinutes > 0 ? Math.round((repFillers / repMinutes) * 10) / 10 : 0;
  const avgResponseDelaySec = responseDelays.length > 0
    ? Math.round((responseDelays.reduce((a, b) => a + b, 0) / responseDelays.length) * 10) / 10
    : 0;

  return {
    available: true,
    paceWpm,
    paceBand,
    fillerWordCount: repFillers,
    fillerWordsPerMin,
    talkListenRatio,
    interruptions,
    longestMonologueSec: Math.round(longestMonologueSec),
    avgResponseDelaySec,
    repSpeakingSec: Math.round(repSpeakingSec),
    buyerSpeakingSec: Math.round(buyerSpeakingSec),
    timingSource,
  };
}

/** Format a timestamped transcript for the LLM so it can cite [mm:ss] moments. */
export function formatTimedTranscript(utterances: TimedUtterance[]): string {
  return (utterances || [])
    .filter(u => (u.content || "").trim().length > 0)
    .map(u => {
      const s = Math.max(0, Math.round(u.secondsFromStart || 0));
      const mm = Math.floor(s / 60);
      const ss = (s % 60).toString().padStart(2, "0");
      const speaker = isRep(u.role) ? "SALES REP" : "BUYER";
      return `[${mm}:${ss}] ${speaker}: ${u.content}`;
    })
    .join("\n");
}
