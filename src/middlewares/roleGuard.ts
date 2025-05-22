import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { decodeJwt } from "../utils/jwt.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { RequestWithTokens } from "../types/auth.types.js";

export const roleGuard = (role: Role) => {
  return (req: RequestWithTokens, res: Response, next: NextFunction) => {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { access_token } = req.tokens;
      const data = decodeJwt(access_token);
      if (!data.role || data.role !== role) {
        throw new Error("Not valid role");
      }

      next();
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(401).json(errorObj);
    }
  };
};
