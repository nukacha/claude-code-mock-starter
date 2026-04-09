---
description: Run a one-shot visual review of the current mock state
allowed-tools: Read, Bash, Task
---

# /review — One-shot visual review

Run the `visual-critic` subagent against the current mock without entering the full `/loop`. Useful for ad-hoc checks after manual edits.

## Language
Read the `Language:` field on the first line of `docs/REQUIREMENTS.md` and produce the final report in that language. Pass the preference to the visual-critic subagent.

## Process
1. Confirm `docs/SPEC.md` exists; read its acceptance criteria.
2. Ensure dev server is running (`npm run dev` in background if needed).
3. Delegate to `visual-critic` subagent: pass each page route and its acceptance criteria.
4. Report verdicts page-by-page. Do not auto-fix.
