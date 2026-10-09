import React, { useEffect, useRef, useState } from 'react';
import { TeksieFox } from './MiniCharacters';

function TeksieSleepingPose() {
  return (
    <svg className="teksie-sleeping-character" viewBox="0 0 160 160" role="img" aria-label="Teksie tidur meringkuk di samping laptop">
      <defs>
        <radialGradient id="teksieSleepFur" cx="38%" cy="28%" r="78%">
          <stop offset="0" stopColor="#ffb866" />
          <stop offset=".62" stopColor="#f97316" />
          <stop offset="1" stopColor="#a83a0a" />
        </radialGradient>
        <linearGradient id="teksieSleepBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#fbd5b5" />
        </linearGradient>
      </defs>

      <ellipse cx="82" cy="148" rx="62" ry="6" fill="#020617" fillOpacity=".34" />

      {/* Ekor melingkar di belakang tubuh saat Teksie rebah. */}
      <path d="M106 118 C126 94 151 100 151 117 C151 135 134 141 118 132 C111 128 107 123 106 118Z" fill="url(#teksieSleepFur)" />
      <path d="M137 119 C146 117 151 123 146 130 C141 136 132 133 130 128 C129 124 132 121 137 119Z" fill="#fff7ed" />

      {/* Tubuh turun ke lantai dan kepala bertumpu pada kaki depan. */}
      <ellipse cx="93" cy="123" rx="48" ry="25" fill="url(#teksieSleepFur)" />
      <ellipse cx="91" cy="130" rx="29" ry="15" fill="url(#teksieSleepBelly)" />
      <ellipse cx="79" cy="139" rx="18" ry="8" fill="#f97316" />
      <ellipse cx="78" cy="138" rx="12" ry="4" fill="#ffedd5" />

      {/* Kepala miring ke samping dengan telinga rileks. */}
      <g transform="rotate(-12 53 101)">
        <path d="M37 88 C30 75 27 65 29 61 C36 66 45 75 48 84Z" fill="#c65312" />
        <path d="M37 81 C33 73 31 68 31 66 C36 70 41 76 43 82Z" fill="#fb7185" />
        <path d="M59 84 C65 73 73 67 77 68 C77 77 72 87 66 93Z" fill="#c65312" />
        <path d="M64 84 C69 77 72 74 74 73 C72 80 68 86 64 89Z" fill="#fb7185" />
        <ellipse cx="53" cy="101" rx="29" ry="25" fill="url(#teksieSleepFur)" />
        <path d="M30 101 C34 91 44 91 53 96 C62 90 73 92 77 101 C77 113 67 121 53 121 C39 121 30 113 30 101Z" fill="#fffaf2" />
        <ellipse cx="38" cy="107" rx="5" ry="3" fill="#fb7185" fillOpacity=".55" />
        <ellipse cx="69" cy="107" rx="5" ry="3" fill="#fb7185" fillOpacity=".55" />
        <ellipse cx="44" cy="100" rx="11" ry="12" fill="#ffffff" fillOpacity=".16" stroke="#0284c7" strokeWidth="3.5" />
        <ellipse cx="63" cy="100" rx="11" ry="12" fill="#ffffff" fillOpacity=".16" stroke="#0284c7" strokeWidth="3.5" />
        <path d="M54 100 H53" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M37 101 Q44 107 51 101 M56 101 Q63 107 70 101" fill="none" stroke="#7c2d12" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M50 110 Q53 113 56 110" fill="none" stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      <g className="teksie-sleeping-marks" fill="#dbeafe" fontFamily="Nunito, sans-serif" fontWeight="900">
        <text className="teksie-sleep-z teksie-sleep-z-one" x="91" y="73" fontSize="15">z</text>
        <text className="teksie-sleep-z teksie-sleep-z-two" x="104" y="61" fontSize="11">z</text>
      </g>
    </svg>
  );
}

