export interface PredefinedRoleplay {
  id: string;
  afterSlide: number;
  roleplayId: string;
  objection: string;
  context: string;
  passCriteria: string;
  failConditions: string;
  winningResponse: string;
}

export const CHAPTER_1_ROLEPLAYS: PredefinedRoleplay[] = [
  {
    id: "ch1-rp1",
    afterSlide: 7,
    roleplayId: "rp-1",
    objection: "I'm actually really busy right now.",
    context: "Opening → First 10 Seconds",
    passCriteria: "Acknowledge time pressure + set ≤60s container + ask a qualifying control question",
    failConditions: "Pitches immediately or disengages",
    winningResponse: "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?"
  },
  {
    id: "ch1-rp2",
    afterSlide: 8,
    roleplayId: "rp-2",
    objection: "Not interested.",
    context: "Opening → Handling Brush-Offs",
    passCriteria: "Acknowledge + reframe to specific issue + redirect",
    failConditions: "Argues or accepts rejection",
    winningResponse: "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?"
  },
  {
    id: "ch1-rp3",
    afterSlide: 9,
    roleplayId: "rp-3",
    objection: "No soliciting.",
    context: "Opening → Compliance & Authority",
    passCriteria: "Acknowledge rule + clarify intent + request micro-permission",
    failConditions: "Debates policy",
    winningResponse: "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?"
  },
  {
    id: "ch1-rp4",
    afterSlide: 14,
    roleplayId: "rp-4",
    objection: "I do my own lawn.",
    context: "Turn & Burn → DIY Pushback",
    passCriteria: "Validate identity + differentiate + regain lead",
    failConditions: "Tries to convert DIY",
    winningResponse: "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?"
  },
  {
    id: "ch1-rp5",
    afterSlide: 15,
    roleplayId: "rp-5",
    objection: "We already have a lawn company.",
    context: "Turn & Burn → Existing Provider",
    passCriteria: "Acknowledge + remove replacement fear + isolate gap",
    failConditions: "Attacks competitor",
    winningResponse: "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?"
  },
  {
    id: "ch1-rp6",
    afterSlide: 16,
    roleplayId: "rp-6",
    objection: "Why are you here?",
    context: "Turn & Burn → Purpose Statement",
    passCriteria: "State purpose clearly + direct next action",
    failConditions: "Rambles / over-explains",
    winningResponse: "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting."
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
