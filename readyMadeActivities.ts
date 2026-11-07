export interface ActivityVisualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  illustrationType:
    | 'prepare_materials'
    | 'teacher_introduce'
    | 'child_hands_on'
    | 'matching_sorting'
    | 'explore_movement'
    | 'sensory_touch'
    | 'counting_math'
    | 'story_puppet'
    | 'science_nature'
    | 'review_celebrate'
    | string;
  highlightDetail?: string;
}

export interface PreschoolActivity {
  id: string;
  name: string;
  category: string;
  categoryIcon: string;
  ageGroup: string;
  learningArea: string;
  duration: string;
  objective: string;
  materialsNeeded: string[];
  preparation: string;
  writtenSteps: {
    stepNumber: number;
    title: string;
    description: string;
  }[];
  visualSteps: ActivityVisualStep[];
  teacherTips: string[];
  childParticipation: string;
  learningOutcome: string;
  isSaved?: boolean;
}

export const ACTIVITY_CATEGORIES = [
  { id: 'all', label: 'All Activities', icon: '🌟' },
  { id: 'alphabet', label: 'Alphabet & Phonics', icon: '🔤' },
  { id: 'counting', label: 'Counting', icon: '🔢' },
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'shapes', label: 'Shapes', icon: '🔺' },
  { id: 'fine_motor', label: 'Fine Motor Skills', icon: '✂️' },
  { id: 'art_craft', label: 'Art & Craft', icon: '🖌️' },
  { id: 'matching', label: 'Matching', icon: '🧩' },
  { id: 'sorting', label: 'Sorting', icon: '🧺' },
  { id: 'memory', label: 'Memory Games', icon: '🧠' },
  { id: 'music_movement', label: 'Music & Movement', icon: '🎵' },
  { id: 'sensory', label: 'Sensory Play', icon: '🫧' },
  { id: 'storytelling', label: 'Storytelling', icon: '📖' },
] as const;

