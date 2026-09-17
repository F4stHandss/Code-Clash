import React from 'react';
import { X, Keyboard, Zap, Shield, BookOpen, AlertTriangle } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="text-cyan-400" size={20} />
            <h3 className="font-mono font-bold text-base text-white">
              PANDUAN KONTROL & ATURAN GAME
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Controls Tables */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Keyboard size={16} />
              <span>Pemetaan Keyboard (1 Player & 2 Player)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Player 1 Controls */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                <span className="font-mono font-bold text-cyan-300 block mb-1">
                  Pemain 1 (P1)
                </span>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Gerak Kiri / Kanan</span>
                  <span className="font-mono text-cyan-200">A / D</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Lompat / Jongkok</span>
                  <span className="font-mono text-cyan-200">W / S</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Light Attack (-5 HP)</span>
                  <span className="font-mono text-cyan-200">J</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Heavy Attack (-12 HP)</span>
                  <span className="font-mono text-cyan-200">K</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Block / Bertahan</span>
                  <span className="font-mono text-cyan-200">L</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Jurus Spesial (-20 HP)</span>
                  <span className="font-mono text-cyan-200">Spasi</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Ultimate Move (-35 HP)</span>
                  <span className="font-mono text-amber-300 font-bold">U</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jeda / Pause Game</span>
                  <span className="font-mono text-emerald-300 font-bold">ESC</span>
                </div>
              </div>

              {/* Player 2 Controls (Local Versus) */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                <span className="font-mono font-bold text-rose-300 block mb-1">
                  Pemain 2 (P2 - Keyboard Bagian Kanan)
                </span>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Gerak Kiri / Kanan</span>
                  <span className="font-mono text-rose-200">Panah Kiri / Kanan (atau Numpad 4/6)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Lompat / Jongkok</span>
                  <span className="font-mono text-rose-200">Panah Atas / Bawah (atau Numpad 8/2)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Pukul (Light Attack)</span>
                  <span className="font-mono text-rose-200">Tombol / atau Numpad 1</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Tendang (Heavy Attack)</span>
                  <span className="font-mono text-rose-200">Tombol . atau Numpad 5</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Bertahan (Block)</span>
                  <span className="font-mono text-rose-200">Tombol M atau Numpad 3</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">Jurus Spesial</span>
                  <span className="font-mono text-rose-200">Enter atau Numpad 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ultimate Move</span>
                  <span className="font-mono text-amber-300 font-bold">Shift Kanan / Tombol \</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gameplay Rules */}
          <div className="space-y-2">
            <h4 className="font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={16} />
              <span>Sistem Darah (HP) & Stamina</span>
            </h4>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-slate-300">
              <p>
                • <strong className="text-white">Format Match:</strong> Best of 3 Ronde (menang 2 ronde = memenangkan match). Waktu per ronde 60 detik.
              </p>
              <p>
                • <strong className="text-white">Stamina:</strong> Maksimal 100. Light Attack memakai 5 stamina, Heavy Attack memakai 15 stamina, dan Jurus Spesial memakai 40 stamina. Bertahan (Block) mengurangi 85% damage tetapi menguras stamina.
              </p>
            </div>
          </div>

          {/* Lag / Freeze System */}
          <div className="p-3.5 bg-red-950/30 rounded-lg border border-red-500/40 space-y-1.5">
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
              <AlertTriangle size={18} />
              <span>SISTEM LAG / MEMORY FREEZE (PENTING!)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Jika stamina pemain habis sampai <strong className="text-red-300">0</strong>, karakter akan masuk ke kondisi <strong className="text-red-300">"LAG / FREEZE"</strong> selama 1 detik! Karakter tidak bisa bergerak atau menyerang, dan sangat rentan diserang musuh. Konsep ini merepresentasikan <em>bottleneck / memory leak</em> pada komputer — ajaran penting untuk mengelola resource!
            </p>
          </div>

          {/* Logic Quiz & Debug Tokens */}
          <div className="p-3.5 bg-amber-950/30 rounded-lg border border-amber-500/40 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold">
              <Zap size={18} />
              <span>CHECKPOINT LOGIKA & DEBUG TOKEN</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Sebelum ronde ke-2 dan ke-3 dimulai, akan muncul <strong className="text-amber-300">1 pertanyaan logika pemrograman</strong> (waktu 10 detik). Jawaban benar memberikan <strong className="text-emerald-400">+20 Stamina</strong> dan <strong className="text-amber-400">+1 Debug Token</strong> yang bisa digunakan untuk melancarkan serangan dahsyat <strong className="text-white">Ultimate Move</strong>!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg font-mono text-xs sm:text-sm shadow-md"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
