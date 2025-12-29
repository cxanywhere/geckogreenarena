import busyHomeowner from '@assets/generated_images/busy_homeowner_at_door.png';
import proudDiyHomeowner from '@assets/generated_images/proud_diy_homeowner_on_lawn.png';
import skepticalHomeowner from '@assets/generated_images/skeptical_older_homeowner.png';
import indecisiveHomeowner from '@assets/generated_images/indecisive_homeowner_thinking.png';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  pdfUrl: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "chap-1",
    title: "Chapter 1: Sales Foundations",
    description: "Lawn Care Fundamentals & Prepay Mindset. Master the four pillars of field success and the winning sales mindset.",
    duration: "45 min",
    status: "in-progress",
    pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976787/Gecko_Green_Training_-_Certification_1_Chapter_1_1_-compressed-compressed_hctzzg.pdf"
  },
  {
    id: "chap-2",
    title: "Chapter 2: Field Execution",
    description: "The Sales Process, Objections, Closing & Payment. Learn the B-P-D-C framework and how to turn a 'No' into a 'Yes'.",
    duration: "60 min",
    status: "locked",
    pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976616/Gecko_Green_Training_-_Certification_1_Chapter_2_2_-compressed_2_1_hok8bh.pdf"
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
