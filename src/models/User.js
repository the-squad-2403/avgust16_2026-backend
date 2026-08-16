import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  nativeLanguage: {
    type: String,
    enum: ['uz', 'ru', 'en'],
  },
  targetLanguage: {
    type: String,
    enum: ['uz', 'ru', 'en'],
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  xp: {
    type: Number,
    default: 0,
  },
  streak: {
    count: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
    },
  },
  league: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'diamond'],
    default: 'bronze',
  },
  level: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
