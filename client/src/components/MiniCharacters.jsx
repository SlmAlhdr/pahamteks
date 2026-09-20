import React from 'react';
import {
  DownPointer2DIcon,
  CodeTag2DIcon,
  Sparkle2DIcon,
  Rocket2DIcon
} from './Art2DIcons';

/**
 * =================================================================
 * ORIGINAL PAHAMTEKS CHARACTER ROSTER (100% PURE CUSTOM DESIGN)
 * =================================================================
 * 1. "Teksie" - Si Musang Cerdas (Maskot Utama PahamTeks)
 *    Ciri: Telinga musang membulat khas luwak, kacamata pintar cyan, posisi duduk 4 kaki alami
 * 2. "Bitto" - Si Robot Logika & Koding (The Quantum Logic Bot)
 *    Ciri: Robot bulat mengambang, wajah layar LED senyum, antena titik-koma (;)
 * 3. "Aki" - Si Kucing Penjelajah Bahasa Dunia (The Polyglot Explorer Cat)
 *    Ciri: Kucing petualang memakai baret dan syal penjelajah bendera dunia
 * 4. "Luki" - Si Luwak Mentor Berprestasi (The Wise Civet Mentor)
 *    Ciri: Luwak ramah khas Nusantara dengan sweter hangat, piala emas & jempol
 * =================================================================
 */

/**
 * Maskot Utama: "Teksie" Si Musang Cerdas
 */
