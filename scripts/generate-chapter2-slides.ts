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
- Portrait orientation optimized for mobile (9:16 aspect ratio)
- CLEAN WHITE BACKGROUND - bright, professional, easy to read
- Primary accent color: Gecko Green (#22c55e) for headers, highlights, and key elements
- Secondary accent: Dark green (#166534) for emphasis
- Clean, modern typography with excellent readability on mobile
- Professional lawn care training slide aesthetic

BRANDING:
- Include the "Gecko Green" brand name prominently at the top with a gecko/lizard icon
- Footer should say "Gecko Green Training Program"
- NO "arena ai" branding - this is Gecko Green content

VISUAL EXAMPLES:
- Include relevant illustrations, icons, or visual examples
- When discussing homeowners/customers, show a friendly homeowner illustration
- When discussing lawns, show healthy green grass imagery
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

const slides: SlideContent[] = [
  {
    slideNumber: 1,
    title: "CERTIFICATION 1 – CHAPTER 2",
    subtitle: "Field Sales Process, Objections, Closing & Payment (Prepay Basics)",
    content: [
      "Turning Chapter 1 knowledge into a repeatable field execution flow",
      "Running a consistent 5-phase sales process",
      "Handling objections without arguing",
      "Closing confidently and presenting payment correctly (prepay first)"
    ],
    type: "title",
    visualHint: "Show a confident sales rep walking toward a door with a clipboard, professional lawn in background"
  },
  {
    slideNumber: 2,
    title: "What Chapter 2 Prepares You For",
    subtitle: "Your Playbook for Field Execution",
    content: [
      "Run the 5-phase sales process",
      "Turn & Burn (move from door → lawn)",
      "On-lawn presentation (diagnose + advise)",
      "Objection handling (framework-based)",
      "Payment presentation (prepay first)",
      "Closing (secure commitment cleanly)"
    ],
    type: "list",
    visualHint: "Show a playbook or checklist with 6 items, each with icons representing the skill"
  },
  {
    slideNumber: 3,
    title: "From Knowledge to Execution",
    subtitle: "Chapter 1 = WHAT/WHY, Chapter 2 = HOW",
    content: [
      "Chapter 1: The WHAT & WHY - Lawn fundamentals, Program, Prepay win (concept)",
      "Chapter 2: The HOW (Field Execution) - Real conversations, Step-by-step field process, Explaining prepay in the moment, Closing and moving the deal forward"
    ],
    type: "content",
    visualHint: "Show two connected boxes or arrows: 'KNOWLEDGE' flowing into 'EXECUTION'"
  },
  {
    slideNumber: 4,
    title: "The 5 Phases of the Gecko Green Sale",
    subtitle: "The Roadmap to a Closed Deal",
    content: [
      "1. Establish Rapport at the Door",
      "2. Turn & Burn (Door → Lawn)",
      "3. On-Lawn Presentation (Advisor Mode)",
      "4. Objection Handling (Framework)",
      "5. Closing, Payment & Wrap-Up",
      "When you feel stuck, ask: 'Which phase am I in—and what is my job right now?'"
    ],
    type: "list",
    visualHint: "Show 5 numbered steps as a roadmap or flowchart with icons for each phase"
  },
  {
    slideNumber: 5,
    title: "Phase 1 — Establish Rapport at the Door",
    subtitle: "Your Goals & Key Reminders",
    content: [
      "Goals: Show professional and safe, Lower their guard, Earn the right to look at the lawn",
      "Reminders: Step back, relaxed shoulders, Smile, eye contact, calm voice, Do not lead with price"
    ],
    type: "content",
    visualHint: "Show a rep at a door with friendly posture, homeowner visible, checkmarks for good body language"
  },
  {
    slideNumber: 6,
    title: "Door Intro — Example Script",
    subtitle: "A simple talk track you can memorize",
    content: [
      "\"Hey, I'm ___ with Gecko Green. We take care of a lot of lawns in this area, and I noticed you've got some weeds and thin spots out front. I'm not here to twist your arm—I just wanted to show you what we're doing for your neighbors and see if it might make sense for you too.\"",
      "Key notes: Mention their lawn and nearby neighbors, Tone: calm, confident, friendly, One goal: earn permission to look at the lawn"
    ],
    type: "content",
    visualHint: "Show a speech bubble with the script text, rep illustration speaking to homeowner"
  },
  {
    slideNumber: 7,
    title: "Door Etiquette & Common Mistakes",
    subtitle: "First impressions matter",
    content: [
      "DO: Step back, Hands visible, Look at homeowner (not around)",
      "AVOID: Leaning on door frame, Staring into windows, Fidgeting, Talking too fast",
      "Key point: The first 5 seconds can make or break the conversation."
    ],
    type: "list",
    visualHint: "Split view: left side shows correct behavior with checkmarks, right side shows mistakes with X marks"
  },
  {
    slideNumber: 8,
    title: "Turning a No into a Maybe",
    subtitle: "Handle brush-offs without losing control",
    content: [
      "Common brush-offs: 'Not interested', 'We're fine', 'Busy'",
      "Soft comeback example: 'Totally understand—I'll be quick. Let me just show you what we're doing for your neighbors…'",
      "Goals: Stay respectful, Keep it light, Move to Turn & Burn (door → lawn)"
    ],
    type: "content",
    visualHint: "Show a homeowner with initial resistance, rep staying calm with a soft response"
  },
  {
    slideNumber: 9,
    title: "Phase 2 — Turn & Burn (Door to Lawn)",
    subtitle: "Moving the Conversation Forward",
    content: [
      "What Turn & Burn is: Smoothly shifting from the door to the lawn so you can talk about something visible",
      "Goals: Stop debating at the door, Get homeowner looking at the lawn, Talk about visible issues",
      "Field truth: People relax when you step off the porch and talk about something they can see."
    ],
    type: "content",
    visualHint: "Show movement arrow from door to lawn, rep and homeowner walking together toward grass"
  },
  {
    slideNumber: 10,
    title: "Natural Transitions",
    subtitle: "Simple lines that create motion",
    content: [
      "Use one of these: 'Step out here with me…', 'Let me walk you through…', 'Let me point out…'",
      "Execution: Walk next to them, Gesture toward the lawn, Keep it natural (not rushed)"
    ],
    type: "content",
    visualHint: "Show rep gesturing toward lawn with homeowner, speech bubbles with transition phrases"
  },
  {
    slideNumber: 11,
    title: "Executing the Move",
    subtitle: "Turn & Burn success rules",
    content: [
      "Do: Comfortable pace, Light conversation, Stop at the weeds / problem area",
      "Don't: Turn back and rush, Keep talking at the door, Long speeches"
    ],
    type: "list",
    visualHint: "Show checkmarks for do's and X marks for don'ts, with rep walking at comfortable pace"
  },
  {
    slideNumber: 12,
    title: "Phase 3 — On-Lawn Presentation",
    subtitle: "Becoming the Lawn Advisor",
    content: [
      "Goals: Show 1–2 real issues, Explain why it's happening, Connect to the program, Set expectations",
      "Key identity shift: This is where you become a lawn advisor, not just a salesperson."
    ],
    type: "content",
    visualHint: "Show rep in advisor mode pointing at lawn issue, homeowner nodding, professional stance"
  },
  {
    slideNumber: 13,
    title: "The 4-Step Diagnosis",
    subtitle: "Your simple on-lawn structure",
    content: [
      "1. Observe & Confirm: 'Do you see…?' (identify the visible issue with them)",
      "2. Explain the Why: Briefly explain what causes it (timing/seed bank/soil)",
      "3. Connect to Program: 'Our program handles this by…'",
      "4. Set Expectations & Partnership: Define timeline + homeowner role (watering/mowing)"
    ],
    type: "list",
    visualHint: "Show 4 numbered steps with icons: magnifying glass, lightbulb, gear/program, handshake"
  },
  {
    slideNumber: 14,
    title: "Control vs. Perfection",
    subtitle: "The expectation you must set",
    content: [
      "Teach simply: Group weeds broadly (broadleaf vs grassy), Emphasize control and reduction, Seed bank = new weeds can appear",
      "Positioning statement: 'We focus on controlling the weed population and thickening your grass so there's less room for weeds to come back.'"
    ],
    type: "content",
    visualHint: "Show comparison: 'CONTROL' with steady improvement graph vs 'PERFECTION' with impossible target"
  },
  {
    slideNumber: 15,
    title: "Thickening the Lawn",
    subtitle: "Explain the 'before → after' path",
    content: [
      "Coach's playbook: Assess (Check grass type and shade), Execute (Fertilizer + weed control + aeration)",
      "Honest truth & expectations: The program improves color and thickness, Large bare dirt areas may require sod/plugs (set that expectation early)"
    ],
    type: "content",
    visualHint: "Show before/after lawn images: thin patchy lawn transforming to thick healthy grass"
  },
  {
    slideNumber: 16,
    title: "The Partnership Agreement",
    subtitle: "Clear expectations = happy customers",
    content: [
      "Timeline: Early wins (weeks): weed control + better color | Visible progress (months): thickness + density | Full results (season): healthier, resilient lawn",
      "Team roles - Our plays: expert evaluation, targeted weed control, aeration, seasonal plan | Your plays: correct watering, proper mowing height/frequency, report issues promptly",
      "One-line reminder: 'Our shared goal is a winning lawn—your watering and mowing unlock the full impact of our treatments.'"
    ],
    type: "content",
    visualHint: "Show a handshake between Gecko Green and Homeowner with timeline below"
  },
  {
    slideNumber: 17,
    title: "RP7 (Phase 3): \"My lawn looks fine.\"",
    subtitle: "Chapter 2 → Lawn Walk → Identifying Issues",
    content: [
      "PASS: Validate, Isolate a specific problem, Visually point to it",
      "FAIL: Agrees and moves on",
      "WINNING RESPONSE: 'Overall it does — this spot is what I'm flagging, though. See how it's spreading here?'",
      "How to Succeed: Confirm the positive, then narrow to one visible issue. Use 'right here' language and point."
    ],
    type: "roleplay",
    visualHint: "Show homeowner saying lawn looks fine, rep pointing to specific weed spot"
  },
  {
    slideNumber: 18,
    title: "RP8 (Phase 3): \"Weeds don't bother me.\"",
    subtitle: "Chapter 2 → Lawn Walk → Educating on Spread",
    content: [
      "PASS: Reframe consequence (spread/competition), Keep discovery moving",
      "FAIL: Accepts apathy",
      "WINNING RESPONSE: 'Totally — most don't until it spreads into the healthy grass. That's what I want to prevent here.'",
      "How to Succeed: Do not argue taste—anchor to prevention and protecting healthy grass"
    ],
    type: "roleplay",
    visualHint: "Show weeds spreading into healthy grass area, rep educating homeowner"
  },
  {
    slideNumber: 19,
    title: "RP9 (Phase 3): \"I don't see the issue.\"",
    subtitle: "Chapter 2 → Lawn Walk → Showing, Not Telling",
    content: [
      "PASS: Demonstrate visually, not verbally",
      "FAIL: Explains abstractly",
      "WINNING RESPONSE: 'Let me point it out — right along this edge, that discoloration is the early sign.'",
      "How to Succeed: Point to an edge/patch and name one clear signal (discoloration, thinning, weed line)"
    ],
    type: "roleplay",
    visualHint: "Show rep pointing to lawn edge with visible issue, homeowner looking"
  },
  {
    slideNumber: 20,
    title: "Phase 4 — Objection Handling",
    subtitle: "Guiding, Not Arguing",
    content: [
      "Core truths: Objections are normal = engagement, Your job: understand and guide (not debate)",
      "Your rule: If they object, you slow down and run the framework—calmly."
    ],
    type: "content",
    visualHint: "Show calm rep listening to concerned homeowner, peace/balance imagery"
  },
  {
    slideNumber: 21,
    title: "B-P-D-C — The Universal Framework",
    subtitle: "Your Objection Compass",
    content: [
      "B — Buffer: Acknowledge and diffuse: 'I understand.'",
      "P — Probe: Ask to uncover the root: 'What worries you?'",
      "D — Discover: Identify the true concern (what's really stopping them)",
      "C — Close: Present a tailored solution and confidently move forward",
      "Key: You do not 'answer objections.' You discover them, then close."
    ],
    type: "list",
    visualHint: "Show compass with B-P-D-C at four points, arrows showing the flow"
  },
  {
    slideNumber: 22,
    title: "The Big 5 (Non-Payment)",
    subtitle: "Core Objections You Will Hear",
    content: [
      "1. Not Interested",
      "2. I Do It Myself",
      "3. I Already Have a Company",
      "4. Let Me Think About It",
      "5. I Need to Talk to My Spouse",
      "Note: Payment/prepay comes next—do not lead with it."
    ],
    type: "list",
    visualHint: "Show 5 numbered objections with icons for each: hand stop, lawnmower, company logo, thought bubble, couple"
  },
  {
    slideNumber: 23,
    title: "Quick Responses",
    subtitle: "Use B-P-D-C in real language",
    content: [
      "For 'Not interested': Buffer: 'Totally understand.' Probe: 'Just to be sure I'm not missing something—anything specific you're trying to improve?' Discover: Identify the issue they care about. Close: 'Would you be open to a quick look so I can show you what I'm seeing?'",
      "For 'DIY / Existing Company': Respect: 'That's great—it shows you care about your lawn.' Probe: 'What's working well, and what would you like improved?' Close: 'Can we do a quick 2-minute walk so I can point out what I'd address?'"
    ],
    type: "content",
    visualHint: "Show conversation flow diagrams for each objection type"
  },
  {
    slideNumber: 24,
    title: "Sealing the Deal",
    subtitle: "Your closing game plan",
    content: [
      "Goals: Confirm they want to move forward, Present payment (Prepay first; Autopay backup), Set expectations (first visit, results timeline, partnership)"
    ],
    type: "content",
    visualHint: "Show handshake, checkmark, and forward arrow - deal closing imagery"
  },
  {
    slideNumber: 25,
    title: "Green Lights",
    subtitle: "When you see these, stop selling and start closing",
    content: [
      "Verbal: 'How much is it?', 'When can you start?', 'Does that include…?'",
      "Non-verbal: Nodding, Stepping closer, Relaxed posture",
      "Rule: When you see green lights, transition to close flow."
    ],
    type: "list",
    visualHint: "Show green traffic light with verbal and non-verbal signals listed"
  },
  {
    slideNumber: 26,
    title: "The Closing Flow",
    subtitle: "Master this sequence",
    content: [
      "1. Recap Value: 'So we're going to handle the weeds, thicken the grass, and stay ahead of it seasonally…'",
      "2. State Price: 'Normally it's $X, but since we're here it's $Y for the first one…'",
      "3. Assume the Sale: 'Does that sound fair? Let's get you started.'"
    ],
    type: "list",
    visualHint: "Show 3-step flow: Value → Price → Close with arrows"
  },
  {
    slideNumber: 27,
    title: "RP10 (Phase 4): \"How much does it cost?\"",
    subtitle: "Chapter 2 → Pricing → Before Quoting",
    content: [
      "PASS: Defer price briefly, Anchor value first",
      "FAIL: Answers price immediately",
      "WINNING RESPONSE: 'I'll get there — first let me show you what it would cover, because price only makes sense after that.'",
      "How to Succeed: Value first, then price. Keep control of sequence (Value → Price → Close)"
    ],
    type: "roleplay",
    visualHint: "Show homeowner asking about price, rep redirecting to value first"
  },
  {
    slideNumber: 28,
    title: "Payment Options — Prepay vs Autopay",
    subtitle: "Present correctly every time",
    content: [
      "Option A (Default): Prepay - Done for the year, No monthly bills, Savings incentive (per program policy)",
      "Option B (Backup): Autopay - Pay as you go, Card on file required",
      "Instruction: Always present Prepay first. Autopay is the backup option."
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
      "WINNING RESPONSE: 'I hear that — most people said that before seeing the results. What mattered was fixing this permanently.'",
      "How to Succeed: Do not negotiate against yourself. Bring them back to the problem and result"
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
      "WINNING RESPONSE: 'Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved.'",
      "How to Succeed: Stay neutral. Compare on results, consistency, and solving the issue"
    ],
    type: "roleplay",
    visualHint: "Show comparison between cheap vs quality, focus on results not price"
  },
  {
    slideNumber: 31,
    title: "Pitching the Prepay",
    subtitle: "Present → Protect → Prompt (Field Version)",
    content: [
      "Present: 'Most neighbors do the prepay to save and get it done for the year.'",
      "Protect: 'It's fully refundable if you move or change your mind.'",
      "Prompt: 'Do you want to knock that out, or just do the pay-as-you-go?'",
      "Instruction: Deliver this sequence confidently and briefly."
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
    subtitle: "Handle common prepay concerns without defensiveness",
    content: [
      "Money / 'Too much today': Pivot to Autopay as backup after attempting prepay close",
      "Results / Trust: Emphasize refund policy and service correction process",
      "Moving: Explain unused portion refund / check process (per policy)",
      "Key instruction: Stay calm. Remove risk. Return to the close."
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
      "WINNING RESPONSE: 'Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed.'",
      "How to Succeed: Make it standard + risk-free. Then prompt the decision again"
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
      "WINNING RESPONSE: 'Totally — what part are you thinking through? Price, timing, or the treatment itself?'",
      "How to Succeed: Turn 'think' into a specific reason. Solve the real issue and close"
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
      "WINNING RESPONSE: 'Happy to — before I go, what would you be deciding after you look it over?'",
      "How to Succeed: Identify what decision is pending. Convert to a scheduled next step or immediate resolution"
    ],
    type: "roleplay",
    visualHint: "Show rep maintaining control instead of just leaving a card"
  },
  {
    slideNumber: 37,
    title: "RP16 (All Phases): Final Certification Assessment",
    subtitle: "Rep must show control across the full flow",
    content: [
      "Scenario: Homeowner triggers objections across ≥3 phases: Phase 1 ('I'm busy' or 'Not interested'), Phase 2/3 ('We already have a lawn company' OR 'My lawn looks fine'), Phase 5 (mandatory): 'Why do I have to pay now?' OR 'I need to think about it'",
      "Pass Criteria: Maintains control across ≥3 phases, Successfully handles Phase 5 close objection, Stays in discovery and advances toward decision",
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
    visualHint: "Show checklist with 4 items, graduation cap or trophy at bottom for 'ready to win'"
  }
];

function buildPrompt(slide: SlideContent): string {
  const slideTypeInstruction = slide.type === "roleplay" 
    ? "This is a ROLEPLAY scenario slide. Use a distinct visual treatment with speech bubble icons. Show PASS criteria with green checkmarks and FAIL with red X marks."
    : slide.type === "title"
    ? "This is a TITLE slide. Make it bold and impactful with large typography."
    : "This is a CONTENT slide. Use clear hierarchy and bullet points with green checkmark icons.";

  const contentFormatted = slide.content.map(item => `• ${item}`).join("\n");

  return `
Create a professional mobile training slide image:

${BRAND_STYLE}

${slideTypeInstruction}

SLIDE ${slide.slideNumber} of 38

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
- Slide ${slide.slideNumber}/38 at bottom
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
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  console.log(`\nGenerating ${slides.length} Chapter 2 slides...\n`);
  console.log("Brand: Gecko Green");
  console.log("Background: WHITE");
  console.log("Format: Portrait (9:16)");
  console.log("=".repeat(50));
  
  let successful = 0;
  let failed = 0;
  
  for (const slide of slides) {
    const result = await generateSlideImage(slide);
    if (result) successful++;
    else failed++;
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`✓ Successful: ${successful}/${slides.length}`);
  console.log(`✗ Failed: ${failed}/${slides.length}`);
  console.log(`\nSlides saved to: ${OUTPUT_DIR}/`);
}

main().catch(console.error);
