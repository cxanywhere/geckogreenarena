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
    title: "Handling the 'LinkedIn Is Too Expensive' Objection",
    description: "Listen to how a top performer reframes the CPL conversation by shifting focus from cost-per-lead to cost-per-qualified-lead and pipeline value with a Demand Gen Director.",
    learningOutcome: "Learn to reframe price objections by connecting LinkedIn's targeting precision to lead quality and downstream pipeline outcomes.",
    duration: "5:12",
    author: "LMS Sales Team",
    tags: ["Objection Handling", "Pricing", "Top 1%"]
  },
  {
    id: "call-2",
    type: "call",
    title: "Winning Over a CMO Who 'Tried LinkedIn Before'",
    description: "A masterclass in diagnosing a past LinkedIn campaign failure without being defensive. Watch how the rep unpacks audience setup, creative, and measurement gaps to reopen the conversation.",
    learningOutcome: "Master the art of non-defensive objection handling when a buyer has had a disappointing past experience with LinkedIn.",
    duration: "6:45",
    author: "LMS Sales Team",
    tags: ["Objection Handling", "Past Failure", "Advanced"]
  },
  {
    id: "call-3",
    type: "call",
    title: "Positioning LinkedIn Against Google and Meta",
    description: "Listen to a consultative conversation where the rep positions LinkedIn as complementary to search and social channels. See how they explain channel role differences and connect LinkedIn to harder-to-reach B2B buyers.",
    learningOutcome: "Learn to position LinkedIn as additive rather than competitive, explaining how professional targeting fills gaps that intent-based and demographic-based channels cannot.",
    duration: "4:30",
    author: "LMS Sales Team",
    tags: ["Competitive", "Positioning", "Channel Strategy"]
  },
  {
    id: "vid-1",
    type: "video",
    title: "The 7-Part Discovery Framework for LMS Reps",
    description: "A deep dive into running discovery calls that uncover real business pain. Learn to ask about business goals, audience, funnel gaps, current channels, offers, measurement, and stakeholders.",
    learningOutcome: "Understand how to run a structured discovery call that builds trust and positions you as a consultative partner rather than a media seller.",
    duration: "14:30",
    author: "LMS Sales Team",
    thumbnail: "",
    tags: ["Discovery", "Framework", "Foundations"]
  },
  {
    id: "vid-2",
    type: "video",
    title: "Objective-First Selling: Matching Campaign Goals to Ad Formats",
    description: "Step-by-step breakdown of how to sell from objective to format, not format to objective. Learn to connect buyer goals to the right LinkedIn campaign structure.",
    learningOutcome: "Learn to recommend the right campaign objective and ad format based on the buyer's business goals, funnel stage, and content strategy.",
    duration: "18:00",
    author: "LMS Sales Team",
    thumbnail: "",
    tags: ["Product Knowledge", "Campaign Strategy", "Objective-First"]
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
  {
    id: "bc-1",
    phase: "Discovery",
    title: "The Business-Goal Discovery Opener",
    situation: "Opening a discovery call with a Demand Gen Director, VP of Marketing, or CMO.",
    script: "Thanks for making the time today. Before I jump in, I'd love to understand — what are your top marketing or growth priorities this quarter? Are you focused more on awareness, lead generation, conversion, or expansion?",
    keyPoints: ["Lead with curiosity, not a pitch", "Reference their role specifically", "Let them set the agenda first"],
    type: "script",
    image: ""
  },
  {
    id: "bc-2",
    phase: "Discovery",
    title: "The Funnel Gap Deep-Dive",
    situation: "Prospect mentions a surface-level challenge like 'we need more leads.'",
    script: "That's a common goal. Can you help me understand — where specifically is the biggest gap today? Is it reach, engagement, conversion, lead quality, or sales follow-up? And what have you tried so far?",
    keyPoints: ["Go deeper than surface symptoms", "Ask what they've already tried", "Quantify the impact if possible"],
    type: "script",
    image: ""
  },
  {
    id: "bc-3",
    phase: "Discovery",
    title: "The Audience & Stakeholder Mapping Move",
    situation: "You need to understand who the buyer is trying to reach and who influences the decision.",
    script: "Who specifically are you trying to reach? Which personas or decision-makers matter most? And on your side, who else would typically weigh in on evaluating a new channel or campaign strategy?",
    keyPoints: ["Map the target audience and buying committee early", "Understand named accounts or industries", "Identify internal stakeholders who influence the decision"],
    type: "tip",
    image: ""
  },
  {
    id: "bc-4",
    phase: "Demo",
    title: "The Value-Led Campaign Recommendation",
    situation: "Presenting a campaign strategy recommendation to multiple stakeholders.",
    script: "Before I walk you through the recommendation, I want to recap what we heard on our last call. You mentioned three priorities: reaching enterprise decision-makers in your target accounts, improving lead quality so sales actually follows up, and proving pipeline contribution to your CMO. I've built this plan around those exact goals.",
    keyPoints: ["Always recap their pain first", "Customize the recommendation to their priorities", "Show you listened"],
    type: "script",
    image: ""
  },
  {
    id: "bc-5",
    phase: "Demo",
    title: "The Objective-to-Format Bridge",
    situation: "Explaining which LinkedIn ad format to use and why.",
    script: "Based on your goal of generating qualified leads from VP-level buyers in enterprise tech, I'd recommend starting with Sponsored Content paired with Lead Gen Forms. The feed placement builds credibility, and the pre-filled forms reduce drop-off. For your thought leadership content, Document Ads can drive deeper engagement at mid-funnel.",
    keyPoints: ["Always start with the objective, not the format", "Connect format to funnel stage and content type", "Keep the recommendation focused and logical"],
    type: "script",
    image: ""
  },
  {
    id: "bc-6",
    phase: "Demo",
    title: "The Social Proof Bridge",
    situation: "Transitioning between sections or when prospect seems skeptical.",
    script: "This is actually the same approach that a similar SaaS company in your space used. They were struggling with lead quality from Google and Meta, so they tested LinkedIn with a focused campaign targeting VP-level buyers. Within 90 days, they saw a 3x improvement in lead-to-opportunity conversion compared to their other channels.",
    keyPoints: ["Reference similar industry/size customers", "Be specific with metrics", "Connect to their situation"],
    type: "script",
    image: ""
  },
  {
    id: "bc-7",
    phase: "Objection Handling",
    title: "Handling 'LinkedIn Is Too Expensive'",
    situation: "Prospect pushes back on CPL being higher than other channels.",
    script: "That's a fair concern. The right comparison usually isn't just cost per lead, but cost per qualified lead or cost per opportunity. For many B2B teams, LinkedIn is valuable because it helps them reach the right professional audience, not just the cheapest audience. How does your team define a qualified lead today?",
    keyPoints: ["Don't argue on CPM/CPC alone", "Move to quality, fit, and pipeline value", "Ask how they define efficiency"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-8",
    phase: "Objection Handling",
    title: "Handling 'We Already Use Google and Meta'",
    situation: "Prospect says they're already invested in other channels.",
    script: "That makes sense, and in many cases LinkedIn works best alongside those channels. Google is strong for active intent, while LinkedIn is powerful for reaching the right business audience earlier and more precisely — especially when you need to influence specific roles or buying groups that aren't actively searching yet.",
    keyPoints: ["Position LinkedIn as additive, not a replacement", "Explain role by funnel stage and audience type", "Link LinkedIn to harder-to-reach business buyers"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-9",
    phase: "Objection Handling",
    title: "Handling 'We Tried LinkedIn Before and It Didn't Work'",
    situation: "Prospect had a disappointing past experience with LinkedIn advertising.",
    script: "I understand. Usually the next step is to unpack what was tested — audience, creative, offer, objective, follow-up process, and success metric. Often the issue isn't the channel alone, but how the campaign was structured and measured. Can you walk me through what you ran?",
    keyPoints: ["Show empathy for past failure", "Diagnose what went wrong without being defensive", "Separate channel fit from execution choices"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-10",
    phase: "Objection Handling",
    title: "Handling 'Our Audience Is Too Niche'",
    situation: "Prospect believes their TAM is too small for LinkedIn advertising.",
    script: "That's actually where LinkedIn can be especially useful. Because targeting is based on professional attributes — job title, function, seniority, industry, and company — it can be a strong fit for niche B2B audiences where reaching the right person matters more than raw scale. Quality over quantity is exactly what LinkedIn is built for.",
    keyPoints: ["Reframe niche as a targeting advantage", "Focus on role-based reach and business identity", "Discuss quality over scale"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-11",
    phase: "Objection Handling",
    title: "Handling 'We Only Care About Direct ROI'",
    situation: "Prospect demands immediate, measurable return on ad spend.",
    script: "Absolutely. Then we should start by defining what ROI means in your world — leads, meetings, qualified pipeline, opportunities, or closed revenue — and build the campaign and measurement approach around that. We should define success based on what your business actually cares about, not just cheap clicks.",
    keyPoints: ["Define ROI clearly in buyer's terms", "Match reporting to their funnel and sales motion", "Connect campaign design to business outcomes"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-12",
    phase: "Pricing",
    title: "The Quality-First Value Anchor",
    situation: "Presenting campaign investment for the first time.",
    script: "Before we talk about investment, let's revisit what we've established: your team needs to reach VP-level buyers at enterprise accounts, and the leads from your current channels aren't converting at the rate sales needs. The question isn't just what LinkedIn costs — it's what it costs you to keep generating leads that sales won't follow up on.",
    keyPoints: ["Always anchor to the value first", "Use their numbers and pain points", "Make the quality argument before showing price"],
    type: "script",
    image: ""
  },
  {
    id: "bc-13",
    phase: "Pricing",
    title: "The Campaign Strategy Breakdown",
    situation: "Prospect asks about different campaign options or what's included.",
    script: "We typically recommend starting with a focused pilot: one high-priority audience, one clear objective, and one or two ad formats. For demand capture, that's usually feed ads plus Lead Gen Forms. For awareness, video or document ads work well. Most companies at your stage start focused and expand based on what the data shows.",
    keyPoints: ["Explain strategy clearly", "Guide them toward the right starting point", "Use 'most companies at your stage' as social proof"],
    type: "script",
    image: ""
  },
  {
    id: "bc-14",
    phase: "Pricing",
    title: "The CPL Comparison Reframe",
    situation: "Prospect compares LinkedIn's CPL to cheaper alternatives.",
    script: "I get it — on the surface, the CPL looks higher. But let's compare what you're actually getting. With LinkedIn, you're reaching verified professionals by title, seniority, and company — not just anyone who clicked on a keyword. Many of our customers find that LinkedIn leads convert to opportunities at 2-3x the rate of cheaper channels. The cost per opportunity is often lower, not higher.",
    keyPoints: ["Don't compete on CPL alone, compete on quality", "Highlight what cheaper leads lack", "Shift to cost-per-opportunity comparison"],
    type: "objection",
    image: ""
  },
  {
    id: "bc-15",
    phase: "Closing",
    title: "The Pilot Proposal Close",
    situation: "After a strong discovery and recommendation where the buyer is interested but cautious.",
    script: "Based on everything we've discussed, I'd suggest we start with a focused pilot — targeting your highest-priority audience with a clear success metric. That way you can see the quality difference for yourself before scaling. Would a 90-day test make sense on your end?",
    keyPoints: ["Propose a low-risk starting point", "Make it easy to say yes", "Define clear success criteria upfront"],
    type: "script",
    image: ""
  },
  {
    id: "bc-16",
    phase: "Closing",
    title: "The Multi-Stakeholder Alignment",
    situation: "Multiple stakeholders need to align before committing budget.",
    script: "I know there are a few folks who need to weigh in. Would it be helpful if I put together a one-page business case your champion can share with the CMO? I can include the audience strategy, expected outcomes, and how this complements your existing channels.",
    keyPoints: ["Offer to support the internal sell", "Provide champion with executive-ready materials", "Remove friction for each stakeholder"],
    type: "tip",
    image: ""
  },
  {
    id: "bc-17",
    phase: "Closing",
    title: "The First-Call Summary Close",
    situation: "Ending a strong first conversation and securing next steps.",
    script: "Based on what you shared, I'd suggest we start by focusing on your highest-priority audience and testing a campaign approach aligned to that specific outcome. What additional information would be helpful for your team, and when would a good time to reconvene with a recommendation?",
    keyPoints: ["Summarize their goals, not your features", "Recommend a clear next step", "Agree on success criteria and timeline"],
    type: "script",
    image: ""
  },
  {
    id: "bc-18",
    phase: "Follow-up",
    title: "The Post-Discovery Summary Email",
    situation: "Sending a follow-up email within 2 hours of a discovery call.",
    script: "Hi [Name], thanks again for your time today. To recap: we covered how LinkedIn can help with [Priority 1], [Priority 2], and [Priority 3]. I've outlined a recommended starting approach based on your audience and goals. Next steps: [Action Item]. Looking forward to connecting on [Date].",
    keyPoints: ["Send within 2 hours", "Recap their priorities, not your features", "Include a clear next step and date"],
    type: "script",
    image: ""
  },
  {
    id: "bc-19",
    phase: "Follow-up",
    title: "The Champion Enablement Pack",
    situation: "Your internal champion needs to present LinkedIn to their CMO or leadership.",
    script: "I put together a one-pager and ROI summary specifically for your leadership review. It covers the business case, expected outcomes from a focused LinkedIn pilot, and how it complements your existing channel mix. Would it be helpful if I also drafted a brief exec summary email you could forward?",
    keyPoints: ["Make your champion look good", "Provide ready-to-forward materials", "Offer to draft internal communications"],
    type: "script",
    image: ""
  },
  {
    id: "bc-20",
    phase: "Follow-up",
    title: "The Executive Sponsor Outreach",
    situation: "You need to engage the VP of Marketing or CMO directly.",
    script: "Hi [Exec Name], I've been working with [Champion Name] on your team on how LinkedIn can help [Company] reach your target B2B audience more precisely and improve lead quality. I'd love 15 minutes to share what we've uncovered and get your perspective on priorities for the coming quarter.",
    keyPoints: ["Reference the champion by name", "Lead with business impact, not product features", "Ask for a specific, short time commitment"],
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
    title: "LMS Fundamentals",
    subtitle: "Product Landscape & Core Value",
    description: "Learn what LinkedIn Marketing Solutions is, why B2B marketers buy it, what the core products do, and how to explain LinkedIn's value simply and confidently.",
    duration: "45 min",
    status: "in-progress",
    pdfUrl: "",
    coverImage: "",
    agenda: [
      "What LMS Sells and Why Buyers Use It",
      "The Professional Graph Advantage",
      "Core Products: Sponsored Content, Lead Gen Forms, Video, Carousel, Document Ads",
      "Objective-First Selling and Measurement Basics"
    ],
    slides: [
      {
        type: 'content',
        title: "What LMS Actually Sells",
        content: "LinkedIn Marketing Solutions sells access to a professional audience with precision targeting and ad formats matched to business objectives. For a new rep, the simplest way to describe LMS is: LinkedIn helps marketers reach the right professional audience, with the right message, in a trusted business environment, and measure business impact across the funnel.",
        bullets: [
          "Access to a professional audience with precision targeting based on business identity.",
          "Ad formats matched to business objectives — awareness, lead gen, and conversion.",
          "Measurement tied to business outcomes, not just clicks."
        ]
      },
      {
        type: 'content',
        title: "Why LinkedIn Is Different",
        content: "LinkedIn is not just another ad platform. Its core value is business context — professional identity and declared profile data that no other platform can match.",
        bullets: [
          "Professional identity-based targeting: job title, function, seniority, industry, company, skills.",
          "Trusted business environment for thought leadership and B2B content.",
          "Full-funnel campaign options from awareness to lead generation and conversion."
        ]
      },
      {
        type: 'roleplay',
        title: "Practice: The LMS Elevator Pitch",
        content: "A new Demand Gen Manager asks: 'What exactly is LinkedIn Marketing Solutions, and why would I use it?' Can you explain it clearly in 30 seconds?",
        roleplayId: "rp-1"
      },
      {
        type: 'quiz',
        title: "Quick Check: LMS Fundamentals",
        quiz: {
          question: "What is the best way for a new rep to start a campaign recommendation?",
          options: [
            "Recommend the most popular ad format.",
            "Ask 'What business outcome matters most?' and match the objective to the right format.",
            "Present LinkedIn's full product catalog.",
            "Start with pricing and budget discussion."
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'content',
        title: "Core Products Overview",
        content: "LinkedIn offers a family of ad products designed for different business objectives and funnel stages. New reps must understand when and why to recommend each format.",
        bullets: [
          "Sponsored Content: feed-based ads for reach, education, and engagement.",
          "Lead Gen Forms: pre-filled forms that reduce friction and improve conversion rates.",
          "Video, Carousel, and Document Ads: for storytelling, multi-step education, and deep content engagement."
        ]
      },
      {
        type: 'quiz',
        title: "Quick Check: Product Knowledge",
        quiz: {
          question: "Why are Lead Gen Forms especially valuable for B2B marketers?",
          options: [
            "They are free to use.",
            "They pre-fill data from LinkedIn profiles, reducing form friction and improving conversions.",
            "They automatically qualify leads with AI.",
            "They replace the need for a website."
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'roleplay',
        title: "Practice: Executive Summary",
        content: "The CMO asks: 'Give me the short version — why LinkedIn, why now?' Deliver a concise, confident executive-level answer.",
        roleplayId: "rp-6"
      }
    ]
  },
  {
    id: "chap-2",
    title: "Buyer Conversations & Discovery",
    subtitle: "Diagnose Before You Prescribe",
    description: "Learn how to run structured discovery calls, understand buyer context, and position LinkedIn Marketing Solutions based on actual business needs — not product features.",
    duration: "60 min",
    status: "locked",
    pdfUrl: "",
    coverImage: "",
    agenda: [
      "The 7-Part Discovery Framework",
      "Buyer Personas: Demand Gen, CMO, ABM, Performance Marketing",
      "Positioning LinkedIn Against Current Channels",
      "Persona-Based Selling and Full Discovery Practice"
    ],
    slides: [
      {
        type: 'content',
        title: "Why Discovery Matters",
        content: "Buyers don't want a generic product tour. Better discovery leads to stronger recommendations, builds trust, and increases close rates. A great discovery call is one where the buyer feels understood before the rep recommends a product.",
        bullets: [
          "Avoid feature-dumping — understand the business problem first.",
          "Better discovery leads to more relevant recommendations.",
          "Good discovery builds trust and positions you as a consultative partner."
        ]
      },
      {
        type: 'content',
        title: "The 7-Part Discovery Framework",
        content: "Follow this structured discovery sequence to avoid pitching too early and ensure you understand the full picture before recommending a campaign strategy.",
        bullets: [
          "Business goals → Audience → Funnel gap → Current channel mix.",
          "Offer/content → Measurement → Stakeholders/process.",
          "Each step reveals critical context for your campaign recommendation."
        ]
      },
      {
        type: 'roleplay',
        title: "Practice: Funnel Diagnosis",
        content: "The buyer says their leads aren't converting and sales calls them 'garbage.' Can you diagnose the real problem?",
        roleplayId: "rp-9"
      },
      {
        type: 'quiz',
        title: "Quick Check: Discovery Framework",
        quiz: {
          question: "What should you do immediately after a buyer raises a concern about LinkedIn's cost?",
          options: [
            "Offer a discount or reduced package.",
            "Acknowledge the concern, then reframe by asking how they define efficiency and shifting to lead quality and pipeline value.",
            "Argue that LinkedIn is actually cheaper than competitors.",
            "End the call and send a pricing sheet."
          ],
          correctAnswer: 1
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
  {
    id: "rp-1",
    name: "What exactly is LinkedIn Marketing Solutions, and why would I use it?",
    role: "The New Demand Gen Manager",
    description: "Chapter 1 → Product Overview → Elevator Explanation. Deliver a clear, confident 30-second explanation of LMS without jargon.",
    avatar: "",
    traits: ["Curiosity", "Low Awareness", "Open-Minded"],
    difficulty: "Beginner",
    stats: { resistance: 30, objections: 20, buy_signal: 50 },
    chapterId: "chap-1"
  },
  {
    id: "rp-2",
    name: "Why would your lead forms perform better than sending traffic to my site?",
    role: "The Skeptical B2B Marketer",
    description: "Chapter 1 → Product Deep-Dive → Lead Gen Form Relevance. Explain friction reduction and fit without overpromising.",
    avatar: "",
    traits: ["Detail-Oriented", "Practical", "Results-Driven"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 40, buy_signal: 40 },
    chapterId: "chap-1"
  },
  {
    id: "rp-3",
    name: "I don't know whether I want awareness or leads. How do I decide?",
    role: "The Confused First-Time Advertiser",
    description: "Chapter 1 → Objective-First Selling → Objective Clarification. Guide the buyer by asking smart follow-up questions instead of prescribing.",
    avatar: "",
    traits: ["Uncertainty", "Openness", "Need for Guidance"],
    difficulty: "Beginner",
    stats: { resistance: 25, objections: 30, buy_signal: 60 },
    chapterId: "chap-1"
  },
  {
    id: "rp-4",
    name: "Which ad format should I start with?",
    role: "The SaaS Campaign Planner",
    description: "Chapter 1 → Product Deep-Dive → Format Recommendation. Match format to offer and funnel stage based on the buyer's content.",
    avatar: "",
    traits: ["Action-Oriented", "Content-Rich", "Goal-Focused"],
    difficulty: "Intermediate",
    stats: { resistance: 40, objections: 35, buy_signal: 55 },
    chapterId: "chap-1"
  },
  {
    id: "rp-5",
    name: "We only care about results. What should we realistically measure?",
    role: "The Performance Marketer",
    description: "Chapter 1 → Measurement Basics → Metrics Conversation. Shift from vanity metrics to business-relevant metrics.",
    avatar: "",
    traits: ["Data-Driven", "ROI-Focused", "Direct"],
    difficulty: "Intermediate",
    stats: { resistance: 55, objections: 50, buy_signal: 45 },
    chapterId: "chap-1"
  },
  {
    id: "rp-6",
    name: "Give me the short version — why LinkedIn, why now?",
    role: "The Time-Pressed CMO",
    description: "Chapter 1 → End of Chapter → Executive Summary. Deliver a concise executive-level summary that connects LMS to business outcomes.",
    avatar: "",
    traits: ["Executive Presence", "Time-Constrained", "Strategic"],
    difficulty: "Advanced",
    stats: { resistance: 60, objections: 40, buy_signal: 35 },
    chapterId: "chap-1"
  },
  {
    id: "rp-7",
    name: "What are your top priorities this quarter?",
    role: "The Guarded VP of Demand Gen",
    description: "Chapter 2 → Discovery → Business-Priority Discovery. Ask open-ended questions about business goals and listen for pain signals.",
    avatar: "",
    traits: ["Strategic", "Budget-Conscious", "Results-Focused"],
    difficulty: "Intermediate",
    stats: { resistance: 55, objections: 45, buy_signal: 40 },
    chapterId: "chap-2"
  },
  {
    id: "rp-8",
    name: "We're trying to reach the buying committee at enterprise accounts.",
    role: "The ABM / Field Marketing Leader",
    description: "Chapter 2 → Discovery → Audience / Buying Committee. Probe for specific roles and accounts, then connect to LinkedIn's targeting.",
    avatar: "",
    traits: ["Account-Focused", "Precision-Oriented", "Sales-Aligned"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 55, buy_signal: 45 },
    chapterId: "chap-2"
  },
  {
    id: "rp-9",
    name: "We're getting leads but they're not converting. Sales says they're garbage.",
    role: "The Frustrated Demand Gen Director",
    description: "Chapter 2 → Discovery → Funnel Diagnosis. Diagnose the funnel gap specifically and connect to LinkedIn's precision targeting.",
    avatar: "",
    traits: ["Frustrated", "Data-Aware", "Sales-Pressured"],
    difficulty: "Advanced",
    stats: { resistance: 70, objections: 65, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-10",
    name: "We used LinkedIn before and were pretty disappointed.",
    role: "The Burned CMO",
    description: "Chapter 2 → Discovery → Prior-Channel Disappointment. Show empathy, diagnose what was tested, and reopen the conversation without being defensive.",
    avatar: "",
    traits: ["Skepticism", "Past Pain", "High Standards"],
    difficulty: "Advanced",
    stats: { resistance: 75, objections: 70, buy_signal: 20 },
    chapterId: "chap-2"
  },
  {
    id: "rp-11",
    name: "I'm the CMO. Why does LinkedIn deserve budget over channels we already trust?",
    role: "The Budget-Guarding CMO",
    description: "Chapter 2 → Positioning → Persona-Based Positioning (CMO). Position LinkedIn strategically with outcomes over features.",
    avatar: "",
    traits: ["Executive Authority", "Budget Pressure", "Strategic Thinker"],
    difficulty: "Advanced",
    stats: { resistance: 80, objections: 75, buy_signal: 25 },
    chapterId: "chap-2"
  },
  {
    id: "rp-12",
    name: "Run a full mini-discovery with me. I'm VP of Demand Gen, pipeline is flat.",
    role: "The Full Discovery Simulation",
    description: "Chapter 2 → Full Discovery → Mini-Discovery Simulation. Run a structured 7-part discovery flow covering goals, audience, funnel, channels, offers, measurement, and stakeholders.",
    avatar: "",
    traits: ["Comprehensive", "Testing Rep Skills", "Multi-Faceted"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 80, buy_signal: 35 },
    chapterId: "chap-2"
  },
  {
    id: "rp-13",
    name: "Your CPL is always higher than other platforms.",
    role: "The Cost-Conscious Performance Marketer",
    description: "Chapter 3 → Objection Handling → Price Objection. Reframe CPL to qualified outcomes and pipeline value.",
    avatar: "",
    traits: ["Data-Driven", "Price Sensitivity", "Analytical"],
    difficulty: "Intermediate",
    stats: { resistance: 65, objections: 80, buy_signal: 35 },
    chapterId: "chap-2"
  },
  {
    id: "rp-14",
    name: "Why not just put more budget into Google?",
    role: "The Channel-Loyal Demand Gen Leader",
    description: "Chapter 3 → Objection Handling → Channel Overlap. Explain channel role differences and complementary positioning.",
    avatar: "",
    traits: ["Google-Centric", "Results-Oriented", "Channel-Focused"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 65, buy_signal: 40 },
    chapterId: "chap-2"
  },
  {
    id: "rp-15",
    name: "We tried LinkedIn last year and saw nothing meaningful.",
    role: "The Disappointed CMO",
    description: "Chapter 3 → Objection Handling → Past Failure. Diagnose respectfully without being defensive and reopen the conversation.",
    avatar: "",
    traits: ["Skepticism", "Past Disappointment", "High Bar"],
    difficulty: "Advanced",
    stats: { resistance: 75, objections: 70, buy_signal: 20 },
    chapterId: "chap-2"
  },
  {
    id: "rp-16",
    name: "Our TAM is tiny. I doubt LinkedIn is worth it.",
    role: "The Niche Cybersecurity Marketer",
    description: "Chapter 3 → Objection Handling → Niche Audience. Reframe niche targeting as a strength and discuss quality over scale.",
    avatar: "",
    traits: ["Niche-Focused", "Skeptical", "Enterprise-Oriented"],
    difficulty: "Advanced",
    stats: { resistance: 70, objections: 60, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-17",
    name: "We have budget for one pilot. What would you test first?",
    role: "The Mid-Market SaaS Marketer",
    description: "Chapter 3 → Strategy → Pilot Recommendation. Recommend a logical starter strategy with simplicity and strategic clarity.",
    avatar: "",
    traits: ["Budget-Constrained", "Action-Ready", "Practical"],
    difficulty: "Intermediate",
    stats: { resistance: 40, objections: 35, buy_signal: 65 },
    chapterId: "chap-2"
  },
  {
    id: "rp-18",
    name: "Final Certification: Tell us what LinkedIn should do for us, why we should trust it, and how you'd start.",
    role: "The CMO + Demand Gen Panel",
    description: "Post-Training → Final Certification. Run a concise executive pitch plus recommendation combining discovery, positioning, and objection handling.",
    avatar: "",
    traits: ["Executive Panel", "Comprehensive Test", "High Stakes"],
    difficulty: "Advanced",
    stats: { resistance: 90, objections: 85, buy_signal: 40 },
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
    feedback: "Great job delivering a clear elevator explanation without resorting to jargon. You maintained a consultative tone and connected LMS to business outcomes, but could have been more concise in the opening.",
    transcript: [
        { id: '1', sender: 'ai', text: "What exactly is LinkedIn Marketing Solutions, and why would I use it instead of another ad channel?", timestamp: new Date() },
        { id: '2', sender: 'user', text: "LinkedIn Marketing Solutions helps you reach the exact professional audience that matters to your business — by job title, seniority, company, and industry — in a trusted business context. It's especially valuable when you need to influence B2B decision-makers who are hard to reach on other platforms.", timestamp: new Date() }
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
      { timestamp: "0:05", description: "Strong opening with clear value statement connecting to business outcomes.", impact: 'positive' },
      { timestamp: "0:15", description: "Slight hesitation when differentiating from Google/Meta.", impact: 'negative' },
      { timestamp: "0:45", description: "Excellent use of targeting examples to make the value tangible.", impact: 'positive' }
    ]
  },
  {
    id: "res-2",
    scenarioId: "rp-6",
    score: 72,
    date: "2025-01-12T09:15:00",
    feedback: "Good recovery when the CMO pushed for brevity. Work on delivering a crisper executive summary without over-explaining product details.",
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
       { timestamp: "0:10", description: "Missed opportunity to lead with business outcomes instead of product features.", impact: 'negative' },
       { timestamp: "0:30", description: "Recovered well by connecting LinkedIn's targeting precision to the CMO's pipeline goals.", impact: 'positive' }
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
    email: "paul.wilkerson@linkedin.com",
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
    email: "michael.chen@linkedin.com",
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
    email: "sarah.jones@linkedin.com",
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
    email: "david.smith@linkedin.com",
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
    email: "emily.white@linkedin.com",
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
    email: "sarah.jenkins@linkedin.com",
    teamSize: 12,
    avgTeamScore: 88,
    topPerformer: "Michael Chen",
    avatarInitials: "SJ"
  },
  {
    id: "mgr-2",
    name: "David Miller",
    email: "david.miller@linkedin.com",
    teamSize: 8,
    avgTeamScore: 82,
    topPerformer: "Paul Wilkerson",
    avatarInitials: "DM"
  },
  {
    id: "mgr-3",
    name: "Amanda Ross",
    email: "amanda.ross@linkedin.com",
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
