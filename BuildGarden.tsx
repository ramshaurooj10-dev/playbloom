import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RotateCcw, Home, Sun, Droplets, Shovel, CheckCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { ActivityBottomNav } from './ActivityBottomNav';

interface BuildGardenProps {
  onCollectStar: () => void;
  onNavigateHome?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
  isActivityCompleted?: boolean;
}

// Plant categories and definition
export type PlantCategory = 'flower' | 'fruit' | 'vegetable';
export type PlantColor = 'red' | 'yellow' | 'pink' | 'purple' | 'orange' | 'white' | 'blue' | 'green';

export interface PlantTypeInfo {
  id: string;
  name: string;
  speechName: string;
  category: PlantCategory;
  colorName: PlantColor;
  seedEmoji: string;
  sproutEmoji: string;
  midGrowEmoji: string;
  matureEmoji: string;
  categoryLabel: string;
}

// ==========================================
// 1. EXPANDED PLANT CATALOG (FLOWERS, FRUITS, VEGETABLES)
// ==========================================
export const FLOWERS_POOL: PlantTypeInfo[] = [
  {
    id: 'sunflower',
    name: 'Sunflower',
    speechName: 'yellow sunflower',
    category: 'flower',
    colorName: 'yellow',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌻',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'tulip',
    name: 'Tulip',
    speechName: 'red tulip',
    category: 'flower',
    colorName: 'red',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌷',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'daisy',
    name: 'Daisy',
    speechName: 'white daisy',
    category: 'flower',
    colorName: 'white',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌼',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'rose',
    name: 'Rose',
    speechName: 'red rose',
    category: 'flower',
    colorName: 'red',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌹',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'lily',
    name: 'Lily',
    speechName: 'pink lily',
    category: 'flower',
    colorName: 'pink',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌸',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    speechName: 'purple lavender',
    category: 'flower',
    colorName: 'purple',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🪻',
    categoryLabel: '🌸 Flower',
  },
  {
    id: 'marigold',
    name: 'Marigold',
    speechName: 'orange marigold',
    category: 'flower',
    colorName: 'orange',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🏵️',
    categoryLabel: '🌸 Flower',
  },
];

export const FRUITS_POOL: PlantTypeInfo[] = [
  {
    id: 'strawberry',
    name: 'Strawberry',
    speechName: 'sweet strawberry',
    category: 'fruit',
    colorName: 'red',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🍓',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    speechName: 'big watermelon',
    category: 'fruit',
    colorName: 'green',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🍉',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'apple',
    name: 'Apple',
    speechName: 'red apple',
    category: 'fruit',
    colorName: 'red',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🍎',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'tomato',
    name: 'Tomato',
    speechName: 'juicy tomato',
    category: 'fruit',
    colorName: 'red',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🍅',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    speechName: 'round pumpkin',
    category: 'fruit',
    colorName: 'orange',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🎃',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    speechName: 'ripe blueberries',
    category: 'fruit',
    colorName: 'blue',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🫐',
    categoryLabel: '🍓 Fruit',
  },
  {
    id: 'grapes',
    name: 'Grapes',
    speechName: 'sweet grapes',
    category: 'fruit',
    colorName: 'purple',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🍇',
    categoryLabel: '🍓 Fruit',
  },
];

export const VEGETABLES_POOL: PlantTypeInfo[] = [
  {
    id: 'carrot',
    name: 'Carrot',
    speechName: 'crunchy carrot',
    category: 'vegetable',
    colorName: 'orange',
    seedEmoji: '🫚',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🥕',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    speechName: 'crisp cucumber',
    category: 'vegetable',
    colorName: 'green',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🥒',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    speechName: 'fresh lettuce',
    category: 'vegetable',
    colorName: 'green',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🥬',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    speechName: 'healthy broccoli',
    category: 'vegetable',
    colorName: 'green',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🥦',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'peas',
    name: 'Peas',
    speechName: 'green peas',
    category: 'vegetable',
    colorName: 'green',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🫛',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'corn',
    name: 'Corn',
    speechName: 'sweet yellow corn',
    category: 'vegetable',
    colorName: 'yellow',
    seedEmoji: '🌰',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🌽',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'bell_pepper',
    name: 'Bell Pepper',
    speechName: 'bell pepper',
    category: 'vegetable',
    colorName: 'green',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🫑',
    categoryLabel: '🥕 Vegetable',
  },
  {
    id: 'radish',
    name: 'Radish',
    speechName: 'crisp radish',
    category: 'vegetable',
    colorName: 'red',
    seedEmoji: '🫘',
    sproutEmoji: '🌱',
    midGrowEmoji: '🌿',
    matureEmoji: '🧅',
    categoryLabel: '🥕 Vegetable',
  },
];

// Soil Spot Coordinates across the Garden Bed
export interface SoilSpot {
  id: number;
  xPercent: number;
  yPercent: number;
}

// 6 Natural Garden Bed Soil Locations
export const GARDEN_SOIL_SPOTS: SoilSpot[] = [
  { id: 0, xPercent: 18, yPercent: 62 },
  { id: 1, xPercent: 38, yPercent: 54 },
  { id: 2, xPercent: 62, yPercent: 54 },
  { id: 3, xPercent: 82, yPercent: 62 },
  { id: 4, xPercent: 28, yPercent: 78 },
  { id: 5, xPercent: 72, yPercent: 78 },
];

