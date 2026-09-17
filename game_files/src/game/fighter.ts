import { CharacterDef, CharacterId, FighterState } from '../types/game';
import { soundManager } from '../audio/soundManager';

export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  staminaDrain: number;
  type: 'light' | 'heavy' | 'special' | 'ultimate';
  knockbackX: number;
  knockbackY: number;
}

export class Fighter {
  public playerNumber: 1 | 2;
  public character: CharacterDef;
  public x: number;
  public y: number;
  public vx: number = 0;
  public vy: number = 0;
  public facing: number = 1; // 1 = right, -1 = left
  public isGrounded: boolean = true;
  
  public hp: number = 100;
  public maxHp: number = 100;
  public stamina: number = 100;
  public maxStamina: number = 100;
  public debugTokens: number = 0;

  public state: FighterState = 'idle';
  public stateTimer: number = 0; // frames in current state
  public isBlocking: boolean = false;
  public isLagged: boolean = false;
  public lagTimer: number = 0; // in seconds or frames

  public activeHitbox: HitBox | null = null;
  public hasHitCurrentAttack: boolean = false;
  public comboCount: number = 0;
  public comboTimer: number = 0;

  public wins: number = 0;

  // AI behavior variables
  public isAi: boolean = false;
  public aiDifficulty: 'easy' | 'normal' | 'hard' = 'normal';
  private aiActionCooldown: number = 0;

  // Visual effects state
  public flashTimer: number = 0;
  public glitchOffset: { x: number; y: number } = { x: 0, y: 0 };
  public width: number = 54;
  public height: number = 96;

  constructor(playerNumber: 1 | 2, character: CharacterDef, startX: number, startY: number, isAi: boolean = false) {
    this.playerNumber = playerNumber;
    this.character = character;
    this.x = startX;
    this.y = startY;
    this.facing = playerNumber === 1 ? 1 : -1;
    this.isAi = isAi;
  }

  public resetForRound(startX: number, startY: number) {
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.facing = this.playerNumber === 1 ? 1 : -1;
    this.hp = 100;
    this.stamina = 100;
    this.state = 'idle';
    this.stateTimer = 0;
    this.isBlocking = false;
    this.isLagged = false;
    this.lagTimer = 0;
    this.activeHitbox = null;
    this.hasHitCurrentAttack = false;
  }

  public takeDamage(hit: HitBox, attacker: Fighter): { blocked: boolean; damageDealt: number } {
    if (this.state === 'ko') return { blocked: false, damageDealt: 0 };

    let finalDamage = hit.damage;
    let blocked = false;

    // Check if player is blocking facing the attacker
    const attackDir = attacker.x < this.x ? -1 : 1;
    if (this.isBlocking && this.facing !== attackDir && !this.isLagged) {
      blocked = true;
      finalDamage = Math.max(1, Math.round(hit.damage * 0.15)); // 85% damage reduction on block
      this.stamina = Math.max(0, this.stamina - (hit.damage * 0.5));
      soundManager.playBlock();
      this.flashTimer = 8;
    } else {
      soundManager.playLightHit();
      if (hit.type === 'heavy' || hit.type === 'special' || hit.type === 'ultimate') {
        soundManager.playHeavyHit();
      }
      this.state = 'hit';
      this.stateTimer = 0;
      this.flashTimer = 12;
      this.vx = (attacker.x < this.x ? 1 : -1) * hit.knockbackX;
      this.vy = hit.knockbackY;
    }

    this.hp = Math.max(0, this.hp - finalDamage);

    // Func's life drain special effect
    if (attacker.character.id === 'func' && hit.type === 'special') {
      attacker.hp = Math.min(attacker.maxHp, attacker.hp + 10);
    }

    // BUG's freeze/crash special effect
    if (attacker.character.id === 'bug' && hit.type === 'special' && !blocked) {
      this.triggerLag(1.2); // 1.2s freeze crash
    }

    if (this.hp <= 0) {
      this.state = 'ko';
      this.stateTimer = 0;
      soundManager.playKO();
    }

    return { blocked, damageDealt: finalDamage };
  }

  public triggerLag(durationSeconds: number = 1.0) {
    this.isLagged = true;
    this.lagTimer = Math.round(durationSeconds * 60);
    this.state = 'lag_freeze';
    this.stateTimer = 0;
    this.activeHitbox = null;
    soundManager.playLagFreeze();
  }

