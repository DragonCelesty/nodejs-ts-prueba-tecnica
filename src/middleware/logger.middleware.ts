import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger'; // Importa tu logger personalizado

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}

export function responseLogger(req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;
    res.send = function (...args: any[]) {
        const responseTime = new Date().getTime() - (req as any).startTime;
        logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} - ${responseTime}ms`);
        originalSend.apply(res, args);
    };
    next();
}


// manejo de errores
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    logger.error(err);
    res.status(500).send('Something went wrong');
}