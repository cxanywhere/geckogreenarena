const CLOUDINARY_BASE = 'https://res.cloudinary.com/dpxfwxxzi/image/upload';

export const CHAPTER_SEED_DATA = [
  {
    slug: 'sales-foundations',
    title: 'Sales Foundations',
    subtitle: 'Master the Art of the Opener',
    description: 'Learn the psychology behind the first 10 seconds of interaction. This module covers body language, tonality, and the "Pattern Interrupt" technique that separates top performers from the rest.',
    duration: '45 min',
    pdfUrl: 'https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976787/Gecko_Green_Training_-_Certification_1_Chapter_1_1_-compressed-compressed_hctzzg.pdf',
    coverImage: `${CLOUDINARY_BASE}/arena-ai/chapters/chapter-1-cover.png`,
    agenda: [
      'The Psychology of First Impressions',
      'Pattern Interrupts & Breaking the Script',
      'Controlling the Frame & Conversation',
      'Handling Initial Resistance'
    ],
    slides: [
      {
        type: 'content',
        title: 'The First 10 Seconds',
        content: 'Your success is determined before you even finish your first sentence. Learn how to command attention instantly.',
        bullets: [
          'Non-verbal communication accounts for 93% of the first impression.',
          'The "Pattern Interrupt": Breaking the homeowner\'s automatic "No".',
          'Distance & Stance: Respecting personal space while showing confidence.'
        ]
      },
      {
        type: 'content',
        title: 'The Pattern Interrupt',
        content: 'Most homeowners have a script: "I\'m not interested." You need a script that breaks theirs.',
        bullets: [
          'Don\'t look like a salesperson (no clipboard in hand).',
          'Start with a question, not a statement.',
          'Use a casual, neighborly tone.'
        ]
      },
      {
        type: 'roleplay',
        title: 'Practice: The Pattern Interrupt',
        content: 'Put your new skills to the test immediately. Can you handle a busy homeowner without getting shut down?',
        roleplaySlug: 'rp-rushed-executive'
      },
      {
        type: 'quiz',
        title: 'Quick Check: First Impressions',
        quiz: {
          question: 'What is the primary goal of the first 10 seconds?',
          options: [
            'To sell the lawn care package immediately.',
            'To break the homeowner\'s automatic rejection pattern.',
            'To hand them a flyer.',
            'To ask for their email address.'
          ],
          correctAnswer: 1
        }
      },
      {
        type: 'content',
        title: 'Controlling the Frame',
        content: 'Whoever asks the questions controls the conversation. Stop answering questions and start asking them.',
        bullets: [
          'The "Illusion of Choice": Giving options that both lead to "Yes".',
          'Answering a question with a question.',
          'Setting the time constraint: "I only have a minute..."'
        ]
      },
      {
        type: 'quiz',
        title: 'Quick Check: Frame Control',
        quiz: {
          question: 'How do you handle a homeowner asking "How much is it?" too early?',
          options: [
            'Give them the price immediately to show transparency.',
            'Ignore the question and keep talking.',
            'Defer it: "Great question, I\'ll get to that in a second, but first..."',
            'Tell them you don\'t know.'
          ],
          correctAnswer: 2
        }
      },
      {
        type: 'roleplay',
        title: 'Practice: Frame Control',
        content: 'The homeowner is going to try to derail you. Keep control of the conversation.',
        roleplaySlug: 'rp-confused-homeowner'
      }
    ],
    slideCount: 31,
    orderIndex: 0
  },
  {
    slug: 'field-execution',
    title: 'Field Execution',
    subtitle: 'Closing the Deal & Handling Objections',
    description: 'Move from "Maybe" to "Yes". This advanced module breaks down the B-P-D-C framework and teaches you how to turn common objections into closing opportunities.',
    duration: '60 min',
    pdfUrl: 'https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976616/Gecko_Green_Training_-_Certification_1_Chapter_2_2_-compressed_2_1_hok8bh.pdf',
    coverImage: `${CLOUDINARY_BASE}/arena-ai/chapters/chapter-2-cover.png`,
    agenda: [
      'The B-P-D-C Sales Framework',
      'Isolating & Overcoming Objections',
      'Value-Based Pricing Strategies',
      'Closing Techniques & Securing Payment'
    ],
    slides: [
      {
        type: 'content',
        title: 'The B-P-D-C Framework',
        content: 'The roadmap to every successful sale. Memorize this structure.',
        bullets: [
          'B: Build Rapport - Connect as a human first.',
          'P: Problem Awareness - Show them what they can\'t unsee.',
          'D: Diagnose & Solution - Present the Gecko Green advantage.',
          'C: Close - Ask for the business confidently.'
        ]
      },
      {
        type: 'content',
        title: 'Isolating the Objection',
        content: 'Never answer an objection until you\'re sure it\'s the ONLY one.',
        bullets: [
          'Smoke screens vs. Real Objections.',
          'The "Magic Question": "If we could handle [objection], would you be ready to move forward?"',
          'Looping: Acknowledge -> Respond -> Close again.'
        ]
      },
      {
        type: 'roleplay',
        title: 'Practice: Isolating Objections',
        content: 'They say "It\'s too expensive". Is it really? Find out.',
        roleplaySlug: 'rp-budget-watcher'
      },
      {
        type: 'quiz',
        title: 'Quick Check: Objection Handling',
        quiz: {
          question: 'What should you do immediately after a homeowner gives an objection?',
          options: [
            'Argue with them why they are wrong.',
            'Immediately drop the price.',
            'Acknowledge and Isolate it.',
            'Walk away to the next house.'
          ],
          correctAnswer: 2
        }
      }
    ],
    slideCount: 38,
    orderIndex: 1
  }
];