// Growth Stages for Garden Bed Spots
export type GrowthStage = 'empty' | 'seeded' | 'soil_covered' | 'watered' | 'growing' | 'mature';

export interface PlantedSpotState {
  spotId: number;
  plant: PlantTypeInfo | null;
  stage: GrowthStage;
}

// Explicit Independent State per Active Plant Instance
export interface CurrentPlantState {
  plant: PlantTypeInfo | null;
  spotId: number | null;
  seedPlaced: boolean;
  soilAdded: boolean;
  watered: boolean;
  sunlightGiven: boolean;
  grown: boolean;
}

// Challenge Goal Definition
export interface GardenChallenge {
  title: string;
  speechPrompt: string;
  targetCount: number;
}

// Helper: Shuffle Array
function shuffleArray<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = c[i];
    c[i] = c[j];
    c[j] = tmp;
  }
  return c;
}

export const BuildGarden: React.FC<BuildGardenProps> = ({
  onCollectStar,
  onNavigateHome,
  onNavigateNext,
  onNavigatePrev,
  isActivityCompleted,
}) => {
  // Playthrough counter
  const [playthrough, setPlaythrough] = useState<number>(1);

  // Anti-repetition tracker: store previous round's plant IDs
  const lastRoundPlantIdsRef = useRef<string[]>([]);

  // Action debouncing / anti-multi-tap lock
  const isActionInProgressRef = useRef<boolean>(false);

  // Current Challenge Info
  const [challenge, setChallenge] = useState<GardenChallenge>({
    title: "Let's plant 4 plants!",
    speechPrompt: "Let's build a beautiful garden! Choose a seed to begin!",
    targetCount: 4,
  });

  // Available Seed Choices for this round (Mix of Flowers + Fruits + Vegetables)
  const [seedChoices, setSeedChoices] = useState<PlantTypeInfo[]>([]);

  // Garden Spots State (6 spots on the bed)
  const [spotsState, setSpotsState] = useState<PlantedSpotState[]>(
    GARDEN_SOIL_SPOTS.map((s) => ({ spotId: s.id, plant: null, stage: 'empty' }))
  );

  // EXPLICIT INDEPENDENT CURRENT PLANT STATE MACHINE
  const [currentPlant, setCurrentPlant] = useState<CurrentPlantState>({
    plant: null,
    spotId: null,
    seedPlaced: false,
    soilAdded: false,
    watered: false,
    sunlightGiven: false,
    grown: false,
  });

  // Garden Completed Flag
  const [isGardenComplete, setIsGardenComplete] = useState<boolean>(false);

  // Animation triggers
  const [animatingScoop, setAnimatingScoop] = useState<boolean>(false);
  const [animatingWater, setAnimatingWater] = useState<boolean>(false);
  const [animatingSunGlow, setAnimatingSunGlow] = useState<boolean>(false);

  // Number of mature plants in current garden
  const matureCount = spotsState.filter((s) => s.stage === 'mature').length;

  // =================================================================
  // DERIVED STRICT ONE-WAY STEPS FROM CURRENT PLANT STATE
  // =================================================================
  // Step 1: Choose Seed -> active when no plant is chosen yet
  const isChoosingSeed = !isGardenComplete && currentPlant.plant === null;

  // Step 2: Plant Seed -> active when plant is chosen, but seed not yet placed in spot
  const isPlantingSeed =
    !isGardenComplete && currentPlant.plant !== null && !currentPlant.seedPlaced;

  // Step 3: Add Soil -> active ONLY when seed is placed and soil is not yet added
  const isAddingSoil =
    !isGardenComplete &&
    currentPlant.seedPlaced &&
    !currentPlant.soilAdded;

  // Step 4: Water -> active ONLY when soil is added and water is not yet added
  const isWatering =
    !isGardenComplete &&
    currentPlant.seedPlaced &&
    currentPlant.soilAdded &&
    !currentPlant.watered;

  // Step 5: Sunlight -> active ONLY when water is completed and sunlight is not yet given
  const isSunlightActive =
    !isGardenComplete &&
    currentPlant.seedPlaced &&
    currentPlant.soilAdded &&
    currentPlant.watered &&
    !currentPlant.sunlightGiven;

  // Step 6: Growing -> active ONLY when sunlight has been given, before growth completes
  const isGrowing =
    !isGardenComplete &&
    currentPlant.sunlightGiven &&
    !currentPlant.grown;

  // =================================================================
  // GENERATE FRESH RANDOM GARDEN CHALLENGE (WITH ANTI-REPETITION)
  // =================================================================
  const generateNewGarden = useCallback((roundNumber: number) => {
    isActionInProgressRef.current = false;

    // 1. Reset all states cleanly
    setSpotsState(GARDEN_SOIL_SPOTS.map((s) => ({ spotId: s.id, plant: null, stage: 'empty' })));
    setCurrentPlant({
      plant: null,
      spotId: null,
      seedPlaced: false,
      soilAdded: false,
      watered: false,
      sunlightGiven: false,
      grown: false,
    });
    setIsGardenComplete(false);
    setAnimatingScoop(false);
    setAnimatingWater(false);
    setAnimatingSunGlow(false);

    // 2. Determine target count for this round (Varies: 3, 4, or 5 plants)
    const targetCounts = [4, 5, 3, 4, 5];
    const targetCount = targetCounts[(roundNumber - 1) % targetCounts.length];

    // 3. Challenge Prompts
    const challenges: GardenChallenge[] = [
      {
        title: `Plant ${targetCount} flowers and vegetables!`,
        speechPrompt: `Let's build a beautiful garden! Choose a seed to begin!`,
        targetCount,
      },
      {
        title: `Plant ${targetCount} sweet fruits and veggies!`,
        speechPrompt: `Let's plant some fresh fruits and vegetables! Choose your first seed!`,
        targetCount,
      },
      {
        title: `Plant ${targetCount} colorful flowers and fruits!`,
        speechPrompt: `Let's grow colorful plants together! Pick a seed to start!`,
        targetCount,
      },
      {
        title: `Plant ${targetCount} lovely garden plants!`,
        speechPrompt: `Welcome to your sunny garden! Choose a seed to plant!`,
        targetCount,
      },
    ];

    const currentChallenge = challenges[(roundNumber - 1) % challenges.length];
    setChallenge(currentChallenge);

    // 4. Select plants from FLOWERS + FRUITS + VEGETABLES with anti-repetition
    let selectedCombo: PlantTypeInfo[] = [];
    let attempts = 0;

    while (attempts < 10) {
      attempts++;
      const shuffledFlowers = shuffleArray(FLOWERS_POOL);
      const shuffledFruits = shuffleArray(FRUITS_POOL);
      const shuffledVeggies = shuffleArray(VEGETABLES_POOL);

      // Mix: 2 Flowers, 1 Fruit, 1 Veggie OR 1 Flower, 1 Fruit, 2 Veggies
      const mixType = roundNumber % 2 === 0;
      const candidate = mixType
        ? [shuffledFlowers[0], shuffledFlowers[1], shuffledFruits[0], shuffledVeggies[0]]
        : [shuffledFlowers[0], shuffledFruits[0], shuffledVeggies[0], shuffledVeggies[1]];

      const candidateIds = candidate.map((p) => p.id);
      const previousIds = lastRoundPlantIdsRef.current;

      const overlap = candidateIds.filter((id) => previousIds.includes(id)).length;
      if (overlap <= 2 || attempts >= 8) {
        selectedCombo = shuffleArray(candidate);
        lastRoundPlantIdsRef.current = candidateIds;
        break;
      }
    }

    setSeedChoices(selectedCombo);

    // Welcome Voice Prompt
    setTimeout(() => {
      soundManager.speak(currentChallenge.speechPrompt);
    }, 350);
  }, []);

  // Initialize on mount
  useEffect(() => {
    generateNewGarden(playthrough);
  }, [generateNewGarden, playthrough]);

  // Voice instruction helper for repeat button
  const speakCurrentInstruction = useCallback(() => {
    if (isChoosingSeed) {
      soundManager.speak('Choose a seed from the circles below to plant in our garden!');
    } else if (isPlantingSeed && currentPlant.plant) {
      soundManager.speak(`Where should we plant the ${currentPlant.plant.name}? Tap an empty soil spot!`);
    } else if (isAddingSoil) {
      soundManager.speak('Cover the seed with soft soil! Tap the garden scoop!');
    } else if (isWatering) {
      soundManager.speak('Now give the seed some fresh water! Tap the watering can!');
    } else if (isSunlightActive) {
      soundManager.speak('Plants need warm sunlight to grow! Tap the bright sun in the sky!');
    } else if (isGrowing) {
      soundManager.speak('Look! Your plant is growing!');
    } else if (isGardenComplete) {
      soundManager.speak('Wow! You built a beautiful garden! Plants need soil, water and sunlight to grow!');
    }
  }, [isChoosingSeed, isPlantingSeed, isAddingSoil, isWatering, isSunlightActive, isGrowing, isGardenComplete, currentPlant.plant]);

  // Step-by-step previous navigation handler
  const handleInternalPrev = () => {
    soundManager.playPop();
    if (isGardenComplete) {
      setIsGardenComplete(false);
    } else if (currentPlant.plant !== null) {
      if (currentPlant.sunlightGiven) {
        setCurrentPlant((prev) => ({ ...prev, sunlightGiven: false, watered: true }));
      } else if (currentPlant.watered) {
        setCurrentPlant((prev) => ({ ...prev, watered: false, soilAdded: true }));
        if (currentPlant.spotId !== null) {
          setSpotsState((prev) =>
            prev.map((s) => (s.spotId === currentPlant.spotId ? { ...s, stage: 'soil_covered' } : s))
          );
        }
      } else if (currentPlant.soilAdded) {
        setCurrentPlant((prev) => ({ ...prev, soilAdded: false, seedPlaced: true }));
        if (currentPlant.spotId !== null) {
          setSpotsState((prev) =>
            prev.map((s) => (s.spotId === currentPlant.spotId ? { ...s, stage: 'seeded' } : s))
          );
        }
      } else if (currentPlant.seedPlaced) {
        if (currentPlant.spotId !== null) {
          setSpotsState((prev) =>
            prev.map((s) => (s.spotId === currentPlant.spotId ? { ...s, stage: 'empty', plant: null } : s))
          );
        }
        setCurrentPlant((prev) => ({ ...prev, seedPlaced: false, spotId: null }));
      } else {
        setCurrentPlant({
          plant: null,
          spotId: null,
          seedPlaced: false,
          soilAdded: false,
          watered: false,
          sunlightGiven: false,
          grown: false,
        });
      }
    } else {
      const matureSpots = spotsState.filter((s) => s.stage === 'mature');
      if (matureSpots.length > 0) {
        const lastMature = matureSpots[matureSpots.length - 1];
        setSpotsState((prev) =>
          prev.map((s) => (s.spotId === lastMature.spotId ? { ...s, stage: 'empty', plant: null } : s))
        );
        setCurrentPlant({
          plant: lastMature.plant,
          spotId: lastMature.spotId,
          seedPlaced: true,
          soilAdded: true,
          watered: true,
          sunlightGiven: false,
          grown: false,
        });
      } else {
        if (onNavigatePrev) {
          onNavigatePrev();
        }
      }
    }
  };

  // =================================================================
  // STEP 1: CHOOSE SEED
  // =================================================================
  const handleSelectSeed = (plant: PlantTypeInfo) => {
    if (!isChoosingSeed || isActionInProgressRef.current) return;

    soundManager.playPop();

    // Start clean plant state for this specific plant
    setCurrentPlant({
      plant,
      spotId: null,
      seedPlaced: false,
      soilAdded: false,
      watered: false,
      sunlightGiven: false,
      grown: false,
    });

    soundManager.speak(`You picked ${plant.name}! Tap an empty soil spot to plant it!`);
  };

  // =================================================================
  // STEP 2: PLANT SEED (Tap empty soil spot)
  // =================================================================
  const handleSelectSoilSpot = (spotId: number) => {
    if (!isPlantingSeed || !currentPlant.plant || isActionInProgressRef.current) return;

    const spot = spotsState.find((s) => s.spotId === spotId);
    if (!spot || spot.stage !== 'empty') {
      soundManager.speak('That spot already has a plant! Choose an empty soil spot!');
      return;
    }

    soundManager.playPop();

    // Mark spot as seeded in the garden
    setSpotsState((prev) =>
      prev.map((s) => (s.spotId === spotId ? { ...s, plant: currentPlant.plant, stage: 'seeded' } : s))
    );

    // Update current plant state: seedPlaced = true
    setCurrentPlant((prev) => ({
      ...prev,
      spotId,
      seedPlaced: true,
      soilAdded: false,
      watered: false,
      sunlightGiven: false,
      grown: false,
    }));

    soundManager.speak('Great! The seed is in the soil! Cover it with soil using the scoop!');
  };

  // =================================================================
  // STEP 3: COVER WITH SOIL SCOOP (SHOWN EXACTLY ONCE PER SEED)
  // =================================================================
  const handleAddSoil = () => {
    if (!isAddingSoil || currentPlant.spotId === null || isActionInProgressRef.current) return;
    isActionInProgressRef.current = true;

    soundManager.playPop();
    setAnimatingScoop(true);

    const targetSpotId = currentPlant.spotId;

    // Immediately advance plant state to soilAdded = true so scoop bar disappears instantly and permanently!
    setCurrentPlant((prev) => ({
      ...prev,
      soilAdded: true,
    }));

    // Update spot state to covered
    setSpotsState((prev) =>
      prev.map((s) => (s.spotId === targetSpotId ? { ...s, stage: 'soil_covered' } : s))
    );

    soundManager.speak('Good job! Now give the seed some water! Tap the watering can!');

    setTimeout(() => {
      soundManager.playSuccess();
      setAnimatingScoop(false);
      isActionInProgressRef.current = false;
    }, 500);
  };

  // =================================================================
  // STEP 4: WATER THE SEED (SHOWN EXACTLY ONCE PER SEED)
  // =================================================================
  const handleWaterPlant = () => {
    if (!isWatering || currentPlant.spotId === null || isActionInProgressRef.current) return;
    isActionInProgressRef.current = true;

    soundManager.playStarCatch();
    setAnimatingWater(true);

    const targetSpotId = currentPlant.spotId;

    // Immediately advance plant state to watered = true so watering bar disappears instantly and permanently!
    setCurrentPlant((prev) => ({
      ...prev,
      watered: true,
    }));

    // Update spot state to watered/sprouted
    setSpotsState((prev) =>
      prev.map((s) => (s.spotId === targetSpotId ? { ...s, stage: 'watered' } : s))
    );

    soundManager.speak('Look! It is starting to sprout! Plants need warm sunlight to grow! Tap the sun!');

    setTimeout(() => {
      soundManager.playSuccess();
      setAnimatingWater(false);
      isActionInProgressRef.current = false;
    }, 700);
  };

  // =================================================================
  // STEP 5 & 6: SUNLIGHT & PLANT GROWTH
  // =================================================================
  const handleTapSun = () => {
    // Strictly allowed ONLY when sunlight is active for the current plant
    if (!isSunlightActive || currentPlant.spotId === null || isActionInProgressRef.current) return;
    isActionInProgressRef.current = true;

    soundManager.playSuccess();
    setAnimatingSunGlow(true);

    const plantedInfo = currentPlant.plant;
    const targetSpotId = currentPlant.spotId;

    // Immediately mark sunlightGiven = true so sun highlight disappears instantly
    setCurrentPlant((prev) => ({
      ...prev,
      sunlightGiven: true,
    }));

    // Growth sequence animation (🌱 -> 🌿 -> mature bloom)
    setTimeout(() => {
      soundManager.playCelebration();
      soundManager.playStarCatch();

      // Mark spot as mature in garden
      setSpotsState((prev) =>
        prev.map((s) => (s.spotId === targetSpotId ? { ...s, stage: 'mature' } : s))
      );

      setAnimatingSunGlow(false);
      isActionInProgressRef.current = false;

      if (plantedInfo) {
        soundManager.speak(`Wow! Your ${plantedInfo.name} grew into a beautiful plant!`);
      }

      const newMatureCount = spotsState.filter((s) => s.stage === 'mature').length + 1;

      // Check if full garden challenge is reached
      if (newMatureCount >= challenge.targetCount) {
        setTimeout(() => {
          setIsGardenComplete(true);
          onCollectStar();
          soundManager.playCelebration();
          soundManager.speak(
            'Wow! You built a beautiful garden! Plants need soil, water and sunlight to grow!'
          );
        }, 1200);
      } else {
        // Start next plant with a completely fresh state
        setTimeout(() => {
          // Reset current plant state completely for Plant N+1
          setCurrentPlant({
            plant: null,
            spotId: null,
            seedPlaced: false,
            soilAdded: false,
            watered: false,
            sunlightGiven: false,
            grown: false,
          });

          soundManager.speak(
            `Let's plant another one! We have ${newMatureCount} of ${challenge.targetCount} plants! Choose your next seed!`
          );
        }, 1200);
      }
    }, 1100);
  };

  // =================================================================
  // REPLAY: Plant a Brand New Garden Challenge
  // =================================================================
  const handleReplay = () => {
    soundManager.playPop();
    const nextRound = playthrough + 1;
    setPlaythrough(nextRound);
    generateNewGarden(nextRound);
  };

  // Active Spot Coordinate Reference
  const activeSpotObj = GARDEN_SOIL_SPOTS.find((s) => s.id === currentPlant.spotId);

  return (
    <div
      id="build-garden-activity"
      className="w-full max-w-5xl mx-auto flex flex-col gap-3 pb-8 select-none"
    >
      {/* 1. TOP HEADER & INSTRUCTION */}
      <div className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-3xl p-3 sm:p-4 shadow-lg border-4 border-green-700 text-white flex items-center justify-between gap-2 sm:gap-4">
        {/* Home Button */}
        <button
          id="garden-home-btn"
          onClick={onNavigateHome}
          aria-label="Back to Home"
          className="bg-black/25 hover:bg-black/40 active:scale-95 text-white px-3 sm:px-4 py-2 rounded-2xl border-2 border-white/30 shadow-sm transition-transform flex items-center gap-1.5 font-black text-sm cursor-pointer shrink-0"
        >
          <Home className="w-5 h-5 text-amber-200" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Title & One-Way Step Prompt */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white uppercase drop-shadow-sm flex items-center gap-2">
              <span>🌻</span> BUILD A GARDEN <span>🌱</span>
            </h1>
            <button
              id="garden-repeat-voice-btn"
              onClick={speakCurrentInstruction}
              aria-label="Hear Instruction"
              className="bg-amber-300 hover:bg-amber-200 active:scale-90 text-amber-950 p-1.5 sm:p-2 rounded-xl border border-white shadow-sm transition-transform cursor-pointer"
              title="Hear voice prompt"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-bold text-emerald-100 flex items-center gap-1.5 mt-0.5">
            {isChoosingSeed && 'Step 1: Choose a seed from the circles below'}
            {isPlantingSeed && `Step 2: Tap an empty soil spot for your ${currentPlant.plant?.name || 'seed'}`}
            {isAddingSoil && 'Step 3: Tap the scoop to cover the seed with soil'}
            {isWatering && 'Step 4: Tap the watering can to water your plant'}
            {isSunlightActive && 'Step 5: Tap the bright sun in the sky! ☀️'}
            {isGrowing && 'Watch your plant grow and bloom!'}
            {isGardenComplete && 'Your garden is blooming and full of life!'}
          </p>
        </div>

        {/* Progress Counter Pill (e.g. 🌱 2 / 4) */}
        <div className="bg-black/30 px-3.5 py-1.5 rounded-2xl border border-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
          <span className="text-amber-300">🌱</span>
          <span>
            {matureCount} / {challenge.targetCount}
          </span>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE GARDEN VIEWPORT */}
      <div
        id="garden-scene-stage"
        className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[380px] sm:min-h-[440px] max-h-[580px] rounded-3xl overflow-hidden border-4 border-emerald-600 shadow-2xl bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 select-none"
      >
        {/* Layer A: Sky Backdrop & Drifting Clouds */}
        <motion.div
          animate={{ x: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 left-10 text-5xl sm:text-6xl opacity-80 pointer-events-none select-none z-1"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-1/3 text-4xl sm:text-5xl opacity-70 pointer-events-none select-none z-1"
        >
          ☁️
        </motion.div>

        {/* Interactive Sun in Top Right: ACTIVE ONLY ON STEP 5 (SUNLIGHT) */}
        <motion.button
          id="garden-sun-btn"
          onClick={handleTapSun}
          disabled={!isSunlightActive}
          whileHover={isSunlightActive ? { scale: 1.12 } : {}}
          whileTap={isSunlightActive ? { scale: 0.92 } : {}}
          animate={{
            rotate: [0, 8, -8, 0],
            scale: isSunlightActive ? [1, 1.18, 1] : 1,
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={`absolute top-4 right-6 sm:top-6 sm:right-10 z-20 flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ${
            isSunlightActive
              ? 'cursor-pointer ring-8 ring-amber-300/90 bg-amber-200/60 drop-shadow-[0_0_30px_rgba(250,204,21,1)] animate-pulse'
              : 'opacity-85 pointer-events-none'
          }`}
          title={isSunlightActive ? 'Tap for Sunlight!' : 'Sun'}
          aria-label="Sunlight"
        >
          <span className="text-6xl sm:text-7xl drop-shadow-md">☀️</span>
          {isSunlightActive && (
            <motion.span
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-400 text-amber-950 text-xs sm:text-sm font-black px-3 py-1 rounded-full border-2 border-white shadow-xl mt-1 tracking-wide flex items-center gap-1"
            >
              <span>Tap the Sun!</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-950 inline" />
            </motion.span>
          )}
        </motion.button>

        {/* Sunlight Radiance Glow Effect across Garden */}
        <AnimatePresence>
          {animatingSunGlow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.9, 0.5, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-b from-yellow-300/60 via-amber-200/40 to-transparent mix-blend-screen flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <Sun className="w-24 h-24 text-amber-400 animate-spin" />
                <span className="text-2xl font-black text-amber-900 bg-white/90 px-4 py-1.5 rounded-2xl border-2 border-amber-400 shadow-xl">
                  Warm Sunlight! ☀️
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer B: Trees and Fence Background Props */}
        <div className="absolute top-16 left-4 text-7xl sm:text-8xl opacity-90 pointer-events-none select-none z-2">
          🌳
        </div>
        <div className="absolute top-20 right-28 text-7xl sm:text-8xl opacity-85 pointer-events-none select-none z-2">
          🌳
        </div>
        <div className="absolute top-36 left-0 right-0 h-8 flex justify-around opacity-40 pointer-events-none text-2xl z-2">
          <span>🪵</span>
          <span>🪵</span>
          <span>🪵</span>
          <span>🪵</span>
          <span>🪵</span>
          <span>🪵</span>
        </div>

        {/* Layer C: Rolling Green Garden Hills and Rich Dark Soil Bed */}
        <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-emerald-600 via-green-500 to-emerald-400 rounded-t-[3rem] border-t-4 border-emerald-400/80 z-4 shadow-inner" />

        {/* Main Organic Rich Dark Soil Bed Mound */}
        <div className="absolute bottom-4 left-6 right-6 sm:left-12 sm:right-12 h-[52%] bg-gradient-to-t from-[#451A03] via-[#713F12] to-[#854D0E] rounded-[2.5rem] border-4 border-[#371904] shadow-2xl z-6 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-2 left-10 text-xs text-amber-200/50 font-bold">🍂</div>
          <div className="absolute top-6 right-16 text-xs text-amber-200/50 font-bold">🌱</div>
          <div className="absolute bottom-4 left-1/3 text-xs text-amber-200/40 font-bold">🪨</div>
          <div className="absolute bottom-6 right-1/4 text-xs text-amber-200/40 font-bold">🪨</div>
        </div>

        {/* Layer D: Soil Planting Spots (6 Spots) */}
        {GARDEN_SOIL_SPOTS.map((spot) => {
          const spotState = spotsState.find((s) => s.spotId === spot.id);
          const isPlanted = spotState && spotState.stage !== 'empty';
          const isMature = spotState?.stage === 'mature';
          const isThisSpotActiveForSoil = isAddingSoil && currentPlant.spotId === spot.id;
          const isThisSpotActiveForWater = isWatering && currentPlant.spotId === spot.id;

          const handleSpotClick = () => {
            if (isPlantingSeed && !isPlanted) {
              handleSelectSoilSpot(spot.id);
            } else if (isThisSpotActiveForSoil) {
              handleAddSoil();
            } else if (isThisSpotActiveForWater) {
              handleWaterPlant();
            }
          };

          return (
            <div
              key={spot.id}
              style={{
                left: `${spot.xPercent}%`,
                top: `${spot.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 flex flex-col items-center justify-center select-none"
            >
              {/* Soil Spot Crater Button */}
              <motion.button
                id={`garden-soil-spot-${spot.id}`}
                onClick={handleSpotClick}
                disabled={(!isPlantingSeed || isPlanted) && !isThisSpotActiveForSoil && !isThisSpotActiveForWater}
                whileHover={(isPlantingSeed && !isPlanted) || isThisSpotActiveForSoil || isThisSpotActiveForWater ? { scale: 1.12 } : {}}
                whileTap={(isPlantingSeed && !isPlanted) || isThisSpotActiveForSoil || isThisSpotActiveForWater ? { scale: 0.9 } : {}}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  !isPlanted
                    ? isPlantingSeed
                      ? 'border-3 border-dashed border-yellow-300 bg-amber-900/60 shadow-[0_0_20px_rgba(253,224,71,0.6)] animate-pulse cursor-pointer'
                      : 'border-2 border-amber-800/60 bg-amber-950/40 cursor-default'
                    : isThisSpotActiveForSoil || isThisSpotActiveForWater
                    ? 'border-2 border-dashed border-sky-300 bg-amber-900/60 shadow-[0_0_15px_rgba(125,211,252,0.6)] cursor-pointer'
                    : 'border border-amber-900/40 bg-transparent cursor-default'
                }`}
                title={!isPlanted ? 'Empty Soil Spot' : spotState?.plant?.name}
                aria-label={`Soil spot ${spot.id + 1}`}
              >
                {/* Empty Spot Guidance Callout */}
                {!isPlanted && (
                  <div className="flex flex-col items-center">
                    <span className="text-xl sm:text-2xl opacity-70">🕳️</span>
                    {isPlantingSeed && (
                      <span className="text-[10px] sm:text-xs font-black text-amber-200 bg-amber-950/80 px-1.5 py-0.2 rounded-full border border-amber-300 -mt-1 shadow-xs">
                        Plant Here!
                      </span>
                    )}
                  </div>
                )}

                {/* State 1: Seed in Soil */}
                {spotState?.stage === 'seeded' && (
                  <motion.div
                    initial={{ scale: 0, y: -20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-2xl sm:text-3xl drop-shadow-md">
                      {spotState.plant?.seedEmoji}
                    </span>
                    <span className="text-[9px] font-black text-amber-100 bg-amber-950/70 px-1 rounded-sm -mt-1">
                      Seed
                    </span>
                  </motion.div>
                )}

                {/* State 2: Covered / Scooped with Soil */}
                {spotState?.stage === 'soil_covered' && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-2xl sm:text-3xl drop-shadow-md">🪵</span>
                    <span className="text-[9px] font-black text-amber-100 bg-amber-950/70 px-1 rounded-sm -mt-1">
                      Covered
                    </span>
                  </motion.div>
                )}

                {/* State 3: Watered / Sprouting Seedling */}
                {spotState?.stage === 'watered' && (
                  <motion.div
                    initial={{ scale: 0.5, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-md">🌱</span>
                    <span className="text-[9px] font-black text-emerald-200 bg-emerald-950/80 px-1.5 rounded-sm -mt-1">
                      Sprout!
                    </span>
                  </motion.div>
                )}

                {/* State 4: Mature Blooming Plant or Vegetable */}
                {isMature && (
                  <motion.div
                    initial={{ scale: 0.2, y: 20 }}
                    animate={{
                      scale: [1, 1.06, 1],
                      rotate: [-2, 2, -2],
                    }}
                    transition={{
                      scale: { duration: 0.4 },
                      rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    className="flex flex-col items-center z-20 -mt-6 sm:-mt-8"
                  >
                    <span className="text-5xl sm:text-6xl drop-shadow-lg filter">
                      {spotState?.plant?.matureEmoji}
                    </span>
                    <div className="bg-white/95 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 shadow-md text-[10px] sm:text-xs font-black tracking-wide -mt-1 flex items-center gap-1">
                      <span>{spotState?.plant?.name}</span>
                      <CheckCircle className="w-3 h-3 text-green-600 inline" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            </div>
          );
        })}

        {/* Layer E: Tool Action Buttons (STRICTLY ONE ACTIVE AT A TIME, SHOWN ONCE PER SEED) */}
        {/* 1. Garden Scoop Tool: ACTIVE ONLY ON STEP 3 (ADD SOIL) */}
        <AnimatePresence>
          {isAddingSoil && activeSpotObj && (
            <motion.button
              id="garden-scoop-tool-btn"
              onClick={handleAddSoil}
              initial={{ scale: 0, y: -15, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                y: [-6, 0, -6],
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: 1.2, repeat: Infinity },
                y: { duration: 1.2, repeat: Infinity },
              }}
              style={{
                left: `${activeSpotObj.xPercent}%`,
                top: `${activeSpotObj.yPercent - 18}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-30 bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 px-3.5 py-2 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 cursor-pointer font-black text-xs sm:text-sm whitespace-nowrap"
              title="Cover with soil"
              aria-label="Cover with soil"
            >
              <Shovel className="w-5 h-5 text-amber-950" />
              <span>Cover with Soil! 🪵</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* 2. Watering Can Tool: ACTIVE ONLY ON STEP 4 (WATER) */}
        <AnimatePresence>
          {isWatering && activeSpotObj && (
            <motion.button
              id="garden-water-tool-btn"
              onClick={handleWaterPlant}
              initial={{ scale: 0, y: -15, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                y: [-6, 0, -6],
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { duration: 1.2, repeat: Infinity },
                y: { duration: 1.2, repeat: Infinity },
              }}
              style={{
                left: `${activeSpotObj.xPercent}%`,
                top: `${activeSpotObj.yPercent - 18}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-30 bg-sky-400 hover:bg-sky-300 active:scale-95 text-sky-950 px-3.5 py-2 rounded-2xl border-2 border-white shadow-2xl flex items-center gap-2 cursor-pointer font-black text-xs sm:text-sm whitespace-nowrap"
              title="Water the seed"
              aria-label="Water the seed"
            >
              <Droplets className="w-5 h-5 text-sky-950" />
              <span>Water the Seed! 💧</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Layer F: Animated Water Droplets Shower when Watering */}
        <AnimatePresence>
          {animatingWater && activeSpotObj && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                left: `${activeSpotObj.xPercent}%`,
                top: `${activeSpotObj.yPercent - 20}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-40 pointer-events-none flex flex-col items-center"
            >
              <span className="text-5xl animate-bounce">🪣</span>
              <div className="flex gap-2 text-2xl text-sky-400 animate-pulse mt-1">
                <span>💧</span>
                <span>💧</span>
                <span>💧</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer G: Completed Garden Atmosphere (Butterflies & Bees) */}
        {isGardenComplete && (
          <>
            <motion.div
              animate={{
                x: [20, 140, 240, 100, 20],
                y: [40, 90, 30, 80, 40],
                rotate: [0, 15, -10, 20, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute text-4xl sm:text-5xl z-25 pointer-events-none"
            >
              🦋
            </motion.div>

            <motion.div
              animate={{
                x: [340, 220, 120, 260, 340],
                y: [60, 20, 80, 30, 60],
                rotate: [0, -15, 10, -20, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute text-3xl sm:text-4xl z-25 pointer-events-none"
            >
              🦋
            </motion.div>

            <motion.div
              animate={{
                x: [80, 200, 300, 150, 80],
                y: [120, 80, 140, 100, 120],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute text-3xl sm:text-4xl z-25 pointer-events-none"
            >
              🐝
            </motion.div>
          </>
        )}
      </div>

      {/* 3. BOTTOM CONTROL TRAY: ONLY SHOWN DURING STEP 1 (CHOOSE SEED) WITH DISTINCT CIRCLE BUTTONS */}
      <AnimatePresence mode="wait">
        {isChoosingSeed && (
          <motion.div
            key="seed-tray"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full bg-white/95 rounded-3xl p-3 sm:p-4 border-3 border-emerald-300 shadow-lg flex flex-col items-center gap-2.5"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌱</span> Choose a Seed to Plant:
              </span>
            </div>

            {/* SEED SELECTION DISPLAYED IN PURE CIRCLE BUBBLES */}
            <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-8 py-2">
              {seedChoices.map((plant) => (
                <button
                  key={plant.id}
                  id={`seed-choice-${plant.id}`}
                  onClick={() => handleSelectSeed(plant)}
                  className="group flex flex-col items-center gap-2 cursor-pointer transition-all select-none active:scale-95 hover:scale-105"
                  aria-label={`Seed for ${plant.name}`}
                >
                  {/* Circular Seed Bubble Button */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-amber-50 via-white to-emerald-50 border-4 border-emerald-400 group-hover:border-emerald-500 shadow-lg group-hover:shadow-2xl flex flex-col items-center justify-center relative transition-all ring-4 ring-emerald-100">
                    <span className="text-4xl sm:text-5xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                      {plant.matureEmoji}
                    </span>
                    <span className="absolute -bottom-1 -right-1 bg-amber-200 border-2 border-amber-400 text-sm px-1.5 py-0.5 rounded-full shadow-sm">
                      {plant.seedEmoji}
                    </span>
                  </div>

                  {/* Seed Label */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-black text-emerald-950">
                      {plant.name}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {plant.categoryLabel}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. COMPLETION REPLAY BAR */}
        {isGardenComplete && (
          <motion.div
            key="completion-bar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl p-4 sm:p-5 border-4 border-emerald-600 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl border border-white/40">
                🌟
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black">
                  You Built a Beautiful Garden! 🌻
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  Plants need soil, fresh water and warm sunlight to grow.
                </p>
              </div>
            </div>

            {/* Replay Button */}
            <button
              id="garden-replay-btn"
              onClick={handleReplay}
              className="w-full sm:w-auto bg-amber-300 hover:bg-amber-200 active:scale-95 text-amber-950 px-6 py-3 rounded-2xl font-black text-sm sm:text-base border-2 border-white shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform shrink-0"
            >
              <RotateCcw className="w-5 h-5 text-amber-950" />
              <span>Plant a New Garden!</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BOTTOM NAVIGATION */}
      <div className="w-full flex justify-center mt-3">
        <ActivityBottomNav
          onNavigatePrev={handleInternalPrev}
          onNavigateHome={onNavigateHome}
          onNavigateNext={onNavigateNext}
          isNextUnlocked={isGardenComplete || Boolean(isActivityCompleted)}
        />
      </div>
    </div>
  );
};
