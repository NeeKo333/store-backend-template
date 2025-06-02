import { ICartRepository } from "../types/cart.types";
import { prisma } from "./index.js";
import { PrismaClient } from "@prisma/client";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

class CartRepository implements ICartRepository {
  private prisma;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    this.findUserCart = this.findUserCart.bind(this);
  }

  async getCart(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!cart) throw new Error("Cart not found");

    return cart;
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

  async checkCartIsLocked(cartId: number) {
    const cart = await this.getCart(cartId);
    return cart.isLocked;
  }

  async createUserCart(user_id: number) {
    try {
      const cart = await this.prisma.cart.create({
        data: {
          user_id: user_id,
          isLocked: false,
        },
      });

      if (!cart) throw new Error("Fail to create cart");
      return cart;
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

      if (!cart) {
        const createdCart = await this.createUserCart(userId);
        return createdCart;
      }
      return cart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async addProduct(cartId: number, productId: number) {
    try {
      if (await this.checkCartIsLocked(cartId)) throw new Error("Cart is locked");

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
      if (await this.checkCartIsLocked(cartId)) throw new Error("Cart is locked");

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

  async updateCartProductQuantity(cartId: number, productId: number, quantity: number) {
    try {
      if (await this.checkCartIsLocked(cartId)) throw new Error("Cart is locked");

      const qty = quantity > 0 ? quantity : 0;

      const updatedProduct = await this.prisma.cartProduct.update({
        where: {
          cart_id_product_id: {
            cart_id: cartId,
            product_id: productId,
          },
        },
        data: {
          qty: qty,
        },
      });

      return updatedProduct;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async cleanCart(cartId: number) {
    try {
      if (await this.checkCartIsLocked(cartId)) throw new Error("Cart is locked");
      await this.prisma.cartProduct.deleteMany({
        where: {
          cart_id: cartId,
        },
      });
      const cartInfo = await this.getCartInfo(cartId);
      return cartInfo;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async lockCart(cartId: number) {
    try {
      const lockedCart = await this.prisma.cart.update({
        where: {
          id: cartId,
        },
        data: {
          isLocked: true,
        },
      });
      return lockedCart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async unlockCart(cartId: number) {
    try {
      const unlockedCart = await this.prisma.cart.update({
        where: {
          id: cartId,
        },
        data: {
          isLocked: false,
        },
      });
      return unlockedCart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const cartRepository = new CartRepository(prisma);
