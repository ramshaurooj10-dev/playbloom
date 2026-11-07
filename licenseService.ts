/**
 * Playroom access control — rewritten 2026-11-07 (license system REMOVED).
 *
 * Single source of truth for access:
 *   1. Level 1 (free starter activities) — ALWAYS allowed, online and offline.
 *   2. Developer mode (owner preview) — everything unlocked.
 *   3. School subscription (Google Play product `playroom_school_monthly`,
 *      Rs 50,000/month) — Page 1 + Page 2 (Educator Hub).
 *   4. Google Play passes — 3-activities (7d) / all-activities (30d, Page 1).
 *   5. Ad unlocks — 1 activity per rewarded ad, stored locally.
 *
 * OFFLINE-SAFE: signed cached entitlements are honoured while offline
 * (see GooglePlayBillingService — expiry checked against the last verified
 * server time, plus a 3-day grace period after expiry). Free Level 1 is
 * always playable offline. Paid content locks only after the grace period
 * ends, until the app goes online once to re-verify.
 *
 * REMOVED: license keys (SCH-XXXX), manual payments (SadaPay/bank/Payoneer),
 * Supabase, school requests/renewals, revocation notices, SSE sync.
 * There is no login and no account needed for access.
 */
import { googlePlayBilling } from '../services/billing/GooglePlayBillingService';
import { LEARNING_ITEMS } from '../data/learningItems';
import { isDeveloperMode } from './devMode';

export const ENTITLEMENT_SCHEMA_VERSION = 3;

// Legacy storage keys that MUST be purged (old license/manual-payment/Supabase state).
export const LEGACY_STORAGE_KEYS = [
  'premiumAccess',
  'isPremium',
  'premiumUnlocked',
  'unlockedActivities',
  'unlockedActivityIds',
  'purchasedActivities',
  'allActivitiesUnlocked',
  'hasPremium',
  'subscriptionActive',
  'purchaseStatus',
  'hasAccess',
  'playroom_temp_unlock',
  'playroom_unlocked_activities',
  'playroom_unlocked_activity_ids',
  'playroom_purchased_activities',
  'playroom_all_activities_unlocked',
  'playroom_has_premium',
  'playroom_is_premium',
  'playroom_premium_access',
  'playroom_subscription_active',
  'playroom_license_key',
  'playroom_unlocked_levels',
  'playroom_activity_unlocked',
  'playroom_user_licenses',
  'playroom_verified_gp_entitlements_v2',
  'playroom_verified_gp_entitlements',
  'playroom_gp_entitlements',
  'playroom_3pack_unlocked_activities',
  'playroom_verified_3pack_unlocked_activities_v2',
  'playroom_3activities_unlocked',
  'playroom_ad_unlocked_activities',
  'playroom_explored_premium',
  'playroom_premium_explored',
  'playroom_completed',
  // License-system keys (dead after 2026-11-07 removal)
  'playroom_active_school_license',
  'playroom_saved_school_key',
  'playroom_last_school_license',
  'playroom_school_licenses',
  'playroom_all_school_licenses_cache',
  'playroom_db_school_licenses',
  'playroom_revoked_notice',
  'playroom_v3_payment_requests',
  'playroom_v3_user_licenses',
  'playroom_v3_payment_settings',
];

// Keys that must NOT be wiped by the purge (user progress + Play Billing cache).
const PRESERVED_KEYS_WHITELIST = new Set([
  'playroom_global_stars_count',
  'playroom_completed_activities',
  'playroom_recent_completions',
  'playroom_voice_persona',
  'playroom_last_played_activity',
  'playroom_sound_muted',
  'playroom_seen_app_version',
  'playroom_v3_ad_unlocked_activities',
  'playroom_v3_3pack_unlocked_activities',
  'playroom_v3_verified_gp_entitlements',
  'playroom_v3_3pack_activities',
  'playroom_v3_3pack_token',
  'playroom_last_verified_server_time_ms',
  'playroom_sw_reloaded_at',
  'playroom_developer_mode_active',
]);

