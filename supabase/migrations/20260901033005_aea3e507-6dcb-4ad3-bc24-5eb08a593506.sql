CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  show_footer boolean NOT NULL DEFAULT true,
  show_contact boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read social links"
  ON public.social_links FOR SELECT
  USING (true);

CREATE POLICY "Admins manage social links"
  ON public.social_links FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.social_links (platform, url, sort_order) VALUES
  ('whatsapp', 'https://wa.me/251946471234', 1),
  ('instagram', '', 2),
  ('facebook', '', 3),
  ('tiktok', '', 4),
  ('linkedin', '', 5);

ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS source text;

UPDATE public.settings SET email = 'info@menovo.agency', whatsapp = '+251946471234';