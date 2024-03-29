import { Collection, ObjectId } from 'mongodb'
import connect from '../utils/connect'
import logger from '../utils/logger'

export interface Product {
    _id?: ObjectId
    user: string // User ID
    name: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand?: ObjectId
    category?: ObjectId
    images?: string[]
    image: string
    createdAt?: Date
    updatedAt?: Date
}

export async function setupProductCollection(): Promise<Collection<Product>> {
    let ProductsCollection: Collection<Product>
    try {
        const db = await connect()
        const collections = await db.listCollections().toArray()
        const collectionExists = collections.some(
            (col) => col.name === 'products'
        )
        if (!collectionExists) {
            await db.createCollection('products')
            logger.info('Collection created')
        }
        ProductsCollection = db.collection<Product>('products')
        return ProductsCollection
    } catch (error) {
        logger.error('Failed to setup collection', error)
        throw error
    }
}
