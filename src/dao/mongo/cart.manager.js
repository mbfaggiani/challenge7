import { CM_MONGO, PM_MONGO } from './database.manager.js'

export class CartProduct {
  constructor({ id, quantity }) {
    this.id = id
    this.quantity = quantity ?? 1
  }
}

export class Cart {
  constructor({ id }) {
    this.id = id
    this.products = []
  }
}
class CartManager {
  #lastID
  constructor() {
    this.cartsList = []
    this.#lastID = 0
  }

  async #getCarts() {
    const carts = await CM_MONGO.getItems()
    this.cartsList = [...carts]
    return this.cartsList
  }

  async createCart() {
    await this.#getCarts()

    this.#lastID = (this.cartsList)

    const newCart = new Carts(++this.#lastID)
    this.cartsList.push(newCart)

    await CM_MONGO.createItem(newCart)

    return newCart
  }

  async getCartById(cartRef) {
    const cart = await CM_MONGO.findCartByID(cartRef)
    console.log(cart)

    const totalProducts = cart.products.reduce((acc, el) => acc + el.quantity, 0)

    console.log(totalProducts)
    return totalProducts, cart
  }

  async addProductToCart(cartRef, productCode) {
    await this.#getCarts()

    const cart = await CM_MONGO.findCartByID(cartRef)
    const product = await PM_MONGO.findProductByID(productCode)

    const productIndex = cart.products.findIndex((el) => el.productCode === product.code)

    if (productIndex !== -1) {
      ++cart.products[productIndex].quantity

      await CM_MONGO.updateItem(cart)

      return cart
    }

    const newCartProduct = new CartProducts({ code: product.code })

    cart.products.push(newCartProduct)

    await CM_MONGO.updateItem(cart)

    return cart
  }

  async deleteCart(cartRef) {
    const cartDeleted = await CM_MONGO.deleteCart(cartRef)

    return cartDeleted
  }
}

const CM = new CartManager()

export { CM }