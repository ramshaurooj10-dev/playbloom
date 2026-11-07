// ============================================================================
// RHYMES & SONGS — video list (Google Drive streaming OR bundled offline MP4)
// -----------------------------------------------------------------------------
// HOW TO ADD YOUR RHYMES — two options, pick ONE per rhyme:
//   (a) STREAM FROM GOOGLE DRIVE (needs internet):
//       1. Upload the rhyme MP4 to Google Drive.
//       2. Right-click the file in Drive -> Share -> set to "Anyone with the
//          link can view" (if it is private, the video will NOT play for users).
//       3. Copy the share link. It looks like:
//            https://drive.google.com/file/d/1AbCdeFGhIjKlmNoPqRsTuVwXyZ/view?usp=sharing
//          The FILE ID is the part between /d/ and /view (here: 1AbCdeFGhIjKlmNoPqRsTuVwXyZ)
//       4. Paste ONLY that file ID into the driveFileId field below, and
//          leave localSrc empty.
//   (b) BUNDLED IN THE APP — PLAYS OFFLINE (no internet needed):
//       1. Put the MP4 file in the project's public/videos/ folder
//          (for example: public/videos/twinkle-twinkle.mp4).
//       2. Set localSrc to '/videos/<filename>.mp4' and leave driveFileId empty.
//       3. The video is then built into the app and plays without internet.
//       (Note: bundled videos make the app download bigger — only bundle
//       the rhymes you really want offline.)
// - To add more rhymes, copy one entry and change id / title / emoji.
// - To remove a rhyme, delete its entry. No other file needs editing.
// - You can also rename the titles here to match your own AI-made rhymes.
// - DO NOT put full URLs in this file — the component builds them from the ID.
// - Exactly ONE of driveFileId / localSrc should be set per rhyme.
// ============================================================================
// CURRENT LIST — 53 of Ramsha's own AI-made rhymes (Nov 2026):
//   * First 10 are BUNDLED in public/videos/ (compressed to 480p) — play OFFLINE.
//   * The other 43 stream from Google Drive (driveFileId) — need internet.
// ============================================================================

export interface RhymeVideo {
  id: string;
  title: string;
  emoji: string;
  /** Google Drive file ID (streaming, needs internet). Leave empty if localSrc is set. */
  driveFileId?: string;
  /** Bundled video path, e.g. '/videos/twinkle-twinkle.mp4' (offline). Leave empty if driveFileId is set. */
  localSrc?: string;
}

