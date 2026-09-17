import { Fighter } from './fighter';
import { ArenaTheme, FloatingText, Particle } from '../types/game';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  public screenShake: number = 0;
  public showHitboxes: boolean = false;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public triggerShake(intensity: number = 8) {
    this.screenShake = intensity;
  }

  public render(
    arena: ArenaTheme,
    groundY: number,
    fighters: [Fighter, Fighter],
    particles: Particle[],
    floatingTexts: FloatingText[],
    backgroundParticles: Particle[],
    gameTime: number
  ) {
    const ctx = this.ctx;
    ctx.save();

    // Screen Shake effect
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake;
      const sy = (Math.random() - 0.5) * this.screenShake;
      ctx.translate(sx, sy);
      this.screenShake = Math.max(0, this.screenShake - 0.5);
    }

    // 1. Clear & Background Sky
    this.drawBackground(arena, groundY, backgroundParticles, gameTime);

    // 2. Ground & Arena Platform
    this.drawGround(arena, groundY);

    // 3. Render Fighters
    fighters.forEach((fighter) => {
      this.drawFighter(fighter, groundY);
    });

    // 4. Hitboxes (if debug mode on)
    if (this.showHitboxes) {
      fighters.forEach((fighter) => {
        if (fighter.activeHitbox) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            fighter.activeHitbox.x,
            fighter.activeHitbox.y,
            fighter.activeHitbox.width,
            fighter.activeHitbox.height
          );
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fillRect(
            fighter.activeHitbox.x,
            fighter.activeHitbox.y,
            fighter.activeHitbox.width,
            fighter.activeHitbox.height
          );
        }
      });
    }

    // 5. Dynamic Particles
    this.drawParticles(particles);

    // 6. Floating Damage / Status Text
    this.drawFloatingTexts(floatingTexts);

    ctx.restore();
  }

  private drawBackground(arena: ArenaTheme, groundY: number, bgParticles: Particle[], time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    bgGrad.addColorStop(0, arena.skyColor);
    bgGrad.addColorStop(1, '#050710');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Cyber perspective grid on back wall
    ctx.strokeStyle = arena.gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 60) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, groundY);
    }
    for (let y = 0; y <= groundY; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Arena Central Feature
    if (arena.id === 'server_room') {
      // Server racks in background
      for (let i = 0; i < 7; i++) {
        const rx = 60 + i * 140;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(rx, groundY - 260, 90, 260);
        ctx.strokeStyle = '#1e293b';
        ctx.strokeRect(rx, groundY - 260, 90, 260);

        // Blinking LED lights
        for (let row = 0; row < 6; row++) {
          const isBlinking = (Math.floor(time * 2) + i + row) % 3 === 0;
          ctx.fillStyle = isBlinking ? arena.glowColor : '#334155';
          ctx.fillRect(rx + 10, groundY - 240 + row * 38, 12, 6);
          ctx.fillRect(rx + 28, groundY - 240 + row * 38, 12, 6);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(rx + 60, groundY - 240 + row * 38, 8, 6);
        }
      }
    } else if (arena.id === 'firewall_zone') {
      // Pulsing Firewall laser towers
      const pulseAlpha = 0.4 + 0.3 * Math.sin(time * 3);
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY - 180);
      ctx.lineTo(w, groundY - 180);
      ctx.moveTo(0, groundY - 100);
      ctx.lineTo(w, groundY - 100);
      ctx.stroke();

      // Warning Holo text
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ FIREWALL ACTIVE: RESTRICTED ACCESS ]', w / 2, groundY - 130);
    } else {
      // Core System CPU Ring
      const cx = w / 2;
      const cy = groundY - 150;
      const radius = 90 + 10 * Math.sin(time * 2);
      ctx.strokeStyle = arena.glowColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Core spinning logic gates
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.8);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.strokeRect(-40, -40, 80, 80);
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-40, -40, 80, 80);
      ctx.restore();

      ctx.fillStyle = 'rgba(192, 132, 252, 0.2)';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NETHERIUM KERNEL v4.0.0', cx, cy + 5);
    }

    // Draw floating code binary particles in background
    bgParticles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.font = '14px monospace';
      ctx.globalAlpha = p.alpha || 0.4;
      ctx.fillText(p.char || '1', p.x, p.y);
    });
    ctx.globalAlpha = 1.0;
  }

  private drawGround(arena: ArenaTheme, groundY: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Platform surface
    const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
    floorGrad.addColorStop(0, '#0f172a');
    floorGrad.addColorStop(1, '#020617');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Glowing rim
    ctx.strokeStyle = arena.glowColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Floor perspective grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    for (let x = -100; x < w + 200; x += 70) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + (x - w / 2) * 0.8, h);
      ctx.stroke();
    }
    for (let y = groundY; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  private drawFighter(f: Fighter, groundY: number) {
    const ctx = this.ctx;
    ctx.save();

    // Glitch / Lag offset
    let posX = f.x + f.glitchOffset.x;
    let posY = f.y + f.glitchOffset.y;

    ctx.translate(posX, posY);

    // Hit Flash
    if (f.flashTimer > 0) {
      ctx.filter = 'brightness(2.2)';
    }

    // Draw Shadow on floor
    const shadowDist = Math.max(0, groundY - f.y);
    const shadowScale = Math.max(0.3, 1 - shadowDist / 200);
    ctx.save();
    ctx.translate(0, shadowDist);
    ctx.scale(shadowScale, shadowScale * 0.35);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Direction flip
    ctx.scale(f.facing, 1);

    // Character drawing based on ID
    this.drawCharacterModel(f);

    // Draw Attack Visuals / Projectiles
    this.drawAttackVFX(f);

    // Draw Shield when blocking
    if (f.isBlocking) {
      this.drawBlockShield(f);
    }

    // Draw "LAG / FREEZE" Banner if lagged
    if (f.isLagged) {
      this.drawLagAlert(f);
    }

    ctx.restore();
  }

  private drawCharacterModel(f: Fighter) {
    const ctx = this.ctx;
    const char = f.character;
    const isKO = f.state === 'ko';
    const isCrouch = f.state === 'crouch';
    const charId = char.id;

    ctx.save();

    // Stickman Stroke and Glow Setup
    const isHeavy = charId === 'array';
    const mainStrokeWidth = isHeavy ? 7.5 : 5.5;
    const limbStrokeWidth = isHeavy ? 6.5 : 4.8;
    const headRadius = isHeavy ? 14 : 12.5;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Character Aura Glow
    ctx.shadowColor = char.glowColor;
    ctx.shadowBlur = f.state === 'ultimate_attack' ? 24 : 14;

    // Calculate Dynamic Stickman Pose Joints
    const pose = this.calculateStickmanPose(f, isHeavy);

    // 1. Draw Special Character Back Accessories (Cape, Halo, Infinite Ring)
    this.drawStickmanBackAccessories(ctx, f, charId, pose);

    // 2. Draw Back Limbs (Back Leg & Back Arm)
    ctx.strokeStyle = this.adjustColorBrightness(char.accentColor, -25);
    ctx.lineWidth = limbStrokeWidth;

    // Back Leg (Hip -> Knee -> Foot)
    ctx.beginPath();
    ctx.moveTo(pose.hips.x, pose.hips.y);
    ctx.lineTo(pose.legBack.knee.x, pose.legBack.knee.y);
    ctx.lineTo(pose.legBack.foot.x, pose.legBack.foot.y);
    ctx.stroke();

    // Back Arm (Shoulder -> Elbow -> Hand)
    ctx.beginPath();
    ctx.moveTo(pose.shoulder.x, pose.shoulder.y);
    ctx.lineTo(pose.armBack.elbow.x, pose.armBack.elbow.y);
    ctx.lineTo(pose.armBack.hand.x, pose.armBack.hand.y);
    ctx.stroke();

    // Back Fist
    this.drawStickmanHand(ctx, charId, pose.armBack.hand.x, pose.armBack.hand.y, isHeavy, char.accentColor);

    // 3. Draw Spine / Torso (Neck -> Hips)
    ctx.strokeStyle = char.accentColor;
    ctx.lineWidth = mainStrokeWidth;
    ctx.beginPath();
    ctx.moveTo(pose.neck.x, pose.neck.y);
    ctx.lineTo(pose.hips.x, pose.hips.y);
    ctx.stroke();

    // 4. Draw Front Limbs (Front Leg & Front Arm)
    ctx.strokeStyle = char.accentColor;
    ctx.lineWidth = limbStrokeWidth;

    // Front Leg (Hip -> Knee -> Foot)
    ctx.beginPath();
    ctx.moveTo(pose.hips.x, pose.hips.y);
    ctx.lineTo(pose.legFront.knee.x, pose.legFront.knee.y);
    ctx.lineTo(pose.legFront.foot.x, pose.legFront.foot.y);
    ctx.stroke();

    // Front Arm (Shoulder -> Elbow -> Hand)
    ctx.beginPath();
    ctx.moveTo(pose.shoulder.x, pose.shoulder.y);
    ctx.lineTo(pose.armFront.elbow.x, pose.armFront.elbow.y);
    ctx.lineTo(pose.armFront.hand.x, pose.armFront.hand.y);
    ctx.stroke();

    // Front Fist / Weapon
    this.drawStickmanHand(ctx, charId, pose.armFront.hand.x, pose.armFront.hand.y, isHeavy, char.accentColor);

    // 5. Draw Head & Face
    this.drawStickmanHead(ctx, f, charId, pose.head.x, pose.head.y, headRadius, char.accentColor, isKO);

    // 6. Draw Front Dynamic Accessories (Flying Scarf, Spiked Pauldrons, Runes)
    this.drawStickmanFrontAccessories(ctx, f, charId, pose);

    // 7. Draw Martial Arts Attack Motion Trails (Xiao Xiao speed lines & kick swooshes)
    this.drawMartialArtsTrails(ctx, f, char.accentColor, pose);

    ctx.restore();
  }

  private calculateStickmanPose(f: Fighter, isHeavy: boolean) {
    const t = f.stateTimer;
    const isKO = f.state === 'ko';
    const isHit = f.state === 'hit';
    const isCrouch = f.state === 'crouch';
    const isJump = f.state === 'jump' || !f.isGrounded;

    // Default Neutral / Idle
    if (isKO) {
      // Ragdoll Knockout on Floor
      return {
        head: { x: 38, y: -8 },
        neck: { x: 18, y: -5 },
        hips: { x: -16, y: -5 },
        shoulder: { x: 14, y: -5 },
        armBack: { elbow: { x: 10, y: -2 }, hand: { x: 26, y: -2 } },
        armFront: { elbow: { x: 4, y: -12 }, hand: { x: 16, y: -16 } },
        legBack: { knee: { x: -30, y: -4 }, foot: { x: -46, y: -2 } },
        legFront: { knee: { x: -24, y: -10 }, foot: { x: -38, y: -8 } },
      };
    }

    if (isHit) {
      // Dramatic Xiao Xiao Knockback Recoil
      return {
        head: { x: -32, y: -90 },
        neck: { x: -18, y: -72 },
        hips: { x: 4, y: -38 },
        shoulder: { x: -16, y: -68 },
        armBack: { elbow: { x: -30, y: -58 }, hand: { x: -44, y: -66 } },
        armFront: { elbow: { x: -18, y: -54 }, hand: { x: -32, y: -60 } },
        legBack: { knee: { x: 4, y: -18 }, foot: { x: -10, y: 0 } },
        legFront: { knee: { x: 14, y: -16 }, foot: { x: 2, y: 0 } },
      };
    }

    if (f.state === 'block') {
      // Classic Cross-Arm X Block Stance
      return {
        head: { x: 2, y: -90 },
        neck: { x: 0, y: -72 },
        hips: { x: -2, y: -38 },
        shoulder: { x: 0, y: -68 },
        armBack: { elbow: { x: -8, y: -60 }, hand: { x: 16, y: -62 } },
        armFront: { elbow: { x: 8, y: -58 }, hand: { x: 14, y: -66 } },
        legBack: { knee: { x: -14, y: -18 }, foot: { x: -18, y: 0 } },
        legFront: { knee: { x: 12, y: -18 }, foot: { x: 18, y: 0 } },
      };
    }

    if (isCrouch) {
      // Low Martial Arts Ground Crouch
      return {
        head: { x: 16, y: -64 },
        neck: { x: 10, y: -48 },
        hips: { x: 0, y: -24 },
        shoulder: { x: 8, y: -44 },
        armBack: { elbow: { x: 2, y: -34 }, hand: { x: 10, y: -36 } },
        armFront: { elbow: { x: 18, y: -24 }, hand: { x: 26, y: 0 } },
        legBack: { knee: { x: -16, y: -12 }, foot: { x: -20, y: 0 } },
        legFront: { knee: { x: 14, y: -12 }, foot: { x: 24, y: 0 } },
      };
    }

    if (isJump) {
      // Aerial Acrobatic Leap
      const vy = f.vy;
      if (vy < 0) {
        // Ascending Jump Tuck
        return {
          head: { x: 4, y: -96 },
          neck: { x: 2, y: -78 },
          hips: { x: 0, y: -44 },
          shoulder: { x: 2, y: -74 },
          armBack: { elbow: { x: -16, y: -68 }, hand: { x: -26, y: -78 } },
          armFront: { elbow: { x: 16, y: -66 }, hand: { x: 26, y: -76 } },
          legBack: { knee: { x: -10, y: -26 }, foot: { x: -14, y: -14 } },
          legFront: { knee: { x: 14, y: -28 }, foot: { x: 18, y: -16 } },
        };
      } else {
        // Descending Landing / Dive Kick Prep
        return {
          head: { x: 6, y: -94 },
          neck: { x: 4, y: -76 },
          hips: { x: 0, y: -42 },
          shoulder: { x: 4, y: -72 },
          armBack: { elbow: { x: -12, y: -60 }, hand: { x: -20, y: -52 } },
          armFront: { elbow: { x: 14, y: -58 }, hand: { x: 24, y: -46 } },
          legBack: { knee: { x: -6, y: -22 }, foot: { x: -10, y: -4 } },
          legFront: { knee: { x: 16, y: -20 }, foot: { x: 22, y: -2 } },
        };
      }
    }

    if (f.state === 'light_attack') {
      // Dynamic Xiao Xiao Straight Punch
      if (t >= 3 && t <= 9) {
        // Full Lunge Strike Extension!
        return {
          head: { x: 28, y: -92 },
          neck: { x: 22, y: -74 },
          hips: { x: 6, y: -40 },
          shoulder: { x: 20, y: -72 },
          armBack: { elbow: { x: -2, y: -60 }, hand: { x: 8, y: -62 } }, // cocked back to ribs
          armFront: { elbow: { x: 46, y: -70 }, hand: { x: 70, y: -70 } }, // straight punch!
          legBack: { knee: { x: -12, y: -18 }, foot: { x: -24, y: 0 } },
          legFront: { knee: { x: 24, y: -20 }, foot: { x: 30, y: 0 } },
        };
      } else {
        // Punch Windup / Retract
        return {
          head: { x: 4, y: -94 },
          neck: { x: 2, y: -76 },
          hips: { x: 0, y: -42 },
          shoulder: { x: 2, y: -72 },
          armBack: { elbow: { x: -12, y: -58 }, hand: { x: -4, y: -64 } },
          armFront: { elbow: { x: 22, y: -64 }, hand: { x: 44, y: -66 } },
          legBack: { knee: { x: -12, y: -20 }, foot: { x: -16, y: 0 } },
          legFront: { knee: { x: 12, y: -20 }, foot: { x: 18, y: 0 } },
        };
      }
    }

    if (f.state === 'heavy_attack') {
      // High Roundhouse / Axe Kick
      if (t >= 4 && t <= 12) {
        // High Kick Extension (head height)!
        return {
          head: { x: -30, y: -82 },
          neck: { x: -18, y: -68 },
          hips: { x: 0, y: -42 },
          shoulder: { x: -16, y: -66 },
          armBack: { elbow: { x: -26, y: -48 }, hand: { x: -34, y: -38 } },
          armFront: { elbow: { x: 6, y: -74 }, hand: { x: 16, y: -82 } },
          legBack: { knee: { x: -6, y: -22 }, foot: { x: -8, y: 0 } }, // planted
          legFront: { knee: { x: 32, y: -64 }, foot: { x: 64, y: -78 } }, // high kick whip!
        };
      } else {
        // Kick Windup / Recovery
        return {
          head: { x: -8, y: -92 },
          neck: { x: -4, y: -74 },
          hips: { x: 0, y: -42 },
          shoulder: { x: -4, y: -70 },
          armBack: { elbow: { x: -16, y: -56 }, hand: { x: -10, y: -64 } },
          armFront: { elbow: { x: 12, y: -60 }, hand: { x: 24, y: -68 } },
          legBack: { knee: { x: -8, y: -20 }, foot: { x: -12, y: 0 } },
          legFront: { knee: { x: 16, y: -36 }, foot: { x: 28, y: -46 } },
        };
      }
    }

    if (f.state === 'special_attack') {
      const charId = f.character.id;
      if (charId === 'var') {
        // Sonic Ninja Blitz Thrust
        return {
          head: { x: 38, y: -68 },
          neck: { x: 24, y: -64 },
          hips: { x: -8, y: -54 },
          shoulder: { x: 22, y: -62 },
          armBack: { elbow: { x: 40, y: -64 }, hand: { x: 62, y: -66 } },
          armFront: { elbow: { x: 44, y: -58 }, hand: { x: 68, y: -60 } },
          legBack: { knee: { x: -28, y: -50 }, foot: { x: -46, y: -48 } },
          legFront: { knee: { x: -18, y: -54 }, foot: { x: -36, y: -56 } },
        };
      } else if (charId === 'loop') {
        // 3-Hit Xiao Xiao Punch Rush
        const pCycle = Math.sin(t * 1.2);
        return {
          head: { x: 24, y: -92 },
          neck: { x: 18, y: -74 },
          hips: { x: 4, y: -40 },
          shoulder: { x: 16, y: -72 },
          armBack: { elbow: { x: 28 + pCycle * 14, y: -62 }, hand: { x: 54 + pCycle * 18, y: -64 } },
          armFront: { elbow: { x: 36 - pCycle * 14, y: -70 }, hand: { x: 66 - pCycle * 18, y: -72 } },
          legBack: { knee: { x: -10, y: -20 }, foot: { x: -20, y: 0 } },
          legFront: { knee: { x: 20, y: -20 }, foot: { x: 26, y: 0 } },
        };
      } else if (charId === 'func') {
        // Cyber Sorcerer Spellcasting Float
        return {
          head: { x: 4, y: -106 },
          neck: { x: 2, y: -88 },
          hips: { x: 0, y: -54 },
          shoulder: { x: 2, y: -84 },
          armBack: { elbow: { x: -16, y: -94 }, hand: { x: -22, y: -110 } }, // raised channeling
          armFront: { elbow: { x: 26, y: -72 }, hand: { x: 50, y: -68 } }, // casting forward
          legBack: { knee: { x: -8, y: -36 }, foot: { x: -12, y: -18 } },
          legFront: { knee: { x: 10, y: -34 }, foot: { x: 14, y: -16 } },
        };
      } else if (charId === 'array') {
        // High Aerial Ground Smash
        if (t < 10) {
          // Raising fists high above head!
          return {
            head: { x: 4, y: -102 },
            neck: { x: 2, y: -84 },
            hips: { x: 0, y: -48 },
            shoulder: { x: 2, y: -80 },
            armBack: { elbow: { x: 8, y: -104 }, hand: { x: 14, y: -120 } },
            armFront: { elbow: { x: 12, y: -104 }, hand: { x: 18, y: -120 } },
            legBack: { knee: { x: -12, y: -26 }, foot: { x: -16, y: -8 } },
            legFront: { knee: { x: 14, y: -26 }, foot: { x: 18, y: -8 } },
          };
        } else {
          // Fists crashing down onto floor!
          return {
            head: { x: 22, y: -62 },
            neck: { x: 14, y: -46 },
            hips: { x: 0, y: -24 },
            shoulder: { x: 12, y: -44 },
            armBack: { elbow: { x: 20, y: -24 }, hand: { x: 28, y: 0 } },
            armFront: { elbow: { x: 24, y: -24 }, hand: { x: 34, y: 0 } },
            legBack: { knee: { x: -16, y: -14 }, foot: { x: -22, y: 0 } },
            legFront: { knee: { x: 14, y: -12 }, foot: { x: 22, y: 0 } },
          };
        }
      } else {
        // BUG: Corrupted Shadow Claw Pounce
        return {
          head: { x: 30, y: -82 },
          neck: { x: 20, y: -66 },
          hips: { x: 0, y: -36 },
          shoulder: { x: 18, y: -64 },
          armBack: { elbow: { x: 32, y: -54 }, hand: { x: 56, y: -58 } },
          armFront: { elbow: { x: 38, y: -66 }, hand: { x: 68, y: -72 } },
          legBack: { knee: { x: -12, y: -18 }, foot: { x: -22, y: 0 } },
          legFront: { knee: { x: 22, y: -18 }, foot: { x: 28, y: 0 } },
        };
      }
    }

    if (f.state === 'ultimate_attack') {
      // Super Kamehameha Power Beam Stance
      return {
        head: { x: 16, y: -86 },
        neck: { x: 10, y: -68 },
        hips: { x: 0, y: -34 },
        shoulder: { x: 8, y: -66 },
        armBack: { elbow: { x: 26, y: -64 }, hand: { x: 46, y: -64 } },
        armFront: { elbow: { x: 28, y: -62 }, hand: { x: 48, y: -64 } },
        legBack: { knee: { x: -20, y: -16 }, foot: { x: -30, y: 0 } }, // wide horse stance
        legFront: { knee: { x: 20, y: -16 }, foot: { x: 30, y: 0 } },
      };
    }

    if (f.state === 'walk_forward') {
      // Energetic Stickman Run Cycle
      const cycle = t * 0.24;
      const bob = Math.abs(Math.sin(cycle)) * 3;
      return {
        head: { x: 14, y: -94 + bob },
        neck: { x: 10, y: -76 + bob },
        hips: { x: 0, y: -44 + bob },
        shoulder: { x: 8, y: -72 + bob },
        armBack: { elbow: { x: -8 - Math.sin(cycle) * 16, y: -58 }, hand: { x: -14 - Math.sin(cycle) * 22, y: -54 } },
        armFront: { elbow: { x: 14 + Math.sin(cycle) * 16, y: -58 }, hand: { x: 24 + Math.sin(cycle) * 22, y: -54 } },
        legBack: {
          knee: { x: -12 + Math.sin(cycle) * 18, y: -22 - Math.max(0, Math.cos(cycle)) * 12 },
          foot: { x: -16 + Math.sin(cycle) * 24, y: Math.min(0, -Math.cos(cycle) * 10) },
        },
        legFront: {
          knee: { x: 10 - Math.sin(cycle) * 18, y: -22 - Math.max(0, -Math.cos(cycle)) * 12 },
          foot: { x: 14 - Math.sin(cycle) * 24, y: Math.min(0, Math.cos(cycle) * 10) },
        },
      };
    }

    if (f.state === 'walk_backward') {
      // Defensive Backpedal Stance
      const cycle = t * 0.2;
      return {
        head: { x: -8, y: -94 },
        neck: { x: -4, y: -76 },
        hips: { x: 0, y: -42 },
        shoulder: { x: -4, y: -72 },
        armBack: { elbow: { x: -16, y: -60 }, hand: { x: -6, y: -66 } },
        armFront: { elbow: { x: 10, y: -60 }, hand: { x: 20, y: -66 } },
        legBack: {
          knee: { x: -10 - Math.sin(cycle) * 12, y: -20 },
          foot: { x: -14 - Math.sin(cycle) * 16, y: 0 },
        },
        legFront: {
          knee: { x: 10 + Math.sin(cycle) * 12, y: -20 },
          foot: { x: 14 + Math.sin(cycle) * 16, y: 0 },
        },
      };
    }

    // Default: Bouncy Martial Arts Idle Stance
    const breathe = Math.sin(t * 0.12) * 2.5;
    const sway = Math.cos(t * 0.12) * 1.5;
    return {
      head: { x: sway * 0.8, y: -94 + breathe },
      neck: { x: sway * 0.5, y: -76 + breathe },
      hips: { x: 0, y: -42 + breathe },
      shoulder: { x: sway * 0.5, y: -72 + breathe },
      armBack: { elbow: { x: -14, y: -58 + breathe }, hand: { x: -4, y: -64 + breathe } }, // guarding chin
      armFront: { elbow: { x: 14, y: -56 + breathe }, hand: { x: 26, y: -62 + breathe } }, // lead fist forward
      legBack: { knee: { x: -12, y: -20 }, foot: { x: -16, y: 0 } },
      legFront: { knee: { x: 10, y: -20 }, foot: { x: 16, y: 0 } },
    };
  }

  private drawStickmanHead(
    ctx: CanvasRenderingContext2D,
    f: Fighter,
    charId: string,
    hx: number,
    hy: number,
    r: number,
    accentColor: string,
    isKO: boolean
  ) {
    ctx.save();
    ctx.translate(hx, hy);

    // Head Outline & Fill
    ctx.fillStyle = '#050914';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = charId === 'array' ? 4.5 : 3.5;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eye / Facial Expressions
    if (isKO) {
      // Defeated X X eyes
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      // Eye Left
      ctx.beginPath();
      ctx.moveTo(-7, -4);
      ctx.lineTo(-3, 0);
      ctx.moveTo(-3, -4);
      ctx.lineTo(-7, 0);
      // Eye Right
      ctx.moveTo(3, -4);
      ctx.lineTo(7, 0);
      ctx.moveTo(7, -4);
      ctx.lineTo(3, 0);
      ctx.stroke();
    } else if (charId === 'var') {
      // Glowing Cyan Visor Slit
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -3, 8, 4);
      ctx.fillStyle = accentColor;
      ctx.fillRect(-2, -4, 11, 6);
    } else if (charId === 'loop') {
      // Emerald Monk Forehead Bindu & Sharp Ninja Eyes
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(0, -5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, -2, 6, 3);
    } else if (charId === 'func') {
      // Glowing Magenta Mage Eyes under Hood
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(3, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, -3, 2, 2);
    } else if (charId === 'array') {
      // Heavy Cyber Visor Bar
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-1, -4, 11, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, -3, 3, 3);
    } else {
      // BUG: Crimson Glitch Eyes & Spikes
      const jitter = (Math.random() - 0.5) * 2;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(3 + jitter, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(4 + jitter, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawStickmanHand(
    ctx: CanvasRenderingContext2D,
    charId: string,
    x: number,
    y: number,
    isHeavy: boolean,
    color: string
  ) {
    ctx.save();
    ctx.translate(x, y);

    if (charId === 'array') {
      // Heavy Spiked Knuckle Gauntlets
      ctx.fillStyle = '#ea580c';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Small Iron Spikes
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(5, -3, 4, 2);
      ctx.fillRect(5, 1, 4, 2);
    } else if (charId === 'bug') {
      // Razor Glitch Claws
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(3, -4);
      ctx.lineTo(8, -5);
      ctx.moveTo(4, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(3, 4);
      ctx.lineTo(8, 5);
      ctx.stroke();
    } else {
      // Standard Solid Stickman Fist
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, isHeavy ? 6 : 4.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawStickmanBackAccessories(
    ctx: CanvasRenderingContext2D,
    f: Fighter,
    charId: string,
    pose: any
  ) {
    const t = f.stateTimer;
    if (charId === 'loop') {
      // Rotating Emerald Infinity Loop Halo Behind Head
      ctx.save();
      ctx.translate(pose.head.x - 4, pose.head.y - 4);
      ctx.rotate(t * 0.05);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(-8, 0, 8, 0, Math.PI * 2);
      ctx.arc(8, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (charId === 'func') {
      // Flowing Wizard Cloak / Mantle
      ctx.save();
      ctx.fillStyle = 'rgba(76, 29, 149, 0.85)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;

      const wave = Math.sin(t * 0.15) * 6;
      ctx.beginPath();
      ctx.moveTo(pose.neck.x - 4, pose.neck.y);
      ctx.lineTo(pose.neck.x + 4, pose.neck.y);
      ctx.lineTo(pose.hips.x - 18 + wave, pose.hips.y + 18);
      ctx.lineTo(pose.hips.x - 28 + wave * 1.2, pose.hips.y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (charId === 'bug') {
      // Corrupted Glitch Shards Floating Behind
      ctx.save();
      const jitter = (Math.random() - 0.5) * 4;
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      ctx.strokeRect(pose.hips.x - 20 + jitter, pose.hips.y - 20, 10, 10);
      ctx.strokeRect(pose.neck.x - 24, pose.neck.y - 10 + jitter, 14, 8);
      ctx.restore();
    }
  }

  private drawStickmanFrontAccessories(
    ctx: CanvasRenderingContext2D,
    f: Fighter,
    charId: string,
    pose: any
  ) {
    const t = f.stateTimer;
    if (charId === 'var') {
      // Fluttering Cyan Ninja Scarf behind head
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3.5;
      const s1 = Math.sin(t * 0.25) * 6;
      const s2 = Math.cos(t * 0.25) * 8;
      ctx.beginPath();
      ctx.moveTo(pose.head.x - 6, pose.head.y + 4);
      ctx.quadraticCurveTo(
        pose.head.x - 18,
        pose.head.y + s1,
        pose.head.x - 36,
        pose.head.y + s2 - 4
      );
      ctx.stroke();
      ctx.restore();
    } else if (charId === 'loop') {
      // Spinning Green Chakram Rings around wrists
      ctx.save();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pose.armFront.hand.x, pose.armFront.hand.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (charId === 'func') {
      // Floating Orbiting Code Crystals: { }
      ctx.save();
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 13px monospace';
      const o1 = Math.sin(t * 0.1) * 8;
      ctx.fillText('{', pose.armFront.hand.x + 8, pose.armFront.hand.y - 6 + o1);
      ctx.fillText('}', pose.armFront.hand.x + 18, pose.armFront.hand.y + 4 - o1);
      ctx.restore();
    } else if (charId === 'array') {
      // Heavy Shoulder Pauldron with Index [0]
      ctx.save();
      ctx.fillStyle = '#ea580c';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.fillRect(pose.shoulder.x - 8, pose.shoulder.y - 6, 16, 8);
      ctx.strokeRect(pose.shoulder.x - 8, pose.shoulder.y - 6, 16, 8);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('0', pose.shoulder.x - 3, pose.shoulder.y);
      ctx.restore();
    } else if (charId === 'bug') {
      // Red Horns on Head
      ctx.save();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(pose.head.x - 4, pose.head.y - 10);
      ctx.lineTo(pose.head.x - 2, pose.head.y - 20);
      ctx.lineTo(pose.head.x + 2, pose.head.y - 10);
      ctx.moveTo(pose.head.x + 2, pose.head.y - 10);
      ctx.lineTo(pose.head.x + 8, pose.head.y - 18);
      ctx.lineTo(pose.head.x + 6, pose.head.y - 10);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawMartialArtsTrails(
    ctx: CanvasRenderingContext2D,
    f: Fighter,
    accentColor: string,
    pose: any
  ) {
    const t = f.stateTimer;

    if (f.state === 'light_attack' && t >= 4 && t <= 8) {
      // Straight Punch Shockwave Ring & Speed Trails
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;

      // Expanding Shock Ring at Fist
      ctx.beginPath();
      ctx.arc(pose.armFront.hand.x, pose.armFront.hand.y, 14 + (t - 4) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // Kinetic Speed Lines behind punch
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pose.shoulder.x + 10, pose.shoulder.y);
      ctx.lineTo(pose.armFront.hand.x - 8, pose.armFront.hand.y);
      ctx.moveTo(pose.shoulder.x + 8, pose.shoulder.y + 6);
      ctx.lineTo(pose.armFront.hand.x - 12, pose.armFront.hand.y + 6);
      ctx.stroke();

      // Fist Impact Star
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pose.armFront.hand.x + 4, pose.armFront.hand.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (f.state === 'heavy_attack' && t >= 6 && t <= 12) {
      // High Roundhouse Curved Slash Swoosh Trail
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, -42, 70, -Math.PI / 1.8, Math.PI / 8);
      ctx.stroke();

      // Secondary Bright White Core Arc
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -42, 68, -Math.PI / 2.2, -Math.PI / 8);
      ctx.stroke();
      ctx.restore();
    }
  }

  private adjustColorBrightness(col: string, percent: number) {
    // Simple hex darken/lighten helper
    let num = parseInt(col.replace('#', ''), 16);
    if (isNaN(num)) return col;
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00ff) + amt;
    let G = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  private drawAttackVFX(f: Fighter) {
    const ctx = this.ctx;
    if (f.state === 'special_attack') {
      const charId = f.character.id;
      ctx.save();
      if (charId === 'var') {
        // Cyan Dual Cyber Slash
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(42, -58, 40, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(40, -58, 38, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      } else if (charId === 'loop') {
        // Xiao Xiao 3-punch sonic ripples
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(24 + i * 18, -60, 12 + i * 5, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
        }
      } else if (charId === 'func') {
        // Siphon Plasma Vortex
        ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
        ctx.beginPath();
        ctx.arc(54, -64, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.stroke();
        // Inner spinning glyph
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(46, -72, 16, 16);
      } else if (charId === 'array') {
        // Ground slam seismic pillars
        ctx.fillStyle = '#f97316';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(24 + i * 24, -18 - i * 10, 18, 18 + i * 10);
        }
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(26 + i * 24, -16 - i * 10, 8, 4);
        }
      } else {
        // BUG: Corrupted Glitch Claws Fissure
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(30, -90);
        ctx.lineTo(80, -40);
        ctx.moveTo(25, -70);
        ctx.lineTo(85, -20);
        ctx.moveTo(35, -50);
        ctx.lineTo(75, 0);
        ctx.stroke();
      }
      ctx.restore();
    } else if (f.state === 'ultimate_attack') {
      // Ultra Kamehameha / Beam
      ctx.save();
      const grad = ctx.createLinearGradient(0, -95, 260, -50);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, f.character.accentColor);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.fillRect(36, -95, 240, 68);

      // Concentric Shock Rings along beam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      for (let rx = 60; rx <= 240; rx += 45) {
        ctx.beginPath();
        ctx.ellipse(rx, -62, 8, 30, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(f.character.ultimateName.toUpperCase(), 40, -105);
      ctx.restore();
    }
  }

  private drawBlockShield(f: Fighter) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(26, -55, 40, -Math.PI / 2.5, Math.PI / 2.5);
    ctx.stroke();
    ctx.fill();

    // Shield hex lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(32, -70);
    ctx.lineTo(44, -55);
    ctx.lineTo(32, -40);
    ctx.stroke();
    ctx.restore();
  }

  private drawLagAlert(f: Fighter) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-50, -135, 100, 22);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(-50, -135, 100, 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('! LAG / FREEZE !', 0, -120);
    ctx.restore();
  }

  private drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const progress = p.life / p.maxLife;
      const alpha = Math.max(0, 1 - progress);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'spark') {
        ctx.fillRect(p.x, p.y, p.size * (1 - progress * 0.5), p.size * (1 - progress * 0.5));
      } else if (p.shape === 'char' && p.char) {
        ctx.font = `bold ${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
      }
    }
  }

  private drawFloatingTexts(texts: FloatingText[]) {
    const ctx = this.ctx;
    for (let i = texts.length - 1; i >= 0; i--) {
      const t = texts[i];
      t.y += t.vy;
      t.life++;
      t.alpha = Math.max(0, 1 - t.life / 45);

      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.font = `${t.bold ? 'bold ' : ''}${t.size || 16}px monospace`;
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();

      if (t.life >= 45) {
        texts.splice(i, 1);
      }
    }
  }
}
