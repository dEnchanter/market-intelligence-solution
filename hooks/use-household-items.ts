import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { householdItemsApi } from "@/lib/api/household-items";
import { UpdateHouseholdItemRequest } from "@/lib/types/household-items";
import { toast } from "sonner";

// Query: Get all household items
export function useHouseholdItems() {
  return useQuery({
    queryKey: ["household-items", "all"],
    queryFn: () => householdItemsApi.getAll(),
  });
}

// Mutation: Update household item
export function useUpdateHouseholdItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHouseholdItemRequest }) =>
      householdItemsApi.update(id, data),
    onSuccess: (data) => {
      toast.success("Item Updated", {
        description:
          data.message || "Household item has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["household-items"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update Item", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
