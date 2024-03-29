import e, { Request, Response } from 'express'
import logger from '../utils/logger'
import {
    createManyProductsService,
    createProductService,
    deleteProductService,
    findProductService,
    getProductsService,
    updateProductService,
} from '../services/product.service'
import {
    CreateProductInput,
    GetProductInput,
    GetProductsInput,
    UpdateProductInput,
    parseSortBy,
} from '../schemas/product.schema'

export async function createProductHandler(
    req: Request<{}, {}, CreateProductInput['body']>,
    res: Response
) {
    try {
        const user = res.locals.user
        const {
            name,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            images,
            image,
        } = req.body
        const product = await createProductService(
            {
                user: user._id,
                name,
                description,
                price,
                discountPercentage,
                rating,
                stock,
                image,
                images,
            },
            brand,
            category
        )

        return res.send(product)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getProductHandler(req: Request, res: Response) {
    try {
        const { productId } = req.params
        const product = await findProductService({ _id: productId })
        if (!product) {
            throw new Error('Product not found')
        }
        return res.send(product)
    } catch (e: any) {
        logger.error(e)
        res.status(404).send(e.message)
    }
}

export async function getProductsHandler(
    req: Request<{}, {}, GetProductsInput['query']>,
    res: Response
) {
    try {
        const { page, limit, keyword, brand, category, sortBy } = req.query
        const products = await getProductsService(
            page,
            limit,
            keyword,
            brand,
            category,
            parseSortBy(sortBy)
        )
        return res.send(products)
    } catch (e: any) {
        logger.error(e)
        res.status(404).send(e.message)
    }
}

export async function updateProductHandler(
    req: Request<{}, {}, UpdateProductInput['body']>,
    res: Response
) {
    try {
        const product = await updateProductService(
            { _id: req.params.productId },
            req.body
        )
        if (!product) {
            throw new Error('Product not found')
        }
        return res.send(product)
    } catch (e: any) {
        logger.error(e)
        res.status(404).send(e.message)
    }
}

export async function deleteProductHandler(req: Request, res: Response) {
    try {
        const { productId } = req.params
        const product = await findProductService({ _id: productId })
        if (!product) {
            throw new Error('Product not found')
        }
        await deleteProductService({ _id: productId })
        return res.send('Product deleted')
    } catch (e: any) {
        logger.error(e)
        res.status(404).send(e.message)
    }
}

export async function createManyProductsHandler(
    req: Request<{}, {}, Array<CreateProductInput['body']>>,
    res: Response
) {
    try {
        const user = res.locals.user
        const createdProducts = await createManyProductsService(req.body, user._id)
        return res.send(createdProducts)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}
