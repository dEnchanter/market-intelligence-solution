import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consumptionItemsApi } from "@/lib/api/consumption-items";
import {
  ConsumptionItemsFilters,
  ImportConsumptionItemsRequest,
  UpdateConsumptionItemRequest,
} from "@/lib/types/consumption-items";
import { toast } from "sonner";

// Query: Get consumption items with optional filters
export function useConsumptionItems(filters?: ConsumptionItemsFilters) {
  return useQuery({
    queryKey: ["consumption-items", filters],
    queryFn: () => consumptionItemsApi.getItems(filters),
  });
}

// Mutation: Import consumption items
export function useImportConsumptionItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportConsumptionItemsRequest) =>
      consumptionItemsApi.import(data),
    onSuccess: (data) => {
      toast.success("Items Imported", {
        description:
          data.message || "Consumption items have been imported successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["consumption-items"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Import Items", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update consumption item
export function useUpdateConsumptionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConsumptionItemRequest }) =>
      consumptionItemsApi.update(id, data),
    onSuccess: (data) => {
      toast.success("Item Updated", {
        description:
          data.message || "Consumption item has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["consumption-items"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Item", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
