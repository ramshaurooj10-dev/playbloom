// ----------------------------------------------------------------------------
// PLAYBLOOM SEO & METADATA CONFIGURATION
// Centralized, easy-to-extend registry for preschool learning SEO
// ----------------------------------------------------------------------------

import { ActivityId } from '../types';

export interface ActivitySEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  learningArea: string;
  ageRange: string;
}

export const SITE_SEO_CONFIG = {
  defaultTitle: 'PlayBloom – Preschool Learning Games & Activities for Kids',
  defaultDescription:
    'PlayBloom is a fun preschool learning app for kids ages 3–6 with ABC phonics, counting, colors, shapes, matching games, animal learning and interactive educational activities.',
  siteName: 'PlayBloom',
  canonicalBase: typeof window !== 'undefined' ? window.location.origin : 'https://playroom-app.vercel.app',
  ogImage: '/icon-512.png',
  locale: 'en_US',
  targetAges: 'Ages 3–6',
};

// ----------------------------------------------------------------------------
// ACTIVITY-SPECIFIC SEO REGISTRY
// When adding a new activity, simply add its entry below to automatically
// update dynamic titles, descriptions, and learning schema.
// ----------------------------------------------------------------------------
export const ACTIVITY_SEO_REGISTRY: Record<string, ActivitySEOMetadata> = {
  home: {
    title: 'PlayBloom – Preschool Learning Games & Activities for Kids',
    description:
      'Explore fun preschool learning games for kids ages 3–6. Interactive ABC phonics, counting, colors, shapes, animal matching, and early childhood educational activities.',
    keywords: [
      'preschool learning games',
      'educational games for kids',
      'preschool activities for kids',
      'learning games for preschoolers',
      'preschool learning app',
      'online preschool activities',
      'educational activities for kids',
      'learning games for kids ages 3–6',
    ],
    learningArea: 'Early Childhood Education',
    ageRange: '3-6',
  },
  welcome: {
    title: 'Welcome to PlayBloom – Interactive Preschool Learning App',
    description:
      'Join PlayBloom! A joyful learning adventure for preschoolers ages 3–6 with interactive phonics, math counting, colors, and puzzle games.',
    keywords: ['preschool games online', 'free preschool learning games', 'fun learning activities for kids'],
    learningArea: 'Early Childhood Education',
    ageRange: '3-6',
  },
  abc: {
    title: 'ABC Fun – Phonics & Alphabet Learning Game | PlayBloom',
    description:
      'Interactive ABC alphabet phonics game for preschoolers. Learn letter recognition, letter sounds, and beginning vocabulary with playful audio narration.',
    keywords: ['ABC games for kids', 'alphabet learning games', 'phonics games for kids', 'letter recognition games'],
    learningArea: 'Language & Phonics',
    ageRange: '3-6',
  },
  color: {
    title: 'Color Time – Learn Colors Interactive Game | PlayBloom',
    description:
      'Fun color learning game for preschool children. Tap and identify vibrant colors with delightful sound effects and friendly voice prompts.',
    keywords: ['color learning games for kids', 'color activities for preschoolers', 'color recognition games'],
    learningArea: 'Colors & Visual Arts',
    ageRange: '3-5',
  },
  find: {
    title: 'Find Object – Visual Discrimination & Search Game | PlayBloom',
    description:
      'Preschool object search and observation game. Strengthen visual tracking, attention, focus, and object recognition skills.',
    keywords: ['matching activities for kids', 'visual learning games for kids', 'find object game for preschoolers'],
    learningArea: 'Observation & Focus',
    ageRange: '3-6',
  },
  counting: {
    title: 'Counting Fun – Early Math & Number Game | PlayBloom',
    description:
      'Learn numbers 1 to 10 with interactive counting activities, tactile item counting, one-to-one correspondence, and auditory number prompts.',
    keywords: ['counting games for kids', 'counting activities for preschoolers', 'preschool math games', 'number learning games'],
    learningArea: 'Early Math & Numbers',
    ageRange: '3-6',
  },
  shape: {
    title: 'Shape Match – Geometric Shape Learning Game | PlayBloom',
    description:
      'Explore circles, squares, triangles, stars, and rectangles. Drag and match shapes to build geometric recognition and spatial reasoning.',
    keywords: ['shape games for kids', 'shape matching games', 'geometric shapes for preschoolers'],
    learningArea: 'Shapes & Spatial Reasoning',
    ageRange: '3-6',
  },
  animal_food_match: {
    title: 'Animal Food Match – Animal Nutrition & Habitats Game | PlayBloom',
    description:
      'Match friendly animals to their favorite healthy foods. Teaches animal recognition, diets, logic, and fine motor drag-and-drop skills.',
    keywords: ['animal games for preschoolers', 'animal matching games for kids', 'food learning for preschoolers'],
    learningArea: 'Animals & Nature',
    ageRange: '3-6',
  },
  big_small_sort: {
    title: 'Big & Small Sort – Comparative Sizes Game | PlayBloom',
    description:
      'Sort big and small objects into comparative baskets. Builds early spatial concepts, measurement reasoning, and categorization.',
    keywords: ['sorting games for kids', 'size comparison activities', 'early math preschool'],
    learningArea: 'Logic & Sorting',
    ageRange: '3-5',
  },
  bubble_pop: {
    title: 'Bubble Pop – Alphabet & Number Popping Fun | PlayBloom',
    description:
      'Listen to the audio cue and pop floating letter and number bubbles. Builds listening comprehension and motor coordination.',
    keywords: ['bubble pop learning game', 'letter bubble games', 'listening games for kids'],
    learningArea: 'Phonics & Coordination',
    ageRange: '3-6',
  },
  balloon_count: {
    title: 'Balloon Count & Pop – Interactive Math Counting | PlayBloom',
    description:
      'Count and pop vibrant balloons in the sky. Enhances counting cardinality, quantity recognition, and number sense.',
    keywords: ['balloon counting game', 'number popping game', 'counting games for preschoolers'],
    learningArea: 'Early Math',
    ageRange: '3-6',
  },
  color_fun: {
    title: 'Color Fun – Guided Coloring & Primary Colors | PlayBloom',
    description:
      'Step-by-step guided coloring worksheet game teaching primary and secondary colors, creative expression, and color theory.',
    keywords: ['coloring games for kids', 'primary colors learning', 'creative preschool activities'],
    learningArea: 'Colors & Creativity',
    ageRange: '3-6',
  },
  kite_take_away: {
    title: 'Kite Count & Take Away – Early Subtraction Game | PlayBloom',
    description:
      'Learn early subtraction concepts with flying kites. Count flying kites, cut strings to take away, and count remaining kites.',
    keywords: ['early subtraction for kids', 'take away math game', 'preschool subtraction activities'],
    learningArea: 'Early Subtraction & Math',
    ageRange: '4-6',
  },
  traffic_light_fun: {
    title: 'Traffic Light Fun – Road Safety & Color Meaning | PlayBloom',
    description:
      'Interactive road safety game teaching Red = Stop, Yellow = Slow, and Green = Go with moving cars, buses, and trucks.',
    keywords: ['traffic light game for kids', 'road safety for preschoolers', 'red light green light game'],
    learningArea: 'Safety & Colors',
    ageRange: '3-6',
  },
};

