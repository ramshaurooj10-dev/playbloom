/**
 * School pricing — rewritten 2026-11-07.
 *
 * There is exactly ONE school product now: the Google Play subscription
 * `playroom_school_monthly` — Rs 50,000/month (PKR base, $99 abroad),
 * 30-day billing period, auto-renewing via Google Play, unlocking
 * Page 1 + Page 2 (Educator Hub).
 *
 * REMOVED: the old 25,000 / 70,000 / 120,000 / 220,000 license tiers,
 * the admin tier editor, and all Supabase sync. Prices live in
 * Play Console, not here — this file only describes the single product
 * for UI code that still reads a pricing config.
 */

export interface SchoolTierConfig {
  id: string; // 'school_monthly'
  durationMonths: number; // 1
  label: string; // '1 Month'
  title: string; // 'School Monthly Subscription'
  description: string;
  pricePkr: number;
  priceUsd: number;
  maxDevices: number;
  page1Access: boolean;
  page2Access: boolean;
  isActive: boolean;
}

export interface SchoolPricingConfig {
  tiers: SchoolTierConfig[];
  updatedAt: string;
}

export const SCHOOL_SUBSCRIPTION_TIER: SchoolTierConfig = {
  id: 'school_monthly',
  durationMonths: 1,
  label: '1 Month',
  title: 'School Monthly Subscription',
  description:
    'Monthly school subscription via Google Play: full access to Page 1 activities and the Preschool Educator Hub (Page 2) for 30 days. Auto-renews until cancelled in Google Play.',
  pricePkr: 50000,
  priceUsd: 99,
  maxDevices: 15,
  page1Access: true,
  page2Access: true,
  isActive: true,
};

export const DEFAULT_SCHOOL_TIERS: SchoolTierConfig[] = [SCHOOL_SUBSCRIPTION_TIER];

const STORAGE_KEY_SCHOOL_PRICING = 'playroom_school_pricing_config';

/**
 * Retrieve the school pricing config — always the single monthly subscription.
 * Any legacy multi-tier config saved locally is ignored.
 */
export const getSchoolPricingConfig = (): SchoolTierConfig[] => {
  return [...DEFAULT_SCHOOL_TIERS];
};

/**
 * Save school pricing config (local only, no server/Supabase).
 * Only the single monthly tier is kept; anything else is discarded.
 */
export const saveSchoolPricingConfig = async (tiers: SchoolTierConfig[]): Promise<boolean> => {
  try {
    const monthly = (Array.isArray(tiers) ? tiers : []).find((t) => t.durationMonths === 1);
    const toSave = monthly
      ? [{ ...SCHOOL_SUBSCRIPTION_TIER, ...monthly, pricePkr: 50000, priceUsd: 99 }]
      : [...DEFAULT_SCHOOL_TIERS];
    localStorage.setItem(STORAGE_KEY_SCHOOL_PRICING, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.warn('Error saving school pricing config:', e);
    return false;
  }
};

/**
 * Helper to get pricing for a specific duration — only 1 month exists.
 */
export const getSchoolTierByDuration = (durationMonths: number): SchoolTierConfig => {
  if (durationMonths === 1) return SCHOOL_SUBSCRIPTION_TIER;
  return SCHOOL_SUBSCRIPTION_TIER;
};
