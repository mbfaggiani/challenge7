import productModel from "../mongo/models/products.schema.js"
export default class ProductMangerDB{

  async getProduct(queryList){
      const {query, sort} = queryList
      
      try{
          if (queryList){
              const productsParams = await productModel.paginate(query?{category: query}:{},{limit:queryList.limit || 10, page:queryList.page || 1});
              if (sort === 'asc'){
                  const productsParamas = await productModel.aggregate([
                      {
                          $sort: {price :1}
                      }
                  ])
                  return productsParamas
              }
              if (sort === 'desc'){
                  const productsParamas = await productModel.aggregate([
                      {
                          $sort: {price:-1}
                      }
                  ])
                  return productsParamas
              }
               return productsParams; 
          }
      }
      catch(err){
          throw err; 
      }
  }

  async createProduct(product) {
      try {
          const newProduct = new productModel(product);
          await newProduct.save();
          return product;
      } catch (err) {
          throw err;
      }
  }

  async updateProduct(id, product) {
      try{
          const update = await productModel.findByIdAndUpdate(id, product);
          return update;
      }
      catch (err) {
          throw err;
      }
  }

  async deleteProduct(id) {
      try {
          const deleteProd = await productModel.findByIdAndDelete(id);
          return deleteProd;
      }
      catch (err) {
          throw err;
      }
  }
}