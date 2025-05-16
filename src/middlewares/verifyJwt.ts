import { Request, Response, NextFunction } from "express";
import { authService } from "../services/AuthService.js";
import { decodeJwt, checkJwt } from "../utils/jwt.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

export const verfyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const accsessTokenFromCookies = req.cookies.accsess_token;

  if (!accsessTokenFromCookies || !checkJwt(accsessTokenFromCookies)) {
    const refreshTokenFromCookies = req.cookies.refresh_token;

    if (!refreshTokenFromCookies) {
      res.status(401).json({ message: "No refresh token" });
      return;
    }

    try {
      const { id: user_id } = decodeJwt(refreshTokenFromCookies);
      const { accsess_token, refresh_token } = await authService.refresh({ user_id, refresh_token: refreshTokenFromCookies });
      if (!accsess_token || !refresh_token) throw new Error("Fail to refresh tokens");
      res.cookie("accsess_token", accsess_token, {
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
      next();
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(401).json(errorObj);
    }
  } else {
    next();
  }
};
