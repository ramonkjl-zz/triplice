import { Router } from 'express'
import stickerModel from '../models/sticker.model'

const storeRoutes = Router()

storeRoutes.get('/store-load-stickers', async (request, response) => {
    const data = await stickerModel.find()

    return response.json(data)
})

export { storeRoutes }