import React, { useState, useEffect, useRef } from 'react';

/**
 * =================================================================
 * TEKSIE MASCOT COMPANION (VIRTUAL PET MUSANG PANDAN 4 KAKI)
 * Maskot Resmi PahamTeks: "Teksie" Si Musang Cerdas
 * 
 * Fitur Spesial:
 * 1. Mode Berjalan: Berubah sudut pandang menjadi musang 4 kaki (Side-profile Quadruped)
 *    dengan 4 kaki yang melangkah bergantian secara realistis dan ekor mengibas.
 * 2. Mode Diam / Hover: Duduk tegak menghadap pengguna (Portrait Sit Pose) menyapa ramah.
 * 3. Algoritma Random Alami: Tidak mengejar mouse terus-menerus! Ada cooldown 35 detik
 *    dan probabilitas acak. Teksie punya rutinitas mandiri: jalan-jalan 4 kaki di lantai,
 *    duduk santai, mengendus, dan hanya sesekali penasaran mendatangi kursor.
 * 4. Berhenti seketika saat di-hover.
 * 5. Proteksi tombol Kamus Pintar (tidak pernah menutupi tombol kamus).
 * =================================================================
 */

// POSE 1: Tampak Samping Musang 4 Kaki (Side-Profile Quadruped Walk)
function TeksieQuadrupedWalk({ isWalking }) {
  return (
    <svg
      width="105"
      height="72"
      viewBox="0 0 130 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-quadruped-svg"
      style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.35))' }}
    >
      {/* Kaki Belakang Kiri (Hind Leg Left - layer belakang) */}
      <g className="leg-hind-left">
        <path d="M38 46C34 54 30 68 28 78H36C38 70 42 58 46 50Z" fill="#d97706" />
      </g>
      {/* Kaki Depan Kiri (Front Leg Left - layer belakang) */}
      <g className="leg-front-left">
        <path d="M84 48C82 56 78 68 76 78H84C86 70 88 58 90 50Z" fill="#d97706" />
      </g>

      {/* Ekor Musang Panjang Melengkung Khas Luwak/Musang Pandan */}
      <g className="civet-tail-sway">
        <path
          d="M26 44C10 38 -2 26 2 14C6 4 18 8 16 20C14 26 22 36 28 42Z"
          fill="#ea580c"
        />
        {/* Ujung Ekor Putih Khas Musang */}
        <path
          d="M3 14C2 8 9 7 13 12C15 16 9 20 4 16Z"
          fill="#ffffff"
        />
      </g>

      {/* Badan Musang Panjang Horizontal (Sleek Horizontal Civet Body) */}
      <g className="civet-torso">
        <ellipse cx="58" cy="44" rx="36" ry="18" fill="#f97316" />
        {/* Garis Punggung Khas Musang */}
        <path d="M36 34C48 30 72 30 84 36C78 33 50 33 36 34Z" fill="#c2410c" />
        {/* Perut Krem Terang */}
        <path d="M40 52C52 56 70 56 80 50C72 54 50 54 40 52Z" fill="#fed7aa" />
      </g>

      {/* Kaki Belakang Kanan (Hind Leg Right - layer depan) */}
      <g className="leg-hind-right">
        <path d="M42 46C38 56 34 68 32 78H40C43 70 47 58 52 50Z" fill="#f97316" />
        <ellipse cx="36" cy="78" rx="4" ry="2" fill="#fed7aa" />
      </g>

      {/* Kaki Depan Kanan (Front Leg Right - layer depan) */}
      <g className="leg-front-right">
        <path d="M92 48C90 56 86 68 84 78H92C94 70 96 58 98 50Z" fill="#f97316" />
        <ellipse cx="88" cy="78" rx="4" ry="2" fill="#fed7aa" />
      </g>

      {/* Syal Hijau Zamrud PahamTeks di Leher */}
      <path d="M88 34C86 44 94 48 98 42L94 36Z" fill="#58cc02" />

      {/* Kepala Musang Tampak Samping (Side-Profile Snout & Glasses) */}
      <g className="civet-head-side">
        {/* Lingkar Kepala */}
        <ellipse cx="98" cy="32" rx="16" ry="14" fill="#f97316" />
        {/* Moncong Musang Runcing Khas (Snout) */}
        <path d="M106 28L120 34L106 40Z" fill="#f97316" />
        <path d="M106 35L120 34L108 40Z" fill="#fed7aa" />
        {/* Hidung Hitam */}
        <circle cx="120" cy="34" r="2.5" fill="#0f172a" />

        {/* Telinga Musang Cerdas (Menghadap Depan Atas) */}
        <polygon points="90,22 80,4 98,16" fill="#ea580c" />
        <polygon points="90,20 84,8 96,16" fill="#fed7aa" />

        {/* Kacamata Pintar Cyan PahamTeks Tampak Samping */}
        <ellipse cx="104" cy="30" rx="6.5" ry="7" stroke="#1cb0f6" strokeWidth="2.5" fill="rgba(28, 176, 246, 0.2)" />
        <line x1="97.5" y1="29" x2="94" y2="28" stroke="#1cb0f6" strokeWidth="2" strokeLinecap="round" />

        {/* Mata Hitam Berbinar */}
        <circle cx="105" cy="30" r="3" fill="#0f172a" />
        <circle cx="104" cy="29" r="1.2" fill="#ffffff" />

        {/* Kumis Musang Halus */}
        <line x1="112" y1="36" x2="124" y2="39" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="112" y1="34" x2="125" y2="34" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// POSE 2: Tampak Depan Duduk Tegak (Portrait Sit Pose) Saat Berhenti/Menyapa
