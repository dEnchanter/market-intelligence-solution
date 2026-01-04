import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { householdsApi } from "@/lib/api/households";
import {
  CreateHouseholdRequest,
  NearbyHouseholdsFilters,
  UpdateHouseholdRequest,
} from "@/lib/types/households";
import { toast } from "sonner";

// Query: Get all households
export function useHouseholds() {
  return useQuery({
    queryKey: ["households", "all"],
    queryFn: () => householdsApi.getAll(),
  });
}

// Query: Get nearby households with specific filters
export function useNearbyHouseholds(
  filters: NearbyHouseholdsFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["households", "nearby", filters],
    queryFn: () => householdsApi.getNearby(filters),
    enabled,
  });
}

// Mutation: Create household
export function useCreateHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHouseholdRequest) => householdsApi.create(data),
    onSuccess: (data) => {
      toast.success("Household Created", {
        description:
          data.message || "The household has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["households"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Household", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update household
export function useUpdateHousehold() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHouseholdRequest }) =>
      householdsApi.update(id, data),
    onSuccess: (data) => {
      toast.success("Household Updated", {
        description:
          data.message || "Household has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["households"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Household", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
