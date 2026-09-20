import React from 'react';

/**
 * =================================================================
 * KOLEKSI 2D VECTOR ART & ICON ELEGAN (PENGGANTI EMOJI/EMOTE)
 * Dirancang khusus untuk tema PahamTeks (Bahasa, Teks, Logika & Maskot)
 * =================================================================
 */

// 1. Buku 2D Terbuka (Simbol Pengetahuan & Kamus)
export function Book2DIcon({ size = 18, color = '#38bdf8', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" fill="rgba(56, 189, 248, 0.15)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7H16M8 11H14" stroke="#58cc02" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 2. Gamepad / Interaktif 2D (Simbol 100% Interaktif)
export function Interactive2DIcon({ size = 18, color = '#58cc02', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="2" y="6" width="20" height="12" rx="6" fill="rgba(88, 204, 2, 0.15)" stroke={color} strokeWidth="2.2" />
      <path d="M6 12H10M8 10V14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="15" cy="10" r="1.2" fill="#ffd700" />
      <circle cx="17.5" cy="12.5" r="1.2" fill="#1cb0f6" />
    </svg>
  );
}

// 3. Petir Kilat 2D (Simbol Kuis Cepat & Adaptif)
export function Lightning2DIcon({ size = 18, color = '#ffd700', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="rgba(255, 215, 0, 0.2)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 4. Grafik Batang & Tren 2D (Simbol Pelacakan Akurat & Statistik)
export function Analytics2DIcon({ size = 18, color = '#1cb0f6', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <rect x="3" y="14" width="4" height="7" rx="1" fill={color} opacity="0.7" />
      <rect x="10" y="9" width="4" height="12" rx="1" fill={color} opacity="0.9" />
      <rect x="17" y="4" width="4" height="17" rx="1" fill="#58cc02" />
      <path d="M4 11L11 6L18 3" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="15 3 18 3 18 6" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 5. Penunjuk Panah Bawah 2D (Untuk Balon Petunjuk Daftar Akun)
export function DownPointer2DIcon({ size = 18, color = '#58cc02', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" fill="rgba(88, 204, 2, 0.2)" stroke={color} strokeWidth="2" />
      <path d="M12 7V16M12 16L8.5 12.5M12 16L15.5 12.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 6. Bola Dunia 2D (Simbol 50+ Bahasa Dunia)
export function Globe2DIcon({ size = 18, color = '#1cb0f6', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" fill="rgba(28, 176, 246, 0.15)" />
      <path d="M3.6 9H20.4M3.6 15H20.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

// 7. Pengeras Suara 2D (Simbol Audio Penutur Asli)
export function AudioSpeaker2DIcon({ size = 18, color = '#58cc02', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(88, 204, 2, 0.25)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M15.5 8.5C16.8 9.8 16.8 14.2 15.5 15.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 6C21.5 8.5 21.5 15.5 19 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 8. Kaca Pembesar 2D (Simbol Pencarian Kamus)
export function Search2DIcon({ size = 18, color = '#ffd700', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.4" fill="rgba(255, 215, 0, 0.15)" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M8 10C8.5 8.8 9.8 8 11 8" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// 9. Lampu Ide 2D (Simbol Penjelasan Ramah Manusia)
export function Lightbulb2DIcon({ size = 18, color = '#ffd700', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M9 18H15M10 21H14M12 2C7.5 2 4 5.5 4 10C4 12.8 5.5 15.2 7.7 16.5C8 16.7 8.5 17.3 8.5 18H15.5C15.5 17.3 16 16.7 16.3 16.5C18.5 15.2 20 12.8 20 10C20 5.5 16.5 2 12 2Z" fill="rgba(255, 215, 0, 0.2)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Kilau Bintang 2D (Simbol Contoh Kontekstual)
export function Sparkle2DIcon({ size = 18, color = '#38bdf8', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="rgba(56, 189, 248, 0.25)" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 11. Roket 2D (Simbol Mulai Petualangan / CTA)
export function Rocket2DIcon({ size = 18, color = '#58cc02', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M4.5 16.5C3 18 3 21 3 21C3 21 6 21 7.5 19.5C9 18 10 16 10 16L8 14C8 14 6 15 4.5 16.5Z" fill="#ea580c" />
      <path d="M14.5 3.5C12 4.5 9.5 7 8 9L15 16C17 14.5 19.5 12 20.5 9.5C21.5 7 21 3 21 3C21 3 17 2.5 14.5 3.5Z" fill="rgba(88, 204, 2, 0.3)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="15.5" cy="8.5" r="2" fill="#ffffff" stroke={color} strokeWidth="1.5" />
      <path d="M8 9L4 10L6 12M15 16L14 20L12 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 12. Profil Pengguna 2D (Simbol Akun Tamu / Profil)
export function User2DIcon({ size = 18, color = '#1cb0f6', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2.2" fill="rgba(28, 176, 246, 0.2)" />
      <path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 13. Piala Prestasi 2D (Simbol Podium Prestasi)
export function Trophy2DIcon({ size = 18, color = '#ffd700', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M6 3H18V10C18 13.3 15.3 16 12 16C8.7 16 6 13.3 6 10V3Z" fill="rgba(255, 215, 0, 0.2)" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M6 5H3C2 5 2 8 4 9C5 9.5 6 9.5 6 9.5M18 5H21C22 5 22 8 20 9C19 9.5 18 9.5 18 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16V20M8 20H16" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

// 14. Tag Kode 2D (Simbol Logika & Koding)
export function CodeTag2DIcon({ size = 18, color = '#1cb0f6', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <polyline points="16 18 22 12 16 6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="4" x2="10" y2="20" stroke="#58cc02" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// 15. MASKOT RESMI KITA DI NAVBAR (Teksie Si Musang Cerdas)
// Menampilkan wajah imut Teksie si Musang dengan kacamata pintar cyan PahamTeks
export function TeksieNavMascot({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`teksie-nav-mascot ${className}`}
      style={{ verticalAlign: 'middle', flexShrink: 0, cursor: 'pointer', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
    >
      <defs>
        <radialGradient id="navTeksieFur" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="navTeksieGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Telinga Musang Cerdas (Compact Rounded Civet Ears) */}
      <path d="M14 15L8 6C5 11 8 18 15 20Z" fill="#ea580c" />
      <path d="M13 14L9 8C7 12 9 16 14 18Z" fill="#fed7aa" />
      <path d="M13 14L10 10C9 13 11 16 14 17Z" fill="#f472b6" opacity="0.75" />

      <path d="M26 15L32 6C35 11 32 18 25 20Z" fill="#ea580c" />
      <path d="M27 14L31 8C33 12 31 16 26 18Z" fill="#fed7aa" />
      <path d="M27 14L30 10C31 13 29 16 26 17Z" fill="#f472b6" opacity="0.75" />

      {/* Kepala Bulat Musang Semi-3D */}
      <circle cx="20" cy="24" r="14" fill="url(#navTeksieFur)" />
      <path d="M14 13C17 11 23 11 26 13" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.45" />

      {/* Pipi Putih Halus Gembul */}
      <path d="M8 25C8 31 13 35 20 35C27 35 32 31 32 25C32 21 28 20 20 20C12 20 8 21 8 25Z" fill="#ffffff" />
      <ellipse cx="11" cy="27" rx="2" ry="1.2" fill="#fb7185" opacity="0.65" />
      <ellipse cx="29" cy="27" rx="2" ry="1.2" fill="#fb7185" opacity="0.65" />

      {/* Kacamata Pintar Cyan 3D */}
      <circle cx="15" cy="22" r="4.8" stroke="url(#navTeksieGlasses)" strokeWidth="1.8" fill="rgba(56, 189, 248, 0.18)" />
      <circle cx="25" cy="22" r="4.8" stroke="url(#navTeksieGlasses)" strokeWidth="1.8" fill="rgba(56, 189, 248, 0.18)" />
      <line x1="19.5" y1="22" x2="20.5" y2="22" stroke="url(#navTeksieGlasses)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 19C14 18 16 18 17 19.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
      <path d="M23 19C24 18 26 18 27 19.5" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />

      {/* Mata Cerdas Berbinar (Duolingo Style Eyes) */}
      <circle cx="15" cy="22" r="2.4" fill="#0f172a" />
      <circle cx="25" cy="22" r="2.4" fill="#0f172a" />
      <circle cx="14.2" cy="21.2" r="0.9" fill="#ffffff" />
      <circle cx="24.2" cy="21.2" r="0.9" fill="#ffffff" />
      <circle cx="15.6" cy="22.8" r="0.4" fill="#ffffff" />
      <circle cx="25.6" cy="22.8" r="0.4" fill="#ffffff" />

      {/* Hidung Hitam Imut 3D */}
      <polygon points="19,26.5 21,26.5 20,28" fill="#0f172a" />

      {/* Senyum Terbuka Ceria dengan Lidah Pink */}
      <path d="M18 28.8C18.5 30.8 21.5 30.8 22 28.8Z" fill="#881337" />
      <path d="M18.8 29.5C19.4 30.4 20.6 30.4 21.2 29.5Z" fill="#fb7185" />
    </svg>
  );
}

