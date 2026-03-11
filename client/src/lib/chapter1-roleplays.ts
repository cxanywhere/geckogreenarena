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
    afterSlide: 16,
    orderIndex: 1,
    objection: "What exactly is LinkedIn Marketing Solutions, and why would I use it instead of another ad channel?",
    context: "Product Overview → Elevator Explanation",
    passCriteria: "Give a clear, confident 30-second explanation of LMS without jargon + connect to business value",
    failConditions: "Uses internal product jargon, rambles, or fails to differentiate from other channels",
    winningResponse: "LinkedIn Marketing Solutions helps brands reach professional audiences in a business context — think job title, seniority, industry, and company — with campaigns designed around goals like awareness, lead generation, and conversion. What makes it different is that the targeting is based on real professional identity, not just browsing behavior. So when you need to reach specific decision-makers in B2B, LinkedIn is often the most precise way to do it."
  },
  {
    id: "ch1-rp02",
    afterSlide: 10,
    orderIndex: 2,
    objection: "Why would your lead forms perform better than sending traffic to my site?",
    context: "Product Deep-Dive → Lead Gen Form Relevance",
    passCriteria: "Explain friction reduction and fit without overpromising + acknowledge landing page context",
    failConditions: "Overpromises results or dismisses their website strategy",
    winningResponse: "Great question. Lead Gen Forms work well specifically because they pre-fill data from the member's LinkedIn profile — name, title, company, email — which significantly reduces drop-off. If your challenge is that people are clicking through but not completing your form, this can make a real difference. It's not about replacing your site entirely — it's about reducing friction at the moment of highest intent."
  },
  {
    id: "ch1-rp03",
    afterSlide: 7,
    orderIndex: 3,
    objection: "I don't know whether I want awareness or leads. How do I decide?",
    context: "Objective-First Selling → Objective Clarification",
    passCriteria: "Guide the buyer with smart follow-up questions instead of prescribing + demonstrate discovery before recommendation",
    failConditions: "Immediately recommends an objective without understanding the buyer's situation",
    winningResponse: "That's actually a really common question, and the answer depends on where your biggest gap is right now. Let me ask — when you think about your pipeline over the next quarter, is your challenge that not enough of the right people know about you, or that you have awareness but aren't converting that into leads? That distinction usually points you to the right starting objective."
  },
  {
    id: "ch1-rp04",
    afterSlide: 11,
    orderIndex: 4,
    objection: "Which ad format should I start with?",
    context: "Product Deep-Dive → Format Recommendation",
    passCriteria: "Match format to offer and funnel stage + ask about their content before recommending",
    failConditions: "Recommends a format without understanding the buyer's content or funnel stage",
    winningResponse: "It depends on what you're offering and where your audience is in the funnel. For example, if you have a strong whitepaper or report, Document Ads are great for mid-funnel education. If you're promoting a webinar, a single image ad with a Lead Gen Form can drive registrations efficiently. What content or offers are you planning to lead with?"
  },
  {
    id: "ch1-rp05",
    afterSlide: 13,
    orderIndex: 5,
    objection: "We only care about results. What should we realistically measure?",
    context: "Measurement Basics → Metrics Conversation",
    passCriteria: "Shift from vanity metrics to business-relevant metrics + ask how they define success internally",
    failConditions: "Focuses on clicks and impressions or makes unrealistic measurement promises",
    winningResponse: "That's the right mindset. The key is defining what 'results' means for your team. Is it lead volume, lead quality, cost per qualified lead, or actual pipeline influence? I'd recommend we focus on metrics that tie back to what your sales team actually cares about — like how many of those leads get accepted and turn into real conversations. What does your team track today?"
  },
  {
    id: "ch1-rp06",
    afterSlide: 16,
    orderIndex: 6,
    objection: "Give me the short version — why LinkedIn, why now?",
    context: "End of Chapter → Executive Summary",
    passCriteria: "Deliver a concise executive-level summary that connects LMS to business outcomes + show confidence without overselling",
    failConditions: "Rambles, lists features without context, or sounds overly scripted",
    winningResponse: "LinkedIn is the only platform where you can reach the exact professional audience that matters to your business — by title, seniority, company, and industry — in a context where they're already thinking about business. Right now, most B2B teams are under pressure to prove that marketing drives real pipeline, not just clicks. LinkedIn gives you the targeting precision and full-funnel tools to do that, and the measurement to prove it to your leadership."
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
