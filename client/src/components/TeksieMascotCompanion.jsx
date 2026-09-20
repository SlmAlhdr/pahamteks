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

// POSE 1: Duduk Alami Musang Berkaki 4 (Natural 4-Paw Seated Civet Mascot)
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
        <radialGradient id="tsFurBody" cx="45%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffb056" />
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

      {/* Bayangan Kontak Tanah 3D */}
      <ellipse cx="65" cy="120" rx="46" ry="6.5" fill="rgba(15, 23, 42, 0.3)" />

      {/* Ekor Musang Tebal Melengkung ke Kanan dengan Ujung Putih */}
      <g className="teksie-tail-anim">
        <path
          d="M76 96C98 90 118 98 114 110C110 120 92 118 80 110"
          fill="url(#tsFurBody)"
        />
        <path
          d="M106 104C116 106 114 114 108 116C102 118 98 112 102 106Z"
          fill="url(#tsTailTip)"
        />
        <path d="M104 102C108 100 112 102 114 106" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Kaki Belakang Melipat di Samping Tubuh (Hind Legs Folded at Sides) */}
      <g>
        {/* Paha & Kaki Belakang Kiri */}
        <ellipse cx="36" cy="102" rx="14" ry="11" fill="url(#tsFurBody)" />
        <ellipse cx="32" cy="114" rx="8" ry="4.5" fill="url(#tsPaws)" />
        <ellipse cx="32" cy="113" rx="5" ry="2.5" fill="#ffedd5" />

        {/* Paha & Kaki Belakang Kanan */}
        <ellipse cx="94" cy="102" rx="14" ry="11" fill="url(#tsFurBody)" />
        <ellipse cx="98" cy="114" rx="8" ry="4.5" fill="url(#tsPaws)" />
        <ellipse cx="98" cy="113" rx="5" ry="2.5" fill="#ffedd5" />
      </g>

      {/* Badan Musang Gembul Alami (Natural Chubby Civet Torso) */}
      <ellipse cx="65" cy="94" rx="30" ry="22" fill="url(#tsFurBody)" />
      <path d="M48 80C56 75 74 75 82 80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <ellipse cx="65" cy="96" rx="18" ry="15" fill="url(#tsBelly)" />

      {/* Dua Kaki Depan Bertumpu Rapi di Tanah (Front Paws Planted Naturally on Ground) */}
      <g>
        {/* Kaki Depan Kiri */}
        <path
          d="M52 82C50 92 48 106 50 113C51 116 57 116 58 113C60 106 62 92 60 82Z"
          fill="url(#tsFurBody)"
        />
        <ellipse cx="54" cy="113" rx="7" ry="4.5" fill="url(#tsPaws)" />
        <ellipse cx="54" cy="112" rx="4.5" ry="2.5" fill="#ffedd5" />
        <circle cx="50" cy="113" r="1.3" fill="#ea580c" />
        <circle cx="54" cy="114" r="1.3" fill="#ea580c" />
        <circle cx="58" cy="113" r="1.3" fill="#ea580c" />

        {/* Kaki Depan Kanan */}
        <path
          d="M78 82C76 92 78 106 80 113C81 116 87 116 88 113C90 106 88 92 86 82Z"
          fill="url(#tsFurBody)"
        />
        <ellipse cx="84" cy="113" rx="7" ry="4.5" fill="url(#tsPaws)" />
        <ellipse cx="84" cy="112" rx="4.5" ry="2.5" fill="#ffedd5" />
        <circle cx="80" cy="113" r="1.3" fill="#ea580c" />
        <circle cx="84" cy="114" r="1.3" fill="#ea580c" />
        <circle cx="88" cy="113" r="1.3" fill="#ea580c" />
      </g>

      {/* Kalung Hijau Zamrud PahamTeks dengan Medali Emas */}
      <g>
        <path
          d="M44 68C52 75 78 75 86 68L84 76C76 81 54 81 46 76Z"
          fill="url(#tsScarf)"
        />
        <circle cx="65" cy="76" r="4.2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="64" cy="75" r="1.2" fill="#ffffff" />
      </g>

      {/* Telinga Musang Cerdas (Rounded Triangular Civet Ears - Khas Luwak) */}
      <g>
        {/* Telinga Kiri */}
        <path d="M46 30L30 10C24 22 32 38 48 42Z" fill="url(#tsFurBody)" />
        <path d="M44 28L34 14C30 22 36 34 46 38Z" fill="#fed7aa" />
        <path d="M43 28L36 18C34 22 38 30 44 34Z" fill="#f472b6" opacity="0.75" />

        {/* Telinga Kanan */}
        <path d="M84 30L100 10C106 22 98 38 82 42Z" fill="url(#tsFurBody)" />
        <path d="M86 28L96 14C100 22 94 34 84 38Z" fill="#fed7aa" />
        <path d="M87 28L94 18C96 22 92 30 86 34Z" fill="#f472b6" opacity="0.75" />
      </g>

      {/* Kepala Bulat Musang Cerdas 3D */}
      <circle cx="65" cy="46" r="30" fill="url(#tsFurHead)" />
      <path
        d="M50 24C58 20 72 20 80 24"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Pipi Putih Halus Mengembang Khas Musang */}
      <path
        d="M36 50C36 66 48 72 65 72C82 72 94 66 94 50C94 43 86 40 78 42C72 44 68 46 65 46C62 46 58 44 52 42C44 40 36 43 36 50Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Manis */}
      <ellipse cx="44" cy="58" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />
      <ellipse cx="86" cy="58" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />

      {/* Kacamata Pintar Cyan 3D */}
      <g>
        <circle cx="51" cy="46" r="13" stroke="url(#tsGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
        <circle cx="79" cy="46" r="13" stroke="url(#tsGlasses)" strokeWidth="3.4" fill="rgba(56, 189, 248, 0.16)" />
        <path d="M64 46H66" stroke="url(#tsGlasses)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M45 38C48 35 55 35 58 39" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
        <path d="M73 38C76 35 83 35 86 39" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Mata Hitam Besar Berbinar Cerdas (Duolingo Style Eyes) */}
      <g>
        <ellipse cx="51" cy="46" rx="6" ry="6.5" fill="#0f172a" />
        <ellipse cx="79" cy="46" rx="6" ry="6.5" fill="#0f172a" />
        <circle cx="49" cy="43.5" r="2.6" fill="#ffffff" />
        <circle cx="77" cy="43.5" r="2.6" fill="#ffffff" />
        <circle cx="53.5" cy="49" r="1.2" fill="#ffffff" />
        <circle cx="81.5" cy="49" r="1.2" fill="#ffffff" />
      </g>

      {/* Hidung Hitam Imut 3D */}
      <polygon points="62,56 68,56 65,60" fill="#0f172a" />
      <circle cx="64" cy="56.5" r="0.8" fill="#ffffff" />

      {/* Senyum Terbuka Ceria dengan Lidah Pink */}
      <path
        d="M60 62C62 67 68 67 70 62Z"
        fill="#881337"
      />
      <path
        d="M62 64C63 66 67 66 68 64Z"
        fill="#fb7185"
      />
    </svg>
  );
}

