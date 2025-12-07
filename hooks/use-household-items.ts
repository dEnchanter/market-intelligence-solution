import { useQuery } from "@tanstack/react-query";
import { householdItemsApi } from "@/lib/api/household-items";

// Query: Get all household items
export function useHouseholdItems() {
  return useQuery({
    queryKey: ["household-items", "all"],
    queryFn: () => householdItemsApi.getAll(),
  });
}
