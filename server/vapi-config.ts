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
}

export const VAPI_ROLEPLAY_CONFIGS: VapiRoleplayConfig[] = [
  {
    id: "rp-01",
    name: "What exactly is LinkedIn Marketing Solutions?",
    role: "New Demand Gen Manager",
    phase: "Chapter 1",
    context: "Elevator Explanation → Product Overview",
    objection: "What exactly is LinkedIn Marketing Solutions, and why would I use it instead of another ad channel?",
    passCriteria: "Give a clear, confident 30-second explanation of LMS that avoids jargon and connects to business value — reaching professional audiences, precision targeting, and measurable business outcomes.",
    failConditions: "Rambles, uses internal product jargon, lists features without connecting to value, or sounds unsure",
    winningResponse: "Great job! You explained LMS clearly and connected it to business outcomes without overwhelming them.",
    losingResponse: "You need a crisp, confident explanation that focuses on why LinkedIn matters for B2B, not a feature dump.",
    winningExamples: [
      "Great question. LinkedIn Marketing Solutions helps B2B brands reach professional audiences — people you can target by job title, seniority, industry, and company — in a trusted business environment. Unlike other ad channels, LinkedIn lets you reach the exact decision-makers who matter for your pipeline, and measure real business impact, not just clicks.",
      "In simple terms, LinkedIn helps you put the right message in front of the right business buyers. What makes it different from other channels is the targeting — you're reaching people based on their professional identity, not just browsing behavior. For B2B, that precision matters because you're selling to specific roles and buying committees.",
      "LinkedIn Marketing Solutions is LinkedIn's advertising platform for B2B marketers. The key difference versus Google or Meta is that you're targeting based on professional attributes — title, function, seniority, company size. That means you're reaching decision-makers in a business context, which is hard to replicate anywhere else.",
      "Think of it this way: Google captures intent, Meta captures interest, and LinkedIn captures professional identity. When you need to reach VP-level buyers in enterprise software companies, LinkedIn is the channel that can find them precisely. We help marketers build awareness, generate leads, and prove pipeline impact with that audience."
    ],
    losingExamples: [
      "Well, we have Sponsored Content, Lead Gen Forms, Video Ads, Carousel Ads, Document Ads, Messaging Ads, and Campaign Manager...",
      "LinkedIn is a social media platform where you can run ads.",
      "It's basically like Facebook ads but for business people.",
      "Um, so LinkedIn has a lot of products... let me think about how to explain this."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 25,
    buySignal: 65,
    traits: ["Clarity", "Confidence", "Value Articulation"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'LinkedIn Marketing Solutions helps B2B brands reach professional audiences — people you can target by job title, seniority, industry, and company — in a trusted business environment. What makes it different is precision targeting based on professional identity, not just browsing behavior.' Key points: 1) Keep it under 30 seconds, 2) Focus on professional audience and precision targeting, 3) Connect to business outcomes, not features."
  },
  {
    id: "rp-02",
    name: "Why would your lead forms perform better than my landing page?",
    role: "B2B Marketer with Poor Conversion",
    phase: "Chapter 1",
    context: "Product Knowledge → Lead Gen Forms",
    objection: "Why would your lead forms perform better than sending traffic to my site?",
    passCriteria: "Explain friction reduction and pre-filled data clearly, connect to the buyer's conversion challenge, and avoid overpromising.",
    failConditions: "Makes absolute performance guarantees, fails to explain the mechanism, or dismisses their current landing page",
    winningResponse: "Excellent! You explained the value of Lead Gen Forms clearly and connected it to their specific conversion challenge.",
    losingResponse: "You need to explain how pre-filled forms reduce friction without guaranteeing results or dismissing their current approach.",
    winningExamples: [
      "That's a fair question. The main advantage is friction reduction — LinkedIn Lead Gen Forms are pre-filled with the member's profile data, so they don't have to type in their name, title, company, or email. For mobile users especially, that can significantly reduce drop-off. It doesn't replace your landing page for every use case, but when conversion rate is the bottleneck, it's worth testing.",
      "Good question. The core idea is that when someone clicks your ad and sees a form that's already filled out with their professional details, the barrier to converting is much lower. We see this work especially well for content downloads, webinar sign-ups, and demo requests where the user just needs to confirm and submit.",
      "The short answer is friction. Your landing page requires the user to leave LinkedIn, wait for the page to load, and manually fill out a form. Lead Gen Forms keep them on LinkedIn with pre-populated fields. It's not that your landing page is bad — it's that fewer steps generally mean higher conversion rates.",
      "I wouldn't say they always perform better — it depends on your offer and audience. But the advantage is that Lead Gen Forms use LinkedIn's profile data to pre-fill fields, which reduces the effort for the user. If you're seeing people click but not convert, it's worth testing whether reducing that friction makes a difference."
    ],
    losingExamples: [
      "Our forms always outperform landing pages. It's guaranteed.",
      "Landing pages are outdated. Everyone uses Lead Gen Forms now.",
      "I'm not sure exactly how they work, but they're really popular.",
      "You should just try it and see."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 30,
    buySignal: 60,
    traits: ["Value Articulation", "Honesty", "Product Knowledge"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'The main advantage is friction reduction — Lead Gen Forms are pre-filled with the member's profile data, so they don't have to type in their details. For mobile users especially, that can significantly reduce drop-off.' Key points: 1) Explain the mechanism (pre-filled data), 2) Connect to their conversion problem, 3) Don't overpromise — suggest testing."
  },
  {
    id: "rp-03",
    name: "I don't know whether I want awareness or leads",
    role: "Confused First-Time Advertiser",
    phase: "Chapter 1",
    context: "Objective Clarification → Discovery",
    objection: "I don't know whether I want awareness or leads. How do I decide?",
    passCriteria: "Guide the buyer by asking smart follow-up questions about their business goals, funnel stage, and timeline rather than just recommending an objective.",
    failConditions: "Immediately recommends an objective without asking questions, or gives a confusing explanation of all objectives",
    winningResponse: "Great discovery! You asked the right questions to help them clarify their own objective.",
    losingResponse: "Don't jump to a recommendation. Ask questions first — what's their goal, where's the funnel gap, what's the timeline?",
    winningExamples: [
      "That's actually a really common starting point. Let me ask a few questions to help us figure it out: What's your biggest marketing priority this quarter — is it getting your brand in front of more of the right people, or is it generating leads your sales team can follow up on right now?",
      "Totally fair question. Here's how I'd approach it: What happens today when someone becomes aware of your company? Do you have a clear path from awareness to lead to opportunity, or is there a gap somewhere in that funnel? That usually tells us where to focus first.",
      "Let's work through it together. A couple of questions: Is your sales team saying they need more leads, or is the bigger challenge that your target audience doesn't know who you are yet? And what's your timeline — are you under pressure to show results this quarter, or is this a longer-term investment?",
      "Good question — and honestly, it's the right question to ask before spending any budget. Can you tell me: what does your CEO or board care about most right now? Pipeline numbers, market awareness, or something else? That usually points us in the right direction."
    ],
    losingExamples: [
      "You should do lead generation — everyone wants leads.",
      "Let me explain all seven campaign objectives: Brand Awareness, Website Visits, Engagement...",
      "It depends on your budget. How much are you spending?",
      "Just run both and see what works."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 20,
    buySignal: 70,
    traits: ["Discovery Questions", "Consultative Approach", "Patience"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Let me ask a few questions to help us figure it out: What's your biggest marketing priority this quarter — is it getting your brand in front of more of the right people, or generating leads your sales team can follow up on right now?' Key points: 1) Don't recommend immediately, 2) Ask about business goals and funnel gaps, 3) Help them discover their own answer."
  },
  {
    id: "rp-04",
    name: "Which ad format should I start with?",
    role: "SaaS Marketer with Whitepaper Campaign",
    phase: "Chapter 1",
    context: "Format Recommendation → Product Mapping",
    objection: "Which ad format should I start with?",
    passCriteria: "Ask about the offer, audience, and funnel stage before recommending a format. Match the format to their specific use case rather than listing all options.",
    failConditions: "Recommends a format without understanding the context, or lists all formats without prioritizing",
    winningResponse: "Perfect product mapping! You matched the format to their specific offer and funnel stage.",
    losingResponse: "Always understand the offer, audience, and goal before recommending a format.",
    winningExamples: [
      "Before I recommend a format, can I ask a few things? What's the offer you're promoting — is it the whitepaper, a webinar, or something else? And who's the target audience? Because the format should match both the offer and where the buyer is in their journey.",
      "Good question. It depends on what you're trying to achieve. If you're promoting a whitepaper to generate leads, I'd start with Sponsored Content paired with a Lead Gen Form — that gives you feed visibility plus a low-friction conversion path. But let me ask: are you targeting people who already know your brand, or is this a cold audience?",
      "Let me ask this: what's the primary goal with the whitepaper? Is it to capture leads for sales follow-up, or is it more about educating your target audience? If it's lead capture, I'd recommend starting with a single image ad or carousel in the feed paired with a Lead Gen Form. If it's education, Document Ads might be a better fit because they let people preview the content before committing.",
      "The honest answer is it depends on your goal and audience. Can you tell me more about the whitepaper — what's the topic, who's it for, and what do you want someone to do after they read it? That'll help me recommend the right starting point."
    ],
    losingExamples: [
      "Video ads are the best — you should start there.",
      "We have Single Image, Video, Carousel, Document, Messaging — which one sounds good to you?",
      "Just do Sponsored Content, it works for everything.",
      "I'd recommend trying all of them and seeing which performs best."
    ],
    goalType: "advance",
    difficulty: "Beginner",
    resistanceLevel: 20,
    buySignal: 75,
    traits: ["Product Mapping", "Discovery", "Consultative Selling"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'Before I recommend a format, can I ask — what's the offer you're promoting, and who's the target audience? The format should match both the offer and the buyer's journey stage.' Key points: 1) Ask before recommending, 2) Match format to offer and funnel stage, 3) Be specific about why you're recommending a particular format."
  },
  {
    id: "rp-05",
    name: "We only care about results — what should we measure?",
    role: "Performance Marketer",
    phase: "Chapter 1",
    context: "Metrics Conversation → Measurement",
    objection: "We only care about results. What should we realistically measure?",
    passCriteria: "Shift from vanity metrics to business-relevant metrics. Help the buyer define success in terms of lead quality, pipeline, and business outcomes — not just clicks and impressions.",
    failConditions: "Focuses on CTR/CPM/impressions, or gives vague answers about measurement",
    winningResponse: "Excellent! You shifted the conversation from vanity metrics to business outcomes.",
    losingResponse: "Don't lead with clicks and impressions. Connect measurement to what their business actually cares about.",
    winningExamples: [
      "That's the right mindset. The question I'd ask is: what does 'results' mean for your team? For some it's lead volume, for others it's lead quality or sales-accepted opportunities. Let's define that first, because the measurement approach should be built around your actual funnel, not just platform metrics.",
      "Love that focus. Here's how I'd think about it: the metrics that matter most are usually downstream — not just how many leads came in, but how many were qualified, how many turned into meetings, and how many influenced pipeline. LinkedIn can help you track from ad impression through to website conversion, and with the right integration, all the way to pipeline.",
      "Great question. I'd push back slightly on one thing though: 'results' should be defined before the campaign launches, not after. Can we talk about what success looks like for your sales team? If it's qualified meetings, we should measure cost per qualified lead and lead-to-meeting conversion rate, not just cost per click.",
      "Absolutely. The realistic measurement framework I'd suggest is: engagement metrics as leading indicators, then lead volume and quality as mid-funnel metrics, and finally pipeline contribution and revenue influence as the metrics that actually matter. The key is connecting campaign activity to business outcomes your leadership cares about."
    ],
    losingExamples: [
      "You should look at click-through rate and cost per click.",
      "LinkedIn has great reporting — you can see impressions, clicks, and engagement.",
      "We'll optimize for the lowest CPM possible.",
      "Results vary by campaign, so it's hard to say what to expect."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Outcome Orientation", "Business Acumen", "Consultative Selling"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'What does results mean for your team? For some it's lead volume, for others it's lead quality or sales-accepted opportunities. Let's define that first, because the measurement approach should match your actual funnel.' Key points: 1) Shift from vanity metrics to business outcomes, 2) Ask how they define success, 3) Connect measurement to pipeline and revenue."
  },
  {
    id: "rp-06",
    name: "Give me the short version — why LinkedIn, why now?",
    role: "CMO",
    phase: "Chapter 1",
    context: "Executive Summary → Why LinkedIn",
    objection: "Give me the short version — why LinkedIn, why now?",
    passCriteria: "Deliver a concise, executive-level summary that connects LinkedIn's unique value to current B2B marketing challenges — precision targeting, trusted environment, full-funnel impact, and measurable business outcomes.",
    failConditions: "Gives a long-winded answer, lists product features, or fails to communicate urgency and relevance",
    winningResponse: "Perfect executive communication! Concise, strategic, and tied to business impact.",
    losingResponse: "CMOs want a sharp, strategic answer — not a product walkthrough. Lead with business impact.",
    winningExamples: [
      "Here's the short version: LinkedIn is the only platform where you can reach specific B2B decision-makers by title, function, and seniority — in a trusted business context. For B2B marketers under pressure to prove pipeline impact, not just generate clicks, LinkedIn tends to deliver higher-quality engagement and leads that actually convert. The 'why now' is that your competitors are already using it to reach the same buyers you need.",
      "Three things. First, professional targeting — you can reach exact buyer personas by job title, seniority, and company, which no other platform does at this depth. Second, trusted context — people are in business mode on LinkedIn, which means higher engagement quality. Third, measurable impact — we can connect ad spend to pipeline and revenue. Why now? Because B2B buying committees are getting harder to reach, and LinkedIn is where they spend professional time.",
      "The simplest way I can put it: LinkedIn helps you reach the right professional audience, with the right message, in a trusted business environment, and measure real business impact. Why now? Because the channels you're using today are probably great for volume but struggling to deliver the quality of engagement that actually moves pipeline. LinkedIn fills that gap.",
      "Short version: Your buyers are on LinkedIn in business mode. You can target them precisely. And you can measure whether those impressions actually turned into pipeline. Why now? Because every quarter you're not reaching the right decision-makers is a quarter your competitors are."
    ],
    losingExamples: [
      "Well, LinkedIn has been around since 2003 and has over 900 million members...",
      "We have seven different campaign objectives and six ad formats I should walk you through...",
      "LinkedIn is a great platform for B2B marketing. Let me show you some case studies...",
      "Why now? Well, digital advertising is growing and LinkedIn is part of that trend..."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Executive Communication", "Strategic Thinking", "Conciseness"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'LinkedIn is the only platform where you can reach specific B2B decision-makers by title, function, and seniority — in a trusted business context. For marketers under pressure to prove pipeline impact, LinkedIn delivers higher-quality engagement and leads that convert. The why now is that your competitors are already reaching these same buyers.' Key points: 1) Keep it under 30 seconds, 2) Lead with precision targeting and trusted context, 3) Create urgency with competitive pressure."
  },
  {
    id: "rp-07",
    name: "What are your top marketing priorities this quarter?",
    role: "Demand Generation Director",
    phase: "Chapter 2",
    context: "Discovery → Business-Priority Discovery",
    objection: "Before you pitch me anything, tell me — what questions would you ask to understand my business?",
    passCriteria: "Demonstrate strong discovery skills by asking about business goals, target audience, funnel gaps, current channel mix, and how they measure success — following a structured discovery framework.",
    failConditions: "Jumps into pitching LinkedIn products, asks only surface-level questions, or sounds like reading from a script",
    winningResponse: "Excellent discovery! You asked the right questions in the right order and showed genuine curiosity.",
    losingResponse: "Discovery means understanding their business before recommending anything. Follow the framework: goals, audience, funnel gap, current channels, measurement.",
    winningExamples: [
      "Great — I'd love to start there. First, what are your top marketing or growth priorities this quarter? Are you focused more on building awareness with a new audience, generating pipeline, or improving conversion rates on what you're already doing?",
      "Appreciate that approach. Let me start with the big picture: What business outcome is your marketing team being measured on right now? And then I'd want to understand — who specifically are you trying to reach? Which roles, seniority levels, or industries matter most?",
      "Perfect — that's exactly how I like to work. Here's where I'd start: What's the biggest gap in your funnel right now? Is it reaching the right people, getting them to engage, converting them to leads, or getting sales to accept those leads? That usually tells me where to focus.",
      "I'd want to understand a few things: What are your pipeline targets this quarter? Who are the buyer personas that matter most? What channels are you using today and what's working versus not? And how does your team define a qualified lead? Those four things tell me a lot about where LinkedIn can add value."
    ],
    losingExamples: [
      "Let me tell you about LinkedIn's targeting capabilities...",
      "What's your budget for LinkedIn advertising?",
      "Have you used LinkedIn ads before?",
      "How many employees does your company have?"
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 35,
    buySignal: 60,
    traits: ["Discovery Framework", "Active Listening", "Strategic Questions"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'What are your top marketing or growth priorities this quarter? Are you focused more on building awareness, generating pipeline, or improving conversion rates?' Key points: 1) Start with business goals, not product questions, 2) Follow the discovery framework: goals → audience → funnel gap → current channels → measurement, 3) Show genuine curiosity, not scripted questioning."
  },
  {
    id: "rp-08",
    name: "We're targeting very specific buyer personas",
    role: "ABM/Field Marketing Leader",
    phase: "Chapter 2",
    context: "Discovery → Audience and Buying Committee",
    objection: "We're targeting very specific buyer personas across a buying committee. Can LinkedIn actually reach them?",
    passCriteria: "Demonstrate understanding of LinkedIn's professional targeting dimensions — job title, function, seniority, company, industry — and connect them to the buyer's ABM motion. Ask about their specific personas to tailor the response.",
    failConditions: "Gives a generic 'yes we can target anyone' answer without specifics, or fails to ask about their actual personas",
    winningResponse: "Great job! You connected LinkedIn's targeting to their specific ABM challenge and asked about their personas.",
    losingResponse: "Don't give generic targeting claims. Ask about their specific personas and show how LinkedIn reaches each one.",
    winningExamples: [
      "That's exactly where LinkedIn shines. Before I explain how, can you tell me more about these personas? What titles, functions, and seniority levels are on the buying committee? Because LinkedIn lets you target by all of those attributes — and with Matched Audiences, you can even upload specific account lists and reach only the people within those companies who match your persona criteria.",
      "Great question — and the answer is almost certainly yes, but let me not give you a generic response. Who's on this buying committee? If you tell me the roles, I can walk you through exactly how we'd build the targeting. LinkedIn's professional graph covers title, function, seniority, industry, company size, and skills — so for most B2B buying committees, the coverage is very strong.",
      "Absolutely — and that's actually the use case where LinkedIn tends to outperform other channels. Can you share who the key stakeholders are? For example, if you need to reach a VP of Engineering and a CFO at the same company, we can build separate audience segments with tailored messaging for each, all within the same campaign structure.",
      "That's the right challenge to raise. LinkedIn is built around professional identity, so targeting by title, function, and seniority is native to the platform. But rather than me making claims, let me ask: what are the specific personas, and what companies are you targeting? I want to make sure the targeting actually maps to your needs before I oversell it."
    ],
    losingExamples: [
      "LinkedIn has over 900 million members, so we can definitely reach your audience.",
      "Yes, our targeting is the best in the industry.",
      "We can target by demographics and interests just like any other platform.",
      "Just upload your email list and we'll find them."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 40,
    buySignal: 55,
    traits: ["Audience Strategy", "ABM Knowledge", "Consultative Selling"],
    durationSeconds: 300,
    isCoachingMode: true,
    scriptHint: "Try saying: 'That's exactly where LinkedIn shines. Can you tell me more about these personas — what titles, functions, and seniority levels are on the buying committee? LinkedIn lets you target by all of those attributes, and with Matched Audiences, you can upload specific account lists.' Key points: 1) Ask about their specific personas, 2) Explain professional targeting dimensions, 3) Connect to ABM capabilities like Matched Audiences."
  },
  {
    id: "rp-09",
    name: "We're getting lots of leads but sales says they're garbage",
    role: "VP of Marketing",
    phase: "Chapter 2",
    context: "Discovery → Funnel Diagnosis",
    objection: "We're getting lots of leads but sales says they're garbage. How would LinkedIn help with that?",
    passCriteria: "Diagnose the lead quality problem by asking about targeting, offer, conversion path, and handoff process before recommending LinkedIn's solution. Frame LinkedIn's value around precision targeting and lead quality, not just volume.",
    failConditions: "Promises LinkedIn leads will be better without understanding the root cause, or ignores the sales-marketing alignment issue",
    winningResponse: "Excellent diagnosis! You explored the root cause before positioning LinkedIn as a solution.",
    losingResponse: "Don't just promise better leads. Diagnose the problem first — is it targeting, offer, conversion path, or follow-up?",
    winningExamples: [
      "That's a really common challenge, and honestly, switching channels alone won't fix it if the root cause is something else. Let me ask: when sales says the leads are garbage, what specifically do they mean? Are the leads the wrong title or seniority? Are they from companies that aren't a fit? Or is it more that the leads are interested but not ready to buy? Because the fix depends on the root cause.",
      "I hear this a lot. Before I tell you how LinkedIn would help, I want to understand the problem better. What does your current lead flow look like? Where are leads coming from today, what's the offer, and what happens between someone filling out a form and sales reaching out? Often the quality issue is about targeting and follow-up timing, not just the channel.",
      "That's actually one of the most important problems to solve, and it's where LinkedIn can make a real difference — but only if we get the setup right. Can I ask: what's your current targeting look like on the channels you're using? And when a lead comes in, how quickly does sales follow up, and what criteria do they use to decide if it's qualified?",
      "That tells me the volume isn't the problem — the fit is. Here's where LinkedIn can help: because targeting is based on professional attributes like title, function, seniority, and company, you can be much more precise about who sees your ads and who fills out your forms. But I'd also want to look at your offer and your lead scoring — sometimes the creative attracts the wrong audience regardless of targeting."
    ],
    losingExamples: [
      "LinkedIn leads are much higher quality than other channels. Problem solved.",
      "You should switch all your budget to LinkedIn.",
      "That's a sales problem, not a marketing problem.",
      "We can generate way more leads than whatever you're doing now."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 50,
    buySignal: 50,
    traits: ["Funnel Diagnosis", "Root Cause Analysis", "Sales-Marketing Alignment"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'When sales says the leads are garbage, what specifically do they mean? Are they the wrong title or seniority? Wrong companies? Or interested but not ready to buy? The fix depends on the root cause.' Key points: 1) Diagnose before prescribing, 2) Ask about targeting, offer, conversion path, and follow-up, 3) Position LinkedIn's precision targeting as the quality lever."
  },
  {
    id: "rp-10",
    name: "We used Google and Meta — why would we add LinkedIn?",
    role: "Demand Gen Director",
    phase: "Chapter 2",
    context: "Discovery → Prior-Channel Disappointment",
    objection: "We already use Google and Meta and they work fine. Why would we add another channel?",
    passCriteria: "Position LinkedIn as complementary, not competitive. Explain the different role each channel plays — Google for intent, Meta for interest, LinkedIn for professional identity and B2B precision.",
    failConditions: "Bashes Google or Meta, claims LinkedIn replaces them, or can't explain the differentiation",
    winningResponse: "Great positioning! You showed how LinkedIn complements their existing channels rather than replacing them.",
    losingResponse: "Never bash other channels. Show how LinkedIn adds unique value for B2B that Google and Meta can't replicate.",
    winningExamples: [
      "That makes sense — and I wouldn't suggest replacing what's working. The question is whether you're reaching everyone you need to reach. Google is great for capturing active intent, and Meta has strong reach. LinkedIn adds something different: the ability to target specific professional audiences by title, function, and seniority. For B2B, that means you can reach decision-makers who may not be actively searching but are exactly the people your sales team needs.",
      "I hear you. Here's how I'd think about it: Google captures people who are already looking for a solution — that's intent-based. Meta reaches people based on behavior and interests. LinkedIn reaches people based on who they are professionally. If you're selling to VP-level buyers in enterprise companies, LinkedIn is the channel that can find them precisely. It's not replacing Google or Meta — it's filling a gap in your funnel.",
      "Smart to be protective of what's working. Let me ask: are you fully satisfied with the quality of leads from those channels, or are you seeing a gap between volume and conversion? For a lot of B2B teams, Google and Meta drive good volume, but LinkedIn drives better-fit leads because the targeting is based on professional identity. It's typically used alongside, not instead of, your other channels.",
      "Totally fair. The role LinkedIn usually plays is different from Google and Meta. It's not about search intent or social behavior — it's about reaching the right business audience in a professional context. Most of our customers use LinkedIn specifically for reaching harder-to-find B2B personas that other channels can't isolate. Does that gap exist in your current funnel?"
    ],
    losingExamples: [
      "Google and Meta are consumer platforms — LinkedIn is the only real B2B option.",
      "You should move your budget from Meta to LinkedIn.",
      "Google is overpriced and Meta's targeting is unreliable.",
      "LinkedIn is just better for B2B. Let me show you the data."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 40,
    traits: ["Competitive Positioning", "Channel Strategy", "Consultative Selling"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'I wouldn't suggest replacing what's working. Google captures intent, Meta captures interest, LinkedIn captures professional identity. If you're selling to VP-level buyers, LinkedIn can find them precisely. It's not replacing your other channels — it's filling a gap.' Key points: 1) Never bash competitors, 2) Explain channel role differentiation, 3) Position LinkedIn as additive, not replacement."
  },
  {
    id: "rp-11",
    name: "Tell me how you'd position LinkedIn for our CMO",
    role: "CMO",
    phase: "Chapter 2",
    context: "Positioning → Persona-Based Positioning",
    objection: "I'm the CMO. I don't care about ad formats. Tell me why LinkedIn should be part of my strategy.",
    passCriteria: "Position LinkedIn at a strategic level — brand credibility with decision-makers, influence across long buying cycles, full-funnel value, and measurable pipeline contribution. Speak in CMO language, not ad-tech language.",
    failConditions: "Talks about ad formats, CTR, or CPM instead of strategic outcomes. Fails to match the executive tone.",
    winningResponse: "Perfect executive positioning! You spoke in strategic terms and connected to what CMOs actually care about.",
    losingResponse: "CMOs care about brand growth, pipeline contribution, and strategic positioning — not ad format details.",
    winningExamples: [
      "At the strategic level, LinkedIn does three things no other channel does for B2B: it puts your brand in front of the exact decision-makers who influence and make buying decisions, it lets you stay relevant across long sales cycles with sequenced content, and it gives you measurable data on how marketing is influencing pipeline. For a CMO under pressure to prove marketing's impact on revenue, that combination is hard to replicate anywhere else.",
      "Here's why it matters strategically: your brand needs credibility with senior buyers — the people who sign off on six- and seven-figure deals. LinkedIn is the one environment where those buyers are in business mode, consuming professional content, and open to learning about solutions. It's not about running ads — it's about building brand equity with the audience that actually drives your revenue.",
      "I'd frame it this way: LinkedIn is where your future customers already spend professional time. If you're trying to influence a buying committee over a 6-12 month sales cycle, you need a channel that reaches them by role, keeps your brand relevant throughout that cycle, and connects engagement to pipeline. That's what LinkedIn does. The strategic value isn't impressions — it's influence.",
      "The CMO lens is simple: does this channel help me build brand with the right audience, generate demand that converts, and prove it to the board? LinkedIn checks all three. The professional targeting means you're not wasting budget on the wrong audience. The content formats let you educate and engage across the funnel. And the measurement connects your spend to pipeline and revenue."
    ],
    losingExamples: [
      "Let me walk you through our campaign objectives and ad formats...",
      "Our CTR on Sponsored Content is typically 0.4-0.6%...",
      "You should start with a Lead Gen Form campaign to test results.",
      "LinkedIn has 900 million members and growing..."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 60,
    buySignal: 40,
    traits: ["Executive Communication", "Strategic Positioning", "CMO Language"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'LinkedIn puts your brand in front of the exact decision-makers who influence buying decisions, lets you stay relevant across long sales cycles, and gives you measurable pipeline contribution data. For a CMO under pressure to prove marketing's revenue impact, that's hard to replicate.' Key points: 1) Speak in strategic terms, 2) Connect to brand credibility, pipeline influence, and board reporting, 3) Avoid ad-tech jargon."
  },
  {
    id: "rp-12",
    name: "Walk me through a full discovery",
    role: "VP of Marketing at Mid-Market SaaS",
    phase: "Chapter 2",
    context: "Full Mini-Discovery → Comprehensive",
    objection: "I've got 10 minutes. Walk me through what you'd want to know about our business.",
    passCriteria: "Conduct a structured mini-discovery covering business goals, audience, funnel gaps, current channels, offer/content, measurement, and stakeholders. Demonstrate genuine curiosity and connect answers to potential LinkedIn solutions.",
    failConditions: "Turns the discovery into a pitch, asks random unconnected questions, or fails to cover key discovery areas",
    winningResponse: "Outstanding discovery! You were structured, curious, and connected every answer to potential value.",
    losingResponse: "Discovery should feel like a conversation, not an interrogation. Follow a logical flow and connect the dots.",
    winningExamples: [
      "Perfect — I'll make the most of your time. Let me start at the top: What are your biggest marketing priorities this quarter? Are you under more pressure on awareness, lead generation, or proving ROI on what you're already doing?",
      "Great, let's dive in. First question: what's the business outcome your marketing team is being measured on right now? Pipeline? MQLs? Revenue contribution? That'll help me understand what matters most.",
      "Appreciate the time. I'd want to cover four things quickly: your goals, your audience, what's working and not working today, and how you measure success. Let's start with goals — what's the single biggest challenge your marketing team is trying to solve right now?",
      "Let me be efficient. Three things I'd want to understand: One, who are you trying to reach and what does the buying committee look like? Two, where's the biggest gap in your funnel today — reach, engagement, conversion, or lead quality? Three, how do you define success and who else is involved in evaluating a new channel? Can we start with the audience?"
    ],
    losingExamples: [
      "Let me tell you about LinkedIn's products first, and then we can discuss your needs.",
      "How many employees does your company have? What's your annual revenue?",
      "What's your budget for LinkedIn? That will help me figure out what to recommend.",
      "Have you heard about our new Document Ads feature?"
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 35,
    buySignal: 60,
    traits: ["Full Discovery", "Time Management", "Strategic Questioning"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'What are your biggest marketing priorities this quarter? Are you under more pressure on awareness, lead generation, or proving ROI?' Then follow up with audience, funnel gap, current channels, and measurement questions. Key points: 1) Be structured — goals, audience, funnel, channels, measurement, 2) Connect their answers to potential LinkedIn value, 3) Manage the 10 minutes efficiently."
  },
  {
    id: "rp-13",
    name: "Your CPL is always higher than other platforms",
    role: "Performance Marketer",
    phase: "Chapter 3",
    context: "Objection Handling → Price Objection",
    objection: "Your CPL is always higher than other platforms.",
    passCriteria: "Reframe from raw CPL to cost per qualified lead, cost per opportunity, and pipeline value. Acknowledge the price difference honestly and shift the conversation to outcome quality.",
    failConditions: "Defends the price without diagnosing value, argues that LinkedIn is cheap, or dismisses their concern",
    winningResponse: "Great reframe! You shifted from CPL to qualified outcomes and business value.",
    losingResponse: "Don't defend CPL in isolation. Shift to cost per qualified lead and pipeline value.",
    winningExamples: [
      "That's a fair observation — and on a raw CPL basis, you're right, LinkedIn is often higher than other channels. But here's the question I'd ask: what's your cost per qualified lead? Because if LinkedIn delivers leads that are 3x more likely to convert to a meeting or opportunity, the cost per qualified outcome is actually lower. It's about quality of the pipeline, not just the top-of-funnel cost.",
      "I hear that a lot, and it's true on the surface. The reframe I'd suggest is this: compare cost per opportunity, not cost per lead. If LinkedIn generates 50 leads at $100 each and 15 turn into meetings, versus another channel that generates 200 leads at $30 each but only 8 turn into meetings — which channel is actually more efficient?",
      "You're right that LinkedIn CPL tends to be higher. I won't pretend otherwise. What I'd challenge is whether CPL is the right metric. For B2B, the metrics that matter are usually downstream — qualified pipeline generated, sales acceptance rate, and revenue influenced. How does your team measure that today?",
      "Totally valid concern. Let me ask: when you compare CPL across channels, are you also comparing lead quality, conversion rate, and deal size? Because for most B2B teams, the cheapest leads aren't the best leads. LinkedIn's value is precision — you're paying more per lead because you're reaching specific decision-makers, not a broad audience."
    ],
    losingExamples: [
      "LinkedIn is actually very affordable for B2B advertising.",
      "You need to spend more to see results — it takes time to optimize.",
      "Our CPL is competitive with other premium platforms.",
      "Price shouldn't be the main consideration when choosing a channel."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 60,
    buySignal: 40,
    traits: ["Value Reframing", "Data Fluency", "Objection Handling"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'On a raw CPL basis, you're right — LinkedIn is often higher. But the question is: what's your cost per qualified lead? If LinkedIn leads are 3x more likely to convert to a meeting, the cost per qualified outcome is actually lower.' Key points: 1) Acknowledge the price difference honestly, 2) Reframe from CPL to cost per qualified outcome, 3) Use comparative math to show true efficiency."
  },
  {
    id: "rp-14",
    name: "Why not just put more budget into Google?",
    role: "Demand Gen Leader",
    phase: "Chapter 3",
    context: "Objection Handling → Channel Overlap",
    objection: "Why not just put more budget into Google?",
    passCriteria: "Explain the different roles Google and LinkedIn play without bashing Google. Position LinkedIn for reaching B2B audiences earlier in the buying journey and influencing decision-makers who aren't actively searching.",
    failConditions: "Bashes Google, claims LinkedIn is better at everything, or can't articulate the differentiation",
    winningResponse: "Perfect channel differentiation! You positioned LinkedIn's unique role without diminishing Google.",
    losingResponse: "Don't compete with Google head-on. Explain the complementary role LinkedIn plays in the B2B funnel.",
    winningExamples: [
      "Google is fantastic for capturing active intent — people who are already searching for a solution. But here's the thing: in B2B, by the time someone's searching on Google, they've often already shortlisted vendors. LinkedIn lets you reach and influence decision-makers earlier, before they're searching, based on who they are professionally. The two channels play different roles in the funnel.",
      "That's a reasonable question. Here's how I'd think about it: Google captures demand that already exists. LinkedIn creates and influences demand with people who match your ideal buyer profile but aren't actively looking yet. For B2B, where buying cycles are long and committees are involved, you need both — Google for the bottom of the funnel and LinkedIn for the top and middle.",
      "You absolutely should invest in Google if it's working. The question is: are you reaching everyone you need to reach? Google works when someone knows they have a problem and searches for it. LinkedIn works when you need to reach a specific VP or director who doesn't know your solution exists yet but has exactly the problem you solve.",
      "I'd never argue against Google for intent capture. But let me ask: what percentage of your total addressable market is actively searching right now? For most B2B companies, it's less than 5%. The other 95% of your future buyers are on LinkedIn, scrollable, targetable by professional identity — but they're not searching yet. That's the gap LinkedIn fills."
    ],
    losingExamples: [
      "Google is for consumer search, not B2B.",
      "LinkedIn is just better for B2B — full stop.",
      "Google's targeting for B2B is terrible compared to ours.",
      "You're already wasting money on Google — move it to LinkedIn."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 55,
    buySignal: 45,
    traits: ["Channel Strategy", "Complementary Positioning", "Market Education"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Google captures active intent — people already searching. LinkedIn reaches decision-makers earlier, before they're searching, based on professional identity. In B2B with long buying cycles, you need both — Google for the bottom, LinkedIn for top and middle.' Key points: 1) Don't bash Google, 2) Explain intent capture vs. demand creation, 3) Position LinkedIn for the 95% not actively searching."
  },
  {
    id: "rp-15",
    name: "We tried LinkedIn last year and saw nothing meaningful",
    role: "CMO",
    phase: "Chapter 3",
    context: "Objection Handling → Past Failure",
    objection: "We tried LinkedIn last year and saw nothing meaningful.",
    passCriteria: "Diagnose the past failure respectfully by asking about audience setup, creative, offer, objective, conversion path, sales follow-up, and success metric. Reopen the conversation without being defensive.",
    failConditions: "Dismisses their experience, blames them for the failure, or immediately pivots to a new pitch",
    winningResponse: "Excellent recovery! You diagnosed the past failure respectfully and reopened the conversation.",
    losingResponse: "Never dismiss a past failure. Diagnose what was tested and separate channel fit from execution choices.",
    winningExamples: [
      "I understand — and I wouldn't ask you to invest again without understanding what happened. Can I ask a few questions about what you tried? Specifically: what was the campaign objective, who were you targeting, what was the offer, and how did you measure success? Often the issue isn't the channel itself, but how the campaign was structured or measured.",
      "That's fair, and I appreciate the honesty. The question I'd want to unpack is: what specifically didn't work? Was it that you got leads but they weren't qualified? Or that engagement was low? Or that you couldn't connect the spend to business outcomes? Because each of those has a different root cause and a different fix.",
      "I hear that from time to time, and it's always worth understanding why. Can we walk through what was tested? The audience setup, the creative, the offer, and the conversion path all matter. I've seen situations where the channel was right but the execution — targeting too broadly, weak offer, or no sales follow-up — was the real issue.",
      "Makes sense — and I respect that. Rather than asking you to take my word for it, let me ask: what did the campaign look like? If we can identify what went wrong, I can tell you honestly whether a different approach would likely produce different results, or whether LinkedIn genuinely isn't the right fit for your use case."
    ],
    losingExamples: [
      "LinkedIn has improved a lot since last year. It's totally different now.",
      "Your previous team probably didn't set it up correctly.",
      "That's unusual — most companies see great results on LinkedIn.",
      "Let me show you some new features that weren't available last year."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 70,
    buySignal: 30,
    traits: ["Non-Defensive Handling", "Diagnostic Discovery", "Empathy"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'I understand, and I wouldn't ask you to invest again without understanding what happened. What was the campaign objective, who were you targeting, what was the offer, and how did you measure success? Often the issue isn't the channel but how the campaign was structured.' Key points: 1) Validate their experience, 2) Diagnose systematically — objective, audience, creative, offer, measurement, 3) Don't blame them or oversell."
  },
  {
    id: "rp-16",
    name: "Our TAM is tiny — I doubt LinkedIn is worth it",
    role: "Cybersecurity Marketer",
    phase: "Chapter 3",
    context: "Objection Handling → Niche Audience",
    objection: "Our TAM is tiny. I doubt LinkedIn is worth it.",
    passCriteria: "Reframe niche targeting as a strength, not a limitation. Explain how LinkedIn's professional targeting is built for precisely this use case — reaching specific roles, titles, and companies in narrow markets.",
    failConditions: "Agrees the audience might be too small, or can't articulate why LinkedIn works for niche B2B",
    winningResponse: "Great reframe! You turned their objection into LinkedIn's strongest value proposition.",
    losingResponse: "Niche audiences are LinkedIn's sweet spot. Reframe precision as an advantage, not a limitation.",
    winningExamples: [
      "Actually, that's where LinkedIn tends to be most valuable. When your TAM is small, you can't afford to waste budget reaching the wrong people. LinkedIn lets you target by exact job title, function, seniority, and company — so if you need to reach 500 CISOs at enterprise companies, you can build an audience of exactly those people. Niche isn't a problem — it's a targeting advantage.",
      "I'd actually argue the opposite. For niche audiences, the channels that struggle are the broad-reach ones like Meta or display, where you're paying for impressions that mostly miss your audience. LinkedIn's targeting is built for precision — you can define your audience by professional attributes and reach exactly the people who matter. The smaller the TAM, the more important precision becomes.",
      "That's a valid concern, but let me reframe it: when your audience is niche, quality matters way more than scale. LinkedIn doesn't need you to reach millions of people — it needs you to reach the right hundreds or thousands. Can you tell me more about your target audience? What roles, seniority levels, and company types? I'd bet LinkedIn can build that audience precisely.",
      "I hear you — and it's true that LinkedIn isn't for every campaign type. But for niche B2B audiences, it's actually the strongest fit because the targeting is based on professional identity. If you're trying to reach cybersecurity buyers at enterprise companies, LinkedIn can isolate them by title, function, and company. Where else can you do that at this level of precision?"
    ],
    losingExamples: [
      "You might be right — if the audience is too small, it might not be worth it.",
      "We have 900 million members, so your audience is definitely on LinkedIn.",
      "You could broaden your targeting to reach more people.",
      "Let's just try it and see if the numbers work."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 50,
    buySignal: 45,
    traits: ["Audience-Fit Selling", "Reframing", "Niche Strategy"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'When your TAM is small, you can't afford to waste budget reaching the wrong people. LinkedIn lets you target by exact job title, function, seniority, and company. Niche isn't a problem — it's a targeting advantage.' Key points: 1) Reframe niche as a strength, 2) Explain precision targeting, 3) Compare to broad-reach channels where niche actually is a problem."
  },
  {
    id: "rp-17",
    name: "We have budget for one pilot — what would you test?",
    role: "Mid-Market SaaS Marketer",
    phase: "Chapter 3",
    context: "Strategy → Pilot Recommendation",
    objection: "We have budget for one pilot. What would you test first?",
    passCriteria: "Recommend a logical pilot strategy that starts with the business goal, selects an audience, matches an objective and format, and defines a success metric. Be specific and simple, not overwhelming.",
    failConditions: "Recommends too many things, fails to ask about their goal first, or gives a vague 'it depends' answer",
    winningResponse: "Perfect strategy recommendation! Simple, logical, and tied to their specific business goal.",
    losingResponse: "A pilot recommendation should be simple and specific — one goal, one audience, one format, one success metric.",
    winningExamples: [
      "Before I recommend, let me ask: what's the single most important outcome you need from this pilot? Is it generating leads, building awareness with a new audience, or proving that LinkedIn can drive pipeline? Because the pilot design should be focused on one goal to give you a clear answer.",
      "I'd keep it simple. Here's what I'd recommend: Pick your highest-priority buyer persona, run a Sponsored Content campaign with a Lead Gen Form promoting your strongest content asset — probably a report or webinar — target by title and seniority at your ideal company profile, and measure cost per qualified lead and lead-to-meeting conversion. That gives you a clean test with clear results.",
      "Great question. I'd recommend a focused demand capture play: one audience segment of your ideal buyer persona, one offer that's proven to convert — like a demo request or high-value content download — using Sponsored Content with a Lead Gen Form. Run it for 30-60 days and measure not just leads, but lead quality and pipeline generated. That tells you if LinkedIn works for your business.",
      "The best pilot is the simplest one. Start with the business goal — are you trying to generate leads or build awareness? Then pick one audience, one format, and one clear success metric. I'd suggest starting with your highest-value audience and your strongest offer. Want me to walk through what that would look like based on your specific situation?"
    ],
    losingExamples: [
      "You should run Sponsored Content, Video Ads, Lead Gen Forms, and Messaging all at once to see what works.",
      "It depends on a lot of factors. I'd need to think about it.",
      "Just put the budget into brand awareness and see what happens.",
      "I can send you our pilot playbook — it covers all the options."
    ],
    goalType: "advance",
    difficulty: "Intermediate",
    resistanceLevel: 30,
    buySignal: 70,
    traits: ["Strategic Clarity", "Simplicity", "Pilot Design"],
    durationSeconds: 300,
    scriptHint: "Try saying: 'Before I recommend, what's the single most important outcome you need? Then I'd keep it simple: one audience, one format, one offer, one success metric. Run for 30-60 days and measure lead quality and pipeline, not just volume.' Key points: 1) Ask about their goal first, 2) Recommend one focused play, not many, 3) Define success metrics upfront."
  },
  {
    id: "rp-18",
    name: "Final Certification — Tell us what LinkedIn should do for us",
    role: "CMO + Demand Gen Director Panel",
    phase: "Chapter 3",
    context: "Final Certification Simulation",
    objection: "Tell us what LinkedIn should do for us, why we should trust it, and how you would start.",
    passCriteria: "Deliver a concise executive pitch plus recommendation that covers LinkedIn's value for their business, builds trust through specifics, and recommends a clear starting point. Demonstrate mastery across product knowledge, positioning, discovery, objection handling, and strategic recommendation.",
    failConditions: "Gives a generic pitch, fails to ask any qualifying questions, sounds scattered, or can't handle follow-up objections from the panel",
    winningResponse: "Congratulations! You demonstrated mastery across the full LMS sales competency — product knowledge, positioning, discovery, and strategic recommendation.",
    losingResponse: "Review all chapters and practice each skill — explanation, discovery, positioning, objection handling, and strategic recommendation — before retrying.",
    winningExamples: [
      "Structured response covering: 1) LinkedIn's unique value for their business, 2) Specific targeting and format recommendations tied to their goals, 3) Clear pilot strategy with success metrics, 4) Calm handling of follow-up objections from the panel.",
      "Strong executive presence with a clear 'what LinkedIn does, why it matters for you, and how I'd start' framework. Connected every recommendation to business outcomes.",
      "Excellent synthesis of discovery, positioning, and recommendation. Asked the right questions before pitching, handled price and channel objections confidently, and closed with a specific next step."
    ],
    losingExamples: [
      "Started listing all LinkedIn products without connecting to business value.",
      "Couldn't handle follow-up objections about CPL or past failure.",
      "Gave a generic pitch that could apply to any company."
    ],
    goalType: "advance",
    difficulty: "Advanced",
    resistanceLevel: 75,
    buySignal: 30,
    traits: ["Full Sales Cycle", "Executive Selling", "Strategic Synthesis", "Objection Handling"],
    durationSeconds: 300,
    isCertification: true,
    scriptHint: "This is your final certification. You'll face a CMO and Demand Gen Director panel. Structure your response: 1) What LinkedIn does for their business (precision targeting, trusted context, measurable outcomes), 2) Why they should trust it (specifics, not generics — targeting capabilities, case examples, measurement), 3) How you'd start (focused pilot strategy). Be ready for follow-up objections about price, channel overlap, and past failure. Stay calm, structured, and outcome-oriented."
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
    roleplay.id === 'rp-18';
  
  const isCoachingMode = ['rp-01', 'rp-02', 'rp-03', 'rp-04', 'rp-05', 'rp-07', 'rp-08'].includes(roleplay.id);
  
  const staticConfig = VAPI_ROLEPLAY_CONFIGS.find(c => c.id === roleplay.id);
  
  return {
    id: roleplay.id,
    name: roleplay.name,
    role: roleplay.role,
    phase: roleplay.phase || staticConfig?.phase || "Chapter 1",
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
    scriptHint: staticConfig?.scriptHint
  };
}

export function buildVapiAssistantPrompt(config: VapiRoleplayConfig): string {
  const resistanceDescription = config.resistanceLevel > 70 ? "very resistant and skeptical" : 
                                 config.resistanceLevel > 40 ? "moderately resistant" : "somewhat open but cautious";
  
  const buySignalDescription = config.buySignal > 50 ? "showing some underlying interest" :
                               config.buySignal > 25 ? "cautiously curious" : "not showing buying interest";

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
  * "I still don't see why LinkedIn is different from other ad platforms..." (to prompt differentiation)
  * "But what would that actually look like for my business?" (to push for specifics)
  * "I'm not sure I understand the value..." (to help them articulate value better)
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

  return `You are playing the role of a B2B marketing buyer in a sales training simulation for LinkedIn Marketing Solutions (LMS). The rep you are speaking with is learning to sell LinkedIn's B2B advertising and demand generation platform — including Sponsored Content, Lead Gen Forms, Video Ads, Carousel Ads, Document Ads, Messaging Ads, Campaign Manager, and Business Manager.

CHARACTER PROFILE:
- Name: ${config.role}
- Opening objection: "${config.objection}"
- Personality traits: ${config.traits.join(", ")}
- Difficulty: ${config.difficulty}
- You are ${resistanceDescription} (resistance: ${config.resistanceLevel}/100)
- You are ${buySignalDescription} (buy signal: ${config.buySignal}/100)
${goalTypeSection}
${coachingInstructions}

SCENARIO CONTEXT:
${config.context}

YOUR BEHAVIOR GUIDELINES:
1. Start with your opening objection: "${config.objection}"
2. Stay in character as a realistic B2B marketing buyer (Demand Gen Director, VP Marketing, CMO, or Performance Marketer) throughout
3. React naturally to what the sales rep says
4. If the rep handles your objection well (${config.passCriteria}), gradually become more open
5. If the rep handles it poorly (${config.failConditions}), become more resistant or end the conversation
6. Keep responses concise (1-3 sentences typically) - you're a busy marketing executive

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
- Be a realistic B2B marketing buyer, not a robot
- React to tone, confidence, and business acumen, not just words
- If the rep earns your attention with strong discovery or insights, show increasing interest
- If the rep loses you with generic pitching, jargon, or poor listening, politely (or firmly) end the conversation
- The conversation should last up to 5 minutes maximum
- You do NOT need to use the full time - if the rep succeeds early, give them the success cue

Remember: You are training B2B sales reps to sell LinkedIn Marketing Solutions. Stay in character but be fair.`;
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
        assistantName: "Marketing Buyer",
        userName: "Sales Rep"
      }
    },
    maxDurationSeconds: 300,
    backgroundSound: "off",
    endCallFunctionEnabled: false
  };
}
