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
    question: 'What\'s the best summary of "emotion & logic" in a sale?',
    options: [
      "Logic drives action; emotion justifies the decision",
      "Emotion drives action; logic justifies the decision",
      "Emotion and logic are equally persuasive at the same time",
      "Only logic matters in lawn care"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'A homeowner says, "My lawn is fine." Which type of need is this, and what\'s your job?',
    options: [
      "Realized need; provide solution immediately",
      "Unrealized need; educate and reveal the problem",
      "Unrealized need; discount to create urgency",
      "Realized need; avoid questions and go straight to price"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 20,
    question: "Which statement is TRUE about pre-emergent vs. post-emergent?",
    options: [
      "Pre-emergent kills existing weeds in 10–14 days",
      "Post-emergent prevents weeds from sprouting by creating a barrier",
      "Pre-emergent prevents sprouting; post-emergent kills existing weeds",
      "Both only work if weeds are already visible"
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 25,
    question: "In the partnership slide, which is primarily the homeowner's responsibility (not Gecko Green's)?",
    options: [
      "Product selection",
      "Timing of treatments",
      "Aeration",
      "Watering and mowing"
    ],
    correctAnswer: 3
  },
  {
    afterSlide: 30,
    question: 'What are the required key elements of the "30-Second Gecko Green Story"?',
    options: [
      "Cheapest price, fastest service, lifetime guarantee",
      "North Texas focus, 10-visit program, free service calls, results-driven commitment",
      "Grass seed installation, landscaping, tree trimming",
      "Herbicide names, chemical ratios, application equipment"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 35,
    question: 'What is the "non-negotiable prepay mindset" taught in Chapter 1?',
    options: [
      "Offer prepay only if the homeowner asks",
      "Autopay is the default; prepay is optional",
      "Prepay first, every time, no exceptions (autopay is backup)",
      "Prepay only for customers with weeds"
    ],
    correctAnswer: 2
  }
];

export function getQuizForSlide(slideNumber: number): PredefinedQuiz | null {
  return CHAPTER_1_QUIZZES.find(q => q.afterSlide === slideNumber) || null;
}

export function isQuizSlide(slideNumber: number): boolean {
  return CHAPTER_1_QUIZZES.some(q => q.afterSlide === slideNumber);
}
