export interface KnowledgeEntry {
  id: string;
  type: "slide" | "roleplay" | "script" | "tip";
  category: "door_approach" | "lawn_care" | "program" | "objections" | "roleplays" | "prepay" | "mindset" | "process";
  chapter: number;
  slideNumber?: number;
  title: string;
  content: string;
  tags: string[];
  keywords: string[];
  roleplayId?: string;
  phase?: number;
  winningResponse?: string;
  losingResponse?: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ============ CHAPTER 1: SALES FOUNDATIONS ============
  
  // MINDSET & STANDARDS
  {
    id: "c1_overview",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 1,
    title: "Certification 1 – Chapter 1: Sales Foundations",
    content: `Core outcomes:
• Master the fundamentals (repeatable behaviors that win at the door)
• Fuel your sales engine (standards, habits, simple process)
• Adopt the winning mindset (confidence, control, resilience)`,
    tags: ["overview", "chapter1", "fundamentals"],
    keywords: ["certification", "foundations", "fundamentals", "mindset", "standards"]
  },
  {
    id: "c1_learning_objectives",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 2,
    title: "What Chapter 1 Prepares You For",
    content: `By the end of Chapter 1, you can:
1) Execute a strong door approach and opening
2) Explain lawn care concepts simply (homeowner-friendly)
3) Explain the Gecko Green program quickly and clearly
4) Set expectations (seed bank, control vs perfection)
5) Explain the homeowner partnership responsibilities
6) Present prepay as the default and understand commission impact`,
    tags: ["overview", "learning_objectives"],
    keywords: ["door", "approach", "lawn care", "program", "expectations", "prepay"]
  },
  {
    id: "c1_four_pillars",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 3,
    title: "Four Pillars of Field Success",
    content: `• Timeliness — be where you should be, when you should be there
• Attitude — mindset drives tone, confidence, outcomes
• Practice — repetition builds skill (scripts + scenarios)
• Persistence — more quality doors = more wins`,
    tags: ["mindset", "field_standards", "success"],
    keywords: ["timeliness", "attitude", "practice", "persistence", "pillars", "success", "field"]
  },
  {
    id: "c1_winning_mindset",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 4,
    title: "Winning Sales Mindset",
    content: `• Confidence: you offer real value
• Optimism: "No" is part of the process
• Personality: people buy from people
• Endurance: consistency wins the week, month, and season
Bottom line: Train your mind. Secure the win.`,
    tags: ["mindset", "confidence", "attitude"],
    keywords: ["confidence", "optimism", "personality", "endurance", "mindset", "winning"]
  },

  // DOOR APPROACH
  {
    id: "c1_first_impressions",
    type: "slide",
    category: "door_approach",
    chapter: 1,
    slideNumber: 5,
    title: "First Impressions Start Before You Talk",
    content: `Professional appearance checklist:
• Clean, neat shirt (tucked in)
• Khaki shorts or pants (no cargo)
• Clean, presentable tennis shoes
• Name badge and permits visible
• Groomed hair and facial hair
• No visible tattoos/body art; no earrings
• Remove sunglasses before the door opens
Key point: Appearance is the first proof of professionalism and trust.`,
    tags: ["professionalism", "door", "appearance", "first_impression"],
    keywords: ["appearance", "professional", "shirt", "badge", "sunglasses", "first impression", "trust"]
  },
  {
    id: "c1_professional_presence",
    type: "slide",
    category: "door_approach",
    chapter: 1,
    slideNumber: 6,
    title: "Professional Presence at the Door",
    content: `Before the door opens:
• Knock firmly
• Step back (give space)
• Do not look through windows
If you knock again:
• Stay relaxed
• Observe the lawn so you can speak specifically
When the door opens:
• Light smile, eye contact
• Relaxed shoulders
• Calm, confident voice`,
    tags: ["door", "body_language", "presence"],
    keywords: ["knock", "step back", "eye contact", "smile", "door", "presence", "body language"]
  },

