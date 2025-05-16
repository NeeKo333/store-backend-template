export interface IProductData {
  name: string;
  type_id: number;
  brand_id: number;
  rating: number;
}

export interface IReturnedProductData {
  id: number;
  name: string;
  type_id: number;
  brand_id: number;
  rating: number;
}

export interface IProductService {
  createProduct(productData: IProductData): Promise<IReturnedProductData>;
  deleteProduct(productId: number): Promise<IReturnedProductData>;
  updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData>;
}

export interface IProductRepository {
  createProduct(productData: IProductData): Promise<IReturnedProductData>;
  deleteProduct(productId: number): Promise<IReturnedProductData>;
  updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData>;
}
