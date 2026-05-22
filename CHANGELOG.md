# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

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
