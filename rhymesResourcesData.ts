export type RhymeCategory =
  | 'abc_phonics'
  | 'numbers_counting'
  | 'colors_shapes'
  | 'animals'
  | 'healthy_food'
  | 'manners_friendship'
  | 'cleanliness_rules'
  | 'weather_seasons'
  | 'body_feelings'
  | 'routines_transitions';

export interface RhymeResource {
  id: string;
  title: string;
  category: RhymeCategory;
  categoryName: string;
  theme: string;
  icon: string;
  svgType: string;
  ageGroup: '3–4 years' | '4–5 years' | '5–6 years' | '3–6 years' | '3–5 years';
  learningArea: string;
  learningOutcome: string;
  rhymeText: string;
  rhymeLines: string[];
  vocabulary: string[];
  actions: {
    lineHint?: string;
    instruction: string;
  }[];
  teacherGuide: {
    before: string;
    during: string;
    after: string;
  };
  discussionQuestions: string[];
  classroomActivity: {
    title: string;
    instruction: string;
    materialsNeeded?: string;
  };
}

export const RHYME_CATEGORIES: { id: RhymeCategory | 'all'; name: string; icon: string; count?: number }[] = [
  { id: 'all', name: 'All Resources', icon: '🌟' },
  { id: 'abc_phonics', name: 'ABC & Phonics', icon: '🔤' },
  { id: 'numbers_counting', name: 'Numbers & Counting', icon: '🔢' },
  { id: 'colors_shapes', name: 'Colors & Shapes', icon: '🎨' },
  { id: 'animals', name: 'Animals & Nature', icon: '🐰' },
  { id: 'healthy_food', name: 'Healthy Food & Fruits', icon: '🍎' },
  { id: 'manners_friendship', name: 'Manners & Sharing', icon: '🤝' },
  { id: 'cleanliness_rules', name: 'Cleanliness & Rules', icon: '🧼' },
  { id: 'weather_seasons', name: 'Weather & Seasons', icon: '⛅' },
  { id: 'body_feelings', name: 'Body & Feelings', icon: '😊' },
  { id: 'routines_transitions', name: 'Routines & Transitions', icon: '⏰' },
];

