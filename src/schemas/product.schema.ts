import { TypeOf, array, number, object, string } from 'zod'

export const createProductSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required',
        }),
        description: string({
            required_error: 'Description is required',
        }),
        price: number({
            required_error: 'Price is required',
        }),
        discountPercentage: number({
            required_error: 'Discount percentage is required',
        }),
        rating: number({
            required_error: 'Rating is required',
        }),
        stock: number({
            required_error: 'Stock is required',
        }),
        brand: string({
            required_error: 'Brand is required',
        }),
        category: string({
            required_error: 'Category is required',
        }),
        images: array(string({})).optional(),
        image: string({
            required_error: 'Image is required',
        }),
    }),
})

export type CreateProductInput = TypeOf<typeof createProductSchema>

const payload ={
    body: object({
        name: string().optional(),
        description: string().optional(),
        price: number().optional(),
        discountPercentage: number().optional(),
        rating: number().optional(),
        stock: number().optional(),
        brand: string().optional(),
        category: string().optional(),
        images: array(string({})).optional(),
        image: string().optional(),
    })
}

const params = {
    params: object({
        productId: string({
            required_error: 'productId is required',
        }),
    }),
}

export const updateProductSchema = object({
    ...payload,
    ...params
})

export type UpdateProductInput = TypeOf<typeof updateProductSchema>

export const deleteProductSchema = object({
    params: object({
        productId: string({
            required_error: 'Product ID is required',
        }),
    }),
})

export type DeleteProductInput = TypeOf<typeof deleteProductSchema>

export const getProductSchema = object({
    params: object({
        productId: string({
            required_error: 'Product ID is required',
        }),
    }),
})

export type GetProductInput = TypeOf<typeof getProductSchema>

export const getProductsSchema = object({
    query: object({
        page: string().optional(),
        limit: string().optional(),
        keyword: string().optional(),
        sortBy: string().optional(),
        brand: string().optional(),
        category: string().optional(),
    }),
})

export type GetProductsInput = TypeOf<typeof getProductsSchema>

// Función para parsear y validar el campo sortBy
export function parseSortBy(sortBy: string | undefined) {
    if (!sortBy) return {
        createdAt: 'asc'
    }

    const sortFields = sortBy.split(',').map((field) => field.trim())

    const sort: { [key: string]: string } = {}
    sortFields.forEach((field) => {
        const parts = field.split(':').map((part) => part.trim())
        const fieldName = parts[0]
        const order =
            parts[1] && (parts[1].toLowerCase() === 'desc' ? 'desc' : 'asc')
        sort[fieldName] = order || 'asc' // Si no se especifica, el orden por defecto es ascendente
    })
    return sort
}
