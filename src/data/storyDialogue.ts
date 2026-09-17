import { CharacterId } from '../types/game';

export interface DialogueNode {
  speaker: string;
  charId: CharacterId | 'system' | 'narrator';
  text: string;
  mood?: 'neutral' | 'angry' | 'smug' | 'worried';
}

export interface StoryChapter {
  id: number;
  title: string;
  opponentId: CharacterId;
  arena: string;
  introDialogue: DialogueNode[];
  victoryDialogue: DialogueNode[];
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Sektor 01: Inisialisasi Memori',
    opponentId: 'loop',
    arena: 'server_room',
    introDialogue: [
      {
        speaker: 'System Narrator',
        charId: 'narrator',
        text: 'Kota Netherium mulai mengalami anomali. Virus Bug telah menginfeksi sub-rutin perulangan di Server Room.',
      },
      {
        speaker: 'Loop (Terkorup)',
        charId: 'loop',
        text: 'Kondisi terminasi telah dihapus! Aku akan terus mengiterasi serangan ini selamanya!',
        mood: 'angry',
      },
      {
        speaker: 'Pemain',
        charId: 'var',
        text: 'Sadar, Loop! Jangan biarkan loop tanpa henti merusak infrastruktur memori kota!',
        mood: 'neutral',
      },
    ],
    victoryDialogue: [
      {
        speaker: 'Loop',
        charId: 'loop',
        text: 'Kondisi... terpenuhi. Logika kepalaku kembali jernih. Terima kasih telah mendebug-ku!',
        mood: 'neutral',
      },
      {
        speaker: 'System Narrator',
        charId: 'narrator',
        text: 'Sektor 01 berhasil dibersihkan! Namun jejak virus mengarah langsung ke Security Perimeter...',
      },
    ],
  },
  {
    id: 2,
    title: 'Sektor 02: Firewall Breach',
    opponentId: 'array',
    arena: 'firewall_zone',
    introDialogue: [
      {
        speaker: 'System Narrator',
        charId: 'narrator',
        text: 'Di Firewall Zone, Array telah terpengaruh oleh buffer overflow yang disebabkan oleh Virus Bug.',
      },
      {
        speaker: 'Array (Terkorup)',
        charId: 'array',
        text: 'INDEX OUT OF BOUNDS! Seluruh blok pertahanan ini akan kuhancurkan dengan slam tak berhingga!',
        mood: 'angry',
      },
      {
        speaker: 'Pemain',
        charId: 'var',
        text: 'Struktur datamu kacau balau. Aku harus mengatur ulang batas indeksmu sebelum firewall jebol!',
        mood: 'worried',
      },
    ],
    victoryDialogue: [
      {
        speaker: 'Array',
        charId: 'array',
        text: 'Indeks memoriku... sudah kembali teratur. Virus Bug... dia sudah menyusup ke Core System!',
        mood: 'neutral',
      },
      {
        speaker: 'Pemain',
        charId: 'var',
        text: 'Tetap di posisimu, Array. Aku yang akan masuk ke jantung CPU dan menghentikannya!',
        mood: 'neutral',
      },
    ],
  },
  {
    id: 3,
    title: 'Sektor 03: Kernel Showdown (Final Boss)',
    opponentId: 'bug',
    arena: 'core_system',
    introDialogue: [
      {
        speaker: 'System Narrator',
        charId: 'narrator',
        text: 'Core System Netherium. Di hadapanmu berdiri sumber kekacauan: Sang Virus BUG raksasa.',
      },
      {
        speaker: 'VIRUS BUG',
        charId: 'bug',
        text: '01000101 01010010 01010010 01001111 01010010! Sia-sia saja, Guardian! Netherium akan tenggelam dalam Kernel Panic!',
        mood: 'smug',
      },
      {
        speaker: 'Pemain',
        charId: 'var',
        text: 'Tidak selama logika dasar pemrograman masih kami junjung! Kami adalah pertahanan terakhir Netherium!',
        mood: 'angry',
      },
    ],
    victoryDialogue: [
      {
        speaker: 'VIRUS BUG',
        charId: 'bug',
        text: 'TIDAK! Debug Token itu... menghapus seluruh baris infektsiku... SYSTEM REBOOTED...',
        mood: 'worried',
      },
      {
        speaker: 'System Narrator',
        charId: 'narrator',
        text: 'SELAMAT! Virus Bug telah dinetralisir sepenuhnya. Kota digital Netherium kembali damai berkat kekuatan logikamu!',
      },
    ],
  },
];
