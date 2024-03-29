import { ObjectId } from 'mongodb'
import logger from '../utils/logger'
import { Brand, setupBrandCollection } from '../models/brand.model'
import { getProductsByBrand } from './product.repository'
import { setAsync, getAsync, delAsyncKey } from '../utils/redisClient'

export async function createBrand(brand: Brand): Promise<Brand | null> {
    try {
        const brandsCollection = await setupBrandCollection()
        const result = await brandsCollection.insertOne(brand)
        logger.info(`Brand created with ID: ${result.insertedId}`)
        await delAsyncKey('brand')
        return await brandsCollection.findOne({
            _id: result.insertedId,
        })
    } catch (error) {
        logger.error('Failed to create brand', error)
        throw error
    }
}

export async function getBrands(): Promise<Brand[]> {
    try {
        const cacheKey: string = 'brands'
        const cachedBrands = await getAsync(cacheKey)
        if (cachedBrands) {
            logger.info('Brands retrieved from cache')
            return JSON.parse(cachedBrands)
        }
        const brandsCollection = await setupBrandCollection()
        const brands = await brandsCollection.find().toArray()
        await setAsync(cacheKey, JSON.stringify(brands))
        return brands
    } catch (error) {
        logger.error('Failed to get brands', error)
        throw error
    }
}

export async function findBrand(query: any): Promise<Brand | null> {
    try {
        const cacheKey: string = `brand-${JSON.stringify(query)}`
        const cachedBrand = await getAsync(cacheKey)
        if (cachedBrand) {
            logger.info('Brand retrieved from cache')
            return JSON.parse(cachedBrand)
        }
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        const brandsCollection = await setupBrandCollection()
        const brand = await brandsCollection.findOne(query)
        await setAsync(cacheKey, JSON.stringify(brand))
        return brand
    } catch (error) {
        logger.error(`Failed to find brand`, error)
        throw error
    }
}

export async function updateBrand(
    query: any,
    update: any
): Promise<Brand | null> {
    try {
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        if (!update.$set) {
            update = { $set: update }
        }
        const brandsCollection = await setupBrandCollection()
        await brandsCollection.updateOne(query, update)
        logger.info(`Brand updated with ID: ${query._id}`)
        await delAsyncKey('brand')
        return await brandsCollection.findOne(query)
    } catch (error) {
        logger.error(`Failed to update brand`, error)
        throw error
    }
}

export async function deleteBrand(brandId: string): Promise<boolean> {
    try {
        const brandsCollection = await setupBrandCollection()
        const products = await getProductsByBrand(brandId)
        if (products.length > 0) {
            throw new Error('Brand has products, cannot delete')
        }
        await brandsCollection.deleteOne({ _id: new ObjectId(brandId) })
        await delAsyncKey('brand')
        return true
    } catch (error) {
        logger.error(`Failed to delete brand`, error)
        throw error
    }
}
