import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const OUTPUT_DIR = "attached_assets/training_slides";

const BRAND_STYLE = `
Design Style Requirements:
- Portrait orientation optimized for mobile (9:16 aspect ratio)
- Dark background (#0a0a0a or very dark charcoal)
- Primary accent color: bright green (#22c55e)
- Clean, modern typography with good readability
- Professional training slide aesthetic
- "arena ai" logo text in lowercase green at top left
- "Gecko Green" branding where appropriate
- Use icons and visual elements to break up text
- High contrast for mobile readability
- No stock photos - use abstract shapes, icons, or solid colors
- Generous whitespace and padding
- Text should be large enough to read on mobile
`;

interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle?: string;
  content: string[];
  type: "title" | "content" | "roleplay" | "list";
}

const remainingSlides: SlideContent[] = [
  {
    slideNumber: 30,
    title: "The Non-Negotiable Prepay Mindset",
    subtitle: "Prepay first. Every time. No exceptions.",
    content: [
      "PREPAY FIRST. EVERY TIME. NO EXCEPTIONS.",
      "Prepay is the default. Autopay is the backup."
    ],
    type: "title"
  },
  {
    slideNumber: 31,
    title: "ARENA AI: Chapter 1 Roleplay Practice",
    subtitle: "Master the fundamentals through repetition",
    content: [
      "Busy right now (≤60s container + control question)",
      "Not interested (acknowledge + reframe + redirect)",
      "No soliciting (micro-permission + show quickly)",
      "I do my own lawn (validate + differentiate + show)",
      "We already have a lawn company (no replacement fear + isolate gap)",
      "Why are you here (purpose statement + direct next action)",
      "Expectation: Repeat each scenario until you can execute pass criteria consistently."
    ],
    type: "list"
  }
];

function buildPrompt(slide: SlideContent): string {
  const slideTypeInstruction = slide.type === "title"
    ? "This is a TITLE slide. Make it bold and impactful with large typography."
    : "This is a CONTENT slide. Use clear hierarchy and bullet points.";

  const contentFormatted = slide.content.map(item => `• ${item}`).join("\n");

  return `
Create a professional mobile training slide image with these exact specifications:

${BRAND_STYLE}

${slideTypeInstruction}

SLIDE ${slide.slideNumber} of 31

TITLE: ${slide.title}
${slide.subtitle ? `SUBTITLE: ${slide.subtitle}` : ""}

CONTENT:
${contentFormatted}

Requirements:
- All text must be clearly readable on a mobile phone screen
- Use the green accent (#22c55e) for important highlights and headers
- Include "arena ai" branding at the top
- Include slide number indicator (${slide.slideNumber}/31)
- Use icons or visual elements to support the content
- Portrait orientation (9:16 aspect ratio)
- Dark background with high contrast text
- Professional, clean, modern design
- The text MUST be legible and properly rendered
`;
}

async function generateSlideImage(slide: SlideContent): Promise<string | null> {
  const prompt = buildPrompt(slide);
  
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const filename = `slide_${String(slide.slideNumber).padStart(2, "0")}.png`;
          const filepath = path.join(OUTPUT_DIR, filename);
          
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(filepath, imageBuffer);
          
          console.log(`  ✓ Saved: ${filepath}`);
          return filepath;
        }
      }
    }
    
    console.log(`  ✗ No image generated for slide ${slide.slideNumber}`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error generating slide ${slide.slideNumber}:`, error);
    return null;
  }
}

async function generateRemainingSlides() {
  console.log(`\nGenerating remaining ${remainingSlides.length} slides...\n`);
  
  for (const slide of remainingSlides) {
    await generateSlideImage(slide);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("\nDone!");
}

generateRemainingSlides().catch(console.error);
