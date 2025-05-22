import { Router } from "express";
import { productController } from "../controllers/ProductController.js";
import { authGuard } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { validationMiddleware } from "../middlewares/validation/validationMiddleware.js";
import { offsetLimitSchema } from "../middlewares/validation/schemas/index.js";
import { idSchema } from "../middlewares/validation/schemas/index.js";
import { productSchema } from "../middlewares/validation/schemas/index.js";

export const productRouter = Router();

productRouter.get("/", validationMiddleware({ query: offsetLimitSchema }), productController.getAllProducts);
productRouter.get("/:id", validationMiddleware({ params: idSchema }), productController.getProduct);
productRouter.post("/", authGuard, roleGuard("ADMIN"), validationMiddleware({ body: productSchema }), productController.createProduct);
productRouter.delete("/:id", authGuard, roleGuard("ADMIN"), validationMiddleware({ params: idSchema }), productController.deleteProduct);
productRouter.put("/:id", authGuard, roleGuard("ADMIN"), validationMiddleware({ params: idSchema, body: productSchema }), productController.updateProduct);