export const READY_MADE_ACTIVITIES: PreschoolActivity[] = [
  {
    id: 'act-alphabet-sound-hunt',
    name: 'Letter Sound Hunt',
    category: 'Alphabet & Phonics',
    categoryIcon: '🔤',
    ageGroup: '3–5 years',
    learningArea: 'Early Literacy & Phonics',
    duration: '15–20 mins',
    objective: 'Children identify the initial phonetic sound of a target letter and discover classroom objects matching that sound.',
    materialsNeeded: [
      'Large illustrated letter flashcard (e.g., "B" for Ball, Bear)',
      'Small woven collection basket for each pair',
      'Classroom objects starting with target sound (ball, book, block, bear)',
      'A cozy circle time mat',
    ],
    preparation: 'Pre-place 4–6 safe objects starting with the target letter sound around the classroom at child eye level.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Letter Sound & Basket',
        description: 'Set out the letter flashcard and hand-held discovery baskets on the center rug.',
      },
      {
        stepNumber: 2,
        title: 'Introduce the Sound',
        description: 'Gather children in circle. Show letter "B", make the /b/ sound together, and touch lips to feel the vibration.',
      },
      {
        stepNumber: 3,
        title: 'Classroom Sound Hunt',
        description: 'Send children in pairs with baskets to find objects that start with the /b/ sound.',
      },
      {
        stepNumber: 4,
        title: 'Show & Sound Review',
        description: 'Return to circle. Each child pulls an object from their basket and says its name and initial sound together.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Letter & Basket',
        instruction: 'Lay out big letter cards and small collection baskets.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Letter Card & Woven Basket',
      },
      {
        stepNumber: 2,
        title: 'Introduce the Sound',
        instruction: 'Teacher shows letter "B" and practices the /b/ /b/ sound with children.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Phonics mouth shape & card',
      },
      {
        stepNumber: 3,
        title: 'Explore & Collect',
        instruction: 'Children search the room and place matching items into their baskets.',
        illustrationType: 'child_hands_on',
        highlightDetail: 'Finding ball, block, book',
      },
      {
        stepNumber: 4,
        title: 'Circle Review & Cheer',
        instruction: 'Children share their found treasures and celebrate their phonics discoveries.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Group cheer and high-fives',
      },
    ],
    teacherTips: [
      'Focus on the letter sound (/b/), not just the letter name.',
      'For younger children, offer 2 choices: "Is this a /b/ Ball or a /d/ Duck?"',
      'Encourage peer collaboration by partnering older and younger preschoolers.',
    ],
    childParticipation: 'Children actively move around the room, explore objects with their hands, and enunciate phonics sounds out loud.',
    learningOutcome: 'Recognizes the initial phonetic sound of common alphabet letters and pairs sounds to concrete real-world objects.',
  },
  {
    id: 'act-count-and-match',
    name: 'Count & Match',
    category: 'Counting',
    categoryIcon: '🔢',
    ageGroup: '3–5 years',
    learningArea: 'Early Mathematics & Logic',
    duration: '20 mins',
    objective: 'Develop one-to-one correspondence by counting physical manipulatives and placing them onto numbered dot cards.',
    materialsNeeded: [
      'Numbered cardstock mats (1 to 5 or 1 to 10)',
      'Large colorful counting buttons or plastic counting bears',
      'Small wooden tongs or tweezers (optional fine motor)',
      'Sorting bowls',
    ],
    preparation: 'Arrange number mats (with large numeral and matching dots) at each seat with a bowl of 10 counting tokens.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Set Out Number Mats',
        description: 'Place clean number mats (1–5) and bowls of colorful counting tokens on the tables.',
      },
      {
        stepNumber: 2,
        title: 'Demonstrate One-to-One Counting',
        description: 'Show children how to place exactly one counter on each printed dot while counting aloud: "One... two... three!"',
      },
      {
        stepNumber: 3,
        title: 'Child Counting Practice',
        description: 'Children count counters onto their mats, matching quantity to the written number.',
      },
      {
        stepNumber: 4,
        title: 'Double-Check & Count Aloud',
        description: 'Teacher visits each child and counts along with them by pointing fingers at each placed token.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Counting Trays',
        instruction: 'Set up number cards with dots and bowls of colorful buttons.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Number cards & bowls',
      },
      {
        stepNumber: 2,
        title: 'Model One-by-One',
        instruction: 'Teacher places one token per dot and counts: "1, 2, 3!"',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Pointing finger & counting',
      },
      {
        stepNumber: 3,
        title: 'Hands-On Matching',
        instruction: 'Children place colorful counters on each dot until filled.',
        illustrationType: 'counting_math',
        highlightDetail: 'Matching tokens to dots',
      },
      {
        stepNumber: 4,
        title: 'Celebrate Number Success',
        instruction: 'Count the total together and applaud accurate counting.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'High five and number star',
      },
    ],
    teacherTips: [
      'Ensure counters are large enough to prevent choking hazards.',
      'Guide children to point with an index finger as they count each item sequentially.',
      'For advanced learners, ask: "How many will we have if we add one more?"',
    ],
    childParticipation: 'Children pick up counters, count aloud, and place them with precision onto matching numeral templates.',
    learningOutcome: 'Demonstrates one-to-one correspondence up to 5 or 10 and associates quantities with written numerals.',
  },
  {
    id: 'act-color-sorting',
    name: 'Color Sorting Baskets',
    category: 'Colors',
    categoryIcon: '🎨',
    ageGroup: '2–4 years',
    learningArea: 'Visual Perception & Cognitive Skills',
    duration: '15–20 mins',
    objective: 'Identify, name, and categorize assorted classroom toys into corresponding primary color baskets.',
    materialsNeeded: [
      '4 colored baskets or bowls (Red, Blue, Yellow, Green)',
      'Mixed basket of colored toys (blocks, rings, beanbags, balls)',
      'Colored felt floor mats',
    ],
    preparation: 'Place the 4 colored baskets in a row on the carpet with the mixed item bin in the center.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Arrange Color Baskets',
        description: 'Position red, blue, yellow, and green baskets clearly spaced out on the floor.',
      },
      {
        stepNumber: 2,
        title: 'Color Review Warm-Up',
        description: 'Hold up each basket and have children shout out the color: "Red! Blue! Yellow! Green!"',
      },
      {
        stepNumber: 3,
        title: 'Interactive Sorting Relay',
        description: 'Children pick one item from the mystery box, announce its color, and gently place it in the matching basket.',
      },
      {
        stepNumber: 4,
        title: 'Inspect & Celebrate',
        description: 'Look into each basket together to verify that all items are in their matching color home.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Arrange 4 Color Baskets',
        instruction: 'Line up Red, Blue, Yellow, and Green baskets in a semi-circle.',
        illustrationType: 'prepare_materials',
        highlightDetail: '4 distinct primary color bins',
      },
      {
        stepNumber: 2,
        title: 'Name the Colors',
        instruction: 'Teacher holds up an apple-red block and asks: "What color is this?"',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Color identification prompt',
      },
      {
        stepNumber: 3,
        title: 'Sort Objects',
        instruction: 'Children place colorful toys into their matching color basket.',
        illustrationType: 'matching_sorting',
        highlightDetail: 'Sorting red to red, blue to blue',
      },
      {
        stepNumber: 4,
        title: 'Check the Baskets',
        instruction: 'Together examine each basket to see all matching colors gathered.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'All sorted successfully',
      },
    ],
    teacherTips: [
      'Begin with only 2 high-contrast colors (e.g., Red and Blue) for younger toddlers.',
      'Use descriptive language: "You found a shiny green block like a leaf!"',
      'Turn it into a clean-up game at the end of playtime.',
    ],
    childParticipation: 'Children reach in, select objects, discriminate color visually, and walk or crawl to deposit into the right basket.',
    learningOutcome: 'Accurately sorts and classifies items by color and names primary colors with increasing independence.',
  },
  {
    id: 'act-shape-hunt',
    name: 'Shape Hunt Adventure',
    category: 'Shapes',
    categoryIcon: '🔺',
    ageGroup: '3–5 years',
    learningArea: 'Geometry & Spatial Awareness',
    duration: '20 mins',
    objective: 'Recognize geometric shapes (circle, square, triangle, rectangle) and spot real-life shape equivalents in the classroom.',
    materialsNeeded: [
      'Large cardboard shape cutouts (Circle, Square, Triangle, Rectangle)',
      'Cardboard "Shape Detective" magnifying glasses (made from paper plates)',
      'Shape sticker badges for rewards',
    ],
    preparation: 'Cut out large cardboard shape templates and prepare paper-plate magnifying frames with clear shape silhouettes.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Equip Shape Detectives',
        description: 'Distribute child-safe magnifying frames and show the 4 key shapes on the display board.',
      },
      {
        stepNumber: 2,
        title: 'Trace Shape Edges in Air',
        description: 'Sing a shape chant while tracing round circles, 4-corner squares, and 3-point triangles in the air.',
      },
      {
        stepNumber: 3,
        title: 'Classroom Shape Safari',
        description: 'Children explore the classroom to find matching shapes (clock = circle, door = rectangle, book = square).',
      },
      {
        stepNumber: 4,
        title: 'Share Detective Findings',
        description: 'Children stand next to their discovered shape and describe how they identified it.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Hand Out Shape Frames',
        instruction: 'Give each child a cardboard magnifying frame to become a Shape Detective.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Magnifying glasses & shape cutouts',
      },
      {
        stepNumber: 2,
        title: 'Air Tracing Chant',
        instruction: 'Teacher leads the group in tracing circles, squares, and triangles in the air.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Air drawing movements',
      },
      {
        stepNumber: 3,
        title: 'Find Classroom Shapes',
        instruction: 'Children look through their frames to find round clocks, square books, and triangular signs.',
        illustrationType: 'science_nature',
        highlightDetail: 'Spotting shapes in room',
      },
      {
        stepNumber: 4,
        title: 'Earn Detective Badges',
        instruction: 'Award shape stickers to children for every shape discovered and described.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Star badge & celebration',
      },
    ],
    teacherTips: [
      'Emphasize the attributes: "Let\'s count the corners! 1, 2, 3 corners for Triangle!"',
      'Take photos of children next to their shapes to print for the classroom wall.',
      'Allow children to test their cardboard frame against the real object.',
    ],
    childParticipation: 'Children walk around looking through frames, physically trace object perimeters, and discuss shape properties.',
    learningOutcome: 'Identifies and names standard geometric shapes and connects 2D geometry to 3D everyday classroom objects.',
  },
  {
    id: 'act-pom-pom-transfer',
    name: 'Pom-Pom Tweezer Transfer',
    category: 'Fine Motor Skills',
    categoryIcon: '✂️',
    ageGroup: '3–5 years',
    learningArea: 'Fine Motor & Creative Expression',
    duration: '15–20 mins',
    objective: 'Strengthen pincer grasp, hand-eye coordination, and bilateral hand control using tongs and soft pom-poms.',
    materialsNeeded: [
      'Assorted fluffy colorful pom-poms (large and medium)',
      'Child-safe jumbo plastic tweezers or silicone tongs',
      'Ice cube trays or empty egg cartons',
      'Small collection bowls',
    ],
    preparation: 'Place an ice cube tray or egg carton in front of each seat with a bowl of 12 fluffy pom-poms and jumbo tweezers.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Tweezer Stations',
        description: 'Set out egg cartons, soft pom-poms, and jumbo child tweezers on craft trays.',
      },
      {
        stepNumber: 2,
        title: 'Demonstrate Pinch & Release',
        description: 'Show how thumb and fingers squeeze the tweezer: "Squeeze tight, lift up, drop into the cup!"',
      },
      {
        stepNumber: 3,
        title: 'Transfer into Trays',
        description: 'Children use tweezers to transfer one pom-pom at a time into each individual compartment of the tray.',
      },
      {
        stepNumber: 4,
        title: 'Color Pattern Fill',
        description: 'Challenge children to arrange the pom-poms in an alternating color pattern (e.g. Blue, Yellow, Blue, Yellow).',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Set Out Pom-Poms & Trays',
        instruction: 'Arrange egg cartons and bowls of soft pom-poms on the table.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Ice cube tray & colorful pom-poms',
      },
      {
        stepNumber: 2,
        title: 'Demonstrate Squeeze',
        instruction: 'Teacher models how to pinch tweezers gently without crushing the pom-pom.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Pincer grasp technique',
      },
      {
        stepNumber: 3,
        title: 'Transfer One by One',
        instruction: 'Children pinch, lift, and drop each pom-pom into an egg carton slot.',
        illustrationType: 'child_hands_on',
        highlightDetail: 'Precision fine-motor placement',
      },
      {
        stepNumber: 4,
        title: 'Admire Completed Tray',
        instruction: 'Count all filled slots and give fingers a happy stretch cheer.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Full colorful tray & happy hands',
      },
    ],
    teacherTips: [
      'If tweezers are too stiff for a 3-year-old, allow finger pincer pinch (thumb + index) first.',
      'Use giant fluffy pom-poms for younger children and smaller pom-poms for older 5-year-olds.',
      'Incorporate color sorting by painting the bottom of each egg carton compartment.',
    ],
    childParticipation: 'Children exercise finger muscles, practice controlled motor release, and experience tactile softness.',
    learningOutcome: 'Demonstrates improved pincer grasp, hand endurance, and hand-eye coordination essential for pre-writing.',
  },
  {
    id: 'act-nature-collage',
    name: 'Nature Leaf & Paper Collage',
    category: 'Art & Craft',
    categoryIcon: '🖌️',
    ageGroup: '3–5 years',
    learningArea: 'Fine Motor & Creative Expression',
    duration: '25–30 mins',
    objective: 'Explore natural textures and express individual creativity by composing a layered leaf and colored paper artwork.',
    materialsNeeded: [
      'Fallen leaves, flower petals, and small twigs collected by children',
      'Thick watercolor cardstock paper sheets',
      'Child-safe washable glue sticks or paste brushes',
      'Torn pastel tissue paper squares',
      'Washable markers for drawing details',
    ],
    preparation: 'Take children on a 5-minute outdoor courtyard stroll to collect clean fallen leaves in paper bags, then arrange glue trays.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Lay Out Nature Trays',
        description: 'Spread dried leaves, colorful petals, and tissue paper pieces across table center trays.',
      },
      {
        stepNumber: 2,
        title: 'Explore Textures & Shapes',
        description: 'Feel smooth, rough, crinkly, and soft leaves together. Talk about veins and natural colors.',
      },
      {
        stepNumber: 3,
        title: 'Glue Nature onto Cardstock',
        description: 'Children spread glue on their paper and press leaves, petals, and tissue paper to build their collage.',
      },
      {
        stepNumber: 4,
        title: 'Gallery Walk Display',
        description: 'Pin the completed collages on a classroom clothesline or board for an educator-guided art walk.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Gather Nature Treasures',
        instruction: 'Place leaves, petals, twigs, and glue sticks onto craft tables.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Natural leaves & paper trays',
      },
      {
        stepNumber: 2,
        title: 'Feel & Discuss Textures',
        instruction: 'Teacher encourages children to touch crinkly and soft leaf textures.',
        illustrationType: 'sensory_touch',
        highlightDetail: 'Tactile leaf exploration',
      },
      {
        stepNumber: 3,
        title: 'Create Your Collage',
        instruction: 'Children press leaves and colorful tissue paper onto glue to make art.',
        illustrationType: 'child_hands_on',
        highlightDetail: 'Arranging artistic patterns',
      },
      {
        stepNumber: 4,
        title: 'Classroom Art Gallery',
        instruction: 'Hang artworks on the clothesline and admire each unique masterpiece.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Art exhibition display',
      },
    ],
    teacherTips: [
      'Gently flatten leaves between heavy books overnight if they are very curled.',
      'Encourage children to turn leaves into imaginary creatures (e.g. a leaf fish or leafy tree).',
      'Use water-based glue sticks for easy clean-up with damp washcloths.',
    ],
    childParticipation: 'Children touch natural elements, apply glue, manipulate small components, and present their visual creation.',
    learningOutcome: 'Uses tactile natural materials to express artistic imagination and practices spatial layout and glue manipulation.',
  },
  {
    id: 'act-animal-food-match',
    name: 'Animal & Food Match',
    category: 'Matching',
    categoryIcon: '🧩',
    ageGroup: '3–5 years',
    learningArea: 'Nature & World Discovery',
    duration: '20 mins',
    objective: 'Match familiar animals to the foods they eat (e.g., Rabbit → Carrot, Monkey → Banana, Dog → Bone, Bee → Flower).',
    materialsNeeded: [
      'Sturdy picture cards of animals (Rabbit, Monkey, Dog, Cat, Bear, Bird)',
      'Matching picture cards of foods (Carrot, Banana, Bone, Fish, Honey, Seeds)',
      'Velcro matching board or pocket chart',
    ],
    preparation: 'Place animal cards in the left column of a pocket chart and shuffle the food cards in a basket.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Set Up Pocket Chart',
        description: 'Mount animal illustrations on the chart and lay food tokens in a matching bowl.',
      },
      {
        stepNumber: 2,
        title: 'Animal Sounds Warm-Up',
        description: 'Imitate animal sounds: "Hop like a bunny! Munch munch! What does bunny love to eat?"',
      },
      {
        stepNumber: 3,
        title: 'Child Card Matching',
        description: 'Volunteers pick a food card, identify it, and attach it next to the animal that eats it.',
      },
      {
        stepNumber: 4,
        title: 'Review Animal Habits',
        description: 'Go through each pair together and talk about where these animals live and how they find food.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Set Up Animal Cards',
        instruction: 'Place pictures of animals and food items in the center pocket chart.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Animal & food cards',
      },
      {
        stepNumber: 2,
        title: 'Ask & Imitate Sounds',
        instruction: 'Teacher asks: "Who loves crunchy orange carrots? Let\'s hop like a rabbit!"',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Interactive animal sound game',
      },
      {
        stepNumber: 3,
        title: 'Pair Animal & Food',
        instruction: 'Children place the carrot next to the rabbit and the banana next to monkey.',
        illustrationType: 'matching_sorting',
        highlightDetail: 'Direct paired matching',
      },
      {
        stepNumber: 4,
        title: 'All Animals Fed!',
        instruction: 'Cheer that all our animal friends have their delicious lunch.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Full matching chart complete',
      },
    ],
    teacherTips: [
      'Add sound effects and hand gestures to keep energetic preschoolers engaged.',
      'Use real plastic play foods if available to add 3D tactile manipulation.',
      'Ask open-ended extension questions: "What food is your favorite to eat at lunch?"',
    ],
    childParticipation: 'Children speak animal names, make funny animal sounds, identify food items, and stick paired cards on the board.',
    learningOutcome: 'Understands basic biological relationships between living animals and their dietary needs.',
  },
  {
    id: 'act-big-small-sort',
    name: 'Big & Small Object Sorting',
    category: 'Sorting',
    categoryIcon: '🧺',
    ageGroup: '2–4 years',
    learningArea: 'Early Mathematics & Logic',
    duration: '15–20 mins',
    objective: 'Differentiate size contrast (Big vs. Small) and sort pairs of objects into corresponding Big and Small bins.',
    materialsNeeded: [
      '1 Big sorting basket (with a giant bear icon) and 1 Small sorting basket (with a tiny mouse icon)',
      'Pairs of objects in two distinct sizes (Big teddy & small teddy, Big ball & small ball, Big cup & small cup)',
      'Cardboard comparison strip',
    ],
    preparation: 'Place the Big and Small baskets side-by-side with the giant/tiny icons facing the children.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Big & Small Baskets',
        description: 'Set out two baskets labeled with large visual indicators: BIG Bear and SMALL Mouse.',
      },
      {
        stepNumber: 2,
        title: 'Body Stretch Size Intro',
        description: 'Have children stretch arms out wide: "BIG like a giant mountain!" and tuck in tiny: "SMALL like a baby mouse!"',
      },
      {
        stepNumber: 3,
        title: 'Side-by-Side Comparison',
        description: 'Hold up two balls side-by-side. Ask a child to point to the BIG one, then place both in appropriate baskets.',
      },
      {
        stepNumber: 4,
        title: 'Verify & Re-check',
        description: 'Tip out each basket to verify that all BIG items are together and all SMALL items are together.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Arrange Big & Small Bins',
        instruction: 'Set out one large bin and one small bin on the activity mat.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Large and tiny baskets',
      },
      {
        stepNumber: 2,
        title: 'Stretch Big & Small',
        instruction: 'Teacher and children stretch arms wide for BIG and curl up small for TINY.',
        illustrationType: 'explore_movement',
        highlightDetail: 'Full body size demonstration',
      },
      {
        stepNumber: 3,
        title: 'Compare & Deposit',
        instruction: 'Child places the giant teddy in BIG bin and little car in SMALL bin.',
        illustrationType: 'matching_sorting',
        highlightDetail: 'Sorting by comparative size',
      },
      {
        stepNumber: 4,
        title: 'Celebrate Size Sorting',
        instruction: 'Applaud every child for finding the correct size home for their items.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Size victory cheer',
      },
    ],
    teacherTips: [
      'Ensure the size differences between item pairs are unmistakable (at least 2x size ratio).',
      'Use gestures continuously when speaking the words "BIG" (deep voice) and "small" (high voice).',
      'Add a third category ("Medium") only for 5-year-old pre-kindergarten groups.',
    ],
    childParticipation: 'Children stretch their bodies, visually compare pairs of objects, and physically sort them by dimension.',
    learningOutcome: 'Demonstrates comparative vocabulary (big, small, larger, smaller) and sorts objects accurately based on relative size.',
  },
  {
    id: 'act-picture-memory',
    name: 'Picture Memory Game',
    category: 'Memory Games',
    categoryIcon: '🧠',
    ageGroup: '3–5 years',
    learningArea: 'Memory & Cognitive Reasoning',
    duration: '15 mins',
    objective: 'Enhance visual recall, turn-taking, and concentration by matching identical pairs of face-down picture cards.',
    materialsNeeded: [
      'Set of 6 to 8 matching pairs (12–16 cards total) with clear illustrations (Sun, Tree, Apple, Star, Car, Fish)',
      'Soft tabletop felt cloth to keep cards steady',
    ],
    preparation: 'Lay 6 matching pairs face down in a neat 3x4 grid on the center table.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Lay Card Grid Face Down',
        description: 'Arrange 12 cards in neat rows face down on the felt cloth.',
      },
      {
        stepNumber: 2,
        title: 'Explain Turn-Taking Rules',
        description: 'Explain that each child flips 2 cards: "If they match, you keep them! If they don\'t, flip them back so everyone remembers!"',
      },
      {
        stepNumber: 3,
        title: 'Flip & Remember',
        description: 'Children take turns flipping two cards, saying the picture names out loud, and using memory clues.',
      },
      {
        stepNumber: 4,
        title: 'Count Found Pairs',
        description: 'Count all discovered pairs together when all cards are cleared.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Place Cards Face Down',
        instruction: 'Neatly arrange 12 picture cards in 3 tidy rows on the table.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Neat card grid layout',
      },
      {
        stepNumber: 2,
        title: 'Explain Memory Rules',
        instruction: 'Teacher demonstrates flipping two cards to check if pictures match.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Card flipping gesture',
      },
      {
        stepNumber: 3,
        title: 'Flip & Match Pairs',
        instruction: 'Child turns over two matching red apples and smiles with delight!',
        illustrationType: 'child_hands_on',
        highlightDetail: 'Revealing matching illustrations',
      },
      {
        stepNumber: 4,
        title: 'Celebrate All Matches',
        instruction: 'Count pairs gathered and praise patient turn-taking and sharp memory.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Memory crown & cheers',
      },
    ],
    teacherTips: [
      'Start with only 4 pairs (8 cards) for 3-year-olds; expand to 8 pairs for 5-year-olds.',
      'Encourage children to name what they see out loud to reinforce verbal memory encoding.',
      'Praise children who pay attention even when it is not their turn.',
    ],
    childParticipation: 'Children practice patience, scan the grid visually, flip cards, and call out matching images.',
    learningOutcome: 'Demonstrates short-term visual memory recall, spatial orientation, and cooperative turn-taking.',
  },
  {
    id: 'act-animal-movement',
    name: 'Move Like an Animal',
    category: 'Music & Movement',
    categoryIcon: '🎵',
    ageGroup: '2–5 years',
    learningArea: 'Physical Development & Gross Motor',
    duration: '15–20 mins',
    objective: 'Promote gross motor coordination, body awareness, listening skills, and active imaginative movement through rhythm and freeze cues.',
    materialsNeeded: [
      'Preschool tambourine or hand drum',
      'Animal movement visual cue cards (Frog hop, Elephant stomp, Flamingo balance, Snake slither, Cheetah sprint)',
      'Open carpet area free of obstacles',
    ],
    preparation: 'Clear the center carpet to provide a wide, safe perimeter for children to move and jump freely.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Clear Safe Movement Zone',
        description: 'Ensure carpet is clear and hold up the tambourine with animal picture cards.',
      },
      {
        stepNumber: 2,
        title: 'Introduce Animal Motions',
        description: 'Show card: "Frog!" and demonstrate deep squats and leaping hops. Show drum beat signal.',
      },
      {
        stepNumber: 3,
        title: 'Drum Beat & Movement',
        description: 'Play slow heavy drum beats for stomping Elephants, rapid light beats for hopping Bunnies, and stop drum for "FREEZE!"',
      },
      {
        stepNumber: 4,
        title: 'Cool-Down Turtle Breaths',
        description: 'End with slow turtle crawl and 3 deep diaphragmatic breathing breaths while sitting criss-cross.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Floor & Drum',
        instruction: 'Clear the floor and hold the animal cue cards and rhythm drum.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Tambourine & movement cards',
      },
      {
        stepNumber: 2,
        title: 'Show Animal Postures',
        instruction: 'Teacher models hopping like a frog and balancing on one leg like a flamingo.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Expressive animal pose',
      },
      {
        stepNumber: 3,
        title: 'Dance, Hop & Freeze!',
        instruction: 'Children leap, stomp, and freeze in place whenever the drum beat stops.',
        illustrationType: 'explore_movement',
        highlightDetail: 'Active full body jumping',
      },
      {
        stepNumber: 4,
        title: 'Gentle Turtle Breaths',
        instruction: 'Children sit together, breathe in deeply like a calm turtle, and relax.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Calm sitting circle',
      },
    ],
    teacherTips: [
      'Incorporate stop-and-go self-regulation games to build inhibitory impulse control.',
      'Use playful verbal sound cues: "Ribbit ribbit!" or "Trumpet like an elephant!"',
      'Provide seated movement alternatives for children with mobility differences.',
    ],
    childParticipation: 'Children leap, stomp, balance, run in place, listen actively for drum cues, and practice self-regulation freezes.',
    learningOutcome: 'Develops gross motor balance, coordination, spatial awareness, and auditory impulse control.',
  },
  {
    id: 'act-sensory-mystery-box',
    name: 'Sensory Texture Mystery Box',
    category: 'Sensory Play',
    categoryIcon: '🫧',
    ageGroup: '3–5 years',
    learningArea: 'Sensory Exploration & Science',
    duration: '20 mins',
    objective: 'Explore tactile differences (soft, rough, bumpy, cold, smooth) using touch without visual cues, building descriptive vocabulary.',
    materialsNeeded: [
      'Decorated cardboard "Mystery Box" with two arm holes covered by soft felt flaps',
      'Assorted textured objects (Silk cloth, sandpaper block, bumpy pinecone, smooth river stone, fuzzy pom-pom, plastic sponge)',
      'Tactile sensation word cards (Soft, Rough, Bumpy, Smooth, Cold)',
    ],
    preparation: 'Place 4 distinct textured items inside the mystery box and keep extra items covered in a secret pouch.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Prepare Mystery Box',
        description: 'Set out the mystery touch box and arrange descriptive texture word cards on the easel.',
      },
      {
        stepNumber: 2,
        title: 'Model Touch Without Peeking',
        description: 'Teacher slides hands through the felt sleeves and describes feelings: "Ooh, it feels tickly and bumpy!"',
      },
      {
        stepNumber: 3,
        title: 'Child Tactile Guessing',
        description: 'Children take turns reaching into the mystery box, feeling an item, describing its texture, and guessing what it is.',
      },
      {
        stepNumber: 4,
        title: 'Reveal & Confirm',
        description: 'Pull the object out into the light, compare the child\'s description with the real item, and match to the texture card.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Set Up Mystery Box',
        instruction: 'Place the colorful sensory box with arm holes in the middle of the circle.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Mystery box & texture items',
      },
      {
        stepNumber: 2,
        title: 'Demonstrate Hands Inside',
        instruction: 'Teacher reaches into the sleeve without looking and describes the feel.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Hands reaching into secret box',
      },
      {
        stepNumber: 3,
        title: 'Touch & Describe',
        instruction: 'Child reaches inside, smiles, and says: "It feels super soft and fuzzy!"',
        illustrationType: 'sensory_touch',
        highlightDetail: 'Tactile finger exploration',
      },
      {
        stepNumber: 4,
        title: 'Pull Out & Reveal!',
        instruction: 'Pull out the fuzzy teddy bear and cheer for the accurate tactile detective work!',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Revealing the mystery item',
      },
    ],
    teacherTips: [
      'Ensure all mystery items are completely child-safe with no sharp edges.',
      'Encourage rich sensory vocabulary: fuzzy, prickly, silky, squishy, firm, cool.',
      'If a child feels timid about putting hands in the dark box, let them peek in with one eye first.',
    ],
    childParticipation: 'Children isolate the sense of touch, formulate verbal adjectives, and discover surprising sensory properties.',
    learningOutcome: 'Strengthens tactile sensory processing, descriptive vocabulary, and deductive reasoning.',
  },
  {
    id: 'act-puppet-story-theater',
    name: 'Puppet Story Theater',
    category: 'Storytelling',
    categoryIcon: '📖',
    ageGroup: '3–5 years',
    learningArea: 'Social-Emotional & Communication',
    duration: '20–25 mins',
    objective: 'Foster expressive language, emotional empathy, and narrative comprehension using animal finger puppets and role-play dialogue.',
    materialsNeeded: [
      'Set of soft felt finger puppets (Bear, Bunny, Fox, Owl)',
      'Tabletop mini puppet stage or draped cardboard box',
      'Simple scenario prompt cards (Sharing a toy, Feeling shy on the first day, Helping a friend)',
    ],
    preparation: 'Set up the mini stage on a low table and assign puppet characters to small groups of 2–3 children.',
    writtenSteps: [
      {
        stepNumber: 1,
        title: 'Set Up Mini Stage',
        description: 'Position the puppet stage with puppet characters arranged in baskets.',
      },
      {
        stepNumber: 2,
        title: 'Introduce Story Scenario',
        description: 'Teacher introduces the story problem: "Little Bunny wants to play with Bear\'s toy car. What kind words can Bunny say?"',
      },
      {
        stepNumber: 3,
        title: 'Child Puppet Dialogue',
        description: 'Children put on finger puppets and act out the solution using expressive character voices and empathetic actions.',
      },
      {
        stepNumber: 4,
        title: 'Group Bow & Discussion',
        description: 'Puppeteers take a bow to applause, and the class discusses how helping friends makes everyone feel happy.',
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: 'Arrange Puppet Stage',
        instruction: 'Place the cozy puppet theater and soft felt finger puppets on the table.',
        illustrationType: 'prepare_materials',
        highlightDetail: 'Mini theater & finger puppets',
      },
      {
        stepNumber: 2,
        title: 'Introduce the Problem',
        instruction: 'Teacher acts with Bunny and Bear about sharing a favorite toy nicely.',
        illustrationType: 'teacher_introduce',
        highlightDetail: 'Storytelling puppet demonstration',
      },
      {
        stepNumber: 3,
        title: 'Children Act with Puppets',
        instruction: 'Children slip puppets onto fingers and speak in friendly animal voices.',
        illustrationType: 'story_puppet',
        highlightDetail: 'Roleplay dialogue & gestures',
      },
      {
        stepNumber: 4,
        title: 'Puppet Bow & Big Cheers',
        instruction: 'Children take a joyful bow as the class claps for their kindness story.',
        illustrationType: 'review_celebrate',
        highlightDetail: 'Puppet bow & group applause',
      },
    ],
    teacherTips: [
      'Puppets are wonderful icebreakers for shy or non-verbal children.',
      'Use the puppets to resolve real classroom social conflicts gently.',
      'Let children invent their own silly songs and endings for the story.',
    ],
    childParticipation: 'Children manipulate finger puppets, modulate voice tone, articulate feelings, and practice prosocial problem-solving.',
    learningOutcome: 'Enhances expressive storytelling, social empathy, emotional labeling, and cooperative communication.',
  },
];

