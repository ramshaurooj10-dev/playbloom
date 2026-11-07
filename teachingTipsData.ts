export interface TeachingTip {
  id: string;
  categoryId: string;
  title: string;
  tip: string;
  tryThis: string;
  whyItHelps: string;
  tags: string[];
  learningArea?: string;
  highlight?: boolean;
}

export interface TipCategory {
  id: string;
  name: string;
  icon: string;
  badge: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  count?: number;
}

export interface QuickTip {
  id: string;
  text: string;
  category: string;
  icon: string;
}

export interface LearningAreaTip {
  area: string;
  emoji: string;
  title: string;
  tip: string;
  quickAction: string;
}

export const TIP_CATEGORIES: TipCategory[] = [
  {
    id: 'classroom_management',
    name: 'Classroom Management',
    icon: '👩‍🏫',
    badge: 'Structure & Routine',
    color: 'text-amber-700 bg-amber-100 border-amber-300',
    bgGradient: 'from-amber-500/10 via-amber-50/50 to-white',
    borderColor: 'border-amber-300 hover:border-amber-400',
    description: 'Practical ways to organize routines, give instructions, and arrange classroom spaces smoothly.',
  },
  {
    id: 'positive_behavior',
    name: 'Positive Behavior',
    icon: '🌟',
    badge: 'Praise & Choices',
    color: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    bgGradient: 'from-emerald-500/10 via-emerald-50/50 to-white',
    borderColor: 'border-emerald-300 hover:border-emerald-400',
    description: 'Strengths-based strategies for encouraging positive choices, patience, and mutual respect.',
  },
  {
    id: 'learning_through_play',
    name: 'Learning Through Play',
    icon: '🧸',
    badge: 'Hands-On Discovery',
    color: 'text-sky-700 bg-sky-100 border-sky-300',
    bgGradient: 'from-sky-500/10 via-sky-50/50 to-white',
    borderColor: 'border-sky-300 hover:border-sky-400',
    description: 'Making concepts joyful through sensory games, playful inquiries, and hands-on exploration.',
  },
  {
    id: 'early_literacy',
    name: 'Early Literacy',
    icon: '🔤',
    badge: 'ABCs & Phonics',
    color: 'text-rose-700 bg-rose-100 border-rose-300',
    bgGradient: 'from-rose-500/10 via-rose-50/50 to-white',
    borderColor: 'border-rose-300 hover:border-rose-400',
    description: 'Practical ideas for letter sounds, phonological awareness, storytelling, and vocabulary.',
  },
  {
    id: 'early_math',
    name: 'Early Math',
    icon: '🔢',
    badge: 'Numbers & Shapes',
    color: 'text-indigo-700 bg-indigo-100 border-indigo-300',
    bgGradient: 'from-indigo-500/10 via-indigo-50/50 to-white',
    borderColor: 'border-indigo-300 hover:border-indigo-400',
    description: 'Everyday counting, one-to-one touch correspondence, subitizing, and spatial reasoning.',
  },
  {
    id: 'creative_activities',
    name: 'Creative Activities',
    icon: '🎨',
    badge: 'Art & Expression',
    color: 'text-purple-700 bg-purple-100 border-purple-300',
    bgGradient: 'from-purple-500/10 via-purple-50/50 to-white',
    borderColor: 'border-purple-300 hover:border-purple-400',
    description: 'Nurturing self-expression, process-oriented art, color discovery, and open-ended making.',
  },
  {
    id: 'fine_motor',
    name: 'Fine Motor Skills',
    icon: '✏️',
    badge: 'Pencil & Grip',
    color: 'text-orange-700 bg-orange-100 border-orange-300',
    bgGradient: 'from-orange-500/10 via-orange-50/50 to-white',
    borderColor: 'border-orange-300 hover:border-orange-400',
    description: 'Pencil control, finger strength, pincer grasp, and bilateral coordination development.',
  },
  {
    id: 'language_communication',
    name: 'Language & Communication',
    icon: '💬',
    badge: 'Speaking & Listening',
    color: 'text-teal-700 bg-teal-100 border-teal-300',
    bgGradient: 'from-teal-500/10 via-teal-50/50 to-white',
    borderColor: 'border-teal-300 hover:border-teal-400',
    description: 'Open-ended questions, sentence expansion, active listening, and conversational turns.',
  },
  {
    id: 'social_skills',
    name: 'Social Skills',
    icon: '🤝',
    badge: 'Sharing & Turns',
    color: 'text-blue-700 bg-blue-100 border-blue-300',
    bgGradient: 'from-blue-500/10 via-blue-50/50 to-white',
    borderColor: 'border-blue-300 hover:border-blue-400',
    description: 'Turn-taking, collaborative games, peer empathy, and peaceful problem-solving.',
  },
  {
    id: 'emotional_support',
    name: 'Emotional Support',
    icon: '❤️',
    badge: 'Feelings & Calm',
    color: 'text-pink-700 bg-pink-100 border-pink-300',
    bgGradient: 'from-pink-500/10 via-pink-50/50 to-white',
    borderColor: 'border-pink-300 hover:border-pink-400',
    description: 'Naming emotions, creating comforting spaces, supporting big feelings, and calming routines.',
  },
  {
    id: 'supporting_learners',
    name: 'Supporting Different Learners',
    icon: '👀',
    badge: 'Pacing & Inclusion',
    color: 'text-cyan-700 bg-cyan-100 border-cyan-300',
    bgGradient: 'from-cyan-500/10 via-cyan-50/50 to-white',
    borderColor: 'border-cyan-300 hover:border-cyan-400',
    description: 'Differentiating activities, gentle scaffolding, visual aids, and meeting every child where they are.',
  },
  {
    id: 'transitions_routines',
    name: 'Transitions & Routines',
    icon: '🔄',
    badge: 'Smooth Changes',
    color: 'text-lime-800 bg-lime-100 border-lime-300',
    bgGradient: 'from-lime-500/10 via-lime-50/50 to-white',
    borderColor: 'border-lime-300 hover:border-lime-400',
    description: 'Auditory cues, transition warnings, countdowns, and purposeful cleanup jobs.',
  },
];

