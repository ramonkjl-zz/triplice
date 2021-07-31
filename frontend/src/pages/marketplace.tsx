import { Flex, Heading } from '@chakra-ui/react'

import { DrawerDashboard } from '../components/DrawerDashboard'

function Marketplace() {
    return (
        <Flex w="100vw" h="100vh" justify="center" align="center">
            <DrawerDashboard />
            <Heading>Em breve!</Heading>
        </Flex>
    )
}

export default Marketplace