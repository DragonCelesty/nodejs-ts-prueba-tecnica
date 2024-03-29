import { Router } from 'express'

import validate from '../middleware/validateResource'

import {
    createCategoryHandler,
    createManyCategoriesHandler,
    deleteCategoryHandler,
    getCategoriesHandler,
    getCategoryHandler,
    updateCategoryHandler,
} from '../controllers/category.controller'

import {
    createCategorySchema,
    updateCategorySchema,
} from '../schemas/category.schema'
import requireUser from '../middleware/requireUser'

const router = Router()

router.post(
    '/',
    [requireUser, validate(createCategorySchema)],
    createCategoryHandler
)
router.get('/', requireUser, getCategoriesHandler)
router.get('/:id', requireUser, getCategoryHandler)
router.put(
    '/:id',
    [requireUser, validate(updateCategorySchema)],
    updateCategoryHandler
)
router.delete('/:id', requireUser, deleteCategoryHandler)

router.post('/many', [requireUser], createManyCategoriesHandler)

export default router

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtiene la lista de categorias.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la lista de categorias.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la lista de categorias.
 *       '403':
 *         description: No autorizado.
 *   post:
 *     summary: Crea una nueva categoria.
 *     tags: [Categories]
  *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/CategorySchema'
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve la categoria creada.
 *      '500':
 *          description: Error interno del servidor.
 *   put:
 *     summary: Actualiza la categoria.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la categoria actualizada.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al actualizar la categoria.
 *       '403':
 *         description: No autorizado.
 *   delete:
 *     summary: Elimina la categoria.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la categoria eliminada.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al eliminar la categoria.
 *       '403':
 *         description: No autorizado.
 *
 * /api/categories/{id}:
 *   get:
 *     summary: Obtiene la categoria.
 *     tags: [Categories]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la categoria.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la categoria.
 *       '403':
 *         description: No autorizado.
 *
 */
