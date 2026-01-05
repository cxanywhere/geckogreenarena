import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import path from "node:path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = `Create a dramatic futuristic gladiator arena or colosseum scene for a sales training platform called "Arena AI". 

Style requirements:
- Green cyber/tech aesthetic with bottle green and emerald tones
- Futuristic holographic elements and digital overlays
- Dark atmospheric background with glowing green accents
- Abstract geometric patterns mixed with arena architecture
- Professional, high-tech corporate feel
- Similar to the aesthetic of a cyber sports arena or esports stage
- Should feel powerful, competitive, and motivating
- Include subtle digital grid lines and data visualization elements
- No people or faces, just the environment

The image should work well as a login page background with text overlaid on it.`;

async function generateArenaImage() {
  console.log("Generating arena-themed image with gemini-3-pro-image-preview...");
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      }
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No content in response");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          const outputDir = path.join(process.cwd(), "attached_assets", "generated_images");
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          const outputPath = path.join(outputDir, "arena_login_background.png");
          fs.writeFileSync(outputPath, Buffer.from(imageData, "base64"));
          console.log(`Image saved to: ${outputPath}`);
          return outputPath;
        }
      } else if (part.text) {
        console.log("Model response:", part.text);
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

generateArenaImage()
  .then((path) => {
    console.log("Successfully generated arena image at:", path);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to generate image:", error);
    process.exit(1);
  });
