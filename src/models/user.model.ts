import { Collection, ObjectId } from 'mongodb'
import connect from '../utils/connect'
import logger from '../utils/logger'
import config from 'config'

export interface User {
    _id?: ObjectId
    name: string
    email: string
    password: string
    createdAt?: Date
    updatedAt?: Date
    active: boolean
}

export async function setupCollection(): Promise<Collection<User>> {
    let usersCollection: Collection<User>
    try {
        const db = await connect()
        const collections = await db.listCollections().toArray()
        const collectionExists = collections.some((col) => col.name === 'users')
        if (!collectionExists) {
            await db.createCollection('users')
            logger.info('Collection created')
        }
        usersCollection = db.collection<User>('users')
        return usersCollection
    } catch (error) {
        logger.error('Failed to setup collection', error)
        throw error
    }
}
