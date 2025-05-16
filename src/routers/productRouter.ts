import { Router } from "express";
import { productController } from "../controllers/ProductController.js";
import { verfyJWT } from "../middlewares/verifyJwt.js";

export const productRouter = Router();
productRouter.use(verfyJWT);

productRouter.post("/", productController.createProduct);
