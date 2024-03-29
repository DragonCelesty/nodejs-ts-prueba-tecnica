import { PartialObject, omit } from 'lodash'
import {
    createUser,
    getUser,
    comparePasswords,
    getUsers,
    updateUser,
} from '../repositories/user.repository'
import { User } from '../models/user.model'

import logger from '../utils/logger'

export async function createUserService(
    input: User
): Promise<PartialObject<User> | null> {
    // create user
    try {
        const user = await createUser(input)
        return omit(user, 'password')
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function validatePassword({
    email,
    password,
}: {
    email: string
    password: string
}): Promise<PartialObject<User> | null> {
    // validate user's password
    try {
        const user = await getUser({ email })
        if (!user) {
            logger.error('User not found')
            return null
        }
        const isValid = await comparePasswords(password, user.password)
        if (!isValid) {
            logger.error('Password is incorrect')
            return null
        }

        return omit(user, 'password')
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function findUser(query: any): Promise<User | null> {
    try {
        return await getUser(query)
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function getUsersService(): Promise<PartialObject<User[]>> {
    try {
        const users = await getUsers()
        return users.map((user) => omit(user, 'password'))
    } catch (e: any) {
        throw new Error(e.message)
    }
}

export async function updateUserService(
    userId: string,
    updatedUserData: Partial<User>
): Promise<void> {
    try {
        // update user
        await updateUser(userId, updatedUserData)
    } catch (e: any) {
        throw new Error(e.message)
    }
}
