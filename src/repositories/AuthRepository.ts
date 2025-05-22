import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { prisma } from "./index.js";
import { PrismaClient } from "@prisma/client";
import { ILoginData, IRefreshData, IRefreshResponse, IRegistrationData, IAuthRepository, IToken } from "../types/auth.types.js";
import { compareHash } from "../utils/hash.js";
import { createJwt } from "../utils/jwt.js";

class AuthRepository implements IAuthRepository {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.registrationUser = this.registrationUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
  }

  async registrationUser(userData: IRegistrationData) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            nickname: userData.nickname,
            email: userData.email,
            password: userData.password,
            role: userData.role,
          },

          select: {
            id: true,
            email: true,
            nickname: true,
            role: true,
          },
        });

        const { token: accessToken } = createJwt({ id: user.id, email: user.email, role: user.role }, 60);
        const refreshToken = createJwt({ id: user.id, email: user.email, role: user.role }, 1440);

        const token = await tx.refreshToken.create({
          data: {
            token: refreshToken.token,
            user_id: user.id,
            expires_at: refreshToken.expires_at,
            revoked_at: false,
          },

          select: {
            token: true,
          },
        });

        return { user, access_token: accessToken, refresh_token: token.token };
      });

      return result;
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

      const { token: access_token } = createJwt({ id: user.id, email, role: user.role }, 60);
      const refresh_token = createJwt({ id: user.id, email, role: user.role }, 1440);

      const token = await this.prisma.refreshToken.create({
        data: {
          token: refresh_token.token,
          user_id: user.id,
          expires_at: refresh_token.expires_at,
          revoked_at: false,
        },

        select: {
          token: true,
        },
      });

      const userObj = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      };

      return { user: userObj, access_token, refresh_token: token.token };
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

  async refreshTokens(refreshData: IRefreshData): Promise<IRefreshResponse> {
    try {
      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: {
          user_id: refreshData.user_id,
          token: refreshData.refresh_token,
          revoked_at: false,
        },
      });

      if (!refreshToken) throw new Error("Refresh token not found");
      const user = await this.prisma.user.findFirst({
        where: {
          id: +refreshData.user_id,
        },
      });

      if (!user) throw new Error("User not found");
      const { token: access_token } = createJwt({ id: user.id, email: user.email, role: user.role }, 60);
      const { token: refresh_token } = createJwt({ id: user.id, email: user.email, role: user.role }, 1440);
      await this.prisma.refreshToken.update({
        where: {
          id: refreshToken.id,
        },
        data: { revoked_at: false, token: refresh_token },
      });

      return { access_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const authRepository = new AuthRepository(prisma);
