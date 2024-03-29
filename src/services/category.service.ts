import {
    createCategory,
    getCategories,
    findCategory,
    updateCategory,
    deleteCategory,
} from '../repositories/category.repository'

import { Category } from '../models/category.model'
import logger from '../utils/logger'

export async function createCategoryService(
    category: Category
): Promise<Category | null> {
    try {
        // validate category exist in db
        const existingCategory = await findCategory({ name: category.name })
        if (existingCategory) {
            throw new Error('Category already exists')
        }
        category.createdAt = new Date()
        category.updatedAt = new Date()
        return await createCategory(category)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getCategoriesService(): Promise<Category[]> {
    try {
        const categories = await getCategories()
        return categories
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findCategoryService(
    query: object
): Promise<Category | null> {
    try {
        return await findCategory(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function updateCategoryService(
    query: object,
    update: object
): Promise<Category | null> {
    try {
        return await updateCategory(query, update)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function deleteCategoryService(
    categoryId: string
): Promise<boolean> {
    try {
        return await deleteCategory(categoryId)
    } catch (e: any) {
        throw new Error(e.message)
    }
}
