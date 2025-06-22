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
  price: number;
  stock: number;
}

export interface IProductService {
  getAllProducts(offset: number, limit: number): Promise<IReturnedProductData[]>;
  getProduct(productId: number): Promise<IReturnedProductData>;
  createProduct(productData: IProductData): Promise<IReturnedProductData>;
  deleteProduct(productId: number): Promise<IReturnedProductData>;
  updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData>;
}

export interface IProductRepository {
  getAllProducts(offset: number, limit: number): Promise<IReturnedProductData[]>;
  getProduct(productId: number): Promise<IReturnedProductData>;
  createProduct(productData: IProductData): Promise<IReturnedProductData>;
  deleteProduct(productId: number): Promise<IReturnedProductData>;
  updateProduct(productId: number, productData: IProductData): Promise<IReturnedProductData>;
}
