import React, { useState, useEffect, useRef } from 'react';

/**
 * =================================================================
 * TEKSIE MASCOT COMPANION (VIRTUAL PET MUSANG CERDAS PAHAMTEKS)
 * =================================================================
 * Perilaku Baru:
 * 1. Teksie tetap diam di tempat (posisi tetap di pojok kiri bawah,
 *    sama sekali tidak menutupi tombol Kamus Pintar di kanan bawah).
 * 2. Tidak lagi berjalan ke sana ke mari atau mengejar mouse.
 * 3. Deteksi Idle: Jika pengguna diam selama beberapa detik (5 detik
 *    tanpa gerakan mouse/ketukan/klik), Teksie otomatis tertidur pulas
 *    lengkap dengan animasi nafas tidur dan huruf Zzz melayang.
 * 4. Bangun Otomatis: Begitu pengguna menggerakkan mouse, mengetik,
 *    atau menyentuh layar, Teksie langsung terbangun ceria dan menyapa!
 * 5. Interaksi Klik: Memberikan tips belajar dan motivasi cerdas.
 * =================================================================
 */

// POSE 1: Maskot Teksie Menggemaskan Bergaya Duolingo (Adorable Duolingo-Style Upright Mascot)
export function TeksieSittingPortrait({ isHovered, size = 96 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-animated-svg"
      style={{ filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.38))' }}
    >
      <defs>
        {/* Bulu Oranye Hangat Semi-3D Bergaya Duolingo */}
        <radialGradient id="tsFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb056" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <radialGradient id="tsFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffc078" />
          <stop offset="55%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <linearGradient id="tsBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tsPaws" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="65%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <linearGradient id="tsGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="tsScarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tsTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Bayangan Kontak Tanah Halus 3D */}
      <ellipse cx="65" cy="120" rx="38" ry="6" fill="rgba(15, 23, 42, 0.25)" />

      {/* Ekor Fluffy Mengibas di Belakang */}
      <g className="teksie-tail-anim">
        <path
          d="M82 88C105 84 122 96 116 110C110 120 94 116 80 106"
          fill="url(#tsFurBody)"
        />
        <path
          d="M106 102C116 105 114 114 107 115C100 116 97 110 102 104Z"
          fill="url(#tsTailTip)"
        />
        <path d="M104 100C108 98 112 100 114 104" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Dua Kaki Montok Lucu Bergaya Duolingo (Cute Stubby Feet) */}
      <g>
        {/* Kaki Kiri */}
        <ellipse cx="48" cy="116" rx="13" ry="7.5" fill="url(#tsPaws)" />
        <ellipse cx="48" cy="114.5" rx="9" ry="4.5" fill="#ffedd5" />

        {/* Kaki Kanan */}
        <ellipse cx="82" cy="116" rx="13" ry="7.5" fill="url(#tsPaws)" />
        <ellipse cx="82" cy="114.5" rx="9" ry="4.5" fill="#ffedd5" />
      </g>

      {/* Badan Bulat Montok Bergaya Duolingo (Chubby Mascot Torso) */}
      <ellipse cx="65" cy="92" rx="30" ry="24" fill="url(#tsFurBody)" />
      {/* Kilau Halus 3D */}
      <path d="M48 76C56 71 74 71 82 76" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />
      {/* Perut Krem Bulat Menggemaskan */}
      <ellipse cx="65" cy="94" rx="19" ry="16" fill="url(#tsBelly)" />

      {/* Tangan Kiri: Menempel Imut di Perut */}
      <g>
        <ellipse cx="39" cy="92" rx="7.5" ry="10" fill="url(#tsFurBody)" transform="rotate(-15 39 92)" />
        <ellipse cx="38" cy="98" rx="6" ry="5" fill="#ffedd5" />
      </g>

      {/* Tangan Kanan: Melambai Ceria Bergaya Duolingo */}
      <g className="teksie-waving-paw">
        <ellipse cx="91" cy="88" rx="7.5" ry="10" fill="url(#tsFurBody)" transform="rotate(25 91 88)" />
        <ellipse cx="93" cy="83" rx="6" ry="5.5" fill="#ffedd5" />
      </g>

      {/* Kalung Hijau Zamrud PahamTeks dengan Medali Emas */}
      <g>
        <path
          d="M44 67C52 74 78 74 86 67L84 75C76 80 54 80 46 75Z"
          fill="url(#tsScarf)"
        />
        <circle cx="65" cy="75" r="4.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="64" cy="74" r="1.2" fill="#ffffff" />
      </g>

      {/* Telinga Bulat Menggemaskan Bergaya Duolingo (Cute Rounded Ears) */}
      <g>
        {/* Telinga Kiri */}
        <circle cx="38" cy="30" r="13" fill="url(#tsFurBody)" />
        <circle cx="39" cy="30" r="8" fill="#f472b6" opacity="0.8" />
        <circle cx="40" cy="30" r="5" fill="#fbcfe8" opacity="0.6" />

        {/* Telinga Kanan */}
        <circle cx="92" cy="30" r="13" fill="url(#tsFurBody)" />
        <circle cx="91" cy="30" r="8" fill="#f472b6" opacity="0.8" />
        <circle cx="90" cy="30" r="5" fill="#fbcfe8" opacity="0.6" />
      </g>

      {/* Kepala Bulat Besar Menggemaskan 3D Duolingo Style */}
      <circle cx="65" cy="48" r="31" fill="url(#tsFurHead)" />
      <path
        d="M48 24C58 20 72 20 82 24"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Pipi Putih Halus Mengembang Gembul */}
      <path
        d="M36 52C36 68 48 74 65 74C82 74 94 68 94 52C94 45 86 42 78 44C72 46 68 48 65 48C62 48 58 46 52 44C44 42 36 45 36 52Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Manis (Rosy Blushing Cheeks) */}
      <ellipse cx="44" cy="60" rx="6.5" ry="4" fill="#fb7185" opacity="0.6" />
      <ellipse cx="86" cy="60" rx="6.5" ry="4" fill="#fb7185" opacity="0.6" />

      {/* Kacamata Pintar Cyan 3D */}
      <g>
        <circle cx="51" cy="48" r="13" stroke="url(#tsGlasses)" strokeWidth="3.5" fill="rgba(56, 189, 248, 0.14)" />
        <circle cx="79" cy="48" r="13" stroke="url(#tsGlasses)" strokeWidth="3.5" fill="rgba(56, 189, 248, 0.14)" />
        <path d="M64 48H66" stroke="url(#tsGlasses)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M45 40C48 37 55 37 58 41" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
        <path d="M73 40C76 37 83 37 86 41" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Mata Besar Berbinar Menggemaskan (Classic Duolingo Big Sparkle Eyes) */}
      <g>
        <ellipse cx="51" cy="48" rx="6.5" ry="7" fill="#0f172a" />
        <ellipse cx="79" cy="48" rx="6.5" ry="7" fill="#0f172a" />
        <circle cx="49" cy="45.5" r="2.8" fill="#ffffff" />
        <circle cx="77" cy="45.5" r="2.8" fill="#ffffff" />
        <circle cx="53.5" cy="51.5" r="1.3" fill="#ffffff" />
        <circle cx="81.5" cy="51.5" r="1.3" fill="#ffffff" />
      </g>

      {/* Hidung Hitam Bulat Imut */}
      <ellipse cx="65" cy="57" rx="3.2" ry="2.2" fill="#0f172a" />
      <circle cx="64" cy="56.3" r="0.8" fill="#ffffff" />

      {/* Senyum Terbuka Lebar Ceria dengan Lidah Pink (Classic Duolingo Happy Mouth) */}
      <path
        d="M59 62C61 68 69 68 71 62Z"
        fill="#881337"
      />
      <path
        d="M61 64C62 67 68 67 69 64Z"
        fill="#fb7185"
      />
    </svg>
  );
}

