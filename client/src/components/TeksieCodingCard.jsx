import React, { useEffect, useRef, useState } from 'react';
import { TeksieFox } from './MiniCharacters';

export default function TeksieCodingCard({
  greetingTitle = 'Halo!',
  greetingSubtitle = 'Aku Teksie',
  greetingDesc = 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!',
  tipsTitle = 'Tips Hari Ini',
  tipsDesc = 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.'
}) {
  const [isAsleep, setIsAsleep] = useState(false);
  const mascotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let wakeTimer;
    const sleepTimer = window.setInterval(() => {
      if (mascotRef.current?.matches(':hover, :focus-within')) return;
      setIsAsleep(true);
      window.clearTimeout(wakeTimer);
      wakeTimer = window.setTimeout(() => setIsAsleep(false), 2800);
    }, 15000);

    return () => {
      window.clearInterval(sleepTimer);
      window.clearTimeout(wakeTimer);
    };
  }, []);

  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <div
          className={`teksie-owl-wrapper${isAsleep ? ' is-dozing' : ''}`}
          ref={mascotRef}
          tabIndex={0}
          role="img"
          aria-label={isAsleep ? 'Teksie sedang tertidur sebentar di depan laptop' : 'Teksie sedang melihat laptop'}
          onMouseEnter={() => setIsAsleep(false)}
          onFocus={() => setIsAsleep(false)}
        >
          <div className="teksie-card-stage">
            <TeksieFox size={138} className="teksie-card-character" lookDirection="laptop" asleep={isAsleep} />
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
        </div>
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
