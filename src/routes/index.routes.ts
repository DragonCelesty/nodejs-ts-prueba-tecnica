import { Router, Request, Response } from 'express'

import userRouter from './user.routes'
import sessionRouter from './session.routes'
import categoriesRouter from './category.routes'
import brandsRouter from './brand.routes'
import productsRouter from './product.routes'
const router = Router()

router.use('/users', userRouter)
router.use('/sessions', sessionRouter)
router.use('/categories', categoriesRouter)
router.use('/brands', brandsRouter)
router.use('/products', productsRouter)

router.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK')
})

export default router

/**
 * @swagger
 * components:
 *  schemas:
 *     UserSchema:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        name:
 *           type: string
 *           description: Nombre del usuario
 *        email:
 *          type: string
 *          format: email
 *          description: Email del usuario
 *        password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *        passwordConfirmation:
 *           type: string
 *           format: password
 *           description: Confirmación de la contraseña
 *
 *     UserChangePasswordSchema:
 *      type: object
 *      required:
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *        passwordConfirmation:
 *           type: string
 *           format: password
 *           description: Confirmación de la contraseña
 *
 *     SessionsSchema:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          format: email
 *          description: Email del usuario
 *        password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *
 *     CategorySchema:
 *       type: object
 *       required:
 *          - name
 *          - description
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la categoria
 *           example: 'Electronica'
 *         description:
 *           type: string
 *           description: Descripción de la categoria
 *           example: 'Productos electronicos'
 *
 *
 *     BrandSchema:
 *       type: object
 *       required:
 *          - name
 *          - description
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la categoria
 *           example: 'Electronica'
 *         description:
 *           type: string
 *           description: Descripción de la categoria
 *           example: 'Productos electronicos'
 *
 *     ProductSchema:
 *      type: object
 *      required:
 *       - name
 *       - description
 *       - price
 *       - stock
 *       - discountPercentage
 *       - rating
 *       - image
 *       - images
 *       - brand
 *       - category
 *      properties:
 *       name:
 *        type: string
 *        description: Nombre del producto
 *       description:
 *        type: string
 *        description: Descripción del producto
 *       price:
 *        type: number
 *        description: Precio del producto
 *       stock:
 *        type: number
 *        description: Stock del producto
 *       discountPercentage:
 *        type: number
 *        description: Porcentaje de descuento del producto
 *       rating:
 *        type: number
 *        description: Rating del producto
 *       image:
 *        type: string
 *        description: Imagen del producto
 *       images:
 *        type: array
 *        description: Imagenes del producto
 *       brand:
 *        type: string
 *        description: Marca del producto
 *       category:
 *        type: string
 *        description: Categoria del producto
 */
