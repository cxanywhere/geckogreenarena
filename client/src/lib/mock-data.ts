import busyHomeowner from '@assets/generated_images/busy_homeowner_at_door.png';
import proudDiyHomeowner from '@assets/generated_images/proud_diy_homeowner_on_lawn.png';
import skepticalHomeowner from '@assets/generated_images/skeptical_older_homeowner.png';
import indecisiveHomeowner from '@assets/generated_images/indecisive_homeowner_thinking.png';
import doorToDoorRep from '@assets/generated_images/door_to_door_sales_rep_knocking.png';
import lawnCareRep from '@assets/generated_images/sales_rep_talking_to_homeowner_on_lawn.png';

import salesTrainingThumbnail from '@assets/generated_images/sales_training_video_thumbnail.png';

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
  // Top Sales Calls
  {
    id: "call-1",
    type: "call",
    title: "Handling the 'Not Interested' at the Door",
    description: "Listen to how Top Performer Sarah Jenkins turns a quick 'no' into a scheduled appointment using the Pattern Interrupt technique.",
    learningOutcome: "Learn to stay calm, acknowledge the resistance, and pivot to a control question immediately.",
    duration: "4:32",
    author: "Sarah Jenkins",
    tags: ["Objection Handling", "Opener", "Top 1%"]
  },
  {
    id: "call-2",
    type: "call",
    title: "Closing the 'Think About It' Objection",
    description: "Mike Ross demonstrates the perfect loop to handle a stalling homeowner who wants to talk to their spouse.",
    learningOutcome: "Master the art of isolating the real objection and creating urgency without being pushy.",
    duration: "6:15",
    author: "Mike Ross",
    tags: ["Closing", "Stalls", "Advanced"]
  },
  {
    id: "call-3",
    type: "call",
    title: "Price Objection: 'You Guys Are Too Expensive'",
    description: "Listen to a masterclass in value anchoring. See how the rep shifts the conversation from price to cost-of-inaction.",
    learningOutcome: "Learn to agree, validate, and then reframe price in terms of value and long-term savings.",
    duration: "3:45",
    author: "Jessica Pearson",
    tags: ["Pricing", "Value Building"]
  },
  
  // Training Videos
  {
    id: "vid-1",
    type: "video",
    title: "The Psychology of Door Knocking",
    description: "A deep dive into body language, distance management, and non-verbal cues that build trust instantly.",
    learningOutcome: "Understand how your stance and facial expressions impact your conversion rate before you say a word.",
    duration: "12:30",
    author: "GigaRev Training Team",
    thumbnail: salesTrainingThumbnail,
    tags: ["Psychology", "Foundations"]
  },
  {
    id: "vid-2",
    type: "video",
    title: "Mastering the B-P-D-C Framework",
    description: "Step-by-step breakdown of the Build-Problem-Diagnose-Close framework used by all top Gecko Green reps.",
    learningOutcome: "Learn to structure every interaction for maximum persuasion and control.",
    duration: "15:45",
    author: "VP of Sales",
    thumbnail: salesTrainingThumbnail,
    tags: ["Framework", "Process"]
  }
];

export interface Slide {
  type: 'content' | 'quiz' | 'roleplay';
  title: string;
  content?: string; // HTML or text content
  bullets?: string[];
  image?: string;
  roleplayId?: string; // Reference to a ROLEPLAY id
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
  pdfUrl: string; // Keep for download
  coverImage: string;
  agenda: string[];
  slides: Slide[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "chap-1",
    title: "Sales Foundations",
    subtitle: "Master the Art of the Opener",
    description: "Learn the psychology behind the first 10 seconds of interaction. This module covers body language, tonality, and the 'Pattern Interrupt' technique that separates top performers from the rest.",
    duration: "45 min",
    status: "in-progress",
    pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976787/Gecko_Green_Training_-_Certification_1_Chapter_1_1_-compressed-compressed_hctzzg.pdf",
    coverImage: doorToDoorRep,
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
        roleplayId: "rp-1" // The Busy Homeowner
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
        roleplayId: "rp-6" // The Confused Homeowner (Why are you here?)
      }
    ]
  },
  {
    id: "chap-2",
    title: "Field Execution",
    subtitle: "Closing the Deal & Handling Objections",
    description: "Move from 'Maybe' to 'Yes'. This advanced module breaks down the B-P-D-C framework and teaches you how to turn common objections into closing opportunities.",
    duration: "60 min",
    status: "locked",
    pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976616/Gecko_Green_Training_-_Certification_1_Chapter_2_2_-compressed_2_1_hok8bh.pdf",
    coverImage: lawnCareRep,
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
        roleplayId: "rp-11" // The Budget Watcher
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
    resistance: number; // Was Intelligence
    objections: number; // Was Power
    buy_signal: number; // Was Speed
  };
  chapterId: string;
}