export const TEACHING_TIPS_DATA: TeachingTip[] = [
  // 1. CLASSROOM MANAGEMENT
  {
    id: 'cm-01',
    categoryId: 'classroom_management',
    title: 'Give Short, Step-by-Step Instructions',
    tip: 'Deliver one or two simple instructions at a time rather than a multi-step list.',
    tryThis: 'Instead of saying "Put on your smock, grab blue paint, and sit at the round table", say: "First, put on your smock." Once ready, say: "Now walk to the painting table."',
    whyItHelps: 'Preschool working memory processes 1–2 verbal steps at a time without feeling overwhelmed.',
    tags: ['instructions', 'memory', 'clarity', 'classroom', 'attention'],
    highlight: true,
  },
  {
    id: 'cm-02',
    categoryId: 'classroom_management',
    title: 'Use a Consistent Daily Visual Routine',
    tip: 'Display a picture schedule of the day with simple icons (Circle Time, Snack, Outdoor Play).',
    tryThis: 'Review the visual routine cards together during morning circle. Point to the next icon so children know exactly what comes next.',
    whyItHelps: 'Predictability reduces anxiety and helps young children feel safe and oriented throughout the day.',
    tags: ['routine', 'schedule', 'visual aids', 'anxiety', 'circle time'],
  },
  {
    id: 'cm-03',
    categoryId: 'classroom_management',
    title: 'Give 5-Minute and 2-Minute Transition Warnings',
    tip: 'Signal upcoming activity changes well before asking children to stop playing.',
    tryThis: 'Ring a soft chime and announce: "In 2 minutes, our playtime will finish, and we will wash our hands for snack."',
    whyItHelps: 'Children need mental preparation time to bring their play narratives to a natural pause.',
    tags: ['transitions', 'warning', 'timer', 'chime', 'routine'],
  },
  {
    id: 'cm-04',
    categoryId: 'classroom_management',
    title: 'Keep Frequently Used Materials Within Easy Reach',
    tip: 'Store crayons, paper, and blocks in low, labeled transparent bins accessible without teacher assistance.',
    tryThis: 'Label bins with both a picture and the word (e.g., photo of crayons + "CRAYONS"). Teach children how to return items independently.',
    whyItHelps: 'Accessible storage builds self-regulation and prevents crowds of children waiting for materials.',
    tags: ['organization', 'independence', 'materials', 'storage'],
  },
  {
    id: 'cm-05',
    categoryId: 'classroom_management',
    title: 'Use Positive Reminders Instead of Saying "No"',
    tip: 'Tell children what TO do instead of only what NOT to do.',
    tryThis: 'Instead of "Don\'t run!", say: "Use walking feet in our classroom." Instead of "Stop shouting!", say: "Use your indoor talking voice."',
    whyItHelps: 'Children respond faster when given a clear, actionable replacement behavior.',
    tags: ['positive reminders', 'walking feet', 'indoor voice', 'directions'],
  },

  // 2. POSITIVE BEHAVIOR
  {
    id: 'pb-01',
    categoryId: 'positive_behavior',
    title: 'Praise the Specific Behavior You Want to See',
    tip: 'Acknowledge positive actions with descriptive, specific praise rather than generic words.',
    tryThis: 'Instead of "Good boy/girl", say: "I love how you placed the blocks gently in the basket without dropping them!"',
    whyItHelps: 'Specific praise teaches the child exactly which behavior was helpful and encourages peers to model it.',
    tags: ['praise', 'specific feedback', 'encouragement', 'modeling'],
    highlight: true,
  },
  {
    id: 'pb-02',
    categoryId: 'positive_behavior',
    title: 'Acknowledge Waiting and Turn-Taking',
    tip: 'Highlight patience while a child is waiting rather than only when they finally receive the toy.',
    tryThis: 'Notice a waiting child: "Maya, thank you for waiting so calmly with your hands ready while Liam finishes his turn."',
    whyItHelps: 'Reinforcing the effort of waiting builds impulse control and emotional endurance.',
    tags: ['patience', 'turns', 'sharing', 'self-control'],
  },
  {
    id: 'pb-03',
    categoryId: 'positive_behavior',
    title: 'Offer Two Simple, Acceptable Choices',
    tip: 'Give children control over small decisions to prevent power struggles.',
    tryThis: 'When a child resists cleaning up: "Would you like to put away the big red blocks first, or the small blue blocks?"',
    whyItHelps: 'Choices satisfy a preschooler\'s natural drive for autonomy while still achieving the desired goal.',
    tags: ['choices', 'autonomy', 'cleanup', 'cooperation'],
  },
  {
    id: 'pb-04',
    categoryId: 'positive_behavior',
    title: 'Stay Calm and Neutral When Correcting Behavior',
    tip: 'Lower your pitch, crouch to eye level, and speak with a steady, compassionate voice.',
    tryThis: 'Get down on one knee, make gentle eye contact: "Blocks are for building, not throwing. Let\'s build a tower together."',
    whyItHelps: 'A calm teacher regulates a distressed child\'s nervous system and prevents escalating emotional reactivity.',
    tags: ['calm', 'redirection', 'eye level', 'co-regulation'],
  },
  {
    id: 'pb-05',
    categoryId: 'positive_behavior',
    title: 'Separate the Behavior from the Child\'s Identity',
    tip: 'Avoid labeling children as "naughty", "troublemakers", or "difficult".',
    tryThis: 'Say: "Hitting is not safe in our class. You are a kind friend, and we use our gentle hands."',
    whyItHelps: 'Preschoolers internalize identity labels; separating behavior preserves healthy self-esteem.',
    tags: ['empathy', 'identity', 'gentle hands', 'respect'],
  },

  // 3. LEARNING THROUGH PLAY
  {
    id: 'lp-01',
    categoryId: 'learning_through_play',
    title: 'Turn Counting into an Action Game',
    tip: 'Incorporate bodily movement, animal jumps, or rhythmic claps into counting practice.',
    tryThis: '"Let\'s hop like kangaroos 4 times! Ready? Hop 1... Hop 2... Hop 3... Hop 4!"',
    whyItHelps: 'Kinesthetic movement connects mathematical quantities to physical proprioceptive memory.',
    tags: ['kinesthetic', 'counting game', 'hops', 'gross motor'],
    highlight: true,
  },
  {
    id: 'lp-02',
    categoryId: 'learning_through_play',
    title: 'Use Real Toys and Everyday Objects for Sorting',
    tip: 'Use real buttons, toy vehicles, pinecones, and colorful blocks instead of abstract flashcards.',
    tryThis: 'Give two sorting plates: "Can you put all the animals with four legs on this plate, and birds with wings on this plate?"',
    whyItHelps: 'Tactile 3D objects provide rich sensory input and organic classification opportunities.',
    tags: ['sorting', 'tactile', 'manipulatives', 'real objects'],
  },
  {
    id: 'lp-03',
    categoryId: 'learning_through_play',
    title: 'Let Children Explore Before Giving the Answer',
    tip: 'Provide 1–2 minutes of silent hands-on touch time when introducing a new tool or puzzle.',
    tryThis: 'Before telling children how a magnifying glass works, hand them out: "Look through it! What does your hand look like?"',
    whyItHelps: 'Self-initiated discovery builds genuine curiosity and intrinsic motivation to learn.',
    tags: ['curiosity', 'exploration', 'discovery', 'inquiry'],
  },
  {
    id: 'lp-04',
    categoryId: 'learning_through_play',
    title: 'Ask Open Inquiry: "What Do You Notice?"',
    tip: 'Use observation-sparking questions rather than closed yes/no queries.',
    tryThis: 'When looking at leaves or shapes: "What do you notice about the edges of this leaf? Is it smooth or bumpy?"',
    whyItHelps: 'Encourages critical thinking and observational vocabulary without the fear of being "wrong".',
    tags: ['inquiry', 'observation', 'open-ended', 'thinking'],
  },
  {
    id: 'lp-05',
    categoryId: 'learning_through_play',
    title: 'Encourage Children to Explain What They Are Doing',
    tip: 'Invite children to narrate their play process aloud as they build or draw.',
    tryThis: 'Sit beside a block builder: "Tell me about this tall structure you\'re making! Who lives at the very top?"',
    whyItHelps: 'Verbalizing actions organizes thought processes and strengthens sequential language.',
    tags: ['narration', 'storytelling', 'expressive language', 'blocks'],
  },

  // 4. EARLY LITERACY
  {
    id: 'el-01',
    categoryId: 'early_literacy',
    title: 'Focus on One Letter Sound at a Time',
    tip: 'Emphasize the clear phonics sound (/a/ as in apple) before introducing the letter name.',
    tryThis: 'Make the sound with exaggerated mouth movement: "/m/... like delicious food! /m/ /m/ Monkey!" Have children touch their lips to feel the vibration.',
    whyItHelps: 'Phonemic awareness starts with tactile and auditory sound recognition before abstract symbol memorization.',
    tags: ['phonics', 'letter sounds', 'auditory', 'early reading'],
    highlight: true,
  },
  {
    id: 'el-02',
    categoryId: 'early_literacy',
    title: 'Use Familiar Tangible Objects for Sounds',
    tip: 'Bring a "Sound Mystery Bag" with real items matching the target sound.',
    tryThis: 'For Letter B, pull out a real ball, banana, and toy bear from the bag: "Listen closely: B-all, B-anana, B-ear!"',
    whyItHelps: 'Connecting abstract sounds to real concrete items accelerates memory retention.',
    tags: ['mystery bag', 'vocabulary', 'phonological awareness'],
  },
  {
    id: 'el-03',
    categoryId: 'early_literacy',
    title: 'Sound Scavenger Hunt in the Classroom',
    tip: 'Invite children to physically find things in the room that start with the target sound.',
    tryThis: '"We are hunting for things that start with /s/! Can you point to the scissors, the sun picture, or a student\'s shoe?"',
    whyItHelps: 'Active searching transforms phonics from a passive lesson into an interactive classroom game.',
    tags: ['scavenger hunt', 'active learning', 'phonics game'],
  },
  {
    id: 'el-04',
    categoryId: 'early_literacy',
    title: 'Interactive Read-Aloud with Picture Prediction',
    tip: 'Pause on illustrated story pages to let children predict what will happen next.',
    tryThis: 'Before turning the page: "Look at Bear\'s face! Why do you think he looks surprised? What might be behind the tree?"',
    whyItHelps: 'Develops story comprehension, inferencing skills, and expressive emotional vocabulary.',
    tags: ['reading', 'storytelling', 'comprehension', 'prediction'],
  },

  // 5. EARLY MATH
  {
    id: 'em-01',
    categoryId: 'early_math',
    title: 'Touch Each Object as You Count (1-to-1 Correspondence)',
    tip: 'Teach children to physically point or tap each item with their index finger as they say the number.',
    tryThis: 'Line up 4 toy cars. Guide the child\'s finger: "Touch 1 (car), touch 2 (car), touch 3 (car), touch 4 (car). We have 4 cars!"',
    whyItHelps: 'Prevents children from rapidly reciting number words faster than they can count items.',
    tags: ['counting', '1-to-1 correspondence', 'numbers', 'manipulatives'],
    highlight: true,
  },
  {
    id: 'em-02',
    categoryId: 'early_math',
    title: 'Compare Sets Using "More" and "Less"',
    tip: 'Use visual piles of classroom counters to build comparative number sense.',
    tryThis: 'Place 2 apples on one plate and 5 apples on another: "Which plate has MORE yummy apples? Which has LESS?"',
    whyItHelps: 'Builds foundational pre-addition concepts before formal arithmetic symbols.',
    tags: ['more or less', 'comparison', 'quantities', 'math sense'],
  },
  {
    id: 'em-03',
    categoryId: 'early_math',
    title: 'Shape Detective Around the Room',
    tip: 'Find 2D and 3D shapes in everyday classroom architecture.',
    tryThis: '"The classroom clock is a circle! The door is a tall rectangle! What shape is our snack napkin?"',
    whyItHelps: 'Connects geometric terminology to real physical objects in the child\'s immediate environment.',
    tags: ['shapes', 'geometry', 'real world', 'observation'],
  },
  {
    id: 'em-04',
    categoryId: 'early_math',
    title: 'Incorporate Counting into Daily Routines',
    tip: 'Count everyday moments naturally throughout the preschool day.',
    tryThis: '"Let\'s count how many friends are sitting on the rug today: 1, 2, 3, 4, 5!" or "Count 3 apple slices for your plate!"',
    whyItHelps: 'Demonstrates to children that math is a practical, useful part of daily life.',
    tags: ['daily routines', 'natural math', 'counting friends'],
  },

  // 6. CREATIVE ACTIVITIES
  {
    id: 'ca-01',
    categoryId: 'creative_activities',
    title: 'Value the Process Over the Final Product',
    tip: 'Focus on the child\'s exploration of textures, colors, and brush strokes rather than making a cookie-cutter craft.',
    tryThis: 'Instead of directing where to glue pieces, say: "Tell me about how you mixed those colors together! What does it feel like?"',
    whyItHelps: 'Process art builds genuine artistic confidence, creative problem solving, and reduces performance anxiety.',
    tags: ['process art', 'creativity', 'expression', 'confidence'],
    highlight: true,
  },
  {
    id: 'ca-02',
    categoryId: 'creative_activities',
    title: 'Let Children Choose Their Own Colors',
    tip: 'Provide a palette of options and allow children to color trees purple or skies yellow.',
    tryThis: 'Avoid saying "Trees must be green." Instead say: "You chose a bright purple for your tree! It looks like a magical forest!"',
    whyItHelps: 'Encourages individual creative voice and risk-taking without fear of correction.',
    tags: ['colors', 'choice', 'imagination', 'art'],
  },
  {
    id: 'ca-03',
    categoryId: 'creative_activities',
    title: 'Provide Generous Physical Space to Create',
    tip: 'Ensure children have elbow room, large paper sheets, and easy access to water cups.',
    tryThis: 'Tape large butcher paper to the floor or easel so children can use whole-arm brush strokes.',
    whyItHelps: 'Preschoolers develop gross motor control in their shoulders before fine wrist control.',
    tags: ['space', 'easel', 'butcher paper', 'gross motor'],
  },
  {
    id: 'ca-04',
    categoryId: 'creative_activities',
    title: 'Celebrate and Display Every Child\'s Work',
    tip: 'Hang every piece of art at child eye-level with their name clearly written.',
    tryThis: 'Create an "Our Little Artists Gallery" bulletin board at 3-foot height so children can view and admire each other\'s creations.',
    whyItHelps: 'Displays foster a sense of classroom belonging and validate each child\'s unique contribution.',
    tags: ['display', 'gallery', 'belonging', 'pride'],
  },

  // 7. FINE MOTOR SKILLS
  {
    id: 'fm-01',
    categoryId: 'fine_motor',
    title: 'Start with Broad Lines and Curves First',
    tip: 'Practice large sweeping strokes, zigzag paths, and wave lines before small letter handwriting.',
    tryThis: 'Have children draw large "wavy ocean waves" or "rocket zoom lines" in a tray filled with colored sensory sand.',
    whyItHelps: 'Pre-writing patterns develop hand-eye coordination and pencil trajectory control naturally.',
    tags: ['pre-writing', 'lines', 'sand tray', 'pencil control'],
    highlight: true,
  },
  {
    id: 'fm-02',
    categoryId: 'fine_motor',
    title: 'Strengthen Finger Muscles with Playdough & Tongs',
    tip: 'Incorporate daily pinching, rolling, and squeezing activities into fine motor stations.',
    tryThis: 'Provide child-safe plastic tweezers or kitchen tongs to pick up pom-poms and drop them into muffin tin cups.',
    whyItHelps: 'Develops the intrinsic hand muscles and pincer grasp needed for comfortable, fatigue-free pencil grip.',
    tags: ['playdough', 'pincer grasp', 'tongs', 'hand strength'],
  },
  {
    id: 'fm-03',
    categoryId: 'fine_motor',
    title: 'Keep Writing Practice Sessions Short (3–5 Mins)',
    tip: 'Avoid long tracing worksheets that cause hand fatigue and frustration.',
    tryThis: 'Provide a mini worksheet with 3–4 traceable letters, followed by a fun coloring stamp or sticker reward.',
    whyItHelps: 'Short bursts maintain high engagement and positive associations with handwriting.',
    tags: ['short sessions', 'hand fatigue', 'tracing', 'fine motor'],
  },
  {
    id: 'fm-04',
    categoryId: 'fine_motor',
    title: 'Do Not Force an Adult Tripod Grip Too Early',
    tip: 'Recognize that 3-year-olds naturally use palmar and digital pronate grasps before mature tripod grips.',
    tryThis: 'Provide broken crayons or small chunky chalk pieces. Shorter writing tools naturally encourage fingers to pinch closer to the tip.',
    whyItHelps: 'Developmentally appropriate tools guide natural hand progression without painful forced posture.',
    tags: ['grip', 'tripod', 'crayons', 'development'],
  },

  // 8. LANGUAGE & COMMUNICATION
  {
    id: 'lc-01',
    categoryId: 'language_communication',
    title: 'Ask Open-Ended Questions',
    tip: 'Use questions starting with "How", "Why", or "Tell me about..." rather than simple yes/no questions.',
    tryThis: 'Instead of "Did you like the story?", ask: "How do you think the little puppy felt when he found his warm blanket?"',
    whyItHelps: 'Open-ended questions prompt sentence construction, complex vocabulary, and cognitive reasoning.',
    tags: ['open-ended', 'questions', 'conversation', 'vocabulary'],
    highlight: true,
  },
  {
    id: 'lc-02',
    categoryId: 'language_communication',
    title: 'Give 3 to 5 Seconds of "Wait Time"',
    tip: 'After asking a question, silently count to 4 before speaking or prompting another child.',
    tryThis: 'Ask the question, smile warmly, and maintain quiet eye contact while the child formulates their answer.',
    whyItHelps: 'Preschoolers take longer to retrieve words from memory; wait time dramatically increases participation from shy children.',
    tags: ['wait time', 'patience', 'shy children', 'processing'],
  },
  {
    id: 'lc-03',
    categoryId: 'language_communication',
    title: 'Repeat and Expand Child Sentences',
    tip: 'Model richer grammar and vocabulary by echoing what the child said with added descriptive words.',
    tryThis: 'Child: "Look, big truck!" Teacher: "Yes! Look at that enormous yellow dump truck rolling down the road!"',
    whyItHelps: 'Expansions teach advanced vocabulary and grammatical structures naturally without punitive correction.',
    tags: ['expansion', 'modeling', 'grammar', 'rich vocabulary'],
  },
  {
    id: 'lc-04',
    categoryId: 'language_communication',
    title: 'Introduce New Descriptive Words Naturally',
    tip: 'Use rich adjectives and verbs during daily conversations and classroom stories.',
    tryThis: 'Instead of just "It is cold", say: "Brr, it feels freezing and chilly outside! Let\'s zip our warm jackets."',
    whyItHelps: 'Contextual exposure builds expansive receptive and expressive vocabularies rapidly.',
    tags: ['vocabulary', 'adjectives', 'rich language'],
  },

  // 9. SOCIAL SKILLS
  {
    id: 'ss-01',
    categoryId: 'social_skills',
    title: 'Teach Turn-Taking with Concrete Timers or Song Tracks',
    tip: 'Use a visual 2-minute sand timer or a short song so turn-taking is transparent and fair.',
    tryThis: '"When the sand finishes running down in our blue timer, it will be Maya\'s turn to ride the tricycle."',
    whyItHelps: 'Visual timers remove teacher bias and make abstract time tangible for young children.',
    tags: ['turn taking', 'sand timer', 'fairness', 'sharing'],
    highlight: true,
  },
  {
    id: 'ss-02',
    categoryId: 'social_skills',
    title: 'Model Sharing and Asking Language',
    tip: 'Give children specific phrases to use when asking for toys or joining games.',
    tryThis: 'Prompt a child: "You can say: \'Can I play with the blue car when you are done?\'" Practice repeating it together.',
    whyItHelps: 'Provides children with positive verbal scripts, reducing physical grabbing or shouting.',
    tags: ['sharing phrases', 'scripts', 'cooperation', 'asking'],
  },
  {
    id: 'ss-03',
    categoryId: 'social_skills',
    title: 'Pair Children for Collaborative Activities',
    tip: 'Create buddy partnerships for simple tasks like carrying the crayon basket or building a train track.',
    tryThis: '"Liam and Noah, you two are the Block Builders today! Let\'s see how long a road you can build together."',
    whyItHelps: 'Small pair partnerships build mutual problem-solving and foundational social bonds.',
    tags: ['partners', 'buddies', 'collaboration', 'friendship'],
  },
  {
    id: 'ss-04',
    categoryId: 'social_skills',
    title: 'Help Children Use Words to Solve Disagreements',
    tip: 'Mediate calmly without immediately assigning blame.',
    tryThis: 'Bring both children together: "Aria, tell Liam how you felt when the tower fell. Liam, listen to Aria\'s words."',
    whyItHelps: 'Teaches peaceful conflict resolution and emotional perspective-taking from an early age.',
    tags: ['conflict resolution', 'mediation', 'empathy', 'words'],
  },

  // 10. EMOTIONAL SUPPORT
  {
    id: 'es-01',
    categoryId: 'emotional_support',
    title: 'Acknowledge and Name Emotions Calmly',
    tip: 'Validate the child\'s feeling before offering solutions or moving to redirection.',
    tryThis: '"I can see you feel frustrated because the puzzle piece didn\'t fit. It\'s okay to feel upset. Take a deep breath with me."',
    whyItHelps: 'Naming emotions helps children transition from emotional overwhelm to logical calm (name it to tame it).',
    tags: ['emotions', 'validation', 'calm down', 'frustration'],
    highlight: true,
  },
  {
    id: 'es-02',
    categoryId: 'emotional_support',
    title: 'Create a "Cozy Calm Down Corner"',
    tip: 'Set up a quiet, comfortable nook with soft pillows, plush toys, and calming picture books.',
    tryThis: 'Introduce the space positively: "This is our Cozy Corner. Anyone can sit here when they need a quiet rest or a warm hug."',
    whyItHelps: 'Provides a safe, non-punitive space for children to self-regulate when overwhelmed.',
    tags: ['calm down corner', 'cozy', 'self regulation', 'comfort'],
  },
  {
    id: 'es-03',
    categoryId: 'emotional_support',
    title: 'Support Morning Separation Anxiety with a Predictable Goodbye',
    tip: 'Encourage parents to use a brief, warm goodbye ritual (e.g., 2 hugs and a high-five) rather than sneaking away.',
    tryThis: 'Greet the child at the door with a comforting job: "Good morning! Can you help me feed our class goldfish today?"',
    whyItHelps: 'Purposeful morning jobs shift focus from separation distress to meaningful classroom participation.',
    tags: ['separation anxiety', 'morning arrival', 'goodbye ritual', 'jobs'],
  },
  {
    id: 'es-04',
    categoryId: 'emotional_support',
    title: 'Teach Simple Belly Breathing Techniques',
    tip: 'Use fun playful imagery like "Smell the flower, blow out the birthday candle" for deep calming breaths.',
    tryThis: 'Put hands on belly: "Breathe in through your nose to smell the sweet flower 🌸... Now blow out the candle 🕯️!"',
    whyItHelps: 'Slow diaphragmatic exhalations physically activate the parasympathetic calming response.',
    tags: ['breathing', 'flower candle', 'calm', 'co-regulation'],
  },

  // 11. SUPPORTING DIFFERENT LEARNERS
  {
    id: 'sl-01',
    categoryId: 'supporting_learners',
    title: 'Demonstrate Physically Before Asking Children to Try',
    tip: 'Show the exact physical actions step-by-step alongside your verbal explanation.',
    tryThis: 'Before cutting paper, hold scissors up: "Thumb goes in the top small hole. Fingers in the bottom hole. Open... close... snip!"',
    whyItHelps: 'Visual demonstrations bridge language barriers and support visual and kinesthetic learners.',
    tags: ['demonstration', 'visual learning', 'modeling', 'inclusion'],
    highlight: true,
  },
  {
    id: 'sl-02',
    categoryId: 'supporting_learners',
    title: 'Break Complex Tasks into Mini-Milestones',
    tip: 'Chunk activities into bite-sized steps with celebration points after each step.',
    tryThis: 'For a 4-step craft: Step 1: "Only glue the circle." (Check & high-five!). Step 2: "Now stick 2 googly eyes." (Check!).',
    whyItHelps: 'Prevents cognitive overload and ensures every child experiences frequent success.',
    tags: ['chunking', 'milestones', 'differentiation', 'scaffolding'],
  },
  {
    id: 'sl-03',
    categoryId: 'supporting_learners',
    title: 'Offer Extended Time Without Pressure',
    tip: 'Allow children who work at a thoughtful pace to finish at their own speed without rushing.',
    tryThis: 'Set up an "Open Project Station" where unfinished drawings or puzzles can be kept safely to finish later in the day.',
    whyItHelps: 'Respects diverse processing speeds and prevents anxiety about falling behind peers.',
    tags: ['pacing', 'extended time', 'patient teaching', 'equity'],
  },
  {
    id: 'sl-04',
    categoryId: 'supporting_learners',
    title: 'Celebrate Individual Personal Progress',
    tip: 'Compare a child\'s progress only to their own past performance, never to classmates.',
    tryThis: '"Noah, remember last week when you traced 1 number? Look today—you traced all 3 numbers by yourself!"',
    whyItHelps: 'Builds authentic growth mindset and intrinsic pride in effort and practice.',
    tags: ['growth mindset', 'individual progress', 'encouragement'],
  },

  // 12. TRANSITIONS & ROUTINES
  {
    id: 'tr-01',
    categoryId: 'transitions_routines',
    title: 'Use a Consistent Auditory Transition Signal',
    tip: 'Use a pleasant instrument (wind chime, rainstick, or ukulele chord) as the universal signal to freeze and listen.',
    tryThis: 'Play 3 gentle chime notes: "When you hear the bell, freeze like a snowman ⛄, eyes on teacher, ears listening!"',
    whyItHelps: 'A distinct musical cue cuts through classroom noise without the teacher needing to raise their voice.',
    tags: ['chime', 'auditory signal', 'freeze', 'transitions'],
    highlight: true,
  },
  {
    id: 'tr-02',
    categoryId: 'transitions_routines',
    title: 'Sing a Familiar Cleanup Song',
    tip: 'Associate cleanup time with a predictable, upbeat 60-second classroom song.',
    tryThis: 'Sing together: "Clean up, clean up, everybody everywhere! Clean up, clean up, everybody do your share!"',
    whyItHelps: 'Music provides a natural rhythmic pace and turns cleanup from a chore into a shared social rhythm.',
    tags: ['cleanup song', 'music', 'rhythm', 'tidying'],
  },
  {
    id: 'tr-03',
    categoryId: 'transitions_routines',
    title: 'Assign Meaningful Classroom Helper Jobs',
    tip: 'Rotate simple daily helper roles (Line Leader, Paper Passer, Plant Waterer, Mat Collector).',
    tryThis: 'Display a Helper Chart with student name cards. Call helpers first during transitions: "Mat helpers, time for your job!"',
    whyItHelps: 'Fosters classroom responsibility, purposeful teamwork, and pride in caring for the shared environment.',
    tags: ['jobs', 'helpers', 'responsibility', 'leadership'],
  },
  {
    id: 'tr-04',
    categoryId: 'transitions_routines',
    title: 'Move Children in Small Groups Rather than All at Once',
    tip: 'Transition children by clothing color, animal noises, or initial sounds to prevent door bottlenecks.',
    tryThis: '"If you are wearing blue shoes, tiptoe to wash your hands! If you are wearing red shoes, waddle like ducks to wash hands!"',
    whyItHelps: 'Small group movement keeps transitions orderly, playful, and calm.',
    tags: ['small groups', 'movement', 'orderly', 'smooth routine'],
  },
];

