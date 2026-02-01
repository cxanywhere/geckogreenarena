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
  { afterSlide: 5, question: 'Which of the following is a Gecko Green service offering?', options: ['Roof replacement', 'Lawn fertilization', 'Pool maintenance', 'Window tinting'], correctAnswer: 1 },
  { afterSlide: 18, question: 'Which is a key benefit customers get from proper lawn care?', options: ['Lawn becomes maintenance-free', 'A thick, green, weed-free landscape and pride of ownership', 'Grass never goes dormant in winter', 'Weeds disappear instantly after treatment'], correctAnswer: 1 },
  { afterSlide: 20, question: 'What best describes how Gecko Green delivers results?', options: ['One-time treatment that solves everything', 'Properly timed seasonal treatments across the year', 'Only weed spray when weeds appear', 'Only fertilizer in spring'], correctAnswer: 1 },
  { afterSlide: 21, question: 'Fertilizer is best described as:', options: ['A weed killer', 'Food for plants that supports health, color, and density', 'A water replacement', 'A product that works the same regardless of season'], correctAnswer: 1 },
  { afterSlide: 22, question: 'In N-P-K, what does Nitrogen (N) primarily support?', options: ['Stronger roots only', 'Greening and top growth', 'Water regulation only', 'Disease control only'], correctAnswer: 1 },
  { afterSlide: 23, question: 'Which statement is most accurate regarding fertilizer forms?', options: ['Only liquid fertilizer works', 'Only dry fertilizer works', 'Plants cannot tell the difference between organic vs mineral and liquid vs dry—timing and needs matter', 'Fertilizer choice never changes by season'], correctAnswer: 2 },
  { afterSlide: 25, question: 'What are the two major weed types referenced in training?', options: ['Summer weeds and winter weeds', 'Tall weeds and short weeds', 'Grassy weeds and broadleaf weeds', 'Root weeds and leaf weeds'], correctAnswer: 2 },
  { afterSlide: 27, question: 'What is the role of pre-emergent weed control?', options: ['It kills visible weeds on contact', 'It creates a barrier under the soil to stop weeds before they emerge', 'It fertilizes the lawn to prevent weeds', 'It is the same as Round-up'], correctAnswer: 1 },
  { afterSlide: 28, question: 'After a post-emergent application, what timeline should you generally set for weed response?', options: ['Same day', '24 hours', 'About 2 weeks', '2–3 months'], correctAnswer: 2 },
  { afterSlide: 29, question: 'Which statement correctly describes the Gecko Green annual program?', options: ['5 applications per year, no aeration included', '10 total applications per year: 9 lawn applications + 1 spring aeration', 'Applications are only done when customers request them', 'Results should be complete after the first application'], correctAnswer: 1 }
];

const CHAPTER_1_QUIZZES: PredefinedQuiz[] = [
  { afterSlide: 5, question: 'Which set correctly matches the "Four Pillars of Field Success"?', options: ["Confidence, Optimism, Personality, Endurance", "Timeliness, Attitude, Practice, Persistence", "Product, Price, Pitch, Persistence", "Appearance, Tone, Explanation, Honesty"], correctAnswer: 1 },
  { afterSlide: 10, question: "In a doorstep sale, what's the correct relationship between emotion and logic?", options: ["Logic drives action; emotion justifies afterward", "Emotion drives action; logic justifies afterward", "They are always equal at the same time", "Only logic matters in lawn care"], correctAnswer: 1 },
  { afterSlide: 15, question: 'A homeowner says, "My lawn is fine." What is the best next move per the training?', options: ["Present pricing immediately to test seriousness", "Reveal an unrealized issue with a specific, visible observation and a question", "Ask for their email and leave", "Offer a discount to create urgency"], correctAnswer: 1 },
  { afterSlide: 20, question: "Which statement is TRUE about pre-emergent vs. post-emergent and expectations?", options: ["Pre-emergent kills existing weeds; post-emergent prevents sprouting", "Post-emergent kills existing weeds; pre-emergent prevents sprouting", "Both only work if weeds are already visible", "Both work instantly if watered the same day"], correctAnswer: 1 },
  { afterSlide: 25, question: 'In the "Partnership" model, which is primarily the homeowner\'s responsibility?', options: ["Seasonal application timing", "Product formulation choices", "Watering and mowing consistency", "Free service calls between visits"], correctAnswer: 2 },
  { afterSlide: 29, question: 'Which best captures what your "30-second story" must do?', options: ["Explain every treatment ingredient in detail", "Deliver a clear, confident summary of what you do, how you do it, and why it works—fast", "Lead with price to qualify the homeowner", "Compare competitors by name and position against them"], correctAnswer: 1 },
  { afterSlide: 34, question: 'What is the "Prepay Rule in One Line" the rep should follow?', options: ["Offer prepay only if the homeowner asks", "Prepay first, every time; autopay is the fallback", "Autopay is the default; prepay is optional", "Prepay only for customers with heavy weeds"], correctAnswer: 1 }
];

async function seedPredefinedQuizzesForChapter(chapterId: string, chapterTitle: string): Promise<number> {
  let quizzes: PredefinedQuiz[] = [];
  
  if (chapterTitle === "Intro to GeckoGreen") {
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
- Keep questions relevant to door-to-door sales scenarios when applicable`;

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

  if (isCorrect) {
    const score = await storage.getUserQuizScore(userId, chapterId);
    const progress = await storage.getUserProgressByChapter(userId, chapterId);
    if (progress) {
      const quizScore = Math.round((score.correct / Math.max(score.total, 1)) * 100);
      await storage.updateUserProgress(progress.id, { quizScore });
    }
  }

  return {
    isCorrect,
    explanation: question.explanation,
  };
}
