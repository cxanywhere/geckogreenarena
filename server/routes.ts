import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { storage } from "./storage";
import { db } from "./db";
import { insertUserProgressSchema, insertRoleplayAttemptSchema, quizQuestions } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { startRoleplayConversation, continueRoleplayConversation, evaluateRoleplay, generateChapterImage, generatePersonaImage, generateLogoImage, generateBattlecardImage, generateArenaLogo, type RoleplayMessage, type RoleplayScenario } from "./gemini";
import { getOrGenerateQuizForSlide, submitQuizAnswer, ensurePredefinedQuizzesSeeded } from "./quiz-service";
import { vapiService } from "./vapi-service";
import { getVapiRoleplayConfig, convertRoleplayToVapiConfig, VAPI_ROLEPLAY_CONFIGS } from "./vapi-config";
import { generateSecurePassword, getAvatarInitials } from "./password-generator";
import { sendCredentialsEmail, sendBillingResetCode, sendHardDeleteCode, sendCertificationEmail } from "./email-service";
import { sendCredentialsSMS } from "./sms-service";
import { generateWarriorAvatar } from "./warrior-avatar-service";
import multer from "multer";
import { searchKnowledge, formatKnowledgeForPrompt } from "./knowledge-base";
import OpenAI from "openai";

const roleplaySessions = new Map<string, { scenario: RoleplayScenario; history: RoleplayMessage[] }>();

// Roleplays to hide from frontend (keep in DB for historical data, but don't show to new users)
const HIDDEN_ROLEPLAY_IDS = new Set(['rp-03']);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

