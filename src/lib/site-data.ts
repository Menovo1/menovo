import { queryOptions, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSiteData, type SiteData } from "@/lib/public-content.functions";

export const siteDataQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  // CMS changes should not sit in a 15-second client cache.
  staleTime: 0,
  refetchOnMount: "always",
  refetchOnWindowFocus: true,
});

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

function useLiveSiteRefresh() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["site-data"] });
    };

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
  }, [queryClient]);
}

/** For pages whose loader called ensureQueryData(siteDataQuery). */
export function useSite(): SiteData {
  useLiveSiteRefresh();
  return useSuspenseQuery(siteDataQuery).data;
}

/** For shared chrome (navbar/footer) that may render before the loader resolves. */
export function useSiteOptional(): SiteData | undefined {
  useLiveSiteRefresh();
  return useQuery(siteDataQuery).data;
}
