import express, { Router } from 'express'
import { PM as productManager } from '../dao/mongo/product.manager.js'

export const productsRouter = Router()

productsRouter.use(express.json())

productsRouter
  .route('/:pid')
  .get(async (req, res, next) => {
    try {
      const { pid: id } = req.params
      const response = await productManager.getProductById({ id })
      res.status(response.status_code).json({ product: response.item })
    } catch (error) {
      return next(error.message)
    }
  })
  .put(async (req, res, next) => {
    try {
      const { pid: id } = req.params
      const response = await productManager.updateProduct(id, req.body)

      res.status(response.status_code).json(response.itemUpdated)
    } catch (error) {
      return next(error.message)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { pid: id } = req.params
      const response = await productManager.deleteProduct(id)

      res.status(response.status_code).json({ product_deleted: response.itemDeleted })
    } catch (error) {
      return next(error.message)
    }
  })

productsRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const products = await productManager.getProducts(req.query)
      res.json(products)
    } catch (error) {
      return next(error.message)
    }
  })
  .post(async (req, res, next) => {
    try {
      const response = await productManager.addProduct(req.body)
      res.status(response.status_code).json(response.productAdded)
    } catch (error) {
      return next(error.message)
    }
  })