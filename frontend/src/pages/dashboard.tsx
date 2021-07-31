import {
    Flex, Text, Modal,
    ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, Button,
    useDisclosure, Center, CircularProgress
} from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { GetServerSideProps } from "next"
import router from "next/router"

import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CardGame } from "../components/CardGame"
import { DrawerDashboard } from "../components/DrawerDashboard"
import { ModalGameFriendly } from "../components/ModalGameFriendly"
import { ModalContext } from "../contexts/modalsContexts"
import {
    acceptDuel, cancelSearchRandomRoom, clearUsernameDontAccept,
    GameContext, playRandomGame
} from "../contexts/GameContext"
import { AuthContext } from "../contexts/authContext"

type ParamType = 'Ranked' | 'Random' | 'Friendly'

type PrepareGameModalProps = {
    isFoundRoom: boolean
}
const PrepareGameModal = ({ isFoundRoom }: PrepareGameModalProps) => {
    const { onClose } = useDisclosure()

    const { playerAuthenticated } = useContext(AuthContext)
    const { state: { room: { player1, player2 } } } = useContext(GameContext)

    const [isLoading, setIsLoading] = useState(false)
    const [isWaiting, setIsWaiting] = useState(false)

    const handleAccept = () => {
        acceptDuel(true)
        setIsLoading(true)
    }

    useEffect(() => {
        if (player1?.isReady && player1?.username === playerAuthenticated?.username) {
            setIsWaiting(true)
        }
        else if (!player1?.isReady && player1?.username === playerAuthenticated?.username) {
            setIsWaiting(false)
        }
        else if (player1?.isReady && player1?.username !== playerAuthenticated?.username) {
            setIsWaiting(false)
        }
        else if (player2?.isReady && player2.username === playerAuthenticated?.username) {
            setIsWaiting(true)
        }
        else if (!player2?.isReady && player2?.username === playerAuthenticated?.username) {
            setIsWaiting(true)
        }
        else if (player2?.isReady && player2.username !== playerAuthenticated?.username) {
            setIsWaiting(false)
        }
    }, [player1?.isReady, player2?.isReady])

    return (
        <Modal isCentered closeOnOverlayClick={false} isOpen={isFoundRoom} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    {
                        !isWaiting
                            ? `Oponente encontrado!`
                            : `Aguarde um pouco...`
                    }
                </ModalHeader>
                <ModalBody>
                    <Text textAlign="center">
                        {
                            !isWaiting
                                ? `Aceitar duelo?`
                                : `Esperamos que teu adversário aceitar o duelo.`
                        }
                    </Text>
                </ModalBody>
                {
                    !isWaiting && (
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} isLoading={isLoading} onClick={handleAccept}>
                                Sim
                            </Button>
                            <Button colorScheme="red" mr={3} onClick={() => acceptDuel(false)}>
                                Não
                            </Button>
                        </ModalFooter>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

function Dashboard() {

    const { isOpen, onClose, onOpen } = useDisclosure()

    const [message, setMessage] = useState('')
    const [param, setParam] = useState<'Ranked' | 'Random' | 'Friendly'>()
    const [isFoundRoom, setIsFoundRoom] = useState(false)
    const [isSearchDuel, setIsSearchDuel] = useState(false)

    const { state: { room, matchGame, usernameDontAccept } } = useContext(GameContext)
    const { setOpenModalGameFriendly } = useContext(ModalContext)
    const { playerAuthenticated } = useContext(AuthContext)

    useEffect(() => {
        if (room.player1 && room.player2) {
            if (matchGame) {
                onClose()
                setIsFoundRoom(matchGame)
                if (room.player1.isReady && room.player2.isReady) {
                    router.push('/room')
                }
            }
        }
        else if (usernameDontAccept && usernameDontAccept === playerAuthenticated?.username) {
            if (!matchGame) {
                setIsFoundRoom(false)
                onClose()

                clearUsernameDontAccept()
            }
        }
        else if (usernameDontAccept && usernameDontAccept !== playerAuthenticated?.username) {
            if (!matchGame && isSearchDuel) {
                setIsFoundRoom(false)
                onOpen()
                playRandomGame()

                clearUsernameDontAccept()
            }
        }
    }, [room.player1, room.player2, usernameDontAccept, matchGame])

    const handleModal = (Param: ParamType) => {
        switch (Param) {
            case 'Ranked':
                setMessage('Em busca de um oponente digno.')
                setParam('Ranked')
                onOpen()
                break;
            case 'Random':
                setMessage('Em busca de diversão sem comprometer o score!')
                playRandomGame()
                setParam('Random')
                setIsSearchDuel(true)
                onOpen()
                break;
            case 'Friendly':
                setOpenModalGameFriendly(true)
                break;
        }
    }

    const handleCancel = () => {

        switch (param) {
            case 'Ranked':

                break;
            case 'Random':
                setIsSearchDuel(false)
                cancelSearchRandomRoom()
                onClose()
                break;
            case 'Friendly':
                break;
            default:
                break;
        }
    }

    return (
        <Flex h="100vh" justify="center" align="center" direction="column">
            <DarkModeSwitch />
            <DrawerDashboard />
            <CardGame mt="7" onClick={() => handleModal('Ranked')}>
                <Text>Jogar Ranqueada</Text>
            </CardGame>
            <CardGame mt="7" onClick={() => handleModal('Random')}>
                <Text>Jogar Aleatória</Text>
            </CardGame>
            <CardGame mt="7" onClick={() => handleModal('Friendly')}>
                <Text>Jogar contra um Amigo</Text>
            </CardGame>

            <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Procurando...</ModalHeader>
                    <ModalBody>
                        <Center>
                            <CircularProgress isIndeterminate color="green.300" />
                        </Center>
                        <Text textAlign="center">{message}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ModalGameFriendly />
            <PrepareGameModal isFoundRoom={isFoundRoom} />

        </Flex>
    )
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { trinka_game_token: token } = ctx.req.cookies

    if (!token) {
        return {
            props: {

            },
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export { getServerSideProps }

export default Dashboard
