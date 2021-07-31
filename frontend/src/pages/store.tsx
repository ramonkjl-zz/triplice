import {
    Box, Grid, Flex,
    Image, Text, Spacer,
    Button
} from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import {
    MouseEvent, useState, useContext,
    useEffect
} from 'react'

import { Sticker, Stickers } from '../@types'
import { DrawerDashboard } from '../components/DrawerDashboard'
import { ShopBagButton } from '../components/ShopBagButton'
import { StoreContext } from '../contexts/StoreContext'

type Props = {
    stickers: Stickers
}

function Store({ stickers }: Props) {
    const { shoppingBag, setShoppingBag } = useContext(StoreContext)
    const [count, setCount] = useState(0)

    const addSticker = (e: MouseEvent, sticker: Sticker) => {
        (e.currentTarget as HTMLButtonElement).disabled = true
        shoppingBag.push(sticker)
        setShoppingBag(shoppingBag)
        setCount(shoppingBag.length)
    }

    const buttonDisabled = () => {
        shoppingBag.forEach(sticker => {
            (document.getElementById(sticker._id) as HTMLButtonElement).disabled = true
        })
    }

    useEffect(() => {
        buttonDisabled()
        setCount(shoppingBag.length)
    }, [])

    if (stickers.length == 0) {
        return (
            <Text>Carregando...</Text>
        )
    }

    return (
        <Flex w="100vw" h="100vh" justify="center">
            <DrawerDashboard />
            <ShopBagButton countStickers={count} />
            <Grid
                w="99%" mt="3" maxW="container.xl"
                justifyItems="center" alignItems="center"
                templateColumns="repeat(auto-fit, minmax(170px, 1fr))"
                sx={{
                    "@media (max-width: 480px)": {
                        mt: "3rem"
                    }
                }}
            >
                {
                    stickers.map((sticker, index) => (
                        <Flex
                            w="11rem"
                            h="15rem"
                            mt="1"
                            border="1px solid teal"
                            borderRadius="7px"
                            direction="column"
                            key={index}
                            boxShadow="0px 0px 5px 0px rgba(255, 255, 255, 0.3)"
                        >
                            <Box w="11rem" h="11rem">
                                <Image
                                    height="100%"
                                    width="100%"
                                    borderRadius="7px"
                                    //src="/assets/profile_pic.jpg"
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${sticker.path}`}
                                />
                            </Box>
                            <Flex>
                                <Box textAlign="center" w="50%">
                                    <Text size="sm">R$ {sticker.price.toFixed(2).replace('.', ',')}</Text>
                                </Box>
                                <Spacer />
                                <Box textAlign="center" w="50%">
                                    <Text size="sm">Qnt: {sticker.quantity}</Text>
                                </Box>
                            </Flex>
                            <Button id={sticker._id} onClick={(e) => addSticker(e, sticker)}>Pôr na sacola</Button>
                        </Flex>
                    ))
                }
            </Grid>
        </Flex>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const stickers = await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-load-stickers`)).json() as Stickers

    return {
        props: {
            stickers
        },
        revalidate: 12
    }

}

export default Store