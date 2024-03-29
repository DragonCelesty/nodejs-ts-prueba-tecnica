import { Collection, ObjectId } from 'mongodb'
import connect from '../utils/connect'
import logger from '../utils/logger'


export interface Brand {
    _id?: ObjectId
    name: string
    description: string
    createdAt?: Date
    updatedAt?: Date
    user: string // User ID
}

export async function setupBrandCollection(): Promise<Collection<Brand>> {
    let BrandCollection: Collection<Brand>
    try {
        const db = await connect()
        const collections = await db.listCollections().toArray()
        const collectionExists = collections.some(
            (col) => col.name === 'brands'
        )
        if (!collectionExists) {
            await db.createCollection('brands')
            logger.info('Collection created')
        }
        BrandCollection = db.collection<Brand>('brands')
        return BrandCollection
    } catch (error) {
        logger.error('Failed to setup collection', error)
        throw error
    }
}