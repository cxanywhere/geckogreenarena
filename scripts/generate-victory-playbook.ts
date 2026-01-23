import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import { db } from "../server/db";
import { comicStories, comicPanels } from "../shared/schema";
import { eq } from "drizzle-orm";
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

const OUTPUT_DIR = "attached_assets/playbook_panels";

interface PanelData {
  panelOrder: number;
  speaker: "rep" | "homeowner" | "narrator";
  dialogue: string;
  setting: string;
  emotion: string;
}

interface StoryData {
  roleplayId: string;
  title: string;
  subtitle: string;
  phase: string;
  description: string;
  orderIndex: number;
  panels: PanelData[];
}

const STORY_SCENARIOS: StoryData[] = [
  {
    roleplayId: "rp-01",
    title: "The Busy Executive",
    subtitle: '"I\'m actually really busy right now."',
    phase: "Opening",
    description: "How to handle the time-pressed homeowner and earn 60 seconds of their attention.",
    orderIndex: 1,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "A sunny afternoon in a nice suburban neighborhood. A GeckoGreen rep walks up a well-maintained driveway.", setting: "Suburban driveway, nice house, lawn visible", emotion: "confident" },
      { panelOrder: 2, speaker: "rep", dialogue: "Hi there! I'm with GeckoGreen—we're treating lawns in your neighborhood today.", setting: "At the front door, professional posture", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "I'm actually really busy right now.", setting: "Homeowner at door, looking rushed, phone in hand", emotion: "impatient" },
      { panelOrder: 4, speaker: "narrator", dialogue: "The rep doesn't push back—instead, they acknowledge the pressure.", setting: "Close-up of rep's understanding expression", emotion: "empathetic" },
      { panelOrder: 5, speaker: "rep", dialogue: "I totally get it—you're busy. This will take less than 60 seconds, I promise.", setting: "Rep holding up hand showing 'one minute' gesture", emotion: "respectful" },
      { panelOrder: 6, speaker: "homeowner", dialogue: "Okay, 60 seconds...", setting: "Homeowner's posture relaxes slightly", emotion: "curious" },
      { panelOrder: 7, speaker: "rep", dialogue: "Quick question—who handles your lawn care right now?", setting: "Rep gesturing toward the lawn", emotion: "professional" },
      { panelOrder: 8, speaker: "homeowner", dialogue: "I do it myself, mostly.", setting: "Homeowner stepping out slightly to look at lawn", emotion: "engaged" },
      { panelOrder: 9, speaker: "rep", dialogue: "I can tell you put effort into it. I noticed a few spots that might need professional treatment—can I show you what I mean?", setting: "Both looking at the lawn together", emotion: "collaborative" },
      { panelOrder: 10, speaker: "homeowner", dialogue: "Sure, show me.", setting: "Walking toward the lawn", emotion: "interested" },
      { panelOrder: 11, speaker: "narrator", dialogue: "By respecting their time and asking a qualifying question, the rep earned the right to continue.", setting: "Wide shot of successful lawn walk beginning", emotion: "success" },
    ],
  },
  {
    roleplayId: "rp-02",
    title: "The Instant Brush-Off",
    subtitle: '"Not interested."',
    phase: "Opening",
    description: "Converting the classic rejection into an opportunity by reframing the conversation.",
    orderIndex: 2,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "A neat suburban home. The rep approaches the door with confidence.", setting: "Walking up to a nice home with visible lawn", emotion: "confident" },
      { panelOrder: 2, speaker: "rep", dialogue: "Good afternoon! I'm with GeckoGreen—", setting: "Rep at door, smiling", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Not interested.", setting: "Homeowner at door, arm on doorframe, dismissive posture", emotion: "dismissive" },
      { panelOrder: 4, speaker: "narrator", dialogue: "Most reps would walk away. But the pro knows this is just a reflex.", setting: "Close-up of rep maintaining composure", emotion: "determined" },
      { panelOrder: 5, speaker: "rep", dialogue: "I hear that a lot! Before I go—I noticed some grub damage near your walkway. Have you seen it spreading?", setting: "Rep pointing toward the lawn edge", emotion: "curious" },
      { panelOrder: 6, speaker: "homeowner", dialogue: "Grub damage? What are you talking about?", setting: "Homeowner's expression shifts to curiosity", emotion: "interested" },
      { panelOrder: 7, speaker: "rep", dialogue: "See those brown patches right there? That's grubs eating the roots. Mind if I show you up close?", setting: "Both looking at brown patch on lawn", emotion: "educational" },
      { panelOrder: 8, speaker: "homeowner", dialogue: "I thought that was just dry grass...", setting: "Homeowner stepping outside, looking concerned", emotion: "surprised" },
      { panelOrder: 9, speaker: "rep", dialogue: "Common mistake. The good news is we can fix it before it spreads to the whole lawn.", setting: "Rep kneeling near damaged grass", emotion: "helpful" },
      { panelOrder: 10, speaker: "homeowner", dialogue: "How much would that cost?", setting: "Homeowner now fully engaged", emotion: "interested" },
      { panelOrder: 11, speaker: "narrator", dialogue: "By reframing to a specific lawn issue, the rep transformed rejection into a genuine opportunity.", setting: "Wide shot of productive conversation", emotion: "success" },
    ],
  },
  {
    roleplayId: "rp-05",
    title: "The Loyal Customer",
    subtitle: '"We already have a lawn company."',
    phase: "Turn & Burn",
    description: "Finding the gap in their current service without bashing the competition.",
    orderIndex: 3,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "A well-maintained property. The lawn looks decent but not perfect.", setting: "Suburban home with okay-looking lawn", emotion: "observant" },
      { panelOrder: 2, speaker: "rep", dialogue: "Hi! I'm with GeckoGreen. We're working on a few lawns in the neighborhood today.", setting: "Rep at door, professional", emotion: "friendly" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Oh, we already have a lawn company.", setting: "Homeowner polite but firm", emotion: "content" },
      { panelOrder: 4, speaker: "rep", dialogue: "That's great that you have someone! I'm not asking you to switch.", setting: "Rep with open, non-threatening body language", emotion: "reassuring" },
      { panelOrder: 5, speaker: "homeowner", dialogue: "So... what are you here for then?", setting: "Homeowner looking curious", emotion: "intrigued" },
      { panelOrder: 6, speaker: "rep", dialogue: "I was just noticing a few things they might have missed. Do you mind if I ask—are they treating that crabgrass in the back?", setting: "Rep gesturing toward backyard", emotion: "professional" },
      { panelOrder: 7, speaker: "homeowner", dialogue: "Crabgrass? I'm not sure... I haven't really looked back there.", setting: "Homeowner's confident expression wavers", emotion: "uncertain" },
      { panelOrder: 8, speaker: "rep", dialogue: "Mind if we take a quick look? Sometimes companies miss the edges and back areas.", setting: "Rep walking alongside homeowner", emotion: "helpful" },
      { panelOrder: 9, speaker: "homeowner", dialogue: "Wow, you're right. There's a lot of weeds back here.", setting: "Looking at weedy backyard area", emotion: "surprised" },
      { panelOrder: 10, speaker: "rep", dialogue: "We specialize in full-property coverage. I can show you what we include that most companies skip.", setting: "Rep explaining professionally", emotion: "confident" },
      { panelOrder: 11, speaker: "narrator", dialogue: "Without criticizing the competitor, the rep found a service gap and created an opening.", setting: "Successful conversation continuing", emotion: "success" },
    ],
  },
  {
    roleplayId: "rp-07",
    title: "The Denialist",
    subtitle: '"My lawn looks fine."',
    phase: "Lawn Walk",
    description: "Helping homeowners see what they're missing with visual evidence.",
    orderIndex: 4,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "During the lawn walk, the rep and homeowner survey the front yard together.", setting: "Rep and homeowner on the lawn", emotion: "professional" },
      { panelOrder: 2, speaker: "homeowner", dialogue: "Honestly, my lawn looks fine to me.", setting: "Homeowner gesturing at lawn with confidence", emotion: "satisfied" },
      { panelOrder: 3, speaker: "rep", dialogue: "It does look pretty good from here. I can see you take care of it.", setting: "Rep nodding in agreement", emotion: "validating" },
      { panelOrder: 4, speaker: "homeowner", dialogue: "See? So I don't really need your service.", setting: "Homeowner crossing arms", emotion: "confident" },
      { panelOrder: 5, speaker: "rep", dialogue: "You're right, it's better than most. But see this patch right here?", setting: "Rep pointing to specific area", emotion: "educational" },
      { panelOrder: 6, speaker: "narrator", dialogue: "The rep kneels down and pulls back some grass to reveal the problem.", setting: "Close-up of rep examining grass", emotion: "focused" },
      { panelOrder: 7, speaker: "rep", dialogue: "These are clover weeds. They look like grass from a distance, but they're actually spreading.", setting: "Showing clover vs grass difference", emotion: "informative" },
      { panelOrder: 8, speaker: "homeowner", dialogue: "I never noticed that before...", setting: "Homeowner leaning in to look", emotion: "surprised" },
      { panelOrder: 9, speaker: "rep", dialogue: "And see how the grass is thin here? That's a sign of grub activity underneath.", setting: "Pulling up thin grass to show roots", emotion: "educational" },
      { panelOrder: 10, speaker: "homeowner", dialogue: "Can that be fixed?", setting: "Homeowner now concerned", emotion: "worried" },
      { panelOrder: 11, speaker: "rep", dialogue: "Absolutely. With proper treatment now, we can stop it from spreading and have this looking thick and green by next month.", setting: "Rep standing confidently", emotion: "confident" },
      { panelOrder: 12, speaker: "narrator", dialogue: "By validating first, then isolating specific problems with visual proof, the rep created urgency.", setting: "Productive lawn walk continuing", emotion: "success" },
    ],
  },
  {
    roleplayId: "rp-11",
    title: "The Budget Objection",
    subtitle: '"That\'s expensive."',
    phase: "Pricing",
    description: "Reframing price as value and investment rather than cost.",
    orderIndex: 5,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "After the lawn walk, the rep presents the treatment plan.", setting: "Rep and homeowner at the driveway", emotion: "professional" },
      { panelOrder: 2, speaker: "rep", dialogue: "For full-year coverage—8 treatments including fertilization, weed control, and grub prevention—it's $489 for the year.", setting: "Rep showing tablet with plan", emotion: "confident" },
      { panelOrder: 3, speaker: "homeowner", dialogue: "Wow. That's expensive.", setting: "Homeowner looking taken aback", emotion: "hesitant" },
      { panelOrder: 4, speaker: "narrator", dialogue: "The rep doesn't discount or get defensive. Instead, they normalize.", setting: "Close-up of rep staying calm", emotion: "composed" },
      { panelOrder: 5, speaker: "rep", dialogue: "I understand—lawn care is an investment. Let me break that down for you.", setting: "Rep using hands to explain", emotion: "educational" },
      { panelOrder: 6, speaker: "rep", dialogue: "That's about $40 a month. Less than what most people spend on coffee.", setting: "Rep with relatable comparison", emotion: "friendly" },
      { panelOrder: 7, speaker: "homeowner", dialogue: "I guess when you put it that way...", setting: "Homeowner's expression softening", emotion: "considering" },
      { panelOrder: 8, speaker: "rep", dialogue: "And think about what you're getting—a lawn that looks great year-round, no more weekends spreading fertilizer, and we guarantee results.", setting: "Rep pointing to healthy neighboring lawn", emotion: "confident" },
      { panelOrder: 9, speaker: "homeowner", dialogue: "You guarantee it?", setting: "Homeowner interested in guarantee", emotion: "curious" },
      { panelOrder: 10, speaker: "rep", dialogue: "100%. If you're not satisfied, we re-treat for free. Your lawn will be the best on the block.", setting: "Rep with confident, reassuring gesture", emotion: "trustworthy" },
      { panelOrder: 11, speaker: "homeowner", dialogue: "Okay, let's do it.", setting: "Homeowner smiling, ready to commit", emotion: "convinced" },
      { panelOrder: 12, speaker: "narrator", dialogue: "By normalizing the price and anchoring to value and guarantees, the rep closed the deal.", setting: "Handshake or signing moment", emotion: "success" },
    ],
  },
  {
    roleplayId: "rp-14",
    title: "The Stall",
    subtitle: '"I need to think about it."',
    phase: "Closing",
    description: "Isolating the real concern and advancing the decision.",
    orderIndex: 6,
    panels: [
      { panelOrder: 1, speaker: "narrator", dialogue: "The presentation went well. The homeowner seems interested but hesitates.", setting: "Rep and homeowner at closing moment", emotion: "tense" },
      { panelOrder: 2, speaker: "homeowner", dialogue: "This sounds good, but... I need to think about it.", setting: "Homeowner with uncertain expression", emotion: "hesitant" },
      { panelOrder: 3, speaker: "narrator", dialogue: "The classic stall. Most reps accept it and leave. But not the pro.", setting: "Close-up of rep's determined expression", emotion: "focused" },
      { panelOrder: 4, speaker: "rep", dialogue: "Of course! That's totally fair. Just so I understand—what specifically do you need to think about?", setting: "Rep with open, curious posture", emotion: "understanding" },
      { panelOrder: 5, speaker: "homeowner", dialogue: "Well... I should probably talk to my spouse first.", setting: "Homeowner looking toward the house", emotion: "uncertain" },
      { panelOrder: 6, speaker: "rep", dialogue: "That makes total sense. Is it the price you want to discuss with them, or the service itself?", setting: "Rep isolating the concern", emotion: "analytical" },
      { panelOrder: 7, speaker: "homeowner", dialogue: "More the price, I think. We're trying to watch our spending.", setting: "Homeowner being honest", emotion: "open" },
      { panelOrder: 8, speaker: "rep", dialogue: "I get it. What if I told you we have a payment plan that spreads it over 6 months? Would that make the conversation easier?", setting: "Rep offering solution", emotion: "helpful" },
      { panelOrder: 9, speaker: "homeowner", dialogue: "Oh, you can do that? That changes things...", setting: "Homeowner's demeanor shifting", emotion: "interested" },
      { panelOrder: 10, speaker: "rep", dialogue: "Absolutely. And here's what I can do—let's get you locked in at today's rate. If your spouse says no, I'll cancel it, no questions asked.", setting: "Rep removing risk", emotion: "confident" },
      { panelOrder: 11, speaker: "homeowner", dialogue: "Alright, let's do it. I'll talk to them tonight.", setting: "Homeowner agreeing", emotion: "decided" },
      { panelOrder: 12, speaker: "narrator", dialogue: "By isolating the real concern and removing risk, the rep turned a stall into a close.", setting: "Successful handshake", emotion: "success" },
    ],
  },
];

