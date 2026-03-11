import { db } from "./db";
import { migrations } from "@shared/schema";
import { storage } from "./storage";
import { ensurePredefinedQuizzesSeeded } from "./quiz-service";

interface MigrationDef {
  id: string;
  name: string;
  run: () => Promise<void>;
}

const allMigrations: MigrationDef[] = [
  {
    id: "add-pitch-narration-columns-2026-03-11",
    name: "Add narration_script and narration_audio_url to pitch_deck_slides",
    run: async () => {
      await db.execute(`
        ALTER TABLE pitch_deck_slides ADD COLUMN IF NOT EXISTS narration_script TEXT;
        ALTER TABLE pitch_deck_slides ADD COLUMN IF NOT EXISTS narration_audio_url TEXT;
      `);
      console.log("  Added narration columns to pitch_deck_slides");
    }
  },
  {
    id: "restore-quiz-data-2026-02-04",
    name: "Restore quiz data and recalculate scores from quiz_attempts",
    run: async () => {
      console.log("Running one-time quiz data restoration...");
      
      // Step 1: Reseed missing quizzes using existing quiz service
      await ensurePredefinedQuizzesSeeded();
      console.log("  Ensured predefined quizzes are seeded");

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
      
      console.log(`  Updated ${scoresUpdated} quiz scores from ${allQuizAttempts.length} attempts`);
      console.log("Quiz data restoration complete!");
    }
  }
];

export async function runMigrations(): Promise<void> {
  console.log("Checking for pending one-time migrations...");
  
  // Ensure migrations table exists (drizzle-kit push should handle this)
  try {
    const executedMigrations = await db.select().from(migrations);
    const executedIds = new Set(executedMigrations.map(m => m.id));
    
    const pendingMigrations = allMigrations.filter(m => !executedIds.has(m.id));
    
    if (pendingMigrations.length === 0) {
      console.log("No pending migrations.");
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migration(s)`);
    
    for (const migration of pendingMigrations) {
      console.log(`Running migration: ${migration.name}`);
      try {
        await migration.run();
        
        // Mark migration as complete
        await db.insert(migrations).values({
          id: migration.id,
          name: migration.name,
        });
        
        console.log(`Migration "${migration.id}" completed successfully`);
      } catch (error) {
        console.error(`Migration "${migration.id}" failed:`, error);
        throw error;
      }
    }
    
    console.log("All migrations completed.");
  } catch (error: any) {
    // If migrations table doesn't exist yet, run all migrations
    if (error.message?.includes('relation "migrations" does not exist')) {
      console.log("Migrations table not found - will be created on next db:push");
      return;
    }
    throw error;
  }
}
