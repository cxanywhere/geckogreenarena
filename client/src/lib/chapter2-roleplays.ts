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
    objection: "Our conversion rates are fine.",
    context: "Demo \u2192 Identifying Issues",
    passCriteria: "Validate + isolate specific gap + show data",
    failConditions: "Agrees and moves on",
    winningResponse: "They may be \u2014 but let me show you something. Your category pages are converting at 2.1%, while top performers in your vertical average 3.8%. That gap is where the opportunity is."
  },
  {
    id: "ch2-rp08",
    afterSlide: 18,
    orderIndex: 8,
    objection: "Personalization isn't a priority right now.",
    context: "Demo \u2192 Reframing Priority",
    passCriteria: "Reframe consequence + keep discovery",
    failConditions: "Accepts apathy",
    winningResponse: "I hear you \u2014 but every quarter without personalization is revenue your competitors are capturing. That's what I want to help prevent."
  },
  {
    id: "ch2-rp09",
    afterSlide: 19,
    orderIndex: 9,
    objection: "Show me the actual ROI data.",
    context: "Demo \u2192 Evidence-Based Selling",
    passCriteria: "Provide specific, relevant data points",
    failConditions: "Makes vague claims without proof",
    winningResponse: "Absolutely \u2014 let me pull up the case study from a retailer in your space. They saw a 22% lift in conversion within 90 days and a 3.2x ROI in the first year."
  },
  {
    id: "ch2-rp10",
    afterSlide: 27,
    orderIndex: 10,
    objection: "What's the annual license cost?",
    context: "Pricing \u2192 Before Quoting",
    passCriteria: "Defer price + anchor value first",
    failConditions: "Answers price immediately without context",
    winningResponse: "I'll get to that \u2014 first let me show you what the platform delivers for your specific traffic volume, because the price only makes sense in the context of the ROI."
  },
  {
    id: "ch2-rp11",
    afterSlide: 29,
    orderIndex: 11,
    objection: "That's way over our budget.",
    context: "Pricing \u2192 Objection Handling",
    passCriteria: "Normalize + re-anchor to ROI and business impact",
    failConditions: "Discounts immediately",
    winningResponse: "I understand \u2014 that's a common initial reaction. But when you consider the $2.4M in additional annual revenue we project based on your traffic, the platform pays for itself in the first quarter."
  },
  {
    id: "ch2-rp12",
    afterSlide: 30,
    orderIndex: 12,
    objection: "Your competitor is 40% cheaper.",
    context: "Pricing \u2192 Competitor Comparison",
    passCriteria: "Reframe to results and total cost of ownership, not price",
    failConditions: "Attacks competitor",
    winningResponse: "There are cheaper options \u2014 the question is whether they deliver the results you need. Our customers who switched from that platform saw 2x the conversion lift. The real cost is in results you're not getting."
  },
  {
    id: "ch2-rp13",
    afterSlide: 34,
    orderIndex: 13,
    objection: "We need to run this by legal and procurement.",
    context: "Closing \u2192 Procurement Navigation",
    passCriteria: "Normalize process + offer proactive support + maintain momentum",
    failConditions: "Lets deal stall in procurement",
    winningResponse: "Absolutely \u2014 I've been through this process with dozens of similar companies. Let me send you our standard security questionnaire responses and SOC 2 report upfront. That usually speeds things up by 2-3 weeks."
  },
  {
    id: "ch2-rp14",
    afterSlide: 35,
    orderIndex: 14,
    objection: "I need to think about it and get back to you.",
    context: "Closing \u2192 Handling Stalls",
    passCriteria: "Isolate the real concern + advance the decision with a specific next step",
    failConditions: "Accepts stall without probing",
    winningResponse: "Of course \u2014 what specifically are you weighing? Is it the investment, the implementation timeline, or getting alignment from your team? I want to make sure I give you what you need to make the decision."
  },
  {
    id: "ch2-rp15",
    afterSlide: 36,
    orderIndex: 15,
    objection: "Send me a proposal and I'll review it.",
    context: "Closing \u2192 Securing Next Step",
    passCriteria: "Clarify decision criteria + regain control of next step",
    failConditions: "Sends proposal without securing follow-up",
    winningResponse: "Happy to \u2014 before I put that together, what would make this a 'yes' when you review it? I want to make sure the proposal addresses exactly what matters to your team."
  },
  {
    id: "ch2-rp16",
    afterSlide: 37,
    orderIndex: 16,
    objection: "Final Certification Assessment",
    context: "All Phases \u2192 Final Certification",
    passCriteria: "Navigate discovery, demo, and closing phases with confidence + handle enterprise objections",
    failConditions: "Loses control or fails to advance the deal",
    winningResponse: "Acknowledges \u2192 qualifies with MEDDPICC \u2192 demonstrates value \u2192 handles objections \u2192 proposes clear next steps"
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
