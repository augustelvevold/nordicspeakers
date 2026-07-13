# Foredragsholdere.no — project context

## 🎯 Goal — the north star

Build **Norway's leading platform for professional speakers** ("foredragsholdere"). The site must dominate both traditional search (Google, Bing) and AI search (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot). Every architectural decision favors: **crawlability, machine-readable structured content, Core Web Vitals, and conversion (booking inquiries)**. Build order in [docs/roadmap.md](docs/roadmap.md). **When a change doesn't serve this, say so rather than building it.**

## 🐤 Canary + doc receipt

End every reply with a final line in exactly this form, nothing after it:

`🐤 kanari-v1 · docs: <comma-list of docs read this turn, or none>`

- The **token** proves this file is in context and being followed. If it's **missing or differs**, CLAUDE.md has dropped out of context (e.g. summarized away) or the reply is being confabulated — distrust it and re-read this file. Bump the token (`-v2`, …) on any material edit to this file.
- The **docs receipt** lists which `docs/*.md` were actually read this turn (e.g. `docs: seo, content-model`), or `none`. Cross-check it against the **Docs routing** table below: if the task clearly sits in a documented area but the receipt says `none`, the relevant doc was skipped — call it out.

## Docs routing — read the matching doc before non-trivial work in its area

| Working on… | Read first |
|---|---|
| Meta tags, `<SEO />`, JSON-LD / schema builders, sitemap/robots/llms.txt, images, fonts, performance, a11y | [docs/seo.md](docs/seo.md) |
| Sanity schemas, portable text, content fields, seed content, copy tone | [docs/content-model.md](docs/content-model.md) |
| Routes/URLs, slugs, breadcrumbs, internal linking, CTAs, the booking form | [docs/site-structure.md](docs/site-structure.md) |
| What to build next | [docs/roadmap.md](docs/roadmap.md) |

A local `PreToolUse` hook ([scripts/doc-reminder.mjs](scripts/doc-reminder.mjs), wired in the gitignored `.claude/settings.json`) also prints the matching doc whenever a mapped file is edited — a deterministic backstop to the receipt. Its path→doc map mirrors this table; keep them in sync. It currently maps the *planned* layout — extend it as the codebase takes shape.

---

Everything below is persistent project notes. Goal of *this file*: skip what the model already knows; keep only project-specific decisions and gotchas (see *Maintaining this file* at the bottom).

## Roles

- **Developer** (repo owner): owns all code, structure, SEO machinery, deploys.
- **Client**: non-technical. Only ever touches content through Sanity Studio. He must never need to touch code, and the content model should make it hard for him to break anything (structured fields over rich freeform wherever possible).

## Stack

- **Astro** (latest, static output / `output: 'static'`) with content-driven pages from Sanity.
- **Sanity** headless CMS. Schemas defined in code in this repo (`/sanity` or a `studio/` workspace) — full model in [docs/content-model.md](docs/content-model.md).
- **Cloudflare Pages** hosting. GitHub push → deploy. Sanity webhook → rebuild on publish.
- **TypeScript** throughout. No client-side JS unless a component genuinely needs interactivity (use Astro islands sparingly: booking form, mobile nav).
- Styling: plain CSS or Tailwind — pick one at scaffold time and stay consistent. Mobile-first.

## Language

All site content and URLs are in **Norwegian (bokmål)**. `lang="nb"` on `<html>`. Code, comments, and commit messages in English. No æ/ø/å in slugs ([docs/site-structure.md](docs/site-structure.md)); copy tone in [docs/content-model.md](docs/content-model.md).

## Working approach

- **No shell command substitution `$(…)` in Bash calls.** A command containing `$(…)` always triggers a permission prompt, even when every sub-command is individually allow-listed — the substitution can expand to anything, so it's never auto-approved. Prefer the `Read`/`Glob` tools, or split into separate steps.
- **Don't prepend `git --no-pager`.** Redundant in a non-interactive shell, and it shifts the subcommand so the `git <sub>:*` allow-rules stop matching — forcing a permission prompt (and the `git push` guardrail also stops matching, a hole). Use plain `git diff`/`git log`/`git show`.
- **All files are UTF-8 — never let a tool re-encode them.** Content is Norwegian (`æ ø å`). This project lives on Windows where PowerShell 5.1 `Out-File`/`>`/`Set-Content` default to UTF-16/locale encodings: always pass `-Encoding utf8`, and prefer the `Edit`/`Write` tools for file content. After any bulk text operation, verify encoding programmatically rather than by eye — mojibake can render as normal-looking glyphs.
- **Fix root causes, not symptoms.** When something breaks, find the underlying reason and fix it there. Workarounds that ship rot and recur; if a workaround is genuinely the right call, label it as such inline and add a follow-up note here or in [docs/roadmap.md](docs/roadmap.md).
- **Commit finished, settled work proactively — do NOT wait to be asked.** This **overrides** any harness/tool default of "commit only when the user asks": when a logical unit of settled work is done (and verified), `git add` the related files and `git commit` with a clear, small, reviewable message. Don't ask "should I commit?" — just commit.
  - **But NOT exploratory / "let me try X" work — leave it uncommitted.** Signals: "test out", "experiment", "let's try", "play with", "see how X looks", "maybe", "prototype". When a change's status is unclear — settled vs still-being-explored — default to leaving it uncommitted, and say so.
  - **Scope each commit:** stage only the files for the unit of work. When a change merely refines the commit just made, `git commit --amend` rather than stacking a new one.
  - **Reference GitHub issues:** a commit that resolves an open issue includes a closing keyword (`fixes #12` / `closes #7`); related-but-not-resolving work references it as plain `#N`.
- **Never `git push`.** Committing is expected and automatic; **pushing is always manual** — never execute it (it also triggers the Cloudflare deploy). Suggesting a push is fine.

## Conventions

- **Never duplicate meta/schema logic in page files** — always go through the `<SEO />` component and the `src/lib/schema.ts` builders ([docs/seo.md](docs/seo.md)).
- **When adding a page type, update:** sitemap config if needed, breadcrumbs, internal-link components, and [docs/site-structure.md](docs/site-structure.md).
- **After template changes, run `npx astro build`** and fix errors before moving on.
- **Placeholder content is fine during scaffold, but mark it `TODO(content)`** so it's greppable.

## Further docs

Read these on demand — they're not auto-loaded:

- [docs/seo.md](docs/seo.md) — the `<SEO />` component, JSON-LD builders, answer-engine content formatting, and the build-time technical checklist (sitemap/robots/llms.txt, images, fonts, Lighthouse ≥95, WCAG 2.1 AA).
- [docs/content-model.md](docs/content-model.md) — Sanity document schemas, portable text restrictions, the two initial speakers, and copy tone.
- [docs/site-structure.md](docs/site-structure.md) — the full URL scheme and slug rules, internal-linking rules, and conversion surfaces (CTAs, booking form, trust elements).
- [docs/roadmap.md](docs/roadmap.md) — build order as a tickable checklist.

## Maintaining this file

Append to the relevant section (or doc) when a fact surfaces that a fresh session would have to re-derive: a rename, a non-default split, an env-var coupling, a workaround, or a new shared component. **Do not** add things the model already knows by default (Astro basics, generic Sanity/TS syntax, standard patterns). If a fact is visible in `package.json` or one `ls`, it doesn't belong here.

**Writing style for all docs in this repo (including this file):** impersonal, declarative. No second person ("you"), no first person, no references to a specific person ("owner", "author"). Use imperatives ("Add...", "Don't...") or passive/general phrasing ("When X happens..."). Treat docs as a spec, not a letter.
