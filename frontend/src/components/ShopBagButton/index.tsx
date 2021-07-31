import { chakra, Box, IconButton, Text, BoxProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import Router from 'next/router'

const OutlineShoppingBag = chakra(HiOutlineShoppingBag)

interface CircleIconProps extends BoxProps {
    children: ReactNode
}

type Props = {
    countStickers: number
}

const CircleIcon = (props: CircleIconProps) => (
    <Box w="1rem" h="1rem" justify="center" align="center" _light={{ background: "black" }} _dark={{ background: "white" }} borderRadius="50%" {...props}>
        <Text fontSize="0.7rem" _light={{ color: "black" }} _dark={{ color: "black" }}>{props.children}</Text>
    </Box>
)

const ShopBagButton = ({ countStickers }: Props) => {

    return (
        <Box onClick={() => Router.push('/shopping-bag')} position="absolute" top="1" right="1" /* ref={btnRef} */ /* colorScheme="teal"  *//* onClick={onOpen}  */ variant="outline">
            <IconButton aria-label="Shopping Bag" icon={<OutlineShoppingBag />} />
            {
                countStickers > 0 && (<CircleIcon zIndex="10000" mt="-20px" ml="20px">{countStickers}</CircleIcon>)
            }
        </Box>
    )
}

export { ShopBagButton }
