import express from 'express';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import voucherRoutes from './routes/voucherRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import voucher_codeRoutes from './routes/voucher_codeRoutes.js';
import cors from 'cors';
//import './services/voucherSyncService.js'; // Start the cron job

const app = express();
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/vouchers', voucherRoutes);
app.use('/coupons', voucher_codeRoutes);
app.use('/analytics', analyticsRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});
// Error handling
app.use(errorHandler);

// Export the app for use in server.js
export default app;