  // CHAPTER 1 ROLEPLAYS
  {
    id: "rp1_busy",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 7,
    title: "Roleplay #1 — 'I'm actually really busy right now.'",
    content: `Placement: Chapter 1 → Opening → First 10 Seconds
Pass criteria:
• Acknowledge time pressure
• Set a ≤60-second container
• Ask a qualifying control question
Fail conditions: Pitches immediately or disengages`,
    tags: ["roleplay", "opening", "control", "busy", "brush_off"],
    keywords: ["busy", "time", "quick", "60 seconds", "opening", "brush off"],
    roleplayId: "RP1",
    phase: 1,
    winningResponse: "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?",
    losingResponse: "This won't take long… we do fertilization and weed control."
  },
  {
    id: "rp2_not_interested",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 8,
    title: "Roleplay #2 — 'Not interested.'",
    content: `Placement: Chapter 1 → Opening → Handling Brush-Offs
Pass criteria:
• Acknowledge
• Reframe to a specific issue
• Redirect with a control question
Fail conditions: Argues or accepts rejection immediately`,
    tags: ["roleplay", "opening", "brush_off", "not_interested"],
    keywords: ["not interested", "rejection", "brush off", "reframe", "redirect"],
    roleplayId: "RP2",
    phase: 1,
    winningResponse: "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?",
    losingResponse: "Okay, no worries."
  },
  {
    id: "rp3_no_soliciting",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 9,
    title: "Roleplay #3 — 'No soliciting.'",
    content: `Placement: Chapter 1 → Opening → Compliance & Authority
Pass criteria:
• Acknowledge the rule
• Clarify intent
• Request micro-permission
Fail conditions: Debates policy`,
    tags: ["roleplay", "opening", "compliance", "micro_permission", "no_soliciting"],
    keywords: ["no soliciting", "sign", "permission", "selling", "compliance"],
    roleplayId: "RP3",
    phase: 1,
    winningResponse: "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?",
    losingResponse: "I'm not selling anything… (keeps talking)"
  },

  // BUYER MOTIVATION
  {
    id: "c1_why_buy",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 10,
    title: "Why Homeowners Buy Lawn Care",
    content: `Homeowners buy outcomes, not chemicals:
• Curb appeal & pride
• Higher property value
• Safe space for kids & pets
• Neighborhood confidence
• Less stress (time back)`,
    tags: ["value", "buyer_motivation", "outcomes"],
    keywords: ["curb appeal", "property value", "kids", "pets", "pride", "stress", "why buy", "motivation"]
  },
  {
    id: "c1_emotion_logic",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 11,
    title: "Emotion & Logic in Every Sale",
    content: `People decide emotionally, then justify with facts.
Emotion drives action: embarrassment, pride, frustration, relief
Logic justifies decision: program structure, visit count, price vs value
Coaching: lead with outcomes; support with facts.`,
    tags: ["sales_psychology", "messaging", "emotion"],
    keywords: ["emotion", "logic", "feelings", "pride", "embarrassment", "outcomes", "psychology"]
  },
  {
    id: "c1_needs",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 12,
    title: "Realized vs Unrealized Needs",
    content: `Unrealized need: "They don't see the problem." → educate and reveal.
Realized need: "They know they need help." → solution + trust.
Needs:
• Physical: weeds, thin grass, discoloration
• Emotional: pride, reduced stress, confidence`,
    tags: ["discovery", "needs", "education"],
    keywords: ["needs", "unrealized", "realized", "educate", "reveal", "problem", "solution"]
  },
  {
    id: "c1_trust",
    type: "slide",
    category: "mindset",
    chapter: 1,
    slideNumber: 13,
    title: "Trust Comes Before Any Sale",
    content: `Without trust, nothing else matters:
1) Professional appearance
2) Calm, confident tone
3) Clear, honest explanations
4) No overpromising`,
    tags: ["trust", "sales_standards"],
    keywords: ["trust", "professional", "honest", "confidence", "overpromising"]
  },

