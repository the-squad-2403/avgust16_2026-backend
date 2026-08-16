import express from 'express';
import { createDuelChallenge, getDuelById } from '../controllers/duelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/challenge', protect, createDuelChallenge);
router.get('/:id', protect, getDuelById);

export default router;
