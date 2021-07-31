type PlayerSignUp = {
    username: string
    gender: "male" | "female" | "bottts"
    email: string
    password: string
    confirmPassword: string
}

type PlayerType = {
    _id: string
    username: string
    //gender: "male" | "female" | "bottts"
    email: string
    avatar: string
    score: number
}

type PlayerOnline = PlayerType & {
    socketID: string
    roomName?: string | undefined
}