export const purgeLegacyEntitlements = () => {
  if (typeof window === 'undefined') return;
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
      try {
        sessionStorage.removeItem(key);
      } catch {}
    });

    // Validate versioned keys to ensure no stale schema bypasses exist
    const v3Keys = [
      'playroom_v3_ad_unlocked_activities',
      'playroom_v3_3pack_unlocked_activities',
      'playroom_v3_verified_gp_entitlements',
      'playroom_v3_3pack_activities',
    ];

    v3Keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const isValid = parsed.every(
              (item: any) =>
                item &&
                (item.schemaVersion === ENTITLEMENT_SCHEMA_VERSION ||
                  item.version === ENTITLEMENT_SCHEMA_VERSION ||
                  // Google Play entitlements carry serverSignature / verificationMethod instead of a schema version.
                  typeof item.serverSignature === 'string' ||
                  item.verificationMethod === 'digital_goods_api' ||
                  item.verificationMethod === 'google_play_developer_api')
            );
            if (!isValid) {
              localStorage.removeItem(key);
            }
          } else if (parsed && typeof parsed === 'object') {
            if (
              parsed.version !== ENTITLEMENT_SCHEMA_VERSION &&
              parsed.schemaVersion !== ENTITLEMENT_SCHEMA_VERSION
            ) {
              localStorage.removeItem(key);
            }
          }
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.warn('[PURGE] Error purging legacy entitlements:', err);
  }
};

// Immediate purge on module evaluation
if (typeof window !== 'undefined') {
  purgeLegacyEntitlements();
}

export type AccessReason =
  | 'FREE'
  | 'VERIFIED_ENTITLEMENT'
  | 'AD_UNLOCK'
  | 'LOCKED'
  | 'OFFLINE'
  | 'ADMIN_PREVIEW';

export interface ActivityAccessResult {
  allowed: boolean;
  reason: AccessReason;
  message?: string;
  isFree: boolean;
  online: boolean;
  entitlementSource?: string;
  entitlementVersion?: number;
  entitlementValid?: boolean;
  expiresAt?: string | null;
  accessDeniedReason?: string;
  hasAccess: boolean; // Backward-compatible boolean property
}

const STORAGE_KEY_AD_UNLOCKED = 'playroom_v3_ad_unlocked_activities';
const STORAGE_KEY_3_ACTIVITIES = 'playroom_v3_3pack_unlocked_activities';

export const emitLicenseStateChange = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('playroom_license_update'));
  }
};

/**
 * Check whether an activity is in Level 1 (Free Starter Activity).
 * Level 1 activities are ALWAYS 100% accessible offline and online.
 */
export const isActivityFree = (activityId: string, levelNumber?: number): boolean => {
  if (!activityId) return false;
  const cleanId = activityId.trim().toLowerCase();
  if (cleanId === 'welcome' || cleanId === 'home' || cleanId === 'completion') {
    return true;
  }
  const item = LEARNING_ITEMS.find((i) => i.id === cleanId);
  if (item) {
    const lvl = typeof item.level === 'number' ? item.level : parseInt(String(item.level), 10) || 1;
    return Boolean(item.isFree && lvl === 1);
  }
  return levelNumber === 1;
};

/**
 * Get numerical level for activity
 */
export const getLevelNumberForActivity = (activityId: string): number => {
  const cleanId = activityId.trim().toLowerCase();
  const item = LEARNING_ITEMS.find((i) => i.id === cleanId);
  if (item) {
    return typeof item.level === 'number' ? item.level : parseInt(String(item.level), 10) || 1;
  }
  return 1;
};

/**
 * Get list of activity IDs unlocked by watching video ads.
 * Ad unlocks are local and are honoured offline (the reward was already earned).
 */
