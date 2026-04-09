---
description: Interactively gather requirements from the user and write docs/REQUIREMENTS.md
argument-hint: "[optional initial idea]"
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# /discover — Interactive requirements gathering

You are entering **requirements discovery mode**. The user has a vague idea for a UI mock. Your job is to turn that vague idea into a concrete, implementable `docs/REQUIREMENTS.md` through a short, focused interview.

## Initial input
$ARGUMENTS

## Process

1. **Lock in the conversation language FIRST** (this is critical):
   - If `docs/REQUIREMENTS.md` already exists, read it and use the `Language:` field at the top — skip ahead to step 3.
   - Otherwise, detect the user's preferred language:
     - If `$ARGUMENTS` is non-empty, infer from the language they wrote it in (e.g. `$ARGUMENTS` written in Japanese → Japanese).
     - If you cannot confidently detect, use `AskUserQuestion`:
       - Question: `"Which language would you like to work in? / 使用したい言語を選んでください"`
       - Header: `"Language"`
       - Options: `English`, `日本語`, `中文 (简体)`, `한국어` (the user can also pick "Other" and specify)
   - **From this point on, conduct ALL conversation in the chosen language**: AskUserQuestion text, summaries, confirmations, the body of REQUIREMENTS.md, the final approval prompt — everything human-facing.
   - The chosen language must be written into `docs/REQUIREMENTS.md` in step 4 as the very first line: `Language: <chosen language name>` (e.g. `Language: 日本語`). All downstream commands read this and follow it.

2. **Read the current state**:
   - Read `docs/REQUIREMENTS.template.md` to understand the target structure.
   - If `docs/REQUIREMENTS.md` already exists, read it — this is a refinement session, not a fresh start. Treat existing content as the user's prior answers and only ask about gaps or things they want to change.

3. **Interview the user** using the `AskUserQuestion` tool. Rules:
   - Ask **1–3 questions per turn**, not more. Vague-idea owners get overwhelmed by long question lists.
   - Always offer **2–4 concrete options** in addition to free-form "Other". Concrete options help the user crystallize their thinking faster than open questions.
   - After each batch of answers, **summarize what you now understand in 2–4 lines** and confirm before moving on.
   - **All question text, options, and summaries must be in the locked-in language from step 1.** Do not mix languages.
   - Cover, in roughly this order, only what's still unknown:
     1. **Target user & context** — who uses this, in what situation
     2. **Core problem & success** — what pain it removes; how we'll know the mock is "good enough"
     3. **Screens** — list of screens with one-line purposes
     4. **Primary user flow** — the happy path through those screens
     5. **Data shown** — what entities/fields appear, where the data comes from (mocked via MSW)
     6. **Visual tone** — minimal/playful/corporate/etc., any reference products
     7. **Out of scope** — what we explicitly will NOT build in this mock
   - If the user gives a confident answer that already covers a section, skip ahead. Don't waste questions.
   - If the user says "you decide" or "whatever", make a sensible default choice, state it explicitly, and move on.

4. **Write `docs/REQUIREMENTS.md`** based on the template structure:
   - The very first line must be `Language: <chosen language>` (e.g. `Language: 日本語`).
   - Fill every section. Section headings and body content must be in the chosen language.
   - Use checkbox lists for verifiable success criteria so the visual-critic agent can use them later.

5. **Final confirmation**: Show the user a short bullet summary of what you wrote and ask whether they're ready to proceed to `/spec`. Phrase the question in the chosen language (e.g. for Japanese: "この内容で `/spec` に進めて良いですか？"; for English: "Ready to proceed to `/spec`?"). Do NOT auto-run `/spec`. The human approves the requirements before moving on.

## Quality bar
- Every screen must have a clear purpose (not just "page A, page B").
- Every success criterion must be verifiable by looking at a screenshot.
- "Out of scope" is mandatory — it's how we keep the mock from sprawling.
