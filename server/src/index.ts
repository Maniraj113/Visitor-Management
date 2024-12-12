import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { authenticateToken, isAdmin } from './middleware/auth';

// Import routes
import visitorRoutes from './routes/visitors';
import securityRoutes from './routes/security';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/visitors', visitorRoutes);
app.use('/api/security', authenticateToken, securityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateToken, isAdmin, adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 