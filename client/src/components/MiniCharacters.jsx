import React from 'react';

/**
 * Maskot Burung Hantu Cerdas "Pami" (Khas PahamTeks)
 * Dengan nuansa hijau segar, kacamata pintar, dan mata bulat ceria
 */
export function PamiOwl({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}
    >
      {/* Kaki Owl */}
      <ellipse cx="62" cy="148" rx="14" ry="7" fill="#f59e0b" />
      <ellipse cx="98" cy="148" rx="14" ry="7" fill="#f59e0b" />

      {/* Badan & Kepala (Bentuk Telur Gemuk ala Maskot Duolingo) */}
      <path
        d="M80 18C44 18 28 46 28 88C28 130 48 146 80 146C112 146 132 130 132 88C132 46 116 18 80 18Z"
        fill="#58cc02"
      />

      {/* Sayap Kiri & Kanan */}
      <path
        d="M28 85C20 92 18 106 24 116C30 126 40 124 44 116C40 102 36 92 28 85Z"
        fill="#46a302"
      />
      <path
        d="M132 85C140 92 142 106 136 116C130 126 120 124 116 116C120 102 124 92 132 85Z"
        fill="#46a302"
      />

      {/* Bulu Dada Lembut */}
      <ellipse cx="80" cy="112" rx="30" ry="24" fill="#89e219" />
      <path d="M72 104C74 107 78 107 80 104" stroke="#46a302" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 104C82 107 86 107 88 104" stroke="#46a302" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 114C78 117 82 117 84 114" stroke="#46a302" strokeWidth="3" strokeLinecap="round" />

      {/* Lingkaran Mata Putih Besar */}
      <circle cx="58" cy="68" r="22" fill="#ffffff" />
      <circle cx="102" cy="68" r="22" fill="#ffffff" />

      {/* Bola Mata Hitam Bersinar */}
      <circle cx="62" cy="68" r="11" fill="#1b381e" />
      <circle cx="98" cy="68" r="11" fill="#1b381e" />

      {/* Kilau Mata (Catchlight) */}
      <circle cx="60" cy="64" r="4.5" fill="#ffffff" />
      <circle cx="96" cy="64" r="4.5" fill="#ffffff" />
      <circle cx="65" cy="71" r="2" fill="#ffffff" />
      <circle cx="101" cy="71" r="2" fill="#ffffff" />

      {/* Kacamata Pintar Biru Cyan */}
      <circle cx="58" cy="68" r="23" stroke="#1cb0f6" strokeWidth="4.5" fill="none" />
      <circle cx="102" cy="68" r="23" stroke="#1cb0f6" strokeWidth="4.5" fill="none" />
      <path d="M81 68H79" stroke="#1cb0f6" strokeWidth="4.5" strokeLinecap="round" />

      {/* Paruh Lucu Berwarna Oranye */}
      <polygon points="74,80 86,80 80,94" fill="#f59e0b" />
      <polygon points="76,80 84,80 80,88" fill="#fbbf24" />

      {/* Rona Pipi Merah Muda (Blush) */}
      <ellipse cx="40" cy="84" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
      <ellipse cx="120" cy="84" rx="7" ry="4" fill="#f472b6" opacity="0.6" />

      {/* Alis Ekspresif */}
      <path d="M46 44C52 40 64 42 68 46" stroke="#46a302" strokeWidth="4" strokeLinecap="round" />
      <path d="M114 44C108 40 96 42 92 46" stroke="#46a302" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Karakter Mini Penunjuk Tombol (PeekingPointer)
 * Karakter menggemaskan yang nongol dari atas kartu dan tangannya beranimasi menunjuk ke tombol pendaftaran akun!
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
      {/* Balon Kata Interaktif (Speech Bubble) */}
      <div className="peeking-speech-bubble" onClick={onPointerClick} title="Klik untuk mendaftar">
        <span className="speech-icon">👉</span>
        <span className="speech-text">
          {isRegister
            ? (currentLang === 'en' ? 'Pick a username & start free! 🎉' : 'Isi username unikmu & buat akun gratis! 🎉')
            : (currentLang === 'en' ? 'Don’t have an account? Click Register here!' : 'Belum punya akun? Klik Daftar di sini!')}
        </span>
      </div>

      {/* Karakter Mini Nongol dengan Tangan Menunjuk */}
      <div className="peeking-character-wrapper" onClick={onPointerClick}>
        <svg
          width="130"
          height="95"
          viewBox="0 0 130 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="peeking-character-svg"
        >
          {/* Kepala Maskot Hijau Mengintip dari Bawah */}
          <path
            d="M20 95C20 48 38 22 65 22C92 22 110 48 110 95H20Z"
            fill="#58cc02"
          />

          {/* Rona Wajah */}
          <ellipse cx="38" cy="72" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />
          <ellipse cx="92" cy="72" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />

          {/* Mata Melirik Antusias */}
          <circle cx="48" cy="56" r="14" fill="#ffffff" />
          <circle cx="82" cy="56" r="14" fill="#ffffff" />
          <circle cx="52" cy="56" r="7" fill="#1a381e" />
          <circle cx="86" cy="56" r="7" fill="#1a381e" />
          <circle cx="50" cy="53" r="3" fill="#ffffff" />
          <circle cx="84" cy="53" r="3" fill="#ffffff" />

          {/* Paruh Kecil Ceria */}
          <polygon points="61,64 69,64 65,74" fill="#f59e0b" />

          {/* Tangan Kanan Beranimasi Menunjuk ke Bawah/Samping */}
          <g className="pointing-hand-animated">
            <ellipse cx="112" cy="62" rx="14" ry="12" fill="#58cc02" />
            <path
              d="M112 55L128 62L112 69"
              stroke="#58cc02"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Jari telunjuk mengarah ke tombol */}
            <path
              d="M114 62H128"
              stroke="#46a302"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* Topi Wisuda Mini / Earphone Keren */}
          <rect x="52" y="10" width="26" height="12" rx="4" fill="#1cb0f6" />
          <circle cx="65" cy="8" r="4" fill="#ffd700" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Karakter Penjelajah Bahasa "Niko"
 * Anak kecil menggemaskan dengan ransel dan bendera bahasa
 */
