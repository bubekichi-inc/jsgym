export type GoogleRequest = {
  accessToken: string;
};
export type UserProfileResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    iconUrl: string | null;
  };
};
