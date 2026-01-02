import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserProgressSchema, insertRoleplayAttemptSchema } from "@shared/schema";
import { z } from "zod";
import { startRoleplayConversation, continueRoleplayConversation, evaluateRoleplay, generateChapterImage, generatePersonaImage, type RoleplayMessage, type RoleplayScenario } from "./gemini";
import { getOrGenerateQuizForSlide, submitQuizAnswer } from "./quiz-service";
import { vapiService } from "./vapi-service";
import { getVapiRoleplayConfig, convertRoleplayToVapiConfig, VAPI_ROLEPLAY_CONFIGS } from "./vapi-config";

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

      res.json({ user: { ...user, password: undefined } });
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
      const { roleplayId } = req.body;
      if (!roleplayId) {
        return res.status(400).json({ error: "roleplayId is required" });
      }

      // First try to get roleplay from database
      const dbRoleplay = await storage.getRoleplay(roleplayId);
      if (dbRoleplay) {
        // Convert database roleplay to VAPI config
        const result = await vapiService.startWebCallWithDbRoleplay({
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
        res.json({ 
          callId: result.callId,
          roleplayConfig: result.config
        });
        return;
      }

      // Fallback to hardcoded configs for legacy roleplays
      const result = await vapiService.startWebCall(roleplayId);
      res.json({ 
        callId: result.callId,
        roleplayConfig: result.config
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
            await storage.createRoleplayAttempt({
              userId,
              roleplayId,
              score: feedback.overallScore,
              passed: passed ? 1 : 0,
              feedback: JSON.stringify({
                ...feedback,
                recordingUrl: transcriptData.recordingUrl
              })
            });
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
          difficulty: config.difficulty
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

  return httpServer;
}
