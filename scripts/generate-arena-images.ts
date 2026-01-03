import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateArenaImage(prompt: string, filename: string): Promise<string | null> {
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
          const uploadsDir = path.join(process.cwd(), "public", "uploads", "chapters");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const filepath = path.join(uploadsDir, filename);
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(filepath, buffer);
          
          console.log(`✓ Generated: ${filepath}`);
          return `/uploads/chapters/${filename}`;
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

async function main() {
  console.log("Generating Arena-themed chapter images...\n");

  const chapter1Prompt = `Create an epic, cinematic illustration of a new warrior recruit entering a grand ancient arena for the first time.

SCENE:
- A young warrior in basic training armor (leather, simple metal) standing at the entrance gate of a massive colosseum
- They are receiving their first sword and shield from an armored mentor/trainer
- Training dummies and practice equipment visible in the sandy arena behind them
- Golden morning light streaming through the arena's towering stone archways
- Other recruits training in the background

STYLE:
- Epic fantasy/gladiator aesthetic
- Rich green and gold color palette (primary: emerald green #22C55E, gold accents)
- Dramatic lighting with lens flares
- Cinematic composition, widescreen 16:9 format
- High detail, professional concept art quality
- Inspirational, the beginning of a hero's journey
- NO text, NO words, NO watermarks

MOOD: Determined, aspirational, the first step into greatness. The warrior looks eager but inexperienced - ready to learn and prove themselves.`;

  const chapter2Prompt = `Create an epic, cinematic illustration of an elite super-soldier champion warrior standing victorious in an ancient arena.

SCENE:
- A battle-hardened warrior in full ornate armor (gleaming plate armor, decorated helm with plume)
- Standing powerfully in the center of a massive colosseum arena
- Victory pose with raised weapon, radiating confidence and mastery
- Crowd cheering in the arena stands (blurred in background)
- Defeated practice targets/opponents around them showing their skill
- Dramatic green and gold glowing energy emanating from their weapon/armor

STYLE:
- Epic fantasy/gladiator aesthetic with sci-fi super-soldier elements
- Rich green and gold color palette (primary: emerald green #22C55E, gold accents)
- Dramatic backlighting creating a silhouette effect with glowing edges
- Cinematic composition, widescreen 16:9 format
- High detail, professional concept art quality
- Triumphant, legendary, the pinnacle of training achieved
- NO text, NO words, NO watermarks

MOOD: Powerful, elite, unstoppable. This warrior has mastered every skill - they are the champion others aspire to become.`;

  const chapter1Image = await generateArenaImage(
    chapter1Prompt, 
    `chapter-1-arena-recruit-${Date.now()}.png`
  );
  
  const chapter2Image = await generateArenaImage(
    chapter2Prompt,
    `chapter-2-arena-champion-${Date.now()}.png`
  );

  console.log("\n--- Results ---");
  console.log("Chapter 1 image:", chapter1Image || "FAILED");
  console.log("Chapter 2 image:", chapter2Image || "FAILED");

  if (chapter1Image && chapter2Image) {
    console.log("\n✓ Both images generated successfully!");
    console.log("\nNext: Update the chapter thumbnails in the database with these URLs:");
    console.log(`  Chapter 1: ${chapter1Image}`);
    console.log(`  Chapter 2: ${chapter2Image}`);
  }
}

main().catch(console.error);
