import { Button, ButtonProps } from '@chakra-ui/react'

const ButtonGame = (props: ButtonProps) => (
    <Button
        borderRadius="md"
        w='97%'
        maxW="3xl"
        h='12'
        shadow="dark-lg"
        border="1px solid teal"
        _hover={{ background: 'green.900', transition: "0.3s", color: 'white' }}
        {...props}
    >
        {props.children}
    </Button>
)

export { ButtonGame }