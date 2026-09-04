CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null,
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, section)
);

GRANT SELECT ON public.admin_permissions TO authenticated;
GRANT ALL ON public.admin_permissions TO service_role;

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view permissions"
ON public.admin_permissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS admin_permissions_updated_at ON public.admin_permissions;
CREATE TRIGGER admin_permissions_updated_at
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();