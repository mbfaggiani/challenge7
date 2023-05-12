import mongoose, { Schema } from 'mongoose';
import { MONGODB_CNX_STR } from '../config/database.config.js';

export async function conectar() {
await mongoose.connect(MONGODB_CNX_STR)
console.log(`Base de datos conectada a ${MONGODB_CNX_STR}`);
}

export const schemaProducts = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true, min: 1 },
    code: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    id: { type: String, required: true, unique:true}
}, { versionKey: false })

export const productsDB = mongoose.model('products', schemaProducts)

const schemaCarts = new mongoose.Schema({
    id: { type: String, required: true, unique:true },
    quantity: { type: Number },
    products: { type: Array}
}, { versionKey: false })

export const cartsDB = mongoose.model('carts', schemaCarts)


