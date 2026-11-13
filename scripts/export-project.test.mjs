import test from "node:test";
import assert from "node:assert/strict";
import { included, sanitizeReplit, hasCredential, collect } from "./export-project.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

test("includes sources, lockfile, runtime and uploaded media", () => {
  for (const name of ["package-lock.json", "client/src/App.tsx", "public/uploads/narration/a.wav", "attached_assets/training_slides/a.png"])
    assert.equal(included(name), true, name);
});
test("excludes secrets, caches, archives and source conversations", () => {
  for (const name of [".git/config", ".local/state/a", "node_modules/a.js", "generated-artifacts/arena-project.zip", "server/.env.production", "client/.npmrc", "public/private.key", "server/data.sql", "scripts/dist/a.js", "attached_assets/Pasted-chat.txt", "public/old.zip"])
    assert.equal(included(name), false, name);
});
test("strips environment values without stripping deployment settings", () => {
  assert.equal(sanitizeReplit('[env]\nVALUE="private"\n[userenv.shared]\nKEY="private"\n[deployment]\nrun=["npm","start"]'),
    '[deployment]\nrun=["npm","start"]');
});
test("detects common embedded credential formats", () => {
  assert.equal(hasCredential(["postgres://", "user:password", "@example.invalid/db"].join("")), true);
  assert.equal(hasCredential("process.env.DATABASE_URL"), false);
});
test("rejects symlinks rather than following them", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "export-test-"));
  try {
    await fs.mkdir(path.join(root, "server"));
    await fs.symlink("/etc/passwd", path.join(root, "server", "linked"));
    await assert.rejects(collect(root, "server"), /symlink/);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
test("traverses uploaded media directories", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "export-media-test-"));
  try {
    await fs.mkdir(path.join(root, "attached_assets", "training_slides"), { recursive: true });
    await fs.writeFile(path.join(root, "attached_assets", "training_slides", "a.png"), "image");
    await fs.writeFile(path.join(root, "attached_assets", "chat.txt"), "private conversation");
    assert.deepEqual(await collect(root, "attached_assets"), ["attached_assets/training_slides/a.png"]);
  } finally { await fs.rm(root, { recursive: true, force: true }); }
});
