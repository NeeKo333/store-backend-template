import { RequestWithTokens } from "../../types/auth.types.js";
import { Response, NextFunction } from "express";
import { z } from "zod";
import { decodeJwt } from "../../utils/jwt.js";

export const refreshTokenGuard = (req: RequestWithTokens, res: Response, next: NextFunction) => {
  try {
    if (!req.tokens) throw new Error("No tokens");

    const schemaToken = z.string();
    const schemaId = z.preprocess((value) => (value !== undefined ? Number(value) : undefined), z.number());

    const { refresh_token } = req.tokens;
    schemaToken.parse(refresh_token);
    const jwtPayload = decodeJwt(refresh_token);
    if (typeof jwtPayload.id === "undefined") throw new Error("Token not contains user id");

    schemaId.parse(jwtPayload.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token or token data is not valid" });
  }
};