export const ROLEPLAYS: RoleplayScenario[] = [
  // Phase 1: Opening
  {
    id: "rp-1",
    name: "I'm actually really busy right now.",
    role: "The Busy Homeowner",
    description: "Chapter 1 → Opening → First 10 Seconds. Acknowledge time pressure + set ≤60s container + ask a qualifying control question.",
    avatar: busyHomeowner,
    traits: ["Time Management", "Control Question", "Respect"],
    difficulty: "Beginner",
    stats: { resistance: 60, objections: 20, buy_signal: 30 },
    chapterId: "chap-1"
  },
  {
    id: "rp-2",
    name: "Not interested.",
    role: "The Dismissive Prospect",
    description: "Chapter 1 → Opening → Handling Brush-Offs. Acknowledge + reframe to specific issue + redirect.",
    avatar: busyHomeowner,
    traits: ["Reframing", "Persistence", "Specifics"],
    difficulty: "Intermediate",
    stats: { resistance: 80, objections: 40, buy_signal: 10 },
    chapterId: "chap-1"
  },
  {
    id: "rp-3",
    name: "No soliciting.",
    role: "The Rule Follower",
    description: "Chapter 1 → Opening → Compliance & Authority. Acknowledge rule + clarify intent + request micro-permission.",
    avatar: skepticalHomeowner,
    traits: ["Compliance", "Intent Clarification", "Micro-Permission"],
    difficulty: "Advanced",
    stats: { resistance: 90, objections: 10, buy_signal: 5 },
    chapterId: "chap-1"
  },
  // Phase 2: Turn & Burn
  {
    id: "rp-4",
    name: "I do my own lawn.",
    role: "The DIY Enthusiast",
    description: "Chapter 1 → Turn & Burn → DIY Pushback. Validate identity + differentiate + regain lead.",
    avatar: proudDiyHomeowner,
    traits: ["Validation", "Differentiation", "Leadership"],
    difficulty: "Intermediate",
    stats: { resistance: 70, objections: 60, buy_signal: 40 },
    chapterId: "chap-1"
  },
  {
    id: "rp-5",
    name: "We already have a lawn company.",
    role: "The Loyalist",
    description: "Chapter 1 → Turn & Burn → Existing Provider. Acknowledge + remove replacement fear + isolate gap.",
    avatar: skepticalHomeowner,
    traits: ["Gap Analysis", "Non-Threatening", "Discovery"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 50, buy_signal: 20 },
    chapterId: "chap-1"
  },
  {
    id: "rp-6",
    name: "Why are you here?",
    role: "The Confused Homeowner",
    description: "Chapter 1 → Turn & Burn → Purpose Statement. State purpose clearly + direct next action.",
    avatar: busyHomeowner,
    traits: ["Clarity", "Direction", "Purpose"],
    difficulty: "Beginner",
    stats: { resistance: 40, objections: 30, buy_signal: 50 },
    chapterId: "chap-1"
  },
  // Phase 3: Lawn Walk
  {
    id: "rp-7",
    name: "My lawn looks fine.",
    role: "The Denialist",
    description: "Chapter 2 → Lawn Walk → Identifying Issues. Validate + isolate specific problem + visually point.",
    avatar: proudDiyHomeowner,
    traits: ["Visual Proof", "Isolation", "Validation"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 70, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-8",
    name: "Weeds don't bother me.",
    role: "The Apathetic Homeowner",
    description: "Chapter 2 → Lawn Walk → Educating on Spread. Reframe consequence + keep discovery.",
    avatar: indecisiveHomeowner,
    traits: ["Consequence Reframing", "Education", "Discovery"],
    difficulty: "Advanced",
    stats: { resistance: 75, objections: 80, buy_signal: 20 },
    chapterId: "chap-2"
  },
  {
    id: "rp-9",
    name: "I don't see the issue.",
    role: "The Visual Skeptic",
    description: "Chapter 2 → Lawn Walk → Showing, Not Telling. Demonstrate visually, not verbally.",
    avatar: proudDiyHomeowner,
    traits: ["Demonstration", "Visual Selling", "Clarity"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 60, buy_signal: 40 },
    chapterId: "chap-2"
  },
  // Phase 4: Pricing
  {
    id: "rp-10",
    name: "How much does it cost?",
    role: "The Price Shopper",
    description: "Chapter 2 → Pricing → Before Quoting. Defer price + anchor value first.",
    avatar: skepticalHomeowner,
    traits: ["Value Anchoring", "Control", "Deferral"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 90, buy_signal: 50 },
    chapterId: "chap-2"
  },
  {
    id: "rp-11",
    name: "That's expensive.",
    role: "The Budget Watcher",
    description: "Chapter 2 → Pricing → Objection Handling. Normalize + re-anchor to outcome.",
    avatar: skepticalHomeowner,
    traits: ["Normalization", "Outcome Focus", "Confidence"],
    difficulty: "Advanced",
    stats: { resistance: 80, objections: 90, buy_signal: 30 },
    chapterId: "chap-2"
  },
  {
    id: "rp-12",
    name: "Another company is cheaper.",
    role: "The Comparison Shopper",
    description: "Chapter 2 → Pricing → Competitor Comparison. Reframe to outcome, not price.",
    avatar: skepticalHomeowner,
    traits: ["Differentiation", "Value Selling", "Reframing"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 85, buy_signal: 25 },
    chapterId: "chap-2"
  },
  // Phase 5: Closing
  {
    id: "rp-13",
    name: "Why do I have to pay now?",
    role: "The Risk Averse",
    description: "Chapter 2 → Close → Payment Explanation. Normalize process + remove risk + maintain close.",
    avatar: indecisiveHomeowner,
    traits: ["Risk Reversal", "Normalization", "Closing"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 70, buy_signal: 60 },
    chapterId: "chap-2"
  },
  {
    id: "rp-14",
    name: "I need to think about it.",
    role: "The Staller",
    description: "Chapter 2 → Close → Handling Stalls. Isolate concern + advance decision.",
    avatar: indecisiveHomeowner,
    traits: ["Isolation", "Advancement", "Patience"],
    difficulty: "Intermediate",
    stats: { resistance: 50, objections: 50, buy_signal: 50 },
    chapterId: "chap-2"
  },
  {
    id: "rp-15",
    name: "I'll call you / send me something.",
    role: "The Deflector",
    description: "Chapter 2 → Close → Securing Next Step. Clarify decision criteria + regain control.",
    avatar: busyHomeowner,
    traits: ["Criteria Clarification", "Control", "Closing"],
    difficulty: "Advanced",
    stats: { resistance: 70, objections: 40, buy_signal: 40 },
    chapterId: "chap-2"
  },
  // Certification
  {
    id: "rp-16",
    name: "Final Certification Assessment",
    role: "The Final Boss",
    description: "Post-Training → Final Certification Assessment. Rep must show control across ≥3 phases including successful Phase-5 handling.",
    avatar: skepticalHomeowner,
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
    feedback: "Great job using the pattern interrupt immediately. You maintained a calm tone, but could have been slightly more assertive when asking the control question.",
    transcript: [
        { id: '1', sender: 'ai', text: "I'm actually really busy right now.", timestamp: new Date() },
        { id: '2', sender: 'user', text: "I completely understand, I'll be super brief. I just wanted to ask...", timestamp: new Date() }
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
      { timestamp: "0:05", description: "Successfully used 'Pattern Interrupt' to pause the homeowner's retreat.", impact: 'positive' },
      { timestamp: "0:15", description: "Slight hesitation when asked for price.", impact: 'negative' },
      { timestamp: "0:45", description: "Strong closing question used to secure the next step.", impact: 'positive' }
    ]
  },
  {
    id: "res-2",
    scenarioId: "rp-6",
    score: 72,
    date: "2025-01-12T09:15:00",
    feedback: "Good recovery when the homeowner challenged your purpose. Work on pivoting back to the script faster without justifying yourself too much.",
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
       { timestamp: "0:10", description: "Missed opportunity to validate the homeowner's confusion.", impact: 'negative' },
       { timestamp: "0:30", description: "Recovered well by stating the clear purpose of the visit.", impact: 'positive' }
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
    name: "Paul Wilkerson", // The User
    avatar: "https://i.pravatar.cc/150?u=paul", // Placeholder
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
