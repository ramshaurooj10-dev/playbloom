export interface PreschoolLessonPlan {
  id: string;
  topicNumber: number;
  title: string;
  icon: string;
  emoji: string;
  ageGroup: string;
  classGroup: string;
  duration: string;
  learningArea: string;
  learningAreaId: string;
  shortDescription: string;
  learningOutcomes: string[];
  learningObjectives: string;
  materialsNeeded: string[];
  introductionWarmUp: string;
  teachingSteps: { stepNumber: number; title: string; instruction: string }[];
  teacherPrompts: string[];
  childParticipationActivity: {
    title: string;
    instructions: string;
    handsOnFocus: string;
  };
  checkForUnderstanding: string[];
  assessment: string;
  closingRecap: string;
  optionalExtensionActivity: string;
}

export const READY_MADE_LESSONS: PreschoolLessonPlan[] = [
  // 1. ALL ABOUT SHAPES
  {
    id: 'lesson-1-shapes',
    topicNumber: 1,
    title: 'All About Shapes',
    icon: '🔷',
    emoji: '📐',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Explore, name, and compare circles, triangles, squares, and rectangles through tactile play and real-world matching.',
    learningOutcomes: [
      'Identifies and names core 2D geometric shapes (circle, square, triangle, rectangle)',
      'Distinguishes between curved and straight edges through tactile exploration',
      'Matches shapes to everyday objects in the classroom environment',
      'Develops spatial awareness and shape vocabulary during active discussions'
    ],
    learningObjectives: 'Children will recognize, name, and physically sort 4 basic shapes (circle, square, triangle, rectangle) by observing their sides and corners during hands-on circle time and interactive station games.',
    materialsNeeded: [
      'Large foam or wooden shapes (Circle, Square, Triangle, Rectangle)',
      'Shape discovery mystery bag / soft velvet pouch',
      '4 colored sorting floor hoops or trays labeled with shape icons',
      'Everyday items (clock, book, toy pizza slice, wooden block)',
      'Pre-cut construction paper shapes and child-safe glue sticks'
    ],
    introductionWarmUp: 'Gather children in a cozy circle. Sing the "Shape Friends Song" with cheerful hand gestures (making a round circle with both hands, tracing a 4-sided square in the air). Reach into the Mystery Bag with dramatic anticipation and pull out one shape at a time: "Look who woke up to play with us today! Who can tell me what shape this is?"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Tactile Mystery Bag Reveal',
        instruction: 'Pull out the Circle and Square. Invite 3 children to feel the edges. Emphasize: "Circle has zero sharp corners—it goes round and round! Square has 4 straight sides that are all equal."'
      },
      {
        stepNumber: 2,
        title: 'Air Tracing & Body Movements',
        instruction: 'Guide all children to stand up and trace a giant triangle in the air using their whole arms. Count the 3 pointy peaks aloud together: "One, two, three points!"'
      },
      {
        stepNumber: 3,
        title: 'Classroom Shape Safari Walk',
        instruction: 'Walk slowly around the classroom. Prompt children to spot real shapes: "Look at our clock—is it a circle or a square? What about our bookshelf doors?"'
      },
      {
        stepNumber: 4,
        title: 'Interactive Floor Hoop Sorting',
        instruction: 'Distribute assorted wooden and foam shapes to children. Call out one shape at a time and invite children to place their item into the matching colored floor hoop.'
      }
    ],
    teacherPrompts: [
      '"How do your fingers feel when you slide them around this circle? Is there any stopping place?"',
      '"Let\'s count the corners together: 1, 2, 3, 4! Which friend has four corners?"',
      '"Can you find something in your lunchbox or around the room that is shaped like a triangle?"'
    ],
    childParticipationActivity: {
      title: 'Tactile "Shape Monster Feast" Sorting Game',
      instructions: 'Place 4 cardboard box "Shape Monsters" with open mouths (Circle Monster, Square Monster, Triangle Monster, Rectangle Monster). Children feed each monster their favorite shape biscuits.',
      handsOnFocus: 'Fine motor bilateral coordination, tactile discrimination, and peer cooperation.'
    },
    checkForUnderstanding: [
      'Can the child hold up a requested shape when asked by the teacher?',
      'Can the child point out at least 2 shapes in their surroundings?',
      'Does the child differentiate between round (no corners) and straight (with corners)?'
    ],
    assessment: 'Observe during the Shape Monster sorting game. Note whether the child accurately categorizes at least 3 out of 4 shapes independently without adult correction.',
    closingRecap: 'Sit back in the circle. Do the "Quick Shape Freeze" where the teacher holds up a shape card and children make the shape with their hands or body before saying goodbye to the Shape Monsters.',
    optionalExtensionActivity: 'Shape Collage Art: Provide children with colored paper shapes to glue together onto cardstock to create a "Shape Castle" or "Shape Robot".'
  },

  // 2. TRIANGLE
  {
    id: 'lesson-2-triangle',
    topicNumber: 2,
    title: 'Triangle — The 3-Corner Wonder',
    icon: '🔺',
    emoji: '⛺',
    ageGroup: '3–4 Years',
    classGroup: 'Preschool',
    duration: '25 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Focus on the 3 straight sides and 3 pointy corners of triangles through craft sticks, mountain rhymes, and pizza slice play.',
    learningOutcomes: [
      'Counts the 3 sides and 3 vertices/corners of a triangle with 1-to-1 finger pointing',
      'Identifies triangles in multiple orientations (upright, inverted, tilted)',
      'Constructs triangles using wooden craft sticks and playdough connectors'
    ],
    learningObjectives: 'Children will isolate, build, and verbalize the defining characteristics of a triangle (3 sides, 3 corners) through tactile building and visual identification games.',
    materialsNeeded: [
      'Jumbo colorful popsicle/craft sticks (3 per child)',
      'Small balls of soft modeling playdough',
      'Cutout felt pizza slices and triangle party hats',
      'Triangle bell / musical chime',
      'Large whiteboard with dry-erase markers'
    ],
    introductionWarmUp: 'Ring a musical triangle instrument: "Ding, ding, ding!" Ask: "How many times did our bell ring? Three! Today we are learning about a shape with exactly three pointy points!" Hold up a triangle hat and wear it playfully.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Counting the Three Corners',
        instruction: 'Show a large cardboard triangle. Touch each corner with a bright puppet or sticker: "Corner 1! Corner 2! Corner 3! That makes a TRIANGLE!"'
      },
      {
        stepNumber: 2,
        title: 'Rotating the Triangle',
        instruction: 'Turn the triangle upside down and sideways. Ask: "Is it still a triangle? Let\'s count: 1, 2, 3 sides! Yes! Even when it tilts, it is always a triangle!"'
      },
      {
        stepNumber: 3,
        title: 'Popsicle Stick Construction',
        instruction: 'Give each child 3 colored craft sticks. Demonstrate how to join the 3 ends using tiny pinch balls of playdough at each corner.'
      }
    ],
    teacherPrompts: [
      '"Can you make a triangle roof over your head with your arms?"',
      '"If I take one stick away, do we still have a triangle? How many sticks do we need?"',
      '"What tasty foods look like a triangle? (Pizza slice, watermelon wedge, tortilla chip!)"'
    ],
    childParticipationActivity: {
      title: 'Popsicle & Playdough Triangle Builders',
      instructions: 'Children sit at low tables and construct their own 3D tabletop triangles using 3 sticks and 3 dough balls, then place a toy figure inside their "camping tent".',
      handsOnFocus: 'Finger pincer grasp, counting 1–3, spatial construction.'
    },
    checkForUnderstanding: [
      'Does the child use exactly 3 sticks to make a closed shape?',
      'Can the child touch and count 3 corners without skipping?',
      'Does the child identify triangles when turned upside-down?'
    ],
    assessment: 'Observe whether the child independently selects 3 sticks and identifies the 3 corners during the hands-on building activity.',
    closingRecap: 'Sing the "Three-Cornered Hat" rhyme with finger gestures, gently celebrating everyone\'s newly built craft stick tents.',
    optionalExtensionActivity: 'Triangle Sand Tray: Children use their index finger to draw triangles in trays filled with colored sensory sand.'
  },

  // 3. CIRCLE
  {
    id: 'lesson-3-circle',
    topicNumber: 3,
    title: 'Circle — Round & Round',
    icon: '🔴',
    emoji: '🍩',
    ageGroup: '2–4 Years',
    classGroup: 'Early Preschool / Toddlers',
    duration: '20 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Discover the smooth, endless curves of circles using hula hoops, steering wheels, bubble blowing, and round stamp art.',
    learningOutcomes: [
      'Recognizes that a circle has no corners and rolls smoothly',
      'Traces continuous circular motion with gross and fine motor movements',
      'Identifies circular objects in the everyday classroom environment'
    ],
    learningObjectives: 'Children will identify circles as continuous curved shapes with no sharp edges and practice circular tracing through bubble play, wheel turning, and circle stamping.',
    materialsNeeded: [
      'Hula hoops and large steering wheel plates',
      'Soap bubble wand and solution',
      'Round paper cups, bottle caps, and cookie cutters for stamping',
      'Non-toxic washable paint and large paper rolls',
      'Round sensory balls of various textures'
    ],
    introductionWarmUp: 'Blow shiny soap bubbles into the air! Encourage children to gently pop the round bubbles. Ask: "What shape is a floating bubble? It is round and round like a circle!" Give everyone an imaginary steering wheel to drive their Circle Bus.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'The Continuous Finger Trace',
        instruction: 'Hand out large cardboard circles. Have children slide their fingers all the way around without stopping: "Round and round, no corners to be found!"'
      },
      {
        stepNumber: 2,
        title: 'Rolling Test vs Sliding Test',
        instruction: 'Test a round ball and a square block on a small wooden ramp. Demonstrate how the circle rolls smoothly while the square slides or stops.'
      },
      {
        stepNumber: 3,
        title: 'Body Hula Hoop Step-In',
        instruction: 'Place hula hoops on the rug. Have children step inside the circle when the music plays, and freeze when it stops.'
      }
    ],
    teacherPrompts: [
      '"Can you make a tiny circle with your thumb and finger like looking through binoculars?"',
      '"Why does our ball roll so fast across the rug? Does it have any bumpy corners?"',
      '"Look at our wheels on the toy car—what shape are they?"'
    ],
    childParticipationActivity: {
      title: 'Bubble Print & Cup Stamping Art',
      instructions: 'Children dip rim of paper cups and round cookie cutters into bright washable paint and press onto big butcher paper to create vibrant overlapping circle patterns.',
      handsOnFocus: 'Hand-eye coordination, stamping pressure modulation, and creative pattern exploration.'
    },
    checkForUnderstanding: [
      'Can the child distinguish a circle from a shape with corners (like a square)?',
      'Does the child make continuous circular motions when drawing in air or on paper?',
      'Can the child point out a wheel, clock, or plate as a circle?'
    ],
    assessment: 'Observe during the circle stamping activity. Ask the child: "What shape did your cup make?" Listen for the word "circle" or "round".',
    closingRecap: 'Form a giant circle holding hands as a class. Sing "Ring Around the Rosie" and sit down together on the rug with a gentle clap.',
    optionalExtensionActivity: 'Circle Sensory Bin: Dig through shredded paper to find round lids, buttons, and wooden rings and thread them onto yarn.'
  },

  // 4. SQUARE
  {
    id: 'lesson-4-square',
    topicNumber: 4,
    title: 'Square — 4 Equal Sides',
    icon: '🟦',
    emoji: '📦',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool',
    duration: '25 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Investigate the 4 equal straight sides and 4 boxy corners of squares using building blocks, window frames, and masking tape floor grids.',
    learningOutcomes: [
      'Identifies a square by its 4 equal straight sides and 4 right-angle corners',
      'Compares square sides to verify they are all the same length',
      'Builds 2D and 3D square structures using wooden unit blocks'
    ],
    learningObjectives: 'Children will identify and describe squares by counting four equal sides and four corners, differentiating squares from other 4-sided shapes.',
    materialsNeeded: [
      'Wooden square unit blocks',
      'Masking tape (for floor square grid)',
      'Pre-cut square felt patches and square napkins',
      'Square picture books (e.g., board books with square format)',
      'Square stamp sponges and paint trays'
    ],
    introductionWarmUp: 'Show a gift box wrapped with a bow: "Look at the top of our present! Let\'s count the sides together: 1, 2, 3, 4! All four sides are twins—they are exactly the same size!"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Walking the Square on the Rug',
        instruction: 'Use blue tape to outline a giant square on the floor. Have children walk along the perimeter, stopping and stomping at each of the 4 corners.'
      },
      {
        stepNumber: 2,
        title: 'Measuring Equal Sides with Ribbons',
        instruction: 'Use a single strip of ribbon to measure side 1, then show it fits side 2, 3, and 4 perfectly: "All 4 sides match!"'
      },
      {
        stepNumber: 3,
        title: 'Building Block Towers',
        instruction: 'Distribute square wooden blocks. Children stack 4 square blocks, naming the shape of each block face.'
      }
    ],
    teacherPrompts: [
      '"Can you count 4 straight sides with your magic counting finger?"',
      '"What happens when we put two squares together side-by-side? Does it make a long rectangle?"',
      '"Can you find a square tile on our classroom floor?"'
    ],
    childParticipationActivity: {
      title: 'Square Window & Mosaic Collage',
      instructions: 'Children arrange colorful paper square tiles onto a clear contact paper sheet to create a stained-glass square window suncatcher.',
      handsOnFocus: 'Spatial arrangement, precision placement, and fine motor finger grip.'
    },
    checkForUnderstanding: [
      'Can the child count all 4 sides of the square without double-counting?',
      'Can the child identify that all sides are equal in length?',
      'Does the child recognize square shapes in tiles, books, and block faces?'
    ],
    assessment: 'Observe during block play. Verify whether the child accurately selects square blocks when requested by name.',
    closingRecap: 'Sing the "Square Song" (to the tune of "Twinkle Twinkle"): "Square has four sides all the same, can you tell me its sweet name? Square, square, on the floor, count its corners: 1, 2, 3, 4!"',
    optionalExtensionActivity: 'Square Sandwich Snack: Cut bread slices into 4 small square pieces during snack time, counting each piece before eating.'
  },

  // 5. RED
  {
    id: 'lesson-5-red',
    topicNumber: 5,
    title: 'Color Red — Bright & Energetic',
    icon: '🔴',
    emoji: '🍎',
    ageGroup: '2–4 Years',
    classGroup: 'Toddlers & Preschool',
    duration: '25 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Immerse children in the primary color Red through juicy red apples, fire truck play, red ribbon dancing, and sorting red objects.',
    learningOutcomes: [
      'Identifies and names the color red with 100% visual consistency',
      'Distinguishes red from contrasting primary colors (blue, yellow)',
      'Associates red with familiar real-world items (apples, strawberries, fire engines, hearts)'
    ],
    learningObjectives: 'Children will accurately identify, name, and sort red objects from a multi-color collection and express red color words in full phrases ("This is a red apple").',
    materialsNeeded: [
      'Red sensory basket (red apple, red toy car, red ribbon, red ball, red flower)',
      'Bright red cape / teacher apron',
      'Red fingerpaint, paper plates, and red glitter/sequins',
      'Toy fire engine with siren sound',
      'Red yarn strips and red sorting bowls'
    ],
    introductionWarmUp: 'Put on a bright red cape with a flourish! "Welcome to Red Day! Red is warm, bright, and bold like a shiny red strawberry!" Hold up a toy fire truck and make a gentle siren sound: "Wee-woo, here comes our Red Rescue Team!"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Red Basket Exploration',
        instruction: 'Pass around the Red Sensory Basket. Let children hold each item, verbalizing: "Red block", "Red strawberry", "Red heart".'
      },
      {
        stepNumber: 2,
        title: 'Red Ribbon Wave',
        instruction: 'Give each child a red satin ribbon. Put on cheerful music and have children dance, waving their red ribbons up high like fireworks and down low like red carpet.'
      },
      {
        stepNumber: 3,
        title: 'Red vs. Not-Red Sorting Challenge',
        instruction: 'Scatter colored balls on the rug. Children must race like little firefighters to rescue only the red balls and place them into the red basket.'
      }
    ],
    teacherPrompts: [
      '"What fruit do you like to eat that is red on the outside?"',
      '"Look at your clothes today—is anyone wearing something red?"',
      '"Can you touch something red with your elbow?"'
    ],
    childParticipationActivity: {
      title: 'Shiny Red Apple Fingerpainting',
      instructions: 'Children use their fingertips and red washable paint to fill in a large apple template on heavy paper, finishing with a real cinnamon scent drop.',
      handsOnFocus: 'Sensory tactile desensitization, finger muscle development, and color saturation.'
    },
    checkForUnderstanding: [
      'Can the child choose the red crayon from a box of mixed colors?',
      'Does the child label red items accurately when prompted?',
      'Can the child point out red traffic lights or stop signs on picture cards?'
    ],
    assessment: 'Observe during the Red Ball Rescue game. Check if the child picks only red items without confusion.',
    closingRecap: 'Sit together and crunch into sweet real red apple slices during snack, saying "Thank you, juicy Red Apple!"',
    optionalExtensionActivity: 'Red Water Play: Add a few drops of red food coloring to the water table with floating red foam apples and red scoops.'
  },

  // 6. YELLOW
  {
    id: 'lesson-6-yellow',
    topicNumber: 6,
    title: 'Color Yellow — Sunny & Bright',
    icon: '🟡',
    emoji: '☀️',
    ageGroup: '2–4 Years',
    classGroup: 'Toddlers & Preschool',
    duration: '25 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Explore the cheerful color Yellow through sunflowers, rubber ducks, yellow playdough sunshine, and banana peeling songs.',
    learningOutcomes: [
      'Identifies and names the color yellow in art and everyday surroundings',
      'Connects yellow to natural warm elements like sunshine, bananas, chicks, and lemons',
      'Sorts yellow manipulatives from mixed-color sets'
    ],
    learningObjectives: 'Children will recognize, label, and isolate the color yellow through sunshine art, rubber duck water sorting, and cheerful sensory exploration.',
    materialsNeeded: [
      'Yellow rubber ducks and plastic floating lemons',
      'Yellow playdough and yellow plastic cutters',
      'Cutout paper suns and yellow paper fringe strips',
      'Yellow feathers, yellow pom-poms, and yellow tweezers',
      'Ripe yellow bananas for snack exploration'
    ],
    introductionWarmUp: 'Sing "Mr. Sun, Sun, Mr. Golden Sun" while holding up a giant smiling yellow sun cutout. Encourage children to stretch their arms wide and warm themselves in the imaginary yellow sunshine.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Yellow Discovery Tray',
        instruction: 'Display yellow feathers, rubber ducks, and lemon wedges. Let children touch the soft yellow feather and smell the zesty yellow lemon.'
      },
      {
        stepNumber: 2,
        title: 'Yellow Sunshine Ray Crafting',
        instruction: 'Give each child a yellow circle. Demonstrate how to glue yellow paper strips and yellow yarn radiating outward to make sunbeams.'
      },
      {
        stepNumber: 3,
        title: 'Ducklings in the Pond Water Play',
        instruction: 'Float yellow ducks in a shallow water tub. Children use small yellow nets to scoop up the yellow ducklings.'
      }
    ],
    teacherPrompts: [
      '"What makes yellow feel so happy and warm?"',
      '"Can you name a yellow fruit that monkeys love to eat?" (Banana!)',
      '"Let\'s find 3 things in our classroom that shine bright yellow!"'
    ],
    childParticipationActivity: {
      title: 'Yellow Sensory Sunshine Dough & Pom-Poms',
      instructions: 'Children squish lemon-scented yellow playdough and press fluffy yellow pom-poms into the dough to create textured 3D sunshine art.',
      handsOnFocus: 'Hand strength, palmar grasp, sensory olfactory and tactile integration.'
    },
    checkForUnderstanding: [
      'Does the child identify yellow when presented with yellow vs blue items?',
      'Can the child name at least two yellow objects from memory?',
      'Does the child independently select yellow art materials?'
    ],
    assessment: 'Observe during the duck scoop game. Ask each child: "What color duck did you catch?" Verify child responds with "Yellow".',
    closingRecap: 'Recap with the "Five Little Ducks" fingerplay, counting the yellow ducklings as they waddle over the hills and back.',
    optionalExtensionActivity: 'Yellow Lemonade Tasting: Taste sweet water with a squeeze of fresh yellow lemon to connect color to taste sensation.'
  },

  // 7. GREEN
  {
    id: 'lesson-7-green',
    topicNumber: 7,
    title: 'Color Green — Nature & Growing Things',
    icon: '🟢',
    emoji: '🍃',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool',
    duration: '30 Minutes',
    learningArea: 'Colors & Shapes',
    learningAreaId: 'colors_shapes',
    shortDescription: 'Investigate the color Green through living leaves, hopping green frogs, green color mixing (yellow + blue), and grass textures.',
    learningOutcomes: [
      'Identifies the color green in natural and man-made objects',
      'Understands basic color transformation (Yellow + Blue = Green magic)',
      'Develops observational vocabulary connected to nature (grass, leaves, frogs, peas)'
    ],
    learningObjectives: 'Children will identify the color green, discover that green is created by mixing yellow and blue, and collect natural green items during an outdoor garden observation.',
    materialsNeeded: [
      'Fresh green leaves of various shapes and shades',
      'Green toy frogs and lily pad felt mats',
      'Yellow and Blue washable tempera paint in clear ziplock bags',
      'Green sensory rice bin with hidden green plastic insects',
      'Magnifying glasses for inspecting green plant veins'
    ],
    introductionWarmUp: 'Crouch down like little green frogs! Say: "Ribbit, ribbit! Today we are visiting the Green Garden! Green is the color of fresh grass, tall trees, and hopping frogs!" Have children hop 3 times like friendly green frogs.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Magic Color Mixing Bag',
        instruction: 'Show a clear ziplock bag with squirts of blue and yellow paint inside. Invite children to squish the bag with their palms. Watch their eyes widen as the colors blend into GREEN: "Yellow and Blue make magical Green!"'
      },
      {
        stepNumber: 2,
        title: 'Leaf Texture Inspection',
        instruction: 'Pass around fresh green spinach or tree leaves. Use magnifying glasses to see the green leaf veins and feel the smooth surface.'
      },
      {
        stepNumber: 3,
        title: 'Frog on the Lily Pad Hop',
        instruction: 'Place green felt lily pads on the floor. Play music; children hop from one green lily pad to another, landing softly on two feet.'
      }
    ],
    teacherPrompts: [
      '"Look outside the window—what green living things do you see growing?"',
      '"What happened to the yellow and blue paint when we squished them together?"',
      '"Can you name a yummy green vegetable you like to eat?" (Broccoli, cucumber, peas!)'
    ],
    childParticipationActivity: {
      title: 'Green Leaf Rubbing & Texture Printing',
      instructions: 'Children place real green leaves under paper and rub with green crayons to reveal the leaf veins, then add green frog stickers.',
      handsOnFocus: 'Bilateral hand stabilization, fine motor crayon pressure control, botanical observation.'
    },
    checkForUnderstanding: [
      'Can the child explain which two colors mix together to make green?',
      'Does the child correctly identify green items from non-green items?',
      'Can the child point out green foliage in the outdoor environment?'
    ],
    assessment: 'Observe during the magic paint mixing and leaf rubbing. Confirm child uses the term "Green" when identifying their painted results.',
    closingRecap: 'Sing "Five Green and Speckled Frogs" counting down from 5 to 1 as frogs jump into the cool green pool.',
    optionalExtensionActivity: 'Planting Green Grass Seeds: Plant fast-growing grass seeds in small biodegradable cups to observe real green sprouts over the week.'
  },

  // 8. COUNTING 1–10
  {
    id: 'lesson-8-counting',
    topicNumber: 8,
    title: 'Counting 1–10 — Number Adventure',
    icon: '🔟',
    emoji: '🔢',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Early Math',
    learningAreaId: 'math',
    shortDescription: 'Master one-to-one correspondence from 1 to 10 using tactile counting bears, ten-frames, number hopping tracks, and finger rhymes.',
    learningOutcomes: [
      'Counts aloud from 1 to 10 in correct sequential order',
      'Demonstrates 1-to-1 correspondence by touching one item per number counted',
      'Recognizes printed numeral cards 1 through 10',
      'Understands that the last number counted represents the total quantity'
    ],
    learningObjectives: 'Children will count aloud from 1 to 10 sequentially and demonstrate accurate 1-to-1 correspondence by placing counters onto a 10-frame grid.',
    materialsNeeded: [
      'Colorful counting bears or large wooden counting cubes (10 per child)',
      '10-frame laminated visual mats',
      'Number stepping stone floor mats (numbered 1 to 10)',
      'Giant foam die with dots 1–6',
      'Number song audio track ("1, 2, Buckle My Shoe")'
    ],
    introductionWarmUp: 'Wiggle all 10 fingers in the air! Sing "Ten Little Fingers" touching each finger in turn: "1, 2, 3, 4, 5... 6, 7, 8, 9, 10 little fingers on my hands!" Make a gentle clapping sound with all 10 fingers.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Number Floor Track Marching',
        instruction: 'Lay out the number stepping stones from 1 to 10. Children step on each number in order, calling out the number with loud, enthusiastic voices.'
      },
      {
        stepNumber: 2,
        title: 'One-to-One Bear Alignment',
        instruction: 'Demonstrate placing 1 bear on block 1, 2 bears on block 2, etc. Emphasize: "One touch, one number! We don\'t rush our counting finger."'
      },
      {
        stepNumber: 3,
        title: 'Ten-Frame Filling Challenge',
        instruction: 'Give each child a 10-frame mat and 10 colored counters. Call out a number (e.g. "Let\'s put 5 bears in their bedrooms!"). Count together as bears fill the top row.'
      }
    ],
    teacherPrompts: [
      '"If we have 3 bears and we invite 1 more friend, how many bears are there now?"',
      '"Show me 4 fingers! Let\'s count them: 1, 2, 3, 4!"',
      '"What number comes right after 7 when we count up?"'
    ],
    childParticipationActivity: {
      title: 'Ten-Frame Tower Building',
      instructions: 'Children roll a giant number die, read the dots, and snap together that exact number of interlocking math blocks into a tall colorful tower.',
      handsOnFocus: 'Subitizing, 1-to-1 counting accuracy, fine motor block connection.'
    },
    checkForUnderstanding: [
      'Does the child touch each object once while counting aloud without skipping?',
      'Can the child hand the teacher exactly 5 items when requested?',
      'Does the child recognize numerals 1 to 10 on flashcards?'
    ],
    assessment: 'Observe during the ten-frame activity. Note whether the child counts sequentially up to 10 and stops at the target amount.',
    closingRecap: 'Count backward from 10 to 1 like a rocket blast-off: "10, 9, 8, 7, 6, 5, 4, 3, 2, 1... BLAST OFF!" Children jump up happily.',
    optionalExtensionActivity: 'Counting Nature Walk: Collect 10 small pebbles or acorns in an egg carton tray numbered 1 through 10.'
  },

  // 9. SWEET AND SOUR
  {
    id: 'lesson-9-sweet-sour',
    topicNumber: 9,
    title: 'Sweet & Sour — Taste & Sensory Discovery',
    icon: '🍋',
    emoji: '🍯',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool',
    duration: '25 Minutes',
    learningArea: 'Focus & Observation',
    learningAreaId: 'focus',
    shortDescription: 'Explore the sense of taste by comparing sweet honey/strawberries with tangy sour lemons and making funny taste reaction faces.',
    learningOutcomes: [
      'Identifies the mouth/tongue as the organ of taste',
      'Distinguishes between sweet and sour flavor profiles',
      'Uses descriptive sensory vocabulary to express food preferences',
      'Practices safe, mindful hygiene and tasting etiquette in group settings'
    ],
    learningObjectives: 'Children will compare sweet and sour tastes using real fruit samples, categorize pictures of food onto a "Sweet vs Sour" chart, and describe their tongue sensations.',
    materialsNeeded: [
      'Small safe tasting cups with: Sweet strawberry slice / honey drop, and Sour fresh lemon wedge',
      'Sanitary napkins and clean toothpicks/spoons',
      'Picture sorting cards (lemon, lollipop, green apple, candy, grapefruit, banana)',
      'Two reaction puppets: "Smiling Sweet Sam" and "Pucker-Face Sour Sally"',
      'Mirror for children to see their taste expressions'
    ],
    introductionWarmUp: 'Stick out tongues in front of a mirror! "Look at your amazing tongue! It has thousands of tiny taste buds that tell your brain if food is sweet like a birthday cake or sour like a zesty lemon!"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Mindful Sweet Tasting',
        instruction: 'Distribute a tiny piece of sweet strawberry or banana. Have children close their eyes and taste gently: "Mmm, is that sweet or sour? How does your smile feel?"'
      },
      {
        stepNumber: 2,
        title: 'The Great Lemon Pucker Experience',
        instruction: 'Give each child a tiny lick of fresh lemon juice. Watch their playful pucker faces: "Whoa! That is SOUR! It tickles the sides of your tongue!"'
      },
      {
        stepNumber: 3,
        title: 'Sweet vs. Sour Picture Charting',
        instruction: 'Hold up picture cards (ice cream vs lime). Children point to Sweet Sam (smiling) or Sour Sally (puckering) to classify each food.'
      }
    ],
    teacherPrompts: [
      '"How did your face change when you tasted the lemon wedge?"',
      '"What is your favorite sweet food you enjoy at home?"',
      '"Why do you think our tongue has special taste helpers?"'
    ],
    childParticipationActivity: {
      title: 'Sweet vs. Sour Food Collage Sort',
      instructions: 'Children glue cutouts of lemons, oranges, honey jars, and watermelon slices onto two distinct plates labeled with a happy face (Sweet) and a pucker face (Sour).',
      handsOnFocus: 'Sensory discrimination, categorizing logic, scissors/glue fine motor skills.'
    },
    checkForUnderstanding: [
      'Can the child name sweet foods vs sour foods correctly?',
      'Does the child understand that taste happens on the tongue?',
      'Can the child describe the difference in sensation between honey and lemon?'
    ],
    assessment: 'Observe during the plate sorting activity. Check if the child places lemon/lime under Sour and strawberry/banana under Sweet.',
    closingRecap: 'Take a sip of fresh clean water to wash taste buds. Recite the "Taste Explorer Rhyme" with funny face gestures.',
    optionalExtensionActivity: 'Sweet & Sour Lemonade Lab: Mix water, lemon juice (sour), and a spoonful of honey (sweet) to see how they balance into delicious lemonade.'
  },

  // 10. MY FEELINGS
  {
    id: 'lesson-10-feelings',
    topicNumber: 10,
    title: 'My Feelings — Happy, Sad, Angry & Calm',
    icon: '😊',
    emoji: '🎭',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Thinking & Problems',
    learningAreaId: 'problem_solving',
    shortDescription: 'Build emotional literacy and self-regulation by identifying facial cues, naming core emotions, and practicing belly breathing.',
    learningOutcomes: [
      'Identifies 4 core emotions: Happy, Sad, Angry, and Calm/Surprised',
      'Recognizes facial expressions and body language associated with emotions',
      'Learns healthy self-soothing strategies (e.g. 3 balloon belly breaths, asking for a hug)',
      'Demonstrates empathy and supportive behavior toward peers'
    ],
    learningObjectives: 'Children will identify and name four basic emotions through mirror role-play, emotion puppet stories, and practicing a 3-step calming breathing technique.',
    materialsNeeded: [
      'Handheld mirrors (1 per pair of children)',
      'Emoji emotion cards (Happy, Sad, Angry, Scared, Calm)',
      'Feelings wheel with spinning pointer',
      'Soft plush calm-down teddy bear',
      'Storybook: "The Color Monster" or "Glad Monster, Sad Monster"'
    ],
    introductionWarmUp: 'Gather in a circle. Make a big happy smile: "Look at my face! What feeling am I showing?" Next make a gentle sad pout, then an angry furrowed brow. Ask children to mimic each face with their handheld mirror.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Story Time & Emotion Identification',
        instruction: 'Read a short feelings story. Stop on each page and ask: "How does the little bear feel right now? How can we tell from his eyes and mouth?"'
      },
      {
        stepNumber: 2,
        title: 'Mirror Emotion Expressions',
        instruction: 'Children look into their mirrors and practice their best "Happy Sunshine Face", "Gentle Sad Face", "Frustrated Brow", and "Peaceful Calm Face".'
      },
      {
        stepNumber: 3,
        title: 'The Magic Balloon Calm-Down Breath',
        instruction: 'Teach the 3-step calming breath: Place hands on belly. Breathe in through the nose like smelling a flower (inflate belly balloon), hold, and gently blow out through the mouth like cooling warm soup.'
      }
    ],
    teacherPrompts: [
      '"What makes you feel super happy inside like jumping on a trampoline?"',
      '"When a friend is feeling sad, what kind words or gentle action can we offer?"',
      '"What can we do with our bodies when we feel angry inside so we stay safe?"'
    ],
    childParticipationActivity: {
      title: 'Paper Plate Emotion Puppets',
      instructions: 'Children draw a happy face on one side of a paper plate and a calm or surprised face on the reverse side, attaching a craft stick handle to make a dual-sided emotion puppet.',
      handsOnFocus: 'Emotional representation, social-emotional roleplay, bilateral drawing.'
    },
    checkForUnderstanding: [
      'Can the child match an emoji face to a real emotional scenario?',
      'Does the child remember how to take a deep calm-down belly breath?',
      'Can the child express their current feeling using words rather than tantrums?'
    ],
    assessment: 'Observe during the puppet roleplay. Verify whether the child accurately selects the correct face when the teacher describes an emotion scenario.',
    closingRecap: 'Pass the soft Teddy Bear around the circle. Each child gives Teddy a gentle hug and names one thing that makes them feel happy today.',
    optionalExtensionActivity: 'Calm Down Sensory Bottle: Make glitter water bottles that children can shake when upset and watch the glitter settle slowly to calm their breathing.'
  },

  // 11. ANIMALS AROUND US
  {
    id: 'lesson-11-animals',
    topicNumber: 11,
    title: 'Animals Around Us — Sounds, Habitats & Movement',
    icon: '🐾',
    emoji: '🦁',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool',
    duration: '30 Minutes',
    learningArea: 'Everyday Knowledge',
    learningAreaId: 'knowledge',
    shortDescription: 'Explore domestic pets, farm animals, and wild animals through sound imitation, animal walks, habitat sorting, and footprint matching.',
    learningOutcomes: [
      'Identifies common animals (dog, cat, cow, duck, lion, elephant) and their sounds',
      'Categorizes animals by habitat (Farm, Home Pet, Jungle/Wild)',
      'Imitates gross-motor animal movements (gallop, waddle, slither, crawl)',
      'Develops respect and gentle care for living creatures'
    ],
    learningObjectives: 'Children will identify and imitate sounds/movements of 6 common animals, categorizing realistic toy animal figurines into their appropriate home habitats (Farm vs Jungle).',
    materialsNeeded: [
      'Realistic miniature plastic animal figures',
      'Two habitat play mats (Green Farm Barnyard vs Jungle Savanna)',
      'Animal sound audio clips on speaker',
      'Animal footprint stamps and playdough',
      'Animal mask props for dramatic play'
    ],
    introductionWarmUp: 'Play a mystery animal sound (e.g. "Moo!"). Ask: "Who is hiding in our barn today? Let\'s listen with our sharp animal ears! That\'s a cow!" Have all children make the cow sound together.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Animal Sound Mystery Box',
        instruction: 'Play animal audio clips (bark, quack, roar, neigh). Children guess the animal, then take the matching figurine from the box.'
      },
      {
        stepNumber: 2,
        title: 'The Great Animal Movement Parade',
        instruction: 'Turn the classroom into an animal track: Waddle like ducks on heels, stomp like heavy elephants with arm trunks, and hop like little bunnies.'
      },
      {
        stepNumber: 3,
        title: 'Habitat Sorting Station',
        instruction: 'Guide children to place the cow and sheep in the Farm Barn, and the lion and monkey in the Green Jungle.'
      }
    ],
    teacherPrompts: [
      '"How do birds move compared to fish in the water?"',
      '"What sounds do baby chicks make when they are hungry?"',
      '"How should we treat gentle pets like cats and puppies at home?"'
    ],
    childParticipationActivity: {
      title: 'Playdough Animal Track Fossil Makers',
      instructions: 'Children roll flat playdough "mud tracks" and press animal feet into the dough to compare big elephant footprints with tiny bird claw prints.',
      handsOnFocus: 'Comparative visual discrimination, hand pressure modulation, fine motor finger dexterity.'
    },
    checkForUnderstanding: [
      'Can the child match an animal to its sound with accuracy?',
      'Does the child sort animals into farm vs wild correctly?',
      'Can the child perform distinctive animal movements on prompt?'
    ],
    assessment: 'Observe during the habitat sorting activity. Note whether the child correctly places at least 4 out of 5 animal figurines in their proper habitat.',
    closingRecap: 'Sing "Old MacDonald Had a Farm", letting 4 children choose their favorite animal verses with energetic sound effects.',
    optionalExtensionActivity: 'Animal Fur & Feather Sensory Touch: Touch faux fur, real sterile feathers, and smooth leather to compare animal skin coverings.'
  },

  // 12. FRUITS AND HEALTHY FOOD
  {
    id: 'lesson-12-fruits',
    topicNumber: 12,
    title: 'Fruits & Healthy Food — Colors, Crunch & Nutrition',
    icon: '🍎',
    emoji: '🍌',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Everyday Knowledge',
    learningAreaId: 'knowledge',
    shortDescription: 'Discover vibrant fruits and wholesome foods through sensory smell/touch tests, rainbow food sorting, and pretend market grocery shopping.',
    learningOutcomes: [
      'Names common fruits and vegetables (apple, banana, orange, carrot, broccoli)',
      'Understands that fresh food gives our bodies energy, strong bones, and healthy teeth',
      'Classifies foods into "Everyday Healthy Fuel" vs "Sometimes Treats"',
      'Practices table hygiene, hand washing, and courteous sharing'
    ],
    learningObjectives: 'Children will identify and sort 6 common fruits and vegetables by color and food type, understanding the basic benefits of eating a colorful rainbow diet.',
    materialsNeeded: [
      'Real whole fruits (Apple, Orange, Banana, Grapes, Lemon)',
      'Cutting board and safe plastic knife (for teacher cross-section demo)',
      'Pretend play grocery market cart and shopping baskets',
      'Rainbow food sorting plate chart (Red, Orange, Yellow, Green, Purple)',
      'Magnifying glass for inspecting fruit seeds'
    ],
    introductionWarmUp: 'Wash hands thoroughly together singing the "Clean Hands Song". Show a colorful fruit basket covered with a tea towel. Ask: "What healthy fuel gives our bodies superpowers to run, jump, and play all day? Let\'s peek inside!"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Cross-Section Seed Exploration',
        instruction: 'Slice an apple and orange in half. Show the star pattern in the apple seeds and the juicy citrus segments in the orange: "Look at nature\'s amazing design!"'
      },
      {
        stepNumber: 2,
        title: 'Sensory Smell & Touch Test',
        instruction: 'Pass around whole fruits. Children describe textures: "Bumpy orange skin", "Smooth apple", "Soft banana peel".'
      },
      {
        stepNumber: 3,
        title: 'Rainbow Plate Grocery Game',
        instruction: 'Children take turns picking a fruit model from the market cart and placing it on the corresponding color band of the Rainbow Plate.'
      }
    ],
    teacherPrompts: [
      '"Why do you think an apple has a skin on the outside?" (To protect its sweet fruit inside!)',
      '"What color fruit can you eat that is purple or blue?" (Grapes, blueberries!)',
      '"How does your body feel when you drink fresh cool water and eat crunchy carrots?"'
    ],
    childParticipationActivity: {
      title: 'Rainbow Fruit Salad Paper Collage',
      instructions: 'Children tear and glue vibrant colored tissue paper squares (red strawberries, yellow bananas, green kiwi, orange mandarins) into a paper salad bowl.',
      handsOnFocus: 'Bilateral paper tearing, pincer grip, color sorting, nutritional awareness.'
    },
    checkForUnderstanding: [
      'Can the child name at least 4 fruits correctly?',
      'Does the child understand that seeds grow inside fruit?',
      'Can the child identify healthy foods that help them grow big and strong?'
    ],
    assessment: 'Observe during the pretend market checkout. Ask each child: "What healthy food did you buy and why is it good for you?"',
    closingRecap: 'Recap with the "Fruit Salad Dance": Children shake like a fruit tree in the wind and celebrate with a sweet fresh fruit snack.',
    optionalExtensionActivity: 'Seed Sprouting in Cotton: Place an orange or apple seed inside a damp cotton ball inside a clear ziplock taped to the sunny classroom window.'
  },

  // 13. BIG AND SMALL
  {
    id: 'lesson-13-big-small',
    topicNumber: 13,
    title: 'Big & Small — Size Comparisons & Ordering',
    icon: '📏',
    emoji: '🐘',
    ageGroup: '2–4 Years',
    classGroup: 'Toddlers & Preschool',
    duration: '25 Minutes',
    learningArea: 'Logic & Sorting',
    learningAreaId: 'logic',
    shortDescription: 'Master comparative size vocabulary (Big, Medium, Small) through nesting cups, giant elephant steps vs mouse steps, and sensory sorting.',
    learningOutcomes: [
      'Identifies and differentiates between "Big" and "Small" objects',
      'Orders 3 items by relative size (Small, Medium, Big)',
      'Uses comparative language accurately ("The bear is bigger than the mouse")',
      'Adapts body movements to demonstrate big and small physical expressions'
    ],
    learningObjectives: 'Children will compare pairs of objects to determine which is big and which is small, and successfully arrange three items in sequential size order from smallest to largest.',
    materialsNeeded: [
      'Nesting measuring cups or nesting wooden Russian dolls',
      'Giant stuffed teddy bear and tiny pocket mouse plush',
      'Big and small sorting baskets labeled with icons',
      'Pairs of objects (Big ball / Small ball, Big shoe / Tiny baby shoe, Big leaf / Tiny leaf)',
      'Graduated cardboard boxes for stacking'
    ],
    introductionWarmUp: 'Stand up tall like a giant: "Look, I am BIG! I take giant elephant steps: STOMP, STOMP!" Then crouch down tiny like a mouse: "Look, I am tiny and SMALL! Squeak, squeak!" Repeat 3 times with dramatic fun.',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Side-by-Side Object Comparison',
        instruction: 'Hold up a big soccer ball and a small golf ball side-by-side. Ask: "Which one takes both my big hands to hold? The BIG ball! Which one fits in my pocket? The SMALL ball!"'
      },
      {
        stepNumber: 2,
        title: 'Nesting Cup Magic',
        instruction: 'Demonstrate how the small cup hides inside the big cup: "Small fits inside big, but big cannot fit inside small!"'
      },
      {
        stepNumber: 3,
        title: 'Big Basket vs. Little Basket Sorting',
        instruction: 'Children pick an item from the center pile, hold it up, compare it with a peer, and place it into the Big Basket or Little Basket.'
      }
    ],
    teacherPrompts: [
      '"Can you stretch your arms as BIG as an airplane wing?"',
      '"Now curl up as SMALL as a sleepy little ladybug!"',
      '"Look at these two buttons—which one would go on an elephant\'s coat?"'
    ],
    childParticipationActivity: {
      title: 'Graduated Box Stacking & Nesting Challenge',
      instructions: 'Children work in pairs to stack 5 graduated boxes from largest on the bottom to smallest on top to build a stable tower that does not topple.',
      handsOnFocus: 'Spatial reasoning, gravitational balance, sequential size ordering.'
    },
    checkForUnderstanding: [
      'Can the child point out the bigger item when shown two contrasting objects?',
      'Can the child arrange 3 nesting cups in proper order?',
      'Does the child use comparative words (big, small, huge, tiny)?'
    ],
    assessment: 'Observe during the basket sorting activity. Confirm that the child accurately distinguishes big items from small items without confusion.',
    closingRecap: 'Sing the "Goldilocks Three Bears Size Song", comparing Papa Bear (Big), Mama Bear (Medium), and Baby Bear (Small).',
    optionalExtensionActivity: 'Footprint Comparison: Compare the child\'s shoe size with the teacher\'s shoe size by drawing outlines on paper and comparing lengths.'
  },

  // 14. PATTERNS AROUND US
  {
    id: 'lesson-14-patterns',
    topicNumber: 14,
    title: 'Patterns Around Us — AB, AAB & Musical Rhythm',
    icon: '🔁',
    emoji: '🦓',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Early Math',
    learningAreaId: 'math',
    shortDescription: 'Discover repeating patterns in colors, body rhythms, animal stripes, and bead threading through predictive hands-on sequences.',
    learningOutcomes: [
      'Identifies and describes repeating AB patterns (e.g. Red-Blue-Red-Blue)',
      'Predicts what comes next in an established sequence',
      'Creates original repeating patterns using colorful beads, blocks, or body beats (Clap-Stomp)',
      'Observes natural patterns on zebra stripes, butterfly wings, and honeycombs'
    ],
    learningObjectives: 'Children will identify, continue, and construct simple AB and ABB repeating visual and auditory patterns using colored manipulatives and body percussion.',
    materialsNeeded: [
      'Jumbo colorful plastic threading beads and shoelace strings',
      'Unifix colored linking math cubes',
      'Pattern cards with missing end pieces (Red, Blue, Red, Blue, __?)',
      'Musical rhythm sticks or shaker maracas',
      'Pictures of animals with natural patterns (Zebra, Tiger, Caterpillar)'
    ],
    introductionWarmUp: 'Start a body rhythm: Clap, Stomp, Clap, Stomp, Clap, Stomp! Stop and freeze: "What should my body do next? CLAP!" Explain: "A pattern is something that repeats over and over in a special rule!"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Visual Cube Train Pattern Demonstration',
        instruction: 'Snap together: Yellow cube, Green cube, Yellow cube, Green cube. Hold up the train: "Yellow, Green, Yellow, Green... what comes next?" Have children chant aloud.'
      },
      {
        stepNumber: 2,
        title: 'Fixing the Broken Pattern Caterpillar',
        instruction: 'Show a toy caterpillar with a wrong color inserted in the sequence. Invite a volunteer to spot the mistake and fix the caterpillar\'s stripes.'
      },
      {
        stepNumber: 3,
        title: 'Animal Pattern Safari',
        instruction: 'Show pictures of a zebra (Black, White, Black, White). Explain how patterns help animals hide and camouflage in nature.'
      }
    ],
    teacherPrompts: [
      '"Listen to my sound pattern: Beep, Boop, Beep, Boop! What sound is next?"',
      '"If we have Apple, Banana, Apple, Banana... what fruit is the monkey waiting for?"',
      '"Can you make a pattern using two different colored blocks on your table?"'
    ],
    childParticipationActivity: {
      title: 'Pattern Caterpillar Bead Necklaces',
      instructions: 'Children thread jumbo wooden beads onto strings following an AB or ABB color pattern rule (e.g. Orange, Purple, Orange, Purple) to create wearable caterpillar necklaces.',
      handsOnFocus: 'Sequencing prediction, pincer coordination, bilateral needle/string threading.'
    },
    checkForUnderstanding: [
      'Can the child verbally chant an AB pattern in rhythm?',
      'Does the child correctly identify the missing element in a 4-item pattern?',
      'Can the child create their own repeating pattern independently?'
    ],
    assessment: 'Observe during the bead necklace activity. Check if the child maintains their chosen repeating color sequence for at least 6 consecutive beads.',
    closingRecap: 'Class Rhythm Band: Perform an instrumental pattern with maracas: Shake, Tap, Shake, Tap, and finish with a celebratory cheer.',
    optionalExtensionActivity: 'Snack Pattern Skewers: Thread alternating strawberry slices and banana slices onto child-safe wooden sticks before eating.'
  },

  // 15. MY FAMILY & FRIENDS
  {
    id: 'lesson-15-family',
    topicNumber: 15,
    title: 'My Family & Friends — Belonging & Kindness',
    icon: '👨‍👩‍👧‍👦',
    emoji: '🏡',
    ageGroup: '3–5 Years',
    classGroup: 'Preschool & Pre-K',
    duration: '30 Minutes',
    learningArea: 'Everyday Knowledge',
    learningAreaId: 'knowledge',
    shortDescription: 'Celebrate families of all structures, caring friendships, cooperation, sharing toys, and creating heartfelt family portrait art.',
    learningOutcomes: [
      'Identifies key family members and special caregivers at home',
      'Understands that all families are unique, special, and filled with love',
      'Demonstrates friendly classroom behaviors (sharing, taking turns, welcoming peers)',
      'Draws and describes personal family members with pride and affection'
    ],
    learningObjectives: 'Children will share about their family members, celebrate diverse family structures, and practice positive friendship behaviors like sharing and gentle helping.',
    materialsNeeded: [
      'Family diversity picture storybook (e.g. "The Family Book" by Todd Parr)',
      'Dollhouse family figures of diverse generations and ethnicities',
      'Drawing paper frames, multicultural skin-tone crayons, and yarn for hair',
      'Friendship heart stickers and high-five stamps',
      'Cooperative parachute for group friendship games'
    ],
    introductionWarmUp: 'Gather in a cozy circle. Hold up a warm glowing pretend house lantern: "Look at our cozy home! Every family is a special team of people who love and take care of us. Who is in your family team at home?"',
    teachingSteps: [
      {
        stepNumber: 1,
        title: 'Story Time on Diverse Loving Families',
        instruction: 'Read the storybook highlighting that families can be big, small, have grandmas, dads, moms, siblings, uncles, or pets—all united by love.'
      },
      {
        stepNumber: 2,
        title: 'Dollhouse Family Roleplay',
        instruction: 'Invite children to choose dollhouse figures that represent their caregivers and demonstrate caring acts like cooking dinner or reading a bedtime story.'
      },
      {
        stepNumber: 3,
        title: 'Friendship Parachute Waves',
        instruction: 'All children hold the edge of a colorful parachute together. Make gentle waves, calling out a friend\'s name to run underneath and trade places with a high-five.'
      }
    ],
    teacherPrompts: [
      '"What is something special or fun you love doing with your family on the weekend?"',
      '"How do we show our classroom friends that we care when they feel sad or alone?"',
      '"What magic words do we say when we want to share a toy?" ("May I please play too?")'
    ],
    childParticipationActivity: {
      title: 'Heartfelt Family Portrait Frame Art',
      instructions: 'Children use skin-tone crayons and textured yarn to draw their family members standing together inside a decorated paper house frame.',
      handsOnFocus: 'Self-identity representation, portrait drawing, fine motor scissor/crayon control.'
    },
    checkForUnderstanding: [
      'Can the child name and describe their family members to the teacher or peers?',
      'Does the child demonstrate kind, cooperative behavior during the parachute game?',
      'Does the child understand that everyone has a unique and wonderful family?'
    ],
    assessment: 'Observe during the family portrait drawing and circle sharing. Note the child\'s expressive vocabulary and emotional pride when talking about their home and friends.',
    closingRecap: 'Join hands in a giant Friendship Circle and sing "The More We Get Together, the Happier We\'ll Be", ending with a group wave to all our wonderful school friends.',
    optionalExtensionActivity: 'Classroom Family Photo Wall: Invite parents to bring a photo from home to display on a permanent "Our Classroom Families" bulletin board.'
  }
];
