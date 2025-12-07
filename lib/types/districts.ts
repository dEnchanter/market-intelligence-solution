export interface LGA {
  code?: string;
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
}

export interface AddedBy {
  id: string;
  name: string;
}

export interface District {
  id?: string;
  name: string;
  state: State;
  lga: LGA[];
  added_by?: AddedBy;
}

export interface CreateDistrictRequest {
  name: string;
  state: State;
  lga: LGA[];
}

export interface UpdateDistrictRequest {
  name: string;
  state: State;
  lga: LGA[];
  added_by: AddedBy;
}

export interface DistrictResponse {
  data: District | District[];
  message: string;
  success: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
