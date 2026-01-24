import { db } from "../server/db";
import { comicStories, comicPanels } from "../shared/schema";
import * as fs from "fs";

async function exportPlaybookData() {
  console.log("Exporting playbook data...");
  
  const stories = await db.select().from(comicStories).orderBy(comicStories.orderIndex);
  const panels = await db.select().from(comicPanels).orderBy(comicPanels.storyId, comicPanels.panelOrder);
  
  console.log(`Found ${stories.length} stories and ${panels.length} panels`);
  
  let sql = `-- Victory Playbook Data Export
-- Run this SQL in the production database pane
-- Generated on ${new Date().toISOString()}

-- Clear existing data (if any)
DELETE FROM comic_panels;
DELETE FROM comic_stories;

-- Insert Stories
`;

  for (const story of stories) {
    const escapedId = story.id.replace(/'/g, "''");
    const escapedRoleplayId = (story.roleplayId || '').replace(/'/g, "''");
    const escapedTitle = story.title.replace(/'/g, "''");
    const escapedSubtitle = (story.subtitle || '').replace(/'/g, "''");
    const escapedPhase = (story.phase || '').replace(/'/g, "''");
    const escapedDescription = (story.description || '').replace(/'/g, "''");
    
    sql += `INSERT INTO comic_stories (id, roleplay_id, title, subtitle, phase, description, order_index) VALUES ('${escapedId}', '${escapedRoleplayId}', '${escapedTitle}', '${escapedSubtitle}', '${escapedPhase}', '${escapedDescription}', ${story.orderIndex});\n`;
  }
  
  sql += `\n-- Insert Panels\n`;
  
  for (const panel of panels) {
    const escapedId = panel.id.replace(/'/g, "''");
    const escapedStoryId = panel.storyId.replace(/'/g, "''");
    const escapedImageUrl = (panel.imageUrl || '').replace(/'/g, "''");
    const escapedSpeaker = (panel.speaker || '').replace(/'/g, "''");
    const escapedDialogue = (panel.dialogue || '').replace(/'/g, "''");
    const escapedSetting = (panel.setting || '').replace(/'/g, "''");
    const escapedEmotion = (panel.emotion || '').replace(/'/g, "''");
    
    sql += `INSERT INTO comic_panels (id, story_id, panel_order, image_url, speaker, dialogue, setting, emotion) VALUES ('${escapedId}', '${escapedStoryId}', ${panel.panelOrder}, '${escapedImageUrl}', '${escapedSpeaker}', '${escapedDialogue}', '${escapedSetting}', '${escapedEmotion}');\n`;
  }
  
  fs.writeFileSync("scripts/production-playbook.sql", sql);
  console.log(`\nSQL script saved to scripts/production-playbook.sql (${sql.length} bytes)`);
}

exportPlaybookData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
