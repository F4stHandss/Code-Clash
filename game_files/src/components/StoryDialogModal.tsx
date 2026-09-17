import React, { useState } from 'react';
import { DialogueNode } from '../data/storyDialogue';
import { CHARACTERS } from '../data/characters';
import { ChevronRight, FastForward } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface StoryDialogModalProps {
  dialogues: DialogueNode[];
  onFinish: () => void;
  title?: string;
}

export const StoryDialogModal: React.FC<StoryDialogModalProps> = ({
  dialogues,
  onFinish,
  title,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const current = dialogues[currentIdx];

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < dialogues.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    soundManager.playClick();
    onFinish();
  };

  if (!current) return null;

  const charDef = current.charId !== 'system' && current.charId !== 'narrator' ? CHARACTERS[current.charId] : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end p-4 sm:p-8 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl mx-auto bg-slate-900/95 border-2 border-cyan-500/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.3)]">
        {/* Header bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold">{title || 'TRANSMISI PROTOKOL NETHERIUM'}</span>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <FastForward size={14} />
            <span>Lewati (Skip)</span>
          </button>
        </div>

        {/* Dialogue Box */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start">
          {/* Avatar Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-slate-700 bg-slate-950 flex flex-col items-center justify-center shrink-0 shadow-md">
            {charDef ? (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-xl text-slate-950"
                style={{ backgroundColor: charDef.accentColor }}
              >
                {charDef.name[0]}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-cyan-600 flex items-center justify-center font-mono font-bold text-slate-950">
                AI
              </div>
            )}
            <span className="text-[10px] font-mono text-slate-400 mt-1 truncate max-w-[64px]">
              {charDef?.element || 'System'}
            </span>
          </div>

          {/* Dialogue Text */}
          <div className="flex-1 space-y-2">
            <h4
              className="text-sm sm:text-base font-mono font-bold tracking-wide"
              style={{ color: charDef?.accentColor || '#38bdf8' }}
            >
              {current.speaker}
            </h4>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans min-h-[48px]">
              "{current.text}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{currentIdx + 1} / {dialogues.length}</span>
          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1 transition-all shadow-md"
          >
            <span>{currentIdx + 1 === dialogues.length ? 'Mulai Pertarungan' : 'Lanjut'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
