#!/usr/bin/env node
// PreToolUse(Edit|Write) hook — deterministic backstop to the CLAUDE.md "docs
// receipt". When an edited file sits in a documented area, it surfaces which
// doc covers it, so a skipped doc is visible even if the model misreports.
// Silent for unmapped files. Wired locally in .claude/settings.json (that file
// is gitignored); this script is committed so it stays in version control.
//
// Keep RULES in sync with the "Docs routing" table in CLAUDE.md. The map
// currently reflects the PLANNED layout — extend it as the codebase takes shape.
import { readFileSync } from "node:fs";

let raw = "";
try {
  raw = readFileSync(0, "utf8");
} catch {
  process.exit(0);
}

let file = "";
try {
  file = JSON.parse(raw || "{}")?.tool_input?.file_path ?? "";
} catch {
  process.exit(0);
}
if (!file) process.exit(0);

// Normalize to forward slashes and strip the project root (case-insensitively —
// Windows drive letters vary in case between tools).
const norm = (p) => p.replace(/\\/g, "/");
const nf = norm(file);
const cwd = norm(process.cwd()) + "/";
const rel = nf.toLowerCase().startsWith(cwd.toLowerCase()) ? nf.slice(cwd.length) : nf;

// [pattern, doc, area]. A file may match several; all are reported.
const RULES = [
  [/seo|schema\.ts$|astro\.config|robots\.txt$|llms|sitemap/i, "docs/seo.md", "SEO / meta / JSON-LD"],
  [/sanity|studio\//i, "docs/content-model.md", "content model"],
  [/src\/pages\/|breadcrumb|book-foredrag|internal-link/i, "docs/site-structure.md", "routes / linking / conversion"],
];

const hits = [];
for (const [re, doc, area] of RULES) {
  if (re.test(rel) && !hits.some((h) => h.doc === doc)) hits.push({ doc, area });
}
if (hits.length === 0) process.exit(0);

const list = hits.map((h) => `${h.doc} (${h.area})`).join(", ");
const msg = `📚 doc-reminder: ${rel} sits in a documented area — reference: ${list}. If you haven't read it this turn, do so, and list it in the canary "docs:" receipt.`;

// stderr → visible to the user (the catch); additionalContext → reaches the
// model (the nudge). Exit 0 = non-blocking.
process.stderr.write(msg + "\n");
process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", additionalContext: msg },
  }),
);
process.exit(0);
