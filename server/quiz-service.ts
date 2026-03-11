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
  "LMS Fundamentals and Product Landscape": [
    { afterSlide: 2, question: 'What best describes LinkedIn Marketing Solutions?', options: ['A social media management tool', 'A job posting platform for recruiters', 'LinkedIn\'s B2B advertising and demand generation platform that helps brands reach professional audiences with precision targeting', 'A CRM software for sales teams'], correctAnswer: 2 },
    { afterSlide: 4, question: 'What is the "Professional Graph Advantage" in LinkedIn advertising?', options: ['LinkedIn has more users than Facebook', 'Targeting based on professional identity attributes like job title, function, seniority, industry, and company', 'LinkedIn offers the cheapest CPM rates', 'LinkedIn automatically creates ads for you'], correctAnswer: 1 },
    { afterSlide: 7, question: 'What does "objective-first selling" mean for an LMS rep?', options: ['Always start by recommending video ads', 'Start with the buyer\'s business outcome before recommending ad formats', 'Focus on selling the most expensive package first', 'Pitch all available products in every meeting'], correctAnswer: 1 },
  ],
  "Buyer Conversations, Discovery, and Positioning": [
    { afterSlide: 3, question: 'What are the 7 parts of the LMS discovery framework?', options: ['Product, Price, Place, Promotion, People, Process, Physical Evidence', 'Business goals, Audience, Funnel gap, Current motion, Offer/content, Measurement, Stakeholders', 'Awareness, Interest, Desire, Action, Loyalty, Advocacy, Retention', 'Budget, Authority, Need, Timeline, Competition, Risk, Value'], correctAnswer: 1 },
    { afterSlide: 5, question: 'Why is audience discovery critical before recommending LinkedIn campaigns?', options: ['It helps you avoid giving a product demo', 'Understanding who the buyer is targeting ensures you recommend the right targeting, format, and messaging strategy', 'It fills time during the meeting', 'LinkedIn requires it before creating an ad account'], correctAnswer: 1 },
    { afterSlide: 10, question: 'What is the best approach when positioning LinkedIn against Google and Meta?', options: ['Tell the buyer to stop using Google and Meta entirely', 'Position LinkedIn as complementary — strong for precise B2B professional reach where other channels may lack business context', 'Say LinkedIn is always cheaper than competitors', 'Avoid mentioning other channels at all'], correctAnswer: 1 },
  ],
  "Objections, Strategy, and Selling with Confidence": [
    { afterSlide: 3, question: 'What is the 4-step objection handling framework?', options: ['Deny, Deflect, Discount, Close', 'Acknowledge, Clarify, Reframe, Recommend next step', 'Ignore, Redirect, Pitch harder, Ask for the sale', 'Listen, Agree, Move on, Follow up later'], correctAnswer: 1 },
    { afterSlide: 4, question: 'When a buyer says "LinkedIn is too expensive," what should the rep do?', options: ['Immediately offer a discount', 'Agree and suggest a cheaper channel', 'Reframe the conversation from cost per lead to cost per qualified opportunity and pipeline value', 'Defend the pricing by listing all features'], correctAnswer: 2 },
    { afterSlide: 9, question: 'What is the recommended approach for a beginner-friendly starter strategy?', options: ['Run every ad format simultaneously to maximize coverage', 'Start with the business goal, select audience, match objective, pick format, choose CTA, define success metric, and plan follow-up', 'Copy what the competitor is doing on LinkedIn', 'Start with the largest budget possible to get data'], correctAnswer: 1 },
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
- Keep questions relevant to LinkedIn Marketing Solutions B2B advertising scenarios and consultative selling when applicable`;

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
