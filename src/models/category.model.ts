import { Collection, ObjectId } from 'mongodb'
import connect from '../utils/connect'
import logger from '../utils/logger'

export interface Category {
    _id?: ObjectId
    name: string
    description: string
    createdAt?: Date
    updatedAt?: Date
    user: string // User ID
}

export async function setupCategoryCollection(): Promise<Collection<Category>> {
    let CategoryCollection: Collection<Category>
    try {
        const db = await connect()
        const collections = await db.listCollections().toArray()
        const collectionExists = collections.some(
            (col) => col.name === 'categories'
        )
        if (!collectionExists) {
            await db.createCollection('categories')
            logger.info('Collection created')
        }
        CategoryCollection = db.collection<Category>('categories')
        return CategoryCollection
    } catch (error) {
        logger.error('Failed to setup collection', error)
        throw error
    }
}
