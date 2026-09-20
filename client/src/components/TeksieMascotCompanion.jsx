import React, { useState, useEffect } from 'react';

/**
 * =================================================================
 * TEKSIE MASCOT COMPANION (TEMAN BELAJAR INTERAKTIF DI SEMUA HALAMAN)
 * Maskot Resmi PahamTeks: "Teksie" Si Musang Pandan/Luwak Cerdas
 * Berlari, menyapa, dan memberi semangat setiap kali pengguna pindah halaman!
 * =================================================================
 */

export default function TeksieMascotCompanion({ activeTab, currentLang }) {
  const [speech, setSpeech] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Pesan ceria kontekstual sesuai halaman yang sedang dibuka
  useEffect(() => {
    setIsRunning(true);
    let msg = '';

    if (activeTab === 'home') {
      msg = currentLang === 'en'
        ? 'Welcome back! Ready for a quick quiz?'
        : 'Halo! Siap asah otak lewat kuis hari ini? ✨';
    } else if (activeTab === 'learning') {
      msg = currentLang === 'en'
        ? 'Choose your path: World Languages or Coding Logic!'
        : 'Pilih modul favoritmu: Bahasa Dunia atau Logika Koding!';
    } else if (activeTab === 'dict_trans') {
      msg = currentLang === 'en'
        ? 'Search any word or translate smoothly!'
        : 'Cari arti istilah sulit atau terjemahkan frasa di sini!';
    } else if (activeTab === 'account') {
      msg = currentLang === 'en'
        ? 'Great progress! Review your accuracy and podium stats!'
        : 'Luar biasa! Pantau akurasi & riwayat prestasimu!';
    }

    setSpeech(msg);

    const timer = setTimeout(() => {
      setIsRunning(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [activeTab, currentLang]);

  // Klik Teksie untuk tips acak / lompat gembira
  const handleMascotClick = () => {
    setIsRunning(true);
    const tipsId = [
      'Konsistensi 5 menit per hari lebih efektif daripada belajar 2 jam sekali seminggu!',
      'Pahami pola logika dan struktur kalimat, bukan sekadar menghafal kata!',
      'Jangan takut salah saat kuis! Dari koreksi itulah otakmu berkembang pesat.',
      'Kombinasi bahasa manusia dan bahasa koding membuat pikiranmu semakin tajam!',
      'Teksie selalu siap menemanimu belajar di PahamTeks!'
    ];
    const tipsEn = [
      '5 minutes of daily practice beats 2 hours once a week!',
      'Understand sentence structures and code patterns, not just raw words!',
      'Mistakes are proof you are learning. Review the explanations!',
      'Combining world languages and code logic supercharges your mind!',
      'Teksie is always here cheering for your success!'
    ];

    const pool = currentLang === 'en' ? tipsEn : tipsId;
    const randomTip = pool[Math.floor(Math.random() * pool.length)];
    setSpeech(randomTip);

    setTimeout(() => {
      setIsRunning(false);
    }, 3500);
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        className="mascot-companion-minimized"
        onClick={() => setIsMinimized(false)}
        title="Buka Teksie si Musang Cerdas"
      >
        <span className="minimized-avatar">🦡</span>
        <span className="minimized-label">Teksie</span>
      </button>
    );
  }

  return (
    <div className={`teksie-companion-container ${isRunning ? 'running-active' : ''}`}>
      {/* Balon Kata Semangat Teksie */}
      {speech && (
        <div className="teksie-speech-bubble" onClick={handleMascotClick}>
          <span>{speech}</span>
          <button
            type="button"
            className="teksie-bubble-close"
            onClick={(e) => {
              e.stopPropagation();
              setSpeech('');
            }}
            title="Tutup Balon Kata"
          >
            ×
          </button>
        </div>
      )}

      {/* Maskot Teksie si Musang dengan Animasi Gerak / Berlari */}
      <div className="teksie-figure-wrapper" onClick={handleMascotClick} title="Klik Teksie untuk tips belajar!">
        <svg
          width="82"
          height="82"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="teksie-animated-svg"
        >
          {/* Ekor Musang Berbulu Lebat yang Mengibas-ngibas Ceria */}
          <g className="teksie-tail-anim">
            <path
              d="M32 94C16 88 4 102 8 114C12 124 30 120 38 108"
              fill="#ea580c"
            />
            <path
              d="M10 112C6 116 12 120 18 116C22 112 16 108 10 112Z"
              fill="#ffffff"
            />
          </g>

          {/* Kaki Belakang & Depan Bergerak Berlari */}
          <g className="teksie-paws-anim">
            <ellipse cx="44" cy="110" rx="9" ry="6" fill="#f97316" />
            <ellipse cx="76" cy="110" rx="9" ry="6" fill="#f97316" />
          </g>

          {/* Telinga Musang Cerdas Besar */}
          <polygon points="40,42 16,10 46,30" fill="#ea580c" />
          <polygon points="38,40 22,18 42,32" fill="#fed7aa" />
          <polygon points="80,42 104,10 74,30" fill="#ea580c" />
          <polygon points="82,40 98,18 78,32" fill="#fed7aa" />

          {/* Badan Bulat Hangat */}
          <ellipse cx="60" cy="90" rx="28" ry="22" fill="#f97316" />

          {/* Syal Hijau Khas PahamTeks */}
          <path
            d="M38 78C46 86 74 86 82 78L78 86C68 90 52 90 42 86Z"
            fill="#58cc02"
          />

          {/* Kepala Musang Menggemaskan */}
          <circle cx="60" cy="56" r="30" fill="#f97316" />

          {/* Pola Pipi Putih Halus Musang */}
          <path
            d="M34 60C34 74 44 80 60 80C76 80 86 74 86 60C86 52 80 50 72 52C64 54 62 56 60 56C58 56 56 54 48 52C40 50 34 52 34 60Z"
            fill="#ffffff"
          />

          {/* Kacamata Pintar Cyan PahamTeks */}
          <circle cx="48" cy="52" r="10" stroke="#1cb0f6" strokeWidth="2.8" fill="rgba(28, 176, 246, 0.15)" />
          <circle cx="72" cy="52" r="10" stroke="#1cb0f6" strokeWidth="2.8" fill="rgba(28, 176, 246, 0.15)" />
          <line x1="58" y1="52" x2="62" y2="52" stroke="#1cb0f6" strokeWidth="2.8" strokeLinecap="round" />

          {/* Mata Hitam Berbinar */}
          <circle cx="49" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="71" cy="52" r="4.5" fill="#0f172a" />
          <circle cx="47.5" cy="50.5" r="1.8" fill="#ffffff" />
          <circle cx="69.5" cy="50.5" r="1.8" fill="#ffffff" />

          {/* Hidung Hitam & Senyum Manis */}
          <polygon points="58,63 62,63 60,66" fill="#0f172a" />
          <path d="M56 67C58 70 62 70 64 67" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

          {/* Tangan Melambai Menyapa */}
          <g className="teksie-waving-paw">
            <ellipse cx="88" cy="74" rx="7" ry="9" fill="#fed7aa" transform="rotate(25 88 74)" />
          </g>
        </svg>

        {/* Tombol Minimize Kecil */}
        <button
          type="button"
          className="mascot-minimize-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          title="Sembunyikan Teksie"
        >
          _
        </button>
      </div>
    </div>
  );
}
