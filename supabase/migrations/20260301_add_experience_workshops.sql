-- Add structured experience and workshops columns to about_content
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS workshops jsonb DEFAULT '[]'::jsonb;

-- Seed experience data
UPDATE about_content SET experience = '[
  {"text_cs": "Rekonstrukce chaty — Bítov", "text_en": "Cottage Reconstruction — Bítov", "date_cs": "2024", "date_en": "2024"},
  {"text_cs": "Přestavba kult. domu — Kuchařovice", "text_en": "Cultural House Renovation — Kuchařovice", "date_cs": "Realizace", "date_en": "In Progress"},
  {"text_cs": "Návrhy prvků — Bar, Krb, Kříž", "text_en": "Element Designs — Bar, Fireplace, Cross", "date_cs": "Průběžně", "date_en": "Ongoing"}
]'::jsonb;

-- Seed workshops data
UPDATE about_content SET workshops = '[
  {"name_cs": "Workshop Litomyšl", "name_en": "Workshop Litomyšl", "org_cs": "FA VUT", "org_en": "FA BUT"},
  {"name_cs": "Exkurze Berlín — IBA 1979–1987", "name_en": "Excursion Berlin — IBA 1979–1987", "org_cs": "FA VUT", "org_en": "FA BUT"},
  {"name_cs": "Exkurze Zlín", "name_en": "Excursion Zlín", "org_cs": "FA VUT", "org_en": "FA BUT"}
]'::jsonb;
