import express from 'express';
import db from '../models/database';
import { Visitor } from '../models/database';

const router = express.Router();

// Get all visitors for admin
router.get('/visitors', (req, res) => {
    db.all('SELECT * FROM visitors', [], (err: Error | null, rows: Visitor[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

export default router; 