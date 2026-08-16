// Seed script for local/dev database. Run with `npm run seed` (from backend/).
//
// Seeds:
// - 2 LessonPaths (uz -> ru, uz -> en), 5 lessons each
// - 1 full dialog lesson ("At the airport check-in counter") in the uz -> en path
// - 40 Vocabulary words (20 attached to each path's vocabulary lessons)

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import LessonPath from './models/LessonPath.js';
import Lesson from './models/Lesson.js';
import Vocabulary from './models/Vocabulary.js';

const VOCAB_WORDS = [
  { word: 'hello', uz: 'salom', ru: 'привет', en: 'hello' },
  { word: 'goodbye', uz: 'xayr', ru: 'пока', en: 'goodbye' },
  { word: 'thank you', uz: 'rahmat', ru: 'спасибо', en: 'thank you' },
  { word: 'please', uz: 'iltimos', ru: 'пожалуйста', en: 'please' },
  { word: 'yes', uz: 'ha', ru: 'да', en: 'yes' },
  { word: 'no', uz: 'yo‘q', ru: 'нет', en: 'no' },
  { word: 'water', uz: 'suv', ru: 'вода', en: 'water' },
  { word: 'food', uz: 'ovqat', ru: 'еда', en: 'food' },
  { word: 'airport', uz: 'aeroport', ru: 'аэропорт', en: 'airport' },
  { word: 'passport', uz: 'pasport', ru: 'паспорт', en: 'passport' },
  { word: 'ticket', uz: 'chipta', ru: 'билет', en: 'ticket' },
  { word: 'friend', uz: 'do‘st', ru: 'друг', en: 'friend' },
  { word: 'family', uz: 'oila', ru: 'семья', en: 'family' },
  { word: 'house', uz: 'uy', ru: 'дом', en: 'house' },
  { word: 'city', uz: 'shahar', ru: 'город', en: 'city' },
  { word: 'today', uz: 'bugun', ru: 'сегодня', en: 'today' },
  { word: 'tomorrow', uz: 'ertaga', ru: 'завтра', en: 'tomorrow' },
  { word: 'yesterday', uz: 'kecha', ru: 'вчера', en: 'yesterday' },
  { word: 'morning', uz: 'ertalab', ru: 'утро', en: 'morning' },
  { word: 'evening', uz: 'kechqurun', ru: 'вечер', en: 'evening' },
  { word: 'one', uz: 'bir', ru: 'один', en: 'one' },
  { word: 'two', uz: 'ikki', ru: 'два', en: 'two' },
  { word: 'three', uz: 'uch', ru: 'три', en: 'three' },
  { word: 'four', uz: 'to‘rt', ru: 'четыре', en: 'four' },
  { word: 'five', uz: 'besh', ru: 'пять', en: 'five' },
  { word: 'book', uz: 'kitob', ru: 'книга', en: 'book' },
  { word: 'school', uz: 'maktab', ru: 'школа', en: 'school' },
  { word: 'teacher', uz: 'o‘qituvchi', ru: 'учитель', en: 'teacher' },
  { word: 'student', uz: 'talaba', ru: 'студент', en: 'student' },
  { word: 'work', uz: 'ish', ru: 'работа', en: 'work' },
  { word: 'money', uz: 'pul', ru: 'деньги', en: 'money' },
  { word: 'time', uz: 'vaqt', ru: 'время', en: 'time' },
  { word: 'day', uz: 'kun', ru: 'день', en: 'day' },
  { word: 'night', uz: 'tun', ru: 'ночь', en: 'night' },
  { word: 'love', uz: 'sevgi', ru: 'любовь', en: 'love' },
  { word: 'happy', uz: 'baxtli', ru: 'счастливый', en: 'happy' },
  { word: 'good', uz: 'yaxshi', ru: 'хороший', en: 'good' },
  { word: 'bad', uz: 'yomon', ru: 'плохой', en: 'bad' },
  { word: 'big', uz: 'katta', ru: 'большой', en: 'big' },
  { word: 'small', uz: 'kichik', ru: 'маленький', en: 'small' },
];

const toVocabDocs = (entries) =>
  entries.map((e) => ({
    word: e.word,
    translations: { uz: e.uz, ru: e.ru, en: e.en },
    exampleSentence: '',
    audioUrl: '',
  }));

