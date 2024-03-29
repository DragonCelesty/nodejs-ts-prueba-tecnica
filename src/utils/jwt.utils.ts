import jwt from 'jsonwebtoken'
import config from 'config'

const bitSecret = config.get<string>('bitSecret')
export function signJWT(object: Object, options?: jwt.SignOptions | undefined) {
    return jwt.sign(object, bitSecret)
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, bitSecret)
        return {
            valid: true,
            expired: false,
            decoded: decoded,
        }
    } catch (e: any) {
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null,
        }
    }
}
