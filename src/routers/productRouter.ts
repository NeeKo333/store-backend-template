import { Router } from "express";
import { productController } from "../controllers/ProductController.js";
import { verfyJWT } from "../middlewares/verifyJwt.js";
import { verifyRoleAccess } from "../middlewares/verifyRoleAccess.js";

export const productRouter = Router();
productRouter.use(verfyJWT);

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProduct);
productRouter.post("/", verifyRoleAccess("ADMIN"), productController.createProduct);
productRouter.delete("/:id", verifyRoleAccess("ADMIN"), productController.deleteProduct);
productRouter.put("/:id", verifyRoleAccess("ADMIN"), productController.updateProduct);
