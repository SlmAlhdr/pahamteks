import React from 'react';

// Teksie duduk di belakang laptop pada panel materi.
export function TeksieAtLaptop({ size = 130 }) {
  return (
    <svg
      className="teksie-at-laptop"
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Teksie, maskot musang oranye cerdas PahamTeks yang sedang koding dengan laptop"
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))', overflow: 'visible' }}
    >
      <defs>
        {/* 3D Radial Gradasi Bulu Oranye Teksie */}
        <radialGradient id="mkFurBody3D" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb066" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="mkFurHead3D" cx="42%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#ffbe7b" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="mkFurDark3D" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        {/* Perut Krem Lembut */}
        <linearGradient id="mkBelly3D" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        {/* Ekor Ujung Putih */}
        <radialGradient id="mkTailTip3D" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        {/* Kacamata Pintar 3D */}
        <linearGradient id="mkGlasses3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff9a3c" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        {/* Laptop Navy Modern 3D */}
        <linearGradient id="mkLaptopBack3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253545" />
          <stop offset="60%" stopColor="#1a2634" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        {/* Syal Hijau Khas PahamTeks */}
        <linearGradient id="mkScarf3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
      </defs>

      {/* Bayangan Meja Halus */}
      <ellipse cx="80" cy="148" rx="60" ry="7" fill="#000000" fillOpacity=".38" />

      {/* === 1. TELINGA MUSANG IKONIK 3D (KIRI & KANAN) LEBIH RAPI & HALUS === */}
      {/* Telinga Kiri Musang */}
      <path d="M48 52L22 14C16 32 22 58 44 70L48 52Z" fill="url(#mkFurDark3D)" />
      <path d="M44 49L27 21C23 34 27 53 40 63L44 49Z" fill="#fb7185" opacity="0.85" />

      {/* Telinga Kanan Musang (Bersih tanpa 3 garis kilau) */}
      <path d="M112 52L138 14C144 32 138 58 116 70L112 52Z" fill="url(#mkFurDark3D)" />
      <path d="M116 49L133 21C137 34 133 53 120 63L116 49Z" fill="#fb7185" opacity="0.85" />

      {/* === 2. EKOR MUSANG LEBAT BERUJUNG PUTIH (MENGINTIP DI KANAN) === */}
      <g>
        <path d="M118 114C142 106 156 122 150 140C144 154 122 152 110 140" fill="url(#mkFurBody3D)" />
        <path d="M138 132C148 136 146 146 138 150C130 152 124 146 128 140Z" fill="url(#mkTailTip3D)" />
      </g>

      {/* === 3. BADAN GEMBUL MUSANG 3D === */}
      <ellipse cx="80" cy="118" rx="42" ry="28" fill="url(#mkFurBody3D)" />
      {/* Perut Krem Berbingkai Lembut Seperti di Gambar 2 */}
      <ellipse cx="80" cy="116" rx="26" ry="20" fill="url(#mkBelly3D)" stroke="#ea580c" strokeWidth="2.5" />
      {/* Aksen Lengkungan Dada */}
      <path d="M72 108C75 112 85 112 88 108" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M68 118C73 122 87 122 92 118" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

      {/* === 4. KEPALA BULAT GEMAS MUSANG 3D === */}
      <ellipse cx="80" cy="68" rx="46" ry="40" fill="url(#mkFurHead3D)" />

      {/* Bulu Pipi Halus Kiri & Kanan Khas Gambar 2 */}
      <path d="M34 68C28 72 26 78 30 83C36 84 40 78 40 72Z" fill="url(#mkFurDark3D)" />
      <path d="M126 68C132 72 134 78 130 83C124 84 120 78 120 72Z" fill="url(#mkFurDark3D)" />

      {/* Topeng Pipi Wajah Putih Membulat Halus (Sesuai Lekukan Gambar 2) */}
      <path
        d="M45 56C43 70 48 84 62 87C70 88 76 83 80 79C84 83 90 88 98 87C112 84 117 70 115 56C113 44 101 46 94 50C88 54 82 55 80 52C78 55 72 54 66 50C59 46 47 44 45 56Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
      />

      {/* Rona Pipi Pink Gemas (Blush) */}
      <ellipse cx="48" cy="80" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />
      <ellipse cx="112" cy="80" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />

      {/* Hidung & Moncong Imut */}
      <polygon points="77,75 83,75 80,79" fill="#0f172a" />
      <circle cx="79" cy="75.6" r="0.7" fill="#ffffff" />
      {/* Mulut Senyum Manis */}
      <path d="M75 80C77 83 79 83 80 81C81 83 83 83 85 80" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* === 5. KACAMATA PINTAR BULAT ORANYE IKONIK (PERSIS GAMBAR 2) === */}
      {/* Bingkai Kacamata Kiri */}
      <circle cx="61" cy="62" r="19" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Bingkai Kacamata Kanan */}
      <circle cx="99" cy="62" r="19" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Jembatan Kacamata */}
      <path d="M78 61C80 57 80 57 82 61" stroke="url(#mkGlasses3D)" strokeWidth="5.5" strokeLinecap="round" />

      {/* === 6. MATA BULAT HITAM BERKILAU 3D (ANIME SHINY EYES PERSIS GAMBAR 2) === */}
      <circle cx="61" cy="62" r="12.5" fill="#0f172a" />
      <circle cx="99" cy="62" r="12.5" fill="#0f172a" />
      {/* Double Catchlight */}
      <circle cx="58" cy="58" r="4.8" fill="#ffffff" />
      <circle cx="66" cy="65" r="2.2" fill="#ffffff" />
      <circle cx="96" cy="58" r="4.8" fill="#ffffff" />
      <circle cx="104" cy="65" r="2.2" fill="#ffffff" />

      {/* === 7. TANGAN / SAYAP MUSANG MEMELUK LAPTOP DENGAN LEKUKAN PERSIS GAMBAR 2 === */}
      <path
        d="M38 102C32 105 24 112 22 119C20 126 26 131 34 128C44 124 49 116 52 109C48 104 42 102 38 102Z"
        fill="url(#mkFurBody3D)"
      />
      {/* Garis Jari Bulu Cakar Halus */}
      <path d="M24 121C28 124 34 123 38 120" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 127C32 129 37 128 41 124" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />

      {/* === 8. LAPTOP TERBUKA 3D DENGAN LOGO PAHAMTEKS === */}
      {/* Punggung Layar Laptop */}
      <path
        d="M75 106L87 97H146L135 137H73L75 106Z"
        fill="url(#mkLaptopBack3D)"
        stroke="#475569"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Base Bawah Keyboard Laptop */}
      <path
        d="M48 135H125L120 143H42L48 135Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.8"
      />
      <rect x="58" y="138" width="16" height="2.5" rx="1.2" fill="#475569" />

      {/* Logo Daun Tunas Hijau Toska Menyala di Punggung Laptop */}
      <g transform="translate(110, 114) scale(0.9)">
        <path d="M-6 -4C-2 1 -3 7 -7 9C-9 7 -10 1 -6 -4Z" fill="#2dd4bf" />
        <path d="M2 -5C6 -1 5 6 1 8C-1 6 0 0 2 -5Z" fill="#14b8a6" />
        <circle cx="-2" cy="7" r="1.5" fill="#5eead4" />
      </g>

      {/* Tangan Kanan Musang Mengetik di Balik Layar */}
      <ellipse cx="106" cy="100" rx="12" ry="7" fill="url(#mkFurDark3D)" transform="rotate(-15 106 100)" />
    </svg>
  );
}

export default function TeksieCodingCard({
  greetingTitle = 'Halo!',
  greetingSubtitle = 'Aku Teksie',
  greetingDesc = 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!',
  tipsTitle = 'Tips Hari Ini',
  tipsDesc = 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.'
}) {
  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <div className="teksie-owl-wrapper">
          <TeksieAtLaptop size={130} />
        </div>
        <div className="teksie-greeting-content">
          <div className="teksie-greeting-header">
            <span className="teksie-greeting-hello">{greetingTitle}</span>
            <h4 className="teksie-greeting-name">{greetingSubtitle}</h4>
          </div>
          <p className="teksie-greeting-desc">{greetingDesc}</p>
        </div>
      </div>

      <div className="teksie-tips-box">
        <div className="teksie-tips-content">
          <h5 className="teksie-tips-title">{tipsTitle}</h5>
          <p className="teksie-tips-desc">{tipsDesc}</p>
        </div>
      </div>
    </aside>
  );
}
