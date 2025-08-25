import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate, authorize } from './middlewares/auth.js';
import authRoutes from './routes/authRoutes.js';
import childRoutes from './routes/childRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import motherRoutes from './routes/motherRoutes.js';
// import './jobs/smsCronJob.js';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

//User routes
app.use('/api/users', userRoutes)

//child routes
app.use('/api/child', childRoutes);

//mother routes
app.use('/api/mothers', motherRoutes);

app.get('/', (req, res) => {
  res.send('Vaccination API running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
