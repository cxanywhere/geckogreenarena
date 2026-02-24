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
    losingResponse: "You need to respect their schedule and lead with a sharp discovery question, not a services pitch.",
    winningExamples: [
      "Completely respect that — let me make the most of your 5 minutes. Quick question: what's your current approach to scaling your sales team when you need to enter a new market or ramp pipeline quickly?",
      "Understood — I'll keep it tight. In 5 minutes I just want to understand one thing: what's the biggest bottleneck in your sales pipeline right now? Then we can decide if a longer conversation makes sense.",
      "Appreciate that. Let me ask you one thing — when your team looks at pipeline generation targets versus actual output, are you seeing a gap between what you need and what your current team can deliver?",
      "Totally fair. Here's what I'd love to cover in 5 minutes: understand your biggest challenge around pipeline generation or sales capacity, and if MarketStar can help, we'll book a proper deep-dive. Sound fair?"
    ],
    losingExamples: [
      "Great, so let me walk you through our company — MarketStar has been around for 35 years and we serve over 600 enterprise clients...",
      "Can we reschedule for when you have more time?",
      "I'll send you some materials and you can review them later.",
      "This will only take 30 minutes, I promise it's worth it."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 60,
    traits: ["Time Management", "Discovery Questions", "Executive Presence"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Completely respect that — let me make the most of your 5 minutes. Quick question: what's your current approach to scaling your sales team when you need to enter a new market or ramp pipeline quickly?' Key points: 1) Acknowledge the time constraint immediately, 2) Set a focused agenda, 3) Ask a high-value discovery question that qualifies the opportunity and gets them talking about their sales challenges.",
    lawnIssues: ["declining pipeline generation from internal SDR team", "difficulty hiring and retaining quality sales reps"]
  },
  {
    id: "rp-02",
    name: "We tried outsourcing sales before, it didn't work",
    role: "The Skeptic",
    phase: "Chapter 1",
    context: "Discovery → Handling Past Failures",
    objection: "We tried outsourcing sales before, it didn't work.",
    passCriteria: "Empathize with the past failure, ask diagnostic questions about what they tried and why it failed, and differentiate MarketStar's approach.",
    failConditions: "Dismisses their experience or immediately pitches without understanding what went wrong",
    winningResponse: "Excellent recovery! You validated their experience and dug into the root cause.",
    losingResponse: "You need to understand their past experience before positioning MarketStar as different.",
    winningExamples: [
      "That's actually really common — and honestly, most outsourced sales implementations fail for a few specific reasons. Can I ask what you tried? Was it a staffing agency model, or was the partner running a full managed sales program?",
      "I hear that a lot, and I appreciate the honesty. The question I'd ask is — was the challenge with rep quality, the ramp-up process, or alignment with your internal team? Because those are three very different problems.",
      "Makes total sense — a lot of our best customers came to us after a failed attempt with another provider. What specifically didn't work? Was it lack of pipeline visibility, poor rep training, or something else?",
      "I appreciate you sharing that. Can you tell me more about what you tried? We've found that 80% of failed outsourcing engagements fail because of poor onboarding and lack of integration with the client's sales process, not the outsourcing model itself."
    ],
    losingExamples: [
      "Well, MarketStar is different because we've been doing this for 35 years...",
      "That's because you probably used the wrong vendor. We're much better.",
      "Sales outsourcing has come a long way since then, let me show you our model.",
      "I understand, but every company needs to scale sales efficiently."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Empathy", "Diagnostic Discovery", "Differentiation"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's actually really common — most outsourced sales implementations fail for specific reasons. Can I ask what you tried? Was it a staffing agency model, or was the partner running a full managed sales program?' Key points: 1) Validate their experience — don't dismiss it, 2) Ask diagnostic questions to understand the root cause, 3) Position yourself as someone who can help them avoid the same mistakes.",
    lawnIssues: ["previous outsourcing partner had poor rep retention", "lack of pipeline visibility from past vendor"]
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
      "That's fair — can I ask, what would need to change for you to be ready? Is it a headcount question, a budget cycle thing, or something else entirely?",
      "Understood. When you say not ready, is that about internal bandwidth, or is there a specific hiring plan that needs to play out first? I ask because most of our customers started their evaluation 3-6 months before they actually launched their outsourced team.",
      "I hear you. Let me ask it this way — every quarter you wait to ramp pipeline, what does that cost in missed revenue opportunities? We typically see companies leaving 20-30% of their addressable market untapped when they can't scale sales fast enough. Is that something you can afford to delay?",
      "Makes sense. A lot of enterprise teams feel that way. Can I share what the typical ramp timeline looks like? Most of our customers started the conversation well before they were 'ready' — and that head start meant reps were producing pipeline 60 days sooner."
    ],
    losingExamples: [
      "No worries, I'll check back in next quarter.",
      "You need to move fast — your competitors are already outsourcing to scale.",
      "Okay, when do you think you'll be ready?",
      "I understand, let me send you some materials for when the time is right."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 45,
    traits: ["Cost of Inaction", "Diagnostic Questions", "Consultative Urgency"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's fair — can I ask, what would need to change for you to be ready? Is it a headcount question, a budget cycle thing, or something else entirely?' Key points: 1) Don't accept 'not ready' at face value, 2) Ask what specifically needs to change, 3) Quantify the cost of waiting — missed pipeline, slower market entry, 4) Position the evaluation process as something that takes time and should start now.",
    lawnIssues: ["losing market share to faster-moving competitors", "open sales headcount unfilled for 4+ months"]
  },
  {
    id: "rp-04",
    name: "We want to hire our own sales team internally",
    role: "The DIY Builder",
    phase: "Chapter 1",
    context: "Demo → In-House Hiring Objection",
    objection: "We want to hire our own sales team internally.",
    passCriteria: "Respect their preference for internal hiring, ask about the timeline, cost, and ramp challenges, and position MarketStar as complementary or faster to results.",
    failConditions: "Insults internal hiring or dismisses in-house sales teams entirely",
    winningResponse: "Perfect! You respected their preference and highlighted the hidden costs of building internally.",
    losingResponse: "Never dismiss their desire to build in-house. Explore the total cost, time-to-productivity, and opportunity cost.",
    winningExamples: [
      "That's great — building an internal team gives you a lot of control. Can I ask, what's your current time-to-hire and ramp timeline? The reason I ask is most companies we talk to find that it takes 6-9 months to get a new rep fully productive, and that's if they don't churn in the first year.",
      "Love that — you clearly value cultural fit and brand alignment. A few things I'd be curious about: what's your current cost-per-hire for sales reps, and what's your attrition rate? Those are usually where internal scaling hits a ceiling.",
      "That makes sense — a lot of our best customers started that way. The question is whether your leadership team should be spending their cycles recruiting, training, and managing more headcount or focusing on strategy and closing. What's the opportunity cost?",
      "Respect that. How's the hiring going? I'd love to understand your timeline. Often we find that internal hiring handles the first 5-10 reps well but struggles to scale quickly when you need 20, 50, or 100 reps across multiple markets."
    ],
    losingExamples: [
      "Internal sales teams never perform as well as outsourced specialists.",
      "That must be a nightmare to recruit for in this market.",
      "How many months have those positions been open?",
      "Let me show you why outsourcing is better than anything you could build internally."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 35,
    buySignal: 65,
    traits: ["Respect", "TCO Analysis", "Strategic Positioning"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's great — building an internal team gives you a lot of control. Can I ask, what's your current time-to-hire and ramp timeline?' Key points: 1) Genuinely respect their preference for internal hiring, 2) Ask about cost-per-hire, ramp time, and attrition, 3) Position the conversation around speed and opportunity cost — should leadership focus on recruiting or revenue strategy?",
    lawnIssues: ["6-month average time-to-hire for SDR roles", "40% first-year attrition rate for new sales hires"]
  },
  {
    id: "rp-05",
    name: "We already have an outsourcing partner",
    role: "The Incumbent Loyalist",
    phase: "Chapter 1",
    context: "Demo → Incumbent Vendor Objection",
    objection: "We already have an outsourcing partner.",
    passCriteria: "Acknowledge their current partner without bashing, ask about satisfaction and gaps, and position MarketStar's differentiated value.",
    failConditions: "Attacks the competitor or tries to do a feature-by-feature comparison",
    winningResponse: "Excellent! You planted seeds of doubt without being combative.",
    losingResponse: "Never bash competitors. Understand their satisfaction level and find gaps in their current setup.",
    winningExamples: [
      "Got it — who are you working with? Not to bash them, but so I understand the model. How's it working for you? Specifically, are you getting the level of pipeline quality and rep retention you need, or is it more of a staffing play?",
      "Makes sense — there are some good firms out there. Can I ask, what's your experience been with their ramp time and integration with your CRM and sales process? That's one area where our customers tell us there's a significant difference.",
      "Good to know. I'm not here to compete on price — but I am curious: are your outsourced reps using your tech stack, your playbooks, and reporting into your pipeline tools? That's an area where we tend to see a meaningful gap with most providers.",
      "Understood. Are you locked into a contract, or is there flexibility to evaluate alternatives? The reason I ask is that a lot of companies come to MarketStar specifically because of our Sales as a Service® model — fully embedded reps that operate like an extension of your team, not a call center."
    ],
    losingExamples: [
      "Most outsourcing companies are terrible — they just do body-shopping.",
      "We're so much better than whoever you're using, let me show you.",
      "Why are you still with them? Everyone is switching to us.",
      "Let me do a comparison to show you where they fall short."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 45,
    buySignal: 55,
    traits: ["Competitive Intelligence", "Gap Analysis", "Consultative Selling"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Got it — how's it working for you? Specifically, are you getting the level of pipeline quality and rep retention you need, or is it more of a staffing play?' Key points: 1) Never bash the competitor, 2) Ask about satisfaction and specific capability gaps, 3) Probe areas where MarketStar differentiates (Sales as a Service® model, embedded reps, Nytro.ai enablement, full revenue operations support).",
    lawnIssues: ["high rep turnover from current outsourcing vendor", "limited pipeline visibility and reporting from current partner"]
  },
  {
    id: "rp-06",
    name: "Outsourced reps won't understand our product",
    role: "The Concerned Buyer",
    phase: "Chapter 1",
    context: "Demo → Product Knowledge Concern",
    objection: "Outsourced reps won't understand our product well enough to sell it.",
    passCriteria: "Ask clarifying questions about their product complexity, then clearly articulate MarketStar's training, enablement, and embedded model that ensures deep product knowledge.",
    failConditions: "Launches into generic claims or fails to address their specific product complexity concerns",
    winningResponse: "Great clarity! You connected MarketStar's enablement approach directly to their product complexity.",
    losingResponse: "Always tie your response to their specific product and how MarketStar trains and enables reps.",
    winningExamples: [
      "Great question — and I wouldn't want you to invest if the reps weren't going to represent your brand well. Can you tell me about the complexity of your sale? Average deal size, sales cycle length, and buyer personas? That way I can explain how we'd build the enablement program.",
      "Fair pushback. Let me ask it this way: what does your current onboarding look like for internal reps? Because our Nytro.ai platform actually accelerates product knowledge training and we build custom playbooks for every client engagement. The ramp time often beats internal hiring.",
      "I appreciate that — let me not waste your time with a generic answer. What are the top 2 things a rep needs to know to have a credible conversation with your buyers? I'll tell you honestly whether our model supports that level of depth.",
      "That's the right concern to raise. Here's what I hear most from companies with complex products: they assumed outsourced reps couldn't go deep enough. But our Sales as a Service® model means reps are fully dedicated to your account, trained on your product, and embedded in your tech stack. They're your team — they just sit on our payroll."
    ],
    losingExamples: [
      "Well, we train our reps really well on every product...",
      "We've sold everything from SaaS to hardware — we can learn anything.",
      "Trust me, once you see how we work you'll understand.",
      "Our reps are all college-educated professionals."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 70,
    traits: ["Active Listening", "Targeted Messaging", "Consultative Approach"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Can you tell me about the complexity of your sale — deal size, cycle length, buyer personas? That way I can explain how we'd build the enablement program.' Key points: 1) Don't give a generic answer, 2) Ask what their product complexity looks like, 3) Explain MarketStar's dedicated rep model, Nytro.ai training platform, and custom playbooks.",
    lawnIssues: ["technical product requiring deep domain expertise", "long 6-12 month enterprise sales cycles with multiple stakeholders"]
  },
  {
    id: "rp-07",
    name: "Our pipeline is fine — we don't need help",
    role: "The Denialist",
    phase: "Chapter 2",
    context: "Demo → Challenging the Status Quo",
    objection: "Our pipeline is fine — we don't need outside help.",
    passCriteria: "Validate their perspective, introduce benchmarking data, and help them see the gap between 'fine' and 'optimized.'",
    failConditions: "Argues that their pipeline is bad or insists they have a problem without data",
    winningResponse: "Well done! You showed the gap between 'fine' and 'great' with data.",
    losingResponse: "Never tell a prospect their pipeline is broken. Use benchmarks and 'what if' scenarios to reveal opportunity.",
    winningExamples: [
      "That's great — and I'm sure your team has worked hard to build it. Can I ask, what's your current pipeline coverage ratio? The reason I ask is we typically see companies in your space need 3-4x coverage, and most find a meaningful gap between what they have and what they need to hit their number.",
      "Good to hear. Let me ask it this way — if I could show you how to add 30-40% more qualified pipeline without adding internal headcount, would that be worth exploring? We're not here to replace your team — we're here to extend their capacity.",
      "Makes sense — but here's what I'd challenge: 'fine' and 'optimized' are two very different things. Most of our customers thought their pipeline was fine too, until they saw what was possible when they added a dedicated SDR/BDR team focused exclusively on outbound. What does your outbound-to-inbound pipeline ratio look like?",
      "I appreciate that confidence. Quick question — are you measuring pipeline generation by rep, by segment, and by channel? Because aggregate numbers often mask that your best reps are carrying the team while others are underperforming."
    ],
    losingExamples: [
      "Actually, based on industry benchmarks, your pipeline coverage is below average.",
      "Fine isn't good enough when you have aggressive growth targets.",
      "Your competitors are scaling with outsourced sales teams, you can't afford to wait.",
      "If your pipeline were really fine, you wouldn't be taking this meeting."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 35,
    traits: ["Benchmarking", "Data-Driven Selling", "Opportunity Framing"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Can I ask, what's your current pipeline coverage ratio? We typically see companies need 3-4x coverage, and most find a gap between what they have and what they need.' Key points: 1) Never tell them they're wrong, 2) Use benchmark data to create a reference point, 3) Shift from 'fixing broken' to 'unlocking additional capacity.'",
    lawnIssues: ["pipeline coverage ratio below 3x", "over-reliance on inbound leads with limited outbound"]
  },
  {
    id: "rp-08",
    name: "Sales outsourcing isn't a priority right now",
    role: "The Apathetic Stakeholder",
    phase: "Chapter 2",
    context: "Objection Handling → Priority Objection",
    objection: "Sales outsourcing isn't a priority right now.",
    passCriteria: "Understand their current priorities, then connect outsourced sales to what they already care about — revenue growth, faster market entry, or cost efficiency.",
    failConditions: "Argues that outsourcing should be a priority or fails to connect to their existing goals",
    winningResponse: "Great job connecting outsourced sales to what they actually care about!",
    losingResponse: "Don't argue about priorities. Understand theirs and show how outsourced sales enables them.",
    winningExamples: [
      "Completely understand — what is the top priority right now? The reason I ask is that outsourced sales often isn't a standalone initiative; it's a lever that accelerates whatever you're already focused on, whether that's entering a new market, scaling pipeline, or hitting an aggressive revenue target.",
      "Fair enough. Can I ask what's at the top of your roadmap this year? I ask because our most successful customers didn't start with outsourcing as a priority — they started with a revenue goal and realized outsourced sales was the fastest path to getting there.",
      "That makes sense. What if I reframed it — instead of outsourcing as a project, think of it as a way to add 20 qualified pipeline-generating reps in 60 days without the hiring, training, and management burden. If you're under pressure to hit targets, that's not outsourcing — it's capacity on demand.",
      "Got it. What are your top 3 priorities this year? I want to make sure I'm not wasting your time — but if any of them involve growing revenue, entering new segments, or improving pipeline velocity, there's a direct connection I'd like to show you."
    ],
    losingExamples: [
      "Sales outsourcing should absolutely be a priority — every high-growth company is doing it.",
      "Your competitors are all scaling with outsourced teams, you can't afford to wait.",
      "Okay, I'll follow up next quarter when it might be a priority.",
      "But outsourcing drives so much pipeline growth..."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 70,
    buySignal: 25,
    traits: ["Priority Alignment", "Strategic Framing", "Business Acumen"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Completely understand — what is the top priority right now? Outsourced sales often isn't a standalone initiative; it's a lever that accelerates whatever you're already focused on.' Key points: 1) Accept their priorities without arguing, 2) Ask what IS a priority, 3) Connect outsourced sales as an enabler of their existing goals, not a separate project.",
    lawnIssues: ["aggressive revenue targets with flat headcount budget", "board pressure to expand into new markets faster"]
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
      "Absolutely — I was hoping you'd ask. Let me share three data points: a Fortune 500 tech company saw 150% pipeline growth in 90 days, a mid-market SaaS company generated $8M in qualified pipeline in year one, and on average our customers see 3-5x ROI within the first year. I can connect you with a reference customer in your vertical if that would help.",
      "Great question. Here's what I can share: across our customer base, the average MarketStar-powered SDR team generates 40-60 qualified meetings per rep per month. For a company your size, that translates to roughly $X million in pipeline. Want me to build a custom business case for your specific metrics?",
      "Happy to. Let me share our benchmark data: enterprise clients using our Sales as a Service® model see an average 35% reduction in cost-per-qualified-meeting and 2x faster rep ramp time. I'd also love to build a custom ROI model based on your deal size and pipeline targets — would that be helpful?",
      "Of course. Rather than give you generic numbers, can you share your current pipeline targets and average deal size? I'll build you a specific ROI projection. In the meantime, here's a reference: a mid-market tech company in your space generated $12M in pipeline in their first year with a 20-rep MarketStar team."
    ],
    losingExamples: [
      "Our customers typically see great ROI. I can send you some case studies.",
      "Outsourcing always pays for itself. Trust me.",
      "I don't have exact numbers, but I know it works.",
      "ROI varies by customer, so I can't really give you a number."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Data Fluency", "Business Case Building", "Credibility"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Absolutely — let me share three data points...' and reference specific customer outcomes. Key points: 1) Lead with specific numbers and named customer categories, 2) Offer to build a custom business case with their actual metrics, 3) Have 2-3 proof points ready at all times — this objection is an opportunity, not a threat.",
    lawnIssues: ["need to justify outsourcing spend to the CFO", "previous vendor failed to deliver promised pipeline targets"]
  },
  {
    id: "rp-10",
    name: "What does this cost per rep per month?",
    role: "The Price Shopper",
    phase: "Chapter 2",
    context: "Pricing → Premature Price Question",
    objection: "What does this cost per rep per month?",
    passCriteria: "Acknowledge the question, defer with a valid reason, and anchor the conversation on value and business outcomes before discussing price.",
    failConditions: "Gives a price without establishing value or dodges the question entirely",
    winningResponse: "Perfect price deferral! You anchored value before discussing investment.",
    losingResponse: "Never give price before establishing value and understanding their needs. Defer thoughtfully.",
    winningExamples: [
      "Great question — and I want to give you an honest answer. Pricing depends on the role type, the complexity of your sale, and the team size. Before I quote you, can I understand your use case better? That way I can give you a number that actually maps to the value you'd get.",
      "Happy to get into pricing. Typically our enterprise customers invest between $6K and $12K per rep per month, depending on role complexity and support level. But before we go there, I want to make sure the ROI math works for you. Can I ask about your current cost-per-hire and average ramp time?",
      "Totally fair question. I don't want to give you a number out of context though. Our pricing is based on the value we deliver — and that depends on the role, your market, and what you're trying to achieve. Can we spend 5 minutes on that so I can give you an accurate range?",
      "I appreciate the directness. Let me be equally direct: pricing varies based on scope, but more importantly, I want to make sure the business case justifies any investment. What's your current fully-loaded cost per sales rep including recruiting, benefits, management, and tools? That helps me frame the comparison alongside pricing."
    ],
    losingExamples: [
      "It's $8K per rep per month.",
      "I'll have to get back to you on pricing.",
      "It depends... I can't really give you a number yet.",
      "Pricing isn't really my area — let me loop in our solutions team."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 60,
    traits: ["Value Anchoring", "Price Deferral", "Business Case Framing"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Great question — pricing depends on role type, sale complexity, and team size. Before I quote you, can I understand your use case better so I can give you a number that maps to the value you'd get?' Key points: 1) Don't dodge the question — acknowledge it, 2) Explain what drives pricing, 3) Tie price to value by understanding their business first.",
    lawnIssues: ["unclear budget ownership between sales and finance", "upcoming fiscal year planning cycle"]
  },
  {
    id: "rp-11",
    name: "That's way too expensive — we can hire internally for less",
    role: "The Budget Blocker",
    phase: "Chapter 2",
    context: "Pricing → Budget Objection",
    objection: "That's way too expensive — we can hire internally for less.",
    passCriteria: "Reframe the conversation from cost-per-rep to total cost of ownership and speed to revenue, explore hidden costs of internal hiring, and avoid immediately discounting.",
    failConditions: "Immediately offers a discount or agrees the price is too high",
    winningResponse: "Great job reframing from cost-per-rep to total cost of ownership and speed to revenue!",
    losingResponse: "Never lead with a discount. Reframe around total cost, ramp time, and speed to pipeline.",
    winningExamples: [
      "I hear you — and I want to make sure this makes financial sense. Let me ask: when you factor in recruiting costs, benefits, management overhead, tools, training, and the 6-9 month ramp period — what's the real fully-loaded cost per rep? Because when customers do that math, MarketStar is typically 30-40% less expensive for the same output.",
      "Understood. Can I ask — when you say cheaper internally, are you including the recruiting timeline, the ramp-to-productivity period, and the risk of attrition? For example, if a rep churns at month 8, you've invested 14 months of cost with zero return. Our model eliminates that risk.",
      "I appreciate the transparency. Let me reframe it: our average customer gets a fully productive rep in 45-60 days versus 6-9 months for an internal hire. That's 4-7 months of pipeline you'd be missing. Would it help if I built a total-cost comparison that includes time-to-revenue?",
      "Fair point. Two things I'd want to explore: first, what's your fully-loaded cost per internal rep? And second, is the challenge the per-rep cost or the total investment? We have customers who start with a focused 5-rep pilot and expand based on results."
    ],
    losingExamples: [
      "We can probably do something on the price. Let me talk to my manager.",
      "Yeah, I know it's expensive. What's your budget?",
      "We have a smaller team option that might work.",
      "I understand — maybe this isn't the right time."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 80,
    buySignal: 30,
    traits: ["ROI Reframing", "Creative Deal Structuring", "Executive Selling"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'When you factor in recruiting, benefits, management, tools, training, and the 6-9 month ramp — what's the real fully-loaded cost? Because when customers do that math, MarketStar is typically 30-40% less expensive.' Key points: 1) Never discount immediately, 2) Reframe from cost-per-rep to total cost of ownership, 3) Highlight speed to productivity — 45-60 days vs 6-9 months, 4) Offer a pilot to de-risk the investment.",
    lawnIssues: ["headcount budget allocated to other departments", "CFO requiring detailed ROI justification for any outsourcing spend"]
  },
  {
    id: "rp-12",
    name: "Another outsourcing firm quoted us 40% less",
    role: "The Comparison Shopper",
    phase: "Chapter 2",
    context: "Pricing → Competitive Price Pressure",
    objection: "Another outsourcing firm quoted us 40% less.",
    passCriteria: "Reframe from price to total value and outcomes, differentiate on specific capabilities, and address the hidden costs of cheaper alternatives.",
    failConditions: "Attacks the competitor, immediately price matches, or gets defensive",
    winningResponse: "Excellent differentiation! You competed on value, not price.",
    losingResponse: "Don't compete on price. Compete on outcomes, total cost of ownership, and strategic value.",
    winningExamples: [
      "That's a meaningful difference — and I'd expect you to evaluate that seriously. Can I ask which firm? The reason is that 40% cheaper usually means different rep quality, different enablement, or a staffing model versus a managed outcome model. I want to make sure you're comparing apples to apples.",
      "Appreciate the transparency. Here's what I'd ask: what's included in that price? When we do competitive comparisons, we typically find that the gap narrows significantly when you factor in rep retention, ramp time, management layers, and actual pipeline output. What matters most to you?",
      "Fair point. Let me be honest — we're rarely the cheapest option. But we are consistently the highest-performing. If the 40% savings comes with 50% lower pipeline output and 3x rep turnover, that's not savings — it's wasted investment. Would you be open to comparing projected outcomes side by side?",
      "I hear you. A few of our largest customers came to us after choosing the cheaper option first. The total cost — including re-hiring, re-training, lost pipeline during transitions, and management overhead — ended up being 2x higher. Can I share one specific example?"
    ],
    losingExamples: [
      "Who is it? They probably can't deliver half of what we do.",
      "We can match that price. Let me talk to my VP.",
      "You get what you pay for with outsourcing.",
      "That firm is going to churn through your reps in 3 months."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 50,
    traits: ["Value Selling", "TCO Analysis", "Competitive Differentiation"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'That's a meaningful difference. Can I ask which firm? 40% cheaper usually means different rep quality, different enablement, or a staffing model vs managed outcomes.' Key points: 1) Don't bash the competitor or match price, 2) Ask what's included in the competitive quote, 3) Reframe around total value — pipeline output, rep retention, ramp time, 4) Share a 'switched from competitor' story if you have one.",
    lawnIssues: ["risk of choosing lowest-cost outsourcer and getting poor pipeline quality", "hidden costs of rep churn and constant re-ramping"]
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
      "Absolutely — that's standard for engagements like this. Let me help: I can provide a redlined MSA, data security documentation, and compliance certifications upfront. Who in legal and procurement should I be working with? And what's a realistic timeline for their review?",
      "Of course — we work with enterprise procurement teams all the time. A few things that usually speed up the process: we have SOC 2 Type II compliance, standard data processing agreements, and flexible contract structures. Can I send those over today? And would it help if I joined a call with your procurement team?",
      "Makes total sense. I want to make this as smooth as possible. Can we map out the procurement process together? I'd like to know: what are the typical review steps, who are the key stakeholders, and what's the target timeline? That way I can have everything ready.",
      "Understood — and I want to be a resource, not a bottleneck. We've been through this process with Fortune 500 companies many times. Let me send over our standard enterprise agreement, compliance docs, and a procurement FAQ. What else would help your team move quickly?"
    ],
    losingExamples: [
      "Can we just do a verbal agreement and start the pilot while paperwork catches up?",
      "Legal always slows things down. Can your champion push this through?",
      "How long is this going to take? We need to start ramping reps this quarter.",
      "I'll just wait for them to reach out to me."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 45,
    traits: ["Process Navigation", "Multi-Threading", "Deal Acceleration"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Absolutely — that's standard for engagements like this. Let me help: I can provide a redlined MSA, security docs, and compliance materials upfront. Who in legal and procurement should I be working with?' Key points: 1) Normalize procurement as expected, not a setback, 2) Offer specific materials proactively, 3) Get names and timelines to maintain control, 4) Multi-thread by connecting with procurement directly.",
    lawnIssues: ["complex vendor approval process with 6-8 week timeline", "multiple stakeholders required across sales, finance, and legal"]
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
      "Totally fair — this is a significant decision. Can I ask, what specifically are you weighing? Is it the ROI case, the team ramp timeline, internal alignment, or something else? If I can address it now, it might save you some back-and-forth.",
      "I respect that. Help me understand though — is there a specific concern I haven't addressed, or do you need to align with other stakeholders? Because if it's the latter, I'd love to help you build the internal case.",
      "Makes sense. Before we pause, let me ask: if it were entirely your decision, would you move forward? I want to make sure I've addressed your concerns directly, and if there are other stakeholders involved, I can help prepare materials for those conversations.",
      "Understood. One thing I've learned is that 'think about it' usually means there's a specific question I haven't answered. What would you need to see or hear to feel confident moving forward? Let's tackle that now."
    ],
    losingExamples: [
      "Sure, take your time and let me know.",
      "Okay, I'll follow up next week.",
      "No problem — I'll send you some more materials.",
      "We have a limited pilot window closing this quarter, so I'd encourage you to decide soon."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 65,
    buySignal: 40,
    traits: ["Concern Isolation", "Stakeholder Mapping", "Deal Progression"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Totally fair — can I ask, what specifically are you weighing? Is it the ROI case, team ramp timeline, internal alignment, or something else? If I can address it now, it might save some back-and-forth.' Key points: 1) Acknowledge their need to think, 2) Ask WHAT specifically, 3) If it's stakeholder alignment, offer to help build the internal business case, 4) Always set a specific follow-up date.",
    lawnIssues: ["internal stakeholder alignment needed across sales, finance, and HR", "competing priorities on the sales transformation roadmap"]
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
      "Happy to put something together. Before I do, can I ask — what would you need to see in the proposal to feel confident moving forward? I want to tailor it to your specific decision criteria, not just send a generic services overview.",
      "Absolutely — I want to make sure the proposal addresses exactly what you care about. Can we spend 5 minutes aligning on what should be included? And then let's book a 30-minute review session so I can walk you through the team design, ramp plan, and ROI model live. Does Thursday work?",
      "Of course. Two things I'd like to do: first, understand your evaluation criteria so I can customize the proposal. Second, let's schedule a review call — proposals are always better when I can walk you through the business case and answer questions in real time.",
      "I'll get that done. Quick question — who else will be reviewing it? I want to make sure I include the right level of detail for your CRO versus your CFO versus your head of sales ops. And can we set a 30-minute walkthrough? That's typically where the alignment happens."
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
    durationSeconds: 300,
    scriptHint: "Try saying: 'Happy to put something together. What would you need to see in the proposal to feel confident moving forward? And let's book a review session so I can walk you through it live.' Key points: 1) Agree to the proposal request, 2) Qualify their decision criteria, 3) Always schedule a live review meeting, 4) Ask who else will review to identify additional stakeholders.",
    lawnIssues: ["multiple decision makers across sales, finance, and executive team", "internal business case needed for outsourcing budget approval"]
  },
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Ultimate Test",
    phase: "Post-Training",
    context: "Final Certification Assessment",
    objection: "Yeah? What's this about? I've got a lot on my plate right now.",
    passCriteria: "Demonstrate mastery across discovery, solution positioning, objection handling, and closing phases — including navigating multiple objections professionally and advancing toward a concrete next step.",
    failConditions: "Fails to navigate multiple objections, loses control of the conversation, or cannot advance past discovery",
    winningResponse: "Congratulations! You have demonstrated mastery across all phases of the B2B outsourced sales process.",
    losingResponse: "Review all chapters and practice each phase — discovery, solution positioning, pricing, and closing — before retrying.",
    winningExamples: [
      "Smooth navigation from discovery through solution positioning to pricing with strong MEDDPICC qualification throughout.",
      "Successfully handled internal hiring objection, budget concern, and stakeholder alignment — advancing to a scheduled next step with multiple stakeholders.",
      "Excellent executive presence with tight discovery, value-anchored pricing, and a concrete close with a pilot proposal."
    ],
    losingExamples: [
      "Got stuck on a single objection without advancing the conversation.",
      "Lost control by doing a services feature dump instead of consultative discovery.",
      "Failed to multi-thread or identify additional stakeholders."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 85,
    buySignal: 20,
    traits: ["Full Sales Cycle", "MEDDPICC Mastery", "Executive Selling", "Multi-Threading"],
    durationSeconds: 300,
    isCertification: true,
    scriptHint: "This is your final assessment. You'll face multiple objections across the entire B2B sales cycle for MarketStar services. Remember: 1) Lead with discovery — ask before you tell, 2) Use MEDDPICC to qualify the opportunity, 3) Anchor value before discussing price, 4) Multi-thread by identifying and engaging multiple stakeholders, 5) Always secure a concrete next step with a specific date and attendees.",
    lawnIssues: ["declining pipeline coverage despite growing revenue targets", "high sales rep attrition and long ramp times", "CFO scrutiny on cost-per-hire and sales ROI", "internal alignment challenges across sales, HR, and finance"]
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
    durationSeconds: 300,
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

  return `You are playing the role of an enterprise buyer in a B2B sales training simulation for MarketStar, a B2B sales outsourcing company that provides Sales as a Service® — including Pipeline Generation (SDR/BDR), New Business Acquisition (AE), Account Management, Partner Channel Services, Customer Success, Revenue Operations, and AI-powered sales enablement through Nytro.ai.

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
2. Stay in character as a realistic enterprise buyer (VP Sales, CRO, CEO, or C-level) throughout
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
- The conversation should last up to 5 minutes maximum
- You do NOT need to use the full time - if the rep succeeds early, give them the success cue

Remember: You are training B2B sales reps to sell MarketStar's outsourced sales services. Stay in character but be fair.`;
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
