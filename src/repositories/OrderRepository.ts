import { PrismaClient } from "@prisma/client";
import { IOrder, IOrderRepository } from "../types/order.types.js";
import { prisma } from "./index.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { ICartProductShort } from "../types/cart.types.js";

class OrderRepository implements IOrderRepository {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createOrder(userId: number, cartId: number, products: Array<ICartProductShort>) {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        for (const product of products) {
          const updateProductInStock = await tx.$executeRaw`
            UPDATE "Product"
            SET "stock" = "stock" - ${product.qty}
            WHERE "id" = ${product.product_id} AND "stock" >= ${product.qty}`;

          if (updateProductInStock === 0) throw new Error("Product not found or not enough stock for product");
        }

        const order = await tx.order.create({
          data: {
            user_id: userId,
            cart_id: cartId,
            total_price: 0,
          },
        });

        for (const product of products) {
          await tx.orderProduct.create({
            data: {
              order_id: order.id,
              product_id: product.product_id,
              qty: product.qty,
            },
          });
        }

        const fullOrder = await tx.order.findUnique({
          where: {
            id: order.id,
          },
          include: {
            orderProduct: {
              select: {
                product_id: true,
                qty: true,
              },
            },
          },
        });

        if (!fullOrder) throw new Error("Fail to create order");

        return fullOrder;
      });

      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getOrder(orderId: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          orderProduct: true,
        },
      });

      if (!order) throw new Error("Order not found");
      return order;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async cancelOrder(orderId: number) {
    try {
      const canceledOrder = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "canceled",
        },
        include: {
          orderProduct: true,
        },
      });
      if (!canceledOrder) throw new Error("Order not found");
      return canceledOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async completeOrder(orderId: number) {
    try {
      const completeOrder = await this.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "access",
        },
        include: {
          orderProduct: true,
        },
      });
      if (!completeOrder) throw new Error("Order not found");
      return completeOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async deleteOrder(orderId: number) {
    try {
      const deletedOrder = await this.prisma.$transaction(async (tx) => {
        const orderProducts = await tx.orderProduct.findMany({
          where: {
            order_id: orderId,
          },
        });

        await tx.orderProduct.deleteMany({
          where: {
            order_id: orderId,
          },
        });

        const order = await tx.order.delete({
          where: {
            id: orderId,
          },
        });

        const result = { ...order, orderProduct: orderProducts };
        return result;
      });

      return deletedOrder;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getUserOrders(userId: number) {
    try {
      const userOrders = await this.prisma.order.findMany({
        where: {
          user_id: userId,
        },
        include: {
          orderProduct: true,
        },
      });
      return userOrders;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const orderRepository = new OrderRepository(prisma);
