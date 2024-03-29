import e from 'express'
import { Brand } from '../models/brand.model'
import {
    createBrand,
    findBrand,
    getBrands,
    updateBrand,
} from '../repositories/brand.repository'
import logger from '../utils/logger'

export async function createBrandService(
    brand: Brand,
    user: string
): Promise<Brand | null> {
    try {
        const existingBrand = await findBrand({ name: brand.name.toUpperCase() })
        if (existingBrand) {
            throw new Error('Brand already exists')
        }
        brand.name = brand.name.toUpperCase()
        brand.createdAt = new Date()
        brand.updatedAt = new Date()
        return await createBrand(brand)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getBrandsService(): Promise<Brand[]> {
    try {
        const brands = await getBrands()
        return brands
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findBrandService(query: object): Promise<Brand | null> {
    try {
        return await findBrand(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function updateBrandService(
    query: object,
    update: object
): Promise<Brand | null> {
    try {
        return await updateBrand(query, update)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deleteBrandService(query: object): Promise<boolean> {
    try {
        const brand = await findBrand(query)
        if (!brand) {
            throw new Error('Brand not found')
        }
        await updateBrand(query, { deleted: true })
        return true
    } catch (e: any) {
        throw new Error(e.message)
    }
}
