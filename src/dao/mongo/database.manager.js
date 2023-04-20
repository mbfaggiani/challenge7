import mongoose from 'mongoose'
import { productModel } from './models/products.schema.js'
import { cartModel } from './models/cart.schema.js'

class DataBaseProductManager {
  #model
  constructor(model) {
    this.#model = model
  }

  #parseResponse(item) {
    return JSON.parse(JSON.stringify(item))
  }

  #handleQueries(options) {
    const pageOptions = {
      limit: options.limit || 3,
      page: options.page || 1,
      sort: { price: null },
      projection: { _id: 0 },
      lean: true
    }
    const pageQuery = {
      price: { $gte: 0 }
    }

    for (const [key, value] of Object.entries(options)) {
      if (key === 'minPrice') pageQuery.price.$gte = parseInt(value)

      if (key !== 'limit' &&
        key !== 'page' &&
        key !== 'sort' &&
        key !== 'minPrice'
      ) pageQuery[key] = value

      if (key === 'sort' && (value === 'asc' || value === '1')) {
        pageOptions.sort.price = 'ascending'
      } else if (key === 'sort' && (value === 'desc' || value === '-1')) {
        pageOptions.sort.price = 'descending'
      }
    }

    return { pageOptions, pageQuery }
  }

  #generateLinks(options, data) {
    const links = {
      prevLink: null,
      nextLink: null
    }

    if (data.hasPrevPage) {
      const newOptions = {
        ...options,
        page: data.prevPage
      }
      const newParams = new URLSearchParams([
        ...Object.entries(newOptions)
      ]).toString()

      links.prevLink = (`http://localhost:8080 /?${newParams}`)
    }

    if (data.hasNextPage) {
      const newOptions = {
        ...options,
        page: data.nextPage
      }
      const newParams = new URLSearchParams([
        ...Object.entries(newOptions)
      ]).toString()

      links.nextLink = (`http://localhost:8080 /?${newParams}`)
    }
    return links
  }
  
  async getProducts(options) {
    try {
      const { pageOptions, pageQuery } = this.#handleQueries(options)

      const data = await this.#model.paginate(pageQuery, pageOptions)
      if (data.docs.length < 1) throw new Error()

      const links = this.#generateLinks(options, data)

      return {
        payload: data.docs,
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevLink: links.prevLink,
        nextLink: links.nextLink
      }
    } catch (err) {
      throw new Error()
    }
  }

  async getLastProduct() {
    const data = await this.#model.paginate({}, {
      limit: 1,
      sort: { id: -1 },
      projection: { _id: 0 },
      lean: true
    })
    return data.docs
  }

  async findProducts(query) {
    try {
      const response = await this.#model.find(query).lean()
      return response
    } catch (err) {
      throw new Error('Producto no encontrado')
    }
  }

  async createProduct(item) {
    try {
      const response = await this.#model.create(item)
      const data = this.#parseResponse(response)
      return data
    } catch (err) {
      throw new Error()
    }
  }

  async updateProduct({ id }, updates) {
    const data = await this.#model.updateOne({ id }, updates)
    return data
  }

  async deleteProduct({ id }) {
    const response = await this.#model.deleteOne(id)
    return response
  }
}

class DataBaseCartManager {
  #model
  constructor(model) {
    this.#model = model
  }

  #parseResponse(item) {
    return JSON.parse(JSON.stringify(item))
  }

  async getCarts() {
    const response = await this.#model.find({}, { _id: 0, products: { _id: 0 } }).lean()
    return response
  }

  async findCartByID({ id }) {
    const response = await this.#model
      .find(
        { id },
        { _id: 0, products: { _id: 0 } })
      .populate(
        {
          path: 'products.product',
          select: '-stock'
        })
      .lean()

    if (response.length === 0) throw new Error('Carrito no encontrado')

    return response[0]
  }

  async createCart(item) {
    const response = await this.#model.create(item)
    const data = this.#parseResponse(response)
    return data
  }

  async addProductToCart({ id, productID }) {
    await this.#model.updateOne(
      { id },
      {
        $push:
        {
          products:
          {
            product: new mongoose.Types.ObjectId(productID),
            quantity: 1
          }
        }
      }
    )
    return {
      productAdded: true,
      productModified: false,
      quantityValue: 1
    }
  }

  async updateCartProductQuantity({ cartID, productID, quantity }) {
    const data = await this.#model.updateOne(
      { cartID, 'products.product': productID },
      { $set: { 'products.$[elem].quantity': quantity } },
      { arrayFilters: [{ 'elem.product': productID }] }
    )
    const dataWasModified = data.modifiedCount > 0

    return {
      productAdded: false,
      productModified: dataWasModified,
      quantityValue: quantity
    }
  }

  async deleteAllCartProducts({ id }) {
    const response = await this.#model.updateOne(
      { id },
      { $set: { products: [] } }
    )
    return response
  }

  async deleteCartProduct({ id, productID }) {
    const data = await this.#model.updateOne(
      { id },
      { $pull: { products: { product: productID } } }
    )
    const dataWasModified = data.modifiedCount > 0
    return {
      productRemoved: dataWasModified
    }
  }
}

const DB_PRODUCTS = new DataBaseProductManager(productModel)
const DB_CARTS = new DataBaseCartManager(cartModel)

export { DB_CARTS, DB_PRODUCTS }