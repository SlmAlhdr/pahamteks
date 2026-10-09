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

      {/* === 1. TELINGA MUSANG IKONIK 3D (KIRI & KANAN) === */}
      {/* Telinga Kiri Musang */}
      <path d="M50 48L18 10C12 30 20 62 44 74L50 48Z" fill="url(#mkFurDark3D)" />
      <path d="M46 46L24 18C20 32 26 56 42 66L46 46Z" fill="#fb7185" opacity="0.85" />
      <path d="M28 32L36 40" stroke="#ffedd5" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* Telinga Kanan Musang */}
      <path d="M110 48L142 10C148 30 140 62 116 74L110 48Z" fill="url(#mkFurDark3D)" />
      <path d="M114 46L136 18C140 32 134 56 118 66L114 46Z" fill="#fb7185" opacity="0.85" />
      <path d="M132 32L124 40" stroke="#ffedd5" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

      {/* === 2. EKOR MUSANG LEBAT BERUJUNG PUTIH (MENGINTIP DI KANAN) === */}
      <g>
        <path d="M118 114C142 106 156 122 150 140C144 154 122 152 110 140" fill="url(#mkFurBody3D)" />
        <path d="M138 132C148 136 146 146 138 150C130 152 124 146 128 140Z" fill="url(#mkTailTip3D)" />
      </g>

      {/* === 3. BADAN GEMBUL MUSANG 3D === */}
      <ellipse cx="80" cy="118" rx="40" ry="28" fill="url(#mkFurBody3D)" />
      <ellipse cx="80" cy="116" rx="24" ry="19" fill="url(#mkBelly3D)" />

      {/* Syal Hijau Cerdas Khas PahamTeks */}
      <path d="M52 102C62 112 98 112 108 102C112 110 104 120 80 120C56 120 48 110 52 102Z" fill="url(#mkScarf3D)" />
      <ellipse cx="80" cy="112" rx="5" ry="3.5" fill="#22c55e" />
      <circle cx="80" cy="111.5" r="1.5" fill="#ffffff" />

      {/* === 4. KEPALA BULAT GEMAS MUSANG 3D === */}
      <ellipse cx="80" cy="72" rx="44" ry="37" fill="url(#mkFurHead3D)" />
      {/* Kilau 3D atas kepala */}
      <path d="M58 44C70 38 90 38 102 44C92 40 68 40 58 44Z" fill="#ffffff" opacity="0.35" />

      {/* Pipi Putih Gembul Khas Musang */}
      <path
        d="M36 76C36 94 54 102 80 102C106 102 124 94 124 76C124 68 116 64 104 68C94 72 88 76 80 76C72 76 66 72 56 68C44 64 36 68 36 76Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
      />

      {/* Rona Pipi Pink Gemas (Blush) */}
      <ellipse cx="46" cy="82" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />
      <ellipse cx="114" cy="82" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />

      {/* Hidung Hitam 3D Musang */}
      <polygon points="76,80 84,80 80,85" fill="#0f172a" />
      <circle cx="79" cy="80.8" r="0.8" fill="#ffffff" />

      {/* Mulut Senyum Imut Musang (^w^) */}
      <path d="M74 86C76 90 79 90 80 88C81 90 84 90 86 86" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* === 5. KACAMATA PINTAR BULAT ORANYE IKONIK === */}
      {/* Bingkai Kacamata Kiri */}
      <circle cx="60" cy="62" r="18.5" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Bingkai Kacamata Kanan */}
      <circle cx="100" cy="62" r="18.5" stroke="url(#mkGlasses3D)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Jembatan Kacamata */}
      <path d="M78 61C80 57 80 57 82 61" stroke="url(#mkGlasses3D)" strokeWidth="5.5" strokeLinecap="round" />

      {/* === 6. MATA BULAT HITAM BERKILAU 3D (ANIME SHINY EYES) === */}
      <circle cx="60" cy="62" r="12" fill="#0f172a" />
      <circle cx="100" cy="62" r="12" fill="#0f172a" />
      {/* Double Catchlight */}
      <circle cx="57" cy="58" r="4.6" fill="#ffffff" />
      <circle cx="65" cy="65" r="2.2" fill="#ffffff" />
      <circle cx="97" cy="58" r="4.6" fill="#ffffff" />
      <circle cx="105" cy="65" r="2.2" fill="#ffffff" />

      {/* Kumis Halus Musang */}
      <line x1="38" y1="80" x2="24" y2="78" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <line x1="38" y1="84" x2="26" y2="86" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <line x1="122" y1="80" x2="136" y2="78" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
      <line x1="122" y1="84" x2="134" y2="86" stroke="#ffedd5" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

      {/* === 7. CAKAR / TANGAN MUSANG DI LAPTOP === */}
      <path
        d="M38 102C32 105 24 112 22 119C20 126 26 131 34 128C44 124 49 116 52 109C48 104 42 102 38 102Z"
        fill="url(#mkFurBody3D)"
      />
      <circle cx="28" cy="122" r="2.5" fill="#ffedd5" />
      <circle cx="33" cy="125" r="2.5" fill="#ffedd5" />

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

      {/* === 9. TIGA GARIS KILAU CERIA KARTUN DI KANAN ATAS === */}
      <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
        <line x1="126" y1="36" x2="137" y2="30" />
        <line x1="130" y1="44" x2="143" y2="44" />
        <line x1="127" y1="52" x2="138" y2="58" />
      </g>
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
