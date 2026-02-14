const placeholderImg = "";

export interface Resource {
  id: string;
  type: 'call' | 'video';
  title: string;
  description: string;
  learningOutcome: string;
  duration: string;
  author: string;
  thumbnail?: string;
  tags: string[];
}

export const TRAINING_RESOURCES: Resource[] = [
  {
    id: "call-1",
    type: "call",
    title: "Handling the 'We Already Have Optimizely' Objection",
    description: "Listen to how a top performer differentiates Monetate's real-time decisioning engine from Optimizely's testing-first approach with an enterprise VP of Digital.",
    learningOutcome: "Learn to position Monetate's 1:1 personalization capabilities vs. A/B testing tools without bashing the competitor.",
    duration: "5:12",
    author: "Monetate Sales Team",
    tags: ["Objection Handling", "Competitive", "Top 1%"]
  },
  {
    id: "call-2",
    type: "call",
    title: "Closing the 'Need to Think About It' Enterprise Deal",
    description: "A masterclass in isolating the real concern behind a $200K deal stall. Watch how the rep uncovers procurement timeline issues and re-engages the champion.",
    learningOutcome: "Master the art of isolating the real objection in enterprise deals and creating urgency without being pushy.",
    duration: "6:45",
    author: "Monetate Sales Team",
    tags: ["Closing", "Enterprise", "Advanced"]
  },
  {
    id: "call-3",
    type: "call",
    title: "Price Objection: Justifying Enterprise Platform Investment",
    description: "Listen to a masterclass in ROI-based value selling. See how the rep shifts the conversation from annual platform cost to incremental revenue lift.",
    learningOutcome: "Learn to reframe price discussions around measurable business outcomes: conversion lift, AOV increase, and revenue per visitor.",
    duration: "4:30",
    author: "VP of Sales",
    tags: ["Pricing", "Value Selling", "ROI"]
  },
  {
    id: "vid-1",
    type: "video",
    title: "The Psychology of Enterprise Discovery Calls",
    description: "A deep dive into building trust with C-suite buyers, reading buying signals, and structuring discovery calls that uncover real business pain.",
    learningOutcome: "Understand how to establish credibility with VP/C-level buyers and ask questions that reveal budget, timeline, and decision-making authority.",
    duration: "14:30",
    author: "Monetate Sales Team",
    thumbnail: "",
    tags: ["Discovery", "Psychology", "Foundations"]
  },
  {
    id: "vid-2",
    type: "video",
    title: "Mastering the MEDDPICC Framework for Monetate",
    description: "Step-by-step breakdown of the MEDDPICC qualification methodology tailored for enterprise personalization platform deals.",
    learningOutcome: "Learn to qualify deals rigorously using Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion, and Competition.",
    duration: "18:00",
    author: "VP of Sales",
    thumbnail: "",
    tags: ["Framework", "Qualification", "MEDDPICC"]
  }
];

export interface Battlecard {
  id: string;
  phase: 'Discovery' | 'Demo' | 'Objection Handling' | 'Pricing' | 'Closing' | 'Follow-up';
  title: string;
  situation: string;
  script: string;
  keyPoints: string[];
  type: 'script' | 'objection' | 'tip';
  image?: string;
}

