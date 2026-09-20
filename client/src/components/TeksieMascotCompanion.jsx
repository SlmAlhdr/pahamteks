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

// POSE 1: Tampak Samping Musang 4 Kaki Semi-3D Bergaya Duolingo (Volumetric Quadruped Trot)
function TeksieQuadrupedWalk({ isWalking }) {
  return (
    <svg
      width="124"
      height="88"
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-quadruped-svg"
      style={{ filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.4))' }}
    >
      <defs>
        {/* Gradien 3D Tanah / Ambient */}
        <radialGradient id="tqFurBody" cx="42%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <radialGradient id="tqFurDark" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="70%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <radialGradient id="tqFurHead" cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ffb96a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="tqBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="tqPaws" cx="38%" cy="26%" r="68%">
          <stop offset="0%" stopColor="#ffab54" />
          <stop offset="65%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </radialGradient>
        <linearGradient id="tqGlasses" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="tqScarf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="60%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <radialGradient id="tqTailTip" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <radialGradient id="tqSnout" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="70%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fdba74" />
        </radialGradient>
      </defs>

      {/* Bayangan Kontak Tanah Halus 3D */}
      <ellipse cx="68" cy="94" rx="44" ry="5" fill="rgba(15, 23, 42, 0.28)" className="civet-ground-shadow" />

      {/* LAYER BELAKANG: Kaki Belakang Kiri & Kaki Depan Kiri (Chubby 3D Limbs with Darker Shade) */}
      <g className="leg-hind-left">
        <path
          d="M34 52C28 58 24 72 26 88C26 91 33 92 36 90C38 85 40 74 44 60C41 55 37 52 34 52Z"
          fill="url(#tqFurDark)"
        />
        <ellipse cx="30" cy="89" rx="6.5" ry="4" fill="#9a3412" />
        <ellipse cx="30" cy="88" rx="4.5" ry="2.5" fill="#fdba74" />
      </g>

      <g className="leg-front-left">
        <path
          d="M82 54C78 62 76 74 74 88C74 91 80 92 83 90C85 82 88 72 90 60C87 56 84 54 82 54Z"
          fill="url(#tqFurDark)"
        />
        <ellipse cx="78" cy="89" rx="6.5" ry="4" fill="#9a3412" />
        <ellipse cx="78" cy="88" rx="4.5" ry="2.5" fill="#fdba74" />
      </g>

      {/* Ekor Luwak/Musang Plump Melengkung Semi-3D (Chubby Fluffy Civet Tail) */}
      <g className="civet-tail-sway">
        <path
          d="M28 52C16 46 6 32 10 18C13 6 27 8 26 22C24 30 32 40 38 48C34 51 30 52 28 52Z"
          fill="url(#tqFurBody)"
        />
        <path
          d="M28 52C18 47 10 36 12 24C14 16 23 16 25 24C23 30 31 40 38 48C34 51 30 52 28 52Z"
          fill="#c2410c"
          opacity="0.3"
        />
        {/* Ujung ekor putih bulat semi-3D */}
        <path
          d="M10 18C8 10 16 6 22 11C26 16 23 24 16 22C12 21 10 20 10 18Z"
          fill="url(#tqTailTip)"
        />
        <path d="M12 14C14 9 19 8 22 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Badan Musang Gembul Semi-3D Duolingo Style (Plump Volumetric Civet Torso) */}
      <g className="civet-torso">
        <path
          d="M32 50C30 38 44 32 64 33C84 34 100 42 102 54C104 68 88 75 66 75C42 75 34 64 32 50Z"
          fill="url(#tqFurBody)"
        />
        {/* Kilau Volumetrik Clay/3D di Punggung */}
        <path
          d="M40 37C54 34 76 35 94 42C86 38 60 36 44 38C42 38 40 37 40 37Z"
          fill="#ffffff"
          opacity="0.4"
        />
        {/* Perut Krem Gembul Menggemaskan */}
        <path
          d="M42 56C52 64 74 65 92 56C88 68 70 73 54 71C45 70 41 64 42 56Z"
          fill="url(#tqBelly)"
        />
        <path
          d="M46 68C58 72 74 72 84 66C76 71 60 72 46 68Z"
          fill="#c2410c"
          opacity="0.35"
        />
      </g>

      {/* LAYER DEPAN: Kaki Belakang Kanan & Kaki Depan Kanan (Chubby Bright 3D Paws) */}
      <g className="leg-hind-right">
        <path
          d="M44 48C36 56 32 70 34 88C34 92 41 93 45 90C48 84 52 72 58 58C54 52 48 48 44 48Z"
          fill="url(#tqPaws)"
        />
        <path d="M41 54C38 62 36 74 38 82" stroke="#ffab54" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="39" cy="89" rx="7.5" ry="4.5" fill="url(#tqPaws)" />
        <ellipse cx="39" cy="88" rx="5" ry="2.8" fill="#ffedd5" />
        <circle cx="35" cy="89" r="1.5" fill="#f97316" />
        <circle cx="39" cy="90" r="1.5" fill="#f97316" />
        <circle cx="43" cy="89" r="1.5" fill="#f97316" />
      </g>

      <g className="leg-front-right">
        <path
          d="M92 50C88 58 86 70 85 88C85 92 92 93 96 90C98 82 101 70 104 58C100 53 96 50 92 50Z"
          fill="url(#tqPaws)"
        />
        <path d="M91 56C89 64 88 74 89 82" stroke="#ffab54" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="90" cy="89" rx="7.5" ry="4.5" fill="url(#tqPaws)" />
        <ellipse cx="90" cy="88" rx="5" ry="2.8" fill="#ffedd5" />
        <circle cx="86" cy="89" r="1.5" fill="#f97316" />
        <circle cx="90" cy="90" r="1.5" fill="#f97316" />
        <circle cx="94" cy="89" r="1.5" fill="#f97316" />
      </g>

      {/* Syal Hijau Zamrud PahamTeks dengan Lipatan 3D & Ujung Berkibar */}
      <g className="civet-scarf">
        <path
          d="M90 38C88 48 97 54 104 48L102 40C98 38 94 37 90 38Z"
          fill="url(#tqScarf)"
        />
        <path
          d="M92 46C86 52 82 60 84 64C86 64 90 60 94 54C96 50 95 47 92 46Z"
          fill="#16a34a"
        />
        <path
          d="M92 46C88 54 86 62 88 66C89 66 93 61 96 55Z"
          fill="#22c55e"
        />
      </g>

      {/* KEPALA MUSANG 3D & WAJAH CERIA DUOLINGO STYLE */}
      <g className="civet-head-side">
        {/* Lingkar Kepala Bulat 3D */}
        <circle cx="106" cy="36" r="21" fill="url(#tqFurHead)" />
        <path
          d="M95 24C102 18 114 18 120 25C114 21 104 21 95 24Z"
          fill="#ffffff"
          opacity="0.45"
        />

        {/* Telinga Musang Cerdas (Outer & Inner 3D) */}
        <path
          d="M96 22L88 2C84 10 88 22 96 28Z"
          fill="url(#tqFurDark)"
        />
        <path
          d="M94 20L89 6C87 11 90 20 95 24Z"
          fill="#fed7aa"
        />
        <path
          d="M104 18L108 3C114 8 114 18 110 24Z"
          fill="url(#tqFurBody)"
        />
        <path
          d="M105 17L108 7C112 11 112 17 109 21Z"
          fill="#f472b6"
          opacity="0.8"
        />

        {/* Moncong Montok ala Kartun (Plump Cartoon Snout) */}
        <path
          d="M116 33C124 33 135 37 136 41C136 46 124 49 114 47C112 42 113 36 116 33Z"
          fill="url(#tqSnout)"
        />
        {/* Rona pipi pink manis (Blush Cheek) */}
        <ellipse cx="106" cy="45" rx="6.5" ry="4" fill="#fb7185" opacity="0.65" />

        {/* Mulut Terbuka Bahagia dengan Lidah Pink (Happy Open Mouth like Duo!) */}
        <path
          d="M120 42C124 42 128 44 126 48C124 51 118 50 117 46C117 44 118 42 120 42Z"
          fill="#881337"
        />
        <path
          d="M120 45C122 45 125 46 124 48C123 49 120 49 119 47C119 46 119 45 120 45Z"
          fill="#fb7185"
        />

        {/* Hidung Hitam 3D Kancing dengan Kilau Specular */}
        <ellipse cx="134" cy="40" rx="3.2" ry="2.5" fill="#0f172a" />
        <circle cx="133.2" cy="39.2" r="0.9" fill="#ffffff" />

        {/* Kacamata Pintar Cyan Tebal & Berkilau (3D Glossy Glasses) */}
        <ellipse
          cx="114"
          cy="34"
          rx="9"
          ry="9.5"
          fill="rgba(56, 189, 248, 0.22)"
          stroke="url(#tqGlasses)"
          strokeWidth="3.2"
        />
        <path
          d="M110 28C114 26 119 28 121 31"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M105 34C101 33 98 32 96 32"
          stroke="url(#tqGlasses)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Mata Hitam Besar Berbinar Cerdas (Expressive 3D Duo Eye) */}
        <ellipse cx="115" cy="34" rx="5" ry="5.5" fill="#0f172a" />
        <circle cx="113.5" cy="32" r="2.2" fill="#ffffff" />
        <circle cx="117" cy="36.5" r="1.1" fill="#ffffff" />

        {/* Alis Ceria */}
        <path
          d="M110 23C114 21 119 23 121 25"
          stroke="#c2410c"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Kumis Musang Putih Lembut */}
        <path d="M125 41C130 42 135 44 138 46" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
        <path d="M125 43C130 46 134 49 137 53" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      </g>
    </svg>
  );
}

