export interface ICart {
  id: number;
  user_id: number;
  isLocked: boolean;
}

export interface ICartProduct {
  id: number;
  cart_id: number;
  product_id: number;
  qty: number;
}

export type ICartProductShort = Pick<ICartProduct, "product_id" | "qty">;

export interface ICartInfo extends ICart {
  cartProduct: Array<ICartProductShort>;
}

export interface ICartService {
  findUserCart(userId: number): Promise<ICart>;
  getCartInfo(cartId: number): Promise<ICartInfo>;
  addProduct(cartId: number, productId: number): Promise<ICartProduct>;
  removeProduct(cartId: number, productId: number): Promise<ICartProduct>;
  updateCartProductQuantity(cartId: number, productId: number, quantity: number): ICartInfo;
  cleanCart?(cartId: number): ICartInfo;
  createOrder?(cartId: number): void;
  lockCart?(cartId: number): void;
  unlockCart?(cartId: number): void;
}

export interface ICartRepository {
  findUserCart(userId: number): Promise<ICart>;
  getCartInfo(cartId: number): Promise<ICartInfo>;
  addProduct(cartId: number, productId: number): Promise<ICartProduct>;
  removeProduct(cartId: number, productId: number): Promise<ICartProduct>;
  updateCartProductQuantity(cartId: number, productId: number, quantity: number): ICartInfo;
  cleanCart?(cartId: number): ICartInfo;
  createOrder?(cartId: number): void;
  lockCart?(cartId: number): void;
  unlockCart?(cartId: number): void;
}
