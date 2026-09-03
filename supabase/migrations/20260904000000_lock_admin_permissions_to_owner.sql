-- Lock administrator permission management to the primary (oldest) admin.
DROP POLICY IF EXISTS "Admins manage permissions" ON public.admin_permissions;

CREATE POLICY "Primary admin manages permissions" ON public.admin_permissions
  FOR ALL TO authenticated
  USING (
    auth.uid() = (
      SELECT ur.user_id
      FROM public.user_roles ur
      WHERE ur.role = 'admin'
      ORDER BY ur.created_at ASC
      LIMIT 1
    )
  )
  WITH CHECK (
    auth.uid() = (
      SELECT ur.user_id
      FROM public.user_roles ur
      WHERE ur.role = 'admin'
      ORDER BY ur.created_at ASC
      LIMIT 1
    )
  );
