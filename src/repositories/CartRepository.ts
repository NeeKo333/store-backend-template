import { ICart, ICartInfo, ICartProduct, ICartRepository } from "../types/cart.types";
import { prisma } from "./index.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

class CartRepository implements ICartRepository {
  private prisma;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    this.findUserCart = this.findUserCart.bind(this);
  }

  async getCartInfo(cartId: number) {
    try {
      const cartInfo = await this.prisma.cart.findUnique({
        where: {
          id: cartId,
        },
        include: {
          cartProduct: {
            select: {
              product_id: true,
              qty: true,
            },
          },
        },
      });
      if (!cartInfo) throw new Error("Fail to get cart info");
      return cartInfo;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async findUserCart(userId: number) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: {
          user_id: userId,
        },
      });

      if (!cart) throw new Error("Cart not found");
      return cart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async addProduct(cartId: number, productId: number) {
    try {
      let result = null;
      const selectedProductInCart = await this.prisma.cartProduct.findUnique({
        where: {
          cart_id_product_id: {
            cart_id: cartId,
            product_id: productId,
          },
        },
      });

      if (!selectedProductInCart) {
        result = await this.prisma.cartProduct.create({
          data: {
            cart_id: cartId,
            product_id: productId,
            qty: 1,
          },
        });
      } else {
        result = await this.prisma.cartProduct.update({
          where: {
            id: selectedProductInCart.id,
          },

          data: {
            qty: selectedProductInCart.qty + 1,
          },
        });
      }

      if (!result) throw new Error("Fail to add product in cart");
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async removeProduct(cartId: number, productId: number) {
    try {
      const deletedProductInCart = await this.prisma.cartProduct.findUnique({
        where: {
          cart_id_product_id: {
            cart_id: cartId,
            product_id: productId,
          },
        },
      });
      if (!deletedProductInCart) throw new Error("Product not found");
      const result = await this.prisma.cartProduct.delete({
        where: {
          id: deletedProductInCart.id,
        },
      });
      if (!result) throw new Error("Fail to delete product");
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const cartRepository = new CartRepository(prisma);
