import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Volume2, Star as StarIcon, ArrowRight, ArrowLeft, Check, Sparkles, Sun, School, Home as HomeIcon, Moon, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface DailyRoutineProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

export type SectionType = 'morning' | 'school' | 'after_school' | 'night';

export interface RoutineStoryStep {
  id: string;
  order: number;
  section: SectionType;
  title: string;
  emoji: string;
  voiceText: string;
  displayText: string;
  bgTheme: string;
  cardBorder: string;
  actionIcon?: string;
  animationType: 'wake' | 'blanket' | 'water' | 'bath' | 'brush' | 'dress' | 'spoon' | 'shoes' | 'backpack' | 'bottle' | 'lunch' | 'hug' | 'wave' | 'walk' | 'door' | 'book' | 'play' | 'bell' | 'bus' | 'home' | 'hang' | 'rest' | 'dinner' | 'family' | 'pajamas' | 'dua' | 'sleep';
}

export interface QuizQuestion {
  id: string;
  section: SectionType;
  referenceTitle: string;
  referenceEmoji: string;
  questionText: string;
  voicePrompt: string;
  correctOptionId: string;
  options: {
    id: string;
    title: string;
    emoji: string;
    color: string;
  }[];
}

// ---------------------------------------------------------------------------
// 1. STORY LESSON DATA (Exact sequential steps as requested)
// ---------------------------------------------------------------------------

export const MORNING_STEPS: RoutineStoryStep[] = [
  {
    id: 'm_1',
    order: 1,
    section: 'morning',
    title: 'Wake Up',
    emoji: '☀️',
    voiceText: 'I wake up.',
    displayText: 'I wake up.',
    bgTheme: 'from-amber-400 to-orange-400',
    cardBorder: 'border-amber-300',
    animationType: 'wake',
  },
  {
    id: 'm_2',
    order: 2,
    section: 'morning',
    title: 'Make My Bed',
    emoji: '🛏️',
    voiceText: 'I make my bed.',
    displayText: 'I make my bed.',
    bgTheme: 'from-blue-400 to-indigo-500',
    cardBorder: 'border-blue-300',
    animationType: 'blanket',
  },
  {
    id: 'm_3',
    order: 3,
    section: 'morning',
    title: 'Go To The Bathroom',
    emoji: '🚽',
    voiceText: 'I go to the bathroom.',
    displayText: 'I go to the bathroom.',
    bgTheme: 'from-cyan-400 to-blue-500',
    cardBorder: 'border-cyan-300',
    animationType: 'water',
  },
  {
    id: 'm_4',
    order: 4,
    section: 'morning',
    title: 'Take A Bath',
    emoji: '🛁',
    voiceText: 'I take a bath.',
    displayText: 'I take a bath.',
    bgTheme: 'from-teal-400 to-cyan-500',
    cardBorder: 'border-teal-300',
    animationType: 'bath',
  },
  {
    id: 'm_5',
    order: 5,
    section: 'morning',
    title: 'Brush My Teeth',
    emoji: '🪥',
    voiceText: 'I brush my teeth.',
    displayText: 'I brush my teeth.',
    bgTheme: 'from-sky-400 to-indigo-500',
    cardBorder: 'border-sky-300',
    animationType: 'brush',
  },
  {
    id: 'm_6',
    order: 6,
    section: 'morning',
    title: 'Get Dressed',
    emoji: '👕',
    voiceText: 'I get dressed.',
    displayText: 'I get dressed.',
    bgTheme: 'from-violet-400 to-purple-500',
    cardBorder: 'border-violet-300',
    animationType: 'dress',
  },
  {
    id: 'm_7',
    order: 7,
    section: 'morning',
    title: 'Eat Breakfast',
    emoji: '🥞',
    voiceText: 'I eat breakfast.',
    displayText: 'I eat breakfast.',
    bgTheme: 'from-amber-400 to-yellow-500',
    cardBorder: 'border-amber-300',
    animationType: 'spoon',
  },
  {
    id: 'm_8',
    order: 8,
    section: 'morning',
    title: 'Put On My Shoes',
    emoji: '👟',
    voiceText: 'I put on my shoes.',
    displayText: 'I put on my shoes.',
    bgTheme: 'from-red-400 to-rose-500',
    cardBorder: 'border-rose-300',
    animationType: 'shoes',
  },
  {
    id: 'm_9',
    order: 9,
    section: 'morning',
    title: 'Pack My Backpack',
    emoji: '🎒',
    voiceText: 'I pack my backpack.',
    displayText: 'I pack my backpack.',
    bgTheme: 'from-emerald-400 to-teal-500',
    cardBorder: 'border-emerald-300',
    animationType: 'backpack',
  },
  {
    id: 'm_10',
    order: 10,
    section: 'morning',
    title: 'Take My Water Bottle',
    emoji: '🍼',
    voiceText: 'I take my water bottle.',
    displayText: 'I take my water bottle.',
    bgTheme: 'from-cyan-400 to-sky-500',
    cardBorder: 'border-cyan-300',
    animationType: 'bottle',
  },
  {
    id: 'm_11',
    order: 11,
    section: 'morning',
    title: 'Take My Lunch',
    emoji: '🍱',
    voiceText: 'I take my lunch.',
    displayText: 'I take my lunch.',
    bgTheme: 'from-amber-500 to-orange-500',
    cardBorder: 'border-amber-300',
    animationType: 'lunch',
  },
  {
    id: 'm_12',
    order: 12,
    section: 'morning',
    title: 'Give Mama A Big Hug',
    emoji: '🫂',
    voiceText: 'I give Mama a big hug.',
    displayText: 'I give Mama a big hug.',
    bgTheme: 'from-pink-400 to-rose-500',
    cardBorder: 'border-pink-300',
    animationType: 'hug',
  },
  {
    id: 'm_13',
    order: 13,
    section: 'morning',
    title: 'Say Goodbye',
    emoji: '👋',
    voiceText: 'I say goodbye.',
    displayText: 'I say goodbye.',
    bgTheme: 'from-orange-400 to-rose-400',
    cardBorder: 'border-orange-300',
    animationType: 'wave',
  },
  {
    id: 'm_14',
    order: 14,
    section: 'morning',
    title: 'Go To School',
    emoji: '🏫',
    voiceText: 'I go to school.',
    displayText: 'I go to school.',
    bgTheme: 'from-emerald-500 to-green-600',
    cardBorder: 'border-emerald-300',
    animationType: 'walk',
  },
];

