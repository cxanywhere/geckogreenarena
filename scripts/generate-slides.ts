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
- Dark background (#0a0a0a or very dark charcoal)
- Primary accent color: bright green (#22c55e)
- Clean, modern typography with good readability
- Professional training slide aesthetic
- "arena ai" logo text in lowercase green at top left
- "Gecko Green" branding where appropriate
- Use icons and visual elements to break up text
- High contrast for mobile readability
- No stock photos - use abstract shapes, icons, or solid colors
- Generous whitespace and padding
- Text should be large enough to read on mobile
`;

interface SlideContent {
  slideNumber: number;
  title: string;
  subtitle?: string;
  content: string[];
  footer?: string;
  type: "title" | "content" | "roleplay" | "list";
}

const slides: SlideContent[] = [
  {
    slideNumber: 1,
    title: "CERTIFICATION 1 – CHAPTER 1",
    subtitle: "Sales Foundations, Lawn Care Fundamentals & the Prepay Mindset",
    content: [
      "Master the fundamentals (the repeatable behaviors that win at the door)",
      "Fuel your sales engine (standards, habits, and a simple process)",
      "Adopt the winning mindset (confidence, control, and resilience)"
    ],
    footer: "Gecko Green – New Joinee Training Program",
    type: "title"
  },
  {
    slideNumber: 2,
    title: "What Chapter 1 Prepares You For",
    subtitle: "Your Journey to Field Excellence Starts Here",
    content: [
      "Execute a strong door approach and opening",
      "Communicate lawn care concepts in simple language",
      "Explain the Gecko Green program clearly and quickly",
      "Set expectations (results take time; seed bank is real)",
      "Explain the homeowner partnership responsibilities",
      "Present prepay as the default and understand how it impacts commission"
    ],
    type: "list"
  },
  {
    slideNumber: 3,
    title: "Four Pillars of Field Success",
    subtitle: "The Foundation That Makes Everything Else Possible",
    content: [
      "Timeliness — Be where you should be, when you should be there",
      "Attitude — Mindset drives tone, confidence, and outcomes",
      "Practice — Repetition builds skill (scripts + scenarios)",
      "Persistence — More quality doors = more wins"
    ],
    type: "list"
  },
  {
    slideNumber: 4,
    title: "WINNING SALES MINDSET",
    subtitle: "The Mental Game That Separates Winners from Quitters",
    content: [
      "Confidence: You offer real value",
      "Optimism: 'No' is part of the process",
      "Personality: People buy from people",
      "Endurance: Consistency wins the week, month, and season",
      "Bottom line: Train your mind. Secure the win."
    ],
    type: "content"
  },
  {
    slideNumber: 5,
    title: "First Impressions Start Before You Talk",
    subtitle: "You're being evaluated before you say a single word",
    content: [
      "Clean, neat shirt (tucked in)",
      "Khaki shorts or pants (no cargo)",
      "Clean, presentable tennis shoes",
      "Name badge and permits visible",
      "Groomed hair and facial hair",
      "No visible tattoos/body art; no earrings",
      "Remove sunglasses before the door opens",
      "Key point: Your appearance is the first proof of professionalism."
    ],
    type: "list"
  },
  {
    slideNumber: 6,
    title: "Professional Presence at the Door",
    subtitle: "Body language and behavior that increases open rates and trust",
    content: [
      "Before the door opens: Knock firmly, Step back (give space), Do not look through windows",
      "If you knock again: Stay relaxed, Observe the lawn so you can speak specifically",
      "When the door opens: Light smile, eye contact, Relaxed shoulders, Calm confident voice"
    ],
    type: "content"
  },
  {
    slideNumber: 7,
    title: "RP1: \"I'm actually really busy right now.\"",
    subtitle: "Opening → First 10 Seconds",
    content: [
      "PASS: Acknowledge time pressure, Set a ≤60-second container, Ask a qualifying control question",
      "FAIL: Pitches immediately or disengages",
      "WINNING RESPONSE: \"Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?\""
    ],
    type: "roleplay"
  },
  {
    slideNumber: 8,
    title: "RP2: \"Not interested.\"",
    subtitle: "Opening → Handling Brush-Offs",
    content: [
      "PASS: Acknowledge, Reframe to a specific issue, Redirect with a control question",
      "FAIL: Argues or accepts rejection immediately",
      "WINNING RESPONSE: \"That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?\""
    ],
    type: "roleplay"
  },
  {
    slideNumber: 9,
    title: "RP3: \"No soliciting.\"",
    subtitle: "Opening → Compliance & Authority",
    content: [
      "PASS: Acknowledge the rule, Clarify intent, Request micro-permission",
      "FAIL: Debates the policy",
      "WINNING RESPONSE: \"I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?\""
    ],
    type: "roleplay"
  },
  {
    slideNumber: 10,
    title: "WHY HOMEOWNERS BUY LAWN CARE",
    subtitle: "They're not buying chemicals — they're buying a better life",
    content: [
      "Curb appeal & pride: a yard you feel good about",
      "Higher property value: protects the investment",
      "Safe space for kids & pets: peace of mind",
      "Neighborhood confidence: nobody wants the worst yard",
      "Less stress: time back and fewer headaches"
    ],
    type: "list"
  },
  {
    slideNumber: 11,
    title: "EMOTION & LOGIC IN EVERY SALE",
    subtitle: "People feel first, then justify with facts",
    content: [
      "Emotion drives action: Embarrassment, pride, frustration, relief",
      "Logic justifies the decision: Program structure, visit count, price vs value",
      "Key point: Lead with outcomes, then support with facts."
    ],
    type: "content"
  },
  {
    slideNumber: 12,
    title: "REALIZED & UNREALIZED NEEDS",
    subtitle: "Your job is to reveal the problem and guide the decision",
    content: [
      "Unrealized need: 'They don't see the problem.' Your job: educate and reveal.",
      "Realized need: 'They know they need help.' Your job: deliver solution and build trust.",
      "Physical needs: weeds, thin grass, discoloration",
      "Emotional needs: pride, stress reduction, confidence"
    ],
    type: "content"
  },
  {
    slideNumber: 13,
    title: "TRUST COMES BEFORE ANY SALE",
    subtitle: "Without trust, nothing else matters",
    content: [
      "Professional appearance — signals competence",
      "Calm, confident tone — reduces resistance",
      "Clear, honest explanations — builds credibility",
      "No overpromising — set realistic expectations and deliver consistently"
    ],
    type: "list"
  },
  {
    slideNumber: 14,
    title: "RP4: \"I do my own lawn.\"",
    subtitle: "Turn & Burn → DIY Pushback",
    content: [
      "PASS: Validate their identity/pride, Differentiate without insulting, Regain the lead with a show-you question",
      "FAIL: Tries to convert DIY generally or starts pitching features",
      "WINNING RESPONSE: \"That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?\""
    ],
    type: "roleplay"
  },
  {
    slideNumber: 15,
    title: "RP5: \"We already have a lawn company.\"",
    subtitle: "Turn & Burn → Existing Provider",
    content: [
      "PASS: Acknowledge and remove replacement fear, Isolate a gap (visible issue), Ask a control question",
      "FAIL: Attacks the competitor or claims superiority without evidence",
      "WINNING RESPONSE: \"Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?\""
    ],
    type: "roleplay"
  },
  {
    slideNumber: 16,
    title: "RP6: \"Why are you here?\"",
    subtitle: "Turn & Burn → Purpose Statement",
    content: [
      "PASS: State purpose clearly, Direct the next action (show/point), Stay concise",
      "FAIL: Rambles or over-explains the company/services",
      "WINNING RESPONSE: \"Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.\""
    ],
    type: "roleplay"
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
    type: "content"
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
    type: "content"
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
    type: "content"
  },
  {
    slideNumber: 20,
    title: "PRE-EMERGENT VS. POST-EMERGENT",
    subtitle: "Timing is everything",
    content: [
      "Pre-emergent (Prevention): Stops weeds before they sprout, Creates a barrier that interrupts seed development, Reduces future weeds",
      "Post-emergent (Treatment): Targets existing weeds, Visible results typically in 10–14 days"
    ],
    type: "content"
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
    type: "list"
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
    type: "content"
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
    type: "list"
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
    type: "list"
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
    type: "content"
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
    type: "list"
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
    type: "content"
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
    type: "content"
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
    type: "content"
  },
  {
    slideNumber: 30,
    title: "The Non-Negotiable Prepay Mindset",
    subtitle: "Prepay first. Every time. No exceptions.",
    content: [
      "PREPAY FIRST. EVERY TIME. NO EXCEPTIONS.",
      "Prepay is the default. Autopay is the backup."
    ],
    type: "title"
  },
  {
    slideNumber: 31,
    title: "ARENA AI: Chapter 1 Roleplay Practice",
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
    type: "list"
  }
];

function buildPrompt(slide: SlideContent): string {
  const slideTypeInstruction = slide.type === "roleplay" 
    ? "This is a ROLEPLAY scenario slide. Use a distinct visual treatment with speech bubble icons or dialogue indicators. Highlight PASS/FAIL criteria clearly."
    : slide.type === "title"
    ? "This is a TITLE slide. Make it bold and impactful with large typography."
    : "This is a CONTENT slide. Use clear hierarchy and bullet points.";

  const contentFormatted = slide.content.map(item => `• ${item}`).join("\n");

  return `
Create a professional mobile training slide image with these exact specifications:

${BRAND_STYLE}

${slideTypeInstruction}

SLIDE ${slide.slideNumber} of 31

TITLE: ${slide.title}
${slide.subtitle ? `SUBTITLE: ${slide.subtitle}` : ""}

CONTENT:
${contentFormatted}

${slide.footer ? `FOOTER: ${slide.footer}` : ""}

Requirements:
- All text must be clearly readable on a mobile phone screen
- Use the green accent (#22c55e) for important highlights and headers
- Include "arena ai" branding at the top
- Include slide number indicator (${slide.slideNumber}/31)
- Use icons or visual elements to support the content
- Portrait orientation (9:16 aspect ratio)
- Dark background with high contrast text
- Professional, clean, modern design
- The text MUST be legible and properly rendered
`;
}

async function generateSlideImage(slide: SlideContent): Promise<string | null> {
  const prompt = buildPrompt(slide);
  
  console.log(`Generating slide ${slide.slideNumber}: ${slide.title}`);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const filename = `slide_${String(slide.slideNumber).padStart(2, "0")}.png`;
          const filepath = path.join(OUTPUT_DIR, filename);
          
          const imageBuffer = Buffer.from(part.inlineData.data, "base64");
          fs.writeFileSync(filepath, imageBuffer);
          
          console.log(`  ✓ Saved: ${filepath}`);
          return filepath;
        }
      }
    }
    
    console.log(`  ✗ No image generated for slide ${slide.slideNumber}`);
    return null;
  } catch (error) {
    console.error(`  ✗ Error generating slide ${slide.slideNumber}:`, error);
    return null;
  }
}

async function generateAllSlides() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log(`\nStarting slide generation for ${slides.length} slides...\n`);
  console.log("Brand: Arena AI by GigaRev / Gecko Green");
  console.log("Format: Portrait (9:16) for mobile viewing");
  console.log("Model: gemini-3-pro-image-preview\n");
  console.log("=".repeat(50));
  
  const results: { slide: number; success: boolean; path?: string }[] = [];
  
  for (const slide of slides) {
    const filepath = await generateSlideImage(slide);
    results.push({
      slide: slide.slideNumber,
      success: filepath !== null,
      path: filepath || undefined
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("\n" + "=".repeat(50));
  console.log("GENERATION COMPLETE\n");
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✓ Successful: ${successful}/${slides.length}`);
  console.log(`✗ Failed: ${failed}/${slides.length}`);
  
  if (failed > 0) {
    console.log("\nFailed slides:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - Slide ${r.slide}`);
    });
  }
  
  console.log(`\nSlides saved to: ${OUTPUT_DIR}/`);
}

generateAllSlides().catch(console.error);
