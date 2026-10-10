interface TGAuth{
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name: string;
  photo_url: string;
  username: string;
}

interface AuthResponse {
  message: string;
  token: string;
}

export type { TGAuth, AuthResponse } 