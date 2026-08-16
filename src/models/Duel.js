import mongoose from 'mongoose';

// TODO: a Duel is a real-time 1v1 challenge between two users, driven by
// sockets/duel.js. status tracks the lifecycle; results is filled in once
// the duel finishes.
const duelSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending',
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
  },
  results: {
    challengerScore: { type: Number, default: 0 },
    opponentScore: { type: Number, default: 0 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Duel = mongoose.model('Duel', duelSchema);

export default Duel;
