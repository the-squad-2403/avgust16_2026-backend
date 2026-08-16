import LessonPath from '../models/LessonPath.js';
import Lesson from '../models/Lesson.js';
import UserProgress from '../models/UserProgress.js';

const SPEED_BONUS_THRESHOLD_SECONDS = 30;
const SPEED_BONUS_XP = 5;
const XP_PER_LEVEL = 100;

const isSameDay = (a, b) => Boolean(a) && Boolean(b) && new Date(a).toDateString() === new Date(b).toDateString();

const isYesterday = (date, reference) => {
  if (!date) return false;
  const d = new Date(reference);
  d.setDate(d.getDate() - 1);
  return new Date(date).toDateString() === d.toDateString();
};

export const getLessonPath = async (req, res, next) => {
  try {
    const { targetLanguage } = req.query;

    if (!targetLanguage) {
      res.status(400);
      throw new Error('targetLanguage query param is required');
    }

    const lessonPath = await LessonPath.findOne({ targetLanguage }).populate({
      path: 'lessons',
      options: { sort: { order: 1 } },
    });

    if (!lessonPath) {
      res.status(404);
      throw new Error('No lesson path found for this target language');
    }

    const lessonIds = lessonPath.lessons.map((lesson) => lesson._id);
    const progressRecords = await UserProgress.find({
      userId: req.user._id,
      lessonId: { $in: lessonIds },
    }).select('lessonId');
    const completedLessonIds = new Set(progressRecords.map((p) => p.lessonId.toString()));

    const lessons = [...lessonPath.lessons]
      .sort((a, b) => a.order - b.order)
      .map((lesson) => ({
        _id: lesson._id,
        title: lesson.title,
        type: lesson.type,
        order: lesson.order,
        xpReward: lesson.xpReward,
        unlockRequirement: lesson.unlockRequirement,
        locked: req.user.xp < lesson.unlockRequirement,
        completed: completedLessonIds.has(lesson._id.toString()),
      }));

    res.status(200).json({
      _id: lessonPath._id,
      title: lessonPath.title,
      nativeLanguage: lessonPath.nativeLanguage,
      targetLanguage: lessonPath.targetLanguage,
      iconType: lessonPath.iconType,
      order: lessonPath.order,
      lessons,
    });
  } catch (err) {
    next(err);
  }
};

export const getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('vocabulary');

    if (!lesson) {
      res.status(404);
      throw new Error('Lesson not found');
    }

    res.status(200).json(lesson);
  } catch (err) {
    next(err);
  }
};

export const completeLesson = async (req, res, next) => {
  try {
    const { accuracy = 0, mistakeCount = 0, timeSpent = 0 } = req.body;

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      res.status(404);
      throw new Error('Lesson not found');
    }

    let xpEarned = lesson.xpReward;
    if (accuracy === 100 && timeSpent <= SPEED_BONUS_THRESHOLD_SECONDS) {
      xpEarned += SPEED_BONUS_XP;
    }

    const user = req.user;
    const now = new Date();
    const lastActiveDate = user.streak.lastActiveDate;

    let newStreakCount = user.streak.count || 0;
    if (isSameDay(lastActiveDate, now)) {
      // already active today - streak unchanged
    } else if (isYesterday(lastActiveDate, now)) {
      newStreakCount += 1;
    } else {
      newStreakCount = 1;
    }

    const oldLevel = user.level;
    const newXp = user.xp + xpEarned;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    const leveledUp = newLevel > oldLevel;

    user.xp = newXp;
    user.level = newLevel;
    user.streak.count = newStreakCount;
    user.streak.lastActiveDate = now;
    await user.save();

    await UserProgress.create({
      userId: user._id,
      lessonId: lesson._id,
      completedAt: now,
      accuracy,
      xpEarned,
      mistakeCount,
    });

    res.status(200).json({
      xpEarned,
      newStreak: newStreakCount,
      leveledUp,
    });
  } catch (err) {
    next(err);
  }
};