export const SCHOOL_STEPS: RoutineStoryStep[] = [
  {
    id: 's_1',
    order: 1,
    section: 'school',
    title: 'Go To School',
    emoji: '🏫',
    voiceText: 'I go to school.',
    displayText: 'I go to school.',
    bgTheme: 'from-emerald-400 to-teal-500',
    cardBorder: 'border-emerald-300',
    animationType: 'walk',
  },
  {
    id: 's_2',
    order: 2,
    section: 'school',
    title: 'Go To Class',
    emoji: '🚪',
    voiceText: 'I go to class.',
    displayText: 'I go to class.',
    bgTheme: 'from-sky-400 to-blue-500',
    cardBorder: 'border-sky-300',
    animationType: 'door',
  },
  {
    id: 's_3',
    order: 3,
    section: 'school',
    title: 'Learn',
    emoji: '📚',
    voiceText: 'I learn and read.',
    displayText: 'I learn and read.',
    bgTheme: 'from-indigo-400 to-purple-500',
    cardBorder: 'border-indigo-300',
    animationType: 'book',
  },
  {
    id: 's_4',
    order: 4,
    section: 'school',
    title: 'Play',
    emoji: '🎨',
    voiceText: 'I play with friends.',
    displayText: 'I play with friends.',
    bgTheme: 'from-amber-400 to-orange-500',
    cardBorder: 'border-amber-300',
    animationType: 'play',
  },
  {
    id: 's_5',
    order: 5,
    section: 'school',
    title: 'Eat Lunch',
    emoji: '🥪',
    voiceText: 'I eat my lunch.',
    displayText: 'I eat my lunch.',
    bgTheme: 'from-orange-400 to-amber-500',
    cardBorder: 'border-orange-300',
    animationType: 'spoon',
  },
  {
    id: 's_6',
    order: 6,
    section: 'school',
    title: 'School Ends',
    emoji: '🔔',
    voiceText: 'School ends.',
    displayText: 'School ends.',
    bgTheme: 'from-purple-400 to-violet-500',
    cardBorder: 'border-purple-300',
    animationType: 'bell',
  },
  {
    id: 's_7',
    order: 7,
    section: 'school',
    title: 'Go Back Home',
    emoji: '🚌',
    voiceText: 'I go back home.',
    displayText: 'I go back home.',
    bgTheme: 'from-teal-400 to-emerald-500',
    cardBorder: 'border-teal-300',
    animationType: 'bus',
  },
];

export const AFTER_SCHOOL_STEPS: RoutineStoryStep[] = [
  {
    id: 'as_1',
    order: 1,
    section: 'after_school',
    title: 'Come Home',
    emoji: '🏠',
    voiceText: 'I come home.',
    displayText: 'I come home.',
    bgTheme: 'from-emerald-400 to-teal-500',
    cardBorder: 'border-emerald-300',
    animationType: 'home',
  },
  {
    id: 'as_2',
    order: 2,
    section: 'after_school',
    title: 'Put My Backpack Away',
    emoji: '🎒',
    voiceText: 'I put my backpack away.',
    displayText: 'I put my backpack away.',
    bgTheme: 'from-sky-400 to-blue-500',
    cardBorder: 'border-sky-300',
    animationType: 'hang',
  },
  {
    id: 'as_3',
    order: 3,
    section: 'after_school',
    title: 'Change My Clothes',
    emoji: '👕',
    voiceText: 'I change my clothes.',
    displayText: 'I change my clothes.',
    bgTheme: 'from-blue-400 to-indigo-500',
    cardBorder: 'border-blue-300',
    animationType: 'dress',
  },
  {
    id: 'as_4',
    order: 4,
    section: 'after_school',
    title: 'Eat Lunch',
    emoji: '🍲',
    voiceText: 'I eat my lunch.',
    displayText: 'I eat my lunch.',
    bgTheme: 'from-orange-400 to-amber-500',
    cardBorder: 'border-orange-300',
    animationType: 'spoon',
  },
  {
    id: 'as_5',
    order: 5,
    section: 'after_school',
    title: 'Rest With Mama',
    emoji: '🛌',
    voiceText: 'I rest with Mama.',
    displayText: 'I rest with Mama.',
    bgTheme: 'from-pink-400 to-rose-400',
    cardBorder: 'border-pink-300',
    animationType: 'rest',
  },
  {
    id: 'as_6',
    order: 6,
    section: 'after_school',
    title: 'Wake Up',
    emoji: '☀️',
    voiceText: 'I wake up.',
    displayText: 'I wake up.',
    bgTheme: 'from-amber-400 to-yellow-500',
    cardBorder: 'border-amber-300',
    animationType: 'wake',
  },
  {
    id: 'as_7',
    order: 7,
    section: 'after_school',
    title: 'Play With Toys',
    emoji: '🧸',
    voiceText: 'I play with my toys.',
    displayText: 'I play with my toys.',
    bgTheme: 'from-violet-400 to-purple-500',
    cardBorder: 'border-violet-300',
    animationType: 'play',
  },
  {
    id: 'as_8',
    order: 8,
    section: 'after_school',
    title: 'Eat Dinner',
    emoji: '🍽️',
    voiceText: 'I eat dinner.',
    displayText: 'I eat dinner.',
    bgTheme: 'from-rose-400 to-red-500',
    cardBorder: 'border-rose-300',
    animationType: 'dinner',
  },
  {
    id: 'as_9',
    order: 9,
    section: 'after_school',
    title: 'Spend Time With Mama & Papa',
    emoji: '👨‍👩‍👧',
    voiceText: 'I spend time with Mama and Papa.',
    displayText: 'I spend time with Mama and Papa.',
    bgTheme: 'from-purple-400 to-indigo-500',
    cardBorder: 'border-purple-300',
    animationType: 'family',
  },
];

