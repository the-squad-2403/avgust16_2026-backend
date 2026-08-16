import mongoose from 'mongoose';

// TODO: tracks a single user's completion state for a single lesson
// (score, attempts, xpEarned). One document per user+lesson pair.
const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
