import { Router } from "express";
import express from "express";
import { stripeController } from "../controllers/StripeController.js";
export const webhookRouter = Router();

webhookRouter.post("/stripe", express.raw({ type: "application/json" }), stripeController.handlePaymentResult);
