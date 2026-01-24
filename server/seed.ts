import { db } from './db';
import { chapters, roleplays, buyerPersonas, comicStories, comicPanels } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { CHAPTER_SEED_DATA, ROLEPLAY_SEED_DATA, BUYER_PERSONA_SEED_DATA } from './seed-data';
import { PLAYBOOK_STORIES_SEED, PLAYBOOK_PANELS_SEED } from './playbook-seed-data';

export async function seedDatabase(): Promise<void> {
  console.log('Starting idempotent database seed...');
  
  try {
    const chapterSlugToId = new Map<string, string>();
    
    for (const chapterData of CHAPTER_SEED_DATA) {
      const existing = await db.select().from(chapters).where(eq(chapters.slug, chapterData.slug));
      
      if (existing.length > 0) {
        await db.update(chapters)
          .set({
            title: chapterData.title,
            subtitle: chapterData.subtitle,
            description: chapterData.description,
            duration: chapterData.duration,
            pdfUrl: chapterData.pdfUrl,
            coverImage: chapterData.coverImage,
            agenda: chapterData.agenda,
            slides: chapterData.slides,
            slideCount: chapterData.slideCount,
            orderIndex: chapterData.orderIndex,
          })
          .where(eq(chapters.slug, chapterData.slug));
        
        chapterSlugToId.set(chapterData.slug, existing[0].id);
        console.log(`  Updated chapter: ${chapterData.title}`);
      } else {
        const [newChapter] = await db.insert(chapters)
          .values({
            slug: chapterData.slug,
            title: chapterData.title,
            subtitle: chapterData.subtitle,
            description: chapterData.description,
            duration: chapterData.duration,
            pdfUrl: chapterData.pdfUrl,
            coverImage: chapterData.coverImage,
            agenda: chapterData.agenda,
            slides: chapterData.slides,
            slideCount: chapterData.slideCount,
            orderIndex: chapterData.orderIndex,
          })
          .returning();
        
        chapterSlugToId.set(chapterData.slug, newChapter.id);
        console.log(`  Created chapter: ${chapterData.title}`);
      }
    }

    for (const roleplayData of ROLEPLAY_SEED_DATA) {
      const chapterId = chapterSlugToId.get(roleplayData.chapterSlug);
      
      const existing = await db.select().from(roleplays).where(eq(roleplays.slug, roleplayData.slug));
      
      if (existing.length > 0) {
        await db.update(roleplays)
          .set({
            name: roleplayData.name,
            role: roleplayData.role,
            description: roleplayData.description,
            avatar: roleplayData.avatar,
            traits: roleplayData.traits,
            difficulty: roleplayData.difficulty,
            stats: roleplayData.stats,
            chapterId: chapterId || null,
            phase: roleplayData.phase,
            placement: roleplayData.placement,
            passCriteria: roleplayData.passCriteria,
            failConditions: roleplayData.failConditions,
            winningResponse: roleplayData.winningResponse,
            losingResponse: roleplayData.losingResponse,
            orderIndex: roleplayData.orderIndex,
          })
          .where(eq(roleplays.slug, roleplayData.slug));
        
        console.log(`  Updated roleplay: ${roleplayData.role}`);
      } else {
        await db.insert(roleplays)
          .values({
            slug: roleplayData.slug,
            name: roleplayData.name,
            role: roleplayData.role,
            description: roleplayData.description,
            avatar: roleplayData.avatar,
            traits: roleplayData.traits,
            difficulty: roleplayData.difficulty,
            stats: roleplayData.stats,
            chapterId: chapterId || null,
            phase: roleplayData.phase,
            placement: roleplayData.placement,
            passCriteria: roleplayData.passCriteria,
            failConditions: roleplayData.failConditions,
            winningResponse: roleplayData.winningResponse,
            losingResponse: roleplayData.losingResponse,
            orderIndex: roleplayData.orderIndex,
          });
        
        console.log(`  Created roleplay: ${roleplayData.role}`);
      }
    }

    for (const personaData of BUYER_PERSONA_SEED_DATA) {
      const existing = await db.select().from(buyerPersonas).where(eq(buyerPersonas.slug, personaData.slug));
      
      if (existing.length > 0) {
        await db.update(buyerPersonas)
          .set({
            name: personaData.name,
            subtitle: personaData.subtitle,
            avatar: personaData.avatar,
            attributes: personaData.attributes,
            whatTheyCareAbout: personaData.whatTheyCareAbout,
            whatTriggersResistance: personaData.whatTriggersResistance,
            howToWin: personaData.howToWin,
            bestPlays: personaData.bestPlays,
            orderIndex: personaData.orderIndex,
          })
          .where(eq(buyerPersonas.slug, personaData.slug));
        
        console.log(`  Updated buyer persona: ${personaData.name}`);
      } else {
        await db.insert(buyerPersonas)
          .values({
            slug: personaData.slug,
            name: personaData.name,
            subtitle: personaData.subtitle,
            avatar: personaData.avatar,
            attributes: personaData.attributes,
            whatTheyCareAbout: personaData.whatTheyCareAbout,
            whatTriggersResistance: personaData.whatTriggersResistance,
            howToWin: personaData.howToWin,
            bestPlays: personaData.bestPlays,
            orderIndex: personaData.orderIndex,
          });
        
        console.log(`  Created buyer persona: ${personaData.name}`);
      }
    }

    // Seed Victory Playbook stories and panels
    for (const storyData of PLAYBOOK_STORIES_SEED) {
      const existing = await db.select().from(comicStories).where(eq(comicStories.id, storyData.id));
      
      if (existing.length > 0) {
        await db.update(comicStories)
          .set({
            roleplayId: storyData.roleplayId,
            title: storyData.title,
            subtitle: storyData.subtitle,
            phase: storyData.phase,
            description: storyData.description,
            orderIndex: storyData.orderIndex,
          })
          .where(eq(comicStories.id, storyData.id));
        
        console.log(`  Updated playbook story: ${storyData.title}`);
      } else {
        await db.insert(comicStories)
          .values({
            id: storyData.id,
            roleplayId: storyData.roleplayId,
            title: storyData.title,
            subtitle: storyData.subtitle,
            phase: storyData.phase,
            description: storyData.description,
            orderIndex: storyData.orderIndex,
          });
        
        console.log(`  Created playbook story: ${storyData.title}`);
      }
    }

    for (const panelData of PLAYBOOK_PANELS_SEED) {
      const existing = await db.select().from(comicPanels).where(eq(comicPanels.id, panelData.id));
      
      if (existing.length > 0) {
        await db.update(comicPanels)
          .set({
            storyId: panelData.storyId,
            panelOrder: panelData.panelOrder,
            imageUrl: panelData.imageUrl,
            speaker: panelData.speaker,
            dialogue: panelData.dialogue,
            setting: panelData.setting,
            emotion: panelData.emotion,
          })
          .where(eq(comicPanels.id, panelData.id));
      } else {
        await db.insert(comicPanels)
          .values({
            id: panelData.id,
            storyId: panelData.storyId,
            panelOrder: panelData.panelOrder,
            imageUrl: panelData.imageUrl,
            speaker: panelData.speaker,
            dialogue: panelData.dialogue,
            setting: panelData.setting,
            emotion: panelData.emotion,
          });
      }
    }
    console.log(`  Seeded ${PLAYBOOK_PANELS_SEED.length} playbook panels`);

    console.log('Idempotent database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
