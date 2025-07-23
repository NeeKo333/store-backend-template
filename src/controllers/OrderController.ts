import { RequestWithTokens } from "../types/auth.types.js";
import { Response } from "express";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { decodeJwt } from "../utils/jwt.js";
import { HTTP_STATUSES } from "../constants/HTTP_STATUSES.js";
import { IOrderService } from "../types/order.types.js";
import { orderService } from "../services/OrderService.js";

class OrderController {
  private orderService;
  constructor(orderService: IOrderService) {
    this.orderService = orderService;

    this.createOrder = this.createOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.completeOrder = this.completeOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.getUserOrders = this.getUserOrders.bind(this);
    this.startOrderPayment = this.startOrderPayment.bind(this);
  }

  async createOrder(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const result = await this.orderService.createOrder(+jwtPayload.id);
      res.status(HTTP_STATUSES.OK).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async cancelOrder(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const orderId = req.body.id;
      const userId = +jwtPayload.id;
      const canceledOrder = await this.orderService.cancelOrder(orderId, userId);
      res.status(HTTP_STATUSES.OK).json(canceledOrder);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async completeOrder(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const orderId = req.body.id;
      const userId = +jwtPayload.id;
      const completedOrder = await this.orderService.completeOrder(orderId, userId);
      res.status(HTTP_STATUSES.OK).json(completedOrder);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async deleteOrder(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");
      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const orderId = req.body.id;
      const userId = +jwtPayload.id;
      const deletedOrder = await this.orderService.deleteOrder(orderId, userId);
      res.status(HTTP_STATUSES.OK).json(deletedOrder);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async getUserOrders(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw Error("No tokens");
      const { access_token, refresh_token } = req.tokens;
      const jwtPayload = decodeJwt(refresh_token);
      const userOrders = await this.orderService.getUserOrders(+jwtPayload.id);
      res.status(HTTP_STATUSES.OK).json(userOrders);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async startOrderPayment(req: RequestWithTokens, res: Response) {
    try {
      if (!req.tokens) throw new Error("No tokens");

      const { access_token, refresh_token } = req.tokens;
      const orderId = req.body.id;
      const jwtPayload = decodeJwt(refresh_token);
      const paymentSession = await this.orderService.startOrderPayment(jwtPayload.id, orderId);
      res.status(HTTP_STATUSES.OK).json(paymentSession);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }
}

export const orderController = new OrderController(orderService);
