import { generatePersonaAvatar } from "../server/persona-image-service";
import { db } from "../server/db";
import { buyerPersonas } from "../shared/schema";
import { eq } from "drizzle-orm";

const personas = [
  { slug: "busy-professional", name: "The Busy Professional", attributes: ["Time-poor, task-saturated", "Wants minimal friction", "Professional attire, checking watch"] },
  { slug: "brush-off-defender", name: "The Brush-Off Defender", attributes: ["Defensive posture", "Wants to end interaction quickly", "Arms crossed at door"] },
  { slug: "rule-first-homeowner", name: "The Rule-First Homeowner", attributes: ["Compliance-oriented", "Boundary-driven", "Pointing at no-soliciting sign"] },
  { slug: "proud-diyer", name: "The Proud DIYer", attributes: ["Self-reliant", "Gardening gloves", "Standing proudly by lawn mower"] },
  { slug: "loyal-existing-provider", name: "The Loyal Existing-Provider Customer", attributes: ["Already has lawn service", "Hesitant to switch", "Middle-aged homeowner"] },
  { slug: "looks-fine-optimist", name: "The Looks Fine Optimist", attributes: ["Satisfied with status quo", "Low urgency", "Shrugging shoulders"] },
  { slug: "weed-indifferent", name: "The Weed-Indifferent Homeowner", attributes: ["Low aesthetic sensitivity", "Casual about lawn care", "Relaxed posture"] },
  { slug: "skeptic", name: "The Skeptic", attributes: ["Doubtful expression", "Needs proof", "Arms crossed, questioning look"] },
  { slug: "price-first-shopper", name: "The Price-First Shopper", attributes: ["Cost-conscious", "Comparison shopping", "Holding phone or calculator"] },
  { slug: "thats-expensive-reactor", name: "The Expensive Reactor", attributes: ["Emotional reaction to price", "Sticker shock expression", "Hand on chest"] },
  { slug: "competitor-price-comparer", name: "The Competitor-Price Comparer", attributes: ["Anchored on price", "Holding competitor flyer", "Skeptical but listening"] },
  { slug: "payment-process-resister", name: "The Payment-Process Resister", attributes: ["Risk-sensitive", "Cautious", "Concerned expression about payment"] },
  { slug: "stallers", name: "The Staller", attributes: ["Avoids decisions", "Need to think about it", "Looking away, uncertain"] },
];

async function generateAllPersonaImages() {
  console.log("Starting persona image generation...\n");
  
  for (const persona of personas) {
    console.log(`Generating image for: ${persona.name}`);
    
    try {
      const avatarUrl = await generatePersonaAvatar(persona.name, persona.attributes);
      
      if (avatarUrl) {
        await db.update(buyerPersonas)
          .set({ avatar: avatarUrl })
          .where(eq(buyerPersonas.slug, persona.slug));
        
        console.log(`  ✓ Generated and saved: ${avatarUrl}\n`);
      } else {
        console.log(`  ✗ Failed to generate image\n`);
      }
    } catch (error) {
      console.error(`  ✗ Error for ${persona.name}:`, error);
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log("\nDone generating persona images!");
  process.exit(0);
}

generateAllPersonaImages();
