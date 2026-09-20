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
