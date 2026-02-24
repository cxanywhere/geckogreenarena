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
    objection: "Our internal sales team is hitting their numbers.",
    context: "Demo → Identifying Issues",
    passCriteria: "Validate + isolate specific gap + show data",
    failConditions: "Agrees and moves on",
    winningResponse: "That's great — but let me ask this: are you hitting your pipeline coverage targets? Most B2B companies we work with have a 3:1 coverage ratio, but best-in-class is 5:1. That gap is where MarketStar's dedicated SDR teams create the most value."
  },
  {
    id: "ch2-rp08",
    afterSlide: 18,
    orderIndex: 8,
    objection: "Outsourcing sales isn't a priority right now.",
    context: "Demo → Reframing Priority",
    passCriteria: "Reframe consequence + keep discovery",
    failConditions: "Accepts apathy",
    winningResponse: "I hear you — but every quarter without adequate pipeline coverage is revenue your competitors are capturing. Companies that scale with outsourced teams typically see 40% faster time-to-revenue. That's what I want to help you evaluate."
  },
  {
    id: "ch2-rp09",
    afterSlide: 19,
    orderIndex: 9,
    objection: "Show me the actual ROI data.",
    context: "Demo → Evidence-Based Selling",
    passCriteria: "Provide specific, relevant data points",
    failConditions: "Makes vague claims without proof",
    winningResponse: "Absolutely — let me pull up the case study from a B2B SaaS company in your space. They added $6M in net-new pipeline within the first 6 months with a dedicated MarketStar SDR team, at 60% less cost than building internally."
  },
  {
    id: "ch2-rp10",
    afterSlide: 27,
    orderIndex: 10,
    objection: "What does a MarketStar engagement cost?",
    context: "Pricing → Before Quoting",
    passCriteria: "Defer price + anchor value first",
    failConditions: "Answers price immediately without context",
    winningResponse: "I'll get to that — first let me understand your pipeline goals and team size requirements, because the investment only makes sense in the context of the revenue it generates. Our Sales as a Service® model is designed to deliver predictable ROI."
  },
  {
    id: "ch2-rp11",
    afterSlide: 29,
    orderIndex: 11,
    objection: "That's way over our budget.",
    context: "Pricing → Objection Handling",
    passCriteria: "Normalize + re-anchor to ROI and business impact",
    failConditions: "Discounts immediately",
    winningResponse: "I understand — that's a common initial reaction. But when you consider the cost of a bad hire, the 6-9 month ramp time, and the pipeline gap during that period, outsourcing typically saves 40-60% compared to building internally. The real question is: can you afford not to have pipeline coverage?"
  },
  {
    id: "ch2-rp12",
    afterSlide: 30,
    orderIndex: 12,
    objection: "Your competitor is 30% cheaper.",
    context: "Pricing → Competitor Comparison",
    passCriteria: "Reframe to results and total cost of ownership, not price",
    failConditions: "Attacks competitor",
    winningResponse: "There are cheaper options — the question is whether they deliver the pipeline quality and conversion rates you need. Our customers who switched from other providers saw 2x the qualified pipeline. With Nytro.ai coaching and 35+ years of playbook expertise, the real cost is in opportunities you're missing."
  },
  {
    id: "ch2-rp13",
    afterSlide: 34,
    orderIndex: 13,
    objection: "We need to run this by legal and procurement.",
    context: "Closing → Procurement Navigation",
    passCriteria: "Normalize process + offer proactive support + maintain momentum",
    failConditions: "Lets deal stall in procurement",
    winningResponse: "Absolutely — I've been through this process with dozens of similar companies. Let me send you our standard MSA, security documentation, and references upfront. That usually speeds things up by 2-3 weeks. Can we set up a call with your procurement team next week?"
  },
  {
    id: "ch2-rp14",
    afterSlide: 35,
    orderIndex: 14,
    objection: "I need to think about it and get back to you.",
    context: "Closing → Handling Stalls",
    passCriteria: "Isolate the real concern + advance the decision with a specific next step",
    failConditions: "Accepts stall without probing",
    winningResponse: "Of course — what specifically are you weighing? Is it the investment, the engagement model, or getting alignment from your CRO and CFO? I want to make sure I give you what you need to make the decision."
  },
  {
    id: "ch2-rp15",
    afterSlide: 36,
    orderIndex: 15,
    objection: "Send me a proposal and I'll review it.",
    context: "Closing → Securing Next Step",
    passCriteria: "Clarify decision criteria + regain control of next step",
    failConditions: "Sends proposal without securing follow-up",
    winningResponse: "Happy to — before I put that together, what would make this a 'yes' when you review it? I want to make sure the proposal addresses the exact pipeline targets and team structure that matters to your leadership."
  },
  {
    id: "ch2-rp16",
    afterSlide: 37,
    orderIndex: 16,
    objection: "Final Certification Assessment",
    context: "All Phases → Final Certification",
    passCriteria: "Navigate discovery, demo, and closing phases with confidence + handle B2B outsourced sales objections",
    failConditions: "Loses control or fails to advance the deal",
    winningResponse: "Acknowledges → qualifies with MEDDPICC → demonstrates MarketStar value → handles objections → proposes clear next steps"
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
