import React, { useState, useRef } from 'react';
import {
  DownPointer2DIcon,
  CodeTag2DIcon,
  Sparkle2DIcon,
  Rocket2DIcon,
  Trophy2DIcon
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
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <radialGradient id="tfFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tfFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tfFurDark" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <linearGradient id="tfBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
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

      {/* Bayangan Lantai Halus */}
      <ellipse cx="80" cy="154" rx="46" ry="6" fill="rgba(15, 23, 42, 0.25)" />

      {/* Telinga Musang/Fennec Kiri Besar Ikonik Semi-3D */}
      <path
        d="M52 50L18 6C12 28 20 62 44 76L52 50Z"
        fill="url(#tfFurDark)"
      />
      <path
        d="M48 48L24 14C20 30 26 56 42 68L48 48Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M28 28L36 38" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Telinga Musang/Fennec Kanan Besar Ikonik Semi-3D */}
      <path
        d="M108 50L142 6C148 28 140 62 116 76L108 50Z"
        fill="url(#tfFurDark)"
      />
      <path
        d="M112 48L136 14C140 30 134 56 118 68L112 48Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M132 28L124 38" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ekor Berbulu Lebat Semi-3D */}
      <g className="teksie-tail-anim">
        <path
          d="M118 110C140 102 154 118 148 136C142 152 118 150 105 138"
          fill="url(#tfFurBody)"
        />
        <path
          d="M136 128C146 132 144 142 136 146C128 148 122 142 126 136Z"
          fill="url(#tfTailTip)"
        />
        <path d="M136 130C140 128 144 132 141 138" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Badan Gembul Semi-3D Halus (Lebih Halus, Tidak Terlalu Berbentuk) */}
      <ellipse cx="80" cy="120" rx="36" ry="28" fill="url(#tfFurBody)" />
      <ellipse cx="80" cy="124" rx="22" ry="18" fill="url(#tfBelly)" />

      {/* Syal Cerdas Hijau PahamTeks dengan Permata 3D */}
      <g>
        <path
          d="M52 104C62 114 98 114 108 104C112 112 104 122 80 122C56 122 48 112 52 104Z"
          fill="url(#tfScarf)"
        />
        <ellipse cx="80" cy="114" rx="6" ry="4" fill="#15803d" />
        <ellipse cx="80" cy="113" rx="4" ry="2.5" fill="#4ade80" />
      </g>

      {/* Kepala Bulat Menggemaskan 3D */}
      <ellipse cx="80" cy="74" rx="42" ry="36" fill="url(#tfFurHead)" />
      <path
        d="M58 46C70 40 90 40 102 46C92 42 68 42 58 46Z"
        fill="#ffffff"
        opacity="0.4"
      />

      {/* Pipi Putih Halus Gembul */}
      <path
        d="M38 78C38 96 56 104 80 104C104 104 122 96 122 78C122 70 114 66 102 70C92 74 86 78 80 78C74 78 68 74 58 70C46 66 38 70 38 78Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Lucu (Blush) */}
      <ellipse cx="48" cy="84" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />
      <ellipse cx="112" cy="84" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />

      {/* Hidung Hitam 3D */}
      <polygon points="76,82 84,82 80,87" fill="#0f172a" />
      <circle cx="79" cy="82.5" r="0.8" fill="#ffffff" />

      {/* Mulut Senyum Terbuka Ceria (^w^) */}
      <path
        d="M75 88C77 93 83 93 85 88Z"
        fill="#881337"
      />
      <path
        d="M77 90C79 92 81 92 83 90C82 92 78 92 77 90Z"
        fill="#fb7185"
      />

      {/* Kacamata Cerdas Cyan 3D Tebal */}
      <circle cx="62" cy="68" r="16" stroke="url(#tfGlasses)" strokeWidth="4" fill="rgba(56, 189, 248, 0.16)" />
      <circle cx="98" cy="68" r="16" stroke="url(#tfGlasses)" strokeWidth="4" fill="rgba(56, 189, 248, 0.16)" />
      <path d="M78 68H82" stroke="url(#tfGlasses)" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 58C58 55 66 55 70 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M90 58C94 55 102 55 106 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />

      {/* Mata Berkilau Cerdas Penuh Semangat (Duolingo Style Eyes) */}
      <circle cx="62" cy="68" r="8" fill="#0f172a" />
      <circle cx="98" cy="68" r="8" fill="#0f172a" />
      <circle cx="60" cy="65" r="3.2" fill="#ffffff" />
      <circle cx="96" cy="65" r="3.2" fill="#ffffff" />
      <circle cx="65" cy="71" r="1.6" fill="#ffffff" />
      <circle cx="101" cy="71" r="1.6" fill="#ffffff" />

      {/* Kaki Depan Gembul Halus */}
      <ellipse cx="64" cy="144" rx="12" ry="8" fill="url(#tfFurBody)" />
      <ellipse cx="64" cy="143" rx="8" ry="5" fill="#ffedd5" />
      <ellipse cx="96" cy="144" rx="12" ry="8" fill="url(#tfFurBody)" />
      <ellipse cx="96" cy="143" rx="8" ry="5" fill="#ffedd5" />
    </svg>
  );
}

