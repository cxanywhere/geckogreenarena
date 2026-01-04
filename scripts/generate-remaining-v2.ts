import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const OUTPUT_DIR = "attached_assets/training_slides";

const BRAND_STYLE = `
Design Style Requirements:
- Portrait orientation optimized for mobile (9:16 aspect ratio)
- CLEAN WHITE BACKGROUND - bright, professional, easy to read
- Primary accent color: Gecko Green (#22c55e) for headers, highlights, and key elements
- Secondary accent: Dark green (#166534) for emphasis
- Clean, modern typography with excellent readability on mobile
- Professional lawn care training slide aesthetic

BRANDING:
- Include the "Gecko Green" brand name prominently at the top
- Use a small gecko/lizard icon or silhouette near the logo
- Footer should say "Gecko Green Training Program"
- NO "arena ai" branding - this is Gecko Green content

VISUAL EXAMPLES:
- Include relevant illustrations, icons, or visual examples where mentioned
- When discussing homeowners/customers, show a friendly homeowner illustration
- When discussing lawns, show healthy green grass imagery
- When discussing weeds, show visual examples of weed types
- Use professional icons for concepts (checkmarks, warning signs, dollar signs, etc.)
- Include visual callouts, diagrams, or infographics where helpful

LAYOUT:
- Generous whitespace and padding for mobile readability
- Text should be large enough to read on a phone screen
- Use bullet points with green checkmarks or icons
- Clear visual hierarchy: title > subtitle > content
- Green accent bars or lines to separate sections
`;

interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle?: string;
  content: string[];
  type: "title" | "content" | "roleplay" | "list";
  visualHint?: string;
}

