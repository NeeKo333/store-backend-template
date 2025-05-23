import { Response, Request } from "express";
import { authService } from "../services/AuthService.js";
import { validationInputDataService } from "../services/ValidationInputDataService.js";
import { IAuthService } from "../types/auth.types.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { decodeJwt } from "../utils/jwt.js";
import { RequestWithTokens } from "../types/auth.types.js";

class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
    this.registeration = this.registeration.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.testJwt = this.testJwt.bind(this);
  }

  async registeration(req: Request, res: Response) {
    try {
      const { user, access_token, refresh_token } = await this.authService.registration({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });
      if (!user || !user.id || !access_token || !refresh_token) {
        res.status(500).json({ error: "Fail to register" });
        return;
      }
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json({ user });
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { user, access_token, refresh_token } = await authService.login({ email: req.body.email, password: req.body.password });
      if (!user.id || !access_token) throw new Error("Login controller error!");
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.status(200).json({ user });
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async logout(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);

      const user = await authService.logout(jwtPayload.id, refresh_token);
      res.status(200).json(user);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const current_refresh_token: string = req.cookies.refresh_token;
      if (!current_refresh_token) throw new Error("No refresh token");

      const { id: user_id } = decodeJwt(current_refresh_token);
      const { access_token, refresh_token } = await authService.refresh({ user_id, refresh_token: current_refresh_token });
      res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      res.status(200).json({ message: "Tokens was refresh" });
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async testJwt(req: Request, res: Response) {
    res.status(200).json("Zaebis");
  }
}

export const authController = new AuthController(authService);
