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
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resistanceLevel: number;
  buySignal: number;
  traits: string[];
  durationSeconds: number;
  isCertification?: boolean;
  isCoachingMode?: boolean;
  scriptHint?: string;
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
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 60,
    traits: ["Time Management", "Control Question", "Respect"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?' Key points: 1) Acknowledge their time pressure first, 2) Set a specific time limit (60 seconds), 3) End with a control question to engage them."
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
    difficulty: "Beginner",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Reframing", "Persistence", "Specifics"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?' Key points: 1) Don't accept rejection or argue, 2) Pivot to something specific about THEIR lawn, 3) Ask a discovery question to re-engage."
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
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 50,
    traits: ["Compliance", "Intent Clarification", "Micro-Permission"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?' Key points: 1) Acknowledge their rule respectfully, 2) Clarify your intent (not selling, observing), 3) Request permission to show something specific."
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
    difficulty: "Beginner",
    resistanceLevel: 35,
    buySignal: 65,
    traits: ["Validation", "Differentiation", "Leadership"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?' Key points: 1) Validate their identity as a DIYer, 2) Don't try to convert them, 3) Point to something specific they may have missed."
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
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Gap Analysis", "Non-Threatening", "Discovery"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?' Key points: 1) Remove fear of switching, 2) Never attack their current provider, 3) Find a gap in their current service."
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
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 70,
    traits: ["Clarity", "Direction", "Purpose"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.' Key points: 1) Be direct and concise, 2) Tie it to something happening in their area, 3) Lead them to a specific next step."
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
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Validation", "Specificity", "Curiosity Building"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'I hear you — it does look pretty good from here. The thing I noticed is right along that edge by the driveway. Mind if I show you what I'm seeing?' Key points: 1) Agree with their perspective first, 2) Isolate ONE specific area, 3) Ask permission to show them."
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
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Acceptance", "Social Proof", "Permission"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Totally fair — some folks feel that way. The only reason I mention it is these spread fast to neighbors. Can I show you what I mean real quick?' Key points: 1) Accept their preference without judgment, 2) Pivot to neighbor/community concern, 3) Keep it educational, not pushy."
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
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Demonstration", "Specificity", "Movement"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Let me show you — it's easier to see up close. Right over here by the curb, see those lighter patches? That's where it's starting.' Key points: 1) Move physically toward the issue, 2) Be specific about location, 3) Point directly at what you're describing."
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
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Building", "Deferral", "Assessment"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Great question — it depends on your lawn size and what we find. Let me take a quick look and I can give you an exact number. Fair?' Key points: 1) Acknowledge the question positively, 2) Defer by needing more info, 3) Offer to assess first before quoting."
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
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["Cost Breakdown", "Comparison", "Value Demonstration"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'I get it — let me break it down. That's about $8 a week for a lawn that looks great all season. Most folks spend more than that on coffee. What if I showed you what's included?' Key points: 1) Break down the cost to weekly/daily, 2) Compare to everyday purchases, 3) Offer to show value before discussing discount."
  },
  {
    id: "rp-12",
    name: "Another company is cheaper.",
    role: "The Comparison Shopper",
    phase: "Chapter 2",
    context: "Pricing → Competitor Comparison",
    objection: "Another company is cheaper.",
    passCriteria: "Reframe the conversation from price to outcome value.",
    failConditions: "Attacks competitor or matches price immediately",
    winningResponse: "Excellent differentiation! You focused on results, not price.",
    losingResponse: "Don't compete on price. Compete on outcomes and guarantees.",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Differentiation", "Local Advantage", "Personal Service"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Good question. They may be — but the difference is what happens after. We guarantee results, not just treatments. If something doesn't work, I'm back out here to fix it. Want me to show you our guarantee?' Key points: 1) Don't bash competitor, 2) Differentiate on results/guarantee, 3) Offer proof of your value."
  },
  {
    id: "rp-13",
    name: "Why do I have to pay now?",
    role: "The Cautious Buyer",
    phase: "Chapter 2",
    context: "Close → Payment Explanation",
    objection: "Why do I have to pay now?",
    passCriteria: "Normalize the payment process, remove risk, and maintain the close.",
    failConditions: "Gets defensive or fails to remove risk",
    winningResponse: "Well done! You normalized payment and removed risk concerns.",
    losingResponse: "Explain the process, emphasize guarantees, and remove risk.",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Process Explanation", "Risk Removal", "Close Maintenance"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Great question — it's how we lock in today's rate and schedule your first visit. Plus, if you're not happy after the first treatment, you don't pay. Fair?' Key points: 1) Explain the benefit of paying today, 2) Emphasize the guarantee/risk removal, 3) Keep moving toward the close."
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
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Clarification", "Assistance"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Totally fair — what specifically are you weighing? If it's the price, timing, or something else, I might be able to help clarify right now.' Key points: 1) Acknowledge their need to think, 2) Ask WHAT specifically, 3) Offer to address it immediately."
  },
  {
    id: "rp-15",
    name: "I'll call you / send me something.",
    role: "The Defeater",
    phase: "Chapter 2",
    context: "Close → Securing Next Step",
    objection: "I'll call you / send me something.",
    passCriteria: "Clarify decision criteria and regain control of the next step.",
    failConditions: "Leaves materials without securing commitment",
    winningResponse: "Excellent control! You secured a concrete next step.",
    losingResponse: "Never leave materials. Clarify criteria and set a specific callback.",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Control", "Next Step", "Commitment"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Absolutely — I can do that. Just so I know what to include, what would you need to see to feel comfortable moving forward?' Key points: 1) Agree to their request, 2) Ask about their decision criteria, 3) Set a specific follow-up time."
  },
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Ultimate Test",
    phase: "Post-Training",
    context: "Final Certification Assessment",
    objection: "I need to hear your full pitch.",
    passCriteria: "Demonstrate control across at least 3 phases including a successful close.",
    failConditions: "Fails to navigate multiple objections or loses control of conversation",
    winningResponse: "Congratulations! You have demonstrated mastery across all phases.",
    losingResponse: "Review all chapters and practice each phase before retrying.",
    difficulty: "Advanced",
    resistanceLevel: 85,
    buySignal: 20,
    traits: ["Full Pitch", "Multi-Phase Control", "Close Execution"],
    durationSeconds: 240,
    isCertification: true,
    scriptHint: "This is your final assessment. You'll face multiple objections across different phases. Remember: 1) Acknowledge every objection first, 2) Use control questions to guide the conversation, 3) Build value before discussing price, 4) Isolate concerns before closing, 5) Always secure a concrete next step."
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
    objection: roleplay.name,
    passCriteria: roleplay.passCriteria || staticConfig?.passCriteria || "Handle the objection professionally and move toward next step",
    failConditions: roleplay.failConditions || staticConfig?.failConditions || "Being rude, pushy, or giving up too easily",
    winningResponse: roleplay.winningResponse || staticConfig?.winningResponse || "Acknowledge, ask a discovery question, and guide the conversation",
    losingResponse: roleplay.losingResponse || staticConfig?.losingResponse || "Push forward without addressing their concern",
    difficulty: (roleplay.difficulty === "Beginner" || roleplay.difficulty === "Intermediate" || roleplay.difficulty === "Advanced") 
      ? roleplay.difficulty 
      : roleplay.difficulty === "Expert" ? "Advanced" : "Intermediate",
    resistanceLevel: roleplay.resistance ?? staticConfig?.resistanceLevel ?? 60,
    buySignal: roleplay.buySignal ?? staticConfig?.buySignal ?? 30,
    traits: roleplay.traits || staticConfig?.traits || ["Professional", "Respectful", "Persistence"],
    durationSeconds: isCertification ? 240 : 90,
    isCertification,
    isCoachingMode,
    scriptHint: staticConfig?.scriptHint
  };
}

export function buildVapiAssistantPrompt(config: VapiRoleplayConfig): string {
  const resistanceDescription = config.resistanceLevel > 70 ? "very resistant and skeptical" : 
                                 config.resistanceLevel > 40 ? "moderately resistant" : "somewhat open but cautious";
  
  const buySignalDescription = config.buySignal > 50 ? "showing some underlying interest" :
                               config.buySignal > 25 ? "cautiously curious" : "not showing buying interest";

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

  return `You are playing the role of a homeowner in a door-to-door sales training simulation for Gecko Green lawn care services.

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)
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

EXAMPLE OF A GOOD REP RESPONSE:
"${config.winningResponse}"

EXAMPLE OF A BAD REP RESPONSE:
"${config.losingResponse}"

CONVERSATION FLOW:
- Be a realistic homeowner, not a robot
- React to tone and energy, not just words
- If the rep earns your attention, show increasing interest
- If the rep loses you, politely (or not so politely) end the conversation
- The conversation should last 60-90 seconds maximum

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
    responseDelaySeconds: 0.8,
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
