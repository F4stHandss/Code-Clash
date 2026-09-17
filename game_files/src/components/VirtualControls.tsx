import React from 'react';
import { Fighter } from '../game/fighter';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Shield, Zap } from 'lucide-react';

interface VirtualControlsProps {
  player: Fighter;
  onLightAttack: () => void;
  onHeavyAttack: () => void;
  onSpecialAttack: () => void;
  onUltimateAttack: () => void;
  onStartBlock: () => void;
  onStopBlock: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onStopMove: () => void;
  onJump: () => void;
  onCrouch: () => void;
  onStopCrouch: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  player,
  onLightAttack,
  onHeavyAttack,
  onSpecialAttack,
  onUltimateAttack,
  onStartBlock,
  onStopBlock,
  onMoveLeft,
  onMoveRight,
  onStopMove,
  onJump,
  onCrouch,
  onStopCrouch,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-2 px-3 sm:px-6 pointer-events-none z-20 select-none flex justify-between items-end">
      {/* D-Pad / Movement */}
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        <button
          id="btn-ctrl-jump"
          onMouseDown={onJump}
          onTouchStart={onJump}
          className="w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/85 active:bg-cyan-500/40 border border-slate-700 active:border-cyan-400 rounded-lg flex flex-col items-center justify-center text-slate-200 active:text-cyan-300 shadow-md backdrop-blur-sm"
          title="Jump (W / Up)"
        >
          <ArrowUp size={20} />
          <span className="text-[9px] font-mono text-slate-400 font-semibold">W</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            id="btn-ctrl-left"
            onMouseDown={onMoveLeft}
            onMouseUp={onStopMove}
            onMouseLeave={onStopMove}
            onTouchStart={onMoveLeft}
            onTouchEnd={onStopMove}
            className="w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/85 active:bg-cyan-500/40 border border-slate-700 active:border-cyan-400 rounded-lg flex flex-col items-center justify-center text-slate-200 active:text-cyan-300 shadow-md backdrop-blur-sm"
            title="Move Left (A / Left)"
          >
            <ArrowLeft size={20} />
            <span className="text-[9px] font-mono text-slate-400 font-semibold">A</span>
          </button>

          <button
            id="btn-ctrl-crouch"
            onMouseDown={onCrouch}
            onMouseUp={onStopCrouch}
            onMouseLeave={onStopCrouch}
            onTouchStart={onCrouch}
            onTouchEnd={onStopCrouch}
            className="w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/85 active:bg-cyan-500/40 border border-slate-700 active:border-cyan-400 rounded-lg flex flex-col items-center justify-center text-slate-200 active:text-cyan-300 shadow-md backdrop-blur-sm"
            title="Crouch (S / Down)"
          >
            <ArrowDown size={20} />
            <span className="text-[9px] font-mono text-slate-400 font-semibold">S</span>
          </button>

          <button
            id="btn-ctrl-right"
            onMouseDown={onMoveRight}
            onMouseUp={onStopMove}
            onMouseLeave={onStopMove}
            onTouchStart={onMoveRight}
            onTouchEnd={onStopMove}
            className="w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/85 active:bg-cyan-500/40 border border-slate-700 active:border-cyan-400 rounded-lg flex flex-col items-center justify-center text-slate-200 active:text-cyan-300 shadow-md backdrop-blur-sm"
            title="Move Right (D / Right)"
          >
            <ArrowRight size={20} />
            <span className="text-[9px] font-mono text-slate-400 font-semibold">D</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pointer-events-auto flex items-end gap-1.5 sm:gap-2">
        {/* Block Button */}
        <button
          id="btn-ctrl-block"
          onMouseDown={onStartBlock}
          onMouseUp={onStopBlock}
          onMouseLeave={onStopBlock}
          onTouchStart={onStartBlock}
          onTouchEnd={onStopBlock}
          className="w-11 h-11 sm:w-13 sm:h-13 bg-slate-900/90 active:bg-blue-600/50 border border-blue-500/60 rounded-xl flex flex-col items-center justify-center text-blue-300 shadow-md backdrop-blur-sm"
          title="Block (L)"
        >
          <Shield size={18} />
          <span className="text-[9px] font-mono font-bold">L (Block)</span>
        </button>

        {/* Light Attack */}
        <button
          id="btn-ctrl-light"
          onClick={onLightAttack}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-950/90 active:bg-cyan-500 border border-cyan-500/60 rounded-xl flex flex-col items-center justify-center text-cyan-300 active:text-slate-950 shadow-md backdrop-blur-sm transition-all"
          title="Light Attack (J)"
        >
          <span className="text-xs font-bold font-mono">LIGHT</span>
          <span className="text-[9px] font-mono text-slate-400 font-semibold">J (-5 Stm)</span>
        </button>

        {/* Heavy Attack */}
        <button
          id="btn-ctrl-heavy"
          onClick={onHeavyAttack}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-950/90 active:bg-amber-500 border border-amber-500/60 rounded-xl flex flex-col items-center justify-center text-amber-300 active:text-slate-950 shadow-md backdrop-blur-sm transition-all"
          title="Heavy Attack (K)"
        >
          <span className="text-xs font-bold font-mono">HEAVY</span>
          <span className="text-[9px] font-mono text-slate-400 font-semibold">K (-15 Stm)</span>
        </button>

        {/* Special Move */}
        <button
          id="btn-ctrl-special"
          onClick={onSpecialAttack}
          disabled={player.stamina < 40}
          className={`w-13 h-13 sm:w-15 sm:h-15 rounded-xl border flex flex-col items-center justify-center shadow-lg transition-all ${
            player.stamina >= 40
              ? 'bg-purple-950/90 active:bg-purple-500 border-purple-500/80 text-purple-200 active:text-slate-950 cursor-pointer'
              : 'bg-slate-950/80 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Special Move (Space)"
        >
          <span className="text-xs font-black font-mono">SPECIAL</span>
          <span className="text-[9px] font-mono font-semibold">SPACE (40)</span>
        </button>

        {/* Ultimate Move (Debug Token) */}
        {player.debugTokens > 0 && (
          <button
            id="btn-ctrl-ultimate"
            onClick={onUltimateAttack}
            className="w-13 h-13 sm:w-15 sm:h-15 bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 border-2 border-yellow-200 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse font-mono font-black"
            title="Ultimate Move (U)"
          >
            <Zap size={18} />
            <span className="text-[9px]">ULT (U)</span>
          </button>
        )}
      </div>
    </div>
  );
};
