import { db } from "../server/db";
import { comicStories, comicPanels } from "../shared/schema";
import { eq } from "drizzle-orm";
import { EXTENDED_STORIES, NEW_HOMEOWNERS } from "./extended-stories-data";
import { randomUUID } from "crypto";

async function seedExtendedStories() {
  console.log("=== Seeding Extended Stories ===\n");

  for (const story of EXTENDED_STORIES) {
    const existingStory = await db.select().from(comicStories).where(
      eq(comicStories.roleplayId, story.roleplayId)
    );

    if (existingStory.length > 0) {
      console.log(`Story "${story.title}" already exists, skipping...`);
      continue;
    }

    const storyId = randomUUID();
    
    await db.insert(comicStories).values({
      id: storyId,
      roleplayId: story.roleplayId,
      title: story.title,
      subtitle: story.subtitle,
      phase: story.phase,
      description: story.description,
      orderIndex: story.orderIndex,
    });

    console.log(`Created story: ${story.title} (${story.panels.length} panels)`);

    for (const panel of story.panels) {
      await db.insert(comicPanels).values({
        id: randomUUID(),
        storyId: storyId,
        panelOrder: panel.panelOrder,
        speaker: panel.speaker,
        dialogue: panel.dialogue,
        setting: panel.setting,
        emotion: panel.emotion,
        imageUrl: null,
      });
    }

    console.log(`  - Inserted ${story.panels.length} panels`);
  }

  console.log("\n=== Extended Stories Seeded Successfully ===");
}

seedExtendedStories().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
