import { ProductManager } from "./productManager.js";
import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import mongoose from 'mongoose';
import { cartsDB } from '../database/mongoose.js';

export class CartManager {

    constructor(path) {
        this.carts;
        this.path = path;
        this.products = [];
    }
    async readCarts() {
        const data = await fs.readFile(this.path, "utf-8");
        this.carts = JSON.parse(data);
    }

    async getCarts() {
        await this.readCarts();
        this.carts =await cartsDB.find()
        return this.carts

    }

    async crearCarrito() {

        await this.getCarts()
        const cart = {
            "id": randomUUID(),
            "quantity": 0,
            "products": []
        }
        this.carts.push(cart)

        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)
        await cartsDB.create(cart)
        console.log("carrito creado correctamente");
    }

    async agregarProductoAlCarrito(cid, pid) {
        try {
            const productManager = new ProductManager('./productos.txt');

            const productos = await productManager.getProducts()
            const productoIndex = productos.findIndex(prod => prod.id == pid)
            const productoFiltrado = productos[productoIndex]

            const carritos = await this.getCarts()
            const carritoIndex = carritos.findIndex(carrito => carrito.id == cid)
            const carritoFiltrado = carritos[carritoIndex]

            let cant = 1
            const produID = {
                "id": `${productoFiltrado.id}`,
                "quantity": `${cant}`
            };

            const idsDentroDelCarrito = [];
            const carritoProductos = carritoFiltrado.products
            carritoProductos.forEach(element => {
                idsDentroDelCarrito.push(element.id)
            });

            if (idsDentroDelCarrito.includes(pid)) {
                const productoDentroDelCarrito = carritoProductos.find(element => element.id == pid)
                productoDentroDelCarrito.quantity++;
                carritoFiltrado.quantity++;
                await this.saveCart()
                await cartsDB.findOneAndUpdate({id:cid},carritoFiltrado)
               
            } else {
                const push = carritoProductos.push(produID)
                carritoFiltrado.quantity++;
                this.carts[carritoIndex].products = carritoProductos
                await this.saveCart()
                await cartsDB.findOneAndUpdate({id:cid},carritoFiltrado)
            }

             return { "message": "producto cargado correctamente"  }
        } catch (error) {
            return error.message
        }
    }


    async saveCart() {
        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)
    }
    async getCartById(id) {

        const carritos = await this.getCarts()

        return await cartsDB.findOne({id:id})
    }

}

await mongoose.connection.close()