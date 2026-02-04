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
  usageSessions,
  buyerPersonas,
  certifications,
  coachingNotes,
  coachingTasks,
  progressNudges,
  experts,
  comicStories,
  comicPanels,
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
  type UsageSession,
  type InsertUsageSession,
  type BuyerPersona,
  type Certification,
  type InsertCertification,
  type CoachingNote,
  type InsertCoachingNote,
  type CoachingTask,
  type InsertCoachingTask,
  type ProgressNudge,
  type InsertProgressNudge,
  type Expert,
  type InsertExpert,
  type ComicStory,
  type ComicPanel,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ne, or, isNull, sql, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  hardDeleteUser(id: string): Promise<{ deletedUsers: number; deletedSessions: number }>;
  reassignReps(fromManagerId: string, toManagerId: string): Promise<number>;
  deleteUserUsageSessions(userId: string): Promise<number>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByManagerId(managerId: string): Promise<User[]>;
  getAllUsersByManagerId(managerId: string): Promise<User[]>;
  getManagers(): Promise<User[]>;
  getReps(): Promise<User[]>;
  
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
  updateRoleplay(id: string, updates: Partial<InsertRoleplay>): Promise<Roleplay | undefined>;
  deleteRoleplayBySlug(slug: string): Promise<boolean>;
  updateRoleplayAvatar(id: string, avatar: string): Promise<Roleplay | undefined>;
  
  // Battlecards
  getAllBattlecards(): Promise<Battlecard[]>;
  getBattlecard(id: string): Promise<Battlecard | undefined>;
  createBattlecard(battlecard: InsertBattlecard): Promise<Battlecard>;
  updateBattlecardImage(id: string, image: string): Promise<Battlecard | undefined>;
  deleteAllBattlecards(): Promise<void>;
  
  // Resources
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // User Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByChapter(userId: string, chapterId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<InsertUserProgress>): Promise<UserProgress | undefined>;
  updateSlideProgress(userId: string, chapterId: string, currentSlide: number, totalSlides: number): Promise<UserProgress>;
  
  // Roleplay Attempts
  getUserRoleplayAttempts(userId: string): Promise<RoleplayAttempt[]>;
  getAllRoleplayAttempts(): Promise<RoleplayAttempt[]>;
  createRoleplayAttempt(attempt: InsertRoleplayAttempt): Promise<RoleplayAttempt>;
  
  // Quiz Questions
  getQuizQuestionsByChapter(chapterId: string): Promise<QuizQuestion[]>;
  getQuizQuestionsBySlide(chapterId: string, slideIndex: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  createQuizQuestions(questions: InsertQuizQuestion[]): Promise<QuizQuestion[]>;
  upsertQuizQuestions(questions: InsertQuizQuestion[]): Promise<QuizQuestion[]>;
  getNextQuestionOrder(chapterId: string, slideIndex: number): Promise<number>;
  
  // Quiz Attempts
  getUserQuizAttempts(userId: string, chapterId: string): Promise<QuizAttempt[]>;
  getAllUserQuizAttempts(userId: string): Promise<QuizAttempt[]>;
  getAllQuizAttempts(): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizScore(userId: string, chapterId: string): Promise<{ correct: number; total: number }>;
  
  // Detailed user data for rep profile
  getUserDetails(userId: string): Promise<UserDetails>;
  
  // Usage Sessions
  createUsageSession(session: InsertUsageSession): Promise<UsageSession>;
  updateUsageSession(id: string, updates: Partial<InsertUsageSession>): Promise<UsageSession | undefined>;
  getUsageSessionByVapiCallId(vapiCallId: string): Promise<UsageSession | undefined>;
  getUserUsageSessions(userId: string): Promise<UsageSession[]>;
  getTeamUsageSessions(managerId: string): Promise<UsageSession[]>;
  getAllUsageSessions(): Promise<UsageSession[]>;
  getUsageSessionById(id: string): Promise<UsageSession | undefined>;
  completeUsageSession(id: string, endTime: Date, durationSeconds: number): Promise<UsageSession | undefined>;
  deleteAllUsageSessions(): Promise<number>;
  
  // Performance Metrics
  getRepPerformance(userId: string): Promise<RepPerformance>;
  getTeamPerformance(managerId: string): Promise<TeamPerformance>;
  getOrgPerformance(): Promise<OrgPerformance>;
  
  // Buyer Personas
  getAllBuyerPersonas(): Promise<BuyerPersona[]>;
  getBuyerPersona(id: string): Promise<BuyerPersona | undefined>;
  getBuyerPersonaBySlug(slug: string): Promise<BuyerPersona | undefined>;
  
  // Certifications
  getCertification(userId: string): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertificationPdf(id: string, pdfUrl: string): Promise<Certification | undefined>;
  
  // Coaching Notes
  getCoachingNotes(repId: string): Promise<CoachingNote[]>;
  createCoachingNote(note: InsertCoachingNote): Promise<CoachingNote>;
  
  // Coaching Tasks
  getCoachingTasks(repId: string): Promise<CoachingTask[]>;
  getPendingCoachingTasks(repId: string): Promise<CoachingTask[]>;
  createCoachingTask(task: InsertCoachingTask): Promise<CoachingTask>;
  updateCoachingTask(id: string, updates: Partial<InsertCoachingTask>): Promise<CoachingTask | undefined>;
  completeCoachingTask(id: string): Promise<CoachingTask | undefined>;
  
  // Progress Nudges
  getUnreadNudges(userId: string): Promise<ProgressNudge[]>;
  createProgressNudge(nudge: InsertProgressNudge): Promise<ProgressNudge>;
  markNudgeRead(id: string): Promise<ProgressNudge | undefined>;
  dismissNudge(id: string): Promise<ProgressNudge | undefined>;
  
  // Stalled Progress Detection
  getStalledReps(daysSinceActivity: number): Promise<User[]>;
  
  // Experts
  getAllExperts(): Promise<Expert[]>;
  getExpert(id: string): Promise<Expert | undefined>;
  getExpertBySlug(slug: string): Promise<Expert | undefined>;
  createExpert(expert: InsertExpert): Promise<Expert>;
  
  // Comic Stories
  getComicStoriesWithPanels(): Promise<(ComicStory & { panels: ComicPanel[] })[]>;
}

