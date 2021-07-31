import { model, Schema } from "mongoose"

const StickerSchema = new Schema({
    nameSticker: String,
    path: String,
    price: Number,
    quantity: Number
})

export default model('Sticker', StickerSchema)