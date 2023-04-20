import mongoose, { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const cartSchema = new Schema({
  ref: { type: String, required: true },
  products: { type: Array }
})

cartSchema.plugin(mongoosePaginate)

const cartModel = mongoose.model('carts', cartSchema)

export { cartModel }