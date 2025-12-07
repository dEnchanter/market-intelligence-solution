import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketsApi } from "@/lib/api/markets";
import {
  CreateMarketRequest,
  UpdateMarketRequest,
  UpdateMarketStatusRequest,
  NearbyMarketsFilters,
} from "@/lib/types/markets";
import { toast } from "sonner";

// Query: Get all markets
export function useMarkets() {
  return useQuery({
    queryKey: ["markets", "all"],
    queryFn: () => marketsApi.getAll(),
  });
}

// Query: Get nearby markets with specific filters
export function useNearbyMarkets(
  filters: NearbyMarketsFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["markets", "nearby", filters],
    queryFn: () => marketsApi.getNearby(filters),
    enabled,
  });
}

// Mutation: Create market
export function useCreateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketRequest) => marketsApi.create(data),
    onSuccess: (data) => {
      toast.success("Market Created", {
        description: data.message || "The market has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Market", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update market
export function useUpdateMarket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarketRequest }) =>
      marketsApi.update(id, data),
    onSuccess: (data) => {
      toast.success("Market Updated", {
        description: data.message || "The market has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Market", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update market status
export function useUpdateMarketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarketStatusRequest }) =>
      marketsApi.updateStatus(id, data),
    onSuccess: (data) => {
      toast.success("Market Status Updated", {
        description: data.message || "The market status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Market Status", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
