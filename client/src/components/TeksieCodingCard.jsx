import React from 'react';

// Teksie duduk di belakang laptop pada panel materi (Bentuk presisi sesuai Gambar 2).
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
      aria-label="Teksie maskot cerdas PahamTeks yang sedang belajar dengan laptop"
      style={{ filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.42))', overflow: 'visible' }}
    >
      <defs>
        {/* Gradasi Oranye Musang Hangat (Warna Utama Tubuh & Kepala) */}
        <radialGradient id="tkFurMain" cx="48%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#ffb366" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="90%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        {/* Warna Oranye Gelap Telinga & Sayap */}
        <radialGradient id="tkFurDark" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="75%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        {/* Daun Telinga Dalam Oranye-Krem Hangat (Sesuai Gambar 2) */}
        <linearGradient id="tkEarInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        {/* Perut Krem Lembut */}
        <linearGradient id="tkBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        {/* Kacamata Oranye Bulat Cemerlang 3D (Persis Gambar 2) */}
        <linearGradient id="tkGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="10%" stopColor="#11100f" />
          <stop offset="50%" stopColor="#db2222" />
          <stop offset="100%" stopColor="#e74a0c" />
        </linearGradient>
        {/* Paruh Keemasan Segitiga Imut */}
        <linearGradient id="tkBeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        {/* Laptop Navy Modern */}
        <linearGradient id="tkLaptopBack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253545" />
          <stop offset="70%" stopColor="#1a2634" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Bayangan Meja Halus di Bawah */}
      <ellipse cx="100" cy="184" rx="72" ry="8" fill="#000000" fillOpacity=".38" />

      {/* === 1. TELINGA RUNCING BERBENTUK DAUN (PERSIS SEPERTI GAMBAR 2) === */}
      {/* Telinga Kiri Luar */}
      <path
        d="M52 74 C44 48 42 28 48 20 C60 28 72 50 76 68 Z"
        fill="url(#tkFurDark)"
      />
      {/* Telinga Kiri Dalam (Oranye-Krem) */}
      <path
        d="M53 64 C49 46 48 30 52 26 C59 34 66 48 68 60 Z"
        fill="url(#tkEarInner)"
      />

      {/* Telinga Kanan Luar (Tanpa 3 garis di samping) */}
      <path
        d="M148 74 C156 48 158 28 152 20 C140 28 128 50 124 68 Z"
        fill="url(#tkFurDark)"
      />
      {/* Telinga Kanan Dalam (Oranye-Krem) */}
      <path
        d="M147 64 C151 46 152 30 148 26 C141 34 134 48 132 60 Z"
        fill="url(#tkEarInner)"
      />

      {/* === 2. KEPALA BUNDAR GEMBUL UTAMA (PERSIS PROPORSI GAMBAR 2) === */}
      <ellipse cx="100" cy="90" rx="58" ry="55" fill="url(#tkFurMain)" />

      {/* Rumbai Bulu Pipi Luar Kiri & Kanan */}
      <path d="M44 90 C36 95 34 102 38 108 C46 110 52 102 52 94 Z" fill="url(#tkFurDark)" />
      <path d="M156 90 C164 95 166 102 162 108 C154 110 148 102 148 94 Z" fill="url(#tkFurDark)" />

      {/* === 3. TOPENG WAJAH PUTIH MELENGKUNG PENUH (FACIAL DISC GAMBAR 2) === */}
      {/* Bentuk topeng putih hati/dua lingkaran yang menyatu sempurna */}
      <path
        d="M58 72 C54 90 60 110 78 114 C88 115 95 109 100 104 C105 109 112 115 122 114 C140 110 146 90 142 72 C140 56 124 60 116 64 C109 68 103 70 100 66 C97 70 91 68 84 64 C76 60 60 56 58 72 Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.06))' }}
      />

      {/* === 4. BADAN GEMBUL & DADA (PERSIS GAMBAR 2) === */}
      <ellipse cx="100" cy="150" rx="52" ry="34" fill="url(#tkFurMain)" />
      {/* Perut Krem Berbingkai Garis Oranye Khas Gambar 2 */}
      <ellipse cx="100" cy="148" rx="32" ry="24" fill="url(#tkBelly)" stroke="#ea580c" strokeWidth="3" />
      {/* Aksen Lengkungan Pola Bulu Dada */}
      <path d="M90 138 C94 143 106 143 110 138" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 150 C91 155 109 155 115 150" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

      {/* === 5. SAYAP KIRI MEMELUK LAPTOP (PERSIS BENTUK GAMBAR 2) === */}
      <path
        d="M48 132 C40 136 30 144 28 152 C26 160 34 166 44 162 C56 157 62 147 66 138 C60 134 53 132 48 132 Z"
        fill="url(#tkFurMain)"
      />
      {/* Tiga Jari/Lekukan Bulu Sayap Bawah */}
      <path d="M28 154 C33 158 41 157 46 153" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M33 161 C38 164 45 163 50 158" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />

      {/* === 6. LAPTOP MENGHADAP KE KANAN DEPAN (PERSIS GAMBAR 2) === */}
      {/* Punggung Layar Laptop */}
      <path
        d="M94 135 L108 124 H182 L168 174 H91 L94 135 Z"
        fill="url(#tkLaptopBack)"
        stroke="#475569"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Base Keyboard Bawah Laptop */}
      <path
        d="M60 172 H158 L152 181 H52 L60 172 Z"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="2"
      />
      <rect x="72" y="175" width="22" height="3" rx="1.5" fill="#475569" />

      {/* Logo Daun Tunas Toska Menyala di Punggung Laptop */}
      <g transform="translate(138, 146) scale(1.1)">
        <path d="M-6 -4 C-2 1 -3 7 -7 9 C-9 7 -10 1 -6 -4 Z" fill="#2dd4bf" />
        <path d="M2 -5 C6 -1 5 6 1 8 C-1 6 0 0 2 -5 Z" fill="#14b8a6" />
        <circle cx="-2" cy="7" r="1.5" fill="#5eead4" />
      </g>

      {/* Sayap / Tangan Kanan Mengetik di Balik Layar */}
      <ellipse cx="132" cy="128" rx="15" ry="9" fill="url(#tkFurDark)" transform="rotate(-15 132 128)" />

      {/* === 7. KACAMATA BUNDAR TEBAL ORANYE CERAH (PERSIS GAMBAR 2) === */}
      {/* Bingkai Kacamata Kiri */}
      <circle cx="76" cy="82" r="23" stroke="url(#tkGlasses)" strokeWidth="6.5" fill="#ffffff" fillOpacity=".12" />
      {/* Bingkai Kacamata Kanan */}
      <circle cx="124" cy="82" r="23" stroke="url(#tkGlasses)" strokeWidth="6.5" fill="#ffffff" fillOpacity=".12" />
      {/* Jembatan Kacamata Melengkung di Tengah */}
      <path d="M98 81 C100 76 100 76 102 81" stroke="url(#tkGlasses)" strokeWidth="6.5" strokeLinecap="round" />

      {/* === 8. MATA BULAT HITAM BESAR BERKILAU (ANIME SHINY EYES PERSIS GAMBAR 2) === */}
      {/* Pupil Hitam Pekat */}
      <circle cx="76" cy="82" r="15" fill="#0f172a" />
      <circle cx="124" cy="82" r="15" fill="#0f172a" />

      {/* Catchlight Titik Cahaya Putih Besar Atas-Kiri */}
      <circle cx="72" cy="77" r="5.6" fill="#ffffff" />
      <circle cx="120" cy="77" r="5.6" fill="#ffffff" />
      {/* Catchlight Titik Cahaya Putih Kecil Bawah-Kanan */}
      <circle cx="82" cy="86" r="2.6" fill="#ffffff" />
      <circle cx="130" cy="86" r="2.6" fill="#ffffff" />

      {/* === 9. PARUH KEEMASAN SEGITIGA & SENYUM IMUT (PERSIS GAMBAR 2) === */}
      {/* Paruh Segitiga Emas Menghadap Bawah */}
      <polygon points="100,89 92,103 108,103" fill="url(#tkBeak)" />
      {/* Bayangan Lipatan Senyum di Bawah Paruh */}
      <path d="M93 104 C97 110 103 110 107 104" fill="#9a3412" opacity=".4" />
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
          <TeksieAtLaptop size={160} />
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
