import { get } from 'lodash'
import config from 'config'
import {
    createSession,
    getUserSessions,
    findSessions,
    updateSession,
    findSession,
} from '../repositories/session.repository'
import { signJWT, verifyJWT } from '../utils/jwt.utils'
import { findUser } from './user.service'
import { Session } from '../models/session.model'
export async function createSessionService(
    userId: string,
    userAgent: string
): Promise<Session | null> {
    try {
        const session = await createSession({
            user: userId,
            valid: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            userAgent,
        })
        return session
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getUserSessionsService(
    userId: string
): Promise<Session[]> {
    try {
        const sessions = await getUserSessions(userId)
        return sessions
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findSessionsService(query: object): Promise<Session[]> {
    try {
        return await findSessions(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findSessionByIdService(
    id: string
): Promise<Session | null> {
    try {
        return await findSession({ _id: id })
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function updateSessionService(
    query: object,
    update: object
): Promise<Session | null> {
    try {
        // Update the session in the database
        return await updateSession(query, update)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string
}): Promise<string | false> {
    try {
        const { decoded } = verifyJWT(refreshToken)
        if (!decoded || !get(decoded, 'session')) return false
        const sessions = await findSessions({ _id: get(decoded, 'session') })
        const session = sessions[0]
        if (!session || !session.valid) return false
        const user = await findUser({ _id: session.user })
        if (!user) return false
        const accessToken = signJWT(
            { ...user, session: session._id },
            { expiresIn: config.get('accessTokenTtl') }
        )
        return accessToken
    } catch (e: any) {
        throw new Error(e.message)
    }
}
