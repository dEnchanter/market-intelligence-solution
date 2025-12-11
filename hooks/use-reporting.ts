import { useQuery } from "@tanstack/react-query";
import { reportingApi } from "@/lib/api/reporting";
import {
  MarketHouseholdReportFilters,
  MyMarketHouseholdReportFilters,
} from "@/lib/types/reporting";

// Query: Get market household report
// Parameters: added_by_id (string), month (integer), year (integer)
export function useMarketHouseholdReport(
  added_by_id?: string,
  month?: number,
  year?: number
) {
  const filters: MarketHouseholdReportFilters = {
    added_by_id,
    month,
    year,
  };

  return useQuery({
    queryKey: ["reporting", "market-household", filters],
    queryFn: () => reportingApi.getMarketHouseholdReport(filters),
  });
}

// Query: Get my market household report
// Parameters: month (integer), year (integer)
export function useMyMarketHouseholdReport(month?: number, year?: number) {
  const filters: MyMarketHouseholdReportFilters | undefined =
    month !== undefined || year !== undefined ? { month, year } : undefined;

  return useQuery({
    queryKey: ["reporting", "my-market-household", filters],
    queryFn: () => reportingApi.getMyMarketHouseholdReport(filters),
  });
}
