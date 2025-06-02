import { ICartService } from "../types/cart.types";
import { cartRepository } from "../repositories/CartRepository.js";
import { ICartRepository } from "../types/cart.types";
import { errorHandlerService } from "./ErrorHandlerService.js";

class CartService implements ICartService {
  private cartRepository;
  constructor(cartRepository: ICartRepository) {
    this.cartRepository = cartRepository;

    this.findUserCart = this.findUserCart.bind(this);
  }

  async getCartInfo(cartId: number) {
    try {
      const cartInfo = await this.cartRepository.getCartInfo(cartId);
      return cartInfo;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async findUserCart(userId: number) {
    try {
      const cart = await this.cartRepository.findUserCart(userId);
      return cart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async addProduct(cartId: number, productId: number) {
    try {
      const addedProduct = await this.cartRepository.addProduct(cartId, productId);
      return addedProduct;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async removeProduct(cartId: number, productId: number) {
    try {
      const deletedProduct = await this.cartRepository.removeProduct(cartId, productId);
      return deletedProduct;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async updateCartProductQuantity(cartId: number, productId: number, quantity: number) {
    try {
      await this.cartRepository.updateCartProductQuantity(cartId, productId, quantity);
      const cart = await this.cartRepository.getCartInfo(cartId);
      return cart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async cleanCart(cartId: number) {
    try {
      const cartInfo = await this.cartRepository.cleanCart(cartId);
      return cartInfo;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async lockCart(cartId: number) {
    try {
      const lockedCart = await this.cartRepository.lockCart(cartId);
      return lockedCart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async unlockCart(cartId: number) {
    try {
      const unlockedCart = await this.cartRepository.unlockCart(cartId);
      return unlockedCart;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}
export const cartService = new CartService(cartRepository);
