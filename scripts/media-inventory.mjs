import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
async function walk(name) {
  const result = [];
  for (const entry of await fs.readdir(path.join(root, name), { withFileTypes: true })) {
    const next = `${name}/${entry.name}`;
    if (entry.isDirectory()) result.push(...await walk(next));
    else if (entry.isFile()) result.push(next);
  }
  return result;
}
const sourceFiles = (await Promise.all(["client", "server", "shared", "scripts", "script"].map(walk))).flat()
  .filter(p => /\.(tsx?|jsx?|mjs|cjs|json|css|html|sh)$/.test(p));
const source = (await Promise.all(sourceFiles.map(p => fs.readFile(path.join(root, p), "utf8")))).join("\n");
const dbReferences = new Set();
let tablesChecked = 0;
if (process.argv.includes("--database")) {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  try {
    await db.connect();
    await db.query("BEGIN READ ONLY");
    await db.query("SET LOCAL statement_timeout = '15s'");
    const { rows } = await db.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    for (const { tablename } of rows) {
      if (!/^[a-z_][a-z0-9_]*$/.test(tablename)) throw new Error("Unexpected table identifier");
      // Return only media paths, never user records, tokens or connection details.
      const matches = await db.query(`SELECT DISTINCT (regexp_matches(to_jsonb(t)::text, $1, 'g'))[1] AS asset FROM public."${tablename}" t`,
        ['((?:/uploads/|/training-slides/|/training-slides-ch2/|/attached_assets/)[^"\\\\\\s]+)']);
      for (const { asset } of matches.rows) dbReferences.add(asset);
      tablesChecked++;
    }
    await db.query("ROLLBACK");
  } finally { await db.end(); }
}
const inventory = [];
for (const file of [...await walk("public"), ...await walk("attached_assets")]) {
  const url = file.startsWith("public/") ? file.slice(6)
    : file.replace(/^attached_assets\/training_slides_ch2\//, "/training-slides-ch2/")
      .replace(/^attached_assets\/training_slides\//, "/training-slides/")
      .replace(/^attached_assets\//, "/attached_assets/");
  const sourceReference = source.includes(path.basename(file)) || source.includes(url);
  const databaseReference = dbReferences.has(url) || dbReferences.has(encodeURI(url));
  inventory.push({ file, bytes: (await fs.stat(path.join(root, file))).size, sourceReference, databaseReference,
    status: sourceReference || databaseReference ? "reference-found" : "review-candidate-not-safe-to-delete" });
}
inventory.sort((a, b) => b.bytes - a.bytes);
const candidates = inventory.filter(row => row.status.startsWith("review"));
const summary = {
  database: tablesChecked ? `Development database: ${tablesChecked} public tables checked` : "Not checked",
  limitations: "Production not checked. Dynamic references, encoded URLs and external consumers may be missed. No file is proven unused; all retained.",
  totalFiles: inventory.length, totalBytes: inventory.reduce((sum, r) => sum + r.bytes, 0),
  candidateFiles: candidates.length, candidateBytes: candidates.reduce((sum, r) => sum + r.bytes, 0),
};
await fs.mkdir(path.join(root, "generated-artifacts"), { recursive: true });
await fs.writeFile(path.join(root, "generated-artifacts/media-inventory.json"), JSON.stringify({ summary, files: inventory }, null, 2));
console.log(JSON.stringify(summary, null, 2));
