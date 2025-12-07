import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { householdExpendituresApi } from "@/lib/api/household-expenditures";
import {
  CreateExpenditureRequest,
  ExpenditureListFilters,
  ExpenditureStatsFilters,
} from "@/lib/types/household-expenditures";
import { toast } from "sonner";

// Query: Get list of expenditures with optional filters
export function useExpenditures(filters?: ExpenditureListFilters) {
  return useQuery({
    queryKey: ["household-expenditures", "list", filters],
    queryFn: () => householdExpendituresApi.getList(filters),
  });
}

// Query: Get expenditure stats with optional filters
export function useExpenditureStats(filters?: ExpenditureStatsFilters) {
  return useQuery({
    queryKey: ["household-expenditures", "stats", filters],
    queryFn: () => householdExpendituresApi.getStats(filters),
  });
}

// Mutation: Create household expenditure
export function useCreateExpenditure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenditureRequest) =>
      householdExpendituresApi.create(data),
    onSuccess: (data) => {
      toast.success("Expenditure Recorded", {
        description:
          data.message || "The expenditure has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["household-expenditures"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Record Expenditure", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
