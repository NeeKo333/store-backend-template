import { IRegistrationData, ILoginData } from "./auth.types";
import { IProductData } from "./product.types";

export interface IValidationInputDataService {
  registration(registrationData: IRegistrationData): IRegistrationData;
  login(loginData: ILoginData): ILoginData;
  logout(userId: number, refresh_token: string): { userId: number; refresh_token: string };
  getAllProducts(offset: number, limit: number): { offset: number; limit: number };
  getProduct(productId: number): number;
  createProduct(productData: IProductData): IProductData;
  deleteProduct(productId: number): number;
  updateProduct(productId: number, productData: IProductData): { productId: number; productData: IProductData };
}
