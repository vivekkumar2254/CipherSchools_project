import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectMongoDB, testPostgresConnection } from './config/database.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { apiLimiter, queryLimiter, hintLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seedDatabase.js';
import Assignment from './models/Assignment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await connectMongoDB();
  await testPostgresConnection();
  
  const count = await Assignment.countDocuments();
  if (count === 0) {
    await seedDatabase();
  }
})();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', apiLimiter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CipherSQL Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/query/execute', queryLimiter);
app.use('/api/query/hint', hintLimiter);
app.use('/api/query', queryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
