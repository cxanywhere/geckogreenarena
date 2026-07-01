#!/bin/bash
set -e

# Install dependencies (idempotent).
npm install

# Apply Drizzle schema changes non-interactively. --force skips the
# interactive prompts (e.g. constraint changes) that would otherwise hang
# because stdin is closed during post-merge setup.
npm run db:push -- --force
