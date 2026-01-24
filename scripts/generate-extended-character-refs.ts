import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "node:fs";
import * as path from "node:path";
import { NEW_HOMEOWNERS } from "./extended-stories-data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const OUTPUT_DIR = "attached_assets/character_refs";

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function generateCharacterPortrait(character: typeof NEW_HOMEOWNERS[0]): Promise<string | null> {
  console.log(`Generating portrait for ${character.name} (${character.id})...`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ 
        role: "user", 
        parts: [{ text: character.portraitPrompt }] 
      }],
      config: {
        responseModalities: ["image", "text"],
      } as any,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        
        const localPath = path.join(OUTPUT_DIR, `${character.id}.png`);
        fs.writeFileSync(localPath, buffer);
        console.log(`Saved locally: ${localPath}`);

        const uploadResult = await cloudinary.uploader.upload(localPath, {
          folder: "arena-ai/characters",
          public_id: character.id,
          overwrite: true,
        });

        console.log(`Uploaded to Cloudinary: ${uploadResult.secure_url}`);
        return uploadResult.secure_url;
      }
    }

    console.error(`No image generated for ${character.name}`);
    return null;
  } catch (error) {
    console.error(`Error generating portrait for ${character.name}:`, error);
    return null;
  }
}

async function main() {
  await ensureOutputDir();
  
  const characterUrls: Record<string, string> = {};

  console.log("\n=== Generating Extended Story Homeowner Portraits ===\n");
  
  for (const homeowner of NEW_HOMEOWNERS) {
    const url = await generateCharacterPortrait(homeowner);
    if (url) {
      characterUrls[homeowner.id] = url;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const existingUrlsPath = path.join(OUTPUT_DIR, "character-urls.json");
  let existingUrls: Record<string, string> = {};
  if (fs.existsSync(existingUrlsPath)) {
    existingUrls = JSON.parse(fs.readFileSync(existingUrlsPath, "utf-8"));
  }
  
  const mergedUrls = { ...existingUrls, ...characterUrls };
  fs.writeFileSync(existingUrlsPath, JSON.stringify(mergedUrls, null, 2));
  console.log(`\nCharacter URLs updated: ${existingUrlsPath}`);

  console.log("\n=== Extended Character Generation Complete ===");
  console.log("Generated characters:", Object.keys(characterUrls).length);
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
