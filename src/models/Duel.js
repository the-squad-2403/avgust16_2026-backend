import mongoose from 'mongoose';

// A Duel is a real-time 1v1 challenge between two users, driven by
// sockets/duel.js. status tracks the lifecycle; scores/winnerId are filled
// in as the duel is played and once it finishes.
const duelSchema = new mongoose.Schema({
  challengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  opponentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionSet: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vocabulary',
    },
  ],
  scores: {
    challenger: { type: Number, default: 0 },
    opponent: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending',
  },
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Duel = mongoose.model('Duel', duelSchema);

export default Duel;