const remainingSlides: SlideContent[] = [
  {
    slideNumber: 15,
    title: "Roleplay #5: \"We already have a lawn company.\"",
    subtitle: "Turn & Burn → Existing Provider",
    content: [
      "PASS: Acknowledge and remove replacement fear, Isolate a gap (visible issue), Ask a control question",
      "FAIL: Attacks the competitor or claims superiority without evidence",
      "WINNING RESPONSE: \"Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?\""
    ],
    type: "roleplay",
    visualHint: "Show a homeowner mentioning another company, rep calmly pointing to visible weeds on lawn edge"
  },
  {
    slideNumber: 16,
    title: "Roleplay #6: \"Why are you here?\"",
    subtitle: "Turn & Burn → Purpose Statement",
    content: [
      "PASS: State purpose clearly, Direct the next action (show/point), Stay concise",
      "FAIL: Rambles or over-explains the company/services",
      "WINNING RESPONSE: \"Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.\""
    ],
    type: "roleplay",
    visualHint: "Show rep confidently gesturing toward the street/neighborhood, pointing at lawn"
  },
  {
    slideNumber: 17,
    title: "KNOW YOUR TURF",
    subtitle: "Grass types and how to speak about them simply",
    content: [
      "Common grasses: Bermuda, St. Augustine, Zoysia",
      "What reps must do: Identify the likely grass type",
      "Explain that grass types have different needs (watering, mowing height, sun tolerance)",
      "Reinforce: Gecko Green uses professional products appropriate for local turf"
    ],
    type: "content",
    visualHint: "Show 3 grass type samples with labels: Bermuda, St. Augustine, Zoysia - visual comparison"
  },
  {
    slideNumber: 18,
    title: "Weeds 101",
    subtitle: "Know the category before you explain the solution",
    content: [
      "Grassy weeds: Nutsedge (yellow/purple), Poa annua",
      "Broadleaf weeds: Dandelion, Clover, Henbit",
      "Key point: Weed type influences product choice and timing."
    ],
    type: "content",
    visualHint: "Show actual examples of each weed type with labels - dandelion, clover, nutsedge illustrations"
  },
  {
    slideNumber: 19,
    title: "WHY SOME WEEDS KEEP COMING BACK",
    subtitle: "The seed bank explains ongoing weed pressure",
    content: [
      "Annual weeds: One season lifecycle, Drop seeds → new weeds later",
      "Perennial weeds: Return from roots year after year, Harder to fully eliminate",
      "The seed bank: Soil contains dormant weed seeds that can activate over time",
      "Key message: We focus on control and reduction over time, not instant perfection."
    ],
    type: "content",
    visualHint: "Show a cross-section diagram of soil with seeds underground, arrows showing weeds emerging"
  },
  {
    slideNumber: 20,
    title: "PRE-EMERGENT VS. POST-EMERGENT",
    subtitle: "Timing is everything",
    content: [
      "Pre-emergent (Prevention): Stops weeds before they sprout, Creates a barrier that interrupts seed development, Reduces future weeds",
      "Post-emergent (Treatment): Targets existing weeds, Visible results typically in 10–14 days"
    ],
    type: "content",
    visualHint: "Show a split diagram: left side shows barrier stopping seeds, right side shows spray treating visible weeds"
  },
  {
    slideNumber: 21,
    title: "FERTILIZER – NPK",
    subtitle: "The three numbers that feed your lawn",
    content: [
      "N — Nitrogen: green color and top growth",
      "P — Phosphorus: root development and establishment",
      "K — Potassium: overall health and stress resistance",
      "Key point: Fertilizer supports growth; it complements weed and soil strategy."
    ],
    type: "list",
    visualHint: "Show fertilizer bag with N-P-K numbers, arrows pointing to what each does: leaves, roots, overall plant"
  },
  {
    slideNumber: 22,
    title: "LIQUID AERATION BENEFITS",
    subtitle: "Why it matters in clay-heavy North Texas soil",
    content: [
      "Healthier soil & roots: Reduces compaction, Penetrates up to 12 inches, Promotes deeper roots",
      "Improved efficiency: Better water absorption, Less runoff, Better fertilizer uptake",
      "Resilience: Improves drought tolerance, Helps recovery from heat stress",
      "Advantages: Full-lawn coverage, No plugs or mess, No sprinkler/cable damage"
    ],
    type: "content",
    visualHint: "Show cross-section of soil with roots growing deeper, water penetrating, healthy grass on top"
  },
  {
    slideNumber: 23,
    title: "OUR 10-VISIT LAWN PROGRAM",
    subtitle: "The backbone of everything we do",
    content: [
      "10 seasonally spaced visits designed for local turf",
      "Visits may include: fertilizer, weed control, insect control, and disease support",
      "Includes 1 spring aeration",
      "Includes free service calls between visits when needed",
      "Key point: Consistency + timing = results."
    ],
    type: "list",
    visualHint: "Show a calendar or timeline graphic with 10 visit markers spread across the year"
  },
  {
    slideNumber: 24,
    title: "TIMING IS EVERYTHING",
    subtitle: "High-level seasonal schedule",
    content: [
      "Early Season (Jan–Feb): Pre-emergent + post-emergent",
      "Spring (Mar–Apr): Fertilizer + pre-emergent + liquid aeration",
      "Early Summer (May–Jun): Fertilizer + spot treat",
      "Summer (Jul–Aug): Fertilizer + insect control",
      "Fall (Sep–Oct): Pre-emergent + liquid aeration",
      "Winter (Nov–Dec): Soil conditioner"
    ],
    type: "list",
    visualHint: "Show a circular seasonal calendar with icons for each season and treatment type"
  },
  {
    slideNumber: 25,
    title: "We Can't Do It Alone – Partnership",
    subtitle: "Great lawns require teamwork and continuity",
    content: [
      "Gecko Green owns: Products, treatments, timing, aeration, program structure",
      "Homeowner owns: Watering, mowing, managing traffic and shade limits",
      "Key point: Best lawns happen when both sides execute consistently."
    ],
    type: "content",
    visualHint: "Show two figures shaking hands - one labeled Gecko Green, one labeled Homeowner, with a beautiful lawn between them"
  },
  {
    slideNumber: 26,
    title: "What Makes Gecko Green Different",
    subtitle: "Why homeowners choose us",
    content: [
      "Local experts (regional turf knowledge)",
      "Customized program (not one-size-fits-all)",
      "Licensed technicians",
      "Strong reviews",
      "Free service calls",
      "Reliable communication and follow-through"
    ],
    type: "list",
    visualHint: "Show 6 icons representing each differentiator: map pin, custom gear, badge, 5 stars, phone, checkmark"
  },
  {
    slideNumber: 27,
    title: "Your 30-Second Gecko Green Story",
    subtitle: "The elevator pitch every rep must master",
    content: [
      "\"We specialize in North Texas lawns.\"",
      "\"We run a seasonally spaced 10-visit program.\"",
      "\"We include free service calls.\"",
      "\"Together we get you a lawn you're proud of.\"",
      "Key elements: North Texas focus, 10-visit program, Free service calls, Results-driven"
    ],
    type: "content",
    visualHint: "Show a stopwatch with 30 seconds, speech bubble with the key phrases highlighted"
  },
  {
    slideNumber: 28,
    title: "Prepay Matters – The Triple Win",
    subtitle: "Why prepay is the default option",
    content: [
      "Win #1 — Customer: Save 15%, One payment = simple and convenient",
      "Win #2 — You: Higher commissions, Fewer cancellations",
      "Win #3 — Gecko Green: Stronger commitment, Better retention and planning"
    ],
    type: "content",
    visualHint: "Show 3 trophy or win icons, each representing customer, rep, and company benefits"
  },
  {
    slideNumber: 29,
    title: "How Prepay Boosts Your Commission",
    subtitle: "Your prepay rate directly impacts your paycheck",
    content: [
      "Weekly commission: $0–$2,999 = Base only | $3,000+ = 3% | $4,000+ = 4% | up to 9%+",
      "25% prepay rate: +$7,500 additional commission",
      "40% prepay rate: +$8,800 additional commission"
    ],
    type: "content",
    visualHint: "Show a bar chart or money growth graphic showing commission increasing with prepay percentage"
  },
  {
    slideNumber: 30,
    title: "The Non-Negotiable Prepay Mindset",
    subtitle: "Prepay first. Every time. No exceptions.",
    content: [
      "PREPAY FIRST. EVERY TIME. NO EXCEPTIONS.",
      "Prepay is the default. Autopay is the backup."
    ],
    type: "title",
    visualHint: "Bold, impactful typography. Show a target or bullseye with 'PREPAY' in the center"
  },
  {
    slideNumber: 31,
    title: "Chapter 1 Roleplay Practice",
    subtitle: "Master the fundamentals through repetition",
    content: [
      "Busy right now (≤60s container + control question)",
      "Not interested (acknowledge + reframe + redirect)",
      "No soliciting (micro-permission + show quickly)",
      "I do my own lawn (validate + differentiate + show)",
      "We already have a lawn company (no replacement fear + isolate gap)",
      "Why are you here (purpose statement + direct next action)",
      "Expectation: Repeat each scenario until you can execute pass criteria consistently."
    ],
    type: "list",
    visualHint: "Show a practice/training icon, with the 6 scenarios as a checklist with green checkboxes"
  }
];

