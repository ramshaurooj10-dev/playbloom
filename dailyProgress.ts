import { ActivityId } from '../types';
import { LEARNING_ITEMS, LEARNING_AREAS_INFO, LearningItem } from '../data/learningItems';
import { isActivityAdUnlocked } from './licenseService';

export interface RecentCompletion {
  id: ActivityId;
  completedAt: string; // ISO or formatted string
  stars: number;
}

export const STORAGE_KEY_LAST_PLAYED = 'playroom_last_played_activity';

/**
 * Sequential list of learning activities (Level 1 through Level 6, excluding modal screens)
 */
export const SEQUENTIAL_LEARNING_ACTIVITIES: LearningItem[] = LEARNING_ITEMS.filter(
  (item) => item.id !== ('completion' as ActivityId)
);

/**
 * Record the last successfully played/started activity ID
 */
export function recordLastPlayedActivity(id: ActivityId): void {
  if (typeof window === 'undefined') return;
  if (!id || id === 'home' || id === 'welcome' || id === 'completion' || id === 'educator_hub') return;
  try {
    localStorage.setItem(STORAGE_KEY_LAST_PLAYED, id);
  } catch (e) {
    console.warn('Error recording last played activity:', e);
  }
}

/**
 * Get the last played/completed activity ID
 */
export function getLastPlayedActivity(): ActivityId | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Direct last-played marker
    const direct = localStorage.getItem(STORAGE_KEY_LAST_PLAYED);
    if (direct && SEQUENTIAL_LEARNING_ACTIVITIES.some((it) => it.id === direct)) {
      return direct as ActivityId;
    }
    // 2. Most recent completions
    const recent = getRecentlyCompleted();
    if (recent.length > 0 && recent[0]?.id) {
      if (SEQUENTIAL_LEARNING_ACTIVITIES.some((it) => it.id === recent[0].id)) {
        return recent[0].id;
      }
    }
    // 3. Overall completed list (latest item)
    const all = getCompletedAllTime();
    if (all.length > 0) {
      const last = all[all.length - 1];
      if (SEQUENTIAL_LEARNING_ACTIVITIES.some((it) => it.id === last)) {
        return last;
      }
    }
  } catch (e) {
    console.warn('Error retrieving last played activity:', e);
  }
  return null;
}

/**
 * Determine the ONLY next sequential activity that can be unlocked via watching a Rewarded Ad.
 * 
 * Rules:
 * 1. Find the child's last successfully played/completed activity in the sequential order.
 * 2. If none exists (first-time user), target the first locked non-free activity (Big & Small Sort).
 * 3. Look forward in the activity order after the last played activity for the next activity that is not already accessible/unlocked.
 * 4. If all subsequent activities are unlocked or end of list is reached, find the first remaining locked activity in the sequence.
 */
export function getNextAdUnlockTarget(): LearningItem | null {
  const items = SEQUENTIAL_LEARNING_ACTIVITIES;
  if (!items || items.length === 0) return null;

  const lastPlayed = getLastPlayedActivity();

  if (lastPlayed) {
    const lastIndex = items.findIndex((it) => it.id === lastPlayed);
    if (lastIndex !== -1) {
      // Scan forward from lastIndex + 1 to find the next locked activity
      for (let i = lastIndex + 1; i < items.length; i++) {
        const candidate = items[i];
        if (!candidate.isFree && !isActivityAdUnlocked(candidate.id)) {
          return candidate;
        }
      }
    }
  }

  // If no last played or if search forward didn't find a locked candidate,
  // scan from start (index 0) for the first locked activity that is not yet unlocked
  for (let i = 0; i < items.length; i++) {
    const candidate = items[i];
    if (!candidate.isFree && !isActivityAdUnlocked(candidate.id)) {
      return candidate;
    }
  }

  // Fallback: If all are unlocked, return the first premium item
  return items.find((it) => !it.isFree) || items[0];
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyCompletedKey(): string {
  return `playroom_daily_completed_${getTodayDateString()}`;
}

export function getCompletedToday(): ActivityId[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getDailyCompletedKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ActivityId[];
    }
  } catch (e) {
    console.warn('Error reading daily progress:', e);
  }
  return [];
}

export function getCompletedAllTime(): ActivityId[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('playroom_completed_activities');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ActivityId[];
    }
  } catch (e) {
    console.warn('Error reading overall completed activities:', e);
  }
  return [];
}

export function getRecentlyCompleted(): RecentCompletion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('playroom_recent_completions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as RecentCompletion[];
    }
    // Fallback: build from all time completed if no recent logs exist yet
    const all = getCompletedAllTime();
    if (all.length > 0) {
      const fallback: RecentCompletion[] = all.slice(-5).reverse().map((id) => ({
        id,
        completedAt: 'Recent',
        stars: 3,
      }));
      return fallback;
    }
  } catch (e) {
    console.warn('Error reading recent completions:', e);
  }
  return [];
}

