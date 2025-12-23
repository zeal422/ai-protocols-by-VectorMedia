/**
 * Express Server following ai-protocols
 * Demonstrates: API Design, Security, Error Handling, Performance
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './config/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware (SECAUDIT protocol)
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting (SECAUDIT protocol)
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (API Design protocol - versioned endpoints)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
});

// Error handling middleware (Debug protocol)
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
