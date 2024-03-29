import { Request, Response } from 'express'
import logger from '../utils/logger'
import {
    createSessionService,
    findSessionsService,
    updateSessionService,
} from '../services/session.service'
import { validatePassword } from '../services/user.service'
import config from 'config'
import { signJWT } from '../utils/jwt.utils'
export async function createSessionHandler(req: Request, res: Response) {
    try {
        // Validate the user's password
        const user = await validatePassword(req.body)
        if (!user) {
            return res.status(401).send('Invalid username or password')
        }

        // Create a new session
        const session = await createSessionService(
            user._id?.toString() || '',
            req.get('user-agent') || ''
        )

        if (!session) {
            return res.status(401).send('Invalid username or password')
        }

        // create an access token
        const accessToken = signJWT(
            { ...user, session: session._id },
            { expiresIn: config.get<string>('accessTokenTtl') } // 15m
        )
        // create a refresh token

        const refreshToken = signJWT(
            { ...user, session: session._id },
            { expiresIn: config.get<string>('refreshTokenTtl') } // 1y
        )

        // return the access token and refresh token
        return res.send({ accessToken, refreshToken })
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id

        const sessions = await findSessionsService({
            user: userId,
            valid: true,
        })
        return res.send(sessions)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function deleteSessionHandler(req: Request, res: Response) {
    try {
        // Delete the session from the database
        const sessionId = res.locals.user.session

        await updateSessionService(
            { _id: sessionId },
            {
                valid: false,
            }
        )

        return res.send({
            accessToken: null,
            refreshToken: null,
        })
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}
