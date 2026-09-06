import { createClient } from "@supabase/supabase-js";
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";
import {
  SUPABASE_PROJECT_PUBLISHABLE_KEY,
  SUPABASE_PROJECT_URL,
  assertCanonicalServerProject,
} from "@/integrations/supabase/project-config";

function projectFetch(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(
    typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
  );
  if (init?.headers) {
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
  }
  if (
    headers.get("Authorization") ===
    `Bearer ${SUPABASE_PROJECT_PUBLISHABLE_KEY}`
  ) {
    headers.delete("Authorization");
  }
  headers.set("apikey", SUPABASE_PROJECT_PUBLISHABLE_KEY);
  return fetch(input, { ...init, headers });
}

/** Authenticates server functions against the same project used by the browser. */
export const requireMenovoAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    assertCanonicalServerProject();

    const authHeader = getRequest()?.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Unauthorized: No authorization token provided");
    }

    const token = authHeader.slice("Bearer ".length);
    if (token.split(".").length !== 3) {
      throw new Error("Unauthorized: Invalid token");
    }

    const supabase = createClient<Database>(
      SUPABASE_PROJECT_URL,
      SUPABASE_PROJECT_PUBLISHABLE_KEY,
      {
        global: {
          fetch: projectFetch,
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims?.sub) {
      throw new Error("Unauthorized: Invalid token");
    }

    return next({
      context: {
        supabase,
        userId: data.claims.sub,
        claims: data.claims,
      },
    });
  },
);