export function TeksieFox({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <radialGradient id="tfFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb056" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tfFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="tfBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tfPaws" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="65%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <linearGradient id="tfGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="tfScarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tfTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Bayangan Kontak Tanah 3D */}
      <ellipse cx="65" cy="120" rx="46" ry="6.5" fill="rgba(15, 23, 42, 0.28)" />

      {/* Ekor Musang Tebal Melengkung ke Kanan dengan Ujung Putih */}
      <g>
        <path
          d="M76 96C98 90 118 98 114 110C110 120 92 118 80 110"
          fill="url(#tfFurBody)"
        />
        <path
          d="M106 104C116 106 114 114 108 116C102 118 98 112 102 106Z"
          fill="url(#tfTailTip)"
        />
        <path d="M104 102C108 100 112 102 114 106" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Kaki Belakang Melipat di Samping Tubuh (Hind Legs Folded at Sides) */}
      <g>
        {/* Paha & Kaki Belakang Kiri */}
        <ellipse cx="36" cy="102" rx="14" ry="11" fill="url(#tfFurBody)" />
        <ellipse cx="32" cy="114" rx="8" ry="4.5" fill="url(#tfPaws)" />
        <ellipse cx="32" cy="113" rx="5" ry="2.5" fill="#ffedd5" />

        {/* Paha & Kaki Belakang Kanan */}
        <ellipse cx="94" cy="102" rx="14" ry="11" fill="url(#tfFurBody)" />
        <ellipse cx="98" cy="114" rx="8" ry="4.5" fill="url(#tfPaws)" />
        <ellipse cx="98" cy="113" rx="5" ry="2.5" fill="#ffedd5" />
      </g>

      {/* Badan Musang Gembul Alami (Natural Chubby Civet Torso) */}
      <ellipse cx="65" cy="94" rx="30" ry="22" fill="url(#tfFurBody)" />
      <path d="M48 80C56 75 74 75 82 80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <ellipse cx="65" cy="96" rx="18" ry="15" fill="url(#tfBelly)" />

      {/* Dua Kaki Depan Bertumpu Rapi di Tanah (Front Paws Planted Naturally on Ground) */}
      <g>
        {/* Kaki Depan Kiri */}
        <path
          d="M52 82C50 92 48 106 50 113C51 116 57 116 58 113C60 106 62 92 60 82Z"
          fill="url(#tfFurBody)"
        />
        <ellipse cx="54" cy="113" rx="7" ry="4.5" fill="url(#tfPaws)" />
        <ellipse cx="54" cy="112" rx="4.5" ry="2.5" fill="#ffedd5" />
        <circle cx="50" cy="113" r="1.3" fill="#ea580c" />
        <circle cx="54" cy="114" r="1.3" fill="#ea580c" />
        <circle cx="58" cy="113" r="1.3" fill="#ea580c" />

        {/* Kaki Depan Kanan */}
        <path
          d="M78 82C76 92 78 106 80 113C81 116 87 116 88 113C90 106 88 92 86 82Z"
          fill="url(#tfFurBody)"
        />
        <ellipse cx="84" cy="113" rx="7" ry="4.5" fill="url(#tfPaws)" />
        <ellipse cx="84" cy="112" rx="4.5" ry="2.5" fill="#ffedd5" />
        <circle cx="80" cy="113" r="1.3" fill="#ea580c" />
        <circle cx="84" cy="114" r="1.3" fill="#ea580c" />
        <circle cx="88" cy="113" r="1.3" fill="#ea580c" />
      </g>

      {/* Kalung Hijau Zamrud PahamTeks dengan Medali Emas */}
      <g>
        <path
          d="M44 68C52 75 78 75 86 68L84 76C76 81 54 81 46 76Z"
          fill="url(#tfScarf)"
        />
        <circle cx="65" cy="76" r="4.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="64" cy="75" r="1.2" fill="#ffffff" />
      </g>

      {/* Telinga Musang Cerdas (Rounded Triangular Civet Ears - Khas Luwak) */}
      <g>
        {/* Telinga Kiri */}
        <path d="M46 30L30 10C24 22 32 38 48 42Z" fill="url(#tfFurBody)" />
        <path d="M44 28L34 14C30 22 36 34 46 38Z" fill="#fed7aa" />
        <path d="M43 28L36 18C34 22 38 30 44 34Z" fill="#f472b6" opacity="0.75" />

        {/* Telinga Kanan */}
        <path d="M84 30L100 10C106 22 98 38 82 42Z" fill="url(#tfFurBody)" />
        <path d="M86 28L96 14C100 22 94 34 84 38Z" fill="#fed7aa" />
        <path d="M87 28L94 18C96 22 92 30 86 34Z" fill="#f472b6" opacity="0.75" />
      </g>

      {/* Kepala Bulat Musang Cerdas 3D */}
      <circle cx="65" cy="46" r="30" fill="url(#tfFurHead)" />
      <path
        d="M50 24C58 20 72 20 80 24"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Pipi Putih Halus Mengembang Khas Musang */}
      <path
        d="M36 50C36 66 48 72 65 72C82 72 94 66 94 50C94 43 86 40 78 42C72 44 68 46 65 46C62 46 58 44 52 42C44 40 36 43 36 50Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Manis */}
      <ellipse cx="44" cy="58" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />
      <ellipse cx="86" cy="58" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />

      {/* Kacamata Pintar Cyan 3D */}
      <g>
        <circle cx="51" cy="46" r="13" stroke="url(#tfGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
        <circle cx="79" cy="46" r="13" stroke="url(#tfGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
        <path d="M64 46H66" stroke="url(#tfGlasses)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M45 38C48 35 55 35 58 39" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
        <path d="M73 38C76 35 83 35 86 39" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Mata Hitam Besar Berbinar Cerdas (Duolingo Style Eyes) */}
      <g>
        <ellipse cx="51" cy="46" rx="6" ry="6.5" fill="#0f172a" />
        <ellipse cx="79" cy="46" rx="6" ry="6.5" fill="#0f172a" />
        <circle cx="49" cy="43.5" r="2.6" fill="#ffffff" />
        <circle cx="77" cy="43.5" r="2.6" fill="#ffffff" />
        <circle cx="53.5" cy="49" r="1.2" fill="#ffffff" />
        <circle cx="81.5" cy="49" r="1.2" fill="#ffffff" />
      </g>

      {/* Hidung Hitam Imut 3D */}
      <polygon points="62,56 68,56 65,60" fill="#0f172a" />
      <circle cx="64" cy="56.5" r="0.8" fill="#ffffff" />

      {/* Senyum Terbuka Ceria dengan Lidah Pink */}
      <path
        d="M60 62C62 67 68 67 70 62Z"
        fill="#881337"
      />
      <path
        d="M62 64C63 66 67 66 68 64Z"
        fill="#fb7185"
      />
    </svg>
  );
}