export const getAdUnlockedActivities = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AD_UNLOCKED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === ENTITLEMENT_SCHEMA_VERSION && Array.isArray(parsed.activities)) {
      return parsed.activities;
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Check if a specific activity ID was unlocked via watching an ad
 */
export const isActivityAdUnlocked = (activityId: string): boolean => {
  if (!activityId || typeof activityId !== 'string') return false;
  if (typeof window === 'undefined') return false;
  const list = getAdUnlockedActivities();
  return list.includes(activityId.trim());
};

/**
 * Unlock 1 specific activity by watching a quick sponsor ad.
 * Works offline — the unlock is local; the ad itself needs internet to play,
 * which the ad service enforces before calling this.
 */
export const unlockActivityViaAd = (activityId: string): void => {
  try {
    if (!activityId || typeof activityId !== 'string') return;
    if (typeof window === 'undefined') return;
    const cleanId = activityId.trim();
    const list = getAdUnlockedActivities();
    if (!list.includes(cleanId)) {
      list.push(cleanId);
      localStorage.setItem(
        STORAGE_KEY_AD_UNLOCKED,
        JSON.stringify({
          version: ENTITLEMENT_SCHEMA_VERSION,
          activities: list,
          updatedAt: new Date().toISOString(),
        })
      );
      emitLicenseStateChange();
    }
  } catch (err) {
    console.warn('Failed to save ad unlock:', err);
  }
};

/**
 * Get list of activities unlocked under 3 Activities Pass
 */
export const getUnlocked3Activities = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_3_ACTIVITIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === ENTITLEMENT_SCHEMA_VERSION && Array.isArray(parsed.activities)) {
      return parsed.activities;
    }
    return [];
  } catch {
    return [];
  }
};

/**
 * Unlock an activity into the user's 3-activities pack (limit 3).
 * Delegates to GooglePlayBillingService so the single source of truth
 * (the Play pass + its purchase token) stays in sync.
 */
export const unlockActivityIn3Pack = (activityId: string): { success: boolean; message: string } => {
  const result = googlePlayBilling.unlockActivityUnder3Pack(activityId);
  if (result.success) emitLicenseStateChange();
  return { success: result.success, message: result.message };
};

/**
 * School access — Play Billing subscription only.
 * No license keys, no email round-trip, no renewal requests.
 * Active when the `playroom_school_monthly` subscription is active
 * (checked from the offline-safe entitlement cache, including the
 * 3-day offline grace period) or developer mode is on.
 */
export const checkActiveSchoolAccess = (
  _userEmailOrKey?: string | null
): { hasAccess: boolean; schoolName?: string; licenseKey?: string; isExpired?: boolean; isRevoked?: boolean; expiryDate?: string; daysRemaining?: number } => {
  if (typeof window === 'undefined') return { hasAccess: false };

  // Developer preview override: unlocked for checking/testing
  if (isDeveloperMode()) {
    return {
      hasAccess: true,
      schoolName: 'Developer Preview',
      isExpired: false,
      isRevoked: false,
    };
  }

  const sub = googlePlayBilling.hasSchoolSubscription();
  if (sub.active) {
    return {
      hasAccess: true,
      schoolName: 'School Subscription',
      isExpired: false,
      isRevoked: false,
      expiryDate: sub.expiryDate,
      daysRemaining: sub.daysRemaining,
    };
  }

  return { hasAccess: false, isExpired: false, isRevoked: false };
};

/**
 * Check if a user has access to a specific Level.
 * Level 1 is always free (online and offline).
 * Levels 2–6 require a school subscription, an All Activities pass,
 * a 3-pack selection, or an ad unlock — all honoured from the
 * offline-safe cache when offline.
 */
