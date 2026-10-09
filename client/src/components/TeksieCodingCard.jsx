import React from 'react';

// Ilustrasi vektor Teksie dengan siluet lembut agar tetap tajam pada berbagai ukuran.
export function TeksieAtLaptop({ size = 160 }) {
  return (
    <svg
      className="teksie-at-laptop"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Teksie maskot musang cerdas PahamTeks yang sedang koding dengan laptop"
      style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.42))', overflow: 'visible' }}
    >
      <defs>
        {/* Gradasi 3D Bulu Musang Oranye Hangat (Cahaya dari kanan atas) */}
        <radialGradient id="tkFurHead3D" cx="48%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffb15e" />
          <stop offset="58%" stopColor="#f8791c" />
          <stop offset="100%" stopColor="#c94b0b" />
        </radialGradient>
        <radialGradient id="tkFurBody3D" cx="60%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffb066" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <radialGradient id="tkFurDark3D" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        {/* Perut Krem Lembut */}
        <linearGradient id="tkBelly3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        {/* Ekor Ujung Putih Musang */}
        <radialGradient id="tkTailTip3D" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        {/* Kacamata Oranye Bulat 3D Mengkilap */}
        <linearGradient id="tkGlasses3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        {/* Laptop Navy Modern 3D Terbuka */}
        <linearGradient id="tkLaptopBack3D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a3d52" />
          <stop offset="60%" stopColor="#1a2634" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Bayangan Meja Halus di Bawah */}
      <ellipse cx="106" cy="184" rx="76" ry="8.5" fill="#000000" fillOpacity=".32" />

      {/* === 1. EKOR MUSANG LEBAT BERUJUNG PUTIH (DI BELAKANG KIRI) === */}
      <g>
        <path
          d="M60 134 C48 126 34 128 27 138 C18 151 23 165 33 169 C43 173 59 165 70 155 C77 148 72 138 60 134 Z"
          fill="url(#tkFurBody3D)"
        />
        <path
          d="M25 153 C19 159 22 168 29 170 C36 172 43 167 45 160 C47 154 42 150 36 150 C31 150 28 151 25 153 Z"
          fill="url(#tkTailTip3D)"
        />
      </g>

      {/* === 2. TELINGA MUSANG 3D (KIRI LEBIH KECIL, KANAN LEBIH DEKAT) === */}
      {/* Telinga Kiri Musang (Di Belakang Kepala) */}
      <path d="M58 65 C48 56 37 39 35 24 C34 18 36 16 40 21 C50 32 59 43 68 51 Z" fill="url(#tkFurDark3D)" />
      <path d="M54 55 C46 45 41 35 40 27 C46 34 52 43 59 50 Z" fill="#fb7185" opacity="0.82" />

      {/* === 3. BADAN GEMBUL MUSANG MENGHADAP SUDUT KANAN === */}
      <ellipse cx="98" cy="148" rx="48" ry="34" fill="url(#tkFurBody3D)" />
      {/* Perut Krem Menghadap Kanan Depan */}
      <ellipse cx="106" cy="146" rx="28" ry="22" fill="url(#tkBelly3D)" stroke="#ea580c" strokeWidth="2.5" />
      {/* Aksen Lengkungan Lembut di Perut */}
      <path d="M98 138 C103 143 113 143 118 138" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M94 148 C100 154 116 154 122 148" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

      {/* === 4. KEPALA GEMAS MUSANG MENOLEH KE SUDUT KANAN === */}
      {/* Telinga Kanan Musang (Di Depan / Lebih Dominan) */}
      <path d="M132 53 C143 39 151 25 157 16 C160 12 163 14 163 20 C163 39 153 58 139 70 Z" fill="url(#tkFurDark3D)" />
      <path d="M139 51 C147 39 153 29 157 22 C156 35 150 48 141 59 Z" fill="#fb7185" opacity="0.82" />

      <ellipse cx="106" cy="84" rx="54" ry="48" fill="url(#tkFurHead3D)" />

      {/* Topeng Wajah Putih Bersih Membulat (Menghadap Sudut Kanan) */}
      <path
        d="M62 76 C60 96 70 114 90 116 C100 117 108 111 114 105 C120 111 128 116 138 114 C152 110 158 92 154 74 C150 60 138 62 130 66 C124 70 118 71 114 67 C110 71 104 69 96 65 C86 60 66 60 62 76 Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
      />

      {/* Rona Pipi Pink Gemas (Blush) */}
      <ellipse cx="68" cy="96" rx="6.5" ry="3.5" fill="#fb7185" opacity="0.48" />
      <ellipse cx="145" cy="96" rx="7" ry="3.8" fill="#fb7185" opacity="0.48" />

      {/* Hidung Hitam & Mulut Imut Musang (Menghadap Kanan) */}
      <polygon points="112,88 118,88 115,93" fill="#0f172a" />
      <circle cx="114" cy="89" r="0.8" fill="#ffffff" />
      {/* Mulut Senyum Imut Musang (^w^) */}
      <path d="M109 95 C111 98 113 98 115 96 C116 98 119 98 121 95" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Kumis Tipis Halus Musang */}
      <line x1="60" y1="92" x2="46" y2="90" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="60" y1="97" x2="48" y2="99" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="148" y1="92" x2="162" y2="90" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="148" y1="97" x2="160" y2="99" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />

      {/* === 5. KACAMATA ORANYE BULAT 3D (PERSPEKTIF 3/4 SUDUT KANAN) === */}
      {/* Kacamata Kiri (Agak Oval karena Perspektif) */}
      <ellipse cx="86" cy="80" rx="19" ry="21" stroke="url(#tkGlasses3D)" strokeWidth="6" fill="#ffffff" fillOpacity=".12" />
      {/* Kacamata Kanan (Lebih Besar & Menghadap Kita) */}
      <ellipse cx="132" cy="80" rx="22" ry="23" stroke="url(#tkGlasses3D)" strokeWidth="6.5" fill="#ffffff" fillOpacity=".12" />
      {/* Jembatan Kacamata */}
      <path d="M105 79 C108 75 110 75 113 79" stroke="url(#tkGlasses3D)" strokeWidth="6" strokeLinecap="round" />

      {/* === 6. MATA BULAT HITAM BERKILAU (ANIME SHINY EYES PERSPEKTIF 3D) === */}
      {/* Mata Kiri */}
      <ellipse cx="86" cy="80" rx="12" ry="14" fill="#0f172a" />
      <circle cx="83" cy="76" r="4.8" fill="#ffffff" />
      <circle cx="90" cy="84" r="2.2" fill="#ffffff" />

      {/* Mata Kanan */}
      <circle cx="132" cy="80" r="14.5" fill="#0f172a" />
      <circle cx="128" cy="75" r="5.5" fill="#ffffff" />
      <circle cx="138" cy="84" r="2.6" fill="#ffffff" />

      {/* === 7. TANGAN KIRI MUSANG MEMELUK LAPTOP DARI SAMPING === */}
      <path
        d="M52 134 C44 138 36 146 36 154 C36 162 46 166 56 160 C66 154 74 144 76 136 C70 132 60 132 52 134 Z"
        fill="url(#tkFurBody3D)"
      />
      {/* Bantalan Jari Cakar Musang Imut */}
      <circle cx="44" cy="158" r="3" fill="#ffedd5" />
      <circle cx="50" cy="161" r="3" fill="#ffedd5" />
      <circle cx="56" cy="159" r="3" fill="#ffedd5" />

      {/* === 8. LAPTOP TERBUKA 3D MENGHADAP KE KANAN DEPAN === */}
      {/* Punggung Layar Laptop */}
      <path
        d="M96 136 L110 124 H184 L170 174 H93 L96 136 Z"
        fill="url(#tkLaptopBack3D)"
        stroke="#475569"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Base Keyboard Bawah Laptop */}
      <path
        d="M62 172 H160 L154 181 H54 L62 172 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="2"
      />
      <rect x="74" y="175" width="24" height="3" rx="1.5" fill="#475569" />

      {/* Logo Daun Tunas Toska Menyala di Punggung Laptop */}
      <g transform="translate(140, 146) scale(1.1)">
        <path d="M-6 -4 C-2 1 -3 7 -7 9 C-9 7 -10 1 -6 -4 Z" fill="#2dd4bf" />
        <path d="M2 -5 C6 -1 5 6 1 8 C-1 6 0 0 2 -5 Z" fill="#14b8a6" />
        <circle cx="-2" cy="7" r="1.5" fill="#5eead4" />
      </g>

      {/* === 9. TANGAN KANAN MUSANG MENGETIK DI ATAS LAPTOP === */}
      {/* Tangan Kanan Berbulu Oranye */}
      <ellipse cx="140" cy="126" rx="16" ry="10" fill="url(#tkFurDark3D)" transform="rotate(-15 140 126)" />
      {/* Cakar Jari Mengetik di Keyboard */}
      <ellipse cx="128" cy="132" rx="7" ry="5" fill="#ffedd5" transform="rotate(-10 128 132)" />
      <circle cx="125" cy="134" r="1.8" fill="#fb7185" />
      <circle cx="129" cy="135" r="1.8" fill="#fb7185" />
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
          <TeksieAtLaptop size={138} />
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
