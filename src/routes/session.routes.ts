import { Router } from 'express'
import validate from '../middleware/validateResource'
import { createSessionSchema } from '../schemas/session.schema'
import {
    createSessionHandler,
    deleteSessionHandler,
    getUserSessionsHandler,
} from '../controllers/session.controller'
import requireUser from '../middleware/requireUser'

const router = Router()

router.post('/', validate(createSessionSchema), createSessionHandler)
router.get('/', requireUser, getUserSessionsHandler)
router.delete('/', requireUser, deleteSessionHandler)

export default router


/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Obtiene la lista de sesiones del usuario.
 *     tags: [Sessions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       in: 'header'
 *       name: Authorization
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la lista de sesiones del usuario.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la lista de sesiones del usuario.
 *       '403':
 *         description: No autorizado.
 *   post:
 *     summary: Crea un nueva sesion.
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/SessionsSchema'
 *     produces:
 *      - application/json
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve el sesion creada.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *            example:
 *              - data: token
 *      '500':
 *          description: Error interno del servidor.
 *      '409':
 *          description: Error al crear el sesion.
 * 
 *   delete:
 *     summary: Elimina la sesion del usuario.
 *     tags: [Sessions]
 *     security:
 *      - bearerAuth: []
 *     required: true
 *     responses:
 *       '200':
 *          description: Éxito al eliminar el usuario.
 *       '500':
 *          description: Error interno del servidor.
 *       '409':
 *          description: Error al eliminar el usuario.
 *       '403':
 *          description: No autorizado.
 */