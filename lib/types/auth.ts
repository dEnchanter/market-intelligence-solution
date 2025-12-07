export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginData {
  token: string;
  expires_at: number;
  profile_type: string;
  name: string;
  district_id: string;
  must_change_password: boolean;
}

export interface LoginResponse {
  data: LoginData;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  success: false;
}
