import { Router } from "express";
import { authController } from "../controllers/AuthController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { validationMiddleware } from "../middlewares/validation/validationMiddleware.js";
import { refreshTokenGuard } from "../middlewares/validation/refreshTokenGuard.js";
import { loginSchema } from "../middlewares/validation/schemas/index.js";
import { registrationSchema } from "../middlewares/validation/schemas/index.js";

export const authRouter = Router();

authRouter.post("/registration", validationMiddleware({ body: registrationSchema }), authController.registeration);
authRouter.post("/login", validationMiddleware({ body: loginSchema }), authController.login);
authRouter.post("/logout", authGuard, refreshTokenGuard, authController.logout);
authRouter.post("/refresh", authController.refresh);
authRouter.get("/testJwt", authGuard, authController.testJwt);
