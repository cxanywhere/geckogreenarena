export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_0_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 3,
    question: 'What is MarketStar\'s core business?',
    options: [
      'Consumer software development',
      'B2B sales outsourcing and revenue acceleration',
      'Digital advertising agency',
      'HR consulting and staffing'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 6,
    question: 'What does Nytro.ai power for MarketStar\'s sales teams?',
    options: [
      'Website design and hosting',
      'AI-driven pitch intelligence, coaching, and sales enablement',
      'Social media content scheduling',
      'Customer support ticket management'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 8,
    question: 'What is MarketStar\'s ideal customer profile?',
    options: [
      'Small local businesses with under 10 employees',
      'B2B companies needing to scale sales without building internal teams — typically mid-market to enterprise',
      'Individual freelancers and solopreneurs',
      'Non-profit organizations and government agencies'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 10,
    question: 'Which of these is a core MarketStar solution?',
    options: [
      'Social media management',
      'Pipeline Generation and SDR/BDR outsourcing',
      'Payroll processing',
      'Inventory management'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 12,
    question: 'How long has MarketStar been in the sales outsourcing industry?',
    options: [
      '5 years',
      '35+ years as a PEAK Matrix® Leader in sales outsourcing',
      '2 years',
      '50+ years'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 14,
    question: 'Which engagement model does MarketStar offer for flexible, modular sales outsourcing?',
    options: [
      'Staff Augmentation Only',
      'Sales as a Service®',
      'Project-Based Consulting',
      'Franchise Model'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'How quickly can MarketStar typically stand up an outsourced sales team?',
    options: [
      '1-2 days',
      '4-8 weeks with full ramp and enablement',
      '6-12 months',
      '2+ years'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 17,
    question: 'Which of the following is a MarketStar solution area?',
    options: [
      'Only Pipeline Generation',
      'Partner Channel Services including PAM programs and ecosystem management',
      'Only Account Management',
      'Only Customer Support'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 18,
    question: 'What is MarketStar\'s pricing model based on?',
    options: [
      'Number of office locations',
      'Team size, engagement scope, and Sales as a Service® modules selected',
      'Fixed annual fee regardless of scope',
      'Per-transaction commission only'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 19,
    question: 'Which statement best describes MarketStar\'s value proposition?',
    options: [
      'The cheapest staffing agency on the market',
      'Outsourced sales teams that accelerate revenue through dedicated reps, proven playbooks, and AI-powered enablement via Nytro.ai',
      'A simple CRM tool with automation features',
      'An email marketing platform with lead scoring'
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
