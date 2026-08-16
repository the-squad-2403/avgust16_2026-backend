import mongoose from 'mongoose';

// A Vocabulary entry is a single word/concept with translations into every
// supported language, so the same entry can serve any language-pair path.
const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  translations: {
    uz: { type: String, required: true },
    ru: { type: String, required: true },
    en: { type: String, required: true },
  },
  exampleSentence: {
    type: String,
    trim: true,
  },
  audioUrl: {
    type: String,
    default: '',
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
