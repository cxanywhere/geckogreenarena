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
    name: "I only have 5 minutes",
    role: "The Rushed Executive",
    phase: "Chapter 1",
    context: "Discovery → Opening the Call",
    objection: "I only have 5 minutes.",
    passCriteria: "Acknowledge the time constraint, set a tight agenda, and ask a high-impact discovery question that qualifies the opportunity.",
    failConditions: "Launches into a pitch deck or rambles without respecting their time constraint",
    winningResponse: "Great job! You respected their time, set a focused agenda, and asked a qualifying discovery question.",
    losingResponse: "You need to respect their schedule and lead with a sharp discovery question, not a product pitch.",
    winningExamples: [
      "Completely respect that — let me make the most of your 5 minutes. Quick question: what's your current approach to personalizing the customer experience across your e-commerce channels?",
      "Understood — I'll keep it tight. In 5 minutes I just want to understand one thing: what's driving the most revenue leakage on your site today? Then we can decide if a longer conversation makes sense.",
      "Appreciate that. Let me ask you one thing — when your team looks at conversion rates across segments, are you seeing a gap between new visitors and returning customers?",
      "Totally fair. Here's what I'd love to cover in 5 minutes: understand your biggest challenge around site conversion, and if Monetate can help, we'll book a proper deep-dive. Sound fair?"
    ],
    losingExamples: [
      "Great, so let me walk you through our platform — we were founded in 2008 and we serve over 400 enterprise brands...",
      "Can we reschedule for when you have more time?",
      "I'll send you some materials and you can review them later.",
      "This will only take 30 minutes, I promise it's worth it."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 60,
    traits: ["Time Management", "Discovery Questions", "Executive Presence"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Completely respect that — let me make the most of your 5 minutes. Quick question: what's your current approach to personalizing the customer experience across your e-commerce channels?' Key points: 1) Acknowledge the time constraint immediately, 2) Set a focused agenda, 3) Ask a high-value discovery question that qualifies the opportunity and gets them talking about their business.",
    lawnIssues: ["declining conversion rates on product pages", "high bounce rates from paid traffic"]
  },
  {
    id: "rp-02",
    name: "We've tried personalization before, it didn't work",
    role: "The Skeptic",
    phase: "Chapter 1",
    context: "Discovery → Handling Past Failures",
    objection: "We've tried personalization before, it didn't work.",
    passCriteria: "Empathize with the past failure, ask diagnostic questions about what they tried and why it failed, and differentiate Monetate's approach.",
    failConditions: "Dismisses their experience or immediately pitches without understanding what went wrong",
    winningResponse: "Excellent recovery! You validated their experience and dug into the root cause.",
    losingResponse: "You need to understand their past experience before positioning Monetate as different.",
    winningExamples: [
      "That's actually really common — and honestly, most personalization implementations fail for a few specific reasons. Can I ask what you tried? Was it rules-based, or were you doing algorithmic testing?",
      "I hear that a lot, and I appreciate the honesty. The question I'd ask is — was the challenge with the technology, the strategy, or the team running it? Because those are three very different problems.",
      "Makes total sense — a lot of our best customers came to us after a failed attempt elsewhere. What specifically didn't work? Was it lack of ROI visibility, implementation complexity, or something else?",
      "I appreciate you sharing that. Can you tell me more about what you tried? We've found that 80% of failed personalization projects fail because of poor segmentation strategy, not the technology itself."
    ],
    losingExamples: [
      "Well, Monetate is different because we use AI and machine learning...",
      "That's because you probably used the wrong vendor. We're much better.",
      "Personalization has come a long way since then, let me show you our demo.",
      "I understand, but every company needs personalization to compete today."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Empathy", "Diagnostic Discovery", "Differentiation"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's actually really common — and honestly, most personalization implementations fail for a few specific reasons. Can I ask what you tried? Was it rules-based, or were you doing algorithmic testing?' Key points: 1) Validate their experience — don't dismiss it, 2) Ask diagnostic questions to understand the root cause, 3) Position yourself as someone who can help them avoid the same mistakes.",
    lawnIssues: ["previous personalization tool had poor adoption", "lack of measurable ROI from past initiatives"]
  },
  {
    id: "rp-03",
    name: "We're not ready for this yet",
    role: "The Procrastinator",
    phase: "Chapter 1",
    context: "Objection Handling → Timing Objection",
    objection: "We're not ready for this yet.",
    passCriteria: "Explore what 'not ready' means specifically, identify the cost of waiting, and create urgency through business impact rather than pressure tactics.",
    failConditions: "Accepts the objection at face value or uses high-pressure urgency tactics",
    winningResponse: "Great job! You uncovered what 'not ready' really means and framed the cost of inaction.",
    losingResponse: "Don't accept vague timing objections. Dig into what specifically needs to happen before they're ready.",
    winningExamples: [
      "That's fair — can I ask, what would need to change for you to be ready? Is it a resource question, a budget cycle thing, or something else entirely?",
      "Understood. When you say not ready, is that about internal bandwidth, or is there a specific initiative that needs to happen first? I ask because most of our customers started their evaluation 6 months before they actually launched.",
      "I hear you. Let me ask it this way — every quarter you wait, what does that cost in lost revenue from unoptimized experiences? We typically see brands leaving 8-15% of revenue on the table. Is that something you can afford to delay?",
      "Makes sense. A lot of enterprise teams feel that way. Can I share what the typical evaluation timeline looks like? Most of our customers started the conversation well before they were 'ready' — and that head start made the actual implementation much smoother."
    ],
    losingExamples: [
      "No worries, I'll check back in next quarter.",
      "You need to move fast — your competitors are already doing this.",
      "Okay, when do you think you'll be ready?",
      "I understand, let me send you some materials for when the time is right."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 45,
    traits: ["Cost of Inaction", "Diagnostic Questions", "Consultative Urgency"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's fair — can I ask, what would need to change for you to be ready? Is it a resource question, a budget cycle thing, or something else entirely?' Key points: 1) Don't accept 'not ready' at face value, 2) Ask what specifically needs to change, 3) Quantify the cost of waiting, 4) Position the evaluation process as something that takes time and should start now.",
    lawnIssues: ["losing market share to competitors with better digital experiences", "upcoming board review on digital transformation progress"]
  },
  {
    id: "rp-04",
    name: "We built our own solution in-house",
    role: "The DIY Builder",
    phase: "Chapter 1",
    context: "Demo → In-House Solution Objection",
    objection: "We built our own solution in-house.",
    passCriteria: "Respect their engineering investment, ask about maintenance burden and opportunity cost, and position Monetate as complementary or superior in specific areas.",
    failConditions: "Insults their engineering team or dismisses in-house solutions entirely",
    winningResponse: "Perfect! You respected their build and highlighted the hidden costs of maintaining in-house.",
    losingResponse: "Never dismiss their engineering effort. Explore the total cost of ownership and opportunity cost.",
    winningExamples: [
      "That's impressive — building in-house takes real commitment. Can I ask, how much engineering time goes into maintaining and evolving it? The reason I ask is most teams we talk to found that their homegrown solution worked for basic use cases but couldn't scale to real-time decisioning across channels.",
      "Love that — you clearly have a strong engineering team. A few things I'd be curious about: how are you handling real-time segmentation at scale, and what's the testing velocity look like? Those are usually where in-house solutions hit a ceiling.",
      "That's great — a lot of our best customers started that way. The question is whether your engineering team should be spending their cycles on personalization infrastructure or on core product innovation. What's the opportunity cost of maintaining it?",
      "Respect that. How's it performing for you? I'd love to understand what it does well and where you might be seeing gaps. Often we find that in-house tools handle the first 20% of use cases but struggle with algorithmic optimization and cross-channel orchestration."
    ],
    losingExamples: [
      "In-house solutions never work as well as purpose-built platforms.",
      "That must be a nightmare to maintain.",
      "How many engineers are wasting their time on that?",
      "Let me show you why our solution is better than anything you could build."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 35,
    buySignal: 65,
    traits: ["Respect", "TCO Analysis", "Strategic Positioning"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's impressive — building in-house takes real commitment. Can I ask, how much engineering time goes into maintaining and evolving it?' Key points: 1) Genuinely respect their engineering investment, 2) Ask about maintenance burden and velocity, 3) Position the conversation around opportunity cost — should engineers build personalization or core product?",
    lawnIssues: ["engineering team spending 30% of sprints maintaining personalization code", "inability to run multivariate tests at scale"]
  },
  {
    id: "rp-05",
    name: "We already use Dynamic Yield",
    role: "The Incumbent Loyalist",
    phase: "Chapter 1",
    context: "Demo → Incumbent Vendor Objection",
    objection: "We already use Dynamic Yield.",
    passCriteria: "Acknowledge their current vendor without bashing, ask about satisfaction and gaps, and position Monetate's differentiated value.",
    failConditions: "Attacks the competitor or tries to do a feature-by-feature comparison",
    winningResponse: "Excellent! You planted seeds of doubt without being combative.",
    losingResponse: "Never bash competitors. Understand their satisfaction level and find gaps in their current setup.",
    winningExamples: [
      "Got it — Dynamic Yield is a solid platform. How's it working for you? Specifically, are you getting the level of strategic support and optimization guidance you need, or is it more self-serve?",
      "Makes sense — they have good technology. Can I ask, what's your experience been with their server-side capabilities and page load impact? That's one area where our customers tell us there's a significant difference.",
      "Good to know. I'm not here to bash DY — but I am curious: are you able to do real-time product recommendations that factor in inventory and margin data? That's an area where we tend to see a meaningful gap.",
      "Understood. Are you locked into a contract, or is there flexibility to evaluate alternatives? The reason I ask is that a lot of DY customers come to us specifically because of our approach to experience optimization across the full funnel."
    ],
    losingExamples: [
      "Dynamic Yield is terrible — they were acquired by Mastercard and lost all their best people.",
      "We're so much better than Dynamic Yield, let me show you.",
      "Why are you still using them? Everyone is switching to us.",
      "Let me do a feature comparison to show you where they fall short."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Competitive Intelligence", "Gap Analysis", "Consultative Selling"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Got it — Dynamic Yield is a solid platform. How's it working for you? Specifically, are you getting the level of strategic support and optimization guidance you need?' Key points: 1) Never bash the competitor, 2) Ask about satisfaction and specific capability gaps, 3) Probe areas where Monetate differentiates (server-side, strategic services, full-funnel optimization).",
    lawnIssues: ["slow page load times from client-side personalization", "limited strategic support from current vendor"]
  },
  {
    id: "rp-06",
    name: "I don't understand how this is different",
    role: "The Confused Buyer",
    phase: "Chapter 1",
    context: "Demo → Differentiation Challenge",
    objection: "I don't understand how this is different from what we already have.",
    passCriteria: "Ask clarifying questions about their current capabilities, then clearly articulate 2-3 specific differentiators relevant to their situation.",
    failConditions: "Launches into generic feature dumps or fails to connect differentiation to their specific needs",
    winningResponse: "Great clarity! You connected differentiation directly to their business needs.",
    losingResponse: "Always tie differentiation to their specific pain points, not generic feature lists.",
    winningExamples: [
      "Great question — and I wouldn't want you to invest time if there isn't a real difference. Can you walk me through what your current stack does for personalization today? That way I can focus on where we actually add incremental value.",
      "Fair pushback. Let me ask it this way: when you think about personalization today, what's working and what's frustrating? Because the difference isn't just features — it's how we solve the problems that are actually costing you revenue.",
      "I appreciate that — let me not waste your time with a generic pitch. What are the top 2 things you wish your current solution did better? I'll tell you honestly whether we solve those or not.",
      "That's the right question to ask. Here's what I hear most from companies in your space: they have basic A/B testing and rules-based targeting, but they can't do real-time algorithmic decisioning at scale. Is that similar to what you're experiencing?"
    ],
    losingExamples: [
      "Well, we have AI-powered personalization, real-time segmentation, and 50+ integrations...",
      "We're the leader in the Gartner Magic Quadrant.",
      "Let me walk you through all of our features.",
      "Trust me, once you see the demo you'll understand."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 70,
    traits: ["Active Listening", "Targeted Messaging", "Consultative Approach"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Great question — can you walk me through what your current stack does for personalization today? That way I can focus on where we actually add incremental value.' Key points: 1) Don't do a feature dump, 2) Ask what they currently have so you can position the delta, 3) Focus on 2-3 differentiators that map to their specific situation.",
    lawnIssues: ["inability to run tests without engineering support", "lack of real-time behavioral targeting"]
  },
  {
    id: "rp-07",
    name: "Our conversion rates are fine",
    role: "The Denialist",
    phase: "Chapter 2",
    context: "Demo → Challenging the Status Quo",
    objection: "Our conversion rates are fine.",
    passCriteria: "Validate their perspective, introduce benchmarking data, and help them see the gap between 'fine' and 'optimized.'",
    failConditions: "Argues that their conversion rates are bad or insists they have a problem without data",
    winningResponse: "Well done! You showed the gap between 'fine' and 'great' with data.",
    losingResponse: "Never tell a prospect their business is broken. Use benchmarks and 'what if' scenarios to reveal opportunity.",
    winningExamples: [
      "That's great — and I'm sure you've worked hard to get there. Can I ask, what's your current site-wide conversion rate? The reason I ask is we typically see brands in your vertical convert between 3-5%, and most find there's a meaningful gap between their best and worst performing segments.",
      "Good to hear. Let me ask it this way — if I could show you how to get an additional 15-20% lift on top of your current numbers, would that be worth exploring? We're not here to fix what's broken — we're here to unlock what's being left on the table.",
      "Makes sense — but here's what I'd challenge: 'fine' and 'optimized' are two very different things. Most of our customers thought their rates were fine too, until they saw what was possible with real-time personalization. What does your conversion look like by segment?",
      "I appreciate that confidence. Quick question — are you measuring conversion holistically, or do you break it down by traffic source, device, and customer segment? Because aggregate numbers often mask significant opportunities."
    ],
    losingExamples: [
      "Actually, based on industry benchmarks, your conversion rates are below average.",
      "Fine isn't good enough in today's market.",
      "Your competitors are way ahead of you on this.",
      "If your rates were really fine, you wouldn't be taking this meeting."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Benchmarking", "Data-Driven Selling", "Opportunity Framing"],
    durationSeconds: 90,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's great — can I ask, what's your current site-wide conversion rate? We typically see brands in your vertical convert between 3-5%, and most find a meaningful gap between best and worst segments.' Key points: 1) Never tell them they're wrong, 2) Use benchmark data to create a reference point, 3) Shift from 'fixing broken' to 'unlocking opportunity.'",
    lawnIssues: ["20% gap between best and worst performing customer segments", "cart abandonment rate above industry average"]
  },
  {
    id: "rp-08",
    name: "Personalization isn't a priority right now",
    role: "The Apathetic Stakeholder",
    phase: "Chapter 2",
    context: "Objection Handling → Priority Objection",
    objection: "Personalization isn't a priority right now.",
    passCriteria: "Understand their current priorities, then connect personalization to what they already care about — revenue growth, cost efficiency, or competitive differentiation.",
    failConditions: "Argues that personalization should be a priority or fails to connect to their existing goals",
    winningResponse: "Great job connecting personalization to what they actually care about!",
    losingResponse: "Don't argue about priorities. Understand theirs and show how personalization enables them.",
    winningExamples: [
      "Completely understand — what is the top priority right now? The reason I ask is that personalization often isn't a standalone initiative; it's a lever that accelerates whatever you're already focused on, whether that's revenue growth, customer retention, or improving acquisition efficiency.",
      "Fair enough. Can I ask what's at the top of your roadmap this year? I ask because our most successful customers didn't start with personalization as a priority — they started with a revenue goal and realized personalization was the fastest path to getting there.",
      "That makes sense. What if I reframed it — instead of personalization as a project, think of it as a way to get more revenue from the traffic you're already paying for. If you're spending on paid acquisition, every unoptimized experience is wasted ad spend.",
      "Got it. What are your top 3 priorities this year? I want to make sure I'm not wasting your time — but if any of them involve growing digital revenue or improving customer experience, there's a direct connection I'd like to show you."
    ],
    losingExamples: [
      "Personalization should absolutely be a priority — every major brand is investing in it.",
      "Your competitors are all doing this, you can't afford to wait.",
      "Okay, I'll follow up next quarter when it might be a priority.",
      "But personalization drives so much revenue uplift..."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Priority Alignment", "Strategic Framing", "Business Acumen"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Completely understand — what is the top priority right now? Personalization often isn't a standalone initiative; it's a lever that accelerates whatever you're already focused on.' Key points: 1) Accept their priorities without arguing, 2) Ask what IS a priority, 3) Connect personalization as an enabler of their existing goals, not a separate project.",
    lawnIssues: ["rising customer acquisition costs with flat conversion rates", "board pressure to improve digital revenue per visitor"]
  },
  {
    id: "rp-09",
    name: "Show me the actual ROI data",
    role: "The Data Demander",
    phase: "Chapter 2",
    context: "Pricing → ROI Justification",
    objection: "Show me the actual ROI data.",
    passCriteria: "Share specific, credible ROI data with named references or industry benchmarks, and frame ROI in terms relevant to their business.",
    failConditions: "Gives vague promises or generic percentages without credible backing",
    winningResponse: "Excellent! You provided specific, credible data tailored to their business.",
    losingResponse: "Always have specific case studies and ROI metrics ready. Vague promises kill credibility.",
    winningExamples: [
      "Absolutely — I was hoping you'd ask. Let me share three data points: a top-10 retailer saw a 12% revenue per visitor lift in 90 days, a fashion brand reduced bounce rate by 23%, and on average our customers see 5-8x ROI within the first year. I can connect you with a reference customer in your vertical if that would help.",
      "Great question. Here's what I can share: across our customer base, the median lift from Monetate-powered personalization is 6-10% in revenue per session. For a brand your size, that translates to roughly $X million in incremental annual revenue. Want me to build a custom business case for your specific metrics?",
      "Happy to. Let me share our published benchmark data: enterprise retailers using our platform see an average 8.5% lift in conversion rate and a 12% increase in average order value. I'd also love to build a custom ROI model based on your traffic and revenue data — would that be helpful?",
      "Of course. Rather than give you generic numbers, can you share your current monthly traffic and conversion rate? I'll build you a specific ROI projection. In the meantime, here's a reference: a mid-market retailer in your space saw $4.2M in incremental revenue in their first year."
    ],
    losingExamples: [
      "Our customers typically see great ROI. I can send you some case studies.",
      "Personalization always pays for itself. Trust me.",
      "I don't have exact numbers, but I know it works.",
      "ROI varies by customer, so I can't really give you a number."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Data Fluency", "Business Case Building", "Credibility"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Absolutely — let me share three data points...' and reference specific customer outcomes. Key points: 1) Lead with specific numbers and named customer categories, 2) Offer to build a custom business case with their actual metrics, 3) Have 2-3 proof points ready at all times — this objection is an opportunity, not a threat.",
    lawnIssues: ["need to justify technology spend to the CFO", "previous vendor failed to deliver promised ROI"]
  },
  {
    id: "rp-10",
    name: "What's the annual license cost?",
    role: "The Price Shopper",
    phase: "Chapter 2",
    context: "Pricing → Premature Price Question",
    objection: "What's the annual license cost?",
    passCriteria: "Acknowledge the question, defer with a valid reason, and anchor the conversation on value and business outcomes before discussing price.",
    failConditions: "Gives a price without establishing value or dodges the question entirely",
    winningResponse: "Perfect price deferral! You anchored value before discussing investment.",
    losingResponse: "Never give price before establishing value and understanding their needs. Defer thoughtfully.",
    winningExamples: [
      "Great question — and I want to give you an honest answer. Pricing depends on your traffic volume, the number of channels, and the level of strategic support. Before I quote you, can I understand your use case better? That way I can give you a number that actually maps to the value you'd get.",
      "Happy to get into pricing. Typically our enterprise customers invest between $150K and $500K annually, depending on scope. But before we go there, I want to make sure the ROI math works for you. Can I ask about your current digital revenue?",
      "Totally fair question. I don't want to give you a number out of context though. Our pricing is based on the value we deliver — and that depends on your traffic, revenue, and what you're trying to achieve. Can we spend 5 minutes on that so I can give you an accurate range?",
      "I appreciate the directness. Let me be equally direct: pricing varies based on scope, but more importantly, I want to make sure the business case justifies any investment. What's your annual digital revenue? That helps me frame the ROI conversation alongside pricing."
    ],
    losingExamples: [
      "It's $300K per year.",
      "I'll have to get back to you on pricing.",
      "It depends... I can't really give you a number yet.",
      "Pricing isn't really my area — let me loop in our sales team."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Anchoring", "Price Deferral", "Business Case Framing"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Great question — pricing depends on your traffic volume, channels, and support level. Before I quote you, can I understand your use case better so I can give you a number that maps to the value you'd get?' Key points: 1) Don't dodge the question — acknowledge it, 2) Explain what drives pricing, 3) Tie price to value by understanding their business first.",
    lawnIssues: ["unclear budget ownership between marketing and IT", "upcoming budget planning cycle"]
  },
  {
    id: "rp-11",
    name: "That's way over our budget",
    role: "The Budget Blocker",
    phase: "Chapter 2",
    context: "Pricing → Budget Objection",
    objection: "That's way over our budget.",
    passCriteria: "Reframe the conversation from cost to ROI, explore budget flexibility, and identify creative structuring options without immediately discounting.",
    failConditions: "Immediately offers a discount or agrees the price is too high",
    winningResponse: "Great job reframing from cost to investment and ROI!",
    losingResponse: "Never lead with a discount. Reframe around ROI and explore budget flexibility first.",
    winningExamples: [
      "I hear you — and I want to make sure this makes financial sense. Let me ask: if I could show you that Monetate would generate 5-8x return on that investment within the first year, would that change the conversation? Because the real question isn't what it costs — it's what it returns.",
      "Understood. Can I ask — when you say over budget, is that the total annual amount, or is there flexibility if we structure it differently? For example, some customers start with a focused deployment on their highest-traffic pages and expand from there.",
      "I appreciate the transparency. Let me reframe it: our average customer generates $3-5M in incremental revenue from a $250K investment. So it's not really a cost — it's a profit center. Would it help if I built a custom business case you could take to your CFO?",
      "Fair point. Two things I'd want to explore: first, what budget were you expecting? And second, is the challenge the total amount or the timing? We have customers who phase the deployment to align with budget cycles."
    ],
    losingExamples: [
      "We can probably do something on the price. Let me talk to my manager.",
      "Yeah, I know it's expensive. What's your budget?",
      "We have a smaller package that might work.",
      "I understand — maybe this isn't the right time."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["ROI Reframing", "Creative Deal Structuring", "Executive Selling"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'I hear you. If I could show you that Monetate would generate 5-8x return on that investment, would that change the conversation? The real question isn't what it costs — it's what it returns.' Key points: 1) Never discount immediately, 2) Reframe from cost to investment/ROI, 3) Explore phased deployments or creative structuring, 4) Offer to build a CFO-ready business case.",
    lawnIssues: ["budget allocated to other digital transformation projects", "CFO requiring detailed ROI justification for any new SaaS spend"]
  },
  {
    id: "rp-12",
    name: "Your competitor is 40% cheaper",
    role: "The Comparison Shopper",
    phase: "Chapter 2",
    context: "Pricing → Competitive Price Pressure",
    objection: "Your competitor is 40% cheaper.",
    passCriteria: "Reframe from price to total value and outcomes, differentiate on specific capabilities, and address the hidden costs of cheaper alternatives.",
    failConditions: "Attacks the competitor, immediately price matches, or gets defensive",
    winningResponse: "Excellent differentiation! You competed on value, not price.",
    losingResponse: "Don't compete on price. Compete on outcomes, total cost of ownership, and strategic value.",
    winningExamples: [
      "That's a meaningful difference — and I'd expect you to evaluate that seriously. Can I ask which competitor? The reason is that 40% cheaper usually means different scope, different support model, or different performance. I want to make sure you're comparing apples to apples.",
      "Appreciate the transparency. Here's what I'd ask: what's included in that price? When we do competitive teardowns, we typically find that the gap narrows significantly when you factor in implementation support, strategic services, and actual performance guarantees. What matters most to you?",
      "Fair point. Let me be honest — we're rarely the cheapest option. But we are consistently the highest-performing. If the 40% savings comes with 30% less revenue impact, that's not actually savings — it's lost revenue. Would you be open to comparing projected outcomes side by side?",
      "I hear you. A few of our largest customers came to us after choosing the cheaper option first. The total cost of ownership — including implementation rework, slower time to value, and limited support — ended up being higher. Can I share one specific example?"
    ],
    losingExamples: [
      "Who is it? They probably can't do half of what we do.",
      "We can match that price. Let me talk to my VP.",
      "You get what you pay for.",
      "That competitor is going out of business anyway."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Value Selling", "TCO Analysis", "Competitive Differentiation"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'That's a meaningful difference. Can I ask which competitor? 40% cheaper usually means different scope, different support model, or different performance. I want to make sure you're comparing apples to apples.' Key points: 1) Don't bash the competitor or match price, 2) Ask what's included in the competitive quote, 3) Reframe around total value, not just license cost, 4) Share a 'switched from competitor' story if you have one.",
    lawnIssues: ["risk of choosing lowest-cost option and getting poor results", "hidden costs of implementation and re-platforming later"]
  },
  {
    id: "rp-13",
    name: "We need to run this by legal and procurement",
    role: "The Cautious Buyer",
    phase: "Chapter 2",
    context: "Closing → Procurement Navigation",
    objection: "We need to run this by legal and procurement.",
    passCriteria: "Normalize the procurement process, offer to help navigate it, and maintain deal momentum by setting specific next steps and timelines.",
    failConditions: "Gets frustrated, tries to bypass procurement, or loses control of the timeline",
    winningResponse: "Well done! You embraced the process and maintained momentum with specific next steps.",
    losingResponse: "Never try to skip procurement. Help them navigate it and keep the deal moving forward.",
    winningExamples: [
      "Absolutely — that's standard for enterprise deals. Let me help: I can provide a redlined MSA, security questionnaire responses, and compliance documentation upfront. Who in legal and procurement should I be working with? And what's a realistic timeline for their review?",
      "Of course — we deal with enterprise procurement all the time. A few things that usually speed up the process: we have a pre-approved security audit, SOC 2 Type II compliance, and a standard DPA. Can I send those over today? And would it help if I joined a call with your procurement team?",
      "Makes total sense. I want to make this as smooth as possible. Can we map out the procurement process together? I'd like to know: what are the typical review steps, who are the key stakeholders, and what's the target timeline? That way I can have everything ready.",
      "Understood — and I want to be a resource, not a bottleneck. We've been through this process with companies like yours many times. Let me send over our standard enterprise agreement, compliance docs, and a procurement FAQ. What else would help your team move quickly?"
    ],
    losingExamples: [
      "Can we just do a verbal agreement and work out the paperwork later?",
      "Legal always slows things down. Can your champion push this through?",
      "How long is this going to take? We need to close this quarter.",
      "I'll just wait for them to reach out to me."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Process Navigation", "Multi-Threading", "Deal Acceleration"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Absolutely — that's standard for enterprise deals. Let me help: I can provide a redlined MSA, security docs, and compliance materials upfront. Who in legal and procurement should I be working with?' Key points: 1) Normalize procurement as expected, not a setback, 2) Offer specific materials proactively, 3) Get names and timelines to maintain control, 4) Multi-thread by connecting with procurement directly.",
    lawnIssues: ["complex security review process with 6-8 week timeline", "multiple stakeholders required for vendor approval"]
  },
  {
    id: "rp-14",
    name: "I need to think about it and get back to you",
    role: "The Indecisive Prospect",
    phase: "Chapter 2",
    context: "Closing → Handling Stalls",
    objection: "I need to think about it and get back to you.",
    passCriteria: "Isolate the specific concern behind the stall, address it directly, and set a concrete next step with a specific date.",
    failConditions: "Accepts the stall or pressures for an immediate decision",
    winningResponse: "Great job isolating the real concern and securing a concrete next step!",
    losingResponse: "Always ask what specifically they need to think about. 'Think about it' is never the real objection.",
    winningExamples: [
      "Totally fair — this is a big decision. Can I ask, what specifically are you weighing? Is it the ROI case, the implementation timeline, internal alignment, or something else? If I can address it now, it might save you some back-and-forth.",
      "I respect that. Help me understand though — is there a specific concern I haven't addressed, or do you need to align with other stakeholders? Because if it's the latter, I'd love to help you build the internal case.",
      "Makes sense. Before we pause, let me ask: if it were entirely your decision, would you move forward? I want to make sure I've addressed your concerns directly, and if there are other stakeholders involved, I can help prepare materials for those conversations.",
      "Understood. One thing I've learned is that 'think about it' usually means there's a specific question I haven't answered. What would you need to see or hear to feel confident moving forward? Let's tackle that now."
    ],
    losingExamples: [
      "Sure, take your time and let me know.",
      "Okay, I'll follow up next week.",
      "No problem — I'll send you some more materials.",
      "We're running a promotion that ends this month, so I'd encourage you to decide soon."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Stakeholder Mapping", "Deal Progression"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Totally fair — can I ask, what specifically are you weighing? Is it the ROI case, implementation timeline, internal alignment, or something else? If I can address it now, it might save some back-and-forth.' Key points: 1) Acknowledge their need to think, 2) Ask WHAT specifically, 3) If it's stakeholder alignment, offer to help build the internal business case, 4) Always set a specific follow-up date.",
    lawnIssues: ["internal stakeholder alignment needed across marketing, IT, and finance", "competing priorities on the digital roadmap"]
  },
  {
    id: "rp-15",
    name: "Send me a proposal and I'll review it",
    role: "The Defeater",
    phase: "Chapter 2",
    context: "Closing → Securing Commitment",
    objection: "Send me a proposal and I'll review it.",
    passCriteria: "Qualify what they need in the proposal, understand their decision criteria, and set a specific review meeting rather than sending into a void.",
    failConditions: "Sends a proposal without qualifying or securing a review meeting",
    winningResponse: "Excellent control! You qualified the proposal request and secured a review meeting.",
    losingResponse: "Never send a proposal into a void. Understand their criteria and schedule a review session.",
    winningExamples: [
      "Happy to put something together. Before I do, can I ask — what would you need to see in the proposal to feel confident moving forward? I want to tailor it to your specific decision criteria, not just send a generic deck.",
      "Absolutely — I want to make sure the proposal addresses exactly what you care about. Can we spend 5 minutes aligning on what should be included? And then let's book a 30-minute review session so I can walk you through it live rather than leaving you to interpret it cold.",
      "Of course. Two things I'd like to do: first, understand your evaluation criteria so I can customize the proposal. Second, let's schedule a review call — proposals are always better when I can walk you through the business case and answer questions in real time. Does Thursday work?",
      "I'll get that done. Quick question — who else will be reviewing it? I want to make sure I include the right level of detail for each stakeholder. And can we set a 30-minute walkthrough? That's typically where the magic happens."
    ],
    losingExamples: [
      "Sure, I'll send something over this week.",
      "Great, I'll email you a proposal and follow up next month.",
      "No problem — I'll put together our standard proposal.",
      "I'll have our team draft something and send it your way."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Qualification", "Process Control", "Stakeholder Engagement"],
    durationSeconds: 90,
    scriptHint: "Try saying: 'Happy to put something together. What would you need to see in the proposal to feel confident moving forward? And let's book a review session so I can walk you through it live.' Key points: 1) Agree to the proposal request, 2) Qualify their decision criteria, 3) Always schedule a live review meeting, 4) Ask who else will review to identify additional stakeholders.",
    lawnIssues: ["multiple decision makers who need to be aligned", "internal business case needed for budget approval"]
  },
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Ultimate Test",
    phase: "Post-Training",
    context: "Final Certification Assessment",
    objection: "Yeah? What's this about? I've got a lot on my plate right now.",
    passCriteria: "Demonstrate mastery across discovery, demo, objection handling, and closing phases — including navigating multiple objections professionally and advancing toward a concrete next step.",
    failConditions: "Fails to navigate multiple objections, loses control of the conversation, or cannot advance past discovery",
    winningResponse: "Congratulations! You have demonstrated mastery across all phases of the enterprise sales process.",
    losingResponse: "Review all chapters and practice each phase — discovery, demo, pricing, and closing — before retrying.",
    winningExamples: [
      "Smooth navigation from discovery through demo to pricing with strong MEDDPICC qualification throughout.",
      "Successfully handled competitive objection, budget concern, and stakeholder alignment — advancing to a scheduled next step with multiple stakeholders.",
      "Excellent executive presence with tight discovery, value-anchored pricing, and a concrete close with a pilot proposal."
    ],
    losingExamples: [
      "Got stuck on a single objection without advancing the conversation.",
      "Lost control by doing a feature dump instead of consultative discovery.",
      "Failed to multi-thread or identify additional stakeholders."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 85,
    buySignal: 20,
    traits: ["Full Sales Cycle", "MEDDPICC Mastery", "Executive Selling", "Multi-Threading"],
    durationSeconds: 240,
    isCertification: true,
    scriptHint: "This is your final assessment. You'll face multiple objections across the entire enterprise sales cycle. Remember: 1) Lead with discovery — ask before you tell, 2) Use MEDDPICC to qualify the opportunity, 3) Anchor value before discussing price, 4) Multi-thread by identifying and engaging multiple stakeholders, 5) Always secure a concrete next step with a specific date and attendees.",
    lawnIssues: ["declining conversion rates across channels", "competitive pressure from digitally-native brands", "CFO scrutiny on MarTech spend", "internal alignment challenges across marketing, IT, and merchandising"]
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

  const businessIssuesSection = config.lawnIssues && config.lawnIssues.length > 0 
    ? `\nYOUR BUSINESS CHALLENGES (IMPORTANT - Your company DOES have these challenges):
${config.lawnIssues.map(issue => `- ${issue}`).join('\n')}
- NEVER deny these challenges exist if the rep asks about them
- NEVER penalize the rep for correctly identifying these challenges
- If the rep identifies a challenge, acknowledge it naturally ("That's actually something we've been discussing internally" or "You're not wrong about that")` 
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
  * "Look, I really am short on time here..." (to remind them to address time)
  * "I still don't see why this matters for us..." (to prompt them to connect value)
  * "What specifically are you proposing?" (to help them be more concrete)
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

  return `You are playing the role of an enterprise buyer in a B2B SaaS sales training simulation for Monetate, an experience optimization and personalization platform.

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)
${goalTypeSection}
${businessIssuesSection}
${coachingInstructions}

SCENARIO CONTEXT:
${config.context}

YOUR BEHAVIOR GUIDELINES:
1. Start with your opening objection: "${config.objection}"
2. Stay in character as a realistic enterprise buyer (VP, Director, or C-level) throughout
3. React naturally to what the sales rep says
4. If the rep handles your objection well (${config.passCriteria}), gradually become more open
5. If the rep handles it poorly (${config.failConditions}), become more resistant or end the conversation
6. Keep responses concise (1-3 sentences typically) - you're a busy executive

WHAT SUCCESS LOOKS LIKE:
${config.passCriteria}

WHAT FAILURE LOOKS LIKE:
${config.failConditions}
${winningExamplesSection}
${losingExamplesSection}
${successVoiceCue}

IMPORTANT RULES:
- This is a VOICE conversation - do NOT ask for slide decks, PDFs, or written proposals
- If you want proof, ask the rep to DESCRIBE results, SHARE case studies verbally, or EXPLAIN their approach
- Do NOT request anything that cannot be shared in a voice call
- The rep does NOT have access to physical materials during this call

CONVERSATION FLOW:
- Be a realistic enterprise buyer, not a robot
- React to tone, confidence, and business acumen, not just words
- If the rep earns your attention with strong discovery or insights, show increasing interest
- If the rep loses you with generic pitching or poor listening, politely (or firmly) end the conversation
- The conversation should last 60-90 seconds maximum
- You do NOT need to use the full time - if the rep succeeds early, give them the success cue

Remember: You are training enterprise SaaS sales reps to be better at their job. Stay in character but be fair.`;
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
        assistantName: "Enterprise Buyer",
        userName: "Sales Rep"
      }
    },
    maxDurationSeconds: 300,
    backgroundSound: "off",
    endCallFunctionEnabled: false
  };
}
