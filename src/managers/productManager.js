import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import mongoose from 'mongoose';
import { schemaProducts } from '../database/mongoose.js';
import { productsDB } from '../database/mongoose.js';
import { cartsDB } from '../database/mongoose.js';

export class Product {
    constructor({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
    }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.id = randomUUID();
    }
}

export class ProductManager {
#productosDb
    constructor(path) {
        this.products;
        this.path = path;
        this.#productosDb = mongoose.model('products', schemaProducts)
    }

    async readProducts() {
        
        const data = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(data);
    }

    async getProducts() {
        const prodd = await productsDB.find().lean()
        this.products = prodd;
        return this.products
}

    async addProduct(title, description, price, thumbnail, stock, code, category) {

        try {
            await this.getProducts()

            const productFind = this.products.find((product) => product.title === title)
            if (productFind) {
                console.log('Ya existe un producto con ese titulo');
            }

            if (title !== undefined && description !== undefined && price !== undefined && stock !== undefined && code !== undefined && category !== undefined) {
                const product = new Product({
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock,
                    code: code,
                    category: category
                })
                
                const product2 = await productsDB.create({ 
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock,
                    code: code,
                    category: category,
                    status: true,
                    id: randomUUID()
            })
           
                this.products.push(product)
                const jsonProducts = JSON.stringify(this.products, null, 2)
                await fs.writeFile(this.path, jsonProducts)
            }

        } catch (error) {
            throw new Error("Los campos no pueden estar vacios")
        }

    }

    async getProductById(id) {

        const jsonProducts =  await this.getProducts()
        
        this.products = jsonProducts

        const productFind = this.products.find((product) => product.id === id)

        if (productFind === undefined) {
            throw new Error("producto no encontrado o ID invalido")
        } else {
            const productoID = await productsDB.findOne({ id: id }).lean()
            return productoID

        }
    }
    

    async deleteProduct(id) {
        const productos = await this.getProducts() 
        this.products = productos 
        
        await productsDB.deleteOne({ id: id })

        const productos2 = await this.getProducts() 
        this.products = productos2

        const jsonProducts = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, jsonProducts)

        return console.log("producto eliminado correctamente");

    }

    async updateProduct(id, prodModificado) {

        const jsonProducts = await fs.readFile(this.path, 'utf-8')

        const productos = await this.getProducts()
        this.products = productos
        const product = this.products.find((prod) => prod.id === id);
        const indice = this.products.findIndex(p => p.id === id)

        if (!product) {
            throw new Error("El id no existe");
        }

        const nuevoProducto = new Product({
            ...product,
            ...prodModificado
        })
        nuevoProducto.id = id

        this.products[indice] = nuevoProducto

        const jsonProductsModif = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, jsonProductsModif)
        
        await productsDB.findOneAndUpdate({id:id},nuevoProducto)
        
        console.log("El producto se actualizo con exito", nuevoProducto);
    }

}

await mongoose.connection.close()