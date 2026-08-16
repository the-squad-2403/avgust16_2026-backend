import mongoose from 'mongoose';

// Tracks a single user's completion of a single lesson (one document per
// completion — a user may complete the same lesson more than once).
const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  accuracy: {
    type: Number,
    default: 0,
  },
  xpEarned: {
    type: Number,
    default: 0,
  },
  mistakeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;
