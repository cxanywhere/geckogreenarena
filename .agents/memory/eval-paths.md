---
name: AI evaluation paths & skills-map data flow
description: How the 4 AI grading paths persist/return multi-dimensional scoring, and the gotchas when extending them
---

There are four separate AI grading paths in `server/routes.ts`, each with its own Gemini call + JSON parse + RETRY prompt. Any new feedback field must be added to BOTH the main prompt AND the retry/reformat prompt, or it silently disappears whenever the first parse fails (common with LLM JSON).

- `/api/vapi/evaluate` — voice roleplay. Only path with a server-side callId → recordingUrl, so it is the only place acoustic audio analysis runs. Has timestamped turns from VAPI. VAPI sometimes returns `transcript` text with an EMPTY structured `messages` list — must fall back to parsing the plain transcript or grading runs on near-empty content.
- text roleplay end — no timestamps, no audio; stricter grading only.
- pitch evaluate — has `structuredTranscript` (timestamp in ms + slideIndex), NO recordingUrl. Persists skills-map data to dedicated `pitch_sessions` jsonb columns (dimension_scores, delivery_metrics, acoustic_scores, timestamped_moments).
- abm evaluate — text transcript; client can send `structuredTranscript` (ms timestamps) to enable delivery metrics. Persists skills-map data INSIDE the existing `feedback` JSON column (no schema change).

**Why:** roleplay & ABM reuse an existing feedback JSON blob, pitch has typed columns — so persistence shape differs per path; the frontend reads accordingly (results.tsx & abm read from feedback object, pitch-results reads from session columns).

Delivery metrics (`server/delivery-metrics.ts`) prefer REAL per-turn timing when a source supplies it via `TimedUtterance.durationSec`, and fall back to the WORDS_PER_SECOND≈2.5 heuristic otherwise. `DeliveryMetrics.timingSource` = "measured" when real timing covers ≥50% of turns, else "estimated" (frontend shows an amber "Estimated" badge). Only the VAPI voice path has real timing — `vapi-service.ts` maps each message's `duration` (ms) / `endTime-time` into `timedMessages[].durationSeconds`. Pitch & ABM use client `structuredTranscript` with start timestamps only, so they stay "estimated". Rep = role "user".

Shared types live at the end of `shared/schema.ts`: DimensionScores, DIMENSION_LABELS, DeliveryMetrics, AcousticScores, TimestampedMoment, BetterPhrasing, MissedPoint. Frontend skills-map UI is one shared component `client/src/components/skills-analysis.tsx` used by all three results surfaces.

Coaching fields `betterResponses` (BetterPhrasing[]) & `missedPoints` (MissedPoint[]) follow the same per-path persistence split: pitch → typed `pitch_sessions` jsonb columns; roleplay & ABM → inside the feedback JSON blob. All render via `SkillsAnalysis` (CoachingImprovements sub-block) and degrade gracefully (return null on empty/absent arrays). Voice roleplay flows automatically because `/api/vapi/evaluate` spreads `...feedback` from `evaluateRoleplay` — new RoleplayFeedback fields need NO extra route wiring, only the prompt+responseSchema in gemini.ts.
