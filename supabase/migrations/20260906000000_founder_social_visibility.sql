-- MENOVO: optional per-platform visibility controls for the founder profile.
-- Run this migration when connecting the project to Supabase.
ALTER TABLE public.founder_profile
  ADD COLUMN IF NOT EXISTS instagram_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS threads_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS facebook_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS twitter_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS linkedin_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS github_enabled boolean NOT NULL DEFAULT false;
