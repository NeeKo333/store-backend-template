import { Router } from "express";
import { cartController } from "../controllers/CartController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { refreshTokenGuard } from "../middlewares/validation/refreshTokenGuard.js";
import { validationMiddleware } from "../middlewares/validation/validationMiddleware.js";
import { idSchema } from "../middlewares/validation/schemas/index.js";

export const cartRouter = Router();

cartRouter.get("/info", authGuard, refreshTokenGuard, cartController.getCartInfo);
cartRouter.post("/product", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, cartController.addProduct);
cartRouter.delete("/product", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, cartController.removeProduct);
