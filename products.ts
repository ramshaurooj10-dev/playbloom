import { PremiumProduct } from '../../types/payment';

// Confirmed pricing (2026-11-07):
// - Page 1 Level 1 = 7 activities FREE for all, always offline.
// - Watch ad = unlock the NEXT activity in sequence (free).
// - Rs 500 = any 3 activities, 7 days (was Rs 300).
// - Rs 5,000 = full Page 1 only, 30 days (intentional, NOT permanent).
//   It does NOT include the Preschool Educator Hub (schools only).
// - School Rs 50,000/month = BOTH pages, auto-renewing subscription.
// Abroad (country-specific pricing in Play Console, one Play Billing system):
// USD equivalents are $1.99 / $14.99 / $99. Code carries PKR as base.

export const INDIVIDUAL_PREMIUM_PRODUCTS: PremiumProduct[] = [
  {
    id: 'level_1_free',
    title: 'Level 1: Nursery Explorers (Free Starter)',
    type: 'free_level_1',
    pricePkr: 0,
    priceUsd: 0,
    durationDays: 365,
    description: '100% Free forever starter activities: Letter shapes, first phonics sounds, and colors.',
    isActive: true,
    levelNumber: 1,
  },
  {
    id: 'watch_ad_unlock',
    title: 'Watch Ad (Unlock 1 Activity)',
    type: 'ad_unlock',
    pricePkr: 0,
    priceUsd: 0,
    durationDays: 1,
    description: 'Watch a quick 5-second kid-safe sponsor ad to immediately unlock the NEXT activity in your learning path.',
    isActive: true,
  },
  {
    id: 'playroom_3activities_7d',
    title: '3 Activities Pass (7 Days)',
    type: 'three_activities',
    // PKR 500 in Pakistan; USD $1.99 abroad (Play Console country-specific pricing).
    pricePkr: 500,
    priceUsd: 1.99,
    durationDays: 7,
    description: 'Unlock any 3 premium learning activities of your choice with full access for 7 days.',
    isActive: true,
  },
  {
    id: 'playroom_all_activities_30d',
    title: 'All Activities (Full Page 1 Pass)',
    type: 'all_activities',
    // PKR 5,000 in Pakistan; USD $14.99 abroad (Play Console country-specific pricing).
    // Page 1 ONLY, for 30 days. Does NOT include the Preschool Educator Hub —
    // the Hub is schools-only via the Rs 50,000/month school subscription.
    pricePkr: 5000,
    priceUsd: 14.99,
    durationDays: 30,
    description: 'Full Page 1 access: Unlocks 100% of all PlayBloom activities (Levels 1–6) for 30 days. Preschool Educator Hub not included.',
    isActive: true,
  },
  {
    id: 'playroom_school_monthly',
    title: 'School Subscription (Monthly)',
    type: 'school_monthly',
    // PKR 50,000/month in Pakistan; USD $99/month abroad (Play Console country-specific pricing).
    // Auto-renewing subscription. Unlocks BOTH Page 1 and Page 2 (Educator Hub).
    // Access locks automatically when the subscription is cancelled or expires.
    pricePkr: 50000,
    priceUsd: 99,
    durationDays: 30,
    description: 'School subscription: full Page 1 (all activities) AND full Page 2 Preschool Educator Hub, for the whole school. Auto-renews monthly; cancel anytime in Google Play.',
    isActive: true,
  },
];

export const getCombinedProducts = (): PremiumProduct[] => {
  return [...INDIVIDUAL_PREMIUM_PRODUCTS];
};

export const DEFAULT_PREMIUM_PRODUCTS: PremiumProduct[] = getCombinedProducts();

let cachedSupabaseProducts: PremiumProduct[] = [...DEFAULT_PREMIUM_PRODUCTS];

/**
 * Fetch products — Supabase is deleted (Wave 1). The product catalogue is
 * the static list above; prices are unchanged (500 / 5,000 / 50,000 PKR,
 * USD $1.99 / $14.99 / $99). Kept as an async function so existing callers
 * keep working; it always resolves to the static list.
 */
export const fetchProductsFromSupabase = async (): Promise<PremiumProduct[]> => {
  return [...DEFAULT_PREMIUM_PRODUCTS];
};

export const PREMIUM_PRODUCTS = cachedSupabaseProducts;

export const getProductById = (id: string): PremiumProduct | undefined => {
  return cachedSupabaseProducts.find((p) => p.id === id) || DEFAULT_PREMIUM_PRODUCTS.find((p) => p.id === id);
};

export const getProductByType = (type: string): PremiumProduct | undefined => {
  return cachedSupabaseProducts.find((p) => p.type === type) || DEFAULT_PREMIUM_PRODUCTS.find((p) => p.type === type);
};

export const getProductByLevel = (level: number): PremiumProduct | undefined => {
  const levelId = `level_${level}`;
  return getProductById(levelId);
};
