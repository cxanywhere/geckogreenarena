import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import { db } from "../server/db";
import { comicStories, comicPanels } from "../shared/schema";
import { eq } from "drizzle-orm";
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

const OUTPUT_DIR = "attached_assets/playbook_panels";
const CHAR_REF_DIR = "attached_assets/character_refs";

const SALES_REP = {
  id: "rep-main",
  name: "Marcus Johnson",
  description: "Marcus Johnson, a 28-year-old Black man with an athletic build, clean-shaven with a short fade haircut. He has warm brown eyes and a confident, friendly smile. He is wearing a bright lime green GeckoGreen polo shirt with a small gecko logo on the chest, khaki pants, and clean work boots."
};

const HOMEOWNER_MAP: Record<string, typeof NEW_HOMEOWNERS[0]> = {};
for (const h of NEW_HOMEOWNERS) {
  HOMEOWNER_MAP[h.storyId] = h;
}

interface PanelData {
  panelOrder: number;
  speaker: "rep" | "homeowner" | "narrator";
  dialogue: string;
  setting: string;
  emotion: string;
}

async function loadCharacterImage(charId: string): Promise<Buffer | null> {
  const imagePath = path.join(CHAR_REF_DIR, `${charId}.png`);
  if (fs.existsSync(imagePath)) {
    return fs.readFileSync(imagePath);
  }
  console.warn(`Character image not found: ${imagePath}`);
  return null;
}

async function generatePanelWithRefs(
  roleplayId: string,
  storyTitle: string,
  panel: PanelData,
  repImage: Buffer,
  homeownerImage: Buffer,
  homeowner: typeof NEW_HOMEOWNERS[0]
): Promise<string | null> {
  console.log(`Generating panel ${panel.panelOrder} for story: ${storyTitle}`);

  const prompt = `Generate a realistic photograph-style image for a comic panel in a lawn care sales training story.

SCENE: ${panel.setting}
DIALOGUE/ACTION: "${panel.dialogue}"
EMOTION/MOOD: ${panel.emotion}

CHARACTERS (use the reference images provided to maintain consistency):
- Sales Rep: ${SALES_REP.description}
- Homeowner: ${homeowner.description}

The current speaker/focus is: ${panel.speaker === "narrator" ? "both characters in scene" : panel.speaker}

STYLE: Realistic photography, like a still from a professional training video. Well-lit suburban setting. Natural expressions matching the described emotion. 16:9 aspect ratio, cinematic composition.

DO NOT include any text, speech bubbles, or captions in the image.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            { 
              inlineData: { 
                mimeType: "image/png", 
                data: repImage.toString("base64") 
              } 
            },
            { text: "This is the sales rep character reference." },
            { 
              inlineData: { 
                mimeType: "image/png", 
                data: homeownerImage.toString("base64") 
              } 
            },
            { text: "This is the homeowner character reference." },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseModalities: ["image", "text"],
      } as any,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");

        const fileName = `${roleplayId}_panel_${panel.panelOrder}.png`;
        const localPath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(localPath, buffer);
        console.log(`Saved locally: ${localPath}`);

        const uploadResult = await cloudinary.uploader.upload(localPath, {
          folder: "arena-ai/playbook",
          public_id: `${roleplayId}_panel_${panel.panelOrder}`,
          overwrite: true,
        });

        console.log(`Uploaded to Cloudinary: ${uploadResult.secure_url}`);
        return uploadResult.secure_url;
      }
    }

    console.error(`No image generated for panel ${panel.panelOrder}`);
    return null;
  } catch (error) {
    console.error(`Error generating panel ${panel.panelOrder}:`, error);
    return null;
  }
}

async function regenerateStoryPanels(roleplayId: string): Promise<void> {
  const stories = await db.select().from(comicStories).where(eq(comicStories.roleplayId, roleplayId));
  if (stories.length === 0) {
    console.error(`Story not found for roleplayId: ${roleplayId}`);
    return;
  }

  const story = stories[0];
  const panels = await db.select().from(comicPanels)
    .where(eq(comicPanels.storyId, story.id))
    .orderBy(comicPanels.panelOrder);

  console.log(`\n=== Regenerating ${story.title} (${panels.length} panels) ===\n`);

  const repImage = await loadCharacterImage(SALES_REP.id);
  if (!repImage) {
    console.error("Sales rep reference image not found!");
    return;
  }

  const homeowner = HOMEOWNER_MAP[roleplayId];
  if (!homeowner) {
    console.error(`Homeowner not defined for roleplayId: ${roleplayId}`);
    return;
  }

  const homeownerImage = await loadCharacterImage(homeowner.id);
  if (!homeownerImage) {
    console.error("Homeowner reference image not found!");
    return;
  }

  for (const panel of panels) {
    if (panel.imageUrl) {
      console.log(`Skipping panel ${panel.panelOrder} (already has image)`);
      continue;
    }
    
    const panelData: PanelData = {
      panelOrder: panel.panelOrder,
      speaker: panel.speaker as "rep" | "homeowner" | "narrator",
      dialogue: panel.dialogue,
      setting: panel.setting || "Suburban front yard",
      emotion: panel.emotion || "neutral"
    };

    const imageUrl = await generatePanelWithRefs(
      roleplayId,
      story.title,
      panelData,
      repImage,
      homeownerImage,
      homeowner
    );

    if (imageUrl) {
      await db.update(comicPanels)
        .set({ imageUrl })
        .where(eq(comicPanels.id, panel.id));
      console.log(`Updated database for panel ${panel.panelOrder}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log(`\n=== Completed ${story.title} ===\n`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const storyArg = args.find(a => a.startsWith("--story="));
  
  if (storyArg) {
    const roleplayId = storyArg.split("=")[1];
    await regenerateStoryPanels(roleplayId);
  } else {
    const roleplayIds = ["rp-ext-01", "rp-ext-02", "rp-ext-03"];
    for (const roleplayId of roleplayIds) {
      await regenerateStoryPanels(roleplayId);
    }
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
