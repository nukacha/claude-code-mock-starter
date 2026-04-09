---
description: Generate docs/TASKS.md from docs/SPEC.md
allowed-tools: Read, Write, Edit, Glob, Grep
---

# /tasks — Spec → Task list

Decompose `docs/SPEC.md` into small, sequential tasks at `docs/TASKS.md` that the `/iterate` command can execute one at a time.

## Language
**Read the `Language:` field on the first line of `docs/REQUIREMENTS.md` and write all human-facing content in `docs/TASKS.md` in that language.** Task titles, "what the user will see when done" descriptions, and the final summary must all be in the locked-in project language. The technical content inside `<details>` blocks may stay in English.

## Audience reminder
**The human reviewing `docs/TASKS.md` may be a non-engineer.** They need to understand "what each task will produce" without reading code. Each task has two parts:
- **Visible by default**: plain-language description of what the user will see when the task is done — written so a non-technical reader can decide "yes, that's what I want"
- **Inside `<details>`**: files to touch, steps, technical acceptance — for AI agents only

Follow `docs/TASKS.template.md` exactly.

## Process

1. Read `docs/SPEC.md`. If missing, tell the user to run `/spec` first and stop.
2. Read `docs/TASKS.template.md` for structure (note the `<details>` pattern).
3. Read existing `src/` to identify what's already in place.
4. Write `docs/TASKS.md` with tasks ordered as:
   1. **Foundation** — MSW handlers for all endpoints, routing skeleton, shared layout
   2. **Page-by-page** — one task per page, each implementing the full page
   3. **Polish** — empty states, loading states, responsive tweaks (only if REQUIREMENTS mentioned them)
5. **Each task** must have:
   - **Title** in plain Japanese — describe the outcome, not the technical work. Bad: "MSW handlersをセットアップ". Good: "商品データを画面に表示できるようにする"
   - **完成すると何が見えるか** — 1–3 bullets in everyday words ("トップ画面に商品が3件並ぶ")
   - **完成の目安** — checklist verifiable from a screenshot, in plain language
   - **`<details>` block** — SPEC ref, files, steps, quality gates (typecheck/lint, console errors)
6. Keep tasks **small enough that one builder pass + one critic pass can complete them**. If a task touches more than ~5 files or feels like 2 features, split it.
7. Stop and **summarize in plain language**: "全部で◯個のタスクがあります。順番は: 1) …, 2) …" — no jargon. Tell the user to run `/iterate` when ready.

## Rules
- **Plain-language parts must avoid jargon.** No "ハンドラ", "ルーティング", "コンポーネント", "props" in the visible parts. Use "画面"・"ボタン"・"表示される" etc.
- Foundation tasks still need a plain-language description. "MSWハンドラを書く" → "AIが画面に表示するためのダミーデータを準備する".
- Don't add tasks for things outside SPEC.md.
- Don't add tests, documentation, or refactoring tasks unless explicitly specified.
- Prefer reusing existing components from `src/components/ui/` over creating new ones.
