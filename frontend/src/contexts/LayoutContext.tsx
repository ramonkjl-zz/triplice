import {
    useEffect, useState, createContext,
    ReactNode
} from "react";

type Props = {
    children: ReactNode
}

type LayoutContextType = {
    isMobile: boolean
}

const LayoutContext = createContext({} as LayoutContextType)

const LayoutProvider = ({ children }: Props) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        showScreenLength()
    }, [])

    const showScreenLength = () => {
        if (screen.width < 640 || screen.height < 480) {
            setIsMobile(true)
        } else if (screen.width < 1024 || screen.height < 768) {
            //tablet
        } else {
            //Normal
            setIsMobile(false)
        }
    }

    return (
        <LayoutContext.Provider value={{ isMobile }}>
            {children}
        </LayoutContext.Provider>
    )
}

export { LayoutProvider, LayoutContext }