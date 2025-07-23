import { IOrder } from "../types/order.types.js";
import { IPaymentService, IPaymentDTO } from "../types/payment.types.js";
import { stripe } from "../infrastructure/StripeClient.js";
import Stripe from "stripe";

class PaymentService implements IPaymentService {
  private stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  createPaymentDTO(orderData: IOrder) {
    const paymentDTO: IPaymentDTO = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: orderData.total_price * 100,
            product_data: {
              name: `Order ${orderData.id}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: "https://www.youtube.com",
      cancel_url: "https://www.youtube.com",
      metadata: {
        orderId: orderData.id,
        userId: orderData.user_id,
      },
    };

    return paymentDTO;
  }

  async startPayment(orderData: IOrder) {
    try {
      const paymentDTO = this.createPaymentDTO(orderData);
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
}

export const paymentService = new PaymentService(stripe);