export function NikoExplorer({ size = 110, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}
    >
      {/* Badan & Jaket Oranye Ceria */}
      <path d="M42 90C42 78 54 70 70 70C86 70 98 78 98 90V130H42V90Z" fill="#ff9600" />
      <rect x="62" y="80" width="16" height="50" rx="3" fill="#ffffff" />

      {/* Kepala Bulat Ceria */}
      <circle cx="70" cy="48" r="30" fill="#fcd34d" />

      {/* Topi Beanie Keren Warna Cyan */}
      <path d="M40 44C40 24 53 14 70 14C87 14 100 24 100 44H40Z" fill="#1cb0f6" />
      <circle cx="70" cy="12" r="7" fill="#ffffff" />

      {/* Rambut Cokelat Lucu */}
      <path d="M43 44C47 50 51 52 56 46" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <path d="M84 46C89 52 93 50 97 44" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />

      {/* Wajah Senyum Lebar */}
      <circle cx="58" cy="48" r="5" fill="#1e293b" />
      <circle cx="82" cy="48" r="5" fill="#1e293b" />
      <circle cx="57" cy="46" r="1.8" fill="#ffffff" />
      <circle cx="81" cy="46" r="1.8" fill="#ffffff" />
      <ellipse cx="50" cy="55" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
      <ellipse cx="90" cy="55" rx="5" ry="3" fill="#f43f5e" opacity="0.4" />
      <path d="M63 56C65 62 75 62 77 56" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

      {/* Tangan Memegang Tongkat Bendera */}
      <path d="M96 86L116 70" stroke="#ff9600" strokeWidth="8" strokeLinecap="round" />
      <line x1="116" y1="40" x2="116" y2="105" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M116 42L138 52L116 62V42Z" fill="#58cc02" />
    </svg>
  );
}

/**
 * Karakter Programmer Cilik "Tara"
 * Dengan rambut ungu modern dan laptop bercahaya kode
 */
export function TaraCoder({ size = 110, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}
    >
      {/* Rambut Ungu Elegan ala Duolingo Lily */}
      <path d="M35 55C35 24 50 16 70 16C90 16 105 24 105 55C105 85 96 95 96 95L44 95C44 95 35 85 35 55Z" fill="#a855f7" />

      {/* Wajah Manis */}
      <circle cx="70" cy="54" r="26" fill="#fde047" />

      {/* Poni Rambut */}
      <path d="M44 40C52 48 64 36 74 44C84 38 92 46 96 42" stroke="#9333ea" strokeWidth="6" strokeLinecap="round" />

      {/* Mata Senyum Matahari */}
      <path d="M56 54C58 51 63 51 65 54" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 54C77 51 82 51 84 54" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="52" cy="60" rx="4" ry="2.5" fill="#ec4899" opacity="0.5" />
      <ellipse cx="88" cy="60" rx="4" ry="2.5" fill="#ec4899" opacity="0.5" />

      {/* Headphone Musik/Koding */}
      <path d="M40 50C40 32 52 24 70 24C88 24 100 32 100 50" stroke="#1cb0f6" strokeWidth="5" fill="none" />
      <rect x="36" y="44" width="8" height="18" rx="4" fill="#0284c7" />
      <rect x="96" y="44" width="8" height="18" rx="4" fill="#0284c7" />

      {/* Baju Hoodie Hitam Koding */}
      <path d="M45 88C45 80 55 76 70 76C85 76 95 80 95 88V130H45V88Z" fill="#1e293b" />

      {/* Laptop Bercahaya */}
      <polygon points="48,110 92,110 84,124 56,124" fill="#64748b" />
      <rect x="52" y="92" width="36" height="20" rx="3" fill="#1cb0f6" />
      <text x="56" y="106" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="monospace">
        &lt;/&gt;
      </text>
    </svg>
  );
}

