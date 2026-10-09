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

// POSE 1: Maskot Teksie Asli Sesuai Foto 2 (Cute Chubby Fennec/Civet Mascot)
export function TeksieSittingPortrait({ isHovered, isLifted = false, size = 96 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
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
        <radialGradient id="tsFurDark" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <linearGradient id="tsBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
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

      {/* Bayangan Lantai: Mengecil dan turun saat diangkat melayang */}
      <ellipse
        cx="80"
        cy={isLifted ? 158 : 154}
        rx={isLifted ? 20 : 46}
        ry={isLifted ? 3 : 6}
        fill={isLifted ? "rgba(15, 23, 42, 0.12)" : "rgba(15, 23, 42, 0.25)"}
      />

      {/* Telinga Kiri Besar Ikonik Semi-3D (Khas Foto 2) */}
      <path
        d="M52 50L18 6C12 28 20 62 44 76L52 50Z"
        fill="url(#tsFurDark)"
      />
      <path
        d="M48 48L24 14C20 30 26 56 42 68L48 48Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M28 28L36 38" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Telinga Kanan Besar Ikonik Semi-3D (Khas Foto 2) */}
      <path
        d="M108 50L142 6C148 28 140 62 116 76L108 50Z"
        fill="url(#tsFurDark)"
      />
      <path
        d="M112 48L136 14C140 30 134 56 118 68L112 48Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M132 28L124 38" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ekor Berbulu Lebat Semi-3D di Kanan */}
      <g className="teksie-tail-anim">
        <path
          d="M118 110C140 102 154 118 148 136C142 152 118 150 105 138"
          fill="url(#tsFurBody)"
        />
        <path
          d="M136 128C146 132 144 142 136 146C128 148 122 142 126 136Z"
          fill="url(#tsTailTip)"
        />
        <path d="M136 130C140 128 144 132 141 138" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Badan Gembul Halus (Sesuai Foto 2, Tidak Terlalu Berbentuk Kaku) */}
      <ellipse cx="80" cy="120" rx="36" ry="28" fill="url(#tsFurBody)" />
      <ellipse cx="80" cy="124" rx="22" ry="18" fill="url(#tsBelly)" />

      {/* Syal Cerdas Hijau PahamTeks dengan Permata 3D */}
      <g>
        <path
          d="M52 104C62 114 98 114 108 104C112 112 104 122 80 122C56 122 48 112 52 104Z"
          fill="url(#tsScarf)"
        />
        <ellipse cx="80" cy="114" rx="6" ry="4" fill="#15803d" />
        <ellipse cx="80" cy="113" rx="4" ry="2.5" fill="#4ade80" />
      </g>

      {/* Kepala Bulat Menggemaskan 3D */}
      <ellipse cx="80" cy="74" rx="42" ry="36" fill="url(#tsFurHead)" />
      <path
        d="M58 46C70 40 90 40 102 46C92 42 68 42 58 46Z"
        fill="#ffffff"
        opacity="0.4"
      />

      {/* Pipi Putih Halus Gembul */}
      <path
        d="M38 78C38 96 56 104 80 104C104 104 122 96 122 78C122 70 114 66 102 70C92 74 86 78 80 78C74 78 68 74 58 70C46 66 38 70 38 78Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Lucu (Blush) */}
      <ellipse cx="48" cy="84" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />
      <ellipse cx="112" cy="84" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.65" />

      {/* Hidung Hitam 3D */}
      <polygon points="76,82 84,82 80,87" fill="#0f172a" />
      <circle cx="79" cy="82.5" r="0.8" fill="#ffffff" />

      {/* Mulut: Imut Terbuka Bulat saat Diangkat (O) atau Senyum Ceria (^w^) */}
      {isLifted ? (
        <g>
          <ellipse cx="80" cy="89" rx="4.5" ry="5.5" fill="#881337" />
          <ellipse cx="80" cy="90.5" rx="3" ry="3" fill="#fb7185" />
        </g>
      ) : (
        <g>
          <path
            d="M75 88C77 93 83 93 85 88Z"
            fill="#881337"
          />
          <path
            d="M77 90C79 92 81 92 83 90C82 92 78 92 77 90Z"
            fill="#fb7185"
          />
        </g>
      )}

      {/* Kacamata Cerdas Cyan 3D Tebal */}
      <circle cx="62" cy="68" r="16" stroke="url(#tsGlasses)" strokeWidth="4" fill="rgba(56, 189, 248, 0.16)" />
      <circle cx="98" cy="68" r="16" stroke="url(#tsGlasses)" strokeWidth="4" fill="rgba(56, 189, 248, 0.16)" />
      <path d="M78 68H82" stroke="url(#tsGlasses)" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 58C58 55 66 55 70 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M90 58C94 55 102 55 106 60" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />

      {/* Mata Berkilau Cerdas Penuh Semangat (Membulat Lebar saat Diangkat) */}
      {isLifted ? (
        <g>
          <circle cx="62" cy="68" r="9.2" fill="#0f172a" />
          <circle cx="98" cy="68" r="9.2" fill="#0f172a" />
          <circle cx="59.8" cy="64.2" r="3.8" fill="#ffffff" />
          <circle cx="95.8" cy="64.2" r="3.8" fill="#ffffff" />
          <circle cx="65.5" cy="71.5" r="1.8" fill="#ffffff" />
          <circle cx="101.5" cy="71.5" r="1.8" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <circle cx="62" cy="68" r="8" fill="#0f172a" />
          <circle cx="98" cy="68" r="8" fill="#0f172a" />
          <circle cx="60" cy="65" r="3.2" fill="#ffffff" />
          <circle cx="96" cy="65" r="3.2" fill="#ffffff" />
          <circle cx="65" cy="71" r="1.6" fill="#ffffff" />
          <circle cx="101" cy="71" r="1.6" fill="#ffffff" />
        </g>
      )}

      {/* Kaki Depan Gembul Halus (Menggantung Lucu saat Diangkat dengan Bantalan Pink) */}
      {isLifted ? (
        <g className="teksie-lifted-feet">
          {/* Kaki Kiri Menggantung */}
          <ellipse cx="64" cy="147" rx="10.5" ry="12" fill="url(#tsFurBody)" />
          <ellipse cx="64" cy="148" rx="7.5" ry="8" fill="#ffedd5" />
          <circle cx="61.5" cy="145.5" r="1.8" fill="#f472b6" opacity="0.85" />
          <circle cx="66.5" cy="145.5" r="1.8" fill="#f472b6" opacity="0.85" />
          <ellipse cx="64" cy="150.5" rx="3.2" ry="2.2" fill="#f472b6" opacity="0.85" />

          {/* Kaki Kanan Menggantung */}
          <ellipse cx="96" cy="147" rx="10.5" ry="12" fill="url(#tsFurBody)" />
          <ellipse cx="96" cy="148" rx="7.5" ry="8" fill="#ffedd5" />
          <circle cx="93.5" cy="145.5" r="1.8" fill="#f472b6" opacity="0.85" />
          <circle cx="98.5" cy="145.5" r="1.8" fill="#f472b6" opacity="0.85" />
          <ellipse cx="96" cy="150.5" rx="3.2" ry="2.2" fill="#f472b6" opacity="0.85" />
        </g>
      ) : (
        <g>
          <ellipse cx="64" cy="144" rx="12" ry="8" fill="url(#tsFurBody)" />
          <ellipse cx="64" cy="143" rx="8" ry="5" fill="#ffedd5" />
          <ellipse cx="96" cy="144" rx="12" ry="8" fill="url(#tsFurBody)" />
          <ellipse cx="96" cy="143" rx="8" ry="5" fill="#ffedd5" />
        </g>
      )}
    </svg>
  );
}

