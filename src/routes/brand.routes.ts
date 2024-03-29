import { Router } from 'express'

import validate from '../middleware/validateResource'

import {
    createBrandHandler,
    getBrandsHandler,
    getBrandHandler,
    updateBrandHandler,
    deleteBrandHandler,
    createManyBrandsHandler,
} from '../controllers/brand.controller'

import { createBrandSchema, updateBrandSchema } from '../schemas/brand.schema'

import requireUser from '../middleware/requireUser'

const router = Router()

router.post('/', [requireUser, validate(createBrandSchema)], createBrandHandler)

router.get('/', requireUser, getBrandsHandler)
router.get('/:id', requireUser, getBrandHandler)
router.put(
    '/:id',
    [requireUser, validate(updateBrandSchema)],
    updateBrandHandler
)
router.delete('/:id', requireUser, deleteBrandHandler)
router.post('/many', [requireUser], createManyBrandsHandler)

export default router

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Obtiene la lista de marcas.
 *     tags: [Brands]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la lista de marcas.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la lista de marcas.
 *       '403':
 *         description: No autorizado.
 *   post:
 *     summary: Crea una nueva marca.
 *     tags: [Brands]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/BrandSchema'
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve la marca creada.
 *      '500':
 *          description: Error interno del servidor.
 *   put:
 *     summary: Actualiza la marca.
 *     tags: [Brands]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve la marca actualizada.
 *      '500':
 *          description: Error interno del servidor.
 *      '409':
 *          description: Error al actualizar la marca.
 *      '403':
 *          description: No autorizado.
 *   delete:
 *     summary: Elimina la marca.
 *     tags: [Brands]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve la marca eliminada.
 *      '500':
 *          description: Error interno del servidor.
 *      '409':
 *          description: Error al eliminar la marca.
 *      '403':
 *          description: No autorizado.
 */