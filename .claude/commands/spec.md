---
description: Generate docs/SPEC.md from docs/REQUIREMENTS.md
allowed-tools: Read, Write, Edit, Glob, Grep
---

# /spec — Requirements → Spec

Turn `docs/REQUIREMENTS.md` into a concrete implementation spec at `docs/SPEC.md`.

## Audience reminder
**The human reviewing `docs/SPEC.md` may be a non-engineer.** Write the visible parts of the document in plain Japanese/English that anyone can understand. Put technical details (component names, file paths, API shapes, prop types) inside `<details>` blocks so they don't clutter the human-facing view but are still available to AI agents that read the file later.

## Process

1. **Read** `docs/REQUIREMENTS.md`. If missing, tell the user to run `/discover` first and stop.
2. **Read** `docs/SPEC.template.md` for the target structure (note the `<details>` pattern — follow it).
3. **Read** `src/App.tsx`, `src/pages/`, and `src/components/ui/` to understand what already exists. Reuse before creating.
4. **Generate `docs/SPEC.md`** following the template. For each section:
   - **Plain-language part (visible by default)**:
     - "この画面でできること" — user-facing actions in everyday words
     - "画面に表示されるもの" — what appears, in concrete but non-technical terms ("商品カードが3枚")
     - "ダミーデータ" — what kind of sample data appears, no API jargon
     - "完成チェック項目" — verifiable from a screenshot, written so the human can mentally picture each check
   - **`<details>` part (for AI)**:
     - Route paths, page component file paths
     - shadcn/ui-style components to use (prefer existing in `src/components/ui/`)
     - MSW handler endpoints and TypeScript types
     - Interaction handlers
5. **Stop and summarize** the spec in 5–8 plain-language bullets (no technical jargon). Ask the user to review and run `/tasks` when ready. Do NOT auto-run `/tasks`.

## Rules
- **Plain-language sections must avoid jargon.** No "コンポーネント", "Props", "ルーティング", "エンドポイント" in the visible parts. Save those for `<details>`.
- Every page must have at least one acceptance check verifiable from a screenshot.
- Don't invent requirements that aren't in REQUIREMENTS.md. If something is unclear, list it under "確認できなかったこと / Open questions" and stop.
- Both technical and plain sections must stay in sync. If you change one, update the other.