// POSE 2: Tampak Depan Duduk Tegak Semi-3D Bergaya Duolingo (Volumetric Portrait Sit Pose)
function TeksieSittingPortrait({ isPlaying, isHovered }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="teksie-animated-svg"
      style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))' }}
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

      {/* Kaki Belakang Duduk Manis di Lantai (Montok dengan Jari Bulat) */}
      <g>
        {/* Kaki Kiri */}
        <ellipse cx="44" cy="116" rx="14" ry="9" fill="url(#tsPaws)" />
        <ellipse cx="44" cy="115" rx="9" ry="5.5" fill="#ffedd5" />
        <circle cx="37" cy="116" r="2.2" fill="#ea580c" />
        <circle cx="44" cy="117" r="2.2" fill="#ea580c" />
        <circle cx="51" cy="116" r="2.2" fill="#ea580c" />

        {/* Kaki Kanan */}
        <ellipse cx="86" cy="116" rx="14" ry="9" fill="url(#tsPaws)" />
        <ellipse cx="86" cy="115" rx="9" ry="5.5" fill="#ffedd5" />
        <circle cx="79" cy="116" r="2.2" fill="#ea580c" />
        <circle cx="86" cy="117" r="2.2" fill="#ea580c" />
        <circle cx="93" cy="116" r="2.2" fill="#ea580c" />
      </g>

      {/* Badan Duduk Hangat Gembul (Chubby 3D Seated Torso) */}
      <ellipse cx="65" cy="94" rx="34" ry="26" fill="url(#tsFurBody)" />
      <path d="M46 80C56 75 74 75 84 80" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />

      {/* Perut Krem Bulat Montok */}
      <ellipse cx="65" cy="98" rx="22" ry="18" fill="url(#tsBelly)" />

      {/* Syal Hijau Zamrud PahamTeks dengan Simpul 3D */}
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

      {/* Pipi Putih Halus & Mengembang (Chubby White Cheeks) */}
      <path
        d="M32 58C32 76 46 84 65 84C84 84 98 76 98 58C98 50 90 46 80 49C72 52 68 55 65 55C62 55 58 52 50 49C40 46 32 50 32 58Z"
        fill="#ffffff"
      />

      {/* Rona Pipi Lucu (Soft Pink Blush) */}
      <ellipse cx="40" cy="67" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />
      <ellipse cx="90" cy="67" rx="7.5" ry="4.5" fill="#fb7185" opacity="0.6" />

      {/* Kacamata Cerdas Cyan 3D Tebal & Mengkilap */}
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

      {/* Senyum Terbuka Ceria dengan Lidah Pink (Duo Happy Open Smile) */}
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

      {/* Tangan Kanan: Melambai Menyapa / Memainkan Kursor */}
      <g className={isPlaying ? 'teksie-play-paw' : 'teksie-waving-paw'}>
        <ellipse cx="86" cy="88" rx="8.5" ry="11" fill="url(#tsPaws)" transform="rotate(25 86 88)" />
        <ellipse cx="86" cy="88" rx="5.5" ry="7" fill="#ffedd5" transform="rotate(25 86 88)" />
        <circle cx="89" cy="81" r="2.2" fill="#ea580c" />
        <circle cx="93" cy="86" r="2.2" fill="#ea580c" />
        <circle cx="85" cy="80" r="2" fill="#ea580c" />
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
