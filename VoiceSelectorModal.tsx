import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Check, Sparkles, Play, Send } from 'lucide-react';
import { soundManager, VOICE_PERSONAS, VoicePersonaId, VoicePersona } from '../../utils/audio';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({ isOpen, onClose }) => {
  const [activePersonaId, setActivePersonaId] = useState<VoicePersonaId>(() => {
    return soundManager.getActivePersona().id;
  });
  const [previewingId, setPreviewingId] = useState<VoicePersonaId | null>(null);
  const [customTestText, setCustomTestText] = useState('Great job! You are so smart!');

  useEffect(() => {
    const handleVoiceChange = () => {
      setActivePersonaId(soundManager.getActivePersona().id);
    };
    window.addEventListener('playroom_voice_changed', handleVoiceChange);
    return () => {
      window.removeEventListener('playroom_voice_changed', handleVoiceChange);
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectPersona = (persona: VoicePersona) => {
    soundManager.playPop();
    setActivePersonaId(persona.id);
    soundManager.setVoicePersona(persona.id, true);
  };

  const handlePreview = (e: React.MouseEvent, personaId: VoicePersonaId) => {
    e.stopPropagation();
    soundManager.playPop();
    setPreviewingId(personaId);
    soundManager.previewVoice(personaId);
    setTimeout(() => {
      setPreviewingId((curr) => (curr === personaId ? null : curr));
    }, 2800);
  };

  const handleTestCustomSpeech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestText.trim()) return;
    soundManager.playPop();
    soundManager.speak(customTestText.trim());
  };

  return (
    <div
      id="voice-selector-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        id="voice-selector-modal-dialog"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border-4 border-amber-400 p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 my-auto relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                  Choose App Voice
                </h3>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-200">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Select your favorite voice narrator for games & activities
              </p>
            </div>
          </div>

          <button
            id="voice-selector-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close voice selector"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Voice Persona Options */}
        <div className="space-y-2.5">
          {VOICE_PERSONAS.map((persona) => {
            const isSelected = activePersonaId === persona.id;
            const isPreviewing = previewingId === persona.id;

            return (
              <div
                key={persona.id}
                id={`voice-option-${persona.id}`}
                onClick={() => handleSelectPersona(persona)}
                className={`relative rounded-2xl p-3.5 sm:p-4 border-3 transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/60 shadow-md'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Left: Avatar & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 shadow-inner ${
                      persona.id === 'girl_10' || persona.id === 'teen_girl'
                        ? 'bg-pink-100 border-pink-300'
                        : persona.id === 'boy_10' || persona.id === 'teen_boy'
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-emerald-100 border-emerald-300'
                    }`}
                  >
                    {persona.avatar}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm sm:text-base">
                        {persona.name}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          persona.id === 'girl_10' || persona.id === 'teen_girl'
                            ? 'bg-pink-100 text-pink-700 border-pink-200'
                            : persona.id === 'boy_10' || persona.id === 'teen_boy'
                            ? 'bg-blue-100 text-blue-700 border-blue-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {persona.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate sm:whitespace-normal">
                      {persona.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Audio Listen / Preview Sample Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePreview(e, persona.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isPreviewing
                        ? 'bg-purple-600 text-white border-purple-700 animate-pulse'
                        : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
                    }`}
                    title="Listen to sample audio"
                  >
                    <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="hidden sm:inline">{isPreviewing ? 'Playing...' : 'Sample'}</span>
                  </button>

                  {/* Selected Indicator */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                        : 'bg-white border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Voice Tester Input */}
        <div className="bg-slate-100/90 rounded-2xl p-3 border-2 border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Test Selected Voice</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Type any word to test</span>
          </div>

          <form onSubmit={handleTestCustomSpeech} className="flex items-center gap-2">
            <input
              type="text"
              value={customTestText}
              onChange={(e) => setCustomTestText(e.target.value)}
              placeholder="e.g. Great job! Letter A for Apple!"
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              maxLength={80}
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wide cursor-pointer flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Say It</span>
            </button>
          </form>
        </div>

        {/* Footer info & Done Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-semibold">
            ✨ Voice is automatically saved for all activities
          </p>

          <button
            id="voice-selector-done-btn"
            type="button"
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black rounded-xl text-xs uppercase tracking-wide cursor-pointer border-2 border-amber-500 shadow-sm active:translate-y-0.5 transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
