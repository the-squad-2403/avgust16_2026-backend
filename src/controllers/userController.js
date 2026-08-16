import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';

export const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = { _id: { $ne: req.user._id } };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const users = await User.find(filter).select('name xp league level').sort({ xp: -1 }).limit(50);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name xp streak league level createdAt'
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const progress = await UserProgress.find({ userId: user._id }).populate('lessonId', 'type vocabulary');

    const dialogsCompleted = progress.filter((p) => p.lessonId?.type === 'dialog').length;

    const wordsLearnedSet = new Set();
    progress.forEach((p) => {
      (p.lessonId?.vocabulary || []).forEach((vocabId) => wordsLearnedSet.add(vocabId.toString()));
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      xp: user.xp,
      streak: user.streak,
      league: user.league,
      level: user.level,
      createdAt: user.createdAt,
      lessonsCompleted: progress.length,
      dialogsCompleted,
      wordsLearned: wordsLearnedSet.size,
    });
  } catch (err) {
    next(err);
  }
};
