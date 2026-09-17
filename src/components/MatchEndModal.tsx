import React from 'react';
import { Fighter } from '../game/fighter';
import { Trophy, RotateCcw, Home, ArrowRight, Skull } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface MatchEndModalProps {
  winner: 1 | 2 | 'draw';
  p1: Fighter;
  p2: Fighter;
  p1Wins: number;
  p2Wins: number;
  isStoryMode?: boolean;
  hasNextChapter?: boolean;
  onNextChapter?: () => void;
  onRematch: () => void;
  onSelectCharacter: () => void;
  onMainMenu: () => void;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({
  winner,
  p1,
  p2,
  p1Wins,
  p2Wins,
  isStoryMode,
  hasNextChapter,
  onNextChapter,
  onRematch,
  onSelectCharacter,
  onMainMenu,
}) => {
  const isP1Win = winner === 1;
  const isDraw = winner === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl text-slate-100 text-center p-6 space-y-5">
        {/* Victory / Defeat Icon & Badge */}
        <div className="flex flex-col items-center justify-center space-y-2">
          {isP1Win ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Trophy size={32} />
            </div>
          ) : isDraw ? (
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center">
              <RotateCcw size={32} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.5)]">
              <Skull size={32} />
            </div>
          )}

          <h2
            className={`text-2xl sm:text-3xl font-black font-mono tracking-wider ${
              isP1Win ? 'text-emerald-400' : isDraw ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {isP1Win ? 'KEMENANGAN TELAK!' : isDraw ? 'HASIL IMBANG (DRAW)' : 'TERELIMINASI (K.O.)'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            {isP1Win
              ? `${p1.character.name} berhasil membersihkan bug sistem!`
              : `${p2.character.name} mendominasi ronde pertarungan.`}
          </p>
        </div>

        {/* Score Board */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-around font-mono">
          <div>
            <div className="text-xs text-cyan-400 font-bold">{p1.character.name} (P1)</div>
            <div className="text-3xl font-black text-white mt-1">{p1Wins}</div>
          </div>

          <div className="text-sm text-slate-500 font-bold">SKOR AKHIR</div>

          <div>
            <div className="text-xs text-rose-400 font-bold">{p2.character.name} (P2)</div>
            <div className="text-3xl font-black text-white mt-1">{p2Wins}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {isStoryMode && isP1Win && hasNextChapter && onNextChapter && (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextChapter();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-mono font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer text-sm"
            >
              <span>Lanjut ke Sektor Berikutnya</span>
              <ArrowRight size={18} />
            </button>
          )}

          <button
            id="btn-rematch"
            onClick={() => {
              soundManager.playClick();
              onRematch();
            }}
            className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
          >
            <RotateCcw size={16} />
            <span>Tanding Ulang (Rematch)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectCharacter();
              }}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition-colors cursor-pointer"
            >
              Pilih Karakter
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onMainMenu();
              }}
              className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <Home size={14} />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
