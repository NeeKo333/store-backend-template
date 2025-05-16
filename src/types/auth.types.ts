import { IUser } from "./user.types";

export interface IRegistrationData {
  nickname: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IToken {
  id?: number;
  token: string;
  expires_at: number;
  revoked_at: boolean;
}

export interface IRegistrationResponseUser {
  id: number;
  email: string;
  nickname: string;
}

export interface IRegistrationResponseToken {
  token: string;
}

export interface IRegistrationResponse<T> {
  user: T;
  accsess_token?: string;
  refresh_token: string;
}

export interface ILoginResponse<T> {
  user: T;
  accsess_token: string;
  refresh_token: string;
}

export interface IRefreshData {
  user_id: string;
  refresh_token: string;
}

export interface IRefreshResponse {
  accsess_token: string;
  refresh_token: string;
}

export interface IAuthService {
  registration(registrationData: IRegistrationData): Promise<IRegistrationResponse<IRegistrationResponseUser>>;
  login(loginData: ILoginData): Promise<ILoginResponse<IUser>>;
  refresh(refreshToken: IRefreshData): Promise<IRefreshResponse>;
}

export interface IUserRepository {
  registrationUser(registrationData: IRegistrationData): Promise<IRegistrationResponse<IRegistrationResponseUser>>;
  loginUser(loginData: ILoginData): Promise<ILoginResponse<IUser>>;
  refreshTokens(refreshData: IRefreshData): Promise<IRefreshResponse>;
}
