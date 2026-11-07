import React from 'react';

interface CartoonIllustrationProps {
  assetName: string;
  className?: string;
  description?: string;
}

export const CartoonIllustration: React.FC<CartoonIllustrationProps> = ({
  assetName,
  className = '',
  description,
}) => {
  const name = assetName.toLowerCase();

  // 1. Playroom Background 2D Scene
  if (name.includes('playroom_background') || name.includes('playroom_seek_background')) {
    return (
      <div className={`w-full h-full min-h-[220px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#FEF08A] relative p-4 flex flex-col justify-between border-4 border-amber-300 shadow-inner ${className}`}>
        {/* Sky Wallpaper Pattern - Clouds & Stars */}
        <div className="absolute inset-0 opacity-40 pointer-events-none flex justify-around items-start pt-2">
          <span className="text-3xl animate-bounce">☁️</span>
          <span className="text-2xl">⭐</span>
          <span className="text-4xl animate-pulse">☁️</span>
          <span className="text-2xl">✨</span>
          <span className="text-3xl">☁️</span>
        </div>

        {/* Window with Smiling Sun */}
        <div className="absolute top-3 right-4 w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-300 flex items-center justify-center shadow-md overflow-hidden z-10">
          <span className="text-4xl animate-spin-slow">☀️</span>
        </div>

        {/* Playroom Wall Decoration / Bunting Flag */}
        <div className="relative z-10 flex gap-2 justify-center mb-2">
          <span className="px-2 py-0.5 bg-red-400 text-white rounded-b-lg font-black text-xs shadow-xs">A</span>
          <span className="px-2 py-0.5 bg-yellow-400 text-white rounded-b-lg font-black text-xs shadow-xs">B</span>
          <span className="px-2 py-0.5 bg-blue-400 text-white rounded-b-lg font-black text-xs shadow-xs">C</span>
          <span className="px-2 py-0.5 bg-green-400 text-white rounded-b-lg font-black text-xs shadow-xs">1</span>
          <span className="px-2 py-0.5 bg-purple-400 text-white rounded-b-lg font-black text-xs shadow-xs">2</span>
          <span className="px-2 py-0.5 bg-pink-400 text-white rounded-b-lg font-black text-xs shadow-xs">3</span>
        </div>

        {/* Room Interior - Shelf & Toys */}
        <div className="relative z-10 my-auto flex justify-between items-end px-2">
          {/* Bookshelf */}
          <div className="bg-[#B45309] border-2 border-[#78350F] rounded-t-xl p-2 flex gap-1 shadow-md">
            <div className="w-3 h-10 bg-red-500 rounded-xs" />
            <div className="w-3 h-12 bg-blue-500 rounded-xs" />
            <div className="w-3 h-9 bg-green-500 rounded-xs" />
            <div className="w-3 h-11 bg-yellow-500 rounded-xs" />
          </div>

          {/* Toy Box */}
          <div className="bg-[#F59E0B] border-4 border-[#D97706] rounded-2xl p-3 flex items-center gap-2 shadow-lg">
            <span className="text-3xl">🧸</span>
            <span className="text-3xl">🚀</span>
            <span className="text-3xl">🧩</span>
          </div>

          {/* Play Rug / Easel */}
          <div className="bg-emerald-400 border-2 border-emerald-600 rounded-2xl p-2 text-2xl shadow-md">
            🎨
          </div>
        </div>

        {/* Floor Base */}
        <div className="relative z-10 w-full bg-[#FDE047] border-t-4 border-[#CA8A04] rounded-b-xl py-1 px-3 text-center text-xs font-black text-amber-900 flex justify-around">
          <span>🚂 Toy Train Path</span>
          <span>🌈 Play Rug Area</span>
          <span>⚽ Ball Pit Corner</span>
        </div>
      </div>
    );
  }

  // 2. Color Time Outline Canvas
  if (name.includes('coloring_page') || name.includes('colors/')) {
    return (
      <div className={`w-full h-full min-h-[180px] bg-white rounded-2xl border-4 border-slate-300 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner ${className}`}>
        <div className="text-xs font-black text-pink-700 bg-pink-100 px-3 py-1 rounded-full mb-2 border border-pink-300">
          🎨 2D Preschool Coloring Outline Canvas
        </div>
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs text-center">
          <div className="border-2 border-dashed border-slate-400 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
            <span className="text-3xl">☀️</span>
            <span className="text-[10px] font-bold text-slate-600">Sun</span>
          </div>
          <div className="border-2 border-dashed border-slate-400 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
            <span className="text-3xl">🌸</span>
            <span className="text-[10px] font-bold text-slate-600">Flower</span>
          </div>
          <div className="border-2 border-dashed border-slate-400 rounded-xl p-2 bg-slate-50 flex flex-col items-center">
            <span className="text-3xl">🏠</span>
            <span className="text-[10px] font-bold text-slate-600">House</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. ABC Phonics Artwork (Letter A Apple, B Ball, etc.)
  if (name.includes('abc/')) {
    let emoji = '🍎';
    let label = 'Apple';
    let bgColor = 'bg-red-50 border-red-300';

    if (name.includes('apple')) { emoji = '🍎'; label = 'A is for Apple'; bgColor = 'bg-red-100 border-red-400'; }
    else if (name.includes('ball')) { emoji = '⚽'; label = 'B is for Ball'; bgColor = 'bg-blue-100 border-blue-400'; }
    else if (name.includes('cat')) { emoji = '🐱'; label = 'C is for Cat'; bgColor = 'bg-orange-100 border-orange-400'; }
    else if (name.includes('dog')) { emoji = '🐶'; label = 'D is for Dog'; bgColor = 'bg-amber-100 border-amber-400'; }
    else if (name.includes('elephant')) { emoji = '🐘'; label = 'E is for Elephant'; bgColor = 'bg-sky-100 border-sky-400'; }
    else if (name.includes('fish')) { emoji = '🐟'; label = 'F is for Fish'; bgColor = 'bg-cyan-100 border-cyan-400'; }
    else if (name.includes('giraffe')) { emoji = '🦒'; label = 'G is for Giraffe'; bgColor = 'bg-yellow-100 border-yellow-400'; }
    else if (name.includes('hat')) { emoji = '🎩'; label = 'H is for Hat'; bgColor = 'bg-purple-100 border-purple-400'; }
    else if (name.includes('ice_cream')) { emoji = '🍦'; label = 'I is for Ice Cream'; bgColor = 'bg-pink-100 border-pink-400'; }
    else if (name.includes('juice')) { emoji = '🧃'; label = 'J is for Juice'; bgColor = 'bg-emerald-100 border-emerald-400'; }
    else if (name.includes('kite')) { emoji = '🪁'; label = 'K is for Kite'; bgColor = 'bg-rose-100 border-rose-400'; }
    else if (name.includes('lion')) { emoji = '🦁'; label = 'L is for Lion'; bgColor = 'bg-amber-100 border-amber-400'; }
    else if (name.includes('monkey')) { emoji = '🐒'; label = 'M is for Monkey'; bgColor = 'bg-[#FEF08A] border-amber-400'; }
    else if (name.includes('nest')) { emoji = '🪹'; label = 'N is for Nest'; bgColor = 'bg-stone-100 border-stone-400'; }
    else if (name.includes('owl')) { emoji = '🦉'; label = 'O is for Owl'; bgColor = 'bg-indigo-100 border-indigo-400'; }
    else if (name.includes('panda')) { emoji = '🐼'; label = 'P is for Panda'; bgColor = 'bg-slate-100 border-slate-400'; }
    else if (name.includes('queen')) { emoji = '👑'; label = 'Q is for Queen'; bgColor = 'bg-yellow-100 border-amber-400'; }
    else if (name.includes('rabbit')) { emoji = '🐰'; label = 'R is for Rabbit'; bgColor = 'bg-teal-100 border-teal-400'; }
    else if (name.includes('sun')) { emoji = '☀️'; label = 'S is for Sun'; bgColor = 'bg-amber-100 border-amber-400'; }
    else if (name.includes('tiger')) { emoji = '🐯'; label = 'T is for Tiger'; bgColor = 'bg-orange-100 border-orange-400'; }
    else if (name.includes('umbrella')) { emoji = '☂️'; label = 'U is for Umbrella'; bgColor = 'bg-violet-100 border-violet-400'; }
    else if (name.includes('violin')) { emoji = '🎻'; label = 'V is for Violin'; bgColor = 'bg-amber-100 border-amber-500'; }
    else if (name.includes('whale')) { emoji = '🐳'; label = 'W is for Whale'; bgColor = 'bg-blue-100 border-blue-400'; }
    else if (name.includes('xylophone')) { emoji = '🎼'; label = 'X is for Xylophone'; bgColor = 'bg-fuchsia-100 border-fuchsia-400'; }
    else if (name.includes('yoyo')) { emoji = '🪀'; label = 'Y is for Yo-yo'; bgColor = 'bg-red-100 border-red-400'; }
    else if (name.includes('zebra')) { emoji = '🦓'; label = 'Z is for Zebra'; bgColor = 'bg-[#F1F5F9] border-slate-400'; }

    return (
      <div className={`w-full h-full min-h-[160px] rounded-2xl ${bgColor} border-4 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
        <div className="absolute top-2 right-2 text-xs font-black bg-white px-2 py-0.5 rounded-full border border-black/10 shadow-xs">
          2D Card ✨
        </div>
        <div className="w-20 h-20 bg-white rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-5xl mb-2 animate-bounce">
          {emoji}
        </div>
        <span className="text-sm font-black text-slate-800 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
          {description || label}
        </span>
      </div>
    );
  }

  // 4. Animal Friends Artwork
  if (name.includes('animals/')) {
    let animalEmoji = '🦁';
    let animalName = 'Lion';
    let habitatColor = 'from-amber-200 to-yellow-100 border-amber-400';

    if (name.includes('lion')) { animalEmoji = '🦁'; animalName = 'Safari Lion'; habitatColor = 'from-amber-200 to-yellow-100 border-amber-400'; }
    else if (name.includes('elephant')) { animalEmoji = '🐘'; animalName = 'Blue Elephant'; habitatColor = 'from-sky-200 to-blue-100 border-sky-400'; }
    else if (name.includes('monkey')) { animalEmoji = '🐒'; animalName = 'Jungle Monkey'; habitatColor = 'from-emerald-200 to-green-100 border-emerald-400'; }
    else if (name.includes('dog')) { animalEmoji = '🐶'; animalName = 'Playful Puppy'; habitatColor = 'from-orange-200 to-amber-100 border-orange-400'; }
    else if (name.includes('cat')) { animalEmoji = '🐱'; animalName = 'Fluffy Kitten'; habitatColor = 'from-pink-200 to-rose-100 border-pink-400'; }
    else if (name.includes('duck')) { animalEmoji = '🦆'; animalName = 'Pond Duck'; habitatColor = 'from-cyan-200 to-blue-100 border-cyan-400'; }
    else if (name.includes('frog')) { animalEmoji = '🐸'; animalName = 'Lilypad Frog'; habitatColor = 'from-green-200 to-emerald-100 border-green-400'; }
    else if (name.includes('cow')) { animalEmoji = '🐮'; animalName = 'Meadow Cow'; habitatColor = 'from-lime-200 to-green-100 border-lime-400'; }

    return (
      <div className={`w-full h-full min-h-[160px] rounded-2xl bg-gradient-to-b ${habitatColor} border-4 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
        <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-5xl mb-2">
          {animalEmoji}
        </div>
        <span className="text-sm font-black text-slate-800 bg-white/90 px-3 py-1 rounded-full shadow-xs">
          {animalName} 🐾
        </span>
      </div>
    );
  }

  // 5. Objects / Seek Toys
  if (name.includes('objects/')) {
    let objEmoji = '🧸';
    let objTitle = 'Playroom Toy';

    if (name.includes('duck')) { objEmoji = '🦆'; objTitle = 'Rubber Duck'; }
    else if (name.includes('teddy')) { objEmoji = '🧸'; objTitle = 'Teddy Bear'; }
    else if (name.includes('car')) { objEmoji = '🚗'; objTitle = 'Toy Car'; }
    else if (name.includes('ball')) { objEmoji = '⚽'; objTitle = 'Beach Ball'; }
    else if (name.includes('star')) { objEmoji = '⭐'; objTitle = 'Magic Star'; }
    else if (name.includes('block')) { objEmoji = '🧩'; objTitle = 'ABC Block'; }

    return (
      <div className={`w-full h-full min-h-[160px] rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 border-4 border-purple-300 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
        <div className="w-18 h-18 bg-white rounded-2xl border-2 border-purple-300 shadow-md flex items-center justify-center text-4xl mb-2 animate-bounce">
          {objEmoji}
        </div>
        <span className="text-xs font-black text-purple-950 bg-white px-3 py-1 rounded-full border border-purple-200">
          {objTitle} 🔍
        </span>
      </div>
    );
  }

  // 6. Counting Sets (1 to 10)
  if (name.includes('counting/')) {
    let countNum = 1;
    let countEmoji = '🍎';
    let countLabel = '1 Apple';

    if (name.includes('1_')) { countNum = 1; countEmoji = '🍎'; countLabel = '1 Apple'; }
    else if (name.includes('2_')) { countNum = 2; countEmoji = '🦆'; countLabel = '2 Ducks'; }
    else if (name.includes('3_')) { countNum = 3; countEmoji = '⭐'; countLabel = '3 Stars'; }
    else if (name.includes('4_')) { countNum = 4; countEmoji = '🎈'; countLabel = '4 Balloons'; }
    else if (name.includes('5_')) { countNum = 5; countEmoji = '🚗'; countLabel = '5 Cars'; }
    else if (name.includes('6_')) { countNum = 6; countEmoji = '🌸'; countLabel = '6 Flowers'; }
    else if (name.includes('7_')) { countNum = 7; countEmoji = '🍦'; countLabel = '7 Ice Creams'; }
    else if (name.includes('8_')) { countNum = 8; countEmoji = '🧸'; countLabel = '8 Teddies'; }
    else if (name.includes('9_')) { countNum = 9; countEmoji = '🐟'; countLabel = '9 Fish'; }
    else if (name.includes('10_')) { countNum = 10; countEmoji = '🚀'; countLabel = '10 Rockets'; }

    return (
      <div className={`w-full h-full min-h-[160px] rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 border-4 border-sky-300 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[200px] my-1">
          {Array.from({ length: countNum }).map((_, i) => (
            <span key={i} className="text-2xl hover:scale-125 transition-transform">
              {countEmoji}
            </span>
          ))}
        </div>
        <span className="text-xs font-black text-sky-950 bg-white px-3 py-1 rounded-full border border-sky-200 mt-1 shadow-xs">
          🔢 {countLabel}
        </span>
      </div>
    );
  }

  // 7. Shapes Artwork
  if (name.includes('shapes/')) {
    let shapeEmoji = '🔴';
    let shapeName = 'Circle';
    let shapeColor = 'from-rose-100 to-pink-100 border-rose-400';

    if (name.includes('circle')) { shapeEmoji = '🔴'; shapeName = 'Round Circle'; shapeColor = 'from-rose-100 to-red-100 border-rose-400'; }
    else if (name.includes('square')) { shapeEmoji = '🟦'; shapeName = 'Blue Square'; shapeColor = 'from-blue-100 to-sky-100 border-blue-400'; }
    else if (name.includes('triangle')) { shapeEmoji = '🔺'; shapeName = 'Yellow Triangle'; shapeColor = 'from-amber-100 to-yellow-100 border-amber-400'; }
    else if (name.includes('star')) { shapeEmoji = '⭐'; shapeName = 'Shiny Star'; shapeColor = 'from-yellow-100 to-amber-100 border-amber-400'; }
    else if (name.includes('heart')) { shapeEmoji = '💖'; shapeName = 'Pink Heart'; shapeColor = 'from-pink-100 to-rose-100 border-pink-400'; }
    else if (name.includes('diamond')) { shapeEmoji = '🔷'; shapeName = 'Purple Diamond'; shapeColor = 'from-purple-100 to-indigo-100 border-purple-400'; }

    return (
      <div className={`w-full h-full min-h-[160px] rounded-2xl bg-gradient-to-br ${shapeColor} border-4 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
        <div className="w-18 h-18 bg-white rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-5xl mb-2 animate-spin-slow">
          {shapeEmoji}
        </div>
        <span className="text-xs font-black text-slate-800 bg-white px-3 py-1 rounded-full shadow-xs">
          🔷 {shapeName}
        </span>
      </div>
    );
  }

  // Default Cartoon Fallback Artwork
  return (
    <div className={`w-full h-full min-h-[150px] rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border-4 border-amber-300 p-4 flex flex-col items-center justify-center relative shadow-sm ${className}`}>
      <div className="w-16 h-16 bg-white rounded-full border-2 border-amber-300 shadow-md flex items-center justify-center text-4xl mb-2">
        🎨
      </div>
      <span className="text-xs font-black text-amber-950 bg-white px-3 py-1 rounded-full border border-amber-200">
        {description || assetName}
      </span>
    </div>
  );
};
