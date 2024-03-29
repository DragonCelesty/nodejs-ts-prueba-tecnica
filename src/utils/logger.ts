import pino from 'pino';

const logger = pino({
    level: 'debug',
    base: {
        pid: false,
    },
    transport: {
        target: 'pino-pretty',
        options: {
            destination: 1,
            prettyPrint: {
                colorize: true,
                ignore: 'pid,hostname',
            },
        },
    },
    // add date and time to logs format yyyy-mm-dd hh:mm:ss
    timestamp() {
        return `,"time":"${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}T${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}"`;
    }
});

export default logger;
