import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

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

  const evaluationPrompt = `You are an expert sales coach evaluating a LinkedIn Marketing Solutions (LMS) B2B advertising sales training roleplay.

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
2. Did they use the appropriate technique for this specific objection? (discovery, consultative selling, LinkedIn advertising value articulation)
3. Did they stay professional and not get pushy or defensive?

EVALUATION CRITERIA (in order of importance):
1. Did they meet the PASS CRITERIA? This is 80% of the decision.
2. Did they trigger any FAIL CONDITIONS? If yes, they fail.
3. Opening response - Did they acknowledge the objection appropriately?
4. Technique - Did they use the right approach for this objection type in a B2B advertising context?
5. Professionalism - Were they respectful and not pushy?

SCORING GUIDE:
- 75-100: Demonstrated correct objection handling technique = PASS
- 60-74: Showed understanding but execution needs work = May pass if core technique was right
- Below 60: Did not demonstrate the correct technique = FAIL

Be encouraging but honest. The "passed" field should be TRUE if the rep genuinely demonstrated the correct technique for handling this objection, regardless of whether the conversation reached a natural conclusion.`;

  try {
    const response = await getClient().models.generateContent({
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
