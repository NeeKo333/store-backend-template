import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { prisma } from "./index.js";
import { PrismaClient } from "@prisma/client";
import { ILoginData, IRefreshData, IRefreshResponse, IRegistrationData, IUserRepository } from "../types/auth.types.js";
import { compareHash } from "../utils/hash.js";
import { checkJwt, createJwt } from "../utils/jwt.js";

class UserRepository implements IUserRepository {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.registrationUser = this.registrationUser.bind(this);
  }

  async registrationUser(userData: IRegistrationData) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            nickname: userData.nickname,
            email: userData.email,
            password: userData.password,
          },

          select: {
            id: true,
            email: true,
            nickname: true,
          },
        });

        const { token: accsessToken } = createJwt({ id: user.id, email: user.email }, 60);
        const refreshToken = createJwt({ id: user.id, email: user.email }, 1440);

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

        return { user, accsess_token: accsessToken, refresh_token: token.token };
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
      if (await compareHash(user.password, password)) throw new Error("Password or email not allowed");

      const { token: accsess_token } = createJwt({ id: user.id, email }, 60);
      const refresh_token = createJwt({ id: user.id, email }, 1440);

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
      };

      return { user: userObj, accsess_token, refresh_token: token.token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async refreshTokens(refreshData: IRefreshData): Promise<IRefreshResponse> {
    try {
      if (!checkJwt(refreshData.refresh_token)) throw new Error("Refresh token is not valid");

      const refreshToken = await this.prisma.refreshToken.findFirst({
        where: {
          user_id: +refreshData.user_id,
          token: refreshData.refresh_token,
          revoked_at: false,
        },
      });

      if (!refreshToken) throw new Error("Refresh token not found");
      const { token: accsess_token } = createJwt({ id: refreshData.user_id }, 60);
      const { token: refresh_token } = createJwt({ id: refreshData.user_id }, 1440);
      await this.prisma.refreshToken.update({
        where: {
          id: refreshToken.id,
        },
        data: { revoked_at: false, token: refresh_token },
      });

      return { accsess_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const userRepository = new UserRepository(prisma);
