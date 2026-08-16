import Duel from '../models/Duel.js';
import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';

const DUEL_QUESTION_COUNT = 10;

export const createDuelChallenge = async (req, res, next) => {
  try {
    const { opponentId } = req.body;

    if (!opponentId) {
      res.status(400);
      throw new Error('opponentId is required');
    }

    if (opponentId === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot challenge yourself');
    }

    const opponent = await User.findById(opponentId);
    if (!opponent) {
      res.status(404);
      throw new Error('Opponent not found');
    }

    const questionSet = await Vocabulary.aggregate([{ $sample: { size: DUEL_QUESTION_COUNT } }]);

    const duel = await Duel.create({
      challengerId: req.user._id,
      opponentId,
      questionSet: questionSet.map((q) => q._id),
      status: 'pending',
    });

    res.status(201).json(duel);
  } catch (err) {
    next(err);
  }
};

export const getDuelById = async (req, res, next) => {
  try {
    const duel = await Duel.findById(req.params.id)
      .populate('challengerId', 'name xp league level')
      .populate('opponentId', 'name xp league level')
      .populate('questionSet');

    if (!duel) {
      res.status(404);
      throw new Error('Duel not found');
    }

    res.status(200).json(duel);
  } catch (err) {
    next(err);
  }
};
