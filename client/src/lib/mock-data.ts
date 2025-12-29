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
}

// Avatars will be populated with the stock images we fetch
export const ROLEPLAYS: RoleplayScenario[] = [
  // Chapter 1 Roleplays
  {
    id: "rp-1",
    name: "Why Lawn Care Matters",
    role: "The Skeptic",
    description: "Homeowner is unsure why anyone pays for lawn care when they can just mow it. Goal: Explain pride, safety, and investment value.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
    traits: ["Value Pitch", "Confidence", "Education"],
    difficulty: "Beginner",
    stats: { resistance: 40, objections: 30, buy_signal: 60 }
  },
  {
    id: "rp-2",
    name: "Explaining Grass Types",
    role: "The Curious Neighbor",
    description: "Homeowner wants to know what kind of grass they have and why it looks different. Goal: Identify Bermuda/St. Augustine and explain needs.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000",
    traits: ["Product Knowledge", "Authority", "Clarity"],
    difficulty: "Beginner",
    stats: { resistance: 20, objections: 10, buy_signal: 80 }
  },
  {
    id: "rp-3",
    name: "Why Do I Still Have Weeds?",
    role: "The Frustrated Client",
    description: "Homeowner expects instant results. Goal: Explain the seed bank, pre-emergent vs post-emergent, and set realistic timelines.",
    avatar: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&q=80&w=1000",
    traits: ["Empathy", "Expectation Setting", "Technical Knowledge"],
    difficulty: "Intermediate",
    stats: { resistance: 70, objections: 60, buy_signal: 40 }
  },
  // Chapter 2 Roleplays
  {
    id: "rp-4",
    name: "The Door Intro",
    role: "The Busy Homeowner",
    description: "You have 30 seconds to make a first impression. Goal: Execute the perfect opener, establish rapport, and transition to the lawn.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1000",
    traits: ["First Impressions", "Body Language", "Tone"],
    difficulty: "Beginner",
    stats: { resistance: 50, objections: 20, buy_signal: 50 }
  },
  {
    id: "rp-5",
    name: "Handling The Brush-Off",
    role: "The Dismissive Prospect",
    description: "Homeowner says 'Not interested' immediately. Goal: Use a soft comeback and pivot to a neighbor reference.",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=1000",
    traits: ["Resilience", "Quick Thinking", "Pivoting"],
    difficulty: "Intermediate",
    stats: { resistance: 80, objections: 40, buy_signal: 20 }
  },
  {
    id: "rp-6",
    name: "The Transition (Turn & Burn)",
    role: "The Gatekeeper",
    description: "Homeowner is talking but staying in the doorway. Goal: Smoothly move the conversation from the porch to the lawn.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=1000",
    traits: ["Control", "Leadership", "Physical cues"],
    difficulty: "Intermediate",
    stats: { resistance: 40, objections: 30, buy_signal: 50 }
  },
  {
    id: "rp-7",
    name: "The 4-Step Diagnosis",
    role: "The Analytical Buyer",
    description: "Homeowner wants proof. Goal: Diagnose 4 key issues on the lawn and link them to Gecko Green solutions.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000",
    traits: ["Analysis", "Solution Selling", "Credibility"],
    difficulty: "Advanced",
    stats: { resistance: 30, objections: 50, buy_signal: 60 }
  },
  {
    id: "rp-8",
    name: "Setting Expectations",
    role: "The Perfectionist",
    description: "Homeowner wants a golf course lawn tomorrow. Goal: Explain the partnership, watering duties, and realistic progress.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000",
    traits: ["Honesty", "Partnership", "Clarity"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 70, buy_signal: 40 }
  },
  {
    id: "rp-9",
    name: "The Price Objection",
    role: "The Budget Watcher",
    description: "Homeowner says 'It costs too much'. Goal: Use the B-P-D-C framework to build value and justify the investment.",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=1000",
    traits: ["Value Building", "Negotiation", "Confidence"],
    difficulty: "Advanced",
    stats: { resistance: 90, objections: 90, buy_signal: 30 }
  },
  {
    id: "rp-10",
    name: "The 'I Do It Myself' Objection",
    role: "The DIY Enthusiast",
    description: "Homeowner enjoys mowing. Goal: Validate their effort but highlight the difference between maintenance and professional treatment.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000",
    traits: ["Validation", "Differentiation", "Closing"],
    difficulty: "Intermediate",
    stats: { resistance: 70, objections: 60, buy_signal: 40 }
  },
  {
    id: "rp-11",
    name: "The 'I Have A Service' Objection",
    role: "The Loyalist",
    description: "Homeowner uses a competitor. Goal: Find the pain point in their current service and offer a better alternative.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=1000",
    traits: ["Discovery", "Comparison", "Tact"],
    difficulty: "Advanced",
    stats: { resistance: 85, objections: 50, buy_signal: 20 }
  },
  {
    id: "rp-12",
    name: "The 'Spouse' Objection",
    role: "The Deflector",
    description: "Homeowner needs to 'talk to my husband/wife'. Goal: Empower them to make a decision or set a firm follow-up.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000",
    traits: ["Empowerment", "Urgency", "Follow-up"],
    difficulty: "Intermediate",
    stats: { resistance: 60, objections: 40, buy_signal: 50 }
  },
  {
    id: "rp-13",
    name: "Closing The Prepay",
    role: "The Deal Hunter",
    description: "Homeowner is interested but hesitant. Goal: present the 5% prepay discount as the logical, best-value choice.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=1000",
    traits: ["Closing", "Math", "Urgency"],
    difficulty: "Intermediate",
    stats: { resistance: 40, objections: 30, buy_signal: 70 }
  },
  {
    id: "rp-14",
    name: "Closing The Autopay",
    role: "The Cash Payer",
    description: "Homeowner refuses prepay. Goal: Pivot to Autopay as the convenient backup option to secure the sale.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=1000",
    traits: ["Flexibility", "Security Assurance", "Closing"],
    difficulty: "Beginner",
    stats: { resistance: 50, objections: 60, buy_signal: 60 }
  },
  {
    id: "rp-15",
    name: "Asking For Referrals",
    role: "The Happy Customer",
    description: "You just closed the sale. Goal: Leverage the positive momentum to get names of neighbors who might also be interested.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000",
    traits: ["Networking", "Boldness", "Growth"],
    difficulty: "Advanced",
    stats: { resistance: 30, objections: 20, buy_signal: 90 }
  },
  {
    id: "rp-16",
    name: "The Full Sales Cycle",
    role: "The Final Boss",
    description: "Certification Exam: Handle the entire interaction from Door Intro to Diagnosis to Objection to Close.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1000",
    traits: ["Mastery", "Endurance", "Consistency"],
    difficulty: "Advanced",
    stats: { resistance: 80, objections: 80, buy_signal: 50 }
  }
];

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
