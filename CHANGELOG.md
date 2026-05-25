# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [v2.1.0] - 2026-05-25
### Added
- Auth error page (`/auth/auth-code-error`) — users no longer see 404 on failed OAuth login.
- PRD delete functionality — trash button in document header with confirmation modal and cascade delete.
- Dashboard now shows all PRDs in a responsive grid with titles, descriptions, and timestamps.
- Sidebar auto-refreshes after PRD creation/deletion via custom `prd-created` event.
- Navigation guard (`beforeunload`) warns users during PRD generation.
- Revision overlay with spinner prevents reading stale content during AI revision.
- Version limit: max 50 revisions per PRD to prevent storage bloat.
- Changelog link added to sidebar footer.
- Database migration: `NOT NULL` constraint on `prds.user_id`, index on `prd_versions.prd_id`.

### Changed
- **Switched AI provider from Groq (Llama 3.3) to Google Gemini API (`gemini-3.1-flash-lite`)**. Both `generate-prd` and `update-prd` routes now use the Gemini REST API with `systemInstruction`, `responseMimeType: application/json`, and proper response parsing.
- Input validation on PRD generation: title (2–200 chars), idea (10–10,000 chars), type checks and trimming.
- API error messages no longer leak implementation details (env var names, internal errors).
- Ownership check returns 403/404 instead of 401 to avoid leaking document existence.
- JSON parse failures return 502 with user-friendly retry message instead of crashing.
- Bumped `maxDuration` from 60s to 120s for complex PRD generation.
- Sidebar fetch debounced (100ms) to reduce redundant requests on fast navigation.

### Fixed
- Export filename regex bug: `\\\\s+` → `\\s+` so spaces are properly replaced with underscores.
- Self-referencing `--font-mono` CSS variable replaced with proper monospace fallback stack.
- "Terms of service" text in login page is now a clickable link.

### Removed
- Dead `/auth/signout` server route (logout uses client-side `supabase.auth.signOut()`).

### Security
- `seed-test-prd` route blocked in production via `NODE_ENV` guard.
- Verified `.env.local` never committed to git history.


## [v2.0.1] - 2026-05-23
### Fixed
- Fixed missing React elements bug on language switch in `page.tsx` by using index as stable key for feature grid array.
- Fixed cascading render warning in `LanguageContext.tsx` by deferring the initial state setting on hydration using `setTimeout`.
- Resolved static analysis TypeScript error in `exportMd.ts` by explicitly silencing `@typescript-eslint/no-explicit-any` for LLM schema output.
- Replaced the bright native scrollbars in Chrome/Edge with cross-browser subtle themed scrollbars in `globals.css` that match the app's dark aesthetic.
- Removed the 'Powered by Groq' indicator from the landing page layout for a cleaner look.

## [v2.0.0] - 2026-05-23
### Changed
- Restructured repository layout by relocating all files and directories from the `prd-generator` subdirectory directly to the workspace root directory (`d:\CODE\PRD-MAKER`) for easier workspace navigation and a cleaner development workflow.
- Relocated the git repository, `.env.local` credentials, configuration, and dependencies directly to the workspace root.
- Upgraded project branch to `v2.0.0` as a major release.

## [v1.1.1] - 2026-05-22
### Fixed
- Synced state loading inside React `useEffect` in `prd/[id]/page.tsx` using a self-contained `fetchData` logic combined with a `refreshTrigger` state to resolve the cascading renders static analysis error completely.
- Adjusted bullet dot alignment in the PRD view page (`prd/[id]/page.tsx`) by replacing `items-baseline` with `items-start` and a precision top margin for perfect horizontal centering.
- Removed unused imports (`useCallback`, `useEffect`) from `src/components/Sidebar.tsx` and `src/app/login/page.tsx` to eliminate code smell and clean up linter warnings.
- Cleaned up multiple Tailwind CSS utility warnings on `src/app/page.tsx` (using standard `hover:-translate-y-px`, fixing layout conflicts on hidden/flex classes, and migrating from `h-[1px]` to `h-px`).
- Avoided unused map variables (`i`) in `src/app/page.tsx` loops.

## [v1.1.0] - 2026-05-22
### Added
- Fully redesigned high-fidelity, highly aesthetic bilingual landing page following the Warm Restraint design system (Source Serif 4 display headings, DM Sans body text, oklch terracotta/rust signature accent).
- Interactive workspace mockups in the landing page showing actual Product Requirements Documents (PRDs) with real-world descriptions, user personas, prioritised features, and tech stacks (bilingual: English & Indonesian).
- Animated auto-typing revision demonstration showing how user prompt inputs automatically generate new PRD document versions (v1 -> v2) inside the landing page mockup.
- Bilingual support context (`LanguageContext`) for effortless switching between English and Indonesian.
- ChatGPT-style dark sidebar with search, date-grouped PRD lists, and collapsible panels.
- Confirmation modal before signing out (`LogoutModal`).
- Local account history in Login Page so users can sign back in instantly using previously used accounts.

### Fixed
- Synced state loading inside React `useEffect` hooks in both `login/page.tsx` and `prd/[id]/page.tsx` using lazy state initialization and conditional fetching parameter (`showLoading`) to completely resolve the cascading renders console errors.
- Fixed React state updates in the sidebar component using inline mount tracking `isMounted` inside `useEffect` to safely handle unmounting and prevent warnings.
- Upgraded CSS opacity syntax in Sidebar.tsx from arbitrary bracket fractions (`white/[0.06]`) to standard native Tailwind CSS v4 percentages (`white/6` and `white/8`).
