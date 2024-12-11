import express from 'express';
import QRCode from 'qrcode';
import crypto from 'crypto';
import db from '../models/database';
import { Visitor } from '../models/database';

const router = express.Router();

interface VisitorData {
    mobile: string;
    govt_id: string;
}

// Generate unique QR code
const generateQRCode = async (data: VisitorData): Promise<string> => {
    const hash = crypto
        .createHash('sha256')
        .update(data.mobile + data.govt_id)
        .digest('hex');
    return await QRCode.toDataURL(hash);
};

// Register new visitor
router.post('/register', async (req, res) => {
    const { name, mobile, govt_id, purpose } = req.body;

    try {
        // Check if visitor already exists
        db.get(
            'SELECT * FROM visitors WHERE mobile = ? AND govt_id = ?',
            [mobile, govt_id],
            async (err: Error | null, visitor: Visitor) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (visitor) {
                    // Return existing QR code
                    return res.json({
                        qr_code: visitor.qr_code,
                        message: 'Existing visitor QR code retrieved'
                    });
                }

                // Generate new QR code
                const qr_code = await generateQRCode({ mobile, govt_id });

                // Insert new visitor
                db.run(
                    `
                    INSERT INTO visitors (name, mobile, govt_id, purpose, qr_code)
                    VALUES (?, ?, ?, ?, ?)
                `,
                    [name, mobile, govt_id, purpose, qr_code],
                    function(err: Error | null) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        res.json({
                            qr_code,
                            message: 'Visitor registered successfully'
                        });
                    }
                );
            }
        );
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message });
    }
});

export default router; 