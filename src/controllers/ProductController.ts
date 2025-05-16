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

    this.createProduct = this.createProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
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

  async deleteProduct(req: Request, res: Response) {}

  async updateProduct(req: Request, res: Response) {}
}

export const productController = new ProductController(productService, validationInputDataService);
