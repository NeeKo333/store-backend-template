import { PrismaClient } from "@prisma/client";
import { errorHandlerService } from "../services/ErrorHandlerService.js";
import { prisma } from "./index.js";
import { IProductData, IProductRepository, IReturnedProductData } from "../types/product.types.js";

class ProductRepository implements IProductRepository {
  private prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllProducts(offset: number, limit: number): Promise<IReturnedProductData[]> {
    try {
      const data = await this.prisma.product.findMany({
        skip: offset,
        take: limit,
      });

      if (!data.length) throw new Error("Products not found");

      return data;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async getProduct(productId: number): Promise<IReturnedProductData> {
    try {
      const data = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

      if (!data) throw new Error("!Product not found");

      return data;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
  async createProduct(productData: IProductData): Promise<IReturnedProductData> {
    try {
      const result = await this.prisma.product.create({
        data: {
          name: productData.name,
          type_id: productData.type_id,
          brand_id: productData.brand_id,
          rating: productData.rating,
        },
      });

      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async deleteProduct(productId: number): Promise<IReturnedProductData> {
    try {
      const result = await this.prisma.product.delete({
        where: {
          id: productId,
        },
      });
      if (!result) throw new Error("Product not found");

      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  async updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData> {
    try {
      const result = await this.prisma.product.update({
        where: {
          id: productId,
        },

        data: { ...productData },
      });

      return result;
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }
}

export const productRepository = new ProductRepository(prisma);
