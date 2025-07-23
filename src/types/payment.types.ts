import Stripe from "stripe";
import { IOrder } from "./order.types";
export interface IPaymentDTO {
  payment_method_types: ("card" | "klarna")[];
  mode: "payment" | "setup" | "subscription";
  line_items: ILineItem[];
  metadata: {
    orderId: number;
    userId: number;
  };
  success_url: string;
  cancel_url: string;
}

export interface ILineItem {
  price_data: IPriceData;
  quantity: number;
}

export interface IPriceData {
  currency: string;
  unit_amount: number;
  product_data: {
    name: string;
  };
}

export interface IPaymentService {
  createPaymentDTO(orderData: IOrder): IPaymentDTO;
  startPayment(orderData: IOrder): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
