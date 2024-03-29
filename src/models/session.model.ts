import { Collection, ObjectId } from 'mongodb'
import connect from '../utils/connect'
import logger from '../utils/logger'

export interface Session {
    _id?: ObjectId
    user: string // User ID
    valid: boolean
    createdAt: Date
    updatedAt: Date
    userAgent: string
}

export async function setupSessionCollection(): Promise<Collection<Session>> {
    let sessionsCollection: Collection<Session>
    try {
        const db = await connect()
        const collections = await db.listCollections().toArray()
        const collectionExists = collections.some(
            (col) => col.name === 'sessions'
        )
        if (!collectionExists) {
            await db.createCollection('sessions')
            logger.info('Collection created')
        }
        sessionsCollection = db.collection<Session>('sessions')
        return sessionsCollection
    } catch (error) {
        logger.error('Failed to setup collection', error)
        throw error
    }
}
