import express from 'express';
import db from '../models/database';
import { User, Visitor } from '../models/database';

const router = express.Router();

// Get all users
router.get('/users', (req, res) => {
    db.all('SELECT id, username, role FROM users', [], (err: Error | null, rows: User[]) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get all visitors with full details
router.get('/visitors', (req, res) => {
    const query = `
        SELECT 
            id,
            name,
            mobile,
            govt_id,
            purpose,
            qr_code,
            check_in,
            check_out,
            created_at
        FROM visitors
        ORDER BY created_at DESC
    `;

    db.all(query, [], (err: Error | null, rows: Visitor[]) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add new user
router.post('/users', (req, res) => {
    const { username, password, role } = req.body;
    db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, password, role],
        function(this: any, err: Error | null) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Update user
router.put('/users/:id', (req, res) => {
    const { username, password, role } = req.body;
    db.run(
        'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
        [username, password, role, req.params.id],
        (err: Error | null) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User updated' });
        }
    );
});

// Delete user
router.delete('/users/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', req.params.id, (err: Error | null) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User deleted' });
    });
});

export default router; 