import busyHomeowner from '@assets/generated_images/busy_homeowner_at_door.png';
import proudDiyHomeowner from '@assets/generated_images/proud_diy_homeowner_on_lawn.png';
import skepticalHomeowner from '@assets/generated_images/skeptical_older_homeowner.png';
import indecisiveHomeowner from '@assets/generated_images/indecisive_homeowner_thinking.png';

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
    coverImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
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

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
