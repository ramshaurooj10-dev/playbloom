import React from 'react';
import { BubblePopIcon } from './BubblePopIcon';
import { BalloonIllustration } from './BalloonIllustration';
import { FeedAnimalIcon } from './FeedAnimalIcon';
import { CatchStarsIcon } from './CatchStarsIcon';
import { CleanRoomIcon } from './CleanRoomIcon';
import { SpyHiddenObjectsIcon } from './SpyHiddenObjectsIcon';
import { BuildGardenIcon } from './BuildGardenIcon';
import { WhatComesTogetherIcon } from './WhatComesTogetherIcon';
import { SweetSourIcon } from './SweetSourIcon';
import { AnimalParentsBabiesIcon } from './AnimalParentsBabiesIcon';
import { FishHuntingIcon } from './FishHuntingIcon';
import { ColorFunIcon } from './ColorFunIcon';
import { KiteCountIcon } from './KiteCountIcon';
import { TrafficLightIcon } from './TrafficLightIcon';
import { IdentifyItemsCardIcon } from './IdentifyItemsCardIcon';
import { FindDifferenceIcon } from './FindDifferenceIcon';
import { AddCountFunIcon } from './AddCountFunIcon';
import { SortItFunIcon } from './SortItFunIcon';

export const PremiumCardIllustration: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'abc':
      return <span className="text-4xl">🔤</span>;
    case 'color':
      return <span className="text-4xl">🎨</span>;
    case 'counting':
      return <span className="text-4xl">🔢</span>;
    case 'shape_match':
      return <span className="text-4xl">🔷</span>;
    case 'rhyme_time':
      return <FindDifferenceIcon size="md" />;
    case 'animal_food_match':
      return <span className="text-4xl">🍌</span>;
    case 'identify_items':
      return <IdentifyItemsCardIcon size="md" />;
    case 'completion':
      return <span className="text-4xl">🏆</span>;
    case 'big_small_sort':
      return (
        <div className="flex items-end justify-center gap-1 select-none">
          <span className="text-4xl leading-none drop-shadow-xs">🐘</span>
          <span className="text-sm leading-none bg-amber-200 border border-amber-400 rounded-full p-0.5 shadow-xs">🐁</span>
        </div>
      );
    case 'more_less':
      return (
        <div className="flex items-center justify-center gap-1 select-none">
          <div className="flex -space-x-2 bg-red-100 p-1 rounded-xl border border-red-300 shadow-xs">
            <span className="text-lg leading-none">🍎</span>
            <span className="text-lg leading-none">🍎</span>
            <span className="text-lg leading-none">🍎</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase">vs</span>
          <div className="bg-red-100 p-1 rounded-xl border border-red-300 shadow-xs">
            <span className="text-lg leading-none">🍎</span>
          </div>
        </div>
      );
    case 'pattern_fun':
      return (
        <div className="flex items-center justify-center gap-1 select-none bg-emerald-50 px-2 py-1.5 rounded-2xl border border-emerald-300 shadow-xs">
          <span className="text-xl leading-none">🔴</span>
          <span className="text-xl leading-none">🟡</span>
          <span className="text-xl leading-none">🔴</span>
          <span className="text-xl leading-none">🟡</span>
        </div>
      );
    case 'memory_match':
      return (
        <div className="flex items-center justify-center gap-2 select-none">
          <div className="w-8 h-11 bg-amber-400 border-2 border-amber-600 rounded-lg flex items-center justify-center text-lg shadow-xs transform -rotate-6">
            🌟
          </div>
          <div className="w-8 h-11 bg-blue-500 border-2 border-blue-700 rounded-lg flex items-center justify-center text-base text-white font-black shadow-xs transform rotate-6">
            ❓
          </div>
        </div>
      );
    case 'fruit_veg_sort':
      return (
        <div className="flex items-center justify-center gap-2 select-none">
          <div className="bg-rose-100 p-1 rounded-xl border border-rose-300 text-center shadow-xs">
            <span className="text-lg leading-none">🧺</span>
            <div className="text-xs leading-none -mt-1">🍎</div>
          </div>
          <div className="bg-emerald-100 p-1 rounded-xl border border-emerald-300 text-center shadow-xs">
            <span className="text-lg leading-none">🧺</span>
            <div className="text-xs leading-none -mt-1">🥕</div>
          </div>
        </div>
      );
    case 'odd_one_out':
      return (
        <div className="grid grid-cols-2 gap-1 p-1 bg-cyan-50 rounded-2xl border border-cyan-300 select-none shadow-xs">
          <span className="text-lg leading-none">🐥</span>
          <span className="text-lg leading-none">🐥</span>
          <span className="text-lg leading-none">🐥</span>
          <span className="text-lg leading-none bg-pink-200 rounded-lg border border-pink-400">🐱</span>
        </div>
      );
    case 'count_tap':
      return (
        <div className="relative w-16 h-16 flex items-center justify-center select-none">
          <span className="absolute top-0 left-1 text-sm">🔴</span>
          <span className="absolute top-1 right-1 text-sm">🟢</span>
          <span className="absolute bottom-1 left-2 text-sm">🟡</span>
          <span className="text-3xl transform rotate-12 -translate-y-1">👆</span>
        </div>
      );
    case 'shape_builder':
      return (
        <div className="flex flex-col items-center justify-center select-none">
          <span className="text-2xl leading-none text-red-500 transform translate-y-1">🔺</span>
          <div className="flex items-center gap-0.5">
            <span className="text-2xl leading-none text-blue-500">🟦</span>
            <span className="text-2xl leading-none text-yellow-400">🟡</span>
          </div>
        </div>
      );
    case 'shadow_match':
      return (
        <div className="flex items-center justify-center gap-1.5 select-none">
          <span className="text-3xl leading-none">🧸</span>
          <span className="text-[10px] font-black text-slate-400">➔</span>
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-lg text-slate-400 shadow-inner">
            👤
          </div>
        </div>
      );
    case 'number_trace':
      return (
        <div className="relative flex items-center justify-center select-none">
          <span className="text-4xl font-black text-lime-600 tracking-tighter drop-shadow-xs">3</span>
          <span className="text-2xl absolute -top-1 -right-2 transform -rotate-45">✏️</span>
        </div>
      );
    case 'letter_trace':
      return (
        <div className="relative flex items-center justify-center select-none">
          <span className="text-4xl font-black text-purple-600 tracking-tighter drop-shadow-xs">A</span>
          <span className="text-2xl absolute -top-1 -right-2 transform -rotate-45">✏️</span>
        </div>
      );
    case 'number_order':
      return (
        <div className="flex items-center justify-center gap-0.5 select-none bg-teal-50 px-2 py-1 rounded-2xl border border-teal-300 shadow-xs">
          <span className="text-base font-black text-teal-800 bg-teal-200 px-1 rounded-md">1</span>
          <span className="text-[10px] font-black text-teal-400">➔</span>
          <span className="text-base font-black text-teal-800 bg-teal-300 px-1 rounded-md">2</span>
          <span className="text-[10px] font-black text-teal-400">➔</span>
          <span className="text-base font-black text-teal-800 bg-teal-400 px-1 text-white rounded-md">3</span>
        </div>
      );
    case 'color_mixing':
      return (
        <div className="flex items-center justify-center gap-1 select-none bg-indigo-50 px-2 py-1 rounded-2xl border border-indigo-200 shadow-xs">
          <span className="text-lg">🔵</span>
          <span className="text-xs font-black text-slate-400">+</span>
          <span className="text-lg">🟡</span>
          <span className="text-xs font-black text-slate-400">=</span>
          <span className="text-xl">🟢</span>
        </div>
      );
    case 'body_parts':
      return (
        <div className="relative flex items-center justify-center select-none">
          <span className="text-4xl">🧒</span>
          <span className="absolute -top-1 -right-2 text-xs bg-yellow-200 rounded-full px-1 border border-yellow-400">👀</span>
          <span className="absolute bottom-0 -left-2 text-xs bg-yellow-200 rounded-full px-1 border border-yellow-400">👂</span>
        </div>
      );
    case 'daily_routine':
      return (
        <div className="flex items-center justify-center gap-1 select-none bg-sky-50 px-2 py-1 rounded-2xl border border-sky-300 shadow-xs">
          <span className="text-lg">🌅</span>
          <span className="text-[10px] text-sky-400 font-black">➔</span>
          <span className="text-lg">🪥</span>
          <span className="text-[10px] text-sky-400 font-black">➔</span>
          <span className="text-lg">☀️</span>
        </div>
      );
    case 'healthy_food_sort':
      return (
        <div className="flex items-center justify-center gap-1 select-none bg-emerald-50 px-2 py-1 rounded-2xl border border-emerald-300 shadow-xs">
          <span className="text-xl">🥦</span>
          <span className="text-xl">🥕</span>
          <span className="text-xl">🥗</span>
        </div>
      );
    case 'healthy_plate':
      return (
        <div className="flex items-center justify-center gap-1 select-none bg-sky-50 px-2 py-1 rounded-2xl border border-sky-300 shadow-xs">
          <span className="text-xl">🍽️</span>
          <span className="text-xl">🍎</span>
          <span className="text-xl">🥛</span>
        </div>
      );
    case 'bubble_pop':
      return <BubblePopIcon size="md" />;
    case 'balloon_count':
      return (
        <div className="flex items-center justify-center -space-x-3 select-none py-0.5">
          <div className="flex flex-col items-center">
            <BalloonIllustration color="red" width={32} height={46} showString={false} />
            <span className="text-[10px] font-black bg-white px-1.5 py-0.2 rounded-full border border-red-300 -mt-2 shadow-xs z-10">
              1
            </span>
          </div>
          <div className="flex flex-col items-center z-20 -translate-y-2">
            <BalloonIllustration color="blue" width={38} height={54} showString={false} />
            <span className="text-[10px] font-black bg-white px-1.5 py-0.2 rounded-full border border-blue-300 -mt-2 shadow-xs z-10">
              2
            </span>
          </div>
          <div className="flex flex-col items-center z-10">
            <BalloonIllustration color="yellow" width={32} height={46} showString={false} />
            <span className="text-[10px] font-black bg-white px-1.5 py-0.2 rounded-full border border-amber-300 -mt-2 shadow-xs z-10">
              3
            </span>
          </div>
        </div>
      );
    case 'feed_animal':
      return <FeedAnimalIcon size="md" />;
    case 'catch_star':
      return <CatchStarsIcon size="md" />;
    case 'clean_room':
      return <CleanRoomIcon size="md" />;
    case 'find_object':
    case 'spy_hidden_objects':
      return <SpyHiddenObjectsIcon size="md" />;
    case 'build_garden':
      return <BuildGardenIcon size="md" />;
    case 'what_comes_together':
      return <WhatComesTogetherIcon size="md" />;
    case 'sweet_sour_fun':
      return <SweetSourIcon size="md" />;
    case 'animal_parents_babies':
      return <AnimalParentsBabiesIcon size="md" />;
    case 'shapes_collector_fun':
      return (
        <div className="flex items-center justify-center -space-x-1 select-none py-0.5">
          <span className="text-2xl transform -rotate-12 animate-pulse">🔴</span>
          <span className="text-2xl transform translate-y-1">🟦</span>
          <span className="text-2xl transform rotate-12">🔺</span>
        </div>
      );
    case 'fish_hunting':
      return <FishHuntingIcon size="md" />;
    case 'color_fun':
      return <ColorFunIcon size="md" />;
    case 'kite_take_away':
      return <KiteCountIcon size="md" />;
    case 'traffic_light_fun':
      return <TrafficLightIcon size="md" />;
    case 'add_and_count_fun':
      return <AddCountFunIcon size="md" />;
    case 'sort_it_fun':
      return <SortItFunIcon size="md" />;
    case 'rhymes_songs':
      return <span className="text-4xl">🎵</span>;
    case 'story_time':
      return <span className="text-4xl">📖</span>;
    case 'vehicles_transport':
      return <span className="text-4xl">🚗</span>;
    case 'seasons_weather':
      return <span className="text-4xl">🌦️</span>;
    case 'emotions_feelings':
      return <span className="text-4xl">😊</span>;
    case 'opposites':
      return <span className="text-4xl">↔️</span>;
    case 'days_months':
      return <span className="text-4xl">📅</span>;
    case 'piano_music':
      return <span className="text-4xl">🎹</span>;
    case 'jigsaw_puzzle':
      return <span className="text-4xl">🧩</span>;
    case 'my_family':
      return <span className="text-4xl">👨‍👩‍👧</span>;
    default:
      return <span className="text-4xl">🌟</span>;
  }
};
