export interface UserProfileResponse {
  id: string;
  name: string | null;
  email: string | null;
  iconUrl: string | null;
  receiptName: string | null;
}

export interface UserProfileUpdateRequest {
  name: string;
  email: string;
  receiptName: string | null;
  iconUrl: string | null;
}
