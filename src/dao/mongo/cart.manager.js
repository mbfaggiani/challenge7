import cartModel from "../mongo/models/cart.schema.js"

export default class CartManagerDB{

  async getCart(){
      try{
          const cart = await cartModel.find();
          return  JSON.stringify(cart, null, '\t');
      }
      catch (err) {
          throw err;
      }
  }

  async createCart(cart){
      try{
          const newCart = new cartModel(cart);
          await newCart.save();
          return cart;
      }
      catch (err) {
          throw err;
      }
  }

  async addProductToCart(cid, pid, quantity){
      try{
          const cartId = await cartModel.findById(cid);
          let productId =  cartId.products.find(p => p.product.toString() === pid.toString())
          if (productId){
             productId.quantity = quantity
          }else{
              cartId.products.push({product:pid, quantity:quantity});
          }
          const cartUpdate = await cartModel.updateOne({_id: cid},cartId)
          return cartUpdate
      }
      catch (err) {
          throw err;
      }
  }

  async removeProductFromCart(cid, pid){
      try{
          const cartId = await cartModel.findById(cid);
              const findproduct = cartId.products
              const productCart = findproduct.findIndex(p=> p.product.toString() === pid.toString())
              
              findproduct.splice(productCart,1)
              const update = {products: findproduct}
              const updateCart = await cartModel.findByIdAndUpdate(cid, update );
              return updateCart
      }catch (err) {
          throw err;
      }
  }

  async deleteAllProductCart(id){
      try {
          const deleteProduct = {products:[]}
          const cart = await cartModel.findByIdAndUpdate(id, deleteProduct);
          return cart;
        } catch (err) {
          throw err;
        }
  }

}