// ----------------------------------------------------------------------------
// DYNAMIC SEO UPDATE UTILITY
// Updates document title, meta description, and social graph seamlessly
// ----------------------------------------------------------------------------
export function updateSEOForActivity(activityId?: ActivityId | string) {
  if (typeof document === 'undefined') return;

  const key = activityId || 'home';
  const meta = ACTIVITY_SEO_REGISTRY[key] || ACTIVITY_SEO_REGISTRY.home;

  // 1. Update Title
  document.title = meta.title;

  // 2. Update Description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement('meta');
    descTag.setAttribute('name', 'description');
    document.head.appendChild(descTag);
  }
  descTag.setAttribute('content', meta.description);

  // 3. Update Open Graph Meta
  const setMeta = (property: string, content: string) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  const setTwitterMeta = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  setMeta('og:title', meta.title);
  setMeta('og:description', meta.description);
  setMeta('og:site_name', SITE_SEO_CONFIG.siteName);
  setMeta('og:locale', SITE_SEO_CONFIG.locale);
  setMeta('og:image', `${SITE_SEO_CONFIG.canonicalBase}${SITE_SEO_CONFIG.ogImage}`);

  setTwitterMeta('twitter:card', 'summary_large_image');
  setTwitterMeta('twitter:title', meta.title);
  setTwitterMeta('twitter:description', meta.description);
  setTwitterMeta('twitter:image', `${SITE_SEO_CONFIG.canonicalBase}${SITE_SEO_CONFIG.ogImage}`);

  // 4. Update Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', SITE_SEO_CONFIG.canonicalBase);
}