const AIRPORT_DIALOG_CONTENT = {
  scenario: 'At the airport check-in counter',
  scenes: [
    {
      speakerLine: 'Good morning! Can I see your passport and ticket, please?',
      translations: {
        uz: 'Xayrli tong! Pasport va chiptangizni ko‘rsata olasizmi?',
        ru: 'Доброе утро! Могу я увидеть ваш паспорт и билет?',
        en: 'Good morning! Can I see your passport and ticket, please?',
      },
      replyOptions: [
        { text: 'Yes, here you are.', isCorrect: true },
        { text: 'No, I am hungry.', isCorrect: false },
      ],
    },
    {
      speakerLine: 'Do you have any luggage to check in?',
      translations: {
        uz: 'Ro‘yxatdan o‘tkazadigan yukingiz bormi?',
        ru: 'У вас есть багаж для регистрации?',
        en: 'Do you have any luggage to check in?',
      },
      replyOptions: [
        { text: 'Yes, one suitcase.', isCorrect: true },
        { text: 'I like pizza.', isCorrect: false },
      ],
    },
    {
      speakerLine: 'Would you like a window or an aisle seat?',
      translations: {
        uz: 'Deraza yonidami yoki yo‘lak tomonidami, qaysi joyni istaysiz?',
        ru: 'Вы хотите место у окна или у прохода?',
        en: 'Would you like a window or an aisle seat?',
      },
      replyOptions: [
        { text: 'A window seat, please.', isCorrect: true },
        { text: 'The weather is nice today.', isCorrect: false },
      ],
    },
    {
      speakerLine: 'Your flight boards at gate 12. Here is your boarding pass.',
      translations: {
        uz: 'Reysingiz 12-eshikdan chiqadi. Mana chiptangiz (boarding pass).',
        ru: 'Ваш рейс вылетает у выхода 12. Вот ваш посадочный талон.',
        en: 'Your flight boards at gate 12. Here is your boarding pass.',
      },
      replyOptions: [
        { text: 'Thank you very much.', isCorrect: true },
        { text: 'I do not have a passport.', isCorrect: false },
      ],
    },
    {
      speakerLine: 'Have a pleasant flight!',
      translations: {
        uz: 'Yoqimli parvoz tilayman!',
        ru: 'Приятного полёта!',
        en: 'Have a pleasant flight!',
      },
      replyOptions: [
        { text: 'Thank you, goodbye!', isCorrect: true },
        { text: 'Where is the bathroom?', isCorrect: false },
      ],
    },
  ],
};

