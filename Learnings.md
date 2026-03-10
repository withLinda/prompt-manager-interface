---
title: Prompt Manager Learnings
purpose: Preserve lessons from hard problems so future agents avoid repeating them.
update_policy: Read this file at the start of work and append new lessons after any bug or problem that takes extra effort to solve.
---

# Learnings

## Table of Contents
- [How to Update This File](#how-to-update-this-file)
- [UI and Product Lessons](#ui-and-product-lessons)
- [Tooling Lessons](#tooling-lessons)
- [Session Notes](#session-notes)

## How to Update This File
- Read this file before making meaningful changes in the repo.
- Add new lessons after any bug, broken tool call, confusing requirement, or fix that took extra effort.
- Append new items instead of rewriting history unless an older note is clearly wrong.
- Keep each lesson short and practical: what happened, why it mattered, and what to do next time.
- Prefer bullets with dates or short session labels so future agents can follow the context quickly.

## UI and Product Lessons
- Avoid duplicate status panels. If folder counts, prompt counts, or current-folder labels already exist nearby, do not repeat them in header chips or summary cards.
- When the user asks for minimalism, remove extra helper text and summary sections before adding new decorative content.
- For UI-heavy changes, always do a visual browser check before treating the design as finished.

## Tooling Lessons
- This repo uses ESLint 9. `next lint` is not enough here; keep the flat config in `eslint.config.mjs` working and prefer `npm run lint`.
- For design-focused work, static checks alone are not enough. Run build/lint and also inspect the rendered page on desktop and mobile.
- During `next dev`, the built-in Next Dev Tools can surface a `SegmentViewNode` / React Client Manifest error that does not reproduce in production build output. Treat that as a dev-tooling issue first, not an immediate app regression.
- Playwright MCP creates local `.playwright-cli/` screenshots and logs in this repo. Keep that folder ignored unless a task explicitly asks to commit captured artifacts.

## Session Notes
- 2026-03-11: The redesign became too busy because extra summary UI was added on top of existing navigation stats. Future changes should start from the current app workflow and only add information that has a clear new job.
- 2026-03-11: After simplifying layout, check desktop whitespace and sidebar truncation again. Removing panels can expose balance problems, and hidden hover actions can still steal width from text if they stay in normal layout flow.
- 2026-03-11: For this product, avoid oversized 24px-34px bubble corners across productivity surfaces. Prefer a tighter, tiered radius system so the UI stays minimal, elegant, and calm.
- 2026-03-11: This product looks stronger with crisp minimal radii than soft rounded radii. Start future refinements from the sharper 18/16/12/10/8 scale instead of reintroducing bubble corners.
