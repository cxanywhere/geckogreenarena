export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_1_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 5,
    question: 'Which set correctly matches MarketStar\'s "Four Pillars of Sales Success"?',
    options: [
      "Confidence, Optimism, Personality, Endurance",
      "Timeliness, Attitude, Practice, Persistence",
      "Product, Price, Pitch, Persistence",
      "Appearance, Tone, Explanation, Honesty"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 10,
    question: "When selling outsourced sales services, what's the correct relationship between emotion and logic?",
    options: [
      "Logic drives action; emotion justifies afterward",
      "Emotion drives action; logic justifies afterward",
      "They are always equal at the same time",
      "Only logic matters in B2B sales outsourcing deals"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'A prospect says, "Our internal sales team is performing fine." What is the best next move?',
    options: [
      "Present pricing immediately to test seriousness",
      "Reveal an unrealized gap with a specific data point — such as ramp time or pipeline coverage — and ask a question",
      "Ask for their email and leave",
      "Offer a discount to create urgency"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 20,
    question: "What is the best way to handle a multi-stakeholder deal when selling MarketStar solutions?",
    options: [
      "Only communicate with the person who took the first meeting",
      "Multi-thread by building relationships with the VP Sales, CRO, and operations leaders simultaneously",
      "Wait for one person to get internal alignment on their own",
      "Send a generic proposal to the entire buying committee at once"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 25,
    question: 'In the MEDDPICC framework adapted for MarketStar, what does the "M" stand for?',
    options: [
      "Management",
      "Metrics",
      "Marketing",
      "Methodology"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 29,
    question: 'Which best captures what your MarketStar "30-second story" must do?',
    options: [
      "Explain every service offering in detail",
      "Deliver a clear, confident summary of how MarketStar accelerates revenue through outsourced sales — fast",
      "Lead with price to qualify the buyer",
      "Compare competitors by name and position against them"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 34,
    question: 'What should your closing strategy prioritize when selling MarketStar\'s Sales as a Service®?',
    options: [
      "Offer a discount if the buyer hesitates",
      "Multi-thread the deal by aligning all stakeholders — VP Sales, CRO, CFO — before asking for commitment",
      "Only follow up once to avoid being pushy",
      "Wait for the buyer to bring up next steps"
    ],
    correctAnswer: 1
  }
];

export function getQuizForSlide(slideNumber: number): PredefinedQuiz | null {
  return CHAPTER_1_QUIZZES.find(q => q.afterSlide === slideNumber) || null;
}

export function isQuizSlide(slideNumber: number): boolean {
  return CHAPTER_1_QUIZZES.some(q => q.afterSlide === slideNumber);
}
