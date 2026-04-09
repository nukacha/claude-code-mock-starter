#!/usr/bin/env node
/**
 * PostToolUse hook: cross-platform (macOS / Linux / Windows / WSL).
 *
 * Reads the Claude Code hook event from stdin (JSON).
 * If the edited file is a TypeScript/TSX source under src/, run typecheck + lint.
 * Exit code 2 = blocking error (Claude must fix before continuing).
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function shouldCheck(filePath) {
  if (!filePath) return false;
  const normalized = filePath.replace(/\\/g, "/");
  if (!/\/src\//.test(normalized)) return false;
  return /\.(ts|tsx)$/.test(normalized);
}

function runNpmScript(script) {
  const isWindows = process.platform === "win32";
  const cmd = isWindows ? "npm.cmd" : "npm";
  const result = spawnSync(cmd, ["run", "--silent", script], {
    cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
  return {
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

const raw = readStdin();
let event = {};
try {
  event = raw ? JSON.parse(raw) : {};
} catch {
  // ignore parse errors and continue best-effort
}

const editedFile =
  event?.tool_input?.file_path || event?.tool_input?.filePath || "";

if (!shouldCheck(editedFile)) {
  process.exit(0);
}

const rel = path.relative(
  process.env.CLAUDE_PROJECT_DIR || process.cwd(),
  editedFile,
);

console.error(`[post-edit] checking ${rel}`);

const tc = runNpmScript("typecheck");
if (tc.code !== 0) {
  console.error("[post-edit] typecheck failed:");
  console.error(tc.stdout);
  console.error(tc.stderr);
  process.exit(2);
}

const lint = runNpmScript("lint");
if (lint.code !== 0) {
  console.error("[post-edit] lint failed:");
  console.error(lint.stdout);
  console.error(lint.stderr);
  process.exit(2);
}

console.error("[post-edit] ok");
process.exit(0);