/**
 * Karakter Penunjuk Tombol Asli PahamTeks (PeekingPointer):
 * Teksie Si Musang Cerdas mengintip dari atas kartu login
 * dengan telinga besar khasnya bergaris cyan dan cakar menunjuk tombol ke bawah!
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
            <radialGradient id="ppFurHead" cx="42%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffb96a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#b43a06" />
            </radialGradient>
            <radialGradient id="ppFurDark" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="70%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
            <linearGradient id="ppGlasses" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>

          {/* Telinga Musang Kiri Besar Ikonik Semi-3D */}
          <path d="M42 45L12 8C8 28 18 56 36 68L42 45Z" fill="url(#ppFurDark)" />
          <path d="M38 43L18 16C16 30 24 50 36 60L38 43Z" fill="#f472b6" opacity="0.8" />
          <path d="M22 28L28 36" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />

          {/* Telinga Musang Kanan Besar Ikonik Semi-3D */}
          <path d="M92 45L122 8C126 28 116 56 98 68L92 45Z" fill="url(#ppFurDark)" />
          <path d="M96 43L116 16C118 30 110 50 98 60L96 43Z" fill="#f472b6" opacity="0.8" />
          <path d="M112 28L106 36" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />

          {/* Kepala Musang Mengintip 3D */}
          <path d="M25 105C25 58 44 42 67 42C90 42 109 58 109 105H25Z" fill="url(#ppFurHead)" />
          <path d="M45 52C55 46 75 46 87 52C80 48 55 48 45 52Z" fill="#ffffff" opacity="0.4" />

          {/* Pipi Putih Mengintip Gembul */}
          <path d="M32 90C32 102 46 105 67 105C88 105 102 102 102 90C102 82 92 78 84 80C75 83 72 85 67 85C62 85 59 83 50 80C42 78 32 82 32 90Z" fill="#ffffff" />
          <ellipse cx="40" cy="94" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />
          <ellipse cx="94" cy="94" rx="6" ry="3.5" fill="#fb7185" opacity="0.6" />

          {/* Hidung Hitam 3D */}
          <polygon points="64,90 70,90 67,95" fill="#0f172a" />
          <circle cx="66" cy="91" r="0.8" fill="#ffffff" />

          {/* Mata Melirik ke Bawah ke Arah Tab Tombol */}
          <circle cx="50" cy="74" r="11" fill="#ffffff" />
          <circle cx="84" cy="74" r="11" fill="#ffffff" />
          <circle cx="52" cy="77" r="6.2" fill="#0f172a" />
          <circle cx="86" cy="77" r="6.2" fill="#0f172a" />
          <circle cx="50.5" cy="75.2" r="2.5" fill="#ffffff" />
          <circle cx="84.5" cy="75.2" r="2.5" fill="#ffffff" />
          <circle cx="54" cy="79.5" r="1.2" fill="#ffffff" />
          <circle cx="88" cy="79.5" r="1.2" fill="#ffffff" />

          {/* Kacamata Pintar Mengintip 3D Cyan */}
          <circle cx="50" cy="74" r="13" stroke="url(#ppGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
          <circle cx="84" cy="74" r="13" stroke="url(#ppGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
          <path d="M63 74H71" stroke="url(#ppGlasses)" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M43 66C46 63 52 63 56 67" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
          <path d="M77 66C80 63 86 63 90 67" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

          {/* Tangan Montok Kartun yang Bergerak Menunjuk ke Bawah (Arah Tab Tombol) */}
          <g className="pointing-hand-down-animated">
            <ellipse cx="106" cy="70" rx="14" ry="12" fill="url(#ppFurHead)" />
            <ellipse cx="106" cy="70" rx="9" ry="8" fill="#ffedd5" />
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
            <circle cx="106" cy="98" r="3.2" fill="#ea580c" />
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
 * Suara Sintesis Interaktif Menggunakan Web Audio API (Zero Dependency)
 */
function playCharacterSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'teksie') {
      // Melodi ceria musang (440Hz -> 880Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'bitto') {
      // 8-bit retro robot bleep-bloop
      osc.type = 'square';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.08);
      osc.frequency.setValueAtTime(1040, now + 0.16);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'aki') {
      // Kicauan ceria kucing (587Hz -> 987Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587, now);
      osc.frequency.exponentialRampToValueAtTime(987, now + 0.2);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'luki') {
      // Fanfare piala emas (C5 -> E5 -> G5 -> C6)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      osc.frequency.setValueAtTime(1046.50, now + 0.24);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch (e) {
    // Audio diabaikan jika diblokir browser
  }
}

const CHARACTER_INFO = {
  teksie: {
    name: 'Teksie',
    titleId: 'Si Musang Cerdas (Maskot Utama)',
    titleEn: 'The Smart Civet (Main Mascot)',
    avatar: '🦊',
    color: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.45)',
    quotesId: [
      'Halo! Aku Teksie si Musang Cerdas! Siap asah otak & belajar bareng hari ini? 🐾',
      'Di PahamTeks, belajar bahasa dan koding dibuat 100% interaktif & seru! ✨',
      'Tahu nggak? Kamu bisa tahan klik mouse padaku untuk mengangkat dan memindahkanku ke mana saja! 🚀'
    ],
    quotesEn: [
      'Hi! I’m Teksie the Smart Civet! Ready to boost your brain with me today? 🐾',
      'At PahamTeks, learning languages and coding is 100% interactive & fun! ✨',
      'Fun tip: Hold your mouse down on me to pick me up and carry me anywhere! 🚀'
    ]
  },
  aki: {
    name: 'Aki',
    titleId: 'Kucing Penjelajah Bahasa',
    titleEn: 'Polyglot Explorer Cat',
    avatar: '🐱',
    color: '#059669',
    glowColor: 'rgba(5, 150, 105, 0.45)',
    quotesId: [
      'Nyaa~ Bonjour! Aku Aki, siap menemanimu menjelajahi 50+ bahasa dunia! 🐱🌍',
      'Konnichiwa! Kuasai kosakata baru setiap hari dan raih skor akurasi tinggi! 🎌',
      'Setiap bahasa baru membuka pintu pertemanan baru di seluruh dunia! ✨'
    ],
    quotesEn: [
      'Nyaa~ Bonjour! I’m Aki, ready to explore 50+ world languages with you! 🐱🌍',
      'Konnichiwa! Master new vocabulary daily and hit top accuracy scores! 🎌',
      'Every new language opens a brand new door to the world! ✨'
    ]
  },
  luki: {
    name: 'Luki',
    titleId: 'Luwak Mentor Berprestasi',
    titleEn: 'Wise Civet Mentor',
    avatar: '🦡',
    color: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    quotesId: [
      'Luar biasa! 🏆 Aku Luki si mentor bijak. Konsisten 5 menit sehari, kamu pasti juara! 👍',
      'Piala emas ini untukmu! Terus kumpulkan poin dan puncaki podium prestasi! 🌟',
      'Jangan takut salah saat kuis! Dari koreksi itulah pemahamanmu semakin matang! 🏅'
    ],
    quotesEn: [
      'Awesome! 🏆 I’m Luki the mentor. Practice 5 minutes daily and claim the podium! 👍',
      'This golden trophy is waiting for you! Keep earning points and reach #1! 🌟',
      'Never fear mistakes in quizzes! Review the explanations to level up fast! 🏅'
    ]
  },
  bitto: {
    name: 'Bitto',
    titleId: 'Robot Logika & Koding',
    titleEn: 'Quantum Logic Bot',
    avatar: '🤖',
    color: '#0284c7',
    glowColor: 'rgba(2, 132, 199, 0.45)',
    quotesId: [
      'BEEP BOOP! 🤖 Aku Bitto! Mari pecahkan logika algoritma koding bersama! 💻⚡',
      'logic.solve("Kamu Pasti Paham") == True! Koding itu asik dan mudah dipelajari! 🚀',
      'Sintaks koding adalah bahasa masa depan. Ayo kita tulis kode pertamamu! 💡'
    ],
    quotesEn: [
      'BEEP BOOP! 🤖 I’m Bitto! Let’s solve algorithms and coding logic together! 💻⚡',
      'logic.solve("You Got This") == True! Coding is fun and easy to master! 🚀',
      'Code syntax is the language of the future. Let’s build your first script! 💡'
    ]
  }
};

