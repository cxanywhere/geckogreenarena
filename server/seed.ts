import { db } from './db';
import { chapters, roleplays, buyerPersonas, comicStories, comicPanels, pitchDecks, pitchDeckSlides, battlecards, basecampUnits, basecampLessons, basecampQuestions } from '@shared/schema';
import { eq, notInArray } from 'drizzle-orm';
import { CHAPTER_SEED_DATA, ROLEPLAY_SEED_DATA } from './seed-data-new';
import { BUYER_PERSONA_SEED_DATA } from './seed-data';
import { PLAYBOOK_STORIES_SEED, PLAYBOOK_PANELS_SEED } from './playbook-seed-data';
import { hubspotDeck, hubspotSlides, HUBSPOT_DECK_ID } from './pitch-deck-seed';
import { seedAbmData } from './abm-seed';
import { BATTLECARD_SEED_DATA } from './battlecard-seed-data';
import { BASECAMP_UNITS, BASECAMP_LESSONS, BASECAMP_QUESTIONS } from './basecamp-seed-data';
import {
  CHAPTER_GENERATED_ASSETS,
  ROLEPLAY_GENERATED_AVATARS,
  PERSONA_GENERATED_AVATARS,
  PITCH_DECK_GENERATED_ASSETS,
  PITCH_SLIDE_GENERATED_ASSETS,
  PANEL_GENERATED_IMAGES,
} from './seed-generated-assets';