export const QUICK_TEACHING_TIPS: QuickTip[] = [
  { id: 'q1', text: "Get children's full visual attention before giving any instructions.", category: 'Management', icon: '👀' },
  { id: 'q2', text: 'Demonstrate the activity physically before asking children to try.', category: 'Instruction', icon: '✨' },
  { id: 'q3', text: 'Give 3–5 seconds of quiet wait time before repeating a question.', category: 'Language', icon: '⏳' },
  { id: 'q4', text: 'Praise the effort, focus, and participation—not just the final result.', category: 'Behavior', icon: '🌟' },
  { id: 'q5', text: 'Use simple, direct language: tell children what TO do instead of "Don\'t".', category: 'Language', icon: '🗣️' },
  { id: 'q6', text: 'Let children explore materials hands-on before giving the formal lesson.', category: 'Play', icon: '🧸' },
  { id: 'q7', text: 'Ask "What do you notice?" to spark curiosity and open discussion.', category: 'Inquiry', icon: '🔍' },
  { id: 'q8', text: 'Give two simple acceptable choices when a child resists a transition.', category: 'Behavior', icon: '✌️' },
  { id: 'q9', text: 'Keep direct practice activities short (5–10 mins) to match attention spans.', category: 'Pacing', icon: '⏱️' },
  { id: 'q10', text: 'Celebrate small individual milestones and personal progress daily.', category: 'Support', icon: '🎉' },
];

