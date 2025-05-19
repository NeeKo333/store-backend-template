import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { decodeJwt } from "../utils/jwt.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

export const verifyRoleAccess = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenFromCookies = req.cookies.access_token;
      const data = decodeJwt(tokenFromCookies);
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
