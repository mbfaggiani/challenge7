import express from 'express'
import { PORT } from '../config/servidorconfig.js'
import { engine } from 'express-handlebars'
import { productsRouter } from '../routers/productsRouter.js'
import { cartsRouter } from '../routers/cartsRouter.js'
import { Server as SocketIOServer } from 'socket.io'
import { ProductManager } from '../dao/mongo/product.manager.js'

const productManager = new ProductManager ('./productos.txt')

const app = express()

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))
app.use(express.static('./static'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)


const httpServer = app.listen(PORT)
console.log(`Escuchando en puerto ${PORT}`);

const io = new SocketIOServer(httpServer)

app.get('/', async (req, res) => {
    res.json({"message":"Bienvenido al servidor"})
});

app.get('/realtimeproducts', async (req, res, next) => {

    const listado1 = await productManager.getProducts()

    io.on('connection', async clientSocket => {

    const productosStorage = await productManager.getProducts()

    clientSocket.on('nuevoProducto',  productoAgregar => {
        productManager.addProduct(productoAgregar.title,productoAgregar.description,productoAgregar.price,productoAgregar.thumbnail,productoAgregar.stock,productoAgregar.code,productoAgregar.category)
    })


    clientSocket.on('eliminarProducto',  productoEliminar => {
        productManager.deleteProduct(productoEliminar)
    })

    const listado = await productManager.getProducts()
    io.sockets.emit('actualizarProductos', listado) 
    })

    const listado = [];
    listado1.forEach(element => {listado.push(JSON.stringify(element))});

res.render('realTimeProducts.handlebars', {
        titulo: 'Products',
        encabezado: 'Lista de productos en base de datos',
        listado,
        hayListado: listado.length > 0
    });
});

app.get('/home', async (req, res, next) => {
    const listado1 = await productManager.getProducts()
    

    const producto = [];
    listado1.forEach(element => {producto.push(JSON.stringify(element))
        
    });
    
        res.render('home.handlebars', {
            titulo: 'Products',
            encabezado: 'Lista de productos en base de datos',
            producto,
            hayProductos: producto.length > 0
        })
})