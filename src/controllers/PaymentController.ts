import Stripe from "stripe";
import { stripe } from "../infrastructure/StripeClient.js";
import { Request, Response } from "express";

const endpointSecret: string = process.env.STRIPE_WEBHOOK || "";

class PaymentController {
  private endpointSecret: string;
  private stripe: Stripe;

  constructor(endpointSecret: string, stripe: Stripe) {
    this.endpointSecret = endpointSecret;
    this.stripe = stripe;

    this.handlePaymentResult = this.handlePaymentResult.bind(this);
  }

  handlePaymentResult(req: Request, res: Response) {
    const sig: string | string[] | undefined = req.headers["stripe-signature"];

    let event;

    try {
      if (sig) {
        event = this.stripe.webhooks.constructEvent(req.body, sig, this.endpointSecret);
      } else throw new Error("Webhook signature verification failed");
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(`Webhook Error: ${error.message}`);
      }
    }

    if (event) {
      console.log("Event type:", event.type);
    }

    res.json({ received: true });
  }
}

export const paymentController = new PaymentController(endpointSecret, stripe);