  // MORE CHAPTER 1 ROLEPLAYS
  {
    id: "rp4_diy",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 14,
    title: "Roleplay #4 — 'I do my own lawn.'",
    content: `Placement: Chapter 1 → Turn & Burn → DIY Pushback
Pass criteria: validate + differentiate + regain lead
Fail: tries to convert DIY broadly`,
    tags: ["roleplay", "turn_and_burn", "diy"],
    keywords: ["diy", "do it myself", "my own lawn", "self", "differentiate"],
    roleplayId: "RP4",
    phase: 2,
    winningResponse: "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?",
    losingResponse: "We help a lot of DIY customers…"
  },
  {
    id: "rp5_existing_company",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 15,
    title: "Roleplay #5 — 'We already have a lawn company.'",
    content: `Placement: Chapter 1 → Turn & Burn → Existing Provider
Pass criteria: acknowledge + remove replacement fear + isolate gap
Fail: attacks competitor`,
    tags: ["roleplay", "turn_and_burn", "existing_provider", "competitor"],
    keywords: ["already have", "lawn company", "competitor", "replace", "existing"],
    roleplayId: "RP5",
    phase: 2,
    winningResponse: "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?",
    losingResponse: "We're better than most companies…"
  },
  {
    id: "rp6_why_here",
    type: "roleplay",
    category: "roleplays",
    chapter: 1,
    slideNumber: 16,
    title: "Roleplay #6 — 'Why are you here?'",
    content: `Placement: Chapter 1 → Turn & Burn → Purpose Statement
Pass criteria: purpose clearly + direct next action
Fail: rambles / over-explains`,
    tags: ["roleplay", "turn_and_burn", "purpose"],
    keywords: ["why are you here", "purpose", "what do you want", "reason"],
    roleplayId: "RP6",
    phase: 2,
    winningResponse: "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting.",
    losingResponse: "I'm with Gecko, and what we do is…"
  },

  // LAWN CARE FUNDAMENTALS
  {
    id: "c1_turf",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 17,
    title: "Know Your Turf",
    content: `Common grasses:
• Bermuda
• St. Augustine
• Zoysia
Rep must: identify likely type; explain different needs (watering/mowing/sun); reinforce professional products appropriate for local turf.`,
    tags: ["lawn_fundamentals", "grass_types", "turf"],
    keywords: ["bermuda", "st augustine", "zoysia", "grass", "turf", "watering", "mowing", "sun"]
  },
  {
    id: "c1_weeds_101",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 18,
    title: "Weeds 101",
    content: `Grassy weeds: nutsedge (yellow/purple), poa annua
Broadleaf weeds: dandelion, clover, henbit
Key: category influences product choice and timing.`,
    tags: ["weeds", "lawn_fundamentals"],
    keywords: ["weeds", "nutsedge", "poa annua", "dandelion", "clover", "henbit", "broadleaf", "grassy"]
  },
  {
    id: "c1_seed_bank",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 19,
    title: "Why Weeds Keep Coming Back (Seed Bank)",
    content: `Annual weeds: one season, drop seeds
Perennial weeds: return from roots
Seed bank: dormant seeds in soil can germinate later
Key message: control and reduction over time, not instant perfection.`,
    tags: ["weeds", "seed_bank", "expectations"],
    keywords: ["seed bank", "weeds", "coming back", "annual", "perennial", "control", "reduction"]
  },
  {
    id: "c1_pre_post_emergent",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 20,
    title: "Pre-Emergent vs Post-Emergent",
    content: `Pre-emergent (prevention): barrier prevents sprouting
Post-emergent (treatment): targets existing weeds; results often ~10–14 days (varies)`,
    tags: ["weeds", "pre_emergent", "post_emergent", "treatment"],
    keywords: ["pre-emergent", "post-emergent", "prevention", "treatment", "barrier", "sprouting", "existing weeds"]
  },
  {
    id: "c1_fertilizer",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 21,
    title: "Fertilizer Basics: NPK",
    content: `N: color/top growth
P: roots/establishment
K: health/stress resistance
Positioning: fertilizer supports growth; complements weed/soil strategy.`,
    tags: ["fertilizer", "NPK", "lawn_fundamentals"],
    keywords: ["fertilizer", "npk", "nitrogen", "phosphorus", "potassium", "growth", "roots"]
  },
  {
    id: "c1_aeration",
    type: "slide",
    category: "lawn_care",
    chapter: 1,
    slideNumber: 22,
    title: "Liquid Aeration Benefits (North Texas)",
    content: `Benefits:
• Reduces compaction; improves root depth
• Improves water absorption/retention; reduces runoff
• Improves fertilizer uptake; boosts drought/heat resilience
Advantages: full coverage, no plugs/mess, no sprinkler/cable damage
Best timing: early spring or fall.`,
    tags: ["aeration", "soil", "lawn_fundamentals"],
    keywords: ["aeration", "liquid aeration", "compaction", "roots", "water", "spring", "fall"]
  },

