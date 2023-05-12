import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_PRIVATE_KEY } from '../config/auth.config.js'

export function createHash(frase) {
    return bcrypt.hashSync(frase, bcrypt.genSaltSync(10))
}

export function isValidPassword(recibida, almacenada) {
    return bcrypt.compareSync(recibida, almacenada)
}

export function encriptarJWT(payload) {
    const token = jwt.sign(JSON.parse(JSON.stringify(payload)), JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export function desencriptarJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_PRIVATE_KEY, (err, decodedPayload) => {
            if (err) {
                reject(err)
            } else {
                resolve(decodedPayload)
            }
        })
    })
}