export const RHYMES_DATA: RhymeResource[] = [
  // 1. ABC & Phonics
  {
    id: 'rhyme-abc-train',
    title: 'The Alphabet Train',
    category: 'abc_phonics',
    categoryName: 'ABC & Phonics',
    theme: 'Letter Sounds & Alphabet Awareness',
    icon: '🚂',
    svgType: 'train',
    ageGroup: '3–5 years',
    learningArea: 'Early Literacy',
    learningOutcome: 'Identifies alphabet letter sounds and connects phonetic letter patterns through rhythmic recitation.',
    rhymeText: `Chugga-chugga choo-choo, down the track,
The Alphabet Train with letters on its back!
A says /a/ for Apple round and red,
B says /b/ for Bear getting into bed!
C says /c/ for Cat purring in the sun,
Say your letter sounds and join the fun!
Chugga-chugga choo-choo, hear the whistle blow,
All the happy letters standing in a row!`,
    rhymeLines: [
      'Chugga-chugga choo-choo, down the track,',
      'The Alphabet Train with letters on its back!',
      'A says /a/ for Apple round and red,',
      'B says /b/ for Bear getting into bed!',
      'C says /c/ for Cat purring in the sun,',
      'Say your letter sounds and join the fun!',
      'Chugga-chugga choo-choo, hear the whistle blow,',
      'All the happy letters standing in a row!',
    ],
    vocabulary: ['Track', 'Letter', 'Whistle', 'Purr', 'Row'],
    actions: [
      { lineHint: 'Chugga-chugga choo-choo', instruction: 'Bend elbows and pump arms in circular motion like train wheels.' },
      { lineHint: 'A says /a/ for Apple', instruction: 'Make a round circle with both hands.' },
      { lineHint: 'B says /b/ for Bear', instruction: 'Rest cheek on folded hands as if sleeping.' },
      { lineHint: 'Hear the whistle blow', instruction: 'Pull imaginary train whistle cord and say "Choo-choo!"' },
    ],
    teacherGuide: {
      before: 'Display letter cards A, B, and C on the board. Make the train sound together to gather children into circle time.',
      during: 'Emphasize the letter phonetic sounds /a/, /b/, /c/ distinctly while children pump their arms on the beat.',
      after: 'Ask children to name other objects in the room that begin with the /a/ sound.',
    },
    discussionQuestions: [
      'What sound does the Alphabet Train make?',
      'What word starts with the /b/ sound in our rhyme?',
      'Can you show me how a happy cat purrs?',
    ],
    classroomActivity: {
      title: 'Alphabet Train Classroom Parade',
      instruction: 'Have children form a line holding letter cards. As the train travels around the rug, each child holds up their letter and speaks its sound.',
      materialsNeeded: 'Alphabet flash cards or large letter cutouts.',
    },
  },

  // 2. Numbers & Counting
  {
    id: 'rhyme-five-apples',
    title: 'Five Little Apples in the Tree',
    category: 'numbers_counting',
    categoryName: 'Numbers & Counting',
    theme: 'One-to-One Counting & Early Subtraction',
    icon: '🍎',
    svgType: 'apples',
    ageGroup: '3–5 years',
    learningArea: 'Early Math',
    learningOutcome: 'Demonstrates counting from 1 to 5 backwards and reinforces early subtraction concepts.',
    rhymeText: `Five red apples hanging in a tree,
Sweetest little apples you ever did see!
Along came the wind blowing all around,
WHOOSH! One juicy apple tumbled to the ground!
Now count them with me: One, Two, Three, Four!
Four red apples, can you count some more?
Until zero apples are left up high,
And we wave to the branches in the sky!`,
    rhymeLines: [
      'Five red apples hanging in a tree,',
      'Sweetest little apples you ever did see!',
      'Along came the wind blowing all around,',
      'WHOOSH! One juicy apple tumbled to the ground!',
      'Now count them with me: One, Two, Three, Four!',
      'Four red apples, can you count some more?',
      'Until zero apples are left up high,',
      'And we wave to the branches in the sky!',
    ],
    vocabulary: ['Hanging', 'Juicy', 'Tumbled', 'Branches', 'Zero'],
    actions: [
      { lineHint: 'Five red apples', instruction: 'Hold up five open fingers high above your head.' },
      { lineHint: 'Along came the wind', instruction: 'Sway arms gently and make a soft blowing sound.' },
      { lineHint: 'WHOOSH! One juicy apple tumbled', instruction: 'Clap hands once and tuck one finger down.' },
      { lineHint: 'Now count them with me', instruction: 'Point to each remaining raised finger together.' },
    ],
    teacherGuide: {
      before: 'Have 5 red apple cutouts or blocks placed on a low table. Ask children how many they see.',
      during: 'Pause dramatically before "WHOOSH!" and invite children to clap loudly when the apple falls.',
      after: 'Review the numbers 5 down to 0 using fingers and counters.',
    },
    discussionQuestions: [
      'How many apples were on the tree at the start?',
      'What made the juicy apple fall down?',
      'What number comes before four when we count down?',
    ],
    classroomActivity: {
      title: 'Apple Tree Counting Game',
      instruction: 'Draw a simple tree trunk on paper or board. Give children red dot stickers or counters to place on and take off the tree while reciting the rhyme.',
      materialsNeeded: 'Tree template and 5 red counters or stickers per child.',
    },
  },

  // 3. Colors & Shapes
  {
    id: 'rhyme-rainbow-shapes',
    title: 'The Shape & Color Song',
    category: 'colors_shapes',
    categoryName: 'Colors & Shapes',
    theme: 'Geometric Recognition & Color Association',
    icon: '🔷',
    svgType: 'shapes',
    ageGroup: '3–6 years',
    learningArea: 'Colors, Shapes & Visual Skills',
    learningOutcome: 'Identifies primary shapes (circle, square, triangle) and distinguishes vibrant core colors.',
    rhymeText: `A circle is round like the shining sun,
Yellow and bright for everyone!
A square has four sides, all the same,
Blue like the sky in a picture frame!
A triangle has three points so neat,
Green like the grass beneath our feet!
Shapes and colors all around the floor,
Look around the room and find some more!`,
    rhymeLines: [
      'A circle is round like the shining sun,',
      'Yellow and bright for everyone!',
      'A square has four sides, all the same,',
      'Blue like the sky in a picture frame!',
      'A triangle has three points so neat,',
      'Green like the grass beneath our feet!',
      'Shapes and colors all around the floor,',
      'Look around the room and find some more!',
    ],
    vocabulary: ['Circle', 'Square', 'Triangle', 'Points', 'Sides', 'Bright'],
    actions: [
      { lineHint: 'A circle is round', instruction: 'Trace a big circle in the air with your pointer finger.' },
      { lineHint: 'A square has four sides', instruction: 'Draw 4 straight corners in the air with both hands.' },
      { lineHint: 'A triangle has three points', instruction: 'Form a triangle with thumbs and index fingers.' },
      { lineHint: 'Look around the room', instruction: 'Place hand over eyes like a visor and look around.' },
    ],
    teacherGuide: {
      before: 'Place yellow, blue, and green colored shape cutouts on the circle-time rug.',
      during: 'Prompt children to trace the corresponding shape in the air as each verse is spoken.',
      after: 'Invite three children to find one circle, one square, and one triangle in the classroom.',
    },
    discussionQuestions: [
      'What shape is round like the sun?',
      'How many straight sides does a blue square have?',
      'Can you point to something green in our classroom?',
    ],
    classroomActivity: {
      title: 'Classroom Shape Detective Hunt',
      instruction: 'Call out a shape from the rhyme and have children point to matching objects in the room (e.g. clock for circle, window for square, banner for triangle).',
      materialsNeeded: 'Classroom everyday items.',
    },
  },

  // 4. Animals & Nature
  {
    id: 'rhyme-hopping-bunny',
    title: 'The Little Hopping Bunny',
    category: 'animals',
    categoryName: 'Animals & Nature',
    theme: 'Animal Movements & Nature Vocabulary',
    icon: '🐰',
    svgType: 'bunny',
    ageGroup: '3–5 years',
    learningArea: 'Focus & Observation',
    learningOutcome: 'Develops gross motor coordination through rhythmic animal imitation and listening cues.',
    rhymeText: `See the little bunny in the garden green,
Long fuzzy ears, the softest ever seen!
Wiggle your little nose, twitch, twitch, twitch,
Scratch your little ear with a tiny little itch!
Hop to the left and hop to the right,
Munch on a carrot so orange and bright!
Shh, little bunny, close your eyes tight,
Fold your little paws and say goodnight!`,
    rhymeLines: [
      'See the little bunny in the garden green,',
      'Long fuzzy ears, the softest ever seen!',
      'Wiggle your little nose, twitch, twitch, twitch,',
      'Scratch your little ear with a tiny little itch!',
      'Hop to the left and hop to the right,',
      'Munch on a carrot so orange and bright!',
      'Shh, little bunny, close your eyes tight,',
      'Fold your little paws and say goodnight!',
    ],
    vocabulary: ['Fuzzy', 'Twitch', 'Munch', 'Carrot', 'Paws'],
    actions: [
      { lineHint: 'Long fuzzy ears', instruction: 'Hold two fingers up by your head like bunny ears.' },
      { lineHint: 'Wiggle your little nose', instruction: 'Scrunch nose and wiggle pointer finger across nose.' },
      { lineHint: 'Hop to the left and right', instruction: 'Do two gentle hops in place.' },
      { lineHint: 'Munch on a carrot', instruction: 'Pretend to hold and nibble a crunchy carrot.' },
      { lineHint: 'Close your eyes tight', instruction: 'Place hands together beside cheek and close eyes gently.' },
    ],
    teacherGuide: {
      before: 'Ask children if they have ever seen a bunny hop. Whisper quietly to build anticipation.',
      during: 'Model the gentle hopping and nose twitching. Use dynamic volume from lively hops to a soft whisper at the end.',
      after: 'Discuss what animals eat in a garden and how rabbits move quietly.',
    },
    discussionQuestions: [
      'What body parts does the bunny wiggle in the rhyme?',
      'What crunchy vegetable did the bunny munch on?',
      'Can you show me how a bunny hops without making a loud sound?',
    ],
    classroomActivity: {
      title: 'Bunny Hop Movement Path',
      instruction: 'Place circle markers or floor tape on the rug. Children hop from circle to circle quietly like gentle garden bunnies.',
      materialsNeeded: 'Floor markers or chalk tape.',
    },
  },

  // 5. Healthy Food
  {
    id: 'rhyme-crunchy-veggies',
    title: 'Good Morning, Garden Veggies!',
    category: 'healthy_food',
    categoryName: 'Healthy Food & Fruits',
    theme: 'Nutrition, Colors & Healthy Eating',
    icon: '🥕',
    svgType: 'veggies',
    ageGroup: '3–6 years',
    learningArea: 'Everyday Knowledge',
    learningOutcome: 'Understands the benefits of colorful vegetables and fruits in daily healthy nutrition.',
    rhymeText: `Carrots in the soil, orange and sweet,
Crunch, crunch, crunch, what a healthy treat!
Broccoli like little trees, standing tall and green,
Prettiest garden that you have ever seen!
Red juicy tomatoes growing in the sun,
Healthy foods for everyone, full of energy and fun!
Wash them in the water, eat them with a smile,
Healthy growing bodies running for a mile!`,
    rhymeLines: [
      'Carrots in the soil, orange and sweet,',
      'Crunch, crunch, crunch, what a healthy treat!',
      'Broccoli like little trees, standing tall and green,',
      'Prettiest garden that you have ever seen!',
      'Red juicy tomatoes growing in the sun,',
      'Healthy foods for everyone, full of energy and fun!',
      'Wash them in the water, eat them with a smile,',
      'Healthy growing bodies running for a mile!',
    ],
    vocabulary: ['Soil', 'Crunch', 'Broccoli', 'Tomato', 'Energy', 'Treat'],
    actions: [
      { lineHint: 'Carrots in the soil', instruction: 'Pretend to pull a big carrot out of the ground.' },
      { lineHint: 'Crunch, crunch, crunch', instruction: 'Chomp pretend teeth and tap knees on each crunch.' },
      { lineHint: 'Broccoli like little trees', instruction: 'Stand up straight with arms curved like tree branches.' },
      { lineHint: 'Wash them in the water', instruction: 'Rub hands together under an imaginary water tap.' },
    ],
    teacherGuide: {
      before: 'Show pictures or play-food vegetables (carrot, broccoli, tomato). Ask children what color each vegetable is.',
      during: 'Encourage children to make enthusiastic "crunch" sound effects together.',
      after: 'Ask each child to name their favorite fruit or vegetable to eat for lunch.',
    },
    discussionQuestions: [
      'What color is a crunchy carrot in the garden?',
      'Which vegetable looks like a tiny green tree?',
      'Why is it important to wash our vegetables before eating them?',
    ],
    classroomActivity: {
      title: 'Rainbow Salad Sorting Game',
      instruction: 'Provide a basket of toy vegetables or picture cards. Children sort them by color into red, green, and orange bowls.',
      materialsNeeded: 'Toy food or color-coded paper bowls.',
    },
  },

  // 6. Good Manners & Sharing
  {
    id: 'rhyme-magic-words',
    title: 'Two Magic Words',
    category: 'manners_friendship',
    categoryName: 'Manners & Sharing',
    theme: 'Polite Communication & Social Cooperation',
    icon: '✨',
    svgType: 'magic_words',
    ageGroup: '3–6 years',
    learningArea: 'Everyday Knowledge',
    learningOutcome: 'Practices courteous social conventions ("Please" and "Thank You") during peer interactions.',
    rhymeText: `There are two magic words that open every door,
They make our friends feel happy and smile even more!
When you want a block or toy, look into their eyes,
Say "PLEASE, may I have it?" to their pleasant surprise!
When your friend shares with you, what is nice to say?
"THANK YOU for sharing, let’s have a happy day!"
Magic words are friendly, magic words are kind,
The sweetest little manners that you will ever find!`,
    rhymeLines: [
      'There are two magic words that open every door,',
      'They make our friends feel happy and smile even more!',
      'When you want a block or toy, look into their eyes,',
      'Say "PLEASE, may I have it?" to their pleasant surprise!',
      'When your friend shares with you, what is nice to say?',
      '“THANK YOU for sharing, let’s have a happy day!”',
      'Magic words are friendly, magic words are kind,',
      'The sweetest little manners that you will ever find!',
    ],
    vocabulary: ['Magic', 'Manners', 'Pleasant', 'Friendly', 'Share'],
    actions: [
      { lineHint: 'Open every door', instruction: 'Make a key turning motion in the air with one hand.' },
      { lineHint: 'Look into their eyes', instruction: 'Point gently to eyes and give a warm smile.' },
      { lineHint: 'Say PLEASE', instruction: 'Rub hand in gentle circular motion over heart (sign for please).' },
      { lineHint: 'Say THANK YOU', instruction: 'Touch fingertips to chin and move hand forward gently.' },
    ],
    teacherGuide: {
      before: 'Ask children what they say when someone passes them a crayon. Introduce the concept of polite "magic words."',
      during: 'Teach the simple hand gestures for "Please" and "Thank you" alongside the spoken words.',
      after: 'Pair up children and have them practice handing a toy to each other using the two magic words.',
    },
    discussionQuestions: [
      'What are the two magic words in our rhyme?',
      'How does it make our friends feel when we say please?',
      'When is a good time to say "Thank you" in our classroom?',
    ],
    classroomActivity: {
      title: 'Pass the Magic Toy Circle',
      instruction: 'Sit in a circle. Pass a friendly stuffed animal around. The giver says "Here you go!", and the receiver says "Thank you!" before passing it on.',
      materialsNeeded: 'Classroom stuffed toy.',
    },
  },

  // 7. Cleanliness & Classroom Rules
  {
    id: 'rhyme-wash-hands',
    title: 'Scrub, Scrub, Clean Hands!',
    category: 'cleanliness_rules',
    categoryName: 'Cleanliness & Rules',
    theme: 'Hand Hygiene & Healthy Classroom Habits',
    icon: '🧼',
    svgType: 'soap_bubbles',
    ageGroup: '3–6 years',
    learningArea: 'Everyday Knowledge',
    learningOutcome: 'Demonstrates proper multi-step handwashing technique and understands sanitary self-care.',
    rhymeText: `Turn the water on, get your hands so wet,
Squirt a drop of bubbly soap, the best soap you can get!
Scrub the palms, scrub the back, scrub between the spaces,
Wash away the tiny germs in all the hidden places!
Rinse the bubbly soap away, watch the water flow,
Dry them with a paper towel, see your clean hands glow!
Clean hands, bright smile, ready for our snack,
Now we’re healthy, safe, and strong, on the learning track!`,
    rhymeLines: [
      'Turn the water on, get your hands so wet,',
      'Squirt a drop of bubbly soap, the best soap you can get!',
      'Scrub the palms, scrub the back, scrub between the spaces,',
      'Wash away the tiny germs in all the hidden places!',
      'Rinse the bubbly soap away, watch the water flow,',
      'Dry them with a paper towel, see your clean hands glow!',
      'Clean hands, bright smile, ready for our snack,',
      'Now we’re healthy, safe, and strong, on the learning track!',
    ],
    vocabulary: ['Bubbly', 'Palms', 'Germs', 'Rinse', 'Glow', 'Spaces'],
    actions: [
      { lineHint: 'Turn the water on', instruction: 'Twist imaginary faucet knobs.' },
      { lineHint: 'Squirt a drop of bubbly soap', instruction: 'Press palm down as if pushing a soap pump.' },
      { lineHint: 'Scrub the palms, scrub the back', instruction: 'Rub palms together, then rub back of each hand.' },
      { lineHint: 'Scrub between the spaces', instruction: 'Interlock fingers and slide back and forth.' },
      { lineHint: 'See your clean hands glow', instruction: 'Hold up clean hands with fingers spread and wiggle them.' },
    ],
    teacherGuide: {
      before: 'Recite this rhyme before snack time or after outdoor play as a group transition ritual.',
      during: 'Model thorough hand washing motions for 20 seconds while reciting at a steady pace.',
      after: 'Invite children to check their clean hands and identify when we need to wash hands throughout the day.',
    },
    discussionQuestions: [
      'What do we put on our wet hands to make bubbles?',
      'Why is it important to wash between our fingers?',
      'When should we wash our hands in preschool?',
    ],
    classroomActivity: {
      title: 'Hand Washing Step-by-Step Sequence',
      instruction: 'Place visual cards (Water -> Soap -> Scrub -> Rinse -> Dry) on the wall. Practice the hand motions together in line.',
      materialsNeeded: 'Visual sequence cards near classroom sink.',
    },
  },

  // 8. Classroom Rules
  {
    id: 'rhyme-classroom-feet',
    title: 'Walking Feet, Listening Ears',
    category: 'cleanliness_rules',
    categoryName: 'Cleanliness & Rules',
    theme: 'Classroom Safety & Mindful Attention',
    icon: '👂',
    svgType: 'listening_ears',
    ageGroup: '3–5 years',
    learningArea: 'Focus & Observation',
    learningOutcome: 'Understands classroom community expectations, listening focus, and safe body boundaries.',
    rhymeText: `Walking feet upon the floor,
Gentle hands that close the door.
Listening ears turned up so bright,
Quiet mouth that speaks polite.
Eyes looking forward, calm and clear,
We love our classroom friends in here!
Safe and happy, side by side,
Learning with our hearts open wide!`,
    rhymeLines: [
      'Walking feet upon the floor,',
      'Gentle hands that close the door.',
      'Listening ears turned up so bright,',
      'Quiet mouth that speaks polite.',
      'Eyes looking forward, calm and clear,',
      'We love our classroom friends in here!',
      'Safe and happy, side by side,',
      'Learning with our hearts open wide!',
    ],
    vocabulary: ['Gentle', 'Polite', 'Calm', 'Listening', 'Forward'],
    actions: [
      { lineHint: 'Walking feet upon the floor', instruction: 'March in place quietly on tiptoes.' },
      { lineHint: 'Gentle hands', instruction: 'Pat hands together softly.' },
      { lineHint: 'Listening ears', instruction: 'Cup hands behind both ears.' },
      { lineHint: 'Quiet mouth', instruction: 'Place one finger gently over lips.' },
      { lineHint: 'Hearts open wide', instruction: 'Place hands over chest in a heart shape.' },
    ],
    teacherGuide: {
      before: 'Use this rhyme before walking in the hallway or transitioning from active play to storytime.',
      during: 'Keep your voice gentle and melodious so children naturally match the calm energy.',
      after: 'Praise specific children who demonstrate walking feet and listening ears.',
    },
    discussionQuestions: [
      'Why do we use walking feet inside our classroom?',
      'How do listening ears help us during story time?',
      'What does it mean to have gentle hands?',
    ],
    classroomActivity: {
      title: 'Tiptoe Hallway Line Game',
      instruction: 'Practice walking like quiet mice along a taped floor line, balancing and keeping hands to oneself.',
      materialsNeeded: 'Floor tape line.',
    },
  },

  // 9. Weather & Seasons
  {
    id: 'rhyme-spring-rain',
    title: 'Pitter-Patter Spring Rain',
    category: 'weather_seasons',
    categoryName: 'Weather & Seasons',
    theme: 'Weather Patterns & Nature Observation',
    icon: '🌧️',
    svgType: 'rain_cloud',
    ageGroup: '3–6 years',
    learningArea: 'Focus & Observation',
    learningOutcome: 'Observes natural weather phenomena and connects rain with the growth of plants and flowers.',
    rhymeText: `Pitter-patter, pitter-patter, raindrops on the ground,
Listen to the gentle, splashing sound!
Tap on the window, tap on the street,
Splash in the puddles with our little boots and feet!
Drip, drop, drip, drop, falling from the sky,
Open an umbrella to keep us warm and dry!
Then comes the sunshine, golden and bright,
Making all the pretty flowers bloom in the light!`,
    rhymeLines: [
      'Pitter-patter, pitter-patter, raindrops on the ground,',
      'Listen to the gentle, splashing sound!',
      'Tap on the window, tap on the street,',
      'Splash in the puddles with our little boots and feet!',
      'Drip, drop, drip, drop, falling from the sky,',
      'Open an umbrella to keep us warm and dry!',
      'Then comes the sunshine, golden and bright,',
      'Making all the pretty flowers bloom in the light!',
    ],
    vocabulary: ['Pitter-patter', 'Puddles', 'Umbrella', 'Splashing', 'Bloom'],
    actions: [
      { lineHint: 'Pitter-patter raindrops', instruction: 'Wiggle fingers downward from above head like falling rain.' },
      { lineHint: 'Tap on the window', instruction: 'Tap fingertips gently on knees or floor in steady rhythm.' },
      { lineHint: 'Open an umbrella', instruction: 'Make a rounded dome over head with both hands joined.' },
      { lineHint: 'Then comes the sunshine', instruction: 'Spread arms wide into a big circle above head.' },
      { lineHint: 'Flowers bloom', instruction: 'Cup hands together at wrists and open fingers like flower petals.' },
    ],
    teacherGuide: {
      before: 'Look out the classroom window and discuss the current weather with the children.',
      during: 'Encourage children to start with very soft finger taps and gradually build up to a sunshine stretch.',
      after: 'Talk about how rain helps plants, trees, and gardens grow.',
    },
    discussionQuestions: [
      'What sound do raindrops make when they tap on the ground?',
      'What do we open to stay dry in the rain?',
      'What happens to the flowers after the sunshine comes out?',
    ],
    classroomActivity: {
      title: 'Rain Cloud Rhythm Circle',
      instruction: 'The teacher leads the rhythm: 1 finger tap (light drizzle) -> 2 fingers (steady rain) -> palm claps (thunderstorm) -> quiet stretch (sunshine).',
      materialsNeeded: 'None (body percussion).',
    },
  },

  // 10. Body & Feelings
  {
    id: 'rhyme-happy-feelings',
    title: 'When I Feel Happy and Glad',
    category: 'body_feelings',
    categoryName: 'Body & Feelings',
    theme: 'Emotional Awareness & Self-Expression',
    icon: '😊',
    svgType: 'happy_face',
    ageGroup: '3–6 years',
    learningArea: 'Focus & Observation',
    learningOutcome: 'Identifies core emotions (happy, sad, calm) and learns healthy physical expressions.',
    rhymeText: `When I feel happy, a smile on my face,
I skip and I dance all over the place!
When I feel tired, I take a slow breath,
Resting my head from right to left.
When I feel mad or upset inside,
I count to three with my arms open wide:
ONE, TWO, THREE—now I am calm and bright,
Ready to learn and make everything right!`,
    rhymeLines: [
      'When I feel happy, a smile on my face,',
      'I skip and I dance all over the place!',
      'When I feel tired, I take a slow breath,',
      'Resting my head from right to left.',
      'When I feel mad or upset inside,',
      'I count to three with my arms open wide:',
      'ONE, TWO, THREE—now I am calm and bright,',
      'Ready to learn and make everything right!',
    ],
    vocabulary: ['Happy', 'Tired', 'Breath', 'Calm', 'Upset', 'Skip'],
    actions: [
      { lineHint: 'Smile on my face', instruction: 'Point to both sides of a wide smiling mouth.' },
      { lineHint: 'Skip and I dance', instruction: 'Sway gently side to side with happy hands.' },
      { lineHint: 'Take a slow breath', instruction: 'Inhale through nose deeply, then exhale slowly.' },
      { lineHint: 'Count to three', instruction: 'Hold up 1, 2, and 3 fingers slowly while breathing out.' },
    ],
    teacherGuide: {
      before: 'Show pictures of feeling faces (happy, calm, sad). Ask children how their body feels today.',
      during: 'Practice the slow deep breath together. Ensure children count calmly on fingers.',
      after: 'Reinforce that all feelings are okay, and taking 3 deep breaths helps us feel peaceful.',
    },
    discussionQuestions: [
      'What does your face look like when you are happy?',
      'What can we do with our breath when we feel upset?',
      'What makes you feel calm and peaceful in our classroom?',
    ],
    classroomActivity: {
      title: 'Calm Down 3-Count Breathing',
      instruction: 'Children place hands on their bellies, close eyes, and breathe in for 3 counts, feeling their bellies rise like balloons.',
      materialsNeeded: 'None.',
    },
  },

  // 11. Morning Routine
  {
    id: 'rhyme-good-morning',
    title: 'Good Morning, Bright Day!',
    category: 'routines_transitions',
    categoryName: 'Routines & Transitions',
    theme: 'Morning Arrival & Welcoming Community',
    icon: '☀️',
    svgType: 'sunshine',
    ageGroup: '3–6 years',
    learningArea: 'Everyday Knowledge',
    learningOutcome: 'Participates in cooperative morning circle welcoming rituals with positive peer engagement.',
    rhymeText: `Good morning, sunshine! Good morning, sky!
Good morning, little birds flying up so high!
Good morning, teachers! Good morning, friends!
A brand new day of preschool begins!
Hang up our backpack, put on our shoe,
So many wonderful things we will do!
We’ll paint and we’ll count and we’ll read and we’ll play,
Hip, hip, hooray for a beautiful day!`,
    rhymeLines: [
      'Good morning, sunshine! Good morning, sky!',
      'Good morning, little birds flying up so high!',
      'Good morning, teachers! Good morning, friends!',
      'A brand new day of preschool begins!',
      'Hang up our backpack, put on our shoe,',
      'So many wonderful things we will do!',
      'We’ll paint and we’ll count and we’ll read and we’ll play,',
      'Hip, hip, hooray for a beautiful day!',
    ],
    vocabulary: ['Sunshine', 'Backpack', 'Wonderful', 'Begin', 'Hooray'],
    actions: [
      { lineHint: 'Good morning sunshine', instruction: 'Reach hands up high to make a big round sun.' },
      { lineHint: 'Little birds flying', instruction: 'Hook thumbs together and flap fingers like bird wings.' },
      { lineHint: 'Good morning friends', instruction: 'Wave warmly to friends on the left and right.' },
      { lineHint: 'Hip, hip, hooray', instruction: 'Clap hands twice and raise arms in joy on hooray!' },
    ],
    teacherGuide: {
      before: 'Gather all children on the circle rug to begin the morning meeting.',
      during: 'Look at each child warmly as the class waves to their peers.',
      after: 'Ask children what center they are excited to explore today.',
    },
    discussionQuestions: [
      'What should we do with our backpack when we arrive at preschool?',
      'Who do we wave to in the morning?',
      'What is one fun thing you want to do today?',
    ],
    classroomActivity: {
      title: 'Morning Circle Hello Roll',
      instruction: 'Roll a soft ball across the circle to a friend. When they catch it, everyone calls out "Good morning, [Name]!" with a wave.',
      materialsNeeded: 'Soft foam ball.',
    },
  },

  // 12. Tidy Up & Goodbye Routine
  {
    id: 'rhyme-tidy-up',
    title: 'Tidy Toys, Wave Goodbye!',
    category: 'routines_transitions',
    categoryName: 'Routines & Transitions',
    theme: 'Clean Up & Dismissal Circle',
    icon: '🧹',
    svgType: 'tidy_toys',
    ageGroup: '3–6 years',
    learningArea: 'Everyday Knowledge',
    learningOutcome: 'Demonstrates personal responsibility in tidying classroom materials and closes the day with social warmth.',
    rhymeText: `Tick-tock, tick-tock, look at the clock,
Time to put away every puzzle and block!
Pick up the crayons, put books on the shelf,
Everyone helping each other and self!
Our classroom is tidy, our toys in their place,
A happy big smile on everyone’s face!
Wave to your friends, give a high-five or hug,
See you tomorrow on our preschool rug!`,
    rhymeLines: [
      'Tick-tock, tick-tock, look at the clock,',
      'Time to put away every puzzle and block!',
      'Pick up the crayons, put books on the shelf,',
      'Everyone helping each other and self!',
      'Our classroom is tidy, our toys in their place,',
      'A happy big smile on everyone’s face!',
      'Wave to your friends, give a high-five or hug,',
      'See you tomorrow on our preschool rug!',
    ],
    vocabulary: ['Tick-tock', 'Puzzle', 'Shelf', 'Tidy', 'Tomorrow'],
    actions: [
      { lineHint: 'Tick-tock look at the clock', instruction: 'Swing arms side to side like a clock pendulum.' },
      { lineHint: 'Pick up the crayons', instruction: 'Pretend to scoop toys off the floor into a basket.' },
      { lineHint: 'Put books on the shelf', instruction: 'Stack hands vertically like neat books.' },
      { lineHint: 'Wave to your friends', instruction: 'Wave two hands warmly and touch elbows or give gentle air high-fives.' },
    ],
    teacherGuide: {
      before: 'Give a 2-minute transition warning before reciting this rhyme to signal clean-up time.',
      during: 'Walk around the room modeling picking up blocks while chanting the rhythm steadily.',
      after: 'Gather on the rug for a final 60-second celebration of the tidy classroom.',
    },
    discussionQuestions: [
      'Where do the books go when we finish reading?',
      'How does a tidy classroom keep us safe?',
      'What was your favorite moment of our day today?',
    ],
    classroomActivity: {
      title: 'Beat the Tidy Clock Game',
      instruction: 'Challenge the class to put all blocks into their bins before the teacher finishes reciting the rhyme two times.',
      materialsNeeded: 'Classroom toy bins.',
    },
  },
];