// Helper to generate a tailored activity from user inputs
export function generatePreschoolActivity(params: {
  topic: string;
  materials: string;
  ageGroup?: string;
  additionalInstructions?: string;
}): PreschoolActivity {
  const topic = params.topic.trim();
  const materialsInput = params.materials.trim();
  const ageGroup = params.ageGroup?.trim() || '3–5 years';
  const notes = params.additionalInstructions?.trim() || '';

  // Identify domain archetype
  const lowerTopic = topic.toLowerCase();
  const lowerMat = (materialsInput || '').toLowerCase();

  const isColorSort = lowerTopic.includes('color') || lowerTopic.includes('sort') || lowerTopic.includes('basket') || lowerTopic.includes('bowl') || lowerTopic.includes('match') || lowerTopic.includes('group') || lowerMat.includes('basket') || lowerMat.includes('block') || lowerMat.includes('cup');
  const isCounting = lowerTopic.includes('count') || lowerTopic.includes('number') || lowerTopic.includes('math') || lowerTopic.includes('1-10') || lowerTopic.includes('1–10') || lowerTopic.includes('how many') || lowerTopic.includes('quantity');
  const isScissorCraft = lowerMat.includes('scissor') || lowerMat.includes('cut') || lowerTopic.includes('cut') || lowerTopic.includes('scissor') || lowerTopic.includes('snip');
  const isGluePaste = lowerMat.includes('glue') || lowerMat.includes('paste') || lowerMat.includes('collage') || lowerTopic.includes('collage') || lowerTopic.includes('paste');
  const isPlaydough = lowerMat.includes('playdough') || lowerMat.includes('dough') || lowerMat.includes('clay') || lowerTopic.includes('playdough') || lowerTopic.includes('clay');
  const isSensoryWater = lowerMat.includes('water') || lowerMat.includes('sand') || lowerMat.includes('pour') || lowerMat.includes('scoop') || lowerTopic.includes('water') || lowerTopic.includes('sand') || lowerTopic.includes('sensory') || lowerTopic.includes('pour');
  const isBlocks = lowerMat.includes('block') || lowerTopic.includes('block') || lowerTopic.includes('tower') || lowerTopic.includes('build') || lowerTopic.includes('stack');
  const isNature = lowerMat.includes('leaf') || lowerMat.includes('leaves') || lowerMat.includes('petal') || lowerTopic.includes('leaf') || lowerTopic.includes('leaves') || lowerTopic.includes('nature') || lowerTopic.includes('plant');
  const isMovement = lowerTopic.includes('dance') || lowerTopic.includes('jump') || lowerTopic.includes('music') || lowerTopic.includes('hop') || lowerTopic.includes('move') || lowerTopic.includes('freeze');
  const isDrawColor = lowerMat.includes('crayon') || lowerMat.includes('marker') || lowerMat.includes('paint') || lowerTopic.includes('draw') || lowerTopic.includes('color') || lowerTopic.includes('paint');

  let learningArea = 'Fine Motor & Creative Expression';
  let category = 'Art & Craft';
  let categoryIcon = '🎨';

  if (isColorSort) {
    learningArea = 'Visual Perception & Cognitive Skills';
    category = 'Sorting';
    categoryIcon = '🧺';
  } else if (isCounting) {
    learningArea = 'Early Mathematics & Logic';
    category = 'Counting';
    categoryIcon = '🔢';
  } else if (isMovement) {
    learningArea = 'Physical Development & Gross Motor';
    category = 'Music & Movement';
    categoryIcon = '🎵';
  } else if (isSensoryWater) {
    learningArea = 'Sensory Exploration & Science';
    category = 'Sensory Play';
    categoryIcon = '🫧';
  } else if (isNature) {
    learningArea = 'Nature & World Discovery';
    category = 'Nature & World';
    categoryIcon = '🌿';
  } else if (isBlocks) {
    learningArea = 'Geometry & Spatial Awareness';
    category = 'Building';
    categoryIcon = '🧱';
  } else if (isPlaydough) {
    learningArea = 'Fine Motor & Tactile Exploration';
    category = 'Sensory Play';
    categoryIcon = '🟤';
  } else if (isDrawColor) {
    learningArea = 'Fine Motor & Creative Expression';
    category = 'Art & Craft';
    categoryIcon = '🖍️';
  }

  // Parse user materials into an array
  const userMatList = materialsInput
    ? materialsInput.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)
    : [];

  let defaultMaterials = ['Colored paper', 'Crayons', 'Child-safe glue stick', 'Craft tray'];
  if (isColorSort) {
    defaultMaterials = ['Red, blue and yellow blocks or tokens', '3 Colored sorting baskets (Red, Blue, Yellow)', 'Table placemat'];
  } else if (isCounting) {
    defaultMaterials = ['5 Counting objects (apples, blocks, or counting bears)', 'Number cards (1–5)', 'Counting bowl'];
  } else if (isScissorCraft || (isGluePaste && !isNature)) {
    defaultMaterials = ['Colored paper strips (Red, Blue, Yellow)', 'Child-safe safety scissors', 'Glue stick', 'White background cardstock'];
  } else if (isPlaydough) {
    defaultMaterials = ['Colored playdough balls (Yellow, Turquoise, Magenta)', 'Child rolling pin', 'Star and circle shape cutters', 'Play mat'];
  } else if (isSensoryWater) {
    defaultMaterials = ['Sensory water/sand tub', 'Pouring cups and measuring scoops', 'Funnel', 'Water drop sponge'];
  } else if (isBlocks) {
    defaultMaterials = ['Set of colorful wooden building blocks (cubes, cylinders, triangle roofs)', 'Play carpet'];
  } else if (isNature) {
    defaultMaterials = ['Assorted autumn leaves and flower petals', 'Glue stick', 'White cardstock sheet', 'Magnifying glass'];
  } else if (isMovement) {
    defaultMaterials = ['Rhythm hand drum or tambourine', 'Color spot floor markers', 'Open carpet area'];
  }

  const parsedMaterials = userMatList.length > 0 ? userMatList : defaultMaterials;
  const matSummary = parsedMaterials.slice(0, 3).join(', ');
  const mainMat = parsedMaterials[0] || 'colored paper';
  const secondMat = parsedMaterials[1] || 'crayons';
  const thirdMat = parsedMaterials[2] || 'glue';

  // Step Action Generation
  interface GeneratedStepDef {
    step1Title: string;
    step1Desc: string;
    step1Vis: string;
    step1Detail: string;

    step2Title: string;
    step2Desc: string;
    step2Vis: string;
    step2Detail: string;

    step3Title: string;
    step3Desc: string;
    step3Vis: string;
    step3Detail: string;

    step4Title: string;
    step4Desc: string;
    step4Vis: string;
    step4Detail: string;
  }

  let steps: GeneratedStepDef;

  if (isColorSort) {
    steps = {
      step1Title: 'Place Items & Baskets on Table',
      step1Desc: 'Place red, blue, and yellow objects on the table alongside 3 matching colored baskets.',
      step1Vis: 'prepare_sorting_table',
      step1Detail: 'Table with red, blue, yellow objects & baskets',

      step2Title: 'Identify Color & Pick Up Item',
      step2Desc: 'Ask the child to name the colors, then reach out and pick up the red object from the table.',
      step2Vis: 'child_pick_up_red',
      step2Detail: 'Child lifting red object in hand',

      step3Title: 'Place Red Item into Red Basket',
      step3Desc: 'Guide the child to place the red object directly into the red basket, matching the colors.',
      step3Vis: 'child_deposit_red_basket',
      step3Detail: 'Dropping red object into matching red basket',

      step4Title: 'Complete Sorting Blue & Yellow',
      step4Desc: 'Repeat the activity with the blue and yellow objects until all items are sorted into matching baskets.',
      step4Vis: 'all_baskets_sorted_victory',
      step4Detail: 'All 3 baskets filled with matched colors',
    };
  } else if (isCounting) {
    steps = {
      step1Title: 'Line Up Counting Objects',
      step1Desc: 'Place 5 counting objects in a neat row across the center table alongside number flashcards.',
      step1Vis: 'line_up_counting_objects',
      step1Detail: '5 counting objects arranged in a row',

      step2Title: 'Touch & Count One by One',
      step2Desc: 'Ask the child to point to each object with their index finger and count out loud: "1... 2... 3... 4... 5!"',
      step2Vis: 'point_and_count_objects',
      step2Detail: 'Child pointing finger counting 1-by-1',

      step3Title: 'Group Objects into Counting Bowl',
      step3Desc: 'Have the child gather the 5 counted objects together and place them neatly inside the counting bowl.',
      step3Vis: 'group_objects_in_bowl',
      step3Detail: 'Gathering 5 objects into one group',

      step4Title: 'Reveal Number 5 & Celebrate',
      step4Desc: 'Hold up the number "5" card and praise the child for accurately counting all five items.',
      step4Vis: 'number_card_victory',
      step4Detail: 'Holding up number 5 card with celebration stars',
    };
  } else if (isScissorCraft) {
    steps = {
      step1Title: 'Arrange Paper & Safety Scissors',
      step1Desc: 'Place colored paper strips, child-safe safety scissors, and cardstock on the craft table.',
      step1Vis: 'prepare_scissors_paper',
      step1Detail: 'Paper strips, child safety scissors & glue',

      step2Title: 'Snip Paper into Geometric Shapes',
      step2Desc: 'Guide the child to hold the safety scissors with thumb facing up and snip paper into colorful shapes.',
      step2Vis: 'child_snipping_paper',
      step2Detail: 'Child holding scissors cutting paper shapes',

      step3Title: 'Glue Shapes onto Background Sheet',
      step3Desc: 'Have the child apply glue to the back of each cut shape and press them onto the white cardstock.',
      step3Vis: 'child_gluing_cut_shapes',
      step3Detail: 'Applying glue stick and pasting shapes',

      step4Title: 'Display Cut-Paper Masterpiece',
      step4Desc: 'Hold up the completed colorful shape collage to celebrate fine motor cutting success.',
      step4Vis: 'completed_collage_display',
      step4Detail: 'Holding up finished cut-paper art',
    };
  } else if (isPlaydough) {
    steps = {
      step1Title: 'Place Playdough & Tools on Mat',
      step1Desc: 'Place fresh balls of colorful playdough, a child-sized rolling pin, and shape cutters on the play placemat.',
      step1Vis: 'prepare_playdough_tools',
      step1Detail: 'Colorful playdough balls & rolling pin',

      step2Title: 'Roll & Flatten Dough with Rolling Pin',
      step2Desc: 'Guide the child to use both hands on the rolling pin handles to press down and flatten the dough.',
      step2Vis: 'child_rolling_playdough',
      step2Detail: 'Child with rolling pin flattening dough',

      step3Title: 'Press Shape Cutters into Dough',
      step3Desc: 'Help the child press star and circle cutters into the flattened dough and peel away the shapes.',
      step3Vis: 'child_stamping_dough_cutters',
      step3Detail: 'Pressing cookie cutters into dough',

      step4Title: 'Display Sculpted Playdough Creations',
      step4Desc: 'Arrange the sculpted playdough creations onto a display tray and admire each creative shape.',
      step4Vis: 'playdough_sculptures_display',
      step4Detail: 'Tray of sculpted playdough shapes with stars',
    };
  } else if (isSensoryWater) {
    steps = {
      step1Title: 'Set Up Sensory Tub & Pouring Cups',
      step1Desc: 'Place a sensory water tub with measuring scoops, pouring cups, and funnels onto the activity table.',
      step1Vis: 'prepare_sensory_tub',
      step1Detail: 'Sensory water tub with cups & funnel',

      step2Title: 'Dip Scoop to Fill Measuring Cup',
      step2Desc: 'Guide the child to dip the scoop into the water tub and lift a full scoop of sparkling water.',
      step2Vis: 'child_scooping_water',
      step2Detail: 'Dipping scoop and lifting filled cup',

      step3Title: 'Pour Water Through Funnel',
      step3Desc: 'Have the child pour the water slowly through the yellow funnel into a target cup, watching the liquid flow.',
      step3Vis: 'child_pouring_funnel',
      step3Detail: 'Pouring stream of water through funnel',

      step4Title: 'Compare Full & Empty Cups',
      step4Desc: 'Observe the filled cups together, comparing water levels and praising careful pouring coordination.',
      step4Vis: 'sensory_cups_full_celebrate',
      step4Detail: 'Lined up filled cups with happy splash celebration',
    };
  } else if (isBlocks) {
    steps = {
      step1Title: 'Spread Wooden Blocks on Carpet',
      step1Desc: 'Scatter colorful wooden blocks (cubes, cylinders, and triangular prisms) across the play carpet.',
      step1Vis: 'spread_blocks_carpet',
      step1Detail: 'Colorful wooden building blocks on carpet',

      step2Title: 'Build Wide Sturdy Base',
      step2Desc: 'Guide the child to align 3 large cube blocks side-by-side on the carpet to form a solid foundation.',
      step2Vis: 'child_building_base_blocks',
      step2Detail: 'Child laying down 3 sturdy base blocks',

      step3Title: 'Stack Blocks & Balance Roof',
      step3Desc: 'Carefully stack blocks higher one-by-one and gently balance a red triangular prism on the top.',
      step3Vis: 'child_balancing_block_roof',
      step3Detail: 'Child on tiptoes placing red triangle roof',

      step4Title: 'Admire Completed Tall Tower',
      step4Desc: 'Step back to admire the sturdy, tall block castle and celebrate balance engineering with applause.',
      step4Vis: 'tall_block_tower_celebrate',
      step4Detail: 'Tall standing tower with child cheering',
    };
  } else if (isNature) {
    steps = {
      step1Title: 'Lay Out Nature Treasures on Table',
      step1Desc: 'Spread clean fallen autumn leaves, flower petals, twigs, and cardstock across the table tray.',
      step1Vis: 'prepare_nature_leaves',
      step1Detail: 'Autumn leaves, twigs, petals & cardstock',

      step2Title: 'Touch Leaf Veins & Textures',
      step2Desc: 'Encourage the child to touch smooth, bumpy, and crinkly leaf textures with their fingers.',
      step2Vis: 'child_feeling_leaf_veins',
      step2Detail: 'Child touching leaf veins with magnifying glass',

      step3Title: 'Glue Leaves onto Paper Sheet',
      step3Desc: 'Guide the child to spread glue on the sheet and press leaves firmly down to create a botanical collage.',
      step3Vis: 'child_gluing_nature_leaves',
      step3Detail: 'Pressing glued leaves onto background paper',

      step4Title: 'Display Nature Art Masterpiece',
      step4Desc: 'Hold up the finished leaf collage for the classroom art gallery and celebrate nature discovery.',
      step4Vis: 'nature_collage_display',
      step4Detail: 'Finished botanical leaf art held up proudly',
    };
  } else if (isMovement) {
    steps = {
      step1Title: 'Gather on Carpet Spots with Tambourine',
      step1Desc: 'Gather children standing on colorful carpet spots with the teacher holding a rhythm tambourine.',
      step1Vis: 'gather_movement_circle',
      step1Detail: 'Children on carpet spots with tambourine',

      step2Title: 'Sway Gently to Slow Beat',
      step2Desc: 'Teacher taps a slow rhythm while children sway their arms gently side-to-side like tall trees.',
      step2Vis: 'children_swaying_slow_beat',
      step2Detail: 'Children gently swaying arms to slow rhythm',

      step3Title: 'Jump High to Fast Rhythm',
      step3Desc: 'As the tambourine rhythm quickens, children jump up energetically with smiles and arms in the air.',
      step3Vis: 'children_jumping_fast_rhythm',
      step3Detail: 'Children jumping high with joyful motion lines',

      step4Title: 'Freeze in Fun Pose & Bow',
      step4Desc: 'Teacher calls "FREEZE!" on the final beat, and all children hold a silly statue pose and take a bow.',
      step4Vis: 'movement_freeze_pose_bow',
      step4Detail: 'Freeze statue pose with big round of applause',
    };
  } else {
    // Dynamic General Craft / Activity
    steps = {
      step1Title: `Lay Out ${mainMat} & Supplies`,
      step1Desc: `Place ${mainMat}, ${secondMat}, and other supplies on the table tray ready for ${topic}.`,
      step1Vis: 'prepare_general_supplies',
      step1Detail: `Table setup with ${matSummary}`,

      step2Title: `Introduce ${topic} & Explore First Step`,
      step2Desc: `Teacher introduces ${topic} and guides child to reach out, hold ${mainMat}, and examine its properties.`,
      step2Vis: 'child_explore_main_material',
      step2Detail: `Teacher guiding child holding ${mainMat}`,

      step3Title: `Hands-On Creation with ${secondMat}`,
      step3Desc: `Child actively uses ${secondMat} and ${thirdMat} to create, assemble, or practice ${topic} on the table.`,
      step3Vis: 'child_active_creation_hands',
      step3Detail: `Child actively manipulating ${secondMat} on table`,

      step4Title: `Hold Up Finished ${topic} Project`,
      step4Desc: `Child holds up their completed ${topic} creation with a proud smile, celebrating with the class.`,
      step4Vis: 'completed_general_victory',
      step4Detail: `Holding up completed ${topic} project with stars`,
    };
  }

  const formattedTopic = topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1);
  const activityName = formattedTopic.toLowerCase().includes('activity') ||
    formattedTopic.toLowerCase().includes('game') ||
    formattedTopic.toLowerCase().includes('exploration') ||
    formattedTopic.toLowerCase().includes('sorting') ||
    formattedTopic.toLowerCase().includes('hunt') ||
    formattedTopic.toLowerCase().includes('workshop')
    ? formattedTopic
    : `${formattedTopic} Activity`;

  return {
    id: `gen-${Date.now()}`,
    name: activityName,
    category,
    categoryIcon,
    ageGroup,
    learningArea,
    duration: '20–25 mins',
    objective: `Children will explore, manipulate, and demonstrate hands-on understanding of ${topic} using ${matSummary}.`,
    materialsNeeded: [
      ...parsedMaterials,
      'Classroom activity trays and sorting placemats',
      'Clean-up damp washcloths or wet wipes',
    ],
    preparation: `Organize ${matSummary} into child-accessible table trays. Set up seating for ${notes ? `group (${notes})` : 'small collaborative groups of 3–4 children'}.`,
    writtenSteps: [
      {
        stepNumber: 1,
        title: steps.step1Title,
        description: steps.step1Desc,
      },
      {
        stepNumber: 2,
        title: steps.step2Title,
        description: steps.step2Desc,
      },
      {
        stepNumber: 3,
        title: steps.step3Title,
        description: steps.step3Desc,
      },
      {
        stepNumber: 4,
        title: steps.step4Title,
        description: steps.step4Desc,
      },
    ],
    visualSteps: [
      {
        stepNumber: 1,
        title: steps.step1Title,
        instruction: steps.step1Desc,
        illustrationType: steps.step1Vis,
        highlightDetail: steps.step1Detail,
      },
      {
        stepNumber: 2,
        title: steps.step2Title,
        instruction: steps.step2Desc,
        illustrationType: steps.step2Vis,
        highlightDetail: steps.step2Detail,
      },
      {
        stepNumber: 3,
        title: steps.step3Title,
        instruction: steps.step3Desc,
        illustrationType: steps.step3Vis,
        highlightDetail: steps.step3Detail,
      },
      {
        stepNumber: 4,
        title: steps.step4Title,
        instruction: steps.step4Desc,
        illustrationType: steps.step4Vis,
        highlightDetail: steps.step4Detail,
      },
    ],
    teacherTips: [
      `Encourage open-ended experimentation with ${mainMat} before directing specific steps.`,
      `Use positive descriptive reinforcement: "I see you using careful hands to create your ${topic} project!"`,
      notes ? `Classroom custom note: ${notes}` : 'Provide extra time for children who want to explore color mixing or texture variations.',
    ],
    childParticipation: `Children physically handle ${matSummary}, communicate discoveries with table partners, and express personal creativity connected to ${topic}.`,
    learningOutcome: `Demonstrates developmental progress in ${learningArea} by actively manipulating ${matSummary} and completing the ${topic} task.`,
  };
}