  // GECKO GREEN PROGRAM
  {
    id: "c1_10_visit",
    type: "slide",
    category: "program",
    chapter: 1,
    slideNumber: 23,
    title: "Our 10-Visit Lawn Program",
    content: `Overview:
• 10 seasonally spaced visits
• May include fertilizer, weed control, insect control, disease support (as needed)
• Includes 1 spring aeration
• Includes free service calls
Key: consistency + timing = results.`,
    tags: ["program", "10_visit", "service_calls"],
    keywords: ["10 visit", "program", "visits", "fertilizer", "weed control", "aeration", "service calls"]
  },
  {
    id: "c1_seasonal_schedule",
    type: "slide",
    category: "program",
    chapter: 1,
    slideNumber: 24,
    title: "Seasonal Application Schedule (High-Level)",
    content: `Early Season (Jan–Feb): pre+post
Spring (Mar–Apr): fertilizer+pre+liquid aeration
Early Summer (May–Jun): fertilizer+spot treat
Summer (Jul–Aug): fertilizer+insect
Fall (Sep–Oct): pre+liquid aeration
Winter (Nov–Dec): soil conditioner`,
    tags: ["program", "seasonality", "schedule"],
    keywords: ["schedule", "seasonal", "spring", "summer", "fall", "winter", "applications", "timing"]
  },
  {
    id: "c1_partnership",
    type: "slide",
    category: "program",
    chapter: 1,
    slideNumber: 25,
    title: "Partnership: We Can't Do It Alone",
    content: `Gecko Green: products, treatments, timing, aeration, program structure
Homeowner: watering, mowing, traffic, shade limits
Key: both sides executing consistently produces the best results.`,
    tags: ["partnership", "expectations", "homeowner"],
    keywords: ["partnership", "homeowner", "watering", "mowing", "responsibility", "together"]
  },
  {
    id: "c1_differentiators",
    type: "slide",
    category: "program",
    chapter: 1,
    slideNumber: 26,
    title: "What Makes Gecko Green Different",
    content: `Differentiators:
• Local expertise
• Customized program
• Licensed technicians
• Strong reviews
• Free service calls
• Reliable communication`,
    tags: ["differentiators", "value", "gecko_green"],
    keywords: ["different", "unique", "local", "customized", "licensed", "reviews", "service calls", "communication"]
  },
  {
    id: "c1_elevator_pitch",
    type: "script",
    category: "program",
    chapter: 1,
    slideNumber: 27,
    title: "Your 30-Second Gecko Green Story",
    content: `"We specialize in North Texas lawns. We run a seasonally spaced 10-visit program and include free service calls. Together we get you a lawn you're proud of."`,
    tags: ["pitch", "elevator_pitch", "script"],
    keywords: ["30 seconds", "pitch", "story", "north texas", "10 visit", "service calls", "proud"]
  },

  // PREPAY
  {
    id: "c1_prepay_triple_win",
    type: "slide",
    category: "prepay",
    chapter: 1,
    slideNumber: 28,
    title: "Prepay Matters — The Triple Win",
    content: `Win #1 Customer: saves + one payment simplicity
Win #2 You: higher commissions + fewer cancellations
Win #3 Gecko Green: stronger commitment + better retention/planning`,
    tags: ["prepay", "value", "close", "commission"],
    keywords: ["prepay", "triple win", "savings", "commission", "commitment", "retention"]
  },
  {
    id: "c1_prepay_commission",
    type: "slide",
    category: "prepay",
    chapter: 1,
    slideNumber: 29,
    title: "How Prepay Boosts Your Commission",
    content: `Commission structure example:
• $0–$2,999: base only
• $3,000–$3,999: 3%
• $4,000–$4,999: 4%
• +1% per additional $1,000
• $9,000+: 9% (no cap)
Prepay bonus examples: 25% rate (+$7,500); 40% rate (+$8,800)`,
    tags: ["commission", "prepay", "money"],
    keywords: ["commission", "prepay", "bonus", "money", "earnings", "percentage", "rate"]
  },
  {
    id: "c1_prepay_mindset",
    type: "slide",
    category: "prepay",
    chapter: 1,
    slideNumber: 30,
    title: "The Non-Negotiable Prepay Mindset",
    content: `Core rule: Prepay first. Every time. No exceptions.
Backup: Autopay.`,
    tags: ["prepay", "mindset", "rule"],
    keywords: ["prepay", "first", "always", "autopay", "backup", "non-negotiable"]
  },

  // ============ CHAPTER 2: FIELD EXECUTION ============
  
