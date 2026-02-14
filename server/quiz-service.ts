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

const CHAPTER_0_QUIZZES: PredefinedQuiz[] = [
  { afterSlide: 3, question: 'What is Monetate\'s core product offering?', options: ['Social media management', 'Experience optimization and personalization for e-commerce', 'Email marketing automation', 'Website hosting'], correctAnswer: 1 },
  { afterSlide: 6, question: 'What does the MONET engine power?', options: ['Website design templates', 'AI-powered product recommendations and personalization', 'Social media scheduling', 'Customer support chatbots'], correctAnswer: 1 },
  { afterSlide: 8, question: 'What is Monetate\'s ideal customer profile?', options: ['Small businesses with under $1M revenue', 'Mid-market to enterprise retailers with $50M+ revenue', 'Individual freelancers', 'Non-profit organizations'], correctAnswer: 1 },
  { afterSlide: 10, question: 'Which of these is a key Monetate capability?', options: ['Social media posting', 'A/B testing and experimentation', 'Payroll processing', 'Inventory management'], correctAnswer: 1 },
  { afterSlide: 12, question: 'What average revenue lift do Monetate customers typically achieve?', options: ['2-3%', '15% with 3x ROI within 12 months', '50% immediately', '100% within 6 months'], correctAnswer: 1 },
  { afterSlide: 14, question: 'Which competitor is owned by Mastercard?', options: ['Optimizely', 'Adobe Target', 'Dynamic Yield', 'Bloomreach'], correctAnswer: 2 },
  { afterSlide: 15, question: 'How long does a typical Monetate implementation take?', options: ['1-2 days', '4-8 weeks', '6-12 months', '2+ years'], correctAnswer: 1 },
  { afterSlide: 17, question: 'What compliance standards does Monetate meet?', options: ['Only PCI-DSS', 'SOC 2 Type II, GDPR, and CCPA', 'No compliance certifications', 'Only HIPAA'], correctAnswer: 1 },
  { afterSlide: 18, question: 'What is Monetate\'s pricing model based on?', options: ['Number of employees', 'Monthly website sessions/traffic volume', 'Fixed annual fee regardless of usage', 'Number of products sold'], correctAnswer: 1 },
  { afterSlide: 19, question: 'Which statement best describes Monetate\'s value proposition?', options: ['The cheapest personalization tool on the market', 'Enterprise-grade experience optimization that delivers measurable revenue lift through AI-powered personalization', 'A simple website builder with drag-and-drop features', 'An email marketing platform with personalization'], correctAnswer: 1 }
];

const CHAPTER_1_QUIZZES: PredefinedQuiz[] = [
  { afterSlide: 5, question: 'Which set correctly matches the "Four Pillars of Field Success"?', options: ["Confidence, Optimism, Personality, Endurance", "Timeliness, Attitude, Practice, Persistence", "Product, Price, Pitch, Persistence", "Appearance, Tone, Explanation, Honesty"], correctAnswer: 1 },
  { afterSlide: 10, question: "In enterprise selling, what's the correct relationship between emotion and logic?", options: ["Logic drives action; emotion justifies afterward", "Emotion drives action; logic justifies afterward", "They are always equal at the same time", "Only logic matters in enterprise sales"], correctAnswer: 1 },
  { afterSlide: 15, question: 'A buyer says, "Our conversion rates are fine." What is the best next move?', options: ["Present pricing immediately to test seriousness", "Reveal an unrealized issue with a specific data point and a question", "Ask for their email and leave", "Offer a discount to create urgency"], correctAnswer: 1 },
  { afterSlide: 20, question: "Which statement is TRUE about pre-emergent vs. post-emergent and expectations?", options: ["Pre-emergent kills existing weeds; post-emergent prevents sprouting", "Post-emergent kills existing weeds; pre-emergent prevents sprouting", "Both only work if weeds are already visible", "Both work instantly if watered the same day"], correctAnswer: 1 },
  { afterSlide: 25, question: 'In the MEDDPICC framework, what does the "M" stand for?', options: ["Management", "Metrics", "Marketing", "Methodology"], correctAnswer: 1 },
  { afterSlide: 29, question: 'Which best captures what your "30-second elevator pitch" must do?', options: ["Explain every treatment ingredient in detail", "Deliver a clear, confident summary of what you do, how you do it, and why it works—fast", "Lead with price to qualify the buyer", "Compare competitors by name and position against them"], correctAnswer: 1 },
  { afterSlide: 34, question: 'What should your closing strategy prioritize?', options: ["Offer a discount if the buyer hesitates", "Multi-thread the deal by aligning all stakeholders before asking for commitment", "Only follow up once to avoid being pushy", "Wait for the buyer to bring up next steps"], correctAnswer: 1 }
];

async function seedPredefinedQuizzesForChapter(chapterId: string, chapterTitle: string): Promise<number> {
  let quizzes: PredefinedQuiz[] = [];
  
  if (chapterTitle === "Intro to Monetate" || chapterTitle === "Intro to GeckoGreen") {
    quizzes = CHAPTER_0_QUIZZES;
  } else if (chapterTitle === "Sales Foundations") {
    quizzes = CHAPTER_1_QUIZZES;
  } else {
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
