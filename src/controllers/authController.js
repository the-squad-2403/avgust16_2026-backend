import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User with this email already exists');
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      nativeLanguage: user.nativeLanguage,
      targetLanguage: user.targetLanguage,
      onboardingCompleted: user.onboardingCompleted,
      xp: user.xp,
      streak: user.streak,
      league: user.league,
      level: user.level,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      nativeLanguage: user.nativeLanguage,
      targetLanguage: user.targetLanguage,
      onboardingCompleted: user.onboardingCompleted,
      xp: user.xp,
      streak: user.streak,
      league: user.league,
      level: user.level,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

export const completeOnboarding = async (req, res, next) => {
  try {
    const { nativeLanguage, targetLanguage } = req.body;

    if (!nativeLanguage || !targetLanguage) {
      res.status(400);
      throw new Error('Please provide nativeLanguage and targetLanguage');
    }

    const user = req.user;
    user.nativeLanguage = nativeLanguage;
    user.targetLanguage = targetLanguage;
    user.onboardingCompleted = true;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      nativeLanguage: user.nativeLanguage,
      targetLanguage: user.targetLanguage,
      onboardingCompleted: user.onboardingCompleted,
      xp: user.xp,
      streak: user.streak,
      league: user.league,
      level: user.level,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      nativeLanguage: req.user.nativeLanguage,
      targetLanguage: req.user.targetLanguage,
      onboardingCompleted: req.user.onboardingCompleted,
      xp: req.user.xp,
      streak: req.user.streak,
      league: req.user.league,
      level: req.user.level,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};
