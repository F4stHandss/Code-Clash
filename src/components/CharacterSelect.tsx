import React, { useState } from 'react';
import { CharacterId, Difficulty, GameMode } from '../types/game';
import { CHARACTERS, ARENAS } from '../data/characters';
import { soundManager } from '../audio/soundManager';
import { Play, ArrowLeft, Shield, Swords, Zap, Activity } from 'lucide-react';
import { StickmanPreviewCanvas } from './StickmanPreviewCanvas';

interface CharacterSelectProps {
  mode: GameMode;
  onBack: () => void;
  onStartBattle: (
    p1Char: CharacterId,
    p2Char: CharacterId,
    arenaId: string,
    difficulty: Difficulty
  ) => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  mode,
  onBack,
  onStartBattle,
}) => {
  const charList: CharacterId[] = ['var', 'loop', 'func', 'array', 'bug'];

  const [p1Selection, setP1Selection] = useState<CharacterId>('var');
  const [p2Selection, setP2Selection] = useState<CharacterId>(mode === 'story' ? 'loop' : 'bug');
  const [selectedArena, setSelectedArena] = useState<string>('server_room');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [activeTab, setActiveTab] = useState<'p1' | 'p2'>('p1');

  const selectedChar = activeTab === 'p1' ? CHARACTERS[p1Selection] : CHARACTERS[p2Selection];

  const handleSelect = (id: CharacterId) => {
    soundManager.playClick();
    if (activeTab === 'p1') {
      setP1Selection(id);
      if (mode === 'versus_2p') {
        setActiveTab('p2');
      }
    } else {
      setP2Selection(id);
    }
  };

  const handleStart = () => {
    soundManager.playRoundStart();
    onStartBattle(p1Selection, p2Selection, selectedArena, difficulty);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors text-xs sm:text-sm font-mono"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-2xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
            {mode === 'story'
              ? 'PILIH GUARDIAN PROGRAM'
              : mode === 'versus_2p'
              ? 'PILIH PETARUNG 2P'
              : 'PILIH KARAKTER'}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
            {mode === 'story'
              ? 'Pilih Guardian untuk menyelamatkan Netherium'
              : mode === 'versus_2p'
              ? `Sedang memilih: ${activeTab === 'p1' ? 'Pemain 1 (P1)' : 'Pemain 2 (P2)'}`
              : 'Pilih jagoanmu dan hadapi lawan!'}
          </p>
        </div>

        {mode === 'versus_2p' && (
          <div className="flex gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('p1')}
              className={`px-3 py-1 rounded border ${
                activeTab === 'p1'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              P1: {CHARACTERS[p1Selection].name}
            </button>
            <button
              onClick={() => setActiveTab('p2')}
              className={`px-3 py-1 rounded border ${
                activeTab === 'p2'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              P2: {CHARACTERS[p2Selection].name}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Character Cards & Character Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 max-w-6xl mx-auto w-full">
        {/* Left: Character Selection Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Daftar Guardian & Virus ({activeTab.toUpperCase()})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {charList.map((id) => {
              const char = CHARACTERS[id];
              const isSelected = activeTab === 'p1' ? p1Selection === id : p2Selection === id;
              const isOtherSelected = activeTab === 'p1' ? p2Selection === id : p1Selection === id;

              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-36 sm:h-40 ${
                    isSelected
                      ? 'bg-slate-900 border-2 shadow-lg scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
                  }`}
                  style={{
                    borderColor: isSelected ? char.accentColor : undefined,
                    boxShadow: isSelected ? `0 0 20px ${char.glowColor}` : undefined,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-black text-slate-950 shadow-md leading-none"
                      style={{ backgroundColor: char.accentColor }}
                    >
                      <span className="text-[10px]">웃</span>
                      <span className="text-xs">{char.name[0]}</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-cyan-400 text-slate-950">
                        {activeTab.toUpperCase()}
                      </span>
                    )}
                    {isOtherSelected && !isSelected && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {activeTab === 'p1' ? 'P2' : 'P1'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-base font-mono text-white">{char.name}</h3>
                    <div className="text-xs text-slate-400 font-mono">{char.element}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-1">{char.role}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Arena & Difficulty Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Arena select */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3">
              <label className="text-xs font-mono text-slate-400 block mb-1.5">PILIH ARENA</label>
              <div className="space-y-1.5">
                {ARENAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArena(a.id)}
                    className={`w-full p-2 rounded text-left text-xs font-mono transition-colors flex items-center justify-between ${
                      selectedArena === a.id
                        ? 'bg-cyan-950/80 border border-cyan-500/80 text-cyan-200'
                        : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{a.name}</span>
                    <span className="text-[10px] opacity-60 truncate ml-2">{a.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Difficulty (if vs CPU) */}
            {mode === 'versus_ai' && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5">TINGKAT KESULITAN AI</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`p-2 rounded text-center text-xs font-mono capitalize transition-colors ${
                          difficulty === d
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {d === 'easy' ? 'Mudah' : d === 'normal' ? 'Normal' : 'Sulit'}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-2">
                  AI akan mengelola serangan combo dan timing block sesuai level.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Character Detailed Profile */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span
                  className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${selectedChar.accentColor}20`,
                    color: selectedChar.accentColor,
                  }}
                >
                  {selectedChar.element.toUpperCase()} • STICKMAN
                </span>
                <h3 className="text-2xl font-black font-mono mt-1 text-white">{selectedChar.name}</h3>
                <p className="text-xs text-slate-400 italic">"{selectedChar.tagline}"</p>
              </div>
            </div>

            {/* Stickman Live Animated Preview & Move Tester */}
            <StickmanPreviewCanvas characterId={selectedChar.id} />

            {/* Lore */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedChar.lore}</p>

            {/* Base Stats */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Parameter Algoritma
              </span>

              {/* Speed */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity size={12} /> Kecepatan (Speed)
                  </span>
                  <span className="font-bold text-cyan-400">{selectedChar.baseStats.speed} / 10</span>
                </div>
                <div className="h-2 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${selectedChar.baseStats.speed * 10}%` }}
                  />
                </div>
              </div>

              {/* Power */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Swords size={12} /> Kekuatan Hantaman (Power)
                  </span>
                  <span className="font-bold text-amber-400">{selectedChar.baseStats.power} / 10</span>
                </div>
                <div className="h-2 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${selectedChar.baseStats.power * 10}%` }}
                  />
                </div>
              </div>

              {/* Defense */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Shield size={12} /> Pertahanan (Defense)
                  </span>
                  <span className="font-bold text-emerald-400">{selectedChar.baseStats.defense} / 10</span>
                </div>
                <div className="h-2 bg-slate-950 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${selectedChar.baseStats.defense * 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Moves Description */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1">
                  <span>Jurus Spesial: {selectedChar.specialName}</span>
                  <span className="text-[10px] text-slate-500 font-normal">(-40 Stamina)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{selectedChar.specialDescription}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/40">
                <div className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                  <Zap size={12} />
                  <span>Ultimate Move: {selectedChar.ultimateName}</span>
                  <span className="text-[10px] text-amber-500/80 font-normal">(1 Debug Token)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{selectedChar.ultimateDescription}</p>
              </div>
            </div>
          </div>

          {/* Fight Button */}
          <button
            id="btn-start-fight"
            onClick={handleStart}
            className="w-full py-3.5 mt-4 rounded-xl font-mono font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            <Play size={18} fill="currentColor" />
            <span>Mulai Pertarungan!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