  {
    id: "c2_overview",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 1,
    title: "Certification 1 – Chapter 2: Field Sales Process",
    content: `Purpose:
• Turn Chapter 1 knowledge into repeatable field execution
• Run the 5-phase sales process
• Handle objections without arguing
• Close confidently and present payment correctly (prepay first)`,
    tags: ["overview", "chapter2", "field", "process"],
    keywords: ["field", "execution", "process", "objections", "closing", "payment"]
  },
  {
    id: "c2_5_phases",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 4,
    title: "The 5 Phases of the Gecko Green Sale",
    content: `1) Establish rapport at the door
2) Turn & Burn (door → lawn)
3) On-lawn presentation (advisor mode)
4) Objection handling (framework)
5) Closing, payment & wrap-up
Self-check: "Which phase am I in—and what is my job right now?"`,
    tags: ["sales_process", "phases", "framework"],
    keywords: ["5 phases", "rapport", "turn and burn", "presentation", "objection", "closing", "process"]
  },

  // PHASE 1: RAPPORT
  {
    id: "c2_phase1_rapport",
    type: "slide",
    category: "door_approach",
    chapter: 2,
    slideNumber: 5,
    title: "Phase 1 — Establish Rapport at the Door",
    content: `Goals: look professional and safe; lower guard; earn right to look at the lawn
Reminders: step back; calm voice; eye contact; do not lead with price`,
    tags: ["door", "rapport", "phase1"],
    keywords: ["rapport", "door", "professional", "safe", "calm", "eye contact"],
    phase: 1
  },
  {
    id: "c2_door_script",
    type: "script",
    category: "door_approach",
    chapter: 2,
    slideNumber: 6,
    title: "Door Intro — Example Script",
    content: `"Hey, I'm ___ with Gecko Green. We take care of a lot of lawns in this area, and I noticed you've got some weeds and thin spots out front. I'm not here to twist your arm—I just wanted to show you what we're doing for your neighbors and see if it might make sense for you too."`,
    tags: ["script", "opening", "door"],
    keywords: ["intro", "script", "door", "opening", "neighbors", "weeds", "thin spots"],
    phase: 1
  },
  {
    id: "c2_door_etiquette",
    type: "slide",
    category: "door_approach",
    chapter: 2,
    slideNumber: 7,
    title: "Door Etiquette & Common Mistakes",
    content: `DO: step back; hands visible; look at homeowner
AVOID: leaning; window staring; fidgeting; talking too fast
Key: first 5 seconds matter.`,
    tags: ["door", "execution", "mistakes"],
    keywords: ["etiquette", "mistakes", "step back", "hands", "5 seconds", "first impression"],
    phase: 1
  },

  // PHASE 2: TURN & BURN
  {
    id: "c2_phase2_turn_burn",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 9,
    title: "Phase 2 — Turn & Burn (Door → Lawn)",
    content: `Definition: move the conversation to the lawn to make it visual and reduce debate.
Goals: stop debating; get them looking; discuss visible issues.`,
    tags: ["turn_and_burn", "field", "phase2"],
    keywords: ["turn and burn", "door to lawn", "visual", "move", "walk"],
    phase: 2
  },
  {
    id: "c2_turn_burn_lines",
    type: "script",
    category: "process",
    chapter: 2,
    slideNumber: 10,
    title: "Natural Transitions (Turn & Burn Lines)",
    content: `• "Step out here with me…"
• "Let me walk you through…"
• "Let me point out…"
Walk next to them; gesture to the lawn; keep it natural.`,
    tags: ["turn_and_burn", "scripts", "transitions"],
    keywords: ["step out", "walk", "point out", "transition", "lines", "scripts"],
    phase: 2
  },

  // PHASE 3: ON-LAWN PRESENTATION
  {
    id: "c2_phase3_presentation",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 12,
    title: "Phase 3 — On-Lawn Presentation",
    content: `Goals: show 1–2 issues; explain why; connect to program; set expectations
Identity: lawn advisor, not just salesperson.`,
    tags: ["lawn_walk", "presentation", "phase3"],
    keywords: ["on lawn", "presentation", "advisor", "issues", "explain", "program"],
    phase: 3
  },
  {
    id: "c2_4step_diagnosis",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 13,
    title: "The 4-Step Diagnosis (On-Lawn Structure)",
    content: `1) Observe & confirm ("Do you see…?")
2) Explain the why (brief)
3) Connect to program
4) Set expectations + partnership`,
    tags: ["lawn_walk", "framework", "diagnosis"],
    keywords: ["4 step", "diagnosis", "observe", "confirm", "explain", "program", "expectations"],
    phase: 3
  },
  {
    id: "c2_control_vs_perfection",
    type: "slide",
    category: "lawn_care",
    chapter: 2,
    slideNumber: 14,
    title: "Control vs Perfection",
    content: `Set expectation: the goal is control and reduction over time.
Positioning: control weeds + thicken grass so weeds have less room to return.`,
    tags: ["expectations", "weeds", "control"],
    keywords: ["control", "perfection", "expectations", "reduction", "thicken", "weeds"],
    phase: 3
  },

