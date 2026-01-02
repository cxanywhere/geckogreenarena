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
}

export const VAPI_ROLEPLAY_CONFIGS: VapiRoleplayConfig[] = [
  {
    id: "ch1-rp1",
    name: "I'm actually really busy right now.",
    role: "The Busy Homeowner",
    phase: "Phase 1",
    context: "Opening → First 10 Seconds",
    objection: "I'm actually really busy right now.",
    passCriteria: "Acknowledge time pressure + set ≤60s container + ask a qualifying control question",
    failConditions: "Pitches immediately or disengages",
    winningResponse: "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?",
    losingResponse: "This won't take long… we do fertilization and weed control.",
    difficulty: "Beginner",
    resistanceLevel: 60,
    buySignal: 30,
    traits: ["Time Management", "Control Question", "Respect"]
  },
  {
    id: "ch1-rp2",
    name: "Not interested.",
    role: "The Dismissive Prospect",
    phase: "Phase 1",
    context: "Opening → Handling Brush-Offs",
    objection: "Not interested.",
    passCriteria: "Acknowledge + reframe to specific issue + redirect",
    failConditions: "Argues or accepts rejection",
    winningResponse: "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?",
    losingResponse: "Okay, no worries.",
    difficulty: "Intermediate",
    resistanceLevel: 80,
    buySignal: 10,
    traits: ["Reframing", "Persistence", "Specifics"]
  },
  {
    id: "ch1-rp3",
    name: "No soliciting.",
    role: "The Rule Follower",
    phase: "Phase 1",
    context: "Opening → Compliance & Authority",
    objection: "No soliciting.",
    passCriteria: "Acknowledge rule + clarify intent + request micro-permission",
    failConditions: "Debates policy",
    winningResponse: "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?",
    losingResponse: "I'm not selling anything… (keeps talking)",
    difficulty: "Advanced",
    resistanceLevel: 90,
    buySignal: 5,
    traits: ["Compliance", "Intent Clarification", "Micro-Permission"]
  },
  {
    id: "ch1-rp4",
    name: "I do my own lawn.",
    role: "The DIY Enthusiast",
    phase: "Phase 2",
    context: "Turn & Burn → DIY Pushback",
    objection: "I do my own lawn.",
    passCriteria: "Validate identity + differentiate + regain lead",
    failConditions: "Tries to convert DIY",
    winningResponse: "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?",
    losingResponse: "We help a lot of DIY customers…",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 40,
    traits: ["Validation", "Differentiation", "Leadership"]
  },
  {
    id: "ch1-rp5",
    name: "We already have a lawn company.",
    role: "The Loyalist",
    phase: "Phase 2",
    context: "Turn & Burn → Existing Provider",
    objection: "We already have a lawn company.",
    passCriteria: "Acknowledge + remove replacement fear + isolate gap",
    failConditions: "Attacks competitor",
    winningResponse: "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?",
    losingResponse: "We're better than most companies…",
    difficulty: "Advanced",
    resistanceLevel: 85,
    buySignal: 20,
    traits: ["Gap Analysis", "Non-Threatening", "Discovery"]
  },
  {
    id: "ch1-rp6",
    name: "Why are you here?",
    role: "The Confused Homeowner",
    phase: "Phase 2",
    context: "Turn & Burn → Purpose Statement",
    objection: "Why are you here?",
    passCriteria: "State purpose clearly + direct next action",
    failConditions: "Rambles / over-explains",
    winningResponse: "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.",
    losingResponse: "I'm with Gecko, and what we do is…",
    difficulty: "Beginner",
    resistanceLevel: 40,
    buySignal: 50,
    traits: ["Clarity", "Direction", "Purpose"]
  },
  {
    id: "1c1815b2-d01b-4142-811c-66cd7170b5d2",
    name: "My lawn looks fine.",
    role: "The Denialist",
    phase: "Phase 2",
    context: "Turn & Burn → Denial of Problem",
    objection: "My lawn looks fine.",
    passCriteria: "Validate their view + point to specific visible issue + create curiosity",
    failConditions: "Argues or insists they're wrong",
    winningResponse: "I hear you — it does look pretty good from here. The thing I noticed is right along that edge by the driveway. Mind if I show you what I'm seeing?",
    losingResponse: "Actually, I can see several problem areas...",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Validation", "Specificity", "Curiosity Building"]
  },
  {
    id: "241842f6-a207-404a-a708-dddc732f40d5",
    name: "My lawn looks fine.",
    role: "The Denialist",
    phase: "Phase 2",
    context: "Turn & Burn → Denial of Problem",
    objection: "My lawn looks fine.",
    passCriteria: "Validate their view + point to specific visible issue + create curiosity",
    failConditions: "Argues or insists they're wrong",
    winningResponse: "I hear you — it does look pretty good from here. The thing I noticed is right along that edge by the driveway. Mind if I show you what I'm seeing?",
    losingResponse: "Actually, I can see several problem areas...",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Validation", "Specificity", "Curiosity Building"]
  },
  {
    id: "ab1c05c0-92c7-42a5-b5dd-6e07b5504abd",
    name: "Weeds don't bother me.",
    role: "The Apathetic Homeowner",
    phase: "Phase 2",
    context: "Turn & Burn → Apathy Response",
    objection: "Weeds don't bother me.",
    passCriteria: "Acknowledge preference + pivot to neighbor/spread concern + ask permission to show",
    failConditions: "Judges their standards or pushes too hard",
    winningResponse: "Totally fair — some folks feel that way. The only reason I mention it is these spread fast to neighbors. Can I show you what I mean real quick?",
    losingResponse: "But weeds will take over your whole lawn...",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Acceptance", "Social Proof", "Permission"]
  },
  {
    id: "430ee4af-0306-4a16-aa5b-4b15d8116b00",
    name: "Weeds don't bother me.",
    role: "The Apathetic Homeowner",
    phase: "Phase 2",
    context: "Turn & Burn → Apathy Response",
    objection: "Weeds don't bother me.",
    passCriteria: "Acknowledge preference + pivot to neighbor/spread concern + ask permission to show",
    failConditions: "Judges their standards or pushes too hard",
    winningResponse: "Totally fair — some folks feel that way. The only reason I mention it is these spread fast to neighbors. Can I show you what I mean real quick?",
    losingResponse: "But weeds will take over your whole lawn...",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Acceptance", "Social Proof", "Permission"]
  },
  {
    id: "268dffb1-dc31-4402-9d7c-4c36bca77d18",
    name: "I don't see the issue.",
    role: "The Visual Skeptic",
    phase: "Phase 2",
    context: "Turn & Burn → Skepticism",
    objection: "I don't see the issue.",
    passCriteria: "Offer to physically show them + be specific about location + get them moving",
    failConditions: "Describes problem without showing",
    winningResponse: "Let me show you — it's easier to see up close. Right over here by the curb, see those lighter patches? That's where it's starting.",
    losingResponse: "Trust me, there are weeds spreading throughout...",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Demonstration", "Specificity", "Movement"]
  },
  {
    id: "d64a3cc5-4756-4f73-85dc-7db8517bf32a",
    name: "I don't see the issue.",
    role: "The Visual Skeptic",
    phase: "Phase 2",
    context: "Turn & Burn → Skepticism",
    objection: "I don't see the issue.",
    passCriteria: "Offer to physically show them + be specific about location + get them moving",
    failConditions: "Describes problem without showing",
    winningResponse: "Let me show you — it's easier to see up close. Right over here by the curb, see those lighter patches? That's where it's starting.",
    losingResponse: "Trust me, there are weeds spreading throughout...",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Demonstration", "Specificity", "Movement"]
  },
  {
    id: "dd97051b-8a35-4166-8e42-89ae0278b838",
    name: "How much does it cost?",
    role: "The Price Shopper",
    phase: "Phase 3",
    context: "Closing → Price Inquiry",
    objection: "How much does it cost?",
    passCriteria: "Acknowledge question + defer with value build + offer to assess first",
    failConditions: "Gives price immediately without building value",
    winningResponse: "Great question — it depends on your lawn size and what we find. Let me take a quick look and I can give you an exact number. Fair?",
    losingResponse: "It starts at $49 per treatment...",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Building", "Deferral", "Assessment"]
  },
  {
    id: "4bbdb30a-a264-40b3-a324-7db130b7d995",
    name: "How much does it cost?",
    role: "The Price Shopper",
    phase: "Phase 3",
    context: "Closing → Price Inquiry",
    objection: "How much does it cost?",
    passCriteria: "Acknowledge question + defer with value build + offer to assess first",
    failConditions: "Gives price immediately without building value",
    winningResponse: "Great question — it depends on your lawn size and what we find. Let me take a quick look and I can give you an exact number. Fair?",
    losingResponse: "It starts at $49 per treatment...",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Building", "Deferral", "Assessment"]
  },
  {
    id: "866f7d61-1d8a-4890-837a-e451ce860e7e",
    name: "That's too expensive.",
    role: "The Budget Watcher",
    phase: "Phase 3",
    context: "Closing → Price Objection",
    objection: "That's too expensive.",
    passCriteria: "Acknowledge concern + break down cost + compare to alternatives",
    failConditions: "Immediately offers discount or argues value",
    winningResponse: "I get it — let me break it down. That's about $8 a week for a lawn that looks great all season. Most folks spend more than that on coffee. What if I showed you what's included?",
    losingResponse: "Let me see what discount I can get you...",
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["Cost Breakdown", "Comparison", "Value Demonstration"]
  },
  {
    id: "fc76f7e8-ec60-4bbb-a930-04edce68db01",
    name: "That's too expensive.",
    role: "The Budget Watcher",
    phase: "Phase 3",
    context: "Closing → Price Objection",
    objection: "That's too expensive.",
    passCriteria: "Acknowledge concern + break down cost + compare to alternatives",
    failConditions: "Immediately offers discount or argues value",
    winningResponse: "I get it — let me break it down. That's about $8 a week for a lawn that looks great all season. Most folks spend more than that on coffee. What if I showed you what's included?",
    losingResponse: "Let me see what discount I can get you...",
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["Cost Breakdown", "Comparison", "Value Demonstration"]
  },
  {
    id: "b7cffc85-375f-4c7d-852a-969d48ddcc4e",
    name: "I need to think about it.",
    role: "The Indecisive Homeowner",
    phase: "Phase 3",
    context: "Closing → Stall Tactic",
    objection: "I need to think about it.",
    passCriteria: "Acknowledge + isolate the concern + offer to address it now",
    failConditions: "Accepts stall or pressures for immediate decision",
    winningResponse: "Totally fair — what specifically are you weighing? If it's the price, timing, or something else, I might be able to help clarify right now.",
    losingResponse: "Okay, when should I come back?",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Clarification", "Assistance"]
  },
  {
    id: "f14ae08f-fdbc-42b9-a602-5696242272f6",
    name: "I need to think about it.",
    role: "The Indecisive Homeowner",
    phase: "Phase 3",
    context: "Closing → Stall Tactic",
    objection: "I need to think about it.",
    passCriteria: "Acknowledge + isolate the concern + offer to address it now",
    failConditions: "Accepts stall or pressures for immediate decision",
    winningResponse: "Totally fair — what specifically are you weighing? If it's the price, timing, or something else, I might be able to help clarify right now.",
    losingResponse: "Okay, when should I come back?",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Clarification", "Assistance"]
  },
  {
    id: "11eaa8ba-321d-4394-a1f4-8b4ca0028670",
    name: "Can you leave me a quote?",
    role: "The Document Requester",
    phase: "Phase 3",
    context: "Closing → Quote Request",
    objection: "Can you leave me a quote?",
    passCriteria: "Acknowledge request + explain quote is personalized + offer walkthrough first",
    failConditions: "Leaves quote without engagement",
    winningResponse: "Absolutely — I can do that. The quote is based on your specific lawn though. Mind if I take a quick walk around so I can give you an accurate number?",
    losingResponse: "Sure, here's a general price sheet...",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Personalization", "Engagement", "Assessment"]
  },
  {
    id: "77b99928-e81c-4569-9314-2cd5260b4ccc",
    name: "Can you leave me a quote?",
    role: "The Document Requester",
    phase: "Phase 3",
    context: "Closing → Quote Request",
    objection: "Can you leave me a quote?",
    passCriteria: "Acknowledge request + explain quote is personalized + offer walkthrough first",
    failConditions: "Leaves quote without engagement",
    winningResponse: "Absolutely — I can do that. The quote is based on your specific lawn though. Mind if I take a quick walk around so I can give you an accurate number?",
    losingResponse: "Sure, here's a general price sheet...",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Personalization", "Engagement", "Assessment"]
  },
  {
    id: "19589ec8-78db-4d72-8d1c-44a2a112d025",
    name: "I need to talk to my spouse.",
    role: "The Decision Delegator",
    phase: "Phase 3",
    context: "Closing → Spouse Objection",
    objection: "I need to talk to my spouse.",
    passCriteria: "Acknowledge + offer to include spouse + or get preliminary buy-in",
    failConditions: "Dismisses spouse involvement or pushes for solo decision",
    winningResponse: "Makes sense — are they home? I'd be happy to walk through it with both of you. If not, what would they want to know most?",
    losingResponse: "You seem like the decision maker here...",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Inclusion", "Partnership", "Information Gathering"]
  },
  {
    id: "8a68b5cc-8a63-4c96-9b69-258c06a12a92",
    name: "I need to talk to my spouse.",
    role: "The Decision Delegator",
    phase: "Phase 3",
    context: "Closing → Spouse Objection",
    objection: "I need to talk to my spouse.",
    passCriteria: "Acknowledge + offer to include spouse + or get preliminary buy-in",
    failConditions: "Dismisses spouse involvement or pushes for solo decision",
    winningResponse: "Makes sense — are they home? I'd be happy to walk through it with both of you. If not, what would they want to know most?",
    losingResponse: "You seem like the decision maker here...",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Inclusion", "Partnership", "Information Gathering"]
  },
  {
    id: "eaf4219d-7b9f-463a-a80c-9dd8526593ce",
    name: "Can you come back later?",
    role: "The Rescheduler",
    phase: "Phase 1",
    context: "Opening → Timing Objection",
    objection: "Can you come back later?",
    passCriteria: "Acknowledge timing + create urgency + offer quick alternative",
    failConditions: "Immediately agrees to return without attempt",
    winningResponse: "I can — though I'm only in the neighborhood today. Takes 60 seconds to show you what I found. If it doesn't apply, I'm out of your hair. Fair?",
    losingResponse: "Sure, when would be a good time?",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 40,
    traits: ["Urgency", "Time Container", "Flexibility"]
  },
  {
    id: "8aa1ddda-bb52-405d-b809-7f84ae6415c6",
    name: "Can you come back later?",
    role: "The Rescheduler",
    phase: "Phase 1",
    context: "Opening → Timing Objection",
    objection: "Can you come back later?",
    passCriteria: "Acknowledge timing + create urgency + offer quick alternative",
    failConditions: "Immediately agrees to return without attempt",
    winningResponse: "I can — though I'm only in the neighborhood today. Takes 60 seconds to show you what I found. If it doesn't apply, I'm out of your hair. Fair?",
    losingResponse: "Sure, when would be a good time?",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 40,
    traits: ["Urgency", "Time Container", "Flexibility"]
  },
  {
    id: "c91e5c42-8d5d-4a75-8e08-c272c591bcf3",
    name: "What makes you better than TruGreen?",
    role: "The Comparison Shopper",
    phase: "Phase 3",
    context: "Closing → Competitor Comparison",
    objection: "What makes you better than TruGreen?",
    passCriteria: "Acknowledge competitor + differentiate on service/local + avoid trash-talking",
    failConditions: "Attacks competitor directly",
    winningResponse: "Good question. They're a big national company — we're local, so you get my cell and I'm the one who shows up every time. Most folks prefer that direct line. Want me to show you how we handle your specific issues?",
    losingResponse: "TruGreen uses cheap products and doesn't care about customers...",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Differentiation", "Local Advantage", "Personal Service"]
  },
  {
    id: "723e29a3-cc3d-421c-913b-10a76f6b1f7f",
    name: "What makes you better than TruGreen?",
    role: "The Comparison Shopper",
    phase: "Phase 3",
    context: "Closing → Competitor Comparison",
    objection: "What makes you better than TruGreen?",
    passCriteria: "Acknowledge competitor + differentiate on service/local + avoid trash-talking",
    failConditions: "Attacks competitor directly",
    winningResponse: "Good question. They're a big national company — we're local, so you get my cell and I'm the one who shows up every time. Most folks prefer that direct line. Want me to show you how we handle your specific issues?",
    losingResponse: "TruGreen uses cheap products and doesn't care about customers...",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Differentiation", "Local Advantage", "Personal Service"]
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
}

export function convertRoleplayToVapiConfig(roleplay: DatabaseRoleplay): VapiRoleplayConfig {
  return {
    id: roleplay.id,
    name: roleplay.name,
    role: roleplay.role,
    phase: roleplay.phase || "Phase 1",
    context: roleplay.placement || roleplay.description,
    objection: roleplay.name,
    passCriteria: roleplay.passCriteria || "Handle the objection professionally and move toward next step",
    failConditions: roleplay.failConditions || "Being rude, pushy, or giving up too easily",
    winningResponse: roleplay.winningResponse || "Acknowledge, ask a discovery question, and guide the conversation",
    losingResponse: roleplay.losingResponse || "Push forward without addressing their concern",
    difficulty: (roleplay.difficulty === "Beginner" || roleplay.difficulty === "Intermediate" || roleplay.difficulty === "Advanced") 
      ? roleplay.difficulty 
      : roleplay.difficulty === "Expert" ? "Advanced" : "Intermediate",
    resistanceLevel: roleplay.resistance ?? 60,
    buySignal: roleplay.buySignal ?? 30,
    traits: roleplay.traits || ["Professional", "Respectful", "Persistence"]
  };
}

export function buildVapiAssistantPrompt(config: VapiRoleplayConfig): string {
  const resistanceDescription = config.resistanceLevel > 70 ? "very resistant and skeptical" : 
                                 config.resistanceLevel > 40 ? "moderately resistant" : "somewhat open but cautious";
  
  const buySignalDescription = config.buySignal > 50 ? "showing some underlying interest" :
                               config.buySignal > 25 ? "cautiously curious" : "not showing buying interest";

  return `You are playing the role of a homeowner in a door-to-door sales training simulation for Gecko Green lawn care services.

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)

SCENARIO CONTEXT:
${config.context}

BEHAVIOR GUIDELINES:
1. START the conversation with EXACTLY this objection: "${config.objection}"
2. Stay in character as this homeowner throughout the entire conversation
3. React realistically to the sales rep's responses based on how well they handle your objection
4. If the rep handles your objection well (acknowledges you, doesn't push too hard, asks good questions), gradually become slightly more open
5. If the rep pushes too hard, ignores your concern, or doesn't listen, become MORE resistant
6. Use natural, conversational language - you're a real person at your front door, NOT an AI
7. Keep responses SHORT (1-3 sentences max) - this is a doorstep conversation, not a lecture
8. You may eventually agree to hear more or let them show you something if they do well
9. If they do poorly, you may close the door or firmly decline

WHAT THE REP SHOULD DO TO PASS:
${config.passCriteria}

WHAT WILL MAKE THEM FAIL:
${config.failConditions}

EXAMPLE OF A WINNING RESPONSE FROM THE REP:
"${config.winningResponse}"

EXAMPLE OF A LOSING RESPONSE FROM THE REP:
"${config.losingResponse}"

CRITICAL RULES:
- NEVER break character
- NEVER reveal you are an AI or part of a training simulation
- NEVER give the rep direct coaching or hints
- Respond ONLY as the homeowner would in a real doorstep interaction
- Your FIRST message MUST be: "${config.objection}"`;
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
      language: "en"
    },
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
