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

// POSE 1: Tampak Depan Duduk Tegak Ceria (Semi-3D Duolingo Sitting Pose)
function TeksieSittingPortrait({ isHovered }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-animated-svg"
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.38))' }}
    >
      <defs>
        <radialGradient id="tsFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tsFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="tsBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tsPaws" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffab54" />
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
          <stop offset="60%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tsTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Bayangan Lantai Halus 3D */}
      <ellipse cx="65" cy="122" rx="42" ry="7" fill="rgba(15, 23, 42, 0.3)" />

      {/* Ekor Mengibas di Belakang */}
      <g className="teksie-tail-anim">
        <path
          d="M34 100C14 94 4 108 8 120C12 130 32 126 40 114"
          fill="url(#tsFurBody)"
        />
        <path
          d="M10 118C7 122 13 126 19 122C24 118 18 114 10 118Z"
          fill="url(#tsTailTip)"
        />
        <path d="M12 116C15 112 20 112 23 115" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Kaki Belakang Duduk Manis di Lantai */}
      <g>
        <ellipse cx="44" cy="116" rx="14" ry="9" fill="url(#tsPaws)" />
        <ellipse cx="44" cy="115" rx="9" ry="5.5" fill="#ffedd5" />
        <circle cx="37" cy="116" r="2.2" fill="#ea580c" />
        <circle cx="44" cy="117" r="2.2" fill="#ea580c" />
        <circle cx="51" cy="116" r="2.2" fill="#ea580c" />

        <ellipse cx="86" cy="116" rx="14" ry="9" fill="url(#tsPaws)" />
        <ellipse cx="86" cy="115" rx="9" ry="5.5" fill="#ffedd5" />
        <circle cx="79" cy="116" r="2.2" fill="#ea580c" />
        <circle cx="86" cy="117" r="2.2" fill="#ea580c" />
        <circle cx="93" cy="116" r="2.2" fill="#ea580c" />
      </g>

      {/* Badan Duduk Hangat Gembul */}
      <ellipse cx="65" cy="94" rx="34" ry="26" fill="url(#tsFurBody)" />
      <path d="M46 80C56 75 74 75 84 80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <ellipse cx="65" cy="98" rx="22" ry="18" fill="url(#tsBelly)" />

      {/* Syal Hijau Zamrud PahamTeks */}
      <g>
        <path
          d="M38 74C48 84 82 84 92 74C98 83 90 92 65 92C40 92 32 83 38 74Z"
          fill="url(#tsScarf)"
        />
        <ellipse cx="65" cy="85" rx="7" ry="5" fill="#15803d" />
        <ellipse cx="65" cy="84" rx="5" ry="3.5" fill="#4ade80" />
      </g>

      {/* Telinga Musang Cerdas Besar 3D */}
      <g>
        <path d="M44 42L16 6C10 26 22 56 46 64Z" fill="url(#tsFurBody)" />
        <path d="M42 40L22 14C18 28 26 50 42 56Z" fill="#f472b6" opacity="0.8" />
        <path d="M86 42L114 6C120 26 108 56 84 64Z" fill="url(#tsFurBody)" />
        <path d="M88 40L108 14C112 28 104 50 88 56Z" fill="#f472b6" opacity="0.8" />
      </g>

      {/* Kepala Bulat Menggemaskan 3D */}
      <circle cx="65" cy="54" r="34" fill="url(#tsFurHead)" />
      <path
        d="M48 30C58 24 72 24 82 30C74 26 56 26 48 30Z"
        fill="#ffffff"
        opacity="0.45"
      />

      {/* Pipi Putih Halus & Mengembang */}
      <path
        d="M32 58C32 76 46 84 65 84C84 84 98 76 98 58C98 50 90 46 80 49C72 52 68 55 65 55C62 55 58 52 50 49C40 46 32 50 32 58Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Lucu */}
      <ellipse cx="40" cy="67" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />
      <ellipse cx="90" cy="67" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />

      {/* Kacamata Cerdas Cyan 3D */}
      <g>
        <circle cx="49" cy="52" r="14" stroke="url(#tsGlasses)" strokeWidth="3.8" fill="rgba(56, 189, 248, 0.16)" />
        <circle cx="81" cy="52" r="14" stroke="url(#tsGlasses)" strokeWidth="3.8" fill="rgba(56, 189, 248, 0.16)" />
        <path d="M63 52H67" stroke="url(#tsGlasses)" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M43 43C47 40 54 40 57 44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M75 43C79 40 86 40 89 44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Mata Hitam Besar Berbinar Cerdas (Duolingo Style Eyes) */}
      <g>
        <ellipse cx="49" cy="52" rx="6.5" ry="7" fill="#0f172a" />
        <ellipse cx="81" cy="52" rx="6.5" ry="7" fill="#0f172a" />
        <circle cx="47" cy="49" r="2.8" fill="#ffffff" />
        <circle cx="79" cy="49" r="2.8" fill="#ffffff" />
        <circle cx="51.5" cy="55.5" r="1.4" fill="#ffffff" />
        <circle cx="83.5" cy="55.5" r="1.4" fill="#ffffff" />
      </g>

      {/* Hidung Hitam Imut 3D */}
      <polygon points="62,64 68,64 65,68" fill="#0f172a" />
      <circle cx="64" cy="64.5" r="0.8" fill="#ffffff" />

      {/* Senyum Terbuka Ceria dengan Lidah Pink */}
      <path
        d="M59 69C61 74 69 74 71 69Z"
        fill="#881337"
      />
      <path
        d="M61 71C63 73 67 73 69 71C68 73 62 73 61 71Z"
        fill="#fb7185"
      />

      {/* Tangan Kiri Duduk di Perut */}
      <g>
        <ellipse cx="50" cy="94" rx="8" ry="6" fill="url(#tsPaws)" />
        <ellipse cx="50" cy="94" rx="5" ry="3.5" fill="#ffedd5" />
      </g>

      {/* Tangan Kanan: Melambai Menyapa Ramah */}
      <g className="teksie-waving-paw">
        <ellipse cx="86" cy="88" rx="8.5" ry="11" fill="url(#tsPaws)" transform="rotate(25 86 88)" />
        <ellipse cx="86" cy="88" rx="5.5" ry="7" fill="#ffedd5" transform="rotate(25 86 88)" />
        <circle cx="89" cy="81" r="2.2" fill="#ea580c" />
        <circle cx="93" cy="86" r="2.2" fill="#ea580c" />
        <circle cx="85" cy="80" r="2" fill="#ea580c" />
      </g>
    </svg>
  );
}

