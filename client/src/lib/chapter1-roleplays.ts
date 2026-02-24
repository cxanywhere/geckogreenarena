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
    context: "Discovery → Opening the Call",
    passCriteria: "Acknowledge time pressure + set a clear agenda + ask a qualifying question",
    failConditions: "Pitches immediately or disengages",
    winningResponse: "Totally understand — I'll be respectful of your time. Give me 5 minutes, and if this doesn't apply I'll wrap up. Quick question: are you the one who owns the sales pipeline and revenue targets for your team?"
  },
  {
    id: "ch1-rp02",
    afterSlide: 8,
    orderIndex: 2,
    objection: "Not interested.",
    context: "Discovery → Handling Brush-Offs",
    passCriteria: "Acknowledge + reframe to specific business issue + redirect",
    failConditions: "Argues or accepts rejection",
    winningResponse: "That's fair — most VPs weren't interested either until I shared how a similar B2B company added $4M in net-new pipeline within 90 days using an outsourced SDR team. Are you seeing gaps in pipeline coverage, or is that already handled?"
  },
  {
    id: "ch1-rp03",
    afterSlide: 9,
    orderIndex: 3,
    objection: "We're not ready for this yet.",
    context: "Objection Handling → Timing Objection",
    passCriteria: "Reframe timing as advantage + emphasize cost of delay + ask for commitment",
    failConditions: "Accepts objection or uses pressure tactics",
    winningResponse: "I appreciate that. However, most of our successful customers started the evaluation 3-6 months before they needed to scale. Every quarter without dedicated pipeline generation is revenue left on the table. Would it make sense to start scoping now so your team is ready when the hiring plan kicks in?"
  },
  {
    id: "ch1-rp04",
    afterSlide: 14,
    orderIndex: 4,
    objection: "We prefer to hire our own sales reps.",
    context: "Demo → Build vs. Outsource Pushback",
    passCriteria: "Validate their preference + differentiate with speed, cost, and ramp time + regain lead",
    failConditions: "Dismisses their internal hiring efforts",
    winningResponse: "That makes sense — many companies start there. What we typically see is that hiring, training, and ramping an internal SDR takes 6-9 months and costs 2-3x more than outsourcing. MarketStar can have a fully ramped team producing pipeline in 4-8 weeks. How does that compare to your current hiring timeline?"
  },
  {
    id: "ch1-rp05",
    afterSlide: 15,
    orderIndex: 5,
    objection: "We already work with another outsourced sales provider.",
    context: "Demo → Existing Vendor",
    passCriteria: "Acknowledge + remove replacement fear + isolate the gap in results",
    failConditions: "Attacks competitor",
    winningResponse: "Got it — so you already see the value of outsourced sales. I'm curious — are you getting the pipeline quality and conversion rates you expected when you first signed on? Because most teams we talk to have hit a plateau with their current provider and are looking for a partner with deeper enablement and AI-powered coaching like Nytro.ai."
  },
  {
    id: "ch1-rp06",
    afterSlide: 16,
    orderIndex: 6,
    objection: "I don't understand how MarketStar is different from other outsourced sales firms.",
    context: "Demo → Differentiation",
    passCriteria: "State differentiation clearly with specific capability + direct to proof point",
    failConditions: "Rambles or gives generic feature comparison",
    winningResponse: "Great question. The key difference is our Sales as a Service® model combined with Nytro.ai — we don't just provide headcount, we deliver an entire revenue engine with AI-powered coaching, proven playbooks, and 35+ years of B2B sales expertise. Let me show you a case study of how that works in practice."
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
