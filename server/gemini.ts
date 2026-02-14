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
- Clean, corporate illustration style with a deep blue and magenta color palette (Monetate brand colors: deep blue #1A2B8C, magenta #E84C8A)
- Enterprise B2B SaaS sales training theme
- Modern, minimalist design suitable for a training platform
- No text or words in the image
- Sophisticated, premium mood with a luxury feel
- 16:9 aspect ratio suitable for a card header

Create a visually appealing illustration that represents enterprise sales success, technology, data analytics, and experience optimization.`;

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

  const prompt = `Create a photorealistic portrait of an enterprise buyer for a sales training simulation.

CHARACTER: "${personaRole}"
PERSONALITY: ${personalityDescription}
DEMEANOR: ${resistanceDesc}
AGE: ${ageRange}

REQUIREMENTS:
- Photorealistic, high-quality headshot/portrait
- Natural lighting, modern office, conference room, or corporate setting
- Subject should be looking at camera with expression matching their personality
- Diverse enterprise buyer / executive - can be any ethnicity, gender
- Professional business attire
- Expression should convey: ${resistanceDesc}
- Background hints at a modern corporate office
- Square portrait format, centered on face
- Professional photography quality
- NO text, logos, watermarks, or branding
- Natural, authentic look - NOT a stock photo feel

The image should look like a real enterprise buyer you might meet in a sales meeting.`;

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

export async function generateLogoImage(
  prompt: string,
  filename: string
): Promise<GeneratedImage> {
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
- Professional deep blue (#1A2B8C) background with magenta (#E84C8A) accents
- Clean, modern corporate infographic style
- All text must be clearly legible and well-organized
- Use icons/visual elements to represent each section
- Card number "${battlecardNumber}" in top corner
- Title prominently at top in large bold white text
- Organized sections with clear visual hierarchy
- Monetate branding (enterprise SaaS)
- Include visual icons for "When to Use", "Goal", "Key Points", "Script"
- Professional sales training document aesthetic
- Dimensions: Portrait orientation, suitable for mobile viewing
- Include checkmarks or bullet icons for key points
- Quote bubble or script icon for the talk track section
- Lightbulb or star icon for the coach line

Create a visually stunning, information-rich battlecard that a B2B SaaS sales rep could quickly reference during enterprise sales calls.`;

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

  return `You are playing the role of an enterprise buyer in a B2B sales training simulation for Monetate experience optimization platform.

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
1. Stay in character as this specific enterprise buyer persona throughout the conversation
2. Start with your opening objection: "${scenario.name}"
3. React realistically to the sales rep's responses
4. If they handle objections well, gradually become more open (but maintain your personality)
5. If they push too hard or don't listen, become more resistant
6. Use natural, conversational language - you're a real person, not an AI
7. Keep responses concise (1-3 sentences typically, like a real sales call or meeting)
8. Eventually, if the rep does well, you may agree to hear more or schedule a follow-up demo
9. If the rep does poorly, you may end the meeting or firmly decline

IMPORTANT: 
- Never break character
- Never reveal you are an AI or part of a training simulation
- Respond as the enterprise buyer would in a real sales meeting
- Your first message should be your opening objection/statement`;
}

