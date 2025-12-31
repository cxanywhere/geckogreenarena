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
    question: "In a doorstep sale, what's the correct relationship between emotion and logic?",
    options: [
      "Logic drives action; emotion justifies afterward",
      "Emotion drives action; logic justifies afterward",
      "They are always equal at the same time",
      "Only logic matters in lawn care"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'A homeowner says, "My lawn is fine." What is the best next move per the training?',
    options: [
      "Present pricing immediately to test seriousness",
      "Reveal an unrealized issue with a specific, visible observation and a question",
      "Ask for their email and leave",
      "Offer a discount to create urgency"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 20,
    question: "Which statement is TRUE about pre-emergent vs. post-emergent and expectations?",
    options: [
      "Pre-emergent kills existing weeds; post-emergent prevents sprouting",
      "Post-emergent kills existing weeds; pre-emergent prevents sprouting",
      "Both only work if weeds are already visible",
      "Both work instantly if watered the same day"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 25,
    question: 'In the "Partnership" model, which is primarily the homeowner\'s responsibility?',
    options: [
      "Seasonal application timing",
      "Product formulation choices",
      "Watering and mowing consistency",
      "Free service calls between visits"
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 29,
    question: 'Which best captures what your "30-second story" must do?',
    options: [
      "Explain every treatment ingredient in detail",
      "Deliver a clear, confident summary of what you do, how you do it, and why it works—fast",
      "Lead with price to qualify the homeowner",
      "Compare competitors by name and position against them"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 34,
    question: 'What is the "Prepay Rule in One Line" the rep should follow?',
    options: [
      "Offer prepay only if the homeowner asks",
      "Prepay first, every time; autopay is the fallback",
      "Autopay is the default; prepay is optional",
      "Prepay only for customers with heavy weeds"
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
