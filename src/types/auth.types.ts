import { IUser } from "./user.types";
import { Role } from "@prisma/client";
import { Request } from "express";

export interface IRegistrationData {
  nickname: string;
  email: string;
  password: string;
  role: Role;
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
  role: Role;
}

export interface IRegistrationResponseToken {
  token: string;
}

export interface IRegistrationResponse<T> {
  user: T;
  access_token?: string;
  refresh_token: string;
}

export interface ILoginResponse<T> {
  user: T;
  access_token: string;
  refresh_token: string;
}

export interface IRefreshData {
  user_id: number;
  refresh_token: string;
}

export interface IRefreshResponse {
  access_token: string;
  refresh_token: string;
}

export interface IAuthService {
  registration(registrationData: IRegistrationData): Promise<IRegistrationResponse<IRegistrationResponseUser>>;
  login(loginData: ILoginData): Promise<ILoginResponse<IUser>>;
  logout(userId: number, refresh_token: string): Promise<IUser>;
  refresh(refreshToken: IRefreshData): Promise<IRefreshResponse>;
}

export interface IAuthRepository {
  registrationUser(registrationData: IRegistrationData): Promise<IRegistrationResponse<IRegistrationResponseUser>>;
  loginUser(loginData: ILoginData): Promise<ILoginResponse<IUser>>;
  logoutUser(userId: number, refresh_token: string): Promise<IUser>;
  refreshTokens(refreshData: IRefreshData): Promise<IRefreshResponse>;
}

export interface RequestWithTokens extends Request {
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}