  // CHAPTER 2 ROLEPLAYS
  {
    id: "rp7_lawn_fine",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 17,
    title: "Roleplay #7 — 'My lawn looks fine.'",
    content: `Pass: validate + isolate problem + point visually
Fail: agrees or gives up`,
    tags: ["roleplay", "lawn_walk", "objection"],
    keywords: ["lawn looks fine", "fine", "okay", "good", "validate", "isolate"],
    roleplayId: "RP7",
    phase: 3,
    winningResponse: "Overall it does — this spot is what I'm flagging, though. See how it's spreading here?",
    losingResponse: "Yeah, it looks okay."
  },
  {
    id: "rp8_weeds_dont_bother",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 18,
    title: "Roleplay #8 — 'Weeds don't bother me.'",
    content: `Pass: reframe consequence + keep discovery
Fail: accepts and moves on`,
    tags: ["roleplay", "lawn_walk", "weeds"],
    keywords: ["weeds dont bother", "dont care", "weeds", "consequence", "spreading"],
    roleplayId: "RP8",
    phase: 3,
    winningResponse: "Totally — most don't until it spreads into the healthy grass. That's what I want to prevent here.",
    losingResponse: "Okay, that's fair."
  },
  {
    id: "rp9_dont_see_issue",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 19,
    title: "Roleplay #9 — 'I don't see the issue.'",
    content: `Pass: show, don't tell
Fail: explains abstractly`,
    tags: ["roleplay", "lawn_walk", "visual"],
    keywords: ["dont see", "show me", "issue", "point", "visual", "show dont tell"],
    roleplayId: "RP9",
    phase: 3,
    winningResponse: "Let me point it out — right along this edge, that discoloration is the early sign.",
    losingResponse: "So basically what happens is…"
  },

  // PHASE 4: OBJECTION HANDLING
  {
    id: "c2_phase4_objections",
    type: "slide",
    category: "objections",
    chapter: 2,
    slideNumber: 20,
    title: "Phase 4 — Objection Handling Mindset",
    content: `Objections are normal. Your job: guide, not argue.
Rule: slow down and run the framework calmly.`,
    tags: ["objections", "mindset", "phase4"],
    keywords: ["objections", "normal", "guide", "argue", "calm", "framework"],
    phase: 4
  },
  {
    id: "c2_bpdc",
    type: "slide",
    category: "objections",
    chapter: 2,
    slideNumber: 21,
    title: "B-P-D-C Framework",
    content: `Buffer (acknowledge) → Probe (ask) → Discover (true concern) → Close (tailored close)
Instruction: discover objections; then close.`,
    tags: ["objections", "framework", "bpdc"],
    keywords: ["bpdc", "buffer", "probe", "discover", "close", "framework", "acknowledge"]
  },
  {
    id: "c2_big_5",
    type: "slide",
    category: "objections",
    chapter: 2,
    slideNumber: 22,
    title: "The Big 5 (Non-Payment Objections)",
    content: `Not interested; DIY; existing company; think about it; talk to spouse
Note: payment comes later—don't lead with it.`,
    tags: ["objections", "big5"],
    keywords: ["big 5", "not interested", "diy", "existing company", "think about it", "spouse", "common objections"]
  },
  {
    id: "c2_bpdc_examples",
    type: "script",
    category: "objections",
    chapter: 2,
    slideNumber: 23,
    title: "Quick Response Examples (B-P-D-C)",
    content: `Use B-P-D-C language:
• Buffer: "Totally understand."
• Probe: "What are you trying to improve?"
• Discover: isolate the real concern
• Close: "Open to a quick look so I can show you what I'm seeing?"`,
    tags: ["objections", "scripts", "bpdc"],
    keywords: ["buffer", "probe", "discover", "close", "understand", "quick look", "examples"]
  },

