import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import travelRouter from './routes/travel.js';
import travelLogRouter from './routes/travelLog.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Service is running', uptime: process.uptime() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/travel', travelRouter);
app.use('/api/travel-logs', travelLogRouter);

// Backward compat
app.use('/travel', travelRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