function buildPrompt(slide: SlideContent): string {
  const slideTypeInstruction = slide.type === "roleplay" 
    ? "This is a ROLEPLAY scenario slide. Use a distinct visual treatment with speech bubble icons or dialogue indicators. Show PASS criteria with green checkmarks and FAIL conditions with red X marks."
    : slide.type === "title"
    ? "This is a TITLE slide. Make it bold and impactful with large typography."
    : "This is a CONTENT slide. Use clear hierarchy and bullet points with green checkmark icons.";

  const contentFormatted = slide.content.map(item => `• ${item}`).join("\n");

  return `
Create a professional mobile training slide image:

${BRAND_STYLE}

${slideTypeInstruction}

SLIDE ${slide.slideNumber} of 31

TITLE: ${slide.title}
${slide.subtitle ? `SUBTITLE: ${slide.subtitle}` : ""}

CONTENT:
${contentFormatted}

FOOTER: Gecko Green Training Program

VISUAL DIRECTION:
${slide.visualHint || "Use relevant icons and graphics"}

CRITICAL:
- WHITE BACKGROUND
- Gecko Green branding with gecko icon
- Green (#22c55e) for accents
- Portrait (9:16)
- Slide ${slide.slideNumber}/31 at bottom
`;
}

async function generateSlideImage(slide: SlideContent): Promise<string | null> {
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: buildPrompt(slide),
      config: {
        responseModalities: ["Text", "Image"],
        imageConfig: { aspectRatio: "9:16" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const filename = `slide_${String(slide.slideNumber).padStart(2, "0")}.png`;
          const filepath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(filepath, Buffer.from(part.inlineData.data, "base64"));
          console.log(`  ✓ Saved: ${filepath}`);
          return filepath;
        }
      }
    }
    console.log(`  ✗ No image for slide ${slide.slideNumber}`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error slide ${slide.slideNumber}:`, error);
    return null;
  }
}

async function main() {
  console.log(`\nGenerating remaining ${remainingSlides.length} slides (15-31)...\n`);
  
  for (const slide of remainingSlides) {
    await generateSlideImage(slide);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("\nDone!");
}

main().catch(console.error);
