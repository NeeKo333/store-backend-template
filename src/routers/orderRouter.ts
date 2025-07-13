import { Router } from "express";
import { orderController } from "../controllers/OrderController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { refreshTokenGuard } from "../middlewares/validation/refreshTokenGuard.js";
import { validationMiddleware } from "../middlewares/validation/validationMiddleware.js";
import { idSchema, qtySchema } from "../middlewares/validation/schemas/index.js";

export const orderRouter = Router();

orderRouter.post("/create", authGuard, refreshTokenGuard, orderController.createOrder);
orderRouter.patch("/cancel", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, orderController.cancelOrder);
//orderRouter.patch("/complete", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, orderController.completeOrder);
orderRouter.delete("/delete", authGuard, validationMiddleware({ body: idSchema }), refreshTokenGuard, orderController.deleteOrder);
orderRouter.get("/list", authGuard, refreshTokenGuard, orderController.getUserOrders);
