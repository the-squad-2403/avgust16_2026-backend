import express from 'express';
import { getLessonPath, getLessonById, completeLesson } from '../controllers/lessonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/path', protect, getLessonPath);
router.get('/:lessonId', protect, getLessonById);
router.post('/:lessonId/complete', protect, completeLesson);

export default router;
