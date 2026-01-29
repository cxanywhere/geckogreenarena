import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateSlideImage(slideNumber: number, prompt: string): Promise<string | null> {
  const filename = `chapter0-slide-${slideNumber.toString().padStart(2, '0')}.png`;
  console.log(`Generating image: ${filename}...`);
  
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
          
          console.log(`✓ Generated: ${filepath}`);
          return `/uploads/chapter0-slides/${filename}`;
        }
      }
    }

    console.error("No image data in response");
    return null;
  } catch (error: any) {
    console.error(`Failed to generate image: ${error.message}`);
    return null;
  }
}

const FINAL_SLIDES = [
  { slideNumber: 32, prompt: `Create a portrait (9:16) illustration for "10 Applications Schedule". Calendar/timeline showing 10 applications: first 2 close together, remaining 8 regular intervals, 1 aeration highlighted. Service truck visits. NO text, NO numbers, NO watermarks.` },
  { slideNumber: 33, prompt: `Create a portrait (9:16) illustration for "Payment Options". Two payment cards: EasyPay (credit card, discount badge, auto-pay) and Prepay (dollar signs, upfront, savings badge). Email notification icon. Modern fintech style. NO text, NO watermarks.` },
  { slideNumber: 34, prompt: `Create a portrait (9:16) illustration for "Improvement Timeline". Progression timeline: lawn improving from weedy to beautiful over time. Calendar marks showing progress. NO text, NO dates, NO watermarks.` },
  { slideNumber: 35, prompt: `Create a portrait (9:16) illustration for "Common Challenges". Problem areas grid: bare/thin spots, heavy traffic wear, shade areas, weed-filled sections, poor mowing lines. Challenge icons. Solvable theme. NO text, NO watermarks.` },
  { slideNumber: 36, prompt: `Create a portrait (9:16) illustration for "How to Sell It". Feature → Benefit connection visual. Sales rep in conversation with homeowner. Listening/asking questions pose. Strategic selling. NO text, NO watermarks.` },
  { slideNumber: 37, prompt: `Create a portrait (9:16) illustration for "Why GeckoGreen Wins". Trophy/winner's podium with competitive advantage badges radiating: licensed, service commitment, free service calls, lawn analysis, experience, local, customized, strong reviews. NO text, NO watermarks.` },
  { slideNumber: 38, prompt: `Create a portrait (9:16) cover image for "Intro to GeckoGreen" chapter. New sales rep entering modern GeckoGreen HQ first day. Green branding. Welcome atmosphere. DFW skyline through windows. Green gecko mascot subtle. NO text, NO watermarks.` },
  { slideNumber: 39, prompt: `Create a portrait (9:16) illustration for "Next Steps" slide. Checklist showing Arena AI certification path: Intro complete checkmark, Chapter 1 next, Chapter 2, Quiz, Roleplays. Motivational, starting journey. NO text, NO watermarks.` },
  { slideNumber: 40, prompt: `Create a portrait (9:16) final illustration for "You're Ready" slide. Confident sales rep in GeckoGreen uniform, ready to start. Sunrise over suburban neighborhood. Optimistic, beginning of success journey. NO text, NO watermarks.` },
];

async function main() {
  console.log("Generating final Chapter 0 slide images (32-40)...\n");

  for (const slide of FINAL_SLIDES) {
    console.log(`\n--- Slide ${slide.slideNumber} ---`);
    await generateSlideImage(slide.slideNumber, slide.prompt);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n✓ Done generating final images");
}

main().catch(console.error);
