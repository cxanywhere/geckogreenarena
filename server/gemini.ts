import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const aiIntegration = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

export interface GeneratedImage {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  error?: string;
}

const CHAPTER_COVER_PROMPTS: Record<string, string> = {
  "MarketStar 101": "A vibrant, modern 3D illustration of a glowing orange star rising above a stylized deep navy blue globe with interconnected nodes representing a global sales network. Dynamic light rays emanate outward. Abstract floating geometric shapes (hexagons, spheres) in orange (#E07A2F) and navy (#1A2B8C) orbit the star. Energetic, inspiring, futuristic corporate feel. No text whatsoever. 16:9 aspect ratio.",
  "Buyer Reality & ICP": "A modern 3D illustration showing a magnifying glass with an orange (#E07A2F) rim hovering over abstract buyer profile silhouettes arranged in a target/bullseye pattern. The ideal customer profile glows bright orange at the center while others fade to deep navy (#1A2B8C). Floating data particles and connection lines. Sleek, high-tech discovery vibe. No text whatsoever. 16:9 aspect ratio.",
  "Sales as a Service® & Nytro.ai": "A futuristic 3D illustration of a sleek robotic arm and a human hand reaching toward each other (Michelangelo style) with an electric orange (#E07A2F) spark between them. Behind them, a fluid navy (#1A2B8C) circuit-board landscape with glowing AI neural pathways. Represents human+AI sales power. Dynamic, exciting, cutting-edge. No text whatsoever. 16:9 aspect ratio.",
  "Pipeline Generation": "A dynamic 3D illustration of a massive glowing orange (#E07A2F) pipeline/funnel floating in space, with streams of luminous lead particles flowing in from the top and converting into golden deals at the bottom. Navy (#1A2B8C) background with abstract speed lines and momentum trails. Energetic, fast-paced, growth-oriented. No text whatsoever. 16:9 aspect ratio.",
  "New Business Acquisition": "A bold 3D illustration of an orange (#E07A2F) rocket launching from a navy (#1A2B8C) launchpad, trailing a brilliant flame. Below, a cityscape of modern glass buildings represents the enterprise market. Floating contract/handshake icons orbit the rocket. Ambitious, exciting, conquest energy. No text whatsoever. 16:9 aspect ratio.",
  "Account Management": "A warm 3D illustration of interconnected orange (#E07A2F) and navy (#1A2B8C) puzzle pieces forming a shield shape, symbolizing protection and growth. Small upward-trending graph lines weave through the connections. Floating relationship icons (handshakes, growth arrows) surround it. Trustworthy, nurturing, strategic. No text whatsoever. 16:9 aspect ratio.",
  "Partner Channel Services": "A vibrant 3D illustration of a sprawling network of glowing orange (#E07A2F) bridges connecting floating navy (#1A2B8C) platform islands. Each island has a small beacon/lighthouse. Energy pulses travel along the bridges showing active partnerships. Collaborative, expansive, ecosystem feel. No text whatsoever. 16:9 aspect ratio.",
  "Customer Success": "A jubilant 3D illustration of a trophy/cup in brilliant orange (#E07A2F) surrounded by celebratory confetti and rising green health-score bars. A happy abstract customer figure stands on a podium. Navy (#1A2B8C) background with floating hearts and star ratings. Joyful, achievement-focused, customer-centric. No text whatsoever. 16:9 aspect ratio.",
  "Revenue Operations": "A sleek 3D illustration of interlocking gears and dashboards forming a revenue engine machine. The central gear glows orange (#E07A2F), surrounded by navy (#1A2B8C) mechanical components. Holographic charts, KPI dials, and data streams float around it. Precise, powerful, operational excellence. No text whatsoever. 16:9 aspect ratio.",
  "Competitive & Differentiation": "A dramatic 3D illustration of a chess board from a low angle, with an orange (#E07A2F) king piece standing tall and glowing in the center, while generic navy (#1A2B8C) pieces surround it. Lightning-like energy radiates from the king. Strategic, dominant, winner-takes-all energy. No text whatsoever. 16:9 aspect ratio.",
  "Deal Execution": "An intense 3D illustration of a glowing orange (#E07A2F) pen signing on a floating holographic contract, with celebration sparks and fireworks erupting from the signature point. Navy (#1A2B8C) background with deal milestone checkpoints floating like stepping stones. Decisive, victorious, closing energy. No text whatsoever. 16:9 aspect ratio.",
  "AI Enablement": "A stunning 3D illustration of a luminous AI brain made of orange (#E07A2F) neural networks floating above an open palm. Holographic data visualizations, prediction curves, and smart automation icons orbit around it. Deep navy (#1A2B8C) space background with stars. Futuristic, intelligent, transformative. No text whatsoever. 16:9 aspect ratio.",
};

