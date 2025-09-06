import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import childRoutes from './routes/childRoutes.js';
import userRoutes from './routes/userRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import moment from 'moment-timezone';

import motherRoutes from './routes/motherRoutes.js';
// import './cron/dailySchedule.js';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(
  morgan((tokens, req, res) => {
    return [
      `[${moment().tz('Asia/Kathmandu').format('h:mm:ss A')}]`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms -',
      tokens.res(req, res, 'content-length')
    ].join(' ');
  })
);

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

//schedule routes
app.use('/api/vaccine-schedule', scheduleRoutes);

app.get('/', (req, res) => {
  res.send('Vaccination API running');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
