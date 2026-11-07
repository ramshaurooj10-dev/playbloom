// Data pool of associative pairs for "What Comes Together?" Preschool Activity

export interface PairItem {
  id: string;
  name: string;
  emoji: string;
  label: string;
  color: string; // Tailwind background gradient or color theme
  borderColor: string;
  tag: string;
}

export interface RelatedPair {
  id: string;
  tier: 'easy' | 'medium' | 'hard';
  category: 'daily_routine' | 'food_kitchen' | 'art_school' | 'clothing_body' | 'nature_animals' | 'home_play';
  prompt: PairItem;
  correct: PairItem;
  promptQuestion: string; // e.g. "What comes together with the toothbrush?"
  successVoice: string; // e.g. "Yes! Toothbrush and toothpaste go together!"
  whyVoice?: string; // Optional educational tidbit
}

export const RELATED_PAIRS_POOL: RelatedPair[] = [
  // ==========================================
  // TIER: EASY (Very clear, daily familiar objects)
  // ==========================================
  {
    id: 'toothbrush_toothpaste',
    tier: 'easy',
    category: 'daily_routine',
    prompt: {
      id: 'toothbrush',
      name: 'Toothbrush',
      emoji: '🪥',
      label: 'Toothbrush',
      color: 'from-sky-100 to-blue-200',
      borderColor: 'border-sky-400',
      tag: 'Morning routine',
    },
    correct: {
      id: 'toothpaste',
      name: 'Toothpaste',
      emoji: '🧴',
      label: 'Toothpaste',
      color: 'from-cyan-100 to-teal-200',
      borderColor: 'border-cyan-400',
      tag: 'To clean teeth',
    },
    promptQuestion: 'What comes together with the toothbrush?',
    successVoice: 'Yes! Toothbrush and toothpaste go together!',
    whyVoice: 'Toothpaste goes on the brush to keep our teeth shiny and clean!',
  },
  {
    id: 'shoe_sock',
    tier: 'easy',
    category: 'clothing_body',
    prompt: {
      id: 'shoe',
      name: 'Shoe',
      emoji: '👟',
      label: 'Shoe',
      color: 'from-blue-100 to-indigo-200',
      borderColor: 'border-blue-400',
      tag: 'Footwear',
    },
    correct: {
      id: 'sock',
      name: 'Sock',
      emoji: '🧦',
      label: 'Sock',
      color: 'from-pink-100 to-rose-200',
      borderColor: 'border-pink-400',
      tag: 'Warm for feet',
    },
    promptQuestion: 'What comes together with the shoe?',
    successVoice: 'Yes! Shoes and socks go together!',
    whyVoice: 'We put on cozy socks before slipping into our shoes!',
  },
  {
    id: 'key_lock',
    tier: 'easy',
    category: 'home_play',
    prompt: {
      id: 'lock',
      name: 'Lock',
      emoji: '🔒',
      label: 'Lock',
      color: 'from-amber-100 to-yellow-200',
      borderColor: 'border-amber-400',
      tag: 'Keep safe',
    },
    correct: {
      id: 'key',
      name: 'Key',
      emoji: '🔑',
      label: 'Key',
      color: 'from-yellow-100 to-amber-300',
      borderColor: 'border-yellow-500',
      tag: 'Unlocks doors',
    },
    promptQuestion: 'What comes together with the lock?',
    successVoice: 'Yes! The key unlocks the lock!',
    whyVoice: 'The special key turns inside the lock to open it!',
  },
  {
    id: 'spoon_bowl',
    tier: 'easy',
    category: 'food_kitchen',
    prompt: {
      id: 'spoon',
      name: 'Spoon',
      emoji: '🥄',
      label: 'Spoon',
      color: 'from-slate-100 to-zinc-200',
      borderColor: 'border-slate-400',
      tag: 'Eating',
    },
    correct: {
      id: 'bowl',
      name: 'Bowl',
      emoji: '🥣',
      label: 'Bowl',
      color: 'from-orange-100 to-amber-200',
      borderColor: 'border-orange-400',
      tag: 'Yummy cereal',
    },
    promptQuestion: 'What comes together with the spoon?',
    successVoice: 'Yes! Spoon and bowl go together!',
    whyVoice: 'We use a spoon to scoop yummy cereal and soup from a bowl!',
  },
  {
    id: 'dog_bone',
    tier: 'easy',
    category: 'nature_animals',
    prompt: {
      id: 'dog',
      name: 'Dog',
      emoji: '🐶',
      label: 'Puppy Dog',
      color: 'from-amber-100 to-orange-200',
      borderColor: 'border-amber-400',
      tag: 'Cute pet',
    },
    correct: {
      id: 'bone',
      name: 'Bone',
      emoji: '🦴',
      label: 'Tasty Bone',
      color: 'from-stone-100 to-zinc-200',
      borderColor: 'border-stone-400',
      tag: "Dog's treat",
    },
    promptQuestion: 'What comes together with the puppy dog?',
    successVoice: 'Yes! The puppy loves its bone!',
    whyVoice: 'Dogs love to chew and play with their favorite bone treat!',
  },
  {
    id: 'bed_pillow',
    tier: 'easy',
    category: 'home_play',
    prompt: {
      id: 'bed',
      name: 'Bed',
      emoji: '🛏️',
      label: 'Bed',
      color: 'from-purple-100 to-indigo-200',
      borderColor: 'border-purple-400',
      tag: 'Sleeping',
    },
    correct: {
      id: 'pillow',
      name: 'Pillow',
      emoji: '☁️',
      label: 'Soft Pillow',
      color: 'from-sky-100 to-cyan-200',
      borderColor: 'border-sky-400',
      tag: 'Rest head',
    },
    promptQuestion: 'What comes together with the bed?',
    successVoice: 'Yes! Bed and pillow go together!',
    whyVoice: 'We lay our head on a soft pillow when resting in bed!',
  },
  {
    id: 'cat_milk',
    tier: 'easy',
    category: 'nature_animals',
    prompt: {
      id: 'cat',
      name: 'Kitten',
      emoji: '🐱',
      label: 'Little Cat',
      color: 'from-orange-100 to-rose-200',
      borderColor: 'border-orange-400',
      tag: 'Playful kitten',
    },
    correct: {
      id: 'milk',
      name: 'Milk Saucer',
      emoji: '🥛',
      label: 'Glass of Milk',
      color: 'from-blue-100 to-sky-200',
      borderColor: 'border-blue-400',
      tag: 'Kitty drink',
    },
    promptQuestion: 'What comes together with the little kitten?',
    successVoice: 'Yes! Kitty loves a cup of milk!',
  },
  {
    id: 'comb_hair',
    tier: 'easy',
    category: 'daily_routine',
    prompt: {
      id: 'comb',
      name: 'Hairbrush',
      emoji: '🪮',
      label: 'Hair Comb',
      color: 'from-violet-100 to-purple-200',
      borderColor: 'border-violet-400',
      tag: 'Grooming',
    },
    correct: {
      id: 'hair',
      name: 'Hair / Ponytail',
      emoji: '👧',
      label: 'Cute Hair',
      color: 'from-pink-100 to-amber-200',
      borderColor: 'border-pink-400',
      tag: 'Neat and tidy',
    },
    promptQuestion: 'What comes together with the hair comb?',
    successVoice: 'Yes! We use the comb to brush hair neatly!',
  },
  {
    id: 'soap_water',
    tier: 'easy',
    category: 'daily_routine',
    prompt: {
      id: 'soap',
      name: 'Soap Bar',
      emoji: '🧼',
      label: 'Bubbly Soap',
      color: 'from-teal-100 to-emerald-200',
      borderColor: 'border-teal-400',
      tag: 'Washing',
    },
    correct: {
      id: 'water_drops',
      name: 'Water Drops',
      emoji: '💧',
      label: 'Water Splash',
      color: 'from-cyan-100 to-blue-200',
      borderColor: 'border-cyan-400',
      tag: 'Rinse bubbles',
    },
    promptQuestion: 'What comes together with bubbly soap?',
    successVoice: 'Yes! Soap and water make clean bubbles!',
    whyVoice: 'Water helps soap lather into bubbly suds to wash our hands!',
  },
  {
    id: 'cup_plate',
    tier: 'easy',
    category: 'food_kitchen',
    prompt: {
      id: 'cup',
      name: 'Tea Cup',
      emoji: '☕',
      label: 'Cup',
      color: 'from-amber-100 to-orange-200',
      borderColor: 'border-amber-400',
      tag: 'Drinking',
    },
    correct: {
      id: 'saucer_plate',
      name: 'Saucer Plate',
      emoji: '🍽️',
      label: 'Plate Saucer',
      color: 'from-slate-100 to-indigo-200',
      borderColor: 'border-slate-400',
      tag: 'Holds the cup',
    },
    promptQuestion: 'What comes together with the cup?',
    successVoice: 'Yes! The cup rests on the saucer plate!',
  },

  // ==========================================
  // TIER: MEDIUM (Creative, preschool context)
  // ==========================================
  {
    id: 'pencil_eraser',
    tier: 'medium',
    category: 'art_school',
    prompt: {
      id: 'pencil',
      name: 'Pencil',
      emoji: '✏️',
      label: 'Writing Pencil',
      color: 'from-yellow-100 to-amber-200',
      borderColor: 'border-yellow-400',
      tag: 'Drawing',
    },
    correct: {
      id: 'eraser',
      name: 'Eraser',
      emoji: '🧽',
      label: 'Pink Eraser',
      color: 'from-rose-100 to-pink-200',
      borderColor: 'border-rose-400',
      tag: 'Fix mistakes',
    },
    promptQuestion: 'What comes together with the pencil?',
    successVoice: 'Yes! Pencil and eraser go together!',
    whyVoice: 'When we draw with a pencil, an eraser helps us fix any little mistakes!',
  },
  {
    id: 'paintbrush_paint',
    tier: 'medium',
    category: 'art_school',
    prompt: {
      id: 'paintbrush',
      name: 'Paintbrush',
      emoji: '🖌️',
      label: 'Paintbrush',
      color: 'from-orange-100 to-amber-200',
      borderColor: 'border-orange-400',
      tag: 'Art time',
    },
    correct: {
      id: 'paint_palette',
      name: 'Paint Palette',
      emoji: '🎨',
      label: 'Color Palette',
      color: 'from-violet-100 to-fuchsia-200',
      borderColor: 'border-violet-400',
      tag: 'Bright colors',
    },
    promptQuestion: 'What comes together with the paintbrush?',
    successVoice: 'Yes! Paintbrush and color palette go together!',
    whyVoice: 'We dip our paintbrush into colorful paint to make artwork!',
  },
  {
    id: 'umbrella_rain',
    tier: 'medium',
    category: 'nature_animals',
    prompt: {
      id: 'umbrella',
      name: 'Umbrella',
      emoji: '☂️',
      label: 'Umbrella',
      color: 'from-purple-100 to-pink-200',
      borderColor: 'border-purple-400',
      tag: 'Stay dry',
    },
    correct: {
      id: 'rain_cloud',
      name: 'Rain Cloud',
      emoji: '🌧️',
      label: 'Rain Drops',
      color: 'from-sky-100 to-blue-200',
      borderColor: 'border-sky-400',
      tag: 'Rainy day',
    },
    promptQuestion: 'What comes together with an umbrella?',
    successVoice: 'Yes! Umbrella and rain go together!',
    whyVoice: 'We open our umbrella to stay nice and dry in the rain!',
  },
  {
    id: 'rabbit_carrot',
    tier: 'medium',
    category: 'nature_animals',
    prompt: {
      id: 'rabbit',
      name: 'Bunny Rabbit',
      emoji: '🐰',
      label: 'Bunny Rabbit',
      color: 'from-rose-100 to-pink-200',
      borderColor: 'border-rose-400',
      tag: 'Hopping bunny',
    },
    correct: {
      id: 'carrot',
      name: 'Orange Carrot',
      emoji: '🥕',
      label: 'Crunchy Carrot',
      color: 'from-orange-100 to-amber-200',
      borderColor: 'border-orange-400',
      tag: 'Bunny snack',
    },
    promptQuestion: 'What comes together with the bunny rabbit?',
    successVoice: 'Yes! The bunny loves munching carrots!',
    whyVoice: 'Bunnies love to munch on crunchy, sweet orange carrots!',
  },
  {
    id: 'bird_nest',
    tier: 'medium',
    category: 'nature_animals',
    prompt: {
      id: 'bird',
      name: 'Robin Bird',
      emoji: '🐦',
      label: 'Songbird',
      color: 'from-sky-100 to-cyan-200',
      borderColor: 'border-sky-400',
      tag: 'Flying bird',
    },
    correct: {
      id: 'nest',
      name: 'Bird Nest',
      emoji: '🪺',
      label: 'Cozy Nest',
      color: 'from-amber-100 to-stone-200',
      borderColor: 'border-amber-400',
      tag: 'Bird home',
    },
    promptQuestion: 'What comes together with the little bird?',
    successVoice: 'Yes! The bird lives in its cozy nest!',
    whyVoice: 'Birds build warm, cozy nests in trees for their eggs and chicks!',
  },
  {
    id: 'scissors_paper',
    tier: 'medium',
    category: 'art_school',
    prompt: {
      id: 'scissors',
      name: 'Craft Scissors',
      emoji: '✂️',
      label: 'Scissors',
      color: 'from-red-100 to-rose-200',
      borderColor: 'border-red-400',
      tag: 'Crafting',
    },
    correct: {
      id: 'paper',
      name: 'Colored Paper',
      emoji: '📄',
      label: 'Craft Paper',
      color: 'from-emerald-100 to-teal-200',
      borderColor: 'border-emerald-400',
      tag: 'Shapes to cut',
    },
    promptQuestion: 'What comes together with craft scissors?',
    successVoice: 'Yes! Scissors cut the craft paper!',
    whyVoice: 'We use scissors to cut craft paper into fun shapes!',
  },
  {
    id: 'flower_vase',
    tier: 'medium',
    category: 'home_play',
    prompt: {
      id: 'flower',
      name: 'Flower',
      emoji: '🌸',
      label: 'Bloom Flower',
      color: 'from-pink-100 to-rose-200',
      borderColor: 'border-pink-400',
      tag: 'Pretty blossom',
    },
    correct: {
      id: 'vase',
      name: 'Flower Vase',
      emoji: '🏺',
      label: 'Water Vase',
      color: 'from-cyan-100 to-blue-200',
      borderColor: 'border-cyan-400',
      tag: 'Holds flowers',
    },
    promptQuestion: 'What comes together with fresh flowers?',
    successVoice: 'Yes! Flowers go into a water vase!',
  },
  {
    id: 'chair_table',
    tier: 'medium',
    category: 'home_play',
    prompt: {
      id: 'chair',
      name: 'Chair',
      emoji: '🪑',
      label: 'Chair',
      color: 'from-amber-100 to-yellow-200',
      borderColor: 'border-amber-400',
      tag: 'Sitting down',
    },
    correct: {
      id: 'table',
      name: 'Dining Table',
      emoji: '🪵',
      label: 'Table',
      color: 'from-stone-100 to-amber-200',
      borderColor: 'border-stone-400',
      tag: 'Work & eat',
    },
    promptQuestion: 'What comes together with the chair?',
    successVoice: 'Yes! Chair and table go together!',
  },
  {
    id: 'book_bookmark',
    tier: 'medium',
    category: 'art_school',
    prompt: {
      id: 'book',
      name: 'Storybook',
      emoji: '📖',
      label: 'Storybook',
      color: 'from-blue-100 to-indigo-200',
      borderColor: 'border-blue-400',
      tag: 'Reading',
    },
    correct: {
      id: 'bookmark',
      name: 'Bookmark Ribbon',
      emoji: '🔖',
      label: 'Bookmark',
      color: 'from-red-100 to-rose-200',
      borderColor: 'border-red-400',
      tag: 'Saves page',
    },
    promptQuestion: 'What comes together with the storybook?',
    successVoice: 'Yes! The bookmark saves your page in the book!',
  },
  {
    id: 'crayon_coloringbook',
    tier: 'medium',
    category: 'art_school',
    prompt: {
      id: 'crayon',
      name: 'Crayon',
      emoji: '🖍️',
      label: 'Bright Crayon',
      color: 'from-pink-100 to-red-200',
      borderColor: 'border-pink-400',
      tag: 'Coloring',
    },
    correct: {
      id: 'drawing_pad',
      name: 'Coloring Book',
      emoji: '📒',
      label: 'Coloring Book',
      color: 'from-yellow-100 to-amber-200',
      borderColor: 'border-yellow-400',
      tag: 'Fun pictures',
    },
    promptQuestion: 'What comes together with crayons?',
    successVoice: 'Yes! We color inside our coloring book with crayons!',
  },

  // ==========================================
  // TIER: HARD / THINKING (Conceptual associations)
  // ==========================================
  {
    id: 'bee_flower',
    tier: 'hard',
    category: 'nature_animals',
    prompt: {
      id: 'bee',
      name: 'Bumblebee',
      emoji: '🐝',
      label: 'Bumblebee',
      color: 'from-yellow-100 to-amber-200',
      borderColor: 'border-yellow-400',
      tag: 'Buzzing insect',
    },
    correct: {
      id: 'sunflower',
      name: 'Sunflower Blossom',
      emoji: '🌻',
      label: 'Bright Flower',
      color: 'from-amber-100 to-yellow-300',
      borderColor: 'border-amber-500',
      tag: 'Sweet nectar',
    },
    promptQuestion: 'What comes together with the bumblebee?',
    successVoice: 'Yes! The bee visits flowers for sweet nectar!',
    whyVoice: 'Bees buzz around beautiful flowers to gather sweet nectar for honey!',
  },
  {
    id: 'fish_water',
    tier: 'hard',
    category: 'nature_animals',
    prompt: {
      id: 'fish',
      name: 'Goldfish',
      emoji: '🐠',
      label: 'Goldfish',
      color: 'from-orange-100 to-rose-200',
      borderColor: 'border-orange-400',
      tag: 'Swimming friend',
    },
    correct: {
      id: 'ocean_water',
      name: 'Water Waves',
      emoji: '🌊',
      label: 'Clean Water',
      color: 'from-sky-100 to-cyan-200',
      borderColor: 'border-sky-400',
      tag: 'Where fish swim',
    },
    promptQuestion: 'What comes together with the little fish?',
    successVoice: 'Yes! Fish swim happily in the water!',
    whyVoice: 'Fish breathe and swim safely in fresh, clean water!',
  },
  {
    id: 'sunglasses_sun',
    tier: 'hard',
    category: 'clothing_body',
    prompt: {
      id: 'sunglasses',
      name: 'Sunglasses',
      emoji: '🕶️',
      label: 'Sunglasses',
      color: 'from-indigo-100 to-slate-200',
      borderColor: 'border-indigo-400',
      tag: 'Shade eyes',
    },
    correct: {
      id: 'bright_sun',
      name: 'Bright Sunshine',
      emoji: '☀️',
      label: 'Sunny Sky',
      color: 'from-amber-100 to-yellow-200',
      borderColor: 'border-amber-400',
      tag: 'Sunny day',
    },
    promptQuestion: 'What comes together with sunglasses?',
    successVoice: 'Yes! We wear sunglasses on a bright sunny day!',
    whyVoice: 'Sunglasses shield our eyes from the bright warm sunshine!',
  },
  {
    id: 'kite_wind',
    tier: 'hard',
    category: 'home_play',
    prompt: {
      id: 'kite',
      name: 'Flying Kite',
      emoji: '🪁',
      label: 'Colorful Kite',
      color: 'from-rose-100 to-pink-200',
      borderColor: 'border-rose-400',
      tag: 'High in sky',
    },
    correct: {
      id: 'wind_breeze',
      name: 'Blowing Wind',
      emoji: '💨',
      label: 'Breezy Wind',
      color: 'from-cyan-100 to-blue-200',
      borderColor: 'border-cyan-400',
      tag: 'Lifts kite up',
    },
    promptQuestion: 'What comes together with the flying kite?',
    successVoice: 'Yes! The windy breeze lifts the kite up high!',
    whyVoice: 'The wind blows under the kite to help it soar high into the sky!',
  },
  {
    id: 'car_road',
    tier: 'hard',
    category: 'home_play',
    prompt: {
      id: 'car',
      name: 'Red Car',
      emoji: '🚗',
      label: 'Cruising Car',
      color: 'from-red-100 to-orange-200',
      borderColor: 'border-red-400',
      tag: 'Driving',
    },
    correct: {
      id: 'road',
      name: 'Paved Road',
      emoji: '🛣️',
      label: 'Open Road',
      color: 'from-slate-100 to-zinc-300',
      borderColor: 'border-slate-400',
      tag: 'Smooth drive',
    },
    promptQuestion: 'What comes together with the red car?',
    successVoice: 'Yes! Cars drive along the road!',
  },
  {
    id: 'ball_bat',
    tier: 'hard',
    category: 'home_play',
    prompt: {
      id: 'baseball',
      name: 'Baseball',
      emoji: '⚾',
      label: 'Play Ball',
      color: 'from-red-50 to-rose-100',
      borderColor: 'border-red-300',
      tag: 'Play game',
    },
    correct: {
      id: 'bat',
      name: 'Wooden Bat',
      emoji: '🏏',
      label: 'Sports Bat',
      color: 'from-amber-100 to-orange-200',
      borderColor: 'border-amber-400',
      tag: 'Hit the ball',
    },
    promptQuestion: 'What comes together with the baseball?',
    successVoice: 'Yes! Bat and ball go together in the game!',
  },
  {
    id: 'tree_apple',
    tier: 'hard',
    category: 'nature_animals',
    prompt: {
      id: 'apple_tree',
      name: 'Apple Tree',
      emoji: '🌳',
      label: 'Big Tree',
      color: 'from-emerald-100 to-green-200',
      borderColor: 'border-emerald-400',
      tag: 'In the orchard',
    },
    correct: {
      id: 'red_apple',
      name: 'Red Apple',
      emoji: '🍎',
      label: 'Sweet Apple',
      color: 'from-red-100 to-rose-200',
      borderColor: 'border-red-400',
      tag: 'Grows on tree',
    },
    promptQuestion: 'What comes together with the apple tree?',
    successVoice: 'Yes! Sweet red apples grow on the tree!',
  },
  {
    id: 'camera_photo',
    tier: 'hard',
    category: 'home_play',
    prompt: {
      id: 'camera',
      name: 'Photo Camera',
      emoji: '📷',
      label: 'Camera',
      color: 'from-slate-100 to-indigo-200',
      borderColor: 'border-slate-400',
      tag: 'Say cheese!',
    },
    correct: {
      id: 'photo_frame',
      name: 'Picture Photo',
      emoji: '🖼️',
      label: 'Photo Picture',
      color: 'from-amber-100 to-yellow-200',
      borderColor: 'border-amber-400',
      tag: 'Memory picture',
    },
    promptQuestion: 'What comes together with the camera?',
    successVoice: 'Yes! The camera takes wonderful picture photos!',
  },
  {
    id: 'phone_charger',
    tier: 'hard',
    category: 'home_play',
    prompt: {
      id: 'phone',
      name: 'Smart Phone',
      emoji: '📱',
      label: 'Phone',
      color: 'from-indigo-100 to-purple-200',
      borderColor: 'border-indigo-400',
      tag: 'Device',
    },
    correct: {
      id: 'electric_plug',
      name: 'Power Charger',
      emoji: '🔌',
      label: 'Plug Charger',
      color: 'from-emerald-100 to-teal-200',
      borderColor: 'border-emerald-400',
      tag: 'Recharge battery',
    },
    promptQuestion: 'What comes together with the phone?',
    successVoice: 'Yes! The charger plugs in to give the phone battery power!',
  },
  {
    id: 'raincoat_boots',
    tier: 'hard',
    category: 'clothing_body',
    prompt: {
      id: 'raincoat',
      name: 'Yellow Raincoat',
      emoji: '🧥',
      label: 'Rain Jacket',
      color: 'from-yellow-100 to-amber-200',
      borderColor: 'border-yellow-400',
      tag: 'Stay cozy',
    },
    correct: {
      id: 'rain_boots',
      name: 'Rubber Rain Boots',
      emoji: '👢',
      label: 'Rain Boots',
      color: 'from-sky-100 to-blue-200',
      borderColor: 'border-sky-400',
      tag: 'Splash puddles',
    },
    promptQuestion: 'What comes together with the yellow raincoat?',
    successVoice: 'Yes! Raincoat and rain boots keep us dry in puddles!',
  },
];

