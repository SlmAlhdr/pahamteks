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
      aria-label="Teksie, maskot burung hantu oranye dengan laptop"
      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.45))', overflow: 'visible' }}
    >
      <defs>
        {/* Gradasi Bulu Oranye Teksie */}
        <radialGradient id="teksieOwlFur" cx="45%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#ff9a3c" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        {/* Gradasi Bayangan Bulu Luar */}
        <linearGradient id="teksieDarkFur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        {/* Gradasi Perut Krem */}
        <linearGradient id="teksieBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        {/* Gradasi Laptop Navy Modern */}
        <linearGradient id="teksieLaptopBack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253342" />
          <stop offset="100%" stopColor="#15202b" />
        </linearGradient>
        {/* Bingkai Kacamata Oranye Cerah */}
        <linearGradient id="teksieGlasses" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>

      {/* Bayangan Meja Halus */}
      <ellipse cx="80" cy="148" rx="60" ry="7" fill="#000000" fillOpacity=".35" />

      {/* === 1. TELINGA BURUNG HANTU LANCIP (KIRI & KANAN) === */}
      {/* Telinga Kiri */}
      <path d="M37 54C33 34 32 18 36 14C44 20 54 36 57 50Z" fill="url(#teksieDarkFur)" />
      <path d="M38 46C37 32 37 22 40 19C45 25 50 36 52 46Z" fill="#fed7aa" />

      {/* Telinga Kanan */}
      <path d="M123 54C127 34 128 18 124 14C116 20 106 36 103 50Z" fill="url(#teksieDarkFur)" />
      <path d="M122 46C123 32 123 22 120 19C115 25 110 36 108 46Z" fill="#fed7aa" />

      {/* === 2. KEPALA UTAMA BULAT GEMAS === */}
      <ellipse cx="80" cy="65" rx="46" ry="43" fill="url(#teksieOwlFur)" />

      {/* Rumbai Bulu Pipi Luar Kiri & Kanan */}
      <path d="M34 68C28 72 26 78 30 83C36 84 40 78 40 72Z" fill="url(#teksieDarkFur)" />
      <path d="M126 68C132 72 134 78 130 83C124 84 120 78 120 72Z" fill="url(#teksieDarkFur)" />

      {/* === 3. TOPENG WAJAH PUTIH MEMBULAT (FACIAL DISC) === */}
      <path
        d="M45 54C43 68 48 83 62 86C70 87 76 82 80 78C84 82 90 87 98 86C112 83 117 68 115 54C113 42 101 44 94 48C88 52 82 53 80 50C78 53 72 52 66 48C59 44 47 42 45 54Z"
        fill="#ffffff"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.06))' }}
      />

      {/* === 4. TUBUH & PERUT ORANYE KREM === */}
      <ellipse cx="80" cy="118" rx="42" ry="28" fill="url(#teksieOwlFur)" />
      {/* Perut Krem Berbingkai Melengkung */}
      <ellipse cx="80" cy="116" rx="26" ry="20" fill="url(#teksieBelly)" stroke="#ea580c" strokeWidth="2.5" />
      {/* Pola Tetesan/Bulu Dada Khas Burung Hantu */}
      <path d="M72 108C75 112 85 112 88 108" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M68 118C73 122 87 122 92 118" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

      {/* === 5. SAYAP KIRI MEMELUK KE DEPAN & BULU JARI SAYAP === */}
      <path
        d="M38 102C32 105 24 112 22 119C20 126 26 131 34 128C44 124 49 116 52 109C48 104 42 102 38 102Z"
        fill="url(#teksieOwlFur)"
      />
      {/* 3 Lekukan Bulu Jemari Sayap Kiri */}
      <path d="M22 121C26 124 33 123 37 120" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 127C30 129 36 128 40 124" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />

      {/* === 6. LAPTOP TERBUKA MENGHADAP KE KANAN DEPAN === */}
      {/* Punggung Layar Laptop */}
      <path
        d="M75 106L87 97H146L135 137H73L75 106Z"
        fill="url(#teksieLaptopBack)"
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

      {/* Logo Tunas/Daun Toska Menyala di Punggung Laptop */}
      <g transform="translate(110, 114) scale(0.9)">
        <path d="M-6 -4C-2 1 -3 7 -7 9C-9 7 -10 1 -6 -4Z" fill="#2dd4bf" />
        <path d="M2 -5C6 -1 5 6 1 8C-1 6 0 0 2 -5Z" fill="#14b8a6" />
        <circle cx="-2" cy="7" r="1.5" fill="#5eead4" />
      </g>

      {/* Sayap Kanan Mengetik di Balik Layar */}
      <ellipse cx="106" cy="100" rx="12" ry="7" fill="url(#teksieDarkFur)" transform="rotate(-15 106 100)" />

      {/* === 7. KACAMATA BUNDAR TEBAL ORANYE CERAH === */}
      {/* Bingkai Kacamata Kiri */}
      <circle cx="61" cy="62" r="19" stroke="url(#teksieGlasses)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Bingkai Kacamata Kanan */}
      <circle cx="99" cy="62" r="19" stroke="url(#teksieGlasses)" strokeWidth="5.5" fill="#ffffff" fillOpacity=".12" />
      {/* Jembatan Kacamata Melengkung di Tengah */}
      <path d="M78 61C80 57 80 57 82 61" stroke="url(#teksieGlasses)" strokeWidth="5.5" strokeLinecap="round" />

      {/* === 8. MATA BULAT HITAM BESAR BERKILAU (CUTE ANIME EYES) === */}
      {/* Pupil Hitam Besar */}
      <circle cx="61" cy="62" r="12.5" fill="#0f172a" />
      <circle cx="99" cy="62" r="12.5" fill="#0f172a" />

      {/* Kilau Cahaya (Catchlight) Mata Kiri */}
      <circle cx="58" cy="58" r="4.8" fill="#ffffff" />
      <circle cx="66" cy="65" r="2.2" fill="#ffffff" />

      {/* Kilau Cahaya (Catchlight) Mata Kanan */}
      <circle cx="96" cy="58" r="4.8" fill="#ffffff" />
      <circle cx="104" cy="65" r="2.2" fill="#ffffff" />

      {/* === 9. PARUH SEGITIGA EMAS & SENYUM KECIL === */}
      <polygon points="80,68 74,79 86,79" fill="#f59e0b" />
      <polygon points="80,71 76,78 84,78" fill="#fbbf24" />
      <path d="M75 79C78 85 82 85 85 79" fill="#9a3412" opacity=".4" />

      {/* === 10. TIGA GARIS KILAU CERIA KARTUN DI KANAN ATAS === */}
      <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
        {/* Garis Miring Atas */}
        <line x1="126" y1="36" x2="137" y2="30" />
        {/* Garis Horizontal Tengah */}
        <line x1="130" y1="44" x2="143" y2="44" />
        {/* Garis Miring Bawah */}
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