export const BATTLECARDS: Battlecard[] = [
  // Discovery Phase
  {
    id: "bc-1",
    phase: "Discovery",
    title: "The Executive Discovery Opener",
    situation: "Opening a cold discovery call with a VP of E-commerce or Digital.",
    script: "Thanks for making the time today. Before I jump in, I'd love to understand—what's your team's biggest priority this quarter when it comes to your on-site customer experience?",
    keyPoints: ["Lead with curiosity, not a pitch", "Reference their role specifically", "Let them set the agenda first"],
    type: "script",
    image: ""
  },
  {
    id: "bc-2",
    phase: "Discovery",
    title: "The Pain Point Deep-Dive",
    situation: "Prospect mentions a surface-level challenge like 'we want to improve conversions.'",
    script: "That's a common goal. Can you help me understand—where specifically are you seeing the biggest drop-off? Is it product discovery, cart abandonment, or something else? And what have you tried so far?",
    keyPoints: ["Go deeper than surface symptoms", "Ask what they've already tried", "Quantify the impact if possible"],
    type: "script",
    image: ""
  },
  {
    id: "bc-3",
    phase: "Discovery",
    title: "The Stakeholder Mapping Move",
    situation: "You need to identify all decision makers and influencers in the buying process.",
    script: "This sounds like it touches a few teams. Typically with projects like this, we see IT, marketing, and sometimes merchandising involved. Who else on your side would need to weigh in before moving forward?",
    keyPoints: ["Map the buying committee early", "Use 'typically we see...' to normalize", "Identify the champion vs. economic buyer"],
    type: "tip",
    image: ""
  },

  // Demo Phase
  {
    id: "bc-4",
    phase: "Demo",
    title: "The Value-Led Demo Opening",
    situation: "Starting a product demo with multiple stakeholders on the call.",
    script: "Before I show you the platform, I want to recap what we heard on our last call. You mentioned three priorities: improving product discovery for new visitors, reducing cart abandonment, and personalizing the homepage. I've built this demo around those exact use cases.",
    keyPoints: ["Always recap their pain first", "Customize the demo to their priorities", "Show you listened"],
    type: "script",
    image: ""
  },
  {
    id: "bc-5",
    phase: "Demo",
    title: "The ROI Calculator Drop",
    situation: "Mid-demo, when showing personalization capabilities.",
    script: "Let me show you what this looks like in dollars. Based on your current traffic of 5M monthly visits and a 2.3% conversion rate, even a modest 8% lift from personalization would generate an additional $2.4M in annual revenue. That's a 6x return on the platform investment.",
    keyPoints: ["Use their actual metrics", "Show conservative estimates", "Frame ROI as a multiple of investment"],
    type: "script",
    image: ""
  },
  {
    id: "bc-6",
    phase: "Demo",
    title: "The Social Proof Bridge",
    situation: "Transitioning between demo sections or when prospect seems skeptical.",
    script: "This is actually the exact same approach that [Similar Brand] used to increase their revenue per session by 15%. They were in a similar situation—large catalog, diverse audience, and a team that needed to move fast without heavy IT involvement.",
    keyPoints: ["Reference similar industry/size customers", "Be specific with metrics", "Connect to their situation"],
    type: "script",
    image: ""
  },

  // Objection Handling Phase
  {
    id: "bc-7",
    phase: "Objection Handling",
    title: "Handling 'We Built Our Own'",
    situation: "Prospect says their engineering team built an in-house personalization solution.",
    script: "That's impressive, and it shows your team values personalization. What we typically see is that in-house solutions work well for basic rules, but struggle with real-time ML decisioning and testing at scale. How much engineering time are you spending on maintenance vs. building new experiences?",
    keyPoints: ["Validate their investment", "Highlight maintenance burden", "Focus on opportunity cost of engineering time"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-8",
    phase: "Objection Handling",
    title: "Handling 'We Already Have a Vendor'",
    situation: "Prospect is currently using a competitor like Dynamic Yield, Optimizely, or Adobe Target.",
    script: "That's great—it means you already believe in the value of personalization. I'm curious, what's working well with your current setup, and where do you wish it could do more?",
    keyPoints: ["Don't bash the competitor", "Find the gaps in their current solution", "Position Monetate's unique strengths"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-9",
    phase: "Objection Handling",
    title: "Handling 'It's Too Expensive'",
    situation: "Prospect pushes back on pricing during or after a proposal.",
    script: "I understand budget is a factor. Let me reframe this—if Monetate generates even a 5% lift in conversion rate on your current revenue, that's $3M in incremental revenue against a $300K investment. The question isn't whether you can afford it—it's whether you can afford not to.",
    keyPoints: ["Reframe cost as investment", "Use their revenue numbers", "Show cost of inaction"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-10",
    phase: "Objection Handling",
    title: "Handling 'Our Team Has No Bandwidth'",
    situation: "Prospect says their team is too stretched to implement a new platform.",
    script: "I hear that a lot, and it's actually one of the top reasons teams choose Monetate. Our platform is designed for marketers to self-serve without engineering. Plus, our implementation team handles the heavy lifting during onboarding. Most clients are live within 4-6 weeks.",
    keyPoints: ["Acknowledge the concern as valid", "Highlight ease of use for non-technical teams", "Emphasize implementation support"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-11",
    phase: "Objection Handling",
    title: "Handling 'We Tried Personalization Before'",
    situation: "Prospect had a bad experience with a previous personalization vendor or initiative.",
    script: "I appreciate you sharing that. Can you help me understand what went wrong? Was it the technology, the strategy, or the support? Because what we've learned is that personalization fails when it's treated as a feature, not a program. That's why Monetate includes dedicated success managers and a proven playbook.",
    keyPoints: ["Show empathy for past failure", "Diagnose what went wrong", "Differentiate your approach and support model"],
    type: "objection",
    image: ""
  },

  // Pricing Phase
  {
    id: "bc-12",
    phase: "Pricing",
    title: "The Value Anchor",
    situation: "Presenting pricing for the first time in a proposal or follow-up call.",
    script: "Before I walk through the investment, let's revisit what we've established: your team is leaving approximately $5M on the table from unpersonalized experiences. Our platform investment is a fraction of that potential lift, and every client in your space has seen positive ROI within the first quarter.",
    keyPoints: ["Always anchor to the value first", "Use their numbers, not yours", "Make the ROI undeniable before showing price"],
    type: "script",
    image: ""
  },
  {
    id: "bc-13",
    phase: "Pricing",
    title: "The Package Breakdown",
    situation: "Prospect asks about different tiers or what's included.",
    script: "We have three tiers: Essentials covers A/B testing and basic segmentation. Growth adds 1:1 personalization and product recommendations. Enterprise includes everything plus advanced analytics, dedicated support, and custom ML models. Most brands at your scale go with Growth or Enterprise.",
    keyPoints: ["Explain tiers clearly", "Guide them toward the right fit", "Use 'most brands at your scale' as social proof"],
    type: "script",
    image: ""
  },
  {
    id: "bc-14",
    phase: "Pricing",
    title: "The Competitive Price Comparison",
    situation: "Prospect compares Monetate's pricing to a cheaper alternative.",
    script: "I get it—on the surface, they look cheaper. But let's compare what you're actually getting. With Monetate, you get real-time decisioning, a proven enterprise track record, and a dedicated success team. Many of our current clients switched from that exact vendor because they hit a ceiling on capabilities.",
    keyPoints: ["Don't compete on price, compete on value", "Highlight what cheaper solutions lack", "Reference switching stories"],
    type: "objection",
    image: ""
  },

  // Closing Phase
  {
    id: "bc-15",
    phase: "Closing",
    title: "The Assumptive Close",
    situation: "After a strong demo where all stakeholders are nodding.",
    script: "Based on everything we've discussed, it sounds like the Growth tier is the right fit for your team. I'd love to get a kickoff scheduled for next month—does that timeline work on your end?",
    keyPoints: ["Assume the next step", "Propose a specific timeline", "Make it easy to say yes"],
    type: "script",
    image: ""
  },
  {
    id: "bc-16",
    phase: "Closing",
    title: "The Multi-Thread Close",
    situation: "Multiple stakeholders need to align before signing.",
    script: "I know there are a few folks who need to weigh in. Would it be helpful if I put together a one-page business case your champion can share with the CFO? And I'm happy to join a call with IT to address any integration questions directly.",
    keyPoints: ["Offer to support the internal sell", "Provide champion with ammo", "Remove friction for each stakeholder"],
    type: "tip",
    image: ""
  },
  {
    id: "bc-17",
    phase: "Closing",
    title: "The Procurement Navigation",
    situation: "Deal is stuck in legal or procurement review.",
    script: "I understand procurement has their process. We've been through this with dozens of enterprise brands and have pre-approved security questionnaires, SOC 2 documentation, and a standard MSA ready to go. Can I send those directly to your procurement contact to speed things up?",
    keyPoints: ["Normalize the process", "Have compliance docs ready", "Offer to engage procurement directly"],
    type: "tip",
    image: ""
  },

  // Follow-up Phase
  {
    id: "bc-18",
    phase: "Follow-up",
    title: "The Post-Demo Summary Email",
    situation: "Sending a follow-up email within 2 hours of a demo.",
    script: "Hi [Name], thanks again for your time today. To recap: we covered how Monetate can address [Pain 1], [Pain 2], and [Pain 3]. I've attached a custom ROI model based on your traffic and conversion data. Next steps: [Action Item]. Looking forward to connecting on [Date].",
    keyPoints: ["Send within 2 hours", "Recap their pain, not your features", "Include a clear next step and date"],
    type: "script",
    image: ""
  },
  {
    id: "bc-19",
    phase: "Follow-up",
    title: "The Champion Enablement Pack",
    situation: "Your internal champion needs to sell Monetate to their leadership team.",
    script: "I put together a one-pager and ROI summary specifically for your leadership review. It covers the business case, expected outcomes, and a comparison to your current approach. Would it be helpful if I also drafted a brief exec summary email you could forward?",
    keyPoints: ["Make your champion look good", "Provide ready-to-forward materials", "Offer to draft internal communications"],
    type: "script",
    image: ""
  },
  {
    id: "bc-20",
    phase: "Follow-up",
    title: "The Executive Sponsor Outreach",
    situation: "You need to engage the economic buyer or C-suite sponsor directly.",
    script: "Hi [Exec Name], I've been working with [Champion Name] on your team on how Monetate can drive measurable revenue lift for [Company]. I'd love 15 minutes to share what we've uncovered and get your perspective on priorities for the coming quarter.",
    keyPoints: ["Reference the champion by name", "Lead with business impact, not product", "Ask for a specific, short time commitment"],
    type: "script",
    image: ""
  }
];

export interface Slide {
  type: 'content' | 'quiz' | 'roleplay';
  title: string;
  content?: string;
  bullets?: string[];
  image?: string;
  roleplayId?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  pdfUrl: string;
  coverImage: string;
  agenda: string[];
  slides: Slide[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "chap-1",
    title: "Sales Foundations",
    subtitle: "Master the Enterprise Sales Cycle",
    description: "Learn the fundamentals of enterprise B2B SaaS selling. This module covers discovery call frameworks, the MEDDPICC qualification methodology, stakeholder mapping, and building trust with C-suite buyers.",
    duration: "45 min",
    status: "in-progress",
    pdfUrl: "",
    coverImage: "",
    agenda: [
      "The Enterprise Discovery Call Framework",
      "MEDDPICC Qualification Methodology",
      "Stakeholder Mapping & Multi-Threading",
      "Building Trust with C-Suite Buyers"
    ],
    slides: [
      {
        type: 'content',
        title: "The Enterprise Discovery Call",
        content: "Your first call sets the tone for the entire deal. Learn how to run a discovery call that uncovers real business pain and positions Monetate as the solution.",
        bullets: [
          "Research the prospect's digital experience before the call—visit their site, note gaps.",
          "Lead with open-ended questions about their priorities, not your product.",
          "Map out the buying committee: who influences, who decides, who signs."
        ]
      },
      {
        type: 'content',
        title: "The MEDDPICC Framework",
        content: "The qualification methodology that separates pipeline dreams from real deals. Every enterprise opportunity must be rigorously qualified.",
        bullets: [
          "Metrics: What measurable outcomes does the buyer care about?",
          "Economic Buyer: Who controls the budget and final sign-off?",
          "Decision Process: What steps must happen before they can buy?"
        ]
      },
      {
        type: 'roleplay',
        title: "Practice: The Discovery Opener",
        content: "Put your discovery skills to the test. Can you engage a skeptical VP of E-commerce without jumping to a pitch?",
        roleplayId: "rp-1"
      },
      {
        type: 'quiz',
        title: "Quick Check: Discovery Fundamentals",
        quiz: {
          question: "What is the primary goal of an enterprise discovery call?",
          options: [
            "To demo the product as quickly as possible.",
            "To uncover the prospect's business pain and qualify the opportunity.",
            "To send a pricing proposal.",
            "To schedule a follow-up meeting."
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'content',
        title: "Stakeholder Mapping",
        content: "Enterprise deals are won or lost based on your ability to identify and engage all decision makers. Never rely on a single thread.",
        bullets: [
          "Identify the Champion: Who will sell internally on your behalf?",
          "Find the Economic Buyer: Who controls the budget?",
          "Map Technical Influencers: IT, security, and data teams that can block or accelerate."
        ]
      },
      {
        type: 'quiz',
        title: "Quick Check: Stakeholder Mapping",
        quiz: {
          question: "What should you do when your main contact says 'I can make this decision myself'?",
          options: [
            "Take them at their word and send a contract.",
            "Ignore them and go over their head.",
            "Trust but verify: ask about procurement, legal, and budget approval processes.",
            "Assume the deal is closed."
          ],
          correctAnswer: 2
        }
      },
      {
        type: 'roleplay',
        title: "Practice: Stakeholder Discovery",
        content: "The buyer claims they're the sole decision maker. Uncover the real buying committee without being pushy.",
        roleplayId: "rp-6"
      }
    ]
  },
  {
    id: "chap-2",
    title: "Deal Execution",
    subtitle: "Closing Enterprise Deals",
    description: "Move from 'Maybe' to 'Yes'. This advanced module covers objection handling frameworks, procurement navigation, value-based pricing strategies, and multi-stakeholder closing techniques.",
    duration: "60 min",
    status: "locked",
    pdfUrl: "",
    coverImage: "",
    agenda: [
      "Objection Handling Frameworks",
      "Value-Based Pricing & ROI Selling",
      "Procurement & Legal Navigation",
      "Multi-Stakeholder Closing Techniques"
    ],
    slides: [
      {
        type: 'content',
        title: "The Objection Handling Framework",
        content: "Every objection is a buying signal in disguise. Learn to acknowledge, isolate, and resolve concerns systematically.",
        bullets: [
          "Acknowledge: Validate the concern before responding.",
          "Isolate: Make sure it's the real objection, not a smokescreen.",
          "Resolve & Advance: Address it and move toward the next step."
        ]
      },
      {
        type: 'content',
        title: "Value-Based Pricing",
        content: "Never let price be the conversation. Always anchor to the business value Monetate delivers.",
        bullets: [
          "Calculate ROI using the prospect's own traffic and conversion data.",
          "Frame the investment as a fraction of the revenue lift they'll achieve.",
          "Use customer case studies to prove measurable outcomes."
        ]
      },
      {
        type: 'roleplay',
        title: "Practice: Handling Price Objections",
        content: "The VP says 'It's too expensive.' Is it really about price? Find out.",
        roleplayId: "rp-11"
      },
      {
        type: 'quiz',
        title: "Quick Check: Objection Handling",
        quiz: {
          question: "What should you do immediately after a buyer raises an objection?",
          options: [
            "Counter with why they're wrong.",
            "Immediately offer a discount.",
            "Acknowledge the concern and isolate it as the real blocker.",
            "End the call and follow up later."
          ],
          correctAnswer: 2
        }
      }
    ]
  }
];

export interface RoleplayScenario {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  traits: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stats: {
    resistance: number;
    objections: number;
    buy_signal: number;
  };
  chapterId: string;
}

export const ROLEPLAYS: RoleplayScenario[] = [
  // Sales Foundations (chap-1) - Discovery and Demo
  {
    id: "rp-1",
    name: "We're not looking at any new vendors right now.",
    role: "The Gatekeeper VP",
    description: "Chapter 1 → Discovery → Cold Opener. Acknowledge timing + establish value hypothesis + ask a discovery question.",
    avatar: "",
    traits: ["Time Pressure", "Authority", "Skepticism"],
    difficulty: "Beginner",
    stats: { resistance: 60, objections: 20, buy_signal: 30 },
    chapterId: "chap-1"
  },
  {
    id: "rp-2",
    name: "Just send me an email.",
    role: "The Dismissive Director",
    description: "Chapter 1 → Discovery → Brush-Off. Acknowledge + create a reason to stay on the call + redirect to value.",
    avatar: "",
    traits: ["Deflection", "Low Interest", "Time-Constrained"],
    difficulty: "Intermediate",
    stats: { resistance: 80, objections: 40, buy_signal: 10 },
    chapterId: "chap-1"
  },
  {
    id: "rp-3",
    name: "We're focused on other priorities this quarter.",
    role: "The Busy Executive",
    description: "Chapter 1 → Discovery → Timing Objection. Connect to their priorities + show relevance + ask for a brief meeting.",
    avatar: "",
    traits: ["Priority Focused", "Strategic", "Time-Conscious"],
    difficulty: "Intermediate",
    stats: { resistance: 55, objections: 45, buy_signal: 45 },
    chapterId: "chap-1"
  },
  {
    id: "rp-4",
    name: "We built our own personalization engine.",
    role: "The Technical Buyer",
    description: "Chapter 1 → Discovery → In-House Solution. Validate their investment + highlight maintenance costs + differentiate.",
    avatar: "",
    traits: ["Technical Pride", "Engineering-Focused", "Cost-Sensitive"],
    difficulty: "Intermediate",
    stats: { resistance: 70, objections: 60, buy_signal: 40 },
    chapterId: "chap-1"
  },
  {
    id: "rp-5",
    name: "We already use Dynamic Yield / Optimizely.",
    role: "The Incumbent Loyalist",
    description: "Chapter 1 → Discovery → Competitive Displacement. Acknowledge + find gaps + position differentiation.",
    avatar: "",
    traits: ["Vendor Loyalty", "Risk Aversion", "Status Quo Bias"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 50, buy_signal: 20 },
    chapterId: "chap-1"
  },
  {
    id: "rp-6",
    name: "What exactly does Monetate do?",
    role: "The Uninformed Stakeholder",
    description: "Chapter 1 → Discovery → Value Articulation. Deliver a clear, concise value prop + tailor to their role + ask a qualifying question.",
    avatar: "",
    traits: ["Curiosity", "Low Awareness", "Open-Minded"],
    difficulty: "Beginner",
    stats: { resistance: 40, objections: 30, buy_signal: 50 },
    chapterId: "chap-1"
  },
  // Deal Execution (chap-2) - Demo, Pricing, Closing, Certification
  {
    id: "rp-7",
    name: "Can you show me how this works for our specific use case?",
    role: "The Demo Challenger",
    description: "Chapter 2 → Demo → Custom Use Case. Tailor the demo to their scenario + use their data + show measurable impact.",
    avatar: "",
    traits: ["Detail-Oriented", "Practical", "Results-Driven"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 70, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-8",
    name: "We tried personalization before and it didn't work.",
    role: "The Burned Buyer",
    description: "Chapter 2 → Demo → Past Failure. Show empathy + diagnose what went wrong + differentiate your approach.",
    avatar: "",
    traits: ["Skepticism", "Past Pain", "Risk Aversion"],
    difficulty: "Advanced",
    stats: { resistance: 75, objections: 80, buy_signal: 20 },
    chapterId: "chap-2"
  },
  {
    id: "rp-9",
    name: "Our marketing team doesn't have the resources to manage this.",
    role: "The Resource-Constrained Buyer",
    description: "Chapter 2 → Demo → Bandwidth Objection. Highlight ease of use + implementation support + show self-serve capabilities.",
    avatar: "",
    traits: ["Resource Concerns", "Pragmatic", "Team-Oriented"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 60, buy_signal: 40 },
    chapterId: "chap-2"
  },
  {
    id: "rp-10",
    name: "How much does this cost?",
    role: "The Price-First Buyer",
    description: "Chapter 2 → Pricing → Before Quoting. Defer price + anchor to value and ROI first.",
    avatar: "",
    traits: ["Budget-Conscious", "Direct", "Value-Seeking"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 90, buy_signal: 50 },
    chapterId: "chap-2"
  },
  {
    id: "rp-11",
    name: "That's way over our budget.",
    role: "The Budget Gatekeeper",
    description: "Chapter 2 → Pricing → Price Objection. Normalize the investment + reframe as ROI + show cost of inaction.",
    avatar: "",
    traits: ["Budget Authority", "ROI-Focused", "Negotiation"],
    difficulty: "Advanced",
    stats: { resistance: 80, objections: 90, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-12",
    name: "A competitor quoted us half your price.",
    role: "The Comparison Shopper",
    description: "Chapter 2 → Pricing → Competitive Comparison. Differentiate on value, not price + highlight what's missing in cheaper options.",
    avatar: "",
    traits: ["Price Sensitivity", "Analytical", "Value Comparison"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 85, buy_signal: 25 },
    chapterId: "chap-2"
  },
  {
    id: "rp-13",
    name: "I need to run this by our procurement team.",
    role: "The Procurement Handoff",
    description: "Chapter 2 → Closing → Procurement. Normalize the process + offer compliance docs + maintain momentum.",
    avatar: "",
    traits: ["Process-Oriented", "Compliance", "Risk Management"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 70, buy_signal: 60 },
    chapterId: "chap-2"
  },
  {
    id: "rp-14",
    name: "I need to think about it and get back to you.",
    role: "The Stalling Champion",
    description: "Chapter 2 → Closing → Stall Handling. Isolate the real concern + offer to help address it + set a specific follow-up.",
    avatar: "",
    traits: ["Indecision", "Internal Politics", "Risk Aversion"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 50, buy_signal: 50 },
    chapterId: "chap-2"
  },
  {
    id: "rp-15",
    name: "We'll revisit this next quarter.",
    role: "The Timeline Pusher",
    description: "Chapter 2 → Closing → Timeline Objection. Create urgency + show cost of delay + propose a low-commitment next step.",
    avatar: "",
    traits: ["Procrastination", "Risk Aversion", "Strategic Delay"],
    difficulty: "Advanced",
    stats: { resistance: 70, objections: 40, buy_signal: 40 },
    chapterId: "chap-2"
  },
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Enterprise Deal Simulation",
    description: "Post-Training → Final Certification. Rep must demonstrate mastery across discovery, demo, objection handling, and closing in a full enterprise deal simulation.",
    avatar: "",
    traits: ["Mastery", "Endurance", "Consistency"],
    difficulty: "Advanced",
    stats: { resistance: 90, objections: 90, buy_signal: 50 },
    chapterId: "chap-2"
  }
];

export interface RoleplayResult {
  id: string;
  scenarioId: string;
  score: number;
  date: string;
  feedback: string;
  transcript: Message[];
  metrics: {
    resistanceHandled: number;
    objectionsOvercome: number;
    closingTechnique: number;
    tonality: number;
    pacing: number;
    listening: number;
  };
  keyMoments: {
    timestamp: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

export const PAST_RESULTS: RoleplayResult[] = [
  {
    id: "res-1",
    scenarioId: "rp-1",
    score: 85,
    date: "2025-01-10T14:30:00",
    feedback: "Great job opening with a value hypothesis instead of a product pitch. You maintained a consultative tone, but could have been more assertive when asking the qualifying question.",
    transcript: [
        { id: '1', sender: 'ai', text: "We're not looking at any new vendors right now.", timestamp: new Date() },
        { id: '2', sender: 'user', text: "I completely understand. I'm not here to pitch—just wanted to share a quick insight about how brands like yours are solving [specific challenge].", timestamp: new Date() }
    ],
    metrics: {
      resistanceHandled: 90,
      objectionsOvercome: 80,
      closingTechnique: 85,
      tonality: 92,
      pacing: 88,
      listening: 75
    },
    keyMoments: [
      { timestamp: "0:05", description: "Successfully acknowledged the timing objection without being pushy.", impact: 'positive' },
      { timestamp: "0:15", description: "Slight hesitation when asked about specific ROI numbers.", impact: 'negative' },
      { timestamp: "0:45", description: "Strong discovery question to uncover business pain.", impact: 'positive' }
    ]
  },
  {
    id: "res-2",
    scenarioId: "rp-6",
    score: 72,
    date: "2025-01-12T09:15:00",
    feedback: "Good recovery when the stakeholder challenged your value proposition. Work on delivering a crisper elevator pitch without over-explaining features.",
    transcript: [],
    metrics: {
      resistanceHandled: 70,
      objectionsOvercome: 75,
      closingTechnique: 70,
      tonality: 65,
      pacing: 80,
      listening: 60
    },
    keyMoments: [
       { timestamp: "0:10", description: "Missed opportunity to tailor the value prop to the stakeholder's role.", impact: 'negative' },
       { timestamp: "0:30", description: "Recovered well by connecting Monetate's capabilities to their specific business challenge.", impact: 'positive' }
    ]
  }
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  roleplaysCompleted: number;
  trend: 'up' | 'down' | 'same';
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Sarah Jenkins",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    score: 98,
    roleplaysCompleted: 42,
    trend: 'up'
  },
  {
    rank: 2,
    name: "Mike Ross",
    avatar: "https://i.pravatar.cc/150?u=mike",
    score: 95,
    roleplaysCompleted: 38,
    trend: 'same'
  },
  {
    rank: 3,
    name: "Jessica Pearson",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    score: 92,
    roleplaysCompleted: 35,
    trend: 'up'
  },
  {
    rank: 4,
    name: "Paul Wilkerson",
    avatar: "https://i.pravatar.cc/150?u=paul",
    score: 85,
    roleplaysCompleted: 12,
    trend: 'up'
  },
  {
    rank: 5,
    name: "Louis Litt",
    avatar: "https://i.pravatar.cc/150?u=louis",
    score: 82,
    roleplaysCompleted: 28,
    trend: 'down'
  }
];

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SalesRep {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'onboarding';
  progress: number;
  roleplaysCompleted: number;
  lastActive: string;
  avatarInitials: string;
  score: number;
}

export const SALES_REPS: SalesRep[] = [
  {
    id: "rep-1",
    name: "Paul Wilkerson",
    email: "paul.wilkerson@monetate.com",
    status: "onboarding",
    progress: 17,
    roleplaysCompleted: 3,
    lastActive: "Just now",
    avatarInitials: "PW",
    score: 92
  },
  {
    id: "rep-2",
    name: "Michael Chen",
    email: "michael.chen@monetate.com",
    status: "active",
    progress: 85,
    roleplaysCompleted: 12,
    lastActive: "2 hours ago",
    avatarInitials: "MC",
    score: 88
  },
  {
    id: "rep-3",
    name: "Sarah Jones",
    email: "sarah.jones@monetate.com",
    status: "active",
    progress: 62,
    roleplaysCompleted: 8,
    lastActive: "1 day ago",
    avatarInitials: "SJ",
    score: 79
  },
  {
    id: "rep-4",
    name: "David Smith",
    email: "david.smith@monetate.com",
    status: "inactive",
    progress: 10,
    roleplaysCompleted: 1,
    lastActive: "5 days ago",
    avatarInitials: "DS",
    score: 65
  },
  {
    id: "rep-5",
    name: "Emily White",
    email: "emily.white@monetate.com",
    status: "onboarding",
    progress: 35,
    roleplaysCompleted: 4,
    lastActive: "3 hours ago",
    avatarInitials: "EW",
    score: 82
  }
];

export interface Manager {
  id: string;
  name: string;
  email: string;
  teamSize: number;
  avgTeamScore: number;
  topPerformer: string;
  avatarInitials: string;
}

export const MANAGERS: Manager[] = [
  {
    id: "mgr-1",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@monetate.com",
    teamSize: 12,
    avgTeamScore: 88,
    topPerformer: "Michael Chen",
    avatarInitials: "SJ"
  },
  {
    id: "mgr-2",
    name: "David Miller",
    email: "david.miller@monetate.com",
    teamSize: 8,
    avgTeamScore: 82,
    topPerformer: "Paul Wilkerson",
    avatarInitials: "DM"
  },
  {
    id: "mgr-3",
    name: "Amanda Ross",
    email: "amanda.ross@monetate.com",
    teamSize: 15,
    avgTeamScore: 91,
    topPerformer: "James Wilson",
    avatarInitials: "AR"
  }
];

export interface BillingStats {
  totalMinutesUsed: number;
  planLimit: number;
  costPerMinute: number;
  projectedCost: number;
  activeUsers: number;
  totalRoleplays: number;
}

export const BILLING_STATS: BillingStats = {
  totalMinutesUsed: 12450,
  planLimit: 20000,
  costPerMinute: 0.15,
  projectedCost: 1867.50,
  activeUsers: 35,
  totalRoleplays: 842
};
