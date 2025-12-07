import { API_CONFIG, getApiUrl, getAuthHeaders } from "./config";
import {
  CreateUserRequest,
  CreateUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CheckPhoneFilters,
  CheckPhoneResponse,
  GetUsersResponse,
} from "../types/users";

export const usersApi = {
  // Get all users
  list: async (): Promise<GetUsersResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.BASE),
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Create a user
  create: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.BASE),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Change password
  changePassword: async (
    payload: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Update user by ID
  update: async (
    id: string,
    payload: UpdateUserRequest
  ): Promise<UpdateUserResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.BY_ID(id)),
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Reset password for a user
  resetPassword: async (
    id: string,
    payload: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS.RESET_PASSWORD(id)),
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },

  // Check if phone number exists
  checkPhone: async (
    filters: CheckPhoneFilters
  ): Promise<CheckPhoneResponse> => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      queryParams.append("phone", filters.phone);

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.USERS.CHECK_PHONE)}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // For phone check, we want to return the data even if status is 409
      // 409 means phone already exists, which is valuable information
      if (!response.ok && response.status !== 409) {
        throw new Error(data.message || "Failed to check phone");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  },
};