export const NIGHT_STEPS: RoutineStoryStep[] = [
  {
    id: 'n_1',
    order: 1,
    section: 'night',
    title: 'Change Into Pajamas',
    emoji: '🩱',
    voiceText: 'I put on my pajamas.',
    displayText: 'I put on my pajamas.',
    bgTheme: 'from-indigo-500 to-blue-600',
    cardBorder: 'border-indigo-400',
    animationType: 'pajamas',
  },
  {
    id: 'n_2',
    order: 2,
    section: 'night',
    title: 'Brush My Teeth',
    emoji: '🪥',
    voiceText: 'I brush my teeth.',
    displayText: 'I brush my teeth.',
    bgTheme: 'from-sky-500 to-blue-600',
    cardBorder: 'border-sky-400',
    animationType: 'brush',
  },
  {
    id: 'n_3',
    order: 3,
    section: 'night',
    title: 'Bedtime Story',
    emoji: '📖',
    voiceText: 'I listen to a bedtime story.',
    displayText: 'I listen to a bedtime story.',
    bgTheme: 'from-purple-500 to-indigo-600',
    cardBorder: 'border-purple-400',
    animationType: 'book',
  },
  {
    id: 'n_4',
    order: 4,
    section: 'night',
    title: 'Make Dua',
    emoji: '🤲',
    voiceText: 'I make my dua.',
    displayText: 'I make my dua.',
    bgTheme: 'from-teal-500 to-emerald-600',
    cardBorder: 'border-teal-400',
    animationType: 'dua',
  },
  {
    id: 'n_5',
    order: 5,
    section: 'night',
    title: 'Go To Sleep',
    emoji: '😴',
    voiceText: 'I go to sleep.',
    displayText: 'I go to sleep.',
    bgTheme: 'from-slate-700 to-slate-900',
    cardBorder: 'border-slate-500',
    animationType: 'sleep',
  },
];

export const ALL_SECTIONS = [
  { id: 'morning', label: 'MORNING', icon: Sun, color: 'text-amber-500', steps: MORNING_STEPS },
  { id: 'school', label: 'SCHOOL', icon: School, color: 'text-blue-500', steps: SCHOOL_STEPS },
  { id: 'after_school', label: 'AFTER SCHOOL', icon: HomeIcon, color: 'text-emerald-500', steps: AFTER_SCHOOL_STEPS },
  { id: 'night', label: 'NIGHT', icon: Moon, color: 'text-indigo-500', steps: NIGHT_STEPS },
];

// ---------------------------------------------------------------------------
// 2. QUIZ QUESTIONS ("WHAT DO YOU DO AFTER...?")
// ---------------------------------------------------------------------------

interface BaseQuizQuestionItem {
  id: string;
  section: SectionType;
  referenceTitle: string;
  referenceEmoji: string;
  questionText: string;
  voicePrompt: string;
  correctOptionId: string;
  correctOption: { id: string; title: string; emoji: string; color: string };
  distractorOptions: { id: string; title: string; emoji: string; color: string }[];
}

