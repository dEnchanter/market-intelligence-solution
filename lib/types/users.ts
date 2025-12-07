// User
export interface User {
  id?: string;
  address: string | null;
  district_id: string | null;
  email: string;
  name: string;
  phone: string;
  ProfileType: string;
  role?: {
    ID: string;
    name: string;
    permissions: any;
  };
  role_id?: string;
  added_by: string | null;
  FailedLoginAttempts: number;
  IsLocked: boolean;
  IsActive: boolean;
  LockedAt: string | null;
  CreatedAt: string;
  is_active?: boolean; // Keep for backwards compatibility
}

// Create user request
export interface CreateUserRequest {
  address: string;
  district_id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  profile_type: string;
}

// Change password request
export interface ChangePasswordRequest {
  new_password: string;
  old_password: string;
}

// Update user request
export interface UpdateUserRequest {
  address: string;
  district_id: string;
  email: string;
  is_active: boolean;
  name: string;
  phone: string;
  profile_type: string;
  role_id?: string;
}

// Reset password request
export interface ResetPasswordRequest {
  new_password: string;
}

// Check phone filters
export interface CheckPhoneFilters {
  phone: string;
}

// Generic API response
export interface UserApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Response types
export type CreateUserResponse = UserApiResponse<User>;
export type ChangePasswordResponse = UserApiResponse<any>;
export type UpdateUserResponse = UserApiResponse<User>;
export type ResetPasswordResponse = UserApiResponse<any>;
export type CheckPhoneResponse = UserApiResponse<any>;
export type GetUsersResponse = UserApiResponse<User[]>;