export default function TeksieCodingCard({
  greetingTitle = 'Halo!',
  greetingSubtitle = 'Aku Teksie',
  greetingDesc = 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!',
  tipsTitle = 'Tips Hari Ini',
  tipsDesc = 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.'
}) {
  const [isAsleep, setIsAsleep] = useState(false);
  const [isCheering, setIsCheering] = useState(false);
  const [message, setMessage] = useState('');
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const phraseIndex = useRef(0);
  const mascotRef = useRef(null);
  const stageRef = useRef(null);
  const messageTimer = useRef(null);
  const cheerTimer = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const sleepTimer = window.setInterval(() => {
      if (mascotRef.current?.matches(':hover, :focus-within')) return;
      setIsAsleep(true);
    }, 15000);

    return () => {
      window.clearInterval(sleepTimer);
      window.clearTimeout(messageTimer.current);
      window.clearTimeout(cheerTimer.current);
    };
  }, []);

  const wakeTeksie = () => {
    const phrases = [
      'Ayo, kita belajar bareng!',
      'Aku siap bantu kamu memilih bahasa.',
      'Klik laptopnya, lalu mulai petualangan coding!'
    ];
    setIsAsleep(false);
    setIsCheering(true);
    setMessage(phrases[phraseIndex.current % phrases.length]);
    phraseIndex.current += 1;
    window.clearTimeout(messageTimer.current);
    window.clearTimeout(cheerTimer.current);
    cheerTimer.current = window.setTimeout(() => setIsCheering(false), 700);
    messageTimer.current = window.setTimeout(() => setMessage(''), 3200);
  };

  const followPointer = (event) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const horizontal = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
    const vertical = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
    setGaze({
      x: Math.max(-1.5, Math.min(1.5, horizontal * 1.5)),
      y: Math.max(-1.5, Math.min(1.5, vertical * 1.5))
    });
  };

  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <button
          type="button"
          className={`teksie-owl-wrapper${isAsleep ? ' is-dozing' : ''}${isCheering ? ' is-cheering' : ''}`}
          ref={mascotRef}
          aria-label={isAsleep ? 'Bangunkan Teksie' : 'Ajak Teksie bicara'}
          onPointerMove={followPointer}
          onPointerLeave={() => setGaze({ x: 0, y: 0 })}
          onClick={wakeTeksie}
        >
          <div className="teksie-card-stage" ref={stageRef}>
            {isAsleep ? (
              <TeksieSleepingPose />
            ) : (
              <TeksieFox size={138} className="teksie-card-character" lookDirection="laptop" gazeX={gaze.x} gazeY={gaze.y} />
            )}
            <svg className="teksie-card-laptop" viewBox="0 0 100 64" aria-hidden="true">
              <defs>
                <linearGradient id="teksieScreenShade" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#294a5c" />
                  <stop offset="1" stopColor="#102031" />
                </linearGradient>
                <linearGradient id="teksieLaptopBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#344b60" />
                  <stop offset="1" stopColor="#101a28" />
                </linearGradient>
              </defs>
              <path d="M30 8 H91 L80 48 H20 Z" fill="#17283b" stroke="#64748b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M33 12 H86 L77 43 H26 Z" fill="url(#teksieScreenShade)" />
              <path d="M36 15 H75 L68 19 H34 Z" fill="#ffffff" fillOpacity=".08" />
              <path d="M20 47 H81 L94 53 Q96 55 91 57 H10 Q7 56 11 53 Z" fill="url(#teksieLaptopBody)" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
              <path d="M37 53 H63" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              <path d="M55 27 C50 31 51 39 55 41 C59 39 60 32 55 27 Z" fill="#2dd4bf" />
              <path d="M64 29 C68 32 67 38 64 40 C61 38 60 33 64 29 Z" fill="#14b8a6" />
            </svg>
          </div>
          {message && <span className="teksie-speech-bubble" role="status">{message}</span>}
        </button>
        <div className="teksie-greeting-content">
          <div className="teksie-greeting-header">
            <span className="teksie-greeting-hello">{greetingTitle}</span>
            <h4 className="teksie-greeting-name">{greetingSubtitle}</h4>
          </div>
          <p className="teksie-greeting-desc">{greetingDesc}</p>
        </div>
      </div>

      <div className="teksie-tips-box">
        <div className="teksie-tips-content">
          <h5 className="teksie-tips-title">{tipsTitle}</h5>
          <p className="teksie-tips-desc">{tipsDesc}</p>
        </div>
      </div>
    </aside>
  );
}
