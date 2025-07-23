import { IOrder, IOrderService } from "../types/order.types.js";
import { IOrderRepository } from "../types/order.types.js";
import { IProductRepository } from "../types/product.types.js";
import { ICartRepository } from "../types/cart.types.js";
import { IPaymentService } from "../types/payment.types.js";
import { orderRepository } from "../repositories/OrderRepository.js";
import { productRepository } from "../repositories/ProductRepository.js";
import { cartRepository } from "../repositories/CartRepository.js";
import { paymentService } from "./PaymentService.js";
import { errorHandlerService } from "./ErrorHandlerService.js";

class OrderService implements IOrderService {
  private orderRepository;
  private productRepository;
  private cartRepository;
  private paymentService;
  constructor(orderRepository: IOrderRepository, productRepository: IProductRepository, cartRepository: ICartRepository, paymentService: IPaymentService) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.cartRepository = cartRepository;
    this.paymentService = paymentService;
  }

  async createOrder(userId: number) {
    try {
      const cart = await this.cartRepository.findUserCart(userId);
      const cartInfo = await this.cartRepository.getCartInfo(cart.id);
      const order = await this.orderRepository.createOrder(userId, cart.id, cartInfo.cartProduct);
      if (order.id) {
        await this.cartRepository.cleanCart(order.cart_id);
      }
      return order;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getOrder(orderId: number) {
    try {
      const order = await this.orderRepository.getOrder(orderId);
      return order;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async cancelOrder(orderId: number, userId: number) {
    try {
      const order = await this.getOrder(orderId);
      if (order.user_id !== userId) throw new Error("This order does not belong to the current user");
      const canceledOrder = await this.orderRepository.cancelOrder(orderId);
      return canceledOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async completeOrder(orderId: number, userId: number) {
    try {
      const order = await this.getOrder(orderId);
      if (order.user_id !== userId) throw new Error("This order does not belong to the current user");
      const completedOrder = await this.orderRepository.completeOrder(orderId);
      return completedOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async deleteOrder(orderId: number, userId: number) {
    try {
      const order = await this.getOrder(orderId);
      if (order.user_id !== userId) throw new Error("This order does not belong to the current user");
      const deletedOrder = await this.orderRepository.deleteOrder(orderId);
      return deletedOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getUserOrders(userId: number) {
    try {
      const userOrders = await this.orderRepository.getUserOrders(userId);
      return userOrders;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async startOrderPayment(userId: number, orderId: number) {
    try {
      const userOrders = await this.getUserOrders(userId);
      const currentOrder = userOrders.find((order) => order.id === orderId);
      if (!currentOrder) throw new Error("Order not found");
      const result = await this.paymentService.startPayment(currentOrder);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const orderService = new OrderService(orderRepository, productRepository, cartRepository, paymentService);
