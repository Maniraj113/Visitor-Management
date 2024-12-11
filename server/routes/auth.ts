import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/database';
import { User } from '../models/database';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        db.get(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (err: Error | null, user: User) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    process.env.JWT_SECRET || 'your-fallback-secret',
                    { expiresIn: '24h' }
                );

                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            }
        );
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

export default router; 