const BASE_QUIZ_QUESTIONS: BaseQuizQuestionItem[] = [
  // MORNING
  {
    id: 'q1',
    section: 'morning',
    referenceTitle: 'Waking Up',
    referenceEmoji: '☀️',
    questionText: 'What do you do after waking up?',
    voicePrompt: 'What do you do after waking up?',
    correctOptionId: 'make_bed',
    correctOption: { id: 'make_bed', title: 'Make My Bed', emoji: '🛏️', color: 'bg-blue-500' },
    distractorOptions: [
      { id: 'eat_breakfast', title: 'Eat Breakfast', emoji: '🥞', color: 'bg-amber-500' },
      { id: 'pack_backpack', title: 'Pack Backpack', emoji: '🎒', color: 'bg-emerald-500' },
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-teal-500' },
    ],
  },
  {
    id: 'q2',
    section: 'morning',
    referenceTitle: 'Making Your Bed',
    referenceEmoji: '🛏️',
    questionText: 'What do you do after making your bed?',
    voicePrompt: 'What do you do after making your bed?',
    correctOptionId: 'bathroom',
    correctOption: { id: 'bathroom', title: 'Go To Bathroom', emoji: '🚽', color: 'bg-cyan-500' },
    distractorOptions: [
      { id: 'put_shoes', title: 'Put On Shoes', emoji: '👟', color: 'bg-rose-500' },
      { id: 'pack_lunch', title: 'Take My Lunch', emoji: '🍱', color: 'bg-orange-500' },
      { id: 'say_goodbye', title: 'Say Goodbye', emoji: '👋', color: 'bg-pink-500' },
    ],
  },
  {
    id: 'q3',
    section: 'morning',
    referenceTitle: 'Taking A Bath',
    referenceEmoji: '🛁',
    questionText: 'What do you do after taking a bath?',
    voicePrompt: 'What do you do after taking a bath?',
    correctOptionId: 'brush_teeth',
    correctOption: { id: 'brush_teeth', title: 'Brush My Teeth', emoji: '🪥', color: 'bg-sky-500' },
    distractorOptions: [
      { id: 'go_sleep', title: 'Go To Sleep', emoji: '😴', color: 'bg-slate-700' },
      { id: 'play_toys', title: 'Play With Toys', emoji: '🧸', color: 'bg-violet-500' },
      { id: 'eat_dinner', title: 'Eat Dinner', emoji: '🍽️', color: 'bg-red-500' },
    ],
  },
  {
    id: 'q4',
    section: 'morning',
    referenceTitle: 'Getting Dressed',
    referenceEmoji: '👕',
    questionText: 'What do you do after getting dressed?',
    voicePrompt: 'What do you do after getting dressed?',
    correctOptionId: 'eat_breakfast',
    correctOption: { id: 'eat_breakfast', title: 'Eat Breakfast', emoji: '🥞', color: 'bg-amber-500' },
    distractorOptions: [
      { id: 'bedtime_story', title: 'Bedtime Story', emoji: '📖', color: 'bg-purple-600' },
      { id: 'go_sleep', title: 'Go To Sleep', emoji: '😴', color: 'bg-slate-700' },
      { id: 'take_bath', title: 'Take A Bath', emoji: '🛁', color: 'bg-teal-500' },
    ],
  },
  {
    id: 'q5',
    section: 'morning',
    referenceTitle: 'Saying Goodbye',
    referenceEmoji: '👋',
    questionText: 'What do you do after saying goodbye?',
    voicePrompt: 'What do you do after saying goodbye?',
    correctOptionId: 'go_school',
    correctOption: { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
    distractorOptions: [
      { id: 'make_bed', title: 'Make My Bed', emoji: '🛏️', color: 'bg-blue-500' },
      { id: 'put_pajamas', title: 'Put On Pajamas', emoji: '🩱', color: 'bg-indigo-600' },
      { id: 'take_bath', title: 'Take A Bath', emoji: '🛁', color: 'bg-teal-500' },
    ],
  },

  // SCHOOL
  {
    id: 'q6',
    section: 'school',
    referenceTitle: 'Coming To School',
    referenceEmoji: '🏫',
    questionText: 'What do you do after coming to school?',
    voicePrompt: 'What do you do after coming to school?',
    correctOptionId: 'go_class',
    correctOption: { id: 'go_class', title: 'Go To Class', emoji: '🚪', color: 'bg-sky-500' },
    distractorOptions: [
      { id: 'eat_dinner', title: 'Eat Dinner', emoji: '🍽️', color: 'bg-rose-500' },
      { id: 'go_sleep', title: 'Go To Sleep', emoji: '😴', color: 'bg-slate-700' },
      { id: 'take_bath', title: 'Take A Bath', emoji: '🛁', color: 'bg-teal-500' },
    ],
  },
  {
    id: 'q7',
    section: 'school',
    referenceTitle: 'Going To Class',
    referenceEmoji: '🚪',
    questionText: 'What do you do after going to class?',
    voicePrompt: 'What do you do after going to class?',
    correctOptionId: 'learn_read',
    correctOption: { id: 'learn_read', title: 'Learn & Read', emoji: '📚', color: 'bg-indigo-500' },
    distractorOptions: [
      { id: 'make_bed', title: 'Make My Bed', emoji: '🛏️', color: 'bg-blue-500' },
      { id: 'go_sleep', title: 'Go To Sleep', emoji: '😴', color: 'bg-slate-700' },
      { id: 'put_pajamas', title: 'Put On Pajamas', emoji: '🩱', color: 'bg-indigo-600' },
    ],
  },
  {
    id: 'q8',
    section: 'school',
    referenceTitle: 'School Ending',
    referenceEmoji: '🔔',
    questionText: 'What do you do after school ends?',
    voicePrompt: 'What do you do after school ends?',
    correctOptionId: 'go_home',
    correctOption: { id: 'go_home', title: 'Go Back Home', emoji: '🚌', color: 'bg-teal-500' },
    distractorOptions: [
      { id: 'brush_teeth', title: 'Brush Teeth', emoji: '🪥', color: 'bg-sky-500' },
      { id: 'wake_up', title: 'Wake Up', emoji: '☀️', color: 'bg-amber-500' },
      { id: 'take_bath', title: 'Take A Bath', emoji: '🛁', color: 'bg-cyan-500' },
    ],
  },

  // AFTER SCHOOL
  {
    id: 'q9',
    section: 'after_school',
    referenceTitle: 'Coming Home',
    referenceEmoji: '🏠',
    questionText: 'What do you do after coming home?',
    voicePrompt: 'What do you do after coming home?',
    correctOptionId: 'put_backpack_away',
    correctOption: { id: 'put_backpack_away', title: 'Put Backpack Away', emoji: '🎒', color: 'bg-sky-500' },
    distractorOptions: [
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
      { id: 'eat_breakfast', title: 'Eat Breakfast', emoji: '🥞', color: 'bg-amber-500' },
      { id: 'wake_up', title: 'Wake Up', emoji: '☀️', color: 'bg-yellow-500' },
    ],
  },
  {
    id: 'q10',
    section: 'after_school',
    referenceTitle: 'Playing With Toys',
    referenceEmoji: '🧸',
    questionText: 'What do you do after playing with toys?',
    voicePrompt: 'What do you do after playing with toys?',
    correctOptionId: 'eat_dinner',
    correctOption: { id: 'eat_dinner', title: 'Eat Dinner', emoji: '🍽️', color: 'bg-rose-500' },
    distractorOptions: [
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
      { id: 'make_bed', title: 'Make My Bed', emoji: '🛏️', color: 'bg-blue-500' },
      { id: 'pack_backpack', title: 'Pack Backpack', emoji: '🎒', color: 'bg-teal-500' },
    ],
  },
  {
    id: 'q11',
    section: 'after_school',
    referenceTitle: 'Eating Dinner',
    referenceEmoji: '🍽️',
    questionText: 'What do you do after eating dinner?',
    voicePrompt: 'What do you do after eating dinner?',
    correctOptionId: 'family_time',
    correctOption: { id: 'family_time', title: 'Time With Family', emoji: '👨‍👩‍👧', color: 'bg-purple-500' },
    distractorOptions: [
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
      { id: 'eat_breakfast', title: 'Eat Breakfast', emoji: '🥞', color: 'bg-amber-500' },
      { id: 'take_bath', title: 'Take A Bath', emoji: '🛁', color: 'bg-cyan-500' },
    ],
  },

  // NIGHT
  {
    id: 'q12',
    section: 'night',
    referenceTitle: 'Putting On Pajamas',
    referenceEmoji: '🩱',
    questionText: 'What do you do after putting on pajamas?',
    voicePrompt: 'What do you do after putting on your pajamas?',
    correctOptionId: 'night_brush_teeth',
    correctOption: { id: 'night_brush_teeth', title: 'Brush My Teeth', emoji: '🪥', color: 'bg-sky-500' },
    distractorOptions: [
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
      { id: 'eat_breakfast', title: 'Eat Breakfast', emoji: '🥞', color: 'bg-amber-500' },
      { id: 'pack_backpack', title: 'Pack Backpack', emoji: '🎒', color: 'bg-teal-500' },
    ],
  },
  {
    id: 'q13',
    section: 'night',
    referenceTitle: 'Your Bedtime Story',
    referenceEmoji: '📖',
    questionText: 'What do you do after your bedtime story?',
    voicePrompt: 'What do you do after your bedtime story?',
    correctOptionId: 'make_dua',
    correctOption: { id: 'make_dua', title: 'Make Dua', emoji: '🤲', color: 'bg-teal-600' },
    distractorOptions: [
      { id: 'play_toys', title: 'Play Outside', emoji: '⚽', color: 'bg-amber-500' },
      { id: 'eat_lunch', title: 'Eat Lunch', emoji: '🥪', color: 'bg-orange-500' },
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
    ],
  },
  {
    id: 'q14',
    section: 'night',
    referenceTitle: 'Making Dua',
    referenceEmoji: '🤲',
    questionText: 'What do you do after making dua?',
    voicePrompt: 'What do you do after making dua?',
    correctOptionId: 'go_sleep',
    correctOption: { id: 'go_sleep', title: 'Go To Sleep', emoji: '😴', color: 'bg-slate-700' },
    distractorOptions: [
      { id: 'eat_dinner', title: 'Eat Dinner', emoji: '🍽️', color: 'bg-rose-500' },
      { id: 'go_school', title: 'Go To School', emoji: '🏫', color: 'bg-emerald-600' },
      { id: 'put_shoes', title: 'Put On Shoes', emoji: '👟', color: 'bg-red-500' },
    ],
  },
];

function shuffleOptions(items: { id: string; title: string; emoji: string; color: string }[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateQuizData(): QuizQuestion[] {
  return BASE_QUIZ_QUESTIONS.map((q) => ({
    id: q.id,
    section: q.section,
    referenceTitle: q.referenceTitle,
    referenceEmoji: q.referenceEmoji,
    questionText: q.questionText,
    voicePrompt: q.voicePrompt,
    correctOptionId: q.correctOptionId,
    options: shuffleOptions([q.correctOption, ...q.distractorOptions]),
  }));
}

// Flat list of all 35 story steps in exact sequence
const ALL_STORY_STEPS: RoutineStoryStep[] = [
  ...MORNING_STEPS,
  ...SCHOOL_STEPS,
  ...AFTER_SCHOOL_STEPS,
  ...NIGHT_STEPS,
];

export const DailyRoutine: React.FC<DailyRoutineProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted = false,
}) => {
  // Activity phase: 'story' | 'section_transition' | 'story_end' | 'quiz' | 'completed'
  const [phase, setPhase] = useState<'story' | 'section_transition' | 'story_end' | 'quiz' | 'completed'>('story');

  // Story state
  const [storyIndex, setStoryIndex] = useState(0);
  const [transitionMsg, setTransitionMsg] = useState('');
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [autoProgressKey, setAutoProgressKey] = useState(0);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => generateQuizData());
  const [quizIndex, setQuizIndex] = useState(0);
  const [shakingOptionId, setShakingOptionId] = useState<string | null>(null);
  const [selectedCorrectId, setSelectedCorrectId] = useState<string | null>(null);

  const currentStoryStep = ALL_STORY_STEPS[storyIndex] || ALL_STORY_STEPS[0];
  const currentQuiz = quizQuestions[quizIndex] || quizQuestions[0];

  // ---------------------------------------------------------------------------
  // 3-SECOND AUTO ADVANCE LOGIC FOR STORY LESSON
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'story') {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      return;
    }

    // 1. Play natural voice
    soundManager.speak(currentStoryStep.voiceText);

    // 2. Start fresh 3-second auto advance timer
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    autoAdvanceTimerRef.current = setTimeout(() => {
      handleAdvanceStory();
    }, 3000);

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [storyIndex, phase]);

  // Voice for Quiz questions
  useEffect(() => {
    if (phase === 'quiz' && currentQuiz) {
      soundManager.speak(currentQuiz.voicePrompt);
    }
  }, [quizIndex, phase]);

  // Advance Story Step (either manual via Next button or 3-second timer)
  const handleAdvanceStory = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    const nextIdx = storyIndex + 1;

    // Check if Morning finished (index 13)
    if (storyIndex === 13) {
      setTransitionMsg('MORNING DONE! 🌞');
      setPhase('section_transition');
      soundManager.speak('Morning is done! Now it is school time.');
      setTimeout(() => {
        setStoryIndex(nextIdx);
        setAutoProgressKey((k) => k + 1);
        setPhase('story');
      }, 1500);
      return;
    }

    // Check if School finished (index 13 + 7 = 20)
    if (storyIndex === 20) {
      setTransitionMsg('TIME TO GO HOME! 🏫');
      setPhase('section_transition');
      soundManager.speak('School is done! Time to go home.');
      setTimeout(() => {
        setStoryIndex(nextIdx);
        setAutoProgressKey((k) => k + 1);
        setPhase('story');
      }, 1500);
      return;
    }

    // Check if After School finished (index 20 + 9 = 29)
    if (storyIndex === 29) {
      setTransitionMsg("IT'S BEDTIME! 🌙");
      setPhase('section_transition');
      soundManager.speak("It's bedtime now.");
      setTimeout(() => {
        setStoryIndex(nextIdx);
        setAutoProgressKey((k) => k + 1);
        setPhase('story');
      }, 1500);
      return;
    }

    // Check if All 35 steps finished
    if (nextIdx >= ALL_STORY_STEPS.length) {
      setPhase('story_end');
      soundManager.playCelebration();
      soundManager.speak("Great! Now let's see what you remember.");
      setTimeout(() => {
        setQuizQuestions(generateQuizData());
        setQuizIndex(0);
        setPhase('quiz');
      }, 2000);
      return;
    }

    // Standard next step
    setStoryIndex(nextIdx);
    setAutoProgressKey((k) => k + 1);
  };

  // Previous Story Step
  const handlePrevStory = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    if (storyIndex > 0) {
      soundManager.playPop();
      setStoryIndex((prev) => prev - 1);
      setAutoProgressKey((k) => k + 1);
    }
  };

  // Switch to Quiz Mode
  const handleStartQuiz = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    soundManager.playPop();
    setQuizQuestions(generateQuizData());
    setQuizIndex(0);
    setSelectedCorrectId(null);
    setShakingOptionId(null);
    setPhase('quiz');
    soundManager.speak("What do you do after? Let's take the daily routine quiz!");
  };

  // Switch back to Story Mode
  const handleBackToStory = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    soundManager.playPop();
    setPhase('story');
    soundManager.speak("Let's review our daily routine.");
  };

  // Previous Quiz Question
  const handlePrevQuiz = () => {
    if (quizIndex > 0) {
      soundManager.playPop();
      setSelectedCorrectId(null);
      setShakingOptionId(null);
      setQuizIndex((prev) => prev - 1);
    }
  };

  // Next Quiz Question
  const handleNextQuiz = () => {
    if (quizIndex + 1 < quizQuestions.length) {
      soundManager.playPop();
      setSelectedCorrectId(null);
      setShakingOptionId(null);
      setQuizIndex((prev) => prev + 1);
    } else {
      onCollectStar();
      setPhase('completed');
      soundManager.playCelebration();
      soundManager.speak('You know your daily routine! Great job!');
    }
  };

  // Handle Quiz Option Selection
  const handleQuizAnswer = (optionId: string) => {
    if (selectedCorrectId !== null || phase !== 'quiz') return;

    if (optionId === currentQuiz.correctOptionId) {
      // CORRECT - Play reinforcement chime & praise
      setSelectedCorrectId(optionId);
      soundManager.playSuccess();
      soundManager.speak('Great job!');

      setTimeout(() => {
        if (quizIndex + 1 >= quizQuestions.length) {
          // Finished Quiz!
          onCollectStar();
          setPhase('completed');
          soundManager.playCelebration();
          soundManager.speak('You know your daily routine! Great job!');
        } else {
          setSelectedCorrectId(null);
          setQuizIndex((prev) => prev + 1);
        }
      }, 1200);
    } else {
      // WRONG - Gentle non-scary prompt
      soundManager.playError();
      soundManager.speak('Try again!');
      setShakingOptionId(optionId);
      setTimeout(() => {
        setShakingOptionId(null);
      }, 500);
    }
  };

  // Replay activity
  const handlePlayAgain = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    soundManager.speak('Let us practice our daily routine!');
    setStoryIndex(0);
    setAutoProgressKey((k) => k + 1);
    setQuizIndex(0);
    setSelectedCorrectId(null);
    setShakingOptionId(null);
    setQuizQuestions(generateQuizData());
    setPhase('story');
  };

  // Current active section for indicator
  const activeSectionId = currentStoryStep.section;

  // Custom mild action animation for illustration
  const renderActionAnimation = (type: RoutineStoryStep['animationType']) => {
    switch (type) {
      case 'wake':
        return (
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'brush':
        return (
          <motion.div
            animate={{ rotate: [-6, 6, -6], x: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'spoon':
        return (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'wave':
        return (
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'hug':
        return (
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'book':
        return (
          <motion.div
            animate={{ rotateY: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'dua':
        return (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      case 'sleep':
        return (
          <motion.div
            animate={{ opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
      default:
        return (
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl select-none drop-shadow-md"
          >
            {currentStoryStep.emoji}
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER: Clean Title, Star Status & Mode Switcher                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white border-4 border-amber-300 rounded-3xl px-4 sm:px-6 py-2.5 shadow-md mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl sm:text-3xl">📅</span>
          <div>
            <h1 className="text-base sm:text-xl font-black text-amber-950 tracking-tight leading-tight">
              MY DAILY ROUTINE
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-amber-700">
              {phase === 'quiz'
                ? `What Do You Do After? • Question ${quizIndex + 1} of ${quizQuestions.length}`
                : `Learn My Day • Step ${storyIndex + 1} of ${ALL_STORY_STEPS.length}`}
            </p>
          </div>
        </div>

        {/* Mode Switcher & Star Badge */}
        <div className="flex items-center gap-2">
          {/* Quick Mode Toggle */}
          <div className="flex items-center bg-amber-100 p-1 rounded-2xl border border-amber-300">
            <button
              type="button"
              onClick={handleBackToStory}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                phase !== 'quiz'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-amber-800 hover:bg-amber-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>STORY</span>
            </button>
            <button
              type="button"
              onClick={handleStartQuiz}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                phase === 'quiz'
                  ? 'bg-purple-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-200/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>QUIZ</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-100 border-2 border-amber-300 px-3.5 py-1 rounded-full text-amber-900 font-black text-xs sm:text-sm">
            <StarIcon className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{isActivityCompleted || phase === 'completed' ? '⭐ COMPLETED' : '1 STAR'}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN ACTIVITY STAGE                                                 */}
      {/* ------------------------------------------------------------------- */}
      <div className="w-full bg-gradient-to-br from-amber-50 via-sky-50 to-teal-50 border-4 border-amber-400 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-between min-h-[550px] relative overflow-hidden">
        
        {/* ================================================================= */}
        {/* PART 1: LEARN MY DAY (ONE STEP AT A TIME WITH 3S AUTO-ADVANCE)    */}
        {/* ================================================================= */}
        {phase === 'story' && (
          <div className="w-full flex flex-col items-center justify-between flex-1">
            {/* Section Progress Indicator Bar */}
            <div className="w-full flex items-center justify-center gap-1 sm:gap-2 mb-2 bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-full border-2 border-amber-200 shadow-xs max-w-xl">
              {ALL_SECTIONS.map((sec, idx) => {
                const isActive = sec.id === activeSectionId;
                const IconComponent = sec.icon;
                return (
                  <React.Fragment key={sec.id}>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all ${
                        isActive
                          ? 'bg-amber-400 text-amber-950 shadow-xs scale-105 ring-2 ring-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-amber-950' : 'text-slate-400'}`} />
                      <span>{sec.label}</span>
                    </div>
                    {idx < ALL_SECTIONS.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* 3-Second Auto-Advance Countdown Bar */}
            <div className="w-full max-w-xs h-1.5 bg-amber-100 rounded-full overflow-hidden mb-3 border border-amber-200">
              <motion.div
                key={`auto_bar_${autoProgressKey}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>

            {/* Large Single Illustrated Routine Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`story_step_${currentStoryStep.id}`}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -10 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-md bg-white border-4 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col items-center text-center my-auto relative"
              >
                {/* Section Step Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                    {currentStoryStep.section.replace('_', ' ')} • STEP {currentStoryStep.order}
                  </span>
                  <button
                    type="button"
                    onClick={() => soundManager.speak(currentStoryStep.voiceText)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-1.5 rounded-full border border-amber-300 transition-colors cursor-pointer"
                    title="Hear voice again"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Large Beautiful Illustration Area */}
                <div
                  className={`w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br ${currentStoryStep.bgTheme} border-4 border-white shadow-xl flex items-center justify-center mb-4 relative overflow-hidden`}
                >
                  {renderActionAnimation(currentStoryStep.animationType)}
                </div>

                {/* Clear Narrative Text */}
                <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight leading-snug">
                  "{currentStoryStep.displayText}"
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Controls Bar: [ PREV ] [ QUIZ ] [ NEXT ] */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2.5 mt-4">
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevStory}
                disabled={storyIndex === 0}
                className={`flex items-center justify-center gap-1.5 font-black text-sm sm:text-base py-3.5 px-3 rounded-2xl border-b-6 shadow-md transition-all uppercase tracking-wide ${
                  storyIndex === 0
                    ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
                    : 'bg-[#F7D060] hover:bg-amber-400 text-amber-950 border-[#CA8A04] active:border-b-2 active:translate-y-1 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>Prev</span>
              </button>

              {/* Quiz Quick Jump Button */}
              <button
                type="button"
                onClick={handleStartQuiz}
                className="flex items-center justify-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white font-black text-sm sm:text-base py-3.5 px-3 rounded-2xl border-b-6 border-purple-700 shadow-md active:border-b-2 active:translate-y-1 transition-all cursor-pointer uppercase tracking-wide"
              >
                <HelpCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Quiz</span>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleAdvanceStory}
                className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base py-3.5 px-3 rounded-2xl border-b-6 border-emerald-700 shadow-md active:border-b-2 active:translate-y-1 transition-all cursor-pointer uppercase tracking-wide"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* SECTION TRANSITION TOAST / BANNER                                 */}
        {/* ================================================================= */}
        {phase === 'section_transition' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="bg-white border-6 border-amber-400 rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-sm w-full animate-bounce">
              <span className="text-6xl mb-3">⭐</span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                {transitionMsg}
              </h2>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* STORY END TRANSITION BANNER                                       */}
        {/* ================================================================= */}
        {phase === 'story_end' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="bg-white border-6 border-amber-400 rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-md w-full">
              <span className="text-6xl mb-3">🌟</span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight mb-2">
                GREAT JOB!
              </h2>
              <p className="text-base sm:text-lg font-bold text-amber-800">
                Now let's see what you remember!
              </p>
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* PART 2: DAILY ROUTINE QUIZ ("WHAT DO YOU DO AFTER...?")          */}
        {/* ================================================================= */}
        {phase === 'quiz' && currentQuiz && (
          <div className="w-full flex flex-col items-center justify-between flex-1">
            {/* Top Prompt Header */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 bg-white px-5 sm:px-7 py-2 rounded-full border-4 border-amber-300 shadow-md">
                <button
                  type="button"
                  onClick={() => soundManager.speak(currentQuiz.voicePrompt)}
                  className="text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
                  title="Repeat question"
                >
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <h2 className="text-base sm:text-xl font-black text-amber-950 tracking-tight">
                  {currentQuiz.questionText}
                </h2>
              </div>
            </div>

            {/* Center Reference Card */}
            <div className="w-full max-w-xs bg-white border-4 border-amber-300 rounded-3xl p-3 sm:p-4 shadow-lg flex flex-col items-center text-center my-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                AFTER THIS:
              </span>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-amber-400 border-3 border-white shadow-md flex items-center justify-center mb-1.5">
                <span className="text-5xl sm:text-6xl drop-shadow-md select-none">
                  {currentQuiz.referenceEmoji}
                </span>
              </div>
              <span className="text-base font-black text-amber-950">
                {currentQuiz.referenceTitle}
              </span>
            </div>

            {/* Large Shuffled Picture Answer Cards (3 or 4) */}
            <div className="w-full max-w-2xl mt-3 mb-1">
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 bg-white/70 backdrop-blur-xs rounded-3xl border-3 border-amber-200 shadow-inner">
                {currentQuiz.options.map((opt) => {
                  const isShaking = shakingOptionId === opt.id;
                  const isCorrectSelected = selectedCorrectId === opt.id;

                  return (
                    <motion.button
                      key={`quiz_opt_${opt.id}`}
                      type="button"
                      onClick={() => handleQuizAnswer(opt.id)}
                      disabled={selectedCorrectId !== null}
                      animate={
                        isShaking
                          ? { x: [-8, 8, -8, 8, 0] }
                          : isCorrectSelected
                          ? { scale: 1.08 }
                          : { scale: 1 }
                      }
                      transition={{ duration: isShaking ? 0.4 : 0.2 }}
                      className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-b-6 shadow-md select-none cursor-pointer active:scale-95 touch-none transition-all ${
                        opt.color
                      } border-black/20 text-white ${
                        isCorrectSelected
                          ? 'ring-4 ring-white ring-offset-2 ring-offset-amber-500 scale-105'
                          : 'hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl drop-shadow-md mb-1.5">
                        {opt.emoji}
                      </span>
                      <span className="font-black text-xs sm:text-sm tracking-wide text-center leading-tight">
                        {opt.title}
                      </span>

                      {isCorrectSelected && (
                        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Navigation Controls: [ PREV ] [ STORY ] [ NEXT ] */}
            <div className="w-full max-w-md grid grid-cols-3 gap-2.5 mt-3">
              <button
                type="button"
                onClick={handlePrevQuiz}
                disabled={quizIndex === 0}
                className={`flex items-center justify-center gap-1.5 font-black text-sm sm:text-base py-3 px-3 rounded-2xl border-b-6 shadow-md transition-all uppercase tracking-wide ${
                  quizIndex === 0
                    ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
                    : 'bg-[#F7D060] hover:bg-amber-400 text-amber-950 border-[#CA8A04] active:border-b-2 active:translate-y-1 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={handleBackToStory}
                className="flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm sm:text-base py-3 px-3 rounded-2xl border-b-6 border-amber-600 shadow-md active:border-b-2 active:translate-y-1 transition-all cursor-pointer uppercase tracking-wide"
              >
                <BookOpen className="w-4 h-4 stroke-[2.5]" />
                <span>Story</span>
              </button>

              <button
                type="button"
                onClick={handleNextQuiz}
                className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base py-3 px-3 rounded-2xl border-b-6 border-emerald-700 shadow-md active:border-b-2 active:translate-y-1 transition-all cursor-pointer uppercase tracking-wide"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* COMPLETION CELEBRATION MODAL OVERLAY                              */}
        {/* ================================================================= */}
        <AnimatePresence>
          {phase === 'completed' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-white/95 backdrop-blur-sm p-4"
            >
              <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-8 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full">
                <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🌟</div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
                  AMAZING JOB!
                </h3>
                <p className="text-base font-bold text-amber-800 mt-2 mb-4">
                  You know your daily routine from morning to night!
                </p>

                <div className="flex items-center gap-2 bg-amber-200 border-2 border-amber-400 px-4 py-2 rounded-full font-black text-amber-950 text-base mb-6">
                  <StarIcon className="w-6 h-6 fill-amber-400 text-amber-600" />
                  <span>STAR EARNED!</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    type="button"
                    onClick={handlePlayAgain}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black py-3.5 px-6 rounded-2xl border-b-6 border-amber-600 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <RotateCcw className="w-5 h-5 stroke-[3]" />
                    <span>Play Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateNext) onNavigateNext();
                      else if (onNavigateHome) onNavigateHome();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl border-b-6 border-emerald-700 shadow-lg active:border-b-2 active:translate-y-1 transition-all cursor-pointer text-base uppercase"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* STANDARD BOTTOM NAVIGATION: [ PREV ] [ HOME ] [ NEXT ]              */}
      {/* ------------------------------------------------------------------- */}
      <ActivityBottomNav
        onNavigatePrev={onNavigatePrev}
        onNavigateHome={onNavigateHome}
        onNavigateNext={onNavigateNext}
        isNextUnlocked={isActivityCompleted || phase === 'completed'}
      />
    </div>
  );
};
