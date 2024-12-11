import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
        [key: string]: any;
    };
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');
        req.user = verified as AuthRequest['user'];
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
    }
    next();
}; 