// POSE 2: Tampak Depan Tertidur Pulas Melingkar ala Musang (Cozy Civet Sleeping Loaf Pose)
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

      {/* Bayangan Kontak Tanah 3D */}
      <ellipse cx="65" cy="120" rx="46" ry="6.5" fill="rgba(15, 23, 42, 0.28)" />

      {/* Ekor Melingkar Hangat Menyelubungi Tubuh */}
      <g className="teksie-sleep-tail">
        <path
          d="M74 100C96 94 116 100 112 112C108 122 90 120 78 112"
          fill="url(#tsleepFurBody)"
        />
        <path
          d="M104 106C114 108 112 116 106 118C100 120 96 114 100 108Z"
          fill="url(#tsleepTailTip)"
        />
        <path d="M102 104C106 102 110 104 112 108" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Kaki Belakang & Depan Terlipat Rapi di Bawah Tubuh (Loaf Sleeping Pose) */}
      <g>
        <ellipse cx="36" cy="106" rx="13" ry="8" fill="url(#tsleepPaws)" />
        <ellipse cx="36" cy="105" rx="8" ry="4" fill="#ffedd5" />
        <ellipse cx="94" cy="106" rx="13" ry="8" fill="url(#tsleepPaws)" />
        <ellipse cx="94" cy="105" rx="8" ry="4" fill="#ffedd5" />
      </g>

      {/* Badan Musang Gembul Tertidur Pulas */}
      <ellipse cx="65" cy="94" rx="32" ry="22" fill="url(#tsleepFurBody)" />
      <path d="M48 82C56 77 74 77 82 82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <ellipse cx="65" cy="98" rx="20" ry="14" fill="url(#tsleepBelly)" />

      {/* Dua Cakar Depan Menelungkup Rapi Menopang Dagu */}
      <g>
        <ellipse cx="56" cy="110" rx="8" ry="5.5" fill="url(#tsleepPaws)" />
        <ellipse cx="56" cy="109" rx="5" ry="3" fill="#ffedd5" />
        <ellipse cx="74" cy="110" rx="8" ry="5.5" fill="url(#tsleepPaws)" />
        <ellipse cx="74" cy="109" rx="5" ry="3" fill="#ffedd5" />
      </g>

      {/* Kalung Hijau Hangat */}
      <g>
        <path
          d="M44 70C52 77 78 77 86 70L84 77C76 82 54 82 46 77Z"
          fill="url(#tsleepScarf)"
        />
        <circle cx="65" cy="77" r="3.8" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      </g>

      {/* Telinga Musang Lemas/Rileks (Relaxed Droop Civet Ears) */}
      <g>
        <path d="M46 34L32 14C26 26 34 40 48 44Z" fill="url(#tsleepFurBody)" />
        <path d="M44 32L36 18C32 26 38 36 46 40Z" fill="#f472b6" opacity="0.75" />
        <path d="M84 34L98 14C104 26 96 40 82 44Z" fill="url(#tsleepFurBody)" />
        <path d="M86 32L94 18C98 26 92 36 84 40Z" fill="#f472b6" opacity="0.75" />
      </g>

      {/* Kepala Bulat Miring Santai Pulas */}
      <circle cx="65" cy="52" r="30" fill="url(#tsleepFurHead)" />
      <path
        d="M50 30C58 26 72 26 80 30"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Pipi Putih Halus Gembul */}
      <path
        d="M36 56C36 71 48 77 65 77C82 77 94 71 94 56C94 49 86 46 78 48C72 50 68 52 65 52C62 52 58 50 52 48C44 46 36 49 36 56Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Lelap */}
      <ellipse cx="44" cy="63" rx="7.5" ry="4" fill="#fb7185" opacity="0.7" />
      <ellipse cx="86" cy="63" rx="7.5" ry="4" fill="#fb7185" opacity="0.7" />

      {/* Kacamata Cyan Melorot Sedikit di Hidung */}
      <g transform="translate(0, 4)">
        <circle cx="51" cy="50" r="12" stroke="url(#tsleepGlasses)" strokeWidth="3" fill="rgba(56, 189, 248, 0.14)" />
        <circle cx="79" cy="50" r="12" stroke="url(#tsleepGlasses)" strokeWidth="3" fill="rgba(56, 189, 248, 0.14)" />
        <path d="M63 50H67" stroke="url(#tsleepGlasses)" strokeWidth="3" strokeLinecap="round" />
        <path d="M45 42C48 39 55 39 58 43" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
        <path d="M73 42C76 39 83 39 86 43" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* MATA TERTIDUR PULAS & DAMAI (Sweet Sleeping Curved Lines) */}
      <g transform="translate(0, 4)">
        <path
          d="M44 50C47 55 55 55 58 50"
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M46 53L44 55" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M56 53L58 55" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

        <path
          d="M72 50C75 55 83 55 86 50"
          stroke="#0f172a"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path d="M74 53L72 55" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M84 53L86 55" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Hidung Hitam Imut */}
      <polygon points="62,64 68,64 65,68" fill="#0f172a" />
      <circle cx="64" cy="64.5" r="0.8" fill="#ffffff" />

      {/* Senyum Tidur Damai */}
      <path
        d="M60 70C63 73 67 73 70 70"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
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
