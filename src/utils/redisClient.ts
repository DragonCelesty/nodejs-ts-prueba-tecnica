import { createClient } from 'redis'
import config from 'config'
import logger from './logger'

const redisUrl = config.get<string>('redis')

const timeExpire = 60 * 60 * 2 // 2 hours

const redisClient = createClient({ url: redisUrl })

redisClient.on('connect', () => {
    logger.info('Connected to Redis')
})

redisClient.on('error', (error) => {
    logger.error('Failed to connect to Redis', error)
})

redisClient.connect()
export async function getAsync(key: string): Promise<string | null> {
    return await redisClient.get(key)
}

export async function setAsync(key: string, value: string): Promise<void> {
    await redisClient.set(key, value)
    await redisClient.expire(key, timeExpire)
}

export async function delAsync(key: string): Promise<void> {
    await redisClient.del(key)
}

export async function flushAllAsync(): Promise<void> {
    const keys: string[] = await redisClient.keys('*')
    keys.forEach(async (key) => {
        await redisClient.del(key)
    })
}
export async function delAsyncKey(prefix: string): Promise<void> {
    const keys: string[] = await redisClient.keys(`${prefix}*`)
    keys.forEach(async (key) => {
        await redisClient.del(key)
    })
}
