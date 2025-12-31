import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeneratedImage {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  error?: string;
}

export async function generateChapterImage(
  chapterTitle: string,
  chapterDescription: string
): Promise<GeneratedImage> {
  const prompt = `Create a professional, modern illustration for a sales training module.
  
Theme: ${chapterTitle}
Context: ${chapterDescription}

Style requirements:
- Clean, corporate illustration style with a green color palette (Gecko Green brand colors: deep green #2D5016, lime green #84CC16)
- Professional lawn care / door-to-door sales theme
- Modern, minimalist design suitable for a training platform
- No text or words in the image
- Bright, optimistic mood
- 16:9 aspect ratio suitable for a card header

Create a visually appealing illustration that represents door-to-door sales success, professional interactions with homeowners, and lawn care services.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
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
          
          const filename = `chapter-${chapterTitle.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
          const filepath = path.join(uploadsDir, filename);
          
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          return {
            success: true,
            imagePath: filepath,
            imageUrl: `/uploads/${filename}`,
          };
        }
      }
    }

    return { success: false, error: "No image data in response" };
  } catch (error: any) {
    console.error("Failed to generate chapter image:", error);
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

  return `You are playing the role of a homeowner in a door-to-door sales training simulation for Gecko Green lawn care services.

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
1. Stay in character as this specific homeowner persona throughout the conversation
2. Start with your opening objection: "${scenario.name}"
3. React realistically to the sales rep's responses
4. If they handle objections well, gradually become more open (but maintain your personality)
5. If they push too hard or don't listen, become more resistant
6. Use natural, conversational language - you're a real person, not an AI
7. Keep responses concise (1-3 sentences typically, like a real doorstep conversation)
8. Eventually, if the rep does well, you may agree to hear more or schedule a follow-up
9. If the rep does poorly, you may close the door or firmly decline

IMPORTANT: 
- Never break character
- Never reveal you are an AI or part of a training simulation
- Respond as the homeowner would in a real doorstep interaction
- Your first message should be your opening objection/statement`;
}

export async function startRoleplayConversation(scenario: RoleplayScenario): Promise<string> {
  const systemPrompt = buildPersonaPrompt(scenario);
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: "Start the conversation with your opening line as the homeowner.",
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: systemPrompt,
    },
    contents: contents,
  });

  return response.text || "...";
}

export interface RoleplayFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  tips: string[];
}

export async function evaluateRoleplay(
  scenario: RoleplayScenario,
  history: RoleplayMessage[]
): Promise<RoleplayFeedback> {
  const transcript = history.map(msg => 
    `${msg.role === "user" ? "SALES REP" : "HOMEOWNER"}: ${msg.content}`
  ).join("\n");

  const evaluationPrompt = `You are an expert sales coach evaluating a door-to-door sales training roleplay for Gecko Green lawn care.

SCENARIO: ${scenario.name} - ${scenario.description}
DIFFICULTY: ${scenario.difficulty}

TRANSCRIPT:
${transcript}

Evaluate the sales rep's performance and provide feedback in the following JSON format:
{
  "overallScore": <number 1-100>,
  "strengths": [<list of 2-3 things they did well>],
  "improvements": [<list of 2-3 areas to improve>],
  "keyMoments": [<list of 1-2 critical moments in the conversation>],
  "tips": [<list of 2-3 actionable tips for next time>]
}

EVALUATION CRITERIA:
1. Opening response - Did they acknowledge the objection appropriately?
2. Frame control - Did they stay in control of the conversation?
3. Active listening - Did they address what the homeowner actually said?
4. Objection handling - Did they use proper techniques (acknowledge, isolate, respond)?
5. Persistence without aggression - Professional but not pushy
6. Closing attempt - Did they try to move toward a next step?

Be constructive but honest. Score based on the difficulty level - a perfect response to a beginner scenario should score higher than a mediocre response to an advanced one.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overallScore: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            keyMoments: { type: "array", items: { type: "string" } },
            tips: { type: "array", items: { type: "string" } },
          },
          required: ["overallScore", "strengths", "improvements", "keyMoments", "tips"],
        },
      },
      contents: evaluationPrompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson) as RoleplayFeedback;
    }
  } catch (error) {
    console.error("Failed to evaluate roleplay:", error);
  }

  return {
    overallScore: 70,
    strengths: ["Completed the roleplay session"],
    improvements: ["Unable to generate detailed feedback"],
    keyMoments: ["Session completed"],
    tips: ["Try again for more detailed feedback"],
  };
}
