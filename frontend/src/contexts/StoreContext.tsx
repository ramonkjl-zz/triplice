import {
    createContext, Dispatch, ReactNode,
    SetStateAction, useEffect, useState
} from "react";

import { Sticker, Stickers } from "../@types";

type Props = {
    children: ReactNode
}

type StoreContextType = {
    shoppingBag: Stickers
    setShoppingBag: Dispatch<SetStateAction<Stickers>>
    removeSticker: (sticker: Sticker) => void
    setAmount: Dispatch<SetStateAction<number>>
    amount: number
}

const StoreContext = createContext({} as StoreContextType)

const StoreContextProvider = ({ children }: Props) => {
    const [shoppingBag, setShoppingBag] = useState<Stickers>([])
    const [count, setCount] = useState(0)
    const [amount, setAmount] = useState(0)

    const removeSticker = (sticker: Sticker) => {
        shoppingBag.forEach((stickerEl, index) => {
            if (stickerEl._id === sticker._id) {
                shoppingBag.splice(index, 1)
            }
        })

        setCount(shoppingBag.length)
    }

    useEffect(() => {
        setShoppingBag(shoppingBag)
    }, [count])

    return (
        <StoreContext.Provider value={{
            shoppingBag,
            setShoppingBag,
            removeSticker,
            amount,
            setAmount
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export { StoreContextProvider, StoreContext }