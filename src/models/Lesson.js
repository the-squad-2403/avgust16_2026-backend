import mongoose from 'mongoose';

// TODO: a Lesson belongs to a LessonPath. type distinguishes a standard
// vocab/exercise lesson from a full dialog lesson. content shape is left
// flexible (Mixed) until the exercise format is finalized.
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
    enum: ['standard', 'dialog', 'speed-round'],
    default: 'standard',
  },
  order: {
    type: Number,
    default: 0,
  },
  xpReward: {
    type: Number,
    default: 10,
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
