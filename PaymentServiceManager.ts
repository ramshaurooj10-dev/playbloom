/**
 * PaymentServiceManager — rewritten 2026-11-07 (license system REMOVED).
 *
 * School access now comes ONLY from the Google Play subscription
 * `playroom_school_monthly` (Rs 50,000/month, Page 1 + Page 2), checked via
 * GooglePlayBillingService.hasSchoolSubscription(). There are no license
 * keys, no manual payments (SadaPay/bank/Payoneer), no school requests,
 * no renewals, no disputes, no Supabase, and no provider plugins.
 *
 * This class survives as a thin compatibility layer for the few call sites
 * that still reference it (App.tsx, SchoolAccessGate, SchoolPurchaseModal —
 * the latter two are being rewritten in wave 2). The deprecated methods
 * below always fail with a clear message; do NOT build on them.
 */
import { SchoolLicense } from '../../types/payment';
import { googlePlayBilling } from '../billing/GooglePlayBillingService';
import { isDeveloperMode } from '../../utils/devMode';

export const STORAGE_ACTIVE_SCHOOL_LICENSE_KEY = 'playroom_active_school_license';

/** Build a SchoolLicense-shaped view of the active Play subscription (for UI display only). */
function subscriptionAsSchoolLicense(): SchoolLicense | null {
  const sub = googlePlayBilling.hasSchoolSubscription();
  if (!sub.active) return null;
  const now = new Date().toISOString();
  return {
    id: 'school_subscription',
    schoolId: 'school_subscription',
    schoolName: 'School Subscription',
    contactEmail: '',
    price: 50000,
    currency: 'PKR',
    allowedDevices: 15,
    page1Access: true,
    page2Access: true,
    startDate: null,
    expiryDate: sub.expiryDate ?? null,
    validFrom: null,
    validUntil: sub.expiryDate ?? null,
    status: 'ACTIVE',
    durationMonths: 1,
    durationDays: 30,
    createdAt: now,
  };
}

export class PaymentServiceManager {
  private static instance: PaymentServiceManager;

  private constructor() {}

  public static getInstance(): PaymentServiceManager {
    if (!PaymentServiceManager.instance) {
      PaymentServiceManager.instance = new PaymentServiceManager();
    }
    return PaymentServiceManager.instance;
  }

  /**
   * Active school access, derived from the Google Play subscription.
   * Returns null when there is no active subscription.
   */
  public getActiveSchoolLicense(): SchoolLicense | null {
    return subscriptionAsSchoolLicense();
  }

  /**
   * @deprecated License keys are removed. Kept so SchoolAccessGate still
   * compiles until wave 2 rewrites it; storing a license object no longer
   * grants access — only the Play subscription does.
   */
  public saveActiveSchoolLicense(_license: SchoolLicense): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('playroom_license_update'));
    }
  }

  /** Clear local access state (logout cleanup). */
  public clearActiveSchoolLicense(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_ACTIVE_SCHOOL_LICENSE_KEY);
      } catch {}
      window.dispatchEvent(new CustomEvent('playroom_license_update'));
    }
  }

  /** Complete logout cleanup: clears user session + access state. */
  public clearAllUserAndSchoolAccessState(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_ACTIVE_SCHOOL_LICENSE_KEY);
        localStorage.removeItem('playroom_user');
        localStorage.removeItem('playroom_current_user');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Error clearing access state during logout:', e);
      }
      window.dispatchEvent(new CustomEvent('playroom_license_update'));
      window.dispatchEvent(new CustomEvent('playroom_auth_change'));
    }
  }

  /**
   * Check school access and expiration — subscription only.
   */
  public checkSchoolAccess(
    _schoolEmailOrKey?: string | null
  ): {
    hasAccess: boolean;
    license?: SchoolLicense;
    isExpired?: boolean;
    daysRemaining?: number;
    page1Access?: boolean;
    page2Access?: boolean;
  } {
    if (isDeveloperMode()) {
      return {
        hasAccess: true,
        isExpired: false,
        daysRemaining: 9999,
        page1Access: true,
        page2Access: true,
      };
    }

    const license = subscriptionAsSchoolLicense();
    if (license) {
      const sub = googlePlayBilling.hasSchoolSubscription();
      return {
        hasAccess: true,
        license,
        isExpired: false,
        daysRemaining: sub.daysRemaining,
        page1Access: true,
        page2Access: true,
      };
    }

    return { hasAccess: false };
  }

  /** True when the school subscription (or dev mode) unlocks the full app. */
  public checkIndividualFullAppAccess(_userEmail?: string | null): boolean {
    return isDeveloperMode() || googlePlayBilling.hasSchoolSubscription().active;
  }

  /** Level access — delegates to the subscription / Play passes. */
  public checkLevelAccess(
    _userEmail: string | undefined | null,
    level: number,
    devMode: boolean = false
  ): { hasAccess: boolean; isExpired?: boolean } {
    if (level === 1) return { hasAccess: true };
    if (devMode || isDeveloperMode()) return { hasAccess: true };
    if (googlePlayBilling.hasSchoolSubscription().active) return { hasAccess: true };
    if (googlePlayBilling.hasAllActivitiesPass().active) return { hasAccess: true };
    if (googlePlayBilling.has3ActivitiesPass().active) return { hasAccess: true };
    return { hasAccess: false };
  }

  // ------------------------------------------------------------------
  // REMOVED — deprecated stubs kept only so wave-2 files still compile.
  // All of these always fail; the license/manual-payment flows are gone.
  // ------------------------------------------------------------------

  /** @deprecated License keys were removed. Always fails. */
  public async validateSchoolLicenseKey(_key: string): Promise<{
    success: boolean;
    error?: string;
    license?: SchoolLicense;
  }> {
    return {
      success: false,
      error: 'License keys were removed. Schools subscribe via Google Play (Rs 50,000/month).',
    };
  }

  /** @deprecated Manual school payment requests were removed. Always fails. */
  public async submitSchoolPaymentRequest(_params: any): Promise<{
    success: boolean;
    error?: string;
    request?: any;
  }> {
    return {
      success: false,
      error: 'Manual school payments were removed. Schools subscribe via Google Play (Rs 50,000/month).',
    };
  }

  /** @deprecated License generation was removed. Always fails. */
  public async generateUniqueLicenseKey(): Promise<string> {
    throw new Error('License keys were removed. Schools subscribe via Google Play.');
  }
}
