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

  const prompt = `Create a photorealistic portrait of a homeowner for a sales training simulation.

CHARACTER: "${personaRole}"
PERSONALITY: ${personalityDescription}
DEMEANOR: ${resistanceDesc}
AGE: ${ageRange}

REQUIREMENTS:
- Photorealistic, high-quality headshot/portrait
- Natural lighting, outdoor residential setting (front porch, doorway, or yard)
- Subject should be looking at camera with expression matching their personality
- Diverse suburban homeowner - can be any ethnicity, gender
- Casual home attire (not formal business wear)
- Expression should convey: ${resistanceDesc}
- Background hints at a residential home with lawn
- Square portrait format, centered on face
- Professional photography quality
- NO text, logos, watermarks, or branding
- Natural, authentic look - NOT a stock photo feel

The image should look like a real homeowner you might encounter when going door-to-door.`;

  try {
    const response = await ai.models.generateContent({
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
          
          const safeName = personaRole.toLowerCase().replace(/[^a-z0-9]+/g, "-").substring(0, 30);
          const filename = `persona-${safeName}-${Date.now()}.png`;
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
    console.error("Failed to generate persona image:", error);
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
  passed: boolean;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  keyMoments: string[];
  tips: string[];
  passFailReason: string;
}

export async function evaluateRoleplay(
  scenario: RoleplayScenario,
  history: RoleplayMessage[]
): Promise<RoleplayFeedback> {
  const transcript = history.map(msg => 
    `${msg.role === "user" ? "SALES REP" : "HOMEOWNER"}: ${msg.content}`
  ).join("\n");

  // Extract pass criteria and fail conditions from description if available
  const passCriteriaMatch = scenario.description.match(/Pass criteria: ([^.]+\.)/i);
  const failConditionsMatch = scenario.description.match(/Fail conditions: ([^.]+\.)/i);
  const passCriteria = passCriteriaMatch ? passCriteriaMatch[1] : "Handle objections professionally and move toward next step";
  const failConditions = failConditionsMatch ? failConditionsMatch[1] : "Getting door slammed, being rude, or giving up too easily";

  const evaluationPrompt = `You are an expert sales coach evaluating a door-to-door sales training roleplay for Gecko Green lawn care.

SCENARIO: ${scenario.name} - ${scenario.description}
DIFFICULTY: ${scenario.difficulty}

PASS CRITERIA (rep must achieve to pass):
${passCriteria}

FAIL CONDITIONS (any of these means rep fails):
${failConditions}

TRANSCRIPT:
${transcript}

Evaluate the sales rep's performance and determine if they PASSED or FAILED based on the criteria above.

EVALUATION CRITERIA:
1. Did they meet the PASS CRITERIA? This is the primary factor for passing.
2. Did they trigger any FAIL CONDITIONS? If yes, they fail regardless of other factors.
3. Opening response - Did they acknowledge the objection appropriately?
4. Frame control - Did they stay in control of the conversation?
5. Active listening - Did they address what the homeowner actually said?
6. Objection handling - Did they use proper techniques (acknowledge, isolate, respond)?
7. Persistence without aggression - Professional but not pushy
8. Closing attempt - Did they try to move toward a next step?

SCORING GUIDE:
- 80-100: Excellent performance, clearly passed
- 65-79: Good performance, likely passed
- 50-64: Borderline, may or may not pass
- Below 50: Failed to meet criteria

Be constructive but honest. The "passed" field should be TRUE only if the rep genuinely met the pass criteria without triggering fail conditions.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            passed: { type: "boolean" },
            overallScore: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            keyMoments: { type: "array", items: { type: "string" } },
            tips: { type: "array", items: { type: "string" } },
            passFailReason: { type: "string" },
          },
          required: ["passed", "overallScore", "strengths", "improvements", "keyMoments", "tips", "passFailReason"],
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
    passed: false,
    overallScore: 50,
    strengths: ["Completed the roleplay session"],
    improvements: ["Unable to generate detailed feedback"],
    keyMoments: ["Session completed"],
    tips: ["Try again for more detailed feedback"],
    passFailReason: "Unable to evaluate - please try again",
  };
}
