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
    afterSlide: 4,
    orderIndex: 7,
    objection: "What are your top marketing priorities this quarter, and what's the team under pressure to deliver?",
    context: "Discovery → Business-Priority Discovery",
    passCriteria: "Ask open-ended questions about business goals + listen for pain signals + avoid pitching too early",
    failConditions: "Jumps to product recommendations before understanding the buyer's situation",
    winningResponse: "Before I recommend anything, I'd love to understand what's driving your priorities right now. Are you focused more on building awareness with new audiences, generating pipeline, or improving conversion on leads you're already getting? And what pressure is the team under from leadership this quarter?"
  },
  {
    id: "ch2-rp08",
    afterSlide: 5,
    orderIndex: 8,
    objection: "We're trying to reach the buying committee at enterprise accounts, but it's really hard to get in front of the right people.",
    context: "Discovery → Audience / Buying Committee",
    passCriteria: "Probe for specific roles and accounts + connect to LinkedIn's targeting capabilities",
    failConditions: "Gives a generic response without exploring their specific audience challenge",
    winningResponse: "That's a really common challenge in enterprise selling. Can you tell me more about which roles matter most in that buying committee? For example, are you trying to reach the technical evaluators, the budget holders, or both? LinkedIn's targeting lets you reach by specific title, function, seniority, and even named companies — which is particularly useful when you need to influence multiple stakeholders within the same account."
  },
  {
    id: "ch2-rp09",
    afterSlide: 6,
    orderIndex: 9,
    objection: "We're getting leads but they're not converting. Sales says marketing leads are garbage.",
    context: "Discovery → Funnel Diagnosis",
    passCriteria: "Diagnose the funnel gap specifically + ask about lead quality criteria + connect to LinkedIn's precision targeting",
    failConditions: "Blames the sales team or makes vague promises about lead quality",
    winningResponse: "That tension between marketing and sales is really common. Let me ask — when sales says leads aren't converting, is it that the leads are the wrong titles or companies, or that they're the right people but not ready to buy? Because those are two very different problems. If it's targeting, LinkedIn's professional graph can help you reach exactly the right personas. If it's timing, we can talk about nurture sequences and retargeting to warm them up before the handoff."
  },
  {
    id: "ch2-rp10",
    afterSlide: 8,
    orderIndex: 10,
    objection: "We used LinkedIn before and honestly, we were pretty disappointed with the results.",
    context: "Discovery → Prior-Channel Disappointment",
    passCriteria: "Show empathy + diagnose what was tested without being defensive + reopen the conversation",
    failConditions: "Gets defensive about LinkedIn or dismisses their experience",
    winningResponse: "I appreciate you sharing that — it's important context. Can you walk me through what you tested? I'm curious about the audience setup, the creative and offer, the campaign objective, and how success was measured. In my experience, when LinkedIn doesn't perform, it's usually a question of campaign structure or measurement alignment rather than channel fit. If I can understand what happened, I can give you an honest assessment of whether a different approach would make sense."
  },
  {
    id: "ch2-rp11",
    afterSlide: 12,
    orderIndex: 11,
    objection: "I'm the CMO. We have limited budget and I need to know exactly why LinkedIn deserves a share of it over channels we already trust.",
    context: "Positioning → Persona-Based Positioning (CMO)",
    passCriteria: "Position LinkedIn strategically for a CMO audience + emphasize outcomes over features + show respect for budget pressure",
    failConditions: "Pitches product features instead of strategic value or ignores budget concern",
    winningResponse: "I completely understand the pressure to make every dollar count. For a CMO, the case for LinkedIn usually comes down to three things: first, the ability to reach the exact professional audience your sales team needs — by title, seniority, and company — which no other platform can match. Second, full-funnel coverage from awareness through lead capture, so you're not just driving impressions but actually filling pipeline. And third, the measurement to prove it to your board. I'm not asking you to move budget blindly — I'm suggesting we identify one high-priority audience and test a focused campaign so you can see the quality difference for yourself."
  },
  {
    id: "ch2-rp12",
    afterSlide: 16,
    orderIndex: 12,
    objection: "Run a full mini-discovery with me. I'm the VP of Demand Gen at a mid-market SaaS company. We're spending on Google and Meta but pipeline is flat.",
    context: "Full Discovery → Mini-Discovery Simulation",
    passCriteria: "Run a structured 7-part discovery flow + ask about goals, audience, funnel gap, current channels, offer, measurement, and stakeholders",
    failConditions: "Skips discovery steps, pitches too early, or sounds scripted and unnatural",
    winningResponse: "Let's start with the big picture — what are your top priorities this quarter? Is the pressure more on lead volume, lead quality, or proving pipeline contribution? And when you say pipeline is flat despite Google and Meta spend, where specifically are things breaking down — is it that you're not reaching the right people, or that the people you're reaching aren't engaging? Who specifically are you trying to reach — what roles and company types matter most? And how does your team define a qualified lead today?"
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
