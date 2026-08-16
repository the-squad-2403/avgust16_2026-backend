import mongoose from 'mongoose';

// TODO: a Vocabulary entry is a single word/phrase pair for a given
// nativeLanguage -> targetLanguage direction, optionally tagged to a Lesson.
const vocabularySchema = new mongoose.Schema({
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
  nativeWord: {
    type: String,
    required: true,
    trim: true,
  },
  targetWord: {
    type: String,
    required: true,
    trim: true,
  },
  audioUrl: {
    type: String,
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

export default Vocabulary;
