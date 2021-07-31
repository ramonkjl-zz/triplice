import { Socket } from 'socket.io'
import { socketIo } from '..'

const playerSpy = {
    socketID: 'ab',
    _id: 'abc',
    avatar: 'ramonjs',
    email: 'ramonjs',
    score: 12,
    username: 'ramon'
}

const playersOnline: Array<PlayerOnline> = []
const randomRooms: Array<Room> = []

type PlayerOnIndex = {
    playerOn: PlayerOnline
    index: number
}

type FindRoom = {
    room: Room
    index: number
}

const startWebSocket = () => {
    socketIo.on('connection', socket => {

        socket.on('PlayerConnected', (player: PlayerType) => {
            console.log(`Jogador ${player.username} conectou-se.`)

            if (isAlreadyConnected(player)) {

                return socket.emit('PlayerAlreadyConnected', true)
            }
            else {

                const playerInsert: PlayerOnline = {
                    socketID: socket.id,
                    ...player
                }

                playersOnline.push(playerInsert)
                refreshPlayers()
            }
        })

        socket.on('PlayRandom', () => {

            try {
                playersOnline.forEach((playerOn, index) => {
                    if (playerOn.socketID === socket.id) {
                        throw { playerOn, index }
                    }
                })
            } catch ({ playerOn, index }) {
                const idxRoom = playerEmpty()

                if (idxRoom >= 0) {

                    randomRooms[idxRoom].player2 = playerOn
                    playersOnline[index].roomName = randomRooms[idxRoom].roomName
                    socket.join(randomRooms[idxRoom].roomName)
                    sendRoom(randomRooms[idxRoom].roomName, randomRooms[idxRoom])
                }
                else {
                    createRoom(socket, playerOn, index)
                }
            }

        })

        socket.on('CancelSearchRandomRoom', () => {
            //const resp = findPlayer(socket.id)
            const { playerOn, index } = findPlayer(socket.id) as PlayerOnIndex


            if (playerOn && index) {

                //const { playerOn, index } = resp as PlayerOnIndex

                const roomName = playersOnline[index].roomName as string

                removePlayerRoom(playerOn)
                socket.leave(roomName)

                playersOnline[index].roomName = undefined

            }
        })

        socket.on('disconnect', () => {
            const resp = findPlayer(socket.id)

            if (resp) {
                const { playerOn, index } = resp

                if (playerOn.roomName) {
                    removePlayerRoom(playerOn)
                    socket.leave(playerOn.roomName)
                }

                playersOnline.splice(index, 1)

                refreshPlayers()
            }

        })

    })
}

const isAlreadyConnected = (player: PlayerType) => {

    for (const playerOn of playersOnline) {
        if (playerOn.username === player.username) {
            return true
        }
    }

    return false
}

const refreshPlayers = () => {
    socketIo.emit('RefreshPlayers', playersOnline.length)
}

const refreshRooms = () => {
    socketIo.emit('RefreshRooms', randomRooms)
}

const playerEmpty = () => {
    for (const index in randomRooms) {
        if (!randomRooms[index].player2)
            return Number(index)
    }

    return -1
}

const createRoom = (socket: Socket, playerOn: PlayerOnline, indexPlayer: number) => {
    const roomName = socket.id.substr(3, 3)

    const room: Room = {
        roomName,
        player1: playerOn,
        player2: undefined,
    }

    playersOnline[indexPlayer].roomName = roomName

    socket.join(roomName)
    randomRooms.push(room)
    refreshRooms()
    sendRoom(roomName, room)

    refreshPlayers()
}

const sendRoom = (roomName: string, room: Room) => {
    socketIo.in(roomName).emit('Room', room)
}

const removePlayerRoom = (playerOn: PlayerOnline) => {

    for (const room of randomRooms) {
        if (room.roomName === playerOn.roomName) {
            if (room.player1?.socketID === playerOn.socketID) {
                room.player1 = undefined
            }
            else if (room.player2?.socketID === playerOn.socketID) {
                room.player2 = undefined
            }

            sendRoom(room.roomName, room)
            const { index } = findRoom(room.roomName) as FindRoom

            if (!room.player1 && !room.player2)
                randomRooms.splice(index, 1)

            break;
        }
    }
}

const findPlayer = (socketID: string): PlayerOnIndex | undefined => {
    for (const idx in playersOnline) {
        if (playersOnline[idx].socketID === socketID) {
            const playerOn = playersOnline[idx]
            const index = Number(idx)

            return { playerOn, index }
        }
    }
}

const findRoom = (roomName: string): FindRoom | undefined => {
    for (const idx in randomRooms) {
        if (randomRooms[idx].roomName === roomName) {
            const room = randomRooms[idx]
            const index = Number(idx)

            return { room, index }
        }
    }
}

export { startWebSocket }

