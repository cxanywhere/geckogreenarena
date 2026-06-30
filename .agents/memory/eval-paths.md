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

Delivery metrics are heuristic (`server/delivery-metrics.ts`, WORDS_PER_SECOND≈2.5) — there is no real word-level timing, so pace/monologue/pause numbers are estimates, not ground truth. Rep = role "user".

Shared types live at the end of `shared/schema.ts`: DimensionScores, DIMENSION_LABELS, DeliveryMetrics, AcousticScores, TimestampedMoment. Frontend skills-map UI is one shared component `client/src/components/skills-analysis.tsx` used by all three results surfaces.
