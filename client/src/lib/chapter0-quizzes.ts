export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_0_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 5,
    question: 'Which of the following is a Gecko Green service offering?',
    options: [
      'Roof replacement',
      'Lawn fertilization',
      'Pool maintenance',
      'Window tinting'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 18,
    question: 'Which is a key benefit customers get from proper lawn care?',
    options: [
      'Lawn becomes maintenance-free',
      'A thick, green, weed-free landscape and pride of ownership',
      'Grass never goes dormant in winter',
      'Weeds disappear instantly after treatment'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 20,
    question: 'What best describes how Gecko Green delivers results?',
    options: [
      'One-time treatment that solves everything',
      'Properly timed seasonal treatments across the year',
      'Only weed spray when weeds appear',
      'Only fertilizer in spring'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 21,
    question: 'Fertilizer is best described as:',
    options: [
      'A weed killer',
      'Food for plants that supports health, color, and density',
      'A water replacement',
      'A product that works the same regardless of season'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 22,
    question: 'In N-P-K, what does Nitrogen (N) primarily support?',
    options: [
      'Stronger roots only',
      'Greening and top growth',
      'Water regulation only',
      'Disease control only'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 23,
    question: 'Which statement is most accurate regarding fertilizer forms?',
    options: [
      'Only liquid fertilizer works',
      'Only dry fertilizer works',
      'Plants cannot tell the difference between organic vs mineral and liquid vs dry—timing and needs matter',
      'Fertilizer choice never changes by season'
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 25,
    question: 'What are the two major weed types referenced in training?',
    options: [
      'Summer weeds and winter weeds',
      'Tall weeds and short weeds',
      'Grassy weeds and broadleaf weeds',
      'Root weeds and leaf weeds'
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 27,
    question: 'What is the role of pre-emergent weed control?',
    options: [
      'It kills visible weeds on contact',
      'It creates a barrier under the soil to stop weeds before they emerge',
      'It fertilizes the lawn to prevent weeds',
      'It is the same as Round-up'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 28,
    question: 'After a post-emergent application, what timeline should you generally set for weed response?',
    options: [
      'Same day',
      '24 hours',
      'About 2 weeks',
      '2–3 months'
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 29,
    question: 'Which statement correctly describes the Gecko Green annual program?',
    options: [
      '5 applications per year, no aeration included',
      '10 total applications per year: 9 lawn applications + 1 spring aeration',
      'Applications are only done when customers request them',
      'Results should be complete after the first application'
    ],
    correctAnswer: 1
  }
];

export function getQuizForSlide(slideNumber: number): PredefinedQuiz | null {
  return CHAPTER_0_QUIZZES.find(q => q.afterSlide === slideNumber) || null;
}

export function isQuizSlide(slideNumber: number): boolean {
  return CHAPTER_0_QUIZZES.some(q => q.afterSlide === slideNumber);
}
