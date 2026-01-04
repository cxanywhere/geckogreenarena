import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const OUTPUT_DIR = "attached_assets/training_slides_ch2";

const BRAND_STYLE = `
Design Style Requirements:
- Portrait orientation (9:16 aspect ratio)
- CLEAN WHITE BACKGROUND
- Primary accent: Gecko Green (#22c55e)
- Clean, modern typography for mobile readability

BRANDING:
- "Gecko Green" brand name with gecko icon at top
- Footer: "Gecko Green Training Program"
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
    slideNumber: 28,
    title: "Payment Options — Prepay vs Autopay",
    subtitle: "Present correctly every time",
    content: [
      "Option A (Default): Prepay - Done for the year, No monthly bills, Savings incentive",
      "Option B (Backup): Autopay - Pay as you go, Card on file required",
      "Instruction: Always present Prepay first. Autopay is the backup."
    ],
    type: "content",
    visualHint: "Show two payment cards: Prepay as primary/highlighted, Autopay as secondary"
  },
  {
    slideNumber: 29,
    title: "RP11 (Phase 4): \"That's expensive.\"",
    subtitle: "Chapter 2 → Pricing → Objection Handling",
    content: [
      "PASS: Normalize reaction, Re-anchor to outcome",
      "FAIL: Discounts immediately",
      "WINNING RESPONSE: 'I hear that — most people said that before seeing the results. What mattered was fixing this permanently.'"
    ],
    type: "roleplay",
    visualHint: "Show homeowner concerned about price, rep calmly focusing on results"
  },
  {
    slideNumber: 30,
    title: "RP12 (Phase 4): \"Another company is cheaper.\"",
    subtitle: "Chapter 2 → Pricing → Competitor Comparison",
    content: [
      "PASS: Reframe to outcome, not price",
      "FAIL: Attacks competitor",
      "WINNING RESPONSE: 'Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved.'"
    ],
    type: "roleplay",
    visualHint: "Show comparison between cheap vs quality, focus on results"
  },
  {
    slideNumber: 31,
    title: "Pitching the Prepay",
    subtitle: "Present → Protect → Prompt",
    content: [
      "Present: 'Most neighbors do the prepay to save and get it done for the year.'",
      "Protect: 'It's fully refundable if you move or change your mind.'",
      "Prompt: 'Do you want to knock that out, or just do the pay-as-you-go?'"
    ],
    type: "content",
    visualHint: "Show 3-step sequence: Present → Protect → Prompt with icons"
  },
  {
    slideNumber: 32,
    title: "Why They Hesitate",
    subtitle: "Common reasons + the right mindset",
    content: [
      "Common reasons: Too much money today, Want to see results first, Might move",
      "Mindset: Prepay is best for them (savings + ease), Refundable = risk-free"
    ],
    type: "content",
    visualHint: "Show thought bubbles with hesitation reasons, reassurance icons"
  },
  {
    slideNumber: 33,
    title: "Overcoming the Hurdle",
    subtitle: "Handle common prepay concerns",
    content: [
      "Money / 'Too much today': Pivot to Autopay as backup",
      "Results / Trust: Emphasize refund policy",
      "Moving: Explain unused portion refund",
      "Key: Stay calm. Remove risk. Return to the close."
    ],
    type: "content",
    visualHint: "Show hurdles being overcome, calm and confident rep"
  },
  {
    slideNumber: 34,
    title: "RP13 (Phase 5): \"Why do I have to pay now?\"",
    subtitle: "Chapter 2 → Close → Payment Explanation",
    content: [
      "PASS: Normalize process, Remove risk, Maintain close",
      "FAIL: Defensive justification",
      "WINNING RESPONSE: 'Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed.'"
    ],
    type: "roleplay",
    visualHint: "Show homeowner questioning payment timing, rep explaining calmly"
  },
  {
    slideNumber: 35,
    title: "RP14 (Phase 5): \"I need to think about it.\"",
    subtitle: "Chapter 2 → Close → Handling Stalls",
    content: [
      "PASS: Isolate the concern, Advance the decision",
      "FAIL: Accepts stall",
      "WINNING RESPONSE: 'Totally — what part are you thinking through? Price, timing, or the treatment itself?'"
    ],
    type: "roleplay",
    visualHint: "Show homeowner hesitating, rep asking probing question"
  },
  {
    slideNumber: 36,
    title: "RP15 (Phase 5): \"I'll call you / send me something.\"",
    subtitle: "Chapter 2 → Close → Securing Next Step",
    content: [
      "PASS: Clarify decision criteria, Regain control of next step",
      "FAIL: Leaves a card and exits",
      "WINNING RESPONSE: 'Happy to — before I go, what would you be deciding after you look it over?'"
    ],
    type: "roleplay",
    visualHint: "Show rep maintaining control instead of just leaving a card"
  },
  {
    slideNumber: 37,
    title: "RP16 (All Phases): Final Certification Assessment",
    subtitle: "Rep must show control across the full flow",
    content: [
      "Scenario: Homeowner triggers objections across ≥3 phases",
      "Pass Criteria: Maintains control, Handles Phase 5 close objection, Advances toward decision",
      "Success: Acknowledges → directs next step → stays calm → closes with confidence"
    ],
    type: "roleplay",
    visualHint: "Show certification badge, multi-phase challenge with checkmarks"
  },
  {
    slideNumber: 38,
    title: "Chapter 2 — Ready for Live Doors?",
    subtitle: "Your Readiness Checklist",
    content: [
      "☐ Memorized door intro",
      "☐ Mastered Turn & Burn",
      "☐ Know B-P-D-C",
      "☐ Can pitch prepay correctly",
      "Bottom line: If you checked all boxes, you are ready to win."
    ],
    type: "list",
    visualHint: "Show checklist with 4 items, trophy at bottom for 'ready to win'"
  }
];

function buildPrompt(slide: SlideContent): string {
  const slideTypeInstruction = slide.type === "roleplay" 
    ? "This is a ROLEPLAY slide. Show PASS with green checkmarks, FAIL with red X."
    : slide.type === "title"
    ? "This is a TITLE slide. Bold, impactful typography."
    : "This is a CONTENT slide. Clear hierarchy with green checkmark icons.";

  const contentFormatted = slide.content.map(item => `• ${item}`).join("\n");

  return `
Create a professional mobile training slide:

${BRAND_STYLE}

${slideTypeInstruction}

SLIDE ${slide.slideNumber} of 38

TITLE: ${slide.title}
${slide.subtitle ? `SUBTITLE: ${slide.subtitle}` : ""}

CONTENT:
${contentFormatted}

FOOTER: Gecko Green Training Program

VISUAL: ${slide.visualHint || "Use relevant icons"}

CRITICAL: WHITE BACKGROUND, Gecko Green branding, Portrait (9:16), Slide ${slide.slideNumber}/38 at bottom
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
  console.log(`\nGenerating remaining ${remainingSlides.length} slides (28-38)...\n`);
  
  for (const slide of remainingSlides) {
    await generateSlideImage(slide);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("\nDone!");
}

main().catch(console.error);
