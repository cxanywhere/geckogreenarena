export interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const CHAPTER_0_QUIZZES: PredefinedQuiz[] = [
  {
    afterSlide: 2,
    question: 'What does LinkedIn Marketing Solutions primarily sell?',
    options: [
      'Consumer social media management tools',
      'Access to a professional audience with precision targeting and ad formats matched to business objectives',
      'Email marketing automation software',
      'Website hosting and development services'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 4,
    question: 'What is LinkedIn\'s core differentiator compared to other ad platforms?',
    options: [
      'Lowest cost-per-click in the industry',
      'Professional identity-based targeting using declared profile data like job title, seniority, function, and industry',
      'The largest total number of users globally',
      'Built-in CRM and sales automation'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 6,
    question: 'How does LMS fit into a modern B2B marketing funnel?',
    options: [
      'It only works for bottom-funnel lead capture',
      'It supports the full funnel: awareness and education at top, engagement at mid, and lead capture and conversion at bottom',
      'It replaces all other advertising channels',
      'It is only useful for brand awareness campaigns'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 8,
    question: 'Which of the following is a core LMS product family?',
    options: [
      'Pay-per-call advertising',
      'Sponsored Content, Lead Gen Forms, Video Ads, Carousel Ads, Document Ads, and Messaging Ads',
      'Television commercial placements',
      'Print advertising and direct mail'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 10,
    question: 'Why are Lead Gen Forms especially valuable for B2B marketers?',
    options: [
      'They are free to use with no ad spend required',
      'They pre-fill data from LinkedIn profiles, reducing friction and improving conversion rates for content downloads and demo requests',
      'They automatically close deals without sales follow-up',
      'They only work with video ad formats'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 12,
    question: 'What is the correct approach when a buyer asks "What ad format should we run?"',
    options: [
      'Recommend the most expensive format for maximum impact',
      'First ask "What business outcome matters most?" and then match the objective to the right format',
      'Always recommend Video Ads because they have the highest engagement',
      'Send them a list of all available formats to choose from'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 13,
    question: 'What should new reps focus on when discussing measurement with buyers?',
    options: [
      'Vanity metrics like impressions and clicks',
      'Lead quality, conversion quality, and tying channel performance to actual business outcomes like pipeline and revenue',
      'Only cost-per-click comparisons with competitors',
      'The total number of ads served'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 14,
    question: 'What best describes the job of a great LMS rep?',
    options: [
      'Selling as much ad inventory as possible at the highest price',
      'Helping the buyer connect business goals to the right audience, campaign objective, content, and measurement plan',
      'Providing technical support for Campaign Manager',
      'Offering the lowest CPL guarantee in the market'
    ],
    correctAnswer: 1
  },
  {
    afterSlide: 15,
    question: 'Which beginner talk track best positions LinkedIn\'s value?',
    options: [
      '"LinkedIn is the cheapest way to reach any audience online."',
      '"LinkedIn can be especially powerful when you need to reach specific professional audiences and influence business buyers with the right message in a trusted context."',
      '"LinkedIn replaces the need for Google and Meta advertising entirely."',
      '"LinkedIn guarantees a specific number of leads per campaign."'
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