export async function startRoleplayConversation(scenario: RoleplayScenario): Promise<string> {
  const systemPrompt = buildPersonaPrompt(scenario);
  
  const response = await ai.models.generateContent({
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
    `${msg.role === "user" ? "SALES REP" : "BUYER"}: ${msg.content}`
  ).join("\n");

  // Extract pass criteria and fail conditions from description if available
  const passCriteriaMatch = scenario.description.match(/Pass criteria: ([^.]+\.)/i);
  const failConditionsMatch = scenario.description.match(/Fail conditions: ([^.]+\.)/i);
  const passCriteria = passCriteriaMatch ? passCriteriaMatch[1] : "Handle objections professionally and move toward next step";
  const failConditions = failConditionsMatch ? failConditionsMatch[1] : "Buyer ending the meeting, being rude, or giving up too easily";

  const evaluationPrompt = `You are an expert sales coach evaluating an enterprise B2B sales training roleplay for Monetate.

SCENARIO: ${scenario.name} - ${scenario.description}
DIFFICULTY: ${scenario.difficulty}

PASS CRITERIA (rep must achieve to pass):
${passCriteria}

FAIL CONDITIONS (any of these means rep fails):
${failConditions}

TRANSCRIPT:
${transcript}

⚠️ IMPORTANT CONTEXT - READ THIS FIRST:
- This is a TIMED practice session (90 seconds max) that may end abruptly when time runs out
- The conversation may be cut off mid-sentence - this is NORMAL and expected
- DO NOT penalize for incomplete conversations, abrupt endings, or unanswered questions at the end
- DO NOT penalize for not reaching a "close" - most practice sessions are just for the opening/objection handling
- Focus your evaluation on what the rep DID say, not what they didn't have time to say

SCORING WEIGHTS (CRITICAL):
- 80% of your evaluation should be based on: Did they correctly handle the opening objection "${scenario.name}"?
- 20% is for overall technique, professionalism, and listening skills
- If the rep demonstrated the correct technique for handling this objection, they should PASS even if the conversation was cut short

WHAT "CORRECTLY HANDLING THE OBJECTION" MEANS:
1. Did they ACKNOWLEDGE the objection first? (Not ignore it)
2. Did they use the appropriate technique for this specific objection? (discovery calls, demos, enterprise selling)
3. Did they stay professional and not get pushy or defensive?

EVALUATION CRITERIA (in order of importance):
1. Did they meet the PASS CRITERIA? This is 80% of the decision.
2. Did they trigger any FAIL CONDITIONS? If yes, they fail.
3. Opening response - Did they acknowledge the objection appropriately?
4. Technique - Did they use the right approach for this objection type in an enterprise context?
5. Professionalism - Were they respectful and not pushy?

SCORING GUIDE:
- 75-100: Demonstrated correct objection handling technique = PASS
- 60-74: Showed understanding but execution needs work = May pass if core technique was right
- Below 60: Did not demonstrate the correct technique = FAIL

Be encouraging but honest. The "passed" field should be TRUE if the rep genuinely demonstrated the correct technique for handling this objection, regardless of whether the conversation reached a natural conclusion.`;

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

export async function generateArenaLogo(mode: "dark" | "light"): Promise<GeneratedImage> {
  const isDark = mode === "dark";
  
  const prompt = `Create a striking, modern logo icon for "Monetate" - an enterprise B2B SaaS experience optimization platform.

DESIGN REQUIREMENTS:
- An abstract "M" letter mark with a data/personalization motif
- Geometric, clean design with flowing data streams or personalization nodes
- Sophisticated, luxury tech aesthetic
- The M should incorporate subtle elements suggesting data analytics, personalization, or optimization
- IMPORTANT: Add a refined GLOW effect around the logo outline

COLOR SCHEME FOR ${isDark ? "DARK MODE" : "LIGHT MODE"}:
${isDark 
  ? `- Primary color: Deep blue (#1A2B8C) for the main logo shape
- GLOW EFFECT: Magenta/pink (#E84C8A) neon glow emanating from the logo lines
- Accent color: Magenta (#E84C8A) for highlights and data stream effects
- Background: Pure black (#000000) - this makes the glow pop
- The blue and magenta should create a luxurious, high-end feel against the dark background`
  : `- Primary color: Deep blue (#1A2B8C) for the main logo shape
- SUBTLE GLOW: Soft magenta (#E84C8A) shadow/glow effect around the logo
- Accent color: Magenta (#E84C8A) for subtle highlight effects
- Background: Pure white (#FFFFFF) or very light gray (#F9FAFB)
- Clean, professional, premium look with subtle depth`
}

STYLE:
- Clean geometric design with refined GLOW effects
- Minimal, sophisticated shapes
- Luxury tech aesthetic with data visualization elements
- ${isDark ? "Elegant luminous glow - refined and premium" : "Clean professional look with subtle shadows"}
- Professional, sophisticated, premium but approachable
- Square format, centered composition
- NO text, NO words, just the M icon with data motif
- The glow effect should convey innovation and sophistication

The overall feel should be: ${isDark ? "A premium, luminous emblem in darkness - sophisticated, innovative, enterprise-grade" : "A clean, luxury brand mark - polished, confident, modern"}.`;

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
  imagePrompt: string
): Promise<GeneratedImage> {
  const fullPrompt = `${imagePrompt}

CRITICAL STYLE REQUIREMENTS:
- This is a PRESENTATION SLIDE for a premium sales training platform
- Dark navy blue (#1A2B8C) background is mandatory
- White text for titles and body content
- Magenta/pink (#E84C8A) for accent elements, icons, highlights, and data callouts
- Professional corporate keynote quality — think McKinsey or Bain presentation deck
- 16:9 landscape aspect ratio
- Include the TITLE TEXT clearly visible at the top of the slide
- Include key data points, diagrams, or visual elements as described
- Clean typography with generous spacing
- Subtle gradient effects and modern design elements
- NO stock photo feel — this should look like a hand-crafted slide design`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: fullPrompt,
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
          const uploadsDir = path.join(process.cwd(), "public", "uploads", "slides");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const filename = `slide-${chapterSlug}-${slideIndex}-${Date.now()}.png`;
          const filepath = path.join(uploadsDir, filename);

          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);

          return {
            success: true,
            imagePath: filepath,
            imageUrl: `/uploads/slides/${filename}`,
          };
        }
      }
    }

    return { success: false, error: "No image data in response" };
  } catch (error: any) {
    console.error(`Failed to generate slide image (${chapterSlug} slide ${slideIndex}):`, error);
    return { success: false, error: error.message || "Slide image generation failed" };
  }
}
