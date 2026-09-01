-- Secure first-admin bootstrap for the MENOVO control room.
-- No service-role key is needed for this operation.
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  admin_exists boolean;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Serialize the bootstrap so two first logins cannot both become admin.
  PERFORM pg_advisory_xact_lock(hashtext('menovo_first_admin_bootstrap'));

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;

  IF admin_exists THEN
    RETURN EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = current_user_id AND role = 'admin'
    );
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;