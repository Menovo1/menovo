/**
 * Canonical public configuration for the single MENOVO backend.
 *
 * The publishable key is intentionally public and may be shipped to browsers.
 * Secret/service-role keys must never be placed here.
 */
export const SUPABASE_PROJECT_URL = "https://thyxosqqpsnbefchazfj.supabase.co";
export const SUPABASE_PROJECT_PUBLISHABLE_KEY = "sb_publishable_ScXDx4w0AUMN7JILx_65cg_ojVUaMcp";

export function assertCanonicalServerProject() {
  const configuredUrl = process.env["SUPABASE_URL"];
  const configuredKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (configuredUrl && configuredUrl !== SUPABASE_PROJECT_URL) {
    console.warn("[MENOVO] SUPABASE_URL differs from the canonical MENOVO project; using the canonical project.");
  }
  if (configuredKey && configuredKey !== SUPABASE_PROJECT_PUBLISHABLE_KEY) {
    console.warn("[MENOVO] SUPABASE_PUBLISHABLE_KEY differs from the canonical MENOVO project; using the canonical project.");
  }
}
