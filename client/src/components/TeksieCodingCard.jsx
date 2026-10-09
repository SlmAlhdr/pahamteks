import React from 'react';

// Teksie duduk di belakang laptop pada panel materi.
export function TeksieAtLaptop({ size = 130 }) {
  return (
    <svg
      className="teksie-at-laptop"
      width={size}
      height={size}
      viewBox="0 0 160 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Teksie, musang oranye yang sedang menggunakan laptop"
    >
      <defs>
        <radialGradient id="teksieDeskFur" cx="42%" cy="25%" r="78%">
          <stop offset="0%" stopColor="#ffbd70" />
          <stop offset="58%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b43a06" />
        </radialGradient>
        <linearGradient id="teksieDeskScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#263d46" />
          <stop offset="100%" stopColor="#07151b" />
        </linearGradient>
      </defs>

      <ellipse cx="80" cy="143" rx="55" ry="5" fill="#02090d" fillOpacity=".4" />

      {/* Telinga dan kepala musang. */}
      <path d="M47 49 24 7C17 34 23 59 43 72L55 61Z" fill="#c2410c" />
      <path d="m43 49-14-29c-1 20 5 35 17 44l5-7Z" fill="#fb7185" />
      <path d="m113 49 23-42c7 27 1 52-19 65l-12-11Z" fill="#c2410c" />
      <path d="m117 49 14-29c1 20-5 35-17 44l-5-7Z" fill="#fb7185" />
      <ellipse cx="80" cy="71" rx="46" ry="39" fill="url(#teksieDeskFur)" />
      <path d="M38 79c2-11 12-17 23-12 8 4 12 9 19 9s11-5 19-9c11-5 21 1 23 12-2 17-19 26-42 26S40 96 38 79Z" fill="#fff7ed" />
      <ellipse cx="47" cy="83" rx="7" ry="4" fill="#fb7185" fillOpacity=".55" />
      <ellipse cx="113" cy="83" rx="7" ry="4" fill="#fb7185" fillOpacity=".55" />

      {/* Kacamata bulat khas Teksie. */}
      <circle cx="62" cy="67" r="17" fill="#f8fafc" stroke="#18343d" strokeWidth="4" />
      <circle cx="98" cy="67" r="17" fill="#f8fafc" stroke="#18343d" strokeWidth="4" />
      <path d="M79 66h2" stroke="#18343d" strokeWidth="4" strokeLinecap="round" />
      <circle cx="63" cy="68" r="9" fill="#172b32" />
      <circle cx="99" cy="68" r="9" fill="#172b32" />
      <circle cx="60" cy="64" r="3" fill="#fff" />
      <circle cx="96" cy="64" r="3" fill="#fff" />
      <path d="m76 82 4 3 4-3" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Badan duduk dan cakar terlihat di sisi laptop. */}
      <ellipse cx="80" cy="117" rx="43" ry="25" fill="url(#teksieDeskFur)" />
      <ellipse cx="80" cy="115" rx="24" ry="19" fill="#ffedd5" />
      <ellipse cx="43" cy="119" rx="15" ry="10" fill="#ea580c" transform="rotate(-22 43 119)" />
      <ellipse cx="117" cy="119" rx="15" ry="10" fill="#ea580c" transform="rotate(22 117 119)" />
      <path d="M47 110c8 0 13 4 17 9M113 110c-8 0-13 4-17 9" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />

      {/* Laptop berada di depan badan Teksie. */}
      <path d="m42 96 76 0 9 35H33l9-35Z" fill="url(#teksieDeskScreen)" stroke="#647782" strokeWidth="2" />
      <path d="M29 131h102l-7 7H36l-7-7Z" fill="#263943" stroke="#71838b" strokeWidth="1.5" />
      <path d="M75 133h10" stroke="#a5b4bb" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M80 105c-5 5-3 12 0 14 4-3 5-9 0-14Z" fill="#fb923c" />
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
  return (
    <aside className="teksie-sidebar-card">
      <div className="teksie-companion-box">
        <div className="teksie-owl-wrapper">
          <TeksieAtLaptop size={130} />
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