export function getGlobalStarsCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('playroom_global_stars_count');
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    // Fallback: derive initial stars from existing completed activities (3 stars per activity)
    const completed = getCompletedAllTime();
    if (completed.length > 0) {
      const initialStars = completed.length * 3;
      localStorage.setItem('playroom_global_stars_count', String(initialStars));
      return initialStars;
    }
  } catch (e) {
    console.warn('Error reading global stars count:', e);
  }
  return 0;
}

export function addGlobalStars(amount: number = 3): number {
  if (typeof window === 'undefined') return amount;
  try {
    const current = getGlobalStarsCount();
    const newTotal = current + Math.max(1, amount);
    localStorage.setItem('playroom_global_stars_count', String(newTotal));
    return newTotal;
  } catch (e) {
    console.warn('Error adding global stars:', e);
    return amount;
  }
}

/**
 * Resets all earned stars and activity completion records back to zero
 * so the child/user can start earning stars fresh again from the beginning.
 */
export function resetGlobalStars(): number {
  if (typeof window === 'undefined') return 0;
  try {
    localStorage.setItem('playroom_global_stars_count', '0');
    localStorage.setItem('playroom_completed_activities', JSON.stringify([]));
    localStorage.setItem('playroom_recent_completions', JSON.stringify([]));
    try {
      localStorage.removeItem(getDailyCompletedKey());
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('playroom_stars_reset'));
    window.dispatchEvent(new CustomEvent('playroom_stars_updated', { detail: { stars: 0 } }));
    return 0;
  } catch (e) {
    console.warn('Error resetting global stars:', e);
    return 0;
  }
}

export function recordDailyCompletion(
  id: ActivityId,
  starsEarned: number = 3
): { isNewToday: boolean; totalToday: number; totalStars: number } {
  if (typeof window === 'undefined') {
    return { isNewToday: false, totalToday: 0, totalStars: starsEarned };
  }
  try {
    const key = getDailyCompletedKey();
    const current = getCompletedToday();
    const isNewToday = !current.includes(id);
    const updatedToday = isNewToday ? [...current, id] : current;

    localStorage.setItem(key, JSON.stringify(updatedToday));

    // Also persist overall completed set in localStorage
    const overall = getCompletedAllTime();
    if (!overall.includes(id)) {
      overall.push(id);
      localStorage.setItem('playroom_completed_activities', JSON.stringify(overall));
    }

    // Record in recent completions
    const recent = getRecentlyCompleted();
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedRecent: RecentCompletion[] = [
      { id, completedAt: `Today at ${timeString}`, stars: starsEarned },
      ...recent.filter((r) => r.id !== id),
    ].slice(0, 10);
    localStorage.setItem('playroom_recent_completions', JSON.stringify(updatedRecent));

    // Record as last played activity
    recordLastPlayedActivity(id);

    // Always add earned stars to global count
    const totalStars = addGlobalStars(starsEarned);

    return { isNewToday, totalToday: updatedToday.length, totalStars };
  } catch (e) {
    console.warn('Error recording completion:', e);
    return { isNewToday: false, totalToday: 0, totalStars: getGlobalStarsCount() };
  }
}

export interface AreaProgressData {
  areaTitle: string;
  totalActivities: number;
  completedActivities: number;
  percentage: number;
  completedOutcomesCount: number;
  totalOutcomesCount: number;
}

export function getLearningAreaStats(completedIds: ActivityId[]): Record<string, AreaProgressData> {
  const completedSet = new Set(completedIds);
  const result: Record<string, AreaProgressData> = {};

  for (const area of LEARNING_AREAS_INFO) {
    const activitiesInArea = LEARNING_ITEMS.filter((item) =>
      item.learningArea.toLowerCase().includes(area.title.toLowerCase()) ||
      area.title.toLowerCase().includes(item.learningArea.toLowerCase())
    );

    const completedInArea = activitiesInArea.filter((item) => completedSet.has(item.id));
    const totalCount = Math.max(1, activitiesInArea.length);
    const completedCount = completedInArea.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    // Calculate outcomes completed (an outcome is complete if any of its activityIds are completed)
    let completedOutcomes = 0;
    for (const outcome of area.outcomes) {
      if (outcome.activityIds.some((actId) => completedSet.has(actId))) {
        completedOutcomes++;
      }
    }

    result[area.title] = {
      areaTitle: area.title,
      totalActivities: totalCount,
      completedActivities: completedCount,
      percentage,
      completedOutcomesCount: completedOutcomes,
      totalOutcomesCount: area.outcomes.length,
    };
  }

  return result;
}
