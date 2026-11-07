import { LearningAreaType } from './learningItems';

export type WorksheetCategory =
  | 'ABC & Letters'
  | 'Numbers & Counting'
  | 'Shapes'
  | 'Colors'
  | 'Matching'
  | 'Animals'
  | 'Toys & Objects'
  | 'Tracing & Fine Motor'
  | 'Creative & Coloring';

export type WorksheetAgeRange =
  | 'Ages 2–3'
  | 'Ages 2–4'
  | 'Ages 3–4'
  | 'Ages 4–5'
  | 'Ages 5–6'
  | 'Ages 3–5'
  | 'Ages 4–6'
  | 'Ages 3–6';

export type WorksheetExerciseType =
  | 'letter_trace_and_find'
  | 'letter_matching'
  | 'phonics_beginning_sound'
  | 'number_trace_and_count'
  | 'count_and_circle'
  | 'ten_frames_count'
  | 'number_tracing_track'
  | 'more_or_less'
  | 'shape_hunt'
  | 'shape_trace'
  | 'shape_object_match'
  | 'shape_patterns'
  | 'color_the_object'
  | 'color_match'
  | 'color_by_number'
  | 'animal_food_match'
  | 'mom_and_baby_match'
  | 'big_vs_small'
  | 'opposites_match'
  | 'odd_one_out'
  | 'farm_animal_trace'
  | 'ocean_animal_count'
  | 'animal_homes_match'
  | 'who_can_fly'
  | 'animal_sounds'
  | 'shadow_match'
  | 'toy_match'
  | 'school_bag_sort'
  | 'morning_routine_sequence'
  | 'fruit_or_vegetable'
  | 'vehicles_road_sort'
  | 'straight_line_tracing'
  | 'wavy_line_tracing'
  | 'zigzag_line_tracing'
  | 'simple_maze'
  | 'draw_happy_face'
  | 'color_rainbow'
  | 'dot_to_dot_drawing';

export interface LetterActivityData {
  letter: string;
  letterCase: string; // e.g. "Aa"
  phonicsWord: string;
  phonicsEmoji: string;
  traceRows: string[][]; // Dotted characters
  findPictures: { emoji: string; label: string }[]; // Un-circled pictures
}

export interface MatchingActivityData {
  leftHeading?: string;
  rightHeading?: string;
  pairs: {
    leftEmoji: string;
    leftLabel: string;
    rightEmoji: string;
    rightLabel: string;
  }[]; // Note: Left & Right pairs are listed, but in UI the right side is scrambled so lines are NOT pre-drawn!
}

export interface CountingActivityData {
  rows: {
    prompt: string;
    itemEmoji: string;
    count: number;
    options: number[]; // e.g. [2, 3, 4] completely uncircled
  }[];
}

export interface ShapeActivityData {
  targetShapeName: string;
  targetEmoji: string;
  shapesGrid: { emoji: string; label: string }[]; // Mixed shapes, NONE pre-circled
}

export interface ColorActivityData {
  targetColorName: string;
  targetColorHex: string;
  svgOutlineType: 'apple' | 'sun' | 'leaf_and_wave' | 'ball' | 'butterfly' | 'rainbow' | 'face' | 'duck' | 'car' | 'flower';
  itemLabel: string;
  coloringPrompt: string;
  colorBoxes?: { colorName: string; colorHex: string; emoji: string; label: string }[];
}

export interface TracingLineData {
  lines: {
    startEmoji: string;
    startLabel: string;
    endEmoji: string;
    endLabel: string;
    lineType: 'straight' | 'wavy' | 'zigzag' | 'loops';
    pathVisual: string; // Dotted line format
  }[];
}

export interface ChoiceGridActivityData {
  instructionPrompt: string;
  items: {
    emoji: string;
    label: string;
  }[];
}

export interface SequenceActivityData {
  steps: {
    stepId: number;
    emoji: string;
    label: string;
    hint: string;
  }[];
}

export interface DrawingPromptData {
  promptTitle: string;
  promptGuidance: string;
  frameGuideEmoji: string;
  tracingHint?: string;
}

export interface WorksheetData {
  id: string;
  worksheetNumber: number; // 1 to 50
  title: string;
  category: WorksheetCategory;
  learningArea: LearningAreaType;
  ageGroup: WorksheetAgeRange;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instruction: string; // Very short instruction: "Trace the dots.", "Circle.", "Match.", "Count and circle.", "Color the outline."
  teacherGoal: string;
  exerciseType: WorksheetExerciseType;
  badgeEmoji: string;
  accentColor: string;

  letterData?: LetterActivityData;
  matchingData?: MatchingActivityData;
  countingData?: CountingActivityData;
  shapeData?: ShapeActivityData;
  colorData?: ColorActivityData;
  tracingData?: TracingLineData;
  choiceData?: ChoiceGridActivityData;
  sequenceData?: SequenceActivityData;
  drawingData?: DrawingPromptData;

  bonusPrompt?: string;
}

// =========================================================================
// 50 REAL, USABLE, UNCOMPLETED PRESCHOOL A4 WORKSHEETS
// =========================================================================

