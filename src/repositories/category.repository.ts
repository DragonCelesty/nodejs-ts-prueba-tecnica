import { ObjectId } from 'mongodb'
import logger from '../utils/logger'
import { Category, setupCategoryCollection } from '../models/category.model'
import { getProductsByCategory } from './product.repository'
import { setAsync, getAsync, delAsyncKey } from '../utils/redisClient'

export async function createCategory(
    category: Category
): Promise<Category | null> {
    try {
        const categoriesCollection = await setupCategoryCollection()
        const result = await categoriesCollection.insertOne(category)
        logger.info(`Category created with ID: ${result.insertedId}`)
        await delAsyncKey('categories')
        await delAsyncKey('category')
        return await categoriesCollection.findOne({
            _id: result.insertedId,
        })
    } catch (error) {
        logger.error('Failed to create category', error)
        throw error
    }
}

export async function getCategories(): Promise<Category[]> {
    try {
        const cacheKey: string = 'categories'
        const cachedCategories = await getAsync(cacheKey)
        if (cachedCategories) {
            logger.info('Categories retrieved from cache')
            return JSON.parse(cachedCategories)
        }
        const categoriesCollection = await setupCategoryCollection()
        const categories = await categoriesCollection.find().toArray()
        await setAsync(cacheKey, JSON.stringify(categories))
        return categories
    } catch (error) {
        logger.error('Failed to get categories', error)
        throw error
    }
}

export async function findCategory(query: any): Promise<Category | null> {
    try {
        const cacheKey: string = `category-${JSON.stringify(query)}`
        const cachedCategory = await getAsync(cacheKey)
        if (cachedCategory) {
            logger.info('Category retrieved from cache')
            return JSON.parse(cachedCategory)
        }
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        const categoriesCollection = await setupCategoryCollection()
        const category = await categoriesCollection.findOne(query)
        await setAsync(cacheKey, JSON.stringify(category))
        return category
    } catch (error) {
        logger.error(`Failed to find category`, error)
        throw error
    }
}

export async function updateCategory(
    query: any,
    update: any
): Promise<Category | null> {
    try {
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        if (!update.$set) {
            update = { $set: update }
        }

        const categoriesCollection = await setupCategoryCollection()
        await categoriesCollection.updateOne(query, update)
        logger.info(`Category updated with ID: ${query._id}`)
        await delAsyncKey('categories')
        await delAsyncKey('category')
        return await categoriesCollection.findOne(query)
    } catch (error) {
        logger.error(`Failed to update category`, error)
        throw error
    }
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
    try {
        const categoriesCollection = await setupCategoryCollection()
        const products = await getProductsByCategory(categoryId)
        if (products.length > 0) {
            throw new Error('Category has products. Cannot delete')
        }
        await categoriesCollection.deleteOne({
            _id: new ObjectId(categoryId),
        })
        logger.info(`Category deleted with ID: ${categoryId}`)
        await delAsyncKey('categories')
        await delAsyncKey('category')
        return true
    } catch (error) {
        logger.error(`Failed to delete category`, error)
        throw error
    }
}
