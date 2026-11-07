export type ActivityId = 
  | 'welcome'
  | 'home'
  | 'abc'
  | 'color'
  | 'find_object'
  | 'counting'
  | 'shape_match'
  | 'rhyme_time'
  | 'animal_food_match'
  | 'completion'
  | 'big_small_sort'
  | 'more_less'
  | 'pattern_fun'
  | 'memory_match'
  | 'fruit_veg_sort'
  | 'odd_one_out'
  | 'count_tap'
  | 'shape_builder'
  | 'shadow_match'
  | 'number_trace'
  | 'letter_trace'
  | 'number_order'
  | 'color_mixing'
  | 'body_parts'
  | 'daily_routine'
  | 'healthy_food_sort'
  | 'healthy_plate'
  | 'bubble_pop'
  | 'balloon_count'
  | 'feed_animal'
  | 'catch_star'
  | 'clean_room'
  | 'build_garden'
  | 'what_comes_together'
  | 'sweet_sour_fun'
  | 'animal_parents_babies'
  | 'shapes_collector_fun'
  | 'fish_hunting'
  | 'color_fun'
  | 'kite_take_away'
  | 'traffic_light_fun'
  | 'spy_hidden_objects'
  | 'identify_items'
  | 'add_and_count_fun'
  | 'sort_it_fun'
  | 'rhymes_songs'
  | 'story_time'
  | 'vehicles_transport'
  | 'seasons_weather'
  | 'emotions_feelings'
  | 'opposites'
  | 'days_months'
  | 'piano_music'
  | 'jigsaw_puzzle'
  | 'my_family'
  | 'educator_hub';

export interface ActivityInfo {
  id: ActivityId;
  title: string;
  emoji: string;
  subtitle: string;
  color: string; // Tailwind gradient/bg class
  borderColor: string;
  shadowColor: string;
}

export interface AssetPlaceholderProps {
  type: 'image' | 'sound';
  assetName: string;
  description: string;
  dimensions?: string;
  speechText?: string;
  className?: string;
}

export interface ABCItem {
  letter: string;
  lowercase: string;
  word: string;
  imageAsset: string;
  soundAsset: string;
}

export interface ColorItem {
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  exampleObject: string;
}

export interface FindItem {
  id: string;
  name: string;
  emoji: string;
  imageAsset: string;
  isTarget: boolean;
}

export interface ShapeItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  imageAsset: string;
  soundAsset: string;
}
