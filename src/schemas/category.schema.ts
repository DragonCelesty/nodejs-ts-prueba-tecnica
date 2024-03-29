import { TypeOf, object, string } from 'zod'

export const createCategorySchema = object({
    body: object({
        name: string({
            required_error: 'Name is required',
        }),
        description: string({
            required_error: 'Description is required',
        }),
        user: string({}).optional(),
    }),
})

export type CreateCategoryInput = TypeOf<typeof createCategorySchema>

export const updateCategorySchema = object({
    body: object({
        name: string({
            required_error: 'Name is required',
        }).optional(),
        description: string({
            required_error: 'Description is required',
        }).optional(),
    }),
    params: object({
        id: string({
            required_error: 'Id is required',
        }),
    }),
})

export type UpdateCategoryInput = TypeOf<typeof updateCategorySchema>
