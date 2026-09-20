import { useEffect, useState } from "react";
import { getFallbackSiteData, getSiteData, type SiteData } from "@/lib/public-content.functions";

/**
 * Public site data is intentionally kept independent from React Query during SSR.
 * This avoids coupling the public marketing pages to a request-scoped QueryClient
 * while still refreshing CMS data in the browser after the fallback HTML renders.
 */
export const siteDataQuery = {
  queryKey: ["site-data"] as const,
};

/** Notify open website tabs that the CMS changed. */
export function broadcastSiteDataUpdate() {
  if (typeof window === "undefined") return;
  const stamp = String(Date.now());
  try {
    localStorage.setItem("menovo-site-data-updated", stamp);
  } catch {
    // Ignore storage restrictions; the current tab still refetches on navigation.
  }
  try {
    const channel = new BroadcastChannel("menovo-site-data");
    channel.postMessage(stamp);
    channel.close();
  } catch {
    // BroadcastChannel is not available in every browser.
  }
}

async function loadSiteData(setData: (data: SiteData) => void) {
  try {
    const data = await getSiteData();
    setData(data);
  } catch {
    // Keep the built-in fallback if the CMS is unavailable.
  }
}

/** Render immediately from built-in defaults, then refresh CMS data in the background. */
export function useSite(): SiteData {
  const [data, setData] = useState<SiteData>(() => getFallbackSiteData());

  useEffect(() => {
    void loadSiteData(setData);

    const refresh = () => void loadSiteData(setData);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "menovo-site-data-updated") refresh();
    };

    window.addEventListener("storage", onStorage);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("menovo-site-data");
      channel.addEventListener("message", refresh);
    } catch {
      channel = null;
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  return data;
}

/** For shared chrome that may render before the CMS request resolves. */
export function useSiteOptional(): SiteData | undefined {
  const [data, setData] = useState<SiteData | undefined>(undefined);

  useEffect(() => {
    void loadSiteData(setData);
  }, []);

  return data;
}
