type DataForUpdate = {
    username: string
    gender: "male" | "female" | "bottts"
    email: string
    avatar: string
    score: number
    password: string
}

type DataUpdate = {
    token: string
    dataUpdate: DataForUpdate
}