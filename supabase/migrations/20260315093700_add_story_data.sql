-- Add story_data JSONB column to blog_posts for Arch Stories feature
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS story_data jsonb DEFAULT NULL;
-- Add source column to distinguish manual vs rss posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';
