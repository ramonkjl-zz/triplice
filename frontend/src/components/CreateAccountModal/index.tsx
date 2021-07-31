import {
    Modal, ModalOverlay, ModalHeader,
    ModalCloseButton, ModalBody, ModalFooter,
    Button, ModalContent, Input,
    Select, Text
} from '@chakra-ui/react'
import axios from 'axios'
import { useContext, useState } from 'react'

import { signIn } from '../../utils/signIn'
import { tokenVerify } from '../../utils/tokenVerify'
import { AuthContext } from '../../contexts/authContext'
import { AuthenticatedPlayer, LoginType } from '../../@types'

type Props = {
    isOpen: boolean
    onClose: () => void
}

type ErrosAllType = {
    errorUsername: string
    errorGender: string
    errorEmail: string
    errorPassword: string
    errorConfirmPassword: string
}

type UserCreateAccount = {
    username: string
    gender: string
    email: string
    password: string
    confirmPassword: string
}

type CreatePlayer = {
    username: string
    gender: string
    email: string
    password: string
    confirmPassword: string
}

type ValidationResponse = {
    usernameAlreadyExist: boolean
    emailAlreadyExist: boolean
}

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL}` })

function CreateAccountModal({ isOpen, onClose }: Props) {

    const [errosAll, setErrosAll] = useState<ErrosAllType | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { setPlayerAuthenticated } = useContext(AuthContext)

    const resetInputErros = () => {

        setErrosAll(null)

        onClose()
    }

    const createPlayer = async (createPlayerData: CreatePlayer) => {

        const { data: { token } } = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/player-sign-up`,
            data: createPlayerData
        })

        const dados = tokenVerify(token as string) as LoginType

        signIn({
            username: dados.username,
            password: dados.password
        })

        const { data: { token: tokenAuth } } = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/player-sign-in`,
            data: dados
        })

        const {
            username, email, avatar,
            score, _id, collectionSticker,
            gender, name
        } = tokenVerify(tokenAuth) as AuthenticatedPlayer

        const playerAuthen = {
            username,
            email,
            avatar,
            score,
            _id,
            collectionSticker,
            gender,
            name
        }

        setPlayerAuthenticated(playerAuthen)
    }

    const validationData = async (userData: UserCreateAccount) => {
        const erros = {
            errorUsername: '',
            errorGender: '',
            errorEmail: '',
            errorPassword: '',
            errorConfirmPassword: ''
        }

        !userData.username.trim() && (erros.errorUsername = "Você precisa de um nome de usuário.")
        !userData.email.trim() && (erros.errorEmail = "Você precisa pôr um email.")
        !userData.password.trim() && (erros.errorPassword = "Você precisa de uma senha.")
        !userData.confirmPassword.trim() && (erros.errorConfirmPassword = "Confirme sua senha.")

        userData.password !== userData.confirmPassword && (erros.errorConfirmPassword = "Senhas não coincidem.")

        const dataBody = {
            username: userData.username,
            email: userData.email
        }

        const response = await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/player-find`,
            data: dataBody
        })

        const { emailAlreadyExist, usernameAlreadyExist }: ValidationResponse = response.data

        usernameAlreadyExist && (erros.errorUsername = "Nome de usuário já em uso.")
        emailAlreadyExist && (erros.errorEmail = "Email já cadastrado.")

        if (!usernameAlreadyExist && !emailAlreadyExist) {
            createPlayer({
                username: userData.username,
                gender: userData.gender,
                email: userData.email,
                password: userData.password,
                confirmPassword: userData.confirmPassword
            })
            setIsLoading(true)
        }

        setErrosAll(erros)
        if (erros)
            setIsLoading(false)
    }

    const handleCreateAccount = () => {
        setIsLoading(true)

        const createUsername = (document.getElementById('create-username') as HTMLInputElement)
        const createGender = (document.getElementById('create-gender') as HTMLSelectElement)
        const createEmail = (document.getElementById('create-email') as HTMLInputElement)
        const createPassword = (document.getElementById('create-password') as HTMLInputElement)
        const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)

        const userModel = {
            username: createUsername.value,
            gender: createGender.value ? createGender.value : 'bottts',
            email: createEmail.value,
            password: createPassword.value,
            confirmPassword: confirmPassword.value
        }

        validationData(userModel)
    }

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>É bem simples</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Input
                        id="create-username"
                        type="text"
                        placeholder="Nome de usuário"
                        mt="3"
                        borderColor={errosAll?.errorUsername && "crimson"}
                    />
                    {errosAll?.errorUsername && <Text>{errosAll?.errorUsername}</Text>}
                    <Select id="create-gender" placeholder="Gênero" mt="3" borderColor={errosAll?.errorGender && "crimson"}>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="bottts">Outro</option>
                    </Select>
                    <Input
                        id="create-email"
                        type="text"
                        placeholder="E-mail"
                        mt="3"
                        borderColor={errosAll?.errorEmail && "crimson"}
                    />
                    {errosAll?.errorEmail && <Text>{errosAll?.errorEmail}</Text>}
                    <Input
                        id="create-password"
                        type="password"
                        placeholder="Senha"
                        mt="3"
                        borderColor={errosAll?.errorPassword && 'crimson'}
                    />
                    {errosAll?.errorPassword && <Text>{errosAll?.errorPassword}</Text>}
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirmar senha"
                        mt="3"
                        borderColor={errosAll?.errorConfirmPassword && 'crimson'}
                    />
                    {errosAll?.errorConfirmPassword && <Text>{errosAll?.errorConfirmPassword}</Text>}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCreateAccount} mr="3" isLoading={isLoading}>Criar conta</Button>
                    <Button onClick={resetInputErros}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export { CreateAccountModal }
