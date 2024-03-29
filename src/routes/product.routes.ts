import { Router } from 'express'

import {
    createManyProductsHandler,
    createProductHandler,
    deleteProductHandler,
    getProductHandler,
    getProductsHandler,
    updateProductHandler,
} from '../controllers/product.controller'

import validate from '../middleware/validateResource'

import {
    createProductSchema,
    getProductsSchema,
    updateProductSchema,
} from '../schemas/product.schema'

import requireUser from '../middleware/requireUser'

const router = Router()

router.post(
    '/',
    [requireUser, validate(createProductSchema)],
    createProductHandler
)
router.get('/', [requireUser, validate(getProductsSchema)], getProductsHandler)

router.get('/:productId', requireUser, getProductHandler)

router.put(
    '/:productId',
    [requireUser, validate(updateProductSchema)],
    updateProductHandler
)

router.delete('/:productId', requireUser, deleteProductHandler)

router.post('/many', requireUser, createManyProductsHandler)

export default router


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene la lista de productos.
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la lista de productos.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la lista de productos.
 *       '403':
 *         description: No autorizado.
 *   post:
 *     summary: Crea un nuevo producto.
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/ProductSchema'
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve el producto creado.
 *      '500':
 *          description: Error interno del servidor.
 *   put:
 *     summary: Actualiza el producto.
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve el producto actualizada.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al actualizar el producto.
 *       '403':
 *         description: No autorizado.
 *   delete:
 *     summary: Elimina el producto.
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve el producto eliminado.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al eliminar el producto.
 *       '403':
 *         description: No autorizado.
 *
 * /api/prdoucts/{id}:
 *   get:
 *     summary: Obtiene el producto.
 *     tags: [Products]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve el producto.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener el producto.
 *       '403':
 *         description: No autorizado.
 *
 */