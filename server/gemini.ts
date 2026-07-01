import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import type { DimensionScores, DimensionRationales, DeliveryMetrics, AcousticScores, TimestampedMoment, BetterPhrasing, MissedPoint } from "@shared/schema";

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const aiIntegration = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

function getClient(): GoogleGenAI {
  return ai || aiIntegration;
}

export interface GeneratedImage {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  error?: string;
}

const CHAPTER_COVER_PROMPTS: Record<string, string> = {
  "LMS Fundamentals and Product Landscape": "A vibrant, modern 3D illustration of a glowing LinkedIn Blue (#0A66C2) professional network globe with interconnected nodes representing B2B advertising connections. Dynamic light rays emanate outward. Abstract floating geometric shapes (hexagons, data points) in LinkedIn Blue (#0A66C2) and white orbit the globe. Professional, business-focused, digital marketing feel. No text whatsoever. 16:9 aspect ratio.",
  "Buyer Conversations, Discovery, and Positioning": "A modern 3D illustration showing a magnifying glass with a LinkedIn Blue (#0A66C2) rim hovering over abstract buyer persona silhouettes arranged around a discovery framework diagram. The ideal buyer glows bright blue at the center while others fade to light gray. Floating conversation bubbles and connection lines. Sleek, consultative, professional vibe. No text whatsoever. 16:9 aspect ratio.",
  "Objections, Strategy, and Selling with Confidence": "A dynamic 3D illustration of a confident professional figure standing on a strategic chess board, with LinkedIn Blue (#0A66C2) pieces positioned for victory. Lightning-like energy radiates from the central piece. Floating objection-handling shields and strategy icons orbit around. Strategic, confident, winning energy against a clean white and light gray background. No text whatsoever. 16:9 aspect ratio.",
};

