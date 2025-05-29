import { Request, Response } from "express";
import { RequestWithTokens } from "../types/auth.types";
import { cartService } from "../services/CartService.js";
import { ICartService } from "../types/cart.types";
import { decodeJwt } from "../utils/jwt.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

class CartController {
  private cartService;

  constructor(cartService: ICartService) {
    this.cartService = cartService;

    this.getCartInfo = this.getCartInfo.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }

  async getCartInfo(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) {
        res.status(401).json({ message: "No auth tokens" });
        return;
      }

      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const cart = await this.cartService.findUserCart(jwtPayload.id);
      const result = await this.cartService.getCartInfo(cart.id);
      res.status(200).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async addProduct(req: RequestWithTokens, res: Response) {
    try {
      const tokens = req.tokens;
      if (!tokens) throw new Error("No tokens");
      const productId = +req.body.id;
      if (!productId) throw new Error("No product id");

      const { access_token, refresh_token } = tokens;
      const jwtPayload = decodeJwt(refresh_token);

      const cart = await this.cartService.findUserCart(jwtPayload.id);
      const result = await this.cartService.addProduct(cart.id, productId);
      res.status(200).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async removeProduct(req: RequestWithTokens, res: Response) {
    try {
      const tokens = req.tokens;
      if (!tokens) throw new Error("No tokens");
      const productId = +req.body.id;
      if (!productId) throw new Error("No product id");

      const { access_token, refresh_token } = tokens;
      const jwtPayload = decodeJwt(refresh_token);

      const cart = await this.cartService.findUserCart(jwtPayload.id);
      const result = await this.cartService.removeProduct(cart.id, productId);
      res.status(200).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }
  updateCartProductQuantity(cartId: number, productId: number, quantity: number) {}
  cleanCart(cartId: number) {}
  createOrder(cartId: number) {}
  lockCart(cartId: number) {}
  unlockCart(cartId: number) {}
}

export const cartController = new CartController(cartService);
