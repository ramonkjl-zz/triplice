import cookies from 'js-cookie'

const logout = () => {
    cookies.remove("trinka_game_token")
}

export { logout }
