import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import usersRoutes from './routes/users';
import favoritesRoutes from './routes/favorites';
import promotionsRoutes from './routes/promotions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/promotions', promotionsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Kubito API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Kubito API server running on port ${PORT}`);
});
