import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import duelRoutes from './routes/duelRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import registerDuelHandlers from './sockets/duel.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "*",
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
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

registerDuelHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
