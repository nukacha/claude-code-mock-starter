---
description: Refine the mock from natural-language feedback. Auto-detects whether it's a code-only tweak, a single-task update, or a requirements-level change, and runs only the minimum needed.
argument-hint: "<what you want to change>"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, AskUserQuestion
---

# /refine — Targeted refinement

The user has built a mock and is now unsatisfied with something. Your job is to **make the smallest possible change** that addresses their feedback. Do **not** regenerate SPEC.md or TASKS.md from scratch — that's nuclear and wastes work.

## Language
Read the `Language:` field on the first line of `docs/REQUIREMENTS.md` and produce all human-facing output in that language.

## Input
$ARGUMENTS

## Process

### Step 1: Read the current state
Read `docs/REQUIREMENTS.md`, `docs/SPEC.md`, `docs/TASKS.md`, and any `src/` files that look related to the feedback. Understand what already exists before changing anything.

### Step 2: Classify the depth
Decide which category the feedback belongs to. When in doubt, pick the **shallower** option — it's faster and reversible.

| Depth | When to pick it | Examples |
|--|--|--|
| **SURFACE** | Visual / copy / minor behavior change. No new screens, no new data, no design philosophy change. | "make the button bigger", "change the card color to blue", "fix the typo in the header", "add a hover effect" |
| **TARGETED** | Adds/changes a small feature within an existing screen, or adds 1 small new screen. SPEC structure mostly stays. | "add a search box to the dashboard", "show product price in the card", "add a settings page", "the form needs a validation message" |
| **STRUCTURAL** | The requirements themselves were wrong. Affects multiple screens or design philosophy. | "change target users from B2B to consumer", "make the whole thing dark-themed", "we don't need the auth flow at all", "use a table instead of cards everywhere" |

If the feedback is ambiguous, use `AskUserQuestion` once to clarify scope before classifying.

### Step 3: Execute the chosen depth

#### SURFACE
1. Identify the file(s) to edit (usually 1–3 files in `src/`).
2. Delegate to the `builder` subagent with a tightly-scoped instruction. Builder edits the files; post-edit hook validates.
3. Delegate to the `visual-critic` subagent for **only the affected route(s)**. Pass the user's original feedback as the acceptance criterion.
4. If critic FAILs, delegate to `fixer` (same loop logic as `/loop` step 4). Cap at 3 retries.
5. Report what changed. **Do not touch `docs/`**.

#### TARGETED
1. Surgically patch `docs/SPEC.md`:
   - Find the relevant `### 画面N: <name>` (or equivalent) section
   - Edit only that section's "この画面でできること", "画面に表示されるもの", "完成チェック項目", and the `<details>` AI block
   - Do NOT touch unrelated sections
2. Surgically patch `docs/TASKS.md`:
   - If the change affects an existing task: edit that task's body and reset its status to `[ ]`
   - If the change requires a new task: append a new task with the next ID, status `[ ]`
   - Do NOT renumber, reorder, or rewrite other tasks
3. Run the build/critic/fix loop **only on the affected task(s)**:
   - Same delegation pattern as `/loop` step 2-4 (builder → critic → fixer/builder)
   - Same stop conditions (3 retries → escalate)
4. Report what changed in SPEC, TASKS, and which tasks were rerun.

#### STRUCTURAL
1. Surgically patch `docs/REQUIREMENTS.md`:
   - Edit only the affected sections (e.g. §2 Target users, §7 Visual style, §8 Out of scope)
   - Do NOT regenerate the whole file
2. Show the user a summary of what changed in REQUIREMENTS and ask via `AskUserQuestion`:
   - "This change affects multiple screens. How would you like to proceed?"
   - Options:
     - `Re-run /spec to propagate (recommended for big changes)` — Stop. Tell the user to run `/spec`.
     - `Let me update SPEC and TASKS surgically myself` — Continue: identify all affected SPEC sections and TASKS entries, patch them surgically (same as TARGETED but possibly across multiple sections), then run the loop on affected tasks. Use this when the structural change is large in scope but small in mechanical impact.
     - `Just update REQUIREMENTS for now, I'll iterate later` — Stop after step 1.

### Step 4: Final report
Summarize in 3–5 bullets in the project language:
- What you classified the feedback as (SURFACE / TARGETED / STRUCTURAL)
- What you changed (files / SPEC sections / TASKS entries)
- What ran (which agents, which routes)
- The verdict (PASS / blocked / waiting on user)
- What the user should do next (e.g. "open `npm run dev` to see the result", "run `/spec` to propagate the structural change")

## Hard rules

- **Never regenerate SPEC.md or TASKS.md from scratch.** Always patch surgically. The whole point of `/refine` is to preserve work.
- **Never edit unrelated SPEC sections or TASKS entries.** If you find yourself wanting to "improve" something the user didn't mention, stop.
- **Always pick the shallowest depth that works.** SURFACE > TARGETED > STRUCTURAL. Going one level shallower is almost always cheaper to undo than going one level deeper.
- **If the change touches more than ~3 SPEC sections, escalate to STRUCTURAL** and ask the user before proceeding. That's a signal you mis-classified.
- **Respect the post-edit hook.** Like `/loop`, builder failures from typecheck/lint must be fixed in-place, not bypassed.
