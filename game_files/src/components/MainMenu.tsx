import React, { useState } from 'react';
import { GameMode } from '../types/game';
import { soundManager } from '../audio/soundManager';
import { Play, Swords, Users, Dumbbell, BookOpen, HelpCircle, Volume2, VolumeX, Music, FolderArchive, Download, CheckCircle2, X, FileCode } from 'lucide-react';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenQuizLibrary: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenHelp,
  onOpenQuizLibrary,
}) => {
  const [sfxOn, setSfxOn] = React.useState(soundManager.isSfxOn());
  const [bgmOn, setBgmOn] = React.useState(soundManager.isBgmOn());
  const [showFileModal, setShowFileModal] = useState(false);

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

  const handleMode = (mode: GameMode) => {
    soundManager.playClick();
    onSelectMode(mode);
  };

  return (
    <div className="fixed inset-0 z-30 bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans overflow-y-auto">
      {/* Background Cyber Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Top Utilities */}
      <div className="relative z-10 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
            NETHERIUM OS v4.0.0
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            • RPL Fighting Game
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSfx}
            className="p-2 bg-slate-900/85 border border-slate-800 hover:border-cyan-500 rounded-lg text-slate-300 hover:text-cyan-300 text-xs transition-colors"
            title="Toggle SFX"
          >
            {sfxOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
          </button>
          <button
            onClick={toggleBgm}
            className="p-2 bg-slate-900/85 border border-slate-800 hover:border-cyan-500 rounded-lg text-slate-300 hover:text-cyan-300 text-xs transition-colors"
            title="Toggle Music"
          >
            <Music size={16} className={bgmOn ? 'text-emerald-400' : 'text-slate-500'} />
          </button>
        </div>
      </div>

      {/* Center Brand & Mode Cards */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-8 text-center space-y-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/40 text-cyan-300 mb-2">
            PROYEK UKK / GAME EDUKASI LOGIKA PEMROGRAMAN
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            CODE CLASH
          </h1>
          <h2 className="text-lg sm:text-2xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 tracking-wider">
            BATTLE OF LOGIC
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-sans">
            Kendalikan Guardian Program (Var, Loop, Func, Array) dan basmi Virus Bug yang mengancam kota digital Netherium dengan kecakapan kombo fisik & logika algoritma!
          </p>
        </div>

        {/* Menu Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto text-left pt-2">
          {/* Story Mode */}
          <button
            id="btn-mode-story"
            onClick={() => handleMode('story')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-slate-850 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">
                <Play size={18} className="text-cyan-400" />
                <span>Petualangan Netherium (Story)</span>
              </div>
              <p className="text-xs text-slate-400">
                Taklukkan 3 sektor korup dan hadapi Boss Virus BUG dengan alur cerita.
              </p>
            </div>
          </button>

          {/* 1P vs CPU */}
          <button
            id="btn-mode-ai"
            onClick={() => handleMode('versus_ai')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-400 hover:bg-slate-850 hover:shadow-[0_0_20px_rgba(20,184,166,0.25)] transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-white group-hover:text-teal-400 transition-colors">
                <Swords size={18} className="text-teal-400" />
                <span>1 Player vs CPU (Versus AI)</span>
              </div>
              <p className="text-xs text-slate-400">
                Pilih karakter dan tantang AI komputer dengan pilihan tingkat kesulitan.
              </p>
            </div>
          </button>

          {/* 2P Local (1 Keyboard) */}
          <button
            id="btn-mode-2p"
            onClick={() => handleMode('versus_2p')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-400 hover:bg-slate-850 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-white group-hover:text-purple-400 transition-colors">
                <Users size={18} className="text-purple-400" />
                <span>2 Player (1 Keyboard Berbagi)</span>
              </div>
              <p className="text-xs text-slate-400">
                Tanding 1 vs 1 bersama teman di satu layar PC / laptop secara offline.
              </p>
            </div>
          </button>

          {/* Training Mode */}
          <button
            id="btn-mode-training"
            onClick={() => handleMode('training')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-850 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all group cursor-pointer flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono font-bold text-white group-hover:text-amber-400 transition-colors">
                <Dumbbell size={18} className="text-amber-400" />
                <span>Debug Dojo (Latihan Kombo)</span>
              </div>
              <p className="text-xs text-slate-400">
                Uji coba hitboxes, stamina drain, jurus spesial, dan latihan gerakan.
              </p>
            </div>
          </button>
        </div>

        {/* Secondary Links */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            id="btn-open-quiz-lib"
            onClick={() => {
              soundManager.playClick();
              onOpenQuizLibrary();
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen size={16} className="text-cyan-400" />
            <span>Bank Soal Logika (20+ Soal)</span>
          </button>

          <button
            id="btn-open-guide"
            onClick={() => {
              soundManager.playClick();
              onOpenHelp();
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <HelpCircle size={16} className="text-cyan-400" />
            <span>Panduan Kontrol</span>
          </button>

          <button
            id="btn-open-file-package"
            onClick={() => {
              soundManager.playClick();
              setShowFileModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FolderArchive size={16} className="text-cyan-400" />
            <span>Folder File Game</span>
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-center text-[11px] font-mono text-slate-500 max-w-xl mx-auto w-full pt-4 border-t border-slate-900">
        Dirancang khusus untuk siswa Rekayasa Perangkat Lunak (RPL) • Netherium Cyber Logic Engine
      </div>

      {/* File & Folder Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700 text-cyan-400">
                  <FolderArchive size={20} />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-white text-base">Folder & File Game Code Clash</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Direktori: /game_files/ & /public/</p>
                </div>
              </div>
              <button
                onClick={() => setShowFileModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Folder Siap Digunakan:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc font-mono text-[11px] text-slate-300">
                  <li>
                    <span className="text-cyan-400 font-bold">game_files/game_build/</span>: File kompilasi web statis siap buka di browser.
                  </li>
                  <li>
                    <span className="text-cyan-400 font-bold">game_files/src/</span>: Source code lengkap React, canvas stickman, dan audio.
                  </li>
                  <li>
                    <span className="text-cyan-400 font-bold">game_files/README.md</span>: Panduan instalasi dan petunjuk tombol.
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-200 font-mono font-semibold text-[11px]">
                  <FileCode size={14} className="text-purple-400" />
                  <span>Cara Jalankan Offline di PC / Laptop:</span>
                </div>
                <p className="text-slate-400 text-[11px] font-mono leading-relaxed">
                  Ekstrak file atau jalankan <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm install</code> lalu <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">npm run dev</code> di dalam folder <code className="text-slate-200">game_files</code>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href="/code_clash_game_files.tar.gz"
                download="code_clash_game_files.tar.gz"
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Download size={16} />
                <span>Unduh Arsip (.tar.gz)</span>
              </a>
              <button
                onClick={() => setShowFileModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-medium text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
