import { CharacterDef, CharacterId } from '../types/game';

export const CHARACTERS: Record<CharacterId, CharacterDef> = {
  var: {
    id: 'var',
    name: 'Var',
    element: 'Variable',
    role: 'Speed & Agility Fighter',
    tagline: 'Fleksibel, dinamis, dan selalu siap dialokasikan kembali.',
    accentColor: '#00f0ff', // Cyan
    secondaryColor: '#f59e0b', // Amber
    glowColor: 'rgba(0, 240, 255, 0.6)',
    specialName: 'Reassign',
    specialDescription: 'Melakukan swap posisi instan ke belakang lawan lalu melancarkan tendangan kilat!',
    ultimateName: 'Garbage Collection Supernova',
    ultimateDescription: 'Membersihkan memory secara radikal, melenyapkan serangan musuh dengan ledakan data!',
    lore: 'Terlahir dari alokasi memori dinamis Netherium. Var mampu mengubah orientasi nilai dan gerakannya secepat eksekusi baris kode.',
    baseStats: {
      speed: 8.5,
      power: 6.0,
      defense: 6.0,
      staminaRegen: 1.2,
    },
    dialogues: {
      intro: 'Tipe data boleh berubah, tapi tekadku membersihkan Netherium tetap konstan!',
      vsBug: 'Variabel korup tidak pantas berada di call stack kota ini!',
      win: 'Variabel telah dideklarasikan ulang. Sistem kembali stabil!',
      loss: 'ReferenceError: Alokasi energiku terputus...',
    },
  },
  loop: {
    id: 'loop',
    name: 'Loop',
    element: 'Perulangan',
    role: 'Combo Rush Specialist',
    tagline: 'Selama kondisi bernilai TRUE, seranganku takkan pernah terhenti!',
    accentColor: '#10b981', // Emerald
    secondaryColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    specialName: 'Infinite Strike',
    specialDescription: 'Perulangan "while(true)" fisik: 3 pukulan combo beruntun otomatis tanpa jeda!',
    ultimateName: 'Stack Overflow Torrent',
    ultimateDescription: 'Membanjiri arena dengan badai siklus iterasi yang meluluhlantakkan pertahanan musuh!',
    lore: 'Konstruksi perulangan for dan while dari Netherium. Loop pantang menyerah sebelum kondisi terminasi tercapai.',
    baseStats: {
      speed: 7.0,
      power: 7.0,
      defense: 7.0,
      staminaRegen: 1.0,
    },
    dialogues: {
      intro: 'Inisialisasi selesai. Mari kita iterasi ronde ini sampai tuntas!',
      vsBug: 'Bug sialan, aku akan menjalankan loop pemusnahan padamu tanpa henti!',
      win: 'Iterasi mencapai kondisi akhir. Eksekusi sukses 100%!',
      loss: 'Break condition terpicu... Siklusku terhenti paksa.',
    },
  },
  func: {
    id: 'func',
    name: 'Func',
    element: 'Function',
    role: 'Tactician & Life Drainer',
    tagline: 'Input teratur menghasilkan output yang mematikan.',
    accentColor: '#8b5cf6', // Violet
    secondaryColor: '#ec4899', // Pink
    glowColor: 'rgba(139, 92, 246, 0.6)',
    specialName: 'Return Value',
    specialDescription: 'Mengeksekusi fungsi transfer data: Menyerang lawan dan menyerap 10 HP menjadi darah sendiri!',
    ultimateName: 'Recursive Explosion',
    ultimateDescription: 'Memanggil dirinya sendiri berulang kali dalam chain reaksi ledakan fraktal logika!',
    lore: 'Modul logika terbungkus rapi dari Netherium Core. Func memperhitungkan setiap parameter dan mengembalikan hasil optimal di pertempuran.',
    baseStats: {
      speed: 6.5,
      power: 7.5,
      defense: 6.5,
      staminaRegen: 1.1,
    },
    dialogues: {
      intro: 'Parameter sudah divalidasi. Waktunya mengembalikan nilai kemenangan!',
      vsBug: 'Kamu hanyalah Null Pointer yang gagal dikompilasi!',
      win: 'Return true: Ancaman bug berhasil diatasi dengan efisien.',
      loss: 'Uncaught Exception: Fungsi mengalami kegagalan tak terduga.',
    },
  },
  array: {
    id: 'array',
    name: 'Array',
    element: 'Struktur Data',
    role: 'Heavy Heavyweight Tank',
    tagline: 'Terstruktur, kokoh, dengan jangkauan indeks yang tak terbatas.',
    accentColor: '#f97316', // Orange
    secondaryColor: '#ef4444', // Red
    glowColor: 'rgba(249, 115, 22, 0.6)',
    specialName: 'Index Slam',
    specialDescription: 'Menghantam tanah arena, memunculkan pilar indeks berurutan [0..3] dengan jangkauan sangat lebar!',
    ultimateName: 'Matrix Transpose Cataclysm',
    ultimateDescription: 'Membalikkan dimensi matriks 2D menjadi gelombang kejut multi-vektor berdaya hancur tinggi!',
    lore: 'Fondasi penyimpanan data terurut di Netherium. Array memiliki massa komputasi besar dan jangkauan hantaman yang tak tertandingi.',
    baseStats: {
      speed: 5.5,
      power: 8.5,
      defense: 8.5,
      staminaRegen: 0.85,
    },
    dialogues: {
      intro: 'Ukuran memoriku tak terbatas, dan pertahananku tak tertembus!',
      vsBug: 'Akan kulempar kamu ke IndexError: Array index out of range!',
      win: 'Seluruh elemen tersusun rapi. Wilayah aman!',
      loss: 'Memory allocation failed: Beban array melebihi kapasitas...',
    },
  },
  bug: {
    id: 'bug',
    name: 'BUG',
    element: 'Virus Korup',
    role: 'Glitch & Chaos Boss',
    tagline: '01000101 01010010 01010010 01001111 01010010: Sistem harus hancur!',
    accentColor: '#e11d48', // Crimson/Magenta
    secondaryColor: '#a855f7', // Purple
    glowColor: 'rgba(225, 29, 72, 0.7)',
    specialName: 'Crash',
    specialDescription: 'Menembakkan gelombang glitch yang membekukan (freeze/lag) gerak musuh selama 1.2 detik!',
    ultimateName: 'Kernel Panic Doom',
    ultimateDescription: 'Membuat layar terdisorientasi dengan glitch total dan hantaman destruktif tak terelakkan!',
    lore: 'Anomali berbahaya yang lahir dari baris kode usang dan logika rusak. Bug ingin menenggelamkan Netherium ke dalam kehampaan tak berujung.',
    baseStats: {
      speed: 7.2,
      power: 8.0,
      defense: 7.0,
      staminaRegen: 1.0,
    },
    dialogues: {
      intro: 'CRASH... GLITCH... Seluruh program akan segera dihapus!',
      vsBug: 'Aku adalah kesalahan tak terelakkan dari ciptaan kalian!',
      win: 'SYSTEM CRITICAL ERROR: Netherium sepenuhnya runtuh!',
      loss: 'TIDAK! Debugger... mereka berhasil mematikan prosesku...',
    },
  },
};

export const ARENAS = [
  {
    id: 'server_room',
    name: 'Server Room',
    subtitle: 'Netherium Data Center - Sub-layer 01',
    skyColor: '#0a0f1d',
    gridColor: '#1e293b',
    glowColor: '#00f0ff',
    accentColor: '#38bdf8',
  },
  {
    id: 'firewall_zone',
    name: 'Firewall Zone',
    subtitle: 'Security Perimeter - High Alert',
    skyColor: '#1a0808',
    gridColor: '#450a0a',
    glowColor: '#ef4444',
    accentColor: '#f97316',
  },
  {
    id: 'core_system',
    name: 'Core System',
    subtitle: 'Netherium Kernel & CPU Core',
    skyColor: '#0f0728',
    gridColor: '#2e1065',
    glowColor: '#a855f7',
    accentColor: '#c084fc',
  },
];
