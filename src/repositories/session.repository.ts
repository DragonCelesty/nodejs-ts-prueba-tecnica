import { ObjectId } from 'mongodb'
import { Session, setupSessionCollection } from '../models/session.model'
import logger from '../utils/logger'

export async function createSession(session: Session): Promise<Session | null> {
    try {
        const sessionsCollection = await setupSessionCollection()
        const result = await sessionsCollection.insertOne(session)
        logger.info(`Session created with ID: ${result.insertedId}`)
        return await sessionsCollection.findOne({
            _id: result.insertedId,
        })
    } catch (error) {
        logger.error('Failed to create session', error)
        throw error
    }
}

export async function getUserSessions(userId: string): Promise<Session[]> {
    try {
        const sessionsCollection = await setupSessionCollection()
        const sessions = await sessionsCollection
            .find({
                user: userId,
            })
            .toArray()
        return sessions
    } catch (error) {
        logger.error(`Failed to get sessions for user ${userId}`, error)
        throw error
    }
}

export async function findSessions(query: any): Promise<Session[]> {
    try {
        const sessionsCollection = await setupSessionCollection()
        const sessions = await sessionsCollection.find(query).toArray()
        return sessions
    } catch (error) {
        logger.error(`Failed to find sessions`, error)
        throw error
    }
}

export async function findSession(query: any): Promise<Session | null> {
    try {
        const sessionsCollection = await setupSessionCollection()
        const session = await sessionsCollection.findOne(query)
        return session
    } catch (error) {
        logger.error(`Failed to find session`, error)
        throw error
    }
}

export async function updateSession(
    query: any,
    update: any
): Promise<Session | null> {
    try {
        if (!query) {
            throw new Error('Query is required')
        }
        if(query._id) {
            if(typeof query._id === 'string') {
                query._id = new ObjectId(query._id)
            }
        }
        if (!update) {
            throw new Error('Update is required')
        }
        if (!update.$set) {
            update = { $set: update }
        }
        if (!update.$set.updatedAt) {
            update.$set.updatedAt = new Date()
        }
        const sessionsCollection = await setupSessionCollection()
        const result = await sessionsCollection.updateOne(query, update)
        if (result.matchedCount === 0) {
            throw new Error('No session found to update')
        }
        logger.info(`Session updated with ID: ${query._id}`)
        return await sessionsCollection.findOne(query)
    } catch (error) {
        logger.error(`Failed to update session ${query}`, error)
        throw error
    }
}