const BUBBLE_FACTS = {
  jp: {
    id: '🇯🇵 "Konnichiwa" adalah sapaan ramah dalam bahasa Jepang yang berarti "Halo / Selamat Siang"!',
    en: '🇯🇵 "Konnichiwa" is a warm Japanese greeting meaning "Hello / Good Day"!'
  },
  code: {
    id: '💻 logic.solve("Paham!") adalah sintaks fungsi pemrograman logika yang mengembalikan status sukses!',
    en: '💻 logic.solve("Paham!") is a logic programming call that successfully returns true!'
  },
  fr: {
    id: '🇫🇷 "Bonjour" adalah sapaan bahasa Prancis yang berarti "Halo / Selamat Pagi"!',
    en: '🇫🇷 "Bonjour" is a French greeting meaning "Hello / Good Morning"!'
  },
  ar: {
    id: '🇸🇦 "Marhaban" (مرحباً) adalah sapaan bahasa Arab yang ramah bermakna "Selamat Datang"!',
    en: '🇸🇦 "Marhaban" (مرحباً) is an Arabic greeting meaning "Welcome"!'
  },
  rank: {
    id: '🏆 Podium Prestasi melacak akurasi kuis dan riwayat belajar harianmu!',
    en: '🏆 The Podium tracks your quiz accuracy and daily learning streaks!'
  }
};

/**
 * Kluster Karakter Komposisi Hero Lengkap & 100% Interaktif (4 Karakter Asli PahamTeks)
 * Menyatukan:
 * 1. Aki (Kucing Penjelajah Bahasa)
 * 2. Teksie (Musang Cerdas - Maskot Utama)
 * 3. Luki (Luwak Mentor Prestasi & Piala Emas)
 * 4. Bitto (Robot Logika & Koding)
 */
