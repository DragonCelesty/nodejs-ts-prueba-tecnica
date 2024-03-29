import { Request, Response, NextFunction } from 'express'
import { get } from 'lodash'
import { verifyJWT } from '../utils/jwt.utils'
import { reIssueAccessToken } from '../services/session.service'
const deserializeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const accessToken = get(req, 'headers.authorization', '').replace(
        /^Bearer\s/,
        ''
    )
    const refreshToken = get(req, 'headers.x-refresh')
    if (!accessToken) {
        return next()
    }

    const { decoded, expired } = verifyJWT(accessToken)

    if (decoded) {
        res.locals.user = decoded
        return next()
    }
    if (expired && refreshToken) {
        if(typeof refreshToken !== 'string') {
            return next()
        }
        const newAccessToken = await reIssueAccessToken({ refreshToken })
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken)
            const { decoded } = verifyJWT(newAccessToken)
            res.locals.user = decoded
            return next()
        }
    }
    next()
}

export default deserializeUser
