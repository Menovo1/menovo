import { createFileRoute } from "@tanstack/react-router";

/**
 * Stable public URL for a file in the private `media` bucket.
 * Redirects to a freshly signed URL so links pasted into the CMS never expire.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = decodeURIComponent((params as { _splat?: string })._splat ?? "");
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage
          .from("media")
          .createSignedUrl(path, 60 * 60);

        if (error || !data?.signedUrl) return new Response("Not found", { status: 404 });

        return new Response(null, {
          status: 302,
          headers: {
            Location: data.signedUrl,
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