  // PRICING ROLEPLAYS
  {
    id: "rp10_how_much",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 27,
    title: "Roleplay #10 — 'How much does it cost?'",
    content: `Pass: defer price + anchor value
Fail: gives price immediately`,
    tags: ["roleplay", "pricing", "cost"],
    keywords: ["how much", "cost", "price", "defer", "value", "anchor"],
    roleplayId: "RP10",
    phase: 4,
    winningResponse: "I'll get there — first let me show you what it would cover, because price only makes sense after that.",
    losingResponse: "It's $X per application."
  },
  {
    id: "rp11_expensive",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 29,
    title: "Roleplay #11 — 'That's expensive.'",
    content: `Pass: normalize + re-anchor outcome
Fail: offers discount immediately`,
    tags: ["roleplay", "pricing", "expensive"],
    keywords: ["expensive", "too much", "cost", "price", "normalize", "outcome"],
    roleplayId: "RP11",
    phase: 4,
    winningResponse: "I hear that — most people said that before seeing the results. What mattered was fixing this permanently.",
    losingResponse: "We can lower it…"
  },
  {
    id: "rp12_cheaper_competitor",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 30,
    title: "Roleplay #12 — 'Another company is cheaper.'",
    content: `Pass: reframe to outcome, not price
Fail: attacks competitor or matches price`,
    tags: ["roleplay", "pricing", "competitor"],
    keywords: ["cheaper", "another company", "competitor", "price", "outcome", "reframe"],
    roleplayId: "RP12",
    phase: 4,
    winningResponse: "Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved.",
    losingResponse: "They don't do it right."
  },

  // PHASE 5: CLOSING & PAYMENT
  {
    id: "c2_phase5_closing",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 24,
    title: "Phase 5 — Closing & Wrap-Up",
    content: `Goals: confirm decision; present payment (prepay first); set expectations (first visit + timeline + partnership)`,
    tags: ["close", "payment", "phase5"],
    keywords: ["closing", "payment", "prepay", "decision", "confirm", "wrap up"],
    phase: 5
  },
  {
    id: "c2_buying_signals",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 25,
    title: "Buying Signals",
    content: `Verbal: "How much?", "When can you start?", "Does that include…?"
Non-verbal: nodding, stepping closer, relaxed posture
Rule: when you see green lights, start closing.`,
    tags: ["close", "signals", "buying"],
    keywords: ["buying signals", "how much", "when start", "nodding", "green lights", "closing"]
  },
  {
    id: "c2_closing_flow",
    type: "slide",
    category: "process",
    chapter: 2,
    slideNumber: 26,
    title: "Closing Flow (Value → Price → Close)",
    content: `1) Recap value
2) State price
3) Assume sale / prompt decision`,
    tags: ["close", "sequence", "flow"],
    keywords: ["closing flow", "value", "price", "assume", "decision", "recap"]
  },
  {
    id: "c2_prepay_vs_autopay",
    type: "slide",
    category: "prepay",
    chapter: 2,
    slideNumber: 28,
    title: "Payment Options — Prepay vs Autopay",
    content: `Prepay (default): done for the year; simple; savings incentive (per policy)
Autopay (backup): pay-as-you-go; card on file
Instruction: prepay first; autopay backup.`,
    tags: ["payment", "prepay", "autopay"],
    keywords: ["prepay", "autopay", "payment", "pay as you go", "savings", "card"]
  },
  {
    id: "c2_prepay_pitch",
    type: "script",
    category: "prepay",
    chapter: 2,
    slideNumber: 31,
    title: "Pitching Prepay (Present–Protect–Prompt)",
    content: `Present: neighbors choose prepay for savings + simplicity
Protect: refundable framing (risk removal)
Prompt: choice between prepay and pay-as-you-go`,
    tags: ["prepay", "script", "close"],
    keywords: ["present", "protect", "prompt", "prepay", "refundable", "savings", "simplicity"]
  },
  {
    id: "c2_prepay_hesitation",
    type: "slide",
    category: "prepay",
    chapter: 2,
    slideNumber: 32,
    title: "Why They Hesitate (Prepay)",
    content: `Reasons: money today; want proof first; might move
Mindset: prepay is best for them; refundable removes risk.`,
    tags: ["prepay", "objections", "hesitation"],
    keywords: ["hesitate", "money", "proof", "moving", "risk", "refundable"]
  },
  {
    id: "c2_prepay_concerns",
    type: "slide",
    category: "prepay",
    chapter: 2,
    slideNumber: 33,
    title: "Overcoming Prepay Concerns",
    content: `Money: attempt prepay first; autopay backup if needed
Trust/results: emphasize correction process + refundable framing
Moving: unused portion refundable (per policy)
Return to close.`,
    tags: ["prepay", "handling", "objections"],
    keywords: ["prepay concerns", "money", "trust", "moving", "refundable", "overcome"]
  },