// POSE 2: Teksie Tertidur Pulas Menggemaskan (Pose Tidur Karakter Foto 2)
function TeksieSleepingPose() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 160 160"
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
        <radialGradient id="tsleepFurDark" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <linearGradient id="tsleepBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
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

      {/* Bayangan Kontak Tanah Halus */}
      <ellipse cx="80" cy="154" rx="46" ry="6" fill="rgba(15, 23, 42, 0.25)" />

      {/* Telinga Musang Lemas/Santai saat Tidur */}
      <path
        d="M52 54L22 16C16 34 22 64 46 78L52 54Z"
        fill="url(#tsleepFurDark)"
      />
      <path
        d="M48 52L28 22C24 36 28 60 44 72L48 52Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M30 34L37 42" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />

      <path
        d="M108 54L138 16C144 34 138 64 114 78L108 54Z"
        fill="url(#tsleepFurDark)"
      />
      <path
        d="M112 52L132 22C136 36 132 60 116 72L112 52Z"
        fill="#f472b6"
        opacity="0.8"
      />
      <path d="M130 34L123 42" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />

      {/* Ekor Melingkar Nyaman di Samping */}
      <g className="teksie-sleep-tail">
        <path
          d="M116 114C138 106 152 120 146 138C140 152 116 150 105 138"
          fill="url(#tsleepFurBody)"
        />
        <path
          d="M134 130C144 134 142 144 134 146C126 148 120 142 124 136Z"
          fill="url(#tsleepTailTip)"
        />
      </g>

      {/* Badan Gembul Halus Tertidur */}
      <ellipse cx="80" cy="122" rx="36" ry="28" fill="url(#tsleepFurBody)" />
      <ellipse cx="80" cy="126" rx="22" ry="18" fill="url(#tsleepBelly)" />

      {/* Syal Cerdas Hijau PahamTeks */}
      <g>
        <path
          d="M52 106C62 116 98 116 108 106C112 114 104 124 80 124C56 124 48 114 52 106Z"
          fill="url(#tsleepScarf)"
        />
        <ellipse cx="80" cy="116" rx="6" ry="4" fill="#15803d" />
        <ellipse cx="80" cy="115" rx="4" ry="2.5" fill="#4ade80" />
      </g>

      {/* Kepala Bulat Agak Menunduk Tidur Nyenyak */}
      <ellipse cx="80" cy="76" rx="42" ry="36" fill="url(#tsleepFurHead)" />
      <path
        d="M58 48C70 42 90 42 102 48"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Pipi Putih Halus Gembul */}
      <path
        d="M38 80C38 98 56 106 80 106C104 106 122 98 122 80C122 72 114 68 102 72C92 76 86 80 80 80C74 80 68 76 58 72C46 68 38 72 38 80Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Pink Nyenyak */}
      <ellipse cx="48" cy="86" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />
      <ellipse cx="112" cy="86" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />

      {/* Kacamata Pintar Mengendur saat Tidur */}
      <circle cx="62" cy="72" r="16" stroke="url(#tsleepGlasses)" strokeWidth="3.5" fill="rgba(56, 189, 248, 0.12)" />
      <circle cx="98" cy="72" r="16" stroke="url(#tsleepGlasses)" strokeWidth="3.5" fill="rgba(56, 189, 248, 0.12)" />
      <path d="M78 72H82" stroke="url(#tsleepGlasses)" strokeWidth="3.5" strokeLinecap="round" />

      {/* Mata Terpejam Rileks & Senang (Happy Curved Sleeping Arches) */}
      <path d="M54 71C57 65 67 65 70 71" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M90 71C93 65 103 65 106 71" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

      {/* Hidung Hitam */}
      <polygon points="76,84 84,84 80,89" fill="#0f172a" />

      {/* Senyum Kecil Nyaman Tertidur */}
      <path d="M77 92C79 94 81 94 83 92" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />

      {/* Kaki Depan Gembul Halus di Bawah */}
      <ellipse cx="64" cy="144" rx="12" ry="8" fill="url(#tsleepFurBody)" />
      <ellipse cx="64" cy="143" rx="8" ry="5" fill="#ffedd5" />
      <ellipse cx="96" cy="144" rx="12" ry="8" fill="url(#tsleepFurBody)" />
      <ellipse cx="96" cy="143" rx="8" ry="5" fill="#ffedd5" />
    </svg>
  );
}

