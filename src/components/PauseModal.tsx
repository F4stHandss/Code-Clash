import React from 'react';
import { Play, RotateCcw, Home, HelpCircle, Volume2, VolumeX, Music } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  onOpenHelp: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onMainMenu,
  onOpenHelp,
}) => {
  const [sfxOn, setSfxOn] = React.useState(soundManager.isSfxOn());
  const [bgmOn, setBgmOn] = React.useState(soundManager.isBgmOn());

  const toggleSfx = () => {
    const next = !sfxOn;
    soundManager.setSfxEnabled(next);
    setSfxOn(next);
  };

  const toggleBgm = () => {
    const next = !bgmOn;
    soundManager.setBgmEnabled(next);
    setBgmOn(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 text-center">
        {/* Header */}
        <div className="space-y-1">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            NETHERIUM OS • SYSTEM PAUSED
          </div>
          <h2 className="text-2xl font-black font-mono tracking-wider text-white">
            GAME DIJEDA
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Tekan ESC atau tombol di bawah untuk melanjutkan
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            id="btn-pause-resume"
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Play size={18} />
            <span>Lanjutkan Pertarungan</span>
          </button>

          <button
            id="btn-pause-restart"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} className="text-amber-400" />
            <span>Mulai Ulang Ronde (Restart)</span>
          </button>

          <button
            id="btn-pause-help"
            onClick={() => {
              soundManager.playClick();
              onOpenHelp();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle size={16} className="text-cyan-400" />
            <span>Lihat Panduan & Kontrol Tombol</span>
          </button>

          <button
            id="btn-pause-mainmenu"
            onClick={() => {
              soundManager.playClick();
              onMainMenu();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-850 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-300 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home size={16} className="text-red-400" />
            <span>Keluar ke Menu Utama</span>
          </button>
        </div>

        {/* Audio Quick Toggles */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-4">
          <button
            onClick={toggleSfx}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {sfxOn ? <Volume2 size={15} className="text-cyan-400" /> : <VolumeX size={15} className="text-red-400" />}
            <span>SFX: {sfxOn ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={toggleBgm}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <Music size={15} className={bgmOn ? 'text-emerald-400' : 'text-slate-500'} />
            <span>BGM: {bgmOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
