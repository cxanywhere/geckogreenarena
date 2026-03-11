export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_1_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 3,
    question: 'How many parts does the LMS Discovery Framework include?',
    options: [
      "3 parts: Goal, Budget, Timeline",
      "7 parts: Business goals, Audience, Funnel gap, Current motion, Offer/content, Measurement, Stakeholders/process",
      "5 parts: Product, Price, Place, Promotion, People",
      "10 parts covering every possible sales scenario"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 6,
    question: "When a buyer says 'We need more leads,' what is the best next step in discovery?",
    options: [
      "Immediately recommend Lead Gen Forms",
      "Go deeper: ask where the bottleneck is — reach, engagement, conversion, lead quality, or sales follow-up",
      "Share LinkedIn's pricing sheet",
      "Suggest they increase their total ad budget"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 8,
    question: 'What is the primary goal of understanding a buyer\'s current channel mix?',
    options: [
      "To criticize their current advertising choices",
      "To understand what is working, where they are disappointed, and whether they have used LinkedIn before",
      "To calculate their total marketing budget",
      "To determine if they qualify for a discount"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 10,
    question: 'Which buyer persona is most focused on reaching specific target accounts and engaging buying groups?',
    options: [
      "Performance Marketing Manager",
      "ABM / Field Marketing Leader",
      "Demand Generation Director",
      "VP of Marketing / CMO"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 12,
    question: 'When positioning LinkedIn for a VP of Marketing / CMO, what should the rep emphasize?',
    options: [
      "Lowest cost-per-click in the industry",
      "LinkedIn as a trusted business environment with full-funnel value, influence across long buying cycles, and measurable business outcomes",
      "The total number of LinkedIn members",
      "Automated campaign setup with no human involvement"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 14,
    question: 'What is the best approach when a buyer asks how you would position LinkedIn against their current Google campaigns?',
    options: [
      "Tell them to stop using Google immediately",
      "Explain that LinkedIn often works best alongside search by reaching the right business audience earlier and more precisely, especially for influencing specific roles or buying groups",
      "Admit that Google is always better for B2B",
      "Offer a price match against Google Ads CPCs"
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 16,
    question: 'What defines a great discovery call in LMS selling?',
    options: [
      "Covering every LinkedIn product feature in detail",
      "A call where the buyer feels understood before the rep recommends a product",
      "Getting the buyer to commit to a purchase on the first call",
      "Spending at least 45 minutes presenting case studies"
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
