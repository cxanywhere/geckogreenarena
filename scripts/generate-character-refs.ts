import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "node:fs";
import * as path from "node:path";

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

interface CharacterProfile {
  id: string;
  name: string;
  role: "rep" | "homeowner";
  storyId?: string;
  description: string;
  portraitPrompt: string;
}

const SALES_REP: CharacterProfile = {
  id: "rep-main",
  name: "Marcus Johnson",
  role: "rep",
  description: "28-year-old Black man, athletic build, clean-shaven with a short fade haircut. Warm brown eyes, confident smile. Wearing a bright lime green GeckoGreen polo shirt with a small gecko logo on the chest, khaki pants, and clean work boots. Professional but approachable demeanor.",
  portraitPrompt: "Professional headshot portrait of Marcus Johnson, a 28-year-old Black man with an athletic build, clean-shaven with a short fade haircut. He has warm brown eyes and a confident, friendly smile. He is wearing a bright lime green polo shirt with a small gecko logo on the chest. The background is a soft neutral gradient. High quality, realistic photography style, natural lighting, looking directly at camera."
};

const HOMEOWNERS: CharacterProfile[] = [
  {
    id: "homeowner-1",
    name: "David Chen",
    role: "homeowner",
    storyId: "rp-01",
    description: "42-year-old Asian-American man, business professional appearance. Short black hair with some gray at the temples, wearing a blue button-down shirt (sleeves rolled up) and nice watch. Looks busy and successful.",
    portraitPrompt: "Professional headshot portrait of David Chen, a 42-year-old Asian-American man with a business professional appearance. He has short black hair with distinguished gray at the temples. He is wearing a blue button-down shirt with sleeves rolled up and a nice silver watch. He has an intelligent, somewhat hurried expression. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-2",
    name: "Karen Mitchell",
    role: "homeowner",
    storyId: "rp-02",
    description: "55-year-old white woman, shoulder-length auburn hair with subtle highlights. Wearing a maroon cardigan over a white blouse. Skeptical but not unfriendly expression. Reading glasses pushed up on head.",
    portraitPrompt: "Professional headshot portrait of Karen Mitchell, a 55-year-old white woman with shoulder-length auburn hair with subtle highlights. She is wearing a maroon cardigan over a white blouse. She has a skeptical but not unfriendly expression, with reading glasses pushed up on her head. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-3",
    name: "Robert Thompson",
    role: "homeowner",
    storyId: "rp-05",
    description: "58-year-old white man, balding with gray hair on sides. Wearing a navy blue polo and khaki shorts. Fit for his age, looks like he takes pride in his property. Friendly but protective of his routines.",
    portraitPrompt: "Professional headshot portrait of Robert Thompson, a 58-year-old white man, balding with gray hair on the sides. He is wearing a navy blue polo shirt. He has a friendly but somewhat guarded expression, the look of someone protective of their routines. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-4",
    name: "Jennifer Martinez",
    role: "homeowner",
    storyId: "rp-07",
    description: "45-year-old Latina woman, long dark wavy hair. Wearing a casual teal top and jeans. Confident posture, takes pride in DIY, somewhat skeptical of services she doesn't think she needs.",
    portraitPrompt: "Professional headshot portrait of Jennifer Martinez, a 45-year-old Latina woman with long dark wavy hair. She is wearing a casual teal top. She has a confident expression with a hint of skepticism, the look of someone who takes pride in doing things herself. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-5",
    name: "Michael O'Brien",
    role: "homeowner",
    storyId: "rp-11",
    description: "38-year-old white man, short reddish-brown hair, light beard. Wearing a casual gray henley shirt. Friendly but budget-conscious expression, young dad energy.",
    portraitPrompt: "Professional headshot portrait of Michael O'Brien, a 38-year-old white man with short reddish-brown hair and a light beard. He is wearing a casual gray henley shirt. He has a friendly but thoughtful expression, like someone carefully considering costs. Soft neutral background. High quality, realistic photography style, natural lighting."
  },
  {
    id: "homeowner-6",
    name: "Patricia Williams",
    role: "homeowner",
    storyId: "rp-14",
    description: "62-year-old Black woman, short silver natural hair. Wearing a purple blouse with simple gold jewelry. Warm but cautious expression, clearly values taking her time with decisions.",
    portraitPrompt: "Professional headshot portrait of Patricia Williams, a 62-year-old Black woman with short silver natural hair. She is wearing a purple blouse with simple gold jewelry. She has a warm but cautious expression, the look of someone who values taking time with important decisions. Soft neutral background. High quality, realistic photography style, natural lighting."
  }
];

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function generateCharacterPortrait(character: CharacterProfile): Promise<string | null> {
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

async function generateAllCharacters() {
  await ensureOutputDir();
  
  const characterUrls: Record<string, string> = {};

  console.log("\n=== Generating Sales Rep Portrait ===\n");
  const repUrl = await generateCharacterPortrait(SALES_REP);
  if (repUrl) {
    characterUrls[SALES_REP.id] = repUrl;
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("\n=== Generating Homeowner Portraits ===\n");
  for (const homeowner of HOMEOWNERS) {
    const url = await generateCharacterPortrait(homeowner);
    if (url) {
      characterUrls[homeowner.id] = url;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const configPath = path.join(OUTPUT_DIR, "character-urls.json");
  fs.writeFileSync(configPath, JSON.stringify(characterUrls, null, 2));
  console.log(`\nCharacter URLs saved to: ${configPath}`);

  const profilesPath = path.join(OUTPUT_DIR, "character-profiles.json");
  const allProfiles = [SALES_REP, ...HOMEOWNERS];
  fs.writeFileSync(profilesPath, JSON.stringify(allProfiles, null, 2));
  console.log(`Character profiles saved to: ${profilesPath}`);

  console.log("\n=== Character Generation Complete ===");
  console.log("Generated characters:", Object.keys(characterUrls).length);
}

generateAllCharacters().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
