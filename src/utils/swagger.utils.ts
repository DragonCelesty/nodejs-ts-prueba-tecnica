import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'A simple  API Documentation',
            contact: {
                name: 'Delvis',
                email: 'dragoncelesty@gmail.com',
            },
        },
    },
    components: {
        SecuritySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization ',
            },
        },
    },
    security: {
        bearerAuth: [],
    },
    apis: [path.join(__dirname, '../routes/*.ts')],
}
const specs = swaggerJsdoc(options)

export default specs
