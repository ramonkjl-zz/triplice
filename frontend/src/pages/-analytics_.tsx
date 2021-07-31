import { Flex, Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { GameContext } from '../contexts/GameContext'

export default function Analytics() {
    const { state: { qntPlayers } } = useContext(GameContext)

    return (
        <Flex
            w="100vw" h="100vh"
            justify="center" align="center"
        >
            <Heading>{
                qntPlayers === 1
                    ? `${qntPlayers} jogador conectado`
                    : `${qntPlayers} jogadores conectados`
            }</Heading>
        </Flex>
    )
}