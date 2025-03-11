import { User } from "@prisma/client";

export type UserProfileResponse = User | null;

export interface UserProfileUpdateRequest {
  name: string;
  email: string;
  receiptName: string | null;
  iconUrl: string | null;
}
