import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketPricesApi } from "@/lib/api/market-prices";
import {
  CreateMarketPriceRequest,
  UpdateMarketPriceRequest,
  MarketPriceStatsFilters,
  MarketPriceListFilters,
} from "@/lib/types/market-prices";
import { toast } from "sonner";

// Query: Get market price stats
export function useMarketPriceStats(filters?: MarketPriceStatsFilters) {
  return useQuery({
    queryKey: ["market-prices", "stats", filters],
    queryFn: () => marketPricesApi.getStats(filters),
  });
}

// Query: Get market price list
export function useMarketPrices(filters?: MarketPriceListFilters) {
  return useQuery({
    queryKey: ["market-prices", "list", filters],
    queryFn: () => marketPricesApi.getList(filters),
  });
}

// Mutation: Create market price
export function useCreateMarketPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarketPriceRequest) => marketPricesApi.create(data),
    onSuccess: (data) => {
      toast.success("Market Price Added", {
        description: data.message || "The market price has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["market-prices"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Add Market Price", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update market price
export function useUpdateMarketPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMarketPriceRequest }) =>
      marketPricesApi.update(id, data),
    onSuccess: (data) => {
      toast.success("Market Price Updated", {
        description: data.message || "The market price has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["market-prices"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Market Price", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
