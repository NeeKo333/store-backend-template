import Stripe from "stripe";
import { IOrder } from "./order.types";
interface ILineItem {
  currency: string;
  unit_amount: number;
  product_data: {
    name: string;
  };
  quantity: number;
}

export interface IPaymentDTO {
  payment_method_types: ("card" | "klarna")[];
  mode: "payment" | "setup" | "subscription";
  line_items: Array<ILineItem>;
  metadata: {
    orderId: number;
    userId: number;
  };
  success_url: string;
  cancel_url: string;
}

export interface IPaymentService {
  createPaymentDTO(orderData: IOrder): Promise<IPaymentDTO>;
  startPayment(paymentDTO: IPaymentDTO): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
