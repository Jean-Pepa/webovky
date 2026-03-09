-- Add custom_sections to about_content (dynamic sections like education/languages)
ALTER TABLE about_content
ADD COLUMN IF NOT EXISTS custom_sections jsonb DEFAULT '[]'::jsonb;

-- Add custom_fields to site_settings (dynamic contact fields)
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '[]'::jsonb;
