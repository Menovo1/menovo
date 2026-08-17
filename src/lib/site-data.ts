import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getSiteData, type SiteData } from "@/lib/public-content.functions";

export const siteDataQuery = queryOptions({
  queryKey: ["site-data"],
  queryFn: () => getSiteData(),
  staleTime: 15_000,
});

/** For pages whose loader called ensureQueryData(siteDataQuery). */
export function useSite(): SiteData {
  return useSuspenseQuery(siteDataQuery).data;
}

/** For shared chrome (navbar/footer) that may render before the loader resolves. */
export function useSiteOptional(): SiteData | undefined {
  return useQuery(siteDataQuery).data;
}
