import { ICartProductShort } from "./cart.types.js";
import { OrderStatus } from "@prisma/client";

export interface IOrder {
  id: number;
  user_id: number;
  cart_id: number;
  orderProduct: Array<ICartProductShort>;
  createdAt: Date;
  total_price: number;
  status: OrderStatus;
}

export interface IOrderService {
  createOrder(userId: number): Promise<IOrder>;
  getOrder(orderId: number): Promise<IOrder>;
  cancelOrder(orderId: number, userId: number): Promise<IOrder>;
  completeOrder(orderId: number, userId: number): Promise<IOrder>;
  deleteOrder(orderId: number, userId: number): Promise<IOrder>;
  getUserOrders(userId: number): Promise<Array<IOrder>>;
}

export interface IOrderRepository {
  createOrder(userId: number, cartId: number, products: Array<ICartProductShort>): Promise<IOrder>;
  getOrder(orderId: number): Promise<IOrder>;
  cancelOrder(orderId: number): Promise<IOrder>;
  completeOrder(orderId: number): Promise<IOrder>;
  deleteOrder(orderId: number): Promise<IOrder>;
  getUserOrders(userId: number): Promise<Array<IOrder>>;
}