export function CharacterCluster({ currentLang = 'id' }) {
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bouncingChar, setBouncingChar] = useState(null);
  const [bubbleFact, setBubbleFact] = useState(null);
  const autoCloseTimerRef = useRef(null);

  const handleCharacterClick = (charKey) => {
    playCharacterSound(charKey);
    setBouncingChar(charKey);
    setTimeout(() => setBouncingChar(null), 650);

    if (activeSpeaker === charKey) {
      setQuoteIndex((prev) => (prev + 1) % 3);
    } else {
      setActiveSpeaker(charKey);
      setQuoteIndex(0);
    }
    setBubbleFact(null);

    if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
    autoCloseTimerRef.current = setTimeout(() => {
      setActiveSpeaker(null);
    }, 7000);
  };

  const handleBubbleClick = (bubbleKey) => {
    playCharacterSound('teksie');
    const fact = BUBBLE_FACTS[bubbleKey];
    if (fact) {
      setBubbleFact(currentLang === 'en' ? fact.en : fact.id);
      setActiveSpeaker(null);
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        setBubbleFact(null);
      }, 5000);
    }
  };

  const currentSpeakerData = activeSpeaker ? CHARACTER_INFO[activeSpeaker] : null;
  const currentQuotes = currentSpeakerData
    ? (currentLang === 'en' ? currentSpeakerData.quotesEn : currentSpeakerData.quotesId)
    : [];
  const currentQuote = currentQuotes[quoteIndex % (currentQuotes.length || 1)];

  return (
    <div className="character-cluster-wrapper">
      {/* Popover Balon Percakapan Interaktif Karakter yang Sedang Bicara */}
      {activeSpeaker && currentSpeakerData && (
        <div
          className="cluster-speaker-bubble"
          style={{ borderColor: currentSpeakerData.color }}
        >
          <div className="speaker-bubble-header">
            <span className="speaker-avatar">{currentSpeakerData.avatar}</span>
            <div className="speaker-identity">
              <strong style={{ color: currentSpeakerData.color }}>{currentSpeakerData.name}</strong>
              <small>{currentLang === 'en' ? currentSpeakerData.titleEn : currentSpeakerData.titleId}</small>
            </div>
            <button
              type="button"
              className="speaker-bubble-close"
              onClick={() => setActiveSpeaker(null)}
              title="Tutup Balon"
            >
              ×
            </button>
          </div>
          <p className="speaker-bubble-body">&quot;{currentQuote}&quot;</p>
          <div className="speaker-bubble-footer">
            <button
              type="button"
              className="speaker-cycle-btn"
              onClick={() => {
                playCharacterSound(activeSpeaker);
                setQuoteIndex((prev) => (prev + 1) % currentQuotes.length);
              }}
            >
              💬 {currentLang === 'en' ? 'Next Quote' : 'Kata Lainnya'}
            </button>
            <span className="speaker-hint">
              {currentLang === 'en' ? 'Click character again for reaction!' : 'Klik karakter lagi untuk reaksi! ✨'}
            </span>
          </div>
        </div>
      )}

      {/* Popover Fakta Saat Gelembung Bahasa / Kode Diklik */}
      {bubbleFact && (
        <div className="cluster-fact-bubble">
          <p>{bubbleFact}</p>
          <button
            type="button"
            className="speaker-bubble-close"
            onClick={() => setBubbleFact(null)}
            title="Tutup"
          >
            ×
          </button>
        </div>
      )}

      {/* Gelembung Sapaan Multibahasa Mengambang (Bisa Diklik!) */}
      <div
        className="floating-bubble bubble-hello"
        onClick={() => handleBubbleClick('jp')}
        title="Klik untuk info bahasa Jepang!"
      >
        <span className="bubble-flag">JP</span> Konnichiwa!
      </div>
      <div
        className="floating-bubble bubble-code"
        onClick={() => handleBubbleClick('code')}
        title="Klik untuk info logika koding!"
      >
        <CodeTag2DIcon size={15} color="#58cc02" /> logic.solve(&quot;Paham!&quot;)
      </div>
      <div
        className="floating-bubble bubble-bonjour"
        onClick={() => handleBubbleClick('fr')}
        title="Klik untuk info bahasa Prancis!"
      >
        <span className="bubble-flag">FR</span> Bonjour!
      </div>
      <div
        className="floating-bubble bubble-arabic"
        onClick={() => handleBubbleClick('ar')}
        title="Klik untuk info bahasa Arab!"
      >
        <span className="bubble-flag">AR</span> Marhaban! (مرحباً)
      </div>
      <div
        className="floating-bubble bubble-podium"
        onClick={() => handleBubbleClick('rank')}
        title="Klik untuk info podium prestasi!"
      >
        <Trophy2DIcon size={14} color="#ffd700" /> Rank #1 Podium
      </div>

      {/* 1. Karakter 1: Aki Si Kucing Penjelajah Bahasa (Kiri) */}
      <div
        className={`cluster-interactive-char cluster-char-aki ${bouncingChar === 'aki' ? 'is-bouncing' : ''}`}
        onClick={() => handleCharacterClick('aki')}
        title="Klik untuk sapa Aki si Kucing Penjelajah!"
      >
        <AkiCat size={105} />
        <span className="cluster-hover-badge badge-aki">
          🐱 {currentLang === 'en' ? 'Aki (Click me!)' : 'Aki (Klik aku!)'}
        </span>
      </div>

      {/* 2. Karakter 2: Teksie Si Musang Cerdas (Tengah Utama) */}
      <div
        className={`cluster-interactive-char cluster-char-teksie ${bouncingChar === 'teksie' ? 'is-bouncing' : ''}`}
        onClick={() => handleCharacterClick('teksie')}
        title="Klik untuk sapa Teksie si Musang Cerdas!"
      >
        <TeksieFox size={135} />
        <span className="cluster-hover-badge badge-teksie">
          🦊 {currentLang === 'en' ? 'Teksie (Click me!)' : 'Teksie (Klik aku!)'}
        </span>
      </div>

      {/* 3. Karakter 3: Luki Si Luwak Mentor Berprestasi (Tengah-Kanan) */}
      <div
        className={`cluster-interactive-char cluster-char-luki ${bouncingChar === 'luki' ? 'is-bouncing' : ''}`}
        onClick={() => handleCharacterClick('luki')}
        title="Klik untuk sapa Luki si Mentor Bijak!"
      >
        <LukiCivet size={110} />
        <span className="cluster-hover-badge badge-luki">
          🦡 {currentLang === 'en' ? 'Luki Mentor 🏆' : 'Luki Mentor 🏆'}
        </span>
      </div>

      {/* 4. Karakter 4: Bitto Si Robot Logika & Koding (Kanan) */}
      <div
        className={`cluster-interactive-char cluster-char-bitto ${bouncingChar === 'bitto' ? 'is-bouncing' : ''}`}
        onClick={() => handleCharacterClick('bitto')}
        title="Klik untuk sapa Bitto Robot Koding!"
      >
        <BittoBot size={105} />
        <span className="cluster-hover-badge badge-bitto">
          🤖 {currentLang === 'en' ? 'Bitto (Click me!)' : 'Bitto (Klik aku!)'}
        </span>
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
