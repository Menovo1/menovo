-- ============ MESSAGES ============
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage messages" ON public.messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE CONTENT ============
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write site content" ON public.site_content FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SERVICES ============
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are public" ON public.services FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read all services" ON public.services FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PORTFOLIO ============
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  description text NOT NULL DEFAULT '',
  cover_image_url text,
  video_url text,
  website_url text,
  category text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read all projects" ON public.portfolio_projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write projects" ON public.portfolio_projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER portfolio_updated_at BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ BLOG ============
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  featured_image_url text,
  category text,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'ASAD JE',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ FAQ ============
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published faqs are public" ON public.faqs FOR SELECT TO anon, authenticated USING (published);
CREATE POLICY "Admins read all faqs" ON public.faqs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ FOUNDER PROFILE ============
CREATE TABLE public.founder_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'ASAD JE',
  title text NOT NULL DEFAULT 'CEO & Founder of MENOVO',
  bio text NOT NULL DEFAULT '',
  image_url text,
  instagram text,
  whatsapp text,
  threads text,
  facebook text,
  twitter text,
  linkedin text,
  github text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.founder_profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.founder_profile TO authenticated;
GRANT ALL ON public.founder_profile TO service_role;
ALTER TABLE public.founder_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founder profile is public" ON public.founder_profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write founder profile" ON public.founder_profile FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER founder_updated_at BEFORE UPDATE ON public.founder_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SETTINGS ============
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text,
  email text,
  phone text,
  instagram text,
  facebook text,
  threads text,
  twitter text,
  linkedin text,
  github text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are public" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write settings" ON public.settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ PAGE VIEWS ============
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read page views" ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE: MEDIA LIBRARY ============
CREATE POLICY "Admins read media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- ============ SEED ============
INSERT INTO public.settings (whatsapp, email, phone)
VALUES ('https://wa.me/251946471234', '2MENOVO@gmail.com', '+251946471234');

INSERT INTO public.founder_profile (name, title, bio, instagram, whatsapp, threads)
VALUES (
  'ASAD JE',
  'CEO & Founder of MENOVO',
  'Asad JE is the founder and CEO of MENOVO, a premium web-development studio specialized in hotel websites. He builds digital experiences that help hospitality businesses move forward.',
  'https://www.instagram.com/the_asad_je/',
  'https://wa.me/251976367556',
  'https://www.threads.com/@the_asad_je'
);

INSERT INTO public.faqs (question, answer, sort_order) VALUES
  ('What hotels do you work with?', 'Independent hotels, boutiques, resorts, guest houses and small groups.', 1),
  ('Do you only build hotel websites?', 'Hotels are our specialization. We also build business websites as a secondary service.', 2),
  ('Do you use templates?', 'No. Every site is designed for your property.', 3),
  ('Can you redesign an existing site?', 'Yes — we keep what works and replace what doesn''t.', 4),
  ('Will it work on phones?', 'Yes. We design mobile-first.', 5),
  ('Can you add WhatsApp?', 'Yes — one-tap enquiry buttons.', 6),
  ('Can guests request bookings?', 'Yes. We build enquiry flows and can link your booking engine.', 7),
  ('Do you offer maintenance?', 'Yes — updates, upkeep and performance.', 8),
  ('Do you work internationally?', 'Yes, worldwide, in English.', 9),
  ('How long does it take?', 'It depends on size and content readiness. We confirm a schedule up front.', 10),
  ('How do I start?', 'Message us on the contact page or WhatsApp.', 11);

INSERT INTO public.services (title, description, features, sort_order) VALUES
  ('Hotel Website Development', 'Bespoke, editorial websites designed exclusively for hotels, resorts and boutique properties.', ARRAY['Hotel-first design','Mobile-first build','Direct enquiry & WhatsApp','Speed & SEO foundations','Visual storytelling galleries','Built to grow'], 1),
  ('Website Redesign', 'We modernise an existing hotel website while keeping what already works.', ARRAY['Brand-led refresh','Improved booking path','Performance rebuild','Content migration'], 2),
  ('Ongoing Care', 'Support after launch — updates, upkeep and performance monitoring.', ARRAY['Content updates','Security & uptime','Performance tuning','Priority support'], 3);

INSERT INTO public.site_content (key, value) VALUES
  ('home', '{"heroHeadline":"","heroAnimated":[],"heroVideoUrl":"","problemTitle":"","problemBody":"","solutionTitle":"","solutionBody":"","ctaTitle":"","ctaBody":"","mission":"","vision":"","values":[],"whyMenovo":[]}'::jsonb),
  ('about', '{"body":"","mission":"","vision":"","values":[],"founderButtonText":"Meet the Founder"}'::jsonb),
  ('footer', '{"description":"","contact":"","note":""}'::jsonb);