import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";

export function normalizeImageUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return "";

  // Google Drive "view" and "open" links are HTML pages, not image files.
  // Convert them to a direct thumbnail URL that browsers can render.
  const drive = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/i) ?? raw.match(/[?&]id=([^&]+)/i);
  if (drive?.[1] && /drive\.google\.com/i.test(raw)) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(drive[1])}&sz=w2000`;
  }

  return raw;
}

export async function uploadPublicImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const safeName = file.name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "") || "image";

  const path = `images/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data.publicUrl) throw new Error("Upload succeeded, but no public image URL was returned.");

  return data.publicUrl;
}
