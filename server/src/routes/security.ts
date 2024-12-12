import express from 'express';
import db from '../models/database';
import { Visitor } from '../models/database';

const router = express.Router();

// Get all visitors for security
router.get('/visitors', (req, res) => {
    db.all('SELECT * FROM visitors', [], (err: Error | null, rows: Visitor[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Check-in visitor
router.post('/checkin', (req, res) => {
    const { visitor_id } = req.body;
    const checkInTime = new Date().toISOString();

    db.run(
        'UPDATE visitors SET check_in = ? WHERE id = ?',
        [checkInTime, visitor_id],
        function(err: Error | null) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Checked in successfully' });
        }
    );
});

// Check-out visitor
router.post('/checkout', (req, res) => {
    const { visitor_id } = req.body;
    const checkOutTime = new Date().toISOString();

    db.run(
        'UPDATE visitors SET check_out = ? WHERE id = ?',
        [checkOutTime, visitor_id],
        function(err: Error | null) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Checked out successfully' });
        }
    );
});

export default router; 