import { Router } from 'express'
import {
    createUserHandler,
    deleteUserHandler,
    getUserHandler,
    getUsersHandler,
    restoreUserHandler,
    updateUserPasswordHandler,
} from '../controllers/user.controller'
import validate from '../middleware/validateResource'
import {
    createUserSchema,
    updateUserPasswordSchema,
} from '../schemas/user.schema'
import requireUser from '../middleware/requireUser'

const router = Router()

router.post('/', validate(createUserSchema), createUserHandler)
router.get('/', requireUser, getUsersHandler)
router.put(
    '/:userId',
    [requireUser, validate(updateUserPasswordSchema)],
    updateUserPasswordHandler
)
router.get('/:userId', requireUser, getUserHandler)
router.delete('/:userId', requireUser, deleteUserHandler)
router.patch('/:userId', requireUser, restoreUserHandler)
export default router
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene la lista de usuarios.
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Éxito. Devuelve la lista de usuarios.
 *       '500':
 *         description: Error interno del servidor.
 *       '409':
 *         description: Error al obtener la lista de usuarios.
 *       '403':
 *         description: No autorizado.
 *   post:
 *     summary: Crea un nuevo usuario.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/UserSchema'
 *     responses:
 *      '200':
 *          description: Éxito. Devuelve el usuario creado.
 *      '500':
 *          description: Error interno del servidor.
 *      '409':
 *          description: Error al crear el usuario.
 * 
 *   patch:
 *     summary: Restaura un usuario eliminado.
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: userId
 *     required: true
 *     responses:
 *       '200':
 *          description: Éxito. Devuelve el usuario restaurado.
 *       '500':
 *          description: Error interno del servidor.
 *       '409':
 *          description: Error al restaurar el usuario.
 *       '403':
 *          description: No autorizado.
 *   put:
 *     summary: Actualiza la contraseña de un usuario.
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/UserChangePasswordSchema'
 *     parameters:
 *      - in: path
 *        name: userId
 *     required: true
 *     responses:
 *       '200':
 *          description: Éxito. Devuelve el usuario actualizado.
 *       '500':
 *          description: Error interno del servidor.
 *       '409':
 *          description: Error al actualizar el usuario.    
 *       '403':
 *          description: No autorizado.
 * 
 *   delete:
 *     summary: Elimina un usuario.
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: userId
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
 * /api/users/{userId}:
 *   get:
 *     summary: Obtener un usuario.
 *     tags: [Users]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: userId
 *     required: true
 *     responses:
 *       '200':
 *          description: Éxito al obtener el usuario.
 *       '500':
 *          description: Error interno del servidor.
 *       '409':
 *          description: Error al obtener el usuario.
 *       '403':
 *          description: No autorizado.
 */