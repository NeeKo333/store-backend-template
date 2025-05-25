import { IUser } from "./user.types";
import { Role } from "@prisma/client";
import { Request } from "express";
import { Prisma } from "@prisma/client";

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
  user_id: number;
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
  refresh_token?: string;
}

export interface ILoginResponse<T> {
  user: T;
  access_token?: string;
  refresh_token?: string;
}

export interface IRefreshData {
  user_id: number;
  refresh_token: string;
}

export interface IRefreshResponse {
  access_token?: string;
  refresh_token: string;
}

export interface IAuthService {
  registration(registrationData: IRegistrationData): Promise<IRegistrationResponse<IRegistrationResponseUser>>;
  login(loginData: ILoginData): Promise<ILoginResponse<IUser>>;
  logout(userId: number, refresh_token: string): Promise<IUser>;
  refresh(refreshToken: IRefreshData): Promise<IRefreshResponse>;
}

export interface IAuthRepository {
  createUser(tx: Prisma.TransactionClient, registrationData: IRegistrationData): Promise<IRegistrationResponseUser>;
  findUser(userId: number): Promise<IUser>;
  createRefreshToken(tx: Prisma.TransactionClient | false, token: IToken, user: IRegistrationResponseUser): Promise<string>;
  loginUser(loginData: ILoginData): Promise<IUser>;
  logoutUser(userId: number, refresh_token: string): Promise<IUser>;
  findRefreshToken(refreshData: IRefreshData): Promise<IToken>;
  updateRefreshToken(tokenId: number, newValue: string): Promise<IToken>;
}

export interface RequestWithTokens extends Request {
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}
