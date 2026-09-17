# Code Clash: Battle of Logic (Stickman Fighting Game)

Game fighting 2D edukatif bertema logika pemrograman di dunia virtual Netherium dengan animasi Stickman seni bela diri yang lincah (terinspirasi dari pertarungan stickman klasik Xiao Xiao).

---

## 📁 Struktur Folder `game_files/`

Folder ini berisi seluruh aset, kode sumber, dan paket kompilasi game:

```
game_files/
├── README.md               # Panduan lengkap & dokumentasi game
├── game_build/             # Versi produksi siap main (Standalone Production Build)
│   ├── index.html          # Halaman game utama
│   └── assets/             # Bundle JavaScript & CSS hasil kompilasi
├── src/                    # Source code lengkap React & TypeScript
│   ├── App.tsx             # Game state machine & screen orchestrator
│   ├── main.tsx            # Entry point aplikasi
│   ├── index.css           # Styling Tailwind CSS
│   ├── game/               # Core fighting engine
│   │   ├── fighter.ts      # Fisika stickman, hitbox, hurtbox, state machine
│   │   └── renderer.ts     # Canvas 2D stickman animator & visual effects (VFX)
│   ├── components/         # Komponen UI (HUD, Character Select, Virtual Controls, dll.)
│   │   ├── FightHud.tsx
│   │   ├── CharacterSelect.tsx
│   │   ├── StickmanPreviewCanvas.tsx
│   │   ├── VirtualControls.tsx
│   │   ├── QuizModal.tsx
│   │   ├── StoryDialogModal.tsx
│   │   ├── MatchEndModal.tsx
│   │   ├── MainMenu.tsx
│   │   └── HelpModal.tsx
│   ├── audio/              # Sound synthesis engine (Web Audio API)
│   │   └── soundManager.ts
│   ├── data/               # Karakter, arena panggung, quiz logic, dan dialog cerita
│   │   ├── characters.ts
│   │   ├── quizQuestions.ts
│   │   └── storyDialogue.ts
│   └── types/              # Deklarasi tipe TypeScript
│       └── game.ts
├── index.html              # HTML entry point untuk development
├── package.json            # Daftar dependensi & npm scripts
├── tsconfig.json           # Konfigurasi TypeScript
└── vite.config.ts          # Konfigurasi build Vite
```

---

## 🚀 Cara Menjalankan Game

### Opsi 1: Menjalankan Versi Siap Main (`game_build/`)
Versi di dalam folder `game_build/` sudah dikompilasi ke HTML, JS, dan CSS statis.
Anda dapat menjalankannya dengan web server lokal ringan:
```bash
# Menggunakan Python 3:
cd game_build
python3 -m http.server 8080

# Atau menggunakan npx serve:
npx serve game_build
```
Lalu buka browser di `http://localhost:8080`.

### Opsi 2: Mode Pengembangan / Development (`src/`)
Untuk mengedit kode sumber atau memodifikasi jurus dan karakter:
```bash
# 1. Masuk ke folder proyek
cd game_files

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```
Buka browser di URL yang tertera (biasanya `http://localhost:3000` atau `http://localhost:5173`).

---

## 🎮 Panduan Kontrol Tombol

### Player 1 (Keyboard):
- **W / S / A / D**: Lompat / Jongkok / Mundur / Maju
- **J**: Pukulan Ringan (*Light Attack / Xiao Xiao Jab*)
- **K**: Tendangan Keras (*Heavy Roundhouse Kick*)
- **L**: Jurus Spesial (*Special Attack*)
- **U**: Tangkisan Silang (*Block*)
- **I**: Jurus Pamungkas (*Ultimate Beam* saat Mana penuh)
- **O**: Quiz Logic (*Memulihkan HP & Mana jika jawaban benar*)
- **ESC / P**: Pause Game

### Player 2 (Local Versus Mode):
- **Tombol Panah Atas / Bawah / Kiri / Kanan**: Gerakan & Arah
- **Numpad 1**: Pukulan Ringan
- **Numpad 2**: Tendangan Keras
- **Numpad 3**: Jurus Spesial
- **Numpad 4**: Tangkisan Silang (*Block*)
- **Numpad 5**: Jurus Pamungkas (*Ultimate*)
- **Numpad 6**: Quiz Logic

### Perangkat Layar Sentuh / Smartphone:
- D-Pad analog virtual di sisi kiri layar untuk navigasi.
- Tombol aksi virtual (Pukul, Tendang, Spesial, Tangkis, Ultimate, Quiz) di sisi kanan layar.

---

## 🥋 Daftar Karakter Stickman Guardian

1. **VAR (The Cyber Ninja):**
   - Elemen: *Variable / Memory*
   - Ciri Khas: Stickman ber-visor cyan dengan syal ninja melambai.
   - Kecepatan tinggi dengan jurus luncuran *Sonic Blitz*.
   
2. **LOOP (The Martial Monk):**
   - Elemen: *Iteration / Loop*
   - Ciri Khas: Stickman hijau emerald dengan halo lingkaran tak hingga di kepala.
   - Pukulan beruntun 3-hit *Infinite Barrage*.

3. **FUNC (The Cyber Sorcerer):**
   - Elemen: *Function / Encapsulation*
   - Ciri Khas: Stickman penyihir ungu berjubah dengan kristal kurung kurawal `{ }`.
   - Melancarkan bola plasma penyerot energi *Siphon Vortex*.

4. **ARRAY (The Heavy Juggernaut):**
   - Elemen: *Data Structure / Array*
   - Ciri Khas: Stickman kokoh dengan sarung tinju besi berduri dan pelindung indeks `[0]`.
   - Menghantam tanah dengan gempa seismik *Ground Slam*.

5. **BUG (The Glitch Corruptor - Boss):**
   - Elemen: *Syntax Error / Glitch*
   - Ciri Khas: Stickman merah-hitam bayangan dengan tanduk iblis dan cakar laser bergerigi.
