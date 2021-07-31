import { Router } from 'express'

import { PlayerController } from '../controllers/player.controller'

const playerRoutes = Router()

const playerController = new PlayerController()

playerRoutes
    .post('/player-sign-up', playerController.create)
    .post('/player-sign-in', playerController.signIn)
    .post('/player-find', playerController.findPlayer)
    .post('/player-load-data', playerController.loadPlayerData)
    .put('/player-update', playerController.update)

export { playerRoutes }