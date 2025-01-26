export interface UserProfileUpdateRequest {
  name?: string;
  email?: string;
  invoiceName?: string;
  iconUrl?: string;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  invoiceName?: string;
  iconUrl?: string;
}
