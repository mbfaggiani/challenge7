import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  ref: { type: Number, required: true },
  thumbnail: { type: Array }
})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model('products', productSchema)

export { productModel }