function TeksieSittingPortrait({ isPlaying, isHovered }) {
  return (
    <svg
      width="82"
      height="82"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-animated-svg"
      style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.35))' }}
    >
      {/* Ekor Mengibas di Belakang */}
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

      {/* Kaki Belakang Duduk Manis di Lantai */}
      <ellipse cx="44" cy="110" rx="10" ry="7" fill="#f97316" />
      <ellipse cx="76" cy="110" rx="10" ry="7" fill="#f97316" />

      {/* Telinga Musang Besar */}
      <polygon points="40,42 16,10 46,30" fill="#ea580c" />
      <polygon points="38,40 22,18 42,32" fill="#fed7aa" />
      <polygon points="80,42 104,10 74,30" fill="#ea580c" />
      <polygon points="82,40 98,18 78,32" fill="#fed7aa" />

      {/* Badan Duduk Hangat */}
      <ellipse cx="60" cy="90" rx="28" ry="22" fill="#f97316" />

      {/* Syal Hijau Zamrud PahamTeks */}
      <path
        d="M38 78C46 86 74 86 82 78L78 86C68 90 52 90 42 86Z"
        fill="#58cc02"
      />

      {/* Kepala Musang */}
      <circle cx="60" cy="56" r="30" fill="#f97316" />

      {/* Pola Pipi Putih Halus */}
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

      {/* Hidung Hitam & Senyum */}
      <polygon points="58,63 62,63 60,66" fill="#0f172a" />
      <path d="M56 67C58 70 62 70 64 67" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Tangan Cakar: Melambai Menyapa / Memainkan Mouse */}
      <g className={isPlaying ? 'teksie-play-paw' : 'teksie-waving-paw'}>
        <ellipse cx="88" cy="74" rx="7" ry="9" fill="#fed7aa" transform="rotate(25 88 74)" />
        {isPlaying && <circle cx="92" cy="68" r="2.5" fill="#ea580c" />}
      </g>
    </svg>
  );
}

