import mongoose from 'mongoose';

// A Lesson belongs to a LessonPath. type distinguishes a vocabulary drill
// from a full dialog lesson, a listening exercise, or a speed round.
// content shape depends on type — for 'dialog' it is:
//   { scenario, scenes: [{ speakerLine, translations: {uz,ru,en}, replyOptions: [{text, isCorrect}] }] }
const lessonSchema = new mongoose.Schema({
  lessonPath: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LessonPath',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['dialog', 'vocabulary', 'listening', 'speed_round'],
    default: 'vocabulary',
  },
  order: {
    type: Number,
    default: 0,
  },
  xpReward: {
    type: Number,
    default: 10,
  },
  unlockRequirement: {
    type: Number,
    default: 0,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  vocabulary: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vocabulary',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
