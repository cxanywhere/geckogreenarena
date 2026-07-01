---
name: drizzle db:push interactive prompt blocks on unique-constraint drift
description: Why `npm run db:push -- --force` can hang mid-run and how to add additive columns safely
---

`npm run db:push -- --force` still shows an INTERACTIVE selector ("Do you want to truncate <table>?") when drizzle detects a missing unique constraint drift (e.g. `abm_accounts_slug_unique`). `--force` only auto-confirms column data-loss, NOT this truncate/add-constraint choice. Piping `\n` into it does not work — it's a TTY raw-mode selector that ignores piped stdin, so the push hangs.

**Why:** the DB has pre-existing schema drift (a unique constraint present in `shared/schema.ts` but not applied), unrelated to whatever columns you're adding.

**How to apply:** For purely ADDITIVE nullable columns, skip db:push and run direct SQL instead: `psql "$DATABASE_URL" -c "ALTER TABLE t ADD COLUMN IF NOT EXISTS c jsonb;"`. This avoids the blocking prompt entirely. Reserve db:push for when you can answer the prompt interactively.
