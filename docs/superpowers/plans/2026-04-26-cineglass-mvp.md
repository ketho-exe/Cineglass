# CineGlass MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished first version of CineGlass with TMDB discovery, EmbedMaster playback, Supabase-ready structure, and a complete `schema.sql`.

**Architecture:** Use Next.js App Router with server API routes for TMDB and playback URL construction. Keep EmbedMaster URL logic isolated in `lib/providers/embedmaster.ts`, TMDB logic isolated in `lib/tmdb/client.ts`, and shared media UI in focused components.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase client helpers, Lucide React, Framer Motion, Vitest.

---

### Tasks

- [ ] Scaffold the Next.js/Tailwind/Vitest project.
- [ ] Write failing tests for EmbedMaster URL construction and TMDB normalization.
- [ ] Implement typed media utilities, TMDB client, and EmbedMaster provider.
- [ ] Add API routes for search, details, seasons, and playback.
- [ ] Build app shell, home, search, detail, watch, library, admin, profile, and settings pages.
- [ ] Add Supabase helpers and `supabase/schema.sql`.
- [ ] Verify with tests, build, and browser smoke test.
- [ ] Commit and push to `https://github.com/ketho-exe/Cineglass`.
