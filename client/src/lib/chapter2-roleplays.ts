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

export const CHAPTER_2_ROLEPLAYS: PredefinedRoleplay[] = [
  {
    id: "ch2-rp07",
    afterSlide: 17,
    orderIndex: 7,
    objection: "My lawn looks fine.",
    context: "Lawn Walk → Identifying Issues",
    passCriteria: "Validate + isolate specific problem + visually point",
    failConditions: "Agrees and moves on",
    winningResponse: "Overall it does — this spot is what I'm flagging, though. See how it's spreading here?"
  },
  {
    id: "ch2-rp08",
    afterSlide: 18,
    orderIndex: 8,
    objection: "Weeds don't bother me.",
    context: "Lawn Walk → Educating on Spread",
    passCriteria: "Reframe consequence + keep discovery",
    failConditions: "Accepts apathy",
    winningResponse: "Totally — most don't until it spreads into the healthy grass. That's what I want to prevent here."
  },
  {
    id: "ch2-rp09",
    afterSlide: 19,
    orderIndex: 9,
    objection: "I don't see the issue.",
    context: "Lawn Walk → Showing, Not Telling",
    passCriteria: "Demonstrate visually, not verbally",
    failConditions: "Explains abstractly",
    winningResponse: "Let me point it out — right along this edge, that discoloration is the early sign."
  },
  {
    id: "ch2-rp10",
    afterSlide: 27,
    orderIndex: 10,
    objection: "How much does it cost?",
    context: "Pricing → Before Quoting",
    passCriteria: "Defer price + anchor value first",
    failConditions: "Answers price immediately",
    winningResponse: "I'll get there — first let me show you what it would cover, because price only makes sense after that."
  },
  {
    id: "ch2-rp11",
    afterSlide: 29,
    orderIndex: 11,
    objection: "That's expensive.",
    context: "Pricing → Objection Handling",
    passCriteria: "Normalize + re-anchor to outcome",
    failConditions: "Discounts immediately",
    winningResponse: "I hear that — most people said that before seeing the results. What mattered was fixing this permanently."
  },
  {
    id: "ch2-rp12",
    afterSlide: 30,
    orderIndex: 12,
    objection: "Another company is cheaper.",
    context: "Pricing → Competitor Comparison",
    passCriteria: "Reframe to outcome, not price",
    failConditions: "Attacks competitor",
    winningResponse: "Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved."
  },
  {
    id: "ch2-rp13",
    afterSlide: 34,
    orderIndex: 13,
    objection: "Why do I have to pay now?",
    context: "Close → Payment Explanation",
    passCriteria: "Normalize process + remove risk + maintain close",
    failConditions: "Defensive justification",
    winningResponse: "Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed."
  },
  {
    id: "ch2-rp14",
    afterSlide: 35,
    orderIndex: 14,
    objection: "I need to think about it.",
    context: "Close → Handling Stalls",
    passCriteria: "Isolate the concern + advance the decision",
    failConditions: "Accepts stall",
    winningResponse: "Totally — what part are you thinking through? Price, timing, or the treatment itself?"
  },
  {
    id: "ch2-rp15",
    afterSlide: 36,
    orderIndex: 15,
    objection: "I'll call you / send me something.",
    context: "Close → Securing Next Step",
    passCriteria: "Clarify decision criteria + regain control of next step",
    failConditions: "Leaves a card and exits",
    winningResponse: "Happy to — before I go, what would you be deciding after you look it over?"
  },
  {
    id: "ch2-rp16",
    afterSlide: 37,
    orderIndex: 16,
    objection: "Full Conversation Assessment",
    context: "All Phases → Final Certification",
    passCriteria: "Maintain control across ≥3 phases + handle Phase 5 close objection",
    failConditions: "Loses control or fails to close",
    winningResponse: "Acknowledges → directs next step → stays calm → closes with confidence"
  }
];

export function getRoleplaysForSlide(slideNumber: number): PredefinedRoleplay[] {
  return CHAPTER_2_ROLEPLAYS.filter(rp => rp.afterSlide === slideNumber);
}

export function isRoleplaySlide(slideNumber: number): boolean {
  return CHAPTER_2_ROLEPLAYS.some(rp => rp.afterSlide === slideNumber);
}

export function getAllChapter2Roleplays(): PredefinedRoleplay[] {
  return CHAPTER_2_ROLEPLAYS;
}