// Large pool of preschool neutral distractors that are clean, unambiguous, and safe to use
export const DISTRACTOR_POOL: PairItem[] = [
  { id: 'dist_football', name: 'Soccer Ball', emoji: '⚽', label: 'Soccer Ball', color: 'from-slate-100 to-zinc-200', borderColor: 'border-slate-300', tag: 'Toy' },
  { id: 'dist_balloon', name: 'Party Balloon', emoji: '🎈', label: 'Red Balloon', color: 'from-red-100 to-rose-200', borderColor: 'border-red-300', tag: 'Party' },
  { id: 'dist_guitar', name: 'Acoustic Guitar', emoji: '🎸', label: 'Music Guitar', color: 'from-amber-100 to-orange-200', borderColor: 'border-amber-300', tag: 'Music' },
  { id: 'dist_clock', name: 'Alarm Clock', emoji: '⏰', label: 'Tick Clock', color: 'from-rose-100 to-red-200', borderColor: 'border-rose-300', tag: 'Time' },
  { id: 'dist_teddy', name: 'Teddy Bear', emoji: '🧸', label: 'Teddy Bear', color: 'from-amber-100 to-yellow-200', borderColor: 'border-amber-300', tag: 'Cuddly' },
  { id: 'dist_drum', name: 'Marching Drum', emoji: '🥁', label: 'Toy Drum', color: 'from-orange-100 to-amber-200', borderColor: 'border-orange-300', tag: 'Beats' },
  { id: 'dist_banana', name: 'Yellow Banana', emoji: '🍌', label: 'Banana', color: 'from-yellow-100 to-amber-200', borderColor: 'border-yellow-300', tag: 'Fruit' },
  { id: 'dist_car_toy', name: 'Toy Truck', emoji: '🛻', label: 'Toy Truck', color: 'from-blue-100 to-sky-200', borderColor: 'border-blue-300', tag: 'Toy' },
  { id: 'dist_cookie', name: 'Choco Cookie', emoji: '🍪', label: 'Cookie', color: 'from-amber-100 to-stone-200', borderColor: 'border-amber-300', tag: 'Snack' },
  { id: 'dist_star', name: 'Twinkle Star', emoji: '⭐', label: 'Golden Star', color: 'from-amber-100 to-yellow-200', borderColor: 'border-amber-300', tag: 'Sparkle' },
  { id: 'dist_strawberry', name: 'Strawberry', emoji: '🍓', label: 'Strawberry', color: 'from-red-100 to-pink-200', borderColor: 'border-red-300', tag: 'Berry' },
  { id: 'dist_submarine', name: 'Submarine', emoji: '🤿', label: 'Goggles', color: 'from-cyan-100 to-blue-200', borderColor: 'border-cyan-300', tag: 'Water' },
  { id: 'dist_icecream', name: 'Ice Cream Cone', emoji: '🍦', label: 'Ice Cream', color: 'from-pink-100 to-rose-200', borderColor: 'border-pink-300', tag: 'Treat' },
  { id: 'dist_watermelon', name: 'Watermelon', emoji: '🍉', label: 'Watermelon', color: 'from-emerald-100 to-rose-200', borderColor: 'border-emerald-300', tag: 'Melon' },
  { id: 'dist_rocket', name: 'Space Rocket', emoji: '🚀', label: 'Toy Rocket', color: 'from-indigo-100 to-purple-200', borderColor: 'border-indigo-300', tag: 'Space' },
];

