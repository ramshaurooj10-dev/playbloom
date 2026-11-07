/**
 * Developer mode — real localStorage-backed toggle (2026-11-07 rewrite).
 *
 * - Default OFF. Never shipped enabled to users.
 * - Used ONLY by the owner (via the dev-preview screen in the admin entry
 *   and the DeveloperModeToggle) to view the unlocked version of the app.
 * - When ON, licenseService checkActivityAccess / checkLevelAccess /
 *   checkActiveSchoolAccess all return unlocked, and the admin preview
 *   (isAdminAppViewActive) reports active.
 * - No login, no server, no Supabase. No self-deleting keys: the toggle
 *   persists until the owner turns it off.
 */
import { useState, useEffect, useCallback } from 'react';

export const DEV_MODE_STORAGE_KEY = 'playroom_developer_mode_active';
const EVENT_NAME = 'playroom_dev_mode_change';

function readDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DEV_MODE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export const isDeveloperMode = (): boolean => {
  return readDevMode();
};

/** Alias used by the admin-preview path: dev mode IS the preview environment now. */
export const isDevPreviewEnvironment = (): boolean => {
  return readDevMode();
};

export const setDeveloperMode = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      localStorage.setItem(DEV_MODE_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(DEV_MODE_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { enabled } }));
    window.dispatchEvent(new CustomEvent('playroom_license_update'));
  } catch (_) {
    // Ignore storage errors
  }
};

export const toggleDeveloperMode = (): boolean => {
  const next = !readDevMode();
  setDeveloperMode(next);
  return next;
};

export const useDeveloperMode = () => {
  const [devMode, setDevMode] = useState<boolean>(() => readDevMode());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail && typeof detail.enabled === 'boolean') {
        setDevMode(detail.enabled);
      } else {
        setDevMode(readDevMode());
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const toggle = useCallback(() => {
    return toggleDeveloperMode();
  }, []);

  return { isDeveloperMode: devMode, toggleDeveloperMode: toggle, setDeveloperMode };
};
