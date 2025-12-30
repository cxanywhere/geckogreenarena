import OpenAI from "openai";
import { storage } from "./storage";
import { type InsertQuizQuestion } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

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
      const questions = await generateQuestionsForContent(slide.content, chapterId, slide.index);
      allQuestions.push(...questions);
    } catch (error) {
      console.error(`Failed to generate questions for slide ${slide.index}:`, error);
    }
  }

  if (allQuestions.length > 0) {
    await storage.createQuizQuestions(allQuestions);
  }

  return allQuestions;
}

async function generateQuestionsForContent(
  content: string,
  chapterId: string,
  slideIndex: number
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
    
    return parsed.questions.map(q => ({
      chapterId,
      slideIndex,
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
    const generated = await generateQuestionsForContent(slideContent, chapterId, slideIndex);
    if (generated.length > 0) {
      questions = await storage.createQuizQuestions(generated);
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
