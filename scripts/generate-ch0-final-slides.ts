import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface SlideContent {
  slideNumber: number;
  title: string;
  content: string;
  bullets: string[];
}

const FINAL_SLIDES: SlideContent[] = [
  {
    slideNumber: 38,
    title: "Quiz: Daily Goals",
    content: "What is the target number of knocks per day?",
    bullets: [
      "A) 50 knocks",
      "B) 75 knocks",
      "C) 125 knocks ✓",
      "D) 200 knocks"
    ]
  },
  {
    slideNumber: 39,
    title: "Quiz: Weed Control",
    content: "What is the primary difference between pre-emergent and post-emergent weed control?",
    bullets: [
      "A) Pre-emergent is for grassy weeds, post-emergent is for broadleaf weeds",
      "B) Pre-emergent is applied before weeds emerge, post-emergent after weeds are visible ✓",
      "C) Pre-emergent is liquid, post-emergent is granular",
      "D) There is no difference"
    ]
  },
  {
    slideNumber: 40,
    title: "Quiz: GeckoGreen Program",
    content: "How many total applications are included in the annual program?",
    bullets: [
      "A) 6 applications",
      "B) 8 applications",
      "C) 10 applications ✓",
      "D) 12 applications"
    ]
  }
];

async function generateSlideImage(slide: SlideContent): Promise<string | null> {
  const filename = `chapter0-slide-${slide.slideNumber.toString().padStart(2, '0')}.png`;
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}...`);

  const bulletText = slide.bullets.map(b => `${b}`).join('\n');
  
  const prompt = `Create a professional mobile training quiz slide image in portrait orientation (9:16 aspect ratio).

This is a QUIZ slide that MUST display the following text content clearly and legibly:

TITLE: ${slide.title}

QUESTION: ${slide.content}

ANSWER OPTIONS:
${bulletText}

DESIGN REQUIREMENTS:
- Professional quiz/test slide design
- Green color theme (#22C55E as primary accent color)
- Clean white or light background for readability
- "QUIZ" label at the top
- Question should be prominently displayed
- Answer options should be clearly formatted with A, B, C, D labels
- The correct answer (marked with ✓) should be highlighted in green
- All text must be sharp, readable, and properly formatted
- Mobile-optimized portrait layout (9:16)
- Professional, clean, modern quiz aesthetic`;

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
      console.error("No response parts received");
      return null;
    }

    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads", "chapter0-slides");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const filepath = path.join(uploadsDir, filename);
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          console.log(`✓ Generated: ${filename}`);
          return `/uploads/chapter0-slides/${filename}`;
        }
      }
    }

    console.error("No image data in response");
    return null;
  } catch (error: any) {
    console.error(`Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("Generating final quiz slides with content...\n");

  for (const slide of FINAL_SLIDES) {
    await generateSlideImage(slide);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n✓ Done");
}

main().catch(console.error);
