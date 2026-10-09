import React from 'react';
import { TeksieFox } from './MiniCharacters';

export default function TeksieCodingCard({
  greetingTitle = 'Halo!',
  greetingSubtitle = 'Aku Teksie',
  greetingDesc = 'Siap menemani kamu berlatih dan meningkatkan kemampuan coding!',
  tipsTitle = 'Tips Hari Ini',
  tipsDesc = 'Mulai dari bahasa yang kamu sukai, lalu jelajahi lainnya.'
}) {
  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <div className="teksie-owl-wrapper" tabIndex={0} role="img" aria-label="Teksie si musang berdiri siap menemani belajar">
          <div className="teksie-card-stage">
            <TeksieFox size={138} className="teksie-card-character" />
            <svg className="teksie-card-laptop" viewBox="0 0 100 64" aria-hidden="true">
              <path d="M30 8 H91 L80 48 H20 Z" fill="#17283b" stroke="#64748b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M33 12 H86 L77 43 H26 Z" fill="#203b50" />
              <path d="M20 47 H81 L94 53 Q96 55 91 57 H10 Q7 56 11 53 Z" fill="#0d1826" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
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