async function generatePanelImage(story: StoryData, panel: PanelData): Promise<string | null> {
  const prompt = `Create a realistic, photorealistic image for a door-to-door sales training comic panel.

Scene: ${panel.setting}
Context: A GeckoGreen lawn care sales representative is interacting with a homeowner.
Speaker: ${panel.speaker === "rep" ? "Sales representative (young professional in green polo with GeckoGreen logo)" : panel.speaker === "homeowner" ? "Suburban homeowner (middle-aged person in casual clothes)" : "Scene overview"}
Emotion: ${panel.emotion}
${panel.speaker !== "narrator" ? `The ${panel.speaker} is saying: "${panel.dialogue}"` : ""}

Style requirements:
- Photorealistic, high quality image like a professional photograph
- Natural lighting, suburban American neighborhood setting
- Clean, professional look suitable for corporate training
- The image should capture the emotion and body language described
- If showing people, show realistic body language matching the scene
- 16:9 aspect ratio, landscape orientation
- No text or speech bubbles in the image (those will be added separately)

Make it look like a real photograph from a sales training video, not illustrated or cartoonish.`;

  console.log(`Generating panel ${panel.panelOrder} for story: ${story.title}`);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error("No content in response for panel", panel.panelOrder);
      return null;
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        if (imageData) {
          if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
          }

          const filename = `${story.roleplayId}_panel_${panel.panelOrder}.png`;
          const localPath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(localPath, Buffer.from(imageData, "base64"));
          console.log(`Saved locally: ${localPath}`);

          const uploadResult = await cloudinary.uploader.upload(localPath, {
            folder: "arena-ai/playbook",
            public_id: `${story.roleplayId}_panel_${panel.panelOrder}`,
            overwrite: true,
          });

          console.log(`Uploaded to Cloudinary: ${uploadResult.secure_url}`);
          return uploadResult.secure_url;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error generating panel ${panel.panelOrder}:`, error);
    return null;
  }
}

async function seedStoryWithoutImages(story: StoryData): Promise<string> {
  const [insertedStory] = await db
    .insert(comicStories)
    .values({
      roleplayId: story.roleplayId,
      title: story.title,
      subtitle: story.subtitle,
      phase: story.phase,
      description: story.description,
      orderIndex: story.orderIndex,
    })
    .returning();

  for (const panel of story.panels) {
    await db.insert(comicPanels).values({
      storyId: insertedStory.id,
      panelOrder: panel.panelOrder,
      imageUrl: null,
      speaker: panel.speaker,
      dialogue: panel.dialogue,
      setting: panel.setting,
      emotion: panel.emotion,
    });
  }

  console.log(`Seeded story: ${story.title} with ${story.panels.length} panels`);
  return insertedStory.id;
}

async function generateImagesForStory(storyId: string, story: StoryData): Promise<void> {
  const panels = await db.select().from(comicPanels).where(
    eq(comicPanels.storyId, storyId)
  );

  for (const panel of panels) {
    const panelData = story.panels.find((p) => p.panelOrder === panel.panelOrder);
    if (panelData && !panel.imageUrl) {
      const imageUrl = await generatePanelImage(story, panelData);
      if (imageUrl) {
        await db
          .update(comicPanels)
          .set({ imageUrl })
          .where(eq(comicPanels.id, panel.id));
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const seedOnly = args.includes("--seed-only");
  const generateImages = args.includes("--generate-images");
  const storyIndex = args.find((a) => a.startsWith("--story="));

  console.log("=== Victory Playbook Generator ===");

  if (seedOnly) {
    console.log("Seeding stories without images...");
    for (const story of STORY_SCENARIOS) {
      await seedStoryWithoutImages(story);
    }
    console.log("Done seeding all stories!");
  } else if (generateImages) {
    const targetStory = storyIndex ? parseInt(storyIndex.split("=")[1]) - 1 : null;
    
    if (targetStory !== null && STORY_SCENARIOS[targetStory]) {
      const story = STORY_SCENARIOS[targetStory];
      console.log(`Generating images for story ${targetStory + 1}: ${story.title}`);
      const existingStory = await db.select().from(comicStories).where(
        eq(comicStories.roleplayId, story.roleplayId)
      );
      if (existingStory.length > 0) {
        await generateImagesForStory(existingStory[0].id, story);
      }
    } else {
      console.log("Generating images for all stories...");
      for (const story of STORY_SCENARIOS) {
        const existingStory = await db.select().from(comicStories).where(
          require("drizzle-orm").eq(comicStories.roleplayId, story.roleplayId)
        );
        if (existingStory.length > 0) {
          await generateImagesForStory(existingStory[0].id, story);
        }
      }
    }
    console.log("Done generating images!");
  } else {
    console.log("Usage:");
    console.log("  npx tsx scripts/generate-victory-playbook.ts --seed-only     # Seed stories without images");
    console.log("  npx tsx scripts/generate-victory-playbook.ts --generate-images # Generate all images");
    console.log("  npx tsx scripts/generate-victory-playbook.ts --generate-images --story=1 # Generate images for story 1");
  }
}

main().catch(console.error);
