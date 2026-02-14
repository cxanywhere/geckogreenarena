export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_0_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 3,
    question: 'What is Monetate\'s core product offering?',
    options: [
      'Social media management',
      'Experience optimization and personalization for e-commerce',
      'Email marketing automation',
      'Website hosting'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 6,
    question: 'What does the MONET engine power?',
    options: [
      'Website design templates',
      'AI-powered product recommendations and personalization',
      'Social media scheduling',
      'Customer support chatbots'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 8,
    question: 'What is Monetate\'s ideal customer profile?',
    options: [
      'Small businesses with under $1M revenue',
      'Mid-market to enterprise retailers with $50M+ revenue',
      'Individual freelancers',
      'Non-profit organizations'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 10,
    question: 'Which of these is a key Monetate capability?',
    options: [
      'Social media posting',
      'A/B testing and experimentation',
      'Payroll processing',
      'Inventory management'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 12,
    question: 'What average revenue lift do Monetate customers typically achieve?',
    options: [
      '2-3%',
      '15% with 3x ROI within 12 months',
      '50% immediately',
      '100% within 6 months'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 14,
    question: 'Which competitor is owned by Mastercard?',
    options: [
      'Optimizely',
      'Adobe Target',
      'Dynamic Yield',
      'Bloomreach'
    ],
    correctAnswer: 2
  },
  {
    afterSlide: 15,
    question: 'How long does a typical Monetate implementation take?',
    options: [
      '1-2 days',
      '4-8 weeks',
      '6-12 months',
      '2+ years'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 17,
    question: 'What compliance standards does Monetate meet?',
    options: [
      'Only PCI-DSS',
      'SOC 2 Type II, GDPR, and CCPA',
      'No compliance certifications',
      'Only HIPAA'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 18,
    question: 'What is Monetate\'s pricing model based on?',
    options: [
      'Number of employees',
      'Monthly website sessions/traffic volume',
      'Fixed annual fee regardless of usage',
      'Number of products sold'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 19,
    question: 'Which statement best describes Monetate\'s value proposition?',
    options: [
      'The cheapest personalization tool on the market',
      'Enterprise-grade experience optimization that delivers measurable revenue lift through AI-powered personalization',
      'A simple website builder with drag-and-drop features',
      'An email marketing platform with personalization'
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