// Performance metric types
export interface RepPerformance {
  userId: string;
  userName: string;
  email: string;
  managerId: string | null;
  managerName?: string;
  status: string;
  chaptersCompleted: number;
  totalChapters: number;
  chapterProgress: number;
  quizAverage: number;
  quizAttempts: number;
  roleplaysPassed: number;
  totalRoleplays: number;
  roleplaysAttempted: number;
  roleplayPassRate: number;
  lastActivity: Date | null;
  isCertified: boolean;
  overallScore: number;
}

export interface TeamPerformance {
  managerId: string;
  managerName: string;
  reps: RepPerformance[];
  teamStats: {
    totalReps: number;
    certifiedReps: number;
    avgChapterProgress: number;
    avgQuizScore: number;
    avgRoleplayPassRate: number;
    teamScore: number;
  };
}

export interface RoleplayAttemptDetail {
  id: string;
  roleplayId: string;
  roleplayName: string;
  roleplayRole: string;
  chapterTitle: string;
  score: number;
  passed: boolean;
  duration: string | null;
  feedback: {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    recordingUrl?: string;
    [key: string]: any;
  } | null;
  metrics: { resistance: string; clarity: string; tone: string } | null;
  createdAt: Date;
}

export interface QuizAttemptDetail {
  id: string;
  chapterId: string;
  chapterTitle: string;
  questionId: string;
  questionText: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  createdAt: Date;
}

export interface UserDetails {
  user: User;
  performance: RepPerformance;
  roleplayAttempts: RoleplayAttemptDetail[];
  quizAttempts: QuizAttemptDetail[];
  chapterProgress: {
    chapterId: string;
    chapterTitle: string;
    completed: boolean;
    currentSlide: number;
    totalSlides: number;
    quizScore: { correct: number; total: number };
  }[];
}

