import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate, authorize } from './middlewares/auth.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use(authRoutes);

app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: `Hello, ${req.user.role}! You are authenticated.` });
});

app.get('/api/admin-only', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

app.get('/', (req, res) => {
  res.send('Vaccination API running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
