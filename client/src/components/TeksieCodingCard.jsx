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

      {/* === 1. TELINGA MUSANG TEGAK MANIS & PROPORSIONAL (SEPERTI DI GAMBAR 2) === */}
      {/* Telinga Kiri */}
      <path d="M42 50 C36 34 32 18 36 12 C44 18 52 32 54 48 Z" fill="url(#mkFurDark3D)" />
      <path d="M41 42 C38 30 36 20 39 16 C44 22 49 32 50 42 Z" fill="#ffedd5" />

      {/* Telinga Kanan (Bersih tanpa garis kilau) */}
      <path d="M118 50 C124 34 128 18 124 12 C116 18 108 32 106 48 Z" fill="url(#mkFurDark3D)" />
      <path d="M119 42 C122 30 124 20 121 16 C116 22 111 32 110 42 Z" fill="#ffedd5" />

      {/* === 2. EKOR MUSANG BULAT LEBAT DI KANAN BAWAH === */}
      <g>
        <ellipse cx="126" cy="120" rx="18" ry="14" fill="url(#mkFurBody3D)" transform="rotate(20 126 120)" />
        <ellipse cx="134" cy="124" rx="10" ry="8" fill="url(#mkTailTip3D)" transform="rotate(20 134 124)" />
      </g>

      {/* === 3. BADAN GEMBUL CHUBBY (SANGAT LUCU & HALUS) === */}
      <ellipse cx="80" cy="116" rx="44" ry="30" fill="url(#mkFurBody3D)" />
      {/* Perut Krem Terang Lembut Khas Gambar 2 */}
      <ellipse cx="78" cy="115" rx="26" ry="20" fill="url(#mkBelly3D)" stroke="#f97316" strokeWidth="2.5" />
      {/* Aksen Lengkungan Lembut di Perut */}
      <path d="M70 108 C74 112 82 112 86 108" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M66 117 C71 121 81 121 86 117" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" />

      {/* === 4. KEPALA UTAMA BULAT GEMBUL (PERSIS BENTUK GAMBAR 2) === */}
      <ellipse cx="80" cy="62" rx="46" ry="42" fill="url(#mkFurHead3D)" />

      {/* Rumbai Pipi Halus Samping Kiri & Kanan */}
      <path d="M36 64 C30 68 28 74 32 79 C38 80 42 74 42 68 Z" fill="url(#mkFurDark3D)" />
      <path d="M124 64 C130 68 132 74 128 79 C122 80 118 74 118 68 Z" fill="url(#mkFurDark3D)" />

      {/* Topeng Wajah Putih Bersih Membulat (Sangat Lucu & Lembut) */}
      <path
        d="M44 50 C42 66 48 82 62 85 C70 86 76 80 80 76 C84 80 90 86 98 85 C112 82 118 66 116 50 C114 38 102 40 95 44 C89 48 83 49 80 46 C77 49 71 48 65 44 C58 40 46 38 44 50 Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
      />

      {/* Rona Pipi Pink Lembut Menggemaskan */}
      <ellipse cx="46" cy="74" rx="7.5" ry="4" fill="#fb7185" opacity="0.7" />
      <ellipse cx="114" cy="74" rx="7.5" ry="4" fill="#fb7185" opacity="0.7" />

      {/* Hidung Hitam & Mulut Senyum Imut Musang */}
      <polygon points="77,71 83,71 80,75" fill="#0f172a" />
      <circle cx="79" cy="71.8" r="0.8" fill="#ffffff" />
      <path d="M75 76 C77 79 79 79 80 77 C81 79 83 79 85 76" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* === 5. KACAMATA BUNDAR TEBAL ORANYE CERAH (PERSIS GAMBAR 2) === */}
      {/* Bingkai Kiri */}
      <circle cx="61" cy="58" r="19" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".1" />
      {/* Bingkai Kanan */}
      <circle cx="99" cy="58" r="19" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".1" />
      {/* Jembatan Kacamata */}
      <path d="M78 57 C80 53 80 53 82 57" stroke="url(#mkGlasses3D)" strokeWidth="5.5" strokeLinecap="round" />

      {/* === 6. MATA BULAT HITAM BESAR BERKILAU (CUTE ANIME SHINY EYES) === */}
      <circle cx="61" cy="58" r="12.5" fill="#0f172a" />
      <circle cx="99" cy="58" r="12.5" fill="#0f172a" />
      {/* Double Catchlight (Kilau Manis Bening) */}
      <circle cx="58" cy="54" r="4.8" fill="#ffffff" />
      <circle cx="66" cy="61" r="2.2" fill="#ffffff" />
      <circle cx="96" cy="54" r="4.8" fill="#ffffff" />
      <circle cx="104" cy="61" r="2.2" fill="#ffffff" />

      {/* === 7. TANGAN / CAKAR GEMBUL MEMELUK LAPTOP (LEKUKAN PERSIS GAMBAR 2) === */}
      <path
        d="M38 98 C32 101 24 108 22 115 C20 122 26 127 34 124 C44 120 49 112 52 105 C48 100 42 98 38 98 Z"
        fill="url(#mkFurBody3D)"
      />
      {/* Lekukan Jari Cakar Lembut */}
      <path d="M22 117 C26 120 33 119 37 116" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 123 C30 125 36 124 40 120" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />

      {/* === 8. LAPTOP TERBUKA MENGHADAP KANAN DENGAN LOGO TUNAS === */}
      {/* Punggung Layar Laptop */}
      <path
        d="M75 106 L87 97 H146 L135 137 H73 L75 106 Z"
        fill="url(#mkLaptopBack3D)"
        stroke="#475569"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Base Bawah Keyboard */}
      <path
        d="M48 135 H125 L120 143 H42 L48 135 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1.8"
      />
      <rect x="58" y="138" width="16" height="2.5" rx="1.2" fill="#475569" />

      {/* Logo Daun Tunas Toska di Laptop */}
      <g transform="translate(110, 114) scale(0.9)">
        <path d="M-6 -4 C-2 1 -3 7 -7 9 C-9 7 -10 1 -6 -4 Z" fill="#2dd4bf" />
        <path d="M2 -5 C6 -1 5 6 1 8 C-1 6 0 0 2 -5 Z" fill="#14b8a6" />
        <circle cx="-2" cy="7" r="1.5" fill="#5eead4" />
      </g>

      {/* Tangan Kanan Mengetik di Balik Layar */}
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
