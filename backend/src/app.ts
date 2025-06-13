import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import gifRoutes from './routes/gifs';
import ratingRoutes from './routes/ratings';
import commentRoutes from './routes/comments';
import { errorHandler } from './middleware/error';
import { apiLimiter } from './middleware/rateLimit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gifs', gifRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use(errorHandler);

export default app; 