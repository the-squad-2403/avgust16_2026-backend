import mongoose from 'mongoose';

// TODO: a LessonPath groups an ordered sequence of Lessons for a given
// nativeLanguage -> targetLanguage pair (e.g. ru -> en path with 5 lessons).
const lessonPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  nativeLanguage: {
    type: String,
    enum: ['uz', 'ru', 'en'],
    required: true,
  },
  targetLanguage: {
    type: String,
    enum: ['uz', 'ru', 'en'],
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LessonPath = mongoose.model('LessonPath', lessonPathSchema);

export default LessonPath;