const run = async () => {
  await connectDB();

  console.log('Clearing existing lesson data...');
  await Promise.all([
    LessonPath.deleteMany({}),
    Lesson.deleteMany({}),
    Vocabulary.deleteMany({}),
  ]);

  const ruVocabDocs = await Vocabulary.insertMany(toVocabDocs(VOCAB_WORDS.slice(0, 20)));
  const enVocabDocs = await Vocabulary.insertMany(toVocabDocs(VOCAB_WORDS.slice(20, 40)));

  const ruPathId = new mongoose.Types.ObjectId();
  const enPathId = new mongoose.Types.ObjectId();

  // ---- uz -> ru path ----
  const ruLessons = await Lesson.insertMany([
    {
      lessonPath: ruPathId,
      title: 'Basic Greetings',
      type: 'vocabulary',
      order: 0,
      xpReward: 15,
      unlockRequirement: 0,
      content: { instructions: 'Learn how to greet people in Russian.' },
      vocabulary: ruVocabDocs.slice(0, 10).map((v) => v._id),
    },
    {
      lessonPath: ruPathId,
      title: 'Everyday Words',
      type: 'vocabulary',
      order: 1,
      xpReward: 15,
      unlockRequirement: 20,
      content: { instructions: 'Common everyday vocabulary.' },
      vocabulary: ruVocabDocs.slice(10, 20).map((v) => v._id),
    },
    {
      lessonPath: ruPathId,
      title: 'Numbers & Time',
      type: 'listening',
      order: 2,
      xpReward: 20,
      unlockRequirement: 50,
      content: { instructions: 'Listen and identify numbers and time expressions in Russian.' },
      vocabulary: [],
    },
    {
      lessonPath: ruPathId,
      title: 'City Life Dialog',
      type: 'dialog',
      order: 3,
      xpReward: 25,
      unlockRequirement: 90,
      content: {
        scenario: 'Asking for directions in the city',
        scenes: [
          {
            speakerLine: 'Excuse me, where is the nearest bus stop?',
            translations: {
              uz: 'Kechirasiz, eng yaqin avtobus bekati qayerda?',
              ru: 'Извините, где ближайшая автобусная остановка?',
              en: 'Excuse me, where is the nearest bus stop?',
            },
            replyOptions: [
              { text: 'It is two blocks from here.', isCorrect: true },
              { text: 'I love reading books.', isCorrect: false },
            ],
          },
          {
            speakerLine: 'Thank you! How much is a ticket?',
            translations: {
              uz: 'Rahmat! Chipta narxi qancha?',
              ru: 'Спасибо! Сколько стоит билет?',
              en: 'Thank you! How much is a ticket?',
            },
            replyOptions: [
              { text: 'It costs one dollar.', isCorrect: true },
              { text: 'The bus is red.', isCorrect: false },
            ],
          },
        ],
      },
      vocabulary: [],
    },
    {
      lessonPath: ruPathId,
      title: 'Speed Round: Ru Basics',
      type: 'speed_round',
      order: 4,
      xpReward: 30,
      unlockRequirement: 140,
      content: { instructions: 'Answer as many prompts correctly as fast as you can.' },
      vocabulary: ruVocabDocs.slice(0, 20).map((v) => v._id),
    },
  ]);

  const ruPath = await LessonPath.create({
    _id: ruPathId,
    title: 'Uzbek to Russian',
    nativeLanguage: 'uz',
    targetLanguage: 'ru',
    iconType: 'ru-flag',
    unlockRequirement: 0,
    order: 0,
    lessons: ruLessons.map((l) => l._id),
  });

  await Vocabulary.updateMany({ _id: { $in: ruVocabDocs.slice(0, 10).map((v) => v._id) } }, { lesson: ruLessons[0]._id });
  await Vocabulary.updateMany({ _id: { $in: ruVocabDocs.slice(10, 20).map((v) => v._id) } }, { lesson: ruLessons[1]._id });

  // ---- uz -> en path ----
  const enLessons = await Lesson.insertMany([
    {
      lessonPath: enPathId,
      title: 'Basic Greetings',
      type: 'vocabulary',
      order: 0,
      xpReward: 15,
      unlockRequirement: 0,
      content: { instructions: 'Learn how to greet people in English.' },
      vocabulary: enVocabDocs.slice(0, 10).map((v) => v._id),
    },
    {
      lessonPath: enPathId,
      title: 'At the Airport',
      type: 'dialog',
      order: 1,
      xpReward: 25,
      unlockRequirement: 20,
      content: AIRPORT_DIALOG_CONTENT,
      vocabulary: [],
    },
    {
      lessonPath: enPathId,
      title: 'Everyday Words',
      type: 'vocabulary',
      order: 2,
      xpReward: 15,
      unlockRequirement: 60,
      content: { instructions: 'Common everyday vocabulary.' },
      vocabulary: enVocabDocs.slice(10, 20).map((v) => v._id),
    },
    {
      lessonPath: enPathId,
      title: 'Numbers & Time',
      type: 'listening',
      order: 3,
      xpReward: 20,
      unlockRequirement: 100,
      content: { instructions: 'Listen and identify numbers and time expressions in English.' },
      vocabulary: [],
    },
    {
      lessonPath: enPathId,
      title: 'Speed Round: En Basics',
      type: 'speed_round',
      order: 4,
      xpReward: 30,
      unlockRequirement: 150,
      content: { instructions: 'Answer as many prompts correctly as fast as you can.' },
      vocabulary: enVocabDocs.slice(0, 20).map((v) => v._id),
    },
  ]);

  const enPath = await LessonPath.create({
    _id: enPathId,
    title: 'Uzbek to English',
    nativeLanguage: 'uz',
    targetLanguage: 'en',
    iconType: 'en-flag',
    unlockRequirement: 0,
    order: 1,
    lessons: enLessons.map((l) => l._id),
  });

  await Vocabulary.updateMany({ _id: { $in: enVocabDocs.slice(0, 10).map((v) => v._id) } }, { lesson: enLessons[0]._id });
  await Vocabulary.updateMany({ _id: { $in: enVocabDocs.slice(10, 20).map((v) => v._id) } }, { lesson: enLessons[2]._id });

  console.log('Seed complete:');
  console.log(`  LessonPaths: 2 (uz->ru: ${ruPath._id}, uz->en: ${enPath._id})`);
  console.log(`  Lessons: ${ruLessons.length + enLessons.length}`);
  console.log(`  Vocabulary words: ${ruVocabDocs.length + enVocabDocs.length}`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
