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

const REMAINING_SLIDES = [
  { slideNumber: 17, prompt: `Create a portrait (9:16) illustration for "Why Lawn Care Matters" training slide. Before/after lawn transformation - top: neglected weedy lawn, bottom: lush green beautiful lawn. Icons for home value, environment, family safety, pride. Suburban home. NO text, NO watermarks.` },
  { slideNumber: 18, prompt: `Create a portrait (9:16) illustration for "How GeckoGreen Does It Better". 4-quadrant grid: customized approach, licensed specialists badge, best products, great service. Technician with tablet inspecting lawn. Premium feel. NO text, NO watermarks.` },
  { slideNumber: 19, prompt: `Create a portrait (9:16) illustration for "Treatment System". Circular seasonal cycle diagram: Winter, Spring, Summer, Fall. Clock showing timing matters. Treatment application imagery. Lawn through seasons. NO text, NO watermarks.` },
  { slideNumber: 20, prompt: `Create a portrait (9:16) illustration for "Fertilizer Basics". Macro of healthy dense grass. Nutrients flowing to roots. Comparison: thin pale grass vs thick vibrant green grass. Soil cross-section with roots. NO text, NO watermarks.` },
  { slideNumber: 21, prompt: `Create a portrait (9:16) illustration for "N-P-K Nutrients". Three vertical bars with icons: N leaf/green growth, P root system, K shield/water. Underground root illustration. Green earthy palette. NO text, NO letters, NO watermarks.` },
  { slideNumber: 22, prompt: `Create a portrait (9:16) illustration for "Fertilizer Types". Comparison grid: organic vs mineral, slow vs fast release, liquid vs dry. Weather icons for seasonal adjustments. Product containers. NO text, NO watermarks.` },
  { slideNumber: 23, prompt: `Create a portrait (9:16) illustration for "Grass Types in North Texas". 3 grass ID cards: Bermuda (thin blades, full sun), St. Augustine (wide blades, shade), Rye (fine, cool). Sun/shade icons. Botanical style. NO text, NO watermarks.` },
  { slideNumber: 24, prompt: `Create a portrait (9:16) illustration for "Weed Categories". Split-screen: grassy weed (crabgrass-like) vs broadleaf weed (dandelion-like). Classification badges. Lawn context. NO text, NO watermarks.` },
  { slideNumber: 25, prompt: `Create a portrait (9:16) illustration for "Common Weeds Gallery". 8-card grid with weed illustrations: Blue Stem, Dallisgrass, Crabgrass, Black Medic, Clover, Thistle, Dandelion, Oxalis. Botanical style. NO text, NO names, NO watermarks.` },
  { slideNumber: 26, prompt: `Create a portrait (9:16) illustration for "Pre vs Post Emergent". Soil cross-section: pre-emergent barrier blocking seedlings below ground, post-emergent targeting visible weed. Thick healthy lawn. NO text, NO watermarks.` },
  { slideNumber: 27, prompt: `Create a portrait (9:16) illustration for "Weed Treatment Timeline". Timeline: Day 1 application, Week 1 accelerated growth, Week 2 weed dying, Result clean lawn. Clock/calendar elements. NO text, NO dates, NO watermarks.` },
  { slideNumber: 28, prompt: `Create a portrait (9:16) illustration for "Diseases & Insects". Two sections: disease indicators (brown patches, fungus) and insect damage (grubs underground, surface insects). Environmental factors. NO text, NO watermarks.` },
  { slideNumber: 29, prompt: `Create a portrait (9:16) illustration for "Add-On Services". Three service cards: Aeration (soil plugs, sponge concept), Grub Treatment (underground prevention), Fire Ant Control (mound treatment). Premium style. NO text, NO watermarks.` },
  { slideNumber: 30, prompt: `Create a portrait (9:16) illustration for "Homeowner Partnership". Partnership handshake between lawn pro and homeowner. Checklist: watering, mowing, traffic management, tree trimming, bare spot repair. Collaboration concept. NO text, NO watermarks.` },
  { slideNumber: 31, prompt: `Create a portrait (9:16) illustration for "Seasonal Program". Four seasonal quadrants: Winter (blue/gray), Spring (bright green), Summer (vibrant green), Fall (golden green). Circular seasonal flow. Year-round care. NO text, NO watermarks.` },
  { slideNumber: 32, prompt: `Create a portrait (9:16) illustration for "10 Applications Schedule". Calendar/timeline showing 10 applications: first 2 close together, remaining 8 regular intervals, 1 aeration highlighted. Service truck visits. NO text, NO numbers, NO watermarks.` },
  { slideNumber: 33, prompt: `Create a portrait (9:16) illustration for "Payment Options". Two payment cards: EasyPay (credit card, discount badge, auto-pay) and Prepay (dollar signs, upfront, savings badge). Email notification icon. Modern fintech style. NO text, NO watermarks.` },
  { slideNumber: 34, prompt: `Create a portrait (9:16) illustration for "Improvement Timeline". Progression timeline: 10-14 days easy weeds, 14 days color, 3-4 treatments difficult weeds, end of year full transformation. Lawn improving over time. NO text, NO dates, NO watermarks.` },
  { slideNumber: 35, prompt: `Create a portrait (9:16) illustration for "Common Challenges". Problem areas grid: bare/thin spots, heavy traffic wear, shade areas, weed-filled sections, poor mowing lines. Challenge icons. Solvable theme. NO text, NO watermarks.` },
  { slideNumber: 36, prompt: `Create a portrait (9:16) illustration for "How to Sell It". Feature → Benefit connection visual. Sales rep in conversation with homeowner. Listening/asking questions pose. Strategic selling. NO text, NO watermarks.` },
  { slideNumber: 37, prompt: `Create a portrait (9:16) illustration for "Why GeckoGreen Wins". Trophy/winner's podium with competitive advantage badges radiating: licensed, service commitment, free service calls, lawn analysis, experience, local, customized, strong reviews. NO text, NO watermarks.` },
  { slideNumber: 38, prompt: `Create a portrait (9:16) cover image for "Intro to GeckoGreen" chapter. New sales rep entering GeckoGreen HQ first day. Modern office with green branding. Welcome atmosphere. DFW skyline through windows. Green gecko mascot subtle. NO text, NO watermarks.` },
];

async function main() {
  console.log("Generating remaining Chapter 0 slide images...\n");

  for (const slide of REMAINING_SLIDES) {
    console.log(`\n--- Slide ${slide.slideNumber} ---`);
    await generateSlideImage(slide.slideNumber, slide.prompt);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log("\n✓ Done generating remaining images");
}

main().catch(console.error);
