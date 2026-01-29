import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function generateCover() {
  const outputDir = path.join(process.cwd(), "public", "uploads", "chapter-covers");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const prompt = `Create a professional chapter cover image for a sales training platform called "Arena AI by GigaRev".

CHAPTER: "Intro to GeckoGreen" - Chapter 0 / Welcome Chapter

VISUAL REQUIREMENTS:
- ASPECT RATIO: Wide landscape format (16:9 ratio, approximately 1200x675 pixels proportions)
- STYLE: Modern, clean, professional corporate training aesthetic
- COLOR SCHEME: Dominant emerald green (#22c55e) with white and dark accents
- BRANDING: Include "GeckoGreen" text prominently, subtle gecko silhouette logo element

SCENE COMPOSITION:
- Beautiful lush green suburban lawn as the hero element
- Dallas/Fort Worth suburban neighborhood backdrop with warm Texas sunlight
- Professional lawn care technician or sales rep in clean green uniform (subtle, not dominant)
- Modern minimalist design with clean geometric elements
- Slight gradient overlay for text readability

MOOD: Welcoming, professional, aspirational, represents company introduction and foundation training

TEXT OVERLAY AREA: Leave clean space on left side for chapter title overlay

DO NOT include: Cluttered elements, cartoonish graphics, stock photo watermarks, or overly busy compositions.

This should match the professional quality of corporate training platform covers like LinkedIn Learning or Coursera.`;

  console.log("Generating Chapter 0 cover image...");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(outputDir, "chapter-0-cover.png");
          
          if (typeof imageData === "string") {
            fs.writeFileSync(outputPath, Buffer.from(imageData, "base64"));
            console.log(`✅ Cover saved: ${outputPath}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error generating cover:", error);
  }
}

generateCover();