export const RHYMES: RhymeVideo[] = [
  // ---- Bundled in the app — play offline (public/videos/) ----
  {
    id: 'abc_phonics',
    title: 'ABC Phonics',
    emoji: '🔤',
    localSrc: '/videos/rhyme-01-abc-phonics.mp4',
  },
  {
    id: 'abc_song',
    title: 'ABC Song',
    emoji: '🔤',
    localSrc: '/videos/rhyme-02-abc-song.mp4',
  },
  {
    id: 'wheels_on_the_bus',
    title: 'Wheels on the Bus',
    emoji: '🚌',
    localSrc: '/videos/rhyme-03-wheels-on-the-bus.mp4',
  },
  {
    id: 'johny_johny',
    title: 'Johny Johny Yes Papa',
    emoji: '👦',
    localSrc: '/videos/rhyme-04-johny-johny.mp4',
  },
  {
    id: 'learning_shapes',
    title: 'Learning Shapes',
    emoji: '🔺',
    localSrc: '/videos/rhyme-05-learning-shapes.mp4',
  },
  {
    id: 'my_body_parts',
    title: 'My Body Parts',
    emoji: '🧍',
    localSrc: '/videos/rhyme-06-my-body-parts.mp4',
  },
  {
    id: 'ants_marching',
    title: 'Ants Marching',
    emoji: '🐜',
    localSrc: '/videos/rhyme-07-ants-marching.mp4',
  },
  {
    id: 'five_little_chicks',
    title: 'Five Little Chicks',
    emoji: '🐥',
    localSrc: '/videos/rhyme-08-five-little-chicks.mp4',
  },
  {
    id: 'train_choo_choo',
    title: 'Train Choo Choo',
    emoji: '🚂',
    localSrc: '/videos/rhyme-09-train-choo-choo.mp4',
  },
  {
    id: 'baby_shark',
    title: 'Baby Shark',
    emoji: '🦈',
    localSrc: '/videos/rhyme-10-baby-shark.mp4',
  },
  // ---- Streamed from Google Drive — need internet ----
  {
    id: 'baby_animals_dream',
    title: 'Baby Animals Dream',
    emoji: '🐾',
    driveFileId: '1m6kTKz8FnfmC73QhZ1hy_KkfuOAenFGE',
  },
  {
    id: 'baby_deer',
    title: 'Baby Deer',
    emoji: '🦌',
    driveFileId: '1mDbagZ6oyk593b3mtGZq_XP0_TqoHOU_',
  },
  {
    id: 'baby_panda',
    title: 'Baby Panda',
    emoji: '🐼',
    driveFileId: '11stIksoEfACPHehp_wfDYohrICMwNYcd',
  },
  {
    id: 'baby_spider',
    title: 'Baby Spider',
    emoji: '🕷️',
    driveFileId: '1j1zedc2Abva0caC_COnZ2KAk1Ft-SG3A',
  },
  {
    id: 'bella_sheep',
    title: 'Bella and Her Sheep',
    emoji: '🐑',
    driveFileId: '15HlGX31V4dniA5KaNfASsKy_306wJJca',
  },
  {
    id: 'bella_butterfly',
    title: 'Bella the Butterfly',
    emoji: '🦋',
    driveFileId: '1pJ-EzlRuuRAEvETy184_5nC1kulLgql1',
  },
  {
    id: 'birds_song',
    title: 'Birds Song',
    emoji: '🐦',
    driveFileId: '1XuGW8J86fTl8J52vGRLBqqYOVq4C3qP_',
  },
  {
    id: 'bouncy_bunny',
    title: 'Bouncy Bunny',
    emoji: '🐰',
    driveFileId: '1rKCY1L1bLKo-0KGaSsZPjCn4bKGGMCPf',
  },
  {
    id: 'brush_your_teeth',
    title: 'Brush Your Teeth',
    emoji: '🪥',
    driveFileId: '1JC8r8PC0ADa68GsRQShidcR4HuQxu8DM',
  },
  {
    id: 'bunny_loves_carrot',
    title: 'Bunny Loves Carrot',
    emoji: '🥕',
    driveFileId: '11MPmrb32PCE_3tEeCcY64N_753V2Gld3',
  },
  {
    id: 'butterfly_fun',
    title: 'Butterfly Fun Time',
    emoji: '🦋',
    driveFileId: '1byWjBpz2MnGMnqs-7OF8GqAe9Msd_2Hw',
  },
  {
    id: 'cat_fun',
    title: 'Cat Fun',
    emoji: '🐱',
    driveFileId: '1H0o1XTuU_WidH44aAERCIliJi2CpSRSh',
  },
  {
    id: 'caw_crow',
    title: 'Caw Crow Song',
    emoji: '🐦‍⬛',
    driveFileId: '1FbjRG4uIedr7x_MGw-qP-eZNZzN86soY',
  },
  {
    id: 'chilli_song',
    title: 'Chilli Song',
    emoji: '🌶️',
    driveFileId: '16rJgYo0o_A8ZokbRmju5A-dmJ7PyNoG_',
  },
  {
    id: 'chocolate_fun',
    title: 'Chocolate Fun',
    emoji: '🍫',
    driveFileId: '1-QQlqmOILsjNHKyAiV5q2zSEWIuQupsY',
  },
  {
    id: 'cock_a_doodle_doo',
    title: 'Cock a Doodle Doo',
    emoji: '🐓',
    driveFileId: '11KEdP5bIoQCVDyAdVel3_dRlXl4sIqo9',
  },
  {
    id: 'dancing_leaf',
    title: 'Dancing Leaf in Rain',
    emoji: '🍂',
    driveFileId: '1UNz590q0XwO97emgwfRg6fF971uuM44V',
  },
  {
    id: 'flowers_song',
    title: 'Flowers Song',
    emoji: '🌸',
    driveFileId: '1Sa-yyQ0HvrzgHsdaSITiH2pnEG176UXH',
  },
  {
    id: 'food_fun',
    title: 'Food Fun',
    emoji: '🍎',
    driveFileId: '1z8XYAaoOMRjXyi5c0_FPFIVe2T4o_bwB',
  },
  {
    id: 'fruity_fun',
    title: 'Fruity Fun',
    emoji: '🍓',
    driveFileId: '1OPh8GbiMSmlft8tAlGeBELQZgBoKgDsM',
  },
  {
    id: 'getting_dressed',
    title: 'Getting Dressed',
    emoji: '👕',
    driveFileId: '1DOGeRwvp2sbUEDi0o8kOvQwAtNWfBVv7',
  },
  {
    id: 'honey_bee',
    title: 'Honey Bee',
    emoji: '🐝',
    driveFileId: '1yYStgy-0vG5-sxFfJmCDSsI8Z3YiWmWK',
  },
  {
    id: 'icecream_party',
    title: 'Ice Cream Party',
    emoji: '🍦',
    driveFileId: '1mGoor8EWLPP7p7lAIN-hcG1qTgUPQXqv',
  },
  {
    id: 'lady_bug',
    title: 'Lady Bug',
    emoji: '🐞',
    driveFileId: '1yjw-JAc6wACWCD8__JByer0jaclzxUwV',
  },
  {
    id: 'mermaid',
    title: 'Mermaid Fun Time',
    emoji: '🧜‍♀️',
    driveFileId: '1Zxp8mjLY-33RhqPY6MckKs3pwSRXQOwD',
  },
  {
    id: 'mimi_monkey',
    title: 'Mimi the Monkey',
    emoji: '🐵',
    driveFileId: '1WA_7n4g9bYeSuEqq15usLHbPY3NzlbqS',
  },
  {
    id: 'peek_a_boo',
    title: 'Peek a Boo',
    emoji: '👀',
    driveFileId: '1Q9DuHRAv6I3--qJr7tdt4qQyLYsO-bG6',
  },
  {
    id: 'penguin_fun',
    title: 'Penguin Fun',
    emoji: '🐧',
    driveFileId: '1dtJ1xA-mH2Wyo6XA0hWeAcok3ZVGXTUX',
  },
  {
    id: 'pookie_fun_time',
    title: 'Pookie Fun Time',
    emoji: '🐰',
    driveFileId: '1lNYbmAIMjEW5rkpgqipT4VRE7JJoYAzQ',
  },
  {
    id: 'pookie_the_bunny',
    title: 'Pookie the Bunny',
    emoji: '🐰',
    driveFileId: '1uaGBoKUF3ixLGtqtCQhGQ1W7A9V7NJie',
  },
  {
    id: 'pookie_the_bunny_song',
    title: 'Pookie the Bunny Song',
    emoji: '🐰',
    driveFileId: '1NYoePpkeOaKeu9t4AiLnVCYYSXyp6IiZ',
  },
  {
    id: 'potty_time',
    title: 'Potty Time',
    emoji: '🚽',
    driveFileId: '1j61G1MPa5cTu1ybJKpxI6-UocxoNKCWj',
  },
  {
    id: 'red_yellow_green',
    title: 'Red Yellow Green',
    emoji: '🚦',
    driveFileId: '1r_hw1dPBJpcnpq5oGyyK41OX0Mn-8COg',
  },
  {
    id: 'sharing_is_caring',
    title: 'Sharing is Caring',
    emoji: '🤝',
    driveFileId: '1hwRoPzIGY60V2SkvCpc7_d51ZtOFOcBa',
  },
  {
    id: 'sleepy_owl',
    title: 'Sleepy Owl',
    emoji: '🦉',
    driveFileId: '1qSnhHG7oZ-WryrlPK9QzSVu2I7HI5Rfi',
  },
  {
    id: 'sparkling_animals',
    title: 'Sparkling Animals',
    emoji: '✨',
    driveFileId: '1FxcqijCM_JQEsUTblhvrd1gzteQzSUJs',
  },
  {
    id: 'sugar_dancing',
    title: 'Sugar Dancing Song',
    emoji: '🍬',
    driveFileId: '1v2QKNuW9aiAPZQc7xEWS4ABjDWVZIJhp',
  },
  {
    id: 'sunflower_fun',
    title: 'Sunflower Fun',
    emoji: '🌻',
    driveFileId: '1ew6gWHssZfVoRQAV4yvVZggql4c1qTaS',
  },
  {
    id: 'table_manners',
    title: 'Table Manners',
    emoji: '🍽️',
    driveFileId: '1-fWJqH0kal9ZfVuELUyohlLQXmLdQnKD',
  },
  {
    id: 'timmy_turtle',
    title: 'Timmy the Turtle',
    emoji: '🐢',
    driveFileId: '1I3yckboH1znLCQA6uoLjqbU-jLcKxglI',
  },
  {
    id: 'toy_song',
    title: 'Toy Song',
    emoji: '🧸',
    driveFileId: '10nJAvSBXHmOuz0E2ChEaN7DwirfjuR8M',
  },
  {
    id: 'wild_animals',
    title: 'Wild Animals',
    emoji: '🦁',
    driveFileId: '1cr3dODoRxpQZFJO-L1FOSaprkZg2tyhK',
  },
  {
    id: 'sparkling_night',
    title: 'Sparkling Night',
    emoji: '🌙',
    driveFileId: '15vr52BC_-KBygpc2Mt6OZV-9rOxtQXew',
  },
];