export async function generateChapterImage(
  chapterTitle: string,
  chapterDescription: string
): Promise<GeneratedImage> {
  const customPrompt = CHAPTER_COVER_PROMPTS[chapterTitle];
  const prompt = customPrompt || `Create a vibrant, modern 3D illustration for a LinkedIn Marketing Solutions sales training chapter about "${chapterTitle}". Use LinkedIn Blue (#0A66C2) as the primary accent color and white/light gray as the background. Professional, business-focused, B2B advertising feel with abstract shapes and glowing elements. No text or words whatsoever. 16:9 aspect ratio.`;

  const clients: { name: string; client: GoogleGenAI }[] = [
    ...(ai ? [{ name: "user-key", client: ai }] : []),
    { name: "replit-integration", client: aiIntegration },
  ];

  for (const { name, client } of clients) {
    try {
      console.log(`[ChapterImage] Trying ${name}...`);
      const response = await client.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          responseModalities: ["Text", "Image"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        console.log(`[ChapterImage] ${name}: No response parts`);
        continue;
      }

      for (const part of parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (imageData) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            const filename = `chapter-${chapterTitle.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
            const filepath = path.join(uploadsDir, filename);
            
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync(filepath, buffer);
            
            console.log(`[ChapterImage] ${name}: Success`);
            return {
              success: true,
              imagePath: filepath,
              imageUrl: `/uploads/${filename}`,
            };
          }
        }
      }

      console.log(`[ChapterImage] ${name}: No image data in response`);
    } catch (error: any) {
      console.error(`[ChapterImage] ${name} failed:`, error.message || error);
      if (!error.message?.includes("429") && !error.message?.includes("quota")) {
        return { success: false, error: error.message || "Image generation failed" };
      }
    }
  }

  return { success: false, error: "All API keys exhausted or failed" };
}

export async function generatePersonaImage(
  personaName: string,
  personaRole: string,
  traits: string[],
  difficulty: string,
  resistanceLevel: number
): Promise<GeneratedImage> {
  const personalityDescription = traits.slice(0, 3).join(", ");
  const resistanceDesc = resistanceLevel > 70 ? "skeptical and guarded" : 
                         resistanceLevel > 40 ? "cautious but approachable" : "friendly and open";
  
  const ageRange = difficulty === "Advanced" ? "45-65 years old" : 
                   difficulty === "Intermediate" ? "35-55 years old" : "30-50 years old";

  const prompt = `Create a photorealistic portrait of a B2B marketing buyer for a LinkedIn Marketing Solutions sales training simulation.

CHARACTER: "${personaRole}"
PERSONALITY: ${personalityDescription}
DEMEANOR: ${resistanceDesc}
AGE: ${ageRange}

REQUIREMENTS:
- Photorealistic, high-quality headshot/portrait
- Natural lighting, modern office, conference room, or corporate setting
- Subject should be looking at camera with expression matching their personality
- Diverse marketing executive / buyer - can be any ethnicity, gender
- Professional business attire
- Expression should convey: ${resistanceDesc}
- Background hints at a modern corporate office
- Square portrait format, centered on face
- Professional photography quality
- NO text, logos, watermarks, or branding
- Natural, authentic look - NOT a stock photo feel

The image should look like a real B2B marketing leader you might meet in a LinkedIn advertising sales conversation.`;

  const clients: { name: string; client: GoogleGenAI }[] = [
    ...(ai ? [{ name: "user-key", client: ai }] : []),
    { name: "replit-integration", client: aiIntegration },
  ];

  for (const { name, client } of clients) {
    try {
      console.log(`[PersonaImage] Trying ${name}...`);
      const response = await client.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: prompt,
        config: {
          responseModalities: ["Text", "Image"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (!parts) {
        console.log(`[PersonaImage] ${name}: No response parts`);
        continue;
      }

      for (const part of parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (imageData) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            const safeName = personaRole.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
            const filename = `persona-${safeName}-${Date.now()}.png`;
            const filepath = path.join(uploadsDir, filename);
            
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync(filepath, buffer);
            
            console.log(`[PersonaImage] ${name}: Success`);
            return {
              success: true,
              imagePath: filepath,
              imageUrl: `/uploads/${filename}`,
            };
          }
        }
      }

      console.log(`[PersonaImage] ${name}: No image data in response`);
    } catch (error: any) {
      console.error(`[PersonaImage] ${name} failed:`, error.message || error);
      if (!error.message?.includes("429") && !error.message?.includes("quota")) {
        return { success: false, error: error.message || "Image generation failed" };
      }
    }
  }

  return { success: false, error: "All API keys exhausted or failed" };
}

export async function generateLogoImage(
  prompt: string,
  filename: string
): Promise<GeneratedImage> {
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return { success: false, error: "No response parts received" };
    }

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const safeFilename = `${filename}-${Date.now()}.png`;
          const filepath = path.join(uploadsDir, safeFilename);
          
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          return {
            success: true,
            imagePath: filepath,
            imageUrl: `/uploads/${safeFilename}`,
          };
        }
      }
    }

    return { success: false, error: "No image data in response" };
  } catch (error: any) {
    console.error("Failed to generate logo image:", error);
    return { success: false, error: error.message || "Image generation failed" };
  }
}

export async function generateBattlecardImage(
  battlecardNumber: number,
  title: string,
  useWhen: string,
  goal: string,
  keyPoints: string[],
  talkTrack: string,
  coachLine: string
): Promise<GeneratedImage> {
  const prompt = `Create a professional, detailed infographic battlecard for sales training.

BATTLECARD #${battlecardNumber}: "${title}"

CONTENT TO DISPLAY:
- Title: "${title}" (prominently displayed at top)
- Use When: "${useWhen}"
- Goal: "${goal}"
- Key Points: ${keyPoints.map((p, i) => `${i + 1}. ${p}`).join(", ")}
- Talk Track/Script: "${talkTrack}"
- Coach Line: "${coachLine}"

DESIGN REQUIREMENTS:
- Professional LinkedIn Blue (#0A66C2) background with white and light gray accents
- Clean, modern corporate infographic style
- All text must be clearly legible and well-organized
- Use icons/visual elements to represent each section
- Card number "${battlecardNumber}" in top corner
- Title prominently at top in large bold white text
- Organized sections with clear visual hierarchy
- LinkedIn Marketing Solutions branding (B2B advertising)
- Include visual icons for "When to Use", "Goal", "Key Points", "Script"
- Professional sales training document aesthetic
- Dimensions: Portrait orientation, suitable for mobile viewing
- Include checkmarks or bullet icons for key points
- Quote bubble or script icon for the talk track section
- Lightbulb or star icon for the coach line

Create a visually stunning, information-rich battlecard that a LinkedIn Marketing Solutions rep could quickly reference during B2B advertising sales conversations.`;

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return { success: false, error: "No response parts received" };
    }

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads", "battlecards");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const safeName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 40);
          const filename = `battlecard-${battlecardNumber}-${safeName}-${Date.now()}.png`;
          const filepath = path.join(uploadsDir, filename);
          
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          return {
            success: true,
            imagePath: filepath,
            imageUrl: `/uploads/battlecards/${filename}`,
          };
        }
      }
    }

    return { success: false, error: "No image data in response" };
  } catch (error: any) {
    console.error("Failed to generate battlecard image:", error);
    return { success: false, error: error.message || "Image generation failed" };
  }
}

export interface RoleplayMessage {
  role: "user" | "model";
  content: string;
}

export interface RoleplayScenario {
  name: string;
  role: string;
  description: string;
  traits: string[];
  difficulty: string;
  stats: {
    buy_signal: number;
    objections: number;
    resistance: number;
  };
}

function buildPersonaPrompt(scenario: RoleplayScenario): string {
  const resistanceLevel = scenario.stats.resistance > 70 ? "very resistant" : 
                          scenario.stats.resistance > 40 ? "moderately resistant" : "somewhat open";
  
  const buySignalLevel = scenario.stats.buy_signal > 50 ? "showing some interest" :
                         scenario.stats.buy_signal > 25 ? "cautiously curious" : "not showing interest";

  return `You are playing the role of a B2B marketing buyer in a sales training simulation for LinkedIn Marketing Solutions (LMS), LinkedIn's B2B advertising and demand generation platform.

CHARACTER PROFILE:
- Opening line/objection: "${scenario.name}"
- Role: ${scenario.role}
- Personality traits: ${scenario.traits.join(", ")}
- Difficulty level: ${scenario.difficulty}
- Resistance level: ${resistanceLevel} (${scenario.stats.resistance}/100)
- Buy signals: ${buySignalLevel} (${scenario.stats.buy_signal}/100)
- Objection frequency: ${scenario.stats.objections}/100

SCENARIO CONTEXT:
${scenario.description}

BEHAVIOR GUIDELINES:
1. Stay in character as this specific marketing buyer persona throughout the conversation
2. Start with your opening objection: "${scenario.name}"
3. React realistically to the sales rep's responses
4. If they handle objections well, gradually become more open (but maintain your personality)
5. If they push too hard or don't listen, become more resistant
6. Use natural, conversational language - you're a real person, not an AI
7. Keep responses concise (1-3 sentences typically, like a real sales call or meeting)
8. Eventually, if the rep does well, you may agree to hear more or schedule a follow-up
9. If the rep does poorly, you may end the meeting or firmly decline

IMPORTANT: 
- Never break character
- Never reveal you are an AI or part of a training simulation
- Respond as the marketing buyer would in a real B2B advertising sales conversation
- Your first message should be your opening objection/statement`;
}

export async function startRoleplayConversation(scenario: RoleplayScenario): Promise<string> {
  const systemPrompt = buildPersonaPrompt(scenario);
  
  const response = await getClient().models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: "Start the conversation with your opening line as the buyer.",
  });

  return response.text || scenario.name;
}

export async function continueRoleplayConversation(
  scenario: RoleplayScenario,
  history: RoleplayMessage[],
  userMessage: string
): Promise<string> {
  const systemPrompt = buildPersonaPrompt(scenario);
  
  const contents = history.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));
  
  contents.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  const response = await getClient().models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: contents,
  });

  return response.text || "...";
}

export interface RoleplayFeedback {
  passed: boolean;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  tips: string[];
  passFailReason: string;
  dimensionScores?: DimensionScores;
  dimensionRationales?: DimensionRationales;
  criticalMisses?: string[];
  timestampedMoments?: TimestampedMoment[];
  deliveryMetrics?: DeliveryMetrics;
  acousticScores?: AcousticScores;
  betterResponses?: BetterPhrasing[];
  missedPoints?: MissedPoint[];
}

export interface EvaluateRoleplayContext {
  deliveryMetrics?: DeliveryMetrics;
  timedTranscript?: string;
}

export async function evaluateRoleplay(
  scenario: RoleplayScenario,
  history: RoleplayMessage[],
  context?: EvaluateRoleplayContext
): Promise<RoleplayFeedback> {
  const plainTranscript = history.map(msg => 
    `${msg.role === "user" ? "SALES REP" : "BUYER"}: ${msg.content}`
  ).join("\n");
  const transcript = context?.timedTranscript || plainTranscript;

  // Extract pass criteria and fail conditions from description if available
  const passCriteriaMatch = scenario.description.match(/Pass criteria: ([^.]+\.)/i);
  const failConditionsMatch = scenario.description.match(/Fail conditions: ([^.]+\.)/i);
  const passCriteria = passCriteriaMatch ? passCriteriaMatch[1] : "Handle objections professionally and move toward next step";
  const failConditions = failConditionsMatch ? failConditionsMatch[1] : "Buyer ending the meeting, being rude, or giving up too easily";

  const dm = context?.deliveryMetrics;
  const deliveryBlock = dm?.available
    ? `MEASURED DELIVERY METRICS (computed from the call audio timing — factor these into the "delivery" dimension):
- Speaking pace: ${dm.paceWpm} words/min (${dm.paceBand}); ideal is roughly 120-175 wpm
- Filler words: ${dm.fillerWordCount} total (${dm.fillerWordsPerMin}/min) — high filler use signals low confidence
- Talk-to-listen ratio: rep spoke ${dm.talkListenRatio}% of the time (great discovery reps listen more; ~40-55% rep talk is healthy)
- Interruptions of the buyer: ${dm.interruptions}
- Longest uninterrupted monologue: ${dm.longestMonologueSec}s (over ~45s without a check-in is a monologue red flag)
- Average pause before responding: ${dm.avgResponseDelaySec}s`
    : `DELIVERY METRICS: Not available for this session (text-only or no timing data). Judge "delivery" from clarity and structure of the written responses only, and keep that score moderate (cap around 75) since vocal delivery could not be measured.`;

  // Shared framing given to BOTH the scoring call and the coaching call so they
  // judge the exact same material.
  const sharedContext = `You are a DEMANDING, senior B2B sales coach for LinkedIn Marketing Solutions (LMS). You grade like a tough sales manager who has heard thousands of calls — you reward genuinely skilled selling and you do NOT inflate scores. Average reps get average scores. Generic, surface-level effort scores in the 40s-50s. Only sharp, consultative, well-executed selling earns 80+.

SCENARIO: ${scenario.name} - ${scenario.description}
DIFFICULTY: ${scenario.difficulty}

PASS CRITERIA (rep must genuinely achieve to pass):
${passCriteria}

FAIL CONDITIONS (any of these means the rep FAILS regardless of other strengths):
${failConditions}

TRANSCRIPT (timestamps in [mm:ss] when available):
${transcript}

${deliveryBlock}

CONTEXT (be fair, not lenient):
- This is a timed practice session that can end abruptly. Do NOT penalize for an abrupt ending or for not reaching a formal close.
- DO still expect the rep to have set up a next step or attempted to advance the deal if they had the chance.
- Judge what the rep actually said. Vague, generic, or feature-dumping language should score LOW even if polite.`;

  // CALL 1 — the numbers only (scores, rationales, pass/fail). Kept small so it
  // returns fast; runs in parallel with the coaching call below.
  const numbersPrompt = `${sharedContext}

YOUR JOB IN THIS RESPONSE: score the call only. Do NOT write long coaching prose.

SCORE SIX DIMENSIONS (each 0-100, be strict and use the full range):
1. discovery — Did they ask sharp, open questions to uncover business goals, audience, funnel gaps, current motion, and stakeholders? No real questions = below 40.
2. objectionHandling — Did they acknowledge the specific objection, stay non-defensive, and reframe with evidence/value rather than discounting or getting pushy?
3. valueFraming — Did they connect LMS capabilities (professional-graph targeting, Lead Gen Forms, full-funnel, measurable pipeline) to THIS buyer's outcomes, not generic features?
4. delivery — Clarity, confidence, concision, structure, and vocal delivery (use the measured metrics above when available).
5. activeListening — Did they build on what the buyer said, reference it, and avoid talking over the buyer / monologuing?
6. nextStepClarity — Did they propose or secure a concrete, mutually agreed next step?

For EACH of the six dimensions, also return a dimensionRationales entry: ONE short sentence (max ~15 words) that explains WHY it earned that score, grounded in what the rep ACTUALLY said or failed to say in THIS conversation. Be specific, not generic (e.g. "Asked no open discovery questions before pitching" — not "Discovery could be better").

CRITICAL MISSES (list any that occurred in criticalMisses[]). Each critical miss CAPS the overall score:
- Ignored or talked over the core objection → cap overall at 55
- Pure feature-dump with no discovery question at all → cap overall at 50
- Got defensive, argumentative, pushy, or discounted immediately to win → cap overall at 50
- Triggered an explicit FAIL CONDITION → cap overall at 45 and passed=false
- Made things up / false claims about LMS → cap overall at 45

OVERALL SCORE = weighted blend of dimensions: objectionHandling 30%, discovery 20%, valueFraming 20%, activeListening 12%, nextStepClarity 10%, delivery 8% — THEN apply the lowest applicable critical-miss cap. Round to an integer.

PASS BAR: passed = true ONLY if overallScore >= 70 AND no FAIL CONDITION was triggered AND objectionHandling >= 60. Most genuinely-average attempts should NOT pass.

- passFailReason: one direct sentence explaining the verdict.

Be specific and honest. A demanding coach helps reps improve by telling the truth.`;

  // CALL 2 — the written coaching (no numeric scores). Uses the same weighting
  // language so its narrative stays consistent with the numbers call.
  const coachingPrompt = `${sharedContext}

The call is being scored separately on six dimensions (discovery, objection handling, value framing, delivery, active listening, next-step clarity) using a demanding bar where only sharp, consultative selling earns high marks.

YOUR JOB IN THIS RESPONSE: write the coaching feedback only. Do NOT return any numeric scores or pass/fail verdict.

Return:
- strengths: 2-4 specific, honest strengths (no fluff). If there are few, say so.
- improvements: 2-4 specific, actionable improvements.
- timestampedMoments: 2-5 pivotal moments. Each has timestampSec (integer seconds parsed from the [mm:ss] tag, or null if unknown), type ("strength" or "weakness"), a short label, and a short quote from the transcript.
- keyMoments: 2-4 plain-text highlights (for backward compatibility).
- tips: 2-3 concrete coaching tips for next time.
- betterResponses: 2-4 items titled "How you could have said it better". Each MUST be grounded in something the rep ACTUALLY said: youSaid = a short, near-verbatim quote of the rep's words from the transcript; betterVersion = a stronger rewrite of that exact line; why = one short sentence on why the rewrite lands better. Do NOT invent quotes. If the rep barely spoke or nothing is worth rewriting, return an empty array.
- missedPoints: 2-4 items titled "What you missed saying" — important points or questions the rep should have raised for THIS scenario but never did (e.g. an unasked discovery question, an un-surfaced value point, a next step never proposed). Each has: point = what they should have said/asked; why = one short sentence on why it matters here. If the rep genuinely covered the essentials, return an empty array.

Be specific and honest. A demanding coach helps reps improve by telling the truth.`;

  const numbersSchema = {
    type: "object",
    properties: {
      passed: { type: "boolean" },
      overallScore: { type: "number" },
      dimensionScores: {
        type: "object",
        properties: {
          discovery: { type: "number" },
          objectionHandling: { type: "number" },
          valueFraming: { type: "number" },
          delivery: { type: "number" },
          activeListening: { type: "number" },
          nextStepClarity: { type: "number" },
        },
        required: ["discovery", "objectionHandling", "valueFraming", "delivery", "activeListening", "nextStepClarity"],
      },
      dimensionRationales: {
        type: "object",
        properties: {
          discovery: { type: "string" },
          objectionHandling: { type: "string" },
          valueFraming: { type: "string" },
          delivery: { type: "string" },
          activeListening: { type: "string" },
          nextStepClarity: { type: "string" },
        },
        required: ["discovery", "objectionHandling", "valueFraming", "delivery", "activeListening", "nextStepClarity"],
      },
      criticalMisses: { type: "array", items: { type: "string" } },
      passFailReason: { type: "string" },
    },
    required: ["passed", "overallScore", "dimensionScores", "dimensionRationales", "passFailReason"],
  };

  const coachingSchema = {
    type: "object",
    properties: {
      strengths: { type: "array", items: { type: "string" } },
      improvements: { type: "array", items: { type: "string" } },
      keyMoments: { type: "array", items: { type: "string" } },
      timestampedMoments: {
        type: "array",
        items: {
          type: "object",
          properties: {
            timestampSec: { type: "number", nullable: true },
            type: { type: "string", enum: ["strength", "weakness"] },
            label: { type: "string" },
            quote: { type: "string" },
          },
          required: ["type", "label"],
        },
      },
      tips: { type: "array", items: { type: "string" } },
      betterResponses: {
        type: "array",
        items: {
          type: "object",
          properties: {
            youSaid: { type: "string" },
            betterVersion: { type: "string" },
            why: { type: "string" },
          },
          required: ["youSaid", "betterVersion", "why"],
        },
      },
      missedPoints: {
        type: "array",
        items: {
          type: "object",
          properties: {
            point: { type: "string" },
            why: { type: "string" },
          },
          required: ["point", "why"],
        },
      },
    },
    required: ["strengths", "improvements", "keyMoments", "tips"],
  };

  // Run each call in its own try so a failure/parse-error in one half never
  // takes down the other — the failing half falls back to a default.
  async function runCall<T>(prompt: string, schema: object, label: string): Promise<T | null> {
    try {
      const response = await getClient().models.generateContent({
        model: "gemini-2.5-flash",
        config: { responseMimeType: "application/json", responseSchema: schema },
        contents: prompt,
      });
      const rawJson = response.text;
      return rawJson ? (JSON.parse(rawJson) as T) : null;
    } catch (error) {
      console.error(`Failed to evaluate roleplay (${label}):`, error);
      return null;
    }
  }

  type NumbersHalf = Pick<RoleplayFeedback, "passed" | "overallScore" | "dimensionScores" | "dimensionRationales" | "criticalMisses" | "passFailReason">;
  type CoachingHalf = Pick<RoleplayFeedback, "strengths" | "improvements" | "keyMoments" | "timestampedMoments" | "tips" | "betterResponses" | "missedPoints">;

  // The two grading calls run concurrently: producing smaller responses in
  // parallel returns faster than one large combined response.
  const [numbers, coaching] = await Promise.all([
    runCall<NumbersHalf>(numbersPrompt, numbersSchema, "scores"),
    runCall<CoachingHalf>(coachingPrompt, coachingSchema, "coaching"),
  ]);

  const numbersHalf: NumbersHalf = numbers ?? {
    passed: false,
    overallScore: 50,
    dimensionScores: { discovery: 50, objectionHandling: 50, valueFraming: 50, delivery: 50, activeListening: 50, nextStepClarity: 50 },
    dimensionRationales: {
      discovery: "Score unavailable — evaluation could not be completed.",
      objectionHandling: "Score unavailable — evaluation could not be completed.",
      valueFraming: "Score unavailable — evaluation could not be completed.",
      delivery: "Score unavailable — evaluation could not be completed.",
      activeListening: "Score unavailable — evaluation could not be completed.",
      nextStepClarity: "Score unavailable — evaluation could not be completed.",
    },
    passFailReason: "Unable to evaluate - please try again",
  };

  const coachingHalf: CoachingHalf = coaching ?? {
    strengths: ["Completed the roleplay session"],
    improvements: ["Unable to generate detailed feedback"],
    keyMoments: ["Session completed"],
    tips: ["Try again for more detailed feedback"],
  };

  return {
    passed: numbersHalf.passed,
    overallScore: numbersHalf.overallScore,
    dimensionScores: numbersHalf.dimensionScores,
    dimensionRationales: numbersHalf.dimensionRationales,
    criticalMisses: numbersHalf.criticalMisses,
    passFailReason: numbersHalf.passFailReason,
    strengths: coachingHalf.strengths,
    improvements: coachingHalf.improvements,
    keyMoments: coachingHalf.keyMoments,
    timestampedMoments: coachingHalf.timestampedMoments,
    tips: coachingHalf.tips,
    betterResponses: coachingHalf.betterResponses,
    missedPoints: coachingHalf.missedPoints,
    deliveryMetrics: context?.deliveryMetrics,
  };
}

/**
 * Analyze the acoustic / vocal qualities and sentiment arc of a recorded call
 * using Gemini multimodal audio understanding. Degrades gracefully when no
 * recording is available or the audio can't be fetched.
 */
export async function analyzeCallAcoustics(recordingUrl?: string): Promise<AcousticScores> {
  const unavailable: AcousticScores = {
    available: false,
    vocalConfidence: 0,
    energy: 0,
    composureUnderPressure: 0,
    repSentimentArc: "",
    buyerSentimentShift: "",
    summary: "Audio analysis was not available for this session.",
  };

  if (!recordingUrl) return unavailable;

  try {
    const audioRes = await fetch(recordingUrl);
    if (!audioRes.ok) {
      console.warn(`analyzeCallAcoustics: failed to fetch recording (${audioRes.status})`);
      return unavailable;
    }
    const contentType = audioRes.headers.get("content-type") || "audio/wav";
    const buffer = Buffer.from(await audioRes.arrayBuffer());
    // Guard against very large files (Gemini inline data limits ~20MB)
    if (buffer.length > 19 * 1024 * 1024) {
      console.warn("analyzeCallAcoustics: recording too large for inline analysis");
      return unavailable;
    }
    const base64Audio = buffer.toString("base64");

    const prompt = `You are a vocal delivery and sentiment coach analyzing the AUDIO of a B2B sales practice call between a SALES REP (the human) and an AI BUYER. Listen to tone, pace, energy, hesitation, and emotional arc — not just the words.

Return JSON with:
- vocalConfidence (0-100): how confident, steady, and assured the rep SOUNDS.
- energy (0-100): the rep's vocal energy and engagement (flat/monotone = low).
- composureUnderPressure (0-100): how well the rep kept a calm, steady tone when challenged or pushed back on.
- repSentimentArc: one sentence on how the rep's tone evolved across the call (e.g. "started nervous, grew more confident").
- buyerSentimentShift: one sentence on whether the buyer warmed up, stayed neutral, or cooled off.
- summary: 1-2 sentences of vocal-delivery coaching.

Be honest and specific. If the audio is mostly silence or unintelligible, give low/neutral scores and say so in the summary.`;

    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            vocalConfidence: { type: "number" },
            energy: { type: "number" },
            composureUnderPressure: { type: "number" },
            repSentimentArc: { type: "string" },
            buyerSentimentShift: { type: "string" },
            summary: { type: "string" },
          },
          required: ["vocalConfidence", "energy", "composureUnderPressure", "repSentimentArc", "buyerSentimentShift", "summary"],
        },
      },
      contents: [
        { inlineData: { mimeType: contentType, data: base64Audio } },
        { text: prompt },
      ],
    });

    const rawJson = response.text;
    if (rawJson) {
      const parsed = JSON.parse(rawJson);
      return { available: true, ...parsed } as AcousticScores;
    }
    return unavailable;
  } catch (error) {
    console.error("analyzeCallAcoustics failed:", error);
    return unavailable;
  }
}

export async function generateArenaLogo(mode: "dark" | "light"): Promise<GeneratedImage> {
  const isDark = mode === "dark";
  
  const prompt = `Create a striking, modern logo icon for "LinkedIn Marketing Solutions" - LinkedIn's B2B advertising and demand generation platform.

DESIGN REQUIREMENTS:
- An abstract "L" letter mark with a professional network/advertising motif
- Geometric, clean design with flowing connection lines or growth elements
- Sophisticated, professional B2B advertising aesthetic
- The L should incorporate subtle elements suggesting professional networking, advertising reach, or business growth
- IMPORTANT: Add a refined GLOW effect around the logo outline

COLOR SCHEME FOR ${isDark ? "DARK MODE" : "LIGHT MODE"}:
${isDark 
  ? `- Primary color: LinkedIn Blue (#0A66C2) for the main logo shape
- GLOW EFFECT: Light blue (#70B5F9) neon glow emanating from the logo lines
- Accent color: Light blue (#70B5F9) for highlights and connection effects
- Background: Pure black (#000000) - this makes the glow pop
- The blue tones should create a professional, trusted feel against the dark background`
  : `- Primary color: LinkedIn Blue (#0A66C2) for the main logo shape
- SUBTLE GLOW: Soft light blue (#70B5F9) shadow/glow effect around the logo
- Accent color: Light blue (#70B5F9) for subtle highlight effects
- Background: Pure white (#FFFFFF) or very light gray (#F9FAFB)
- Clean, professional, premium look with subtle depth`
}

STYLE:
- Clean geometric design with refined GLOW effects
- Minimal, sophisticated shapes
- Professional B2B advertising aesthetic with growth elements
- ${isDark ? "Elegant luminous glow - refined and premium" : "Clean professional look with subtle shadows"}
- Professional, sophisticated, premium but approachable
- Square format, centered composition
- NO text, NO words, just the L icon with network/growth motif
- The glow effect should convey trust and professional reach

The overall feel should be: ${isDark ? "A premium, luminous emblem in darkness - trusted, professional, enterprise-grade" : "A clean, luxury brand mark - polished, confident, modern"}.`;

  try {
    const response = await getClient().models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      return { success: false, error: "No response parts received" };
    }

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const uploadsDir = path.join(process.cwd(), "client", "src", "assets");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const filename = `arena-logo-${mode}.png`;
          const filepath = path.join(uploadsDir, filename);
          
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          return {
            success: true,
            imagePath: filepath,
            imageUrl: `/src/assets/${filename}`,
          };
        }
      }
    }

    return { success: false, error: "No image data in response" };
  } catch (error: any) {
    console.error("Failed to generate Arena logo:", error);
    return { success: false, error: error.message || "Logo generation failed" };
  }
}

export async function generateSlideImage(
  chapterSlug: string,
  slideIndex: number,
  imagePrompt: string,
  slideTitle?: string,
  slideContent?: string,
  slideBullets?: string[]
): Promise<GeneratedImage> {
  let contentContext = '';
  if (slideTitle) {
    contentContext += `\nSLIDE TITLE: ${slideTitle}`;
  }
  if (slideContent) {
    contentContext += `\nSLIDE DESCRIPTION: ${slideContent}`;
  }
  if (slideBullets && slideBullets.length > 0) {
    contentContext += `\nKEY BULLET POINTS (use these exact names, numbers, and labels — do not substitute or invent different ones):\n${slideBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`;
  }

  const fullPrompt = `${imagePrompt}
${contentContext}

STYLE REQUIREMENTS:
- This is a presentation slide for LinkedIn Marketing Solutions sales training
- Clean white/light gray background with LinkedIn Blue (#0A66C2) accent elements and dark text
- Professional corporate keynote quality
- Include the title text clearly visible at the top of the slide
- Render the exact data points, names, numbers, and labels from the bullet points above — do not generalize, substitute, or invent different content
- Do not render any hex color codes, aspect ratios, or technical instructions as visible text on the slide`;

  const clients = [
    { name: "user-key", client: ai },
    { name: "replit-integration", client: aiIntegration },
  ];

  for (const { name, client } of clients) {
    const maxRetries = 3;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[SlideImage] Trying ${name} (attempt ${attempt + 1})...`);
        const response = await client.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: fullPrompt,
          config: {
            responseModalities: ["Text", "Image"],
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts) {
          console.log(`[SlideImage] ${name}: No response parts`);
          break;
        }

        for (const part of parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            if (imageData) {
              const uploadsDir = path.join(process.cwd(), "public", "uploads", "slides");
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const filename = `slide-${chapterSlug}-${slideIndex}-${Date.now()}.png`;
              const filepath = path.join(uploadsDir, filename);

              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync(filepath, buffer);

              console.log(`[SlideImage] ${name}: Success`);
              return {
                success: true,
                imagePath: filepath,
                imageUrl: `/uploads/slides/${filename}`,
              };
            }
          }
        }

        console.log(`[SlideImage] ${name}: No image data in response`);
        break;
      } catch (error: any) {
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes('UNAVAILABLE') || error.message?.includes('429') || error.message?.includes('quota');
        if (isRetryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 5000;
          console.log(`  Retrying slide ${slideIndex} in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        console.error(`[SlideImage] ${name} failed:`, error.message || error);
        break;
      }
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

export async function generatePitchSlideImage(
  deckSlug: string,
  slideOrder: number,
  imagePrompt: string,
  slideTitle: string,
  slideSubtitle?: string,
  talkingPoints?: string[]
): Promise<GeneratedImage> {
  let contentContext = `\nSLIDE TITLE: ${slideTitle}`;
  if (slideSubtitle) {
    contentContext += `\nSLIDE SUBTITLE: ${slideSubtitle}`;
  }
  if (talkingPoints && talkingPoints.length > 0) {
    contentContext += `\nKEY POINTS (render these exact names, numbers, and labels):\n${talkingPoints.map((b, i) => `${i + 1}. ${b}`).join('\n')}`;
  }

  const fullPrompt = `${imagePrompt}
${contentContext}

STYLE REQUIREMENTS:
- This is a professional B2B sales proposal slide for a LinkedIn Marketing Solutions pitch to a prospective client
- Clean, modern presentation design with LinkedIn Blue (#0A66C2) as primary accent color
- White or very light background for readability
- Professional corporate keynote / pitch deck quality (think McKinsey or Bain presentation style)
- Include the title text "${slideTitle}" clearly visible at the top of the slide
- Render data points, metrics, and labels from the key points exactly as provided
- Use clean data visualizations, charts, or diagrams where appropriate
- Do NOT render hex color codes, aspect ratios, or technical instructions as visible text
- 16:9 aspect ratio presentation slide format`;

  const clients = [
    { name: "user-key", client: ai },
    { name: "replit-integration", client: aiIntegration },
  ];

  for (const { name, client } of clients) {
    const maxRetries = 3;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[PitchSlide] Trying ${name} slide ${slideOrder} (attempt ${attempt + 1})...`);
        const response = await client.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: fullPrompt,
          config: {
            responseModalities: ["Text", "Image"],
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts) {
          console.log(`[PitchSlide] ${name}: No response parts`);
          break;
        }

        for (const part of parts) {
          if (part.inlineData) {
            const imageData = part.inlineData.data;
            if (imageData) {
              const uploadsDir = path.join(process.cwd(), "public", "uploads", "pitch-slides");
              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const filename = `pitch-${deckSlug}-${slideOrder}-${Date.now()}.png`;
              const filepath = path.join(uploadsDir, filename);

              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync(filepath, buffer);

              console.log(`[PitchSlide] ${name}: Success for slide ${slideOrder}`);
              return {
                success: true,
                imagePath: filepath,
                imageUrl: `/uploads/pitch-slides/${filename}`,
              };
            }
          }
        }

        console.log(`[PitchSlide] ${name}: No image data in response`);
        break;
      } catch (error: any) {
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes('UNAVAILABLE') || error.message?.includes('429') || error.message?.includes('quota');
        if (isRetryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 5000;
          console.log(`  Retrying pitch slide ${slideOrder} in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        console.error(`[PitchSlide] ${name} failed:`, error.message || error);
        break;
      }
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

export async function generateBasecampConceptImage(
  lessonSlug: string,
  heading: string,
  bullets: string[],
  visual: string
): Promise<GeneratedImage> {
  const bulletText = bullets.map((b, i) => `${i + 1}. ${b}`).join("\n");

  const prompt = `Create a clean, modern infographic-style illustration for a B2B marketing training concept card.

TOPIC: "${heading}"
VISUAL TYPE: ${visual}
KEY CONCEPTS:
${bulletText}

DESIGN REQUIREMENTS:
- Professional LinkedIn corporate style — LinkedIn Blue (#0A66C2) as primary accent color
- Clean white/off-white background with subtle geometric shapes
- Modern flat design with subtle 3D depth — like a polished SaaS product illustration
- Use icons, diagrams, flow arrows, or visual metaphors to represent the concepts above
- DO NOT include any body text, paragraphs, or long labels — only short labels (2-4 words max) if needed
- NO hex codes, technical specs, or watermarks visible
- Aspect ratio: 16:9, landscape orientation
- The visual should immediately communicate the concept at a glance — think slide illustration, not infographic poster
- Color palette: LinkedIn Blue (#0A66C2), navy (#1A2B8C), white, light gray, with subtle orange or green accents for emphasis`;

  const clients = [
    ...(ai ? [{ name: "user-key", client: ai }] : []),
    { name: "replit-integration", client: aiIntegration },
  ];

  for (const { name, client } of clients) {
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        console.log(`[BasecampImage] Trying ${name} for "${heading}" (attempt ${attempt + 1})...`);
        const response = await client.models.generateContent({
          model: "gemini-3-pro-image-preview",
          contents: prompt,
          config: {
            responseModalities: ["Text", "Image"],
          },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts) {
          console.log(`[BasecampImage] ${name}: No response parts`);
          break;
        }

        for (const part of parts) {
          if (part.inlineData?.data) {
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "basecamp");
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filename = `basecamp-${lessonSlug}-${Date.now()}.png`;
            const filepath = path.join(uploadsDir, filename);
            const buffer = Buffer.from(part.inlineData.data, "base64");
            fs.writeFileSync(filepath, buffer);

            console.log(`[BasecampImage] ${name}: Success for "${heading}"`);
            return { success: true, imagePath: filepath, imageUrl: `/uploads/basecamp/${filename}` };
          }
        }

        console.log(`[BasecampImage] ${name}: No image data in response`);
        break;
      } catch (error: any) {
        const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes("UNAVAILABLE") || error.message?.includes("429");
        if (isRetryable && attempt < 2) {
          const delay = Math.pow(2, attempt + 1) * 4000;
          console.log(`  Retrying in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        console.error(`[BasecampImage] ${name} failed:`, error.message || error);
        break;
      }
    }
  }

  return { success: false, error: "All API keys exhausted or failed" };
}
