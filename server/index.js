import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database.js';
import { runMigrations } from './db/migrations.js';
import userRoutes from './routes/user.routes.js';
import goalRoutes from './routes/goal.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import aiRoutes from './routes/ai.routes.js';
import authRoutes from './routes/auth.routes.js';
import { verifyToken } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://investment-bot-pink.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/goals', verifyToken, goalRoutes);
app.use('/api/expenses', verifyToken, expenseRoutes);
app.use('/api/ai', verifyToken, aiRoutes);

// Error handling
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    runMigrations();
    app.listen(PORT, () => {
      console.log(`\n🚀 FinPilot AI Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
