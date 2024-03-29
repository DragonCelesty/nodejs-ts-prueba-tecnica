import logger from '../utils/logger'

import {
    createProduct,
    findProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByBrand,
    createManyProducts,
} from '../repositories/product.repository'

import { Product } from '../models/product.model'
import {
    findCategory,
    getCategories,
} from '../repositories/category.repository'
import { findBrand, getBrands } from '../repositories/brand.repository'

export async function createProductService(
    product: Product,
    brandName: string,
    categoryName: string
): Promise<Product | null> {
    try {
        const category = await findCategory({ name: categoryName })
        if (!category) {
            throw new Error('Category not found')
        }
        const brand = await findBrand({ name: brandName.toUpperCase() })
        if (!brand) {
            throw new Error('Brand not found')
        }
        logger.info(`Product: ${product}`)
        return await createProduct({
            ...product,
            category: category._id,
            brand: brand._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getProductsService(
    page: string | undefined,
    limit: string | undefined,
    keyword: string | undefined,
    brand: string | undefined,
    category: string | undefined,
    sort: any
): Promise<Product[]> {
    try {
        let query: any = {}
        let pageNumber: number = 1
        let skip: number = 10
        if (keyword) {
            query['$or'] = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        }
        if (brand) {
            const brandId = await findBrand({ name: brand.toUpperCase() })
            if (!brandId) {
                throw new Error('Brand not found')
            }
            query['brand'] = brandId._id
        }
        if (category) {
            const categoryId = await findCategory({
                name: category.toLowerCase(),
            })
            if (!categoryId) {
                throw new Error('Category not found')
            }
            query['category'] = categoryId._id
        }
        if (typeof page === 'string') pageNumber = parseInt(page)
        if (typeof limit === 'string') skip = parseInt(limit)

        // en sort cambiar asc por 1 y desc por -1
        if (sort) {
            const sortFields = Object.keys(sort)
            const sortObj: { [key: string]: number } = {}
            sortFields.forEach((field) => {
                sortObj[field] = sort[field] === 'desc' ? -1 : 1
            })
            sort = sortObj
        } else {
            sort = { createdAt: 1 }
        }

        const products = await getProducts(pageNumber, skip, query, sort)
        return products
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findProductService(
    query: object
): Promise<Product | null> {
    try {
        return await findProduct(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function updateProductService(
    query: object,
    update: object
): Promise<Product | null> {
    try {
        return await updateProduct(query, update)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deleteProductService(query: object): Promise<boolean> {
    try {
        const product = await findProduct(query)
        if (!product) {
            throw new Error('Product not found')
        }
        return await deleteProduct(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findProductByCategoryService(
    categoryId: string
): Promise<Product[]> {
    try {
        return await getProductsByCategory(categoryId)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findProductByBrandService(
    brandId: string
): Promise<Product[]> {
    try {
        return await getProductsByBrand(brandId)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function createManyProductsService(
    products: Product[],
    userId: string
): Promise<string> {
    try {
        const categories = await getCategories()
        const brands = await getBrands()
        let count: number = 0
        let total: number = products.length
        const productsToAdd: Product[] = []
        products.map((product) => {
            count++
            const { category, brand, ...rest } = product

            const categoryDB = categories.find(
                (ct) =>
                    ct.name.toLowerCase() === category?.toString().toLowerCase()
            )
            if (!categoryDB) {
                throw new Error(`Category ${category} not found`)
            }
            const brandDB = brands.find(
                (br) =>
                    br.name.toUpperCase() === brand?.toString().toUpperCase()
            )
            if (!brandDB) {
                throw new Error(`Brand ${brand} not found`)
            }
            logger.debug(`${count} of ${total} products processed ${rest.name}`)
            productsToAdd.push({
                ...rest,
                category: categoryDB._id,
                brand: brandDB._id,
                user: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        })
        return await createManyProducts(productsToAdd)
    } catch (e: any) {
        throw new Error(e.message)
    }
}
