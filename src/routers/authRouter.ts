import { Router } from "express";
import { authController } from "../controllers/AuthController.js";
import { verfyJWT } from "../middlewares/verifyJwt.js";

export const authRouter = Router();

authRouter.post("/registration", authController.registeration);
authRouter.post("/login", authController.login);
authRouter.post("/logout", verfyJWT, authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/testJwt", verfyJWT, authController.testJwt);
