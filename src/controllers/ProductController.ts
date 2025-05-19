import { Request, Response } from "express";
import { validationInputDataService } from "../services/ValidationInputDataService.js";
import { productService } from "../services/ProductService.js";
import { IProductService } from "../types/product.types";
import { IValidationInputDataService } from "../types/validation.types.js";
import { errorHandlerService } from "../services/ErrorHandlerService.js";

class ProductController {
  private productService;
  private validationInputDataService;

  constructor(productService: IProductService, validationInputDataService: IValidationInputDataService) {
    this.validationInputDataService = validationInputDataService;
    this.productService = productService;

    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const rowOffset = req.query.offset ? +req.query.offset : 0;
      const rowLimit = req.query.limit ? +req.query.limit : 10;
      const { offset, limit } = this.validationInputDataService.getAllProducts(rowOffset, rowLimit);
      const result = await this.productService.getAllProducts(offset, limit);

      res.status(200).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const productId = this.validationInputDataService.getProduct(+req.params.id);
      const result = await this.productService.getProduct(productId);

      res.status(200).json(result);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const productData = this.validationInputDataService.createProduct({ name: req.body.name, type_id: req.body.type_id, brand_id: req.body.brand_id, rating: req.body.rating });
      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = this.validationInputDataService.deleteProduct(+req.params.id);
      const deletedProduct = await this.productService.deleteProduct(productId);
      res.status(200).json(deletedProduct);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const { productId, productData } = this.validationInputDataService.updateProduct(+req.params.id, req.body);
      if (!productId) throw new Error("No product id");
      const updatedProduct = await this.productService.updateProduct(productId, productData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      const errorObj = errorHandlerService.handleError(error);
      res.status(500).json(errorObj);
    }
  }
}

export const productController = new ProductController(productService, validationInputDataService);
