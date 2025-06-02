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
  updateCartProductQuantity(cartId: number, productId: number, quantity: number): Promise<ICartInfo>;
  cleanCart(cartId: number): Promise<ICartInfo>;
  lockCart(cartId: number): Promise<ICart>;
  unlockCart(cartId: number): Promise<ICart>;
}

export interface ICartRepository {
  createUserCart(userId: number): Promise<ICart>;
  findUserCart(userId: number): Promise<ICart>;
  getCartInfo(cartId: number): Promise<ICartInfo>;
  addProduct(cartId: number, productId: number): Promise<ICartProduct>;
  removeProduct(cartId: number, productId: number): Promise<ICartProduct>;
  updateCartProductQuantity(cartId: number, productId: number, quantity: number): Promise<ICartProduct>;
  cleanCart(cartId: number): Promise<ICartInfo>;
  lockCart(cartId: number): Promise<ICart>;
  unlockCart(cartId: number): Promise<ICart>;
}
