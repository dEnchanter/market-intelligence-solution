import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api/stats";

// Query: Get stats summary
export function useStatsSummary() {
  return useQuery({
    queryKey: ["stats", "summary"],
    queryFn: () => statsApi.getSummary(),
  });
}
