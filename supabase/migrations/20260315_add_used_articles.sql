-- Track used RSS articles to prevent duplicate stories
CREATE TABLE used_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text UNIQUE NOT NULL,
  source_feed text NOT NULL,
  title text NOT NULL,
  used_at timestamptz DEFAULT now()
);

-- RLS: only service_role can read/write
ALTER TABLE used_articles ENABLE ROW LEVEL SECURITY;
