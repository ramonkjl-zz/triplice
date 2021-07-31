export type LoginType = {
    username: string
    password: string
}

export type StickerType = {
    nameSticker: string
    path: string
    price: number
    quantity: number
}

export type AuthenticatedPlayer = {
    _id: string
    name: string
    username: string
    gender: string
    email: string
    avatar: string
    score: number
    collectionSticker: Array<StickerType>
}

export type Sticker = {
    _id: string
    nameSticker: string
    path: string
    price: number
    quantity: number
}

export type Stickers = Array<Sticker>

export type PlayerType = {
    _id: string;
    socketID: string
    roomName?: string | undefined
    username: string;
    email: string;
    avatar: string;
    score: number;
    isReady: boolean
}

export type Room = {
    roomName: string
    player1: PlayerType | undefined
    player2: PlayerType | undefined
}

//export { LoginType, StickerType, AuthenticatedPlayer, Sticker, Stickers }