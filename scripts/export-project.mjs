import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const roots = [
  "client", "server", "shared", "scripts", "script", "docs", "public", "attached_assets",
  "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts",
  "vite-plugin-meta-images.ts", "postcss.config.js", "drizzle.config.ts",
  "components.json", ".gitignore", ".replitignore", ".replit", "generate-slides.sh",
];
const media = /\.(png|jpe?g|webp|gif|svg|ico|wav|mp3|mp4|webm|ogg|m4a|pdf|woff2?|ttf)$/i;
export function included(name, directory = false) {
  const parts = name.split("/");
  if (!roots.includes(parts[0])) return false;
  if (parts.some(p => /^(node_modules|dist|coverage|test-results|playwright-report|\.git|\.cache|\.local|\.agents|generated-artifacts)$/i.test(p))) return false;
  if (parts.some(p => /^\.env(?:\.|$)|^\.npmrc$|^\.netrc$|^id_(rsa|ed25519)$|credential|secret/i.test(p))) return false;
  if (/\.(zip|tar|gz|7z|log|pem|key|p12|pfx|sql|dump|sqlite3?|db|bak)$/i.test(name)) return false;
  // Original pasted chat, spreadsheets and documents are not runtime inputs.
  if (parts[0] === "attached_assets" && !directory && !media.test(name)) return false;
  return true;
}

export function sanitizeReplit(text) {
  let omit = false;
  return text.split("\n").filter(line => {
    const section = line.match(/^\s*\[+([^\]]+)\]+/);
    if (section) omit = /^(userenv|env)(\.|$)/.test(section[1]);
    return !omit;
  }).join("\n");
}

export function hasCredential(text) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:postgres(?:ql)?|mongodb(?:\+srv)?):\/\/[^:\s]+:[^@\s]+@|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|AKIA[A-Z0-9]{16}/.test(text);
}

export async function collect(root, name, result = []) {
  const stat = await fs.lstat(path.join(root, name));
  if (!included(name, stat.isDirectory())) return result;
  if (stat.isSymbolicLink()) throw new Error(`Refusing symlink: ${name}`);
  if (stat.isDirectory()) {
    for (const child of (await fs.readdir(path.join(root, name))).sort())
      await collect(root, `${name}/${child}`, result);
  } else if (stat.isFile()) result.push(name);
  return result;
}

export async function exportProject(root) {
  for (const command of ["zip", "unzip"]) {
    if (spawnSync(command, ["-v"], { stdio: "ignore" }).status !== 0)
      throw new Error(`${command} must be installed before exporting.`);
  }
  const output = path.join(root, "generated-artifacts");
  await fs.mkdir(output, { recursive: true });
  const stage = await fs.mkdtemp(path.join(output, "export-stage-"));
  const archive = path.join(output, "arena-project.zip");
  const temporary = path.join(output, `arena-${process.pid}.zip`);
  const files = [];
  try {
    for (const name of roots) {
      try { await fs.access(path.join(root, name)); }
      catch { throw new Error(`Required export input missing: ${name}`); }
      await collect(root, name, files);
    }
    for (const name of files) {
      const destination = path.join(stage, name);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      if (name === ".replit") {
        await fs.writeFile(destination, sanitizeReplit(await fs.readFile(path.join(root, name), "utf8")));
      } else {
        if (/\.(tsx?|jsx?|mjs|cjs|json|md|sh|html|css|toml)$/.test(name)) {
          if (hasCredential(await fs.readFile(path.join(root, name), "utf8")))
            throw new Error(`Potential embedded credential in ${name}; review before exporting.`);
        }
        await fs.copyFile(path.join(root, name), destination, fs.constants.COPYFILE_FICLONE);
      }
    }
    const zip = spawnSync("zip", ["-q", "-6", "-r", temporary, "."], { cwd: stage, stdio: "inherit" });
    if (zip.status !== 0) throw new Error("ZIP creation failed.");
    if (spawnSync("unzip", ["-tqq", temporary], { stdio: "inherit" }).status !== 0)
      throw new Error("ZIP integrity check failed.");
    await fs.rename(temporary, archive);
    const summary = { archive: "generated-artifacts/arena-project.zip", bytes: (await fs.stat(archive)).size, files: files.length };
    await fs.writeFile(path.join(output, "export-manifest.json"), JSON.stringify({ ...summary, paths: files }, null, 2));
    console.log(JSON.stringify(summary, null, 2));
    return summary;
  } finally {
    await fs.rm(stage, { recursive: true, force: true });
    await fs.rm(temporary, { force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  exportProject(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
