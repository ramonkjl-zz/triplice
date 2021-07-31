import cookies from 'js-cookie'

import { tokenVerify } from "./tokenVerify"

const authVerify = () => {

    const tokenLocal = cookies.get("trinka_game_token") as string

    try {
        return tokenVerify(tokenLocal)
    } catch (error) {
        return false
    }
}

export { authVerify }