export default function TeksieMascotCompanion({ activeTab, currentLang }) {
  const [pos, setPos] = useState({ x: 100, y: typeof window !== 'undefined' ? window.innerHeight - 95 : 500 });
  const [facing, setFacing] = useState('right'); // 'left' | 'right'
  const [isWalking, setIsWalking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingWithMouse, setIsPlayingWithMouse] = useState(false);
  const [speech, setSpeech] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const mousePosRef = useRef({ x: 200, y: 300 });
  const lastMouseMoveRef = useRef(Date.now());
  const currentPosRef = useRef({ x: 100, y: typeof window !== 'undefined' ? window.innerHeight - 95 : 500 });
  const isHoveredRef = useRef(false);
  const isPlayingRef = useRef(false);
  const roamTargetRef = useRef(null);
  const idleTimerRef = useRef(null);
  const lastMouseChaseTimeRef = useRef(0); // Cooldown agar tidak mengejar mouse terus

  isHoveredRef.current = isHovered;
  isPlayingRef.current = isPlayingWithMouse;
  currentPosRef.current = pos;

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

  // 2. Deteksi Pergerakan Mouse & Rutinitas Acak (Randomized Behavior)
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveRef.current = Date.now();

      // Jika mouse digerakkan saat sedang main kursor, Teksie mundur dan pamit santai
      if (isPlayingRef.current) {
        setIsPlayingWithMouse(false);
        setSpeech(currentLang === 'en' ? 'Wheee! 🐾' : 'Asyik! Lanjut belajar yuk! 🐾');
        setTimeout(() => setSpeech(''), 2500);
      }

      // Reset timer idle mouse
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        // PERILAKU RANDOM: Teksie TIDAK selalu mengejar mouse!
        // Syarat:
        // 1. Mouse diam > 2.5 detik
        // 2. Cooldown minimal 35 detik sejak pengejaran mouse terakhir
        // 3. Probabilitas acak 35% (tidak repetitif)
        const now = Date.now();
        const timeSinceLastChase = now - lastMouseChaseTimeRef.current;

        if (
          !isHoveredRef.current &&
          !isMinimized &&
          timeSinceLastChase > 35000 &&
          Math.random() < 0.35
        ) {
          lastMouseChaseTimeRef.current = now;
          triggerChaseMouse();
        }
      }, 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentLang, isMinimized]);

  // 3. Menghampiri Kursor Mouse Saat Teksie Sedang Penasaran
  const triggerChaseMouse = () => {
    const mouse = mousePosRef.current;
    const groundY = window.innerHeight - 95;

    let targetX = mouse.x - 40;
    let targetY = mouse.y + 10;

    targetX = Math.max(30, Math.min(window.innerWidth - 110, targetX));
    targetY = Math.max(60, Math.min(groundY, targetY));

    // PROTEKSI: Jangan pernah mendekati area tombol Kamus Pintar di kanan bawah
    if (targetX > window.innerWidth - 260 && targetY > window.innerHeight - 150) {
      targetX = window.innerWidth - 270;
    }

    roamTargetRef.current = { x: targetX, y: targetY, isMouseTarget: true };
  };

  // 4. Game Loop Animasi Berjalan 4 Kaki & Pengambilan Keputusan Acak
  useEffect(() => {
    if (isMinimized) return;

    let animId;
    let lastTime = performance.now();
    let nextDecisionTime = performance.now() + 2500;

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const current = currentPosRef.current;
      const groundY = window.innerHeight - 95;

      // JIKA MOUSE DIARAHKAN KE TEKSIE (HOVER): BERHENTI TOTAL & MENYAPA
      if (isHoveredRef.current) {
        setIsWalking(false);
        animId = requestAnimationFrame(loop);
        return;
      }

      // JIKA ADA TARGET BERJALAN (Baik jalan santai 4 kaki atau mengejar mouse)
      if (roamTargetRef.current) {
        const target = roamTargetRef.current;
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          setIsWalking(true);
          const speed = target.isMouseTarget ? 160 : 80; // Jalan santai vs lari lincah
          const moveDist = Math.min(speed * dt, dist);
          const angle = Math.atan2(dy, dx);

          const nextX = current.x + Math.cos(angle) * moveDist;
          const nextY = current.y + Math.sin(angle) * moveDist;

          if (Math.abs(dx) > 2) {
            setFacing(dx > 0 ? 'right' : 'left');
          }

          setPos({ x: nextX, y: nextY });
        } else {
          // Sampai di tujuan
          setIsWalking(false);

          if (target.isMouseTarget) {
            setIsPlayingWithMouse(true);
            const playfulMessages = currentLang === 'en'
              ? ['Psst! Teksie is guarding your cursor! 🐾', 'Resting your hands? Keep learning! ✨']
              : ['Psst! Teksie nemenin kursor kamu dulu ya! 🐾', 'Lagi mikir ya? Semangat belajarnya! ✨'];
            setSpeech(playfulMessages[Math.floor(Math.random() * playfulMessages.length)]);
            roamTargetRef.current = null;

            // Setelah 4 detik mainin kursor, otomatis kembali turun ke lantai
            setTimeout(() => {
              setIsPlayingWithMouse(false);
              const maxX = Math.max(120, window.innerWidth - 270);
              const returnX = 60 + Math.random() * (maxX - 60);
              roamTargetRef.current = { x: returnX, y: groundY, isMouseTarget: false };
            }, 4000);
          } else {
            roamTargetRef.current = null;
            // Waktu istirahat santai di tempat sebelum jalan lagi (3 - 7 detik)
            nextDecisionTime = time + 3000 + Math.random() * 4000;
          }
        }
      } else {
        // Diam santai di lantai bawah
        if (Math.abs(current.y - groundY) > 8 && !isPlayingRef.current) {
          const dy = groundY - current.y;
          const nextY = current.y + Math.sign(dy) * Math.min(90 * dt, Math.abs(dy));
          setPos({ x: current.x, y: nextY });
        }

        // Keputusan Acak Mandiri di Lantai (Roaming / Duduk Santai)
        if (time > nextDecisionTime && !isPlayingRef.current) {
          const roll = Math.random();

          if (roll < 0.6) {
            // 60% Berjalan dengan 4 kaki ke posisi baru di lantai
            const maxX = Math.max(120, window.innerWidth - 270);
            const targetX = 50 + Math.random() * (maxX - 50);
            roamTargetRef.current = { x: targetX, y: groundY, isMouseTarget: false };
          } else {
            // 40% Duduk manis / diam mengamati layar
            nextDecisionTime = time + 4000 + Math.random() * 3000;
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isMinimized, currentLang]);

  // Klik Teksie untuk tips belajar
  const handleMascotClick = (e) => {
    e.stopPropagation();
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

  // Tentukan tampilan: Jika sedang berjalan -> Tampak Samping 4 Kaki. Jika berhenti/hover -> Tampak Depan Duduk.
  const isQuadrupedMode = isWalking && !isHovered;

  return (
    <div
      className="teksie-interactive-world"
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 980,
        pointerEvents: 'none',
        transition: 'none'
      }}
    >
      <div
        className={`teksie-companion-box ${isWalking ? 'is-walking' : ''} ${isPlayingWithMouse ? 'is-playing' : ''} ${isHovered ? 'is-hovered' : ''}`}
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: facing === 'right' ? 'flex-start' : 'flex-end'
        }}
        onMouseEnter={() => {
          setIsHovered(true);
          setIsPlayingWithMouse(false);
          setSpeech(currentLang === 'en' ? 'Hi there! I paused for you 🐾' : 'Halo! Aku berhenti untukmu 🐾');
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
              bottom: '82px',
              left: facing === 'right' ? '0' : 'auto',
              right: facing === 'left' ? '0' : 'auto',
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

        {/* Karakter Teksie dengan Pergantian Point of View: 4 Kaki saat Jalan vs Duduk saat Diam */}
        <div
          className="teksie-figure-wrapper"
          onClick={handleMascotClick}
          title={currentLang === 'en' ? 'Teksie the Smart Civet' : 'Teksie si Musang Cerdas'}
          style={{
            transform: `scaleX(${facing === 'left' ? -1 : 1})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
        >
          {isQuadrupedMode ? (
            <TeksieQuadrupedWalk isWalking={isWalking} />
          ) : (
            <TeksieSittingPortrait isPlaying={isPlayingWithMouse} isHovered={isHovered} />
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
