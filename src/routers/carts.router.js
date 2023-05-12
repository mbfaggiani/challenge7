import { Router } from "express";
import CartManagerDB from "../dao/mongo/cart.manager.js";

export const cartRouter = Router();
const cartManager = new CartManagerDB.CartManager();

cartRouter.get('/', async (req, res) => {
    try{
        const cart = await cartManager.getCart()
        res.send(cart)
    }
    catch (err){
        res.status(500).send(err.message)
    }
})


cartRouter.post('/', async (req, res) => {
    try{
        const response = await cartManager.createCart([])
        res.send(response)
    }
    catch (err){
        res.status(500).send(err.message)
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;
    let {quantity} = req.body
    try {
        const response = await cartManager.addProductToCart(cid, pid, quantity);
        res.send(response);
      } catch (err) {
        res.status(500).send(err.message);
      }
})
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const {cid} = req.params;
    const {pid} = req.params;

    try {
        const response = await cartManager.removeProductFromCart(cid, pid);
        res.send({
            message: 'Product deleted successfully',
            id: pid
        })
      } catch (err) {
        res.status(500).send(err.message);
      }
})

cartRouter.delete('/:cid' , async (req,res)=>{
    const {cid} = req.params;
    try {
        const response = await cartManager.deleteAllProductCart(cid);
        res.send({
            message: 'Cart deleted successfully',
            id: cid
        })
    }
    catch (err) {
        req.status(500).send(err.message)
    }
})
