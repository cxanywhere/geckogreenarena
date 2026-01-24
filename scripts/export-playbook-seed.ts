import { db } from "../server/db";
import { comicStories, comicPanels } from "../shared/schema";
import * as fs from "fs";

async function exportPlaybookSeed() {
  const stories = await db.select().from(comicStories).orderBy(comicStories.orderIndex);
  const panels = await db.select().from(comicPanels).orderBy(comicPanels.storyId, comicPanels.panelOrder);
  
  let ts = `// Victory Playbook Seed Data
// Auto-generated from development database

export const PLAYBOOK_STORIES_SEED = ${JSON.stringify(stories, null, 2)};

export const PLAYBOOK_PANELS_SEED = ${JSON.stringify(panels, null, 2)};
`;

  fs.writeFileSync("server/playbook-seed-data.ts", ts);
  console.log(`Exported ${stories.length} stories and ${panels.length} panels to server/playbook-seed-data.ts`);
}

exportPlaybookSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