  public update(arenaWidth: number, groundY: number, opponent: Fighter) {
    this.stateTimer++;

    if (this.flashTimer > 0) this.flashTimer--;

    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer--;
      if (this.comboTimer === 0) this.comboCount = 0;
    }

    // Lag / Freeze state recovery
    if (this.isLagged) {
      this.lagTimer--;
      this.glitchOffset = {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 4,
      };
      if (this.lagTimer <= 0) {
        this.isLagged = false;
        this.glitchOffset = { x: 0, y: 0 };
        this.state = 'idle';
        this.stamina = 20; // Recover some baseline stamina after lag
      }
      // Apply gravity while lagged
      this.vy += 0.6;
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.85;
      if (this.y >= groundY) {
        this.y = groundY;
        this.vy = 0;
        this.isGrounded = true;
      }
      return;
    }

    // Passive Stamina Regeneration: +1 per 0.5s (2/s = 2/60 per frame ~ 0.033)
    if (this.state === 'idle' || this.state === 'walk_forward' || this.state === 'walk_backward') {
      const regenRate = 0.06 * this.character.baseStats.staminaRegen;
      this.stamina = Math.min(this.maxStamina, this.stamina + regenRate);
    } else if (this.isBlocking) {
      // Blocking costs 3 stamina per second
      this.stamina = Math.max(0, this.stamina - (3 / 60));
      if (this.stamina <= 0) {
        this.triggerLag(1.0);
        return;
      }
    }

    // Face opponent naturally when not attacking
    if (['idle', 'walk_forward', 'walk_backward', 'jump', 'crouch'].includes(this.state)) {
      this.facing = this.x < opponent.x ? 1 : -1;
    }

    // Gravity
    if (!this.isGrounded) {
      this.vy += 0.55;
    }

    // Position integration
    this.x += this.vx;
    this.y += this.vy;

    // Ground collision
    if (this.y >= groundY) {
      this.y = groundY;
      this.vy = 0;
      this.isGrounded = true;
      if (this.state === 'jump') {
        this.state = 'idle';
      }
    } else {
      this.isGrounded = false;
    }

    // Arena horizontal bounds
    const halfW = this.width / 2;
    if (this.x - halfW < 30) {
      this.x = 30 + halfW;
      this.vx = 0;
    }
    if (this.x + halfW > arenaWidth - 30) {
      this.x = arenaWidth - 30 - halfW;
      this.vx = 0;
    }

    // Friction
    if (this.isGrounded) {
      this.vx *= 0.8;
    }

    // Update attack animation states & hitboxes
    this.handleAttackAnimation(opponent);

