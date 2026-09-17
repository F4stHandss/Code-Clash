import React from 'react';
import { Fighter } from '../game/fighter';
import { GameMode } from '../types/game';
import { Volume2, VolumeX, Music, Pause, HelpCircle, Shield, Zap, Keyboard } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface FightHudProps {
  p1: Fighter;
  p2: Fighter;
  roundTimer: number;
  currentRound: number;
  p1Wins: number;
  p2Wins: number;
  maxRounds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenHelp: () => void;
  isTraining?: boolean;
  mode?: GameMode;
}

export const FightHud: React.FC<FightHudProps> = ({
  p1,
  p2,
  roundTimer,
  currentRound,
  p1Wins,
  p2Wins,
  isPaused,
  onTogglePause,
  onOpenHelp,
  isTraining,
  mode,
}) => {
  const [sfxOn, setSfxOn] = React.useState(soundManager.isSfxOn());
  const [bgmOn, setBgmOn] = React.useState(soundManager.isBgmOn());
  const [show2PHint, setShow2PHint] = React.useState(true);

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
    <div id="fight-hud" className="absolute inset-x-0 top-0 p-3 sm:p-5 pointer-events-none z-20 select-none">
      {/* Top Utility Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="btn-toggle-sfx"
            onClick={toggleSfx}
            className="p-1.5 bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded text-xs flex items-center gap-1 transition-colors"
            title="Toggle Sound Effects"
          >
            {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
          </button>
          <button
            id="btn-toggle-bgm"
            onClick={toggleBgm}
            className="p-1.5 bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded text-xs flex items-center gap-1 transition-colors"
            title="Toggle Music"
          >
            <Music size={16} className={bgmOn ? 'text-emerald-400' : 'text-slate-500'} />
          </button>
          <button
            id="btn-open-help"
            onClick={onOpenHelp}
            className="p-1.5 bg-slate-900/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 rounded text-xs flex items-center gap-1 transition-colors"
            title="Bantuan & Kontrol"
          >
            <HelpCircle size={16} />
            <span className="hidden sm:inline">Kontrol</span>
          </button>
        </div>

        {/* Training Mode Badge */}
        {isTraining && (
          <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1 rounded text-xs font-mono font-bold">
            [ DEBUG DOJO - MODE LATIHAN ]
          </div>
        )}

        <button
          id="btn-pause-game"
          onClick={onTogglePause}
          className="pointer-events-auto p-1.5 bg-slate-900/80 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-300 rounded text-xs flex items-center gap-1 transition-colors"
        >
          <Pause size={16} />
          <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      </div>

      {/* Main HUD Bar */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        {/* P1 Health & Stamina */}
        <div className="col-span-5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide text-cyan-400 drop-shadow">{p1.character.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-200">
                {p1.character.element}
              </span>
            </div>
            <span className="text-slate-300 font-semibold">{Math.ceil(p1.hp)} / 100</span>
          </div>

          {/* HP Bar */}
          <div className="h-5 sm:h-6 bg-slate-950/90 rounded border border-slate-700 p-0.5 overflow-hidden relative shadow-inner">
            <div
              className={`h-full transition-all duration-150 rounded-sm ${
                p1.hp > 50
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
                  : p1.hp > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, p1.hp)}%` }}
            />
            {p1.isLagged && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-red-300 bg-red-950/60 animate-pulse">
                ! LAG / MEMORY LEAK !
              </span>
            )}
          </div>

          {/* Stamina & Tokens */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 sm:h-2.5 bg-slate-950 rounded border border-slate-800 p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-sm transition-all"
                style={{ width: `${Math.max(0, p1.stamina)}%` }}
              />
            </div>
            {/* Debug Tokens Badges */}
            <div className="flex items-center gap-1" title="Debug Tokens (Ultimate Move)">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                    idx < p1.debugTokens
                      ? 'bg-amber-400 border-amber-300 text-slate-900 font-bold shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
                >
                  <Zap size={9} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Timer & Round indicators */}
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            {/* P1 win gems */}
            <div
              className={`w-2.5 h-2.5 rounded-sm border ${
                p1Wins >= 1 ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-800 border-slate-700'
              }`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-sm border ${
                p1Wins >= 2 ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-800 border-slate-700'
              }`}
            />
            <span className="text-[10px] font-mono text-slate-400 px-1">R{currentRound}</span>
            {/* P2 win gems */}
            <div
              className={`w-2.5 h-2.5 rounded-sm border ${
                p2Wins >= 1 ? 'bg-rose-500 border-rose-400 shadow-[0_0_6px_#f43f5e]' : 'bg-slate-800 border-slate-700'
              }`}
            />
            <div
              className={`w-2.5 h-2.5 rounded-sm border ${
                p2Wins >= 2 ? 'bg-rose-500 border-rose-400 shadow-[0_0_6px_#f43f5e]' : 'bg-slate-800 border-slate-700'
              }`}
            />
          </div>

          {/* Big Timer */}
          <div
            className={`font-mono text-2xl sm:text-3xl font-black px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 shadow-md ${
              roundTimer <= 10 ? 'text-red-400 animate-pulse border-red-500/50' : 'text-amber-300'
            }`}
          >
            {isTraining ? '∞' : Math.ceil(roundTimer)}
          </div>
        </div>

        {/* P2 Health & Stamina */}
        <div className="col-span-5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse">
              <span className="font-bold tracking-wide text-rose-400 drop-shadow">
                {p2.character.name} {p2.isAi && <span className="text-[10px] text-slate-400">(CPU)</span>}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-200">
                {p2.character.element}
              </span>
            </div>
            <span className="text-slate-300 font-semibold">{Math.ceil(p2.hp)} / 100</span>
          </div>

          {/* HP Bar */}
          <div className="h-5 sm:h-6 bg-slate-950/90 rounded border border-slate-700 p-0.5 overflow-hidden relative shadow-inner">
            <div
              className={`h-full transition-all duration-150 rounded-sm ml-auto ${
                p2.hp > 50
                  ? 'bg-gradient-to-l from-rose-500 to-pink-500'
                  : p2.hp > 25
                  ? 'bg-gradient-to-l from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-l from-red-600 to-rose-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(0, p2.hp)}%` }}
            />
            {p2.isLagged && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-red-300 bg-red-950/60 animate-pulse">
                ! LAG / MEMORY LEAK !
              </span>
            )}
          </div>

          {/* Stamina & Tokens */}
          <div className="flex items-center gap-2 flex-row-reverse">
            <div className="flex-1 h-2 sm:h-2.5 bg-slate-950 rounded border border-slate-800 p-0.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-rose-400 to-purple-500 rounded-sm transition-all ml-auto"
                style={{ width: `${Math.max(0, p2.stamina)}%` }}
              />
            </div>
            {/* Debug Tokens Badges */}
            <div className="flex items-center gap-1" title="Debug Tokens (Ultimate Move)">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                    idx < p2.debugTokens
                      ? 'bg-amber-400 border-amber-300 text-slate-900 font-bold shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'bg-slate-900 border-slate-700 text-slate-600'
                  }`}
                >
                  <Zap size={9} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2P Versus Controls Quick Banner */}
      {mode === 'versus_2p' && show2PHint && (
        <div className="mt-2.5 max-w-4xl mx-auto pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg p-2 text-[10px] sm:text-xs font-mono shadow-lg flex flex-col sm:flex-row items-center justify-between gap-1.5 animate-fade-in">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <span className="px-1 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[9px]">P1</span>
              <span>[W,A,S,D] Gerak • [J] Pukul • [K] Tendang • [L] Block • [Spasi] Spesial • [U] Ulti</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <span className="px-1 py-0.5 rounded bg-rose-950 border border-rose-800 text-[9px]">P2</span>
              <span>[Panah Kiri/Kanan/Atas/Bawah] Gerak • [/ / Num1] Pukul • [. / Num2] Tendang • [M / Num3] Block • [Enter] Spesial • [Shift] Ulti</span>
            </span>
          </div>
          <button
            onClick={() => setShow2PHint(false)}
            className="text-[10px] text-slate-500 hover:text-slate-300 ml-auto whitespace-nowrap"
            title="Tutup banner bantuan kontrol"
          >
            ✕ Tutup
          </button>
        </div>
      )}
    </div>
  );
};
