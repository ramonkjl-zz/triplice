import { Box, BoxProps } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
    children?: ReactNode
    mt?: string
}

const CardGame = (props: BoxProps) => (
    <Box
        borderRadius="md"
        w='97%'
        maxW="3xl"
        h='12'
        shadow="dark-lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        _hover={{ background: 'green.900', transition: "0.3s", color: 'white' }}
        border="1px solid teal"
        {...props}
    >
        {props.children}
    </Box>
)

export { CardGame }