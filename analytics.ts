// Analytics — NEUTRALISED (Wave 2, 2026-11-07).
//
// Google Analytics 4 was removed with the web SEO block in index.html:
// the app is Play-Store-only and targets ages 3–6, so a web analytics
// tag (G-KDXRSKL29M) must not ship. All exported functions are kept as
// no-ops so existing callers (App.tsx, RhymeTime.tsx) keep compiling
// unchanged. No events are sent anywhere; no PII is collected.

export const GA_MEASUREMENT_ID = '';

export function setAnalyticsUserId(_internalAccountId?: string): void {}

export function trackEvent(_eventName: string, _params?: Record<string, any>): void {}

export function trackPageView(_pagePath: string, _pageTitle?: string): void {}

export function trackAppOpen(): void {}

export function getActivityName(activityId: string): string {
  switch (activityId) {
    case 'abc':
      return 'ABC Phonics';
    case 'color':
      return 'Colors';
    case 'find_object':
      return 'Find the Object';
    case 'counting':
      return 'Counting';
    case 'shape_match':
      return 'Shape Match';
    case 'rhyme_time':
    case 'animal_food_match':
      return 'Animal Food Fun';
    case 'big_small_sort':
      return 'Big & Small Sort';
    case 'more_less':
      return 'More or Less';
    case 'pattern_fun':
      return 'Pattern Fun';
    case 'memory_match':
      return 'Memory Match';
    case 'fruit_veg_sort':
      return 'Fruit & Vegetable Sort';
    case 'odd_one_out':
      return 'Odd One Out';
    case 'count_tap':
      return 'Count & Tap';
    case 'shape_builder':
      return 'Shape Builder';
    default:
      return activityId;
  }
}

export function trackActivityOpen(_activityId: string): void {}

export function trackActivityComplete(_activityId: string): void {}

export function trackStarEarned(_activityId?: string): void {}

export function trackRhymePlay(): void {}
