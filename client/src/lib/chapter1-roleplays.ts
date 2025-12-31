export interface PredefinedRoleplay {
  id: string;
  afterSlide: number;
  phase: string;
  objection: string;
  context: string;
  passCriteria: string;
  failConditions: string;
  winningResponse: string;
  losingResponse: string;
}

export const CHAPTER_1_ROLEPLAYS: PredefinedRoleplay[] = [
  {
    id: "ch1-rp1",
    afterSlide: 6,
    phase: "Phase 1",
    objection: "I'm actually really busy right now.",
    context: "Opening → First 10 Seconds",
    passCriteria: "Acknowledge time pressure + set ≤60s container + ask a qualifying control question",
    failConditions: "Pitches immediately or disengages",
    winningResponse: "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?",
    losingResponse: "This won't take long… we do fertilization and weed control."
  },
  {
    id: "ch1-rp3",
    afterSlide: 6,
    phase: "Phase 1",
    objection: "No soliciting.",
    context: "Opening → Compliance & Authority",
    passCriteria: "Acknowledge rule + clarify intent + request micro-permission",
    failConditions: "Debates policy",
    winningResponse: "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?",
    losingResponse: "I'm not selling anything… (keeps talking)"
  },
  {
    id: "ch1-rp2",
    afterSlide: 10,
    phase: "Phase 1",
    objection: "Not interested.",
    context: "Opening → Handling Brush-Offs",
    passCriteria: "Acknowledge + reframe to specific issue + redirect",
    failConditions: "Argues or accepts rejection",
    winningResponse: "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?",
    losingResponse: "Okay, no worries."
  },
  {
    id: "ch1-rp6",
    afterSlide: 16,
    phase: "Phase 2",
    objection: "Why are you here?",
    context: "Turn & Burn → Purpose Statement",
    passCriteria: "State purpose clearly + direct next action",
    failConditions: "Rambles / over-explains",
    winningResponse: "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.",
    losingResponse: "I'm with Gecko, and what we do is…"
  },
  {
    id: "ch1-rp4",
    afterSlide: 18,
    phase: "Phase 2",
    objection: "I do my own lawn.",
    context: "Turn & Burn → DIY Pushback",
    passCriteria: "Validate identity + differentiate + regain lead",
    failConditions: "Tries to convert DIY",
    winningResponse: "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?",
    losingResponse: "We help a lot of DIY customers…"
  },
  {
    id: "ch1-rp5",
    afterSlide: 24,
    phase: "Phase 2",
    objection: "We already have a lawn company.",
    context: "Turn & Burn → Existing Provider",
    passCriteria: "Acknowledge + remove replacement fear + isolate gap",
    failConditions: "Attacks competitor",
    winningResponse: "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?",
    losingResponse: "We're better than most companies…"
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
