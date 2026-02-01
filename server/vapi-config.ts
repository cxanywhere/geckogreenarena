export interface VapiRoleplayConfig {
  id: string;
  name: string;
  role: string;
  phase: string;
  context: string;
  objection: string;
  passCriteria: string;
  failConditions: string;
  winningResponse: string;
  losingResponse: string;
  winningExamples: string[];
  losingExamples: string[];
  goalType: "advance" | "exit_gracefully";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resistanceLevel: number;
  buySignal: number;
  traits: string[];
  durationSeconds: number;
  isCertification?: boolean;
  isCoachingMode?: boolean;
  scriptHint?: string;
  lawnIssues?: string[];
}

export const VAPI_ROLEPLAY_CONFIGS: VapiRoleplayConfig[] = [
  {
    id: "rp-01",
    name: "I'm actually really busy right now.",
    role: "The Rushed Executive",
    phase: "Chapter 1",
    context: "Opening → First 10 Seconds",
    objection: "I'm actually really busy right now.",
    passCriteria: "Acknowledge time pressure, set a time container under 60 seconds, and ask a qualifying control question.",
    failConditions: "Pitches immediately or disengages without acknowledging their time",
    winningResponse: "Great job! You acknowledged their time, set expectations, and asked a qualifying question.",
    losingResponse: "You need to respect their time more and ask qualifying questions earlier.",
    winningExamples: [
      "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?",
      "OK, I'll be quick. Quick question: Who are you using for lawn care right now? Or are you the one who usually takes care of it?",
      "Gotcha, just real quick, do you guys currently have somebody or do you take care of this yourself?",
      "I completely understand. I won't take much of your time at all. Quick question, do you take care of the lawn yourself or do you have a service?"
    ],
    losingExamples: [
      "This won't take long… we do fertilization and weed control.",
      "Ok, when is a good time for me to come back?",
      "Ok well you have my flyer if you need me.",
      "When will you not be busy?"
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 60,
    traits: ["Time Management", "Control Question", "Respect"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?' Key points: 1) Acknowledge their time pressure first, 2) Set a specific time limit (60 seconds), 3) End with a control question to engage them.",
    lawnIssues: ["weeds along the curb", "dry patches near the driveway"]
  },
  {
    id: "rp-02",
    name: "Not interested.",
    role: "The Skeptic",
    phase: "Chapter 1",
    context: "Opening → Handling Brush-Offs",
    objection: "Not interested.",
    passCriteria: "Acknowledge the brush-off, reframe to a specific lawn issue, and redirect the conversation.",
    failConditions: "Argues or accepts rejection without attempting to redirect",
    winningResponse: "Excellent recovery! You reframed the objection and kept control.",
    losingResponse: "Work on acknowledging objections before trying to redirect.",
    winningExamples: [
      "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?",
      "I totally understand. So do you have another company you're using right now?",
      "No problem. A lot of people are very surprised at how affordable it can be. Have you already put something down this year?",
      "I understand. Well I noticed this as I was walking by."
    ],
    losingExamples: [
      "Okay, no worries.",
      "Gotcha, can I leave you a card in case you change your mind?",
      "Okay well here's my flyer if anything changes.",
      "Ok. Can I leave you a flyer in case you change your mind?"
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Reframing", "Persistence", "Specifics"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?' Key points: 1) Don't accept rejection or argue, 2) Pivot to something specific about THEIR lawn, 3) Ask a discovery question to re-engage.",
    lawnIssues: ["weeds along the curb", "crabgrass starting to spread"]
  },
  {
    id: "rp-03",
    name: "No soliciting.",
    role: "The Gatekeeper",
    phase: "Chapter 1",
    context: "Opening → Compliance & Authority",
    objection: "No soliciting.",
    passCriteria: "Acknowledge the sign/rule, clarify you are a service provider, and request a micro-permission.",
    failConditions: "Debates policy or ignores the boundary",
    winningResponse: "Well done! You respected the boundary while creating an opening.",
    losingResponse: "You need to acknowledge rules and ask for permission more gracefully.",
    winningExamples: [
      "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?",
      "My apologies, I have been out here working with your neighbors and noticed some issues in the lawn, do you have a second so I can show you?",
      "I understand. The last thing I want to do is upset you. I just wanted to introduce myself because we help your neighbor. Do you already have someone that takes care of the weeds and fertilization?",
      "Sorry, I was just working with your neighbor and noticed something I wanted to point out really quick."
    ],
    losingExamples: [
      "I'm not selling anything… (keeps talking)",
      "I didn't see a no soliciting sign.",
      "Argues technicalities over no soliciting rules.",
      "I saw it but your lawn needs my help."
    ],
    goalType: "exit_gracefully",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 50,
    traits: ["Compliance", "Intent Clarification", "Micro-Permission"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?' Key points: 1) Acknowledge their rule respectfully, 2) Clarify your intent (not selling, observing), 3) Request permission to show something specific.",
    lawnIssues: ["weeds along the edge", "some dry spots"]
  },
  {
    id: "rp-04",
    name: "I do my own lawn.",
    role: "The DIY Pro",
    phase: "Chapter 1",
    context: "Turn & Burn → DIY Pushback",
    objection: "I do my own lawn.",
    passCriteria: "Validate their effort, differentiate professional-grade service, and regain the lead.",
    failConditions: "Tries to convert DIY or insults their work",
    winningResponse: "Perfect! You validated their effort while showing professional value.",
    losingResponse: "Remember to compliment their work before showing what professionals add.",
    winningExamples: [
      "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?",
      "Oh awesome, you're doing a good job. A lot of our best customers started out doing it themselves…",
      "Awesome, I'm glad you are doing something for the lawn…",
      "Awesome, I noticed something was put down. Has it been working?"
    ],
    losingExamples: [
      "We help a lot of DIY customers…",
      "Well it doesn't look very good. It looks like you need some help.",
      "Have you started yet?",
      "OK, here is a card. Give me a call if you get interested."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 35,
    buySignal: 65,
    traits: ["Validation", "Differentiation", "Leadership"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?' Key points: 1) Validate their identity as a DIYer, 2) Don't try to convert them, 3) Point to something specific they may have missed.",
    lawnIssues: ["pre-emergent timing issue", "some grub damage near the edges"]
  },
  {
    id: "rp-05",
    name: "We already have a lawn company.",
    role: "The Loyalist",
    phase: "Chapter 1",
    context: "Turn & Burn → Existing Provider",
    objection: "We already have a lawn company.",
    passCriteria: "Acknowledge their current provider, remove replacement fear, and find a gap in service.",
    failConditions: "Attacks competitor or dismisses their choice",
    winningResponse: "Excellent! You planted seeds of doubt without being pushy.",
    losingResponse: "Never bash competitors. Find gaps in their service instead.",
    winningExamples: [
      "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?",
      "Oh nice. How long have you been with them, are you happy with your results?",
      "Perfect! I can tell that you care about your lawn…",
      "Good to hear, real quick I noticed these weeds…"
    ],
    losingExamples: [
      "We're better than most companies…",
      "They're not doing a good job...",
      "Okay how much are they charging you?",
      "I can probably beat their price."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Gap Analysis", "Non-Threatening", "Discovery"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?' Key points: 1) Remove fear of switching, 2) Never attack their current provider, 3) Find a gap in their current service.",
    lawnIssues: ["weeds along the edge that their service missed", "some thin spots in the shade"]
  },
  {
    id: "rp-06",
    name: "Why are you here?",
    role: "The Confused Homeowner",
    phase: "Chapter 1",
    context: "Turn & Burn → Purpose Statement",
    objection: "Why are you here?",
    passCriteria: "State your purpose clearly and direct them to the next action.",
    failConditions: "Rambles or over-explains without being direct",
    winningResponse: "Great clarity! You explained your purpose and gave clear next steps.",
    losingResponse: "Be more direct about why you are there and what you want.",
    winningExamples: [
      "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.",
      "I just wanted to stop by and introduce myself. We do fertilization and weed control for your neighbors. Is that something you typically do yourself or do you hire someone?",
      "Like I said, I'm working with the neighbors, and I wanted to stop by and introduce myself. Do you have anyone doing your lawn care for you?"
    ],
    losingExamples: [
      "I'm with Gecko, and what we do is…",
      "Repeats intro without purpose.",
      "Just out here working."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 70,
    traits: ["Clarity", "Direction", "Purpose"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.' Key points: 1) Be direct and concise, 2) Tie it to something happening in their area, 3) Lead them to a specific next step.",
    lawnIssues: ["weeds starting along the curb", "some discoloration near the street"]
  },
  {
    id: "rp-07",
    name: "My lawn looks fine.",
    role: "The Denialist",
    phase: "Chapter 2",
    context: "Lawn Walk → Identifying Issues",
    objection: "My lawn looks fine.",
    passCriteria: "Validate their perspective, isolate a specific problem, and point it out visually.",
    failConditions: "Argues or insists they're wrong",
    winningResponse: "Well done! You showed them the problem without being condescending.",
    losingResponse: "Always validate first, then show specific visual evidence.",
    winningExamples: [
      "Overall it does — this spot is what I'm flagging, though. See how it's spreading here?",
      "I hear you — it does look pretty good from here. The thing I noticed is right along that edge by the driveway. Mind if I show you what I'm seeing?"
    ],
    losingExamples: [
      "Yeah, it looks okay.",
      "No, there's definitely a problem here."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Validation", "Specificity", "Curiosity Building"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'I hear you — it does look pretty good from here. The thing I noticed is right along that edge by the driveway. Mind if I show you what I'm seeing?' Key points: 1) Agree with their perspective first, 2) Isolate ONE specific area, 3) Ask permission to show them.",
    lawnIssues: ["spreading weeds along the driveway edge", "some discoloration starting near the curb"]
  },
  {
    id: "rp-08",
    name: "Weeds don't bother me.",
    role: "The Apathetic Owner",
    phase: "Chapter 2",
    context: "Lawn Walk → Educating on Spread",
    objection: "Weeds don't bother me.",
    passCriteria: "Reframe the consequences of inaction and continue discovery.",
    failConditions: "Judges their standards or pushes too hard",
    winningResponse: "Great job connecting consequences to what they care about!",
    losingResponse: "Find what they DO care about and connect the problem to that.",
    winningExamples: [
      "Totally — most don't until it spreads into the healthy grass. That's what I want to prevent here.",
      "Totally fair — some folks feel that way. The only reason I mention it is these spread fast to neighbors. Can I show you what I mean real quick?"
    ],
    losingExamples: [
      "Okay, that's fair.",
      "But you should really care about this."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Acceptance", "Social Proof", "Permission"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Totally fair — some folks feel that way. The only reason I mention it is these spread fast to neighbors. Can I show you what I mean real quick?' Key points: 1) Accept their preference without judgment, 2) Pivot to neighbor/community concern, 3) Keep it educational, not pushy.",
    lawnIssues: ["weeds spreading toward the healthy grass", "crabgrass that will seed into neighbors' yards"]
  },
  {
    id: "rp-09",
    name: "I don't see the issue.",
    role: "The Visual Skeptic",
    phase: "Chapter 2",
    context: "Lawn Walk → Showing, Not Telling",
    objection: "I don't see the issue.",
    passCriteria: "Demonstrate the issue visually rather than just describing it.",
    failConditions: "Describes problem without showing",
    winningResponse: "Excellent visual demonstration! Seeing is believing.",
    losingResponse: "Show, don't tell. Walk them to the problem and point.",
    winningExamples: [
      "Let me point it out — right along this edge, that discoloration is the early sign.",
      "Let me show you — it's easier to see up close. Right over here by the curb, see those lighter patches? That's where it's starting."
    ],
    losingExamples: [
      "So basically what happens is…",
      "Trust me, there's a problem."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Demonstration", "Specificity", "Movement"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Let me show you — it's easier to see up close. Right over here by the curb, see those lighter patches? That's where it's starting.' Key points: 1) Move physically toward the issue, 2) Be specific about location, 3) Point directly at what you're describing.",
    lawnIssues: ["lighter patches along the curb", "early signs of grub damage near the edge"]
  },
  {
    id: "rp-10",
    name: "How much does it cost?",
    role: "The Price Shopper",
    phase: "Chapter 2",
    context: "Pricing → Before Quoting",
    objection: "How much does it cost?",
    passCriteria: "Defer the price question and anchor value first.",
    failConditions: "Gives price immediately without building value",
    winningResponse: "Perfect price deferral! Value before price always.",
    losingResponse: "Never give price before establishing value. Defer and anchor.",
    winningExamples: [
      "I'll get there — first let me show you what it would cover, because price only makes sense after that.",
      "Great question — it depends on your lawn size and what we find. Let me take a quick look and I can give you an exact number. Fair?"
    ],
    losingExamples: [
      "It's $X per application.",
      "Around $50-60 a month."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Building", "Deferral", "Assessment"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Great question — it depends on your lawn size and what we find. Let me take a quick look and I can give you an exact number. Fair?' Key points: 1) Acknowledge the question positively, 2) Defer by needing more info, 3) Offer to assess first before quoting.",
    lawnIssues: ["the weed issue we discussed", "the areas that need treatment"]
  },
  {
    id: "rp-11",
    name: "That's expensive.",
    role: "The Budget Watcher",
    phase: "Chapter 2",
    context: "Pricing → Objection Handling",
    objection: "That's too expensive.",
    passCriteria: "Normalize the price and re-anchor to the outcome value.",
    failConditions: "Immediately offers discount or argues value",
    winningResponse: "Great normalization! You reframed price in terms of value.",
    losingResponse: "Never agree it's expensive. Normalize and re-anchor to outcomes.",
    winningExamples: [
      "I hear that — most people said that before seeing the results. What mattered was fixing this permanently.",
      "I get it — let me break it down. That's about $8 a week for a lawn that looks great all season. Most folks spend more than that on coffee. What if I showed you what's included?"
    ],
    losingExamples: [
      "We can lower it…",
      "Yeah, I know it's a lot."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["Cost Breakdown", "Comparison", "Value Demonstration"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'I get it — let me break it down. That's about $8 a week for a lawn that looks great all season. Most folks spend more than that on coffee. What if I showed you what's included?' Key points: 1) Break down the cost to weekly/daily, 2) Compare to everyday purchases, 3) Offer to show value before discussing discount.",
    lawnIssues: ["the weed problem that keeps coming back", "issues that will cost more to fix later"]
  },
  {
    id: "rp-12",
    name: "Another company is cheaper.",
    role: "The Comparison Shopper",
    phase: "Chapter 2",
    context: "Pricing → Competitor Comparison",
    objection: "I got a quote from another company and they're cheaper.",
    passCriteria: "Reframe the conversation from price to outcome value.",
    failConditions: "Attacks competitor or matches price immediately",
    winningResponse: "Excellent differentiation! You focused on results, not price.",
    losingResponse: "Don't compete on price. Compete on outcomes and guarantees.",
    winningExamples: [
      "Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved.",
      "Good question. They may be — but the difference is what happens after. We guarantee results, not just treatments. If something doesn't work, I'm back out here to fix it. Want me to show you our guarantee?"
    ],
    losingExamples: [
      "They don't do it right.",
      "We can match their price."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Differentiation", "Local Advantage", "Personal Service"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Good question. They may be — but the difference is what happens after. We guarantee results, not just treatments. If something doesn't work, I'm back out here to fix it. Want me to show you our guarantee?' Key points: 1) Don't bash competitor, 2) Differentiate on results/guarantee, 3) Offer proof of your value.",
    lawnIssues: ["the specific issues we identified", "problem areas that need guaranteed results"]
  },
  {
    id: "rp-13",
    name: "Why do I have to pay now?",
    role: "The Cautious Buyer",
    phase: "Chapter 2",
    context: "Close → Payment Explanation",
    objection: "Wait, why do I have to pay right now?",
    passCriteria: "Normalize the payment process, remove risk, and maintain the close.",
    failConditions: "Gets defensive or fails to remove risk",
    winningResponse: "Well done! You normalized payment and removed risk concerns.",
    losingResponse: "Explain the process, emphasize guarantees, and remove risk.",
    winningExamples: [
      "Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed.",
      "Great question — it's how we lock in today's rate and schedule your first visit. Plus, if you're not happy after the first treatment, you don't pay. Fair?"
    ],
    losingExamples: [
      "That's just how we do it.",
      "Everyone has to pay upfront."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Process Explanation", "Risk Removal", "Close Maintenance"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Great question — it's how we lock in today's rate and schedule your first visit. Plus, if you're not happy after the first treatment, you don't pay. Fair?' Key points: 1) Explain the benefit of paying today, 2) Emphasize the guarantee/risk removal, 3) Keep moving toward the close.",
    lawnIssues: ["the treatment plan we discussed", "the issues we're going to fix"]
  },
  {
    id: "rp-14",
    name: "I need to think about it.",
    role: "The Indecisive Prospect",
    phase: "Chapter 2",
    context: "Close → Handling Stalls",
    objection: "I need to think about it.",
    passCriteria: "Isolate the real concern and advance the decision.",
    failConditions: "Accepts stall or pressures for immediate decision",
    winningResponse: "Great job isolating the real concern and advancing!",
    losingResponse: "Always ask what specifically they need to think about.",
    winningExamples: [
      "Totally — what part are you thinking through? Price, timing, or the treatment itself?",
      "Totally fair — what specifically are you weighing? If it's the price, timing, or something else, I might be able to help clarify right now."
    ],
    losingExamples: [
      "Sure, take your time.",
      "Okay, just give me a call when you decide."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Clarification", "Assistance"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Totally fair — what specifically are you weighing? If it's the price, timing, or something else, I might be able to help clarify right now.' Key points: 1) Acknowledge their need to think, 2) Ask WHAT specifically, 3) Offer to address it immediately.",
    lawnIssues: ["the treatment we discussed", "the issues I pointed out"]
  },
  {
    id: "rp-15",
    name: "Just send me something to look at.",
    role: "The Defeater",
    phase: "Chapter 2",
    context: "Close → Securing Next Step",
    objection: "Why don't you just send me something and I'll look it over.",
    passCriteria: "Clarify decision criteria and regain control of the next step.",
    failConditions: "Leaves materials without securing commitment",
    winningResponse: "Excellent control! You secured a concrete next step.",
    losingResponse: "Never leave materials. Clarify criteria and set a specific callback.",
    winningExamples: [
      "Happy to — before I go, what would you be deciding after you look it over?",
      "Absolutely — I can do that. Just so I know what to include, what would you need to see to feel comfortable moving forward?"
    ],
    losingExamples: [
      "I'll leave my card.",
      "Sure, here's my flyer."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Control", "Next Step", "Commitment"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Absolutely — I can do that. Just so I know what to include, what would you need to see to feel comfortable moving forward?' Key points: 1) Agree to their request, 2) Ask about their decision criteria, 3) Set a specific follow-up time.",
    lawnIssues: ["the issues we identified", "the problem areas I showed you"]
  },
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Ultimate Test",
    phase: "Post-Training",
    context: "Final Certification Assessment",
    objection: "Yeah? What do you want?",
    passCriteria: "Demonstrate control across at least 3 phases including a successful close.",
    failConditions: "Fails to navigate multiple objections or loses control of conversation",
    winningResponse: "Congratulations! You have demonstrated mastery across all phases.",
    losingResponse: "Review all chapters and practice each phase before retrying.",
    winningExamples: [
      "Smooth handling of multiple objections with professional transitions between phases.",
      "Successfully navigated from opening through pricing to close with control questions throughout."
    ],
    losingExamples: [
      "Got stuck on one objection without advancing.",
      "Lost control of the conversation or failed to close."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 85,
    buySignal: 20,
    traits: ["Full Pitch", "Multi-Phase Control", "Close Execution"],
    durationSeconds: 240,
    isCertification: true,
    scriptHint: "This is your final assessment. You'll face multiple objections across different phases. Remember: 1) Acknowledge every objection first, 2) Use control questions to guide the conversation, 3) Build value before discussing price, 4) Isolate concerns before closing, 5) Always secure a concrete next step.",
    lawnIssues: ["weeds along the curb", "dry patches near the driveway", "some grub damage", "thin spots in the shade"]
  }
];

export function getVapiRoleplayConfig(roleplayId: string): VapiRoleplayConfig | undefined {
  return VAPI_ROLEPLAY_CONFIGS.find(config => config.id === roleplayId);
}

export interface DatabaseRoleplay {
  id: string;
  name: string;
  role: string;
  description: string;
  difficulty: string;
  phase?: string;
  placement?: string;
  passCriteria?: string;
  failConditions?: string;
  winningResponse?: string;
  losingResponse?: string;
  buySignal?: number;
  objections?: number;
  resistance?: number;
  traits?: string[];
  isCertification?: boolean;
}

export function convertRoleplayToVapiConfig(roleplay: DatabaseRoleplay): VapiRoleplayConfig {
  const isCertification = roleplay.isCertification || 
    roleplay.name.toLowerCase().includes('certification') ||
    roleplay.id.includes('certification') ||
    roleplay.id === 'rp-16';
  
  const isCoachingMode = ['rp-01', 'rp-02', 'rp-03', 'rp-04', 'rp-05', 'rp-06', 'rp-07'].includes(roleplay.id);
  
  const staticConfig = VAPI_ROLEPLAY_CONFIGS.find(c => c.id === roleplay.id);
  
  return {
    id: roleplay.id,
    name: roleplay.name,
    role: roleplay.role,
    phase: roleplay.phase || staticConfig?.phase || "Phase 1",
    context: roleplay.placement || roleplay.description,
    objection: staticConfig?.objection || roleplay.name,
    passCriteria: roleplay.passCriteria || staticConfig?.passCriteria || "Handle the objection professionally and move toward next step",
    failConditions: roleplay.failConditions || staticConfig?.failConditions || "Being rude, pushy, or giving up too easily",
    winningResponse: roleplay.winningResponse || staticConfig?.winningResponse || "Acknowledge, ask a discovery question, and guide the conversation",
    losingResponse: roleplay.losingResponse || staticConfig?.losingResponse || "Push forward without addressing their concern",
    winningExamples: staticConfig?.winningExamples || [],
    losingExamples: staticConfig?.losingExamples || [],
    goalType: staticConfig?.goalType || "advance",
    difficulty: (roleplay.difficulty === "Beginner" || roleplay.difficulty === "Intermediate" || roleplay.difficulty === "Advanced") 
      ? roleplay.difficulty 
      : roleplay.difficulty === "Expert" ? "Advanced" : "Intermediate",
    resistanceLevel: roleplay.resistance ?? staticConfig?.resistanceLevel ?? 60,
    buySignal: roleplay.buySignal ?? staticConfig?.buySignal ?? 30,
    traits: roleplay.traits || staticConfig?.traits || ["Professional", "Respectful", "Persistence"],
    durationSeconds: isCertification ? 240 : 90,
    isCertification,
    isCoachingMode,
    scriptHint: staticConfig?.scriptHint,
    lawnIssues: staticConfig?.lawnIssues
  };
}

export function buildVapiAssistantPrompt(config: VapiRoleplayConfig): string {
  const resistanceDescription = config.resistanceLevel > 70 ? "very resistant and skeptical" : 
                                 config.resistanceLevel > 40 ? "moderately resistant" : "somewhat open but cautious";
  
  const buySignalDescription = config.buySignal > 50 ? "showing some underlying interest" :
                               config.buySignal > 25 ? "cautiously curious" : "not showing buying interest";

  const lawnIssuesSection = config.lawnIssues && config.lawnIssues.length > 0 
    ? `\nYOUR LAWN ISSUES (IMPORTANT - Your lawn DOES have these problems):
${config.lawnIssues.map(issue => `- ${issue}`).join('\n')}
- NEVER deny these issues exist if the rep mentions them
- NEVER penalize the rep for correctly identifying these issues
- If the rep points out an issue, acknowledge it naturally ("Oh, I hadn't noticed that" or "Hmm, I see what you mean")` 
    : '';

  const goalTypeSection = config.goalType === "exit_gracefully" 
    ? `\nGOAL TYPE: EXIT GRACEFULLY
- This scenario teaches professional retreat, not pushing forward
- If the rep handles it well, they should politely exit while leaving a positive impression
- Success means respecting boundaries while creating a future opening`
    : `\nGOAL TYPE: ADVANCE THE CONVERSATION
- The rep should try to move the conversation forward
- Success means getting you to engage further or agree to a next step`;

  const coachingInstructions = config.isCoachingMode ? `

COACHING MODE (IMPORTANT - This is a beginner-level training roleplay):
- Be more patient and give the rep time to respond
- If they seem stuck or go off track, gently nudge them back with hints like:
  * "Hmm, I'm still pretty busy though..." (to remind them to address time)
  * "I don't really see why I should talk to you..." (to prompt them to give a reason)
  * "What exactly are you trying to show me?" (to help them be more specific)
- If they're doing well, give them natural openings to continue
- Don't immediately shut them down on first mistakes - give them a chance to recover
- If they completely miss the mark, stay in character but make it easier for them to try again
- The goal is training and learning, not just testing` : `

EVALUATION MODE:
- Maintain realistic resistance based on your character
- Don't give extra hints or make it easier
- Evaluate their technique honestly`;

  const winningExamplesSection = config.winningExamples && config.winningExamples.length > 0
    ? `\nEXAMPLES OF GOOD REP RESPONSES (recognize these patterns as success):
${config.winningExamples.map((ex, i) => `${i + 1}. "${ex}"`).join('\n')}`
    : `\nEXAMPLE OF A GOOD REP RESPONSE:\n"${config.winningResponse}"`;

  const losingExamplesSection = config.losingExamples && config.losingExamples.length > 0
    ? `\nEXAMPLES OF BAD REP RESPONSES (recognize these patterns as failure):
${config.losingExamples.map((ex, i) => `${i + 1}. "${ex}"`).join('\n')}`
    : `\nEXAMPLE OF A BAD REP RESPONSE:\n"${config.losingResponse}"`;

  const successVoiceCue = `

WHEN THE REP SUCCEEDS:
- If the rep handles your objection well and demonstrates the pass criteria, signal success by saying something like:
  "Alright, you know what — you've got my attention. That's a wrap on this practice. Go ahead and end the call to see your results."
- This lets them know they passed and should click End Call
- Only give this success cue when they have genuinely demonstrated good technique`;

  return `You are playing the role of a homeowner in a door-to-door sales training simulation for Gecko Green lawn care services.

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)
${goalTypeSection}
${lawnIssuesSection}
${coachingInstructions}

SCENARIO CONTEXT:
${config.context}

YOUR BEHAVIOR GUIDELINES:
1. Start with your opening objection: "${config.objection}"
2. Stay in character as a realistic homeowner throughout
3. React naturally to what the sales rep says
4. If the rep handles your objection well (${config.passCriteria}), gradually become more open
5. If the rep handles it poorly (${config.failConditions}), become more resistant or end the conversation
6. Keep responses concise (1-3 sentences typically) - you're a busy homeowner

WHAT SUCCESS LOOKS LIKE:
${config.passCriteria}

WHAT FAILURE LOOKS LIKE:
${config.failConditions}
${winningExamplesSection}
${losingExamplesSection}
${successVoiceCue}

IMPORTANT RULES:
- This is a VOICE conversation - do NOT ask for photos, brochures, before/after pictures, or written testimonials
- If you want proof, ask the rep to DESCRIBE results or EXPLAIN their process verbally
- Do NOT request anything that cannot be shown in a voice call
- The rep does NOT have access to physical materials during this call

CONVERSATION FLOW:
- Be a realistic homeowner, not a robot
- React to tone and energy, not just words
- If the rep earns your attention, show increasing interest
- If the rep loses you, politely (or not so politely) end the conversation
- The conversation should last 60-90 seconds maximum
- You do NOT need to use the full time - if the rep succeeds early, give them the success cue

Remember: You are training sales reps to be better at their job. Stay in character but be fair.`;
}

export function buildVapiAssistantConfig(config: VapiRoleplayConfig) {
  return {
    name: `Roleplay: ${config.name}`,
    firstMessage: config.objection,
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: buildVapiAssistantPrompt(config)
        }
      ]
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      stability: 0.5,
      similarityBoost: 0.75
    },
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
      endpointing: 500
    },
    silenceTimeoutSeconds: 30,
    responseDelaySeconds: 1.2,
    artifactPlan: {
      recordingEnabled: true,
      transcriptPlan: {
        enabled: true,
        assistantName: "Homeowner",
        userName: "Sales Rep"
      }
    },
    maxDurationSeconds: 300,
    backgroundSound: "off",
    endCallFunctionEnabled: false
  };
}