export const checkLevelAccess = (
  userEmail: string | undefined | null,
  level: number,
  _isDeveloperMode: boolean = false
): { hasAccess: boolean; isExpired?: boolean } => {
  // Level 1 is always 100% free starter for everyone
  if (level === 1) {
    return { hasAccess: true };
  }

  // Developer mode override
  if (_isDeveloperMode || isDeveloperMode()) {
    return { hasAccess: true };
  }

  // School subscription unlocks all levels (Page 1 + Page 2)
  const schoolAccess = checkActiveSchoolAccess(userEmail);
  if (schoolAccess.hasAccess) {
    return { hasAccess: true };
  }

  // Google Play Billing: All Activities Pass
  const gpAllPass = googlePlayBilling.hasAllActivitiesPass();
  if (gpAllPass.active) {
    return { hasAccess: true };
  }

  // Google Play Billing: 3-Activities Pass (any selection counts for the level check;
  // per-activity checks happen in checkActivityAccess)
  const gp3Pass = googlePlayBilling.has3ActivitiesPass();
  if (gp3Pass.active) {
    return { hasAccess: true };
  }

  return { hasAccess: false };
};

/**
 * SINGLE AUTHORITATIVE ACCESS CONTROLLER
 * Evaluates whether an activity can be opened.
 *
 * - Level 1/free activity = accessible, online AND offline.
 * - Developer preview = everything accessible.
 * - School subscription / Play passes / ad unlocks = accessible, including
 *   offline from the signed cache (3-day grace after expiry, then lock
 *   until the app goes online once to re-verify).
 * - Otherwise locked.
 */
export const checkActivityAccess = (
  activityId: string,
  levelNumber?: number,
  userEmail?: string | null,
  _isDeveloperMode: boolean = false
): ActivityAccessResult => {
  const isOnline = typeof navigator !== 'undefined' ? Boolean(navigator.onLine) : true;
  const isFree = isActivityFree(activityId, levelNumber);
  const effectiveLevel = levelNumber ?? getLevelNumberForActivity(activityId);

  // 0. DEVELOPER PREVIEW OVERRIDE
  if (_isDeveloperMode || isDeveloperMode()) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'ADMIN_PREVIEW',
      message: 'Developer Preview — Full App Unlocked for Testing',
      isFree: false,
      online: isOnline,
      entitlementSource: 'Developer Preview',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: null,
      accessDeniedReason: undefined,
    };
    return result;
  }

  // 1. FREE ACTIVITIES: Level 1 core starter activities are 100% accessible both online AND offline!
  if (isFree || effectiveLevel === 1) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'FREE',
      message: 'Level 1 Free Starter Activity',
      isFree: true,
      online: isOnline,
      entitlementSource: 'Level 1 Free Starter',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: null,
      accessDeniedReason: undefined,
    };
    return result;
  }

  // 2. SCHOOL SUBSCRIPTION (Page 1 + Page 2) — offline-safe via cached entitlement
  const schoolAccess = checkActiveSchoolAccess(userEmail);
  if (schoolAccess.hasAccess) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'VERIFIED_ENTITLEMENT',
      message: 'Active School Subscription',
      isFree: false,
      online: isOnline,
      entitlementSource: 'Google Play School Subscription',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: schoolAccess.expiryDate || null,
    };
    return result;
  }

  // 3. AdMob Rewarded Ad Unlock (for this exact activity ID only) — honoured offline
  if (isActivityAdUnlocked(activityId)) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'AD_UNLOCK',
      message: 'Unlocked via Rewarded Ad',
      isFree: false,
      online: isOnline,
      entitlementSource: 'AdMob Rewarded Ad',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: null,
    };
    return result;
  }

  // 4. Google Play Billing: All Activities Pass (30 Days) — offline-safe via cache
  const gpAllPass = googlePlayBilling.hasAllActivitiesPass();
  if (gpAllPass.active) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'VERIFIED_ENTITLEMENT',
      message: 'Google Play All Activities Pass (Active)',
      isFree: false,
      online: isOnline,
      entitlementSource: 'Google Play All Activities Pass',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: gpAllPass.expiryDate || null,
    };
    return result;
  }

  // 5. Google Play Billing: 3-Pack selection (7 Days) — offline-safe via cache
  const gp3Pass = googlePlayBilling.has3ActivitiesPass();
  if (gp3Pass.active && gp3Pass.unlockedActivities.includes(activityId)) {
    const result: ActivityAccessResult = {
      allowed: true,
      hasAccess: true,
      reason: 'VERIFIED_ENTITLEMENT',
      message: 'Google Play 3-Activities Pass (Selected)',
      isFree: false,
      online: isOnline,
      entitlementSource: 'Google Play 3-Activities Pass',
      entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
      entitlementValid: true,
      expiresAt: gp3Pass.expiryDate || null,
    };
    return result;
  }

  // 6. FAIL CLOSED: Default locked (offline, the message says to go online to re-verify)
  const result: ActivityAccessResult = {
    allowed: false,
    hasAccess: false,
    reason: isOnline ? 'LOCKED' : 'OFFLINE',
    message: isOnline
      ? 'Locked - Level 2–6 activity requires an active pass or school subscription.'
      : 'Offline - connect to the internet once to verify your pass or school subscription.',
    isFree: false,
    online: isOnline,
    entitlementSource: 'none',
    entitlementVersion: ENTITLEMENT_SCHEMA_VERSION,
    entitlementValid: false,
    expiresAt: null,
    accessDeniedReason: isOnline
      ? 'Locked: No valid entitlement found for this activity.'
      : 'Offline: No valid cached entitlement found; go online once to re-verify.',
  };
  return result;
};