export const ROLEPLAY_SEED_DATA = [
  {
    slug: 'rp-rushed-executive',
    name: "I'm actually really busy right now.",
    role: 'The Rushed Executive',
    description: 'Chapter 1 → Opening → First 10 Seconds. Acknowledge time pressure + set ≤60s container + ask a qualifying control question.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-rushed-executive.jpg`,
    traits: ['Time Management', 'Control Question', 'Respect'],
    difficulty: 'Beginner',
    stats: { resistance: 60, objections: 20, buy_signal: 30 },
    chapterSlug: 'sales-foundations',
    phase: 'Opening',
    placement: 'First 10 Seconds',
    passCriteria: 'Acknowledge time pressure, set a time container under 60 seconds, and ask a qualifying control question.',
    failConditions: 'Ignoring time pressure, being pushy, or failing to ask a qualifying question.',
    winningResponse: 'Great job! You acknowledged their time, set expectations, and asked a qualifying question.',
    losingResponse: 'You need to respect their time more and ask qualifying questions earlier.',
    orderIndex: 1
  },
  {
    slug: 'rp-skeptic',
    name: 'Not interested.',
    role: 'The Skeptic',
    description: 'Chapter 1 → Opening → Handling Brush-Offs. Acknowledge + reframe to specific issue + redirect.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-skeptic.jpg`,
    traits: ['Reframing', 'Persistence', 'Specifics'],
    difficulty: 'Intermediate',
    stats: { resistance: 80, objections: 40, buy_signal: 10 },
    chapterSlug: 'sales-foundations',
    phase: 'Opening',
    placement: 'Handling Brush-Offs',
    passCriteria: 'Acknowledge the brush-off, reframe to a specific lawn issue, and redirect the conversation.',
    failConditions: 'Arguing, being defensive, or giving up too quickly.',
    winningResponse: 'Excellent recovery! You reframed the objection and kept control.',
    losingResponse: 'Work on acknowledging objections before trying to redirect.',
    orderIndex: 2
  },
  {
    slug: 'rp-gatekeeper',
    name: 'No soliciting.',
    role: 'The Gatekeeper',
    description: 'Chapter 1 → Opening → Compliance & Authority. Acknowledge rule + clarify intent + request micro-permission.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-gatekeeper.jpg`,
    traits: ['Compliance', 'Intent Clarification', 'Micro-Permission'],
    difficulty: 'Advanced',
    stats: { resistance: 90, objections: 10, buy_signal: 5 },
    chapterSlug: 'sales-foundations',
    phase: 'Opening',
    placement: 'Compliance & Authority',
    passCriteria: 'Acknowledge the sign/rule, clarify you are a service provider, and request a micro-permission.',
    failConditions: 'Ignoring the sign, being disrespectful, or pushing too hard.',
    winningResponse: 'Well done! You respected the boundary while creating an opening.',
    losingResponse: 'You need to acknowledge rules and ask for permission more gracefully.',
    orderIndex: 3
  },
  {
    slug: 'rp-diy-pro',
    name: 'I do my own lawn.',
    role: 'The DIY Pro',
    description: 'Chapter 1 → Turn & Burn → DIY Pushback. Validate identity + differentiate + regain lead.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-diy-pro.jpg`,
    traits: ['Validation', 'Differentiation', 'Leadership'],
    difficulty: 'Intermediate',
    stats: { resistance: 70, objections: 60, buy_signal: 40 },
    chapterSlug: 'sales-foundations',
    phase: 'Turn & Burn',
    placement: 'DIY Pushback',
    passCriteria: 'Validate their effort, differentiate professional-grade service, and regain the lead.',
    failConditions: 'Insulting their work, being condescending, or failing to differentiate.',
    winningResponse: 'Perfect! You validated their effort while showing professional value.',
    losingResponse: 'Remember to compliment their work before showing what professionals add.',
    orderIndex: 4
  },
  {
    slug: 'rp-loyalist',
    name: 'We already have a lawn company.',
    role: 'The Loyalist',
    description: 'Chapter 1 → Turn & Burn → Existing Provider. Acknowledge + remove replacement fear + isolate gap.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-loyalist.jpg`,
    traits: ['Gap Analysis', 'Non-Threatening', 'Discovery'],
    difficulty: 'Advanced',
    stats: { resistance: 85, objections: 50, buy_signal: 20 },
    chapterSlug: 'sales-foundations',
    phase: 'Turn & Burn',
    placement: 'Existing Provider',
    passCriteria: 'Acknowledge their current provider, remove replacement fear, and find a gap in service.',
    failConditions: 'Bashing competitors, being aggressive, or failing to find the gap.',
    winningResponse: 'Excellent! You planted seeds of doubt without being pushy.',
    losingResponse: 'Never bash competitors. Find gaps in their service instead.',
    orderIndex: 5
  },
  {
    slug: 'rp-confused-homeowner',
    name: 'Why are you here?',
    role: 'The Confused Homeowner',
    description: 'Chapter 1 → Turn & Burn → Purpose Statement. State purpose clearly + direct next action.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-confused-homeowner.jpg`,
    traits: ['Clarity', 'Direction', 'Purpose'],
    difficulty: 'Beginner',
    stats: { resistance: 40, objections: 30, buy_signal: 50 },
    chapterSlug: 'sales-foundations',
    phase: 'Turn & Burn',
    placement: 'Purpose Statement',
    passCriteria: 'State your purpose clearly and direct them to the next action.',
    failConditions: 'Being vague, rambling, or failing to give clear direction.',
    winningResponse: 'Great clarity! You explained your purpose and gave clear next steps.',
    losingResponse: 'Be more direct about why you are there and what you want.',
    orderIndex: 6
  },
  {
    slug: 'rp-denialist',
    name: 'My lawn looks fine.',
    role: 'The Denialist',
    description: 'Chapter 2 → Lawn Walk → Identifying Issues. Validate + isolate specific problem + visually point.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-denialist.jpg`,
    traits: ['Visual Proof', 'Isolation', 'Validation'],
    difficulty: 'Intermediate',
    stats: { resistance: 60, objections: 70, buy_signal: 30 },
    chapterSlug: 'field-execution',
    phase: 'Lawn Walk',
    placement: 'Identifying Issues',
    passCriteria: 'Validate their perspective, isolate a specific problem, and point it out visually.',
    failConditions: 'Arguing, insulting their lawn, or failing to show specific evidence.',
    winningResponse: 'Well done! You showed them the problem without being condescending.',
    losingResponse: 'Always validate first, then show specific visual evidence.',
    orderIndex: 7
  },
  {
    slug: 'rp-apathetic-owner',
    name: "Weeds don't bother me.",
    role: 'The Apathetic Owner',
    description: 'Chapter 2 → Lawn Walk → Educating on Spread. Reframe consequence + keep discovery.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-apathetic-owner.jpg`,
    traits: ['Consequence Reframing', 'Education', 'Discovery'],
    difficulty: 'Advanced',
    stats: { resistance: 75, objections: 80, buy_signal: 20 },
    chapterSlug: 'field-execution',
    phase: 'Lawn Walk',
    placement: 'Educating on Spread',
    passCriteria: 'Reframe the consequences of inaction and continue discovery.',
    failConditions: 'Lecturing, being preachy, or failing to connect to their values.',
    winningResponse: 'Great job connecting consequences to what they care about!',
    losingResponse: 'Find what they DO care about and connect the problem to that.',
    orderIndex: 8
  },
  {
    slug: 'rp-visual-skeptic',
    name: "I don't see the issue.",
    role: 'The Visual Skeptic',
    description: 'Chapter 2 → Lawn Walk → Showing, Not Telling. Demonstrate visually, not verbally.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-visual-skeptic.jpg`,
    traits: ['Demonstration', 'Visual Selling', 'Clarity'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 60, buy_signal: 40 },
    chapterSlug: 'field-execution',
    phase: 'Lawn Walk',
    placement: 'Showing, Not Telling',
    passCriteria: 'Demonstrate the issue visually rather than just describing it.',
    failConditions: 'Only talking, not showing, or being vague.',
    winningResponse: 'Excellent visual demonstration! Seeing is believing.',
    losingResponse: 'Show, don\'t tell. Walk them to the problem and point.',
    orderIndex: 9
  },
  {
    slug: 'rp-price-shopper',
    name: 'How much does it cost?',
    role: 'The Price Shopper',
    description: 'Chapter 2 → Pricing → Before Quoting. Defer price + anchor value first.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-price-shopper.jpg`,
    traits: ['Value Anchoring', 'Control', 'Deferral'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 90, buy_signal: 50 },
    chapterSlug: 'field-execution',
    phase: 'Pricing',
    placement: 'Before Quoting',
    passCriteria: 'Defer the price question and anchor value first.',
    failConditions: 'Giving price immediately without building value.',
    winningResponse: 'Perfect price deferral! Value before price always.',
    losingResponse: 'Never give price before establishing value. Defer and anchor.',
    orderIndex: 10
  },
  {
    slug: 'rp-budget-watcher',
    name: "That's expensive.",
    role: 'The Budget Watcher',
    description: 'Chapter 2 → Pricing → Objection Handling. Normalize + re-anchor to outcome.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-budget-watcher.jpg`,
    traits: ['Normalization', 'Outcome Focus', 'Confidence'],
    difficulty: 'Advanced',
    stats: { resistance: 80, objections: 90, buy_signal: 30 },
    chapterSlug: 'field-execution',
    phase: 'Pricing',
    placement: 'Objection Handling',
    passCriteria: 'Normalize the price and re-anchor to the outcome value.',
    failConditions: 'Immediately discounting, being defensive, or agreeing it\'s expensive.',
    winningResponse: 'Great normalization! You reframed price in terms of value.',
    losingResponse: 'Never agree it\'s expensive. Normalize and re-anchor to outcomes.',
    orderIndex: 11
  },
  {
    slug: 'rp-comparison-shopper',
    name: 'Another company is cheaper.',
    role: 'The Comparison Shopper',
    description: 'Chapter 2 → Pricing → Competitor Comparison. Reframe to outcome, not price.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-comparison-shopper.jpg`,
    traits: ['Differentiation', 'Value Selling', 'Reframing'],
    difficulty: 'Advanced',
    stats: { resistance: 85, objections: 85, buy_signal: 25 },
    chapterSlug: 'field-execution',
    phase: 'Pricing',
    placement: 'Competitor Comparison',
    passCriteria: 'Reframe the conversation from price to outcome value.',
    failConditions: 'Bashing competitors, matching price, or being defensive.',
    winningResponse: 'Excellent differentiation! You focused on results, not price.',
    losingResponse: 'Don\'t compete on price. Compete on outcomes and guarantees.',
    orderIndex: 12
  },
  {
    slug: 'rp-cautious-buyer',
    name: 'Why do I have to pay now?',
    role: 'The Cautious Buyer',
    description: 'Chapter 2 → Close → Payment Explanation. Normalize process + remove risk + maintain close.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-cautious-buyer.jpg`,
    traits: ['Risk Reversal', 'Normalization', 'Closing'],
    difficulty: 'Intermediate',
    stats: { resistance: 60, objections: 70, buy_signal: 60 },
    chapterSlug: 'field-execution',
    phase: 'Closing',
    placement: 'Payment Explanation',
    passCriteria: 'Normalize the payment process, remove risk, and maintain the close.',
    failConditions: 'Being pushy, not explaining the process, or creating more anxiety.',
    winningResponse: 'Well done! You normalized payment and removed risk concerns.',
    losingResponse: 'Explain the process, emphasize guarantees, and remove risk.',
    orderIndex: 13
  },
  {
    slug: 'rp-indecisive-prospect',
    name: 'I need to think about it.',
    role: 'The Indecisive Prospect',
    description: 'Chapter 2 → Close → Handling Stalls. Isolate concern + advance decision.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-indecisive-prospect.jpg`,
    traits: ['Isolation', 'Advancement', 'Patience'],
    difficulty: 'Intermediate',
    stats: { resistance: 50, objections: 50, buy_signal: 50 },
    chapterSlug: 'field-execution',
    phase: 'Closing',
    placement: 'Handling Stalls',
    passCriteria: 'Isolate the real concern and advance the decision.',
    failConditions: 'Accepting the stall, being pushy, or failing to isolate.',
    winningResponse: 'Great job isolating the real concern and advancing!',
    losingResponse: 'Always ask what specifically they need to think about.',
    orderIndex: 14
  },
  {
    slug: 'rp-defeater',
    name: "I'll call you / send me something.",
    role: 'The Defeater',
    description: 'Chapter 2 → Close → Securing Next Step. Clarify decision criteria + regain control.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-defeater.jpg`,
    traits: ['Criteria Clarification', 'Control', 'Closing'],
    difficulty: 'Advanced',
    stats: { resistance: 70, objections: 40, buy_signal: 40 },
    chapterSlug: 'field-execution',
    phase: 'Closing',
    placement: 'Securing Next Step',
    passCriteria: 'Clarify decision criteria and regain control of the next step.',
    failConditions: 'Accepting the deflection, leaving materials, or losing control.',
    winningResponse: 'Excellent control! You secured a concrete next step.',
    losingResponse: 'Never leave materials. Clarify criteria and set a specific callback.',
    orderIndex: 15
  },
  {
    slug: 'rp-ultimate-test',
    name: 'Final Certification Assessment',
    role: 'The Ultimate Test',
    description: 'Post-Training → Final Certification Assessment. Rep must show control across ≥3 phases including successful Phase-5 handling.',
    avatar: `${CLOUDINARY_BASE}/arena-ai/personas/rp-ultimate-test.jpg`,
    traits: ['Mastery', 'Endurance', 'Consistency'],
    difficulty: 'Advanced',
    stats: { resistance: 90, objections: 90, buy_signal: 50 },
    chapterSlug: 'field-execution',
    phase: 'Certification',
    placement: 'Final Assessment',
    passCriteria: 'Demonstrate control across at least 3 phases including a successful close.',
    failConditions: 'Losing control, failing to handle objections, or not closing.',
    winningResponse: 'Congratulations! You have demonstrated mastery across all phases.',
    losingResponse: 'Review all chapters and practice each phase before retrying.',
    orderIndex: 16
  }
];

