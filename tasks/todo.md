# Phase 25: Auto Daily Arch Stories Generator

## Implementation (DONE)
- [x] Migration: `used_articles` table (applied to Supabase)
- [x] RSS library: `src/lib/rss/fetchFeeds.ts` (multi-source: ArchDaily, Dezeen, Designboom)
- [x] Story generator: `src/lib/rss/generateStory.ts` + `translations.ts`
- [x] StorySlide: 5 visual styles (dark, light, orange, blueprint, minimal)
- [x] BlogPostForm: updated style selector with all 5 options
- [x] Cron route: `src/app/api/cron/generate-stories/route.ts`
- [x] `next.config.ts`: remote image patterns for RSS sources
- [x] `vercel.json`: daily cron at 06:00 UTC
- [x] TypeScript compiles clean
- [x] Migration applied to Supabase

## Remaining (manual)
- [ ] Set `CRON_SECRET` env var in Vercel dashboard
- [ ] Deploy to Vercel + verify cron in dashboard
- [ ] Manual test: `curl` the cron endpoint with `?secret=ADMIN_SECRET`
