import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'

import theme from '../theme'
import { ModalContextProvider } from '../contexts/modalsContexts'
import { AuthContextProvider } from '../contexts/authContext'
import { LayoutProvider } from '../contexts/LayoutContext'
import { StoreContextProvider } from '../contexts/StoreContext'
import { GameProvider } from '../contexts/GameContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <AuthContextProvider>
        <LayoutProvider>
          <StoreContextProvider>
            <ModalContextProvider>
              <GameProvider>
                <Component {...pageProps} />
              </GameProvider>
            </ModalContextProvider>
          </StoreContextProvider>
        </LayoutProvider>
      </AuthContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
