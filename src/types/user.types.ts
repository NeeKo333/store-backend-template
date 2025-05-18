import { Role } from "@prisma/client";

export interface IUser {
  id: number;
  nickname: string;
  email: string;
  role: Role;
  createdAt?: Date;
}
