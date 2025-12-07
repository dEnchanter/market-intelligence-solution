import { useQuery } from "@tanstack/react-query";
import { geoApi } from "@/lib/api/geo";

// Query: Get all states
export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: geoApi.getStates,
  });
}

// Query: Get LGAs for a district
export function useDistrictLGAs(districtId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["district-lgas", districtId],
    queryFn: () => geoApi.getDistrictLGAs(districtId),
    enabled: enabled && !!districtId,
  });
}
