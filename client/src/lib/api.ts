const API_BASE = "";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatarInitials?: string;
  managerId?: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  pdfUrl?: string;
  coverImage?: string;
  agenda: string[];
  slides: any[];
  slideCount?: number;
  orderIndex: number;
}

export interface Roleplay {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar?: string;
  traits: string[];
  difficulty: string;
  stats: {
    resistance: number;
    objections: number;
    buy_signal: number;
  };
  chapterId?: string;
}

export interface Battlecard {
  id: string;
  phase: string;
  title: string;
  situation: string;
  script: string;
  keyPoints: string[];
  type: string;
  image?: string;
}

export interface BuyerPersona {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  avatar: string | null;
  attributes: string[];
  whatTheyCareAbout: string[];
  whatTriggersResistance: string[];
  howToWin: string[];
  bestPlays: string[];
  orderIndex: number;
}

export interface Resource {
  id: string;
  type: string;
  title: string;
  description: string;
  learningOutcome: string;
  duration: string;
  author: string;
  thumbnail?: string;
  tags: string[];
}

export interface UserProgress {
  id: string;
  userId: string;
  chapterId?: string;
  quizScore?: number;
  completed: number;
  completedAt?: string;
  currentSlide?: number;
  totalSlides?: number;
  slidesViewed?: number[];
}

export interface RoleplayAttempt {
  id: string;
  userId: string;
  roleplayId: string;
  score: number;
  passed?: number;
  duration?: string;
  feedback?: string;
  metrics?: {
    resistance: string;
    clarity: string;
    tone: string;
  };
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
}