/**
 * Format Date helper (e.g. "19 August 2026")
 */
export const formatExpiryDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '30 days from purchase';
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '30 days from purchase';
  }
};

/**
 * Educator Hub access validation.
 * Access is granted ONLY when the school subscription is active
 * (or developer mode is on). The legacy `license` argument is ignored —
 * kept only so existing call sites keep compiling until wave 2 rewrites them.
 */
export const canAccessEducatorHub = (_license?: any): boolean => {
  if (isDeveloperMode()) {
    return true;
  }
  return googlePlayBilling.hasSchoolSubscription().active;
};

/**
 * Calculate dynamic days remaining from now until expiry
 */
export const getDaysRemaining = (expiryDateIso: string): number => {
  try {
    const expiry = new Date(expiryDateIso).getTime();
    const now = Date.now();
    const diffMs = expiry - now;
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

/**
 * Resolves an admin-selected expiry date input string into an exact ISO timestamp deadline.
 * If the input is a date string without time (e.g. "2026-10-30"), the expiry deadline
 * is enforced at the end of that day (i.e. next day at 00:00:00.000 / 12:00 AM UTC).
 * If a specific time is provided, uses that exact timestamp.
 */
export function resolveExpiryDeadline(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return !isNaN(d.getTime()) ? d.toISOString() : '';
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const deadline = new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0));
    return deadline.toISOString();
  }
  const d = new Date(dateStr);
  return !isNaN(d.getTime()) ? d.toISOString() : '';
}

/**
 * Calculates duration in days between two date strings (startDate to expiryDate)
 */
export function calculateDurationDaysBetween(startDateStr: string, expiryDateStr: string): number {
  try {
    const sParts = (startDateStr || '').split('T')[0].split('-').map(Number);
    const eParts = (expiryDateStr || '').split('T')[0].split('-').map(Number);
    if (sParts.length === 3 && eParts.length === 3) {
      const s = Date.UTC(sParts[0], sParts[1] - 1, sParts[2]);
      const e = Date.UTC(eParts[0], eParts[1] - 1, eParts[2]);
      if (e <= s) return 1;
      return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
    }
    const start = new Date(startDateStr).getTime();
    const end = new Date(expiryDateStr).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return 1;
    return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  } catch {
    return 30;
  }
}

/**
 * Computes expiry date YYYY-MM-DD from start date and duration days
 */
export function computeExpiryDateFromDuration(startDateStr: string, durationDays: number): string {
  try {
    const parts = (startDateStr || '').split('-');
    let start: Date;
    if (parts.length === 3) {
      start = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
    } else {
      start = new Date();
    }
    const target = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
    return target.toISOString().split('T')[0];
  } catch {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d.toISOString().split('T')[0];
  }
}
