import axios from "axios"
import cookies from "js-cookie"

import { LoginType } from "../@types"
import { authVerify } from "./authVerify"
import { tokenVerify } from "./tokenVerify"

const signIn = async ({ username, password }: LoginType) => {

    const { data: { token } } = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/player-sign-in`,
        method: 'POST',
        data: { username, password }
    })

    try {
        const dados = tokenVerify(token as string)
        cookies.set("trinka_game_token", token)
        authVerify()
    } catch (error) {
        alert("Login inválido")
    }

}

export { signIn }