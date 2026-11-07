/**
 * userAuthService — rewritten 2026-11-07 (Supabase Auth REMOVED).
 *
 * There is NO login system in Playroom any more: no Google sign-in, no
 * Supabase Auth, no admin email/password login, no password reset.
 * Purchases need no account (Google Play Billing), and the admin panel
 * is now a local developer-preview switch (see src/admin/AdminApp.tsx).
 *
 * This file survives as a LOCAL-ONLY compatibility layer so existing
 * call sites keep compiling until wave 2 rewrites them:
 * - User accounts are plain local objects in localStorage (`playroom_user`).
 * - `isAdminAppViewActive()` / `setAdminAppViewActive()` now delegate to
 *   developer mode (devMode.ts) — the admin preview IS dev mode.
 * - All sign-in / password / session functions are stubs that always
 *   fail or return null with a clear message. Do NOT build on them.
 */
import { UserAccount } from '../components/PremiumAuthModal';
import { isDeveloperMode, setDeveloperMode } from './devMode';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'parent' | 'school_admin' | 'user' | 'admin' | 'super_admin';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_PROFILES = 'playroom_user_profiles';
const STORAGE_KEY_CURRENT_USER = 'playroom_user';
export const STORAGE_KEY_ADMIN_USER = 'playroom_admin_user';
export const STORAGE_KEY_ADMIN_APP_VIEW = 'playroom_admin_app_view_active';

// Kept for compatibility with older call sites; no longer used for auth.
export const PRIMARY_ADMIN_EMAIL = 'ramshaurooj10@gmail.com';
export const BACKUP_ADMIN_EMAIL = 'ramshaurooj92@gmail.com';
export const AUTHORIZED_ADMIN_EMAILS = [
  PRIMARY_ADMIN_EMAIL.toLowerCase(),
  BACKUP_ADMIN_EMAIL.toLowerCase(),
];

export const isAuthorizedAdminEmail = (email: string): boolean => {
  return AUTHORIZED_ADMIN_EMAILS.includes(normalizeEmail(email));
};

export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

const AUTH_REMOVED_ERROR = new Error(
  'Login was removed from Playroom. No account is needed — purchases use Google Play Billing.'
);

/** @deprecated Google sign-in was removed. Always returns an error. */
export const signInWithGoogle = async (): Promise<{ error: Error | null; data?: any }> => {
  return { error: AUTH_REMOVED_ERROR };
};

/** @deprecated Admin Supabase sign-in was removed. Always returns an error. */
export const signInAdminWithSupabase = async (
  _email: string,
  _password: string
): Promise<{ error: Error | null; data?: any }> => {
  return { error: AUTH_REMOVED_ERROR };
};

/** @deprecated Password reset was removed (no admin login any more). Always returns an error. */
export const sendAdminPasswordResetEmail = async (
  _email: string
): Promise<{ error: Error | null; data?: any }> => {
  return { error: AUTH_REMOVED_ERROR };
};

/** @deprecated Password update was removed. Always returns an error. */
export const updateAdminPassword = async (
  _newPassword: string
): Promise<{ error: Error | null; data?: any }> => {
  return { error: AUTH_REMOVED_ERROR };
};

/** @deprecated No server session exists any more. Always reports no session. */
export const checkCurrentAdminSession = async (): Promise<{
  isAdmin: boolean;
  account: UserAccount | null;
  error?: Error | null;
}> => {
  return { isAdmin: false, account: null };
};

/** Local sign-out: clears the local user account and dev preview. */
export const signOutUser = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_ADMIN_USER);
    setDeveloperMode(false);
  } catch (_) {}
  window.dispatchEvent(new CustomEvent('playroom_auth_change'));
};

/** True when the account object carries an admin role. */
export const isAdminAccount = (account: UserAccount | null | undefined): boolean => {
  if (!account) return false;
  return account.role === 'admin' || account.role === 'super_admin';
};

export const getCurrentUserAccountLocal = (): UserAccount | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.isLoggedIn ? (parsed as UserAccount) : null;
  } catch {
    return null;
  }
};

export const getAdminAccountLocal = (): UserAccount | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_USER);
    if (!raw) return null;
    return JSON.parse(raw) as UserAccount;
  } catch {
    return null;
  }
};

export const saveAdminAccountLocal = (account: UserAccount): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_USER, JSON.stringify(account));
  } catch (_) {}
};

export const clearAdminSessionLocal = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_ADMIN_USER);
    localStorage.removeItem(STORAGE_KEY_ADMIN_APP_VIEW);
    sessionStorage.removeItem(STORAGE_KEY_ADMIN_APP_VIEW);
    localStorage.removeItem('playroom_admin_authenticated');
    sessionStorage.removeItem('playroom_admin_authenticated');
  } catch (_) {}
};

/**
 * Admin preview is now developer mode: active exactly when devMode is on.
 * (Previously this required a Supabase admin session + a server endpoint
 * that never existed on the deployed host — which is why it never worked.)
 */
export const isAdminAppViewActive = (): boolean => {
  return isDeveloperMode();
};

/** Turning the admin preview on/off IS turning developer mode on/off. */
export const setAdminAppViewActive = (active: boolean): void => {
  setDeveloperMode(active);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('playroom_admin_view_change', { detail: { active } }));
  }
};

/**
 * @deprecated No backend preview verification exists any more.
 * Returns whether developer mode is currently on.
 */
export const verifyAdminPreviewSession = async (): Promise<boolean> => {
  return isDeveloperMode();
};

export const getAllUserProfilesLocal = (): UserProfile[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
};

export const findProfileByEmail = (email: string): UserProfile | undefined => {
  const clean = normalizeEmail(email);
  return getAllUserProfilesLocal().find((p) => normalizeEmail(p.email) === clean);
};

export const saveUserProfileLocal = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllUserProfilesLocal();
    const idx = all.findIndex((p) => p.id === profile.id || normalizeEmail(p.email) === normalizeEmail(profile.email));
    if (idx >= 0) all[idx] = { ...all[idx], ...profile, updatedAt: new Date().toISOString() };
    else all.unshift(profile);
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(all));
  } catch (_) {}
};

/**
 * @deprecated School admin status was tied to license keys / Supabase.
 * Now: a local account with role school_admin counts as a school admin.
 */
export const verifySchoolAdminStatus = async (
  account: UserAccount | null | undefined
): Promise<boolean> => {
  return Boolean(account && account.role === 'school_admin');
};

/**
 * Create (or return) a LOCAL user account object. No server, no login:
 * this just records the email/role locally so existing call sites that
 * expect an account keep working.
 */
export const getOrCreateUserAccount = async (
  email: string,
  displayName?: string,
  userId?: string
): Promise<UserAccount> => {
  const cleanEmail = normalizeEmail(email);
  const existing = findProfileByEmail(cleanEmail);
  const now = new Date().toISOString();
  const profile: UserProfile = existing || {
    id: userId || `local_${Date.now()}`,
    email: cleanEmail,
    displayName: displayName || cleanEmail.split('@')[0],
    role: 'parent',
    createdAt: now,
    updatedAt: now,
  };
  saveUserProfileLocal(profile);

  const account: UserAccount = {
    id: profile.id,
    email: profile.email,
    isLoggedIn: true,
    role: profile.role === 'admin' || profile.role === 'super_admin' ? profile.role : 'parent',
    hasPage1Access: true,
    hasPage2SchoolAccess: false,
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(account));
    } catch (_) {}
  }
  return account;
};
