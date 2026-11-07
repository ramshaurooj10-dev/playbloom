// Service Worker registration (Wave 2, 2026-11-07).
//
// Plain registration only: the old versionController update engine
// (version.json polling, forced reloads, "Update Now" banner) is deleted —
// Play Store handles updates for the shipped app. The worker only caches
// the app shell + assets so the app works offline after install.
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          if (!installingWorker) return;
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration error:', err);
      });
  });
}
