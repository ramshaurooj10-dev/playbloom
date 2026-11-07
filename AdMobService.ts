/**
 * AdMob / Rewarded Ads Service for Playroom App
 * 
 * Provides Rewarded Video Ad support for unlocking individual activities for free.
 * 
 * Rewarded Ad Unit Configuration:
 * - Android Rewarded Ad Unit ID: ca-app-pub-3940256099942544/5224354917 (Google AdMob Test Unit ID)
 * - Production Unit ID: Configurable via setRewardedAdUnitId
 * 
 * CRITICAL INTEGRITY RULES:
 * 1. Never use a fake countdown/timer as a substitute for a rewarded ad.
 * 2. In browser/AI Studio preview where native AdMob SDK is not present, DO NOT fake completion and DO NOT grant rewards.
 * 3. In Android native environment, ONLY grant reward when the native AdMob onRewarded callback event fires.
 */

export interface AdMobConfig {
  appId?: string;
  rewardedAdUnitId?: string;
  testMode?: boolean;
}

export interface AdRewardResult {
  rewarded: boolean;
  activityId: string;
  type?: string;
  amount?: number;
  error?: string;
}

export class AdMobService {
  private static instance: AdMobService;
  private rewardedAdUnitId: string = 'ca-app-pub-3940256099942544/5224354917'; // Official Google AdMob Rewarded Test ID

  private constructor() {}

  public static getInstance(): AdMobService {
    if (!AdMobService.instance) {
      AdMobService.instance = new AdMobService();
    }
    return AdMobService.instance;
  }

