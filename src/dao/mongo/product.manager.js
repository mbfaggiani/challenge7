import { PM_MONGO } from './database.manager.js'

export class Product {
  constructor({
    id,
    title,
    description,
    price,
    code,
    status = true,
    stock = 0,
    thumbnail = []
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.price = price
    this.status = status
    this.thumbnail = thumbnail
    this.stock = stock
    this.code = code ?? `code-${this.id}`
  }
}

export class ProductManager {
  #lastID
  constructor() {
    this.#lastID = 0
    this.productsList = []
  }

  async getProducts() {
    const products = await PM_MONGO.getItems()
    this.productsList = products
    return this.productsList
  }

  async getProductById(query) {
    const product = await PM_MONGO.findProductByID(query)
    return product
  }

  async addProduct(fields) {
    await this.getProducts()

    const newProduct = new Product(++this.#lastID, fields)
    this.productsList.push(newProduct)

    await PM_MONGO.createItem(newProduct)

    return newProduct
    
  }

  async updateProduct(productId, fields) {
    const response = await this.getProductById(productId)
    const product = response.item

    product.description = fields.description ?? product.description
    product.thumbnail = fields.thumbnail ?? product.thumbnail
    product.title = fields.title ?? product.title
    product.price = fields.price ?? product.price
    product.stock = fields.stock ?? product.stock

    await PM_MONGO.updateItem(product)
    return product
  }

  async deleteProduct(productId) {
    const itemDeleted = await PM_MONGO.deleteProduct(productId)

    return itemDeleted
  }
}

const PM = new ProductManager()

export { PM }