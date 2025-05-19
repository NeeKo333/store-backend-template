import { z, ZodType } from "zod";
import { IValidationInputDataService } from "../types/validation.types";
import { ILoginData, IRegistrationData } from "../types/auth.types";
import { errorHandlerService } from "./ErrorHandlerService.js";
import { IProductData } from "../types/product.types";

class ValidationInputDataService implements IValidationInputDataService {
  constructor() {}

  parse<T>(schema: ZodType<T>, payload: unknown): T {
    try {
      return schema.parse(payload);
    } catch (error) {
      errorHandlerService.checkError(error);
      throw error;
    }
  }

  registration(registrationData: IRegistrationData): IRegistrationData {
    const schema = z.object({
      nickname: z.string(),
      password: z.string(),
      email: z.string().email("Некорректный email"),
      role: z.enum(["USER", "ADMIN", "MODERATOR"]),
    });

    return this.parse(schema, registrationData);
  }

  login(loginData: ILoginData): ILoginData {
    const schema = z.object({
      email: z.string().email("Некорректный email"),
      password: z.string(),
    });

    return this.parse(schema, loginData);
  }

  logout(userId: number, refresh_token: string): { userId: number; refresh_token: string } {
    const schema = z.object({
      userId: z.number(),
      refresh_token: z.string(),
    });

    return this.parse(schema, { userId, refresh_token });
  }

  getAllProducts(offset: number, limit: number): { offset: number; limit: number } {
    const schema = z.object({
      offset: z.number(),
      limit: z.number(),
    });

    return this.parse(schema, { offset, limit });
  }

  getProduct(productId: number): number {
    const schema = z.number();

    return this.parse(schema, productId);
  }

  createProduct(productData: IProductData): IProductData {
    const schema = z.object({
      name: z.string(),
      type_id: z.number(),
      brand_id: z.number(),
      rating: z.number(),
    });

    return this.parse(schema, productData);
  }

  deleteProduct(productId: number): number {
    const schema = z.number();

    return this.parse(schema, productId);
  }

  updateProduct(productId: number, productData: IProductData): { productId: number; productData: IProductData } {
    const schema = z.object({
      productId: z.number(),
      productData: z.object({
        name: z.string(),
        type_id: z.number(),
        brand_id: z.number(),
        rating: z.number(),
      }),
    });

    return this.parse(schema, { productId, productData });
  }
}

export const validationInputDataService = new ValidationInputDataService();
