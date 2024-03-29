import bcrypt from 'bcrypt'
import { User, setupCollection } from '../models/user.model'
import config from 'config'
import { ObjectId } from 'mongodb'
import logger from '../utils/logger'

let salt = config.get<number>('saltWorkFactor')
export async function createUser(user: User): Promise<User | null> {
    try {
        let usersCollection = await setupCollection()
        console.log(user)
        // Verificar si el email ya está en uso
        const existingUser = await usersCollection.findOne({
            email: user.email,
        })
        if (existingUser) {
            throw new Error('Email already in use')
        }
        // Encriptar la contraseña con bcrypt antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(user.password, salt)
        const userToSave = { ...user, password: hashedPassword }
        userToSave.createdAt = new Date()
        userToSave.updatedAt = new Date()
        const result = await usersCollection.insertOne(userToSave)
        logger.info(`User created with ID: ${result.insertedId}`)
        return await usersCollection.findOne({
            _id: result.insertedId,
        })
    } catch (error) {
        logger.error('Failed to create user', error)
        throw error
    }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        let usersCollection = await setupCollection()
        const user = await usersCollection.findOne({
            _id: new ObjectId(userId),
        })
        return user
    } catch (error) {
        logger.error(`Failed to get user by ID ${userId}`, error)
        throw error
    }
}

export async function updateUser(
    userId: string,
    updatedUserData: Partial<User>
): Promise<void> {
    try {
        let usersCollection = await setupCollection()

        // Si se está actualizando la contraseña, encriptarla antes de actualizarla
        if (updatedUserData.password) {
            updatedUserData.password = await bcrypt.hash(
                updatedUserData.password,
                salt
            )
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedUserData }
        )
        logger.info(`User with ID ${userId} updated`)
    } catch (error) {
        logger.error(`Failed to update user with ID ${userId}`, error)
        throw error
    }
}

export async function deleteUser(userId: string): Promise<void> {
    try {
        let usersCollection = await setupCollection()

        await usersCollection.deleteOne({ _id: new ObjectId(userId) })
        logger.info(`User with ID ${userId} deleted`)
    } catch (error) {
        logger.error(`Failed to delete user with ID ${userId}`, error)
        throw error
    }
}

// get user by any field and order by any field asc or desc and paginate

export async function getUsers(
    query: Partial<User> = {},
    sort: any = { createdAt: -1 },
    page:number = 0,
    pageSize:number = 10
): Promise<User[]> {
    try {
        let usersCollection = await setupCollection()

        const cursor = usersCollection
            .find(query)
            .sort(sort)
            .skip(page * pageSize)
            .limit(pageSize)

        return cursor.toArray()
    } catch (error) {
        logger.error('Failed to get users', error)
        throw error
    }
}

// compare password
export async function comparePasswords(
    plainTextPassword: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt
        .compare(plainTextPassword, hashedPassword)
        .catch((error) => false)
}

export async function getUser(query: Partial<User>): Promise<User | null> {
    try {
        let usersCollection = await setupCollection()

        return await usersCollection.findOne(query)
    } catch (error) {
        logger.error('Failed to get user', error)
        throw error
    }
}
