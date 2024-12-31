export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface IntrospectResponse {
  active: boolean;
  username?: string;
}
