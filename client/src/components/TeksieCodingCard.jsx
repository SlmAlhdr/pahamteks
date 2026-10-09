import React from 'react';

/**
 * =================================================================
 * TEKSIE CODING COMPANION (MASKOT BURUNG HANTU HIJAU + LAPTOP)
 * Desain presisi sesuai mock-up gambar sisi kiri
 * =================================================================
 */

export function TeksieLaptopOwl({ size = 110 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))', flexShrink: 0 }}
    >
      <defs>
        {/* Bulu Tubuh Hijau Toska / Emerald */}
        <radialGradient id="owlBodyGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </radialGradient>
        {/* Dada Putih Keabuan Halus */}
        <linearGradient id="owlChestGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
        {/* Laptop Abu-Abu Gelap */}
        <linearGradient id="laptopBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Telinga Burung Hantu (Kiri & Kanan) */}
      <polygon points="42,50 28,18 64,36" fill="#047857" />
      <polygon points="118,50 132,18 96,36" fill="#047857" />
      <polygon points="44,46 34,26 60,38" fill="#10b981" />
      <polygon points="116,46 126,26 100,38" fill="#10b981" />

      {/* Tubuh Bulat Gemas */}
      <ellipse cx="80" cy="85" rx="52" ry="50" fill="url(#owlBodyGrad)" />

      {/* Perut / Dada */}
      <ellipse cx="80" cy="96" rx="34" ry="32" fill="url(#owlChestGrad)" opacity="0.95" />
      {/* Pola Bulu Halus di Dada */}
      <path d="M72 88C76 92 84 92 88 88" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 100C72 105 88 105 94 100" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

      {/* Sayap (Kiri & Kanan) */}
      <path d="M28 80C26 95 38 112 48 110C48 95 38 78 28 80Z" fill="#047857" />
      <path d="M132 80C134 95 122 112 112 110C112 95 122 78 132 80Z" fill="#047857" />

      {/* Mata Besar Khas Burung Hantu (Lingkaran Putih Luar) */}
      <circle cx="56" cy="62" r="21" fill="#ffffff" stroke="#065f46" strokeWidth="3.5" />
      <circle cx="104" cy="62" r="21" fill="#ffffff" stroke="#065f46" strokeWidth="3.5" />

      {/* Iris Oranye Hangat */}
      <circle cx="56" cy="62" r="14" fill="#f97316" />
      <circle cx="104" cy="62" r="14" fill="#f97316" />

      {/* Pupil Hitam */}
      <circle cx="56" cy="62" r="8" fill="#0f172a" />
      <circle cx="104" cy="62" r="8" fill="#0f172a" />

      {/* Kilau Mata Putih (Catchlight) */}
      <circle cx="53" cy="58" r="4" fill="#ffffff" />
      <circle cx="101" cy="58" r="4" fill="#ffffff" />
      <circle cx="59" cy="65" r="2" fill="#ffffff" />
      <circle cx="107" cy="65" r="2" fill="#ffffff" />

      {/* Paruh Segitiga Oranye */}
      <polygon points="80,68 73,80 87,80" fill="#ea580c" />
      <polygon points="80,70 75,79 85,79" fill="#f97316" />

      {/* Tangan Burung Hantu Memegang Laptop */}
      <ellipse cx="50" cy="112" rx="10" ry="7" fill="#047857" />
      <ellipse cx="110" cy="112" rx="10" ry="7" fill="#047857" />

      {/* Laptop Mini Terbuka */}
      {/* Layar Belakang Laptop */}
      <path d="M46 114L54 94H106L114 114H46Z" fill="url(#laptopBodyGrad)" stroke="#334155" strokeWidth="2" />
      {/* Logo Daun/Sayap Toska di Punggung Layar Laptop */}
      <path d="M80 99C84 103 82 108 78 109C76 107 77 101 80 99Z" fill="#10b981" />
      <path d="M80 99C76 103 78 108 82 109C84 107 83 101 80 99Z" fill="#34d399" />
      {/* Base / Keyboard Bawah Laptop */}
      <rect x="40" y="114" width="80" height="9" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
      <rect x="74" y="115" width="12" height="2" rx="1" fill="#64748b" />
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
      {/* Kartu Profil Teksie & Laptop */}
      <div className="teksie-companion-box">
        <div className="teksie-owl-wrapper">
          <TeksieLaptopOwl size={105} />
        </div>
        <div className="teksie-greeting-content">
          <div className="teksie-greeting-header">
            <span className="teksie-greeting-hello">{greetingTitle}</span>
            <h4 className="teksie-greeting-name">{greetingSubtitle}</h4>
          </div>
          <p className="teksie-greeting-desc">{greetingDesc}</p>
        </div>
      </div>

      {/* Kartu Tips Hari Ini */}
      <div className="teksie-tips-box">
        <div className="teksie-tips-icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
          </svg>
        </div>
        <div className="teksie-tips-content">
          <h5 className="teksie-tips-title">{tipsTitle}</h5>
          <p className="teksie-tips-desc">{tipsDesc}</p>
        </div>
      </div>
    </aside>
  );
}
