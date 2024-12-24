import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/database';
import { User } from '../models/database';
import { auth as firebaseAdmin } from '../config/firebase-admin';

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

router.post('/register-parent', async (req, res) => {
    try {
        const { idToken, email, displayName, provider } = req.body;
        
        // Verify the Firebase token
        const decodedToken = await firebaseAdmin.verifyIdToken(idToken);
        
        // Save parent information to your database
        const token = jwt.sign(
            { 
                uid: decodedToken.uid, 
                email: decodedToken.email, 
                role: 'parent' 
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
        
        res.json({ token });
    } catch (error) {
        console.error('Parent registration error:', error);
        res.status(400).json({ error: 'Registration failed' });
    }
});

export default router; 