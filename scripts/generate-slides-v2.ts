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
  footer?: string;
  type: "title" | "content" | "roleplay" | "list";
  visualHint?: string;
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
    type: "title",
    visualHint: "Show a confident sales rep silhouette at a door, with a beautiful green lawn in the background"
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
    type: "list",
    visualHint: "Show a progression path with numbered steps, each with a small icon representing the skill"
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
    type: "list",
    visualHint: "Show 4 pillar/column graphics, each with an icon: clock, smiley face, practice target, door"
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
    type: "content",
    visualHint: "Show a brain icon with positive energy, trophy, or champion imagery"
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
      "Remove sunglasses before the door opens"
    ],
    type: "list",
    visualHint: "Show a professional sales rep figure with arrows pointing to each dress code element - like a checklist overlay on the figure"
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
    type: "content",
    visualHint: "Show 3 panels: 1) Rep knocking, 2) Rep waiting relaxed, 3) Rep smiling at door with homeowner"
  },
  {
    slideNumber: 7,
    title: "Roleplay #1: \"I'm actually really busy right now.\"",
    subtitle: "Opening → First 10 Seconds",
    content: [
      "PASS: Acknowledge time pressure, Set a ≤60-second container, Ask a qualifying control question",
      "FAIL: Pitches immediately or disengages",
      "WINNING RESPONSE: \"Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?\""
    ],
    type: "roleplay",
    visualHint: "Show a homeowner looking busy/rushed at door, with speech bubble. Use green checkmark for pass, red X for fail"
  },
  {
    slideNumber: 8,
    title: "Roleplay #2: \"Not interested.\"",
    subtitle: "Opening → Handling Brush-Offs",
    content: [
      "PASS: Acknowledge, Reframe to a specific issue, Redirect with a control question",
      "FAIL: Argues or accepts rejection immediately",
      "WINNING RESPONSE: \"That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?\""
    ],
    type: "roleplay",
    visualHint: "Show a homeowner with dismissive gesture, rep staying calm. Speech bubbles showing the exchange"
  },
  {
    slideNumber: 9,
    title: "Roleplay #3: \"No soliciting.\"",
    subtitle: "Opening → Compliance & Authority",
    content: [
      "PASS: Acknowledge the rule, Clarify intent, Request micro-permission",
      "FAIL: Debates the policy",
      "WINNING RESPONSE: \"I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?\""
    ],
    type: "roleplay",
    visualHint: "Show a 'No Soliciting' sign, with rep pointing toward the lawn politely"
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
    type: "list",
    visualHint: "Show a beautiful home with green lawn, happy family, kids playing - aspirational imagery"
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
    type: "content",
    visualHint: "Show a heart icon on one side (emotion) and brain icon on other side (logic), with arrows showing they work together"
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
    type: "content",
    visualHint: "Show two scenarios: 1) homeowner oblivious to weedy lawn, 2) homeowner stressed looking at bad lawn"
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
    type: "list",
    visualHint: "Show a handshake icon, trust badge, or shield with checkmark - professional trust imagery"
  },
  {
    slideNumber: 14,
    title: "Roleplay #4: \"I do my own lawn.\"",
    subtitle: "Turn & Burn → DIY Pushback",
    content: [
      "PASS: Validate their identity/pride, Differentiate without insulting, Regain the lead with a show-you question",
      "FAIL: Tries to convert DIY generally or starts pitching features",
      "WINNING RESPONSE: \"That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?\""
    ],
    type: "roleplay",
    visualHint: "Show a proud homeowner with lawn mower, rep respectfully pointing to an issue on the lawn"
  },
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
    ? "This is a ROLEPLAY scenario slide. Use a distinct visual treatment with speech bubble icons or dialogue indicators. Show PASS criteria with green checkmarks and FAIL conditions with red X marks. Include an illustration of the customer-rep interaction."
    : slide.type === "title"
    ? "This is a TITLE slide. Make it bold and impactful with large typography. Include an inspiring visual related to the content."
    : "This is a CONTENT slide. Use clear hierarchy and bullet points with green checkmark icons.";

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

${slide.footer ? `FOOTER: ${slide.footer}` : "FOOTER: Gecko Green Training Program"}

VISUAL DIRECTION:
${slide.visualHint || "Use relevant icons and graphics to support the content"}

CRITICAL REQUIREMENTS:
- WHITE BACKGROUND - clean, bright, professional
- Gecko Green branding with gecko icon at top
- All text must be clearly readable on a mobile phone screen
- Use green (#22c55e) for headers, icons, and accent elements
- Include visual examples and illustrations as specified
- Portrait orientation (9:16 aspect ratio)
- Slide number indicator (${slide.slideNumber}/31) at bottom
- Professional, clean, modern design
- The text MUST be legible and properly rendered
- NO dark/black backgrounds
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
  console.log("Brand: Gecko Green");
  console.log("Background: WHITE (clean, professional)");
  console.log("Format: Portrait (9:16) for mobile viewing");
  console.log("Model: gemini-3-pro-image-preview");
  console.log("Visual: Includes examples and illustrations\n");
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
