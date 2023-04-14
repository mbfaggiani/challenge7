import express, { Router } from 'express'
import { CM as cartManager } from '../dao/mongo/cart.manager.js'

export const cartsRouter = Router()

cartsRouter.use(express.json())

cartsRouter
  .route('/:cid/product/:pid')
  .post(async (req, res, next) => {
    try {
      const response = await cartManager.addProductToCart(req.params.cid, req.params.pid)
      res.status(response.status_code).json(response.productAdded)
    } catch (error) {
      return next(error.message)
    }
  })

cartsRouter
  .route('/:cid')
  .get(async (req, res, next) => {
    try {
      const response = await cartManager.getCartById(req.params.cid)
      res.status(response.status_code).json(
        {
          cart: response.cart,
          totalProducts: response.totalProducts
        })
    } catch (error) {
      return next(error.message)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const response = await cartManager.deleteCart(req.params.cid)
      res.status(response.status_code).json({ deleted: response.deleted, cart_deleted: response.carts_deleted })
    } catch (error) {
      return next(error.message)
    }
  })

cartsRouter
  .route('/')
  .post(async (req, res, next) => {
    try {
      const response = await cartManager.createCart()
      res.status(response.status_code).json(response.cart)
    } catch (error) {
      return next(error.message)
    }
  })
  .get(async (req, res, next) => {
    try {
      throw new Error()
    } catch (error) {
      next(error.message)
    }
  })