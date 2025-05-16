import jwt from "jsonwebtoken";
import { IToken } from "../types/auth.types";

export const createJwt = (payload: {}, expiresInMinutes: number = 60): IToken => {
  const secretKey = process.env.SECRET_KEY || "SECRET_KEY";
  const expiresInSeconds = expiresInMinutes * 60;

  const token = jwt.sign(payload, secretKey, { expiresIn: expiresInSeconds });
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return {
    token: token,
    expires_at: expiresAt,
    revoked_at: false,
  };
};

export const checkJwt = (token: string) => {
  try {
    const secretKey = process.env.SECRET_KEY || "SECRET_KEY";

    return jwt.verify(token, secretKey);
  } catch (error) {
    return false;
  }
};

export const decodeJwt = (token: string) => {
  const payload = jwt.decode(token);

  if (!payload || typeof payload !== "object") throw new Error("Refresh data not valid");
  return payload;
};
