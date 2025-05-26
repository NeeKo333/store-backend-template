import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { prisma } from "./index.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { ILoginData, IRefreshData, IRefreshResponse, IRegistrationData, IAuthRepository, IToken, IRegistrationResponseUser } from "../types/auth.types.js";
import { compareHash } from "../utils/hash.js";
import { createJwt } from "../utils/jwt.js";
import { IUser } from "../types/user.types.js";

class AuthRepository implements IAuthRepository {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    this.createUser = this.createUser.bind(this);
    this.findUser = this.findUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.createRefreshToken = this.createRefreshToken.bind(this);
    this.findRefreshToken = this.findRefreshToken.bind(this);
    this.updateRefreshToken = this.updateRefreshToken.bind(this);
  }

  async createUser(tx: Prisma.TransactionClient, registrationData: IRegistrationData) {
    try {
      const user = await tx.user.create({
        data: {
          nickname: registrationData.nickname,
          email: registrationData.email,
          password: registrationData.password,
          role: registrationData.role,
        },

        select: {
          id: true,
          email: true,
          nickname: true,
          role: true,
        },
      });
      return user;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async findUser(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async loginUser(loginData: ILoginData) {
    try {
      const { password, email } = loginData;
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) throw new Error("User no found");
      const passwordIsCompare = await compareHash(password, user.password);

      if (!passwordIsCompare) throw new Error("Password or email not allowed");

      const userObj = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      };

      return userObj;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async logoutUser(userId: number, refresh_token: string) {
    try {
      await this.prisma.refreshToken.update({
        where: {
          user_id_token: {
            user_id: userId,
            token: refresh_token,
          },
        },
        data: {
          revoked_at: true,
        },
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          nickname: true,
          email: true,
          role: true,
        },
      });

      if (!user) throw new Error("User not found");

      return user;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async createRefreshToken(tx: Prisma.TransactionClient | false, tokenData: IToken, userId: number) {
    try {
      let token = null;
      const prismaClient = tx ? tx : this.prisma;
      token = await prismaClient.refreshToken.create({
        data: {
          token: tokenData.token,
          user_id: userId,
          expires_at: tokenData.expires_at,
          revoked_at: false,
        },

        select: {
          token: true,
        },
      });

      return token.token;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async findRefreshToken(refreshData: IRefreshData) {
    try {
      const refresh_token = await this.prisma.refreshToken.findFirst({
        where: {
          user_id: refreshData.user_id,
          token: refreshData.refresh_token,
          revoked_at: false,
        },
      });
      if (!refresh_token) throw new Error("Refresh token not found");
      return refresh_token;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async updateRefreshToken(tokenId: number, newValue: string) {
    try {
      const updatedToken = await this.prisma.refreshToken.update({
        where: {
          id: tokenId,
        },

        data: {
          revoked_at: false,
          token: newValue,
        },
      });

      if (!updatedToken) throw new Error("Fail to update refresh token");
      return updatedToken;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const authRepository = new AuthRepository(prisma);