export interface QuizSubmitResult {
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizScore {
  correct: number;
  total: number;
}

class APIClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ user: User; authToken?: string }> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Users
  async getUser(id: string): Promise<User> {
    return this.request(`/api/users/${id}`);
  }

  async getAllUsers(): Promise<User[]> {
    return this.request("/api/users");
  }

  async getManagerTeam(managerId: string): Promise<User[]> {
    return this.request(`/api/managers/${managerId}/team`);
  }

  // Chapters
  async getChapters(): Promise<Chapter[]> {
    return this.request("/api/chapters");
  }

  async getChapter(id: string): Promise<Chapter> {
    return this.request(`/api/chapters/${id}`);
  }

  // Roleplays
  async getRoleplays(): Promise<Roleplay[]> {
    return this.request("/api/roleplays");
  }

  async getRoleplay(id: string): Promise<Roleplay> {
    return this.request(`/api/roleplays/${id}`);
  }

  async getChapterRoleplays(chapterId: string): Promise<Roleplay[]> {
    return this.request(`/api/chapters/${chapterId}/roleplays`);
  }

  async getUserRoleplayStatus(userId: string): Promise<Record<string, { 
    attempts: number; 
    passed: boolean; 
    permanentlyFailed: boolean;
  }>> {
    return this.request(`/api/users/${userId}/roleplay-status`);
  }

  async getUserRoleplayHistory(userId: string): Promise<Record<string, {
    roleplay: {
      id: string;
      name: string;
      role: string;
      difficulty: string;
      chapterId: string | null;
      phase: string | null;
      orderIndex: number | null;
    };
    attempts: Array<{
      id: string;
      score: number | null;
      passed: boolean;
      createdAt: string | null;
      feedback: any;
      recordingUrl: string | null;
      notes: Array<{ id: string; content: string; createdAt: string | null; managerId: string }>;
    }>;
    totalAttempts: number;
    hasPassed: boolean;
    remainingAttempts: number;
    permanentlyFailed: boolean;
  }>> {
    return this.request(`/api/users/${userId}/roleplay-history`);
  }

  // Battlecards
  async getBattlecards(): Promise<Battlecard[]> {
    return this.request("/api/battlecards");
  }

  // Buyer Personas
  async getBuyerPersonas(): Promise<BuyerPersona[]> {
    return this.request("/api/personas");
  }

  async getBuyerPersona(slug: string): Promise<BuyerPersona> {
    return this.request(`/api/personas/${slug}`);
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return this.request("/api/resources");
  }

  // Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.request(`/api/users/${userId}/progress`);
  }

  async createProgress(progress: Partial<UserProgress>): Promise<UserProgress> {
    return this.request("/api/progress", {
      method: "POST",
      body: JSON.stringify(progress),
    });
  }

  async updateSlideProgress(userId: string, chapterId: string, currentSlide: number, totalSlides: number): Promise<UserProgress> {
    return this.request("/api/progress/slide", {
      method: "POST",
      body: JSON.stringify({ userId, chapterId, currentSlide, totalSlides }),
    });
  }

  // Attempts
  async getUserAttempts(userId: string): Promise<RoleplayAttempt[]> {
    return this.request(`/api/users/${userId}/attempts`);
  }

  async createAttempt(attempt: Partial<RoleplayAttempt>): Promise<RoleplayAttempt> {
    return this.request("/api/attempts", {
      method: "POST",
      body: JSON.stringify(attempt),
    });
  }

  // AI Roleplay Session
  async startRoleplaySession(roleplayId: string, userId: string): Promise<{
    sessionId: string;
    message: string;
    scenario: { name: string; role: string; difficulty: string };
  }> {
    return this.request("/api/roleplay-session/start", {
      method: "POST",
      body: JSON.stringify({ roleplayId, userId }),
    });
  }

  async sendRoleplayMessage(sessionId: string, message: string): Promise<{
    message: string;
    turnCount: number;
  }> {
    return this.request("/api/roleplay-session/message", {
      method: "POST",
      body: JSON.stringify({ sessionId, message }),
    });
  }

  async endRoleplaySession(sessionId: string, userId?: string, roleplayId?: string): Promise<{
    feedback: {
      overallScore: number;
      strengths: string[];
      improvements: string[];
      keyMoments: string[];
      tips: string[];
    };
    transcript: Array<{ role: string; content: string }>;
  }> {
    return this.request("/api/roleplay-session/end", {
      method: "POST",
      body: JSON.stringify({ sessionId, userId, roleplayId }),
    });
  }

  // Quiz
  async getQuizSlides(chapterId: string): Promise<{ slides: number[] }> {
    return this.request(`/api/quiz/${chapterId}/slides`);
  }

  async getQuizForSlide(chapterId: string, slideIndex: number, content?: string): Promise<{ questions: QuizQuestion[] }> {
    const params = new URLSearchParams();
    if (content) params.set("content", content);
    return this.request(`/api/quiz/${chapterId}/slide/${slideIndex}?${params.toString()}`);
  }

  async submitQuizAnswer(userId: string, chapterId: string, questionId: string, selectedAnswer: number): Promise<QuizSubmitResult> {
    return this.request("/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify({ userId, chapterId, questionId, selectedAnswer }),
    });
  }

  async getChapterQuizQuestions(chapterId: string): Promise<QuizQuestion[]> {
    return this.request(`/api/quiz/${chapterId}/questions`);
  }

  async getUserQuizScore(userId: string, chapterId: string): Promise<QuizScore> {
    return this.request(`/api/users/${userId}/quiz-score/${chapterId}`);
  }

  async getQuizFromContent(chapterId: string, pageNumber: number): Promise<{ 
    questions: QuizQuestion[]; 
    totalSlides?: number;
    message?: string;
  }> {
    return this.request("/api/quiz/from-pdf", {
      method: "POST",
      body: JSON.stringify({ chapterId, pageNumber }),
    });
  }

  async getPDFInfo(chapterId: string): Promise<{ totalPages: number; pdfUrl: string }> {
    return this.request(`/api/pdf/pages/${chapterId}`);
  }

  // Certifications
  async getCertification(userId: string): Promise<Certification | null> {
    return this.request(`/api/certifications/${userId}`);
  }

  async createCertification(data: {
    userId: string;
    certificateNumber: string;
    chaptersCompleted: number;
    roleplaysCompleted: number;
    quizAverage: number;
    roleplayPassRate: number;
  }): Promise<Certification> {
    return this.request("/api/certifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Coaching Notes
  async getCoachingNotes(repId: string): Promise<CoachingNote[]> {
    return this.request(`/api/coaching/notes/${repId}`);
  }

  async createCoachingNote(data: {
    repId: string;
    content: string;
    roleplayAttemptId?: string;
    noteType?: string;
  }): Promise<CoachingNote> {
    return this.request("/api/coaching/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Coaching Tasks
  async getCoachingTasks(repId: string): Promise<CoachingTask[]> {
    return this.request(`/api/coaching/tasks/${repId}`);
  }

  async getPendingCoachingTasks(repId: string): Promise<CoachingTask[]> {
    return this.request(`/api/coaching/tasks/${repId}/pending`);
  }

  async createCoachingTask(data: {
    repId: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }): Promise<CoachingTask> {
    return this.request("/api/coaching/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async completeCoachingTask(taskId: string): Promise<CoachingTask> {
    return this.request(`/api/coaching/tasks/${taskId}/complete`, {
      method: "PATCH",
    });
  }

  // Progress Nudges
  async getNudges(): Promise<ProgressNudge[]> {
    return this.request("/api/nudges");
  }

  async createNudge(data: {
    userId: string;
    nudgeType: string;
    message: string;
  }): Promise<ProgressNudge> {
    return this.request("/api/nudges", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async markNudgeRead(nudgeId: string): Promise<ProgressNudge> {
    return this.request(`/api/nudges/${nudgeId}/read`, {
      method: "PATCH",
    });
  }

  async dismissNudge(nudgeId: string): Promise<ProgressNudge> {
    return this.request(`/api/nudges/${nudgeId}/dismiss`, {
      method: "PATCH",
    });
  }

  // Stalled Reps
  async getStalledReps(days?: number): Promise<User[]> {
    const params = days ? `?days=${days}` : "";
    return this.request(`/api/stalled-reps${params}`);
  }

  // User Stats
  async getUserStats(userId: string): Promise<UserStats> {
    return this.request(`/api/users/${userId}/stats`);
  }

  // User Performance
  async getUserPerformance(userId: string): Promise<RepPerformance> {
    return this.request(`/api/users/${userId}/performance`);
  }

  // Victory Playbook
  async getPlaybookStories(): Promise<any[]> {
    return this.request("/api/playbook/stories");
  }
}

// New types for the API
export interface Certification {
  id: string;
  userId: string;
  certificateNumber: string;
  chaptersCompleted: number;
  roleplaysCompleted: number;
  quizAverage: number;
  roleplayPassRate: number;
  pdfUrl: string | null;
  status: string;
  awardedAt: string;
}

export interface CoachingNote {
  id: string;
  repId: string;
  managerId: string;
  content: string;
  roleplayAttemptId: string | null;
  noteType: string;
  createdAt: string;
}

export interface CoachingTask {
  id: string;
  repId: string;
  managerId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface ProgressNudge {
  id: string;
  userId: string;
  nudgeType: string;
  message: string;
  dismissed: number;
  readAt: string | null;
  sentAt: string;
}

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
  lastActivity: string | null;
  isCertified: boolean;
  overallScore: number;
}

export interface UserStats {
  user: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    warriorAvatar: string | null;
    role: string;
  };
  performance: RepPerformance;
  certification: Certification | null;
  pendingTasks: CoachingTask[];
  recentRoleplays: any[];
  weeklyStats: {
    roleplaysCompleted: number;
    roleplaysPassed: number;
    averageScore: number;
  };
  chaptersProgress: any[];
  totalQuizAttempts: number;
}

export const api = new APIClient();
