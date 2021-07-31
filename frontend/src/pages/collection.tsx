import {
    Box, Grid, Flex,
    Image, Text, Spacer,
    Button
} from '@chakra-ui/react'

import { DrawerDashboard } from '../components/DrawerDashboard'

const cards = ["a", "a", "a"]

function Store() {
    return (
        <Flex w="100vw" h="100vh" justify="center">
            <DrawerDashboard />
            <Grid
                w="99%" h="97%" mt="3" maxW="container.xl"
                justifyItems="center" alignItems="center" templateColumns="repeat(auto-fit, minmax(170px, 1fr))"
                borderRadius="7px" overflow="auto" sx={{
                    "@media (max-width: 480px)": {
                        mt: "3rem"
                    }
                }}
            >
                {
                    cards.map((value, index) => (
                        <Flex
                            w="11rem"
                            h="15rem"
                            border="1px solid teal"
                            borderRadius="7px"
                            direction="column"
                            key={index}
                            boxShadow="0px 0px 5px 0px rgba(255, 255, 255, 0.3)"
                        >
                            <Image
                                borderRadius="7px"
                                src="/assets/profile_pic.jpg"
                            />
                            <Flex>
                                <Box textAlign="center" w="100%">
                                    <Text size="sm">Sticker name</Text>
                                </Box>
                            </Flex>
                            <Button>Equipar</Button>
                        </Flex>
                    ))
                }
            </Grid>
        </Flex>
    )
}

export default Store