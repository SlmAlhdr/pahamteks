import React from 'react';

/**
 * =================================================================
 * OFFICIAL 2D VECTOR TECH & PROGRAMMING LOGOS
 * Dibuat khusus untuk tampilan Pemilihan Bahasa Koding PahamTeks
 * =================================================================
 */

export function HtmlCssIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* HTML5 Shield Orange */}
      <path d="M4 2L6.5 27.5L16 30L25.5 27.5L28 2H4Z" fill="#E44D26" />
      <path d="M16 4V28L23.5 25.8L25.6 4H16Z" fill="#F16529" />
      {/* Number 5 Shape */}
      <path d="M9 8H23L22.5 13H13.8L14.2 17.5H22.1L21.3 23L16 24.5L10.7 23L10.4 19H7.6L8.1 25.2L16 27.5L23.9 25.2L25 10.5H9V8Z" fill="#FFFFFF" />
    </svg>
  );
}

export function JavaScriptIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, borderRadius: 4 }}>
      <rect width="32" height="32" rx="4" fill="#F7DF1E" />
      <path d="M17.5 13.5H19.8V22.2C19.8 24.5 18.5 25.5 16.2 25.5C14.3 25.5 13.2 24.5 12.8 23.3L14.8 22.1C15.1 22.8 15.6 23.4 16.3 23.4C17.2 23.4 17.6 22.9 17.6 21.8V13.5H17.5ZM24.3 13.5H26.6V20.1C26.6 22.7 25 25.5 21.5 25.5C18.8 25.5 17.4 23.8 16.9 22.4L18.9 21.3C19.3 22.2 20.1 23.4 21.5 23.4C22.6 23.4 24.3 22.6 24.3 20.8V20.7C23.7 21.5 22.7 21.9 21.5 21.9C19.2 21.9 17.7 20.2 17.7 17.7C17.7 15.1 19.3 13.5 21.5 13.5C22.8 13.5 23.7 14.1 24.3 14.9V13.5H24.3Z" fill="#000000" />
    </svg>
  );
}

export function PythonIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Top Snake Blue */}
      <path d="M15.8 2C10.5 2 10.8 4.3 10.8 4.3L10.8 6.7H16V7.5H9.1C6.9 7.5 5 9.1 5 11.4C5 13.7 6.4 15.3 8.3 15.3H10V13.3C10 10.8 12.1 8.8 14.6 8.8H19.5C21.6 8.8 23.2 7.1 23.2 5C23.2 2.9 21.1 2 15.8 2ZM13.3 3.8C13.9 3.8 14.4 4.3 14.4 4.9C14.4 5.5 13.9 6 13.3 6C12.7 6 12.2 5.5 12.2 4.9C12.2 4.3 12.7 3.8 13.3 3.8Z" fill="#3776AB" />
      {/* Bottom Snake Yellow */}
      <path d="M16.2 30C21.5 30 21.2 27.7 21.2 27.7L21.2 25.3H16V24.5H22.9C25.1 24.5 27 22.9 27 20.6C27 18.3 25.6 16.7 23.7 16.7H22V18.7C22 21.2 19.9 23.2 17.4 23.2H12.5C10.4 23.2 8.8 24.9 8.8 27C8.8 29.1 10.9 30 16.2 30ZM18.7 28.2C18.1 28.2 17.6 27.7 17.6 27.1C17.6 26.5 18.1 26 18.7 26C19.3 26 19.8 26.5 19.8 27.1C19.8 27.7 19.3 28.2 18.7 28.2Z" fill="#FFD43B" />
    </svg>
  );
}

export function PhpIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <ellipse cx="16" cy="16" rx="15" ry="9" fill="#777BB4" />
      <text x="16" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">php</text>
    </svg>
  );
}

export function RubyIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M7 11L16 4L25 11L16 28L7 11Z" fill="#CC342D" />
      <path d="M16 4L11 11H21L16 4Z" fill="#FF6B6B" />
      <path d="M7 11H11L16 28L7 11Z" fill="#991B1B" />
      <path d="M25 11H21L16 28L25 11Z" fill="#E11D48" />
    </svg>
  );
}

export function CppIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#00599C" />
      <text x="16" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900" fontFamily="sans-serif">C++</text>
    </svg>
  );
}

export function JavaIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#5382A1" />
      <path d="M12 18C12 18 13.5 21 16 21C18.5 21 20 18 20 18" stroke="#E76F00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 13C14 13 15 15 16 15C17 15 18 13 18 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function GoIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#00ADD8" />
      <text x="16" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="sans-serif">Go</text>
    </svg>
  );
}

export function SqlIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#336791" />
      <ellipse cx="16" cy="10" rx="8" ry="3" fill="#FFFFFF" opacity="0.9" />
      <path d="M8 10V16C8 17.6 11.6 19 16 19C20.4 19 24 17.6 24 16V10" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
      <path d="M8 16V22C8 23.6 11.6 25 16 25C20.4 25 24 23.6 24 22V16" stroke="#FFFFFF" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

export function DefaultCodeIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#1E293B" />
      <path d="M12 11L7 16L12 21" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 11L25 16L20 21" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17.5" y1="9" x2="14.5" y2="23" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Helper selector untuk mengambil icon berdasarkan nama bahasa/topik
 */
export function getTopicIcon(topicName, size = 26) {
  const clean = String(topicName || '').toLowerCase();
  if (clean.includes('html') || clean.includes('css')) return <HtmlCssIcon size={size} />;
  if (clean.includes('javascript') || clean.includes('typescript') || clean.includes('js') || clean.includes('ts')) return <JavaScriptIcon size={size} />;
  if (clean.includes('python')) return <PythonIcon size={size} />;
  if (clean.includes('php')) return <PhpIcon size={size} />;
  if (clean.includes('ruby')) return <RubyIcon size={size} />;
  if (clean.includes('c++') || clean.includes('c / c++')) return <CppIcon size={size} />;
  if (clean.includes('java') && !clean.includes('script')) return <JavaIcon size={size} />;
  if (clean.includes('go') || clean.includes('golang')) return <GoIcon size={size} />;
  if (clean.includes('sql') || clean.includes('database')) return <SqlIcon size={size} />;
  return <DefaultCodeIcon size={size} />;
}
