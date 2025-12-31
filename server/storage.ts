import { 
  users, 
  chapters,
  roleplays,
  battlecards,
  resources,
  userProgress,
  roleplayAttempts,
  quizQuestions,
  quizAttempts,
  type User,
  type InsertUser,
  type Chapter,
  type InsertChapter,
  type Roleplay,
  type InsertRoleplay,
  type Battlecard,
  type InsertBattlecard,
  type Resource,
  type InsertResource,
  type UserProgress,
  type InsertUserProgress,
  type RoleplayAttempt,
  type InsertRoleplayAttempt,
  type QuizQuestion,
  type InsertQuizQuestion,
  type QuizAttempt,
  type InsertQuizAttempt,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByManagerId(managerId: string): Promise<User[]>;
  
  // Chapters
  getAllChapters(): Promise<Chapter[]>;
  getChapter(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  updateChapterCoverImage(id: string, coverImage: string): Promise<Chapter | undefined>;
  
  // Roleplays
  getAllRoleplays(): Promise<Roleplay[]>;
  getRoleplay(id: string): Promise<Roleplay | undefined>;
  getRoleplaysByChapterId(chapterId: string): Promise<Roleplay[]>;
  createRoleplay(roleplay: InsertRoleplay): Promise<Roleplay>;
  
  // Battlecards
  getAllBattlecards(): Promise<Battlecard[]>;
  createBattlecard(battlecard: InsertBattlecard): Promise<Battlecard>;
  
  // Resources
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByChapter(userId: string, chapterId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined>;
  
  // Roleplay Attempts
  getUserRoleplayAttempts(userId: string): Promise<RoleplayAttempt[]>;
  createRoleplayAttempt(attempt: InsertRoleplayAttempt): Promise<RoleplayAttempt>;
  
  // Quiz Questions
  getQuizQuestionsByChapter(chapterId: string): Promise<QuizQuestion[]>;
  getQuizQuestionsBySlide(chapterId: string, slideIndex: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  createQuizQuestions(questions: InsertQuizQuestion[]): Promise<QuizQuestion[]>;
  
  // Quiz Attempts
  getUserQuizAttempts(userId: string, chapterId: string): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizScore(userId: string, chapterId: string): Promise<{ correct: number; total: number }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByManagerId(managerId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.managerId, managerId));
  }

  // Chapters
  async getAllChapters(): Promise<Chapter[]> {
    return await db.select().from(chapters).orderBy(chapters.orderIndex);
  }

  async getChapter(id: string): Promise<Chapter | undefined> {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter || undefined;
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const [chapter] = await db.insert(chapters).values(insertChapter).returning();
    return chapter;
  }

  async updateChapterCoverImage(id: string, coverImage: string): Promise<Chapter | undefined> {
    const [chapter] = await db.update(chapters).set({ coverImage }).where(eq(chapters.id, id)).returning();
    return chapter || undefined;
  }

  // Roleplays
  async getAllRoleplays(): Promise<Roleplay[]> {
    return await db.select().from(roleplays);
  }

  async getRoleplay(id: string): Promise<Roleplay | undefined> {
    const [roleplay] = await db.select().from(roleplays).where(eq(roleplays.id, id));
    return roleplay || undefined;
  }

  async getRoleplaysByChapterId(chapterId: string): Promise<Roleplay[]> {
    return await db.select().from(roleplays).where(eq(roleplays.chapterId, chapterId));
  }

  async createRoleplay(insertRoleplay: InsertRoleplay): Promise<Roleplay> {
    const [roleplay] = await db.insert(roleplays).values(insertRoleplay).returning();
    return roleplay;
  }

  // Battlecards
  async getAllBattlecards(): Promise<Battlecard[]> {
    return await db.select().from(battlecards);
  }

  async createBattlecard(insertBattlecard: InsertBattlecard): Promise<Battlecard> {
    const [battlecard] = await db.insert(battlecards).values(insertBattlecard).returning();
    return battlecard;
  }

  // Resources
  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  // User Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserProgressByChapter(userId: string, chapterId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.chapterId, chapterId)));
    return progress || undefined;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db.insert(userProgress).values(insertProgress).returning();
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined> {
    const [progress] = await db.update(userProgress).set(updates).where(eq(userProgress.id, id)).returning();
    return progress || undefined;
  }

  // Roleplay Attempts
  async getUserRoleplayAttempts(userId: string): Promise<RoleplayAttempt[]> {
    return await db
      .select()
      .from(roleplayAttempts)
      .where(eq(roleplayAttempts.userId, userId))
      .orderBy(desc(roleplayAttempts.createdAt));
  }

  async createRoleplayAttempt(insertAttempt: InsertRoleplayAttempt): Promise<RoleplayAttempt> {
    const [attempt] = await db.insert(roleplayAttempts).values(insertAttempt).returning();
    return attempt;
  }

  // Quiz Questions
  async getQuizQuestionsByChapter(chapterId: string): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.chapterId, chapterId))
      .orderBy(quizQuestions.slideIndex);
  }

  async getQuizQuestionsBySlide(chapterId: string, slideIndex: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(and(eq(quizQuestions.chapterId, chapterId), eq(quizQuestions.slideIndex, slideIndex)));
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions).values(insertQuestion).returning();
    return question;
  }

  async createQuizQuestions(insertQuestions: InsertQuizQuestion[]): Promise<QuizQuestion[]> {
    if (insertQuestions.length === 0) return [];
    return await db.insert(quizQuestions).values(insertQuestions).returning();
  }

  // Quiz Attempts
  async getUserQuizAttempts(userId: string, chapterId: string): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.chapterId, chapterId)))
      .orderBy(desc(quizAttempts.createdAt));
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db.insert(quizAttempts).values(insertAttempt).returning();
    return attempt;
  }

  async getUserQuizScore(userId: string, chapterId: string): Promise<{ correct: number; total: number }> {
    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.chapterId, chapterId)));
    
    const uniqueQuestions = new Map<string, boolean>();
    attempts.forEach(a => {
      if (!uniqueQuestions.has(a.questionId)) {
        uniqueQuestions.set(a.questionId, a.isCorrect === 1);
      }
    });
    
    const correct = Array.from(uniqueQuestions.values()).filter(v => v).length;
    return { correct, total: uniqueQuestions.size };
  }
}

export const storage = new DatabaseStorage();