async function ensureDatabaseSeeded() {
  try {
    const users = await storage.getAllUsers();
    if (users.length === 0) {
      console.log("Database empty, seeding with demo data...");
      
      const manager1 = await storage.createUser({
        email: "sarah.jenkins@geckogreen.com",
        password: "demo123",
        name: "Sarah Jenkins",
        role: "manager",
        status: "active",
        avatarInitials: "SJ"
      });

      await storage.createUser({
        email: "james.patterson@geckogreen.com",
        password: "demo123",
        name: "James Patterson",
        role: "director",
        status: "active",
        avatarInitials: "JP"
      });

      await storage.createUser({
        email: "alex.rivera@geckogreen.com",
        password: "demo123",
        name: "Alex Rivera",
        role: "rep",
        status: "active",
        avatarInitials: "AR",
        managerId: manager1.id
      });

      await storage.createUser({
        email: "mike.chen@geckogreen.com",
        password: "demo123",
        name: "Mike Chen",
        role: "rep",
        status: "active",
        avatarInitials: "MC",
        managerId: manager1.id
      });

      console.log("✓ Created demo users");

      const chapters = await storage.getAllChapters();
      if (chapters.length === 0) {
        const chapter1 = await storage.createChapter({
          title: "Sales Foundations",
          subtitle: "Master the Art of the Opener",
          description: "Learn the psychology behind the first 10 seconds of interaction.",
          duration: "45 min",
          pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976787/Gecko_Green_Training_-_Certification_1_Chapter_1_1_-compressed-compressed_hctzzg.pdf",
          coverImage: "",
          agenda: ["The Psychology of First Impressions", "Pattern Interrupts & Breaking the Script", "Controlling the Frame & Conversation", "Handling Initial Resistance"],
          slides: [
            { type: 'content', title: "The First 10 Seconds", content: "Your success is determined before you even finish your first sentence.", bullets: ["Non-verbal communication accounts for 93% of the first impression.", "The 'Pattern Interrupt': Breaking the homeowner's automatic 'No'.", "Distance & Stance: Respecting personal space while showing confidence."] },
            { type: 'content', title: "The Pattern Interrupt", content: "Most homeowners have a script: 'I'm not interested.' You need a script that breaks theirs.", bullets: ["Don't look like a salesperson (no clipboard in hand).", "Start with a question, not a statement.", "Use a casual, neighborly tone."] },
            { type: 'roleplay', title: "Practice: The Pattern Interrupt", content: "Put your new skills to the test.", roleplayId: "rp-1" },
            { type: 'content', title: "Controlling the Frame", content: "Whoever asks the questions controls the conversation.", bullets: ["The 'Illusion of Choice': Giving options that both lead to 'Yes'.", "Answering a question with a question.", "Setting the time constraint: 'I only have a minute...'"] }
          ],
          orderIndex: 0
        });

        const chapter2 = await storage.createChapter({
          title: "Field Execution",
          subtitle: "Closing the Deal & Handling Objections",
          description: "Move from 'Maybe' to 'Yes'. Advanced B-P-D-C framework.",
          duration: "60 min",
          pdfUrl: "https://res.cloudinary.com/dpxfwxxzi/image/upload/v1766976616/Gecko_Green_Training_-_Certification_1_Chapter_2_2_-compressed_2_1_hok8bh.pdf",
          coverImage: "",
          agenda: ["The B-P-D-C Sales Framework", "Isolating & Overcoming Objections", "Value-Based Pricing Strategies", "Closing Techniques & Securing Payment"],
          slides: [
            { type: 'content', title: "The B-P-D-C Framework", content: "The roadmap to every successful sale.", bullets: ["B: Build Rapport - Connect as a human first.", "P: Problem Awareness - Show them what they can't unsee.", "D: Diagnose & Solution - Present the Gecko Green advantage.", "C: Close - Ask for the business confidently."] },
            { type: 'content', title: "Isolating the Objection", content: "Never answer an objection until you're sure it's the ONLY one.", bullets: ["Smoke screens vs. Real Objections.", "The 'Magic Question': 'If we could handle [objection], would you be ready to move forward?'", "Looping: Acknowledge -> Respond -> Close again."] }
          ],
          orderIndex: 1
        });

        console.log("✓ Created chapters");

        const roleplays = [
          { name: "I'm actually really busy right now.", role: "The Busy Homeowner", description: "Opening scenario. Acknowledge time pressure + set ≤60s container.", avatar: "", traits: ["Time Management", "Control Question", "Respect"], difficulty: "Beginner", stats: { resistance: 60, objections: 20, buy_signal: 30 }, chapterId: chapter1.id },
          { name: "Not interested.", role: "The Dismissive Prospect", description: "Handling Brush-Offs. Acknowledge + reframe to specific issue.", avatar: "", traits: ["Reframing", "Persistence", "Specifics"], difficulty: "Intermediate", stats: { resistance: 80, objections: 40, buy_signal: 10 }, chapterId: chapter1.id },
          { name: "No soliciting.", role: "The Rule Follower", description: "Compliance & Authority. Acknowledge rule + clarify intent.", avatar: "", traits: ["Compliance", "Intent Clarification", "Micro-Permission"], difficulty: "Advanced", stats: { resistance: 90, objections: 10, buy_signal: 5 }, chapterId: chapter1.id },
          { name: "I do my own lawn.", role: "The DIY Enthusiast", description: "DIY Pushback. Validate identity + differentiate.", avatar: "", traits: ["Validation", "Differentiation", "Leadership"], difficulty: "Intermediate", stats: { resistance: 70, objections: 60, buy_signal: 40 }, chapterId: chapter1.id },
          { name: "We already have a lawn company.", role: "The Loyalist", description: "Existing Provider. Acknowledge + remove replacement fear.", avatar: "", traits: ["Gap Analysis", "Non-Threatening", "Discovery"], difficulty: "Advanced", stats: { resistance: 85, objections: 50, buy_signal: 20 }, chapterId: chapter1.id },
          { name: "Why are you here?", role: "The Confused Homeowner", description: "Purpose Statement. State purpose clearly.", avatar: "", traits: ["Clarity", "Direction", "Purpose"], difficulty: "Beginner", stats: { resistance: 40, objections: 30, buy_signal: 50 }, chapterId: chapter1.id },
          { name: "My lawn looks fine.", role: "The Denialist", description: "Identifying Issues. Validate + isolate specific problem.", avatar: "", traits: ["Visual Proof", "Isolation", "Validation"], difficulty: "Intermediate", stats: { resistance: 60, objections: 70, buy_signal: 30 }, chapterId: chapter2.id },
          { name: "Weeds don't bother me.", role: "The Apathetic Homeowner", description: "Educating on Spread. Reframe consequence.", avatar: "", traits: ["Consequence Reframing", "Education", "Discovery"], difficulty: "Advanced", stats: { resistance: 75, objections: 80, buy_signal: 20 }, chapterId: chapter2.id },
          { name: "How much does it cost?", role: "The Price Shopper", description: "Pricing Deferral. Frame price around value.", avatar: "", traits: ["Value Selling", "Deferral", "Control"], difficulty: "Intermediate", stats: { resistance: 65, objections: 75, buy_signal: 35 }, chapterId: chapter2.id },
          { name: "That's too expensive.", role: "The Budget Watcher", description: "Objection Isolation. Isolate + reframe cost.", avatar: "", traits: ["Isolation", "Investment Reframing", "Closing"], difficulty: "Advanced", stats: { resistance: 80, objections: 90, buy_signal: 25 }, chapterId: chapter2.id },
          { name: "I need to think about it.", role: "The Indecisive Homeowner", description: "Stall Handling. Isolate + create urgency.", avatar: "", traits: ["Isolation", "Urgency", "Closing"], difficulty: "Advanced", stats: { resistance: 70, objections: 85, buy_signal: 30 }, chapterId: chapter2.id },
          { name: "I need to talk to my spouse.", role: "The Decision Delegator", description: "Spouse Objection. Isolate decision maker.", avatar: "", traits: ["Isolation", "Decision Making", "Follow-up"], difficulty: "Advanced", stats: { resistance: 75, objections: 80, buy_signal: 20 }, chapterId: chapter2.id }
        ];

        for (const rp of roleplays) {
          await storage.createRoleplay(rp);
        }
        console.log("✓ Created roleplays");

        const battlecards = [
          { phase: "Opening", title: "The Pattern Interrupt Opener", situation: "Homeowner looks busy.", script: "Sorry to interrupt—I'm just [Name] with Gecko Green, checking the lawns on [Street Name].", keyPoints: ["Smile immediately", "Step back 3 feet", "Show open hands"], type: "script", image: "" },
          { phase: "Objection Handling", title: "Handling 'It's Too Early'", situation: "Homeowner says it's too early in the season.", script: "I can appreciate that, however this is the best time of year to start a program. Many of the issues you will see later on can be prevented by starting early, see what I mean?", keyPoints: ["Reframe timing as advantage", "Emphasize pre-emergent prevention", "Ask for commitment"], type: "objection", image: "" },
          { phase: "Opening", title: "The 'I'm Busy' Defense", situation: "Homeowner says 'I don't have time'.", script: "I totally understand, I'll be super quick—literally 30 seconds. I just wanted to ask...", keyPoints: ["Validate their time", "Set a time constraint", "Ask a question immediately"], type: "objection", image: "" },
          { phase: "Objection Handling", title: "'I Do It Myself'", situation: "Homeowner takes pride in DIY.", script: "That's awesome, honestly most of my best customers started that way. What products are you using?", keyPoints: ["Validate their effort", "Ask a technical question", "Highlight professional-grade gap"], type: "objection", image: "" },
          { phase: "Objection Handling", title: "'Too Expensive'", situation: "Price resistance.", script: "I get that. But think about the cost of re-sodding if the chinch bugs take over. It's $50 now vs $500 later.", keyPoints: ["Reframe as investment", "Cost of inaction", "Break down to daily cost"], type: "objection", image: "" },
          { phase: "Closing", title: "The Assumptive Close", situation: "After presenting price.", script: "So, to get that first treatment done, do you want us to start Thursday or Friday?", keyPoints: ["Assume the sale", "Give two options", "Focus on the result"], type: "script", image: "" }
        ];

        for (const bc of battlecards) {
          await storage.createBattlecard(bc);
        }
        console.log("✓ Created battlecards");

        const resources = [
          { type: "call", title: "Handling the 'Not Interested' at the Door", description: "Listen to how Top Performer Sarah Jenkins turns a quick 'no' into an appointment.", learningOutcome: "Learn to stay calm and pivot.", duration: "4:32", author: "Sarah Jenkins", thumbnail: "", tags: ["Objection Handling", "Opener"] },
          { type: "video", title: "The Psychology of Door Knocking", description: "Deep dive into body language and non-verbal cues.", learningOutcome: "Understand how stance and facial expressions impact conversion.", duration: "12:30", author: "GigaRev Training Team", thumbnail: "", tags: ["Psychology", "Foundations"] }
        ];

        for (const resource of resources) {
          await storage.createResource(resource);
        }
        console.log("✓ Created resources");

        // Seed experts if not already present
        const existingExperts = await storage.getAllExperts();
        if (existingExperts.length === 0) {
          const { EXPERT_SEED_DATA } = await import("./seed-data");
          for (const expert of EXPERT_SEED_DATA) {
            await storage.createExpert(expert);
          }
          console.log("✓ Created experts");
        }
      }

      console.log("Database seeding complete!");
    }
  } catch (error) {
    console.error("Error checking/seeding database:", error);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Ensure database has demo data on startup (non-blocking)
  ensureDatabaseSeeded().catch(err => console.error("Background seeding failed:", err));
  ensurePredefinedQuizzesSeeded().catch(err => console.error("Quiz seeding failed:", err));

  // Serve static files from public/uploads
  const uploadsPath = path.join(process.cwd(), "public", "uploads");
  app.use("/uploads", express.static(uploadsPath));

  // Serve training slides
  const trainingSlidesPath = path.join(process.cwd(), "attached_assets", "training_slides");
  app.use("/training-slides", express.static(trainingSlidesPath));
  
  // Serve Chapter 2 training slides
  const trainingSlidesCh2Path = path.join(process.cwd(), "attached_assets", "training_slides_ch2");
  app.use("/training-slides-ch2", express.static(trainingSlidesCh2Path));

  // Generate chapter cover image using Gemini
  app.post("/api/chapters/:id/generate-image", async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      console.log(`Generating cover image for chapter: ${chapter.title}`);
      const result = await generateChapterImage(chapter.title, chapter.description);
      
      if (!result.success) {
        console.error("Image generation failed:", result.error);
        return res.status(500).json({ error: result.error || "Image generation failed" });
      }

      // Update chapter with the new cover image URL
      await storage.updateChapterCoverImage(chapter.id, result.imageUrl!);
      
      console.log(`Generated image for ${chapter.title}: ${result.imageUrl}`);
      res.json({ success: true, imageUrl: result.imageUrl });
    } catch (error) {
      console.error("Generate chapter image error:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Generate all chapter cover images
  app.post("/api/chapters/generate-all-images", async (_req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      const results: { chapterId: string; title: string; success: boolean; imageUrl?: string; error?: string }[] = [];

      for (const chapter of chapters) {
        if (chapter.coverImage) {
          results.push({ chapterId: chapter.id, title: chapter.title, success: true, imageUrl: chapter.coverImage });
          continue;
        }

        console.log(`Generating cover image for chapter: ${chapter.title}`);
        const result = await generateChapterImage(chapter.title, chapter.description);
        
        if (result.success && result.imageUrl) {
          await storage.updateChapterCoverImage(chapter.id, result.imageUrl);
          results.push({ chapterId: chapter.id, title: chapter.title, success: true, imageUrl: result.imageUrl });
        } else {
          results.push({ chapterId: chapter.id, title: chapter.title, success: false, error: result.error });
        }
      }

      res.json({ success: true, results });
    } catch (error) {
      console.error("Generate all chapter images error:", error);
      res.status(500).json({ error: "Failed to generate images" });
    }
  });

  // JWT secret for signing auth tokens - in production use a proper secret from env
  const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET || "arena-ai-secret-key-change-in-production";

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token with user ID and role
      const authToken = jwt.sign(
        { userId: user.id, role: user.role },
        AUTH_JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ 
        user: { ...user, password: undefined },
        authToken
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.get("/api/managers/:managerId/team", async (req, res) => {
    try {
      const team = await storage.getUsersByManagerId(req.params.managerId);
      res.json(team.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      console.error("Get team error:", error);
      res.status(500).json({ error: "Failed to get team" });
    }
  });

  // Get all managers
  app.get("/api/managers", async (req, res) => {
    try {
      const managers = await storage.getManagers();
      res.json(managers.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      console.error("Get managers error:", error);
      res.status(500).json({ error: "Failed to get managers" });
    }
  });

  // Get all reps
  app.get("/api/reps", async (req, res) => {
    try {
      const reps = await storage.getReps();
      res.json(reps.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      console.error("Get reps error:", error);
      res.status(500).json({ error: "Failed to get reps" });
    }
  });

  // Leaderboard - aggregate roleplay attempts by user
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const allAttempts = await storage.getAllRoleplayAttempts();
      const allUsers = await storage.getAllUsers();
      
      // Aggregate stats by user
      const userStats: Record<string, { 
        userId: string; 
        totalScore: number; 
        attemptCount: number; 
        passedCount: number;
      }> = {};
      
      allAttempts.forEach(attempt => {
        if (!userStats[attempt.userId]) {
          userStats[attempt.userId] = {
            userId: attempt.userId,
            totalScore: 0,
            attemptCount: 0,
            passedCount: 0,
          };
        }
        userStats[attempt.userId].totalScore += attempt.score;
        userStats[attempt.userId].attemptCount += 1;
        if (attempt.passed === 1) {
          userStats[attempt.userId].passedCount += 1;
        }
      });
      
      // Calculate averages and build leaderboard entries
      const leaderboard = Object.values(userStats)
        .map(stats => {
          const user = allUsers.find(u => u.id === stats.userId);
          return {
            userId: stats.userId,
            name: user?.name || "Unknown User",
            avatarInitials: user?.avatarInitials || "??",
            warriorAvatar: user?.warriorAvatar || null,
            profilePhoto: user?.profilePhoto || null,
            roleplaysCompleted: stats.attemptCount,
            passedCount: stats.passedCount,
            avgScore: stats.attemptCount > 0 ? Math.round(stats.totalScore / stats.attemptCount) : 0,
          };
        })
        .sort((a, b) => b.avgScore - a.avgScore)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
      
      res.json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  // Create new user (admin/manager creates rep or manager)
  app.post("/api/users", async (req, res) => {
    try {
      const { name, email, phone, role, managerId, creatorId } = req.body;
      
      if (!name || !email || !role) {
        return res.status(400).json({ error: "Name, email, and role are required" });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Generate secure password
      const generatedPassword = generateSecurePassword();
      const avatarInitials = getAvatarInitials(name);

      const newUser = await storage.createUser({
        name,
        email,
        phone: phone || null,
        password: generatedPassword,
        role,
        status: "onboarding",
        avatarInitials,
        managerId: managerId || null,
      });

      // Return user with the generated password (for display/copy)
      res.json({
        user: { ...newUser, password: undefined },
        credentials: {
          email,
          password: generatedPassword,
        },
        message: "User created successfully. Credentials ready to send.",
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Delete user (soft delete)
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Store hard delete verification codes in memory (expires after 10 minutes)
  const hardDeleteCodes: Map<string, { code: string; expiresAt: Date; userId: string }> = new Map();

  // Request hard delete - generates 4-digit code and emails to tabish@gigarev.com
  app.post("/api/users/:id/hard-delete-request", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get rep count if manager
      let repCount = 0;
      if (user.role === "manager") {
        const reps = await storage.getUsersByManagerId(userId);
        repCount = reps.length;
      }

      // Generate 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Store code with 10-minute expiry
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      hardDeleteCodes.set(userId, { code, expiresAt, userId });

      // Send email
      const emailResult = await sendHardDeleteCode(code, user.name, user.role, repCount);
      if (!emailResult.success) {
        return res.status(500).json({ error: emailResult.error || "Failed to send verification email" });
      }

      res.json({ 
        success: true, 
        message: "Verification code sent to tabish@gigarev.com",
        userName: user.name,
        userRole: user.role,
        repCount
      });
    } catch (error: any) {
      console.error("Hard delete request error:", error);
      res.status(500).json({ error: error.message || "Failed to request hard delete" });
    }
  });

  // Confirm hard delete with code
  app.post("/api/users/:id/hard-delete-confirm", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const userId = req.params.id;
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Verification code required" });
      }

      const storedData = hardDeleteCodes.get(userId);
      if (!storedData) {
        return res.status(400).json({ error: "No pending delete request. Please request a new code." });
      }

      if (new Date() > storedData.expiresAt) {
        hardDeleteCodes.delete(userId);
        return res.status(400).json({ error: "Verification code expired. Please request a new code." });
      }

      if (storedData.code !== code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      // Code is valid - perform hard delete
      const result = await storage.hardDeleteUser(userId);
      
      // Clear the used code
      hardDeleteCodes.delete(userId);

      res.json({ 
        success: true, 
        message: `Permanently deleted ${result.deletedUsers} user(s) and ${result.deletedSessions} usage session(s)`,
        deletedUsers: result.deletedUsers,
        deletedSessions: result.deletedSessions
      });
    } catch (error: any) {
      console.error("Hard delete confirm error:", error);
      res.status(500).json({ error: error.message || "Failed to confirm hard delete" });
    }
  });

  // Reassign reps from one manager to another
  app.post("/api/users/reassign", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const { fromManagerId, toManagerId } = req.body;
      if (!fromManagerId || !toManagerId) {
        return res.status(400).json({ error: "Both fromManagerId and toManagerId are required" });
      }

      // Verify both managers exist
      const fromManager = await storage.getUser(fromManagerId);
      const toManager = await storage.getUser(toManagerId);
      
      if (!fromManager) {
        return res.status(404).json({ error: "Source manager not found" });
      }
      if (!toManager) {
        return res.status(404).json({ error: "Target manager not found" });
      }

      const reassignedCount = await storage.reassignReps(fromManagerId, toManagerId);

      res.json({ 
        success: true, 
        message: `Reassigned ${reassignedCount} rep(s) from ${fromManager.name} to ${toManager.name}`,
        reassignedCount
      });
    } catch (error: any) {
      console.error("Reassign reps error:", error);
      res.status(500).json({ error: error.message || "Failed to reassign reps" });
    }
  });

  // Update user status
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const updates = req.body;
      
      // Don't allow password updates through this endpoint
      delete updates.password;
      
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Bulk create users (admin/director adds many reps to a manager)
  app.post("/api/users/bulk", async (req, res) => {
    try {
      const { managerId, users: userInputs, sendEmails } = req.body;
      
      if (!managerId) {
        return res.status(400).json({ error: "Manager ID is required" });
      }
      
      if (!userInputs || !Array.isArray(userInputs) || userInputs.length === 0) {
        return res.status(400).json({ error: "At least one user is required" });
      }

      // Verify manager exists
      const manager = await storage.getUser(managerId);
      if (!manager || manager.role !== "manager") {
        return res.status(400).json({ error: "Invalid manager ID" });
      }

      const results: {
        success: Array<{ name: string; email: string; password: string; emailSent: boolean }>;
        failed: Array<{ name: string; email: string; reason: string }>;
      } = {
        success: [],
        failed: [],
      };

      for (const userInput of userInputs) {
        const { name, email } = userInput;
        
        if (!name || !email) {
          results.failed.push({ name: name || "", email: email || "", reason: "Name and email are required" });
          continue;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          results.failed.push({ name, email, reason: "Invalid email format" });
          continue;
        }

        try {
          // Check if email already exists
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            results.failed.push({ name, email, reason: "Email already exists" });
            continue;
          }

          // Generate secure password
          const generatedPassword = generateSecurePassword();
          const avatarInitials = getAvatarInitials(name);

          await storage.createUser({
            name,
            email,
            password: generatedPassword,
            role: "rep",
            status: "onboarding",
            avatarInitials,
            managerId,
          });

          let emailSent = false;
          
          // Send welcome email if requested
          if (sendEmails) {
            try {
              const emailResult = await sendCredentialsEmail(email, name, generatedPassword);
              emailSent = emailResult.success;
            } catch (emailError) {
              console.error(`Failed to send email to ${email}:`, emailError);
            }
          }

          results.success.push({ name, email, password: generatedPassword, emailSent });
        } catch (userError: any) {
          results.failed.push({ name, email, reason: userError.message || "Failed to create user" });
        }
      }

      res.json({
        message: `Created ${results.success.length} users, ${results.failed.length} failed`,
        results,
      });
    } catch (error) {
      console.error("Bulk create users error:", error);
      res.status(500).json({ error: "Failed to bulk create users" });
    }
  });

  // Send credentials via email
  app.post("/api/send-credentials/email", async (req, res) => {
    try {
      const { email, name, password } = req.body;
      
      if (!email || !name || !password) {
        return res.status(400).json({ error: "Email, name, and password are required" });
      }

      const result = await sendCredentialsEmail(email, name, password);
      
      if (!result.success) {
        return res.status(500).json({ error: result.error || "Failed to send email" });
      }

      res.json({ success: true, message: "Credentials sent via email" });
    } catch (error) {
      console.error("Send credentials email error:", error);
      res.status(500).json({ error: "Failed to send credentials email" });
    }
  });

  // Send credentials via SMS
  app.post("/api/send-credentials/sms", async (req, res) => {
    try {
      const { phone, email, name, password } = req.body;
      
      if (!phone || !email || !name || !password) {
        return res.status(400).json({ error: "Phone, email, name, and password are required" });
      }

      const result = await sendCredentialsSMS(phone, name, email, password);
      
      if (!result.success) {
        return res.status(500).json({ error: result.error || "Failed to send SMS" });
      }

      res.json({ success: true, message: "Credentials sent via SMS" });
    } catch (error) {
      console.error("Send credentials SMS error:", error);
      res.status(500).json({ error: "Failed to send credentials SMS" });
    }
  });

  // Public certificate page - no auth required
  app.get("/api/certificate/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      const user = await storage.getUserByCertificationToken(token);
      
      if (!user || !user.certifiedAt) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      res.json({
        name: user.name,
        certifiedAt: user.certifiedAt,
        warriorAvatar: user.warriorAvatar,
        profilePhoto: user.profilePhoto,
      });
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({ error: "Failed to get certificate" });
    }
  });

  // Test certification email (admin only)
  app.post("/api/test-certification-email", async (req, res) => {
    try {
      const { email, name, managerEmail } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ error: "Email and name required" });
      }

      const result = await sendCertificationEmail(email, name, managerEmail || null);
      
      if (!result.success) {
        return res.status(500).json({ error: result.error || "Failed to send email" });
      }

      res.json({ success: true, message: `Test certification email sent to ${email}` });
    } catch (error) {
      console.error("Test certification email error:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Reset password and resend credentials
  app.post("/api/users/:userId/reset-credentials", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const requester = authResult.user;
      const { userId } = req.params;
      const { sendEmail = true } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (requester.role === "manager") {
        if (user.managerId !== requester.id) {
          return res.status(403).json({ error: "You can only reset passwords for your own team members" });
        }
      } else if (requester.role !== "admin" && requester.role !== "director") {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      // Generate new password
      const newPassword = generateSecurePassword();
      
      // Update user password in database
      await storage.updateUser(userId, { password: newPassword });
      
      let emailSent = false;
      let emailError = null;
      
      if (sendEmail && user.email) {
        try {
          const emailResult = await sendCredentialsEmail(user.email, user.name, newPassword);
          emailSent = emailResult.success;
          if (!emailResult.success) {
            emailError = emailResult.error;
          }
        } catch (e: any) {
          emailError = e.message;
        }
      }
      
      res.json({ 
        success: true, 
        message: "Password reset successfully",
        password: newPassword,
        emailSent,
        emailError,
        user: { ...user, password: undefined }
      });
    } catch (error) {
      console.error("Reset credentials error:", error);
      res.status(500).json({ error: "Failed to reset credentials" });
    }
  });

  // Get user progress summary (for managers/admins viewing rep progress)
  app.get("/api/users/:userId/progress-summary", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const progress = await storage.getUserProgress(userId);
      const attempts = await storage.getUserRoleplayAttempts(userId);
      const chapters = await storage.getAllChapters();
      const roleplays = await storage.getAllRoleplays();

      const completedChapters = progress.filter(p => p.completed === 1).length;
      const passedRoleplays = attempts.filter(a => a.passed === 1).length;
      const uniquePassedRoleplays = Array.from(new Set(attempts.filter(a => a.passed === 1).map(a => a.roleplayId))).length;
      
      const quizScores = progress.filter(p => p.quizScore != null).map(p => p.quizScore!);
      const avgQuizScore = quizScores.length > 0 
        ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) 
        : 0;

      // Certification requires 16+ unique roleplays passed (fair to reps who trained before/after roleplay changes)
      const REQUIRED_ROLEPLAYS_FOR_CERTIFICATION = 16;
      const isCertified = 
        completedChapters >= chapters.length && 
        uniquePassedRoleplays >= REQUIRED_ROLEPLAYS_FOR_CERTIFICATION && 
        avgQuizScore >= 75;

      // Generate certification token for any certified user who doesn't have one
      let certToken: string | null = user.certificationToken || null;
      if (isCertified && !user.certificationToken) {
        try {
          certToken = crypto.randomBytes(16).toString('hex');
          await storage.setCertification(userId, certToken);
        } catch (tokenError) {
          console.error('Error generating certification token:', tokenError);
        }
      }

      // Send certification email if newly certified (atomic claim to prevent duplicates)
      if (isCertified && !user.certificationEmailSentAt) {
        try {
          // Atomically claim the email send (prevents race condition duplicates)
          const claimed = await storage.markCertificationEmailSent(userId);
          if (claimed) {
            let managerEmail: string | null = null;
            if (user.managerId) {
              const manager = await storage.getUser(user.managerId);
              if (manager) {
                managerEmail = manager.email;
              }
            }
            
            const emailResult = await sendCertificationEmail(user.email, user.name, managerEmail, certToken);
            if (emailResult.success) {
              console.log(`Certification email sent to ${user.email}${managerEmail ? ` (cc: ${managerEmail})` : ''} with certificate link`);
            } else {
              console.error('Failed to send certification email:', emailResult.error);
            }
          }
        } catch (emailError) {
          console.error('Error sending certification email:', emailError);
        }
      }

      // Re-fetch user to get updated certification data
      const updatedUser = await storage.getUser(userId) || user;

      res.json({
        user: { ...updatedUser, password: undefined },
        stats: {
          chaptersCompleted: completedChapters,
          totalChapters: chapters.length,
          roleplaysPassed: uniquePassedRoleplays,
          totalRoleplays: roleplays.length,
          avgQuizScore,
          isCertified,
          certificationToken: updatedUser.certificationToken || null,
          certifiedAt: updatedUser.certifiedAt || null,
        },
        progress,
        recentAttempts: attempts.slice(0, 5),
      });
    } catch (error) {
      console.error("Get progress summary error:", error);
      res.status(500).json({ error: "Failed to get progress summary" });
    }
  });

  // Get detailed user information (roleplay attempts with recordings, quiz attempts)
  app.get("/api/users/:userId/details", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const details = await storage.getUserDetails(userId);
      
      res.json({
        ...details,
        user: { ...details.user, password: undefined },
      });
    } catch (error: any) {
      console.error("Get user details error:", error);
      if (error.message?.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to get user details" });
    }
  });

  // Chapter routes
  app.get("/api/chapters", async (req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      res.json(chapters);
    } catch (error) {
      console.error("Get chapters error:", error);
      res.status(500).json({ error: "Failed to get chapters" });
    }
  });

  app.get("/api/chapters/:id", async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.id);
      
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      res.json(chapter);
    } catch (error) {
      console.error("Get chapter error:", error);
      res.status(500).json({ error: "Failed to get chapter" });
    }
  });

  // User roleplay status - get attempts and pass status per roleplay
  app.get("/api/users/:userId/roleplay-status", async (req, res) => {
    try {
      const { userId } = req.params;
      const attempts = await storage.getUserRoleplayAttempts(userId);
      
      // Group attempts by roleplayId and calculate status
      const statusMap: Record<string, { 
        attempts: number; 
        passed: boolean; 
        permanentlyFailed: boolean;
      }> = {};
      
      for (const attempt of attempts) {
        if (!statusMap[attempt.roleplayId]) {
          statusMap[attempt.roleplayId] = { attempts: 0, passed: false, permanentlyFailed: false };
        }
        statusMap[attempt.roleplayId].attempts++;
        if (attempt.passed === 1) {
          statusMap[attempt.roleplayId].passed = true;
        }
      }
      
      // Mark as permanently failed if 3+ attempts and never passed
      for (const roleplayId of Object.keys(statusMap)) {
        const status = statusMap[roleplayId];
        if (status.attempts >= 3 && !status.passed) {
          status.permanentlyFailed = true;
        }
      }
      
      res.json(statusMap);
    } catch (error) {
      console.error("Get user roleplay status error:", error);
      res.status(500).json({ error: "Failed to get roleplay status" });
    }
  });

  // User roleplay history - get all attempts with details, recordings, and manager notes
  app.get("/api/users/:userId/roleplay-history", async (req, res) => {
    try {
      const { userId } = req.params;
      const attempts = await storage.getUserRoleplayAttempts(userId);
      const allRoleplays = await storage.getAllRoleplays();
      const coachingNotes = await storage.getCoachingNotes(userId);
      
      // Group attempts by roleplayId
      const roleplayMap: Record<string, {
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
          createdAt: Date | null;
          feedback: any;
          recordingUrl: string | null;
          notes: Array<{ id: string; content: string; createdAt: Date | null; managerId: string }>;
        }>;
        totalAttempts: number;
        hasPassed: boolean;
        remainingAttempts: number;
        permanentlyFailed: boolean;
      }> = {};
      
      for (const attempt of attempts) {
        const roleplay = allRoleplays.find(r => r.id === attempt.roleplayId);
        if (!roleplay) continue;
        
        if (!roleplayMap[attempt.roleplayId]) {
          roleplayMap[attempt.roleplayId] = {
            roleplay: {
              id: roleplay.id,
              name: roleplay.name,
              role: roleplay.role,
              difficulty: roleplay.difficulty,
              chapterId: roleplay.chapterId,
              phase: roleplay.phase,
              orderIndex: roleplay.orderIndex,
            },
            attempts: [],
            totalAttempts: 0,
            hasPassed: false,
            remainingAttempts: 3,
            permanentlyFailed: false,
          };
        }
        
        // Parse feedback to get recordingUrl
        let parsedFeedback = null;
        let recordingUrl = null;
        if (attempt.feedback) {
          try {
            parsedFeedback = typeof attempt.feedback === 'string' 
              ? JSON.parse(attempt.feedback) 
              : attempt.feedback;
            recordingUrl = parsedFeedback?.recordingUrl || null;
          } catch (e) {
            parsedFeedback = null;
          }
        }
        
        // Get coaching notes for this attempt
        const attemptNotes = coachingNotes
          .filter(note => note.roleplayAttemptId === attempt.id)
          .map(note => ({
            id: note.id,
            content: note.content,
            createdAt: note.createdAt,
            managerId: note.managerId,
          }));
        
        roleplayMap[attempt.roleplayId].attempts.push({
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed === 1,
          createdAt: attempt.createdAt,
          feedback: parsedFeedback,
          recordingUrl,
          notes: attemptNotes,
        });
        
        roleplayMap[attempt.roleplayId].totalAttempts++;
        if (attempt.passed === 1) {
          roleplayMap[attempt.roleplayId].hasPassed = true;
        }
      }
      
      // Calculate remaining attempts and permanently failed status
      for (const roleplayId of Object.keys(roleplayMap)) {
        const data = roleplayMap[roleplayId];
        data.remainingAttempts = Math.max(0, 3 - data.totalAttempts);
        if (data.totalAttempts >= 3 && !data.hasPassed) {
          data.permanentlyFailed = true;
          data.remainingAttempts = 0;
        }
        // Sort attempts by date descending (newest first)
        data.attempts.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      }
      
      res.json(roleplayMap);
    } catch (error) {
      console.error("Get user roleplay history error:", error);
      res.status(500).json({ error: "Failed to get roleplay history" });
    }
  });

  // Roleplay routes
  app.get("/api/roleplays", async (req, res) => {
    try {
      const allRoleplays = await storage.getAllRoleplays();
      const roleplays = allRoleplays.filter(rp => !HIDDEN_ROLEPLAY_IDS.has(rp.id));
      res.json(roleplays);
    } catch (error) {
      console.error("Get roleplays error:", error);
      res.status(500).json({ error: "Failed to get roleplays" });
    }
  });

  app.get("/api/roleplays/:id", async (req, res) => {
    try {
      const roleplay = await storage.getRoleplay(req.params.id);
      
      if (!roleplay) {
        return res.status(404).json({ error: "Roleplay not found" });
      }

      res.json(roleplay);
    } catch (error) {
      console.error("Get roleplay error:", error);
      res.status(500).json({ error: "Failed to get roleplay" });
    }
  });

  app.get("/api/chapters/:chapterId/roleplays", async (req, res) => {
    try {
      const allRoleplays = await storage.getRoleplaysByChapterId(req.params.chapterId);
      const roleplays = allRoleplays.filter(rp => !HIDDEN_ROLEPLAY_IDS.has(rp.id));
      res.json(roleplays);
    } catch (error) {
      console.error("Get chapter roleplays error:", error);
      res.status(500).json({ error: "Failed to get chapter roleplays" });
    }
  });

  // Generate persona avatar for a single roleplay
  app.post("/api/roleplays/:id/generate-avatar", async (req, res) => {
    try {
      const roleplay = await storage.getRoleplay(req.params.id);
      if (!roleplay) {
        return res.status(404).json({ error: "Roleplay not found" });
      }

      console.log(`Generating persona avatar for: ${roleplay.role}`);
      const stats = roleplay.stats as { resistance: number; objections: number; buy_signal: number };
      const result = await generatePersonaImage(
        roleplay.name,
        roleplay.role,
        roleplay.traits,
        roleplay.difficulty,
        stats.resistance
      );
      
      if (!result.success) {
        console.error("Avatar generation failed:", result.error);
        return res.status(500).json({ error: result.error || "Avatar generation failed" });
      }

      await storage.updateRoleplayAvatar(roleplay.id, result.imageUrl!);
      
      console.log(`Generated avatar for ${roleplay.role}: ${result.imageUrl}`);
      res.json({ success: true, imageUrl: result.imageUrl });
    } catch (error) {
      console.error("Generate roleplay avatar error:", error);
      res.status(500).json({ error: "Failed to generate avatar" });
    }
  });

  // Generate avatars for all roleplays
  app.post("/api/roleplays/generate-all-avatars", async (_req, res) => {
    try {
      const roleplays = await storage.getAllRoleplays();
      const results: { roleplayId: string; role: string; success: boolean; imageUrl?: string; error?: string }[] = [];

      for (const roleplay of roleplays) {
        // Skip if already has avatar
        if (roleplay.avatar) {
          results.push({ roleplayId: roleplay.id, role: roleplay.role, success: true, imageUrl: roleplay.avatar });
          continue;
        }

        console.log(`Generating persona avatar for: ${roleplay.role}`);
        const stats = roleplay.stats as { resistance: number; objections: number; buy_signal: number };
        const result = await generatePersonaImage(
          roleplay.name,
          roleplay.role,
          roleplay.traits,
          roleplay.difficulty,
          stats.resistance
        );
        
        if (result.success && result.imageUrl) {
          await storage.updateRoleplayAvatar(roleplay.id, result.imageUrl);
          results.push({ roleplayId: roleplay.id, role: roleplay.role, success: true, imageUrl: result.imageUrl });
        } else {
          results.push({ roleplayId: roleplay.id, role: roleplay.role, success: false, error: result.error });
        }

        // Small delay between generations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      res.json({ success: true, results });
    } catch (error) {
      console.error("Generate all roleplay avatars error:", error);
      res.status(500).json({ error: "Failed to generate avatars" });
    }
  });

  // Generate logo image
  app.post("/api/generate-logo", async (req, res) => {
    try {
      const { prompt, filename } = req.body;
      
      if (!prompt || !filename) {
        return res.status(400).json({ error: "Prompt and filename are required" });
      }

      console.log(`Generating logo: ${filename}`);
      const result = await generateLogoImage(prompt, filename);
      
      if (!result.success) {
        console.error("Logo generation failed:", result.error);
        return res.status(500).json({ error: result.error || "Logo generation failed" });
      }

      res.json({ success: true, imageUrl: result.imageUrl });
    } catch (error) {
      console.error("Generate logo error:", error);
      res.status(500).json({ error: "Failed to generate logo" });
    }
  });

  // Battlecard routes
  app.get("/api/battlecards", async (req, res) => {
    try {
      const battlecards = await storage.getAllBattlecards();
      res.json(battlecards);
    } catch (error) {
      console.error("Get battlecards error:", error);
      res.status(500).json({ error: "Failed to get battlecards" });
    }
  });

  // Generate battlecard image using Gemini
  app.post("/api/battlecards/:id/generate-image", async (req, res) => {
    try {
      const battlecard = await storage.getBattlecard(req.params.id);
      if (!battlecard) {
        return res.status(404).json({ error: "Battlecard not found" });
      }

      const { useWhen, goal, talkTrack, coachLine, battlecardNumber } = req.body;
      
      console.log(`Generating image for battlecard: ${battlecard.title}`);
      const result = await generateBattlecardImage(
        battlecardNumber || 1,
        battlecard.title,
        useWhen || battlecard.situation,
        goal || "Execute the sales technique effectively",
        battlecard.keyPoints || [],
        talkTrack || battlecard.script,
        coachLine || ""
      );
      
      if (!result.success) {
        console.error("Battlecard image generation failed:", result.error);
        return res.status(500).json({ error: result.error || "Image generation failed" });
      }

      // Update battlecard with the new image URL
      await storage.updateBattlecardImage(battlecard.id, result.imageUrl!);
      
      console.log(`Generated image for ${battlecard.title}: ${result.imageUrl}`);
      res.json({ success: true, imageUrl: result.imageUrl });
    } catch (error) {
      console.error("Generate battlecard image error:", error);
      res.status(500).json({ error: "Failed to generate battlecard image" });
    }
  });

  // Seed all 20 battlecards with detailed content
  app.post("/api/battlecards/seed-all", async (req, res) => {
    try {
      // Clear existing battlecards
      await storage.deleteAllBattlecards();
      
      const battlecardsData = [
        {
          phase: "Opening",
          title: "Four Pillars Quick-Check (Daily Standard)",
          situation: "Start of day, before first door, or after a rough streak",
          script: "Timeliness: be where you should be. Attitude: mindset shapes reality. Practice: skill comes from repetition. Persistence: more doors = more wins.",
          keyPoints: ["Timeliness - be where you should be", "Attitude - mindset shapes reality", "Practice - skill comes from repetition", "Persistence - more doors = more wins"],
          type: "tip",
          image: "",
          useWhen: "Start of day, before first door, or after a rough streak",
          goal: "Reset execution before you 'talk yourself out of winning'",
          coachLine: "Win the next 60 seconds. Then the next."
        },
        {
          phase: "Opening",
          title: "First 5 Seconds: Look Professional, Feel Safe",
          situation: "Every first approach at a door",
          script: "Step back, relaxed shoulders, smile, eye contact, calm voice. Knock firmly, step back, do not stare through windows.",
          keyPoints: ["Step back 3 feet from door", "Relaxed shoulders, genuine smile", "Eye contact, calm voice", "Avoid leaning on frame or fidgeting", "Never stare through windows"],
          type: "tip",
          image: "",
          useWhen: "Every first approach",
          goal: "Lower guard, earn the right to talk",
          coachLine: "Your first impression is made in 5 seconds. Make it count."
        },
        {
          phase: "Opening",
          title: "Door Intro (Simple, Neighbor-Based)",
          situation: "Door opens; you need a clean start",
          script: "We take care of a lot of lawns in this area... noticed weeds/thin spots... wanted to show you what we're doing for your neighbors...",
          keyPoints: ["Who you are (name + company)", "Mention their lawn + neighbors", "Say 'Not here to twist your arm'", "Invite to quick look"],
          type: "script",
          image: "",
          useWhen: "Door opens; you need a clean start",
          goal: "Sound local, calm, and relevant (not salesy)",
          coachLine: "Neighbors validate. Reference them early."
        },
        {
          phase: "Opening",
          title: "30-Second Gecko Green Story (Elevator Pitch)",
          situation: "Who are you? What do you guys do?",
          script: "We're Gecko Green, a North Texas lawn care company. We run a 10-visit program with free service calls in between. If I show you what's starting right here, you'll know in 30 seconds if it applies.",
          keyPoints: ["North Texas focus", "10-visit program", "Free service calls", "Results-driven commitment"],
          type: "script",
          image: "",
          useWhen: "'Who are you?' / 'What do you guys do?'",
          goal: "Hit the core differentiators fast",
          coachLine: "Tell the story in 30 seconds or less."
        },
        {
          phase: "Opening",
          title: "Brush-Offs: Turn a 'No' into a 'Maybe'",
          situation: "Not interested / We're fine / Busy",
          script: "Totally understand—I'll be quick. Let me show you what we're doing for your neighbors... Step out here with me for 10 seconds.",
          keyPoints: ["Stay respectful", "Keep it light", "Move to Turn & Burn", "Ask them to step outside"],
          type: "objection",
          image: "",
          useWhen: "'Not interested' / 'We're fine' / 'Busy'",
          goal: "Stay respectful, keep it light, move to Turn & Burn",
          coachLine: "Every 'no' is just 'not yet' in disguise."
        },
        {
          phase: "Turn & Burn",
          title: "Turn & Burn (Door → Lawn Transition)",
          situation: "Conversation stalling at the door",
          script: "Step out here with me... Let me walk you through... Let me point out what I'm seeing here...",
          keyPoints: ["Stop debating at the door", "Get them looking at something real", "Comfortable pace, light conversation", "Stop at visible weed problems", "Don't rush or give long speeches"],
          type: "script",
          image: "",
          useWhen: "You feel the conversation stalling at the door",
          goal: "Stop debating at the door; get them looking at something real",
          coachLine: "The lawn sells itself. Get them on it."
        },
        {
          phase: "Lawn Walk",
          title: "On-Lawn: The 4-Step Diagnosis",
          situation: "You're on the lawn and need to sound like an advisor",
          script: "Do you see this? [Observe] This is happening because... [Explain] Our program handles exactly this... [Connect] Here's what to expect... [Set Expectations]",
          keyPoints: ["Observe & Confirm: 'Do you see...?'", "Explain the Why", "Connect to Program", "Set Expectations & Partnership"],
          type: "script",
          image: "",
          useWhen: "You're on the lawn and need to sound like an advisor",
          goal: "Show 1–2 real issues, connect to program, set expectations",
          coachLine: "Diagnose like a doctor. Prescribe like an expert."
        },
        {
          phase: "Lawn Walk",
          title: "Weeds Conversation: Control vs Perfection",
          situation: "Why do I still have weeds? I want perfect.",
          script: "We control the weed population and thicken your grass so weeds have less room to come back. The seed bank means new weeds can appear—our job is reduction and control.",
          keyPoints: ["Focus on control and reduction", "Explain the seed bank concept", "New weeds can appear", "Thickening grass reduces weed space"],
          type: "objection",
          image: "",
          useWhen: "'Why do I still have weeds?' / 'I want perfect'",
          goal: "Reset expectations without losing confidence",
          coachLine: "Control, not perfection. Set the right expectation."
        },
        {
          phase: "Lawn Walk",
          title: "Thickening the Lawn (Thinness/Color)",
          situation: "My lawn is thin / not green enough",
          script: "We'll improve color and thickness through fertilizer, weed control, and aeration. For large bare-dirt areas, we'll be straight about what needs plugs or sod.",
          keyPoints: ["Assess grass type + shade", "Execute fertilizer + weed control", "Include aeration in plan", "Be honest about sod/plug needs"],
          type: "script",
          image: "",
          useWhen: "'My lawn is thin' / 'Not green enough'",
          goal: "Be honest, show a realistic path, avoid overpromising",
          coachLine: "Honesty builds trust. Set realistic expectations."
        },
        {
          phase: "Pricing",
          title: "10-Visit Program Overview (90-Second Story)",
          situation: "What do you actually do?",
          script: "It's a 10-visit lawn program spread across the seasons, with free service calls whenever you need them. It's a year-round plan, not one spray-and-pray visit.",
          keyPoints: ["10-visit lawn program", "Free service calls included", "Seasonally spaced visits", "Year-round commitment"],
          type: "script",
          image: "",
          useWhen: "'What do you actually do?'",
          goal: "Tell a story (not a list); make it feel systematic",
          coachLine: "It's a program, not a one-time spray."
        },
        {
          phase: "Pricing",
          title: "Partnership Agreement (Our Plays vs Your Plays)",
          situation: "What do I have to do? Will you handle everything?",
          script: "We treat and guide. You water and mow. That's how we win together. Our part: treatments, timing, products, aeration. Your part: watering, mowing, traffic, shade management.",
          keyPoints: ["Our part: treatments, timing, products, aeration", "Homeowner part: watering, mowing, traffic, shade", "Collaborative approach", "Clear roles for success"],
          type: "script",
          image: "",
          useWhen: "'What do I have to do?' or 'Will you handle everything?'",
          goal: "Collaborative, clear roles",
          coachLine: "Partnership wins. Solo efforts fail."
        },
        {
          phase: "Objection Handling",
          title: "B-P-D-C (Universal Objection Compass)",
          situation: "Any pushback shows up (door, lawn, price, prepay)",
          script: "Buffer: 'I understand...' Probe: 'What worries you?' Discover: find the real concern. Close: tailored solution; move forward.",
          keyPoints: ["Buffer: acknowledge + empathy", "Probe: open-ended question", "Discover: find the real concern", "Close: tailored solution"],
          type: "tip",
          image: "",
          useWhen: "Any pushback shows up (door, lawn, price, prepay)",
          goal: "Guide, not argue",
          coachLine: "Buffer → Probe → Discover → Close. Every time."
        },
        {
          phase: "Objection Handling",
          title: "Objection: 'Not Interested'",
          situation: "Dismissal without consideration",
          script: "Totally understand. Is anything about the lawn not meeting expectations? Open to a quick 5-minute assessment?",
          keyPoints: ["Buffer: 'Totally understand'", "Probe: 'Is anything not meeting expectations?'", "Close: Offer quick assessment"],
          type: "objection",
          image: "",
          useWhen: "Dismissal without consideration",
          goal: "Reduce friction, isolate one specific issue",
          coachLine: "'Not interested' means 'tell me more differently.'"
        },
        {
          phase: "Objection Handling",
          title: "Objection: 'I Do It Myself'",
          situation: "DIY pride / control",
          script: "That's great—it shows you care. What's working well and what would you improve? Can I show you one thing I'd change first?",
          keyPoints: ["Respect: 'That shows you care'", "Probe: 'What would you improve?'", "Upgrade: specialized program beyond standard", "Close: 'Can I show you one thing?'"],
          type: "objection",
          image: "",
          useWhen: "DIY pride / control",
          goal: "Respect identity; position Gecko as an upgrade, not replacement",
          coachLine: "Validate their work. Then show the gap."
        },
        {
          phase: "Objection Handling",
          title: "Objection: 'We Already Have a Company'",
          situation: "Loyal to existing provider",
          script: "Totally fair—sounds like you're covered. Are they addressing this issue right here, or is it still showing up? If I can point out one improvement, would you be open to comparing?",
          keyPoints: ["Buffer: 'Sounds like you're covered'", "Probe: 'Are they addressing this issue?'", "Close: 'Would you be open to comparing?'"],
          type: "objection",
          image: "",
          useWhen: "Loyal to existing provider",
          goal: "Remove replacement fear; isolate a gap",
          coachLine: "Find the gap. Exploit it gently."
        },
        {
          phase: "Objection Handling",
          title: "Objection: 'Let Me Think About It'",
          situation: "Delay request",
          script: "Of course. What part do you want to think through—results, timing, or price? If we solve that, are you good to start?",
          keyPoints: ["Buffer: 'Of course'", "Probe: 'What part—results, timing, or price?'", "Discover: label the real blocker", "Close: 'If we solve that, are you good?'"],
          type: "objection",
          image: "",
          useWhen: "Delay request",
          goal: "Convert 'delay' into a specific concern you can solve now",
          coachLine: "'Think about it' means 'convince me now.'"
        },
        {
          phase: "Objection Handling",
          title: "Objection: 'I Need to Talk to My Spouse'",
          situation: "Partner consultation needed",
          script: "100%—makes sense. What do they typically care most about—budget or results? Want me to summarize it so you can repeat it exactly?",
          keyPoints: ["Buffer: '100%—makes sense'", "Probe: 'What do they care about—budget or results?'", "Close Option 1: 'Summarize for you to repeat'", "Close Option 2: 'When can both of you meet?'"],
          type: "objection",
          image: "",
          useWhen: "Partner consultation needed",
          goal: "Get alignment without losing momentum",
          coachLine: "Arm them to sell for you."
        },
        {
          phase: "Close",
          title: "Buying Signals ('Green Lights')",
          situation: "You see curiosity/lean-in",
          script: "When you see green lights, close. Verbal: 'How much is it?' 'When can you start?' 'Does that include...?' Non-verbal: nodding, stepping closer, relaxing posture.",
          keyPoints: ["Verbal signals: 'How much?' 'When can you start?'", "Non-verbal: nodding, stepping closer", "Relaxing posture means interest", "Transition to closing flow immediately"],
          type: "tip",
          image: "",
          useWhen: "You see curiosity/lean-in",
          goal: "Transition into closing flow immediately",
          coachLine: "Green light = stop selling, start closing."
        },
        {
          phase: "Close",
          title: "The Closing Flow (Value → Price → Close)",
          situation: "You've diagnosed 1–2 issues and they're engaged",
          script: "We'll handle weeds and thicken the grass... Normally $X, but today it's $Y for the first one... Does that sound fair? Let's get it started.",
          keyPoints: ["Recap value first", "State price confidently", "Assume the sale", "Ask 'Does that sound fair?'"],
          type: "script",
          image: "",
          useWhen: "You've diagnosed 1–2 issues and they're engaged",
          goal: "Close cleanly without rambling",
          coachLine: "Value → Price → Close. Keep it tight."
        },
        {
          phase: "Close",
          title: "Payment + Prepay (Default) + Hesitation",
          situation: "It's time to take payment",
          script: "Most neighbors do prepay to save 5% and get it done for the year. Fully refundable if you move or change your mind. Want to knock that out, or do pay-as-you-go?",
          keyPoints: ["Prepay first (default): done for year, save 5%", "Autopay backup: pay as you go", "Present: 'Most neighbors do prepay'", "Protect: 'Fully refundable'", "Prompt: 'Prepay or pay-as-you-go?'"],
          type: "script",
          image: "",
          useWhen: "It's time to take payment",
          goal: "Present prepay confidently; protect with refund language; prompt decision",
          coachLine: "Prepay is the default. Present it that way."
        }
      ];

      const createdBattlecards = [];
      for (const bc of battlecardsData) {
        const created = await storage.createBattlecard({
          phase: bc.phase,
          title: bc.title,
          situation: bc.situation,
          script: bc.script,
          keyPoints: bc.keyPoints,
          type: bc.type,
          image: bc.image
        });
        createdBattlecards.push({ ...created, useWhen: bc.useWhen, goal: bc.goal, coachLine: bc.coachLine });
      }

      console.log(`Created ${createdBattlecards.length} battlecards`);
      res.json({ success: true, count: createdBattlecards.length, battlecards: createdBattlecards });
    } catch (error) {
      console.error("Seed battlecards error:", error);
      res.status(500).json({ error: "Failed to seed battlecards" });
    }
  });

  // Generate all battlecard images
  app.post("/api/battlecards/generate-all-images", async (req, res) => {
    try {
      const battlecards = await storage.getAllBattlecards();
      const results = [];
      
      const battlecardMeta: Record<string, { useWhen: string; goal: string; coachLine: string }> = {
        "Four Pillars Quick-Check (Daily Standard)": { useWhen: "Start of day, before first door, or after a rough streak", goal: "Reset execution before you 'talk yourself out of winning'", coachLine: "Win the next 60 seconds. Then the next." },
        "First 5 Seconds: Look Professional, Feel Safe": { useWhen: "Every first approach", goal: "Lower guard, earn the right to talk", coachLine: "Your first impression is made in 5 seconds." },
        "Door Intro (Simple, Neighbor-Based)": { useWhen: "Door opens; you need a clean start", goal: "Sound local, calm, and relevant", coachLine: "Neighbors validate. Reference them early." },
        "30-Second Gecko Green Story (Elevator Pitch)": { useWhen: "'Who are you?' / 'What do you guys do?'", goal: "Hit the core differentiators fast", coachLine: "Tell the story in 30 seconds or less." },
        "Brush-Offs: Turn a 'No' into a 'Maybe'": { useWhen: "'Not interested' / 'We're fine' / 'Busy'", goal: "Stay respectful, keep it light, move to Turn & Burn", coachLine: "Every 'no' is just 'not yet' in disguise." },
        "Turn & Burn (Door → Lawn Transition)": { useWhen: "Conversation stalling at the door", goal: "Get them looking at something real", coachLine: "The lawn sells itself. Get them on it." },
        "On-Lawn: The 4-Step Diagnosis": { useWhen: "You're on the lawn", goal: "Show 1–2 real issues, connect to program", coachLine: "Diagnose like a doctor. Prescribe like an expert." },
        "Weeds Conversation: Control vs Perfection": { useWhen: "'Why do I still have weeds?'", goal: "Reset expectations without losing confidence", coachLine: "Control, not perfection." },
        "Thickening the Lawn (Thinness/Color)": { useWhen: "'My lawn is thin' / 'Not green enough'", goal: "Be honest, avoid overpromising", coachLine: "Honesty builds trust." },
        "10-Visit Program Overview (90-Second Story)": { useWhen: "'What do you actually do?'", goal: "Tell a story, make it feel systematic", coachLine: "It's a program, not a one-time spray." },
        "Partnership Agreement (Our Plays vs Your Plays)": { useWhen: "'What do I have to do?'", goal: "Collaborative, clear roles", coachLine: "Partnership wins. Solo efforts fail." },
        "B-P-D-C (Universal Objection Compass)": { useWhen: "Any pushback shows up", goal: "Guide, not argue", coachLine: "Buffer → Probe → Discover → Close." },
        "Objection: 'Not Interested'": { useWhen: "Dismissal without consideration", goal: "Reduce friction, isolate one issue", coachLine: "'Not interested' means 'tell me more differently.'" },
        "Objection: 'I Do It Myself'": { useWhen: "DIY pride / control", goal: "Respect identity; position as upgrade", coachLine: "Validate their work. Then show the gap." },
        "Objection: 'We Already Have a Company'": { useWhen: "Loyal to existing provider", goal: "Remove replacement fear; isolate a gap", coachLine: "Find the gap. Exploit it gently." },
        "Objection: 'Let Me Think About It'": { useWhen: "Delay request", goal: "Convert 'delay' into specific concern", coachLine: "'Think about it' means 'convince me now.'" },
        "Objection: 'I Need to Talk to My Spouse'": { useWhen: "Partner consultation needed", goal: "Get alignment without losing momentum", coachLine: "Arm them to sell for you." },
        "Buying Signals ('Green Lights')": { useWhen: "You see curiosity/lean-in", goal: "Transition into closing flow", coachLine: "Green light = stop selling, start closing." },
        "The Closing Flow (Value → Price → Close)": { useWhen: "They're engaged", goal: "Close cleanly without rambling", coachLine: "Value → Price → Close. Keep it tight." },
        "Payment + Prepay (Default) + Hesitation": { useWhen: "Time to take payment", goal: "Present prepay confidently", coachLine: "Prepay is the default. Present it that way." }
      };

      for (let i = 0; i < battlecards.length; i++) {
        const bc = battlecards[i];
        const meta = battlecardMeta[bc.title] || { useWhen: bc.situation, goal: "Execute effectively", coachLine: "Master this technique." };
        
        console.log(`Generating image ${i + 1}/${battlecards.length}: ${bc.title}`);
        
        try {
          const result = await generateBattlecardImage(
            i + 1,
            bc.title,
            meta.useWhen,
            meta.goal,
            bc.keyPoints || [],
            bc.script,
            meta.coachLine
          );

          if (result.success) {
            await storage.updateBattlecardImage(bc.id, result.imageUrl!);
            results.push({ id: bc.id, title: bc.title, success: true, imageUrl: result.imageUrl });
          } else {
            results.push({ id: bc.id, title: bc.title, success: false, error: result.error });
          }
        } catch (err: any) {
          results.push({ id: bc.id, title: bc.title, success: false, error: err.message });
        }

        // Small delay between API calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const successCount = results.filter(r => r.success).length;
      console.log(`Generated ${successCount}/${battlecards.length} battlecard images`);
      res.json({ success: true, generated: successCount, total: battlecards.length, results });
    } catch (error) {
      console.error("Generate all battlecard images error:", error);
      res.status(500).json({ error: "Failed to generate battlecard images" });
    }
  });

  // Generate Arena logos (dark and light mode)
  app.post("/api/generate-arena-logos", async (req, res) => {
    try {
      console.log("Generating Arena AI logos...");
      
      // Generate dark mode logo
      console.log("Generating dark mode logo...");
      const darkResult = await generateArenaLogo("dark");
      
      // Small delay between calls
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate light mode logo
      console.log("Generating light mode logo...");
      const lightResult = await generateArenaLogo("light");
      
      res.json({
        success: true,
        dark: darkResult,
        light: lightResult
      });
    } catch (error) {
      console.error("Generate Arena logos error:", error);
      res.status(500).json({ error: "Failed to generate logos" });
    }
  });

  // Buyer Personas routes
  app.get("/api/personas", async (req, res) => {
    try {
      const personas = await storage.getAllBuyerPersonas();
      res.json(personas);
    } catch (error) {
      console.error("Get personas error:", error);
      res.status(500).json({ error: "Failed to get personas" });
    }
  });

  app.get("/api/personas/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug || typeof slug !== "string" || slug.trim() === "") {
        return res.status(400).json({ error: "Invalid persona slug" });
      }
      const persona = await storage.getBuyerPersonaBySlug(slug);
      if (!persona) {
        return res.status(404).json({ error: "Persona not found" });
      }
      res.json(persona);
    } catch (error) {
      console.error("Get persona error:", error);
      res.status(500).json({ error: "Failed to get persona" });
    }
  });

  // Expert marketplace routes
  app.get("/api/experts", async (req, res) => {
    try {
      const experts = await storage.getAllExperts();
      res.json(experts);
    } catch (error) {
      console.error("Get experts error:", error);
      res.status(500).json({ error: "Failed to get experts" });
    }
  });

  app.get("/api/experts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug || typeof slug !== "string" || slug.trim() === "") {
        return res.status(400).json({ error: "Invalid expert slug" });
      }
      const expert = await storage.getExpertBySlug(slug);
      if (!expert) {
        return res.status(404).json({ error: "Expert not found" });
      }
      res.json(expert);
    } catch (error) {
      console.error("Get expert error:", error);
      res.status(500).json({ error: "Failed to get expert" });
    }
  });

  // Victory Playbook routes
  app.get("/api/playbook/stories", async (req, res) => {
    try {
      const stories = await storage.getComicStoriesWithPanels();
      res.json(stories);
    } catch (error) {
      console.error("Get playbook stories error:", error);
      res.status(500).json({ error: "Failed to get playbook stories" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      console.error("Get resources error:", error);
      res.status(500).json({ error: "Failed to get resources" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      console.error("Get user progress error:", error);
      res.status(500).json({ error: "Failed to get user progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      
      // Check if progress already exists for this user and chapter
      const existing = await storage.getUserProgressByChapter(
        validatedData.userId,
        validatedData.chapterId!
      );
      
      if (existing) {
        // Update existing progress
        const updated = await storage.updateUserProgress(existing.id, validatedData);
        return res.json(updated);
      }
      
      const progress = await storage.createUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create progress error:", error);
      res.status(500).json({ error: "Failed to create progress" });
    }
  });

  // Slide progress tracking
  app.post("/api/progress/slide", async (req, res) => {
    try {
      const { userId, chapterId, currentSlide, totalSlides } = req.body;
      
      if (!userId || !chapterId || currentSlide === undefined || !totalSlides) {
        return res.status(400).json({ error: "userId, chapterId, currentSlide, and totalSlides are required" });
      }
      
      const progress = await storage.updateSlideProgress(userId, chapterId, currentSlide, totalSlides);
      res.json(progress);
    } catch (error) {
      console.error("Update slide progress error:", error);
      res.status(500).json({ error: "Failed to update slide progress" });
    }
  });

  // Roleplay attempt routes
  app.get("/api/users/:userId/attempts", async (req, res) => {
    try {
      const attempts = await storage.getUserRoleplayAttempts(req.params.userId);
      res.json(attempts);
    } catch (error) {
      console.error("Get user attempts error:", error);
      res.status(500).json({ error: "Failed to get user attempts" });
    }
  });

  app.post("/api/attempts", async (req, res) => {
    try {
      const validatedData = insertRoleplayAttemptSchema.parse(req.body);
      
      // Check 3-attempt limit before creating new attempt
      const existingAttempts = await storage.getUserRoleplayAttempts(validatedData.userId);
      const attemptsForThisRoleplay = existingAttempts.filter(a => a.roleplayId === validatedData.roleplayId);
      const hasPassed = attemptsForThisRoleplay.some(a => a.passed === 1);
      
      if (attemptsForThisRoleplay.length >= 3 && !hasPassed) {
        return res.status(403).json({ 
          error: "Maximum attempts reached", 
          message: "You have used all 3 attempts for this roleplay and did not pass. This roleplay is now locked.",
          locked: true
        });
      }
      
      // If already passed, allow unlimited practice (optional - remove if you want to lock after passing too)
      if (hasPassed) {
        return res.status(403).json({ 
          error: "Roleplay already passed", 
          message: "You have already passed this roleplay. Move on to the next one!",
          passed: true
        });
      }
      
      const attempt = await storage.createRoleplayAttempt(validatedData);
      res.json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create attempt error:", error);
      res.status(500).json({ error: "Failed to create attempt" });
    }
  });

  // AI Roleplay session routes
  app.post("/api/roleplay-session/start", async (req, res) => {
    try {
      const { roleplayId, userId } = req.body;
      
      if (!roleplayId || !userId) {
        return res.status(400).json({ error: "roleplayId and userId required" });
      }

      // Check 3-attempt limit before starting session
      const existingAttempts = await storage.getUserRoleplayAttempts(userId);
      const attemptsForThisRoleplay = existingAttempts.filter(a => a.roleplayId === roleplayId);
      const hasPassed = attemptsForThisRoleplay.some(a => a.passed === 1);
      
      if (attemptsForThisRoleplay.length >= 3 && !hasPassed) {
        return res.status(403).json({ 
          error: "Maximum attempts reached", 
          message: "You have used all 3 attempts for this roleplay and did not pass. This roleplay is now locked.",
          locked: true
        });
      }
      
      if (hasPassed) {
        return res.status(403).json({ 
          error: "Roleplay already passed", 
          message: "You have already passed this roleplay. Move on to the next one!",
          passed: true
        });
      }

      const roleplay = await storage.getRoleplay(roleplayId);
      if (!roleplay) {
        return res.status(404).json({ error: "Roleplay not found" });
      }

      const scenario: RoleplayScenario = {
        name: roleplay.name,
        role: roleplay.role,
        description: roleplay.description,
        traits: roleplay.traits,
        difficulty: roleplay.difficulty,
        stats: roleplay.stats as { buy_signal: number; objections: number; resistance: number },
      };

      const openingMessage = await startRoleplayConversation(scenario);
      const sessionId = `${userId}-${roleplayId}-${Date.now()}`;
      
      roleplaySessions.set(sessionId, {
        scenario,
        history: [{ role: "model", content: openingMessage }],
      });

      res.json({ 
        sessionId, 
        message: openingMessage,
        scenario: { name: scenario.name, role: scenario.role, difficulty: scenario.difficulty }
      });
    } catch (error) {
      console.error("Start roleplay session error:", error);
      res.status(500).json({ error: "Failed to start roleplay session" });
    }
  });

  app.post("/api/roleplay-session/message", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: "sessionId and message required" });
      }

      const session = roleplaySessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found or expired" });
      }

      session.history.push({ role: "user", content: message });
      
      const response = await continueRoleplayConversation(
        session.scenario,
        session.history,
        message
      );
      
      session.history.push({ role: "model", content: response });

      res.json({ 
        message: response,
        turnCount: Math.floor(session.history.length / 2)
      });
    } catch (error) {
      console.error("Roleplay message error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  app.post("/api/roleplay-session/end", async (req, res) => {
    try {
      const { sessionId, userId, roleplayId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ error: "sessionId required" });
      }

      const session = roleplaySessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found or expired" });
      }

      const feedback = await evaluateRoleplay(session.scenario, session.history);
      
      if (userId && roleplayId) {
        await storage.createRoleplayAttempt({
          userId,
          roleplayId,
          score: feedback.overallScore,
          feedback: JSON.stringify(feedback),
        });
      }
      
      roleplaySessions.delete(sessionId);

      res.json({ 
        feedback,
        transcript: session.history
      });
    } catch (error) {
      console.error("End roleplay session error:", error);
      res.status(500).json({ error: "Failed to end roleplay session" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/:chapterId/slides", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const results = await db.selectDistinct({ slideIndex: quizQuestions.slideIndex })
        .from(quizQuestions)
        .where(eq(quizQuestions.chapterId, chapterId));
      
      res.json({ slides: results.map(r => r.slideIndex) });
    } catch (error) {
      console.error("Get quiz slides error:", error);
      res.status(500).json({ error: "Failed to get quiz slides" });
    }
  });

  app.get("/api/quiz/:chapterId/slide/:slideIndex", async (req, res) => {
    try {
      const { chapterId, slideIndex } = req.params;
      const { content } = req.query;
      
      const questions = await getOrGenerateQuizForSlide(
        chapterId,
        parseInt(slideIndex),
        (content as string) || ""
      );
      
      res.json({ questions });
    } catch (error) {
      console.error("Get quiz error:", error);
      res.status(500).json({ error: "Failed to get quiz questions" });
    }
  });

  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { userId, chapterId, questionId, selectedAnswer } = req.body;
      
      if (!userId || !chapterId || !questionId || selectedAnswer === undefined) {
        return res.status(400).json({ error: "userId, chapterId, questionId, and selectedAnswer required" });
      }

      const result = await submitQuizAnswer(userId, chapterId, questionId, selectedAnswer);
      res.json(result);
    } catch (error) {
      console.error("Submit quiz error:", error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  app.get("/api/quiz/:chapterId/questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestionsByChapter(req.params.chapterId);
      res.json(questions);
    } catch (error) {
      console.error("Get chapter quiz error:", error);
      res.status(500).json({ error: "Failed to get quiz questions" });
    }
  });

  app.get("/api/users/:userId/quiz-score/:chapterId", async (req, res) => {
    try {
      const { userId, chapterId } = req.params;
      const score = await storage.getUserQuizScore(userId, chapterId);
      res.json(score);
    } catch (error) {
      console.error("Get quiz score error:", error);
      res.status(500).json({ error: "Failed to get quiz score" });
    }
  });

  app.get("/api/users/:userId/quiz-review", async (req, res) => {
    try {
      const { userId } = req.params;

      const authResult = await getAuthenticatedUser(req);
      if (!authResult || authResult.error) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const authUser = authResult.user;
      if (authUser.id !== userId && authUser.role !== "admin" && authUser.role !== "director" && authUser.role !== "manager") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const chapters = await storage.getAllChapters();
      const allAttempts = await storage.getAllUserQuizAttempts(userId);

      const attemptsByQuestion = new Map<string, number>();
      for (const a of allAttempts) {
        const existing = attemptsByQuestion.get(a.questionId);
        if (existing === undefined || a.isCorrect > existing) {
          attemptsByQuestion.set(a.questionId, a.isCorrect);
        }
      }

      const chapterQuizData = await Promise.all(
        chapters.map(async (chapter) => {
          const questions = await storage.getQuizQuestionsByChapter(chapter.id);

          let correct = 0;
          let incorrect = 0;
          let unanswered = 0;

          const questionStatuses = questions.map((q) => {
            const bestResult = attemptsByQuestion.get(q.id);
            let status: "unanswered" | "correct" | "incorrect";
            if (bestResult === undefined) {
              status = "unanswered";
              unanswered++;
            } else if (bestResult === 1) {
              status = "correct";
              correct++;
            } else {
              status = "incorrect";
              incorrect++;
            }

            return {
              questionId: q.id,
              slideIndex: q.slideIndex,
              question: q.question,
              status,
            };
          });

          const scorePercent = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

          return {
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            chapterOrder: chapter.orderIndex ?? 0,
            totalQuestions: questions.length,
            correct,
            incorrect,
            unanswered,
            scorePercent,
            questions: questionStatuses,
          };
        })
      );

      chapterQuizData.sort((a, b) => a.chapterOrder - b.chapterOrder);

      const totalQuestions = chapterQuizData.reduce((sum, c) => sum + c.totalQuestions, 0);
      const totalCorrect = chapterQuizData.reduce((sum, c) => sum + c.correct, 0);
      const overallPercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      res.json({
        overallScore: overallPercent,
        totalCorrect,
        totalQuestions,
        meetsThreshold: overallPercent >= 75,
        chapters: chapterQuizData,
      });
    } catch (error) {
      console.error("Get quiz review error:", error);
      res.status(500).json({ error: "Failed to get quiz review data" });
    }
  });

  app.post("/api/quiz/from-pdf", async (req, res) => {
    try {
      const { chapterId, pageNumber } = req.body;
      
      if (!chapterId || !pageNumber) {
        return res.status(400).json({ error: "chapterId and pageNumber required" });
      }

      const chapter = await storage.getChapter(chapterId);
      if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
      }

      const slides = chapter.slides || [];
      const slideIndex = Math.min(Math.floor(pageNumber / 5), slides.length - 1);
      
      const contentSlides = slides
        .slice(Math.max(0, slideIndex - 2), slideIndex + 1)
        .filter((s: any) => s.type === "content");
      
      if (contentSlides.length === 0) {
        return res.json({ questions: [], message: "No content slides found for this section" });
      }

      const content = contentSlides.map((s: any) => {
        let text = s.title || "";
        if (s.content) text += "\n" + s.content;
        if (s.bullets) text += "\n" + s.bullets.join("\n");
        return text;
      }).join("\n\n");
      
      if (!content || content.trim().length < 20) {
        return res.json({ questions: [], message: "Not enough content for quiz" });
      }

      const questions = await getOrGenerateQuizForSlide(chapterId, pageNumber, content);
      
      res.json({ 
        questions,
        totalSlides: slides.length
      });
    } catch (error) {
      console.error("Quiz generation error:", error);
      res.status(500).json({ error: "Failed to generate quiz" });
    }
  });

  app.get("/api/pdf/pages/:chapterId", async (req, res) => {
    try {
      const chapter = await storage.getChapter(req.params.chapterId);
      
      if (!chapter || !chapter.pdfUrl) {
        return res.status(404).json({ error: "Chapter or PDF not found" });
      }

      const slides = chapter.slides || [];
      
      res.json({ 
        totalPages: slides.length,
        pdfUrl: chapter.pdfUrl
      });
    } catch (error) {
      console.error("Get PDF pages error:", error);
      res.status(500).json({ error: "Failed to get PDF info" });
    }
  });

  // VAPI Voice Roleplay Routes
  
  // Generate JWT token for VAPI Web SDK (public scope - only allows web calls)
  app.get("/api/vapi/token", async (_req, res) => {
    try {
      const privateKey = process.env.VAPI_API_KEY;
      const orgId = process.env.VAPI_ORG_ID;
      
      if (!privateKey || !orgId) {
        return res.status(500).json({ error: "VAPI credentials not configured" });
      }

      const payload = {
        orgId: orgId,
        token: {
          tag: "public",
          restrictions: {
            enabled: true,
            allowTransientAssistant: true
          }
        }
      };

      const token = jwt.sign(payload, privateKey, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      console.error("Generate VAPI token error:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  });

  app.get("/api/vapi/configs", async (_req, res) => {
    try {
      // Get roleplays from database and convert to VAPI configs
      const dbRoleplays = await storage.getAllRoleplays();
      const vapiConfigs = dbRoleplays.map(rp => convertRoleplayToVapiConfig({
        id: rp.id,
        name: rp.name,
        role: rp.role,
        description: rp.description,
        difficulty: rp.difficulty,
        phase: rp.phase || undefined,
        placement: rp.placement || undefined,
        passCriteria: rp.passCriteria || undefined,
        failConditions: rp.failConditions || undefined,
        winningResponse: rp.winningResponse || undefined,
        losingResponse: rp.losingResponse || undefined,
        buySignal: rp.stats?.buy_signal,
        objections: rp.stats?.objections,
        resistance: rp.stats?.resistance,
        traits: rp.traits
      }));
      res.json(vapiConfigs);
    } catch (error) {
      console.error("Get VAPI configs error:", error);
      res.status(500).json({ error: "Failed to get roleplay configs" });
    }
  });

  app.get("/api/vapi/config/:roleplayId", async (req, res) => {
    try {
      // First try database
      const dbRoleplay = await storage.getRoleplay(req.params.roleplayId);
      if (dbRoleplay) {
        const config = convertRoleplayToVapiConfig({
          id: dbRoleplay.id,
          name: dbRoleplay.name,
          role: dbRoleplay.role,
          description: dbRoleplay.description,
          difficulty: dbRoleplay.difficulty,
          phase: dbRoleplay.phase || undefined,
          placement: dbRoleplay.placement || undefined,
          passCriteria: dbRoleplay.passCriteria || undefined,
          failConditions: dbRoleplay.failConditions || undefined,
          winningResponse: dbRoleplay.winningResponse || undefined,
          losingResponse: dbRoleplay.losingResponse || undefined,
          buySignal: dbRoleplay.stats?.buy_signal,
          objections: dbRoleplay.stats?.objections,
          resistance: dbRoleplay.stats?.resistance,
          traits: dbRoleplay.traits
        });
        res.json(config);
        return;
      }

      // Fallback to hardcoded configs
      const config = getVapiRoleplayConfig(req.params.roleplayId);
      if (!config) {
        return res.status(404).json({ error: "Roleplay config not found" });
      }
      res.json(config);
    } catch (error) {
      console.error("Get VAPI config error:", error);
      res.status(500).json({ error: "Failed to get roleplay config" });
    }
  });

  app.post("/api/vapi/start-call", async (req, res) => {
    try {
      const { roleplayId, userId } = req.body;
      if (!roleplayId) {
        return res.status(400).json({ error: "roleplayId is required" });
      }

      // Check 3-attempt limit before starting voice call
      if (userId) {
        const existingAttempts = await storage.getUserRoleplayAttempts(userId);
        const attemptsForThisRoleplay = existingAttempts.filter(a => a.roleplayId === roleplayId);
        const hasPassed = attemptsForThisRoleplay.some(a => a.passed === 1);
        
        if (attemptsForThisRoleplay.length >= 3 && !hasPassed) {
          return res.status(403).json({ 
            error: "Maximum attempts reached", 
            message: "You have used all 3 attempts for this roleplay and did not pass. This roleplay is now locked.",
            locked: true
          });
        }
        
        if (hasPassed) {
          return res.status(403).json({ 
            error: "Roleplay already passed", 
            message: "You have already passed this roleplay. Move on to the next one!",
            passed: true
          });
        }
      }

      // First try to get roleplay from database
      const dbRoleplay = await storage.getRoleplay(roleplayId);
      let callResult;
      
      if (dbRoleplay) {
        // Convert database roleplay to VAPI config
        callResult = await vapiService.startWebCallWithDbRoleplay({
          id: dbRoleplay.id,
          name: dbRoleplay.name,
          role: dbRoleplay.role,
          description: dbRoleplay.description,
          difficulty: dbRoleplay.difficulty,
          phase: dbRoleplay.phase || undefined,
          placement: dbRoleplay.placement || undefined,
          passCriteria: dbRoleplay.passCriteria || undefined,
          failConditions: dbRoleplay.failConditions || undefined,
          winningResponse: dbRoleplay.winningResponse || undefined,
          losingResponse: dbRoleplay.losingResponse || undefined,
          buySignal: dbRoleplay.stats?.buy_signal,
          objections: dbRoleplay.stats?.objections,
          resistance: dbRoleplay.stats?.resistance,
          traits: dbRoleplay.traits
        });
      } else {
        // Fallback to hardcoded configs for legacy roleplays
        callResult = await vapiService.startWebCall(roleplayId);
      }

      // Create usage session for billing tracking
      if (userId && callResult.callId) {
        try {
          await storage.createUsageSession({
            userId,
            roleplayId,
            vapiCallId: callResult.callId,
            startTime: new Date(),
            sessionType: "voice",
            status: "active",
          });
        } catch (usageError) {
          console.error("Failed to create usage session:", usageError);
        }
      }

      res.json({ 
        callId: callResult.callId,
        roleplayConfig: callResult.config
      });
    } catch (error: any) {
      console.error("Start VAPI call error:", error);
      res.status(500).json({ error: error.message || "Failed to start voice call" });
    }
  });

  app.get("/api/vapi/call/:callId", async (req, res) => {
    try {
      const callDetails = await vapiService.getCallDetails(req.params.callId);
      res.json(callDetails);
    } catch (error: any) {
      console.error("Get VAPI call error:", error);
      res.status(500).json({ error: error.message || "Failed to get call details" });
    }
  });

  app.get("/api/vapi/transcript/:callId", async (req, res) => {
    try {
      const transcriptData = await vapiService.getCallTranscript(req.params.callId);
      res.json(transcriptData);
    } catch (error: any) {
      console.error("Get VAPI transcript error:", error);
      res.status(500).json({ error: error.message || "Failed to get transcript" });
    }
  });

  app.post("/api/vapi/end-call/:callId", async (req, res) => {
    try {
      await vapiService.endCall(req.params.callId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("End VAPI call error:", error);
      res.status(500).json({ error: error.message || "Failed to end call" });
    }
  });

  app.post("/api/vapi/evaluate", async (req, res) => {
    try {
      const { roleplayId, callId, userId } = req.body;
      
      if (!roleplayId || !callId) {
        return res.status(400).json({ error: "roleplayId and callId are required" });
      }

      // First try database, then fall back to hardcoded configs
      const dbRoleplay = await storage.getRoleplay(roleplayId);
      let config;
      if (dbRoleplay) {
        const stats = dbRoleplay.stats as { buy_signal: number; objections: number; resistance: number } | null;
        config = convertRoleplayToVapiConfig({
          id: dbRoleplay.id,
          name: dbRoleplay.name,
          role: dbRoleplay.role,
          description: dbRoleplay.description,
          traits: dbRoleplay.traits,
          difficulty: dbRoleplay.difficulty,
          buySignal: stats?.buy_signal || 50,
          objections: stats?.objections || 50,
          resistance: stats?.resistance || 50,
          phase: dbRoleplay.phase || "Phase 1",
          placement: dbRoleplay.placement || "",
          passCriteria: dbRoleplay.passCriteria || "",
          failConditions: dbRoleplay.failConditions || "",
          winningResponse: dbRoleplay.winningResponse || "",
          losingResponse: dbRoleplay.losingResponse || ""
        });
      } else {
        config = getVapiRoleplayConfig(roleplayId);
      }
      
      if (!config) {
        return res.status(404).json({ error: "Roleplay config not found" });
      }

      const transcriptData = await vapiService.getCallTranscript(callId);
      
      const scenario: RoleplayScenario = {
        name: config.name,
        role: config.role,
        description: `${config.context}. Pass criteria: ${config.passCriteria}. Fail conditions: ${config.failConditions}.`,
        traits: config.traits,
        difficulty: config.difficulty,
        stats: {
          buy_signal: config.buySignal,
          objections: 50,
          resistance: config.resistanceLevel
        }
      };

      const typedMessages = transcriptData.messages.map(m => ({
        role: m.role as "model" | "user",
        content: m.content
      }));
      const feedback = await evaluateRoleplay(scenario, typedMessages);
      
      const passed = feedback.passed ?? feedback.overallScore >= 70;

      if (userId) {
        try {
          const roleplay = await storage.getRoleplay(roleplayId);
          if (roleplay) {
            const attempt = await storage.createRoleplayAttempt({
              userId,
              roleplayId,
              score: feedback.overallScore,
              passed: passed ? 1 : 0,
              feedback: JSON.stringify({
                ...feedback,
                recordingUrl: transcriptData.recordingUrl
              })
            });

            // Complete usage session for billing
            const usageSession = await storage.getUsageSessionByVapiCallId(callId);
            if (usageSession) {
              const endTime = new Date();
              const durationSeconds = Math.floor((endTime.getTime() - new Date(usageSession.startTime).getTime()) / 1000);
              await storage.completeUsageSession(usageSession.id, endTime, durationSeconds);
              await storage.updateUsageSession(usageSession.id, { roleplayAttemptId: attempt.id });
            }
          }
        } catch (dbError) {
          console.error("Failed to save roleplay attempt:", dbError);
        }
      }

      res.json({
        scenario: {
          id: config.id,
          name: config.name,
          role: config.role,
          difficulty: config.difficulty,
          orderIndex: dbRoleplay?.orderIndex,
          chapterId: dbRoleplay?.chapterId
        },
        feedback: {
          ...feedback,
          passed,
          recordingUrl: transcriptData.recordingUrl
        },
        transcript: transcriptData.messages
      });
    } catch (error: any) {
      console.error("Evaluate VAPI call error:", error);
      res.status(500).json({ error: error.message || "Failed to evaluate call" });
    }
  });

  // Helper function to validate caller via JWT token and return their user info
  async function getAuthenticatedUser(req: any): Promise<{ user: any; error?: string } | null> {
    const authHeader = req.headers["authorization"] as string;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "Authorization required" };
    }
    
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, AUTH_JWT_SECRET) as { userId: string; role: string };
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return { user: null, error: "Invalid user" };
      }
      return { user };
    } catch (err) {
      return { user: null, error: "Invalid or expired token" };
    }
  }

  // Usage Tracking API - register session when call starts from client SDK
  app.post("/api/usage/register-session", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }
      
      const { roleplayId, vapiCallId } = req.body;
      if (!roleplayId) {
        return res.status(400).json({ error: "roleplayId is required" });
      }

      // Use authenticated user ID, not client-supplied
      const session = await storage.createUsageSession({
        userId: authResult.user.id,
        roleplayId,
        vapiCallId: vapiCallId || null,
        startTime: new Date(),
        sessionType: "voice",
        status: "active",
      });

      res.json({ sessionId: session.id, success: true });
    } catch (error: any) {
      console.error("Register usage session error:", error);
      res.status(500).json({ error: error.message || "Failed to register session" });
    }
  });

  // Usage Reporting API with role-based access control
  app.get("/api/usage/user/:userId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const requestedUserId = req.params.userId;
      const callerRole = authResult.user.role;
      const callerId = authResult.user.id;

      // Reps can only view their own usage (no billing data), managers can view their team, admins can view all
      if (callerRole === "rep") {
        if (requestedUserId !== callerId) {
          return res.status(403).json({ error: "Access denied" });
        }
        // Reps see their sessions but not billing data
        const sessions = await storage.getUserUsageSessions(requestedUserId);
        return res.json({
          sessions: sessions.map(s => ({ ...s, costCents: undefined, billedMinutes: undefined })),
          summary: {
            totalSessions: sessions.length,
          }
        });
      }

      // Managers can view their team members' usage
      if (callerRole === "manager") {
        const teamMembers = await storage.getUsersByManagerId(callerId);
        const isTeamMember = teamMembers.some(m => m.id === requestedUserId) || requestedUserId === callerId;
        if (!isTeamMember) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      // Directors and admins can view anyone
      const sessions = await storage.getUserUsageSessions(requestedUserId);
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.billedMinutes || 0), 0);
      const totalCostCents = sessions.reduce((sum, s) => sum + (s.costCents || 0), 0);
      
      res.json({
        sessions,
        summary: {
          totalSessions: sessions.length,
          totalMinutes,
          totalCostDollars: (totalCostCents / 100).toFixed(2),
          ratePerMinute: "$0.15"
        }
      });
    } catch (error: any) {
      console.error("Get user usage error:", error);
      res.status(500).json({ error: error.message || "Failed to get usage" });
    }
  });

  app.get("/api/usage/team/:managerId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      const callerId = authResult.user.id;
      const requestedManagerId = req.params.managerId;

      // Only managers can view their own team, admins/directors can view any team
      if (callerRole === "rep") {
        return res.status(403).json({ error: "Access denied - managers and admins only" });
      }

      if (callerRole === "manager" && requestedManagerId !== callerId) {
        return res.status(403).json({ error: "Access denied - can only view your own team" });
      }

      const sessions = await storage.getTeamUsageSessions(requestedManagerId);
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.billedMinutes || 0), 0);
      const totalCostCents = sessions.reduce((sum, s) => sum + (s.costCents || 0), 0);
      
      // Group by user
      const byUser = sessions.reduce((acc, s) => {
        if (!acc[s.userId]) {
          acc[s.userId] = { sessions: 0, minutes: 0, costCents: 0 };
        }
        acc[s.userId].sessions++;
        acc[s.userId].minutes += s.billedMinutes || 0;
        acc[s.userId].costCents += s.costCents || 0;
        return acc;
      }, {} as Record<string, { sessions: number; minutes: number; costCents: number }>);
      
      res.json({
        sessions,
        byUser,
        summary: {
          totalSessions: sessions.length,
          totalMinutes,
          totalCostDollars: (totalCostCents / 100).toFixed(2),
          ratePerMinute: "$0.15"
        }
      });
    } catch (error: any) {
      console.error("Get team usage error:", error);
      res.status(500).json({ error: error.message || "Failed to get team usage" });
    }
  });

  app.get("/api/usage/all", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;

      // Only admins/directors can view all usage
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const sessions = await storage.getAllUsageSessions();
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.billedMinutes || 0), 0);
      const totalCostCents = sessions.reduce((sum, s) => sum + (s.costCents || 0), 0);
      
      // Group by user
      const byUser = sessions.reduce((acc, s) => {
        if (!acc[s.userId]) {
          acc[s.userId] = { sessions: 0, minutes: 0, costCents: 0 };
        }
        acc[s.userId].sessions++;
        acc[s.userId].minutes += s.billedMinutes || 0;
        acc[s.userId].costCents += s.costCents || 0;
        return acc;
      }, {} as Record<string, { sessions: number; minutes: number; costCents: number }>);
      
      res.json({
        sessions,
        byUser,
        summary: {
          totalSessions: sessions.length,
          totalMinutes,
          totalCostDollars: (totalCostCents / 100).toFixed(2),
          ratePerMinute: "$0.15"
        }
      });
    } catch (error: any) {
      console.error("Get all usage error:", error);
      res.status(500).json({ error: error.message || "Failed to get usage" });
    }
  });

  // =====================
  // Billing Reset API (with email verification)
  // =====================
  
  // Store reset verification codes in memory (expires after 10 minutes)
  const billingResetCodes: Map<string, { code: string; expiresAt: Date }> = new Map();

  // Request billing reset - generates 4-digit code and emails to tabish@gigarev.com
  app.post("/api/usage/reset-request", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - directors only" });
      }

      // Generate 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Store code with 10-minute expiry
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      billingResetCodes.set("billing-reset", { code, expiresAt });

      // Send email
      const emailResult = await sendBillingResetCode(code);
      if (!emailResult.success) {
        return res.status(500).json({ error: emailResult.error || "Failed to send verification email" });
      }

      res.json({ success: true, message: "Verification code sent to tabish@gigarev.com" });
    } catch (error: any) {
      console.error("Reset request error:", error);
      res.status(500).json({ error: error.message || "Failed to request reset" });
    }
  });

  // Confirm billing reset with code
  app.post("/api/usage/reset-confirm", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - directors only" });
      }

      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Verification code required" });
      }

      const storedData = billingResetCodes.get("billing-reset");
      if (!storedData) {
        return res.status(400).json({ error: "No pending reset request. Please request a new code." });
      }

      if (new Date() > storedData.expiresAt) {
        billingResetCodes.delete("billing-reset");
        return res.status(400).json({ error: "Verification code expired. Please request a new code." });
      }

      if (storedData.code !== code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      // Code is valid - delete all usage sessions
      const deletedCount = await storage.deleteAllUsageSessions();
      
      // Clear the used code
      billingResetCodes.delete("billing-reset");

      res.json({ 
        success: true, 
        message: `Billing data reset complete. ${deletedCount} usage sessions deleted.`,
        deletedCount
      });
    } catch (error: any) {
      console.error("Reset confirm error:", error);
      res.status(500).json({ error: error.message || "Failed to reset billing data" });
    }
  });

  // =====================
  // Usage Audit & Reconcile API
  // =====================

  // Helper function to process sessions in batches
  async function processBatch<T, R>(
    items: T[],
    batchSize: number,
    delayMs: number,
    processor: (item: T) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);
      // Add delay between batches (except after the last batch)
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return results;
  }

  // Audit a single usage session against VAPI
  app.get("/api/usage/audit/:sessionId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const { sessionId } = req.params;
      
      // Get the specific session directly by ID (efficient lookup)
      const session = await storage.getUsageSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (!session.vapiCallId) {
        return res.status(400).json({ error: "Session has no VAPI call ID - cannot audit" });
      }

      // Get user info
      const user = await storage.getUser(session.userId);

      // Fetch actual VAPI data with timeout
      let vapiData;
      try {
        vapiData = await Promise.race([
          vapiService.getCallDuration(session.vapiCallId),
          new Promise((_, reject) => setTimeout(() => reject(new Error("VAPI request timeout")), 10000))
        ]) as { durationSeconds: number; status: string; startedAt?: string; endedAt?: string } | null;
      } catch (err: any) {
        return res.status(500).json({ 
          error: `Failed to fetch VAPI data: ${err.message}`,
          session: {
            id: session.id,
            userId: session.userId,
            userName: user?.name,
            vapiCallId: session.vapiCallId,
            storedDurationSeconds: session.durationSeconds || 0,
            storedBilledMinutes: session.billedMinutes || 0,
            storedCostCents: session.costCents || 0,
          }
        });
      }

      if (!vapiData) {
        return res.status(404).json({ 
          error: "Could not retrieve VAPI call data - call may have expired or been deleted",
          session: {
            id: session.id,
            userId: session.userId,
            userName: user?.name,
            vapiCallId: session.vapiCallId,
            storedDurationSeconds: session.durationSeconds || 0,
            storedBilledMinutes: session.billedMinutes || 0,
            storedCostCents: session.costCents || 0,
          }
        });
      }

      const actualDurationSeconds = vapiData.durationSeconds;
      const actualBilledMinutes = Math.ceil(actualDurationSeconds / 60);
      const actualCostCents = actualBilledMinutes * 15;

      const storedDurationSeconds = session.durationSeconds || 0;
      const storedBilledMinutes = session.billedMinutes || 0;
      const storedCostCents = session.costCents || 0;

      const differenceMinutes = storedBilledMinutes - actualBilledMinutes;
      const hasDiscrepancy = Math.abs(differenceMinutes) >= 1;

      res.json({
        success: true,
        hasDiscrepancy,
        session: {
          id: session.id,
          userId: session.userId,
          userName: user?.name,
          vapiCallId: session.vapiCallId,
          sessionDate: new Date(session.startTime).toISOString(),
          status: session.status,
        },
        stored: {
          durationSeconds: storedDurationSeconds,
          billedMinutes: storedBilledMinutes,
          costCents: storedCostCents,
        },
        actual: {
          durationSeconds: actualDurationSeconds,
          billedMinutes: actualBilledMinutes,
          costCents: actualCostCents,
          vapiStatus: vapiData.status,
          startedAt: vapiData.startedAt,
          endedAt: vapiData.endedAt,
        },
        difference: {
          minutes: differenceMinutes,
          costCents: storedCostCents - actualCostCents,
        },
      });
    } catch (error: any) {
      console.error("Audit single session error:", error);
      res.status(500).json({ error: error.message || "Failed to audit session" });
    }
  });

  // Audit usage sessions against VAPI call data (batch processing)
  app.post("/api/usage/audit", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const { userId } = req.body; // Optional - if not provided, audit all users

      console.log("[Audit] Starting audit...", userId ? `for user ${userId}` : "for all users");

      // Get sessions to audit
      let sessions;
      if (userId) {
        sessions = await storage.getUserUsageSessions(userId);
      } else {
        sessions = await storage.getAllUsageSessions();
      }

      // Filter to only sessions with vapiCallId
      const sessionsWithCalls = sessions.filter(s => s.vapiCallId);
      
      console.log(`[Audit] Found ${sessionsWithCalls.length} sessions with VAPI call IDs to audit`);

      if (sessionsWithCalls.length === 0) {
        return res.json({
          success: true,
          summary: {
            sessionsAudited: 0,
            discrepanciesFound: 0,
            errorsEncountered: 0,
            totalOverchargedMinutes: 0,
            totalOverchargedCents: 0,
          },
          discrepancies: [],
          errors: [],
        });
      }

      const discrepancies: Array<{
        sessionId: string;
        userId: string;
        userName?: string;
        vapiCallId: string;
        sessionDate: string;
        storedDurationSeconds: number;
        storedBilledMinutes: number;
        storedCostCents: number;
        actualDurationSeconds: number;
        actualBilledMinutes: number;
        actualCostCents: number;
        differenceMinutes: number;
        differenceCostCents: number;
        vapiStatus: string;
      }> = [];

      const errors: Array<{ sessionId: string; vapiCallId: string; error: string }> = [];

      // Process sessions in batches of 3 with 500ms delay between batches
      const BATCH_SIZE = 3;
      const BATCH_DELAY_MS = 500;
      const VAPI_TIMEOUT_MS = 10000;

      const auditResults = await processBatch(
        sessionsWithCalls,
        BATCH_SIZE,
        BATCH_DELAY_MS,
        async (session) => {
          try {
            // Add timeout to VAPI calls
            const vapiDataPromise = vapiService.getCallDuration(session.vapiCallId!);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("VAPI request timeout")), VAPI_TIMEOUT_MS)
            );
            
            const vapiData = await Promise.race([vapiDataPromise, timeoutPromise]) as { durationSeconds: number; status: string } | null;
            
            if (!vapiData) {
              return { 
                type: 'error' as const, 
                sessionId: session.id, 
                vapiCallId: session.vapiCallId!, 
                error: "Could not retrieve VAPI call data" 
              };
            }

            const actualDurationSeconds = vapiData.durationSeconds;
            const actualBilledMinutes = Math.ceil(actualDurationSeconds / 60);
            const actualCostCents = actualBilledMinutes * 15;

            const storedDurationSeconds = session.durationSeconds || 0;
            const storedBilledMinutes = session.billedMinutes || 0;
            const storedCostCents = session.costCents || 0;

            const differenceMinutes = storedBilledMinutes - actualBilledMinutes;
            
            if (Math.abs(differenceMinutes) >= 1) {
              const user = await storage.getUser(session.userId);
              return {
                type: 'discrepancy' as const,
                data: {
                  sessionId: session.id,
                  userId: session.userId,
                  userName: user?.name,
                  vapiCallId: session.vapiCallId!,
                  sessionDate: new Date(session.startTime).toISOString(),
                  storedDurationSeconds,
                  storedBilledMinutes,
                  storedCostCents,
                  actualDurationSeconds,
                  actualBilledMinutes,
                  actualCostCents,
                  differenceMinutes,
                  differenceCostCents: storedCostCents - actualCostCents,
                  vapiStatus: vapiData.status,
                }
              };
            }
            
            return { type: 'ok' as const };
          } catch (err: any) {
            console.error(`[Audit] Error processing session ${session.id}:`, err.message);
            return { 
              type: 'error' as const, 
              sessionId: session.id, 
              vapiCallId: session.vapiCallId!, 
              error: err.message || "Unknown error" 
            };
          }
        }
      );

      // Separate results into discrepancies and errors
      for (const result of auditResults) {
        if (result.type === 'discrepancy') {
          discrepancies.push(result.data);
        } else if (result.type === 'error') {
          errors.push({
            sessionId: result.sessionId,
            vapiCallId: result.vapiCallId,
            error: result.error
          });
        }
      }

      // Calculate totals
      const totalDifferenceMinutes = discrepancies.reduce((sum, d) => sum + d.differenceMinutes, 0);
      const totalDifferenceCost = discrepancies.reduce((sum, d) => sum + d.differenceCostCents, 0);

      console.log(`[Audit] Complete. Found ${discrepancies.length} discrepancies, ${errors.length} errors`);

      res.json({
        success: true,
        summary: {
          sessionsAudited: sessionsWithCalls.length,
          discrepanciesFound: discrepancies.length,
          errorsEncountered: errors.length,
          totalOverchargedMinutes: totalDifferenceMinutes,
          totalOverchargedCents: totalDifferenceCost,
        },
        discrepancies,
        errors,
      });
    } catch (error: any) {
      console.error("Audit usage error:", error);
      res.status(500).json({ error: error.message || "Failed to audit usage" });
    }
  });

  // Reconcile (fix) usage session discrepancies - re-fetches VAPI data server-side for security
  app.post("/api/usage/reconcile", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const { fixes } = req.body;
      if (!fixes || !Array.isArray(fixes) || fixes.length === 0) {
        return res.status(400).json({ error: "fixes array is required" });
      }

      const RATE_CENTS_PER_MINUTE = 15; // $0.15 per minute
      const results: Array<{ sessionId: string; success: boolean; error?: string; corrected?: { minutes: number; cost: number } }> = [];
      let totalMinutesFixed = 0;
      let totalCostFixed = 0;

      for (const fix of fixes) {
        const { sessionId } = fix;
        
        try {
          // Get the session to find the VAPI call ID
          const sessions = await storage.getAllUsageSessions();
          const session = sessions.find(s => s.id === sessionId);
          
          if (!session) {
            results.push({ sessionId, success: false, error: "Session not found" });
            continue;
          }

          if (!session.vapiCallId) {
            results.push({ sessionId, success: false, error: "No VAPI call ID associated with this session" });
            continue;
          }

          // Re-fetch VAPI data server-side (don't trust client values)
          const vapiData = await vapiService.getCallDuration(session.vapiCallId);
          
          if (!vapiData) {
            results.push({ sessionId, success: false, error: "Could not retrieve VAPI call data" });
            continue;
          }

          // Calculate correct values server-side
          const actualDurationSeconds = vapiData.durationSeconds;
          const actualBilledMinutes = Math.ceil(actualDurationSeconds / 60);
          const actualCostCents = actualBilledMinutes * RATE_CENTS_PER_MINUTE;

          // Calculate the difference for reporting
          const oldBilledMinutes = session.billedMinutes || 0;
          const oldCostCents = session.costCents || 0;
          const minutesDiff = oldBilledMinutes - actualBilledMinutes;
          const costDiff = oldCostCents - actualCostCents;

          const updated = await storage.updateUsageSession(sessionId, {
            durationSeconds: actualDurationSeconds,
            billedMinutes: actualBilledMinutes,
            costCents: actualCostCents,
            status: "reconciled",
          });

          if (updated) {
            results.push({ 
              sessionId, 
              success: true,
              corrected: { minutes: minutesDiff, cost: costDiff }
            });
            totalMinutesFixed += minutesDiff;
            totalCostFixed += costDiff;
          } else {
            results.push({ sessionId, success: false, error: "Failed to update session" });
          }
        } catch (err: any) {
          results.push({ sessionId, success: false, error: err.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      res.json({
        success: true,
        message: `Reconciled ${successCount} session(s). ${failCount} failed.`,
        summary: {
          sessionsFixed: successCount,
          sessionsFailed: failCount,
          minutesCorrected: totalMinutesFixed,
          costCorrectedCents: totalCostFixed,
        },
        results,
      });
    } catch (error: any) {
      console.error("Reconcile usage error:", error);
      res.status(500).json({ error: error.message || "Failed to reconcile usage" });
    }
  });

  // Preview cleanup - shows what would be fixed without making changes
  app.get("/api/usage/cleanup-preview", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      console.log("[Cleanup Preview] Fetching sessions that need cleanup...");

      // Get all sessions that need cleanup
      const allSessions = await storage.getAllUsageSessions();
      const MAX_REASONABLE_DURATION = 600; // 10 minutes max for any roleplay
      
      const problematicSessions = allSessions.filter(s => 
        s.vapiCallId && (
          (s.status === "active" && (s.durationSeconds === 0 || s.durationSeconds === null)) ||
          (s.status === "completed" && s.durationSeconds && s.durationSeconds > MAX_REASONABLE_DURATION)
        )
      );

      console.log(`[Cleanup Preview] Found ${problematicSessions.length} sessions to preview`);

      if (problematicSessions.length === 0) {
        return res.json({
          success: true,
          sessionsCount: 0,
          sessions: [],
        });
      }

      // Fetch VAPI data for each session (batch processing)
      const BATCH_SIZE = 3;
      const BATCH_DELAY_MS = 500;
      const VAPI_TIMEOUT_MS = 10000;

      const previewResults: Array<{
        sessionId: string;
        vapiCallId: string;
        userId: string;
        userName?: string;
        sessionDate: string;
        currentStatus: string;
        currentDuration: number;
        currentBilledMinutes: number;
        currentCostCents: number;
        actualDuration: number | null;
        actualBilledMinutes: number | null;
        actualCostCents: number | null;
        vapiStatus: string | null;
        issue: 'orphaned' | 'corrupted' | 'unknown';
        action: 'fix' | 'cancel' | 'error';
        error?: string;
      }> = [];

      // Get user info map
      const userMap = new Map<string, string>();

      for (let i = 0; i < problematicSessions.length; i += BATCH_SIZE) {
        const batch = problematicSessions.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (session) => {
          // Get user name if not cached
          if (!userMap.has(session.userId)) {
            const user = await storage.getUser(session.userId);
            userMap.set(session.userId, user?.name || 'Unknown');
          }

          const issue: 'orphaned' | 'corrupted' = 
            session.status === 'active' ? 'orphaned' : 'corrupted';

          try {
            const vapiDataPromise = vapiService.getCallDuration(session.vapiCallId!);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("VAPI timeout")), VAPI_TIMEOUT_MS)
            );
            
            const vapiData = await Promise.race([vapiDataPromise, timeoutPromise]) as { 
              durationSeconds: number; 
              status: string;
            } | null;

            const RATE_CENTS_PER_MINUTE = 15;
            
            if (!vapiData) {
              previewResults.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                userId: session.userId,
                userName: userMap.get(session.userId),
                sessionDate: session.startTime?.toISOString() || '',
                currentStatus: session.status || 'unknown',
                currentDuration: session.durationSeconds || 0,
                currentBilledMinutes: session.billedMinutes || 0,
                currentCostCents: session.costCents || 0,
                actualDuration: null,
                actualBilledMinutes: null,
                actualCostCents: null,
                vapiStatus: null,
                issue,
                action: 'cancel',
                error: 'VAPI call not found',
              });
            } else if (vapiData.status === 'ended' || vapiData.status === 'completed') {
              const actualDuration = vapiData.durationSeconds || 0;
              const actualBilledMinutes = Math.ceil(actualDuration / 60);
              const actualCostCents = actualBilledMinutes * RATE_CENTS_PER_MINUTE;

              previewResults.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                userId: session.userId,
                userName: userMap.get(session.userId),
                sessionDate: session.startTime?.toISOString() || '',
                currentStatus: session.status || 'unknown',
                currentDuration: session.durationSeconds || 0,
                currentBilledMinutes: session.billedMinutes || 0,
                currentCostCents: session.costCents || 0,
                actualDuration,
                actualBilledMinutes,
                actualCostCents,
                vapiStatus: vapiData.status,
                issue,
                action: 'fix',
              });
            } else {
              previewResults.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                userId: session.userId,
                userName: userMap.get(session.userId),
                sessionDate: session.startTime?.toISOString() || '',
                currentStatus: session.status || 'unknown',
                currentDuration: session.durationSeconds || 0,
                currentBilledMinutes: session.billedMinutes || 0,
                currentCostCents: session.costCents || 0,
                actualDuration: null,
                actualBilledMinutes: null,
                actualCostCents: null,
                vapiStatus: vapiData.status,
                issue,
                action: 'error',
                error: `Call status: ${vapiData.status}`,
              });
            }
          } catch (err: any) {
            previewResults.push({
              sessionId: session.id,
              vapiCallId: session.vapiCallId!,
              userId: session.userId,
              userName: userMap.get(session.userId),
              sessionDate: session.startTime?.toISOString() || '',
              currentStatus: session.status || 'unknown',
              currentDuration: session.durationSeconds || 0,
              currentBilledMinutes: session.billedMinutes || 0,
              currentCostCents: session.costCents || 0,
              actualDuration: null,
              actualBilledMinutes: null,
              actualCostCents: null,
              vapiStatus: null,
              issue,
              action: 'error',
              error: err.message,
            });
          }
        }));

        // Delay between batches
        if (i + BATCH_SIZE < problematicSessions.length) {
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }

      // Calculate summary stats
      const fixable = previewResults.filter(r => r.action === 'fix');
      const cancellable = previewResults.filter(r => r.action === 'cancel');
      const errored = previewResults.filter(r => r.action === 'error');
      
      const totalCurrentMinutes = previewResults.reduce((sum, r) => sum + r.currentBilledMinutes, 0);
      const totalActualMinutes = fixable.reduce((sum, r) => sum + (r.actualBilledMinutes || 0), 0);
      const totalCurrentCost = previewResults.reduce((sum, r) => sum + r.currentCostCents, 0);
      const totalActualCost = fixable.reduce((sum, r) => sum + (r.actualCostCents || 0), 0);

      res.json({
        success: true,
        sessionsCount: previewResults.length,
        summary: {
          toFix: fixable.length,
          toCancel: cancellable.length,
          errored: errored.length,
          currentTotalMinutes: totalCurrentMinutes,
          actualTotalMinutes: totalActualMinutes,
          minutesDifference: totalCurrentMinutes - totalActualMinutes,
          currentTotalCost: totalCurrentCost,
          actualTotalCost: totalActualCost,
          costDifference: totalCurrentCost - totalActualCost,
        },
        sessions: previewResults,
      });
    } catch (error: any) {
      console.error("Cleanup preview error:", error);
      res.status(500).json({ error: error.message || "Failed to preview cleanup" });
    }
  });

  // Cleanup orphaned active sessions - fixes sessions that were started but never completed
  app.post("/api/usage/cleanup-orphaned", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      console.log("[Cleanup] Starting orphaned session cleanup...");

      // Get all sessions that need cleanup:
      // 1. Active sessions with 0 duration (orphaned/never completed)
      // 2. Completed sessions with impossibly long durations (> 10 minutes = 600 seconds for roleplays)
      const allSessions = await storage.getAllUsageSessions();
      const MAX_REASONABLE_DURATION = 600; // 10 minutes max for any roleplay
      
      const orphanedSessions = allSessions.filter(s => 
        s.vapiCallId && (
          // Orphaned: active with 0 duration
          (s.status === "active" && (s.durationSeconds === 0 || s.durationSeconds === null)) ||
          // Corrupted: completed but with impossible duration
          (s.status === "completed" && s.durationSeconds && s.durationSeconds > MAX_REASONABLE_DURATION)
        )
      );

      console.log(`[Cleanup] Found ${orphanedSessions.length} orphaned sessions to process`);

      if (orphanedSessions.length === 0) {
        return res.json({
          success: true,
          summary: {
            sessionsProcessed: 0,
            sessionsFixed: 0,
            sessionsCancelled: 0,
            sessionsErrored: 0,
            totalMinutesBilled: 0,
            totalCostCents: 0,
          },
          results: [],
        });
      }

      const RATE_CENTS_PER_MINUTE = 15;
      const BATCH_SIZE = 3;
      const BATCH_DELAY_MS = 500;
      const VAPI_TIMEOUT_MS = 10000;

      const results: Array<{
        sessionId: string;
        vapiCallId: string;
        action: 'fixed' | 'cancelled' | 'error';
        durationSeconds?: number;
        billedMinutes?: number;
        costCents?: number;
        error?: string;
      }> = [];

      let sessionsFixed = 0;
      let sessionsCancelled = 0;
      let sessionsErrored = 0;
      let totalMinutesBilled = 0;
      let totalCostCents = 0;

      // Process in batches
      for (let i = 0; i < orphanedSessions.length; i += BATCH_SIZE) {
        const batch = orphanedSessions.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(async (session) => {
          try {
            // Fetch actual VAPI data with timeout
            const vapiDataPromise = vapiService.getCallDuration(session.vapiCallId!);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("VAPI request timeout")), VAPI_TIMEOUT_MS)
            );
            
            const vapiData = await Promise.race([vapiDataPromise, timeoutPromise]) as { 
              durationSeconds: number; 
              status: string;
              startedAt?: string;
              endedAt?: string;
            } | null;
            
            if (!vapiData) {
              // VAPI call doesn't exist or no data - mark as cancelled
              await storage.updateUsageSession(session.id, {
                status: "cancelled",
                endTime: new Date(),
                durationSeconds: 0,
                billedMinutes: 0,
                costCents: 0,
              });
              results.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                action: 'cancelled',
                error: 'VAPI call not found',
              });
              sessionsCancelled++;
              return;
            }

            // Check if call actually ended
            if (vapiData.status === 'ended' || vapiData.status === 'completed') {
              const actualDuration = vapiData.durationSeconds || 0;
              const billedMinutes = Math.ceil(actualDuration / 60);
              const costCents = billedMinutes * RATE_CENTS_PER_MINUTE;

              await storage.updateUsageSession(session.id, {
                status: "completed",
                endTime: vapiData.endedAt ? new Date(vapiData.endedAt) : new Date(),
                durationSeconds: actualDuration,
                billedMinutes,
                costCents,
              });

              results.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                action: 'fixed',
                durationSeconds: actualDuration,
                billedMinutes,
                costCents,
              });
              sessionsFixed++;
              totalMinutesBilled += billedMinutes;
              totalCostCents += costCents;
            } else if (vapiData.status === 'in-progress') {
              // Call still in progress - skip
              results.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                action: 'error',
                error: 'Call still in progress',
              });
              sessionsErrored++;
            } else {
              // Unknown status - mark as cancelled
              await storage.updateUsageSession(session.id, {
                status: "cancelled",
                endTime: new Date(),
                durationSeconds: 0,
                billedMinutes: 0,
                costCents: 0,
              });
              results.push({
                sessionId: session.id,
                vapiCallId: session.vapiCallId!,
                action: 'cancelled',
                error: `Unknown VAPI status: ${vapiData.status}`,
              });
              sessionsCancelled++;
            }
          } catch (err: any) {
            results.push({
              sessionId: session.id,
              vapiCallId: session.vapiCallId!,
              action: 'error',
              error: err.message,
            });
            sessionsErrored++;
          }
        }));

        // Delay between batches
        if (i + BATCH_SIZE < orphanedSessions.length) {
          await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
        }
      }

      console.log(`[Cleanup] Complete: ${sessionsFixed} fixed, ${sessionsCancelled} cancelled, ${sessionsErrored} errors`);

      res.json({
        success: true,
        summary: {
          sessionsProcessed: orphanedSessions.length,
          sessionsFixed,
          sessionsCancelled,
          sessionsErrored,
          totalMinutesBilled,
          totalCostCents,
        },
        results,
      });
    } catch (error: any) {
      console.error("Cleanup orphaned sessions error:", error);
      res.status(500).json({ error: error.message || "Failed to cleanup orphaned sessions" });
    }
  });

  // =====================
  // Performance Metrics API
  // =====================

  // Get team performance for a manager
  app.get("/api/managers/:managerId/performance", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const { managerId } = req.params;
      const callerRole = authResult.user.role;
      const callerId = authResult.user.id;

      // Only the manager themselves, directors, or admins can view team performance
      if (callerId !== managerId && callerRole !== "director" && callerRole !== "admin" && callerRole !== "manager") {
        return res.status(403).json({ error: "Access denied" });
      }

      const performance = await storage.getTeamPerformance(managerId);
      res.json(performance);
    } catch (error: any) {
      console.error("Get team performance error:", error);
      res.status(500).json({ error: error.message || "Failed to get team performance" });
    }
  });

  // Get org-wide performance for admins/directors
  app.get("/api/performance/admin", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;

      // Only admins/directors can view org-wide performance
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      const performance = await storage.getOrgPerformance();
      res.json(performance);
    } catch (error: any) {
      console.error("Get org performance error:", error);
      res.status(500).json({ error: error.message || "Failed to get org performance" });
    }
  });

  // =====================
  // Onboarding API
  // =====================
  
  app.post("/api/onboarding/generate-warrior", upload.single("photo"), async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const { name, userId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No photo provided" });
      }

      if (!userId || userId !== authResult.user.id) {
        return res.status(403).json({ error: "User ID mismatch" });
      }

      const { profilePhotoUrl, warriorAvatarUrl } = await generateWarriorAvatar(
        file.buffer,
        name || authResult.user.name
      );

      await storage.updateUser(userId, {
        name: name || authResult.user.name,
        profilePhoto: profilePhotoUrl,
        warriorAvatar: warriorAvatarUrl,
        status: "active",
        avatarInitials: getAvatarInitials(name || authResult.user.name),
      });

      res.json({
        profilePhoto: profilePhotoUrl,
        warriorAvatar: warriorAvatarUrl,
      });
    } catch (error: any) {
      console.error("Generate warrior avatar error:", error);
      res.status(500).json({ error: error.message || "Failed to generate warrior avatar" });
    }
  });

  // Get individual rep performance
  app.get("/api/users/:userId/performance", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const { userId } = req.params;
      const callerRole = authResult.user.role;
      const callerId = authResult.user.id;

      // Reps can view their own performance, managers their team, admins anyone
      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const isOwnProfile = callerId === userId;
      const isManagerOfUser = callerRole === "manager" && targetUser.managerId === callerId;
      const isAdmin = callerRole === "director" || callerRole === "admin";

      if (!isOwnProfile && !isManagerOfUser && !isAdmin) {
        return res.status(403).json({ error: "Access denied" });
      }

      const performance = await storage.getRepPerformance(userId);
      res.json(performance);
    } catch (error: any) {
      console.error("Get user performance error:", error);
      res.status(500).json({ error: error.message || "Failed to get user performance" });
    }
  });

  // Certifications routes
  app.get("/api/certifications/:userId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const cert = await storage.getCertification(req.params.userId);
      res.json(cert || null);
    } catch (error) {
      console.error("Get certification error:", error);
      res.status(500).json({ error: "Failed to get certification" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { userId, certificateNumber, chaptersCompleted, roleplaysCompleted, quizAverage, roleplayPassRate } = req.body;
      if (!userId || !certificateNumber) {
        return res.status(400).json({ error: "userId and certificateNumber are required" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const existing = await storage.getCertification(userId);
      if (existing) {
        return res.json(existing);
      }
      const cert = await storage.createCertification({ 
        userId, 
        certificateNumber,
        chaptersCompleted: chaptersCompleted || 0,
        roleplaysCompleted: roleplaysCompleted || 0,
        quizAverage: quizAverage || 0,
        roleplayPassRate: roleplayPassRate || 0,
      });
      res.json(cert);
    } catch (error) {
      console.error("Create certification error:", error);
      res.status(500).json({ error: "Failed to create certification" });
    }
  });

  // Coaching Notes routes
  app.get("/api/coaching/notes/:repId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const notes = await storage.getCoachingNotes(req.params.repId);
      res.json(notes);
    } catch (error) {
      console.error("Get coaching notes error:", error);
      res.status(500).json({ error: "Failed to get coaching notes" });
    }
  });

  app.post("/api/coaching/notes", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { repId, content, roleplayAttemptId, noteType } = req.body;
      if (!repId || !content) {
        return res.status(400).json({ error: "repId and content are required" });
      }
      const note = await storage.createCoachingNote({
        repId,
        managerId: authResult.user.id,
        content,
        roleplayAttemptId: roleplayAttemptId || null,
        noteType: noteType || "general",
      });
      res.json(note);
    } catch (error) {
      console.error("Create coaching note error:", error);
      res.status(500).json({ error: "Failed to create coaching note" });
    }
  });

  // Coaching Tasks routes
  app.get("/api/coaching/tasks/:repId", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const tasks = await storage.getCoachingTasks(req.params.repId);
      res.json(tasks);
    } catch (error) {
      console.error("Get coaching tasks error:", error);
      res.status(500).json({ error: "Failed to get coaching tasks" });
    }
  });

  app.get("/api/coaching/tasks/:repId/pending", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const tasks = await storage.getPendingCoachingTasks(req.params.repId);
      res.json(tasks);
    } catch (error) {
      console.error("Get pending coaching tasks error:", error);
      res.status(500).json({ error: "Failed to get pending coaching tasks" });
    }
  });

  app.post("/api/coaching/tasks", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { repId, title, description, dueDate, priority } = req.body;
      if (!repId || !title) {
        return res.status(400).json({ error: "repId and title are required" });
      }
      const task = await storage.createCoachingTask({
        repId,
        managerId: authResult.user.id,
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "medium",
        status: "pending",
      });
      res.json(task);
    } catch (error) {
      console.error("Create coaching task error:", error);
      res.status(500).json({ error: "Failed to create coaching task" });
    }
  });

  app.patch("/api/coaching/tasks/:id/complete", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const task = await storage.completeCoachingTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Complete coaching task error:", error);
      res.status(500).json({ error: "Failed to complete coaching task" });
    }
  });

  // Progress Nudges routes
  app.get("/api/nudges", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const nudges = await storage.getUnreadNudges(authResult.user.id);
      res.json(nudges);
    } catch (error) {
      console.error("Get nudges error:", error);
      res.status(500).json({ error: "Failed to get nudges" });
    }
  });

  app.post("/api/nudges", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user || (authResult.user.role !== "manager" && authResult.user.role !== "director" && authResult.user.role !== "admin")) {
        return res.status(403).json({ error: "Only managers and admins can send nudges" });
      }
      const { userId, nudgeType, message } = req.body;
      if (!userId || !nudgeType || !message) {
        return res.status(400).json({ error: "userId, nudgeType, and message are required" });
      }
      const nudge = await storage.createProgressNudge({ userId, nudgeType, message });
      res.json(nudge);
    } catch (error) {
      console.error("Create nudge error:", error);
      res.status(500).json({ error: "Failed to create nudge" });
    }
  });

  app.patch("/api/nudges/:id/read", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const nudge = await storage.markNudgeRead(req.params.id);
      res.json(nudge);
    } catch (error) {
      console.error("Mark nudge read error:", error);
      res.status(500).json({ error: "Failed to mark nudge read" });
    }
  });

  app.patch("/api/nudges/:id/dismiss", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const nudge = await storage.dismissNudge(req.params.id);
      res.json(nudge);
    } catch (error) {
      console.error("Dismiss nudge error:", error);
      res.status(500).json({ error: "Failed to dismiss nudge" });
    }
  });

  // Stalled reps detection (for managers)
  app.get("/api/stalled-reps", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user || (authResult.user.role !== "manager" && authResult.user.role !== "director" && authResult.user.role !== "admin")) {
        return res.status(403).json({ error: "Access denied" });
      }
      const days = parseInt(req.query.days as string) || 3;
      const stalledReps = await storage.getStalledReps(days);
      
      if (authResult.user.role === "manager") {
        const filtered = stalledReps.filter(r => r.managerId === authResult.user?.id);
        return res.json(filtered);
      }
      res.json(stalledReps);
    } catch (error) {
      console.error("Get stalled reps error:", error);
      res.status(500).json({ error: "Failed to get stalled reps" });
    }
  });

  // Personal Stats route (comprehensive stats for a user)
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { userId } = req.params;
      const callerRole = authResult.user.role;
      const callerId = authResult.user.id;

      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const isOwnProfile = callerId === userId;
      const isManagerOfUser = callerRole === "manager" && targetUser.managerId === callerId;
      const isAdmin = callerRole === "director" || callerRole === "admin";

      if (!isOwnProfile && !isManagerOfUser && !isAdmin) {
        return res.status(403).json({ error: "Access denied" });
      }

      const [performance, certification, coachingTasks, roleplayAttemptsList, quizAttemptsList, progress] = await Promise.all([
        storage.getRepPerformance(userId),
        storage.getCertification(userId),
        storage.getPendingCoachingTasks(userId),
        storage.getUserRoleplayAttempts(userId),
        storage.getAllUserQuizAttempts(userId),
        storage.getUserProgress(userId),
      ]);

      const recentRoleplays = roleplayAttemptsList.slice(0, 5);
      const weeklyRoleplays = roleplayAttemptsList.filter(r => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(r.createdAt) > weekAgo;
      });

      res.json({
        user: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
          profilePhoto: targetUser.profilePhoto,
          warriorAvatar: targetUser.warriorAvatar,
          role: targetUser.role,
        },
        performance,
        certification,
        pendingTasks: coachingTasks,
        recentRoleplays,
        weeklyStats: {
          roleplaysCompleted: weeklyRoleplays.length,
          roleplaysPassed: new Set(weeklyRoleplays.filter(r => r.passed).map(r => r.roleplayId)).size,
          averageScore: weeklyRoleplays.length > 0 
            ? Math.round(weeklyRoleplays.reduce((sum, r) => sum + (r.score || 0), 0) / weeklyRoleplays.length)
            : 0,
        },
        chaptersProgress: progress,
        totalQuizAttempts: quizAttemptsList.length,
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ error: "Failed to get user stats" });
    }
  });

  // Sales Coach - RAG-powered chatbot
  app.post("/api/coach", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { question } = req.body;
      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Question is required" });
      }

      const relevantEntries = searchKnowledge(question, 5);
      
      if (relevantEntries.length === 0) {
        return res.json({
          answer: "I couldn't find specific information about that in the training materials. Try asking about door approaches, objection handling, the Gecko Green program, lawn care fundamentals, or prepay strategies.",
          sources: []
        });
      }

      const context = formatKnowledgeForPrompt(relevantEntries);

      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const systemPrompt = `You are the Arena AI Sales Coach for GeckoGreen lawn care. You help sales reps master door-to-door sales techniques.

IMPORTANT RULES:
1. ONLY use information from the provided training materials to answer questions
2. Be practical and actionable - give specific scripts and techniques reps can use immediately
3. When referencing roleplay scenarios, include the WINNING RESPONSE as an example
4. Keep answers concise but complete (2-4 paragraphs max)
5. If the training materials don't cover something, say so honestly
6. Use a supportive, coaching tone - you're here to help reps succeed

TRAINING MATERIALS:
${context}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_completion_tokens: 1000,
      });

      const answer = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

      const sources = relevantEntries.map(entry => ({
        title: entry.title,
        chapter: entry.chapter,
        type: entry.type,
        category: entry.category,
        winningResponse: entry.winningResponse,
        losingResponse: entry.losingResponse
      }));

      res.json({ answer, sources });
    } catch (error) {
      console.error("Coach error:", error);
      res.status(500).json({ error: "Failed to process question" });
    }
  });

  // Admin: Force reseed quizzes and recalculate scores
  app.post("/api/admin/restore-quiz-data", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user || (authResult.user.role !== "admin" && authResult.user.role !== "director")) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const chapters = await storage.getAllChapters();
      
      // Step 1: Force reseed all predefined quizzes
      const CHAPTER_0_QUIZZES = [
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

      const CHAPTER_1_QUIZZES = [
        { afterSlide: 5, question: 'Which set correctly matches the "Four Pillars of Field Success"?', options: ["Confidence, Optimism, Personality, Endurance", "Timeliness, Attitude, Practice, Persistence", "Product, Price, Pitch, Persistence", "Appearance, Tone, Explanation, Honesty"], correctAnswer: 1 },
        { afterSlide: 10, question: "In a doorstep sale, what's the correct relationship between emotion and logic?", options: ["Logic drives action; emotion justifies afterward", "Emotion drives action; logic justifies afterward", "They are always equal at the same time", "Only logic matters in lawn care"], correctAnswer: 1 },
        { afterSlide: 15, question: 'A homeowner says, "My lawn is fine." What is the best next move per the training?', options: ["Present pricing immediately to test seriousness", "Reveal an unrealized issue with a specific, visible observation and a question", "Ask for their email and leave", "Offer a discount to create urgency"], correctAnswer: 1 },
        { afterSlide: 20, question: "Which statement is TRUE about pre-emergent vs. post-emergent and expectations?", options: ["Pre-emergent kills existing weeds; post-emergent prevents sprouting", "Post-emergent kills existing weeds; pre-emergent prevents sprouting", "Both only work if weeds are already visible", "Both work instantly if watered the same day"], correctAnswer: 1 },
        { afterSlide: 25, question: 'In the "Partnership" model, which is primarily the homeowner\'s responsibility?', options: ["Seasonal application timing", "Product formulation choices", "Watering and mowing consistency", "Free service calls between visits"], correctAnswer: 2 },
        { afterSlide: 29, question: 'Which best captures what your "30-second story" must do?', options: ["Explain every treatment ingredient in detail", "Deliver a clear, confident summary of what you do, how you do it, and why it works—fast", "Lead with price to qualify the homeowner", "Compare competitors by name and position against them"], correctAnswer: 1 },
        { afterSlide: 34, question: 'What is the "Prepay Rule in One Line" the rep should follow?', options: ["Offer prepay only if the homeowner asks", "Prepay first, every time; autopay is the fallback", "Autopay is the default; prepay is optional", "Prepay only for customers with heavy weeds"], correctAnswer: 1 }
      ];

      let quizzesSeeded = 0;
      for (const chapter of chapters) {
        let quizzes: typeof CHAPTER_0_QUIZZES = [];
        if (chapter.title === "Intro to GeckoGreen") {
          quizzes = CHAPTER_0_QUIZZES;
        } else if (chapter.title === "Sales Foundations") {
          quizzes = CHAPTER_1_QUIZZES;
        }
        
        for (const quiz of quizzes) {
          await storage.upsertQuizQuestions([{
            chapterId: chapter.id,
            slideIndex: quiz.afterSlide,
            questionOrder: 0,
            question: quiz.question,
            options: quiz.options,
            correctAnswer: quiz.correctAnswer,
            explanation: null,
          }]);
          quizzesSeeded++;
        }
      }

      // Step 2: Recalculate quiz scores from existing quiz_attempts
      const allQuizAttempts = await storage.getAllQuizAttempts();
      const attemptsByUserAndChapter: Record<string, { correct: number; total: number }> = {};
      
      for (const attempt of allQuizAttempts) {
        const key = `${attempt.userId}:${attempt.chapterId}`;
        if (!attemptsByUserAndChapter[key]) {
          attemptsByUserAndChapter[key] = { correct: 0, total: 0 };
        }
        attemptsByUserAndChapter[key].total++;
        if (attempt.isCorrect) {
          attemptsByUserAndChapter[key].correct++;
        }
      }

      let scoresUpdated = 0;
      for (const [key, stats] of Object.entries(attemptsByUserAndChapter)) {
        const [userId, chapterId] = key.split(':');
        const score = Math.round((stats.correct / stats.total) * 100);
        
        // Get or create user_progress record
        const existingProgress = await storage.getUserProgressByChapter(userId, chapterId);
        if (existingProgress) {
          await storage.updateUserProgress(existingProgress.id, { quizScore: score });
        } else {
          await storage.createUserProgress({
            userId,
            chapterId,
            currentSlide: 0,
            completed: 0,
            slidesViewed: [],
            quizScore: score,
          });
        }
        scoresUpdated++;
      }

      res.json({
        success: true,
        message: "Quiz data restored successfully",
        quizzesSeeded,
        scoresUpdated,
        uniqueUserChapterCombinations: Object.keys(attemptsByUserAndChapter).length,
      });
    } catch (error: any) {
      console.error("Restore quiz data error:", error);
      res.status(500).json({ error: error.message || "Failed to restore quiz data" });
    }
  });

  // Admin: Delete old roleplay and cleanup
  app.post("/api/admin/cleanup-old-roleplay", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user || (authResult.user.role !== "admin" && authResult.user.role !== "director")) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { roleplaySlug } = req.body;
      if (!roleplaySlug) {
        return res.status(400).json({ error: "roleplaySlug is required" });
      }

      // Find the roleplay by slug
      const roleplays = await storage.getAllRoleplays();
      const roleplayToDelete = roleplays.find(r => r.slug === roleplaySlug);
      
      if (!roleplayToDelete) {
        return res.status(404).json({ error: `Roleplay with slug '${roleplaySlug}' not found` });
      }

      // Delete the roleplay using storage interface
      await storage.deleteRoleplayBySlug(roleplaySlug);

      res.json({
        success: true,
        message: `Roleplay '${roleplayToDelete.name}' deleted successfully`,
        deletedRoleplay: {
          id: roleplayToDelete.id,
          slug: roleplayToDelete.slug,
          name: roleplayToDelete.name,
        },
      });
    } catch (error: any) {
      console.error("Cleanup roleplay error:", error);
      res.status(500).json({ error: error.message || "Failed to cleanup roleplay" });
    }
  });

  return httpServer;
}
