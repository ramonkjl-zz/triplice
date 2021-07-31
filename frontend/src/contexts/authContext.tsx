import { Dispatch, SetStateAction, useEffect } from "react";
import { useState, ReactNode, createContext } from "react";
import cookies from 'js-cookie'
import axios from "axios";
import Router from 'next/router'

import { AuthenticatedPlayer } from "../@types";

type Props = {
    children: ReactNode
}

type AuthContextType = {
    playerAuthenticated: AuthenticatedPlayer | null
    setPlayerAuthenticated: Dispatch<SetStateAction<AuthenticatedPlayer | null>>
}

const AuthContext = createContext({} as AuthContextType)

const AuthContextProvider = ({ children }: Props) => {
    const [playerAuthenticated, setPlayerAuthenticated] = useState<AuthenticatedPlayer | null>(null)

    const verifyTokenAlreadyExist = async () => {
        const token = cookies.get("trinka_game_token")

        if (token) {
            const { data } = await axios({
                url: `${process.env.NEXT_PUBLIC_API_URL}/player-load-data`,
                method: 'POST',
                data: { token }
            })

            const { error, message } = data

            if (error) {
                console.log(message)
                cookies.remove("trinka_game_token")
                setPlayerAuthenticated(null)
                Router.push('/')
            } else {
                setPlayerAuthenticated(data)
            }

        }
    }

    useEffect(() => {
        verifyTokenAlreadyExist()
    }, [])

    return (
        <AuthContext.Provider value={{ playerAuthenticated, setPlayerAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContextProvider, AuthContext }
