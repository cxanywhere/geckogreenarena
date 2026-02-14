import { db } from './db';
import { chapters } from '@shared/schema';
import { generateSlideImage } from './gemini';
import { eq } from 'drizzle-orm';

async function generateAllSlides() {
  console.log('Starting slide image generation for all chapters...\n');
  
  const allChapters = await db.select().from(chapters).orderBy(chapters.orderIndex);
  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const chapter of allChapters) {
    const slides = (chapter.slides as any[]) || [];
    let chapterGenerated = 0;

    console.log(`\n📖 Chapter: ${chapter.title} (${slides.length} slides)`);

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      if (!slide.imagePrompt) {
        console.log(`  ⏭️  Slide ${i + 1}: ${slide.title} — no image prompt, skipping`);
        totalSkipped++;
        continue;
      }
      
      if (slide.imageUrl) {
        console.log(`  ✅ Slide ${i + 1}: ${slide.title} — already has image`);
        totalSkipped++;
        continue;
      }

      console.log(`  🎨 Slide ${i + 1}: ${slide.title} — generating...`);
      
      try {
        const result = await generateSlideImage(chapter.slug || chapter.id, i, slide.imagePrompt);
        
        if (result.success && result.imageUrl) {
          slides[i] = { ...slide, imageUrl: result.imageUrl };
          chapterGenerated++;
          totalGenerated++;
          console.log(`  ✅ Slide ${i + 1}: ${slide.title} — saved: ${result.imageUrl}`);
        } else {
          totalFailed++;
          console.log(`  ❌ Slide ${i + 1}: ${slide.title} — FAILED: ${result.error}`);
        }
      } catch (error: any) {
        totalFailed++;
        console.log(`  ❌ Slide ${i + 1}: ${slide.title} — ERROR: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (chapterGenerated > 0) {
      await db.update(chapters).set({ slides }).where(eq(chapters.id, chapter.id));
      console.log(`  💾 Saved ${chapterGenerated} new slide images to database for ${chapter.title}`);
    }
  }

  console.log(`\n\n========================================`);
  console.log(`SLIDE GENERATION COMPLETE`);
  console.log(`  Generated: ${totalGenerated}`);
  console.log(`  Skipped: ${totalSkipped}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(`========================================\n`);
  
  process.exit(0);
}

generateAllSlides().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
