import { Divider, Flex, Text, Center } from "@chakra-ui/react"

import { CardGame } from '../components/CardGame'
import { DrawerDashboard } from '../components/DrawerDashboard'

const topRank = [
    {
        position: 1,
        username: "Fulano",
        score: 3303
    },
    {
        position: 1,
        username: "Fulano",
        score: 3303
    },
    {
        position: 1,
        username: "Fulano",
        score: 3303
    },
]

function Rank() {
    return (
        <Flex w="100vw" h="100vh" direction="column" justify="center" align="center">
            <DrawerDashboard />
            <Flex w="97%" h="50%" direction="column" align="center" justifyContent="space-evenly">
                {
                    topRank.map((value, index) => (
                        <CardGame key={index} display="flex" justifyContent="space-evenly" cursor="default">
                            <Text>{value.position}</Text>
                            <Text>{value.username}</Text>
                            <Text>{value.score}</Text>
                        </CardGame>
                    ))
                }
            </Flex>
            <Center w="50%">
                <Divider />
            </Center>
            <Flex w="97%" h="50%" direction="column" justify="space-evenly" align="center">
                {
                    topRank.map((value, index) => (
                        <CardGame key={index} display="flex" justifyContent="space-evenly" cursor="default">
                            <Text>{value.position}</Text>
                            <Text>{value.username}</Text>
                            <Text>{value.score}</Text>
                        </CardGame>
                    ))
                }
            </Flex>
        </Flex>
    )
}

export default Rank