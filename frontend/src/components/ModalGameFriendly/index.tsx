import {
    Text, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody,
    ModalFooter, Button, useDisclosure,
    Input
} from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"

import { ModalContext } from "../../contexts/modalsContexts"
import { ButtonGame } from '../ButtonGame'
import { CardGame } from '../CardGame'

function ModalGameFriendly() {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const { openModalGameFriendly, setOpenModalGameFriendly } = useContext(ModalContext)

    const [isOnline, setIsOnline] = useState(false)
    const [isConnectRoom, setIsConnectRoom] = useState(false)

    useEffect(() => {
        if (openModalGameFriendly) {
            onOpen()
        } else {
            onClose()
        }
    }, [openModalGameFriendly])

    useEffect(() => {
        if (isConnectRoom) {
            applyFocus()
        }
    }, [isConnectRoom])

    useEffect(() => {
        if (!isOpen) {
            handleClose()
        }
    }, [isOpen])

    const applyFocus = () => {
        const inputCodRoom = (document.getElementById('cod-room') as HTMLInputElement)
        inputCodRoom.focus()
    }

    const handleClose = () => {
        setOpenModalGameFriendly(false)
        setIsOnline(false)
        setIsConnectRoom(false)
        onClose()
    }

    const switchOnline = () => {
        setIsOnline(true)
    }

    const handleConnectRoom = () => {
        setIsOnline(false)
        setIsConnectRoom(true)
    }

    if (!isOnline && !isConnectRoom) {
        return (
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Escolha.</ModalHeader>
                    <ModalBody>
                        <ButtonGame mb="1.7rem" onClick={switchOnline}>
                            <Text>Online</Text>
                        </ButtonGame>
                        <ButtonGame>
                            <Text>Local</Text>
                        </ButtonGame>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    } else if (isOnline && !isConnectRoom) {
        return (
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Escolha.</ModalHeader>
                    <ModalBody>
                        <CardGame mb="1.7rem">
                            <Text>Criar sala</Text>
                        </CardGame>
                        <CardGame onClick={handleConnectRoom}>
                            <Text>Conectar a uma sala</Text>
                        </CardGame>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    } else if (!isOnline && isConnectRoom) {
        return (
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign="center">Escolha.</ModalHeader>
                    <ModalBody>
                        <Input
                            id="cod-room"
                            borderRadius="md"
                            w='97%'
                            maxW="3xl"
                            h='12'
                            shadow="dark-lg"
                            borderColor="teal"
                            placeholder="Código da sala"
                            mb="1.7rem"
                        />
                        <CardGame onClick={handleConnectRoom}>
                            <Text>Conectar</Text>
                        </CardGame>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }

    return (
        <>
        </>
    )
}

export { ModalGameFriendly }