export const BUYER_PERSONA_SEED_DATA = [
  {
    slug: "busy-professional",
    name: "The Busy Professional",
    subtitle: "Time-poor, task-saturated decision maker",
    avatar: `${CLOUDINARY_BASE}/v1767646940/arena-ai/personas/persona_the_busy_professional_1767646940115.jpg`,
    attributes: [
      "Time-poor, task-saturated, decision fatigue",
      "Wants a good outcome, minimal friction",
      "High responsiveness to structure and certainty"
    ],
    whatTheyCareAbout: [
      "Convenience, speed, predictable results",
      '"Make this easy for me"'
    ],
    whatTriggersResistance: [
      "Long explanations, vague benefits, unclear next steps",
      'Anything that feels like "a pitch"'
    ],
    howToWin: [
      "Opening: Use the ≤60-second container and a control question to keep them engaged.",
      'Turn & Burn: Move quickly to a visible issue—"show, don\'t tell."',
      "Value frame: Sell the outcome (less stress, pride, time back), not products.",
      "Close: Offer prepay as the default for simplicity; autopay as backup.",
      '"We\'re already helping homes on your street with this exact issue."'
    ],
    bestPlays: [
      "Fast lawn walk: identify one problem area and connect to the program.",
      'Close with "Present → Protect → Prompt" (standard process + risk removal + decision prompt).'
    ],
    orderIndex: 1
  },
  {
    slug: "brush-off-defender",
    name: "The Brush-Off Defender",
    subtitle: '"Not interested," "Busy," short answers at the door',
    avatar: `${CLOUDINARY_BASE}/v1767646960/arena-ai/personas/persona_the_brush_off_defender_1767646959392.jpg`,
    attributes: [
      "Defensive posture, wants to end the interaction quickly",
      "May not be truly opposed—just protecting time and space"
    ],
    whatTheyCareAbout: [
      "Respect, brevity, control of their doorway"
    ],
    whatTriggersResistance: [
      "Arguing, pushing, talking faster, ignoring cues"
    ],
    howToWin: [
      "Acknowledge + reframe: don't debate interest; shift to a specific lawn issue.",
      "Ask an either/or control question tied to what you see (edge weeds, thinning).",
      'Request micro-permission: "Mind if I show you real quick?"'
    ],
    bestPlays: [
      '"Most people weren\'t interested until I pointed out one thing…"',
      "Move to the lawn immediately; don't stay at the porch."
    ],
    orderIndex: 2
  },
  {
    slug: "rule-first-homeowner",
    name: 'The Rule-First / "No Soliciting" Homeowner',
    subtitle: "Compliance-oriented, boundary-driven",
    avatar: `${CLOUDINARY_BASE}/v1767646978/arena-ai/personas/persona_the_rule_first_homeowner_1767646978037.jpg`,
    attributes: [
      "Compliance-oriented, boundary-driven",
      "May be open if they feel respected and safe"
    ],
    whatTheyCareAbout: [
      "Respecting rules, clarity of intent"
    ],
    whatTriggersResistance: [
      "Debating the sign/policy, continuing to talk after being stopped"
    ],
    howToWin: [
      "Acknowledge rule + clarify intent + ask micro-permission.",
      '"I\'m flagging an issue I noticed."'
    ],
    bestPlays: [
      '"Not selling at the door" framing, then point to the lawn for 10–20 seconds.',
      "If denied: exit professionally (protect brand and future conversion)."
    ],
    orderIndex: 3
  },
  {
    slug: "proud-diyer",
    name: "The Proud DIYer",
    subtitle: "Identity tied to self-reliance and competence",
    avatar: `${CLOUDINARY_BASE}/v1767646997/arena-ai/personas/persona_the_proud_diyer_1767646996498.jpg`,
    attributes: [
      "Identity tied to self-reliance and competence",
      "Often knowledgeable but missing seasonal/timing nuances"
    ],
    whatTheyCareAbout: [
      "Respect for their effort, mastery, control"
    ],
    whatTriggersResistance: [
      'Implying they can\'t do it, "DIY doesn\'t work," jargon'
    ],
    howToWin: [
      "Validate identity first.",
      '"DIY usually misses this time-of-year issue."',
      "Ask permission to show a specific problem area."
    ],
    bestPlays: [
      "Position Gecko Green as a specialist in timing and consistency.",
      '"You keep doing X; we handle seasonality and product timing."'
    ],
    orderIndex: 4
  },
  {
    slug: "loyal-existing-provider",
    name: "The Loyal Existing-Provider Customer",
    subtitle: "Already paying someone; avoids switching friction",
    avatar: `${CLOUDINARY_BASE}/v1767647017/arena-ai/personas/persona_the_loyal_existing_provider_customer_1767647016967.jpg`,
    attributes: [
      "Already paying someone; avoids switching friction",
      "Often dissatisfied in small ways but not motivated to change"
    ],
    whatTheyCareAbout: [
      'Stability, avoiding hassle, "don\'t make me start over"'
    ],
    whatTriggersResistance: [
      "Competitor attacks, replacement pressure"
    ],
    howToWin: [
      '"Not trying to replace them."',
      '"Are they addressing weeds along this edge?"',
      'Offer a "second opinion" vibe: objective, calm, specific.'
    ],
    bestPlays: [
      "Outcome comparison (not price): consistency, seasonality, service calls.",
      "Close toward the problem they still have."
    ],
    orderIndex: 5
  },
  {
    slug: "looks-fine-optimist",
    name: 'The "Looks Fine" Optimist',
    subtitle: "Satisfied enough; low urgency",
    avatar: `${CLOUDINARY_BASE}/v1767647036/arena-ai/personas/persona_the_looks_fine_optimist_1767647036309.jpg`,
    attributes: [
      "Satisfied enough; low urgency",
      "Doesn't notice early signs"
    ],
    whatTheyCareAbout: [
      "Avoiding unnecessary spending, maintaining status quo"
    ],
    whatTriggersResistance: [
      'Broad claims, "your lawn is bad," abstract explanations'
    ],
    howToWin: [
      '"Overall it does."',
      '"This is what I\'m flagging…"',
      "Point to an early signal (edge discoloration, spread line)."
    ],
    bestPlays: [
      "Prevention framing: protect healthy grass from spread.",
      '"Catching it early is cheaper/easier."'
    ],
    orderIndex: 6
  },
  {
    slug: "weed-indifferent",
    name: "The Weed-Indifferent Homeowner",
    subtitle: '"Weeds don\'t bother me."',
    avatar: `${CLOUDINARY_BASE}/v1767647054/arena-ai/personas/persona_the_weed_indifferent_homeowner_1767647053911.jpg`,
    attributes: [
      "Low aesthetic sensitivity",
      "Might care more about property value, kids/pets safety"
    ],
    whatTheyCareAbout: [
      "Avoiding bigger future problems, protecting what's already good"
    ],
    whatTriggersResistance: [
      '"It looks ugly" framing'
    ],
    howToWin: [
      "Reframe consequence: weeds spread and crowd out healthy grass.",
      '"What matters more—less work, safer yard, resale value?"'
    ],
    bestPlays: [
      "Prevention and protection framing.",
      "Minimal-hassle program narrative."
    ],
    orderIndex: 7
  },
  {
    slug: "skeptic",
    name: 'The Skeptic / "I Don\'t See the Issue"',
    subtitle: "Doubtful, needs proof",
    avatar: `${CLOUDINARY_BASE}/v1767647073/arena-ai/personas/persona_the_skeptic_1767647073173.jpg`,
    attributes: [
      "Doubtful, needs proof",
      "Wants clarity and competence"
    ],
    whatTheyCareAbout: [
      'Evidence, directness, not being "sold"'
    ],
    whatTriggersResistance: [
      "Long scientific lectures, abstract talk"
    ],
    howToWin: [
      "Show, don't tell: point to one unmistakable sign.",
      '"Do you see that?"'
    ],
    bestPlays: [
      "4-step diagnosis: observe → why → program tie-in → expectations.",
      "Close value-first."
    ],
    orderIndex: 8
  },
  {
    slug: "price-first-shopper",
    name: "The Price-First Shopper",
    subtitle: '"How much is it?" early',
    avatar: `${CLOUDINARY_BASE}/v1767647092/arena-ai/personas/persona_the_price_first_shopper_1767647091980.jpg`,
    attributes: [
      "Leads with cost to control conversation",
      "May be comparison shopping"
    ],
    whatTheyCareAbout: [
      "Value clarity, fairness, no surprises"
    ],
    whatTriggersResistance: [
      "Immediate quoting without context"
    ],
    howToWin: [
      "Defer briefly: anchor value before price.",
      "Explain what the price covers and the outcome path.",
      "Quote with confidence."
    ],
    bestPlays: [
      '"Price only makes sense after what it includes…"',
      "Program structure + service calls + seasonal timing as value anchors."
    ],
    orderIndex: 9
  },
  {
    slug: "thats-expensive-reactor",
    name: 'The "That\'s Expensive" Reactor',
    subtitle: "Emotional reaction to price",
    avatar: `${CLOUDINARY_BASE}/v1767647110/arena-ai/personas/persona_the_expensive_reactor_1767647109863.jpg`,
    attributes: [
      "Emotional reaction to price",
      "Often not rejecting; testing conviction"
    ],
    whatTheyCareAbout: [
      "Outcomes, permanence, avoiding wasted spend"
    ],
    whatTriggersResistance: [
      "Discounting immediately, defensive justification"
    ],
    howToWin: [
      '"Most people said that before seeing results."',
      "Bring back to the problem and solution path.",
      "Move to autopay only after attempting prepay."
    ],
    bestPlays: [
      '"Fix this permanently / control and reduction over time."',
      "Maintain calm and keep closing."
    ],
    orderIndex: 10
  },
  {
    slug: "competitor-price-comparer",
    name: "The Competitor-Price Comparer",
    subtitle: '"Another company is cheaper."',
    avatar: `${CLOUDINARY_BASE}/v1767647128/arena-ai/personas/persona_the_competitor_price_comparer_1767647127556.jpg`,
    attributes: [
      "Anchored on price; may be burned before",
      "Wants confidence they're not overpaying"
    ],
    whatTheyCareAbout: [
      "Getting the problem solved, consistency"
    ],
    whatTriggersResistance: [
      "Attacking competitor, emotional language"
    ],
    howToWin: [
      "Reframe: cheaper often means fewer treatments.",
      '"Does the issue actually get solved?"',
      "Neutral tone, outcome comparison."
    ],
    bestPlays: [
      "Compare on: seasonal timing, full program, free service calls.",
      "Keep it respectful and factual."
    ],
    orderIndex: 11
  },
  {
    slug: "payment-process-resister",
    name: "The Payment-Process Resister",
    subtitle: '"Why do I have to pay now?"',
    avatar: `${CLOUDINARY_BASE}/v1767647146/arena-ai/personas/persona_the_payment_process_resister_1767647146010.jpg`,
    attributes: [
      "Risk-sensitive, cautious",
      "Needs reassurance and process clarity"
    ],
    whatTheyCareAbout: [
      "Fairness, guarantees, not being trapped"
    ],
    whatTriggersResistance: [
      '"That\'s just how we do it," defensiveness'
    ],
    howToWin: [
      "Normalize: everyone starts the same way.",
      "Remove risk: guarantee/refund framing.",
      "Prompt the decision again."
    ],
    bestPlays: [
      "Present → protect → prompt",
      "Shift to autopay as backup if needed."
    ],
    orderIndex: 12
  },
  {
    slug: "stallers",
    name: "The Stallers",
    subtitle: '"I need to think about it"',
    avatar: `${CLOUDINARY_BASE}/v1767647165/arena-ai/personas/persona_the_staller_1767647165193.jpg`,
    attributes: [
      "Avoids saying no; unresolved concern",
      "Needs help clarifying decision criteria"
    ],
    whatTheyCareAbout: [
      "Confidence, clarity, reducing regret"
    ],
    whatTriggersResistance: [
      "Accepting the stall and leaving"
    ],
    howToWin: [
      "Isolate the concern: price, timing, treatment, trust.",
      'Convert "send me something" into decision criteria.',
      "Advance toward a decision on the spot."
    ],
    bestPlays: [
      '"What part are you thinking through—price, timing, or the treatment itself?"',
      '"Before I go, what would you be deciding after you look it over?"'
    ],
    orderIndex: 13
  }
];
