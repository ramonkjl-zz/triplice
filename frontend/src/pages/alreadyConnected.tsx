import { Link } from "@chakra-ui/react";
import router from "next/router";

import { disconnectPlayer } from "../contexts/GameContext";
import { logout } from "../utils/logout";

export default function AlreadyConnected() {

    const handleLogout = () => {
        logout()
        disconnectPlayer()
        router.push('/')
    }

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1>Já conectado!</h1>
            <h2>Você já tem uma janela com o jogo aberta.</h2>
            <br />
            <Link onClick={handleLogout}>Logar com outra conta.</Link>
        </div>
    )
}