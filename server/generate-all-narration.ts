import { db } from "./db";
import { chapters } from "@shared/schema";
import { eq } from "drizzle-orm";
import { generateNarrationScript, generateNarrationAudio } from "./narration-service";
import fs from "fs";

const LOG_FILE = "/tmp/narration-gen.log";

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  process.stdout.write(line);
  fs.appendFileSync(LOG_FILE, line);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      log(`  RETRY ${attempt}/${retries}: ${err.message}`);
      if (attempt === retries) throw err;
      await sleep(delay * attempt);
    }
  }
  throw new Error("unreachable");
}

async function generateAllNarration() {
  fs.writeFileSync(LOG_FILE, "");
  const allChapters = await db.select().from(chapters).orderBy(chapters.orderIndex);

  log(`=== NARRATION GENERATION ===`);
  log(`Found ${allChapters.length} chapters`);

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const chapter of allChapters) {
    const slides = (chapter.slides as any[]) || [];
    if (slides.length === 0) {
      log(`[SKIP] ${chapter.title} - no slides`);
      continue;
    }

    const needsCount = slides.filter((s: any) => !s.narrationScript || !s.narrationAudioUrl).length;
    if (needsCount === 0) {
      log(`[CACHED] ${chapter.title} - all ${slides.length} slides already narrated`);
      totalSkipped += slides.length;
      continue;
    }

    log(`\n[CHAPTER] ${chapter.title} (${chapter.slug}) - ${needsCount}/${slides.length} slides need narration`);

    let updated = false;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as any;

      if (slide.narrationScript && slide.narrationAudioUrl) {
        log(`  [${i + 1}/${slides.length}] CACHED: ${slide.title}`);
        totalSkipped++;
        continue;
      }

      try {
        log(`  [${i + 1}/${slides.length}] Script: ${slide.title}...`);
        const script = await withRetry(() => generateNarrationScript(chapter.title, i, slide));
        log(`  [${i + 1}/${slides.length}] Script OK (${script.length} chars). Audio...`);

        const audioUrl = await withRetry(() => generateNarrationAudio(chapter.slug || chapter.id, i, script));
        log(`  [${i + 1}/${slides.length}] Done: ${audioUrl}`);

        slides[i] = { ...slides[i], narrationScript: script, narrationAudioUrl: audioUrl };
        updated = true;
        totalGenerated++;

        await sleep(1000);
      } catch (err: any) {
        log(`  [${i + 1}/${slides.length}] FAILED after retries: ${err.message}`);
        totalFailed++;
      }
    }

    if (updated) {
      await db.update(chapters).set({ slides }).where(eq(chapters.id, chapter.id));
      log(`  [SAVED] ${chapter.title}`);
    }
  }

  log(`\n=== COMPLETE ===`);
  log(`Generated: ${totalGenerated} | Skipped: ${totalSkipped} | Failed: ${totalFailed}`);
  log(`Total: ${totalGenerated + totalSkipped + totalFailed} slides`);

  process.exit(0);
}

generateAllNarration().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});
