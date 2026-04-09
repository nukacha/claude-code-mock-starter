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

1. **Read the current state**:
   - Read `docs/REQUIREMENTS.template.md` to understand the target structure.
   - If `docs/REQUIREMENTS.md` already exists, read it — this is a refinement session, not a fresh start. Treat existing content as the user's prior answers and only ask about gaps or things they want to change.

2. **Interview the user** using the `AskUserQuestion` tool. Rules:
   - Ask **1–3 questions per turn**, not more. Vague-idea owners get overwhelmed by long question lists.
   - Always offer **2–4 concrete options** in addition to free-form "Other". Concrete options help the user crystallize their thinking faster than open questions.
   - After each batch of answers, **summarize what you now understand in 2–4 lines** and confirm before moving on.
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

3. **Write `docs/REQUIREMENTS.md`** based on the template structure. Fill every section. Use checkbox lists for verifiable success criteria so the visual-critic agent can use them later.

4. **Final confirmation**: Show the user a short bullet summary of what you wrote and ask "この内容で `/spec` に進めて良いですか？ / Ready to proceed to `/spec`?". Do NOT auto-run `/spec`. The human approves the requirements before moving on.

## Quality bar
- Every screen must have a clear purpose (not just "page A, page B").
- Every success criterion must be verifiable by looking at a screenshot.
- "Out of scope" is mandatory — it's how we keep the mock from sprawling.
