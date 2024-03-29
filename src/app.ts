import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import specs from './utils/swagger.utils'
import config from 'config'
import logger from './utils/logger'
import routes from './routes/index.routes'
import { errorHandler } from './middleware/logger.middleware'
import deserializeUser from './middleware/deserealizeUser'
import connect from './utils/connect'

const PORT = config.get<number>('port')

const app = express()
app.use(cors())
app.use(express.json())
// Monta Swagger UI en la ruta /api-docs
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs)
)

// Configurar un stream personalizado para Morgan que utilice el mismo stream que tu logger personalizado
const morganStream = {
    write: (message: string) => logger.info(message.trim()),
}
const morganFormat = ':method :url :status - :response-time ms'

// Configurar Morgan para usar el stream personalizado y el formato de registro deseado
app.use(morgan(morganFormat, { stream: morganStream }))

app.use(deserializeUser)

app.use('/api', routes)
// Manejador de errores
app.use(errorHandler)
app.listen(PORT, async () => {
    logger.info(`Server listening on port: ${PORT}`)
    try {
        await connect()
    } catch (error) {
        throw Error('Failed to connect to MongoDB')
    }
})
