import React, { useEffect, useRef, useState } from 'react';
import { TeksieFox } from './MiniCharacters';

export default function TeksieCodingCard({
  greetingTitle = 'Halo!',
  greetingSubtitle = 'Aku Teksie',
  greetingDesc = 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!',
  tipsTitle = 'Tips Hari Ini',
  tipsDesc = 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.'
}) {
  const [sleepPhase, setSleepPhase] = useState('awake');
  const [isCheering, setIsCheering] = useState(false);
  const [message, setMessage] = useState('');
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const phraseIndex = useRef(0);
  const mascotRef = useRef(null);
  const stageRef = useRef(null);
  const messageTimer = useRef(null);
  const cheerTimer = useRef(null);
  const phaseTimer = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const sleepTimer = window.setInterval(() => {
      if (mascotRef.current?.matches(':hover, :focus-within')) return;
      setSleepPhase((phase) => phase === 'awake' ? 'falling-asleep' : phase);
      window.clearTimeout(phaseTimer.current);
      phaseTimer.current = window.setTimeout(() => {
        setSleepPhase((phase) => phase === 'falling-asleep' ? 'asleep' : phase);
      }, 850);
    }, 15000);

    return () => {
      window.clearInterval(sleepTimer);
      window.clearTimeout(messageTimer.current);
      window.clearTimeout(cheerTimer.current);
      window.clearTimeout(phaseTimer.current);
    };
  }, []);

  const wakeTeksie = () => {
    const phrases = [
      'Ayo, kita belajar bareng!',
      'Aku siap bantu kamu memilih bahasa.',
      'Klik laptopnya, lalu mulai petualangan coding!'
    ];
    const isSleeping = sleepPhase !== 'awake';
    window.clearTimeout(phaseTimer.current);
    if (isSleeping) {
      setSleepPhase('waking');
      phaseTimer.current = window.setTimeout(() => setSleepPhase('awake'), 850);
      setIsCheering(false);
    } else {
      setIsCheering(true);
      window.clearTimeout(cheerTimer.current);
      cheerTimer.current = window.setTimeout(() => setIsCheering(false), 700);
    }
    setMessage(phrases[phraseIndex.current % phrases.length]);
    phraseIndex.current += 1;
    window.clearTimeout(messageTimer.current);
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

  const isAsleep = sleepPhase === 'falling-asleep' || sleepPhase === 'asleep';

  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <button
          type="button"
          className={`teksie-owl-wrapper${sleepPhase !== 'awake' ? ` is-${sleepPhase}` : ''}${isCheering ? ' is-cheering' : ''}`}
          ref={mascotRef}
          aria-label={isAsleep ? 'Bangunkan Teksie' : 'Ajak Teksie bicara'}
          onPointerMove={followPointer}
          onPointerLeave={() => setGaze({ x: 0, y: 0 })}
          onClick={wakeTeksie}
        >
          <div className="teksie-card-stage" ref={stageRef}>
            <TeksieFox
              size={138}
              className="teksie-card-character"
              lookDirection="laptop"
              gazeX={gaze.x}
              gazeY={gaze.y}
              asleep={isAsleep}
            />
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