export const READY_MADE_50_WORKSHEETS: WorksheetData[] = [
  // =======================================================================
  // 1. ABC & LETTERS (Worksheets 1 to 8)
  // =======================================================================
  {
    id: 'ws-01',
    worksheetNumber: 1,
    title: "Let's Find Letter A",
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted letter A.  2. Circle the pictures that start with A.',
    teacherGoal: 'Identify Letter A and recognize beginning /a/ phonics words.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '🍎',
    accentColor: 'rose',
    letterData: {
      letter: 'A',
      letterCase: 'Aa',
      phonicsWord: 'Apple',
      phonicsEmoji: '🍎',
      traceRows: [
        ['A', 'A', 'A', 'A', 'A'],
        ['a', 'a', 'a', 'a', 'a'],
      ],
      findPictures: [
        { emoji: '🍎', label: 'Apple' },
        { emoji: '🐜', label: 'Ant' },
        { emoji: '🚗', label: 'Car' },
        { emoji: '✈️', label: 'Airplane' },
        { emoji: '🐶', label: 'Dog' },
        { emoji: '🐊', label: 'Alligator' },
      ],
    },
    bonusPrompt: 'Color the apple red with your crayon!',
  },
  {
    id: 'ws-02',
    worksheetNumber: 2,
    title: "Let's Find Letter B",
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted letter B.  2. Circle the pictures that start with B.',
    teacherGoal: 'Identify Letter B and recognize beginning /b/ phonics words.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '🐻',
    accentColor: 'sky',
    letterData: {
      letter: 'B',
      letterCase: 'Bb',
      phonicsWord: 'Bear',
      phonicsEmoji: '🐻',
      traceRows: [
        ['B', 'B', 'B', 'B', 'B'],
        ['b', 'b', 'b', 'b', 'b'],
      ],
      findPictures: [
        { emoji: '🐻', label: 'Bear' },
        { emoji: '🍌', label: 'Banana' },
        { emoji: '🐱', label: 'Cat' },
        { emoji: '⚽', label: 'Ball' },
        { emoji: '🐝', label: 'Bee' },
        { emoji: '☀️', label: 'Sun' },
      ],
    },
    bonusPrompt: 'Trace a curved bounce line under the ball!',
  },
  {
    id: 'ws-03',
    worksheetNumber: 3,
    title: "Let's Find Letter C",
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted letter C.  2. Circle the pictures that start with C.',
    teacherGoal: 'Identify Letter C and practice the /k/ initial sound.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '🐱',
    accentColor: 'amber',
    letterData: {
      letter: 'C',
      letterCase: 'Cc',
      phonicsWord: 'Cat',
      phonicsEmoji: '🐱',
      traceRows: [
        ['C', 'C', 'C', 'C', 'C'],
        ['c', 'c', 'c', 'c', 'c'],
      ],
      findPictures: [
        { emoji: '🐱', label: 'Cat' },
        { emoji: '🚗', label: 'Car' },
        { emoji: '🧁', label: 'Cupcake' },
        { emoji: '🐸', label: 'Frog' },
        { emoji: '🐮', label: 'Cow' },
        { emoji: '🍎', label: 'Apple' },
      ],
    },
    bonusPrompt: 'Draw three little whiskers on the cat!',
  },
  {
    id: 'ws-04',
    worksheetNumber: 4,
    title: "Let's Find Letter D",
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted letter D.  2. Circle the pictures that start with D.',
    teacherGoal: 'Distinguish Letter D and beginning /d/ sounds.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '🐶',
    accentColor: 'emerald',
    letterData: {
      letter: 'D',
      letterCase: 'Dd',
      phonicsWord: 'Dog',
      phonicsEmoji: '🐶',
      traceRows: [
        ['D', 'D', 'D', 'D', 'D'],
        ['d', 'd', 'd', 'd', 'd'],
      ],
      findPictures: [
        { emoji: '🐶', label: 'Dog' },
        { emoji: '🦆', label: 'Duck' },
        { emoji: '🥁', label: 'Drum' },
        { emoji: '🐬', label: 'Dolphin' },
        { emoji: '⭐', label: 'Star' },
        { emoji: '🍌', label: 'Banana' },
      ],
    },
    bonusPrompt: 'Say "Woof Woof" like a happy puppy!',
  },
  {
    id: 'ws-05',
    worksheetNumber: 5,
    title: "Let's Find Letter E",
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted letter E.  2. Circle the pictures that start with E.',
    teacherGoal: 'Recognize Letter E and short /e/ vowel sounds.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '🐘',
    accentColor: 'purple',
    letterData: {
      letter: 'E',
      letterCase: 'Ee',
      phonicsWord: 'Elephant',
      phonicsEmoji: '🐘',
      traceRows: [
        ['E', 'E', 'E', 'E', 'E'],
        ['e', 'e', 'e', 'e', 'e'],
      ],
      findPictures: [
        { emoji: '🐘', label: 'Elephant' },
        { emoji: '🥚', label: 'Egg' },
        { emoji: '✉️', label: 'Envelope' },
        { emoji: '🚗', label: 'Car' },
        { emoji: '👀', label: 'Eyes' },
        { emoji: '🌸', label: 'Flower' },
      ],
    },
    bonusPrompt: 'Draw a round egg in the empty space!',
  },
  {
    id: 'ws-06',
    worksheetNumber: 6,
    title: 'Trace Dotted Letters A to E',
    category: 'ABC & Letters',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace the dotted uppercase and lowercase letters on the lines.',
    teacherGoal: 'Practice pencil control and uppercase/lowercase letter formation.',
    exerciseType: 'letter_trace_and_find',
    badgeEmoji: '✏️',
    accentColor: 'teal',
    letterData: {
      letter: 'A-E',
      letterCase: 'Aa Bb Cc Dd Ee',
      phonicsWord: 'Alphabet Practice',
      phonicsEmoji: '🔤',
      traceRows: [
        ['A a', 'B b', 'C c', 'D d', 'E e'],
        ['A a', 'B b', 'C c', 'D d', 'E e'],
        ['A a', 'B b', 'C c', 'D d', 'E e'],
      ],
      findPictures: [],
    },
    bonusPrompt: 'Put a star next to your neatest traced letter!',
  },
  {
    id: 'ws-07',
    worksheetNumber: 7,
    title: 'Match Big & Small Letters',
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each big letter to its small letter.',
    teacherGoal: 'Associate capital letters with their corresponding lowercase forms.',
    exerciseType: 'letter_matching',
    badgeEmoji: '🔤',
    accentColor: 'indigo',
    matchingData: {
      leftHeading: 'Big Letters',
      rightHeading: 'Small Letters',
      pairs: [
        { leftEmoji: 'A', leftLabel: 'Big Letter A', rightEmoji: 'c', rightLabel: 'Small c' },
        { leftEmoji: 'B', leftLabel: 'Big Letter B', rightEmoji: 'a', rightLabel: 'Small a' },
        { leftEmoji: 'C', leftLabel: 'Big Letter C', rightEmoji: 'e', rightLabel: 'Small e' },
        { leftEmoji: 'D', leftLabel: 'Big Letter D', rightEmoji: 'b', rightLabel: 'Small b' },
        { leftEmoji: 'E', leftLabel: 'Big Letter E', rightEmoji: 'd', rightLabel: 'Small d' },
      ],
    },
    bonusPrompt: 'Say each letter out loud as you connect the dots!',
  },
  {
    id: 'ws-08',
    worksheetNumber: 8,
    title: 'Beginning Sound Phonics',
    category: 'ABC & Letters',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 4–6',
    difficulty: 'Intermediate',
    instruction: 'Look at the picture. Circle the correct starting letter.',
    teacherGoal: 'Strengthen letter-sound association for initial phonemes.',
    exerciseType: 'phonics_beginning_sound',
    badgeEmoji: '🗣️',
    accentColor: 'rose',
    choiceData: {
      instructionPrompt: 'Circle the starting letter for each picture:',
      items: [
        { emoji: '🍎', label: 'Apple  —>  ( A )   ( B )   ( C )' },
        { emoji: '🐻', label: 'Bear   —>  ( A )   ( B )   ( C )' },
        { emoji: '🐱', label: 'Cat    —>  ( B )   ( C )   ( D )' },
        { emoji: '🐶', label: 'Dog    —>  ( C )   ( D )   ( E )' },
      ],
    },
    bonusPrompt: 'Can you name another word that starts with B?',
  },

  // =======================================================================
  // 2. NUMBERS & COUNTING (Worksheets 9 to 16)
  // =======================================================================
  {
    id: 'ws-09',
    worksheetNumber: 9,
    title: 'Trace & Count: 1 and 2',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–4',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted numbers 1 and 2.  2. Count and color the pictures.',
    teacherGoal: 'Form numbers 1 and 2 and associate with quantity.',
    exerciseType: 'number_trace_and_count',
    badgeEmoji: '1️⃣',
    accentColor: 'emerald',
    countingData: {
      rows: [
        { prompt: 'Trace 1 & Count: 1 Sun', itemEmoji: '☀️', count: 1, options: [1, 2, 3] },
        { prompt: 'Trace 2 & Count: 2 Ducks', itemEmoji: '🦆', count: 2, options: [1, 2, 3] },
      ],
    },
    bonusPrompt: 'Color the sun yellow and the ducks yellow!',
  },
  {
    id: 'ws-10',
    worksheetNumber: 10,
    title: 'Trace & Count: 3 and 4',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–4',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted numbers 3 and 4.  2. Count and color the pictures.',
    teacherGoal: 'Form numbers 3 and 4 and practice counting sets.',
    exerciseType: 'number_trace_and_count',
    badgeEmoji: '3️⃣',
    accentColor: 'teal',
    countingData: {
      rows: [
        { prompt: 'Trace 3 & Count: 3 Apples', itemEmoji: '🍎', count: 3, options: [2, 3, 4] },
        { prompt: 'Trace 4 & Count: 4 Stars', itemEmoji: '⭐', count: 4, options: [3, 4, 5] },
      ],
    },
    bonusPrompt: 'Color 3 apples red with your pencil!',
  },
  {
    id: 'ws-11',
    worksheetNumber: 11,
    title: 'Trace & Count: Number 5',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted number 5.  2. Count and color the 5 flowers.',
    teacherGoal: 'Form number 5 and develop cardinality to 5.',
    exerciseType: 'number_trace_and_count',
    badgeEmoji: '5️⃣',
    accentColor: 'amber',
    countingData: {
      rows: [
        { prompt: 'Trace 5 & Count: 5 Garden Flowers', itemEmoji: '🌸', count: 5, options: [4, 5, 6] },
      ],
    },
    bonusPrompt: 'Trace your 5 fingers in the blank corner!',
  },
  {
    id: 'ws-12',
    worksheetNumber: 12,
    title: 'Count & Circle (1 to 5)',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Count the objects in each box. Circle the correct number.',
    teacherGoal: 'Accurately count groups up to 5 and identify written numerals.',
    exerciseType: 'count_and_circle',
    badgeEmoji: '🔢',
    accentColor: 'sky',
    countingData: {
      rows: [
        { prompt: 'Row 1: Apples', itemEmoji: '🍎', count: 3, options: [2, 3, 4] },
        { prompt: 'Row 2: Balloons', itemEmoji: '🎈', count: 4, options: [3, 4, 5] },
        { prompt: 'Row 3: Cars', itemEmoji: '🚗', count: 2, options: [1, 2, 3] },
        { prompt: 'Row 4: Stars', itemEmoji: '⭐', count: 5, options: [4, 5, 6] },
      ],
    },
    bonusPrompt: 'Point and count with your finger from 1 to 5!',
  },
  {
    id: 'ws-13',
    worksheetNumber: 13,
    title: 'Ten-Frames Counting',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 4–6',
    difficulty: 'Intermediate',
    instruction: 'Count the dots in each ten-frame. Circle the matching number.',
    teacherGoal: 'Use ten-frame visual structures to subitize and count quantities.',
    exerciseType: 'ten_frames_count',
    badgeEmoji: '🔲',
    accentColor: 'indigo',
    countingData: {
      rows: [
        { prompt: 'Ten-Frame 1', itemEmoji: '⚪', count: 3, options: [2, 3, 4] },
        { prompt: 'Ten-Frame 2', itemEmoji: '⚪', count: 5, options: [4, 5, 6] },
        { prompt: 'Ten-Frame 3', itemEmoji: '⚪', count: 2, options: [1, 2, 3] },
        { prompt: 'Ten-Frame 4', itemEmoji: '⚪', count: 4, options: [3, 4, 5] },
      ],
    },
    bonusPrompt: 'Draw 1 dot inside the empty box below!',
  },
  {
    id: 'ws-14',
    worksheetNumber: 14,
    title: 'Count & Circle (6 to 10)',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 4–6',
    difficulty: 'Intermediate',
    instruction: 'Count the objects. Circle the correct number.',
    teacherGoal: 'Extend counting skills to numbers 6 through 10.',
    exerciseType: 'count_and_circle',
    badgeEmoji: '🔟',
    accentColor: 'rose',
    countingData: {
      rows: [
        { prompt: 'Row 1: Swimming Fish', itemEmoji: '🐟', count: 6, options: [5, 6, 7] },
        { prompt: 'Row 2: Writing Pencils', itemEmoji: '✏️', count: 7, options: [6, 7, 8] },
        { prompt: 'Row 3: Sweet Strawberries', itemEmoji: '🍓', count: 8, options: [7, 8, 9] },
      ],
    },
    bonusPrompt: 'Count from 1 to 10 out loud!',
  },
  {
    id: 'ws-15',
    worksheetNumber: 15,
    title: 'Number Tracing: 1 to 5',
    category: 'Numbers & Counting',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace the dotted numbers 1, 2, 3, 4, 5 on the lines.',
    teacherGoal: 'Master correct stroke order for early numerals.',
    exerciseType: 'number_tracing_track',
    badgeEmoji: '✍️',
    accentColor: 'purple',
    choiceData: {
      instructionPrompt: 'Trace each row of dotted numbers:',
      items: [
        { emoji: '1', label: '1 ···· 1 ···· 1 ···· 1 ···· 1' },
        { emoji: '2', label: '2 ···· 2 ···· 2 ···· 2 ···· 2' },
        { emoji: '3', label: '3 ···· 3 ···· 3 ···· 3 ···· 3' },
        { emoji: '4', label: '4 ···· 4 ···· 4 ···· 4 ···· 4' },
        { emoji: '5', label: '5 ···· 5 ···· 5 ···· 5 ···· 5' },
      ],
    },
    bonusPrompt: 'Circle your favorite number!',
  },
  {
    id: 'ws-16',
    worksheetNumber: 16,
    title: 'More or Less?',
    category: 'Numbers & Counting',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Look at both boxes in each row. Circle the box with MORE objects.',
    teacherGoal: 'Compare quantities visually and understand "more".',
    exerciseType: 'more_or_less',
    badgeEmoji: '⚖️',
    accentColor: 'teal',
    matchingData: {
      leftHeading: 'Box A',
      rightHeading: 'Box B',
      pairs: [
        { leftEmoji: '⚽ ⚽', leftLabel: '2 Balls', rightEmoji: '⚽ ⚽ ⚽ ⚽', rightLabel: '4 Balls' },
        { leftEmoji: '⭐ ⭐ ⭐ ⭐ ⭐', leftLabel: '5 Stars', rightEmoji: '⭐ ⭐', rightLabel: '2 Stars' },
        { leftEmoji: '🚗', leftLabel: '1 Car', rightEmoji: '🚗 🚗 🚗', rightLabel: '3 Cars' },
      ],
    },
    bonusPrompt: 'Color the group with MORE items!',
  },

  // =======================================================================
  // 3. SHAPES (Worksheets 17 to 22)
  // =======================================================================
  {
    id: 'ws-17',
    worksheetNumber: 17,
    title: 'Shape Hunt: Find Circles',
    category: 'Shapes',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Find and CIRCLE all the CIRCLES. (Do not circle other shapes!)',
    teacherGoal: 'Identify round circular geometry among other geometric shapes.',
    exerciseType: 'shape_hunt',
    badgeEmoji: '🔴',
    accentColor: 'rose',
    shapeData: {
      targetShapeName: 'Circle (Round like a ball)',
      targetEmoji: '○',
      shapesGrid: [
        { emoji: '○', label: 'Shape 1' },
        { emoji: '□', label: 'Shape 2' },
        { emoji: '○', label: 'Shape 3' },
        { emoji: '△', label: 'Shape 4' },
        { emoji: '○', label: 'Shape 5' },
        { emoji: '⭐', label: 'Shape 6' },
      ],
    },
    bonusPrompt: 'Find something round in your room and point to it!',
  },
  {
    id: 'ws-18',
    worksheetNumber: 18,
    title: 'Shape Hunt: Find Squares',
    category: 'Shapes',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Find and CIRCLE all the SQUARES. (Do not circle other shapes!)',
    teacherGoal: 'Recognize square shapes with 4 equal sides.',
    exerciseType: 'shape_hunt',
    badgeEmoji: '🟦',
    accentColor: 'sky',
    shapeData: {
      targetShapeName: 'Square (4 equal straight sides)',
      targetEmoji: '□',
      shapesGrid: [
        { emoji: '□', label: 'Shape 1' },
        { emoji: '○', label: 'Shape 2' },
        { emoji: '□', label: 'Shape 3' },
        { emoji: '△', label: 'Shape 4' },
        { emoji: '□', label: 'Shape 5' },
        { emoji: '▭', label: 'Shape 6' },
      ],
    },
    bonusPrompt: 'Count how many corners a square has: 1, 2, 3, 4!',
  },
  {
    id: 'ws-19',
    worksheetNumber: 19,
    title: 'Shape Hunt: Find Triangles',
    category: 'Shapes',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Find and CIRCLE all the TRIANGLES.',
    teacherGoal: 'Identify 3-sided triangles.',
    exerciseType: 'shape_hunt',
    badgeEmoji: '🔺',
    accentColor: 'amber',
    shapeData: {
      targetShapeName: 'Triangle (3 sides and 3 sharp points)',
      targetEmoji: '△',
      shapesGrid: [
        { emoji: '△', label: 'Shape 1' },
        { emoji: '□', label: 'Shape 2' },
        { emoji: '△', label: 'Shape 3' },
        { emoji: '○', label: 'Shape 4' },
        { emoji: '△', label: 'Shape 5' },
        { emoji: '⭐', label: 'Shape 6' },
      ],
    },
    bonusPrompt: 'Draw a small triangle with 3 straight lines!',
  },
  {
    id: 'ws-20',
    worksheetNumber: 20,
    title: 'Trace Dotted Shapes',
    category: 'Shapes',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace along the dotted lines of each shape.',
    teacherGoal: 'Develop pencil precision tracing geometric outlines.',
    exerciseType: 'shape_trace',
    badgeEmoji: '📐',
    accentColor: 'teal',
    choiceData: {
      instructionPrompt: 'Trace each dotted shape:',
      items: [
        { emoji: '⭕', label: 'Dotted Circle (Start at top dot and curve around)' },
        { emoji: '⏹️', label: 'Dotted Square (4 straight lines)' },
        { emoji: '▲', label: 'Dotted Triangle (3 straight lines)' },
        { emoji: '▭', label: 'Dotted Rectangle (2 long lines, 2 short lines)' },
      ],
    },
    bonusPrompt: 'Color inside each traced shape with a different crayon!',
  },
  {
    id: 'ws-21',
    worksheetNumber: 21,
    title: 'Match Shapes to Real Objects',
    category: 'Shapes',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each shape to its real object.',
    teacherGoal: 'Connect abstract 2D geometry to everyday real-world items.',
    exerciseType: 'shape_object_match',
    badgeEmoji: '🧩',
    accentColor: 'indigo',
    matchingData: {
      leftHeading: 'Shape',
      rightHeading: 'Real Object',
      pairs: [
        { leftEmoji: '○', leftLabel: 'Circle', rightEmoji: '🎁', rightLabel: 'Gift Box' },
        { leftEmoji: '□', leftLabel: 'Square', rightEmoji: '🍕', rightLabel: 'Pizza Slice' },
        { leftEmoji: '△', leftLabel: 'Triangle', rightEmoji: '⚽', rightLabel: 'Ball' },
        { leftEmoji: '⭐', leftLabel: 'Star', rightEmoji: '🌟', rightLabel: 'Night Star' },
      ],
    },
    bonusPrompt: 'What shape is a slice of pizza? Triangle!',
  },
  {
    id: 'ws-22',
    worksheetNumber: 22,
    title: 'Complete Shape Patterns',
    category: 'Shapes',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–5',
    difficulty: 'Intermediate',
    instruction: 'Look at the shape pattern. Draw the missing shape inside the empty box [ ? ].',
    teacherGoal: 'Recognize AB and ABC repeating patterns and draw next item.',
    exerciseType: 'shape_patterns',
    badgeEmoji: '📊',
    accentColor: 'emerald',
    choiceData: {
      instructionPrompt: 'Draw the shape that comes next in the empty box:',
      items: [
        { emoji: '○  □  ○  □', label: 'Pattern 1:  [  ?  ]' },
        { emoji: '△  ○  △  ○', label: 'Pattern 2:  [  ?  ]' },
        { emoji: '□  △  □  △', label: 'Pattern 3:  [  ?  ]' },
        { emoji: '○  ○  □  ○  ○', label: 'Pattern 4:  [  ?  ]' },
      ],
    },
    bonusPrompt: 'Say the patterns aloud: Circle, Square, Circle, Square...',
  },

  // =======================================================================
  // 4. COLORS (Worksheets 23 to 27)
  // =======================================================================
  {
    id: 'ws-23',
    worksheetNumber: 23,
    title: 'Color the Apple RED',
    category: 'Colors',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 2–4',
    difficulty: 'Beginner',
    instruction: 'Color the apple outline RED. Color the leaf GREEN.',
    teacherGoal: 'Identify red and practice coloring inside large simple borders.',
    exerciseType: 'color_the_object',
    badgeEmoji: '🍎',
    accentColor: 'rose',
    colorData: {
      targetColorName: 'RED',
      targetColorHex: '#ef4444',
      svgOutlineType: 'apple',
      itemLabel: 'Empty Apple Outline',
      coloringPrompt: 'Use your red crayon to color the inside of the apple!',
      colorBoxes: [
        { colorName: 'Red Crayon', colorHex: '#ef4444', emoji: '🖍️', label: 'Color Apple RED' },
        { colorName: 'Green Crayon', colorHex: '#10b981', emoji: '🖍️', label: 'Color Leaf GREEN' },
      ],
    },
    bonusPrompt: 'Find something in your classroom that is red!',
  },
  {
    id: 'ws-24',
    worksheetNumber: 24,
    title: 'Color the Sun YELLOW',
    category: 'Colors',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 2–4',
    difficulty: 'Beginner',
    instruction: 'Color the smiling sun and its rays bright YELLOW.',
    teacherGoal: 'Identify yellow and practice broad stroke hand control.',
    exerciseType: 'color_the_object',
    badgeEmoji: '☀️',
    accentColor: 'amber',
    colorData: {
      targetColorName: 'YELLOW',
      targetColorHex: '#f59e0b',
      svgOutlineType: 'sun',
      itemLabel: 'Empty Sun Outline',
      coloringPrompt: 'Color inside the sun circle and along the rays with yellow!',
      colorBoxes: [
        { colorName: 'Yellow Crayon', colorHex: '#f59e0b', emoji: '🖍️', label: 'Color Sun YELLOW' },
      ],
    },
    bonusPrompt: 'Give the sun two rosy cheeks with a pink crayon!',
  },
  {
    id: 'ws-25',
    worksheetNumber: 25,
    title: 'Color: Green Leaf & Blue Wave',
    category: 'Colors',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Color the leaf GREEN.  2. Color the ocean wave BLUE.',
    teacherGoal: 'Differentiate between green and blue nature colors.',
    exerciseType: 'color_the_object',
    badgeEmoji: '🍃',
    accentColor: 'teal',
    colorData: {
      targetColorName: 'GREEN & BLUE',
      targetColorHex: '#10b981',
      svgOutlineType: 'leaf_and_wave',
      itemLabel: 'Empty Leaf & Wave Outlines',
      coloringPrompt: 'Leaf = GREEN • Wave = BLUE',
      colorBoxes: [
        { colorName: 'Green', colorHex: '#10b981', emoji: '🍃', label: 'Leaf (Green)' },
        { colorName: 'Blue', colorHex: '#3b82f6', emoji: '🌊', label: 'Wave (Blue)' },
      ],
    },
    bonusPrompt: 'Have you seen blue ocean water before?',
  },
  {
    id: 'ws-26',
    worksheetNumber: 26,
    title: 'Match Colors to Objects',
    category: 'Colors',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each color box to the object that is that color.',
    teacherGoal: 'Form visual associations between color names and real-world items.',
    exerciseType: 'color_match',
    badgeEmoji: '🎨',
    accentColor: 'purple',
    matchingData: {
      leftHeading: 'Color Word',
      rightHeading: 'Object',
      pairs: [
        { leftEmoji: '🔴', leftLabel: 'RED', rightEmoji: '🍌', rightLabel: 'Banana' },
        { leftEmoji: '🟡', leftLabel: 'YELLOW', rightEmoji: '🌊', rightLabel: 'Ocean' },
        { leftEmoji: '🔵', leftLabel: 'BLUE', rightEmoji: '🍃', rightLabel: 'Leaf' },
        { leftEmoji: '🟢', leftLabel: 'GREEN', rightEmoji: '🍎', rightLabel: 'Apple' },
      ],
    },
    bonusPrompt: 'Say the 4 colors in order: Red, Yellow, Blue, Green!',
  },
  {
    id: 'ws-27',
    worksheetNumber: 27,
    title: 'Color by Number (1, 2, 3)',
    category: 'Colors',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 4–6',
    difficulty: 'Intermediate',
    instruction: 'Color the butterfly using the number code: 1 = Red, 2 = Yellow, 3 = Blue.',
    teacherGoal: 'Follow simple visual keys and number-color coding rules.',
    exerciseType: 'color_by_number',
    badgeEmoji: '🖍️',
    accentColor: 'indigo',
    colorData: {
      targetColorName: 'Color By Number',
      targetColorHex: '#6366f1',
      svgOutlineType: 'butterfly',
      itemLabel: 'Butterfly with Numbers 1, 2, 3 in wings',
      coloringPrompt: 'Number Code: [ 1 = 🔴 Red ]  [ 2 = 🟡 Yellow ]  [ 3 = 🔵 Blue ]',
      colorBoxes: [
        { colorName: '1 = Red', colorHex: '#ef4444', emoji: '1️⃣', label: 'Color section 1 RED' },
        { colorName: '2 = Yellow', colorHex: '#f59e0b', emoji: '2️⃣', label: 'Color section 2 YELLOW' },
        { colorName: '3 = Blue', colorHex: '#3b82f6', emoji: '3️⃣', label: 'Color section 3 BLUE' },
      ],
    },
    bonusPrompt: 'Flap your arms like a colorful butterfly!',
  },

  // =======================================================================
  // 5. MATCHING & LOGIC (Worksheets 28 to 32)
  // =======================================================================
  {
    id: 'ws-28',
    worksheetNumber: 28,
    title: 'Match Animals to Food',
    category: 'Matching',
    learningArea: 'Everyday Knowledge',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each animal to what it eats.',
    teacherGoal: 'Understand biological needs and animal diet associations.',
    exerciseType: 'animal_food_match',
    badgeEmoji: '🥕',
    accentColor: 'emerald',
    matchingData: {
      leftHeading: 'Animal',
      rightHeading: 'Favorite Food',
      pairs: [
        { leftEmoji: '🐱', leftLabel: 'Cat', rightEmoji: '🥕', rightLabel: 'Carrot' },
        { leftEmoji: '🐰', leftLabel: 'Rabbit', rightEmoji: '🍌', rightLabel: 'Banana' },
        { leftEmoji: '🐶', leftLabel: 'Dog', rightEmoji: '🥛', rightLabel: 'Milk / Fish' },
        { leftEmoji: '🐵', leftLabel: 'Monkey', rightEmoji: '🦴', rightLabel: 'Bone' },
      ],
    },
    bonusPrompt: 'Make the sound of your favorite animal!',
  },
  {
    id: 'ws-29',
    worksheetNumber: 29,
    title: 'Match Moms & Babies',
    category: 'Matching',
    learningArea: 'Logic & Classification',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each mother animal to her baby.',
    teacherGoal: 'Recognize animal families and vocabulary (puppy, kitten, duckling, calf).',
    exerciseType: 'mom_and_baby_match',
    badgeEmoji: '🐣',
    accentColor: 'rose',
    matchingData: {
      leftHeading: 'Mother Animal',
      rightHeading: 'Baby Animal',
      pairs: [
        { leftEmoji: '🐶', leftLabel: 'Dog (Mom)', rightEmoji: '🐈', rightLabel: 'Kitten' },
        { leftEmoji: '🐱', leftLabel: 'Cat (Mom)', rightEmoji: '🐂', rightLabel: 'Calf' },
        { leftEmoji: '🦆', leftLabel: 'Duck (Mom)', rightEmoji: '🐕', rightLabel: 'Puppy' },
        { leftEmoji: '🐮', leftLabel: 'Cow (Mom)', rightEmoji: '🐥', rightLabel: 'Duckling' },
      ],
    },
    bonusPrompt: 'What do you call a baby duck? A duckling!',
  },
  {
    id: 'ws-30',
    worksheetNumber: 30,
    title: 'Big vs Small Sorting',
    category: 'Matching',
    learningArea: 'Focus & Observation',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Look at both objects in each row. CIRCLE the BIG object.',
    teacherGoal: 'Differentiate scale (big vs small) and comparative sizes.',
    exerciseType: 'big_vs_small',
    badgeEmoji: '🐘',
    accentColor: 'sky',
    matchingData: {
      leftHeading: 'Item 1',
      rightHeading: 'Item 2',
      pairs: [
        { leftEmoji: '🐻', leftLabel: 'Big Bear', rightEmoji: '🧸', rightLabel: 'Small Teddy' },
        { leftEmoji: '🎾', leftLabel: 'Small Ball', rightEmoji: '⚽', rightLabel: 'Big Soccer Ball' },
        { leftEmoji: '🍎', leftLabel: 'Big Apple', rightEmoji: '🍒', rightLabel: 'Small Cherry' },
      ],
    },
    bonusPrompt: 'Stretch your arms wide to show how BIG you are!',
  },
  {
    id: 'ws-31',
    worksheetNumber: 31,
    title: 'Opposites Match',
    category: 'Matching',
    learningArea: 'Logic & Classification',
    ageGroup: 'Ages 4–6',
    difficulty: 'Intermediate',
    instruction: 'Draw a line to match the opposite pairs.',
    teacherGoal: 'Understand opposite pairs (hot/cold, day/night, big/small, happy/sad).',
    exerciseType: 'opposites_match',
    badgeEmoji: '🌓',
    accentColor: 'indigo',
    matchingData: {
      leftHeading: 'Item',
      rightHeading: 'Opposite',
      pairs: [
        { leftEmoji: '☀️', leftLabel: 'Hot (Sun)', rightEmoji: '🌙', rightLabel: 'Night (Moon)' },
        { leftEmoji: '🌞', leftLabel: 'Day (Sun)', rightEmoji: '🍦', rightLabel: 'Cold (Ice Cream)' },
        { leftEmoji: '🐘', leftLabel: 'Big (Elephant)', rightEmoji: '😢', rightLabel: 'Sad' },
        { leftEmoji: '😊', leftLabel: 'Happy', rightEmoji: '🐭', rightLabel: 'Small (Mouse)' },
      ],
    },
    bonusPrompt: 'Show a happy face, then a silly face!',
  },
  {
    id: 'ws-32',
    worksheetNumber: 32,
    title: 'Find the Odd One Out',
    category: 'Matching',
    learningArea: 'Focus & Observation',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Look at each row. Circle the ONE picture that is DIFFERENT.',
    teacherGoal: 'Develop visual discrimination and pattern difference detection.',
    exerciseType: 'odd_one_out',
    badgeEmoji: '🔍',
    accentColor: 'amber',
    choiceData: {
      instructionPrompt: 'Circle the picture that does not belong in each row:',
      items: [
        { emoji: '🍎   🍎   🍌   🍎', label: 'Row 1 (Which one is different?)' },
        { emoji: '🚗   🚗   🚗   ✈️', label: 'Row 2 (Which one is different?)' },
        { emoji: '🐱   🐱   🐶   🐱', label: 'Row 3 (Which one is different?)' },
        { emoji: '⭐   ⭐   🔴   ⭐', label: 'Row 4 (Which one is different?)' },
      ],
    },
    bonusPrompt: 'Tell your teacher why that item is different!',
  },

  // =======================================================================
  // 6. ANIMALS & NATURE (Worksheets 33 to 38)
  // =======================================================================
  {
    id: 'ws-33',
    worksheetNumber: 33,
    title: 'Farm Animals: Trace Names',
    category: 'Animals',
    learningArea: 'Everyday Knowledge',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Trace the dotted names of the farm animals.  2. Color your favorite animal.',
    teacherGoal: 'Identify domestic farm animals and practice tracing animal names.',
    exerciseType: 'farm_animal_trace',
    badgeEmoji: '🐮',
    accentColor: 'emerald',
    choiceData: {
      instructionPrompt: 'Trace the dotted animal names:',
      items: [
        { emoji: '🐮', label: 'Cow  ······  C - O - W' },
        { emoji: '🐷', label: 'Pig  ······  P - I - G' },
        { emoji: '🐑', label: 'Sheep ······ S - H - E - E - P' },
        { emoji: '🐔', label: 'Hen  ······  H - E - N' },
      ],
    },
    bonusPrompt: 'Which farm animal goes "Oink Oink"?',
  },
  {
    id: 'ws-34',
    worksheetNumber: 34,
    title: 'Ocean Animal Count',
    category: 'Animals',
    learningArea: 'Early Math',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Count the ocean animals. Circle the correct number.',
    teacherGoal: 'Count marine creatures and practice one-to-one correspondence.',
    exerciseType: 'ocean_animal_count',
    badgeEmoji: '🐬',
    accentColor: 'sky',
    countingData: {
      rows: [
        { prompt: 'Row 1: Playful Dolphins', itemEmoji: '🐬', count: 3, options: [2, 3, 4] },
        { prompt: 'Row 2: Little Crabs', itemEmoji: '🦀', count: 4, options: [3, 4, 5] },
        { prompt: 'Row 3: Swimming Fish', itemEmoji: '🐟', count: 5, options: [4, 5, 6] },
      ],
    },
    bonusPrompt: 'Draw wavy blue water lines under the fish!',
  },
  {
    id: 'ws-35',
    worksheetNumber: 35,
    title: 'Animal Homes Match',
    category: 'Animals',
    learningArea: 'Everyday Knowledge',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each animal to its home.',
    teacherGoal: 'Learn about natural habitats (nest, hive, doghouse, ocean).',
    exerciseType: 'animal_homes_match',
    badgeEmoji: '🪺',
    accentColor: 'teal',
    matchingData: {
      leftHeading: 'Animal',
      rightHeading: 'Home',
      pairs: [
        { leftEmoji: '🐦', leftLabel: 'Bird', rightEmoji: '🍯', rightLabel: 'Beehive' },
        { leftEmoji: '🐝', leftLabel: 'Bee', rightEmoji: '🌊', rightLabel: 'Water' },
        { leftEmoji: '🐶', leftLabel: 'Dog', rightEmoji: '🪺', rightLabel: 'Nest' },
        { leftEmoji: '🐟', leftLabel: 'Fish', rightEmoji: '🏠', rightLabel: 'Doghouse' },
      ],
    },
    bonusPrompt: 'Where do birds build their cozy nests? In trees!',
  },
  {
    id: 'ws-36',
    worksheetNumber: 36,
    title: 'Who Can Fly?',
    category: 'Animals',
    learningArea: 'Focus & Observation',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Look at the animals. CIRCLE all the animals that can FLY with wings.',
    teacherGoal: 'Classify animals based on physical movement and wings.',
    exerciseType: 'who_can_fly',
    badgeEmoji: '🦋',
    accentColor: 'purple',
    choiceData: {
      instructionPrompt: 'Circle ONLY the animals that fly in the sky:',
      items: [
        { emoji: '🐦', label: 'Bird' },
        { emoji: '🐘', label: 'Elephant' },
        { emoji: '🦋', label: 'Butterfly' },
        { emoji: '🐢', label: 'Turtle' },
        { emoji: '🐝', label: 'Bee' },
        { emoji: '🐶', label: 'Dog' },
      ],
    },
    bonusPrompt: 'Flap your arms like a flying bird!',
  },
  {
    id: 'ws-37',
    worksheetNumber: 37,
    title: 'Match Animal Sounds',
    category: 'Animals',
    learningArea: 'Early Literacy',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each animal to the sound it makes.',
    teacherGoal: 'Enhance phonological awareness through animal onomatopoeia.',
    exerciseType: 'animal_sounds',
    badgeEmoji: '📢',
    accentColor: 'amber',
    matchingData: {
      leftHeading: 'Animal',
      rightHeading: 'Sound',
      pairs: [
        { leftEmoji: '🐮', leftLabel: 'Cow', rightEmoji: '🎵', rightLabel: '"Woof Woof!"' },
        { leftEmoji: '🐶', leftLabel: 'Dog', rightEmoji: '🎵', rightLabel: '"Quack Quack!"' },
        { leftEmoji: '🐱', leftLabel: 'Cat', rightEmoji: '🎵', rightLabel: '"Moo Moo!"' },
        { leftEmoji: '🦆', leftLabel: 'Duck', rightEmoji: '🎵', rightLabel: '"Meow Meow!"' },
      ],
    },
    bonusPrompt: 'Make a loud "Moo" sound like a happy cow!',
  },
  {
    id: 'ws-38',
    worksheetNumber: 38,
    title: 'Match Animal Shadows',
    category: 'Animals',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match each animal to its black shadow outline.',
    teacherGoal: 'Build spatial reasoning and silhouette shape matching.',
    exerciseType: 'shadow_match',
    badgeEmoji: '👤',
    accentColor: 'indigo',
    matchingData: {
      leftHeading: 'Animal Picture',
      rightHeading: 'Black Shadow',
      pairs: [
        { leftEmoji: '🐘', leftLabel: 'Elephant', rightEmoji: '⬛', rightLabel: 'Giraffe Shadow' },
        { leftEmoji: '🦒', leftLabel: 'Giraffe', rightEmoji: '⬛', rightLabel: 'Lion Shadow' },
        { leftEmoji: '🦁', leftLabel: 'Lion', rightEmoji: '⬛', rightLabel: 'Elephant Shadow' },
        { leftEmoji: '🐒', leftLabel: 'Monkey', rightEmoji: '⬛', rightLabel: 'Monkey Shadow' },
      ],
    },
    bonusPrompt: 'Make animal shadow puppets with your hands!',
  },

  // =======================================================================
  // 7. TOYS & EVERYDAY OBJECTS (Worksheets 39 to 43)
  // =======================================================================
  {
    id: 'ws-39',
    worksheetNumber: 39,
    title: 'Match the Same Toys',
    category: 'Toys & Objects',
    learningArea: 'Everyday Knowledge',
    ageGroup: 'Ages 2–4',
    difficulty: 'Beginner',
    instruction: 'Draw a line to match the same toys in both columns.',
    teacherGoal: 'Recognize familiar playroom toys and match identical pairs.',
    exerciseType: 'toy_match',
    badgeEmoji: '🧸',
    accentColor: 'rose',
    matchingData: {
      leftHeading: 'Toy Column 1',
      rightHeading: 'Toy Column 2',
      pairs: [
        { leftEmoji: '🧸', leftLabel: 'Teddy Bear', rightEmoji: '🚗', rightLabel: 'Toy Car' },
        { leftEmoji: '⚽', leftLabel: 'Soccer Ball', rightEmoji: '🧱', rightLabel: 'Blocks' },
        { leftEmoji: '🚗', leftLabel: 'Toy Car', rightEmoji: '🧸', rightLabel: 'Teddy Bear' },
        { leftEmoji: '🧱', leftLabel: 'Blocks', rightEmoji: '⚽', rightLabel: 'Soccer Ball' },
      ],
    },
    bonusPrompt: 'Which toy is your favorite to share?',
  },
  {
    id: 'ws-40',
    worksheetNumber: 40,
    title: 'School Bag: What Goes Inside?',
    category: 'Toys & Objects',
    learningArea: 'Logic & Classification',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'CIRCLE the items that you pack inside your school bag. (Do not circle home items!)',
    teacherGoal: 'Classify school supplies vs household items.',
    exerciseType: 'school_bag_sort',
    badgeEmoji: '🎒',
    accentColor: 'sky',
    choiceData: {
      instructionPrompt: 'Circle things that belong in a preschool backpack:',
      items: [
        { emoji: '✏️', label: 'Pencil' },
        { emoji: '📚', label: 'Book' },
        { emoji: '🪥', label: 'Toothbrush' },
        { emoji: '🖍️', label: 'Crayon' },
        { emoji: '🥄', label: 'Spoon' },
        { emoji: '✂️', label: 'Safety Scissors' },
      ],
    },
    bonusPrompt: 'Color the pencil yellow with your crayon!',
  },
  {
    id: 'ws-41',
    worksheetNumber: 41,
    title: 'Morning Routine: Number 1, 2, 3',
    category: 'Toys & Objects',
    learningArea: 'Thinking & Problem Solving',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Write 1, 2, 3 in the empty circles to put the morning steps in order.',
    teacherGoal: 'Understand daily chronological sequence and personal hygiene.',
    exerciseType: 'morning_routine_sequence',
    badgeEmoji: '🌅',
    accentColor: 'amber',
    sequenceData: {
      steps: [
        { stepId: 1, emoji: '🛏️', label: 'Wake up in bed', hint: 'Write number in circle: (  )' },
        { stepId: 2, emoji: '🪥', label: 'Brush teeth clean', hint: 'Write number in circle: (  )' },
        { stepId: 3, emoji: '🥣', label: 'Eat breakfast', hint: 'Write number in circle: (  )' },
      ],
    },
    bonusPrompt: 'Give yourself a big morning stretch!',
  },
  {
    id: 'ws-42',
    worksheetNumber: 42,
    title: 'Sort Fruits & Vegetables',
    category: 'Toys & Objects',
    learningArea: 'Logic & Classification',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: '1. Circle the FRUITS in RED.  2. Circle the VEGETABLES in GREEN.',
    teacherGoal: 'Categorize healthy foods into fruits and vegetables.',
    exerciseType: 'fruit_or_vegetable',
    badgeEmoji: '🥗',
    accentColor: 'emerald',
    choiceData: {
      instructionPrompt: 'Circle Fruits in RED • Circle Veggies in GREEN:',
      items: [
        { emoji: '🍎', label: 'Apple' },
        { emoji: '🥕', label: 'Carrot' },
        { emoji: '🍌', label: 'Banana' },
        { emoji: '🥦', label: 'Broccoli' },
        { emoji: '🍓', label: 'Strawberry' },
        { emoji: '🥔', label: 'Potato' },
      ],
    },
    bonusPrompt: 'Which healthy vegetable do you like to crunch on?',
  },
  {
    id: 'ws-43',
    worksheetNumber: 43,
    title: 'Vehicles on the Road',
    category: 'Toys & Objects',
    learningArea: 'Everyday Knowledge',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'CIRCLE all the vehicles that drive on the ROAD with wheels.',
    teacherGoal: 'Identify land vehicles (car, bus, bicycle) vs air/water transport.',
    exerciseType: 'vehicles_road_sort',
    badgeEmoji: '🚗',
    accentColor: 'teal',
    choiceData: {
      instructionPrompt: 'Circle ONLY vehicles that drive on the road:',
      items: [
        { emoji: '🚗', label: 'Car' },
        { emoji: '✈️', label: 'Airplane' },
        { emoji: '🚌', label: 'School Bus' },
        { emoji: '🚢', label: 'Boat' },
        { emoji: '🚲', label: 'Bicycle' },
        { emoji: '🚀', label: 'Rocket' },
      ],
    },
    bonusPrompt: 'Honk honk! Make a friendly car horn sound!',
  },

  // =======================================================================
  // 8. TRACING & FINE MOTOR (Worksheets 44 to 47)
  // =======================================================================
  {
    id: 'ws-44',
    worksheetNumber: 44,
    title: 'Trace Straight Dotted Lines',
    category: 'Tracing & Fine Motor',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace the dotted straight lines from left to right.',
    teacherGoal: 'Strengthen hand-eye coordination with steady horizontal pencil lines.',
    exerciseType: 'straight_line_tracing',
    badgeEmoji: '📏',
    accentColor: 'rose',
    tracingData: {
      lines: [
        { startEmoji: '🚗', startLabel: 'Car', endEmoji: '🏠', endLabel: 'Home', lineType: 'straight', pathVisual: '································→' },
        { startEmoji: '🐝', startLabel: 'Bee', endEmoji: '🌸', endLabel: 'Flower', lineType: 'straight', pathVisual: '································→' },
        { startEmoji: '🚀', startLabel: 'Rocket', endEmoji: '🌙', endLabel: 'Moon', lineType: 'straight', pathVisual: '································→' },
        { startEmoji: '⚽', startLabel: 'Ball', endEmoji: '🥅', endLabel: 'Goal', lineType: 'straight', pathVisual: '································→' },
      ],
    },
    bonusPrompt: 'Keep your pencil on the line all the way to the end!',
  },
  {
    id: 'ws-45',
    worksheetNumber: 45,
    title: 'Trace Wavy Dotted Lines',
    category: 'Tracing & Fine Motor',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace along the smooth wavy dotted lines.',
    teacherGoal: 'Develop wrist flexibility and curved pre-writing strokes.',
    exerciseType: 'wavy_line_tracing',
    badgeEmoji: '〰️',
    accentColor: 'sky',
    tracingData: {
      lines: [
        { startEmoji: '🐟', startLabel: 'Fish', endEmoji: '🌊', endLabel: 'Ocean', lineType: 'wavy', pathVisual: '∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿→' },
        { startEmoji: '⛵', startLabel: 'Sailboat', endEmoji: '🏝️', endLabel: 'Island', lineType: 'wavy', pathVisual: '∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿→' },
        { startEmoji: '🐸', startLabel: 'Frog', endEmoji: '🪷', endLabel: 'Lily Pad', lineType: 'wavy', pathVisual: '∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿→' },
        { startEmoji: '🦆', startLabel: 'Duckling', endEmoji: '🌾', endLabel: 'Pond', lineType: 'wavy', pathVisual: '∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿→' },
      ],
    },
    bonusPrompt: 'Sing "Row Row Row Your Boat" while tracing the waves!',
  },
  {
    id: 'ws-46',
    worksheetNumber: 46,
    title: 'Trace Zigzag Dotted Lines',
    category: 'Tracing & Fine Motor',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Trace the sharp zigzag dotted lines: up, down, up, down!',
    teacherGoal: 'Control directional change and corner angles in writing.',
    exerciseType: 'zigzag_line_tracing',
    badgeEmoji: '⚡',
    accentColor: 'amber',
    tracingData: {
      lines: [
        { startEmoji: '⚡', startLabel: 'Lightning', endEmoji: '🏔️', endLabel: 'Mountain', lineType: 'zigzag', pathVisual: '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\→' },
        { startEmoji: '🐰', startLabel: 'Bunny', endEmoji: '🥕', endLabel: 'Carrot', lineType: 'zigzag', pathVisual: '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\→' },
        { startEmoji: '🐶', startLabel: 'Puppy', endEmoji: '🦴', endLabel: 'Bone', lineType: 'zigzag', pathVisual: '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\→' },
        { startEmoji: '🏎️', startLabel: 'Racecar', endEmoji: '🏁', endLabel: 'Finish', lineType: 'zigzag', pathVisual: '/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\→' },
      ],
    },
    bonusPrompt: 'Hop like a bunny when you reach the carrot!',
  },
  {
    id: 'ws-47',
    worksheetNumber: 47,
    title: 'Help the Puppy Maze',
    category: 'Tracing & Fine Motor',
    learningArea: 'Thinking & Problem Solving',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw a pencil line through the open path to help the puppy reach the bone.',
    teacherGoal: 'Plan spatial movement through wide, child-friendly maze boundaries.',
    exerciseType: 'simple_maze',
    badgeEmoji: '🐕',
    accentColor: 'emerald',
    drawingData: {
      promptTitle: 'Puppy to Bone Maze',
      promptGuidance: 'START at 🐶 Puppy —> Draw line through path —> FINISH at 🦴 Bone!',
      frameGuideEmoji: '🐶 🦴',
      tracingHint: 'Stay inside the paths and don’t hit the walls!',
    },
    bonusPrompt: 'Color the bone with your favorite color!',
  },

  // =======================================================================
  // 9. CREATIVE & COLORING (Worksheets 48 to 50)
  // =======================================================================
  {
    id: 'ws-48',
    worksheetNumber: 48,
    title: 'Draw a Happy Face',
    category: 'Creative & Coloring',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Draw two eyes, a nose, and a big happy smiling mouth inside the face outline!',
    teacherGoal: 'Express emotional recognition and practice facial feature placement.',
    exerciseType: 'draw_happy_face',
    badgeEmoji: '😊',
    accentColor: 'rose',
    drawingData: {
      promptTitle: 'Empty Face Outline',
      promptGuidance: 'Draw: 2 eyes 👀 • 1 nose 👃 • 1 big smile 👄 • Lovely hair!',
      frameGuideEmoji: '🙂',
      tracingHint: 'Use bright crayons to color the face!',
    },
    bonusPrompt: 'Show your happiest smile to your teacher!',
  },
  {
    id: 'ws-49',
    worksheetNumber: 49,
    title: 'Color the Rainbow Arches',
    category: 'Creative & Coloring',
    learningArea: 'Colors, Shapes & Visual Skills',
    ageGroup: 'Ages 3–5',
    difficulty: 'Beginner',
    instruction: 'Color the rainbow arches with your bright crayons!',
    teacherGoal: 'Explore color sequencing and curved color-fill coordination.',
    exerciseType: 'color_rainbow',
    badgeEmoji: '🌈',
    accentColor: 'indigo',
    colorData: {
      targetColorName: 'Rainbow Arches',
      targetColorHex: '#8b5cf6',
      svgOutlineType: 'rainbow',
      itemLabel: 'Blank Rainbow Arches over Clouds',
      coloringPrompt: 'Color each arch: Red, Orange, Yellow, Green, Blue, Purple!',
      colorBoxes: [
        { colorName: 'Red', colorHex: '#ef4444', emoji: '🔴', label: 'Top Arch' },
        { colorName: 'Yellow', colorHex: '#f59e0b', emoji: '🟡', label: 'Middle Arch' },
        { colorName: 'Blue', colorHex: '#3b82f6', emoji: '🔵', label: 'Bottom Arch' },
      ],
    },
    bonusPrompt: 'Sing: "Red and yellow and pink and green, purple and orange and blue..."',
  },
  {
    id: 'ws-50',
    worksheetNumber: 50,
    title: 'Dot-to-Dot Star (1 to 10)',
    category: 'Creative & Coloring',
    learningArea: 'Fine Motor Practice',
    ageGroup: 'Ages 3–6',
    difficulty: 'Beginner',
    instruction: '1. Connect the dots with lines from 1 to 2 to 3 ... all the way to 10!  2. Color the star.',
    teacherGoal: 'Master numerical sequencing from 1 to 10 and straight line drawing.',
    exerciseType: 'dot_to_dot_drawing',
    badgeEmoji: '🌟',
    accentColor: 'amber',
    drawingData: {
      promptTitle: 'Connect Dots 1 to 10 to Reveal the Star!',
      promptGuidance: 'Follow the numbers in order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10',
      frameGuideEmoji: '⭐',
      tracingHint: 'After connecting all dots, color your star bright yellow!',
    },
    bonusPrompt: 'You finished all 50 worksheets! Super Star award ⭐⭐⭐',
  },
];