export async function generateChapterImage(
  chapterTitle: string,
  chapterDescription: string
): Promise<GeneratedImage> {
  const customPrompt = CHAPTER_COVER_PROMPTS[chapterTitle];
  const prompt = customPrompt || `Create a vibrant, modern 3D illustration for a B2B sales training chapter about "${chapterTitle}". Use orange (#E07A2F) as the primary accent color and deep navy (#1A2B8C) as the background. Dynamic, exciting, futuristic corporate feel with abstract shapes and glowing elements. No text or words whatsoever. 16:9 aspect ratio.`;

  const clients = [
    { name: "user-key", client: ai },
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

  const clients = [
    { name: "user-key", client: ai },
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
- Professional deep blue (#1A2B5C) background with teal (#00B4D8) accents
- Clean, modern corporate infographic style
- All text must be clearly legible and well-organized
- Use icons/visual elements to represent each section
- Card number "${battlecardNumber}" in top corner
- Title prominently at top in large bold white text
- Organized sections with clear visual hierarchy
- MarketStar branding (B2B sales outsourcing)
- Include visual icons for "When to Use", "Goal", "Key Points", "Script"
- Professional sales training document aesthetic
- Dimensions: Portrait orientation, suitable for mobile viewing
- Include checkmarks or bullet icons for key points
- Quote bubble or script icon for the talk track section
- Lightbulb or star icon for the coach line

Create a visually stunning, information-rich battlecard that a B2B sales outsourcing rep could quickly reference during enterprise sales calls.`;

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

  return `You are playing the role of an enterprise buyer in a B2B sales training simulation for MarketStar, a leading B2B sales outsourcing company.

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

  const evaluationPrompt = `You are an expert sales coach evaluating an enterprise B2B sales training roleplay for MarketStar.

SCENARIO: ${scenario.name} - ${scenario.description}
DIFFICULTY: ${scenario.difficulty}

PASS CRITERIA (rep must achieve to pass):
${passCriteria}

FAIL CONDITIONS (any of these means rep fails):
${failConditions}

TRANSCRIPT:
${transcript}

⚠️ IMPORTANT CONTEXT - READ THIS FIRST:
- This is a TIMED practice session (5 minutes max) that may end abruptly when time runs out
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
2. Did they use the appropriate technique for this specific objection? (discovery calls, demos, B2B sales outsourcing selling)
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
  
  const prompt = `Create a striking, modern logo icon for "MarketStar" - a leading B2B sales outsourcing company.

DESIGN REQUIREMENTS:
- An abstract "M" letter mark with a sales growth/star motif
- Geometric, clean design with flowing growth lines or star elements
- Sophisticated, professional tech aesthetic
- The M should incorporate subtle elements suggesting sales growth, pipeline, or star imagery
- IMPORTANT: Add a refined GLOW effect around the logo outline

COLOR SCHEME FOR ${isDark ? "DARK MODE" : "LIGHT MODE"}:
${isDark 
  ? `- Primary color: Deep blue (#1A2B5C) for the main logo shape
- GLOW EFFECT: Teal (#00B4D8) neon glow emanating from the logo lines
- Accent color: Teal (#00B4D8) for highlights and growth effects
- Background: Pure black (#000000) - this makes the glow pop
- The blue and teal should create a professional, high-end feel against the dark background`
  : `- Primary color: Deep blue (#1A2B5C) for the main logo shape
- SUBTLE GLOW: Soft teal (#00B4D8) shadow/glow effect around the logo
- Accent color: Teal (#00B4D8) for subtle highlight effects
- Background: Pure white (#FFFFFF) or very light gray (#F9FAFB)
- Clean, professional, premium look with subtle depth`
}

STYLE:
- Clean geometric design with refined GLOW effects
- Minimal, sophisticated shapes
- Professional tech aesthetic with sales growth elements
- ${isDark ? "Elegant luminous glow - refined and premium" : "Clean professional look with subtle shadows"}
- Professional, sophisticated, premium but approachable
- Square format, centered composition
- NO text, NO words, just the M icon with star/growth motif
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
- This is a presentation slide for MarketStar sales training
- Dark navy blue background with white text and orange accent elements
- Professional corporate keynote quality
- Include the title text clearly visible at the top of the slide
- Render the exact data points, names, numbers, and labels from the bullet points above — do not generalize, substitute, or invent different content
- Do not render any hex color codes, aspect ratios, or technical instructions as visible text on the slide`;

  const maxRetries = 3;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await aiIntegration.models.generateContent({
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
      const isRetryable = error.status === 503 || error.status === 429 || error.message?.includes('UNAVAILABLE');
      if (isRetryable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt + 1) * 5000;
        console.log(`  Retrying slide ${slideIndex} in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      console.error(`Failed to generate slide image (${chapterSlug} slide ${slideIndex}):`, error);
      return { success: false, error: error.message || "Slide image generation failed" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}
