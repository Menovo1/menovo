/**
 * Canonical public configuration for the single MENOVO backend.
 *
 * These values are intentionally public: the same URL and publishable key are
 * shipped to every browser. Keeping one canonical pair prevents a hosting
 * provider from signing users into one project while server functions validate
 * their tokens or read content from another project.
 */
export const SUPABASE_PROJECT_URL = "https://hgptykqqmxssvilvduhz.supabase.co";
export const SUPABASE_PROJECT_PUBLISHABLE_KEY = "sb_publishable_1VZ-hoByv8lxRQ3De-_o9w_1chS9Swt";

export function assertCanonicalServerProject() {
  const configuredUrl = process.env["SUPABASE_URL"];
  const configuredKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

  if (configuredUrl && configuredUrl !== SUPABASE_PROJECT_URL) {
    throw new Error("Backend configuration mismatch: SUPABASE_URL does not belong to MENOVO.");
  }
  if (configuredKey && configuredKey !== SUPABASE_PROJECT_PUBLISHABLE_KEY) {
    throw new Error("Backend configuration mismatch: SUPABASE_PUBLISHABLE_KEY does not belong to MENOVO.");
  }
}