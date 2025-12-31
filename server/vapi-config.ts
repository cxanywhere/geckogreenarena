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
  }
];

export function getVapiRoleplayConfig(roleplayId: string): VapiRoleplayConfig | undefined {
  return VAPI_ROLEPLAY_CONFIGS.find(config => config.id === roleplayId);
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
