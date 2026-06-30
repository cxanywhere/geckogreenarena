import type { DeliveryMetrics } from "@shared/schema";

export interface TimedUtterance {
  role: string; // "user" (rep) | anything else (buyer/model/assistant/bot)
  content: string;
  secondsFromStart: number;
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
  };
}

/**
 * Compute delivery metrics from timestamped utterances.
 *
 * VAPI / structured transcripts give us a `secondsFromStart` per turn but no
 * explicit per-turn end time. We estimate each turn's spoken duration as the
 * smaller of (a) the gap until the next turn and (b) an estimate from word
 * count, which keeps long pauses from being counted as speaking time.
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

  const lastStart = timed[timed.length - 1].secondsFromStart;
  const endBound = Math.max(totalDurationSec || 0, lastStart + countWords(timed[timed.length - 1].content) / WORDS_PER_SECOND);

  let repWords = 0;
  let repFillers = 0;
  let repSpeakingSec = 0;
  let buyerSpeakingSec = 0;
  let longestMonologueSec = 0;
  let interruptions = 0;
  const responseDelays: number[] = [];

  for (let i = 0; i < timed.length; i++) {
    const cur = timed[i];
    const nextStart = i < timed.length - 1 ? timed[i + 1].secondsFromStart : endBound;
    const gap = Math.max(0, nextStart - cur.secondsFromStart);
    const words = countWords(cur.content);
    const estSpeak = words / WORDS_PER_SECOND;
    // actual speaking time for this turn: bounded by the gap to next turn
    const speakSec = Math.max(0.5, Math.min(estSpeak, gap > 0 ? gap : estSpeak));

    if (isRep(cur.role)) {
      repWords += words;
      repFillers += countFillers(cur.content);
      repSpeakingSec += speakSec;
      if (speakSec > longestMonologueSec) longestMonologueSec = speakSec;
    } else {
      buyerSpeakingSec += speakSec;
    }

    // interruption + response delay analysis (turn vs previous turn of opposite role)
    if (i > 0) {
      const prev = timed[i - 1];
      if (isRep(prev.role) !== isRep(cur.role)) {
        const prevEstEnd = prev.secondsFromStart + countWords(prev.content) / WORDS_PER_SECOND;
        const overlapped = cur.secondsFromStart < prevEstEnd - 1.0;
        if (overlapped && isRep(cur.role)) {
          // rep started talking notably before the buyer likely finished —
          // i.e. the rep cut off the buyer. Buyer-on-rep overlap is not counted.
          interruptions++;
        } else if (!overlapped && isRep(cur.role)) {
          // rep responding after buyer finished — measure thinking delay
          responseDelays.push(Math.max(0, cur.secondsFromStart - prevEstEnd));
        }
      }
    }
  }

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
