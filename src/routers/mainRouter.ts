import { Router } from "express";
import { authRouter } from "./authRouter.js";
import { productRouter } from "./productRouter.js";
import { cartRouter } from "./cartRouter.js";
import { orderRouter } from "./orderRouter.js";

export const router = Router();

router.get("/", (res, req) => {
  req.status(200).send("Hello world");
});

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/order", orderRouter);
