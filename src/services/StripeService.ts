import Stripe from "stripe";
import { IPaymentDTO } from "../types/payment.types";
import { stripe } from "../infrastructure/StripeClient.js";
import { IStripeService } from "../types/payment.types";

class StripeService implements IStripeService {
  private stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createPaymentSession(paymentDTO: IPaymentDTO) {
    try {
      const session = await this.stripe.checkout.sessions.create(paymentDTO);
      if (!session) throw new Error("Fail to create payment checkout");
      return session;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Ошибка при создании сессии:", error.message);
      }
      throw error;
    }
  }

  async handlePaymentResult(event: Stripe.Event) {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;
      const { orderId, userId } = metadata;
      if (orderId && userId) {
        return { orderId, userId };
      }
    }

    return null;
  }
}

export const stripeService = new StripeService(stripe);
