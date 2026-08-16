import mongoose from 'mongoose';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyTotals = await UserProgress.aggregate([
      { $match: { completedAt: { $gte: oneWeekAgo } } },
      { $group: { _id: '$userId', weeklyXp: { $sum: '$xpEarned' } } },
      { $sort: { weeklyXp: -1 } },
    ]);

    const userIds = weeklyTotals.map((entry) => entry._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name league xp level');
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const ranked = weeklyTotals
      .filter((entry) => userMap.has(entry._id.toString()))
      .map((entry, index) => {
        const user = userMap.get(entry._id.toString());
        return {
          rank: index + 1,
          userId: user._id,
          name: user.name,
          league: user.league,
          weeklyXp: entry.weeklyXp,
        };
      });

    const top20 = ranked.slice(0, 20);

    const byLeague = top20.reduce((acc, entry) => {
      acc[entry.league] = acc[entry.league] || [];
      acc[entry.league].push(entry);
      return acc;
    }, {});

    let currentUser = ranked.find((entry) => entry.userId.toString() === req.user._id.toString());
    if (!currentUser) {
      currentUser = {
        rank: null,
        userId: req.user._id,
        name: req.user.name,
        league: req.user.league,
        weeklyXp: 0,
      };
    }

    res.status(200).json({
      leaderboard: top20,
      byLeague,
      currentUser,
    });
  } catch (err) {
    next(err);
  }
};