  /**
   * Check if native Android AdMob SDK bridge is available
   */
  public isNativeAdMobAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as any;
    return !!(
      win.admob?.rewardvideo ||
      win.admob?.rewarded ||
      win.AdMob?.prepareRewardVideoAd ||
      win.Capacitor?.Plugins?.AdMob ||
      win.AndroidBridge?.showRewardedAd ||
      win.AndroidAdMob?.showRewardedAd
    );
  }

  /**
   * Show Rewarded Video Ad to unlock a specific activity.
   * Resolves ONLY when real native AdMob reward callback is received.
   */
  public async showRewardedAd(
    activityId: string
  ): Promise<AdRewardResult> {
    if (typeof window === 'undefined') {
      return {
        rewarded: false,
        activityId,
        error: 'Window environment not available.',
      };
    }

    const win = window as any;

    // 1. Capacitor AdMob Plugin Bridge (Capacitor / Ionic / Custom Android)
    if (win.Capacitor?.Plugins?.AdMob || win.AdMob?.prepareRewardVideoAd) {
      const AdMob = win.Capacitor?.Plugins?.AdMob || win.AdMob;
      return new Promise((resolve) => {
        let earnedReward = false;

        const cleanup = () => {
          try {
            if (AdMob.removeListener) {
              AdMob.removeListener('onRewardedVideoAdReward', rewardHandler);
              AdMob.removeListener('onRewardedVideoAdDismissed', dismissHandler);
              AdMob.removeListener('onRewardedVideoAdFailedToLoad', failHandler);
            }
          } catch {}
        };

        const rewardHandler = (reward: any) => {
          earnedReward = true;
        };

        const dismissHandler = () => {
          cleanup();
          if (earnedReward) {
            resolve({ rewarded: true, activityId, amount: 1 });
          } else {
            resolve({
              rewarded: false,
              activityId,
              error: 'Ad was closed before completion. Reward was not earned.',
            });
          }
        };

        const failHandler = (err: any) => {
          cleanup();
          resolve({
            rewarded: false,
            activityId,
            error: err?.message || 'Ad is not available right now. Please try again.',
          });
        };

        try {
          if (AdMob.addListener) {
            AdMob.addListener('onRewardedVideoAdReward', rewardHandler);
            AdMob.addListener('onRewardedVideoAdDismissed', dismissHandler);
            AdMob.addListener('onRewardedVideoAdFailedToLoad', failHandler);
          }

          AdMob.prepareRewardVideoAd({
            adId: this.rewardedAdUnitId,
          })
            .then(() => AdMob.showRewardVideoAd())
            .catch((err: any) => {
              cleanup();
              resolve({
                rewarded: false,
                activityId,
                error: err?.message || 'Ad is not available right now. Please try again.',
              });
            });
        } catch (e: any) {
          cleanup();
          resolve({
            rewarded: false,
            activityId,
            error: e?.message || 'Ad is not available right now. Please try again.',
          });
        }
      });
    }

    // 2. Cordova / AdMob Plus Plugin Bridge
    if (win.admob?.rewardvideo || win.admob?.rewarded) {
      const admob = win.admob;
      return new Promise((resolve) => {
        let earnedReward = false;

        const onReward = (event: any) => {
          earnedReward = true;
        };

        const onDismiss = () => {
          removeListeners();
          if (earnedReward) {
            resolve({ rewarded: true, activityId, amount: 1 });
          } else {
            resolve({
              rewarded: false,
              activityId,
              error: 'Ad was closed before completion. Reward was not earned.',
            });
          }
        };

        const onFail = (e: any) => {
          removeListeners();
          resolve({
            rewarded: false,
            activityId,
            error: e?.message || 'Ad is not available right now. Please try again.',
          });
        };

        const removeListeners = () => {
          document.removeEventListener('onRewardedVideoAdRewarded', onReward);
          document.removeEventListener('onRewardedVideoAdDismissed', onDismiss);
          document.removeEventListener('onRewardedVideoAdFailedToLoad', onFail);
          document.removeEventListener('admob.rewarded.reward', onReward);
          document.removeEventListener('admob.rewarded.dismiss', onDismiss);
          document.removeEventListener('admob.rewarded.load_fail', onFail);
        };

        document.addEventListener('onRewardedVideoAdRewarded', onReward);
        document.addEventListener('onRewardedVideoAdDismissed', onDismiss);
        document.addEventListener('onRewardedVideoAdFailedToLoad', onFail);
        document.addEventListener('admob.rewarded.reward', onReward);
        document.addEventListener('admob.rewarded.dismiss', onDismiss);
        document.addEventListener('admob.rewarded.load_fail', onFail);

        try {
          if (admob.rewardvideo?.prepare) {
            admob.rewardvideo.prepare({
              adId: this.rewardedAdUnitId,
              autoShow: true,
            });
          } else if (admob.rewarded?.load) {
            admob.rewarded.load({ id: this.rewardedAdUnitId }).then(() => admob.rewarded.show());
          }
        } catch (err: any) {
          removeListeners();
          resolve({
            rewarded: false,
            activityId,
            error: err?.message || 'Ad is not available right now. Please try again.',
          });
        }
      });
    }

    // 3. Android JavaScriptInterface native bridge
    if (win.AndroidBridge?.showRewardedAd || win.AndroidAdMob?.showRewardedAd) {
      return new Promise((resolve) => {
        const bridge = win.AndroidBridge || win.AndroidAdMob;
        win.__onPlayroomAdReward = (success: boolean, rewardActivityId: string, errorMsg?: string) => {
          delete win.__onPlayroomAdReward;
          if (success) {
            resolve({ rewarded: true, activityId: rewardActivityId || activityId, amount: 1 });
          } else {
            resolve({
              rewarded: false,
              activityId,
              error: errorMsg || 'Ad was not completed.',
            });
          }
        };

        try {
          bridge.showRewardedAd(activityId, this.rewardedAdUnitId);
        } catch (err: any) {
          delete win.__onPlayroomAdReward;
          resolve({
            rewarded: false,
            activityId,
            error: err?.message || 'Ad is not available right now. Please try again.',
          });
        }
      });
    }

    // 4. In Browser / Web Preview / Non-Android environment
    // STRICT RULE: Do NOT fake an ad, do NOT run a timer, and do NOT grant a reward.
    return {
      rewarded: false,
      activityId,
      error: 'Ad is not available right now. Rewarded video ads are available in the Android app build.',
    };
  }

  /**
   * Set custom AdMob Rewarded Ad Unit ID from AdMob Console
   */
  public setRewardedAdUnitId(unitId: string): void {
    if (unitId) {
      this.rewardedAdUnitId = unitId;
    }
  }

  public getRewardedAdUnitId(): string {
    return this.rewardedAdUnitId;
  }
}

export const adMobService = AdMobService.getInstance();
