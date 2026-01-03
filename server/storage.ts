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
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByManagerId(managerId: string): Promise<User[]>;
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
  
  // Quiz Attempts
  getUserQuizAttempts(userId: string, chapterId: string): Promise<QuizAttempt[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizScore(userId: string, chapterId: string): Promise<{ correct: number; total: number }>;
  
  // Usage Sessions
  createUsageSession(session: InsertUsageSession): Promise<UsageSession>;
  updateUsageSession(id: string, updates: Partial<InsertUsageSession>): Promise<UsageSession | undefined>;
  getUsageSessionByVapiCallId(vapiCallId: string): Promise<UsageSession | undefined>;
  getUserUsageSessions(userId: string): Promise<UsageSession[]>;
  getTeamUsageSessions(managerId: string): Promise<UsageSession[]>;
  getAllUsageSessions(): Promise<UsageSession[]>;
  completeUsageSession(id: string, endTime: Date, durationSeconds: number): Promise<UsageSession | undefined>;
  
  // Performance Metrics
  getRepPerformance(userId: string): Promise<RepPerformance>;
  getTeamPerformance(managerId: string): Promise<TeamPerformance>;
  getOrgPerformance(): Promise<OrgPerformance>;
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
    return await db.select().from(users).where(eq(users.managerId, managerId));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async getManagers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "manager"));
  }

  async getReps(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, "rep"));
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
    const teamMembers = await this.getUsersByManagerId(managerId);
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
    const roleplaysAttempted = roleplayAttemptsData.length;
    const roleplaysPassed = roleplayAttemptsData.filter(a => a.passed === 1).length;
    const roleplayPassRate = roleplaysAttempted > 0 ? Math.round((roleplaysPassed / roleplaysAttempted) * 100) : 0;
    
    // Get last activity - most recent attempt or progress update
    let lastActivity: Date | null = null;
    if (roleplayAttemptsData.length > 0) {
      lastActivity = roleplayAttemptsData[0].createdAt;
    }
    
    // Certification criteria: all chapters complete, 90%+ quiz average, at least 1 roleplay passed
    const isCertified = chaptersCompleted === totalChapters && 
                        totalChapters > 0 && 
                        quizAverage >= 90 && 
                        roleplaysPassed >= 1;
    
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
}

export const storage = new DatabaseStorage();
