import { IOrder } from "../types/order.types.js";
import { IPaymentService, IPaymentDTO } from "../types/payment.types.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_KEY || "");

class PaymentService implements IPaymentService {
  private stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createPaymentDTO(orderData: IOrder) {
    const paymentDTO: IPaymentDTO = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{ currency: "usd", unit_amount: orderData.total_price, product_data: { name: `Order ${orderData.id}` }, quantity: 1 }],
      success_url: "https://www.youtube.com",
      cancel_url: "https://www.youtube.com",
      metadata: {
        orderId: orderData.id,
        userId: orderData.user_id,
      },
    };

    return paymentDTO;
  }

  async startPayment(paymentDTO: IPaymentDTO) {
    try {
      const session = await this.stripe.checkout.sessions.create(paymentDTO);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Ошибка при создании сессии:", error.message);
      }
    }
  }
}
