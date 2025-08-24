import { Request, Response, NextFunction } from 'express';

// make a middleware that logs req with route and timestamp
export const logger = (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const route = req.path;
    const method = req.method;
    
    console.log(`[${timestamp}] ${method} ${route}`);
    
    next();
};