export async function seedDatabase(): Promise<void> {
  console.log('Starting idempotent database seed...');
  
  try {
    const validChapterSlugs = CHAPTER_SEED_DATA.map(c => c.slug);
    const validRoleplaySlugs = ROLEPLAY_SEED_DATA.map(r => r.slug);

    const oldChapters = await db.select({ slug: chapters.slug }).from(chapters)
      .where(notInArray(chapters.slug, validChapterSlugs));
    if (oldChapters.length > 0) {
      console.log(`  Removing ${oldChapters.length} outdated chapters: ${oldChapters.map(c => c.slug).join(', ')}`);
      await db.delete(chapters).where(notInArray(chapters.slug, validChapterSlugs));
    }

    const oldRoleplays = await db.select({ slug: roleplays.slug }).from(roleplays)
      .where(notInArray(roleplays.slug, validRoleplaySlugs));
    if (oldRoleplays.length > 0) {
      console.log(`  Removing ${oldRoleplays.length} outdated roleplays: ${oldRoleplays.map(r => r.slug).join(', ')}`);
      await db.delete(roleplays).where(notInArray(roleplays.slug, validRoleplaySlugs));
    }

    const chapterSlugToId = new Map<string, string>();
    
    for (const chapterData of CHAPTER_SEED_DATA) {
      const existing = await db.select().from(chapters).where(eq(chapters.slug, chapterData.slug));
      
      if (existing.length > 0) {
        const existingSlides = (existing[0].slides as any[]) || [];
        const mergedSlides = chapterData.slides.map((newSlide: any, idx: number) => {
          const existingSlide = existingSlides[idx];
          if (existingSlide) {
            const merged = { ...newSlide };
            if (existingSlide.imageUrl && !newSlide.imageUrl) merged.imageUrl = existingSlide.imageUrl;
            if (existingSlide.narrationScript) merged.narrationScript = existingSlide.narrationScript;
            if (existingSlide.narrationAudioUrl) merged.narrationAudioUrl = existingSlide.narrationAudioUrl;
            return merged;
          }
          return newSlide;
        });

        await db.update(chapters)
          .set({
            title: chapterData.title,
            subtitle: chapterData.subtitle,
            description: chapterData.description,
            duration: chapterData.duration,
            pdfUrl: chapterData.pdfUrl,
            coverImage: existing[0].coverImage || chapterData.coverImage,
            agenda: chapterData.agenda,
            slides: mergedSlides,
            slideCount: chapterData.slideCount,
            orderIndex: chapterData.orderIndex,
          })
          .where(eq(chapters.slug, chapterData.slug));
        
        chapterSlugToId.set(chapterData.slug, existing[0].id);
        console.log(`  Updated chapter: ${chapterData.title}`);
      } else {
        const generatedAssets = CHAPTER_GENERATED_ASSETS[chapterData.slug];
        const seedCoverImage = generatedAssets?.coverImage || chapterData.coverImage;
        const seedSlides = chapterData.slides.map((slide: any, idx: number) => {
          const gen = generatedAssets?.slides?.[idx];
          if (gen) {
            return {
              ...slide,
              imageUrl: gen.imageUrl || slide.imageUrl,
              narrationScript: gen.narrationScript || slide.narrationScript,
              narrationAudioUrl: gen.narrationAudioUrl || slide.narrationAudioUrl,
            };
          }
          return slide;
        });

        const [newChapter] = await db.insert(chapters)
          .values({
            slug: chapterData.slug,
            title: chapterData.title,
            subtitle: chapterData.subtitle,
            description: chapterData.description,
            duration: chapterData.duration,
            pdfUrl: chapterData.pdfUrl,
            coverImage: seedCoverImage,
            agenda: chapterData.agenda,
            slides: seedSlides,
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
            avatar: existing[0].avatar || roleplayData.avatar,
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
        const generatedAvatar = ROLEPLAY_GENERATED_AVATARS[roleplayData.slug];
        await db.insert(roleplays)
          .values({
            slug: roleplayData.slug,
            name: roleplayData.name,
            role: roleplayData.role,
            description: roleplayData.description,
            avatar: generatedAvatar || roleplayData.avatar,
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

    const validPersonaSlugs = BUYER_PERSONA_SEED_DATA.map(p => p.slug);
    const stalePersonas = await db.select().from(buyerPersonas).where(notInArray(buyerPersonas.slug, validPersonaSlugs));
    if (stalePersonas.length > 0) {
      await db.delete(buyerPersonas).where(notInArray(buyerPersonas.slug, validPersonaSlugs));
      console.log(`  Purged ${stalePersonas.length} stale buyer personas: ${stalePersonas.map(p => p.slug).join(', ')}`);
    }

    for (const personaData of BUYER_PERSONA_SEED_DATA) {
      const existing = await db.select().from(buyerPersonas).where(eq(buyerPersonas.slug, personaData.slug));
      
      if (existing.length > 0) {
        await db.update(buyerPersonas)
          .set({
            name: personaData.name,
            subtitle: personaData.subtitle,
            avatar: existing[0].avatar || personaData.avatar,
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
        const generatedAvatar = PERSONA_GENERATED_AVATARS[personaData.slug];
        await db.insert(buyerPersonas)
          .values({
            slug: personaData.slug,
            name: personaData.name,
            subtitle: personaData.subtitle,
            avatar: generatedAvatar || personaData.avatar,
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

    const validPanelIds = PLAYBOOK_PANELS_SEED.map(p => p.id);
    const validStoryIds = PLAYBOOK_STORIES_SEED.map(s => s.id);

    const deletedPanels = await db.delete(comicPanels)
      .where(notInArray(comicPanels.id, validPanelIds))
      .returning({ id: comicPanels.id });
    if (deletedPanels.length > 0) {
      console.log(`  Removed ${deletedPanels.length} stale playbook panels`);
    }

    const deletedStories = await db.delete(comicStories)
      .where(notInArray(comicStories.id, validStoryIds))
      .returning({ id: comicStories.id });
    if (deletedStories.length > 0) {
      console.log(`  Removed ${deletedStories.length} stale playbook stories`);
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
        const generatedImage = PANEL_GENERATED_IMAGES[panelData.id];
        await db.insert(comicPanels)
          .values({
            id: panelData.id,
            storyId: panelData.storyId,
            panelOrder: panelData.panelOrder,
            imageUrl: generatedImage || panelData.imageUrl,
            speaker: panelData.speaker,
            dialogue: panelData.dialogue,
            setting: panelData.setting,
            emotion: panelData.emotion,
          });
      }
    }
    console.log(`  Seeded ${PLAYBOOK_PANELS_SEED.length} playbook panels`);

    // Seed pitch decks
    const existingDeck = await db.select().from(pitchDecks).where(eq(pitchDecks.id, HUBSPOT_DECK_ID));
    if (existingDeck.length === 0) {
      const deckWithAssets = {
        ...hubspotDeck,
        coverImage: PITCH_DECK_GENERATED_ASSETS.coverImage || hubspotDeck.coverImage,
        buyerAvatar: PITCH_DECK_GENERATED_ASSETS.buyerAvatar || hubspotDeck.buyerAvatar,
      };
      await db.insert(pitchDecks).values(deckWithAssets as any);
      console.log(`  Created pitch deck: ${hubspotDeck.clientName}`);
      
      for (const slideData of hubspotSlides) {
        const genSlide = PITCH_SLIDE_GENERATED_ASSETS[slideData.slideOrder];
        const slideWithAssets = genSlide ? {
          ...slideData,
          imageUrl: genSlide.imageUrl || undefined,
          narrationScript: genSlide.narrationScript || undefined,
          narrationAudioUrl: genSlide.narrationAudioUrl || undefined,
        } : slideData;
        await db.insert(pitchDeckSlides).values(slideWithAssets as any);
      }
      console.log(`  Seeded ${hubspotSlides.length} pitch deck slides`);
    } else {
      console.log(`  Pitch deck "${hubspotDeck.clientName}" already exists, skipping`);
    }

    const expectedTitles = BATTLECARD_SEED_DATA.map(b => b.title);
    const existingBattlecards = await db.select({ id: battlecards.id, title: battlecards.title }).from(battlecards);
    const existingTitles = existingBattlecards.map(b => b.title);
    const needsReseed = existingBattlecards.length === 0 ||
      existingBattlecards.length !== BATTLECARD_SEED_DATA.length ||
      !expectedTitles.every(t => existingTitles.includes(t));

    if (needsReseed) {
      await db.delete(battlecards);
      for (const bc of BATTLECARD_SEED_DATA) {
        await db.insert(battlecards).values({
          phase: bc.phase,
          title: bc.title,
          situation: bc.situation,
          script: bc.script,
          keyPoints: bc.keyPoints,
          type: bc.type,
          image: bc.image,
        });
      }
      console.log(`  Seeded ${BATTLECARD_SEED_DATA.length} battlecards (replaced ${existingBattlecards.length} old)`);
    } else {
      console.log(`  Battlecards already seeded (${existingBattlecards.length}), skipping`);
    }

    // Seed ABM account and committee members
    await seedAbmData();

    // Seed Base Camp units, lessons, and questions
    await seedBasecampData();

    console.log('Idempotent database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

async function seedBasecampData(): Promise<void> {
  const existingUnits = await db.select().from(basecampUnits);
  
  if (existingUnits.length >= BASECAMP_UNITS.length) {
    console.log(`  Base Camp already seeded (${existingUnits.length} units), skipping`);
    return;
  }

  console.log('  Seeding Base Camp curriculum...');
  
  await db.delete(basecampQuestions);
  await db.delete(basecampLessons);
  await db.delete(basecampUnits);

  for (const unitData of BASECAMP_UNITS) {
    const [unit] = await db.insert(basecampUnits).values(unitData).returning();
    console.log(`    Unit: ${unit.title}`);

    const lessonsForUnit = BASECAMP_LESSONS[unitData.slug] || [];
    for (const lessonData of lessonsForUnit) {
      const [lesson] = await db.insert(basecampLessons).values({
        ...lessonData,
        unitId: unit.id,
        conceptCard: lessonData.conceptCard,
      }).returning();

      const questionsForLesson = BASECAMP_QUESTIONS[lessonData.slug] || [];
      for (const questionData of questionsForLesson) {
        await db.insert(basecampQuestions).values({
          ...questionData,
          lessonId: lesson.id,
          options: questionData.options,
          visual: questionData.visual || null,
        });
      }
      console.log(`      Lesson: ${lesson.title} (${questionsForLesson.length} questions)`);
    }
  }

  const totalLessons = Object.values(BASECAMP_LESSONS).reduce((s, l) => s + l.length, 0);
  const totalQuestions = Object.values(BASECAMP_QUESTIONS).reduce((s, q) => s + q.length, 0);
  console.log(`  Base Camp seeded: ${BASECAMP_UNITS.length} units, ${totalLessons} lessons, ${totalQuestions} questions`);
}