    // AI logic update if AI controlled
    if (this.isAi && this.state !== 'ko' && opponent.state !== 'ko') {
      this.updateAi(opponent);
    }
  }

  private handleAttackAnimation(opponent: Fighter) {
    if (this.state === 'light_attack') {
      // Light attack: 14 frames total, active on frames 4-8
      if (this.stateTimer >= 4 && this.stateTimer <= 8 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 25 : -65),
          y: this.y - 65,
          width: 40,
          height: 35,
          damage: 5,
          staminaDrain: 5,
          type: 'light',
          knockbackX: 4,
          knockbackY: -2,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 14) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (this.state === 'heavy_attack') {
      // Heavy attack: 24 frames total, active on frames 10-16
      if (this.stateTimer >= 10 && this.stateTimer <= 16 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 25 : -80),
          y: this.y - 75,
          width: 55,
          height: 45,
          damage: 12,
          staminaDrain: 15,
          type: 'heavy',
          knockbackX: 8,
          knockbackY: -4,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 24) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (this.state === 'special_attack') {
      // Special attack based on character
      this.handleSpecialMove(opponent);
    } else if (this.state === 'ultimate_attack') {
      // Ultimate attack: 45 frames
      if (this.stateTimer >= 15 && this.stateTimer <= 30 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 20 : -140),
          y: this.y - 95,
          width: 120,
          height: 85,
          damage: 35,
          staminaDrain: 0,
          type: 'ultimate',
          knockbackX: 14,
          knockbackY: -7,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 48) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (this.state === 'hit') {
      this.activeHitbox = null;
      if (this.stateTimer >= 16) {
        this.state = 'idle';
      }
    }
  }

  private handleSpecialMove(opponent: Fighter) {
    const charId = this.character.id;
    // Frame count per character special
    if (charId === 'var') {
      // Reassign: frame 10 swaps behind opponent, frame 14-20 attacks!
      if (this.stateTimer === 10) {
        // Swap position to opponent's back
        const targetX = opponent.x + (opponent.facing === 1 ? -60 : 60);
        this.x = targetX;
        this.facing = opponent.x > this.x ? 1 : -1;
      }
      if (this.stateTimer >= 14 && this.stateTimer <= 20 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 20 : -70),
          y: this.y - 65,
          width: 50,
          height: 40,
          damage: 20,
          staminaDrain: 40,
          type: 'special',
          knockbackX: 10,
          knockbackY: -4,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 28) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (charId === 'loop') {
      // Infinite Strike: 3 strikes at frame 8, 16, 24
      const isStrike1 = this.stateTimer >= 8 && this.stateTimer <= 11;
      const isStrike2 = this.stateTimer >= 16 && this.stateTimer <= 19;
      const isStrike3 = this.stateTimer >= 24 && this.stateTimer <= 27;

      if (isStrike1 || isStrike2 || isStrike3) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 25 : -70),
          y: this.y - 60,
          width: 45,
          height: 40,
          damage: 7, // 7 * 3 = 21 total
          staminaDrain: 40,
          type: 'special',
          knockbackX: isStrike3 ? 9 : 3,
          knockbackY: isStrike3 ? -4 : -1,
        };
      } else {
        this.activeHitbox = null;
        if (this.stateTimer === 12 || this.stateTimer === 20) {
          this.hasHitCurrentAttack = false; // allow subsequent strikes to hit
        }
      }
      if (this.stateTimer >= 34) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (charId === 'func') {
      // Return Value: life steal beam/orb
      if (this.stateTimer >= 12 && this.stateTimer <= 22 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 30 : -95),
          y: this.y - 70,
          width: 65,
          height: 45,
          damage: 20,
          staminaDrain: 40,
          type: 'special',
          knockbackX: 9,
          knockbackY: -3,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 30) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else if (charId === 'array') {
      // Index Slam: ground shockwave covering wide area
      if (this.stateTimer >= 14 && this.stateTimer <= 24 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 10 : -130),
          y: this.y - 45,
          width: 120,
          height: 45,
          damage: 20,
          staminaDrain: 40,
          type: 'special',
          knockbackX: 11,
          knockbackY: -5,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 34) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    } else {
      // BUG: Crash freeze
      if (this.stateTimer >= 12 && this.stateTimer <= 22 && !this.hasHitCurrentAttack) {
        this.activeHitbox = {
          x: this.x + (this.facing === 1 ? 25 : -85),
          y: this.y - 70,
          width: 60,
          height: 45,
          damage: 20,
          staminaDrain: 40,
          type: 'special',
          knockbackX: 7,
          knockbackY: -2,
        };
      } else {
        this.activeHitbox = null;
      }
      if (this.stateTimer >= 32) {
        this.state = 'idle';
        this.activeHitbox = null;
        this.hasHitCurrentAttack = false;
      }
    }
  }

  // AI Logic Execution
  private updateAi(opponent: Fighter) {
    if (this.aiActionCooldown > 0) {
      this.aiActionCooldown--;
      return;
    }

    const dist = Math.abs(this.x - opponent.x);
    const inCloseRange = dist < 75;
    const inMidRange = dist >= 75 && dist < 140;

    // AI block reaction
    if (opponent.activeHitbox && dist < 100 && Math.random() < (this.aiDifficulty === 'hard' ? 0.75 : 0.4)) {
      this.startBlock();
      this.aiActionCooldown = 15;
      return;
    } else if (this.isBlocking && !opponent.activeHitbox) {
      this.stopBlock();
    }

    // AI Ultimate Move if available and in range
    if (this.debugTokens > 0 && (inCloseRange || inMidRange) && Math.random() < 0.3) {
      this.ultimateAttack();
      this.aiActionCooldown = 50;
      return;
    }

    // AI Special Move if enough stamina
    if (this.stamina >= 40 && (inCloseRange || inMidRange) && Math.random() < 0.45) {
      this.specialAttack();
      this.aiActionCooldown = 35;
      return;
    }

    // AI Close range attacks
    if (inCloseRange) {
      if (this.stamina >= 15 && Math.random() < 0.5) {
        this.heavyAttack();
      } else if (this.stamina >= 5) {
        this.lightAttack();
      } else {
        // Back off to recover stamina
        this.moveBack();
      }
      this.aiActionCooldown = this.aiDifficulty === 'hard' ? 12 : 20;
      return;
    }

    // AI Movement toward or away
    if (this.stamina < 25) {
      // Defensive retreat
      this.moveBack();
      this.aiActionCooldown = 10;
    } else {
      // Approach opponent
      this.moveForward();
      if (inMidRange && Math.random() < 0.25 && this.isGrounded) {
        this.jump();
      }
      this.aiActionCooldown = 8;
    }
  }

  // Fighter Actions
  public moveLeft() {
    if (this.cannotAct()) return;
    const speed = this.character.baseStats.speed * 0.52;
    this.vx = -speed;
    this.state = this.facing === 1 ? 'walk_backward' : 'walk_forward';
  }

  public moveRight() {
    if (this.cannotAct()) return;
    const speed = this.character.baseStats.speed * 0.52;
    this.vx = speed;
    this.state = this.facing === 1 ? 'walk_forward' : 'walk_backward';
  }

  public moveForward() {
    if (this.cannotAct()) return;
    const speed = this.character.baseStats.speed * 0.55;
    this.vx = this.facing * speed;
    this.state = 'walk_forward';
  }

  public moveBack() {
    if (this.cannotAct()) return;
    const speed = this.character.baseStats.speed * 0.45;
    this.vx = -this.facing * speed;
    this.state = 'walk_backward';
  }

  public stopMoving() {
    if (this.state === 'walk_forward' || this.state === 'walk_backward') {
      this.state = 'idle';
      this.vx = 0;
    }
  }

  public jump() {
    if (this.cannotAct() || !this.isGrounded) return;
    this.vy = -12.5;
    this.isGrounded = false;
    this.state = 'jump';
  }

  public crouch() {
    if (this.cannotAct() || !this.isGrounded) return;
    this.state = 'crouch';
    this.vx = 0;
  }

  public stopCrouch() {
    if (this.state === 'crouch') {
      this.state = 'idle';
    }
  }

  public startBlock() {
    if (this.cannotAct()) return;
    this.isBlocking = true;
    this.state = 'block';
    this.vx = 0;
  }

  public stopBlock() {
    if (this.isBlocking) {
      this.isBlocking = false;
      if (this.state === 'block') {
        this.state = 'idle';
      }
    }
  }

  public lightAttack(): boolean {
    if (this.cannotAct()) return false;
    if (this.stamina < 5) {
      this.triggerLag(1.0);
      return false;
    }

    this.stamina = Math.max(0, this.stamina - 5);
    this.state = 'light_attack';
    this.stateTimer = 0;
    this.hasHitCurrentAttack = false;
    this.vx = this.facing * 1.5;
    if (this.stamina <= 0) {
      this.triggerLag(1.0);
    }
    return true;
  }

  public heavyAttack(): boolean {
    if (this.cannotAct()) return false;
    if (this.stamina < 15) {
      this.triggerLag(1.0);
      return false;
    }

    this.stamina = Math.max(0, this.stamina - 15);
    this.state = 'heavy_attack';
    this.stateTimer = 0;
    this.hasHitCurrentAttack = false;
    this.vx = this.facing * 2.5;
    if (this.stamina <= 0) {
      this.triggerLag(1.0);
    }
    return true;
  }

  public specialAttack(): boolean {
    if (this.cannotAct()) return false;
    if (this.stamina < 40) return false;

    this.stamina = Math.max(0, this.stamina - 40);
    this.state = 'special_attack';
    this.stateTimer = 0;
    this.hasHitCurrentAttack = false;
    soundManager.playSpecial();
    if (this.stamina <= 0) {
      this.triggerLag(1.0);
    }
    return true;
  }

  public ultimateAttack(): boolean {
    if (this.cannotAct()) return false;
    if (this.debugTokens <= 0) return false;

    this.debugTokens--;
    this.state = 'ultimate_attack';
    this.stateTimer = 0;
    this.hasHitCurrentAttack = false;
    this.vx = this.facing * 3.5;
    soundManager.playUltimate();
    return true;
  }

  public cannotAct(): boolean {
    return (
      this.isLagged ||
      this.state === 'hit' ||
      this.state === 'ko' ||
      this.state === 'light_attack' ||
      this.state === 'heavy_attack' ||
      this.state === 'special_attack' ||
      this.state === 'ultimate_attack'
    );
  }
}
