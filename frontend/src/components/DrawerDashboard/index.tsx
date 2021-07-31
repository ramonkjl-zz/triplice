import {
    Drawer, DrawerOverlay, DrawerContent,
    DrawerCloseButton, DrawerBody,
    DrawerFooter, useDisclosure,
    Button, Avatar,
    Flex, Text, Heading, Center
} from "@chakra-ui/react"
import { DragHandleIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { useContext } from "react"

import { CardGame } from '../CardGame'
import { AuthContext } from "../../contexts/authContext"
import { logout } from "../../utils/logout"
import { disconnectPlayer } from "../../contexts/GameContext"

const DrawerDashboard = () => {
    const router = useRouter()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { playerAuthenticated, setPlayerAuthenticated } = useContext(AuthContext)

    const logoutPlayer = () => {
        router.push('/')
        logout()
        onClose()
        setPlayerAuthenticated(null)
        disconnectPlayer()
    }


    return (
        <>
            <Button position="absolute" top="1" left="1" colorScheme="teal" onClick={onOpen} variant="outline">
                <DragHandleIcon />
            </Button>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Flex direction="column" justify="center" align="center">
                            <Avatar
                                src={playerAuthenticated?.avatar}
                                size="2xl"
                            />
                            <Center>
                                <Flex justify="center" align="flex-end">
                                    <Flex direction="column" justify="center" align="center">
                                        <Heading size="md">{playerAuthenticated?.username}</Heading>
                                        <Text>Score: <strong>{playerAuthenticated?.score}</strong></Text>
                                    </Flex>
                                </Flex>
                            </Center>
                        </Flex>
                        <Flex direction="column" justify="center" align="center">
                            <CardGame mt="3" onClick={() => router.push('/dashboard')}>
                                <Text>Inicio</Text>
                            </CardGame>
                            <CardGame mt="3" onClick={() => router.push('/store')}>
                                <Text>Loja</Text>
                            </CardGame>
                            <CardGame mt="3" onClick={() => router.push('/collection')}>
                                <Text>Meus Stickers</Text>
                            </CardGame>
                            <CardGame mt="3" onClick={() => router.push('/rank')}>
                                <Text>Ranque</Text>
                            </CardGame>
                            <CardGame mt="3" onClick={() => router.push('/marketplace')}>
                                <Text>Mercado de Stickers</Text>
                            </CardGame>
                        </Flex>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={logoutPlayer}>
                            Sair
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )

}

export { DrawerDashboard }