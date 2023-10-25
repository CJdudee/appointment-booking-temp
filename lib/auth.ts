import { jwtVerify } from "jose"

interface UserJwtPayload {
    jti: string,
    iat: number
}

export function getJwtSecretKey() : string {
    const secret = process.env.JWT_SECRET_KEY

    if(!secret || secret.length == 0 ) {
        throw new Error('jwt secret key is not definded')
    }

    return secret
}


export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        //it was signed when a key when the token was made so now we have to check if we can find the key we signed it with 

        return verified.payload as UserJwtPayload

    } catch (error) {
        throw new Error('your token is invalid')
    }
}