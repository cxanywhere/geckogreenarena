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
  "Monetate 101": [
    { afterSlide: 2, question: 'What best describes the Monetate elevator pitch?', options: ['A cheap testing tool for small businesses', 'A social media analytics suite', 'An experience optimization platform that helps enterprise brands deliver the right experience to every customer', 'An email marketing automation platform'], correctAnswer: 2 },
    { afterSlide: 3, question: 'What is the primary job of a Monetate sales rep during discovery?', options: ['Identify which of the four core challenges are most painful and connect them to Monetate capabilities', 'Present pricing as early as possible', 'Demo every feature of the platform', 'Focus only on competitors\' weaknesses'], correctAnswer: 0 },
    { afterSlide: 5, question: 'How is Monetate\'s platform organized?', options: ['Three standalone products with separate dashboards', 'A single monolithic application', 'Individual plugins that customers install separately', 'Four Suites powered by MONET (the AI engine) and supported by Concierge services'], correctAnswer: 3 },
  ],
  "Buyer Reality & ICP": [
    { afterSlide: 2, question: 'Why is it important to map KPIs by persona?', options: ['It helps you memorize product features faster', 'Speaking to their specific KPIs positions you as a strategic partner instead of a vendor', 'KPIs are only relevant for internal reporting', 'It allows you to skip the discovery process'], correctAnswer: 1 },
    { afterSlide: 4, question: 'What creates urgency and opens deals in enterprise sales?', options: ['Offering discounts right away', 'Sending more marketing emails', 'Waiting for the prospect to contact you', 'Business problems and buying triggers the prospect is already experiencing'], correctAnswer: 3 },
    { afterSlide: 5, question: 'What should great sellers prioritize before pitching?', options: ['Discovery — using problem-first prompts to uncover real pain', 'Memorizing the entire product catalog', 'Preparing a 60-minute demo presentation', 'Sharing customer logos and case studies'], correctAnswer: 0 },
  ],
  "Platform Fundamentals": [
    { afterSlide: 1, question: 'What is MONET\'s role in the Monetate platform?', options: ['It handles billing and invoicing', 'It manages user passwords and security', 'It\'s the AI intelligence engine that unifies decisioning, automation, experimentation, and learning', 'It\'s a third-party integration layer'], correctAnswer: 2 },
    { afterSlide: 3, question: 'What are the three categories of data that MONET ingests?', options: ['Social media, email, and chat data', 'Behavioral, contextual, and business data for intelligent decisions', 'Only first-party cookie data', 'Competitor pricing, market trends, and stock data'], correctAnswer: 1 },
    { afterSlide: 4, question: 'Why is trust and compliance critical in enterprise sales conversations?', options: ['Security and compliance are often the first conversation with IT, legal, and procurement', 'It\'s optional and rarely comes up', 'Only healthcare companies care about compliance', 'It\'s only important after the deal is closed'], correctAnswer: 0 },
  ],
  "Symphony: Personalization": [
    { afterSlide: 1, question: 'How does Symphony deliver personalization differently from rule-based tools?', options: ['It requires manual segments for every audience', 'It only personalizes email campaigns', 'It uses basic A/B testing to personalize', 'It uses AI (MONET) to deliver individualized experiences without requiring rules or manual segments'], correctAnswer: 3 },
    { afterSlide: 3, question: 'What three types of metrics should every personalization initiative track?', options: ['Revenue, profit, and market share', 'Success metrics, guardrail metrics, and diagnostic metrics', 'Page views, bounce rate, and session duration', 'NPS, CSAT, and CES only'], correctAnswer: 1 },
    { afterSlide: 4, question: 'What is the recommended approach for deploying Monetate personalization?', options: ['Launch everything at once across all channels', 'Wait 12 months before measuring any results', 'Start small with quick wins, prove lift, then expand', 'Only deploy during peak shopping seasons'], correctAnswer: 2 },
  ],
  "Maestro: Experimentation": [
    { afterSlide: 1, question: 'What makes Maestro the most complete experimentation platform?', options: ['It only supports A/B testing', 'It requires no statistical knowledge to use', 'It only works for mobile apps', 'It enables A/B/n, multivariate, feature flags, and dynamic testing across client-side, server-side, and network-layer'], correctAnswer: 3 },
    { afterSlide: 2, question: 'What framework should be used to prioritize experiment ideas instead of HiPPO decisions?', options: ['ICE framework — Impact, Confidence, and Ease', 'SWOT Analysis', 'Random selection', 'Alphabetical ordering by test name'], correctAnswer: 0 },
    { afterSlide: 4, question: 'Why is Monetate\'s network-layer architecture important for regulated industries?', options: ['It makes pages load faster', 'It reduces the cost of experiments', 'Experiments happen at the network level with no JavaScript injection, keeping PII secure and passing strict security reviews', 'It only works with Chrome browsers'], correctAnswer: 2 },
  ],
  "Overture: Search & Discovery": [
    { afterSlide: 1, question: 'How does Overture go beyond traditional keyword search?', options: ['It adds more search filters', 'It uses AI to understand customer intent and context, delivering results optimized for conversion', 'It only searches product titles', 'It requires manual curation of every search result'], correctAnswer: 1 },
    { afterSlide: 2, question: 'What are the four common search pain categories to probe in discovery?', options: ['Zero results, poor relevance, no merchandising control, and no conversion optimization', 'Speed, design, color, and font issues', 'Server errors, downtime, caching, and latency', 'Mobile, desktop, tablet, and smart TV issues'], correctAnswer: 0 },
    { afterSlide: 3, question: 'What is the proven sales process for selling Overture?', options: ['Demo → Close → Implement', 'Cold call → Discount → Contract', 'Send proposal → Follow up weekly', 'Audit → Baseline → Pilot → Expansion'], correctAnswer: 3 },
  ],
  "Concierge & Delivery": [
    { afterSlide: 1, question: 'What role does Concierge play in the Monetate platform?', options: ['It\'s the billing department', 'It\'s a chatbot for customer complaints', 'It\'s the expert-led services layer that bridges the gap between buying the platform and getting results', 'It only handles technical support tickets'], correctAnswer: 2 },
    { afterSlide: 2, question: 'When should you lead with Concierge in a sales conversation?', options: ['When it\'s the difference between winning and losing competitive deals, especially with resource-constrained teams', 'Never — it reduces deal size', 'Only after the deal is closed', 'Only for enterprise deals over $1M'], correctAnswer: 0 },
    { afterSlide: 3, question: 'What is the correct implementation model for Concierge engagements?', options: ['Install → Train → Leave', 'Sign contract → Wait 6 months → Check in', 'Self-service only with documentation', 'Workshop → Pilot → Program → Governance'], correctAnswer: 3 },
  ],
  "Solution Modules": [
    { afterSlide: 2, question: 'What three outcomes do MONET-powered product recommendations drive?', options: ['More page views, longer sessions, and lower bounce rate', 'Higher AOV, better conversion, and improved inventory movement', 'More social shares, more followers, and more likes', 'Faster page loads, better SEO, and more backlinks'], correctAnswer: 1 },
    { afterSlide: 3, question: 'How do dynamic bundles increase AOV without hurting margins?', options: ['By offering blanket discounts on everything', 'By forcing customers to buy more items', 'MONET intelligently pairs products customers are likely to buy together with smart pricing that protects margins', 'By hiding individual product prices'], correctAnswer: 2 },
    { afterSlide: 5, question: 'What does Monetate\'s unified analytics layer provide?', options: ['A single source of truth for experiment results, audience insights, and business impact across all teams', 'Only basic page view counts', 'Social media engagement metrics only', 'Competitor analysis dashboards'], correctAnswer: 0 },
  ],
  "Vertical Selling": [
    { afterSlide: 1, question: 'Why does the Monetate story need to change across verticals?', options: ['The platform is different for each industry', 'It doesn\'t — use the same pitch everywhere', 'Different industries have different moments, KPIs, compliance requirements, and proof points', 'Only regulated industries need a different story'], correctAnswer: 2 },
    { afterSlide: 4, question: 'What should you lead with when selling to financial services buyers?', options: ['Trust, security, and friction reduction — then show how personalization drives growth within compliance guardrails', 'Aggressive growth projections', 'Feature comparisons with competitors', 'Discount offers to close quickly'], correctAnswer: 0 },
    { afterSlide: 5, question: 'Why is Monetate often the ONLY option for healthcare clients?', options: ['It\'s the cheapest platform available', 'It was specifically built for healthcare', 'Healthcare companies get special pricing', 'Its network-layer architecture passes HIPAA security review without JavaScript injection or PII exposure'], correctAnswer: 3 },
  ],
  "Competitive & Differentiation": [
    { afterSlide: 1, question: 'How should Monetate be positioned in the market?', options: ['As the cheapest personalization tool', 'As a testing-only platform', 'As defining the Experience Optimization category — unifying personalization, testing, and optimization', 'As a Dynamic Yield alternative'], correctAnswer: 2 },
    { afterSlide: 2, question: 'What are the four differentiation pillars that work against every competitor?', options: ['AI-native architecture, unified platform, network-layer testing, and expert services', 'Price, speed, support, and integrations', 'More features, more users, more regions, and more awards', 'Free trial, lower price, faster setup, and no contract'], correctAnswer: 0 },
    { afterSlide: 3, question: 'Why is the tool consolidation narrative powerful with CFOs?', options: ['CFOs like hearing about new features', 'CFOs don\'t care about tools — only revenue', 'It only works with small companies', 'Consolidating 3-4 tools saves money, reduces complexity, and improves governance'], correctAnswer: 3 },
  ],
  "Deal Execution": [
    { afterSlide: 1, question: 'In MEDDIC, when is a deal truly "qualified" at Monetate?', options: ['When the prospect agrees to a demo', 'When you can answer every MEDDIC element with confidence — it\'s a living framework, not a checklist', 'When you have their email address', 'When procurement sends an RFP'], correctAnswer: 1 },
    { afterSlide: 3, question: 'How should pricing conversations be framed?', options: ['Lead with the lowest possible price', 'Match competitor pricing exactly', 'Never lead with price — always frame in context of value, ROI, and business outcomes', 'Avoid discussing pricing until contract stage'], correctAnswer: 2 },
    { afterSlide: 4, question: 'What makes a well-scoped pilot the fastest path to a closed deal?', options: ['Clear success metrics, a tight timeline, and an explicit decision point at the end', 'Making the pilot free with no commitments', 'Running the pilot for 12+ months', 'Including every product feature in the pilot'], correctAnswer: 0 },
  ],
  "AI Enablement": [
    { afterSlide: 1, question: 'What is MONET Assistant and how should sellers use it?', options: ['A replacement for human sales skills', 'A customer-facing chatbot on the website', 'An automated email writer', 'An LLM-based knowledge guide for self-serve answers — but always validate before using in production conversations'], correctAnswer: 3 },
    { afterSlide: 2, question: 'What determines the quality of answers from MONET Assistant?', options: ['The quality of your prompts — using structured prompt patterns gets the most useful outputs', 'The time of day you use it', 'How fast your internet connection is', 'The number of times you\'ve logged in'], correctAnswer: 0 },
    { afterSlide: 3, question: 'What is a critical governance rule when using MONET Assistant?', options: ['Share all outputs directly with prospects', 'Never use it for competitive intelligence', 'Know the limitations, verify outputs, and escalate to human experts when needed', 'Only managers should have access'], correctAnswer: 2 },
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
- Keep questions relevant to B2B SaaS sales scenarios when applicable`;

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
