# Arch Stories na Blog stránku

## Implementace (DONE)
- [x] Migration: `story_data` JSONB + `source` text sloupce do `blog_posts`
- [x] Types update: `StoryData` interface + rozšíření `BlogPost`
- [x] API route `/api/stories` — GET published stories
- [x] API route `/api/stories/rss` — GET ArchDaily RSS feed
- [x] Component `StorySlide.tsx` — dark/light story slide
- [x] Component `ArchStories.tsx` — phone mockup viewer s progress bars
- [x] Blog page integrace — stories viewer + cards + regular posts
- [x] Admin: `BlogPostForm` — story fields (style, subtitle, architect, year, stats, tags)
- [x] Admin: `RssImportModal` — ArchDaily RSS import dialog
- [x] Admin: `AdminBlogActions` — Import z ArchDaily + Přidat příspěvek buttons
- [x] Test data: 3 test stories v Supabase
- [x] Build passes, dev server works

## Verification
- [x] `/api/stories` returns 3 stories with story_data
- [x] `/api/stories/rss` returns ArchDaily articles with images
- [x] `/cs/blog` renders "Arch Stories" section
- [x] Build successful (no TypeScript errors)
