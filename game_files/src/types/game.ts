export type CharacterId = 'var' | 'loop' | 'func' | 'array' | 'bug';

export type GameMode = 'story' | 'arcade' | 'versus_ai' | 'versus_2p' | 'training' | 'quiz_library';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type FighterState = 
  | 'idle' 
  | 'walk_forward' 
  | 'walk_backward' 
  | 'jump' 
  | 'crouch' 
  | 'light_attack' 
  | 'heavy_attack' 
  | 'special_attack' 
  | 'ultimate_attack' 
  | 'block' 
  | 'hit' 
  | 'lag_freeze' 
  | 'ko' 
  | 'win';

export interface CharacterDef {
  id: CharacterId;
  name: string;
  element: string;
  role: string;
  tagline: string;
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  specialName: string;
  specialDescription: string;
  ultimateName: string;
  ultimateDescription: string;
  lore: string;
  baseStats: {
    speed: number;
    power: number;
    defense: number;
    staminaRegen: number;
  };
  dialogues: {
    intro: string;
    vsBug: string;
    win: string;
    loss: string;
  };
}

export interface QuizQuestion {
  id: string;
  category: 'Variable' | 'Loop' | 'Function' | 'Array' | 'Logic' | 'Bug Fixing';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape?: 'dot' | 'spark' | 'char' | 'ring';
  char?: string;
  alpha?: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  life: number;
  size?: number;
  bold?: boolean;
}

export interface ArenaTheme {
  id: string;
  name: string;
  subtitle: string;
  skyColor: string;
  gridColor: string;
  glowColor: string;
  accentColor: string;
}

export interface MatchSettings {
  mode: GameMode;
  p1Char: CharacterId;
  p2Char: CharacterId;
  difficulty: Difficulty;
  arena: string;
  roundLimit: number; // usually 3 (best of 3)
}

export interface RoundResult {
  winner: 1 | 2 | 'draw';
  p1Hp: number;
  p2Hp: number;
  timeLeft: number;
}
