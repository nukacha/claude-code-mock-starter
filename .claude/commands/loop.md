---
description: Autonomously execute TASKS.md with build → visual-critic → fix loop
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, Task
---

# /loop — Self-improving build loop

Execute `docs/TASKS.md` autonomously. The human has approved the spec and tasks; from here on, **only requirements changes and final review require human input**. Everything else — coding, building, screenshotting, critiquing, fixing — is yours.

## Language
**Read the `Language:` field on the first line of `docs/REQUIREMENTS.md` and produce all human-facing output in that language**: progress messages, the final report, escalation messages, and the "Blocked" section appended to TASKS.md. Pass this language preference to subagents (builder, visual-critic, fixer) when delegating, so their reports back to you also come in the right language.

## Preconditions
- `docs/SPEC.md` and `docs/TASKS.md` exist. If not, stop and tell the user which command to run.
- The Playwright MCP server is registered. If `mcp__playwright__*` tools are unavailable, stop and tell the user to run `claude mcp add playwright npx @playwright/mcp@latest`.

## Budget (read from settings.json env)
- Max tasks per `/loop` invocation: `$MOCK_LOOP_MAX_TASKS` (default 20)
- Max critic retries per task: `$MOCK_LOOP_MAX_RETRIES` (default 3)

## Loop body

For each `[ ]` task in `docs/TASKS.md`, in order, until budget exhausted or all done:

### 1. Mark task in-progress
Edit `docs/TASKS.md` to change `[ ]` → `[~]` for the current task.

### 2. Build (delegate to `builder` subagent)
Use the Task tool with `subagent_type: "builder"`. Pass the full task body from TASKS.md plus the relevant SPEC.md section. The builder will edit files. The post-edit hook will block on typecheck/lint failures, so the builder is forced to leave the tree clean.

### 3. Visual review (delegate to `visual-critic` subagent)
Use the Task tool with `subagent_type: "visual-critic"`. Pass:
- The acceptance criteria from the task
- The page route(s) the task affects
The critic will start the dev server (if not already running), open the page in Playwright MCP, screenshot, and return a verdict: `PASS` or `FAIL: <specific gaps>`.

### 4. Branch on verdict
- **PASS** → mark task `[x]` in TASKS.md, move to next task.
- **FAIL** → delegate to `fixer` subagent with the critic's tagged gap list. The fixer will return one of two responses:
  - **`PATCHED`** → fixer made minimal edits. Re-run step 3 (visual review).
  - **`STRUCTURAL_ESCALATION`** → fixer judged the implementation approach itself wrong. Do NOT re-run the critic. Instead, **delegate back to the `builder` subagent** with the original task spec PLUS the fixer's `Reason` and `Suggested rebuild direction` as additional context. The builder rewrites the affected files. Then re-run step 3.
- **3 consecutive FAILs on the same task** → mark task `[!]`, write the gap list to a "Blocked" section in TASKS.md, stop the loop, summarize for the human. Both `PATCHED` and `STRUCTURAL_ESCALATION` count toward this budget — the counter tracks "attempts to satisfy this task", regardless of who attempted.

### 5. Stop conditions
- All tasks `[x]` → success summary.
- Budget reached → progress summary, tell user to re-run `/loop`.
- Any task blocked 3x → escalate.

## Final report
At loop end, output:
- Tasks completed / total
- Any blocked tasks with reasons
- Suggested next step for the human (review at `npm run dev`, refine REQUIREMENTS, etc.)
