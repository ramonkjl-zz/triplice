import {
  Flex, Box, FormControl,
  Input, Stack, Link,
  Button, Heading, Text,
  InputGroup, InputLeftElement, chakra,
  InputRightElement, FormHelperText, useDisclosure
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaUserAlt, FaLock } from 'react-icons/fa'
import Router from 'next/router'
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useContext } from 'react';

import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CreateAccountModal } from '../components/CreateAccountModal';
import { AuthContext } from '../contexts/authContext';
import { tokenVerify } from '../utils/tokenVerify';
import { signIn } from '../utils/signIn';
import { AuthenticatedPlayer } from '../@types';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

type ErrorType = {
  messageError: string
}

function Index() {

  const { onOpen, isOpen, onClose } = useDisclosure()

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const handleShowClick = () => setShowPassword(!showPassword);

  const [errosAll, setErrosAll] = useState({} as ErrorType)

  const { playerAuthenticated, setPlayerAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    (document.getElementById('username') as HTMLInputElement).focus()

    if (playerAuthenticated?.username) {
      Router.push('/dashboard')
    }
  }, [playerAuthenticated])

  const handleSignIn = async () => {
    setIsLoading(true)

    const inputUsername = (document.getElementById('username') as HTMLInputElement)
    const inputPassword = (document.getElementById('password') as HTMLInputElement)


    const userLogin = {
      username: inputUsername.value,
      password: inputPassword.value
    }

    const { data: { error, message, token } } = await axios({
      url: `${process.env.NEXT_PUBLIC_API_URL}/player-sign-in`,
      method: 'POST',
      data: userLogin
    })

    if (error) {
      const erro = {
        messageError: message
      }

      setIsLoading(false)
      setErrosAll(erro)
    } else {
      const playerData = tokenVerify(token)

      const {
        avatar, username, email,
        score, _id, collectionSticker,
        gender, name
      } = playerData as AuthenticatedPlayer

      const player: AuthenticatedPlayer = {
        avatar,
        username,
        email,
        score,
        _id, collectionSticker,
        gender, name
      }

      signIn(userLogin)

      setPlayerAuthenticated(player)
    }
  }

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <DarkModeSwitch />
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Avatar bg="teal.500" /> */}
        <Heading color="teal.300">Trinka Game</Heading>
        <Text color="teal.400">Divirta-se em nosso game!</Text>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input id='username' type="text" placeholder="username" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    id='password'
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errosAll.messageError && <Text>{errosAll.messageError}</Text>}
                <FormHelperText textAlign="right">
                  <Link>esqueceu a senha?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                //type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={handleSignIn}
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Ainda não tem uma conta?{" "}
        <Link onClick={onOpen} color="teal.500" href="#">
          Criar
        </Link>
      </Box>
      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { trinka_game_token: token } = ctx.req.cookies

  if (token) {
    return {
      props: {

      },
      redirect: {
        destination: '/dashboard'
      }
    }
  }

  return {
    props: {

    }
  }
}

export { getServerSideProps }

export default Index
