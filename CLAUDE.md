# CLAUDE.md

Project-wide rules for Claude Code working in this repo. Keep this file under 200 lines.

## What this project is
A GitHub Template for building **browser-runnable UI mocks** at maximum speed using Claude Code. The human writes requirements and reviews; Claude does everything else through a `discover → spec → tasks → loop` workflow.

## Tech stack (fixed — do not swap)
- Vite 6 + React 19 + TypeScript 5 (strict)
- Tailwind CSS 4 + shadcn/ui-style components in `src/components/ui/`
- React Router 7
- MSW (Mock Service Worker) for all API mocking — no real network calls
- Playwright MCP for the visual self-improvement loop

## Workflow (do not skip steps)
1. `/discover` — interactive interview → `docs/REQUIREMENTS.md`
2. `/spec` — `docs/REQUIREMENTS.md` → `docs/SPEC.md`
3. `/tasks` — `docs/SPEC.md` → `docs/TASKS.md`
4. `/loop` — autonomous build/critique/fix until tasks complete or budget exhausted

The human approves at each `→`. Don't auto-advance.

## Conversation language
The first line of `docs/REQUIREMENTS.md` is `Language: <name>` (e.g. `Language: 日本語`). This is set by `/discover` from the user's first message and is the **single source of truth** for what language to talk to the user in. Every command and subagent must read it and produce all human-facing output (summaries, AskUserQuestion text, gap reports, escalation messages, UI copy in JSX) in that language. Code, identifiers, file paths, and parser-critical keywords (`PASS`, `FAIL`, `[VISUAL]`, `STRUCTURAL_ESCALATION`, etc.) stay in English.

## Subagents
- **builder** — writes/edits files under `src/`. Triggered for any task implementation.
- **visual-critic** — uses Playwright MCP to verify the running mock against SPEC criteria. PASS/FAIL only, no edits.
- **fixer** — applies minimal corrective edits based on critic gap reports.
- **planner** — writes docs in `docs/`, never edits code.

Delegate via the Task tool with the appropriate `subagent_type`.

## Hard rules

1. **Reuse before creating.** Check `src/components/ui/` and `src/components/` before adding new components.
2. **TypeScript strict.** No `any`, no `@ts-ignore`. The post-edit hook blocks on typecheck failures.
3. **All data via MSW.** Add handlers to `src/mocks/handlers.ts`. No direct external fetches.
4. **Tailwind only.** No CSS files except `src/index.css`. Use `cn()` from `@/lib/utils` for conditional classes.
5. **No scope creep.** Implement exactly what the task says. Don't add tests, docs, refactors, or "improvements" unless asked.
6. **No deleted-code comments, no `_unused` rename hacks.** If something is unused, delete it.
7. **Routes register in `src/App.tsx`.** Pages live in `src/pages/`.
8. **Stop conditions matter.** Loop budget is `MOCK_LOOP_MAX_TASKS` (default 20). Per-task critic retries cap at `MOCK_LOOP_MAX_RETRIES` (default 3). Escalate to the human when hit.

## Quality gates (enforced by hooks)
- After any `Write`/`Edit` in `src/**/*.{ts,tsx}`, the post-edit hook runs `npm run typecheck` then `npm run lint`. Failure exits 2 — Claude must fix before continuing.
- The hook is cross-platform Node.js — works on macOS, Linux, Windows, WSL.

## What lives where
```
docs/                  → human-readable specs (you write these)
src/pages/             → one file per route
src/components/ui/     → reusable primitives (button, card, etc.)
src/components/        → composite app components
src/mocks/handlers.ts  → all MSW request handlers
src/lib/utils.ts       → cn() and other tiny helpers
.claude/commands/      → slash commands
.claude/agents/        → subagent definitions
.claude/hooks/         → cross-platform Node hooks
.claude/skills/        → on-demand pattern references
```

## When in doubt
- Read the relevant SPEC section before editing.
- Read existing `src/` files before adding new ones.
- If a task is ambiguous, write the question back to the human rather than guessing.
