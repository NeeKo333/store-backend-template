import { IProductData, IProductService, IReturnedProductData, IProductRepository } from "../types/product.types";
import { productRepository } from "../repositories/ProductRepository.js";
import { errorHandlerService } from "./ErrorHandlerService.js";

class ProductService implements IProductService {
  private productRepository;
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
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
