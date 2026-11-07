import React, { useState } from 'react';
import { useDeveloperMode } from '../../utils/devMode';
import { RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export const DeveloperModeToggle: React.FC = () => {
  const { isDeveloperMode: isDev, toggleDeveloperMode } = useDeveloperMode();
  const [minimized, setMinimized] = useState(false);

  const handleToggle = () => {
    soundManager.playPop();
    toggleDeveloperMode();
  };

  // Hidden from public users: renders nothing unless developer mode is
  // actively enabled. Developer mode itself is switched on ONLY via the
  // hidden footer gesture (tap the app footer 5 times) in App.tsx.
  // Default OFF; never shipped enabled.
  if (!isDev) {
    return null;
  }

  return (
    <aside
      id="dev-mode-indicator"
      aria-label="Development Mode Switcher"
      className="fixed bottom-3 left-3 z-40 print:hidden select-none font-sans"
    >
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="bg-slate-900/95 text-white text-[10px] font-black px-3 py-1.5 rounded-full border-2 border-indigo-500 shadow-2xl cursor-pointer"
        >
          Dev Mode
        </button>
      ) : (
        // DEVELOPER MODE ACTIVE UI (Discreet floating pill)
        <div className="flex items-center gap-2 bg-slate-900/95 text-white p-1.5 pl-3 pr-2 rounded-full border-2 border-indigo-500 shadow-2xl backdrop-blur-md transition-all hover:scale-105">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-[11px] font-black tracking-wide text-indigo-200 uppercase">
              Dev Mode (Full Access)
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            title="Switch to Public User Mode to test public locks"
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[10px] font-black px-2.5 py-1 rounded-full cursor-pointer transition shadow-xs"
          >
            <RefreshCw className="w-3 h-3 stroke-[2.5]" />
            <span>Test User Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMinimized(true)}
            title="Minimize dev mode indicator"
            className="text-slate-400 hover:text-white font-black px-1 cursor-pointer"
            aria-label="Minimize developer mode indicator"
          >
            ×
          </button>
        </div>
      )}
    </aside>
  );
};
