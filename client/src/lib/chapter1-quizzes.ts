export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_1_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 5,
    question: 'Which set correctly matches the "Four Pillars of Field Success"?',
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
    question: "In enterprise selling, what's the correct relationship between emotion and logic?",
    options: [
      "Logic drives action; emotion justifies afterward",
      "Emotion drives action; logic justifies afterward",
      "They are always equal at the same time",
      "Only logic matters in enterprise sales"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'A buyer says, "Our conversion rates are fine." What is the best next move?',
    options: [
      "Present pricing immediately to test seriousness",
      "Reveal an unrealized issue with a specific data point and a question",
      "Ask for their email and leave",
      "Offer a discount to create urgency"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 20,
    question: "What is the best way to handle a multi-stakeholder enterprise deal?",
    options: [
      "Only communicate with the person who took the first meeting",
      "Multi-thread by building relationships with multiple decision makers and champions",
      "Wait for one person to get internal alignment on their own",
      "Send a generic proposal to the entire buying committee at once"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 25,
    question: 'In the MEDDPICC framework, what does the "M" stand for?',
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
    question: 'Which best captures what your "30-second story" must do?',
    options: [
      "Explain every product feature in detail",
      "Deliver a clear, confident summary of what you do, how you do it, and why it works—fast",
      "Lead with price to qualify the buyer",
      "Compare competitors by name and position against them"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 34,
    question: 'What should your closing strategy prioritize?',
    options: [
      "Offer a discount if the buyer hesitates",
      "Multi-thread the deal by aligning all stakeholders before asking for commitment",
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
