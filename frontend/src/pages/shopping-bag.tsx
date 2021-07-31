import {
    Image, Text, Box,
    Flex, Heading, Divider,
    IconButton, Button, Modal,
    ModalOverlay, ModalContent,
    ModalCloseButton, ModalBody,
    useDisclosure, chakra
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { useContext, useEffect } from 'react'
import Router from 'next/router'
import { HiOutlineShoppingBag } from 'react-icons/hi'

import { DrawerDashboard } from '../components/DrawerDashboard'
import { LayoutContext } from '../contexts/LayoutContext'
import { StoreContext } from '../contexts/StoreContext'
import { Sticker } from '../@types'
import { api } from '../api'

type ShoppingCardProps = {
    sticker: Sticker
}

const OutlineShoppingBag = chakra(HiOutlineShoppingBag)

type ShoppingBagModalProps = {
    isOpen: boolean
    onClose: () => void
}

const ShoppingBagModal = ({ isOpen, onClose }: ShoppingBagModalProps) => {
    const { amount, shoppingBag } = useContext(StoreContext)

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Flex w="100%" direction="column" justify="center" align="center">
                    <ModalCloseButton />

                    <ModalBody w="100%">

                        <ShoppingTotal qntSticker={shoppingBag.length} />

                    </ModalBody>

                </Flex>
            </ModalContent>
        </Modal>
    )
}

const ShoppingCard = ({ sticker }: ShoppingCardProps) => {
    const { removeSticker } = useContext(StoreContext)

    return (
        <Flex
            mt="0.3rem"
            w='97%'
            maxW="550px"
            h='9rem'
            justify="space-around"
            align="center"
            border="1px solid teal"
            borderRadius="12px"
        >
            <Box
                w="9rem" h="95%"
                ml="0.7rem" mt="auto"
                mb="auto" borderRadius="12px"
                border="1px solid teal"
            >
                <Image
                    w="11rem"
                    h="100%" src={`${process.env.NEXT_PUBLIC_API_URL}${sticker.path}`}
                    borderRadius="12px"
                />
            </Box>
            <Flex
                direction="column"
                textAlign="center"
                align="center"
            >
                <Text>Id do sticker: {Date.now()}</Text>
                <Text>
                    Preço: R$ {sticker.price}
                </Text>
                <Divider mt="1rem" mb="1rem" w="7rem" />
                <IconButton onClick={() => removeSticker(sticker)} w="3.5rem" aria-label="Deletar sitcker" icon={<DeleteIcon />} />
            </Flex>
        </Flex>
    )
}

type ShoppingTotalProps = {
    qntSticker: number
}

const ShoppingTotal = ({ qntSticker }: ShoppingTotalProps) => {
    const { isMobile } = useContext(LayoutContext)
    const { shoppingBag, amount, setAmount } = useContext(StoreContext)

    const handleCheckout = () => {
        api({
            url: '/checkout',
            method: 'POST',
            data: shoppingBag
        })
    }

    useEffect(() => {
        let amountSpy = 0
        shoppingBag.forEach(sticker => {
            amountSpy += sticker.price
            setAmount(amountSpy)
        })
        if (shoppingBag.length === 0) {
            setAmount(0)
        }
    }, [shoppingBag.length])

    return (
        <Flex
            w={isMobile ? "100%" : "97%"}
            maxW="250px"
            h='15.5rem'
            mt="1rem"
            ml={isMobile ? "33px" : ""}
            direction="column"
            align="center"
            border="1px solid teal"
            borderRadius="12px"
            position={isMobile ? 'relative' : 'absolute'}
            top={isMobile ? "1" : "3"}
            right={isMobile ? "1" : "7"}
        >
            <Heading as="h3" size="md">Total</Heading>
            <Divider w="70%" mt="0.8rem" mb="1rem" />
            <Text>{qntSticker === 1 ? `${qntSticker} sticker` : `${qntSticker} stickers`}</Text>
            <Text>
                Total a pagar: R$ {amount.toFixed(2)}
            </Text>
            <Divider mt="1rem" mb="1rem" w="70%" />
            <Button mb="1rem" onClick={() => Router.push('/store')}>
                Continuar comprando
            </Button>
            <Button mb="1rem" onClick={handleCheckout}>
                Finalizar compra
            </Button>
        </Flex>
    )
}

function ShoppingBag() {
    const { shoppingBag } = useContext(StoreContext)
    const { isMobile } = useContext(LayoutContext)
    const { isOpen, onClose, onOpen } = useDisclosure()

    return (
        <Flex
            w="100vw"
            h="100vh"
            align="center"
            direction="column"
        >
            {
                isMobile
                    ? <IconButton onClick={onOpen} position="absolute" top="0.7" right="1" aria-label="" icon={<OutlineShoppingBag />} />
                    : <ShoppingTotal qntSticker={shoppingBag.length} />
            }

            <ShoppingBagModal isOpen={isOpen} onClose={onClose} />

            <DrawerDashboard />
            <Heading>Sacola</Heading>
            {
                shoppingBag.map((sticker, index) => (
                    <ShoppingCard key={index} sticker={sticker} />
                ))
            }
        </Flex>
    )
}

export default ShoppingBag