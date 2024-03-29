import { MongoClient, Db } from 'mongodb'
import config from 'config'
import logger from './logger'

let client: MongoClient
let db: Db

export default async function connect(): Promise<Db> {
    try {
        if (!client) {
            const uri = config.get<string>('dbUri')
            client = new MongoClient(uri)
            await client.connect()
            logger.info('Connected to MongoDB')
        }
        if (!db) {
            db = client.db()
        }
        return db
    } catch (error) {
        logger.error('Failed to connect to MongoDB', error)
        throw error
    }
}
