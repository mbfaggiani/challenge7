import express, { Router } from 'express'
import ProductMangerDB from '../dao/mongo/product.manager.js'

export const productsRouter = Router();
const productManger = new ProductMangerDB.ProductManger(); 

productsRouter.get('/', async (req,res) => {
    const {limit, page, sort, query} = req.query
    let queryList = {limit, page, sort, query}
    
    try{
        const products = await productManger.getProduct(queryList);
        // res.status(200).send(products)
        res.send({status: 'success', products})
    }
    catch (err){
        res.status(500).send(err.message);
    }
})

productsRouter.post('/', async (req,res) => {
    const newProduct = {
        ...req.body,
      };
      try {
        const response = await productManger.createProduct(newProduct);
        res.send(response);
      } catch (err) {
        res.status(500).send(err.message);
      }
})

productsRouter.put('/:id', async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    try{
        const response = await productManger.updateProduct(id, product);
        res.send(response); 
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

productsRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const response = await productManger.deleteProduct(id);
        res.send({
            message: 'Product deleted successfully',
            id: id
        })
    }
    catch(err) {
        res.status(500).send( err.message)
    }
})
