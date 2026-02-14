const CLOUDINARY_BASE = 'https://res.cloudinary.com/dpxfwxxzi/image/upload';

export const CHAPTER_SEED_DATA = [
  {
    slug: 'intro-to-monetate',
    title: 'Intro to Monetate',
    subtitle: 'Your Foundation for Success',
    description: 'Welcome to Monetate, the leader in experience optimization for enterprise commerce. Learn our platform, value proposition, competitive landscape, and what makes us win.',
    duration: '35 min',
    pdfUrl: '',
    coverImage: '/uploads/chapter-covers/chapter-0-cover.png',
    agenda: [
      'Who We Are & Our Mission',
      'The Monetate Platform',
      'Key Products & Capabilities',
      'Our Ideal Customer Profile',
      'Competitive Landscape',
      'Value Proposition & ROI',
      'Certification Path'
    ],
    slides: [
      { type: 'content', title: 'Welcome to Monetate', content: 'The leader in experience optimization for enterprise commerce.', bullets: ['Today: who we are, what we sell, how we win', 'Next: Arena AI training + certification to sharpen your skills'] },
      { type: 'content', title: 'Who We Are', content: 'Monetate is the enterprise experience optimization platform trusted by the world\'s leading brands.', bullets: ['Founded in 2008 in Philadelphia', 'Acquired by Kibo Commerce in 2020', 'Over 400 enterprise clients worldwide', 'Processing billions of customer interactions annually'] },
      { type: 'content', title: 'Our Mission', content: 'Mission: "Empower every brand to deliver the right experience to every customer, every time."', bullets: ['We believe personalization is the future of digital commerce', 'Our technology turns data into revenue-driving decisions', 'We help brands move from one-size-fits-all to 1:1 experiences'] },
      { type: 'content', title: 'The Monetate Platform', content: 'A unified experience optimization platform for enterprise commerce teams.', bullets: ['Intelligent Personalization Engine', 'Testing & Optimization (A/B, multivariate, feature flags)', 'AI-Powered Product Recommendations (MONET)', 'Audience Discovery & Segmentation', 'Real-Time Behavioral Analytics', 'Automated Experience Delivery'] },
      { type: 'content', title: 'Intelligent Personalization', content: 'Deliver individualized experiences across every touchpoint.', bullets: ['1:1 personalization at scale using machine learning', 'Dynamic content, offers, and messaging based on real-time behavior', 'Omnichannel support: web, mobile, email, in-store', 'No-code experience builder for marketing teams'] },
      { type: 'content', title: 'Testing & Optimization', content: 'Validate every decision with data-driven experimentation.', bullets: ['A/B testing with statistical rigor', 'Multivariate testing for complex experiences', 'Feature flags for controlled rollouts', 'Server-side and client-side testing capabilities', 'Automated winner selection and deployment'] },
      { type: 'content', title: 'Product Recommendations (MONET)', content: 'AI-powered product recommendations that drive incremental revenue.', bullets: ['MONET: Monetate\'s proprietary recommendation engine', 'Uses collaborative filtering, content-based, and hybrid algorithms', 'Real-time personalized recommendations across PDP, cart, homepage', 'Proven to increase average order value by 10-15%', 'Self-learning models that improve over time'] },
      { type: 'content', title: 'Audience Discovery', content: 'Uncover hidden customer segments and behavioral patterns.', bullets: ['AI-driven audience segmentation', 'Behavioral clustering to find high-value micro-segments', 'Predictive analytics for purchase intent', 'Integration with CDPs and data warehouses', 'Actionable insights for merchandising and marketing teams'] },
      { type: 'content', title: 'Our Ideal Customer Profile', content: 'Who we sell to and who gets the most value.', bullets: ['Mid-market to enterprise retailers and e-commerce brands', 'Annual digital revenue of $50M+', 'At least 1M monthly website visitors', 'Teams with dedicated e-commerce, marketing, or digital roles', 'Industries: retail, fashion, grocery, travel, financial services'] },
      { type: 'content', title: 'Target Buyer Personas', content: 'Know your buyers and what they care about.', bullets: ['VP of E-Commerce: revenue growth, conversion optimization', 'CMO: customer experience, brand consistency, personalization', 'CTO: integration, scalability, data architecture', 'Director of Digital Marketing: campaign performance, ease of use', 'CFO: ROI, total cost of ownership, risk mitigation'] },
      { type: 'content', title: 'Common Pain Points We Solve', content: 'Every prospect has at least one of these challenges.', bullets: ['Low conversion rates despite high traffic', 'Generic customer experiences that fail to engage', 'Inability to act on customer data in real-time', 'Fragmented tech stack with siloed personalization efforts', 'Lack of testing culture or experimentation velocity', 'Competitor brands outpacing their digital experience'] },
      { type: 'content', title: 'Competitive Landscape: Dynamic Yield', content: 'Know how we differentiate against Dynamic Yield (Mastercard).', bullets: ['Dynamic Yield: strong in personalization, acquired by Mastercard', 'Our advantage: deeper testing capabilities and MONET recommendations', 'Our advantage: more flexible integration architecture', 'Our advantage: stronger enterprise support and services model', 'Key talking point: Monetate offers a unified platform vs. point solutions'] },
      { type: 'content', title: 'Competitive Landscape: Optimizely', content: 'Know how we differentiate against Optimizely.', bullets: ['Optimizely: strong in experimentation, growing in personalization', 'Our advantage: purpose-built for commerce, not generic CMS', 'Our advantage: faster time to value for retail/e-commerce', 'Our advantage: AI-powered recommendations out of the box', 'Key talking point: Monetate understands commerce buyers deeply'] },
      { type: 'content', title: 'Competitive Landscape: Adobe Target', content: 'Know how we differentiate against Adobe Target.', bullets: ['Adobe Target: part of Adobe Experience Cloud ecosystem', 'Our advantage: does not require full Adobe stack commitment', 'Our advantage: easier to implement and faster to deploy', 'Our advantage: more accessible pricing for mid-market', 'Key talking point: enterprise power without enterprise complexity'] },
      { type: 'content', title: 'Competitive Landscape: Bloomreach', content: 'Know how we differentiate against Bloomreach.', bullets: ['Bloomreach: strong in search and merchandising', 'Our advantage: deeper personalization and testing capabilities', 'Our advantage: more robust experimentation framework', 'Our advantage: better real-time behavioral targeting', 'Key talking point: Monetate optimizes the full customer journey'] },
      { type: 'content', title: 'Value Proposition & ROI', content: 'The business case for Monetate is clear and proven.', bullets: ['Average 15% revenue lift within 6 months of deployment', '3x ROI within the first 12 months', '20% improvement in conversion rates', '12% increase in average order value', 'Reduction in customer acquisition costs through better retention'] },
      { type: 'content', title: 'Customer Success Stories', content: 'Proof points that close deals.', bullets: ['National retailer: 22% increase in online revenue after deploying personalization', 'Fashion brand: 18% lift in conversion rates using MONET recommendations', 'Grocery chain: 35% improvement in email-to-purchase conversion', 'Travel company: 2.5x ROI in first quarter through A/B testing program', 'Use these stories to build credibility in your sales conversations'] },
      { type: 'content', title: 'How We Deliver Results', content: 'Our engagement model ensures customer success.', bullets: ['Dedicated Customer Success Manager for every account', 'Professional services for implementation and strategy', 'Monetate University for ongoing training and enablement', 'Quarterly Business Reviews with executive sponsors', '24/7 enterprise support with 99.9% uptime SLA'] },
      { type: 'content', title: 'Your Certification Path', content: 'Get certified and start selling with confidence.', bullets: ['Chapter 0: Intro to Monetate (platform + fundamentals)', 'Chapter 1: Sales Foundations (discovery + demos + MEDDPICC)', 'Chapter 2: Deal Execution (objections + closing + procurement)', 'Quizzes: prove you know the essentials', 'Roleplays: prove you can handle real enterprise conversations'] },
      { type: 'content', title: 'Key Takeaways', content: 'Remember these fundamentals as you begin your journey.', bullets: ['Monetate is the enterprise leader in experience optimization', 'We sell outcomes (revenue lift, conversion improvement), not features', 'Our ICP is mid-market to enterprise retailers with $50M+ revenue', 'We differentiate on unified platform, AI recommendations, and commerce expertise', 'The average customer sees 15% revenue lift and 3x ROI in 12 months'] }
    ],
    slideCount: 20,
    orderIndex: 0
  },
  {
    slug: 'sales-foundations',
    title: 'Sales Foundations',
    subtitle: 'Master the Enterprise Sales Cycle',
    description: 'Learn the psychology behind enterprise selling. This module covers discovery calls, stakeholder mapping, the MEDDPICC framework, and how to run compelling demos that convert.',
    duration: '45 min',
    pdfUrl: '',
    coverImage: '',
    agenda: [
      'Discovery Call Framework',
      'Stakeholder Mapping & Champions',
      'MEDDPICC for Monetate',
      'Running a Compelling Demo'
    ],
    slides: [
      {
        type: 'content',
        title: 'The Discovery Call Framework',
        content: 'Discovery is the most critical stage of the enterprise sales cycle. Your job is to understand their world before you prescribe a solution.',
        bullets: [
          'Lead with curiosity, not a pitch. Ask open-ended questions about their current state.',
          'Uncover pain points: "What\'s your biggest challenge with your current personalization approach?"',
          'Identify metrics they care about: conversion rate, AOV, revenue per visitor, customer lifetime value.',
          'Map the buying committee early: "Who else would be involved in evaluating a solution like this?"',
          'Set a clear next step before ending every call.'
        ]
      },
      {
        type: 'content',
        title: 'The MEDDPICC Framework',
        content: 'MEDDPICC is the gold standard for qualifying enterprise deals. Use it to ensure you are working winnable opportunities.',
        bullets: [
          'Metrics: What quantifiable outcomes does the prospect need? (e.g., 15% conversion lift)',
          'Economic Buyer: Who has the budget authority to sign off? (typically VP/C-level)',
          'Decision Criteria: What are they evaluating solutions on? (integration, ease of use, ROI)',
          'Decision Process: What is their internal buying process and timeline?',
          'Identify Pain: What specific business pain is driving this initiative?',
          'Champion: Who inside the org is advocating for your solution?',
          'Competition: Who else are they evaluating? (Dynamic Yield, Optimizely, Adobe Target)'
        ]
      },
      {
        type: 'roleplay',
        title: 'Practice: Discovery Call',
        content: 'You have a VP of E-Commerce on the phone who says they only have 5 minutes. Can you qualify the opportunity and set a next step?',
        roleplaySlug: 'rp-rushed-executive'
      },
      {
        type: 'quiz',
        title: 'Quick Check: Discovery',
        quiz: {
          question: 'What is the primary goal of a discovery call in enterprise sales?',
          options: [
            'To demo the product and show all features immediately.',
            'To understand the prospect\'s pain points, buying process, and decision criteria.',
            'To negotiate pricing and close the deal on the first call.',
            'To send a proposal and follow up in two weeks.'
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'content',
        title: 'Stakeholder Mapping',
        content: 'Enterprise deals are won or lost based on how well you navigate the buying committee. You need a champion, access to the economic buyer, and awareness of blockers.',
        bullets: [
          'Champion: The internal advocate who sells for you when you\'re not in the room.',
          'Economic Buyer: The person with budget authority (CFO, VP, or C-suite).',
          'Technical Evaluator: IT/Engineering who validates integrations and architecture.',
          'End Users: Marketing managers and analysts who will use the platform daily.',
          'Blockers: Procurement, legal, or IT security who can stall or kill deals.',
          'Multi-thread: Never rely on a single contact. Build relationships across the org.'
        ]
      },
      {
        type: 'quiz',
        title: 'Quick Check: Stakeholder Mapping',
        quiz: {
          question: 'Why is it critical to identify a "Champion" in the buying organization?',
          options: [
            'They give you the best pricing information.',
            'They sell for you internally when you are not in the room.',
            'They are always the person who signs the contract.',
            'They handle the technical implementation after the sale.'
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'roleplay',
        title: 'Practice: Stakeholder Navigation',
        content: 'A prospect says they don\'t understand how Monetate is different from their current tools. Clarify your value and identify who else needs to be in the conversation.',
        roleplaySlug: 'rp-confused-buyer'
      }
    ],
    slideCount: 31,
    orderIndex: 1
  },
  {
    slug: 'deal-execution',
    title: 'Deal Execution',
    subtitle: 'Closing Enterprise Deals',
    description: 'Move from pipeline to closed-won. This advanced module covers handling enterprise objections, navigating procurement, multi-threading, and securing executive sponsorship.',
    duration: '60 min',
    pdfUrl: '',
    coverImage: '',
    agenda: [
      'Enterprise Objection Handling',
      'Navigating Procurement',
      'Value-Based Selling',
      'Closing Techniques'
    ],
    slides: [
      {
        type: 'content',
        title: 'Enterprise Objection Handling',
        content: 'In enterprise sales, objections are not rejections—they are requests for more information. Never answer an objection until you isolate whether it is the real concern.',
        bullets: [
          'Isolate the objection: "If we could address [concern], would you be ready to move forward?"',
          'Acknowledge before responding: "That\'s a fair concern. Let me address it directly."',
          'Common objections: "We already have a solution," "It\'s too expensive," "We need to think about it."',
          'Looping technique: Acknowledge → Respond with proof/data → Re-close.',
          'Never discount immediately. Reframe price as investment with measurable ROI.'
        ]
      },
      {
        type: 'content',
        title: 'Value-Based Selling',
        content: 'Enterprise buyers don\'t buy features—they buy outcomes. Your job is to build a business case that makes the ROI undeniable.',
        bullets: [
          'Calculate the cost of inaction: "Every month without personalization costs you $X in missed revenue."',
          'Use the ROI framework: Current revenue × expected lift % = incremental revenue.',
          'Build a business case document the champion can share internally.',
          'Anchor to their metrics: conversion rate, AOV, revenue per visitor, customer retention.',
          'Reference case studies: "A similar retailer saw 22% revenue lift in 6 months."',
          'Position Monetate as the lowest-risk path to their goals.'
        ]
      },
      {
        type: 'roleplay',
        title: 'Practice: Objection Handling',
        content: 'The CFO says your platform is way over their budget. Can you reframe the conversation from cost to value?',
        roleplaySlug: 'rp-budget-watcher'
      },
      {
        type: 'quiz',
        title: 'Quick Check: Objection Handling',
        quiz: {
          question: 'What should you do immediately after a prospect raises a pricing objection?',
          options: [
            'Offer a discount to keep the deal moving.',
            'Argue that the price is justified by listing features.',
            'Acknowledge the concern, isolate it, and reframe around ROI and business value.',
            'End the call and send a revised proposal with lower pricing.'
          ],
          correctAnswer: 2
        }
      }
    ],
    slideCount: 38,
    orderIndex: 2
  }
];

export const ROLEPLAY_SEED_DATA = [
  {
    slug: 'rp-rushed-executive',
    name: "I only have 5 minutes.",
    role: 'The Rushed Executive',
    description: 'Sales Foundations → Discovery → Time-Pressured Executive. Acknowledge time constraint, set a tight agenda, and ask high-impact qualifying questions.',
    avatar: '',
    traits: ['Time Management', 'Agenda Setting', 'Qualification'],
    difficulty: 'Beginner',
    stats: { resistance: 60, objections: 20, buy_signal: 30 },
    chapterSlug: 'sales-foundations',
    phase: 'Discovery',
    placement: 'Time-Pressured Executive',
    passCriteria: 'Acknowledge time pressure, set a focused agenda under 5 minutes, ask at least one qualifying question about their current personalization stack.',
    failConditions: 'Ignoring time constraint, launching into a full pitch, or failing to ask qualifying questions.',
    winningResponse: 'Great job! You respected their time, set clear expectations, and uncovered key qualification data.',
    losingResponse: 'You need to acknowledge their time constraint immediately and lead with high-impact questions, not a product pitch.',
    orderIndex: 1
  },
  {
    slug: 'rp-skeptic',
    name: "We've tried personalization before, it didn't work.",
    role: 'The Skeptic',
    description: 'Sales Foundations → Discovery → Past Failure Objection. Acknowledge their experience, diagnose what went wrong, and differentiate Monetate\'s approach.',
    avatar: '',
    traits: ['Empathy', 'Diagnosis', 'Differentiation'],
    difficulty: 'Intermediate',
    stats: { resistance: 80, objections: 40, buy_signal: 10 },
    chapterSlug: 'sales-foundations',
    phase: 'Discovery',
    placement: 'Past Failure Objection',
    passCriteria: 'Acknowledge their past experience, ask what specifically didn\'t work, and position Monetate\'s approach as fundamentally different.',
    failConditions: 'Dismissing their experience, bashing the previous vendor, or failing to diagnose the root cause.',
    winningResponse: 'Excellent! You validated their concern, diagnosed the past failure, and showed how Monetate addresses those specific issues.',
    losingResponse: 'Never dismiss past experiences. Ask what specifically failed and show how Monetate\'s approach is different.',
    orderIndex: 2
  },
  {
    slug: 'rp-too-early',
    name: "We're not ready for this yet.",
    role: 'The Procrastinator',
    description: 'Sales Foundations → Objection Handling → Timing Objection. Reframe timing, quantify the cost of delay, and establish urgency without pressure.',
    avatar: '',
    traits: ['Urgency Creation', 'Cost of Inaction', 'Consultative Approach'],
    difficulty: 'Intermediate',
    stats: { resistance: 55, objections: 45, buy_signal: 45 },
    chapterSlug: 'sales-foundations',
    phase: 'Objection Handling',
    placement: 'Timing Objection',
    passCriteria: 'Quantify the cost of delay, reframe readiness as a competitive advantage, and propose a low-commitment next step.',
    failConditions: 'Accepting the objection at face value, using high-pressure tactics, or failing to establish urgency.',
    winningResponse: 'Great job! You showed the cost of waiting and positioned starting now as a strategic advantage.',
    losingResponse: 'Remember to quantify what delaying costs them in missed revenue and competitive positioning.',
    orderIndex: 3
  },
  {
    slug: 'rp-diy-pro',
    name: 'We built our own solution in-house.',
    role: 'The DIY Builder',
    description: 'Sales Foundations → Demo → In-House Solution. Validate their engineering investment, identify gaps in their homegrown solution, and position Monetate\'s platform advantage.',
    avatar: '',
    traits: ['Validation', 'Gap Analysis', 'Platform Value'],
    difficulty: 'Intermediate',
    stats: { resistance: 70, objections: 60, buy_signal: 40 },
    chapterSlug: 'sales-foundations',
    phase: 'Demo',
    placement: 'In-House Solution',
    passCriteria: 'Validate their engineering investment, identify maintenance/scalability gaps, and show how Monetate frees engineering resources.',
    failConditions: 'Insulting their engineering team, ignoring the build vs. buy economics, or being dismissive of their solution.',
    winningResponse: 'Perfect! You respected their investment while showing the total cost of ownership advantage of a purpose-built platform.',
    losingResponse: 'Acknowledge their engineering effort first, then explore the hidden costs of maintaining a homegrown solution.',
    orderIndex: 4
  },
  {
    slug: 'rp-loyalist',
    name: 'We already use Dynamic Yield/Optimizely.',
    role: 'The Incumbent Loyalist',
    description: 'Sales Foundations → Demo → Existing Vendor. Acknowledge their current investment, identify dissatisfaction signals, and position Monetate\'s unique strengths.',
    avatar: '',
    traits: ['Competitive Intelligence', 'Gap Discovery', 'Non-Threatening'],
    difficulty: 'Advanced',
    stats: { resistance: 85, objections: 50, buy_signal: 20 },
    chapterSlug: 'sales-foundations',
    phase: 'Demo',
    placement: 'Existing Vendor',
    passCriteria: 'Acknowledge their current vendor, ask what\'s working and what\'s not, and position Monetate\'s differentiators against specific gaps.',
    failConditions: 'Bashing the competitor, being aggressive about switching, or failing to find the gap.',
    winningResponse: 'Excellent! You found the gap in their current solution without attacking the competitor.',
    losingResponse: 'Never bash competitors directly. Ask what\'s working and what they wish was better, then position against the gaps.',
    orderIndex: 5
  },
  {
    slug: 'rp-confused-buyer',
    name: "I don't understand how this is different.",
    role: 'The Confused Buyer',
    description: 'Sales Foundations → Demo → Differentiation. Simplify the value proposition, use analogies, and clarify Monetate\'s unique position in the market.',
    avatar: '',
    traits: ['Clarity', 'Simplification', 'Value Articulation'],
    difficulty: 'Beginner',
    stats: { resistance: 40, objections: 30, buy_signal: 50 },
    chapterSlug: 'sales-foundations',
    phase: 'Demo',
    placement: 'Differentiation',
    passCriteria: 'Simplify Monetate\'s value proposition into clear, jargon-free language and connect it to their specific business needs.',
    failConditions: 'Using too much jargon, overwhelming with features, or failing to connect to their specific situation.',
    winningResponse: 'Great clarity! You explained our differentiation in terms they could immediately understand.',
    losingResponse: 'Simplify your message. Focus on the 2-3 things that matter most to THIS buyer and explain them clearly.',
    orderIndex: 6
  },
  {
    slug: 'rp-denialist',
    name: 'Our conversion rates are fine.',
    role: 'The Denialist',
    description: 'Deal Execution → Demo → Complacency. Challenge their assumptions with industry benchmarks and show them the revenue they\'re leaving on the table.',
    avatar: '',
    traits: ['Benchmarking', 'Data-Driven Challenge', 'Opportunity Framing'],
    difficulty: 'Intermediate',
    stats: { resistance: 60, objections: 70, buy_signal: 30 },
    chapterSlug: 'deal-execution',
    phase: 'Demo',
    placement: 'Complacency Challenge',
    passCriteria: 'Acknowledge their current performance, introduce relevant industry benchmarks, and quantify the revenue gap.',
    failConditions: 'Telling them they\'re wrong, being condescending, or failing to use specific data points.',
    winningResponse: 'Well done! You challenged their complacency with data while keeping the conversation collaborative.',
    losingResponse: 'Always validate their current state first, then introduce benchmarks to show the opportunity they\'re missing.',
    orderIndex: 7
  },
  {
    slug: 'rp-apathetic-owner',
    name: "Personalization isn't a priority right now.",
    role: 'The Apathetic Stakeholder',
    description: 'Deal Execution → Objection Handling → Priority Objection. Connect personalization to their actual priorities and show the cost of inaction.',
    avatar: '',
    traits: ['Priority Mapping', 'Strategic Framing', 'Executive Alignment'],
    difficulty: 'Advanced',
    stats: { resistance: 75, objections: 80, buy_signal: 20 },
    chapterSlug: 'deal-execution',
    phase: 'Objection Handling',
    placement: 'Priority Objection',
    passCriteria: 'Discover what IS a priority, connect personalization to that priority, and show the competitive risk of inaction.',
    failConditions: 'Arguing that personalization should be a priority, lecturing, or failing to connect to their actual goals.',
    winningResponse: 'Great job connecting personalization to what they actually care about!',
    losingResponse: 'Don\'t argue priorities. Find what they DO care about and show how personalization drives that outcome.',
    orderIndex: 8
  },
  {
    slug: 'rp-visual-skeptic',
    name: 'Show me the actual ROI data.',
    role: 'The Data Demander',
    description: 'Deal Execution → Pricing → ROI Proof. Present concrete case studies, industry benchmarks, and a custom ROI model for their business.',
    avatar: '',
    traits: ['Data Presentation', 'ROI Modeling', 'Credibility'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 60, buy_signal: 40 },
    chapterSlug: 'deal-execution',
    phase: 'Pricing',
    placement: 'ROI Proof',
    passCriteria: 'Present specific case study data, offer to build a custom ROI model, and reference third-party validation.',
    failConditions: 'Making vague claims, citing unverifiable numbers, or getting defensive about data requests.',
    winningResponse: 'Excellent! You backed up every claim with specific, verifiable data and offered a custom analysis.',
    losingResponse: 'Always have 2-3 specific case studies ready with concrete metrics. Offer to build a custom ROI model for their business.',
    orderIndex: 9
  },
  {
    slug: 'rp-price-shopper',
    name: "What's the annual license cost?",
    role: 'The Price Shopper',
    description: 'Deal Execution → Pricing → Early Price Request. Defer pricing until value is established and anchor on business outcomes before quoting.',
    avatar: '',
    traits: ['Value Anchoring', 'Price Deferral', 'Outcome Framing'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 90, buy_signal: 50 },
    chapterSlug: 'deal-execution',
    phase: 'Pricing',
    placement: 'Early Price Request',
    passCriteria: 'Defer the price question briefly, anchor value by discussing expected ROI, then provide a range tied to their specific requirements.',
    failConditions: 'Giving an exact price without context, dodging the question entirely, or being evasive.',
    winningResponse: 'Perfect price handling! You established value context before discussing investment levels.',
    losingResponse: 'Never give a bare price without framing it against the value they\'ll receive. Anchor on ROI first.',
    orderIndex: 10
  },
  {
    slug: 'rp-budget-watcher',
    name: "That's way over our budget.",
    role: 'The Budget Blocker',
    description: 'Deal Execution → Pricing → Budget Objection. Reframe from cost to investment, show ROI math, and explore creative deal structures.',
    avatar: '',
    traits: ['ROI Reframing', 'Creative Deal Structuring', 'Executive Engagement'],
    difficulty: 'Advanced',
    stats: { resistance: 80, objections: 90, buy_signal: 30 },
    chapterSlug: 'deal-execution',
    phase: 'Pricing',
    placement: 'Budget Objection',
    passCriteria: 'Reframe the conversation from cost to ROI, present the payback period, and explore phased or outcome-based pricing.',
    failConditions: 'Immediately offering a discount, being defensive, or agreeing the price is too high.',
    winningResponse: 'Great reframing! You showed the investment pays for itself and explored creative deal structures.',
    losingResponse: 'Never agree it\'s too expensive. Reframe as an investment with a clear payback period and explore phased rollout options.',
    orderIndex: 11
  },
  {
    slug: 'rp-comparison-shopper',
    name: 'Your competitor is 40% cheaper.',
    role: 'The Comparison Shopper',
    description: 'Deal Execution → Pricing → Competitive Price Pressure. Differentiate on value and outcomes, not price. Highlight total cost of ownership.',
    avatar: '',
    traits: ['Competitive Differentiation', 'TCO Analysis', 'Value Selling'],
    difficulty: 'Advanced',
    stats: { resistance: 85, objections: 85, buy_signal: 25 },
    chapterSlug: 'deal-execution',
    phase: 'Pricing',
    placement: 'Competitive Price Pressure',
    passCriteria: 'Reframe from license cost to total cost of ownership and business outcomes. Highlight what the cheaper solution doesn\'t include.',
    failConditions: 'Bashing the competitor, matching their price, or being defensive about pricing.',
    winningResponse: 'Excellent differentiation! You focused on total value and outcomes, not just license price.',
    losingResponse: 'Don\'t compete on price alone. Highlight total cost of ownership, implementation risk, and the revenue impact difference.',
    orderIndex: 12
  },
  {
    slug: 'rp-cautious-buyer',
    name: 'We need to run this by legal and procurement.',
    role: 'The Cautious Buyer',
    description: 'Deal Execution → Closing → Procurement Navigation. Support their process, provide enablement materials, and maintain deal momentum.',
    avatar: '',
    traits: ['Process Navigation', 'Enablement', 'Momentum Maintenance'],
    difficulty: 'Intermediate',
    stats: { resistance: 60, objections: 70, buy_signal: 60 },
    chapterSlug: 'deal-execution',
    phase: 'Closing',
    placement: 'Procurement Navigation',
    passCriteria: 'Support their internal process, offer to provide security documentation and legal redlines, and set specific timeline milestones.',
    failConditions: 'Being pushy, not understanding their internal process, or losing control of the timeline.',
    winningResponse: 'Well done! You supported their process while maintaining deal momentum and clear next steps.',
    losingResponse: 'Offer to help with procurement requirements proactively. Provide security docs, compliance certifications, and reference customers.',
    orderIndex: 13
  },
  {
    slug: 'rp-indecisive-prospect',
    name: 'I need to think about it and get back to you.',
    role: 'The Indecisive Prospect',
    description: 'Deal Execution → Closing → Stall Handling. Isolate the real concern, quantify the cost of delay, and advance the decision.',
    avatar: '',
    traits: ['Concern Isolation', 'Urgency Creation', 'Decision Facilitation'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 50, buy_signal: 50 },
    chapterSlug: 'deal-execution',
    phase: 'Closing',
    placement: 'Stall Handling',
    passCriteria: 'Isolate what specifically they need to think about, quantify the cost of delay, and propose a concrete next step with a date.',
    failConditions: 'Accepting the stall at face value, being pushy, or failing to isolate the real concern.',
    winningResponse: 'Great job isolating the real concern and creating a path to a decision!',
    losingResponse: 'Always ask: "What specifically are you thinking through—pricing, timing, or the solution fit?" Then address it directly.',
    orderIndex: 14
  },
  {
    slug: 'rp-defeater',
    name: "Send me a proposal and I'll review it.",
    role: 'The Defeater',
    description: 'Deal Execution → Closing → Proposal Deflection. Clarify decision criteria before sending anything and secure a review meeting.',
    avatar: '',
    traits: ['Criteria Clarification', 'Meeting Commitment', 'Deal Control'],
    difficulty: 'Advanced',
    stats: { resistance: 70, objections: 40, buy_signal: 40 },
    chapterSlug: 'deal-execution',
    phase: 'Closing',
    placement: 'Proposal Deflection',
    passCriteria: 'Clarify what they need in the proposal, confirm decision criteria, and schedule a proposal review meeting before sending.',
    failConditions: 'Sending a proposal into a black hole, losing control of the process, or failing to schedule a follow-up.',
    winningResponse: 'Excellent control! You qualified the proposal request and secured a review meeting.',
    losingResponse: 'Never send a proposal without scheduling a review meeting. Clarify exactly what they need to see and who will review it.',
    orderIndex: 15
  },
  {
    slug: 'rp-ultimate-test',
    name: 'Final Certification Assessment',
    role: 'The Ultimate Test',
    description: 'Post-Training → Final Certification Assessment. Demonstrate mastery across discovery, demo, objection handling, and closing in a full enterprise sales simulation.',
    avatar: '',
    traits: ['Mastery', 'Endurance', 'Consistency'],
    difficulty: 'Advanced',
    stats: { resistance: 90, objections: 90, buy_signal: 50 },
    chapterSlug: 'deal-execution',
    phase: 'Certification',
    placement: 'Final Assessment',
    passCriteria: 'Demonstrate control across at least 3 phases of the enterprise sales cycle including a successful close attempt.',
    failConditions: 'Losing control of the conversation, failing to handle objections, or not attempting to close.',
    winningResponse: 'Congratulations! You have demonstrated mastery across all phases of the Monetate enterprise sales cycle.',
    losingResponse: 'Review all chapters and practice each phase before retrying the certification.',
    orderIndex: 16
  }
];

export const BUYER_PERSONA_SEED_DATA = [
  {
    slug: "vp-ecommerce",
    name: "The VP of E-Commerce",
    subtitle: "Revenue-driven, metrics-obsessed digital leader",
    avatar: "",
    attributes: [
      "Owns the P&L for the digital channel",
      "Measured on conversion rate, revenue growth, and AOV",
      "Reports to CMO or CEO, manages merchandising and digital teams"
    ],
    whatTheyCareAbout: [
      "Revenue lift, conversion rate optimization, competitive advantage",
      "Speed to value and ease of implementation",
      "Proving ROI to the C-suite to justify continued investment"
    ],
    whatTriggersResistance: [
      "Vague ROI claims without specific data or case studies",
      "Solutions that require heavy IT involvement or long implementation timelines",
      "Vendors who don't understand commerce KPIs"
    ],
    howToWin: [
      "Lead with revenue impact: '15% average revenue lift within 6 months.'",
      "Show case studies from similar retailers with specific metrics.",
      "Demonstrate the platform with their actual website or a comparable brand.",
      "Position Monetate as a revenue-generating investment, not a cost center."
    ],
    bestPlays: [
      "Custom ROI model based on their traffic and conversion data.",
      "Offer a proof of concept with measurable success criteria."
    ],
    orderIndex: 1
  },
  {
    slug: "cto",
    name: "The CTO",
    subtitle: "Technical gatekeeper, integration-focused",
    avatar: "",
    attributes: [
      "Evaluates architecture, scalability, and security",
      "Concerned about tech debt and integration complexity",
      "Manages engineering resources and prioritizes the technical roadmap"
    ],
    whatTheyCareAbout: [
      "Clean API architecture, scalable infrastructure, data privacy compliance",
      "Minimal engineering overhead for implementation and maintenance",
      "Vendor stability and long-term platform viability"
    ],
    whatTriggersResistance: [
      "Heavy client-side JavaScript that impacts site performance",
      "Lack of server-side rendering or headless commerce support",
      "Unclear data handling, GDPR/CCPA compliance gaps"
    ],
    howToWin: [
      "Lead with architecture: server-side capabilities, edge delivery, CDN integration.",
      "Show the API documentation and integration flexibility.",
      "Address performance impact with concrete latency benchmarks.",
      "Highlight SOC 2 compliance, data residency options, and privacy controls."
    ],
    bestPlays: [
      "Technical deep-dive session with Monetate's solutions engineering team.",
      "Provide sandbox environment for their engineering team to evaluate."
    ],
    orderIndex: 2
  },
  {
    slug: "cmo",
    name: "The CMO",
    subtitle: "Brand-conscious, customer experience champion",
    avatar: "",
    attributes: [
      "Owns the brand narrative and customer experience strategy",
      "Focused on customer lifetime value and brand differentiation",
      "Reports to CEO, balances growth targets with brand integrity"
    ],
    whatTheyCareAbout: [
      "Customer experience consistency across all touchpoints",
      "Brand-safe personalization that doesn't feel intrusive",
      "Competitive differentiation through superior customer experience"
    ],
    whatTriggersResistance: [
      "Personalization that feels creepy or violates brand guidelines",
      "Solutions that only optimize for short-term conversion at the expense of brand",
      "Fragmented customer journeys across channels"
    ],
    howToWin: [
      "Frame personalization as brand experience elevation, not just conversion optimization.",
      "Show omnichannel personalization capabilities across web, email, and mobile.",
      "Demonstrate audience discovery to find and nurture high-value customer segments.",
      "Reference premium brands that use Monetate to enhance their customer experience."
    ],
    bestPlays: [
      "Customer journey mapping workshop to show experience gaps.",
      "Side-by-side comparison of personalized vs. generic experience on their site."
    ],
    orderIndex: 3
  },
  {
    slug: "cfo",
    name: "The CFO",
    subtitle: "ROI-focused, risk-averse budget guardian",
    avatar: "",
    attributes: [
      "Focused on financial returns, risk mitigation, and cost control",
      "Evaluates total cost of ownership and payback period",
      "Final sign-off on major technology investments"
    ],
    whatTheyCareAbout: [
      "Clear, measurable ROI with defined payback period",
      "Total cost of ownership including implementation and ongoing costs",
      "Contract flexibility and risk mitigation (SLAs, guarantees)"
    ],
    whatTriggersResistance: [
      "Vague business cases without specific financial projections",
      "Long payback periods or unclear path to profitability",
      "Hidden costs, scope creep, or aggressive multi-year commitments"
    ],
    howToWin: [
      "Build a detailed ROI model with conservative assumptions.",
      "Show the 3x ROI within 12 months with specific customer examples.",
      "Present flexible contract options: annual, multi-year with discounts, outcome-based.",
      "Quantify the cost of inaction: 'Every quarter you delay costs $X in missed revenue.'"
    ],
    bestPlays: [
      "CFO-ready business case document with financial projections.",
      "Reference calls with CFOs at existing Monetate customers."
    ],
    orderIndex: 4
  },
  {
    slug: "director-digital",
    name: "The Director of Digital Marketing",
    subtitle: "Hands-on operator, campaign-focused",
    avatar: "",
    attributes: [
      "Manages day-to-day digital marketing campaigns and team",
      "Hands-on with marketing technology and analytics tools",
      "Measured on campaign performance, lead generation, and conversion"
    ],
    whatTheyCareAbout: [
      "Ease of use, speed of campaign execution, self-service capabilities",
      "Integration with existing martech stack (analytics, CDP, email)",
      "Ability to run experiments quickly without engineering support"
    ],
    whatTriggersResistance: [
      "Complex platforms that require engineering for every change",
      "Steep learning curves or poor onboarding experience",
      "Lack of integration with their existing tools"
    ],
    howToWin: [
      "Demo the no-code experience builder and show how fast they can launch campaigns.",
      "Highlight integrations with their specific martech stack.",
      "Show the testing workflow: hypothesis → experiment → results in days, not weeks.",
      "Offer Monetate University access for their team's ongoing enablement."
    ],
    bestPlays: [
      "Hands-on trial or sandbox where they can build a campaign themselves.",
      "Show time-to-launch comparison: Monetate vs. their current workflow."
    ],
    orderIndex: 5
  },
  {
    slug: "it-security",
    name: "The IT Security Lead",
    subtitle: "Data privacy and compliance watchdog",
    avatar: "",
    attributes: [
      "Responsible for data security, privacy compliance, and vendor risk",
      "Evaluates every vendor against security frameworks and policies",
      "Can block or significantly delay deals with security concerns"
    ],
    whatTheyCareAbout: [
      "SOC 2 Type II compliance, GDPR/CCPA adherence, data residency",
      "Data encryption (at rest and in transit), access controls, audit logs",
      "Vendor security posture, incident response procedures, penetration testing"
    ],
    whatTriggersResistance: [
      "Inability to provide security documentation promptly",
      "Vague answers about data handling, storage, or processing locations",
      "Lack of SSO integration or role-based access controls"
    ],
    howToWin: [
      "Proactively provide SOC 2 report, security whitepaper, and DPA.",
      "Address data residency and processing locations clearly.",
      "Show SSO integration, RBAC, and audit logging capabilities.",
      "Offer to complete their security questionnaire within a defined timeline."
    ],
    bestPlays: [
      "Security-focused call with Monetate's InfoSec team early in the process.",
      "Pre-fill common security questionnaire responses and share proactively."
    ],
    orderIndex: 6
  },
  {
    slug: "data-analyst",
    name: "The Data Analyst",
    subtitle: "Evidence-driven, wants proof before commitment",
    avatar: "",
    attributes: [
      "Evaluates solutions based on data quality, statistical rigor, and measurability",
      "Skeptical of vendor claims without transparent methodology",
      "Influences technical evaluators and business stakeholders"
    ],
    whatTheyCareAbout: [
      "Statistical significance in testing, transparent algorithms, data export",
      "Integration with analytics platforms (GA4, Adobe Analytics, Snowflake)",
      "Ability to run custom analyses and build dashboards"
    ],
    whatTriggersResistance: [
      "Black-box algorithms without explainability",
      "Inflated or cherry-picked metrics in case studies",
      "Inability to export raw data or connect to their data warehouse"
    ],
    howToWin: [
      "Show the statistical engine behind testing and how it calculates significance.",
      "Demonstrate data export capabilities and warehouse integrations.",
      "Provide transparent methodology for ROI calculations and case studies.",
      "Offer a pilot with pre-agreed success metrics they can independently verify."
    ],
    bestPlays: [
      "Technical demo focused on analytics, reporting, and data integration.",
      "Share methodology documentation and whitepapers on the MONET algorithm."
    ],
    orderIndex: 7
  },
  {
    slug: "head-product",
    name: "The Head of Product",
    subtitle: "User experience advocate, roadmap-focused",
    avatar: "",
    attributes: [
      "Owns the product roadmap and user experience strategy",
      "Balances feature requests against technical debt and UX quality",
      "Collaborates closely with engineering and design teams"
    ],
    whatTheyCareAbout: [
      "Impact on site performance, page load times, and Core Web Vitals",
      "Alignment with product roadmap and long-term platform strategy",
      "User experience quality and consistency across personalized experiences"
    ],
    whatTriggersResistance: [
      "Solutions that introduce performance overhead or layout shifts",
      "Personalization that creates inconsistent or jarring user experiences",
      "Vendor lock-in that conflicts with their headless/composable architecture plans"
    ],
    howToWin: [
      "Address performance impact with specific latency and CWV data.",
      "Show server-side personalization that avoids flicker and layout shift.",
      "Demonstrate compatibility with headless and composable commerce architectures.",
      "Position Monetate as enhancing their product roadmap, not competing with it."
    ],
    bestPlays: [
      "Performance benchmark test on a staging environment.",
      "Architecture review with their engineering team showing integration patterns."
    ],
    orderIndex: 8
  },
  {
    slug: "procurement-lead",
    name: "The Procurement Lead",
    subtitle: "Process-driven, contract negotiator",
    avatar: "",
    attributes: [
      "Manages vendor evaluation, contract negotiation, and compliance",
      "Follows structured procurement processes with defined timelines",
      "Focused on getting the best terms, not necessarily the best solution"
    ],
    whatTheyCareAbout: [
      "Competitive pricing, contract flexibility, and favorable payment terms",
      "Vendor stability, references, and contractual protections",
      "Clean procurement process with required documentation"
    ],
    whatTriggersResistance: [
      "Inflexible contract terms or aggressive pricing tactics",
      "Missing procurement documentation (W-9, insurance, certifications)",
      "Vendors who try to go around procurement to push deals through"
    ],
    howToWin: [
      "Respect their process and provide all requested documentation promptly.",
      "Be transparent about pricing structure and offer creative deal options.",
      "Provide customer references and vendor stability evidence proactively.",
      "Work with your champion to align procurement timeline with business urgency."
    ],
    bestPlays: [
      "Pre-prepared procurement package: MSA, DPA, SOC 2, insurance certificates.",
      "Engage procurement early—don't wait until the end of the sales cycle."
    ],
    orderIndex: 9
  },
  {
    slug: "marketing-manager",
    name: "The Marketing Manager",
    subtitle: "Tactical executor, day-to-day user",
    avatar: "",
    attributes: [
      "Executes campaigns, manages content, and analyzes performance daily",
      "Will be the primary platform user after purchase",
      "Influences the buying decision through hands-on evaluation"
    ],
    whatTheyCareAbout: [
      "Intuitive UI, fast campaign creation, and self-service capabilities",
      "Training and support resources to get up to speed quickly",
      "Ability to show quick wins and measurable results to leadership"
    ],
    whatTriggersResistance: [
      "Clunky interfaces that require technical skills to operate",
      "Poor onboarding experience or lack of ongoing training",
      "Tools that promise self-service but still require engineering tickets"
    ],
    howToWin: [
      "Show the WYSIWYG experience builder and how quickly they can create campaigns.",
      "Demonstrate pre-built templates and use cases for common scenarios.",
      "Highlight Monetate University and ongoing customer success support.",
      "Offer a hands-on trial where they can build and launch a real campaign."
    ],
    bestPlays: [
      "Interactive demo where they drive the platform themselves.",
      "Quick-win roadmap showing what they can achieve in the first 30 days."
    ],
    orderIndex: 10
  },
  {
    slug: "cx-director",
    name: "The CX Director",
    subtitle: "Customer journey obsessed, omnichannel thinker",
    avatar: "",
    attributes: [
      "Owns the end-to-end customer experience strategy across all channels",
      "Focused on NPS, customer satisfaction, and journey consistency",
      "Champions customer-centric initiatives across the organization"
    ],
    whatTheyCareAbout: [
      "Consistent, personalized experiences across web, mobile, email, and in-store",
      "Customer journey analytics and experience measurement",
      "Reducing friction points and improving customer satisfaction scores"
    ],
    whatTriggersResistance: [
      "Solutions that only optimize one channel in isolation",
      "Personalization that feels manipulative rather than helpful",
      "Lack of customer journey visibility or cross-channel attribution"
    ],
    howToWin: [
      "Show omnichannel personalization capabilities and cross-channel consistency.",
      "Demonstrate audience discovery to identify customer journey patterns.",
      "Connect personalization to NPS improvement and customer satisfaction metrics.",
      "Frame Monetate as the foundation for a customer-centric digital strategy."
    ],
    bestPlays: [
      "Customer journey audit showing gaps that personalization can fill.",
      "Case study from a CX-focused brand showing satisfaction improvements."
    ],
    orderIndex: 11
  },
  {
    slug: "founder-ceo",
    name: "The Founder/CEO",
    subtitle: "Vision-driven, wants strategic impact",
    avatar: "",
    attributes: [
      "Focused on competitive advantage, market positioning, and growth",
      "Makes decisions based on strategic value and long-term vision",
      "Limited time, needs concise and compelling narratives"
    ],
    whatTheyCareAbout: [
      "Competitive differentiation and market leadership",
      "Revenue growth, market share expansion, and strategic positioning",
      "Innovation that positions the company ahead of competitors"
    ],
    whatTriggersResistance: [
      "Tactical or feature-level conversations that miss the strategic picture",
      "Solutions that feel incremental rather than transformational",
      "Vendors who can't articulate a compelling vision for the future"
    ],
    howToWin: [
      "Lead with strategic vision: 'Personalization is the next competitive moat in commerce.'",
      "Show how leading brands are using Monetate to pull ahead of competitors.",
      "Keep the conversation high-level: revenue impact, market positioning, customer loyalty.",
      "Reference industry trends and analyst reports on the future of digital commerce."
    ],
    bestPlays: [
      "Executive briefing with Monetate leadership (VP/C-level to C-level).",
      "Strategic roadmap presentation showing the future of personalization."
    ],
    orderIndex: 12
  },
  {
    slug: "innovation-lead",
    name: "The Innovation Lead",
    subtitle: "Trend-chaser, early adopter mentality",
    avatar: "",
    attributes: [
      "Evaluates emerging technologies and innovation opportunities",
      "Champions new initiatives and pilots within the organization",
      "Influential but may not have direct budget authority"
    ],
    whatTheyCareAbout: [
      "Cutting-edge AI/ML capabilities and innovation roadmap",
      "Being first to market with new customer experience approaches",
      "Building internal credibility by bringing winning technologies to the org"
    ],
    whatTriggersResistance: [
      "Solutions that feel dated or lack a compelling innovation roadmap",
      "Vendors who can't articulate their AI/ML strategy clearly",
      "Overly conservative implementation approaches that limit experimentation"
    ],
    howToWin: [
      "Lead with MONET AI and the innovation behind the recommendation engine.",
      "Share the product roadmap and upcoming AI-powered capabilities.",
      "Position them as the internal champion who brought in a transformative platform.",
      "Offer early access to beta features or innovation partnerships."
    ],
    bestPlays: [
      "Innovation showcase demo highlighting AI/ML capabilities and future roadmap.",
      "Invite them to a customer advisory board or innovation summit."
    ],
    orderIndex: 13
  }
];

export const EXPERT_SEED_DATA = [
  {
    slug: "sarah-chen",
    name: "Sarah Chen",
    company: "Enterprise Sales Academy",
    location: "San Francisco, CA",
    bio: "B2B SaaS enterprise sales strategist with 15+ years of experience closing seven-figure deals. MEDDPICC certification trainer and former VP of Sales at two unicorn startups. Specializes in complex enterprise sales cycles and multi-stakeholder deal navigation.",
    avatar: "",
    website: "https://enterprisesalesacademy.com",
    specialties: ["Enterprise Sales Strategy", "MEDDPICC Framework", "Complex Deal Navigation", "Sales Leadership", "Stakeholder Mapping"],
    credentials: ["Certified MEDDPICC Trainer", "Former VP Sales at 2 Unicorns", "SaaStr Speaker"],
    aiCoachRate: 15,
    consultationRate: 500,
    callReviewRate: 150,
    featured: 1,
    orderIndex: 1
  },
  {
    slug: "marcus-williams",
    name: "Marcus Williams",
    company: "SaaS Growth Partners",
    location: "New York, NY",
    bio: "Revenue operations and sales methodology expert who has built and scaled sales organizations from $5M to $100M+ ARR. Specializes in sales process design, pipeline analytics, and forecasting for B2B SaaS companies.",
    avatar: "",
    website: "https://saasgrowthpartners.com",
    specialties: ["Revenue Operations", "Sales Process Design", "Pipeline Analytics", "Forecasting", "Sales Methodology"],
    credentials: ["Revenue Operations Certified", "Scaled 3 SaaS Companies to $100M+", "HubSpot Partner"],
    aiCoachRate: 15,
    consultationRate: 450,
    callReviewRate: 140,
    featured: 1,
    orderIndex: 2
  },
  {
    slug: "jennifer-park",
    name: "Jennifer Park",
    company: "Digital Commerce Advisors",
    location: "Chicago, IL",
    bio: "E-commerce technology sales specialist with deep expertise in selling personalization, analytics, and MarTech solutions to enterprise retailers. Former Director of Sales at a leading personalization platform.",
    avatar: "",
    website: "https://digitalcommerceadvisors.com",
    specialties: ["E-Commerce Technology Sales", "Personalization Solutions", "MarTech Sales", "Retail Industry", "Solution Selling"],
    credentials: ["Former Director of Sales - Personalization Platform", "NRF Speaker", "Commerce Industry Expert"],
    aiCoachRate: 15,
    consultationRate: 400,
    callReviewRate: 125,
    featured: 0,
    orderIndex: 3
  },
  {
    slug: "david-rodriguez",
    name: "David Rodriguez",
    company: "Challenger Sales Institute",
    location: "Austin, TX",
    bio: "Challenger Sale methodology trainer and enterprise sales coach. Has trained over 5,000 B2B sales professionals in the art of teaching, tailoring, and taking control of complex sales conversations.",
    avatar: "",
    website: "https://challengersalesinstitute.com",
    specialties: ["Challenger Sale Methodology", "Enterprise Coaching", "Sales Training", "Competitive Selling", "Executive Engagement"],
    credentials: ["Certified Challenger Sale Trainer", "Trained 5,000+ Sales Professionals", "Author: Modern Enterprise Selling"],
    aiCoachRate: 15,
    consultationRate: 475,
    callReviewRate: 145,
    featured: 1,
    orderIndex: 4
  },
  {
    slug: "rachel-turner",
    name: "Rachel Turner",
    company: "Deal Strategy Group",
    location: "Boston, MA",
    bio: "Complex enterprise deal strategy coach specializing in six and seven-figure SaaS deals. Expert in multi-threading, executive sponsorship, and navigating procurement in Fortune 500 accounts.",
    avatar: "",
    website: "https://dealstrategygroup.com",
    specialties: ["Complex Deal Strategy", "Multi-Threading", "Executive Sponsorship", "Procurement Navigation", "Fortune 500 Sales"],
    credentials: ["Deal Strategy Certified Coach", "Former Enterprise AE at Salesforce", "20+ Years Enterprise Sales"],
    aiCoachRate: 15,
    consultationRate: 525,
    callReviewRate: 160,
    featured: 1,
    orderIndex: 5
  },
  {
    slug: "alex-morrison",
    name: "Alex Morrison",
    company: "Revenue Intelligence Co",
    location: "Seattle, WA",
    bio: "Sales enablement and coaching expert focused on building high-performing B2B SaaS sales teams. Specializes in creating scalable coaching programs, onboarding systems, and performance frameworks.",
    avatar: "",
    website: "https://revenueintelligenceco.com",
    specialties: ["Sales Enablement", "Coaching Programs", "Onboarding Systems", "Performance Frameworks", "Team Development"],
    credentials: ["Sales Enablement Society Member", "Built Enablement at 3 Unicorns", "ATD Certified"],
    aiCoachRate: 15,
    consultationRate: 375,
    callReviewRate: 110,
    featured: 0,
    orderIndex: 6
  },
  {
    slug: "lisa-nakamura",
    name: "Lisa Nakamura",
    company: "MarTech Sales Academy",
    location: "Los Angeles, CA",
    bio: "MarTech and personalization sales specialist with deep expertise in the commerce technology landscape. Helps sales teams articulate the value of personalization, testing, and optimization to enterprise buyers.",
    avatar: "",
    website: "https://martechsalesacademy.com",
    specialties: ["MarTech Sales", "Personalization Selling", "Commerce Technology", "Value Messaging", "Demo Excellence"],
    credentials: ["MarTech Industry Veteran", "Former Sales Leader at Adobe", "Forrester Guest Analyst"],
    aiCoachRate: 15,
    consultationRate: 425,
    callReviewRate: 130,
    featured: 1,
    orderIndex: 7
  },
  {
    slug: "james-oconnor",
    name: "James O'Connor",
    company: "Pipeline Mastery",
    location: "Denver, CO",
    bio: "Pipeline generation and outbound expert for B2B SaaS. Has built outbound engines that generated $500M+ in pipeline across multiple enterprise software companies. Specializes in account-based strategies and multi-channel prospecting.",
    avatar: "",
    website: "https://pipelinemastery.com",
    specialties: ["Pipeline Generation", "Outbound Strategy", "Account-Based Marketing", "Multi-Channel Prospecting", "SDR Team Building"],
    credentials: ["$500M+ Pipeline Generated", "Former VP Demand Gen", "Pipeline Summit Founder"],
    aiCoachRate: 15,
    consultationRate: 400,
    callReviewRate: 120,
    featured: 0,
    orderIndex: 8
  },
  {
    slug: "priya-sharma",
    name: "Priya Sharma",
    company: "Value Selling Partners",
    location: "Washington, DC",
    bio: "Value-based selling and ROI modeling expert who helps B2B SaaS companies build compelling business cases. Former management consultant who brings financial rigor to the enterprise sales process.",
    avatar: "",
    website: "https://valuesellingpartners.com",
    specialties: ["Value-Based Selling", "ROI Modeling", "Business Case Development", "Executive Presentations", "Financial Analysis"],
    credentials: ["Former McKinsey Consultant", "Value Selling Certified Trainer", "MBA - Wharton"],
    aiCoachRate: 15,
    consultationRate: 500,
    callReviewRate: 155,
    featured: 1,
    orderIndex: 9
  },
  {
    slug: "michael-foster",
    name: "Michael Foster",
    company: "SaaS Closing Academy",
    location: "Miami, FL",
    bio: "Enterprise deal closing specialist with a track record of helping sales teams increase their win rates by 30%+. Expert in negotiation tactics, closing frameworks, and overcoming enterprise procurement hurdles.",
    avatar: "",
    website: "https://saasclosingacademy.com",
    specialties: ["Enterprise Closing", "Negotiation Tactics", "Win Rate Optimization", "Procurement Navigation", "Contract Strategy"],
    credentials: ["SaaS Closing Academy Founder", "30%+ Win Rate Improvements", "Enterprise Sales Veteran"],
    aiCoachRate: 15,
    consultationRate: 450,
    callReviewRate: 135,
    featured: 0,
    orderIndex: 10
  }
];
