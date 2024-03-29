import { Request, Response } from 'express'
import logger from '../utils/logger'

import {
    createBrandService,
    getBrandsService,
    findBrandService,
    updateBrandService,
    deleteBrandService,
} from '../services/brand.service'

export async function createBrandHandler(req: Request, res: Response) {
    try {
        const user = res.locals.user._id
        const brand = await createBrandService(req.body, user)
        return res.send(brand)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getBrandsHandler(req: Request, res: Response) {
    try {
        const brands = await getBrandsService()
        return res.send(brands)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function getBrandHandler(req: Request, res: Response) {
    try {
        const brand = await findBrandService({ _id: req.params.id })
        return res.send(brand)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function updateBrandHandler(req: Request, res: Response) {
    try {
        const brand = await updateBrandService({ _id: req.params.id }, req.body)
        return res.send(brand)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function deleteBrandHandler(req: Request, res: Response) {
    try {
        await deleteBrandService({ _id: req.params.id })
        return res.send('Brand deleted')
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

export async function createManyBrandsHandler(req: Request, res: Response) {
    try {
        const user = res.locals.user._id
        const existingBrand = await getBrandsService()
        const brands = await Promise.all(
            req.body.map((brand: any) => {
                if (existingBrand.find((b: any) => b.name === brand.name)) {
                    return Promise.resolve(null)
                }
                return createBrandService(brand, user)
            })
        )
        return res.send(brands)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}
