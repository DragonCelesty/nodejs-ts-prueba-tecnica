import { Request, Response } from 'express'
import logger from '../utils/logger'
import {
    createUserService,
    findUser,
    getUsersService,
    updateUserService,
} from '../services/user.service'
import {
    CreateUserInput,
    UpdateUserPasswordInput,
} from '../schemas/user.schema'

// crear un usuario
export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput['body']>,
    res: Response
) {
    try {
        const { email, name, password } = req.body
        // verificar si el usuario ya existe
        const userExists = await findUser({ email: email })
        if (userExists) {
            return res.status(409).send('User already exists')
        }

        const user = await createUserService({
            active: true,
            email: email,
            name: name,
            password: password,
        })
        return res.send(user)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

// obtener todos los usuarios
export async function getUsersHandler(req: Request, res: Response) {
    try {
        const users = await getUsersService()
        return res.send(users)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

// obtener un usuario por id
export async function getUserHandler(req: Request, res: Response) {
    try {
        const user = await findUser({ _id: req.params.userId })
        return res.send(user)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

// actualizar password a un usuario por id
export async function updateUserPasswordHandler(
    req: Request<{userId: string}, {}, UpdateUserPasswordInput['body']>,
    res: Response
) {
    try {
        if (!req.params || !req.params.userId) {
            return res.status(409).send('User id is required')
        }
        const userId = req.params.userId
        const { password } = req.body
        await updateUserService(userId, { password })
        return res.status(200).send('Password updated')
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

// eliminar un usuario por id (soft delete)
export async function deleteUserHandler(req: Request, res: Response) {
    try {
        const user = await updateUserService(req.params.userId, {
            active: false,
        })
        return res.send(user)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}

// restaurar un usuario por id (soft delete)
export async function restoreUserHandler(req: Request, res: Response) {
    try {
        const user = await updateUserService(req.params.userId, {
            active: true,
        })
        return res.send(user)
    } catch (e: any) {
        logger.error(e)
        res.status(409).send(e.message)
    }
}