export const LEARNING_AREA_TIPS: LearningAreaTip[] = [
  {
    area: 'ABC & Phonics',
    emoji: '🔤',
    title: 'Exaggerate Mouth Shapes for Phonics Sounds',
    tip: 'Say the sound clearly, point to your lips, and let children repeat it while looking in a handheld mirror.',
    quickAction: 'Practice /m/, /s/, /b/ with hand on throat to feel vocal cord vibrations.',
  },
  {
    area: 'Numbers & Counting',
    emoji: '🔢',
    title: 'Touch Every Object While Counting',
    tip: 'Guide children to physically tap each object with their pointer finger as they say the number word.',
    quickAction: 'Line up blocks in a straight line before counting to avoid counting items twice.',
  },
  {
    area: 'Shapes & Spatial',
    emoji: '🔺',
    title: 'Hunt for Shapes in the Real Classroom',
    tip: 'Let children find real classroom objects matching the geometric shape (e.g. circle clock, square window).',
    quickAction: 'Have children trace the edges of shapes in the air with their finger.',
  },
  {
    area: 'Colors & Visual',
    emoji: '🎨',
    title: 'Color Scavenger Hunt and Sorting',
    tip: 'Ask children to find classroom objects of the target color and place them in matching color bowls.',
    quickAction: 'Use two primary colors in a ziplock bag to demonstrate color mixing without mess.',
  },
  {
    area: 'Matching & Logic',
    emoji: '🧩',
    title: 'Ask Children to Explain Their Match',
    tip: 'When a child pairs two items, ask: "Why do these two friends belong together?" to develop logic reasoning.',
    quickAction: 'Encourage children to notice shared features: same color, same number of legs, or same use.',
  },
];
