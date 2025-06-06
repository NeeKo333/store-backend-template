import { IAuthService, ILoginData, IRefreshData, IRefreshResponse, IRegistrationData } from "../types/auth.types.js";
import { IAuthRepository } from "../types/auth.types.js";
import { errorHandlerService } from "./ErrorHandlerService.js";
import { authRepository } from "../repositories/AuthRepository.js";
import { prisma } from "../repositories/index.js";
import { PrismaClient } from "@prisma/client";
import { hash } from "../utils/hash.js";
import { checkJwt, createJwt } from "../utils/jwt.js";

class AuthService implements IAuthService {
  private authRepository;
  private prisma;
  constructor(authRepository: IAuthRepository, prisma: PrismaClient) {
    this.authRepository = authRepository;
    this.prisma = prisma;

    this.registration = this.registration.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async registration(registrationData: IRegistrationData) {
    try {
      let { nickname, email, password, role } = registrationData;
      password = await hash(password);

      const result = await this.prisma.$transaction(async (tx) => {
        const user = await this.authRepository.createUser(tx, { nickname, email, password, role });
        const { token: access_token } = createJwt({ id: user.id, email: user.email, role: user.role }, 60);
        const refresh_token = createJwt({ id: user.id, email: user.email, role: user.role }, 1440);
        const token = await this.authRepository.createRefreshToken(tx, refresh_token, user.id);
        if (!user || !access_token || !token) throw new Error("No user or token");
        return { user, access_token, refresh_token: token };
      });

      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async login(loginData: ILoginData) {
    try {
      let { email, password } = loginData;
      const user = await this.authRepository.loginUser({ email, password });
      const userId = user.id;
      if (!userId) throw new Error("Fail to login");
      const { token: access_token } = createJwt({ id: userId, email, role: user.role }, 60);
      const refresh_token_object = createJwt({ id: userId, email, role: user.role }, 1440);

      const refresh_token = await this.authRepository.createRefreshToken(false, refresh_token_object, userId);
      return { user, access_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async logout(userId: number, refresh_token: string) {
    try {
      const user = await this.authRepository.logoutUser(userId, refresh_token);
      return user;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async refresh(refreshData: IRefreshData): Promise<IRefreshResponse> {
    try {
      if (!checkJwt(refreshData.refresh_token)) throw new Error("Refresh token is not valid");
      const { id: tokenId, user_id } = await this.authRepository.findRefreshToken(refreshData);
      if (!tokenId) throw new Error("Fail to get refresh token id");
      const user = await this.authRepository.findUser(user_id);
      const { token: access_token } = createJwt({ id: user.id, email: user.email, role: user.role }, 60);
      const { token: new_refresh_token } = createJwt({ id: user.id, email: user.email, role: user.role }, 1440);

      const updatedToken = await this.authRepository.updateRefreshToken(tokenId, new_refresh_token);

      return { access_token, refresh_token: updatedToken.token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const authService = new AuthService(authRepository, prisma);
