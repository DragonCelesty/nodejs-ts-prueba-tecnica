import * as dotenv from 'dotenv'
dotenv.config()
export default {
    port: process.env.PORT || 3000,
    dbUri: process.env.DB_URI,
    dbName: process.env.DB_NAME,
    bitSecret: process.env.BIT_SECRET,
    redis: process.env.REDIS,
    saltWorkFactor: 10,
    accessTokenTtl: '15m',
    refreshTokenTtl: '1y',
    node_env: process.env.NODE_ENV,
}
