import jwt from 'jsonwebtoken'

const tokenVerify = (token: string) => {
    return jwt.verify(token, process.env.NEXT_PUBLIC_SECRET as string)
}

export { tokenVerify }