// POSE 2: Tampak Depan Tertidur Pulas (Semi-3D Duolingo Sleeping Pose)
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
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tsleepFurHead" cx="40%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="tsleepBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tsleepPaws" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffab54" />
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
          <stop offset="60%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tsleepTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
      </defs>

      {/* Bayangan Lantai Halus 3D */}
      <ellipse cx="65" cy="122" rx="44" ry="6.5" fill="rgba(15, 23, 42, 0.28)" />

      {/* Ekor Melingkar Nyaman di Samping Tubuh */}
      <g className="teksie-sleep-tail">
        <path
          d="M34 102C14 96 4 110 8 120C14 128 34 124 42 112"
          fill="url(#tsleepFurBody)"
        />
        <path
          d="M10 118C8 122 14 126 20 122C25 118 18 114 10 118Z"
          fill="url(#tsleepTailTip)"
        />
        <path d="M12 116C15 112 20 112 23 115" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Kaki Belakang Melipat Santai di Lantai */}
      <g>
        <ellipse cx="44" cy="116" rx="14" ry="8" fill="url(#tsleepPaws)" />
        <ellipse cx="44" cy="115" rx="8" ry="4.5" fill="#ffedd5" />
        <ellipse cx="86" cy="116" rx="14" ry="8" fill="url(#tsleepPaws)" />
        <ellipse cx="86" cy="115" rx="8" ry="4.5" fill="#ffedd5" />
      </g>

      {/* Badan Gembul Tidur Tertidur Nyenyak */}
      <ellipse cx="65" cy="96" rx="34" ry="24" fill="url(#tsleepFurBody)" />
      <path d="M46 84C56 79 74 79 84 84" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <ellipse cx="65" cy="100" rx="22" ry="16" fill="url(#tsleepBelly)" />

      {/* Syal Hangat seperti Selimut */}
      <g>
        <path
          d="M38 78C48 86 82 86 92 78C98 86 90 94 65 94C40 94 32 86 38 78Z"
          fill="url(#tsleepScarf)"
        />
        <ellipse cx="65" cy="87" rx="6" ry="4" fill="#15803d" />
        <ellipse cx="65" cy="86" rx="4" ry="3" fill="#4ade80" />
      </g>

      {/* Telinga Musang Lemas/Rileks (Relaxed Droop) */}
      <g>
        <path d="M44 48L18 16C12 32 24 60 46 68Z" fill="url(#tsleepFurBody)" />
        <path d="M42 46L24 22C20 34 28 54 42 60Z" fill="#f472b6" opacity="0.75" />
        <path d="M86 48L112 16C118 32 106 60 84 68Z" fill="url(#tsleepFurBody)" />
        <path d="M88 46L106 22C110 34 102 54 88 60Z" fill="#f472b6" opacity="0.75" />
      </g>

      {/* Kepala Bulat Sedikit Miring Manis Pulas (Sleeping Head) */}
      <circle cx="65" cy="60" r="33" fill="url(#tsleepFurHead)" />
      <path
        d="M48 37C58 31 72 31 82 37C74 33 56 33 48 37Z"
        fill="#ffffff"
        opacity="0.4"
      />

      {/* Pipi Putih Halus Gembul */}
      <path
        d="M33 64C33 81 46 88 65 88C84 88 97 81 97 64C97 56 89 52 80 55C72 58 68 61 65 61C62 61 58 58 50 55C41 52 33 56 33 64Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Lelap */}
      <ellipse cx="40" cy="73" rx="8" ry="4.5" fill="#fb7185" opacity="0.7" />
      <ellipse cx="90" cy="73" rx="8" ry="4.5" fill="#fb7185" opacity="0.7" />

      {/* Kacamata Cyan Melorot Sedikit Manis di Hidung */}
      <g transform="translate(0, 4)">
        <circle cx="49" cy="56" r="13" stroke="url(#tsleepGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.14)" />
        <circle cx="81" cy="56" r="13" stroke="url(#tsleepGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.14)" />
        <path d="M62 56H68" stroke="url(#tsleepGlasses)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M43 47C47 44 54 44 57 48" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        <path d="M75 47C79 44 86 44 89 48" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* MATA TERTIDUR PULAS & DAMAI (Sweet Sleeping Curved Lines with Lashes) */}
      <g transform="translate(0, 4)">
        {/* Mata Kiri Lengkung Damai */}
        <path
          d="M42 56C45 61 53 61 56 56"
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M44 59L42 61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M54 59L56 61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

        {/* Mata Kanan Lengkung Damai */}
        <path
          d="M74 56C77 61 85 61 88 56"
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M76 59L74 61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 59L88 61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Hidung Hitam Imut */}
      <polygon points="62,71 68,71 65,75" fill="#0f172a" />
      <circle cx="64" cy="71.5" r="0.8" fill="#ffffff" />

      {/* Senyum Tidur Damai (Sweet Peaceful Sleep Smile) */}
      <path
        d="M60 78C63 81 67 81 70 78"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Kedua Cakar Depan Menempel Manis Menopang Dagu/Dada */}
      <g>
        <ellipse cx="56" cy="94" rx="8" ry="6.5" fill="url(#tsleepPaws)" transform="rotate(-15 56 94)" />
        <ellipse cx="56" cy="94" rx="5" ry="4" fill="#ffedd5" transform="rotate(-15 56 94)" />
        <ellipse cx="74" cy="94" rx="8" ry="6.5" fill="url(#tsleepPaws)" transform="rotate(15 74 94)" />
        <ellipse cx="74" cy="94" rx="5" ry="4" fill="#ffedd5" transform="rotate(15 74 94)" />
      </g>
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