/**
 * Karakter Penunjuk Tombol Asli PahamTeks (PeekingPointer):
 * Teksie Si Musang Cerdas mengintip dari atas kartu login
 * dengan telinga musang membulat dan cakar berbulu yang menunjuk tombol ke bawah!
 */
export function PeekingPointer({
  activeTab,
  onPointerClick,
  t,
  currentLang
}) {
  const isRegister = activeTab === 'register';

  return (
    <div className="peeking-pointer-container">
      {/* Balon Kata Interaktif Menunjuk ke Bawah */}
      <div className="peeking-speech-bubble" onClick={onPointerClick} title="Klik untuk beralih">
        <span className="speech-icon">
          <DownPointer2DIcon size={18} />
        </span>
        <span className="speech-text">
          {isRegister
            ? (currentLang === 'en' ? 'Choose your username & join free!' : 'Pilih username unik & buat akun gratis!')
            : (currentLang === 'en' ? 'Don’t have an account? Click Register Account below!' : 'Belum punya akun? Klik Daftar Akun di bawah ini!')}
        </span>
      </div>

      {/* Teksie Mengintip dan Menunjuk ke Bawah (Ke Tab Daftar Akun) */}
      <div className="peeking-character-wrapper" onClick={onPointerClick}>
        <svg
          width="140"
          height="105"
          viewBox="0 0 140 105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="peeking-character-svg"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.35))' }}
        >
          <defs>
            <radialGradient id="ppFurHead" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffb96a" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#b43a06" />
            </radialGradient>
            <radialGradient id="ppFurDark" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff9d42" />
              <stop offset="55%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
            <linearGradient id="ppGlasses" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {/* Telinga Musang Kiri (Compact Rounded Civet Ear) */}
          <path d="M48 50L32 26C26 38 32 54 48 60Z" fill="url(#ppFurDark)" />
          <path d="M46 48L36 30C32 38 36 48 46 54Z" fill="#fed7aa" />
          <path d="M45 48L38 34C36 38 40 45 44 50Z" fill="#f472b6" opacity="0.75" />

          {/* Telinga Musang Kanan (Compact Rounded Civet Ear) */}
          <path d="M86 50L102 26C108 38 102 54 86 60Z" fill="url(#ppFurDark)" />
          <path d="M88 48L98 30C102 38 98 48 88 54Z" fill="#fed7aa" />
          <path d="M89 48L96 34C98 38 94 45 90 50Z" fill="#f472b6" opacity="0.75" />

          {/* Kepala Musang Mengintip 3D */}
          <path d="M25 105C25 58 44 42 67 42C90 42 109 58 109 105H25Z" fill="url(#ppFurHead)" />
          <path d="M45 52C55 46 75 46 87 52C80 48 55 48 45 52Z" fill="#ffffff" opacity="0.4" />

          {/* Pipi Putih Mengintip */}
          <path d="M32 90C32 102 46 105 67 105C88 105 102 102 102 90C102 82 92 78 84 80C75 83 72 85 67 85C62 85 59 83 50 80C42 78 32 82 32 90Z" fill="#ffffff" />
          <ellipse cx="40" cy="94" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
          <ellipse cx="94" cy="94" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />

          {/* Hidung Hitam 3D */}
          <polygon points="64,90 70,90 67,95" fill="#0f172a" />
          <circle cx="66" cy="91" r="0.8" fill="#ffffff" />

          {/* Mata Melirik ke Bawah ke Arah Tab Tombol (Expressive Duolingo Look) */}
          <circle cx="50" cy="74" r="11" fill="#ffffff" />
          <circle cx="84" cy="74" r="11" fill="#ffffff" />
          <circle cx="52" cy="77" r="6" fill="#0f172a" />
          <circle cx="86" cy="77" r="6" fill="#0f172a" />
          <circle cx="50.5" cy="75.5" r="2.4" fill="#ffffff" />
          <circle cx="84.5" cy="75.5" r="2.4" fill="#ffffff" />
          <circle cx="54" cy="79.5" r="1.1" fill="#ffffff" />
          <circle cx="88" cy="79.5" r="1.1" fill="#ffffff" />

          {/* Kacamata Pintar Mengintip 3D Cyan */}
          <circle cx="50" cy="74" r="13" stroke="url(#ppGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
          <circle cx="84" cy="74" r="13" stroke="url(#ppGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
          <path d="M63 74H71" stroke="url(#ppGlasses)" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M43 66C46 63 52 63 56 67" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
          <path d="M77 66C80 63 86 63 90 67" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

          {/* Cakar Musang Berbulu yang Bergerak Menunjuk ke Bawah (Arah Tab Tombol) */}
          <g className="pointing-hand-down-animated">
            <ellipse cx="106" cy="70" rx="14" ry="12" fill="url(#ppFurHead)" />
            <ellipse cx="106" cy="70" rx="9" ry="8" fill="#ffedd5" />
            {/* Jari menunjuk ke bawah langsung ke arah tab Daftar Akun */}
            <path
              d="M106 72V98"
              stroke="url(#ppFurHead)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M106 74V95"
              stroke="#ffedd5"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="106" cy="98" r="3" fill="#ea580c" />
            <ellipse cx="118" cy="74" rx="5" ry="7" fill="url(#ppFurHead)" transform="rotate(20 118 74)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/**
 * Karakter 2: "Bitto" Si Robot Logika & Koding (The Quantum Logic Bot)
 * Robot imut mengambang berbentuk kubus halus dengan layar wajah LED senyum
 */
export function BittoBot({ size = 110, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
    >
      {/* Antena Titik-Koma (;) dengan Lampu Hijau Berkedip */}
      <line x1="70" y1="28" x2="70" y2="40" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="22" r="6" fill="#58cc02" />
      <circle cx="70" cy="22" r="2.5" fill="#ffffff" />

      {/* Badan / Kepala Robot (Rounded Chassis Warna Slate Gelap) */}
      <rect x="30" y="40" width="80" height="74" rx="24" fill="#0f172a" stroke="#1cb0f6" strokeWidth="3" />

      {/* Layar Kaca Wajah Digital */}
      <rect x="40" y="52" width="60" height="42" rx="14" fill="#021d17" stroke="#059669" strokeWidth="2" />

      {/* Mata LED Hijau Senyum (^  ^) */}
      <path d="M48 72C50 67 56 67 58 72" stroke="#58cc02" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M82 72C84 67 90 67 92 72" stroke="#58cc02" strokeWidth="3.5" strokeLinecap="round" />

      {/* Mulut Digital Senyum Lebar */}
      <path d="M64 80C67 84 73 84 76 80" stroke="#58cc02" strokeWidth="2.5" strokeLinecap="round" />

      {/* Telinga / Baut Speaker Kiri & Kanan */}
      <rect x="22" y="65" width="8" height="18" rx="4" fill="#1cb0f6" />
      <rect x="110" y="65" width="8" height="18" rx="4" fill="#1cb0f6" />

      {/* Jet Pengapung Cyan di Bawah */}
      <ellipse cx="70" cy="116" rx="16" ry="6" fill="#0284c7" />
      <ellipse cx="70" cy="120" rx="9" ry="4" fill="#38bdf8" />
      <path d="M64 122L70 134L76 122" fill="#7ef2e0" opacity="0.8" />
    </svg>
  );
}

/**
 * Karakter 3: "Aki" Si Kucing Penjelajah Bahasa (The Polyglot Explorer Cat)
 * Kucing calico ceria dengan topi baret petualang dan syal bendera
 */
export function AkiCat({ size = 110, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}
    >
      {/* Telinga Kucing Kiri & Kanan */}
      <polygon points="40,56 30,28 60,44" fill="#f59e0b" />
      <polygon points="42,52 35,34 54,45" fill="#fecdd3" />

      <polygon points="100,56 110,28 80,44" fill="#334155" />
      <polygon points="98,52 105,34 86,45" fill="#fecdd3" />

      {/* Topi Baret Petualang Tosca */}
      <ellipse cx="68" cy="38" rx="28" ry="12" fill="#0d9488" />
      <circle cx="68" cy="26" r="3.5" fill="#ffd700" />

      {/* Kepala Kucing Bulat */}
      <ellipse cx="70" cy="68" rx="38" ry="32" fill="#fef3c7" />

      {/* Belang Kucing di Mata Kanan */}
      <path d="M82 48C94 50 104 60 102 78C94 78 84 72 82 58Z" fill="#f59e0b" opacity="0.8" />

      {/* Mata Bulat Ceria Penuh Keingintahuan */}
      <circle cx="54" cy="66" r="6" fill="#1e293b" />
      <circle cx="86" cy="66" r="6" fill="#1e293b" />
      <circle cx="52" cy="64" r="2.2" fill="#ffffff" />
      <circle cx="84" cy="64" r="2.2" fill="#ffffff" />

      {/* Hidung Merah Muda Kecil */}
      <polygon points="68,74 72,74 70,77" fill="#f43f5e" />
      <path d="M66 78C68 81 70 81 70 78C70 81 72 81 74 78" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

      {/* Kumis Kucing Kiri & Kanan */}
      <line x1="34" y1="74" x2="48" y2="76" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="80" x2="48" y2="79" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="106" y1="74" x2="92" y2="76" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="106" y1="80" x2="92" y2="79" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

      {/* Syal Merah Petualang */}
      <path d="M48 94C56 102 84 102 92 94L88 108C78 112 62 112 52 108Z" fill="#ef4444" />
      <rect x="74" y="100" width="12" height="24" rx="4" fill="#dc2626" />

      {/* Badan Berbaju Jaket Hijau */}
      <path d="M46 104C46 98 56 94 70 94C84 94 94 98 94 104V135H46V104Z" fill="#047857" />

      {/* Bendera Dunia Kecil yang Dipegang */}
      <line x1="104" y1="70" x2="104" y2="135" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M104 72L126 82L104 92V72Z" fill="#3b82f6" />
    </svg>
  );
}

/**
 * Karakter 4: "Luki" Si Luwak Mentor Bijak (The Wise Civet Mentor)
 * Luwak ceria khas Indonesia dengan tanda garis mata khas,
 * sweter hangat, jempol bangga, dan memegang piala prestasi!
 */
export function LukiCivet({ size = 125, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
    >
      {/* Telinga Luwak Kiri & Kanan */}
      <ellipse cx="50" cy="38" rx="12" ry="14" fill="#334155" />
      <ellipse cx="50" cy="38" rx="7" ry="9" fill="#fed7aa" />
      <ellipse cx="100" cy="38" rx="12" ry="14" fill="#334155" />
      <ellipse cx="100" cy="38" rx="7" ry="9" fill="#fed7aa" />

      {/* Badan / Sweter Rajut Hijau Zamrud */}
      <path d="M45 84C45 74 60 68 75 68C90 68 105 74 105 84V135H45V84Z" fill="#065f46" stroke="#047857" strokeWidth="2" />
      <rect x="68" y="76" width="14" height="60" fill="#047857" />

      {/* Kepala Bulat Luwak dengan Bulu Abu-abu Hangat */}
      <ellipse cx="75" cy="54" rx="34" ry="28" fill="#64748b" />

      {/* Topeng Wajah / Garis Mata Khas Luwak (Black Mask Pattern) */}
      <path
        d="M44 54C48 48 58 48 64 54C68 58 64 64 56 64C48 64 42 60 44 54Z"
        fill="#1e293b"
      />
      <path
        d="M106 54C102 48 92 48 86 54C82 58 86 64 94 64C102 64 108 60 106 54Z"
        fill="#1e293b"
      />

      {/* Garis Putih di Dahi Luwak */}
      <path d="M72 32C72 44 78 44 78 32Z" fill="#ffffff" />
      <ellipse cx="75" cy="62" rx="14" ry="10" fill="#f8fafc" />

      {/* Mata Hangat Bijaksana */}
      <circle cx="54" cy="56" r="4.5" fill="#f8fafc" />
      <circle cx="96" cy="56" r="4.5" fill="#f8fafc" />
      <circle cx="55" cy="56" r="2.8" fill="#0f172a" />
      <circle cx="95" cy="56" r="2.8" fill="#0f172a" />
      <circle cx="54" cy="55" r="1" fill="#ffffff" />
      <circle cx="94" cy="55" r="1" fill="#ffffff" />

      {/* Hidung Hitam & Senyum Hangat */}
      <ellipse cx="75" cy="60" rx="3.5" ry="2.5" fill="#0f172a" />
      <path d="M71 64C73 67 77 67 79 64" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

      {/* Tangan Kiri Mengacungkan Jempol Bangga */}
      <path d="M45 88L26 80" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
      <circle cx="24" cy="76" r="7" fill="#64748b" />
      <path d="M24 73V66" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />

      {/* Tangan Kanan Memegang Piala Emas Prestasi */}
      <path d="M105 88L124 96" stroke="#64748b" strokeWidth="9" strokeLinecap="round" />
      <circle cx="126" cy="98" r="6" fill="#64748b" />
      <polygon points="120,78 136,78 132,92 124,92" fill="#ffd700" />
      <rect x="126" y="92" width="4" height="6" fill="#f59e0b" />
      <rect x="122" y="98" width="12" height="4" rx="2" fill="#b45309" />
      <circle cx="128" cy="85" r="2" fill="#ffffff" />
    </svg>
  );
}

/**
 * Kluster Karakter Komposisi Hero Baru (100% Karakter Asli PahamTeks)
 * Menyatukan Teksie (Musang Cerdas), Bitto (Robot Koding), dan Aki (Kucing Penjelajah)
 */
export function CharacterCluster() {
  return (
    <div className="character-cluster-wrapper">
      {/* Gelembung Sapaan Multibahasa Mengambang */}
      <div className="floating-bubble bubble-hello">
        <span className="bubble-flag">JP</span> Konnichiwa!
      </div>
      <div className="floating-bubble bubble-code">
        <CodeTag2DIcon size={15} color="#58cc02" /> logic.solve(&quot;Paham!&quot;)
      </div>
      <div className="floating-bubble bubble-bonjour">
        <span className="bubble-flag">FR</span> Bonjour!
      </div>
      <div className="floating-bubble bubble-arabic">
        <span className="bubble-flag">AR</span> Marhaban! (مرحباً)
      </div>

      {/* Karakter Tengah Utama: Teksie Si Musang Cerdas */}
      <div className="cluster-main-pami">
        <TeksieFox size={145} />
      </div>

      {/* Karakter Samping Kiri: Aki Kucing Penjelajah Bahasa */}
      <div className="cluster-side-niko">
        <AkiCat size={105} />
      </div>

      {/* Karakter Samping Kanan: Bitto Robot Logika */}
      <div className="cluster-side-tara">
        <BittoBot size={105} />
      </div>

      {/* Partikel Berkilau 2D Art Emas & Cyan */}
      <div className="gold-coin coin-1">
        <Sparkle2DIcon size={18} color="#ffd700" />
      </div>
      <div className="gold-coin coin-2">
        <Sparkle2DIcon size={18} color="#38bdf8" />
      </div>
      <div className="gold-coin coin-3">
        <Rocket2DIcon size={18} color="#58cc02" />
      </div>
    </div>
  );
}