export interface GameRound {
  pair: RelatedPair;
  choices: PairItem[];
  correctIndex: number;
}

// Generate a randomized set of 8 rounds, ensuring progression and variety
export function generateWhatComesTogetherRounds(previousPairIds?: string[]): GameRound[] {
  // 1. Split pool by tiers
  const easyPool = RELATED_PAIRS_POOL.filter((p) => p.tier === 'easy');
  const mediumPool = RELATED_PAIRS_POOL.filter((p) => p.tier === 'medium');
  const hardPool = RELATED_PAIRS_POOL.filter((p) => p.tier === 'hard');

  // Helper to shuffle an array
  const shuffle = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Filter out recent pairs if possible to ensure fresh variety on replay
  const filterRecent = (pool: RelatedPair[]): RelatedPair[] => {
    if (!previousPairIds || previousPairIds.length === 0) return shuffle(pool);
    const nonRecent = pool.filter((p) => !previousPairIds.includes(p.id));
    return nonRecent.length >= 3 ? shuffle(nonRecent) : shuffle(pool);
  };

  const selectedEasy = filterRecent(easyPool).slice(0, 3);
  const selectedMedium = filterRecent(mediumPool).slice(0, 3);
  const selectedHard = filterRecent(hardPool).slice(0, 2);

  const selectedPairs = [...selectedEasy, ...selectedMedium, ...selectedHard];

  // If for some reason we have fewer than 8, pad with remaining
  while (selectedPairs.length < 8) {
    const remaining = RELATED_PAIRS_POOL.filter((p) => !selectedPairs.some((sp) => sp.id === p.id));
    if (remaining.length === 0) break;
    selectedPairs.push(shuffle(remaining)[0]);
  }

  // 2. Build each round with 4 choices (1 correct + 3 distinct distractors)
  return selectedPairs.map((pair) => {
    // Collect potential distractors:
    // We can pick from DISTRACTOR_POOL + items from OTHER unrelated pairs
    const safePairDistractors = RELATED_PAIRS_POOL
      .filter((p) => p.id !== pair.id && p.category !== pair.category)
      .map((p) => p.correct);

    const combinedDistractorPool = [...DISTRACTOR_POOL, ...safePairDistractors];
    const filteredDistractors = combinedDistractorPool.filter(
      (d) => d.id !== pair.correct.id && d.id !== pair.prompt.id && d.name !== pair.correct.name
    );

    // Shuffle and pick 3 unique distractors
    const chosenDistractors: PairItem[] = [];
    const seenNames = new Set<string>([pair.correct.name, pair.prompt.name]);

    for (const d of shuffle(filteredDistractors)) {
      if (!seenNames.has(d.name)) {
        seenNames.add(d.name);
        chosenDistractors.push(d);
        if (chosenDistractors.length === 3) break;
      }
    }

    // Combine correct with distractors and shuffle choice positions
    const allChoices = shuffle([pair.correct, ...chosenDistractors]);
    const correctIndex = allChoices.findIndex((c) => c.id === pair.correct.id);

    return {
      pair,
      choices: allChoices,
      correctIndex,
    };
  });
}
