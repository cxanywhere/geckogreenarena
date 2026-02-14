export interface PredefinedRoleplay {
  id: string;
  afterSlide: number;
  orderIndex: number;
  objection: string;
  context: string;
  passCriteria: string;
  failConditions: string;
  winningResponse: string;
}

export const CHAPTER_1_ROLEPLAYS: PredefinedRoleplay[] = [
  {
    id: "ch1-rp01",
    afterSlide: 7,
    orderIndex: 1,
    objection: "I only have 5 minutes.",
    context: "Discovery \u2192 Opening the Call",
    passCriteria: "Acknowledge time pressure + set a clear agenda + ask a qualifying question",
    failConditions: "Pitches immediately or disengages",
    winningResponse: "Totally understand \u2014 I'll be respectful of your time. Give me 5 minutes, and if this doesn't apply I'll wrap up. Quick question: are you the one who owns the e-commerce personalization strategy?"
  },
  {
    id: "ch1-rp02",
    afterSlide: 8,
    orderIndex: 2,
    objection: "Not interested.",
    context: "Discovery \u2192 Handling Brush-Offs",
    passCriteria: "Acknowledge + reframe to specific business issue + redirect",
    failConditions: "Argues or accepts rejection",
    winningResponse: "That's fair \u2014 most VPs weren't interested either until I shared how a similar retailer recovered $2M in abandoned cart revenue. Are you seeing conversion drop-off on mobile, or is that already handled?"
  },
  {
    id: "ch1-rp03",
    afterSlide: 9,
    orderIndex: 3,
    objection: "We're not ready for this yet.",
    context: "Objection Handling \u2192 Timing Objection",
    passCriteria: "Reframe timing as advantage + emphasize cost of delay + ask for commitment",
    failConditions: "Accepts objection or uses pressure tactics",
    winningResponse: "I appreciate that. However, most of our successful customers started the evaluation process 6 months before they planned to launch. Every quarter without personalization is revenue left on the table. Would it make sense to start scoping now so you're ready when the time is right?"
  },
  {
    id: "ch1-rp04",
    afterSlide: 14,
    orderIndex: 4,
    objection: "We built our own solution in-house.",
    context: "Demo \u2192 DIY Pushback",
    passCriteria: "Validate their effort + differentiate with scale/maintenance cost + regain lead",
    failConditions: "Dismisses their in-house work",
    winningResponse: "That makes sense \u2014 most companies in your space start there. What we typically see is that maintaining and evolving a homegrown solution takes 3-4 engineers full-time. How does that compare to your experience?"
  },
  {
    id: "ch1-rp05",
    afterSlide: 15,
    orderIndex: 5,
    objection: "We already use Dynamic Yield.",
    context: "Demo \u2192 Existing Vendor",
    passCriteria: "Acknowledge + remove replacement fear + isolate the gap in results",
    failConditions: "Attacks competitor",
    winningResponse: "Got it \u2014 so you already see the value of personalization. I'm curious \u2014 are you getting the lift you expected when you first signed on? Because most teams we talk to have hit a plateau with their current platform."
  },
  {
    id: "ch1-rp06",
    afterSlide: 16,
    orderIndex: 6,
    objection: "I don't understand how this is different from what we have.",
    context: "Demo \u2192 Differentiation",
    passCriteria: "State differentiation clearly with specific capability + direct to proof point",
    failConditions: "Rambles or gives generic feature comparison",
    winningResponse: "Great question. The key difference is our MONET engine \u2014 it uses real-time behavioral signals to personalize in the moment, not just based on historical segments. Let me show you a live example of how that works."
  }
];

export function getRoleplaysForSlide(slideNumber: number): PredefinedRoleplay[] {
  return CHAPTER_1_ROLEPLAYS.filter(rp => rp.afterSlide === slideNumber);
}

export function isRoleplaySlide(slideNumber: number): boolean {
  return CHAPTER_1_ROLEPLAYS.some(rp => rp.afterSlide === slideNumber);
}

export function getAllChapter1Roleplays(): PredefinedRoleplay[] {
  return CHAPTER_1_ROLEPLAYS;
}