// POSE 2: Teksie Tertidur Pulas Menggemaskan Bergaya Duolingo (Cute Sleeping Mascot)
function TeksieSleepingPose() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-sleeping-svg"
      style={{ filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.35))' }}
    >
      <defs>
        <radialGradient id="tsleepFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb056" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
        <radialGradient id="tsleepFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffc078" />
          <stop offset="55%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <linearGradient id="tsleepBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tsleepPaws" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="65%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <linearGradient id="tsleepGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="tsleepScarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tsleepTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Bayangan Kontak Tanah Halus 3D */}
      <ellipse cx="65" cy="120" rx="38" ry="6" fill="rgba(15, 23, 42, 0.25)" />

      {/* Ekor Melingkar Hangat di Samping Tubuh */}
      <g className="teksie-sleep-tail">
        <path
          d="M80 92C102 88 120 98 114 112C108 122 92 118 78 108"
          fill="url(#tsleepFurBody)"
        />
        <path
          d="M104 104C114 107 112 115 106 116C99 117 96 111 101 105Z"
          fill="url(#tsleepTailTip)"
        />
        <path d="M102 102C106 100 110 102 112 106" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Dua Kaki Montok Lucu Terlipat Rapi */}
      <g>
        <ellipse cx="48" cy="116" rx="13" ry="7.5" fill="url(#tsleepPaws)" />
        <ellipse cx="48" cy="114.5" rx="9" ry="4.5" fill="#ffedd5" />
        <ellipse cx="82" cy="116" rx="13" ry="7.5" fill="url(#tsleepPaws)" />
        <ellipse cx="82" cy="114.5" rx="9" ry="4.5" fill="#ffedd5" />
      </g>

      {/* Badan Bulat Montok Tertidur Nyenyak */}
      <ellipse cx="65" cy="92" rx="30" ry="24" fill="url(#tsleepFurBody)" />
      <path d="M48 76C56 71 74 71 82 76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <ellipse cx="65" cy="94" rx="19" ry="16" fill="url(#tsleepBelly)" />

      {/* Dua Tangan Imut Menangkup Lembut di Perut */}
      <g>
        <ellipse cx="54" cy="97" rx="7" ry="5.5" fill="url(#tsleepFurBody)" />
        <ellipse cx="54" cy="96" rx="5" ry="3.5" fill="#ffedd5" />
        <ellipse cx="76" cy="97" rx="7" ry="5.5" fill="url(#tsleepFurBody)" />
        <ellipse cx="76" cy="96" rx="5" ry="3.5" fill="#ffedd5" />
      </g>

      {/* Kalung Hijau Hangat */}
      <g>
        <path
          d="M44 68C52 75 78 75 86 68L84 76C76 81 54 81 46 76Z"
          fill="url(#tsleepScarf)"
        />
        <circle cx="65" cy="76" r="3.8" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      </g>

      {/* Telinga Bulat Lemas / Santai saat Tidur */}
      <g>
        <circle cx="38" cy="33" r="13" fill="url(#tsleepFurBody)" />
        <circle cx="39" cy="33" r="8" fill="#f472b6" opacity="0.8" />
        <circle cx="92" cy="33" r="13" fill="url(#tsleepFurBody)" />
        <circle cx="91" cy="33" r="8" fill="#f472b6" opacity="0.8" />
      </g>

      {/* Kepala Bulat Agak Menunduk Damai */}
      <circle cx="65" cy="50" r="31" fill="url(#tsleepFurHead)" />
      <path
        d="M48 26C58 22 72 22 82 26"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Pipi Putih Halus */}
      <path
        d="M36 54C36 70 48 76 65 76C82 76 94 70 94 54C94 47 86 44 78 46C72 48 68 50 65 50C62 50 58 48 52 46C44 44 36 47 36 54Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Nyenyak */}
      <ellipse cx="44" cy="62" rx="6.5" ry="4" fill="#fb7185" opacity="0.5" />
      <ellipse cx="86" cy="62" rx="6.5" ry="4" fill="#fb7185" opacity="0.5" />

      {/* Kacamata Pintar Mengendur Santai saat Tidur */}
      <g>
        <circle cx="51" cy="50" r="13" stroke="url(#tsleepGlasses)" strokeWidth="3.2" fill="rgba(56, 189, 248, 0.12)" />
        <circle cx="79" cy="50" r="13" stroke="url(#tsleepGlasses)" strokeWidth="3.2" fill="rgba(56, 189, 248, 0.12)" />
        <path d="M64 50H66" stroke="url(#tsleepGlasses)" strokeWidth="3.2" strokeLinecap="round" />
      </g>

      {/* Mata Terpejam Rileks & Senang (Happy Curved Sleeping Arches ala Duolingo) */}
      <path d="M44 51C47 45 55 45 58 51" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M72 51C75 45 83 45 86 51" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />

      {/* Hidung Hitam Imut */}
      <ellipse cx="65" cy="59" rx="3" ry="2" fill="#0f172a" />

      {/* Senyum Kecil Nyaman Tertidur */}
      <path d="M62 64C64 67 66 67 68 64" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function TeksieMascotCompanion({ activeTab, currentLang }) {
  const [isSleeping, setIsSleeping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speech, setSpeech] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const idleTimerRef = useRef(null);
  const isSleepingRef = useRef(false);
  isSleepingRef.current = isSleeping;

  // 1. Pesan kontekstual saat pengguna berpindah halaman
  useEffect(() => {
    let msg = '';
    if (activeTab === 'home') {
      msg = currentLang === 'en'
        ? 'Welcome back! Ready for a quiz? ✨'
        : 'Halo! Siap asah otak hari ini? ✨';
    } else if (activeTab === 'learning') {
      msg = currentLang === 'en'
        ? 'Choose: World Languages or Coding Logic!'
        : 'Pilih modul favoritmu: Bahasa Dunia atau Koding!';
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
      setSpeech('');
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeTab, currentLang]);

  // 2. Deteksi Aktivitas Pengguna: Jika diam 5 detik -> Teksie Tertidur!
  useEffect(() => {
    const IDLE_TIME_MS = 5000; // 5 detik tanpa aktivitas pengguna

    const handleUserActivity = () => {
      // Jika Teksie sedang tertidur dan pengguna beraktivitas kembali:
      if (isSleepingRef.current) {
        setIsSleeping(false);
        const wakeMsg = currentLang === 'en'
          ? 'Yawn... ready to study again! ✨'
          : 'Hoam... lanjut belajar lagi yuk! ✨';
        setSpeech(wakeMsg);
        setTimeout(() => setSpeech(''), 3000);
      }

      // Reset timer idle
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        if (!isMinimized) {
          setIsSleeping(true);
          setSpeech('');
        }
      }, IDLE_TIME_MS);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Pasang timer idle awal
    idleTimerRef.current = setTimeout(() => {
      if (!isMinimized) {
        setIsSleeping(true);
      }
    }, IDLE_TIME_MS);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentLang, isMinimized]);

  // 3. Klik Teksie untuk tips belajar
  const handleMascotClick = (e) => {
    e.stopPropagation();

    // Jika sedang tidur, bangunkan terlebih dahulu
    if (isSleeping) {
      setIsSleeping(false);
    }

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
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        className="mascot-companion-minimized"
        onClick={() => setIsMinimized(false)}
        title="Panggil Teksie si Musang Cerdas"
        style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 990 }}
      >
        <span className="minimized-avatar">🦡</span>
        <span className="minimized-label">Panggil Teksie</span>
      </button>
    );
  }

  return (
    <div
      className="teksie-interactive-world"
      style={{
        position: 'fixed',
        left: '28px',
        bottom: '24px',
        zIndex: 980,
        pointerEvents: 'none'
      }}
    >
      <div
        className={`teksie-companion-box ${isSleeping ? 'is-sleeping' : 'is-awake'} ${isHovered ? 'is-hovered' : ''}`}
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (isSleeping) {
            setIsSleeping(false);
            setSpeech(currentLang === 'en' ? 'Hmm? Did you call me? 🐾' : 'Hmm? Kamu manggil aku ya? 🐾');
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        {/* Balon Kata Interaktif Teksie */}
        {speech && (
          <div
            className="teksie-speech-bubble"
            onClick={handleMascotClick}
            style={{
              position: 'absolute',
              bottom: '96px',
              left: '0',
              whiteSpace: 'normal',
              pointerEvents: 'auto'
            }}
          >
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

        {/* Huruf Zzz Melayang Saat Tertidur */}
        {isSleeping && (
          <div className="teksie-sleep-zzz-container" title="Teksie sedang tidur pulas (Zzz...)">
            <span className="teksie-zzz z1">Z</span>
            <span className="teksie-zzz z2">z</span>
            <span className="teksie-zzz z3">z</span>
          </div>
        )}

        {/* Karakter Teksie: Diam di Tempat, Berpose Duduk saat Terjaga & Tidur saat Idle */}
        <div
          className="teksie-figure-wrapper"
          onClick={handleMascotClick}
          title={
            isSleeping
              ? (currentLang === 'en' ? 'Teksie is sleeping... (Move mouse or click to wake him!)' : 'Teksie sedang tidur pulas... (Gerakkan mouse atau klik untuk membangunkannya!)')
              : (currentLang === 'en' ? 'Teksie the Smart Civet (Click for tips)' : 'Teksie si Musang Cerdas (Klik untuk tips belajar)')
          }
        >
          {isSleeping ? (
            <TeksieSleepingPose />
          ) : (
            <TeksieSittingPortrait isHovered={isHovered} />
          )}

          {/* Tombol Minimize Kecil */}
          <button
            type="button"
            className="mascot-minimize-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            title="Sembunyikan Teksie ke pojok"
          >
            _
          </button>
        </div>
      </div>
    </div>
  );
}
