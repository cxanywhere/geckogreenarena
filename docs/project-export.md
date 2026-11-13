# Smaller project ZIP

Run `npm run export:zip` from the project. Requires Node.js 20+, the `zip`
and `unzip` command-line utilities, and free space for a temporary copy of the
export inputs plus the compressed archive. No extra npm dependency is required.

Output: `generated-artifacts/arena-project.zip`. Each successful run replaces
only that generated ZIP. Integrity is checked before replacing the previous ZIP.
The manifest alongside it lists included files and exact compressed size.
Generated files are excluded from checkpoints and publishing.

The export keeps source code, dependency lockfile, build/run configuration,
public runtime assets, and uploaded images/audio/video/PDFs/fonts. It excludes
saved versions, installed packages, tool caches, agent state, build output,
logs, previous archives, environment files, private-key files, database dumps,
and pasted conversations/non-media source uploads. The exported `.replit`
omits environment-value sections; the original is untouched.

This is an application source export, **not a database backup**. Accounts,
training progress, attempts and database-only content are not included.
Media may contain proprietary content: share only with authorized recipients.
Common embedded credential patterns are checked, but this is not a comprehensive
security audit; review code before sharing. Adding a new top-level source or
configuration directory requires updating the export allowlist.

## Run the exported application

1. Extract the ZIP into its own folder; install Node.js 20+.
2. Run `npm ci` to restore packages from the lockfile.
3. Configure a PostgreSQL database and supply `DATABASE_URL` securely. Supply a
   fresh `SESSION_SECRET` and the credentials/endpoints required for the features
   you use (AI providers, Vapi, email and SMS). Never commit these values.
   Replit-managed integrations are not portable credentials; configure access
   appropriately in the destination environment.
4. For a **new empty development database**, run `npm run db:push` interactively.
   Do not use this blindly against an existing database: schema drift can produce
   destructive prompts. No schema or data changes are made by the export command.
5. Run `npm run dev`, or `npm run build` followed by `npm start`. Start from the
   extracted project root so runtime media paths resolve correctly. Startup seeds
   training content; it does not restore previous users or activity.

## Review potentially unused media

Run `npm run assets:inventory -- --database` in the development workspace.
This compares media filenames/URLs against source and media paths found in the
development database using a read-only transaction. Without `--database`, it
checks source only. The report is `generated-artifacts/media-inventory.json`.

Unmatched files are **review candidates, not proven unused**. Production,
dynamic paths, external links and retained original artwork may still need them.
No files are deleted, compressed, or removed from the export based on this report.
Deleting or relocating media requires a separate approval and verification.

Run `npm run export:test` to test exclusion and configuration-sanitization rules.
