import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import {
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/lib/types/users";
import { toast } from "sonner";

// Query: Get all users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.list,
  });
}

// Mutation: Create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: (data) => {
      toast.success("User Created", {
        description: data.message || "The user has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Create User", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: (data) => {
      toast.success("User Updated", {
        description: data.message || "The user has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Update User", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => usersApi.changePassword(data),
    onSuccess: (data) => {
      toast.success("Password Changed", {
        description: data.message || "Your password has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to Change Password", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Mutation: Reset password
export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordRequest }) =>
      usersApi.resetPassword(id, data),
    onSuccess: (data) => {
      toast.success("Password Reset", {
        description: data.message || "The user password has been reset successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to Reset Password", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
  });
}

// Query: Check if phone exists
export function useCheckPhone(phone: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["check-phone", phone],
    queryFn: () => usersApi.checkPhone({ phone }),
    enabled: enabled && phone.length >= 11,
    retry: false, // Don't retry on 409 errors
  });
}
