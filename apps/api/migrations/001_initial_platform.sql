create table if not exists workspace_templates (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  default_provider_profile_id uuid,
  storage_profile_id uuid,
  enabled_niche_pack_keys jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists provider_profiles (
  id uuid primary key,
  workspace_template_id uuid not null,
  provider_key text not null,
  display_name text not null,
  base_url text not null,
  api_key_secret_ref text not null,
  default_text_model text not null,
  default_video_model text not null,
  default_image_model text,
  enabled_capabilities jsonb not null default '[]'::jsonb,
  fallback_priority integer,
  status text not null,
  last_validated_at timestamptz
);
