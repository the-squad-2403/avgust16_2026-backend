// TODO: implement lesson path/progress logic against LessonPath, Lesson, UserProgress models

export const getLessonPath = async (req, res, next) => {
  // TODO: implement - return the current user's LessonPath with lesson completion state
  res.status(501).json({ message: 'Not implemented' });
};

export const getLessonById = async (req, res, next) => {
  // TODO: implement - return a single Lesson by :lessonId
  res.status(501).json({ message: 'Not implemented' });
};

export const completeLesson = async (req, res, next) => {
  // TODO: implement - record UserProgress, award xp/streak, update User
  res.status(501).json({ message: 'Not implemented' });
};
