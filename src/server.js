import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import duelRoutes from './routes/duelRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/duel', duelRoutes);
// TODO: attach socket.io to the http server here once sockets/duel.js is implemented

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
