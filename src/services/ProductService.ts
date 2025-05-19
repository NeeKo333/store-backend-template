import { IProductData, IProductService, IReturnedProductData, IProductRepository } from "../types/product.types";
import { productRepository } from "../repositories/ProductRepository.js";
import { errorHandlerService } from "./ErrorHandlerService.js";

class ProductService implements IProductService {
  private productRepository;
  private DEFAULT_OFFSET;
  private DEFAULT_LIMIT;
  private MAX_LIMIT;
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;

    this.DEFAULT_OFFSET = 0;
    this.DEFAULT_LIMIT = 10;
    this.MAX_LIMIT = 100;
  }

  async getAllProducts(offset: number = this.DEFAULT_OFFSET, limit: number = this.DEFAULT_LIMIT): Promise<IReturnedProductData[]> {
    try {
      const safeLimit = Math.min(limit, this.MAX_LIMIT);
      const result = await this.productRepository.getAllProducts(offset, safeLimit);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getProduct(productId: number): Promise<IReturnedProductData> {
    try {
      const result = await this.productRepository.getProduct(productId);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async createProduct(productData: IProductData): Promise<IReturnedProductData> {
    try {
      const result = await this.productRepository.createProduct(productData);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async deleteProduct(productId: number): Promise<IReturnedProductData> {
    try {
      const result = await this.productRepository.deleteProduct(productId);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData> {
    try {
      const result = await this.productRepository.updateProduct(productId, productData);
      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const productService = new ProductService(productRepository);
