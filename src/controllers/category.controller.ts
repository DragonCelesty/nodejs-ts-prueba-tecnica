import { Request, Response } from 'express'
import logger from '../utils/logger'

import {
    createCategoryService,
    getCategoriesService,
    findCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from '../services/category.service'
import {
    CreateCategoryInput,
    UpdateCategoryInput,
} from '../schemas/category.schema'

export async function createCategoryHandler(
    req: Request<{}, {}, CreateCategoryInput['body']>,
    res: Response
) {
    try {
        const user = res.locals.user._id
        const category = await createCategoryService({
            ...req.body,
            user: user,
        })
        return res.send(category)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getCategoriesHandler(req: Request, res: Response) {
    try {
        const categories = await getCategoriesService()
        return res.send(categories)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getCategoryHandler(req: Request, res: Response) {
    try {
        const category = await findCategoryService({ _id: req.params.id })
        return res.send(category)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function updateCategoryHandler(req: Request, res: Response) {
    try {
        const category = await updateCategoryService(
            { _id: req.params.id },
            req.body
        )
        return res.send(category)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function deleteCategoryHandler(req: Request, res: Response) {
    try {
        const result = await deleteCategoryService(req.params.id)
        return res.send(result)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function createManyCategoriesHandler(
    req: Request<{}, {}, Array<CreateCategoryInput['body']>>,
    res: Response
) {
    try {
        const user = res.locals.user._id
        const existingCategories = await getCategoriesService()
        const categories = await Promise.all(
            req.body.map((category) => {
                const existingCategory = existingCategories.find(
                    (c) => c.name === category.name
                )
                if (existingCategory) {
                    return existingCategory
                }
                return createCategoryService({ ...category, user: user })
            })
        )
        return res.send(categories)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}
