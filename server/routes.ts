import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserProgressSchema, insertRoleplayAttemptSchema } from "@shared/schema";
import { z } from "zod";
import { startRoleplayConversation, continueRoleplayConversation, evaluateRoleplay, generateChapterImage, generatePersonaImage, generateLogoImage, generateBattlecardImage, generateArenaLogo, type RoleplayMessage, type RoleplayScenario } from "./gemini";
import { getOrGenerateQuizForSlide, submitQuizAnswer } from "./quiz-service";
import { vapiService } from "./vapi-service";
import { getVapiRoleplayConfig, convertRoleplayToVapiConfig, VAPI_ROLEPLAY_CONFIGS } from "./vapi-config";
import { generateSecurePassword, getAvatarInitials } from "./password-generator";
import { sendCredentialsEmail } from "./email-service";
import { sendCredentialsSMS } from "./sms-service";

const roleplaySessions = new Map<string, { scenario: RoleplayScenario; history: RoleplayMessage[] }>();

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
          { phase: "Opening", title: "Handling 'No Soliciting' Signs", situation: "Homeowner points to sign.", script: "I saw the sign and I promise I'm not selling magazines. I'm just letting neighbors know we're treating the Smiths' lawn tomorrow.", keyPoints: ["Acknowledge the sign", "Clarify you're a service provider", "Pivot to social proof"], type: "objection", image: "" },
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
        // Handle both boolean true and numeric 1 for passed field
        if (attempt.passed === 1 || attempt.passed === true || attempt.passed === "true") {
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

  // Delete user
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

      const isCertified = 
        completedChapters >= chapters.length && 
        uniquePassedRoleplays >= roleplays.length && 
        avgQuizScore >= 90;

      res.json({
        user: { ...user, password: undefined },
        stats: {
          chaptersCompleted: completedChapters,
          totalChapters: chapters.length,
          roleplaysPassed: uniquePassedRoleplays,
          totalRoleplays: roleplays.length,
          avgQuizScore,
          isCertified,
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

  // Roleplay routes
  app.get("/api/roleplays", async (req, res) => {
    try {
      const roleplays = await storage.getAllRoleplays();
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
      const roleplays = await storage.getRoleplaysByChapterId(req.params.chapterId);
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

  // Admin endpoint to sync roleplay data for production
  app.post("/api/admin/sync-roleplays", async (req, res) => {
    try {
      const authResult = await getAuthenticatedUser(req);
      if (!authResult?.user) {
        return res.status(401).json({ error: authResult?.error || "Unauthorized" });
      }

      const callerRole = authResult.user.role;
      if (callerRole !== "director" && callerRole !== "admin") {
        return res.status(403).json({ error: "Access denied - admins only" });
      }

      // Get chapter IDs
      const chapters = await storage.getAllChapters();
      const ch1 = chapters.find(c => c.title === "Sales Foundations");
      const ch2 = chapters.find(c => c.title === "Field Execution" || c.title === "Field Sales Process");

      if (!ch1 || !ch2) {
        return res.status(400).json({ error: "Chapters not found. Please seed chapters first." });
      }

      // Update chapter cover images
      await storage.updateChapterCoverImage(ch1.id, "/uploads/chapters/chapter-1-cover.png");
      await storage.updateChapterCoverImage(ch2.id, "/uploads/chapters/chapter-2-cover.png");

      // Define the canonical roleplay data with correct orderIndex, avatar, and chapterId
      const roleplayUpdates = [
        { id: "rp-01", orderIndex: 1, chapterId: ch1.id, avatar: "/uploads/persona-the-rushed-executive-1767319703503.png", phase: "Opening", placement: "First 10 Seconds", passCriteria: "Acknowledge time pressure + set ≤60s container + ask a qualifying control question", failConditions: "Pitches immediately or disengages", winningResponse: "Totally understand — I'll be quick. Give me 60 seconds, and if this doesn't apply I'll head out. Quick question: are you the one who usually handles the lawn here?" },
        { id: "rp-02", orderIndex: 2, chapterId: ch1.id, avatar: "/uploads/persona-the-skeptic-1767319717985.png", phase: "Opening", placement: "Handling Brush-Offs", passCriteria: "Acknowledge + reframe to specific issue + redirect", failConditions: "Argues or accepts rejection", winningResponse: "That's fair — most people weren't interested either until I pointed out one thing. Are you seeing weeds along the curb here, or is that already handled?" },
        { id: "rp-03", orderIndex: 3, chapterId: ch1.id, avatar: "/uploads/persona-the-gatekeeper-1767319732601.png", phase: "Opening", placement: "Compliance & Authority", passCriteria: "Acknowledge rule + clarify intent + request micro-permission", failConditions: "Debates policy", winningResponse: "I get that — I'm not selling at the door. I'm just flagging an issue I noticed on your lawn. Mind if I show you real quick?" },
        { id: "rp-04", orderIndex: 4, chapterId: ch1.id, avatar: "/uploads/persona-the-diy-pro-1767319746018.png", phase: "Turn & Burn", placement: "DIY Pushback", passCriteria: "Validate identity + differentiate + regain lead", failConditions: "Tries to convert DIY", winningResponse: "That makes sense — most homeowners here do. What I'm seeing is something DIY usually misses, especially this time of year. Can I show you where?" },
        { id: "rp-05", orderIndex: 5, chapterId: ch1.id, avatar: "/uploads/persona-the-loyalist-1767319759620.png", phase: "Turn & Burn", placement: "Existing Provider", passCriteria: "Acknowledge + remove replacement fear + isolate gap", failConditions: "Attacks competitor", winningResponse: "Got it — not trying to replace them. Quick check: are they addressing weeds like this along the edge, or is that still showing up?" },
        { id: "rp-06", orderIndex: 6, chapterId: ch1.id, avatar: "/uploads/persona-the-confused-homeowner-1767319773412.png", phase: "Turn & Burn", placement: "Purpose Statement", passCriteria: "State purpose clearly + direct next action", failConditions: "Rambles / over-explains", winningResponse: "Fair question. I'm here because we're fixing this exact weed issue on your street today. Let me show you where it's starting." },
        { id: "rp-07", orderIndex: 7, chapterId: ch2.id, avatar: "/uploads/persona-the-denialist-1767319787105.png", phase: "Lawn Walk", placement: "Identifying Issues", passCriteria: "Validate + isolate specific problem + visually point", failConditions: "Agrees and moves on", winningResponse: "Overall it does — this spot is what I'm flagging, though. See how it's spreading here?" },
        { id: "rp-08", orderIndex: 8, chapterId: ch2.id, avatar: "/uploads/persona-the-apathetic-owner-1767319801894.png", phase: "Lawn Walk", placement: "Educating on Spread", passCriteria: "Reframe consequence + keep discovery", failConditions: "Accepts apathy", winningResponse: "Totally — most don't until it spreads into the healthy grass. That's what I want to prevent here." },
        { id: "rp-09", orderIndex: 9, chapterId: ch2.id, avatar: "/uploads/persona-the-visual-skeptic-1767319815477.png", phase: "Lawn Walk", placement: "Showing, Not Telling", passCriteria: "Demonstrate visually, not verbally", failConditions: "Explains abstractly", winningResponse: "Let me point it out — right along this edge, that discoloration is the early sign." },
        { id: "rp-10", orderIndex: 10, chapterId: ch2.id, avatar: "/uploads/persona-the-price-shopper-1767319828752.png", phase: "Pricing", placement: "Before Quoting", passCriteria: "Defer price + anchor value first", failConditions: "Answers price immediately", winningResponse: "I'll get there — first let me show you what it would cover, because price only makes sense after that." },
        { id: "rp-11", orderIndex: 11, chapterId: ch2.id, avatar: "/uploads/persona-the-budget-watcher-1767319842969.png", phase: "Pricing", placement: "Objection Handling", passCriteria: "Normalize + re-anchor to outcome", failConditions: "Discounts immediately", winningResponse: "I hear that — most people said that before seeing the results. What mattered was fixing this permanently." },
        { id: "rp-12", orderIndex: 12, chapterId: ch2.id, avatar: "/uploads/persona-the-comparison-shopper-1767319859115.png", phase: "Pricing", placement: "Competitor Comparison", passCriteria: "Reframe to outcome, not price", failConditions: "Attacks competitor", winningResponse: "Probably — cheaper usually means fewer treatments. The real question is whether this problem actually gets solved." },
        { id: "rp-13", orderIndex: 13, chapterId: ch2.id, avatar: "/uploads/persona-the-cautious-buyer-1767319872711.png", phase: "Close", placement: "Payment Explanation", passCriteria: "Normalize process + remove risk + maintain close", failConditions: "Defensive justification", winningResponse: "Good question — everyone starts the same way so we can lock the spot and materials. If it doesn't work, you're not stuck — that's guaranteed." },
        { id: "rp-14", orderIndex: 14, chapterId: ch2.id, avatar: "/uploads/persona-the-indecisive-prospect-1767319886633.png", phase: "Close", placement: "Handling Stalls", passCriteria: "Isolate the concern + advance the decision", failConditions: "Accepts stall", winningResponse: "Totally — what part are you thinking through? Price, timing, or the treatment itself?" },
        { id: "rp-15", orderIndex: 15, chapterId: ch2.id, avatar: "/uploads/persona-the-defeater-1767319899954.png", phase: "Close", placement: "Securing Next Step", passCriteria: "Clarify decision criteria + regain control of next step", failConditions: "Leaves a card and exits", winningResponse: "Happy to — before I go, what would you be deciding after you look it over?" },
        { id: "rp-16", orderIndex: 16, chapterId: ch2.id, avatar: "/uploads/persona-the-ultimate-test-1767319913994.png", phase: "All Phases", placement: "Final Certification", passCriteria: "Maintain control across ≥3 phases + handle Phase 5 close objection", failConditions: "Loses control or fails to close", winningResponse: "Acknowledges → directs next step → stays calm → closes with confidence" }
      ];

      const results: any[] = [];
      
      for (const update of roleplayUpdates) {
        // Check if roleplay exists with this ID
        let roleplay = await storage.getRoleplay(update.id);
        
        if (roleplay) {
          // Update existing roleplay
          await storage.updateRoleplay(update.id, {
            orderIndex: update.orderIndex,
            chapterId: update.chapterId,
            avatar: update.avatar,
            phase: update.phase,
            placement: update.placement,
            passCriteria: update.passCriteria,
            failConditions: update.failConditions,
            winningResponse: update.winningResponse
          });
          results.push({ id: update.id, action: "updated" });
        } else {
          // Create new roleplay if it doesn't exist
          const roleplayNames: Record<string, { name: string; role: string; difficulty: string }> = {
            "rp-01": { name: '"I\'m actually really busy right now."', role: "The Rushed Executive", difficulty: "Beginner" },
            "rp-02": { name: '"Not interested."', role: "The Skeptic", difficulty: "Intermediate" },
            "rp-03": { name: '"No soliciting."', role: "The Gatekeeper", difficulty: "Advanced" },
            "rp-04": { name: '"I do my own lawn."', role: "The DIY Pro", difficulty: "Intermediate" },
            "rp-05": { name: '"We already have a lawn company."', role: "The Loyalist", difficulty: "Advanced" },
            "rp-06": { name: '"Why are you here?"', role: "The Confused Homeowner", difficulty: "Beginner" },
            "rp-07": { name: '"My lawn looks fine."', role: "The Denialist", difficulty: "Intermediate" },
            "rp-08": { name: '"Weeds don\'t bother me."', role: "The Apathetic Owner", difficulty: "Advanced" },
            "rp-09": { name: '"I don\'t see the issue."', role: "The Visual Skeptic", difficulty: "Intermediate" },
            "rp-10": { name: '"How much does it cost?"', role: "The Price Shopper", difficulty: "Intermediate" },
            "rp-11": { name: '"That\'s expensive."', role: "The Budget Watcher", difficulty: "Advanced" },
            "rp-12": { name: '"Another company is cheaper."', role: "The Comparison Shopper", difficulty: "Advanced" },
            "rp-13": { name: '"Why do I have to pay now?"', role: "The Cautious Buyer", difficulty: "Intermediate" },
            "rp-14": { name: '"I need to think about it."', role: "The Indecisive Prospect", difficulty: "Advanced" },
            "rp-15": { name: '"I\'ll call you / send me something."', role: "The Defeater", difficulty: "Intermediate" },
            "rp-16": { name: "Final Certification Assessment", role: "The Ultimate Test", difficulty: "Expert" }
          };
          
          const meta = roleplayNames[update.id];
          if (meta) {
            await storage.createRoleplay({
              id: update.id,
              name: meta.name,
              role: meta.role,
              description: `${update.phase} → ${update.placement}. ${update.passCriteria}`,
              avatar: update.avatar,
              traits: ["Sales", "Objection Handling"],
              difficulty: meta.difficulty,
              stats: { resistance: 50, objections: 50, buy_signal: 50 },
              chapterId: update.chapterId,
              orderIndex: update.orderIndex,
              phase: update.phase,
              placement: update.placement,
              passCriteria: update.passCriteria,
              failConditions: update.failConditions,
              winningResponse: update.winningResponse,
              losingResponse: ""
            });
            results.push({ id: update.id, action: "created" });
          }
        }
      }

      res.json({ 
        success: true, 
        message: `Synced ${results.length} roleplays`,
        details: results,
        chapter1Id: ch1.id,
        chapter2Id: ch2.id
      });
    } catch (error: any) {
      console.error("Sync roleplays error:", error);
      res.status(500).json({ error: error.message || "Failed to sync roleplays" });
    }
  });

  return httpServer;
}