export default function TeksieMascotCompanion({ activeTab, currentLang }) {
  const [isSleeping, setIsSleeping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [speech, setSpeech] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Koordinat posisi kustom Teksie (tersimpan di localStorage)
  const [coords, setCoords] = useState(() => {
    try {
      const saved = localStorage.getItem('pahamteks_teksie_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[TeksieCompanion] Failed to read stored position:', err.message);
    }
    return null; // null = posisi default pojok kiri bawah
  });

  const mascotBoxRef = useRef(null);
  const idleTimerRef = useRef(null);
  const isSleepingRef = useRef(false);
  isSleepingRef.current = isSleeping;

  const dragStartRef = useRef({
    startX: 0,
    startY: 0,
    initialElemX: 0,
    initialElemY: 0,
    hasMoved: false
  });

  // Clamp posisi saat ukuran window browser berubah
  useEffect(() => {
    const handleResize = () => {
      setCoords((prev) => {
        if (!prev) return null;
        const clampedX = Math.max(10, Math.min(window.innerWidth - 115, prev.x));
        const clampedY = Math.max(10, Math.min(window.innerHeight - 125, prev.y));
        if (clampedX !== prev.x || clampedY !== prev.y) {
          return { x: clampedX, y: clampedY };
        }
        return prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Pesan kontekstual saat pengguna berpindah halaman
  useEffect(() => {
    let msg = '';
    if (activeTab === 'home') {
      msg = currentLang === 'en'
        ? 'Welcome back! Ready for a quiz?'
        : 'Halo! Siap asah otak hari ini?';
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
    if (isDragging) return; // jangan tertidur saat sedang diangkat

    const IDLE_TIME_MS = 5000; // 5 detik tanpa aktivitas pengguna

    const handleUserActivity = () => {
      // Jika Teksie sedang tertidur dan pengguna beraktivitas kembali:
      if (isSleepingRef.current) {
        setIsSleeping(false);
        const wakeMsg = currentLang === 'en'
          ? 'Yawn... ready to study again!'
          : 'Hoam... lanjut belajar lagi yuk!';
        setSpeech(wakeMsg);
        setTimeout(() => setSpeech(''), 3000);
      }

      // Reset timer idle
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        if (!isMinimized && !isDragging) {
          setIsSleeping(true);
          setSpeech('');
        }
      }, IDLE_TIME_MS);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Pasang timer idle awal
    idleTimerRef.current = setTimeout(() => {
      if (!isMinimized && !isDragging) {
        setIsSleeping(true);
      }
    }, IDLE_TIME_MS);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentLang, isMinimized, isDragging]);

  // 3. Pointer Handlers: Mengangkat Teksie dengan Menahan Klik Mouse (Hold & Drag)
  const handlePointerDown = (e) => {
    if (e.target.closest('.mascot-minimize-btn') || e.target.closest('.teksie-bubble-close')) {
      return;
    }
    if (e.button !== undefined && e.button !== 0) return; // hanya tombol kiri mouse

    const clientX = e.clientX;
    const clientY = e.clientY;

    const rect = mascotBoxRef.current
      ? mascotBoxRef.current.getBoundingClientRect()
      : { left: 28, top: window.innerHeight - 130 };

    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialElemX: rect.left,
      initialElemY: rect.top,
      hasMoved: false
    };

    setIsDragging(true);
    setIsSleeping(false); // Bangun seketika saat diangkat!

    const liftQuotes = currentLang === 'en' ? [
      'Waaa! I’m being carried!',
      'Wheee! Where are we moving?',
      'Hold on tight!',
      'Finding a cozy new spot!'
    ] : [
      'Waaa! Aku diangkat!',
      'Wheee! Mau dipindahin ke mana nih?',
      'Pegang yang erat ya!',
      'Cari spot belajar baru yang asik!'
    ];
    setSpeech(liftQuotes[Math.floor(Math.random() * liftQuotes.length)]);
  };

  useEffect(() => {
    if (!isDragging) return;

    // Geser maskot mengikuti pointer dan batasi posisinya di layar.
    const onPointerMove = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const dx = clientX - dragStartRef.current.startX;
      const dy = clientY - dragStartRef.current.startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragStartRef.current.hasMoved = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 115, dragStartRef.current.initialElemX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 125, dragStartRef.current.initialElemY + dy));

      setCoords({ x: newX, y: newY });
    };

    // Simpan posisi baru saat drag selesai.
    const onPointerUp = (e) => {
      setIsDragging(false);

      if (dragStartRef.current.hasMoved) {
        const clientX = e.clientX;
        const clientY = e.clientY;
        const dx = clientX - dragStartRef.current.startX;
        const dy = clientY - dragStartRef.current.startY;
        const finalX = Math.max(10, Math.min(window.innerWidth - 115, dragStartRef.current.initialElemX + dx));
        const finalY = Math.max(10, Math.min(window.innerHeight - 125, dragStartRef.current.initialElemY + dy));

        const finalPos = { x: finalX, y: finalY };
        setCoords(finalPos);
        try {
          localStorage.setItem('pahamteks_teksie_pos', JSON.stringify(finalPos));
        } catch (err) {
          console.warn('[TeksieCompanion] Failed to persist position:', err.message);
        }

        // Efek mendarat lembut (plop bounce)
        setIsLanding(true);
        setTimeout(() => setIsLanding(false), 500);

        const landQuotes = currentLang === 'en' ? [
          'Hap! Landed safely. Comfy spot!',
          'Nice view here! Let’s keep learning!',
          'Plop! I love this new position!'
        ] : [
          'Hap! Mendarat mulus. Nyaman di sini!',
          'Pemandangan bagus! Lanjut belajar yuk!',
          'Plop! Suka banget posisi baru ini!'
        ];
        setSpeech(landQuotes[Math.floor(Math.random() * landQuotes.length)]);
        setTimeout(() => setSpeech(''), 3500);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDragging, currentLang]);

  // 4. Klik Teksie untuk tips belajar (hanya terpicu jika tidak sedang di-drag)
  const handleMascotClick = (e) => {
    e.stopPropagation();

    if (dragStartRef.current && dragStartRef.current.hasMoved) {
      return;
    }

    // Jika sedang tidur, bangunkan terlebih dahulu
    if (isSleeping) {
      setIsSleeping(false);
    }

    const tipsId = [
      'Konsistensi 5 menit per hari lebih efektif daripada belajar 2 jam sekali seminggu!',
      'Pahami pola logika dan struktur kalimat, bukan sekadar menghafal kata!',
      'Jangan takut salah saat kuis! Dari koreksi itulah otakmu berkembang pesat.',
      'Kombinasi bahasa manusia dan bahasa koding membuat pikiranmu semakin tajam!',
      'Teksie selalu siap menemanimu belajar di PahamTeks!',
      'Tip: Tahan klik mouse untuk mengangkat dan memindahkan aku ke mana saja!',
      'Tip: Klik 2x pada Teksie untuk mengembalikanku ke pojok awal.'
    ];
    const tipsEn = [
      '5 minutes of daily practice beats 2 hours once a week!',
      'Understand sentence structures and code patterns, not just raw words!',
      'Mistakes are proof you are learning. Review the explanations!',
      'Combining world languages and code logic supercharges your mind!',
      'Teksie is always here cheering for your success!',
      'Tip: Hold mouse down to lift and move me anywhere on screen!',
      'Tip: Double-click Teksie to reset back to the cozy corner.'
    ];

    const pool = currentLang === 'en' ? tipsEn : tipsId;
    const randomTip = pool[Math.floor(Math.random() * pool.length)];
    setSpeech(randomTip);
  };

  // 5. Double Click untuk reset ke pojok kiri bawah
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setCoords(null);
    try {
      localStorage.removeItem('pahamteks_teksie_pos');
    } catch (err) {
      console.warn('[TeksieCompanion] Failed to remove stored position:', err.message);
    }
    const resetMsg = currentLang === 'en'
      ? 'Back home to my cozy corner!'
      : 'Kembali ke pojok santai kesukaanku!';
    setSpeech(resetMsg);
    setTimeout(() => setSpeech(''), 3000);
  };

  // Tentukan arah posisi balon kata secara cerdas agar tidak keluar layar
  const isNearTop = coords && coords.y < 120;
  const isNearRight = coords && coords.x > (window.innerWidth - 240);

  const bubbleStyle = {
    position: 'absolute',
    top: isNearTop ? '102px' : 'auto',
    bottom: isNearTop ? 'auto' : '96px',
    left: isNearRight ? 'auto' : '0',
    right: isNearRight ? '0' : 'auto',
    whiteSpace: 'normal',
    pointerEvents: 'auto',
    borderRadius: isNearTop
      ? (isNearRight ? '18px 4px 18px 18px' : '4px 18px 18px 18px')
      : (isNearRight ? '18px 18px 18px 4px' : '18px 18px 4px 18px')
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        className="mascot-companion-minimized"
        onClick={() => setIsMinimized(false)}
        title="Panggil Teksie si Musang Cerdas"
        style={{
          position: 'fixed',
          left: coords ? `${coords.x}px` : '24px',
          top: coords ? `${coords.y}px` : 'auto',
          bottom: coords ? 'auto' : '24px',
          zIndex: 990
        }}
      >
        <span className="minimized-label">Panggil Teksie</span>
      </button>
    );
  }

  return (
    <div
      className="teksie-interactive-world"
      style={{
        position: 'fixed',
        left: coords ? `${coords.x}px` : '28px',
        top: coords ? `${coords.y}px` : 'auto',
        bottom: coords ? 'auto' : '24px',
        zIndex: 980,
        pointerEvents: 'none'
      }}
    >
      <div
        ref={mascotBoxRef}
        className={`teksie-companion-box ${isSleeping ? 'is-sleeping' : 'is-awake'} ${isHovered ? 'is-hovered' : ''} ${isDragging ? 'is-lifted' : ''} ${isLanding ? 'is-landing' : ''}`}
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          if (isSleeping && !isDragging) {
            setIsSleeping(false);
            setSpeech(currentLang === 'en' ? 'Hmm? Did you call me?' : 'Hmm? Kamu manggil aku ya?');
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
            style={bubbleStyle}
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
              Tutup
            </button>
          </div>
        )}

        {/* Karakter Teksie: Bisa diangkat dan dipindahkan dengan menahan mouse */}
        <div
          className="teksie-figure-wrapper"
          onPointerDown={handlePointerDown}
          onClick={handleMascotClick}
          onDoubleClick={handleDoubleClick}
          title={
            isDragging
              ? (currentLang === 'en' ? 'Teksie is in your hands! Release to place.' : 'Teksie sedang diangkat! Lepaskan mouse untuk meletakkan.')
              : isSleeping
                ? (currentLang === 'en' ? 'Teksie is sleeping... (Click or lift to wake him!)' : 'Teksie sedang tidur pulas... (Klik atau tahan untuk mengangkatnya!)')
                : (currentLang === 'en' ? 'Teksie (Click for tips, hold & drag to move, double-click to reset)' : 'Teksie (Klik untuk tips, tahan mouse untuk angkat & pindahkan, klik 2x untuk kembali ke pojok)')
          }
        >
          {isSleeping && !isDragging ? (
            <TeksieSleepingPose />
          ) : (
            <TeksieSittingPortrait isHovered={isHovered} isLifted={isDragging} />
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
