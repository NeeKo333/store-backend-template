import { Router } from "express";
import express from "express";
import { paymentController } from "../controllers/PaymentController.js";
export const paymentRouter = Router();

paymentRouter.get("/", (req, res) => {
  res.send("Hello World");
});

paymentRouter.post("/", express.raw({ type: "application/json" }), paymentController.handlePaymentResult);
