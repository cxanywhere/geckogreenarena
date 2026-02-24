import OpenAI from "openai";
import { storage } from "./storage";
import { type InsertQuizQuestion } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface PredefinedQuiz {
  afterSlide: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CHAPTER_QUIZZES: Record<string, PredefinedQuiz[]> = {
  "MarketStar 101": [
    { afterSlide: 2, question: 'What best describes the MarketStar elevator pitch?', options: ['A staffing agency that provides temporary workers', 'A software company selling CRM tools', 'A B2B sales outsourcing company with 35+ years of experience helping brands accelerate revenue through Sales as a Service®', 'A marketing automation platform for small businesses'], correctAnswer: 2 },
    { afterSlide: 3, question: 'What is the primary job of a MarketStar sales rep during discovery?', options: ['Identify which revenue challenges are most painful and connect them to MarketStar\'s outsourced sales solutions', 'Present pricing as early as possible', 'Demo every service offering at once', 'Focus only on competitors\' weaknesses'], correctAnswer: 0 },
    { afterSlide: 5, question: 'How is MarketStar\'s service portfolio organized?', options: ['Three standalone products with separate teams', 'A single service with no specialization', 'Individual consultants working independently', 'Core solutions including Pipeline Generation, New Business, Account Management, Partner Channel, Customer Success, and Revenue Operations — powered by Nytro.ai'], correctAnswer: 3 },
  ],
  "Buyer Reality & ICP": [
    { afterSlide: 2, question: 'Why is it important to map KPIs by persona when selling outsourced sales?', options: ['It helps you memorize service features faster', 'Speaking to their specific KPIs (pipeline velocity, CAC, retention) positions you as a strategic partner instead of a vendor', 'KPIs are only relevant for internal reporting', 'It allows you to skip the discovery process'], correctAnswer: 1 },
    { afterSlide: 4, question: 'What creates urgency and opens deals for outsourced sales services?', options: ['Offering discounts right away', 'Sending more marketing emails', 'Waiting for the prospect to contact you', 'Business problems like missed quotas, scaling challenges, and market expansion needs the prospect is already experiencing'], correctAnswer: 3 },
    { afterSlide: 5, question: 'What should MarketStar sellers prioritize before pitching?', options: ['Discovery — using problem-first prompts to uncover real revenue pain', 'Memorizing the entire service catalog', 'Preparing a 60-minute capabilities presentation', 'Sharing customer logos and case studies'], correctAnswer: 0 },
  ],
  "Sales as a Service": [
    { afterSlide: 1, question: 'What is Sales as a Service® and how does it differentiate MarketStar?', options: ['A one-size-fits-all staffing model', 'A modular, outcome-based delivery model where clients get dedicated sales teams with built-in management, enablement, and analytics', 'A software platform clients install themselves', 'A temporary contractor placement service'], correctAnswer: 1 },
    { afterSlide: 3, question: 'What role does Nytro.ai play in MarketStar\'s Sales as a Service® model?', options: ['It handles billing and invoicing', 'It manages employee scheduling', 'It\'s MarketStar\'s AI platform that provides pitch intelligence, call coaching, and performance analytics to accelerate rep effectiveness', 'It\'s a third-party CRM integration'], correctAnswer: 2 },
    { afterSlide: 4, question: 'Why do enterprise buyers choose Sales as a Service® over building in-house teams?', options: ['It\'s always cheaper than hiring', 'Faster time-to-revenue, reduced risk, built-in expertise, and the ability to scale up or down without fixed headcount costs', 'They don\'t have office space', 'It\'s only for companies that can\'t hire'], correctAnswer: 1 },
  ],
  "Pipeline Generation": [
    { afterSlide: 1, question: 'What is MarketStar\'s approach to pipeline generation?', options: ['Cold calling from purchased lists only', 'Dedicated SDR/BDR teams running multi-channel outbound with data-driven targeting, sequencing, and Nytro.ai-powered insights', 'Sending mass emails without personalization', 'Waiting for inbound leads only'], correctAnswer: 1 },
    { afterSlide: 2, question: 'What metrics define success for a MarketStar pipeline generation program?', options: ['Number of calls made per day only', 'SQLs generated, pipeline value created, conversion rates, and cost per qualified opportunity', 'Social media followers gained', 'Number of emails sent'], correctAnswer: 1 },
    { afterSlide: 4, question: 'How does MarketStar\'s pipeline generation differ from traditional lead gen agencies?', options: ['MarketStar provides dedicated, managed teams with ongoing coaching, Nytro.ai analytics, and accountability to pipeline outcomes — not just activity metrics', 'There is no difference', 'MarketStar only does inbound', 'MarketStar uses cheaper labor'], correctAnswer: 0 },
  ],
  "New Business Acquisition": [
    { afterSlide: 1, question: 'What does MarketStar\'s New Business Acquisition solution cover?', options: ['Only initial prospecting calls', 'Full-cycle sales from qualified opportunity through close, including demos, proposals, negotiations, and contract execution', 'Post-sale customer onboarding only', 'Marketing campaign management'], correctAnswer: 1 },
    { afterSlide: 3, question: 'When should a prospect consider outsourcing new business acquisition?', options: ['Only when they have zero sales team', 'When they need to enter new markets, scale rapidly, or supplement internal teams without the time and cost of building from scratch', 'Only for deals under $10K', 'Only during economic downturns'], correctAnswer: 1 },
    { afterSlide: 4, question: 'What makes MarketStar\'s full-cycle sellers different from freelance sales reps?', options: ['They work fewer hours', 'They are embedded, managed teams with MarketStar\'s enablement, Nytro.ai tools, and proven playbooks — delivering consistent, measurable results', 'They only work on commission', 'There is no meaningful difference'], correctAnswer: 1 },
  ],
  "Account Management": [
    { afterSlide: 1, question: 'What is the primary goal of MarketStar\'s Account Management solution?', options: ['Finding new logos only', 'Maximizing customer lifetime value through retention, expansion, and upsell/cross-sell within existing accounts', 'Handling customer complaints', 'Processing invoices and billing'], correctAnswer: 1 },
    { afterSlide: 2, question: 'What KPIs should you emphasize when selling Account Management services?', options: ['Net revenue retention (NRR), expansion revenue, churn reduction, and customer health scores', 'Number of meetings held per week', 'Social media engagement rates', 'Office attendance metrics'], correctAnswer: 0 },
    { afterSlide: 3, question: 'How does MarketStar\'s Account Management approach prevent churn?', options: ['By offering discounts to unhappy customers', 'Proactive health monitoring, regular business reviews, strategic growth planning, and early risk identification powered by data analytics', 'By avoiding difficult conversations', 'By reducing the number of touchpoints'], correctAnswer: 1 },
  ],
  "Partner Channel Services": [
    { afterSlide: 1, question: 'What does MarketStar\'s Partner Channel Services solution provide?', options: ['A partner portal software tool', 'Dedicated Partner Account Managers (PAMs) who recruit, enable, and manage channel partners to drive indirect revenue', 'Legal contract review for partnerships', 'Marketing co-op fund management only'], correctAnswer: 1 },
    { afterSlide: 2, question: 'Why do technology companies outsource partner channel management?', options: ['They don\'t value partnerships', 'Building and managing a partner ecosystem requires specialized skills, dedicated resources, and consistent engagement that\'s expensive to maintain in-house', 'Partners prefer working with outsourced teams', 'It\'s required by industry regulations'], correctAnswer: 1 },
    { afterSlide: 3, question: 'What is a key selling point of MarketStar\'s PAM model?', options: ['PAMs only attend partner events', 'PAMs provide end-to-end partner lifecycle management — recruitment, onboarding, enablement, co-selling, and performance optimization', 'PAMs replace the client\'s entire sales team', 'PAMs only work with one partner at a time'], correctAnswer: 1 },
  ],
  "Customer Success": [
    { afterSlide: 1, question: 'How does MarketStar define Customer Success in the context of outsourced services?', options: ['Answering support tickets quickly', 'A proactive, outcome-driven approach to ensuring customers achieve their desired results, driving retention and expansion revenue', 'Sending monthly newsletters to customers', 'Only handling escalations and complaints'], correctAnswer: 1 },
    { afterSlide: 2, question: 'What is the business case for outsourcing Customer Success?', options: ['It\'s cheaper than having no CS team', 'Companies can scale CS operations faster, access specialized expertise, and improve NRR without the overhead of building internal CS teams', 'Customers prefer outsourced CS teams', 'It\'s only valuable for startups'], correctAnswer: 1 },
    { afterSlide: 3, question: 'What outcomes should you highlight when selling Customer Success services?', options: ['Faster email response times only', 'Improved NRR, reduced churn, increased expansion revenue, higher NPS, and stronger customer health scores', 'More customer surveys completed', 'Lower headcount costs only'], correctAnswer: 1 },
  ],
  "Revenue Operations": [
    { afterSlide: 1, question: 'What does MarketStar\'s Revenue Operations solution encompass?', options: ['Basic CRM administration only', 'Data-driven sales optimization including analytics, process design, technology stack management, and performance insights that improve revenue outcomes', 'Accounting and financial reporting', 'IT infrastructure management'], correctAnswer: 1 },
    { afterSlide: 2, question: 'Why is Revenue Operations increasingly critical for scaling sales organizations?', options: ['It\'s a trendy buzzword with no real value', 'RevOps aligns sales, marketing, and CS data to eliminate silos, improve forecasting accuracy, and drive predictable revenue growth', 'It only matters for companies over $1B', 'It replaces the need for sales managers'], correctAnswer: 1 },
    { afterSlide: 3, question: 'How does MarketStar leverage RevOps to improve client outcomes?', options: ['By installing expensive software tools', 'By providing dedicated RevOps analysts who optimize processes, build dashboards, and deliver actionable insights that improve pipeline conversion and rep productivity', 'By replacing the client\'s CRM', 'By automating all sales activities'], correctAnswer: 1 },
  ],
  "Competitive & Differentiation": [
    { afterSlide: 1, question: 'How should MarketStar be positioned against competitors in the outsourced sales market?', options: ['As the cheapest outsourcing option', 'As a staffing agency alternative', 'As the pioneer of Sales as a Service® with 35+ years of experience, a PEAK Matrix® Leader, and proprietary Nytro.ai technology', 'As identical to other BPO providers'], correctAnswer: 2 },
    { afterSlide: 2, question: 'What are the key differentiation pillars that work against every competitor?', options: ['35+ years of proven results, Sales as a Service® model, Nytro.ai technology platform, and integrated management and enablement', 'Price, speed, support, and integrations', 'More offices, more employees, more regions, and more awards', 'Free trial, lower price, faster setup, and no contract'], correctAnswer: 0 },
    { afterSlide: 3, question: 'Why is the total cost of ownership (TCO) narrative powerful with CFOs?', options: ['CFOs like hearing about new technology features', 'CFOs don\'t care about costs — only revenue', 'It only works with small companies', 'Outsourcing with MarketStar eliminates recruiting, training, management overhead, and ramp time — delivering faster ROI than building in-house'], correctAnswer: 3 },
  ],
  "Deal Execution": [
    { afterSlide: 1, question: 'In MEDDPICC, when is a deal truly "qualified" at MarketStar?', options: ['When the prospect agrees to a discovery call', 'When you can answer every MEDDPICC element with confidence — it\'s a living framework, not a checklist', 'When you have their email address', 'When procurement sends an RFP'], correctAnswer: 1 },
    { afterSlide: 3, question: 'How should pricing conversations be framed when selling MarketStar services?', options: ['Lead with the lowest possible price per rep', 'Match competitor pricing exactly', 'Never lead with price — always frame in context of value, ROI, time-to-revenue, and total cost of ownership vs. building in-house', 'Avoid discussing pricing until contract stage'], correctAnswer: 2 },
    { afterSlide: 4, question: 'What makes a well-scoped pilot the fastest path to a closed deal at MarketStar?', options: ['Clear success metrics, a tight timeline, and an explicit decision point at the end', 'Making the pilot free with no commitments', 'Running the pilot for 12+ months', 'Including every service offering in the pilot'], correctAnswer: 0 },
  ],
  "AI Enablement": [
    { afterSlide: 1, question: 'What is Nytro.ai and how should MarketStar sellers position it?', options: ['A replacement for human sales skills', 'A customer-facing chatbot on the website', 'An automated email writer', 'MarketStar\'s AI platform that provides pitch intelligence, call coaching, and performance analytics — a key differentiator in the outsourced sales market'], correctAnswer: 3 },
    { afterSlide: 2, question: 'How does Nytro.ai improve rep performance in MarketStar programs?', options: ['By replacing reps with AI bots', 'Real-time call coaching, conversation analytics, pitch scoring, and personalized enablement recommendations that accelerate ramp time and improve win rates', 'By automating all customer communication', 'It only generates reports for managers'], correctAnswer: 1 },
    { afterSlide: 3, question: 'What is a critical governance consideration when discussing AI capabilities with prospects?', options: ['Share all AI outputs directly with prospects without review', 'Never mention AI capabilities', 'Position Nytro.ai as augmenting human expertise — AI enhances rep effectiveness but human judgment, relationship skills, and strategic thinking remain essential', 'Only technical buyers care about AI'], correctAnswer: 2 },
  ],
};

async function seedPredefinedQuizzesForChapter(chapterId: string, chapterTitle: string): Promise<number> {
  const quizzes = CHAPTER_QUIZZES[chapterTitle];
  if (!quizzes || quizzes.length === 0) {
    return 0;
  }
  
  let seededCount = 0;
  for (const quiz of quizzes) {
    const existing = await storage.getQuizQuestionsBySlide(chapterId, quiz.afterSlide);
    if (existing.length === 0) {
      await storage.upsertQuizQuestions([{
        chapterId,
        slideIndex: quiz.afterSlide,
        questionOrder: 0,
        question: quiz.question,
        options: quiz.options,
        correctAnswer: quiz.correctAnswer,
        explanation: null,
      }]);
      seededCount++;
    } else {
      const match = existing.find(q => q.question === quiz.question);
      if (match && (match.correctAnswer !== quiz.correctAnswer || JSON.stringify(match.options) !== JSON.stringify(quiz.options))) {
        await storage.upsertQuizQuestions([{
          chapterId,
          slideIndex: quiz.afterSlide,
          questionOrder: match.questionOrder ?? 0,
          question: quiz.question,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer,
          explanation: match.explanation,
        }]);
        seededCount++;
      }
    }
  }
  return seededCount;
}

export async function ensurePredefinedQuizzesSeeded(): Promise<void> {
  console.log("Seeding predefined quizzes...");
  const chapters = await storage.getAllChapters();
  let totalSeeded = 0;
  for (const chapter of chapters) {
    const seeded = await seedPredefinedQuizzesForChapter(chapter.id, chapter.title);
    totalSeeded += seeded;
  }
  console.log(`Predefined quiz seeding complete. ${totalSeeded} new questions added.`);
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuizQuestionsForSlides(
  chapterId: string,
  slideContents: { index: number; content: string }[]
): Promise<InsertQuizQuestion[]> {
  const existingQuestions = await storage.getQuizQuestionsByChapter(chapterId);
  const slidesWithQuestions = new Set(existingQuestions.map(q => q.slideIndex));
  
  const slidesToGenerate = slideContents.filter(s => !slidesWithQuestions.has(s.index));
  
  if (slidesToGenerate.length === 0) {
    return [];
  }

  const allQuestions: InsertQuizQuestion[] = [];

  for (const slide of slidesToGenerate) {
    try {
      const startOrder = await storage.getNextQuestionOrder(chapterId, slide.index);
      const questions = await generateQuestionsForContent(slide.content, chapterId, slide.index, startOrder);
      allQuestions.push(...questions);
    } catch (error) {
      console.error(`Failed to generate questions for slide ${slide.index}:`, error);
    }
  }

  if (allQuestions.length > 0) {
    await storage.upsertQuizQuestions(allQuestions);
  }

  return allQuestions;
}

async function generateQuestionsForContent(
  content: string,
  chapterId: string,
  slideIndex: number,
  startOrder: number = 0
): Promise<InsertQuizQuestion[]> {
  if (!content || content.trim().length < 50) {
    return [];
  }

  const prompt = `You are a sales training expert creating quiz questions to help sales representatives retain knowledge from training materials.

Based on the following training content, generate 1-2 multiple choice questions that test understanding of key concepts, sales techniques, or important facts.

Training Content:
${content}

Generate questions in this exact JSON format:
{
  "questions": [
    {
      "question": "Clear, specific question about the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Rules:
- Questions should test practical understanding, not just memorization
- Make options realistic and challenging - avoid obviously wrong answers
- correctAnswer is the index (0-3) of the correct option
- Focus on sales techniques, objection handling, product knowledge, or customer interactions
- Keep questions relevant to B2B outsourced sales scenarios and MarketStar's Sales as a Service® model when applicable`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent) {
      return [];
    }

    const parsed = JSON.parse(responseContent) as { questions: GeneratedQuestion[] };
    
    return parsed.questions.map((q, index) => ({
      chapterId,
      slideIndex,
      questionOrder: startOrder + index,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    return [];
  }
}

export async function getOrGenerateQuizForSlide(
  chapterId: string,
  slideIndex: number,
  slideContent: string
): Promise<{
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
}[]> {
  let questions = await storage.getQuizQuestionsBySlide(chapterId, slideIndex);
  
  if (questions.length === 0 && slideContent && slideContent.length > 50) {
    const startOrder = await storage.getNextQuestionOrder(chapterId, slideIndex);
    const generated = await generateQuestionsForContent(slideContent, chapterId, slideIndex, startOrder);
    if (generated.length > 0) {
      questions = await storage.upsertQuizQuestions(generated);
    }
  }

  return questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
}

export async function submitQuizAnswer(
  userId: string,
  chapterId: string,
  questionId: string,
  selectedAnswer: number
): Promise<{ isCorrect: boolean; explanation: string | null }> {
  const questions = await storage.getQuizQuestionsByChapter(chapterId);
  const question = questions.find(q => q.id === questionId);
  
  if (!question) {
    throw new Error("Question not found");
  }

  const isCorrect = selectedAnswer === question.correctAnswer;
  
  await storage.createQuizAttempt({
    userId,
    chapterId,
    questionId,
    selectedAnswer,
    isCorrect: isCorrect ? 1 : 0,
  });

  // Always update the quiz score after each attempt
  const score = await storage.getUserQuizScore(userId, chapterId);
  let progress = await storage.getUserProgressByChapter(userId, chapterId);
  
  // Create progress record if it doesn't exist
  if (!progress) {
    progress = await storage.createUserProgress({
      userId,
      chapterId,
      completed: 0,
      currentSlide: 0,
      totalSlides: 0,
    });
  }
  
  const quizScore = Math.round((score.correct / Math.max(score.total, 1)) * 100);
  await storage.updateUserProgress(progress.id, { quizScore });

  return {
    isCorrect,
    explanation: question.explanation,
  };
}
