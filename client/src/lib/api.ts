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
}

export interface RoleplayAttempt {
  id: string;
  userId: string;
  roleplayId: string;
  score: number;
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
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
  async login(email: string, password: string): Promise<{ user: User }> {
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

  // Battlecards
  async getBattlecards(): Promise<Battlecard[]> {
    return this.request("/api/battlecards");
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
}

export const api = new APIClient();
