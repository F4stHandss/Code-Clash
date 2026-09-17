import React, { useEffect, useRef, useState } from 'react';
import { CharacterId } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface StickmanPreviewCanvasProps {
  characterId: CharacterId;
}

export const StickmanPreviewCanvas: React.FC<StickmanPreviewCanvasProps> = ({ characterId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animAction, setAnimAction] = useState<'idle' | 'punch' | 'kick' | 'special'>('idle');
  const frameRef = useRef<number>(0);
  const animTimeRef = useRef<number>(0);

  const char = CHARACTERS[characterId];

  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animTimeRef.current++;
      const t = animTimeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Cyber floor grid line & spotlight
      const groundY = h - 24;
      const grad = ctx.createRadialGradient(w / 2, groundY, 10, w / 2, groundY, 70);
      grad.addColorStop(0, `${char.accentColor}33`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, groundY - 15, w, 40);

      // Floor line
      ctx.strokeStyle = `${char.accentColor}66`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(15, groundY);
      ctx.lineTo(w - 15, groundY);
      ctx.stroke();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(w / 2, groundY, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Stickman
      ctx.save();
      ctx.translate(w / 2, groundY);

      const isHeavy = characterId === 'array';
      const mainStroke = isHeavy ? 6.5 : 4.8;
      const limbStroke = isHeavy ? 5.5 : 4.0;
      const headRadius = isHeavy ? 13 : 11;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = char.glowColor;
      ctx.shadowBlur = 12;

      // Determine Pose
      let pose: any;

      if (animAction === 'punch') {
        const cycle = (t % 40);
        if (cycle < 20) {
          // Punch lunge!
          pose = {
            head: { x: 22, y: -74 },
            neck: { x: 16, y: -60 },
            hips: { x: 4, y: -32 },
            shoulder: { x: 14, y: -58 },
            armBack: { elbow: { x: -4, y: -48 }, hand: { x: 6, y: -50 } },
            armFront: { elbow: { x: 36, y: -56 }, hand: { x: 56, y: -56 } },
            legBack: { knee: { x: -10, y: -14 }, foot: { x: -20, y: 0 } },
            legFront: { knee: { x: 18, y: -16 }, foot: { x: 24, y: 0 } },
          };
        } else {
          // Return
          pose = getIdlePose(t);
        }
      } else if (animAction === 'kick') {
        const cycle = (t % 45);
        if (cycle < 22) {
          // High roundhouse kick!
          pose = {
            head: { x: -22, y: -68 },
            neck: { x: -14, y: -56 },
            hips: { x: 0, y: -34 },
            shoulder: { x: -12, y: -54 },
            armBack: { elbow: { x: -20, y: -38 }, hand: { x: -26, y: -30 } },
            armFront: { elbow: { x: 4, y: -60 }, hand: { x: 12, y: -68 } },
            legBack: { knee: { x: -6, y: -18 }, foot: { x: -8, y: 0 } },
            legFront: { knee: { x: 24, y: -52 }, foot: { x: 52, y: -64 } },
          };
        } else {
          pose = getIdlePose(t);
        }
      } else if (animAction === 'special') {
        if (characterId === 'var') {
          // Ninja Blitz thrust
          pose = {
            head: { x: 28, y: -56 },
            neck: { x: 18, y: -52 },
            hips: { x: -6, y: -44 },
            shoulder: { x: 16, y: -50 },
            armBack: { elbow: { x: 30, y: -52 }, hand: { x: 48, y: -54 } },
            armFront: { elbow: { x: 34, y: -48 }, hand: { x: 52, y: -50 } },
            legBack: { knee: { x: -22, y: -40 }, foot: { x: -36, y: -38 } },
            legFront: { knee: { x: -14, y: -42 }, foot: { x: -28, y: -44 } },
          };
        } else if (characterId === 'func') {
          // Hover spellcast
          const hover = Math.sin(t * 0.1) * 5;
          pose = {
            head: { x: 2, y: -84 + hover },
            neck: { x: 0, y: -70 + hover },
            hips: { x: 0, y: -44 + hover },
            shoulder: { x: 0, y: -66 + hover },
            armBack: { elbow: { x: -14, y: -74 + hover }, hand: { x: -20, y: -88 + hover } },
            armFront: { elbow: { x: 20, y: -58 + hover }, hand: { x: 38, y: -54 + hover } },
            legBack: { knee: { x: -6, y: -28 + hover }, foot: { x: -10, y: -14 + hover } },
            legFront: { knee: { x: 8, y: -26 + hover }, foot: { x: 12, y: -12 + hover } },
          };
        } else {
          pose = getIdlePose(t);
        }
      } else {
        pose = getIdlePose(t);
      }

      // 1. Back Accessories
      if (characterId === 'loop') {
        ctx.save();
        ctx.translate(pose.head.x - 3, pose.head.y - 3);
        ctx.rotate(t * 0.05);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-6, 0, 6, 0, Math.PI * 2);
        ctx.arc(6, 0, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (characterId === 'func') {
        ctx.save();
        ctx.fillStyle = 'rgba(76, 29, 149, 0.85)';
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.2;
        const wave = Math.sin(t * 0.15) * 5;
        ctx.beginPath();
        ctx.moveTo(pose.neck.x - 3, pose.neck.y);
        ctx.lineTo(pose.neck.x + 3, pose.neck.y);
        ctx.lineTo(pose.hips.x - 14 + wave, pose.hips.y + 14);
        ctx.lineTo(pose.hips.x - 22 + wave * 1.2, pose.hips.y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 2. Back Limbs
      ctx.strokeStyle = `${char.accentColor}99`;
      ctx.lineWidth = limbStroke;
      // Leg
      ctx.beginPath();
      ctx.moveTo(pose.hips.x, pose.hips.y);
      ctx.lineTo(pose.legBack.knee.x, pose.legBack.knee.y);
      ctx.lineTo(pose.legBack.foot.x, pose.legBack.foot.y);
      ctx.stroke();
      // Arm
      ctx.beginPath();
      ctx.moveTo(pose.shoulder.x, pose.shoulder.y);
      ctx.lineTo(pose.armBack.elbow.x, pose.armBack.elbow.y);
      ctx.lineTo(pose.armBack.hand.x, pose.armBack.hand.y);
      ctx.stroke();

      // 3. Spine / Torso
      ctx.strokeStyle = char.accentColor;
      ctx.lineWidth = mainStroke;
      ctx.beginPath();
      ctx.moveTo(pose.neck.x, pose.neck.y);
      ctx.lineTo(pose.hips.x, pose.hips.y);
      ctx.stroke();

      // 4. Front Limbs
      ctx.strokeStyle = char.accentColor;
      ctx.lineWidth = limbStroke;
      // Leg
      ctx.beginPath();
      ctx.moveTo(pose.hips.x, pose.hips.y);
      ctx.lineTo(pose.legFront.knee.x, pose.legFront.knee.y);
      ctx.lineTo(pose.legFront.foot.x, pose.legFront.foot.y);
      ctx.stroke();
      // Arm
      ctx.beginPath();
      ctx.moveTo(pose.shoulder.x, pose.shoulder.y);
      ctx.lineTo(pose.armFront.elbow.x, pose.armFront.elbow.y);
      ctx.lineTo(pose.armFront.hand.x, pose.armFront.hand.y);
      ctx.stroke();

      // Hands / Fists
      ctx.fillStyle = char.accentColor;
      ctx.beginPath();
      ctx.arc(pose.armFront.hand.x, pose.armFront.hand.y, isHeavy ? 5 : 3.8, 0, Math.PI * 2);
      ctx.arc(pose.armBack.hand.x, pose.armBack.hand.y, isHeavy ? 5 : 3.8, 0, Math.PI * 2);
      ctx.fill();

      // 5. Head
      ctx.save();
      ctx.translate(pose.head.x, pose.head.y);
      ctx.fillStyle = '#050914';
      ctx.strokeStyle = char.accentColor;
      ctx.lineWidth = isHeavy ? 3.5 : 2.8;
      ctx.beginPath();
      ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -2, 5, 2.5);
      ctx.restore();

      // 6. Front Accessories
      if (characterId === 'var') {
        ctx.save();
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.8;
        const s1 = Math.sin(t * 0.25) * 5;
        ctx.beginPath();
        ctx.moveTo(pose.head.x - 4, pose.head.y + 3);
        ctx.quadraticCurveTo(pose.head.x - 14, pose.head.y + s1, pose.head.x - 28, pose.head.y + s1 - 4);
        ctx.stroke();
        ctx.restore();
      } else if (characterId === 'loop') {
        ctx.save();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(pose.armFront.hand.x, pose.armFront.hand.y, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (characterId === 'array') {
        ctx.save();
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(pose.shoulder.x - 6, pose.shoulder.y - 4, 12, 6);
        ctx.restore();
      } else if (characterId === 'bug') {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(pose.head.x - 3, pose.head.y - 8);
        ctx.lineTo(pose.head.x - 1, pose.head.y - 16);
        ctx.lineTo(pose.head.x + 2, pose.head.y - 8);
        ctx.fill();
        ctx.restore();
      }

      // Attack VFX (Shock ring or kick trail)
      if (animAction === 'punch' && (t % 40) < 20) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pose.armFront.hand.x, pose.armFront.hand.y, 11, 0, Math.PI * 2);
        ctx.stroke();
      } else if (animAction === 'kick' && (t % 45) < 22) {
        ctx.strokeStyle = char.accentColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, -34, 55, -Math.PI / 1.8, Math.PI / 10);
        ctx.stroke();
      }

      ctx.restore();

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [characterId, animAction, char]);

  const getIdlePose = (t: number) => {
    const breathe = Math.sin(t * 0.12) * 2;
    const sway = Math.cos(t * 0.12) * 1.2;
    return {
      head: { x: sway * 0.8, y: -74 + breathe },
      neck: { x: sway * 0.5, y: -60 + breathe },
      hips: { x: 0, y: -34 + breathe },
      shoulder: { x: sway * 0.5, y: -56 + breathe },
      armBack: { elbow: { x: -11, y: -46 + breathe }, hand: { x: -3, y: -50 + breathe } },
      armFront: { elbow: { x: 11, y: -44 + breathe }, hand: { x: 21, y: -48 + breathe } },
      legBack: { knee: { x: -9, y: -16 }, foot: { x: -13, y: 0 } },
      legFront: { knee: { x: 8, y: -16 }, foot: { x: 13, y: 0 } },
    };
  };

  return (
    <div className="flex flex-col items-center bg-slate-950/80 border border-slate-800 rounded-xl p-3 shadow-inner">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={180}
          height={140}
          className="rounded-lg bg-gradient-to-b from-slate-900/90 to-slate-950"
        />
        <div className="absolute top-2 left-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
          STICKMAN PREVIEW
        </div>
      </div>

      {/* Interactive Action Testing Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mt-2 w-full">
        {(
          [
            { id: 'idle', label: 'Stand' },
            { id: 'punch', label: 'Pukul' },
            { id: 'kick', label: 'Tendang' },
            { id: 'special', label: 'Jurus' },
          ] as const
        ).map((act) => (
          <button
            key={act.id}
            onClick={() => setAnimAction(act.id)}
            className={`py-1 px-1.5 rounded text-[10px] font-mono font-bold transition-colors ${
              animAction === act.id
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  );
};
