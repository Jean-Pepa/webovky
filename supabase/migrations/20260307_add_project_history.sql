CREATE TABLE IF NOT EXISTS project_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'duplicated')),
  changes_summary text,
  created_at timestamptz DEFAULT now()
);

-- RLS: anon can read, service_role has full access
ALTER TABLE project_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON project_history
  FOR SELECT USING (true);