export interface OrgPerformance {
  managers: TeamPerformance[];
  allReps: RepPerformance[];
  orgStats: {
    totalManagers: number;
    totalReps: number;
    certifiedReps: number;
    avgChapterProgress: number;
    avgQuizScore: number;
    avgRoleplayPassRate: number;
  };
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
    return await db.select().from(users).where(
      and(eq(users.managerId, managerId), isNull(users.archivedAt))
    );
  }

  async getAllUsersByManagerId(managerId: string): Promise<User[]> {
    // Includes archived users - for billing/usage reports
    return await db.select().from(users).where(eq(users.managerId, managerId));
  }

  async deleteUser(id: string): Promise<boolean> {
    // Soft delete - set archivedAt timestamp instead of deleting
    const result = await db.update(users)
      .set({ archivedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result.length > 0;
  }

  async hardDeleteUser(id: string): Promise<{ deletedUsers: number; deletedSessions: number }> {
    // Get user to check their role
    const user = await this.getUser(id);
    if (!user) {
      return { deletedUsers: 0, deletedSessions: 0 };
    }

    let deletedUsers = 0;
    let deletedSessions = 0;

    // If this is a manager, also delete all their reps
    if (user.role === "manager") {
      // Get all reps under this manager
      const reps = await db.select().from(users).where(eq(users.managerId, id));
      
      for (const rep of reps) {
        // Delete rep's usage sessions
        const repSessions = await db.delete(usageSessions)
          .where(eq(usageSessions.userId, rep.id))
          .returning();
        deletedSessions += repSessions.length;
        
        // Delete rep's roleplay attempts
        await db.delete(roleplayAttempts).where(eq(roleplayAttempts.userId, rep.id));
        
        // Delete rep's quiz attempts
        await db.delete(quizAttempts).where(eq(quizAttempts.userId, rep.id));
        
        // Delete rep's progress
        await db.delete(userProgress).where(eq(userProgress.userId, rep.id));
        
        // Delete rep's certifications
        await db.delete(certifications).where(eq(certifications.userId, rep.id));
        
        // Delete coaching notes and tasks
        await db.delete(coachingNotes).where(eq(coachingNotes.repId, rep.id));
        await db.delete(coachingTasks).where(eq(coachingTasks.repId, rep.id));
        
        // Delete the rep
        await db.delete(users).where(eq(users.id, rep.id));
        deletedUsers++;
      }
    }

    // Delete the user's own usage sessions
    const userSessions = await db.delete(usageSessions)
      .where(eq(usageSessions.userId, id))
      .returning();
    deletedSessions += userSessions.length;

    // Delete the user's roleplay attempts
    await db.delete(roleplayAttempts).where(eq(roleplayAttempts.userId, id));
    
    // Delete the user's quiz attempts
    await db.delete(quizAttempts).where(eq(quizAttempts.userId, id));
    
    // Delete the user's progress
    await db.delete(userProgress).where(eq(userProgress.userId, id));
    
    // Delete the user's certifications
    await db.delete(certifications).where(eq(certifications.userId, id));
    
    // Delete coaching notes and tasks
    await db.delete(coachingNotes).where(eq(coachingNotes.repId, id));
    await db.delete(coachingTasks).where(eq(coachingTasks.repId, id));
    
    // Delete the user
    await db.delete(users).where(eq(users.id, id));
    deletedUsers++;

    return { deletedUsers, deletedSessions };
  }

  async reassignReps(fromManagerId: string, toManagerId: string): Promise<number> {
    const result = await db.update(users)
      .set({ managerId: toManagerId })
      .where(and(
        eq(users.managerId, fromManagerId),
        eq(users.role, "rep"),
        isNull(users.archivedAt)
      ))
      .returning();
    return result.length;
  }

  async deleteUserUsageSessions(userId: string): Promise<number> {
    const result = await db.delete(usageSessions)
      .where(eq(usageSessions.userId, userId))
      .returning();
    return result.length;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, role), isNull(users.archivedAt))
    );
  }

  async getManagers(): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, "manager"), isNull(users.archivedAt))
    );
  }

  async getReps(): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, "rep"), isNull(users.archivedAt))
    );
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

  async updateRoleplay(id: string, updates: Partial<InsertRoleplay>): Promise<Roleplay | undefined> {
    const [roleplay] = await db.update(roleplays).set(updates).where(eq(roleplays.id, id)).returning();
    return roleplay || undefined;
  }

  async deleteRoleplayBySlug(slug: string): Promise<boolean> {
    const result = await db.delete(roleplays).where(eq(roleplays.slug, slug)).returning();
    return result.length > 0;
  }

  async updateRoleplayAvatar(id: string, avatar: string): Promise<Roleplay | undefined> {
    const [roleplay] = await db.update(roleplays).set({ avatar }).where(eq(roleplays.id, id)).returning();
    return roleplay || undefined;
  }

  // Battlecards
  async getAllBattlecards(): Promise<Battlecard[]> {
    return await db.select().from(battlecards);
  }

  async getBattlecard(id: string): Promise<Battlecard | undefined> {
    const [battlecard] = await db.select().from(battlecards).where(eq(battlecards.id, id));
    return battlecard || undefined;
  }

  async createBattlecard(insertBattlecard: InsertBattlecard): Promise<Battlecard> {
    const [battlecard] = await db.insert(battlecards).values(insertBattlecard).returning();
    return battlecard;
  }

  async updateBattlecardImage(id: string, image: string): Promise<Battlecard | undefined> {
    const [battlecard] = await db.update(battlecards).set({ image }).where(eq(battlecards.id, id)).returning();
    return battlecard || undefined;
  }

  async deleteAllBattlecards(): Promise<void> {
    await db.delete(battlecards);
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

  async updateSlideProgress(userId: string, chapterId: string, currentSlide: number, totalSlides: number): Promise<UserProgress> {
    const existing = await this.getUserProgressByChapter(userId, chapterId);
    
    if (existing) {
      const slidesViewed = existing.slidesViewed || [];
      if (!slidesViewed.includes(currentSlide)) {
        slidesViewed.push(currentSlide);
      }
      const [updated] = await db
        .update(userProgress)
        .set({ 
          currentSlide, 
          totalSlides, 
          slidesViewed 
        })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userProgress)
        .values({
          userId,
          chapterId,
          currentSlide,
          totalSlides,
          slidesViewed: [currentSlide],
          completed: 0,
        })
        .returning();
      return created;
    }
  }

  // Roleplay Attempts
  async getUserRoleplayAttempts(userId: string): Promise<RoleplayAttempt[]> {
    return await db
      .select()
      .from(roleplayAttempts)
      .where(eq(roleplayAttempts.userId, userId))
      .orderBy(desc(roleplayAttempts.createdAt));
  }

  async getAllRoleplayAttempts(): Promise<RoleplayAttempt[]> {
    return await db
      .select()
      .from(roleplayAttempts)
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
    return this.upsertQuizQuestions(insertQuestions);
  }

  async upsertQuizQuestions(insertQuestions: InsertQuizQuestion[]): Promise<QuizQuestion[]> {
    if (insertQuestions.length === 0) return [];
    
    const results = await db
      .insert(quizQuestions)
      .values(insertQuestions)
      .onConflictDoUpdate({
        target: [quizQuestions.chapterId, quizQuestions.slideIndex, quizQuestions.questionOrder],
        set: {
          question: sql`EXCLUDED.question`,
          options: sql`EXCLUDED.options`,
          correctAnswer: sql`EXCLUDED.correct_answer`,
          explanation: sql`EXCLUDED.explanation`,
        },
      })
      .returning();
    
    return results;
  }

  async getNextQuestionOrder(chapterId: string, slideIndex: number): Promise<number> {
    const existing = await db
      .select({ maxOrder: quizQuestions.questionOrder })
      .from(quizQuestions)
      .where(and(eq(quizQuestions.chapterId, chapterId), eq(quizQuestions.slideIndex, slideIndex)))
      .orderBy(desc(quizQuestions.questionOrder))
      .limit(1);
    
    return existing.length > 0 ? (existing[0].maxOrder + 1) : 0;
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

  async getAllUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.createdAt));
  }

  async getAllQuizAttempts(): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .orderBy(desc(quizAttempts.createdAt));
  }

  async getUserDetails(userId: string): Promise<UserDetails> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    // Get performance summary
    const performance = await this.getRepPerformance(userId);
    
    // Get all roleplay attempts with roleplay details
    const rawAttempts = await this.getUserRoleplayAttempts(userId);
    const allRoleplays = await this.getAllRoleplays();
    const allChapters = await this.getAllChapters();
    
    const roleplayAttempts: RoleplayAttemptDetail[] = rawAttempts.map(attempt => {
      const roleplay = allRoleplays.find(r => r.id === attempt.roleplayId);
      const chapter = roleplay ? allChapters.find(c => c.id === roleplay.chapterId) : null;
      
      let parsedFeedback = null;
      if (attempt.feedback) {
        try {
          parsedFeedback = JSON.parse(attempt.feedback);
        } catch {
          parsedFeedback = { summary: attempt.feedback };
        }
      }
      
      return {
        id: attempt.id,
        roleplayId: attempt.roleplayId,
        roleplayName: roleplay?.name || "Unknown Roleplay",
        roleplayRole: roleplay?.role || "Unknown Role",
        chapterTitle: chapter?.title || "Unknown Chapter",
        score: attempt.score,
        passed: attempt.passed === 1,
        duration: attempt.duration,
        feedback: parsedFeedback,
        metrics: attempt.metrics,
        createdAt: attempt.createdAt,
      };
    });
    
    // Get all quiz attempts with question details
    const rawQuizAttempts = await this.getAllUserQuizAttempts(userId);
    const allQuestions = await db.select().from(quizQuestions);
    
    const quizAttemptDetails: QuizAttemptDetail[] = rawQuizAttempts.map(attempt => {
      const question = allQuestions.find(q => q.id === attempt.questionId);
      const chapter = allChapters.find(c => c.id === attempt.chapterId);
      
      return {
        id: attempt.id,
        chapterId: attempt.chapterId,
        chapterTitle: chapter?.title || "Unknown Chapter",
        questionId: attempt.questionId,
        questionText: question?.question || "Unknown Question",
        options: Array.isArray(question?.options) ? question.options : [],
        selectedAnswer: attempt.selectedAnswer,
        correctAnswer: question?.correctAnswer ?? -1,
        isCorrect: attempt.isCorrect === 1,
        createdAt: attempt.createdAt,
      };
    });
    
    // Get chapter progress with quiz scores
    const userProgressData = await this.getUserProgress(userId);
    const chapterProgress = await Promise.all(allChapters.map(async (chapter) => {
      const progress = userProgressData.find(p => p.chapterId === chapter.id);
      const quizScore = await this.getUserQuizScore(userId, chapter.id);
      
      return {
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        completed: progress?.completed === 1,
        currentSlide: progress?.currentSlide || 0,
        totalSlides: chapter.slideCount || 0,
        quizScore,
      };
    }));
    
    return {
      user,
      performance,
      roleplayAttempts,
      quizAttempts: quizAttemptDetails,
      chapterProgress,
    };
  }

  // Usage Sessions
  async createUsageSession(insertSession: InsertUsageSession): Promise<UsageSession> {
    const [session] = await db.insert(usageSessions).values(insertSession).returning();
    return session;
  }

  async updateUsageSession(id: string, updates: Partial<InsertUsageSession>): Promise<UsageSession | undefined> {
    const [session] = await db.update(usageSessions).set(updates).where(eq(usageSessions.id, id)).returning();
    return session || undefined;
  }

  async getUsageSessionByVapiCallId(vapiCallId: string): Promise<UsageSession | undefined> {
    const [session] = await db.select().from(usageSessions).where(eq(usageSessions.vapiCallId, vapiCallId));
    return session || undefined;
  }

  async getUserUsageSessions(userId: string): Promise<UsageSession[]> {
    return await db
      .select()
      .from(usageSessions)
      .where(eq(usageSessions.userId, userId))
      .orderBy(desc(usageSessions.createdAt));
  }

  async getTeamUsageSessions(managerId: string): Promise<UsageSession[]> {
    // Use getAllUsersByManagerId to include archived users for accurate billing
    const teamMembers = await this.getAllUsersByManagerId(managerId);
    const teamUserIds = teamMembers.map(m => m.id);
    
    if (teamUserIds.length === 0) return [];
    
    return await db
      .select()
      .from(usageSessions)
      .where(or(...teamUserIds.map(uid => eq(usageSessions.userId, uid))))
      .orderBy(desc(usageSessions.createdAt));
  }

  async getAllUsageSessions(): Promise<UsageSession[]> {
    return await db.select().from(usageSessions).orderBy(desc(usageSessions.createdAt));
  }

  async getUsageSessionById(id: string): Promise<UsageSession | undefined> {
    const [session] = await db.select().from(usageSessions).where(eq(usageSessions.id, id));
    return session;
  }

  async completeUsageSession(id: string, endTime: Date, durationSeconds: number): Promise<UsageSession | undefined> {
    const billedMinutes = Math.ceil(durationSeconds / 60);
    const rateCentsPerMinute = 15;
    const costCents = billedMinutes * rateCentsPerMinute;
    
    const [session] = await db
      .update(usageSessions)
      .set({
        endTime,
        durationSeconds,
        billedMinutes,
        costCents,
        status: "completed",
      })
      .where(eq(usageSessions.id, id))
      .returning();
    
    return session || undefined;
  }

  async deleteAllUsageSessions(): Promise<number> {
    const result = await db.delete(usageSessions).returning();
    return result.length;
  }

  // Performance Metrics
  async getRepPerformance(userId: string): Promise<RepPerformance> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    
    return this.calculateRepPerformance(user);
  }

  private async calculateRepPerformance(user: User): Promise<RepPerformance> {
    const allChapters = await this.getAllChapters();
    const totalChapters = allChapters.length;
    
    // Get chapter progress
    const progress = await this.getUserProgress(user.id);
    const chaptersCompleted = progress.filter(p => p.completed === 1).length;
    const chapterProgress = totalChapters > 0 ? Math.round((chaptersCompleted / totalChapters) * 100) : 0;
    
    // Get quiz performance across all chapters
    let totalCorrect = 0;
    let totalQuizAttempts = 0;
    for (const chapter of allChapters) {
      const score = await this.getUserQuizScore(user.id, chapter.id);
      totalCorrect += score.correct;
      totalQuizAttempts += score.total;
    }
    const quizAverage = totalQuizAttempts > 0 ? Math.round((totalCorrect / totalQuizAttempts) * 100) : 0;
    
    // Get roleplay performance
    const roleplayAttemptsData = await this.getUserRoleplayAttempts(user.id);
    const allRoleplays = await this.getAllRoleplays();
    const totalRoleplays = allRoleplays.length;
    
    // Count unique roleplays attempted (not attempts)
    const uniqueRoleplaysAttempted = new Set(roleplayAttemptsData.map(a => a.roleplayId)).size;
    // Count unique roleplays passed (not attempts)
    const passedRoleplayIds = roleplayAttemptsData.filter(a => a.passed === 1).map(a => a.roleplayId);
    const roleplaysPassed = new Set(passedRoleplayIds).size;
    
    // For display purposes, keep attempt counts too
    const roleplaysAttempted = roleplayAttemptsData.length;
    const roleplayPassRate = uniqueRoleplaysAttempted > 0 ? Math.round((roleplaysPassed / totalRoleplays) * 100) : 0;
    
    // Get last activity - most recent attempt or progress update
    let lastActivity: Date | null = null;
    if (roleplayAttemptsData.length > 0) {
      lastActivity = roleplayAttemptsData[0].createdAt;
    }
    
    // Certification criteria: all chapters complete, 75%+ quiz average, 16+ unique roleplays passed
    // Note: Using 16 as the minimum to be fair to reps who trained before/after roleplay changes
    const REQUIRED_ROLEPLAYS_FOR_CERTIFICATION = 16;
    const isCertified = chaptersCompleted === totalChapters && 
                        totalChapters > 0 && 
                        quizAverage >= 75 && 
                        roleplaysPassed >= REQUIRED_ROLEPLAYS_FOR_CERTIFICATION;
    
    // Overall score: 40% quiz, 30% roleplay, 20% chapter, 10% activity bonus
    const activityBonus = lastActivity && (Date.now() - lastActivity.getTime()) < 7 * 24 * 60 * 60 * 1000 ? 10 : 0;
    const overallScore = Math.round(
      (quizAverage * 0.4) + 
      (roleplayPassRate * 0.3) + 
      (chapterProgress * 0.2) + 
      activityBonus
    );
    
    // Get manager name if applicable
    let managerName: string | undefined;
    if (user.managerId) {
      const manager = await this.getUser(user.managerId);
      managerName = manager?.name;
    }
    
    return {
      userId: user.id,
      userName: user.name,
      email: user.email,
      managerId: user.managerId,
      managerName,
      status: user.status,
      chaptersCompleted,
      totalChapters,
      chapterProgress,
      quizAverage,
      quizAttempts: totalQuizAttempts,
      roleplaysPassed,
      totalRoleplays,
      roleplaysAttempted,
      roleplayPassRate,
      lastActivity,
      isCertified,
      overallScore,
    };
  }

  async getTeamPerformance(managerId: string): Promise<TeamPerformance> {
    const manager = await this.getUser(managerId);
    if (!manager) {
      throw new Error(`Manager ${managerId} not found`);
    }
    
    const teamMembers = await this.getUsersByManagerId(managerId);
    const reps: RepPerformance[] = [];
    
    for (const member of teamMembers) {
      const perf = await this.calculateRepPerformance(member);
      reps.push(perf);
    }
    
    // Sort: certified first, then by overall score
    reps.sort((a, b) => {
      if (a.isCertified && !b.isCertified) return -1;
      if (!a.isCertified && b.isCertified) return 1;
      return b.overallScore - a.overallScore;
    });
    
    // Calculate team stats
    const totalReps = reps.length;
    const certifiedReps = reps.filter(r => r.isCertified).length;
    const avgChapterProgress = totalReps > 0 ? Math.round(reps.reduce((sum, r) => sum + r.chapterProgress, 0) / totalReps) : 0;
    const avgQuizScore = totalReps > 0 ? Math.round(reps.reduce((sum, r) => sum + r.quizAverage, 0) / totalReps) : 0;
    const avgRoleplayPassRate = totalReps > 0 ? Math.round(reps.reduce((sum, r) => sum + r.roleplayPassRate, 0) / totalReps) : 0;
    const teamScore = totalReps > 0 ? Math.round(reps.reduce((sum, r) => sum + r.overallScore, 0) / totalReps) : 0;
    
    return {
      managerId: manager.id,
      managerName: manager.name,
      reps,
      teamStats: {
        totalReps,
        certifiedReps,
        avgChapterProgress,
        avgQuizScore,
        avgRoleplayPassRate,
        teamScore,
      },
    };
  }

  async getOrgPerformance(): Promise<OrgPerformance> {
    const allManagers = await this.getManagers();
    const managers: TeamPerformance[] = [];
    const allReps: RepPerformance[] = [];
    
    for (const manager of allManagers) {
      const teamPerf = await this.getTeamPerformance(manager.id);
      managers.push(teamPerf);
      allReps.push(...teamPerf.reps);
    }
    
    // Also get reps without managers
    const allUsers = await this.getReps();
    for (const user of allUsers) {
      if (!user.managerId && !allReps.find(r => r.userId === user.id)) {
        const perf = await this.calculateRepPerformance(user);
        allReps.push(perf);
      }
    }
    
    // Sort managers by team score
    managers.sort((a, b) => b.teamStats.teamScore - a.teamStats.teamScore);
    
    // Sort all reps: certified first, then by score
    allReps.sort((a, b) => {
      if (a.isCertified && !b.isCertified) return -1;
      if (!a.isCertified && b.isCertified) return 1;
      return b.overallScore - a.overallScore;
    });
    
    // Org stats
    const totalReps = allReps.length;
    const certifiedReps = allReps.filter(r => r.isCertified).length;
    const avgChapterProgress = totalReps > 0 ? Math.round(allReps.reduce((sum, r) => sum + r.chapterProgress, 0) / totalReps) : 0;
    const avgQuizScore = totalReps > 0 ? Math.round(allReps.reduce((sum, r) => sum + r.quizAverage, 0) / totalReps) : 0;
    const avgRoleplayPassRate = totalReps > 0 ? Math.round(allReps.reduce((sum, r) => sum + r.roleplayPassRate, 0) / totalReps) : 0;
    
    return {
      managers,
      allReps,
      orgStats: {
        totalManagers: allManagers.length,
        totalReps,
        certifiedReps,
        avgChapterProgress,
        avgQuizScore,
        avgRoleplayPassRate,
      },
    };
  }

  // Buyer Personas
  async getAllBuyerPersonas(): Promise<BuyerPersona[]> {
    return await db.select().from(buyerPersonas).orderBy(buyerPersonas.orderIndex);
  }

  async getBuyerPersona(id: string): Promise<BuyerPersona | undefined> {
    const [persona] = await db.select().from(buyerPersonas).where(eq(buyerPersonas.id, id));
    return persona || undefined;
  }

  async getBuyerPersonaBySlug(slug: string): Promise<BuyerPersona | undefined> {
    const [persona] = await db.select().from(buyerPersonas).where(eq(buyerPersonas.slug, slug));
    return persona || undefined;
  }

  // Certifications
  async getCertification(userId: string): Promise<Certification | undefined> {
    const [cert] = await db.select().from(certifications).where(eq(certifications.userId, userId));
    return cert || undefined;
  }

  async createCertification(certification: InsertCertification): Promise<Certification> {
    const [created] = await db.insert(certifications).values(certification).returning();
    return created;
  }

  async updateCertificationPdf(id: string, pdfUrl: string): Promise<Certification | undefined> {
    const [updated] = await db.update(certifications).set({ pdfUrl }).where(eq(certifications.id, id)).returning();
    return updated || undefined;
  }

  // Coaching Notes
  async getCoachingNotes(repId: string): Promise<CoachingNote[]> {
    return await db.select().from(coachingNotes).where(eq(coachingNotes.repId, repId)).orderBy(desc(coachingNotes.createdAt));
  }

  async createCoachingNote(note: InsertCoachingNote): Promise<CoachingNote> {
    const [created] = await db.insert(coachingNotes).values(note).returning();
    return created;
  }

  // Coaching Tasks
  async getCoachingTasks(repId: string): Promise<CoachingTask[]> {
    return await db.select().from(coachingTasks).where(eq(coachingTasks.repId, repId)).orderBy(desc(coachingTasks.createdAt));
  }

  async getPendingCoachingTasks(repId: string): Promise<CoachingTask[]> {
    return await db.select().from(coachingTasks)
      .where(and(eq(coachingTasks.repId, repId), eq(coachingTasks.status, "pending")))
      .orderBy(coachingTasks.dueDate);
  }

  async createCoachingTask(task: InsertCoachingTask): Promise<CoachingTask> {
    const [created] = await db.insert(coachingTasks).values(task).returning();
    return created;
  }

  async updateCoachingTask(id: string, updates: Partial<InsertCoachingTask>): Promise<CoachingTask | undefined> {
    const [updated] = await db.update(coachingTasks).set(updates).where(eq(coachingTasks.id, id)).returning();
    return updated || undefined;
  }

  async completeCoachingTask(id: string): Promise<CoachingTask | undefined> {
    const [updated] = await db.update(coachingTasks)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(coachingTasks.id, id))
      .returning();
    return updated || undefined;
  }

  // Progress Nudges
  async getUnreadNudges(userId: string): Promise<ProgressNudge[]> {
    return await db.select().from(progressNudges)
      .where(and(eq(progressNudges.userId, userId), eq(progressNudges.dismissed, 0), isNull(progressNudges.readAt)))
      .orderBy(desc(progressNudges.sentAt));
  }

  async createProgressNudge(nudge: InsertProgressNudge): Promise<ProgressNudge> {
    const [created] = await db.insert(progressNudges).values(nudge).returning();
    return created;
  }

  async markNudgeRead(id: string): Promise<ProgressNudge | undefined> {
    const [updated] = await db.update(progressNudges)
      .set({ readAt: new Date() })
      .where(eq(progressNudges.id, id))
      .returning();
    return updated || undefined;
  }

  async dismissNudge(id: string): Promise<ProgressNudge | undefined> {
    const [updated] = await db.update(progressNudges)
      .set({ dismissed: 1 })
      .where(eq(progressNudges.id, id))
      .returning();
    return updated || undefined;
  }

  // Stalled Progress Detection
  async getStalledReps(daysSinceActivity: number): Promise<User[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceActivity);
    
    const reps = await db.select().from(users).where(eq(users.role, "rep"));
    const stalledReps: User[] = [];
    
    for (const rep of reps) {
      const recentAttempts = await db.select().from(roleplayAttempts)
        .where(and(
          eq(roleplayAttempts.userId, rep.id),
          sql`${roleplayAttempts.createdAt} > ${cutoffDate}`
        ));
      
      const recentProgress = await db.select().from(userProgress)
        .where(and(
          eq(userProgress.userId, rep.id),
          sql`${userProgress.completedAt} > ${cutoffDate}`
        ));
      
      if (recentAttempts.length === 0 && recentProgress.length === 0) {
        stalledReps.push(rep);
      }
    }
    
    return stalledReps;
  }

  // Experts
  async getAllExperts(): Promise<Expert[]> {
    return await db.select().from(experts).orderBy(experts.orderIndex);
  }

  async getExpert(id: string): Promise<Expert | undefined> {
    const [expert] = await db.select().from(experts).where(eq(experts.id, id));
    return expert || undefined;
  }

  async getExpertBySlug(slug: string): Promise<Expert | undefined> {
    const [expert] = await db.select().from(experts).where(eq(experts.slug, slug));
    return expert || undefined;
  }

  async createExpert(expert: InsertExpert): Promise<Expert> {
    const [created] = await db.insert(experts).values(expert).returning();
    return created;
  }

  async getComicStoriesWithPanels(): Promise<(ComicStory & { panels: ComicPanel[] })[]> {
    const stories = await db.select().from(comicStories).orderBy(comicStories.orderIndex);
    const allPanels = await db.select().from(comicPanels).orderBy(comicPanels.panelOrder);
    
    return stories.map(story => ({
      ...story,
      panels: allPanels.filter(panel => panel.storyId === story.id)
    }));
  }
}

export const storage = new DatabaseStorage();
