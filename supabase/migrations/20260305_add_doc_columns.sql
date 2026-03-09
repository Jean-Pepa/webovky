-- Add documentation columns to projects table
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS doc_images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS doc_video text DEFAULT NULL;

-- Migrate hardcoded doc data: Podhoran (13 images)
UPDATE projects SET doc_images = '[
  {"src": "/images/podhoran-doc/zluts.png", "alt": "Širší situace"},
  {"src": "/images/podhoran-doc/pozemek.png", "alt": "Situace pozemku"},
  {"src": "/images/podhoran-doc/reziky.png", "alt": "Řezy okolím"},
  {"src": "/images/podhoran-doc/axo.png", "alt": "Axonometrie okolí"},
  {"src": "/images/podhoran-doc/budo.png", "alt": "Axonometrie budovy"},
  {"src": "/images/podhoran-doc/hmota.png", "alt": "Hmotová studie"},
  {"src": "/images/podhoran-doc/1pp.jpg", "alt": "1. PP"},
  {"src": "/images/podhoran-doc/1np.jpg", "alt": "1. NP"},
  {"src": "/images/podhoran-doc/2np.jpg", "alt": "2. NP"},
  {"src": "/images/podhoran-doc/3np.jpg", "alt": "3. NP"},
  {"src": "/images/podhoran-doc/4np.jpg", "alt": "4. NP"},
  {"src": "/images/podhoran-doc/rez-a.jpg", "alt": "Řez A"},
  {"src": "/images/podhoran-doc/rez-b.jpg", "alt": "Řez B"}
]'::jsonb WHERE slug = 'hotel-podhoran';

-- Migrate hardcoded doc data: Bítov (video + 8 images)
UPDATE projects SET doc_images = '[
  {"src": "/images/bitov-doc/demolice-krb.jpg", "alt": "Demolice krbu"},
  {"src": "/images/bitov-doc/zaklady-armatura.jpg", "alt": "Základy — armatura"},
  {"src": "/images/bitov-doc/stavba-zdi.jpg", "alt": "Stavba zdí"},
  {"src": "/images/bitov-doc/stavba-strecha.jpg", "alt": "Stavba — střecha"},
  {"src": "/images/bitov-doc/interier-krb.jpg", "alt": "Interiér — krb"},
  {"src": "/images/bitov-doc/interier-schodiste.jpg", "alt": "Interiér — schodiště"},
  {"src": "/images/bitov-doc/ocelove-schodiste.jpg", "alt": "Ocelové schodiště"},
  {"src": "/images/bitov-doc/interier-loznice.jpg", "alt": "Interiér — ložnice"}
]'::jsonb,
doc_video = '/videos/bitov-rekonstrukce.mp4'
WHERE slug = 'rekonstrukce-bitov';

-- Migrate hardcoded doc data: Zlín (1 image)
UPDATE projects SET doc_images = '[
  {"src": "/images/zlin-doc/00-katastr.png", "alt": "Katastrální mapa"}
]'::jsonb WHERE slug = 'nevideny-zlin';
