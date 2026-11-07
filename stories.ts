// ============================================================================
// STORY TIME — story list
// -----------------------------------------------------------------------------
// All story text lives in THIS file only, so it is easy to replace:
// - To change a story, just edit its title / screens below.
// - To add a story, copy one entry and give it a new id.
// - To remove a story, delete its entry.
// Each story has 3-4 screens. Each screen is one big emoji scene + 1-2 short
// sentences. Keep sentences short — they are read aloud to 3-6 year olds.
// No other file needs editing when you change stories.
// ============================================================================

export interface StoryScreen {
  emoji: string;
  text: string;
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  screens: StoryScreen[];
}

export const STORIES: Story[] = [
  {
    id: 'milo_brave_chick',
    title: 'Milo the Brave Little Chick',
    emoji: '🐥',
    screens: [
      {
        emoji: '🐥',
        text: 'Milo was a little yellow chick. He lived on a farm with his mom and dad.',
      },
      {
        emoji: '🌧️',
        text: 'One day, a big storm came. Milo was scared. Peep! Peep! he cried.',
      },
      {
        emoji: '💪',
        text: 'But Milo took a deep breath. He flapped his little wings and ran to the barn.',
      },
      {
        emoji: '🌈',
        text: 'The sun came out again. Milo smiled. I am brave! he said. And he was!',
      },
    ],
  },
  {
    id: 'lost_little_star',
    title: 'The Lost Little Star',
    emoji: '⭐',
    screens: [
      {
        emoji: '⭐',
        text: 'Tina was a tiny star in the night sky. She twinkled and twinkled all night long.',
      },
      {
        emoji: '🌙',
        text: 'One night, Tina slipped and fell down, down, down into a garden.',
      },
      {
        emoji: '🐰',
        text: 'A little rabbit found her. Do not worry, said the rabbit. I will help you go home.',
      },
      {
        emoji: '🌟',
        text: 'The rabbit gave her a big push up, up, up! Tina twinkled in the sky again. Thank you, friend!',
      },
    ],
  },
  {
    id: 'pips_rainy_day',
    title: "Pip's Rainy Day",
    emoji: '🌧️',
    screens: [
      {
        emoji: '🌧️',
        text: 'Pip woke up and heard pitter-patter. It was raining outside!',
      },
      {
        emoji: '☂️',
        text: 'Pip put on his red boots and his yellow raincoat. Splash! Splash! he jumped in the puddles.',
      },
      {
        emoji: '🐸',
        text: 'A little frog jumped beside him. Ribbit! said the frog. Let us splash together!',
      },
      {
        emoji: '🌈',
        text: 'Soon the rain stopped and a rainbow came out. What a happy rainy day!',
      },
    ],
  },
];
