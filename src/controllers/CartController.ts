class CartController {
  constructor() {}

  getCart(cartId: number) {}
  addProduct(cartId: number, productId: number) {}
  removeProduct(cartId: number, productId: number) {}
  updateCartProductQuantity(cartId: number, productId: number, quantity: number) {}
  cleanCart(cartId: number) {}
  createOrder(cartId: number) {}
  lockCart(cartId: number) {}
  unlockCart(cartId: number) {}
}
