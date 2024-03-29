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
        // verificar si el usuario ya existe
        const userExists = await getUsersService({ email: req.body.email })
        if (userExists.length > 0) {
            return res.status(409).send('User already exists')
        }
        // remove passwordConfirmation from the request body
        if (req.body.passwordConfirmation) {
            delete req.body.passwordConfirmation
        }
        const user = await createUserService({ ...req.body, active: true })
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
    req: Request<{}, {}, UpdateUserPasswordInput['body']>,
    res: Response
) {
    try {
        const userId = req.params.userId
        // remove passwordConfirmation from the request body
        if (req.body.passwordConfirmation) {
            delete req.body.passwordConfirmation
        }
        const user = await updateUserService(userId, req.body)
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
