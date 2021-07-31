import {
    Dispatch, ReactNode, SetStateAction,
    useState, createContext
} from "react";

type Props = {
    children: ReactNode
}
type ModalContextType = {
    setOpenModalGameFriendly: Dispatch<SetStateAction<boolean>>
    openModalGameFriendly: boolean

}

const ModalContext = createContext({} as ModalContextType)

function ModalContextProvider({ children }: Props) {
    const [openModalGameFriendly, setOpenModalGameFriendly] = useState(false)

    return (
        <ModalContext.Provider value={{
            openModalGameFriendly,
            setOpenModalGameFriendly
        }}>
            {children}
        </ModalContext.Provider>
    )
}

export { ModalContextProvider, ModalContext }