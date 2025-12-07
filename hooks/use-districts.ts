import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { districtsApi } from "@/lib/api/districts";
import { CreateDistrictRequest, UpdateDistrictRequest } from "@/lib/types/districts";
import { toast } from "sonner";

// Query: Get all districts
export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: districtsApi.getAll,
  });
}

// Query: Get district by ID
export function useDistrict(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["districts", id],
    queryFn: () => districtsApi.getById(id),
    enabled: enabled && !!id,
  });
}

// Mutation: Create district
export function useCreateDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDistrictRequest) => districtsApi.create(data),
    onSuccess: (data) => {
      toast.success("District Created", {
        description: data.message || "The district has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["districts"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Create District", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update district
export function useUpdateDistrict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDistrictRequest }) =>
      districtsApi.update(id, data),
    onSuccess: (data) => {
      toast.success("District Updated", {
        description: data.message || "The district has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["districts"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update District", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}
