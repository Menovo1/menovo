MENOVO PATCH — do not replace the whole project.

Replace/upload only these files at the SAME paths in GitHub:
1. src/components/site/WhatsAppButton.tsx
2. src/lib/site-data.ts
3. src/lib/bookings.functions.ts
4. src/routes/admin.tsx
5. src/integrations/supabase/types.ts
6. src/components/admin/CmsEditor.tsx
7. src/components/admin/CrudSection.tsx
8. supabase/migrations/20260831150000_claim_first_admin.sql

IMPORTANT:
- The SQL migration must be executed once in the Supabase SQL Editor if your Supabase project has not automatically applied it.
- It creates a secure claim_first_admin() RPC. The first authenticated account becomes the admin; later accounts cannot claim admin.
- The admin session now survives page refreshes.
- The admin page automatically bootstraps the first account instead of showing “No admin access”.
- CMS saves broadcast an update to open website tabs, and the public site no longer waits 15 seconds for stale CMS data.
- The WhatsApp button no longer uses a Lovable asset URL and uses the gold/black MENOVO style shown in your screenshot.
