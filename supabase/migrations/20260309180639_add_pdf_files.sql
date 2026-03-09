ALTER TABLE projects ADD COLUMN IF NOT EXISTS pdf_files jsonb NOT NULL DEFAULT '[]'::jsonb;
