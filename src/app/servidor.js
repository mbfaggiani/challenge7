import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'
import cookieParser from "cookie-parser"
import passport from 'passport'
import initializePassport from '../config/passport.config.js'
import cors from 'cors';

import { PORT } from '../config/servidor.config.js'
import { conectar } from '../database/mongoose.js'
import { productsRouter } from '../routers/products.router.js'
import { cartRouter } from '../routers/carts.router.js'

await conectar();

const app = express();

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))
app.use(express.static('./static'))
app.use(cors({origin: "*"}))
app.use(cookieParser())
app.use(session)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, ()  => {
console.log(`Escuchando en puerto ${PORT}`)
});