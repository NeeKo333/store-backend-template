import { Router } from "express";
import { cartController } from "../controllers/CartController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { refreshTokenGuard } from "../middlewares/validation/refreshTokenGuard.js";
import { validationMiddleware } from "../middlewares/validation/validationMiddleware.js";
import { idSchema, qtySchema } from "../middlewares/validation/schemas/index.js";

export const cartRouter = Router();

cartRouter.get("/info", authGuard, refreshTokenGuard, cartController.getCartInfo);
cartRouter.post("/product", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, cartController.addProduct);
cartRouter.delete("/product", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, cartController.removeProduct);
cartRouter.patch("/product-quantity", authGuard, validationMiddleware({ body: qtySchema }), refreshTokenGuard, cartController.updateCartProductQuantity);
cartRouter.delete("/clean", authGuard, refreshTokenGuard, cartController.cleanCart);
