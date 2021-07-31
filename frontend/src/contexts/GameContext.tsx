import {
    createContext, ReactNode, useEffect,
    useReducer, useContext
} from "react";
import socketIoClient, { Socket } from 'socket.io-client'
import Router from 'next/router'

import { AuthContext } from "./authContext";
import { PlayerType, Room } from "../@types";

type Props = {
    children: ReactNode
}

type State = {
    isConnected: boolean
    qntPlayers: number
    mePlayer: PlayerType
    room: Room
    matchGame: boolean
    usernameDontAccept: string
    ImReady: boolean
}

type GameContextType = {
    state: State
}

type Action = {
    type: string
    payload: any
}

const GameContext = createContext({} as GameContextType)

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'CONNECTED':
            socket.emit('PlayerConnected', action.payload)
            return {
                ...state,
                isConnected: true //action.payload
            }
        case 'RefreshPlayers':
            return {
                ...state,
                qntPlayers: action.payload
            }
        case 'Me':
            return {
                ...state,
                mePlayer: action.payload
            }
        case 'Room':
            return {
                ...state,
                room: action.payload
            }
        case 'MatchGame':
            return {
                ...state,
                matchGame: action.payload
            }
        case 'DontAccept':
            return {
                ...state,
                usernameDontAccept: action.payload
            }
        default:
            return state
    }
}

const initialState: State = {
    isConnected: false,
    qntPlayers: 0,
    mePlayer: {} as PlayerType,
    room: {} as Room,
    matchGame: false,
    ImReady: false,
    usernameDontAccept: ''
}

const url = process.env.NEXT_PUBLIC_API_URL
let socket: Socket

const GameProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { playerAuthenticated } = useContext(AuthContext)

    useEffect(() => {
        if (playerAuthenticated?._id) {
            socket = socketIoClient(`${url}`, {
                autoConnect: false,
                transports: ['websocket'],
                forceNew: true,
                upgrade: false
            })
            socket.on('connect', () => {
                dispatch({ type: 'CONNECTED', payload: playerAuthenticated })
            })
            socket.on('PlayerAlreadyConnected', (isAlreadyConnected: boolean) => {
                if (isAlreadyConnected)
                    Router.push('/alreadyConnected')
            })
            socket.on('RefreshPlayers', (qntPlayers: number) => {
                dispatch({ type: 'RefreshPlayers', payload: qntPlayers })
            })
            socket.on('Me', (mePlayer: PlayerType) => {
                dispatch({ type: 'Me', payload: mePlayer })
            })
            socket.on('Room', (room: Room) => {
                dispatch({ type: 'Room', payload: room })
            })
            socket.on('MatchGame', (readyGame: boolean) => {
                dispatch({ type: 'MatchGame', payload: readyGame })
            })
            socket.on("DontAccept", (usernameDontAccept: string) => {
                dispatch({ type: 'DontAccept', payload: usernameDontAccept })
            })
            socket.open()
        }
    }, [playerAuthenticated])

    return (
        <GameContext.Provider value={{ state }}>
            {children}
        </GameContext.Provider>
    )
}

const playRandomGame = () => {
    socket.emit('PlayRandom')
}

const cancelSearchRandomRoom = () => {
    socket.emit('CancelSearchRandomRoom')
}

const acceptDuel = (accept: boolean) => {
    socket.emit('AcceptDuel', accept)
}

const clearUsernameDontAccept = () => {
    socket.emit('ClearUsernameDontAccept')
}

const disconnectPlayer = () => {
    socket.disconnect()
}

export {
    GameProvider,
    GameContext,
    playRandomGame,
    cancelSearchRandomRoom,
    acceptDuel,
    clearUsernameDontAccept,
    disconnectPlayer
}