/**
 * Karakter Mentor Ramah Berkumis "Baron" (Inspirasi Foto ke-2 Duolingo)
 * Sosok mentor ramah berkumis rapi dengan kemeja pink dan jempol bangga di samping podium!
 */
export function BaronMentor({ size = 125, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))' }}
    >
      {/* Celana Hijau Emerald */}
      <path d="M50 115C50 105 100 105 100 115V145H50V115Z" fill="#059669" />

      {/* Kemeja Pink Ceria khas Karakter Duolingo */}
      <path d="M40 76C40 68 54 62 75 62C96 62 110 68 110 76V118H40V76Z" fill="#f472b6" />

      {/* Kepala Bulat Hangat */}
      <circle cx="75" cy="44" r="25" fill="#f59e0b" opacity="0.85" />
      {/* Rambut Cokelat Bergaya Klasik */}
      <path d="M52 40C52 24 62 20 75 20C88 20 98 24 98 40C98 32 90 28 75 28C60 28 52 32 52 40Z" fill="#451a03" />

      {/* Mata Hangat Tersenyum */}
      <circle cx="65" cy="42" r="3.5" fill="#1e293b" />
      <circle cx="85" cy="42" r="3.5" fill="#1e293b" />

      {/* Kumis Lebat Ikonik Lucu */}
      <path
        d="M60 54C68 50 74 54 75 56C76 54 82 50 90 54C93 56 93 60 88 61C78 63 76 58 75 58C74 58 72 63 62 61C57 60 57 56 60 54Z"
        fill="#451a03"
      />

      {/* Tangan Kiri Mengacungkan Jempol (Thumbs Up) */}
      <path d="M40 82L24 72" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" />
      <circle cx="20" cy="68" r="6" fill="#f59e0b" />
      <path d="M20 66V60" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

      {/* Tangan Kanan Menunjuk ke Podium */}
      <path d="M110 82L132 92" stroke="#f472b6" strokeWidth="8" strokeLinecap="round" />
      <circle cx="134" cy="94" r="6" fill="#f59e0b" />
    </svg>
  );
}

/**
 * Kluster Karakter Komposisi Hero (Seperti Foto 1 Duolingo)
 * Gabungan Pami Owl, Niko, dan Tara dengan koin emas & lencana berkilau
 */
export function CharacterCluster() {
  return (
    <div className="character-cluster-wrapper">
      {/* Koin & Partikel Mengambang Berkilau */}
      <div className="floating-bubble bubble-hello">
        <span className="bubble-flag">🇯🇵</span> Konnichiwa!
      </div>
      <div className="floating-bubble bubble-code">
        <span className="bubble-flag">🐍</span> print(&quot;Paham!&quot;)
      </div>
      <div className="floating-bubble bubble-bonjour">
        <span className="bubble-flag">🇫🇷</span> Bonjour!
      </div>
      <div className="floating-bubble bubble-arabic">
        <span className="bubble-flag">🇸🇦</span> Ahlan! (أهلاً)
      </div>

      {/* Karakter Utama Tengah: Pami Owl */}
      <div className="cluster-main-pami">
        <PamiOwl size={150} />
      </div>

      {/* Karakter Samping Kiri: Niko Explorer */}
      <div className="cluster-side-niko">
        <NikoExplorer size={110} />
      </div>

      {/* Karakter Samping Kanan: Tara Coder */}
      <div className="cluster-side-tara">
        <TaraCoder size={110} />
      </div>

      {/* Bintang & Koin Mengambang */}
      <div className="gold-coin coin-1">⭐</div>
      <div className="gold-coin coin-2">💎</div>
      <div className="gold-coin coin-3">🚀</div>
    </div>
  );
}
