#!/usr/bin/env node
/**
 * SessionStart hook: light environment sanity check.
 * Cross-platform (macOS / Linux / Windows / WSL). Never blocks.
 */
import { existsSync } from "node:fs";
import path from "node:path";

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

const messages = [];

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 24) {
  messages.push(
    `[warn] Node ${process.versions.node} detected. This template targets Node >=24.`,
  );
}

if (!existsSync(path.join(projectDir, "node_modules"))) {
  messages.push("[info] node_modules missing — run `npm install` first.");
}

if (!existsSync(path.join(projectDir, "docs", "REQUIREMENTS.md"))) {
  messages.push(
    "[info] docs/REQUIREMENTS.md not found. Run `/discover` to start an interactive requirements session.",
  );
}

for (const m of messages) console.error(m);
process.exit(0);
