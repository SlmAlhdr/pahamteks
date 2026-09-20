import React, { useState, useEffect, useRef } from 'react';

/**
 * =================================================================
 * TEKSIE MASCOT COMPANION (TEMAN BELAJAR INTERAKTIF & INTERACTIVE PET)
 * Maskot Resmi PahamTeks: "Teksie" Si Musang Pandan/Luwak Cerdas
 * 
 * Fitur:
 * 1. Berjalan santai di area bawah layar tanpa pernah menutupi tombol Kamus Pintar.
 * 2. Saat mouse diarahkan ke Teksie (hover), dia langsung BERHENTI dan menyapa.
 * 3. Saat mouse pengguna DIAM (idle ~2.2 detik), Teksie berjalan menghampiri kursor dan memainkannya!
 * 4. Responsif dan aman (tidak menghalangi klik elemen penting web).
 * =================================================================
 */

export default function TeksieMascotCompanion({ activeTab, currentLang }) {
  const [pos, setPos] = useState({ x: 80, y: typeof window !== 'undefined' ? window.innerHeight - 95 : 500 });
  const [facing, setFacing] = useState('right'); // 'left' | 'right'
  const [isWalking, setIsWalking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingWithMouse, setIsPlayingWithMouse] = useState(false);
  const [speech, setSpeech] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const mousePosRef = useRef({ x: 200, y: 300 });
  const lastMouseMoveRef = useRef(Date.now());
  const currentPosRef = useRef({ x: 80, y: typeof window !== 'undefined' ? window.innerHeight - 95 : 500 });
  const isHoveredRef = useRef(false);
  const isPlayingRef = useRef(false);
  const roamTargetRef = useRef(null);
  const idleTimerRef = useRef(null);

  // Perbarui ref saat state berubah
  isHoveredRef.current = isHovered;
  isPlayingRef.current = isPlayingWithMouse;
  currentPosRef.current = pos;

  // 1. Pesan kontekstual saat pindah halaman
  useEffect(() => {
    let msg = '';
    if (activeTab === 'home') {
      msg = currentLang === 'en'
        ? 'Welcome! Ready for a quiz? ✨'
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

  // 2. Deteksi Pergerakan Mouse & Deteksi Mouse Diam (Idle Detection)
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveRef.current = Date.now();

      // Jika sebelumnya sedang bermain kursor, mouse bergerak kembali
      if (isPlayingRef.current) {
        setIsPlayingWithMouse(false);
        setSpeech(currentLang === 'en' ? 'Wheee! 🐾' : 'Asyik! 🐾');
        setTimeout(() => setSpeech(''), 2000);
      }

      // Reset timer idle
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        // Cek jika mouse diam selama 2.2 detik dan Teksie tidak sedang di-hover
        if (!isHoveredRef.current && !isMinimized) {
          triggerChaseMouse();
        }
      }, 2200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [currentLang, isMinimized]);

  // 3. Logika Menghampiri Kursor Mouse yang Diam
  const triggerChaseMouse = () => {
    const mouse = mousePosRef.current;
    const groundY = window.innerHeight - 95;

    // Dapatkan target dekat kursor mouse (sedikit di bawah/samping agar kursor tidak tertutup)
    let targetX = mouse.x - 35;
    let targetY = mouse.y + 12;

    // Batasi agar tidak menabrak batas layar
    targetX = Math.max(30, Math.min(window.innerWidth - 100, targetX));
    targetY = Math.max(60, Math.min(groundY, targetY));

    // ZONA TERLARANG: Tombol Kamus Pintar di kanan bawah (bottom: 60px, right: 30px, lebar ~200px)
    // Teksie tidak boleh masuk area x > window.innerWidth - 250 dan y > window.innerHeight - 140
    if (targetX > window.innerWidth - 260 && targetY > window.innerHeight - 150) {
      targetX = window.innerWidth - 270;
    }

    roamTargetRef.current = { x: targetX, y: targetY, isMouseTarget: true };
  };

  // 4. Main Game Loop (Animasi Berjalan Halus)
  useEffect(() => {
    if (isMinimized) return;

    let animId;
    let lastTime = performance.now();
    let nextRoamDecisionTime = performance.now() + 3000;

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const current = currentPosRef.current;
      const groundY = window.innerHeight - 95;

      // Jika user sedang mengarahkan mouse ke Teksie (HOVER), dia BERHENTI TOTAL
      if (isHoveredRef.current) {
        setIsWalking(false);
        animId = requestAnimationFrame(loop);
        return;
      }

      // Jika ada target berjalan (baik kursor mouse diam atau roaming santai)
      if (roamTargetRef.current) {
        const target = roamTargetRef.current;
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
          setIsWalking(true);
          const speed = target.isMouseTarget ? 180 : 90; // Lebih lincah saat menghampiri mouse
          const moveDist = Math.min(speed * dt, dist);
          const angle = Math.atan2(dy, dx);

          const nextX = current.x + Math.cos(angle) * moveDist;
          const nextY = current.y + Math.sin(angle) * moveDist;

          if (Math.abs(dx) > 2) {
            setFacing(dx > 0 ? 'right' : 'left');
          }

          setPos({ x: nextX, y: nextY });
        } else {
          // Sampai di target
          setIsWalking(false);

          if (target.isMouseTarget) {
            // Mainin mouse kursor!
            setIsPlayingWithMouse(true);
            const playfulMessages = currentLang === 'en'
              ? ['Psst! Teksie is guarding your cursor! 🐾', 'Resting your hands? Ready to learn!', 'Click me for a quick study tip! ✨']
              : ['Psst! Teksie jagain kursor kamu dulu ya! 🐾', 'Lagi mikir ya? Semangat belajarnya!', 'Klik aku yuk, nanti aku kasih tips pintar! ✨'];
            setSpeech(playfulMessages[Math.floor(Math.random() * playfulMessages.length)]);
            roamTargetRef.current = null;
          } else {
            roamTargetRef.current = null;
            nextRoamDecisionTime = time + 3000 + Math.random() * 4000;
          }
        }
      } else {
        // Jika sedang diam santai di lantai bawah
        // Jika posisinya melayang (misal habis main kursor di atas), perlahan turun kembali ke lantai
        if (Math.abs(current.y - groundY) > 8 && !isPlayingRef.current) {
          const dy = groundY - current.y;
          const nextY = current.y + Math.sign(dy) * Math.min(80 * dt, Math.abs(dy));
          setPos({ x: current.x, y: nextY });
        }

        // Tentukan jalan santai berikutnya di area bawah
        if (time > nextRoamDecisionTime && !isPlayingRef.current) {
          // Pilih posisi baru di lantai bawah (AMANKAN DARI TOMBOL KAMUS PINTAR!)
          // Kamus Pintar ada di kanan bawah (window.innerWidth - 240 ke kanan)
          const maxX = Math.max(120, window.innerWidth - 270);
          const targetX = 50 + Math.random() * (maxX - 50);
          roamTargetRef.current = { x: targetX, y: groundY, isMouseTarget: false };
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isMinimized, currentLang]);

  // Klik Teksie untuk tips acak / interaksi gembira
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
              bottom: '90px',
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

        {/* Karakter Teksie si Musang Cerdas */}
        <div
          className="teksie-figure-wrapper"
          onClick={handleMascotClick}
          title={currentLang === 'en' ? 'Teksie the Smart Civet (Hover to pause, idle to play!)' : 'Teksie si Musang Cerdas (Arahkan mouse untuk berhenti, diamkan mouse untuk dimainin!)'}
          style={{
            transform: `scaleX(${facing === 'left' ? -1 : 1})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
        >
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

            {/* Kaki Berjalan / Berlari Lincah */}
            <g className="teksie-paws-walking">
              <ellipse cx="44" cy="110" rx="9" ry="6" fill="#f97316" className="paw-front" />
              <ellipse cx="76" cy="110" rx="9" ry="6" fill="#f97316" className="paw-back" />
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

            {/* Tangan Cakar Depan: Melambai atau Memainkan Kursor */}
            <g className="teksie-play-paw">
              <ellipse cx="88" cy="74" rx="7" ry="9" fill="#fed7aa" transform="rotate(25 88 74)" />
              {/* Cakar kecil yang aktif memukul-mukul manja ke arah kursor */}
              <circle cx="92" cy="68" r="2.2" fill="#ea580c" />
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
            title="Sembunyikan Teksie ke pojok"
          >
            _
          </button>
        </div>
      </div>
    </div>
  );
}
