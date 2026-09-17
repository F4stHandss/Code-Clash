/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameMode, CharacterId, Difficulty, Particle, FloatingText, QuizQuestion } from './types/game';
import { CHARACTERS, ARENAS } from './data/characters';
import { QUIZ_QUESTIONS } from './data/quizQuestions';
import { STORY_CHAPTERS, StoryChapter } from './data/storyDialogue';
import { Fighter } from './game/fighter';
import { GameRenderer } from './game/renderer';
import { soundManager } from './audio/soundManager';

import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { FightHud } from './components/FightHud';
import { VirtualControls } from './components/VirtualControls';
import { QuizModal } from './components/QuizModal';
import { StoryDialogModal } from './components/StoryDialogModal';
import { MatchEndModal } from './components/MatchEndModal';
import { HelpModal } from './components/HelpModal';
import { QuizLibrary } from './components/QuizLibrary';

type ScreenState = 
  | 'menu' 
  | 'select' 
  | 'story_intro' 
  | 'fight' 
  | 'quiz' 
  | 'story_outro' 
  | 'match_end' 
  | 'quiz_library';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('versus_ai');
  const [storyChapterIndex, setStoryChapterIndex] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Match State
  const [p1CharId, setP1CharId] = useState<CharacterId>('var');
  const [p2CharId, setP2CharId] = useState<CharacterId>('bug');
  const [arenaId, setArenaId] = useState<string>('server_room');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [p1Wins, setP1Wins] = useState<number>(0);
  const [p2Wins, setP2Wins] = useState<number>(0);
  const [roundTimer, setRoundTimer] = useState<number>(60);
  const [matchWinner, setMatchWinner] = useState<1 | 2 | 'draw'>('draw');

  // Quiz State between rounds
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);

  // Canvas & Engine Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fighter instances
  const p1Ref = useRef<Fighter>(new Fighter(1, CHARACTERS.var, 200, 380, false));
  const p2Ref = useRef<Fighter>(new Fighter(2, CHARACTERS.bug, 600, 380, true));

  // Particles & Visual Text
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const bgParticlesRef = useRef<Particle[]>([]);
  const nextTextId = useRef<number>(1);

  // Input states tracking held keys
  const keysPressed = useRef<Set<string>>(new Set());

  // Ground position based on canvas height
  const groundYRef = useRef<number>(380);
  const arenaWidthRef = useRef<number>(850);

  // Initialize Background Matrix Particles
  const initBgParticles = useCallback((w: number, h: number) => {
    const chars = ['0', '1', '{', '}', ';', '=>', '[]', '&&', '||', 'var', 'for', 'bug'];
    const particles: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0.3 + Math.random() * 0.6,
        life: 0,
        maxLife: 500,
        color: 'rgba(56, 189, 248, 0.25)',
        size: 12 + Math.floor(Math.random() * 4),
        shape: 'char',
        char: chars[Math.floor(Math.random() * chars.length)],
        alpha: 0.2 + Math.random() * 0.3,
      });
    }
    bgParticlesRef.current = particles;
  }, []);

  // Setup match fighters
  const setupMatch = useCallback((
    p1Id: CharacterId,
    p2Id: CharacterId,
    arena: string,
    diff: Difficulty,
    mode: GameMode
  ) => {
    setP1CharId(p1Id);
    setP2CharId(p2Id);
    setArenaId(arena);
    setDifficulty(diff);
    setGameMode(mode);

    setCurrentRound(1);
    setP1Wins(0);
    setP2Wins(0);
    setRoundTimer(60);
    setIsPaused(false);

    const isP2Ai = mode !== 'versus_2p';
    const p1 = new Fighter(1, CHARACTERS[p1Id], 220, groundYRef.current, false);
    const p2 = new Fighter(2, CHARACTERS[p2Id], arenaWidthRef.current - 220, groundYRef.current, isP2Ai);
    p2.aiDifficulty = diff;

    p1Ref.current = p1;
    p2Ref.current = p2;
    particlesRef.current = [];
    floatingTextsRef.current = [];

    soundManager.playRoundStart();
  }, []);

  // Reset positions for next round
  const startNextRound = useCallback((roundNum: number) => {
    setCurrentRound(roundNum);
    setRoundTimer(60);
    setIsPaused(false);

    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    p1.resetForRound(220, groundYRef.current);
    p2.resetForRound(arenaWidthRef.current - 220, groundYRef.current);

    // Floating round alert
    floatingTextsRef.current.push({
      id: nextTextId.current++,
      text: `ROUND ${roundNum}!`,
      x: arenaWidthRef.current / 2,
      y: groundYRef.current - 140,
      vy: -0.6,
      color: '#38bdf8',
      alpha: 1,
      life: 0,
      size: 32,
      bold: true,
    });

    soundManager.playRoundStart();
  }, []);

  // Spawn visual hit particles & floating damage text
  const spawnHitVfx = useCallback((
    x: number,
    y: number,
    damage: number,
    isBlocked: boolean,
    hitType: string
  ) => {
    // Damage text
    const textStr = isBlocked ? 'BLOCKED' : `-${damage}`;
    const textColor = isBlocked ? '#38bdf8' : hitType === 'ultimate' ? '#f59e0b' : '#ef4444';
    floatingTextsRef.current.push({
      id: nextTextId.current++,
      text: textStr,
      x: x + (Math.random() - 0.5) * 20,
      y: y - 20,
      vy: -1.2,
      color: textColor,
      alpha: 1,
      life: 0,
      size: isBlocked ? 14 : hitType === 'ultimate' ? 24 : 18,
      bold: true,
    });

    // Cyber spark particles
    const count = isBlocked ? 6 : hitType === 'heavy' ? 14 : hitType === 'ultimate' ? 25 : 8;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * (hitType === 'ultimate' ? 8 : 4);
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 20 + Math.floor(Math.random() * 15),
        color: isBlocked ? '#38bdf8' : Math.random() > 0.5 ? '#f59e0b' : '#00f0ff',
        size: 3 + Math.random() * 3,
        shape: 'spark',
      });
    }

    if (rendererRef.current) {
      rendererRef.current.triggerShake(isBlocked ? 3 : hitType === 'ultimate' ? 12 : hitType === 'heavy' ? 7 : 4);
    }
  }, []);

  // Check Hitbox Collisions
  const checkCollisions = useCallback(() => {
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;

    // P1 attacking P2
    if (p1.activeHitbox && !p1.hasHitCurrentAttack && p2.state !== 'ko') {
      const hb = p1.activeHitbox;
      const p2Box = {
        x: p2.x - p2.width / 2,
        y: p2.y - p2.height,
        width: p2.width,
        height: p2.height,
      };

      // AABB overlap test
      if (
        hb.x < p2Box.x + p2Box.width &&
        hb.x + hb.width > p2Box.x &&
        hb.y < p2Box.y + p2Box.height &&
        hb.y + hb.height > p2Box.y
      ) {
        p1.hasHitCurrentAttack = true;
        const result = p2.takeDamage(hb, p1);
        spawnHitVfx(hb.x + hb.width / 2, hb.y + hb.height / 2, result.damageDealt, result.blocked, hb.type);
      }
    }

    // P2 attacking P1
    if (p2.activeHitbox && !p2.hasHitCurrentAttack && p1.state !== 'ko') {
      const hb = p2.activeHitbox;
      const p1Box = {
        x: p1.x - p1.width / 2,
        y: p1.y - p1.height,
        width: p1.width,
        height: p1.height,
      };

      if (
        hb.x < p1Box.x + p1Box.width &&
        hb.x + hb.width > p1Box.x &&
        hb.y < p1Box.y + p1Box.height &&
        hb.y + hb.height > p1Box.y
      ) {
        p2.hasHitCurrentAttack = true;
        const result = p1.takeDamage(hb, p2);
        spawnHitVfx(hb.x + hb.width / 2, hb.y + hb.height / 2, result.damageDealt, result.blocked, hb.type);
      }
    }
  }, [spawnHitVfx]);

  // Handle Round End
  const handleRoundEnd = useCallback((winner: 1 | 2 | 'draw') => {
    let nextP1Wins = p1Wins;
    let nextP2Wins = p2Wins;

    if (winner === 1) {
      nextP1Wins += 1;
      setP1Wins(nextP1Wins);
    } else if (winner === 2) {
      nextP2Wins += 1;
      setP2Wins(nextP2Wins);
    }

    // Check if match won (best of 3: first to 2 wins)
    if (gameMode !== 'training' && (nextP1Wins >= 2 || nextP2Wins >= 2)) {
      setMatchWinner(nextP1Wins >= 2 ? 1 : 2);
      if (gameMode === 'story' && nextP1Wins >= 2) {
        setScreen('story_outro');
      } else {
        setScreen('match_end');
      }
      return;
    }

    // Otherwise, trigger inter-round educational quiz before Round 2 or Round 3!
    const nextRound = currentRound + 1;
    if (nextRound <= 3 && gameMode !== 'training') {
      const randomQ = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
      setActiveQuiz(randomQ);
      setScreen('quiz');
    } else {
      startNextRound(nextRound);
    }
  }, [p1Wins, p2Wins, gameMode, currentRound, startNextRound]);

  // Quiz answer completed
  const handleQuizAnswerComplete = (correct: boolean) => {
    if (correct) {
      // Bonus: +20 stamina and +1 Debug Token
      p1Ref.current.stamina = Math.min(100, p1Ref.current.stamina + 20);
      p1Ref.current.debugTokens = Math.min(2, p1Ref.current.debugTokens + 1);
    }
    setScreen('fight');
    startNextRound(currentRound + 1);
  };

  // Canvas Main Loop
  useEffect(() => {
    if (screen !== 'fight') return;

    let lastTime = performance.now();
    let secondAcc = 0;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused) {
        // Update timer (60s countdown)
        if (gameMode !== 'training') {
          secondAcc += dt;
          if (secondAcc >= 1) {
            secondAcc = 0;
            setRoundTimer((prev) => {
              if (prev <= 1) {
                // Round time expired: winner by highest HP
                const p1Hp = p1Ref.current.hp;
                const p2Hp = p2Ref.current.hp;
                if (p1Hp > p2Hp) handleRoundEnd(1);
                else if (p2Hp > p1Hp) handleRoundEnd(2);
                else handleRoundEnd('draw');
                return 0;
              }
              return prev - 1;
            });
          }
        }

        // Check if either fighter KO'd
        const p1 = p1Ref.current;
        const p2 = p2Ref.current;

        if (p1.hp <= 0 && p1.stateTimer > 45) {
          handleRoundEnd(2);
        } else if (p2.hp <= 0 && p2.stateTimer > 45) {
          handleRoundEnd(1);
        }

        // Process active continuous keyboard inputs (movement & block)
        const keys = keysPressed.current;
        // P1 Movement
        if (keys.has('KeyA') || (gameMode !== 'versus_2p' && keys.has('ArrowLeft'))) {
          p1.moveLeft();
        } else if (keys.has('KeyD') || (gameMode !== 'versus_2p' && keys.has('ArrowRight'))) {
          p1.moveRight();
        } else if (!keys.has('KeyS') && !(gameMode !== 'versus_2p' && keys.has('ArrowDown')) && p1.state !== 'jump') {
          p1.stopMoving();
        }

        if (keys.has('KeyL')) {
          p1.startBlock();
        } else if (p1.isBlocking) {
          p1.stopBlock();
        }

        // P2 (2P Mode) - Kontrol Sisi Kanan Keyboard
        if (gameMode === 'versus_2p') {
          // Panah Kiri / Numpad 4 -> Bergerak ke Kiri
          if (keys.has('ArrowLeft') || keys.has('Numpad4')) {
            p2.moveLeft();
          } 
          // Panah Kanan / Numpad 6 -> Bergerak ke Kanan
          else if (keys.has('ArrowRight') || keys.has('Numpad6')) {
            p2.moveRight();
          } 
          else if (!keys.has('ArrowDown') && !keys.has('Numpad2') && p2.state !== 'jump') {
            p2.stopMoving();
          }

          // Bertahan / Block: Numpad 3, M, Semicolon (;)
          if (keys.has('Numpad3') || keys.has('KeyM') || keys.has('Semicolon')) {
            p2.startBlock();
          } else if (p2.isBlocking) {
            p2.stopBlock();
          }
        }

        // Physics updates
        p1.update(arenaWidthRef.current, groundYRef.current, p2);
        p2.update(arenaWidthRef.current, groundYRef.current, p1);

        // Training mode infinite stamina / HP recovery
        if (gameMode === 'training') {
          p1.hp = 100;
          p2.hp = 100;
          p1.stamina = 100;
          p2.stamina = 100;
        }

        // Check Hitbox Collisions
        checkCollisions();

        // Update background falling matrix particles
        bgParticlesRef.current.forEach((p) => {
          p.y += p.vy;
          if (p.y > groundYRef.current) {
            p.y = 0;
            p.x = Math.random() * arenaWidthRef.current;
          }
        });
      }

      // Render
      if (rendererRef.current) {
        const currentArena = ARENAS.find((a) => a.id === arenaId) || ARENAS[0];
        rendererRef.current.render(
          currentArena,
          groundYRef.current,
          [p1Ref.current, p2Ref.current],
          particlesRef.current,
          floatingTextsRef.current,
          bgParticlesRef.current,
          time * 0.001
        );
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [screen, isPaused, gameMode, arenaId, handleRoundEnd, checkCollisions]);

  // Window Resize & Canvas Scaling
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = Math.max(600, Math.floor(rect.width));
      const h = Math.max(380, Math.floor(rect.height));

      canvasRef.current.width = w;
      canvasRef.current.height = h;
      arenaWidthRef.current = w;
      groundYRef.current = Math.floor(h * 0.78);

      if (!rendererRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          rendererRef.current = new GameRenderer(ctx, w, h);
        }
      } else {
        rendererRef.current.setSize(w, h);
      }

      initBgParticles(w, h);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initBgParticles]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      keysPressed.current.add(e.code);

      if (screen !== 'fight' || isPaused) return;

      const p1 = p1Ref.current;
      const p2 = p2Ref.current;

      // P1 Actions
      if (e.code === 'KeyJ') {
        p1.lightAttack();
      } else if (e.code === 'KeyK') {
        p1.heavyAttack();
      } else if (e.code === 'Space') {
        e.preventDefault();
        p1.specialAttack();
      } else if (e.code === 'KeyU') {
        p1.ultimateAttack();
      } else if (e.code === 'KeyW') {
        p1.jump();
      } else if (e.code === 'KeyS') {
        p1.crouch();
      }

      // In 1P / Story / Training mode, Arrow Up/Down also jumps/crouches for P1
      if (gameMode !== 'versus_2p') {
        if (e.code === 'ArrowUp') {
          p1.jump();
        } else if (e.code === 'ArrowDown') {
          p1.crouch();
        }
      }

      // P2 Actions (Versus 2P Mode) - Tombol di bagian kanan keyboard (Panah & Numpad / Tombol Kanan)
      if (gameMode === 'versus_2p') {
        // Lompat (Panah Atas / Numpad 8)
        if (e.code === 'ArrowUp' || e.code === 'Numpad8') {
          e.preventDefault();
          p2.jump();
        } 
        // Jongkok (Panah Bawah / Numpad 2)
        else if (e.code === 'ArrowDown' || e.code === 'Numpad2') {
          e.preventDefault();
          p2.crouch();
        }
        // Pukulan Ringan (Light Attack): Numpad 1, Slash (/), Period (.), KeyI, KeyB
        else if (
          e.code === 'Numpad1' ||
          e.code === 'Slash' ||
          e.code === 'Period' ||
          e.code === 'KeyI' ||
          e.code === 'KeyB'
        ) {
          p2.lightAttack();
        } 
        // Pukulan Berat (Heavy Attack): Numpad 2, Numpad 5, Quote ('), KeyO, KeyN
        else if (
          e.code === 'Numpad5' ||
          e.code === 'Quote' ||
          e.code === 'KeyO' ||
          e.code === 'KeyN'
        ) {
          p2.heavyAttack();
        } 
        // Jurus Spesial: Enter, Numpad 0, NumpadEnter, BracketRight (])
        else if (
          e.code === 'Numpad0' ||
          e.code === 'Enter' ||
          e.code === 'NumpadEnter' ||
          e.code === 'BracketRight'
        ) {
          e.preventDefault();
          p2.specialAttack();
        } 
        // Ultimate Move: ShiftRight, Backslash (\), NumpadDecimal, KeyP
        else if (
          e.code === 'ShiftRight' ||
          e.code === 'Backslash' ||
          e.code === 'NumpadDecimal' ||
          e.code === 'KeyP'
        ) {
          p2.ultimateAttack();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
      if (screen !== 'fight') return;

      const p1 = p1Ref.current;
      const p2 = p2Ref.current;

      if (e.code === 'KeyS') {
        p1.stopCrouch();
      }

      if (gameMode !== 'versus_2p' && e.code === 'ArrowDown') {
        p1.stopCrouch();
      }

      if (gameMode === 'versus_2p' && (e.code === 'ArrowDown' || e.code === 'Numpad2')) {
        p2.stopCrouch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, isPaused, gameMode]);

  // Mode Selection from Menu
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'story') {
      setStoryChapterIndex(0);
      setScreen('select');
    } else {
      setScreen('select');
    }
  };

  // Start Battle from Character Select
  const handleStartBattle = (
    p1Id: CharacterId,
    p2Id: CharacterId,
    arena: string,
    diff: Difficulty
  ) => {
    if (gameMode === 'story') {
      const chapter = STORY_CHAPTERS[storyChapterIndex];
      setupMatch(p1Id, chapter.opponentId, chapter.arena, 'normal', 'story');
      setScreen('story_intro');
    } else {
      setupMatch(p1Id, p2Id, arena, diff, gameMode);
      setScreen('fight');
    }
  };

  // Advance to next story chapter
  const handleNextStoryChapter = () => {
    const nextIdx = storyChapterIndex + 1;
    if (nextIdx < STORY_CHAPTERS.length) {
      setStoryChapterIndex(nextIdx);
      const chapter = STORY_CHAPTERS[nextIdx];
      setupMatch(p1CharId, chapter.opponentId, chapter.arena, 'normal', 'story');
      setScreen('story_intro');
    } else {
      setScreen('menu');
    }
  };

  const currentChapter: StoryChapter = STORY_CHAPTERS[storyChapterIndex] || STORY_CHAPTERS[0];

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none flex flex-col">
      {/* 1. Main Canvas Arena View */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* In-Game HUD during Fight */}
        {screen === 'fight' && (
          <>
            <FightHud
              p1={p1Ref.current}
              p2={p2Ref.current}
              roundTimer={roundTimer}
              currentRound={currentRound}
              p1Wins={p1Wins}
              p2Wins={p2Wins}
              maxRounds={3}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              onOpenHelp={() => setShowHelp(true)}
              isTraining={gameMode === 'training'}
              mode={gameMode}
            />

            {/* Virtual On-Screen Controls for Mobile & Easy Play */}
            <VirtualControls
              player={p1Ref.current}
              onLightAttack={() => p1Ref.current.lightAttack()}
              onHeavyAttack={() => p1Ref.current.heavyAttack()}
              onSpecialAttack={() => p1Ref.current.specialAttack()}
              onUltimateAttack={() => p1Ref.current.ultimateAttack()}
              onStartBlock={() => p1Ref.current.startBlock()}
              onStopBlock={() => p1Ref.current.stopBlock()}
              onMoveLeft={() => p1Ref.current.moveLeft()}
              onMoveRight={() => p1Ref.current.moveRight()}
              onStopMove={() => p1Ref.current.stopMoving()}
              onJump={() => p1Ref.current.jump()}
              onCrouch={() => p1Ref.current.crouch()}
              onStopCrouch={() => p1Ref.current.stopCrouch()}
            />
          </>
        )}
      </div>

      {/* 2. Main Menu Overlay */}
      {screen === 'menu' && (
        <MainMenu
          onSelectMode={handleSelectMode}
          onOpenHelp={() => setShowHelp(true)}
          onOpenQuizLibrary={() => setScreen('quiz_library')}
        />
      )}

      {/* 3. Character Select Screen */}
      {screen === 'select' && (
        <CharacterSelect
          mode={gameMode}
          onBack={() => setScreen('menu')}
          onStartBattle={handleStartBattle}
        />
      )}

      {/* 4. Story Intro Dialogue */}
      {screen === 'story_intro' && (
        <StoryDialogModal
          dialogues={currentChapter.introDialogue}
          title={`${currentChapter.title.toUpperCase()} - MISI NETHERIUM`}
          onFinish={() => setScreen('fight')}
        />
      )}

      {/* 5. Story Victory Outro Dialogue */}
      {screen === 'story_outro' && (
        <StoryDialogModal
          dialogues={currentChapter.victoryDialogue}
          title={`${currentChapter.title.toUpperCase()} - STATUS DEBUG`}
          onFinish={() => setScreen('match_end')}
        />
      )}

      {/* 6. Inter-Round Logic Checkpoint Quiz (10s Timer) */}
      {screen === 'quiz' && activeQuiz && (
        <QuizModal
          question={activeQuiz}
          nextRoundNumber={currentRound + 1}
          onAnswerComplete={handleQuizAnswerComplete}
        />
      )}

      {/* 7. Match End Modal */}
      {screen === 'match_end' && (
        <MatchEndModal
          winner={matchWinner}
          p1={p1Ref.current}
          p2={p2Ref.current}
          p1Wins={p1Wins}
          p2Wins={p2Wins}
          isStoryMode={gameMode === 'story'}
          hasNextChapter={storyChapterIndex + 1 < STORY_CHAPTERS.length}
          onNextChapter={handleNextStoryChapter}
          onRematch={() => setupMatch(p1CharId, p2CharId, arenaId, difficulty, gameMode)}
          onSelectCharacter={() => setScreen('select')}
          onMainMenu={() => setScreen('menu')}
        />
      )}

      {/* 8. Educational Quiz Library / Study Mode */}
      {screen === 'quiz_library' && (
        <QuizLibrary onBack={() => setScreen('menu')} />
      )}

      {/* 9. Help & Controls Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
