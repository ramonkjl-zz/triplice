import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import playerModel from '../models/player.model'

//https://avatars.dicebear.com/api/:sprites/:seed.svg
//:sprites substituir por male ou female ou bottts
//:seed pelo que quiser para diferenciar de outros avatares
//?background=%230000ff põe um background
//EX: https://avatars.dicebear.com/api/male/ramon.svg?background=%230000ff

const secret = process.env.SECRET as string

class PlayerController {
    async findPlayer(request: Request, response: Response) {
        const { username, email } = request.body

        const usernameAlreadyExist = await playerModel.findOne({ username })
        const emailAlreadyExist = await playerModel.findOne({ email })

        if (usernameAlreadyExist && !emailAlreadyExist) {
            return response.json({ usernameAlreadyExist: true, emailAlreadyExist: false })
        }
        if (!usernameAlreadyExist && emailAlreadyExist) {
            return response.json({ usernameAlreadyExist: false, emailAlreadyExist: true })
        }
        if (usernameAlreadyExist && emailAlreadyExist) {
            return response.json({ usernameAlreadyExist: true, emailAlreadyExist: true })
        }
        if (!usernameAlreadyExist && !emailAlreadyExist) {
            return response.json({ usernameAlreadyExist: false, emailAlreadyExist: false })
        }
    }

    async create(request: Request, response: Response) {
        const requestPlayerData = request.body as PlayerSignUp

        if (requestPlayerData.password !== requestPlayerData.confirmPassword) {
            return response.status(400).json({ Error: true, Message: "Senhas não coincidem." })
        }

        const playerSignIn = {
            name: '',
            username: requestPlayerData.username,
            gender: requestPlayerData.gender,
            email: requestPlayerData.email,
            password: requestPlayerData.password,
            avatar: `https://avatars.dicebear.com/api/${requestPlayerData.gender}/${Date.now()}.svg?background=%234299E1`
        }

        try {
            await playerModel.create(playerSignIn)
        } catch (error) {
            //error.keyPattern
            if (error.keyPattern.username === 1) {
                return response.status(400).json({ error: true, message: 'Nome de usuário já em uso.' })
            }
            if (error.keyPattern.email === 1) {
                return response.status(400).json({ error: true, message: 'Email já cadastrado.' })
            }

            return response.status(400).json({ error: true, message: error })
        }

        const decodedPlayerAuth = {
            username: requestPlayerData.username,
            password: requestPlayerData.password
        }

        const token = jwt.sign(decodedPlayerAuth, secret, {
            expiresIn: '1d'
        })

        return response.json({ token })
    }

    async signIn(request: Request, response: Response) {
        const { username, password } = request.body

        try {
            const playerData = await playerModel.findOne({ username, password })

            if (playerData) {
                const {
                    _id,
                    username: playerName,
                    email,
                    avatar,
                    score } = playerData

                const decodedPlayerAuth: PlayerType = {
                    _id,
                    username: playerName,
                    email,
                    avatar,
                    score
                }

                const token = jwt.sign(decodedPlayerAuth, secret, {
                    expiresIn: '1d'
                })

                return response.json({ token })
            } else {
                return response.json({ error: true, message: "Usuário e/ou senha inválido." })
            }
        } catch (error) {
            return response.status(400).json({ error: true, message: "Usuário e/ou senha inválido." })
        }
    }

    async loadPlayerData(request: Request, response: Response) {
        const { token } = request.body

        type PlayerData = {
            _id: string
        }

        try {
            const { _id: idToken } = jwt.verify(token, secret) as PlayerData

            const {
                _id,
                name,
                username,
                gender,
                email,
                avatar,
                score,
                collectionSticker
            } = await playerModel.findOne({ _id: idToken })

            const player = {
                _id,
                name,
                username,
                gender,
                email,
                avatar,
                score,
                collectionSticker
            }

            return response.json(player)
        } catch (error) {
            return response.json({ error: true, message: "Token inválido" })
        }

    }

    async update(request: Request, response: Response) {
        const requestDataUpdate: DataUpdate = request.body as DataUpdate

        try {
            const playerData: PlayerType = jwt.verify(requestDataUpdate.token, secret) as PlayerType
            const player = await playerModel.updateOne({ username: playerData.username }, requestDataUpdate.dataUpdate)

            if (player.nModified) {
                return response.json({ error: false, message: "Dados editados com sucesso!" })
            } else {
                return response.json({ error: false, message: "Nenhum dado editado" })
            }
        } catch (error) {
            return response.status(400).json({ error: true, message: "Operação inválida." })
        }
    }
}

export { PlayerController }
