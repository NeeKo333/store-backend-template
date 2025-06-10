import { Request, Response } from "express";
import { productService } from "../services/ProductService.js";
import { IProductService } from "../types/product.types";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { HTTP_STATUSES } from "../constants/HTTP_STATUSES.js";

class ProductController {
  private productService;

  constructor(productService: IProductService) {
    this.productService = productService;

    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const offset = req.query.offset ? +req.query.offset : 0;
      const limit = req.query.limit ? +req.query.limit : 10;
      const result = await this.productService.getAllProducts(offset, limit);

      res.status(HTTP_STATUSES.OK).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const result = await this.productService.getProduct(+req.params.id);
      res.status(HTTP_STATUSES.OK).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const product = await this.productService.createProduct({ name: req.body.name, type_id: req.body.type_id, brand_id: req.body.brand_id, rating: req.body.rating });
      res.status(HTTP_STATUSES.CREATED).json(product);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const deletedProduct = await this.productService.deleteProduct(+req.params.id);
      res.status(HTTP_STATUSES.OK).json(deletedProduct);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await this.productService.updateProduct(+req.params.id, req.body);
      res.status(HTTP_STATUSES.OK).json(updatedProduct);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(errorObj.status).json(errorObj);
    }
  }
}

export const productController = new ProductController(productService);
