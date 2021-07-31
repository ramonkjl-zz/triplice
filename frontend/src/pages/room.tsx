import { Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { GameContext } from "../contexts/GameContext";

export default function Room() {
    const { state: { room } } = useContext(GameContext)
    return (
        <Flex
            w="100vw" h="100vh"
            direction="column"
            align="center"
        >
            <Heading>Sala: {room.roomName}</Heading>
            <Text>Player: {room.player1?.username}</Text>
            <Text>Player: {room.player2?.username}</Text>
        </Flex>
    )
}