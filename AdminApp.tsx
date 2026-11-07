/**
 * PlayBloom Admin — developer preview ONLY (rewritten 2026-11-07).
 *
 * The old admin panel is gone: no Supabase Auth login, no schools,
 * no school requests, no license generation, no payment requests,
 * no renewals, no disputes, no complaints, no feedback admin,
 * no notifications. All of those belonged to the removed license-key
 * system.
 *
 * This screen has exactly one job: let the owner (Ramsha Shaikh) view
 * the unlocked version of the app. Flipping the switch turns on
 * developer mode (localStorage `playroom_developer_mode_active`),
 * which unlocks all activities and the Educator Hub in the main app.
 * It is OFF by default and is never enabled for end users.
 */
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { isDeveloperMode, setDeveloperMode } from '../utils/devMode';

export const AdminApp: React.FC = () => {
  const [devModeOn, setDevModeOn] = useState<boolean>(() => isDeveloperMode());

  useEffect(() => {
    const sync = () => setDevModeOn(isDeveloperMode());
    window.addEventListener('playroom_dev_mode_change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('playroom_dev_mode_change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleToggle = (next: boolean) => {
    setDeveloperMode(next);
    setDevModeOn(next);
  };

  const openApp = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">PlayBloom — Developer Preview</h1>
            <p className="text-xs text-slate-400 font-semibold">Owner-only screen. No login, no admin data.</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          The old admin panel (schools, license keys, payment requests, renewals,
          complaints and feedback) was removed with the license system. Schools now
          subscribe through Google Play (Rs 50,000/month) and there is nothing to
          approve by hand. This screen only lets you preview the app as if
          everything were unlocked, so you can check the activities and the
          Educator Hub before a release.
        </p>

        <div className="flex items-center justify-between gap-4 bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            {devModeOn ? (
              <Eye className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <EyeOff className="w-6 h-6 text-slate-400 shrink-0" />
            )}
            <div>
              <p className="font-bold text-sm">View unlocked version</p>
              <p className="text-xs text-slate-400">
                {devModeOn
                  ? 'ON — the app is fully unlocked on this device.'
                  : 'OFF — the app shows the normal locked/free experience.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={devModeOn}
            aria-label="View unlocked version"
            onClick={() => handleToggle(!devModeOn)}
            className={`relative w-14 h-8 rounded-full transition-colors shrink-0 cursor-pointer ${
              devModeOn ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                devModeOn ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {devModeOn && (
          <p className="text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2">
            Developer mode is ON. Open the app below to see everything unlocked.
            Turn it OFF when you are done — it is stored only on this device.
          </p>
        )}

        <button
          type="button"
          onClick={openApp}
          className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl text-sm font-black uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Open the app
        </button>

        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Developer preview is a local switch on this device only. It is never
          enabled for children or parents using the Play Store app.
        </p>
      </div>
    </div>
  );
};
