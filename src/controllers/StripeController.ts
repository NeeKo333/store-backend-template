import Stripe from "stripe";
import { stripe } from "../infrastructure/StripeClient.js";
import { Request, Response } from "express";
import { IStripeService } from "../types/payment.types.js";
import { stripeService } from "../services/StripeService.js";
import { IOrderService } from "../types/order.types.js";
import { orderService } from "../services/OrderService.js";

const endpointSecret: string = process.env.STRIPE_WEBHOOK || "";

class StripeController {
  private endpointSecret: string;
  private stripe: Stripe;
  private stripeService: IStripeService;
  private orderSrvice: IOrderService;

  constructor(endpointSecret: string, stripe: Stripe, stripeService: IStripeService, orderSrvice: IOrderService) {
    this.endpointSecret = endpointSecret;
    this.stripe = stripe;
    this.stripeService = stripeService;
    this.orderSrvice = orderSrvice;

    this.handlePaymentResult = this.handlePaymentResult.bind(this);
  }

  async handlePaymentResult(req: Request, res: Response) {
    const sig: string | string[] | undefined = req.headers["stripe-signature"];

    let event;

    try {
      if (sig) {
        event = this.stripe.webhooks.constructEvent(req.body, sig, this.endpointSecret);
        const data = await this.stripeService.handlePaymentResult(event);
        if (!data) throw new Error("Webhook signature verification failed");
        const { orderId, userId } = data;
        const order = await this.orderSrvice.completeOrder(+orderId, +userId);
        res.json({ received: true });
        return;
      } else throw new Error("Webhook signature verification failed");
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
        return;
      }
    }
  }
}

export const stripeController = new StripeController(endpointSecret, stripe, stripeService, orderService);
