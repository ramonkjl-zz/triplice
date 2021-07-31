import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

import { Server } from 'socket.io'
import http from 'http'

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})

import { playerRoutes } from './routes/player.routes'
import { dbConnect } from './database/mongodb.data'
import stickerModel from './models/sticker.model'
import { storeRoutes } from './routes/store.routes'
import { startWebSocket } from './webSockets'

const appServer = express()

const httpServer = http.createServer(appServer)
const socketIo = new Server(httpServer)

dbConnect()
// store/stickers-svg/Ritter.svg

const pathDirStaticPublic = path.resolve('public')
const pathStaticSickerSVG = path.resolve('public', 'store', 'stickers-svg')

//Retornar Array com nome de todos os arquivos no diretório
// /store/stickers-svg/

const loadStickerStore = () => {
    const stickers = fs.readdirSync(pathStaticSickerSVG)

    stickers.forEach(async (sticker) => {
        const stickerFound = await stickerModel.findOne({ path: `/store/stickers-svg/${sticker}` })

        if (!stickerFound) {
            stickerModel.create({
                nameSticker: '',
                path: `/store/stickers-svg/${sticker}`,
                price: 5.90,
                quantity: 300
            })
        }
    })
}
loadStickerStore()

appServer.use(cors())
appServer.use(express.json())
appServer.use(express.urlencoded({ extended: true }))
appServer.use(express.static(pathDirStaticPublic))

// Rotas
appServer.use(playerRoutes)
appServer.use(storeRoutes)

startWebSocket()

const PORT = process.env.PORT || 7000
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

export { socketIo }
