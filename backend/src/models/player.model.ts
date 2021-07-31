import { model, Schema } from "mongoose";

//https://avatars.dicebear.com/api/:sprites/:seed.svg
//:sprites substituir por male ou female ou bottts
//:seed pelo que quiser para diferenciar de outros avatares
//?background=%230000ff põe um background
//EX: https://avatars.dicebear.com/api/male/ramon.svg?background=%230000ff

const PlayerSchema = new Schema({
    name: String,
    gender: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    collectionSticker: {
        type: Array,
        default: []
    },
    avatar: String
})

export default model('Player', PlayerSchema)