  // CLOSING ROLEPLAYS
  {
    id: "rp13_pay_now",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 34,
    title: "Roleplay #13 — 'Why do I have to pay now?'",
    content: `Pass: normalize + remove risk + maintain close
Fail: defensive or accepts delay`,
    tags: ["roleplay", "payment", "prepay"],
    keywords: ["pay now", "why pay", "today", "normalize", "risk", "guarantee"],
    roleplayId: "RP13",
    phase: 5,
    winningResponse: "Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed.",
    losingResponse: "That's just how we do it."
  },
  {
    id: "rp14_think_about_it",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 35,
    title: "Roleplay #14 — 'I need to think about it.'",
    content: `Pass: isolate concern + advance decision
Fail: accepts delay`,
    tags: ["roleplay", "stalls", "think"],
    keywords: ["think about it", "need to think", "decide", "isolate", "concern"],
    roleplayId: "RP14",
    phase: 5,
    winningResponse: "Totally — what part are you thinking through? Price, timing, or the treatment itself?",
    losingResponse: "Sure, take your time."
  },
  {
    id: "rp15_call_you",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 36,
    title: "Roleplay #15 — 'I'll call you / send me something.'",
    content: `Pass: clarify decision criteria + regain control
Fail: accepts brush-off`,
    tags: ["roleplay", "stalls", "next_step"],
    keywords: ["call you", "send me", "information", "brochure", "decision", "criteria"],
    roleplayId: "RP15",
    phase: 5,
    winningResponse: "Happy to — before I go, what would you be deciding after you look it over?",
    losingResponse: "I'll leave my card."
  },
  {
    id: "rp16_certification",
    type: "roleplay",
    category: "roleplays",
    chapter: 2,
    slideNumber: 37,
    title: "Roleplay #16 — Final Certification",
    content: `Must show control across ≥3 phases, including Phase 5 handling.
Fail: avoids payment objection, concedes decision, loses control.
Pass: acknowledges, guides, stays in discovery, closes confidently.`,
    tags: ["roleplay", "certification", "final"],
    keywords: ["certification", "final", "control", "phases", "close", "confident"],
    roleplayId: "RP16"
  }
];

export function searchKnowledge(query: string, limit: number = 5): KnowledgeEntry[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    
    // Tag matching (highest weight)
    for (const tag of entry.tags) {
      if (queryLower.includes(tag.replace(/_/g, " "))) {
        score += 10;
      }
      for (const word of queryWords) {
        if (tag.includes(word)) {
          score += 5;
        }
      }
    }
    
    // Keyword matching
    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword)) {
        score += 8;
      }
      for (const word of queryWords) {
        if (keyword.includes(word) || word.includes(keyword)) {
          score += 3;
        }
      }
    }
    
    // Title matching
    const titleLower = entry.title.toLowerCase();
    for (const word of queryWords) {
      if (titleLower.includes(word)) {
        score += 4;
      }
    }
    
    // Content matching (lower weight)
    const contentLower = entry.content.toLowerCase();
    for (const word of queryWords) {
      if (contentLower.includes(word)) {
        score += 1;
      }
    }
    
    // Boost roleplays if query mentions specific objections
    if (entry.type === "roleplay" && (
      queryLower.includes("handle") || 
      queryLower.includes("respond") || 
      queryLower.includes("say") ||
      queryLower.includes("objection")
    )) {
      score += 5;
    }
    
    // Boost scripts if query asks for examples
    if (entry.type === "script" && (
      queryLower.includes("script") || 
      queryLower.includes("example") || 
      queryLower.includes("what to say")
    )) {
      score += 5;
    }
    
    return { entry, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry);
}

export function formatKnowledgeForPrompt(entries: KnowledgeEntry[]): string {
  return entries.map((entry, i) => {
    let formatted = `[${i + 1}] ${entry.title} (Chapter ${entry.chapter})\n${entry.content}`;
    
    if (entry.winningResponse) {
      formatted += `\n\nWINNING RESPONSE: "${entry.winningResponse}"`;
    }
    if (entry.losingResponse) {
      formatted += `\nLOSING RESPONSE (avoid): "${entry.losingResponse}"`;
    }
    
    return formatted;
  }).join("\n\n---\n\n");
}
