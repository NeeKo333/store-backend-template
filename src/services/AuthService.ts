import { errorHandlerService } from "./ErrorHandlerService.js";
import { userRepository } from "../repositories/UserRepository.js";
import { hash } from "../utils/hash.js";
import { IAuthService, ILoginData, IRefreshData, IRefreshResponse, IRegistrationData } from "../types/auth.types.js";
import { IUserRepository } from "../types/auth.types.js";

class AuthService implements IAuthService {
  private userRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;

    this.registration = this.registration.bind(this);
  }

  async registration(registrationData: IRegistrationData) {
    try {
      let { nickname, email, password } = registrationData;
      password = await hash(password);
      const { user, accsess_token, refresh_token } = await this.userRepository.registrationUser({ nickname, email, password });
      if (!user || !accsess_token || !refresh_token) throw new Error("No user or token");
      return { user, accsess_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async login(loginData: ILoginData) {
    try {
      let { email, password } = loginData;
      password = await hash(password);
      const { user, accsess_token, refresh_token } = await userRepository.loginUser({ email, password });
      const userId = user.id;
      if (!userId) throw new Error("Fail to login");
      return { user, accsess_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async refresh(refreshData: IRefreshData): Promise<IRefreshResponse> {
    try {
      const { accsess_token, refresh_token } = await userRepository.refreshTokens(refreshData);
      return { accsess_token, refresh_token };
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const authService = new AuthService(userRepository);
