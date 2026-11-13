---
name: ZIP filename verification
description: Avoid mistaking terminal filename substitutions for archive corruption.
---

The workspace's `unzip -Z1` can display `?` in place of a registered-trademark character, even with a UTF-8 locale, while the ZIP central directory retains the correct UTF-8 filename.

**Why:** A strict manifest comparison against terminal output reported missing media despite intact archived filenames.

**How to apply:** If a ZIP manifest differs only on non-ASCII names, verify the central-directory filename bytes with a Unicode-aware reader before rebuilding or renaming source assets. Continue checking archive integrity separately.
