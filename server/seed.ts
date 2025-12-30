import { db } from "./db";
import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  try {
    // Seed training chapters
    const chapter1 = await storage.createChapter({
      title: "Sales Foundations",
      subtitle: "Master the Art of the Opener",
      description: "Learn the psychology behind the first 10 seconds of interaction. This module covers body language, tonality, and the 'Pattern Interrupt' technique that separates top performers from the rest.",
      duration: "45 min",
      pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976787/Gecko_Green_Training_-_Certification_1_Chapter_1_1_-compressed-compressed_hctzzg.pdf",
      coverImage: "",
      agenda: [
        "The Psychology of First Impressions",
        "Pattern Interrupts & Breaking the Script",
        "Controlling the Frame & Conversation",
        "Handling Initial Resistance"
      ],
      slides: [
        {
          type: 'content',
          title: "The First 10 Seconds",
          content: "Your success is determined before you even finish your first sentence. Learn how to command attention instantly.",
          bullets: [
            "Non-verbal communication accounts for 93% of the first impression.",
            "The 'Pattern Interrupt': Breaking the homeowner's automatic 'No'.",
            "Distance & Stance: Respecting personal space while showing confidence."
          ]
        },
        {
          type: 'content',
          title: "The Pattern Interrupt",
          content: "Most homeowners have a script: 'I'm not interested.' You need a script that breaks theirs.",
          bullets: [
            "Don't look like a salesperson (no clipboard in hand).",
            "Start with a question, not a statement.",
            "Use a casual, neighborly tone."
          ]
        },
        {
          type: 'roleplay',
          title: "Practice: The Pattern Interrupt",
          content: "Put your new skills to the test immediately. Can you handle a busy homeowner without getting shut down?",
          roleplayId: "rp-1"
        },
        {
          type: 'quiz',
          title: "Quick Check: First Impressions",
          quiz: {
            question: "What is the primary goal of the first 10 seconds?",
            options: [
              "To sell the lawn care package immediately.",
              "To break the homeowner's automatic rejection pattern.",
              "To hand them a flyer.",
              "To ask for their email address."
            ],
            correctAnswer: 1
          }
        },
        {
          type: 'content',
          title: "Controlling the Frame",
          content: "Whoever asks the questions controls the conversation. Stop answering questions and start asking them.",
          bullets: [
            "The 'Illusion of Choice': Giving options that both lead to 'Yes'.",
            "Answering a question with a question.",
            "Setting the time constraint: 'I only have a minute...'"
          ]
        },
        {
          type: 'quiz',
          title: "Quick Check: Frame Control",
          quiz: {
            question: "How do you handle a homeowner asking 'How much is it?' too early?",
            options: [
              "Give them the price immediately to show transparency.",
              "Ignore the question and keep talking.",
              "Defer it: 'Great question, I'll get to that in a second, but first...'",
              "Tell them you don't know."
            ],
            correctAnswer: 2
          }
        },
        {
          type: 'roleplay',
          title: "Practice: Frame Control",
          content: "The homeowner is going to try to derail you. Keep control of the conversation.",
          roleplayId: "rp-6"
        }
      ],
      orderIndex: 0
    });

    const chapter2 = await storage.createChapter({
      title: "Field Execution",
      subtitle: "Closing the Deal & Handling Objections",
      description: "Move from 'Maybe' to 'Yes'. This advanced module breaks down the B-P-D-C framework and teaches you how to turn common objections into closing opportunities.",
      duration: "60 min",
      pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976616/Gecko_Green_Training_-_Certification_1_Chapter_2_2_-compressed_2_1_hok8bh.pdf",
      coverImage: "",
      agenda: [
        "The B-P-D-C Sales Framework",
        "Isolating & Overcoming Objections",
        "Value-Based Pricing Strategies",
        "Closing Techniques & Securing Payment"
      ],
      slides: [
        {
          type: 'content',
          title: "The B-P-D-C Framework",
          content: "The roadmap to every successful sale. Memorize this structure.",
          bullets: [
            "B: Build Rapport - Connect as a human first.",
            "P: Problem Awareness - Show them what they can't unsee.",
            "D: Diagnose & Solution - Present the Gecko Green advantage.",
            "C: Close - Ask for the business confidently."
          ]
        },
        {
          type: 'content',
          title: "Isolating the Objection",
          content: "Never answer an objection until you're sure it's the ONLY one.",
          bullets: [
            "Smoke screens vs. Real Objections.",
            "The 'Magic Question': 'If we could handle [objection], would you be ready to move forward?'",
            "Looping: Acknowledge -> Respond -> Close again."
          ]
        },
        {
          type: 'roleplay',
          title: "Practice: Isolating Objections",
          content: "They say 'It's too expensive'. Is it really? Find out.",
          roleplayId: "rp-11"
        },
        {
          type: 'quiz',
          title: "Quick Check: Objection Handling",
          quiz: {
            question: "What should you do immediately after a homeowner gives an objection?",
            options: [
              "Argue with them why they are wrong.",
              "Immediately drop the price.",
              "Acknowledge and Isolate it.",
              "Walk away to the next house."
            ],
            correctAnswer: 2
          }
        }
      ],
      orderIndex: 1
    });

    console.log("✓ Created chapters");

    // Seed roleplays
    const roleplays = [
      {
        name: "I'm actually really busy right now.",
        role: "The Busy Homeowner",
        description: "Chapter 1 → Opening → First 10 Seconds. Acknowledge time pressure + set ≤60s container + ask a qualifying control question.",
        avatar: "",
        traits: ["Time Management", "Control Question", "Respect"],
        difficulty: "Beginner",
        stats: { resistance: 60, objections: 20, buy_signal: 30 },
        chapterId: chapter1.id
      },
      {
        name: "Not interested.",
        role: "The Dismissive Prospect",
        description: "Chapter 1 → Opening → Handling Brush-Offs. Acknowledge + reframe to specific issue + redirect.",
        avatar: "",
        traits: ["Reframing", "Persistence", "Specifics"],
        difficulty: "Intermediate",
        stats: { resistance: 80, objections: 40, buy_signal: 10 },
        chapterId: chapter1.id
      },
      {
        name: "No soliciting.",
        role: "The Rule Follower",
        description: "Chapter 1 → Opening → Compliance & Authority. Acknowledge rule + clarify intent + request micro-permission.",
        avatar: "",
        traits: ["Compliance", "Intent Clarification", "Micro-Permission"],
        difficulty: "Advanced",
        stats: { resistance: 90, objections: 10, buy_signal: 5 },
        chapterId: chapter1.id
      },
      {
        name: "I do my own lawn.",
        role: "The DIY Enthusiast",
        description: "Chapter 1 → Turn & Burn → DIY Pushback. Validate identity + differentiate + regain lead.",
        avatar: "",
        traits: ["Validation", "Differentiation", "Leadership"],
        difficulty: "Intermediate",
        stats: { resistance: 70, objections: 60, buy_signal: 40 },
        chapterId: chapter1.id
      },
      {
        name: "We already have a lawn company.",
        role: "The Loyalist",
        description: "Chapter 1 → Turn & Burn → Existing Provider. Acknowledge + remove replacement fear + isolate gap.",
        avatar: "",
        traits: ["Gap Analysis", "Non-Threatening", "Discovery"],
        difficulty: "Advanced",
        stats: { resistance: 85, objections: 50, buy_signal: 20 },
        chapterId: chapter1.id
      },
      {
        name: "Why are you here?",
        role: "The Confused Homeowner",
        description: "Chapter 1 → Turn & Burn → Purpose Statement. State purpose clearly + direct next action.",
        avatar: "",
        traits: ["Clarity", "Direction", "Purpose"],
        difficulty: "Beginner",
        stats: { resistance: 40, objections: 30, buy_signal: 50 },
        chapterId: chapter1.id
      },
      {
        name: "My lawn looks fine.",
        role: "The Denialist",
        description: "Chapter 2 → Lawn Walk → Identifying Issues. Validate + isolate specific problem + visually point.",
        avatar: "",
        traits: ["Visual Proof", "Isolation", "Validation"],
        difficulty: "Intermediate",
        stats: { resistance: 60, objections: 70, buy_signal: 30 },
        chapterId: chapter2.id
      },
      {
        name: "Weeds don't bother me.",
        role: "The Apathetic Homeowner",
        description: "Chapter 2 → Lawn Walk → Educating on Spread. Reframe consequence + keep discovery.",
        avatar: "",
        traits: ["Consequence Reframing", "Education", "Discovery"],
        difficulty: "Advanced",
        stats: { resistance: 75, objections: 80, buy_signal: 20 },
        chapterId: chapter2.id
      },
      {
        name: "I don't see the issue.",
        role: "The Visual Skeptic",
        description: "Chapter 2 → Lawn Walk → Showing, Not Telling. Demonstrate visually, not verbally.",
        avatar: "",
        traits: ["Demonstration", "Visual Selling", "Clarity"],
        difficulty: "Intermediate",
        stats: { resistance: 50, objections: 60, buy_signal: 40 },
        chapterId: chapter2.id
      },
      {
        name: "How much does it cost?",
        role: "The Price Shopper",
        description: "Chapter 2 → Pricing → Deferral. Frame price around value, not number.",
        avatar: "",
        traits: ["Value Selling", "Deferral", "Control"],
        difficulty: "Intermediate",
        stats: { resistance: 65, objections: 75, buy_signal: 35 },
        chapterId: chapter2.id
      },
      {
        name: "That's too expensive.",
        role: "The Budget Watcher",
        description: "Chapter 2 → Pricing → Objection Isolation. Isolate + reframe cost as investment.",
        avatar: "",
        traits: ["Isolation", "Investment Reframing", "Closing"],
        difficulty: "Advanced",
        stats: { resistance: 80, objections: 90, buy_signal: 25 },
        chapterId: chapter2.id
      },
      {
        name: "I need to think about it.",
        role: "The Indecisive Homeowner",
        description: "Chapter 2 → Closing → Stall Handling. Isolate + create urgency.",
        avatar: "",
        traits: ["Isolation", "Urgency", "Closing"],
        difficulty: "Advanced",
        stats: { resistance: 70, objections: 85, buy_signal: 30 },
        chapterId: chapter2.id
      },
      {
        name: "Can you leave me a quote?",
        role: "The Document Requester",
        description: "Chapter 2 → Closing → Quote Handling. Devalue document + close now.",
        avatar: "",
        traits: ["Urgency", "Closing", "Devaluation"],
        difficulty: "Intermediate",
        stats: { resistance: 60, objections: 70, buy_signal: 40 },
        chapterId: chapter2.id
      },
      {
        name: "I need to talk to my spouse.",
        role: "The Decision Delegator",
        description: "Chapter 2 → Closing → Spouse Objection. Isolate decision maker + get contact.",
        avatar: "",
        traits: ["Isolation", "Decision Making", "Follow-up"],
        difficulty: "Advanced",
        stats: { resistance: 75, objections: 80, buy_signal: 20 },
        chapterId: chapter2.id
      },
      {
        name: "Can you come back later?",
        role: "The Rescheduler",
        description: "Chapter 2 → Closing → Commitment. Get firm commitment or close now.",
        avatar: "",
        traits: ["Commitment", "Urgency", "Closing"],
        difficulty: "Intermediate",
        stats: { resistance: 55, objections: 65, buy_signal: 45 },
        chapterId: chapter2.id
      },
      {
        name: "What makes you better than TruGreen?",
        role: "The Comparison Shopper",
        description: "Chapter 2 → Closing → Differentiation. Differentiate without bashing.",
        avatar: "",
        traits: ["Differentiation", "Positioning", "Closing"],
        difficulty: "Advanced",
        stats: { resistance: 70, objections: 75, buy_signal: 35 },
        chapterId: chapter2.id
      }
    ];

    for (const rp of roleplays) {
      await storage.createRoleplay(rp);
    }

    console.log("✓ Created roleplays");

    // Seed resources
    const resources = [
      {
        type: "call",
        title: "Handling the 'Not Interested' at the Door",
        description: "Listen to how Top Performer Sarah Jenkins turns a quick 'no' into a scheduled appointment using the Pattern Interrupt technique.",
        learningOutcome: "Learn to stay calm, acknowledge the resistance, and pivot to a control question immediately.",
        duration: "4:32",
        author: "Sarah Jenkins",
        thumbnail: "",
        tags: ["Objection Handling", "Opener", "Top 1%"]
      },
      {
        type: "call",
        title: "Closing the 'Think About It' Objection",
        description: "Mike Ross demonstrates the perfect loop to handle a stalling homeowner who wants to talk to their spouse.",
        learningOutcome: "Master the art of isolating the real objection and creating urgency without being pushy.",
        duration: "6:15",
        author: "Mike Ross",
        thumbnail: "",
        tags: ["Closing", "Stalls", "Advanced"]
      },
      {
        type: "call",
        title: "Price Objection: 'You Guys Are Too Expensive'",
        description: "Listen to a masterclass in value anchoring. See how the rep shifts the conversation from price to cost-of-inaction.",
        learningOutcome: "Learn to agree, validate, and then reframe price in terms of value and long-term savings.",
        duration: "3:45",
        author: "Jessica Pearson",
        thumbnail: "",
        tags: ["Pricing", "Value Building"]
      },
      {
        type: "video",
        title: "The Psychology of Door Knocking",
        description: "A deep dive into body language, distance management, and non-verbal cues that build trust instantly.",
        learningOutcome: "Understand how your stance and facial expressions impact your conversion rate before you say a word.",
        duration: "12:30",
        author: "GigaRev Training Team",
        thumbnail: "",
        tags: ["Psychology", "Foundations"]
      },
      {
        type: "video",
        title: "Mastering the B-P-D-C Framework",
        description: "Step-by-step breakdown of the Build-Problem-Diagnose-Close framework used by all top Gecko Green reps.",
        learningOutcome: "Learn to structure every interaction for maximum persuasion and control.",
        duration: "15:45",
        author: "VP of Sales",
        thumbnail: "",
        tags: ["Framework", "Process"]
      }
    ];

    for (const resource of resources) {
      await storage.createResource(resource);
    }

    console.log("✓ Created resources");

    // Seed battlecards
    const battlecards = [
      {
        phase: "Opening",
        title: "The Pattern Interrupt Opener",
        situation: "Homeowner looks busy or annoyed when opening the door.",
        script: "Sorry to interrupt—I'm not the pizza guy! I'm just the [Name] with Gecko Green, checking the lawns on [Street Name].",
        keyPoints: ["Smile immediately", "Step back 3 feet", "Show open hands"],
        type: "script",
        image: ""
      },
      {
        phase: "Opening",
        title: "Handling 'No Soliciting' Signs",
        situation: "Homeowner points to a 'No Soliciting' sign.",
        script: "I saw the sign and I promise I'm not selling magazines or candy. I'm just letting neighbors know we're treating the Smiths' lawn tomorrow.",
        keyPoints: ["Acknowledge the sign", "Clarify you're a service provider", "Pivot to social proof"],
        type: "objection",
        image: ""
      },
      {
        phase: "Opening",
        title: "The 'I'm Busy' Defense",
        situation: "Homeowner says 'I don't have time right now'.",
        script: "I totally understand, I'll be super quick—literally 30 seconds. I just wanted to ask...",
        keyPoints: ["Validate their time", "Set a time constraint", "Ask a question immediately"],
        type: "objection",
        image: ""
      },
      {
        phase: "Objection Handling",
        title: "'I Do It Myself'",
        situation: "Homeowner takes pride in DIY lawn care.",
        script: "That's awesome, honestly most of my best customers started that way. What products are you using for the deep root feeding?",
        keyPoints: ["Validate their effort", "Ask a technical question", "Highlight professional-grade gap"],
        type: "objection",
        image: ""
      },
      {
        phase: "Objection Handling",
        title: "'We Have a Service'",
        situation: "Homeowner already pays a competitor.",
        script: "Great, that means you care about the lawn. Who are you using? ... Oh yeah, they're decent. How long have you been with them?",
        keyPoints: ["Don't bash competitor", "Find the pain/gap", "Plant seed of doubt"],
        type: "objection",
        image: ""
      },
      {
        phase: "Objection Handling",
        title: "'Too Expensive'",
        situation: "Price resistance.",
        script: "I get that. But think about the cost of re-sodding this patch if the chinch bugs take over. It's $50 now vs $500 later.",
        keyPoints: ["Reframe as investment", "Cost of inaction", "Break down to daily cost"],
        type: "objection",
        image: ""
      },
      {
        phase: "Closing",
        title: "The Assumptive Close",
        situation: "After presenting price.",
        script: "So, to get that first treatment done and knock out these dandelions, do you want us to start Thursday or Friday?",
        keyPoints: ["Assume the sale", "Give two options", "Focus on the result"],
        type: "script",
        image: ""
      },
      {
        phase: "Closing",
        title: "The Discount Close",
        situation: "On the fence.",
        script: "If I can get my manager to wave the first application fee since I'm already treating next door, would that help?",
        keyPoints: ["Conditional close ('If I can...')", "Limited availability", "Value add"],
        type: "script",
        image: ""
      }
    ];

    for (const bc of battlecards) {
      await storage.createBattlecard(bc);
    }

    console.log("✓ Created battlecards");

    // Create demo users
    const manager1 = await storage.createUser({
      email: "sarah.jenkins@geckogreen.com",
      password: "demo123",
      name: "Sarah Jenkins",
      role: "manager",
      status: "active",
      avatarInitials: "SJ"
    });

    const director1 = await storage.createUser({
      email: "james.patterson@geckogreen.com",
      password: "demo123",
      name: "James Patterson",
      role: "director",
      status: "active",
      avatarInitials: "JP"
    });

    const rep1 = await storage.createUser({
      email: "alex.rivera@geckogreen.com",
      password: "demo123",
      name: "Alex Rivera",
      role: "rep",
      status: "active",
      avatarInitials: "AR",
      managerId: manager1.id
    });

    const rep2 = await storage.createUser({
      email: "mike.chen@geckogreen.com",
      password: "demo123",
      name: "Mike Chen",
      role: "rep",
      status: "active",
      avatarInitials: "MC",
      managerId: manager1.id
    });

    console.log("✓ Created demo users");

    // Create some progress for demo rep
    const progress1 = await storage.createUserProgress({
      userId: rep1.id,
      chapterId: chapter1.id,
      quizScore: 85,
      completed: 1
    });

    // Create some roleplay attempts
    const allRoleplays = await storage.getAllRoleplays();
    
    await storage.createRoleplayAttempt({
      userId: rep1.id,
      roleplayId: allRoleplays[0].id,
      score: 82,
      duration: "3:45",
      feedback: "Great use of the pattern interrupt! You acknowledged their time pressure and set a clear 60-second container.",
      metrics: {
        resistance: "High",
        clarity: "Excellent",
        tone: "Confident"
      }
    });

    await storage.createRoleplayAttempt({
      userId: rep1.id,
      roleplayId: allRoleplays[1].id,
      score: 76,
      duration: "4:12",
      feedback: "Good reframing, but you could have been more specific about the problem you're solving.",
      metrics: {
        resistance: "Medium",
        clarity: "Good",
        tone: "Professional"
      }
    });

    console.log("✓ Created progress and attempts");

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
