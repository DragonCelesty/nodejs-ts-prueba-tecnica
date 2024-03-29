import { ObjectId } from 'mongodb'
import logger from '../utils/logger'
import { Product, setupProductCollection } from '../models/product.model'
import { getCategories } from './category.repository'
import { getBrands } from './brand.repository'
import { setAsync, getAsync, delAsyncKey } from '../utils/redisClient'

export async function createProduct(product: Product): Promise<Product | null> {
    try {
        const productsCollection = await setupProductCollection()
        const result = await productsCollection.insertOne(product)
        logger.info(`Product created with ID: ${result.insertedId}`)
        return await productsCollection.findOne({
            _id: result.insertedId,
        })
    } catch (error) {
        logger.error('Failed to create product', error)
        throw error
    }
}

export async function getProducts(
    page: number = 1,
    skip: number = 10,
    query: any,
    sort: any
): Promise<Product[]> {
    try {
        const cacheKey: string = `products-${JSON.stringify(
            query
        )}-${JSON.stringify(sort)}-${page}-${skip}`
        const cachedProducts = await getAsync(cacheKey)
        if (cachedProducts) {
            logger.info('Products retrieved from cache')
            return JSON.parse(cachedProducts)
        }
        const productsCollection = await setupProductCollection()
        // Obtener los productos
        const productsCursor = await productsCollection
            .find(query)
            .sort({ ...sort })
            .skip((page - 1) * skip)
            .limit(skip)

        // Convertir el cursor a un array de productos
        const products = await productsCursor.toArray()

        const categories = await getCategories()
        const brands = await getBrands()

        // Combinar las categorías y marcas con los productos
        const productsWithCategoriesAndBrands = products.map((product) => {
            return {
                ...product,
                category: categories.find(
                    (cat) => cat._id.toString() === product.category.toString()
                ),
                brand: brands.find(
                    (br) => br._id.toString() === product.brand.toString()
                ),
            }
        })

        // Devolver los productos con las categorías y marcas
        await setAsync(
            cacheKey,
            JSON.stringify(productsWithCategoriesAndBrands)
        )
        return productsWithCategoriesAndBrands
    } catch (error) {
        logger.error('Failed to get products', error)
        throw error
    }
}

export async function findProduct(query: any): Promise<Product | null> {
    try {
        const cacheKey: string = `product-${JSON.stringify(query)}`
        const cachedProduct = await getAsync(cacheKey)
        if (cachedProduct) {
            logger.info('Product retrieved from cache')
            return JSON.parse(cachedProduct)
        }
        const productsCollection = await setupProductCollection()
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        const product = await productsCollection.findOne(query)
        await setAsync(cacheKey, JSON.stringify(product))
        return product
    } catch (error) {
        logger.error(`Failed to find product`, error)
        throw error
    }
}

export async function updateProduct(
    query: any,
    update: any
): Promise<Product | null> {
    try {
        const productsCollection = await setupProductCollection()
        if (query._id && typeof query._id === 'string') {
            query._id = new ObjectId(query._id)
        }
        if (!update.$set) {
            update = { $set: update }
        }
        await productsCollection.updateOne(query, update)
        await delAsyncKey('product')
        return await productsCollection.findOne(query)
    } catch (error) {
        logger.error(`Failed to update product`, error)
        throw error
    }
}

export async function deleteProduct(query: any): Promise<boolean> {
    try {
        const productsCollection = await setupProductCollection()
        await productsCollection.deleteOne(query)
        await delAsyncKey('product')
        return true
    } catch (error) {
        logger.error(`Failed to delete product`, error)
        throw error
    }
}

export async function getProductsByCategory(
    categoryId: string
): Promise<Product[]> {
    try {
        const cacheKey: string = `products-category-${categoryId}`
        const cachedProducts = await getAsync(cacheKey)
        if (cachedProducts) {
            logger.info('Products retrieved from cache')
            return JSON.parse(cachedProducts)
        }
        const productsCollection = await setupProductCollection()
        const products = await productsCollection
            .find({ category: new ObjectId(categoryId) })
            .toArray()
        await setAsync(cacheKey, JSON.stringify(products))
        return products
    } catch (error) {
        logger.error(`Failed to get products by category`, error)
        throw error
    }
}

export async function getProductsByBrand(brandId: string): Promise<Product[]> {
    try {
        const cacheKey: string = `products-brand-${brandId}`
        const cachedProducts = await getAsync(cacheKey)
        const productsCollection = await setupProductCollection()
        const products = await productsCollection
            .find({ brand: new ObjectId(brandId) })
            .toArray()
        await setAsync(cacheKey, JSON.stringify(products))
        return products
    } catch (error) {
        logger.error(`Failed to get products by brand`, error)
        throw error
    }
}

export async function createManyProducts(products: Product[]): Promise<string> {
    try {
        const productsCollection = await setupProductCollection()
        const result = await productsCollection.insertMany(products)
        logger.info(`Products created with IDs: ${result.insertedIds}`)
        await delAsyncKey('product')
        return 'Products created successfully'
    } catch (error) {
        logger.error(`Failed to create many products`, error)
        throw error
    }
}
